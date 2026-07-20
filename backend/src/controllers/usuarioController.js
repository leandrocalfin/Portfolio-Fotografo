import { Usuario } from '../models/Usuario.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// ==========================================
// REGISTRAR USUARIO (Solo se usará una vez)
// ==========================================
export const registrarUsuario = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Verificamos si el correo ya está registrado en la base de datos
    const usuarioExistente = await Usuario.findOne({ email });
    if (usuarioExistente) {
      return res.status(400).json({ mensaje: 'Este email ya está en uso.' });
    }

    // 2. La magia de Bcrypt: Encriptamos la contraseña
    const salt = await bcrypt.genSalt(10); // Generamos una "semilla" de encriptación aleatoria
    const passwordEncriptada = await bcrypt.hash(password, salt); // Trituramos la contraseña

    // 3. Creamos y guardamos el usuario con la contraseña ya ilegible
    const nuevoUsuario = new Usuario({
      email,
      password: passwordEncriptada
    });

    await nuevoUsuario.save();

    res.status(201).json({ 
      mensaje: 'Administrador registrado con éxito.',
      // Devolvemos el usuario para que lo veas en Postman, pero la contraseña ya estará encriptada
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

    // 1. Buscamos si el usuario existe
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // 2. Comparamos la contraseña de texto plano con la encriptada en la base de datos
    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(400).json({ mensaje: 'Credenciales inválidas.' });
    }

    // 3. Si todo está correcto, generamos la "pulsera VIP" (Token JWT)
    const token = jwt.sign(
      { id: usuario._id }, // Guardamos el ID del usuario dentro del token
      process.env.JWT_SECRET, // Firmamos con nuestra palabra secreta del .env
      { expiresIn: '1d' } // El token caduca en 1 día por seguridad
    );

    res.status(200).json({ 
      mensaje: 'Inicio de sesión exitoso.',
      token 
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error al iniciar sesión.' });
  }
};