const express = require('express');
const { protect } = require('../middleware/authMiddleware');
const { isAdmin } = require('../middleware/adminMiddleware');
const { getUsers, approveUser, rejectUser, deleteUser, getStats } = require('../controllers/adminController');

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, isAdmin);

router.get('/stats', getStats);
router.get('/users', getUsers);
router.patch('/users/:id/approve', approveUser);
router.patch('/users/:id/reject', rejectUser);
router.delete('/users/:id', deleteUser);

module.exports = router;
