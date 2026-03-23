const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const listSales = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT s.id, s.stock_id, st.medicine_name, s.quantity, s.total_price, s.sold_at, s.sold_by
     FROM drug_sales s
     LEFT JOIN stock st ON st.id = s.stock_id
     ORDER BY s.sold_at DESC`
  );

  return res.json({ success: true, data: rows });
});

const createSale = asyncHandler(async (req, res) => {
  const { stockId, quantity, soldBy } = req.body;

  if (!stockId || !quantity || quantity <= 0) {
    return res.status(400).json({
      success: false,
      message: 'stockId and a positive quantity are required.',
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [stockRows] = await connection.query(
      'SELECT id, medicine_name, quantity, unit_price FROM stock WHERE id = ? FOR UPDATE',
      [stockId]
    );

    if (stockRows.length === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Stock item not found.' });
    }

    const stock = stockRows[0];

    if (stock.quantity < quantity) {
      await connection.rollback();
      return res.status(400).json({
        success: false,
        message: `Not enough quantity in stock for ${stock.medicine_name}.`,
      });
    }

    const totalPrice = Number(stock.unit_price) * Number(quantity);

    await connection.query('UPDATE stock SET quantity = quantity - ? WHERE id = ?', [quantity, stockId]);

    const [saleResult] = await connection.query(
      `INSERT INTO drug_sales (stock_id, quantity, total_price, sold_by)
       VALUES (?, ?, ?, ?)`,
      [stockId, quantity, totalPrice, soldBy || (req.user && req.user.fullName) || null]
    );

    await connection.commit();

    return res.status(201).json({
      success: true,
      message: 'Drug sale recorded successfully.',
      data: {
        id: saleResult.insertId,
        stockId,
        quantity,
        totalPrice,
      },
    });
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
});

module.exports = {
  listSales,
  createSale,
};
