const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

exports.register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { fullName, email, username, password } = req.body;

  try {
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // SQL query updated for PostgreSQL placeholders ($1, $2, etc.)
    const newUserQuery = 'INSERT INTO users (full_name, email, username, password_hash) VALUES ($1, $2, $3, $4) RETURNING id';
    const { rows } = await db.query(newUserQuery, [fullName, email, username, password_hash]);

    res.status(201).json({ message: 'User registered successfully', userId: rows[0].id });
  } catch (error) {
    if (error.code === '23505') { // PostgreSQL unique violation error code
      return res.status(409).json({ message: 'Email or username already exists.' });
    }
    console.error(error);
    res.status(500).json({ message: 'Server error during registration.' });
  }
};

exports.login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password } = req.body;

  try {
    // SQL query updated for PostgreSQL
    const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const user = rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials.' });
    }

    const payload = { userId: user.id, fullName: user.full_name };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, fullName: user.full_name, email: user.email }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during login.' });
  }
};

exports.logout = (req, res) => {
  res.status(200).json({ message: 'Logout successful. Please clear your token on the client.' });
};