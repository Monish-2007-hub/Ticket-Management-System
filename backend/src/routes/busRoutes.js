const express = require('express');
const router = express.Router();
const { getAllBuses, addBus } = require('../controllers/busController');
const { authMiddleware, adminOnly } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllBuses);
router.post('/', authMiddleware, adminOnly, addBus);

module.exports = router;
