const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

pool.connect()
  .then(() => console.log('Successfully connected to the PostgreSQL database.'))
  .catch(err => console.error('Error connecting to the PostgreSQL database:', err));

// The 'pg' library uses parameterized queries with $1, $2, etc. to prevent SQL injection.
// We export the query function directly.
module.exports = {
  query: (text, params) => pool.query(text, params),
};