require('dotenv').config();
const mongoose = require('mongoose');

console.log('Intentando conectar a MongoDB...');
console.log('URI:', process.env.MONGODB_URI.replace(/:[^:]*@/, ':****@')); // Oculta password

mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ ¡Conexión exitosa a MongoDB!');
  console.log('📦 Base de datos:', mongoose.connection.name);
  console.log('🌐 Host:', mongoose.connection.host);
  console.log('\n🎉 ¡Todo listo! Presiona Ctrl+C para salir');
})
.catch((error) => {
  console.error('❌ Error al conectar:', error.message);
  process.exit(1);
});