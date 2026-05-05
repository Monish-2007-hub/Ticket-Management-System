const pool = require('../config/db');

const getSeatsByBusId = async (req, res, next) => {
  const { bus_id } = req.params;
  try {
    const [rows] = await pool.execute('SELECT * FROM BUS_SEAT WHERE bus_id = ?', [bus_id]);
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const addSeat = async (req, res, next) => {
  const { bus_id, seat_number, seat_type } = req.body;
  try {
    await pool.execute(
      'INSERT INTO BUS_SEAT (bus_id, seat_number, seat_type) VALUES (?, ?, ?)',
      [bus_id, seat_number, seat_type]
    );
    res.status(201).json({ success: true, message: 'Seat added successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSeatsByBusId, addSeat };
