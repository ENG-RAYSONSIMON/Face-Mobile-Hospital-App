const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const listStock = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, medicine_name, category, quantity, unit_price, expiry_date, updated_at
     FROM stock
     ORDER BY updated_at DESC`
  );

  return res.json({ success: true, data: rows });
});

const addStockItem = asyncHandler(async (req, res) => {
  const { medicineName, category, quantity, unitPrice, expiryDate } = req.body;

  if (!medicineName || quantity == null || unitPrice == null) {
    return res.status(400).json({
      success: false,
      message: 'medicineName, quantity, and unitPrice are required.',
    });
  }

  const [result] = await pool.query(
    `INSERT INTO stock (medicine_name, category, quantity, unit_price, expiry_date)
     VALUES (?, ?, ?, ?, ?)`,
    [medicineName, category || null, quantity, unitPrice, expiryDate || null]
  );

  return res.status(201).json({
    success: true,
    message: 'Stock item added successfully.',
    data: { id: result.insertId },
  });
});

const updateStockItem = asyncHandler(async (req, res) => {
  const { medicineName, category, quantity, unitPrice, expiryDate } = req.body;

  const [result] = await pool.query(
    `UPDATE stock
     SET medicine_name = ?, category = ?, quantity = ?, unit_price = ?, expiry_date = ?
     WHERE id = ?`,
    [medicineName, category || null, quantity, unitPrice, expiryDate || null, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: 'Stock item not found.' });
  }

  return res.json({ success: true, message: 'Stock item updated successfully.' });
});

module.exports = {
  listStock,
  addStockItem,
  updateStockItem,
};
