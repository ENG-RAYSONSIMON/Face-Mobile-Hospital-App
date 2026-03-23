const express = require('express');
const authRoutes = require('./auth.routes');
const patientRoutes = require('./patients.routes');
const stockRoutes = require('./stock.routes');
const salesRoutes = require('./sales.routes');

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running.' });
});

router.use('/auth', authRoutes);
router.use('/patients', patientRoutes);
router.use('/stock', stockRoutes);
router.use('/sales', salesRoutes);

module.exports = router;
