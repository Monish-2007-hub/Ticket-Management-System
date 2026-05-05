const express = require('express');
const router = express.Router();
const { getAllRoutes, addRoute } = require('../controllers/routeController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllRoutes);
router.post('/', authMiddleware, adminOnly, addRoute);

module.exports = router;
