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
  const { passenger_id, route_id, bus_id, seat_number, travel_date, fare } = req.body;
  
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Check if seat is already booked
    const [seatRows] = await connection.execute(
      'SELECT status FROM BUS_SEAT WHERE bus_id = ? AND seat_number = ?',
      [bus_id, seat_number]
    );

    if (seatRows.length === 0) {
      throw new Error('Seat not found');
    }

    if (seatRows[0].status === 'booked') {
      return res.status(400).json({ success: false, message: 'Seat is already booked' });
    }

    // 2. Insert into TICKETS
    const [ticketResult] = await connection.execute(
      'INSERT INTO TICKETS (passenger_id, route_id, travel_date, fare) VALUES (?, ?, ?, ?)',
      [passenger_id, route_id, travel_date, fare]
    );

    // 3. Update BUS_SEAT status
    await connection.execute(
      'UPDATE BUS_SEAT SET status = "booked" WHERE bus_id = ? AND seat_number = ?',
      [bus_id, seat_number]
    );

    await connection.commit();
    res.status(201).json({ 
      success: true, 
      data: { ticket_id: ticketResult.insertId, ...req.body } 
    });
  } catch (err) {
    await connection.rollback();
    next(err);
  } finally {
    connection.release();
  }
};

module.exports = { getAllTickets, getTicketById, bookTicket };
