const { Router } = require('express');
const { allowRoles } = require('../middleware/allowRoles.js');
const { auth } = require('../middleware/auth.js');
const { getPeakHours, getTableUsage } = require('../controllers/admin');

const router = Router();

router.use(auth, allowRoles('admin'));

router.get('/metrics/peak-hours', getPeakHours);
router.get('/metrics/table-usage', getTableUsage);

module.exports = router;
