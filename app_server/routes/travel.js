var express = require('express');
var router = express.Router();

/* GET home page. */
const controller = require('../controllers/travel');

router.get('/', controller.travel);
router.get('/:tripCode', controller.travelDetail);
module.exports = router;
