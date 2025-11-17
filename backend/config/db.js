const mongoose = require('mongoose');

/**
 * Conectar a MongoDB
 * Usa la URI definida en .env
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB conectado: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error(`❌ Error al conectar MongoDB: ${error.message}`);
    process.exit(1); // Salir con error
  }
};

module.exports = connectDB;