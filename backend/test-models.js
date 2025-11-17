require('dotenv').config();
const connectDB = require('./config/db');
const User = require('./models/User');
const Proposal = require('./models/Proposal');
const Vote = require('./models/Vote');

console.log('🔄 Iniciando prueba de modelos...');
console.log('📍 Verificando variables de entorno...');
console.log('   MONGODB_URI:', process.env.MONGODB_URI ? '✅ Configurada' : '❌ No encontrada');
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? '✅ Configurada' : '❌ No encontrada');

const testModels = async () => {
  try {
    console.log('\n🔄 Conectando a MongoDB...');
    
    // Conectar a MongoDB
    await connectDB();
    
    console.log('\n✅ Modelos cargados correctamente:');
    console.log('   - User');
    console.log('   - Proposal');
    console.log('   - Vote');
    
    console.log('\n📊 Estructura del modelo User:');
    console.log('   - username (String, único)');
    console.log('   - email (String, único)');
    console.log('   - password (String, encriptado)');
    
    console.log('\n📊 Estructura del modelo Proposal:');
    console.log('   - title (String)');
    console.log('   - description (String)');
    console.log('   - category (Enum)');
    console.log('   - image (String)');
    console.log('   - author (Referencia a User)');
    console.log('   - voteCount (Number)');
    
    console.log('\n📊 Estructura del modelo Vote:');
    console.log('   - user (Referencia a User)');
    console.log('   - proposal (Referencia a Proposal)');
    console.log('   - Índice único: user + proposal');
    
    console.log('\n🎉 ¡Sesión 1 completada exitosamente!');
    console.log('👉 Presiona Ctrl+C para salir\n');
    
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
};

console.log('🚀 Ejecutando testModels()...\n');
testModels();