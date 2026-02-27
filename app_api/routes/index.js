const express = require('express');
const router = express.Router();
const tripcontroller = require('../controllers/trips');

router.route('/trips').get(tripcontroller.tripsList);
router.route('/trips/:tripCode').get(tripcontroller.tripsFindByCode);
module.exports = router;