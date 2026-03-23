const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pool } = require('../config/db');
const asyncHandler = require('../utils/asyncHandler');

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ success: false, message: 'Username and password are required.' });
  }

  const [users] = await pool.query(
    'SELECT id, username, password_hash, role, full_name FROM users WHERE username = ? LIMIT 1',
    [username]
  );

  if (users.length === 0) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const user = users[0];
  const isPasswordValid = await bcrypt.compare(password, user.password_hash);

  if (!isPasswordValid) {
    return res.status(401).json({ success: false, message: 'Invalid credentials.' });
  }

  const token = jwt.sign(
    {
      id: user.id,
      username: user.username,
      role: user.role,
      fullName: user.full_name,
    },
    process.env.JWT_SECRET || 'change-this-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN || '12h' }
  );

  return res.json({
    success: true,
    message: 'Login successful.',
    data: {
      token,
      user: {
        id: user.id,
        username: user.username,
        role: user.role,
        fullName: user.full_name,
      },
    },
  });
});

module.exports = {
  login,
};
