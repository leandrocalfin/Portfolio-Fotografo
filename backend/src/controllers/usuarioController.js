import crypto from 'node:crypto';

import jwt from 'jsonwebtoken';

import { Usuario } from '../models/Usuario.js';

// ==========================================
// CONFIGURACIÓN DE COOKIES
// ==========================================

/*
  Producción = frontend (Vercel) y backend (Render)
  en dominios DISTINTOS. Eso obliga a:

    sameSite: 'none'  -> permite enviar la cookie
                         en requests cross-site.
    secure: true      -> OBLIGATORIO cuando sameSite
                         es 'none' (solo HTTPS).

  En desarrollo (localhost) usamos 'lax', que es más
  estricto y no requiere HTTPS.
*/

const esProduccion =
  process.env.NODE_ENV === 'production' ||
  String(
    process.env.FRONTEND_URL || ''
  ).startsWith('https');

const opcionesCookieToken = {
  httpOnly: true,
  secure: esProduccion,
  sameSite: esProduccion ? 'none' : 'lax',
  path: '/'
};

const opcionesCookieCsrf = {
  httpOnly: false,
  secure: esProduccion,
  sameSite: esProduccion ? 'none' : 'lax',
  path: '/'
};

const DURACION_SESION_MS = 24 * 60 * 60 * 1000; // 1 día

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
        id: usuario._id,

        // Copia de la versión actual del usuario.
        // verificarToken la compara contra la BD en
        // cada request para detectar revocaciones.
        tokenVersion: usuario.tokenVersion || 0
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256'
      }
    );

    // ==========================================
    // ENVIAR COOKIES
    // ==========================================

    /*
      Cookie 1: el JWT.
      HttpOnly -> JavaScript no puede leerla.
      Inmune al robo de token por XSS.

      Cookie 2: token anti-CSRF (double submit).
      Legible por JS a propósito: el frontend debe
      copiarlo al header X-CSRF-Token. No es un secreto,
      es solo un valor que el atacante no puede LEER
      desde otro sitio por la Same-Origin Policy.
    */

    const valorCsrf =
      crypto.randomBytes(32).toString('hex');

    res.cookie('token', token, {
      ...opcionesCookieToken,
      maxAge: DURACION_SESION_MS
    });

    res.cookie('csrf_token', valorCsrf, {
      ...opcionesCookieCsrf,
      maxAge: DURACION_SESION_MS
    });

    // El token NUNCA se devuelve en el body:
    // así ningún JavaScript puede apropiarse del JWT.
    return res.status(200).json({
      mensaje: 'Inicio de sesión exitoso.'
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
// 2. CERRAR SESIÓN
// ==========================================

/*
  Con cookies HttpOnly el JavaScript del frontend
  NO puede borrar la cookie por su cuenta, así que
  el logout DEBE ser una petición al servidor.

  clearCookie necesita las mismas opciones con las
  que se creó la cookie para poder eliminarla bien.
*/

export const cerrarSesion = async (
  req,
  res
) => {
  try {
    /*
      REVOCACIÓN REAL DEL TOKEN:

      Borrar la cookie solo saca al navegador de la
      sesión, pero cualquier COPIA del JWT seguiría
      funcionando hasta expirar. Incrementando la
      versión lo matamos también del lado servidor.

      Verificación "suave": si la cookie ya está
      vencida o corrupta igual borramos las cookies
      (logout nunca debe fallar por eso).
    */

    const token =
      req.cookies?.token;

    if (
      token &&
      process.env.JWT_SECRET
    ) {
      try {
        const decodificado = jwt.verify(
          token,
          process.env.JWT_SECRET,
          { algorithms: ['HS256'] }
        );

        if (decodificado.id) {
          await Usuario.updateOne(
            { _id: decodificado.id },
            { $inc: { tokenVersion: 1 } }
          );
        }

      } catch {
        // Token inválido/vencido: no importa,
        // las cookies se borran igual abajo.
      }
    }

    res.clearCookie('token', opcionesCookieToken);

    res.clearCookie('csrf_token', opcionesCookieCsrf);

    return res.status(200).json({
      mensaje: 'Sesión cerrada con éxito.'
    });

  } catch (error) {
    console.error(
      'ERROR AL CERRAR SESIÓN:',
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

    // ==========================================
    // REVOCAR TODOS LOS TOKENS ANTERIORES
    // ==========================================

    /*
      Al incrementar la versión, todo JWT emitido
      antes de este momento queda inválido:
      sesiones robadas o abandonadas en otras
      computadoras mueren AHÍ, sin esperar
      a que expiren.

      Incluido el de ESTA sesión: por eso abajo
      re-emitimos cookies frescas con la versión nueva.
    */

    usuario.tokenVersion =
      (usuario.tokenVersion || 0) + 1;

    usuario.password = passwordNueva;

    await usuario.save();

    // ==========================================
    // RE-EMITIR SESIÓN CON LA VERSIÓN NUEVA
    // ==========================================

    const token = jwt.sign(
      {
        id: usuario._id,
        tokenVersion: usuario.tokenVersion
      },
      process.env.JWT_SECRET,
      {
        expiresIn: '1d',
        algorithm: 'HS256'
      }
    );

    const valorCsrf =
      crypto.randomBytes(32).toString('hex');

    res.cookie('token', token, {
      ...opcionesCookieToken,
      maxAge: DURACION_SESION_MS
    });

    res.cookie('csrf_token', valorCsrf, {
      ...opcionesCookieCsrf,
      maxAge: DURACION_SESION_MS
    });

    return res.status(200).json({
      mensaje:
        'Contraseña actualizada con éxito. Las demás sesiones fueron cerradas.'
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
// 4b. ACTUALIZAR FOTO DE PORTADA (HERO)
// ==========================================
export const actualizarPortada = async (
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

    usuario.fotoPortada =
      req.file.path;

    await usuario.save();

    return res.status(200).json({
      mensaje:
        'Foto de portada actualizada con éxito.',
      fotoPortada:
        usuario.fotoPortada
    });

  } catch (error) {
    console.error(
      'ERROR AL ACTUALIZAR PORTADA:',
      error
    );

    return res.status(500).json({
      mensaje:
        'Error interno del servidor.'
    });
  }
};


// ==========================================
// 5b. ACTUALIZAR TEXTO SOBRE MI
// ==========================================
/*
  Llega ya validado por sobreMiSchema
  (texto presente, entre 1 y 5000 caracteres).
*/
export const actualizarTextoSobreMi =
  async (req, res) => {
    try {
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

      usuario.textoSobreMi =
        req.body.textoSobreMi;

      await usuario.save();

      return res.status(200).json({
        mensaje:
          'Texto de Sobre Mí actualizado con éxito.',

        textoSobreMi:
          usuario.textoSobreMi
      });

    } catch (error) {
      console.error(
        'ERROR AL ACTUALIZAR SOBRE MI:',
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
            'instagram whatsapp fotoPortada textoSobreMi'
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
          usuario.whatsapp || '',

        fotoPortada:
          usuario.fotoPortada || '',

        textoSobreMi:
          usuario.textoSobreMi || ''
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