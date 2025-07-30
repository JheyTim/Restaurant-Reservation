const { verifyToken } = require('../utils/jwt');

/**
 * Express middleware:
 *  ‣ Expects header:  Authorization: Bearer <token>
 *  ‣ Attaches decoded payload to req.user
 */

exports.auth = (req, _res, next) => {
  try {
    const header = req.headers.authorization ?? '';
    const [, token] = header.split(' ');
    if (!token) throw new Error('Token missing');

    req.user = verifyToken(token);
    next();
  } catch (err) {
    err.statusCode = 401;
    next(err);
  }
};
