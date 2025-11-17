const express = require('express');
const router = express.Router();
const Vote = require('../models/Vote');
const Proposal = require('../models/Proposal');
const { protect } = require('../middleware/auth');

/**
 * @route   POST /api/proposals/:proposalId/vote
 * @desc    Votar por una propuesta
 * @access  Private
 */
router.post('/:proposalId/vote', protect, async (req, res, next) => {
  try {
    const { proposalId } = req.params;
    const userId = req.user._id;

    // Verificar que la propuesta existe
    const proposal = await Proposal.findById(proposalId);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    // Verificar si el usuario ya votó
    const existingVote = await Vote.findOne({
      user: userId,
      proposal: proposalId
    });

    if (existingVote) {
      return res.status(400).json({
        success: false,
        message: 'Ya has votado por esta propuesta'
      });
    }

    // Crear voto
    await Vote.create({
      user: userId,
      proposal: proposalId
    });

    // Incrementar contador de votos en la propuesta
    proposal.voteCount += 1;
    await proposal.save();

    res.status(201).json({
      success: true,
      message: 'Voto registrado exitosamente',
      voteCount: proposal.voteCount
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/proposals/:proposalId/vote
 * @desc    Quitar voto de una propuesta
 * @access  Private
 */
router.delete('/:proposalId/vote', protect, async (req, res, next) => {
  try {
    const { proposalId } = req.params;
    const userId = req.user._id;

    // Verificar que la propuesta existe
    const proposal = await Proposal.findById(proposalId);
    
    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    // Buscar el voto
    const vote = await Vote.findOne({
      user: userId,
      proposal: proposalId
    });

    if (!vote) {
      return res.status(400).json({
        success: false,
        message: 'No has votado por esta propuesta'
      });
    }

    // Eliminar voto
    await Vote.deleteOne({ _id: vote._id });

    // Decrementar contador de votos
    if (proposal.voteCount > 0) {
      proposal.voteCount -= 1;
      await proposal.save();
    }

    res.status(200).json({
      success: true,
      message: 'Voto eliminado exitosamente',
      voteCount: proposal.voteCount
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/proposals/:proposalId/votes
 * @desc    Verificar si el usuario votó por una propuesta
 * @access  Private
 */
router.get('/:proposalId/votes', protect, async (req, res, next) => {
  try {
    const { proposalId } = req.params;
    const userId = req.user._id;

    // Verificar si el usuario ya votó
    const hasVoted = await Vote.hasUserVoted(userId, proposalId);

    res.status(200).json({
      success: true,
      hasVoted
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;