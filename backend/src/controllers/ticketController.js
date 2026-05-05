const pool = require('../config/db');

const getAllTickets = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM TICKETS');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const getTicketById = async (req, res, next) => {
  const { id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM TICKETS WHERE ticket_id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }
    res.json({ success: true, data: rows[0] });
  } catch (err) {
    next(err);
  }
};

const bookTicket = async (req, res, next) => {
  const { passenger_id, route_id, travel_date, fare } = req.body;
  
  try {
    const [result] = await pool.execute(
      'INSERT INTO TICKETS (passenger_id, route_id, travel_date, fare) VALUES (?, ?, ?, ?)',
      [passenger_id, route_id, travel_date, fare]
    );

    res.status(201).json({ 
      success: true, 
      data: { ticket_id: result.insertId, ...req.body } 
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllTickets, getTicketById, bookTicket };
