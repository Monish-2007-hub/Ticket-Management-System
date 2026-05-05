const pool = require('../config/db');

const getAllRoutes = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM BUS_ROUTES');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const addRoute = async (req, res, next) => {
  const { route_name, start_point, end_point, bus_type_id } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO BUS_ROUTES (route_name, start_point, end_point, bus_type_id) VALUES (?, ?, ?, ?)',
      [route_name, start_point, end_point, bus_type_id || null]
    );
    res.status(201).json({ success: true, data: { route_id: result.insertId, ...req.body } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllRoutes, addRoute };
