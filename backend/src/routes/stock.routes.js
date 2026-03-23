const express = require('express');
const auth = require('../middleware/auth');
const { listStock, addStockItem, updateStockItem } = require('../controllers/stock.controller');

const router = express.Router();

router.get('/', auth(['admin', 'doctor']), listStock);
router.post('/', auth(['admin']), addStockItem);
router.put('/:id', auth(['admin']), updateStockItem);

module.exports = router;
