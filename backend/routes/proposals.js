const express = require('express');
const router = express.Router();
const Proposal = require('../models/Proposal');
const { protect } = require('../middleware/auth');

/**
 * @route   GET /api/proposals
 * @desc    Obtener todas las propuestas (con paginación, búsqueda y filtros)
 * @access  Public
 */
router.get('/', async (req, res, next) => {
  try {
    const { page = 1, limit = 10, search, category, sort = '-createdAt' } = req.query;

    // Construir query
    const query = {};

    // Búsqueda por título o descripción
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    // Filtrar por categoría
    if (category) {
      query.category = category;
    }

    // Calcular skip para paginación
    const skip = (page - 1) * limit;

    // Obtener propuestas
    const proposals = await Proposal.find(query)
      .sort(sort)
      .limit(parseInt(limit))
      .skip(skip)
      .populate('author', 'username');

    // Contar total de propuestas
    const total = await Proposal.countDocuments(query);

    res.status(200).json({
      success: true,
      count: proposals.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      proposals
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   GET /api/proposals/:id
 * @desc    Obtener una propuesta por ID
 * @access  Public
 */
router.get('/:id', async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id)
      .populate('author', 'username email');

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    res.status(200).json({
      success: true,
      proposal
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   POST /api/proposals
 * @desc    Crear una nueva propuesta
 * @access  Private (requiere autenticación)
 */
router.post('/', protect, async (req, res, next) => {
  try {
    const { title, description, category, image } = req.body;

    // Validar campos requeridos
    if (!title || !description || !category) {
      return res.status(400).json({
        success: false,
        message: 'Por favor proporciona título, descripción y categoría'
      });
    }

    // Crear propuesta
    const proposal = await Proposal.create({
      title,
      description,
      category,
      image: image || undefined,
      author: req.user._id,
      authorUsername: req.user.username
    });

    res.status(201).json({
      success: true,
      message: 'Propuesta creada exitosamente',
      proposal
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   PUT /api/proposals/:id
 * @desc    Actualizar una propuesta
 * @access  Private (solo el autor)
 */
router.put('/:id', protect, async (req, res, next) => {
  try {
    let proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    // Verificar que el usuario sea el autor
    if (proposal.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para editar esta propuesta'
      });
    }

    // Actualizar propuesta
    const { title, description, category, image } = req.body;
    
    proposal = await Proposal.findByIdAndUpdate(
      req.params.id,
      { title, description, category, image, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Propuesta actualizada exitosamente',
      proposal
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @route   DELETE /api/proposals/:id
 * @desc    Eliminar una propuesta
 * @access  Private (solo el autor)
 */
router.delete('/:id', protect, async (req, res, next) => {
  try {
    const proposal = await Proposal.findById(req.params.id);

    if (!proposal) {
      return res.status(404).json({
        success: false,
        message: 'Propuesta no encontrada'
      });
    }

    // Verificar que el usuario sea el autor
    if (proposal.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permiso para eliminar esta propuesta'
      });
    }

    // Eliminar propuesta
    await Proposal.findByIdAndDelete(req.params.id);

    // También eliminar todos los votos asociados
    const Vote = require('../models/Vote');
    await Vote.deleteMany({ proposal: req.params.id });

    res.status(200).json({
      success: true,
      message: 'Propuesta eliminada exitosamente'
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;