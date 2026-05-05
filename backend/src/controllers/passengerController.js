const pool = require('../config/db');

const getAllPassengers = async (req, res, next) => {
  try {
    const [rows] = await pool.execute('SELECT * FROM PASSENGERS');
    res.json({ success: true, data: rows });
  } catch (err) {
    next(err);
  }
};

const addPassenger = async (req, res, next) => {
  const { first_name, last_name, date_of_birth, passenger_type, user_id } = req.body;
  try {
    const [result] = await pool.execute(
      'INSERT INTO PASSENGERS (first_name, last_name, date_of_birth, passenger_type, user_id) VALUES (?, ?, ?, ?, ?)',
      [first_name, last_name, date_of_birth, passenger_type, user_id || null]
    );
    res.status(201).json({ success: true, data: { id: result.insertId, ...req.body } });
  } catch (err) {
    next(err);
  }
};

const updatePassenger = async (req, res, next) => {
  const { id } = req.params;
  const { first_name, last_name, date_of_birth, passenger_type, user_id } = req.body;
  try {
    await pool.execute(
      'UPDATE PASSENGERS SET first_name = ?, last_name = ?, date_of_birth = ?, passenger_type = ?, user_id = ? WHERE passenger_id = ?',
      [first_name, last_name, date_of_birth, passenger_type, user_id || null, id]
    );
    res.json({ success: true, message: 'Passenger updated successfully' });
  } catch (err) {
    next(err);
  }
};

const deletePassenger = async (req, res, next) => {
  const { id } = req.params;
  try {
    await pool.execute('DELETE FROM PASSENGERS WHERE passenger_id = ?', [id]);
    res.json({ success: true, message: 'Passenger deleted successfully' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllPassengers, addPassenger, updatePassenger, deletePassenger };
