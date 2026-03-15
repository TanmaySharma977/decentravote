const express = require('express');
const { body } = require('express-validator');
const { protect } = require('../middleware/authMiddleware');
const { castVote, getResults, getVoteStatus } = require('../controllers/voteController');

const router = express.Router();

router.post(
  '/',
  protect,
  [
    body('electionId').notEmpty().withMessage('electionId is required'),
    body('candidateOnChainId').isInt({ min: 0 }).withMessage('Valid candidateOnChainId is required'),
  ],
  castVote
);

router.get('/status/:electionId', protect, getVoteStatus);
router.get('/results/:id', protect, getResults);

module.exports = router;
