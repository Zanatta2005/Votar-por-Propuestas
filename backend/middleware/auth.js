const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware: Protege rutas que requieren autenticación
 * Verifica que el token JWT sea válido
 * Uso: router.get('/ruta', protect, controller)
 */
exports.protect = async (req, res, next) => {
  let token;

  // 1. Verifica si el token existe en los headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    // Extrae el token del header "Authorization: Bearer TOKEN"
    token = req.headers.authorization.split(' ')[1];
  }

  // 2. Si no hay token, denegar acceso
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'No estás autorizado para acceder a esta ruta'
    });
  }

  try {
    // 3. Verifica que el token sea válido
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // 4. Busca el usuario en la base de datos
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // 5. Continua a la siguiente función
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token inválido o expirado'
    });
  }
};

/**
 * Middleware opcional: Obtiene el usuario si hay token, pero no requerirlo
 * Útil para rutas que cambian según si el usuario está autenticado o no
 */
exports.optionalAuth = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id);
    } catch (error) {
      // Si el token es inválido, simplemente no autenticar
      req.user = null;
    }
  }

  next();
};