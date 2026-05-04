const express = require('express');
const router = express.Router();
const { getAllRoutes, addRoute } = require('../controllers/routeController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllRoutes);
router.post('/', authMiddleware, addRoute);

module.exports = router;
