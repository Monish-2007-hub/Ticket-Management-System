const pool = require('../config/db');

const getAllBusTypes = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM BUS_TYPES');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllBusTypes };
