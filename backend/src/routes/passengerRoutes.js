const express = require('express');
const router = express.Router();
const { getAllPassengers, addPassenger, updatePassenger, deletePassenger } = require('../controllers/passengerController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllPassengers);
router.post('/', authMiddleware, addPassenger);
router.put('/:id', authMiddleware, updatePassenger);
router.delete('/:id', authMiddleware, deletePassenger);

module.exports = router;
