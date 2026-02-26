var express = require('express');
var router = express.Router();

/* GET home page. */
const mainController = require('../controllers/main');

router.get('/', mainController.index);
module.exports = router;
