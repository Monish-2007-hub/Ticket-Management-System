const express = require('express');
const router = express.Router();
const { getAllBusTypes } = require('../controllers/busTypeController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllBusTypes);

module.exports = router;
