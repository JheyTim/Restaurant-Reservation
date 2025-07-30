const { Router } = require('express');
const { loginLimiter } = require('../middleware/rateLimiters');
const { register, login } = require('../controllers/auth');

const router = Router();

/* -------- Register -------- */
router.post('/register', register);

/* -------- Login (rate‑limited) -------- */
router.post('/login', loginLimiter, login);

module.exports = router;
