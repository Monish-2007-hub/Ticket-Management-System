const pool = require('../config/db');

const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Core Counts
    const [passengers] = await pool.execute('SELECT COUNT(*) as count FROM PASSENGERS');
    const [tickets] = await pool.execute('SELECT COUNT(*) as count FROM TICKETS');
    const [routes] = await pool.execute('SELECT COUNT(*) as count FROM BUS_ROUTES');
    const [passes] = await pool.execute('SELECT COUNT(*) as count FROM BUS_PASS');

    // 2. Weekly Sales Data (Last 7 days)
    // We group by date to get daily counts
    const [weeklySales] = await pool.execute(`
      SELECT DATE_FORMAT(travel_date, '%a') as day, COUNT(*) as count 
      FROM TICKETS 
      WHERE travel_date >= DATE_SUB(CURDATE(), INTERVAL 7 DAY) 
      GROUP BY day, travel_date
      ORDER BY travel_date ASC
    `);

    // 3. Recent Activity (Mix of last 5 tickets and last 5 passes)
    const [recentTickets] = await pool.execute(`
      SELECT 'ticket' as type, ticket_id as id, passenger_id, travel_date as date 
      FROM TICKETS 
      ORDER BY ticket_id DESC LIMIT 5
    `);
    
    const [recentPasses] = await pool.execute(`
      SELECT 'pass' as type, pass_id as id, passenger_id, issue_date as date 
      FROM BUS_PASS 
      ORDER BY pass_id DESC LIMIT 5
    `);

    // Combine and sort by date descending
    const activities = [...recentTickets, ...recentPasses]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        totalPassengers: passengers[0].count,
        totalTickets: tickets[0].count,
        totalRoutes: routes[0].count,
        totalPasses: passes[0].count,
        weeklySales,
        activities
      }
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getDashboardStats };
