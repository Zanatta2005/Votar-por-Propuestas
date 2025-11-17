const mongoose = require('mongoose');

/**
 * Schema de Propuesta
 * Campos: title, description, category, image, author, voteCount
 */
const ProposalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Por favor ingresa un título'],
    trim: true,
    minlength: [5, 'El título debe tener al menos 5 caracteres'],
    maxlength: [100, 'El título no puede tener más de 100 caracteres']
  },
  description: {
    type: String,
    required: [true, 'Por favor ingresa una descripción'],
    trim: true,
    minlength: [20, 'La descripción debe tener al menos 20 caracteres'],
    maxlength: [1000, 'La descripción no puede tener más de 1000 caracteres']
  },
  category: {
    type: String,
    required: [true, 'Por favor selecciona una categoría'],
    enum: [
      'Tecnología',
      'Educación',
      'Salud',
      'Medio Ambiente',
      'Transporte',
      'Gastronomía',
      'Entretenimiento',
      'Deportes',
      'Social',
      'Otros'
    ],
    default: 'Otros'
  },
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=500'
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  authorUsername: {
    type: String,
    required: true
  },
  voteCount: {
    type: Number,
    default: 0,
    min: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Middleware: Actualizar updatedAt antes de guardar
 */
ProposalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

/**
 * Índices para mejorar performance en búsquedas
 */
ProposalSchema.index({ title: 'text', description: 'text' });
ProposalSchema.index({ category: 1 });
ProposalSchema.index({ voteCount: -1 });
ProposalSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Proposal', ProposalSchema);