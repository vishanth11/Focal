const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const companyRoutes = require('./routes/companyRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reportRoutes = require('./routes/reportRoutes');
const checkRoutes = require('./routes/checkRoutes');
const { errorHandler, notFound } = require('./middleware/errorHandler');

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));

app.get('/favicon.ico', (req, res) => {
  res.status(204).end();
});

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'OMEN backend API is running',
    endpoints: {
      health: '/health',
      companies: '/api/companies',
      admin: '/api/admin',
      reports: '/api/reports',
      check: '/api/check'
    }
  });
});

app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'OMEN backend is healthy',
    timestamp: new Date().toISOString()
  });
});

app.use('/api/companies', companyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/check', checkRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
