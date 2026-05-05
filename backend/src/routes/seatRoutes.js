const express = require('express');
const router = express.Router();
const { getSeatsByBusId, addSeat } = require('../controllers/seatController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:bus_id', authMiddleware, getSeatsByBusId);
router.post('/', authMiddleware, addSeat);

module.exports = router;
