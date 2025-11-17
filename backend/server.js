require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorHandler');

// Crear aplicación Express
const app = express();

// Conectar a MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://127.0.0.1:5500',
  credentials: true
}));
app.use(express.json()); // Para parsear JSON en el body
app.use(express.urlencoded({ extended: true })); // Para parsear form data

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: '🎉 API de Votar por Propuestas funcionando correctamente',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      proposals: '/api/proposals',
      votes: '/api/votes',
      users: '/api/users'
    }
  });
});

// Ruta de health check
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Servidor funcionando',
    timestamp: new Date().toISOString()
  });
});

// Rutas de la API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/proposals', require('./routes/proposals'));
app.use('/api/proposals', require('./routes/votes')); // Votes están bajo /proposals/:id/vote
app.use('/api/users', require('./routes/users'));

// Middleware de manejo de errores (debe ir al final)
app.use(errorHandler);

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
});

// Puerto del servidor
const PORT = process.env.PORT || 3000;

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`\n🚀 Servidor corriendo en puerto ${PORT}`);
  console.log(`📍 URL: http://localhost:${PORT}`);
  console.log(`🌍 Entorno: ${process.env.NODE_ENV || 'development'}`);
  console.log(`\n✅ Presiona Ctrl+C para detener el servidor\n`);
});

// Manejo de promesas no capturadas
process.on('unhandledRejection', (err) => {
  console.log('❌ Error no capturado:', err.message);
  server.close(() => process.exit(1));
});