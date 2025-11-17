const express = require('express');
const router = express.Router();
const User = require('../models/User');

/**
 * @route   POST /api/auth/register
 * @desc    Registrar un nuevo usuario
 * @access  Public
 */
router.post('/register', async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Validar que todos los campos estén presentes
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona username, email y password'
      });
    }

    // Verificar si el usuario ya existe
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: userExists.email === email 
          ? 'El email ya está registrado' 
          : 'El username ya está en uso'
      });
    }

    // Crear usuario
    const user = await User.create({
      username,
      email,
      password
    });

    // Generar token JWT
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      message: 'Usuario registrado exitosamente',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/auth/login
 * @desc    Iniciar sesión
 * @access  Public
 */
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar que email y password estén presentes
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona email y password'
      });
    }

    // Buscar usuario y incluir password (por defecto está excluido)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Verificar password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Credenciales inválidas'
      });
    }

    // Generar token JWT
    const token = user.getSignedJwtToken();

    res.status(200).json({
      success: true,
      message: 'Login exitoso',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;