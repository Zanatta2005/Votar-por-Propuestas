const mongoose = require('mongoose');

/**
 * Schema de Voto
 * Relación: Un usuario puede votar UNA VEZ por propuesta
 */
const VoteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  proposal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Proposal',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Índice compuesto único: Un usuario solo puede votar UNA VEZ por propuesta
 * Esto previene votos duplicados a nivel de base de datos
 */
VoteSchema.index({ user: 1, proposal: 1 }, { unique: true });

/**
 * Método estático: Verificar si un usuario ya votó por una propuesta
 * Uso: await Vote.hasUserVoted(userId, proposalId)
 */
VoteSchema.statics.hasUserVoted = async function(userId, proposalId) {
  const vote = await this.findOne({ user: userId, proposal: proposalId });
  return vote !== null;
};

/**
 * Método estático: Contar votos de una propuesta
 * Uso: await Vote.countVotes(proposalId)
 */
VoteSchema.statics.countVotes = async function(proposalId) {
  return await this.countDocuments({ proposal: proposalId });
};

module.exports = mongoose.model('Vote', VoteSchema);