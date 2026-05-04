const pool = require('../config/db');
const bcrypt = require('bcrypt');
require('dotenv').config();

const seedAdmin = async () => {
  const username = 'admin';
  const password = 'admin'; // You can change this
  const role = 'admin';

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Check if table exists (optional but safe)
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS USERS (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'user'
      )
    `);

    const [rows] = await pool.execute('SELECT * FROM USERS WHERE username = ?', [username]);
    
    if (rows.length > 0) {
      console.log('Admin user already exists.');
      process.exit(0);
    }

    await pool.execute(
      'INSERT INTO USERS (username, password, role) VALUES (?, ?, ?)',
      [username, hashedPassword, role]
    );

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding admin user:', err);
    process.exit(1);
  }
};

seedAdmin();
