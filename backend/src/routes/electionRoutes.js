const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const {
  createElection,
  listElections,
  getElection,
  deleteElection,
} = require('../controllers/electionController');

const router = express.Router();

// Public (authenticated users can list elections)
router.get('/', protect, listElections);
router.get('/:id', protect, getElection);

// Admin only
router.post(
  '/',
  protect,
  isAdmin,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('candidates')
      .isArray({ min: 2 })
      .withMessage('At least 2 candidates required'),
    body('startTime').isISO8601().withMessage('Valid startTime is required'),
    body('deadline').isISO8601().withMessage('Valid deadline is required'),
  ],
  createElection
);

router.delete('/:id', protect, isAdmin, deleteElection);

module.exports = router;
