import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==========================================
// REGISTRAR USUARIO (Solo se usará una vez)
// ==========================================
export const registrarUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Este email ya está en uso.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordEncriptada = await bcrypt.hash(password, salt);

    const nuevoUsuario = new Usuario({
      email,
      password: passwordEncriptada
    });

    await nuevoUsuario.save();

    res.status(201).json({ 
      mensaje: 'Administrador registrado con éxito.',
      usuario: { id: nuevoUsuario._id, email: nuevoUsuario.email } 
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al registrar usuario.' });
  }
};

// ==========================================
// INICIAR SESIÓN (Generar el Token JWT)
// ==========================================
export const loginUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const passwordValida = await usuario.comprobarPassword(password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    const token = jwt.sign(
      { id: usuario._id },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    res.status(200).json({ 
      mensaje: 'Inicio de sesión exitoso.',
      token 
    });

  } catch (error) {
    console.log("💥 ERROR REAL EN LOGIN:", error); 
    res.status(500).json({ 
      mensaje: 'Error al iniciar sesión.',
      detalle: error.message 
    });
  }
};

// ==========================================
// 3. CAMBIAR CONTRASEÑA (Requiere Token)
// ==========================================
export const cambiarPassword = async (req, res) => {
  try {
    const { passwordActual, passwordNueva } = req.body;

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    const passwordCorrecta = await usuario.comprobarPassword(passwordActual);
    if (!passwordCorrecta) {
      return res.status(400).json({ mensaje: 'La contraseña actual es incorrecta.' });
    }

    usuario.password = passwordNueva;
    await usuario.save();

    res.status(200).json({ mensaje: 'Contraseña actualizada con éxito.' });

  } catch (error) {
    console.log("💥 ERROR AL CAMBIAR PASSWORD:", error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// ==========================================
// 4. OBTENER PERFIL DEL ADMINISTRADOR
// ==========================================
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }
    res.status(200).json(usuario);
  } catch (error) {
    console.log("💥 ERROR AL OBTENER PERFIL:", error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// ==========================================
// 5. ACTUALIZAR FOTO DE PERFIL (Avatar)
// ==========================================
export const actualizarAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ mensaje: 'No se ha proporcionado ninguna imagen.' });
    }

    const usuario = await Usuario.findById(req.usuario.id);
    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    usuario.avatar = req.file.path; // O la URL que devuelva tu configuración de Multer/Cloudinary
    await usuario.save();

    res.status(200).json({
      mensaje: 'Foto de perfil actualizada con éxito.',
      avatar: usuario.avatar
    });

  } catch (error) {
    console.log("💥 ERROR AL ACTUALIZAR AVATAR:", error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};

// ==========================================
// 6. ACTUALIZAR INFO DE PERFIL (WhatsApp / Instagram)
// ==========================================
export const actualizarInfoPerfil = async (req, res) => {
  try {
    const { whatsapp, instagram } = req.body;
    const usuario = await Usuario.findById(req.usuario.id);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado.' });
    }

    if (whatsapp !== undefined) usuario.whatsapp = whatsapp;
    if (instagram !== undefined) usuario.instagram = instagram;

    await usuario.save();

    res.status(200).json({
      mensaje: 'Información de perfil actualizada con éxito.',
      whatsapp: usuario.whatsapp,
      instagram: usuario.instagram
    });
  } catch (error) {
    console.log("💥 ERROR AL ACTUALIZAR INFO PERFIL:", error);
    res.status(500).json({ mensaje: 'Error interno del servidor.' });
  }
};