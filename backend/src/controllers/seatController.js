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

const bookSeat = async (req, res, next) => {
  const { bus_id, seat_number } = req.body;
  try {
    await pool.execute(
      'UPDATE BUS_SEAT SET status = "booked" WHERE bus_id = ? AND seat_number = ?',
      [bus_id, seat_number]
    );
    res.json({ success: true, message: 'Seat marked as booked' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getSeatsByBusId, bookSeat };
