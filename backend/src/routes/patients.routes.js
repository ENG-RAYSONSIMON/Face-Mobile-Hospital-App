const express = require('express');
const auth = require('../middleware/auth');
const {
  listPatients,
  getPatientById,
  createPatient,
  updatePatient,
} = require('../controllers/patients.controller');

const router = express.Router();

router.get('/', auth(['admin', 'doctor']), listPatients);
router.get('/:id', auth(['admin', 'doctor']), getPatientById);
router.post('/', auth(['admin', 'doctor']), createPatient);
router.put('/:id', auth(['admin', 'doctor']), updatePatient);

module.exports = router;
