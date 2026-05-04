const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    const [passengers] = await pool.execute('SELECT COUNT(*) as count FROM PASSENGERS');
    const [tickets] = await pool.execute('SELECT COUNT(*) as count FROM TICKETS');
    const [routes] = await pool.execute('SELECT COUNT(*) as count FROM BUS_ROUTES');
    const [passes] = await pool.execute('SELECT COUNT(*) as count FROM BUS_PASS');

    res.json({
      success: true,
      data: {
        totalPassengers: passengers[0].count,
        totalTickets: tickets[0].count,
        totalRoutes: routes[0].count,
        totalPasses: passes[0].count
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };
