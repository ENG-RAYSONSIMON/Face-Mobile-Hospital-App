const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const listPatients = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, gender, age, phone, address, diagnosis, doctor_name, created_at
     FROM patients
     ORDER BY created_at DESC`
  );

  return res.json({ success: true, data: rows });
});

const getPatientById = asyncHandler(async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, first_name, last_name, gender, age, phone, address, diagnosis, doctor_name, created_at
     FROM patients
     WHERE id = ?`,
    [req.params.id]
  );

  if (rows.length === 0) {
    return res.status(404).json({ success: false, message: 'Patient not found.' });
  }

  return res.json({ success: true, data: rows[0] });
});

const createPatient = asyncHandler(async (req, res) => {
  const { firstName, lastName, gender, age, phone, address, diagnosis, doctorName } = req.body;

  if (!firstName || !lastName || !gender || !age) {
    return res.status(400).json({
      success: false,
      message: 'firstName, lastName, gender, and age are required.',
    });
  }

  const [result] = await pool.query(
    `INSERT INTO patients (first_name, last_name, gender, age, phone, address, diagnosis, doctor_name)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [firstName, lastName, gender, age, phone || null, address || null, diagnosis || null, doctorName || null]
  );

  return res.status(201).json({
    success: true,
    message: 'Patient registered successfully.',
    data: { id: result.insertId },
  });
});

const updatePatient = asyncHandler(async (req, res) => {
  const { firstName, lastName, gender, age, phone, address, diagnosis, doctorName } = req.body;

  const [result] = await pool.query(
    `UPDATE patients
     SET first_name = ?, last_name = ?, gender = ?, age = ?, phone = ?, address = ?, diagnosis = ?, doctor_name = ?
     WHERE id = ?`,
    [firstName, lastName, gender, age, phone || null, address || null, diagnosis || null, doctorName || null, req.params.id]
  );

  if (result.affectedRows === 0) {
    return res.status(404).json({ success: false, message: 'Patient not found.' });
  }

  return res.json({ success: true, message: 'Patient updated successfully.' });
});

module.exports = {
  listPatients,
  getPatientById,
  createPatient,
  updatePatient,
};
