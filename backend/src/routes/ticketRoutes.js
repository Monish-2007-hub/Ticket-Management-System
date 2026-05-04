const express = require('express');
const router = express.Router();
const { getAllTickets, getTicketById, bookTicket } = require('../controllers/ticketController');
const { authMiddleware } = require('../middleware/authMiddleware');

router.get('/', authMiddleware, getAllTickets);
router.get('/:id', authMiddleware, getTicketById);
router.post('/', authMiddleware, bookTicket);

module.exports = router;
