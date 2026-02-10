const express = require('express');
const router = express.Router();
const travlrController = require('../controllers/travlr');

/* GET home page */
router.get('/', travlrController.index);

module.exports = router;
