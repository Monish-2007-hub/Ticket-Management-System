const express = require('express');
const router = express.Router();
const { getSeatsByBusId, bookSeat } = require('../controllers/seatController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/:bus_id', authMiddleware, getSeatsByBusId);
router.put('/book', authMiddleware, bookSeat);

module.exports = router;
