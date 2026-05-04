const express = require('express');
const router = express.Router();
const { getAllBuses, addBus } = require('../controllers/busController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllBuses);
router.post('/', authMiddleware, addBus);

module.exports = router;
