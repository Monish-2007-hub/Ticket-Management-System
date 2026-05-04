const pool = require('../config/db');

const getAllPasses = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM BUS_PASS');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const issuePass = async (req, res, next) => {
  const { passenger_id, issue_date, expiry_date, pass_type } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO BUS_PASS (passenger_id, issue_date, expiry_date, pass_type) VALUES (?, ?, ?, ?)',
      [passenger_id, issue_date, expiry_date, pass_type]
    );
    res.status(201).json({ success: true, data: { pass_id: result.insertId, ...req.body } });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllPasses, issuePass };
