const { Router } = require('express');
const { allowRoles } = require('../middleware/allowRoles.js');
//  allowRoles('customer')
const router = Router();

module.exports = router;
