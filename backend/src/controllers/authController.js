const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const login = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const [rows] = await pool.execute('SELECT * FROM USERS WHERE username = ?', [username]);
    
    if (rows.length === 0) {
      // Specific error message so frontend can detect "User not found"
      return res.status(401).json({ success: false, message: 'User not found', errorCode: 'USER_NOT_FOUND' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: user.user_id, username: user.username, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      data: {
        token,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  const { username, password, role = 'user' } = req.body;

  try {
    // Check if user already exists
    const [existing] = await pool.execute('SELECT * FROM USERS WHERE username = ?', [username]);
    if (existing.length > 0) {
      return res.status(400).json({ success: false, message: 'Username already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      'INSERT INTO USERS (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: { id: result.insertId, username, role }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { login, register };
