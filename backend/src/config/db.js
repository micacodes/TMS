// backend/src/config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // --- THIS IS THE FIX FOR THE DATABASE CONNECTION ---
  // Render requires SSL connections for security, and this enables it.
  ssl: {
    rejectUnauthorized: false
  }
});

// We remove the test connection from here, as it's better handled
// inside the serverless function's lifecycle.

module.exports = {
  query: (text, params) => pool.query(text, params),
};