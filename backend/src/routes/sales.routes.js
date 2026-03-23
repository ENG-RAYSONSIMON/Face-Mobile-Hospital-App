const express = require('express');
const auth = require('../middleware/auth');
const { listSales, createSale } = require('../controllers/sales.controller');

const router = express.Router();

router.get('/', auth(['admin', 'doctor']), listSales);
router.post('/', auth(['admin', 'doctor']), createSale);

module.exports = router;
