const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Core Counts
    const [passengers] = await pool.execute('SELECT COUNT(*) as count FROM PASSENGERS');
    const [tickets] = await pool.execute('SELECT COUNT(*) as count FROM TICKETS');
    const [routes] = await pool.execute('SELECT COUNT(*) as count FROM BUS_ROUTES');
    const [passes] = await pool.execute('SELECT COUNT(*) as count FROM BUS_PASS');

    // 2. Recent Activity (Mix of last 10 tickets and last 10 passes for a fuller feed)
    const [recentTickets] = await pool.execute(`
      SELECT 'ticket' as type, ticket_id as id, passenger_id, travel_date as date 
      FROM TICKETS 
      ORDER BY ticket_id DESC LIMIT 10
    `);
    
    const [recentPasses] = await pool.execute(`
      SELECT 'pass' as type, pass_id as id, passenger_id, issue_date as date 
      FROM BUS_PASS 
      ORDER BY pass_id DESC LIMIT 10
    `);

    // Combine and sort by date descending
    const activities = [...recentTickets, ...recentPasses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 10);

    res.json({
      success: true,
      data: {
        totalPassengers: passengers[0].count,
        totalTickets: tickets[0].count,
        totalRoutes: routes[0].count,
        totalPasses: passes[0].count,
        activities
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };
