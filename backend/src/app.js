const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/passengers', require('./routes/passengerRoutes'));
app.use('/api/tickets', require('./routes/ticketRoutes'));
app.use('/api/routes', require('./routes/routeRoutes'));
app.use('/api/bus', require('./routes/busRoutes'));
app.use('/api/seats', require('./routes/seatRoutes'));
app.use('/api/pass', require('./routes/passRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

// Global Error Handler
app.use(errorHandler);

module.exports = app;
