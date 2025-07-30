const rateLimit = require('express-rate-limit');
const ms = require('ms');

exports.loginLimiter = rateLimit({
  windowMs: ms(process.env.RATE_WINDOW || '10m'), // e.g., 10 minutes
  max: parseInt(process.env.RATE_MAX || '10', 10), // 10 attempts / IP
  standardHeaders: true, // → `RateLimit-*`
  legacyHeaders: false,
});
