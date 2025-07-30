const User = require('../models/user');
const { signToken } = require('../utils/jwt');

exports.register = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    const token = signToken({ id: user.id, role: user.role });
    res.status(201).json({ token });
  } catch (err) {
    /* Duplicate e‑mail ➜ 409 conflict */
    if (err.code === 11000) {
      err.message = 'Email already registered';
      err.statusCode = 409;
    }
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.validatePassword(password)))
      throw Object.assign(new Error('Invalid credentials'), {
        statusCode: 401,
      });

    const token = signToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
