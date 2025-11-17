const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Proposal = require('../models/Proposal');
const Vote = require('../models/Vote');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/users/me
 * @desc    Obtener perfil del usuario autenticado
 * @access  Private
 */
router.get('/me', protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/users/me
 * @desc    Actualizar perfil del usuario
 * @access  Private
 */
router.put('/me', protect, async (req, res, next) => {
  try {
    const { username, email } = req.body;

    // Campos permitidos para actualizar
    const fieldsToUpdate = {};
    if (username) fieldsToUpdate.username = username;
    if (email) fieldsToUpdate.email = email;

    // Verificar si el username o email ya están en uso por otro usuario
    if (username || email) {
      const existingUser = await User.findOne({
        _id: { $ne: req.user._id },
        $or: [
          username ? { username } : {},
          email ? { email } : {}
        ]
      });

      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: existingUser.username === username 
            ? 'El username ya está en uso' 
            : 'El email ya está en uso'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      req.user._id,
      fieldsToUpdate,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Perfil actualizado exitosamente',
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
 * @route   DELETE /api/users/me
 * @desc    Eliminar cuenta del usuario
 * @access  Private
 */
router.delete('/me', protect, async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Eliminar todas las propuestas del usuario
    await Proposal.deleteMany({ author: userId });

    // Eliminar todos los votos del usuario
    await Vote.deleteMany({ user: userId });

    // Eliminar usuario
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: 'Cuenta eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/me/proposals
 * @desc    Obtener todas las propuestas del usuario autenticado
 * @access  Private
 */
router.get('/me/proposals', protect, async (req, res, next) => {
  try {
    const proposals = await Proposal.find({ author: req.user._id })
      .sort('-createdAt');

    res.status(200).json({
      success: true,
      count: proposals.length,
      proposals
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/users/me/votes
 * @desc    Obtener todas las propuestas votadas por el usuario
 * @access  Private
 */
router.get('/me/votes', protect, async (req, res, next) => {
  try {
    const votes = await Vote.find({ user: req.user._id })
      .populate('proposal')
      .sort('-createdAt');

    const votedProposals = votes.map(vote => vote.proposal);

    res.status(200).json({
      success: true,
      count: votedProposals.length,
      proposals: votedProposals
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;