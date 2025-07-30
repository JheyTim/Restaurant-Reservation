/**
 * Usage:  router.get('/admin', auth, allowRoles('admin'), handler)
 */

exports.allowRoles =
  (...roles) =>
  (req, _res, next) => {
    if (!roles.includes(req.user.role)) {
      const err = new Error('Forbidden');
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
