const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const client = require('prom-client');
const logger = require('./config/logger');
const authRoutes = require('./routes/auth');
const reservationRoutes = require('./routes/reservation');
const adminRoutes = require('./routes/admin');

const app = express();

// Core middleware
app.use(helmet());
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(',') || '*',
    credentials: true,
  })
);
app.use(express.json());

// Logging each request
app.use((req, _, next) => {
  logger.http?.(`${req.method} ${req.originalUrl}`);
  next();
});

const httpReqs = new client.Counter({
  name: 'http_requests_total',
  help: 'Total HTTP requests',
  labelNames: ['method', 'route', 'role'],
});

app.use((req, res, next) => {
  const end = res.on.bind(res, 'finish', () => {
    httpReqs.inc({
      method: req.method,
      route: req.route?.path ?? 'unknown',
      role: req.user?.role ?? 'anon',
    });
  });
  res.on('finish', end);
  next();
});

// Routers
app.use('/api/auth', authRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/admin', adminRoutes);

/* Health‑check endpoint for k8s / LB */
app.get('/health', (_, res) => res.send('OK'));

/* 404 handler */
app.use((req, res) => res.status(404).json({ message: 'Not found' }));

/* Central error handler (any thrown error lands here) */
app.use((err, req, res, _next) => {
  logger.error(err);
  const status = err.statusCode || 500;
  res.status(status).json({ message: err.message || 'Server error' });
});

module.exports = app;
