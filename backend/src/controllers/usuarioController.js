import jwt from 'jsonwebtoken';

import { Usuario } from '../models/Usuario.js';

// ==========================================
// 1. INICIAR SESIÓN
// ==========================================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const emailNormalizado = email
      .trim()
      .toLowerCase();

    // password tiene select:false en Usuario.js.
    // Solo lo pedimos explícitamente para autenticar.
    const usuario = await Usuario
      .findOne({
        email: emailNormalizado
      })
      .select('+password');

    if (!usuario) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas.'
      });
    }

    const passwordValida =
      await usuario.comprobarPassword(
        password
      );

    if (!passwordValida) {
      return res.status(401).json({
        mensaje: 'Credenciales inválidas.'
      });
    }

    if (!process.env.JWT_SECRET) {
      throw new Error(
        'JWT_SECRET no está configurado.'
      );
    }

    // ==========================================
    // GENERAR JWT
    // ==========================================

    const token = jwt.sign(
      {
        id: usuario._id
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256'
      }
    );

    // El frontend recibe el JWT y lo guarda.
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.',
      token
    });

  } catch (error) {
    console.error(
      'ERROR AL INICIAR SESIÓN:',
      error
    );

    return res.status(500).json({
      mensaje: 'Error interno del servidor.'
    });
  }
};


// ==========================================
// 2. CAMBIAR CONTRASEÑA
// ==========================================
export const cambiarPassword = async (
  req,
  res
) => {
  try {
    const {
      passwordActual,
      passwordNueva
    } = req.body;

    // Necesitamos traer el hash solamente
    // para comprobar la contraseña actual.
    const usuario = await Usuario
      .findById(req.usuario.id)
      .select('+password');

    if (!usuario) {
      return res.status(404).json({
        mensaje:
          'Usuario no encontrado.'
      });
    }

    const passwordCorrecta =
      await usuario.comprobarPassword(
        passwordActual
      );

    if (!passwordCorrecta) {
      return res.status(400).json({
        mensaje:
          'La contraseña actual es incorrecta.'
      });
    }

    if (
      passwordActual === passwordNueva
    ) {
      return res.status(400).json({
        mensaje:
          'La nueva contraseña debe ser diferente a la contraseña actual.'
      });
    }

    /*
      Usuario.js tiene un pre('save')
      que se encarga de hashear
      automáticamente la nueva contraseña.
    */
    usuario.password = passwordNueva;

    await usuario.save();

    return res.status(200).json({
      mensaje:
        'Contraseña actualizada con éxito.'
    });

  } catch (error) {
    console.error(
      'ERROR AL CAMBIAR PASSWORD:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error interno del servidor.'
    });
  }
};


// ==========================================
// 3. OBTENER PERFIL DEL ADMINISTRADOR
// ==========================================
export const obtenerPerfil = async (
  req,
  res
) => {
  try {
    /*
      password tiene select:false
      en Usuario.js, por lo que no se
      devuelve automáticamente.
    */
    const usuario =
      await Usuario.findById(
        req.usuario.id
      );

    if (!usuario) {
      return res.status(404).json({
        mensaje:
          'Usuario no encontrado.'
      });
    }

    return res
      .status(200)
      .json(usuario);

  } catch (error) {
    console.error(
      'ERROR AL OBTENER PERFIL:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error interno del servidor.'
    });
  }
};


// ==========================================
// 4. ACTUALIZAR FOTO DE PERFIL
// ==========================================
export const actualizarAvatar = async (
  req,
  res
) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        mensaje:
          'No se ha proporcionado ninguna imagen.'
      });
    }

    const usuario =
      await Usuario.findById(
        req.usuario.id
      );

    if (!usuario) {
      return res.status(404).json({
        mensaje:
          'Usuario no encontrado.'
      });
    }

    usuario.avatar =
      req.file.path;

    await usuario.save();

    return res.status(200).json({
      mensaje:
        'Foto de perfil actualizada con éxito.',
      avatar:
        usuario.avatar
    });

  } catch (error) {
    console.error(
      'ERROR AL ACTUALIZAR AVATAR:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error interno del servidor.'
    });
  }
};


// ==========================================
// 5. ACTUALIZAR WHATSAPP / INSTAGRAM
// ==========================================
export const actualizarInfoPerfil =
  async (req, res) => {
    try {
      const {
        whatsapp,
        instagram
      } = req.body;

      const usuario =
        await Usuario.findById(
          req.usuario.id
        );

      if (!usuario) {
        return res.status(404).json({
          mensaje:
            'Usuario no encontrado.'
        });
      }

      if (
        whatsapp !== undefined
      ) {
        usuario.whatsapp =
          whatsapp;
      }

      if (
        instagram !== undefined
      ) {
        usuario.instagram =
          instagram;
      }

      await usuario.save();

      return res.status(200).json({
        mensaje:
          'Información de perfil actualizada con éxito.',

        whatsapp:
          usuario.whatsapp,

        instagram:
          usuario.instagram
      });

    } catch (error) {
      console.error(
        'ERROR AL ACTUALIZAR INFO PERFIL:',
        error
      );

      return res.status(500).json({
        mensaje:
          'Error interno del servidor.'
      });
    }
  };


// ==========================================
// 6. PERFIL PÚBLICO
// ==========================================
export const obtenerPerfilPublico =
  async (req, res) => {
    try {
      const usuario =
        await Usuario
          .findOne()
          .select(
            'instagram whatsapp'
          );

      if (!usuario) {
        return res.status(404).json({
          mensaje:
            'Perfil no encontrado.'
        });
      }

      return res.status(200).json({
        instagram:
          usuario.instagram || '',

        whatsapp:
          usuario.whatsapp || ''
      });

    } catch (error) {
      console.error(
        'ERROR AL OBTENER PERFIL PÚBLICO:',
        error
      );

      return res.status(500).json({
        mensaje:
          'Error interno del servidor.'
      });
    }
  };