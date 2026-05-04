const pool = require('../config/db');

const getAllBuses = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM BUS');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const addBus = async (req, res, next) => {
  const { bus_number, bus_type_id, route_id, capacity, status } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO BUS (bus_number, bus_type_id, route_id, capacity, status) VALUES (?, ?, ?, ?, ?)',
      [bus_number, bus_type_id, route_id, capacity, status]
    );
    res.status(201).json({ success: true, data: { bus_id: result.insertId, ...req.body } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBuses, addBus };
