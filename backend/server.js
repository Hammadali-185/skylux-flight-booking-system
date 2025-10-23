const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
require('dotenv').config();

// Import routes
const bookingRoutes = require('./routes/bookingRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'SkyLux Airlines API is running',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Booking routes
app.use('/api/booking', bookingRoutes);

// Flight search endpoint (placeholder)
app.post('/api/flights/search', (req, res) => {
  const { from, to, departDate, returnDate, passengers, class: flightClass } = req.body;
  
  // This would typically query a flight database
  const mockFlights = [
    {
      id: 'SL001',
      airline: 'SkyLux Airlines',
      from: from || 'New York',
      to: to || 'London',
      departTime: '08:00',
      arrivalTime: '20:00',
      duration: '7h 00m',
      price: 2499,
      class: flightClass || 'Business',
      aircraft: 'Boeing 787-9',
      amenities: ['Premium Lounge', 'Gourmet Dining', 'Lie-flat Seats', 'WiFi']
    },
    {
      id: 'SL002',
      airline: 'SkyLux Airlines',
      from: from || 'New York',
      to: to || 'London',
      departTime: '14:30',
      arrivalTime: '02:30+1',
      duration: '7h 00m',
      price: 2799,
      class: flightClass || 'Business',
      aircraft: 'Airbus A350',
      amenities: ['Premium Lounge', 'Gourmet Dining', 'Private Suites', 'WiFi']
    }
  ];

  res.json({
    success: true,
    searchParams: { from, to, departDate, returnDate, passengers, class: flightClass },
    flights: mockFlights,
    totalResults: mockFlights.length
  });
});

// Newsletter signup endpoint
app.post('/api/newsletter/subscribe', (req, res) => {
  const { email } = req.body;
  
  if (!email || !email.includes('@')) {
    return res.status(400).json({
      success: false,
      message: 'Valid email address is required'
    });
  }

  // This would typically save to a database
  console.log(`Newsletter subscription: ${email}`);
  
  res.json({
    success: true,
    message: 'Successfully subscribed to newsletter',
    email
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

app.listen(PORT, () => {
  console.log(`🛫 SkyLux Airlines API server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📡 Health check: http://localhost:${PORT}/api/health`);
});
