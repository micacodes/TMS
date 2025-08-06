// backend/src/app.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// --- THIS IS THE FIX FOR THE RATE LIMITER ---
// This tells Express to trust the 'X-Forwarded-For' header from Netlify.
app.set('trust proxy', 1);

app.use(cors()); 
app.use(helmet()); 
app.use(express.json()); 

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

app.use('/api/auth', authLimiter, authRoutes); 
app.use('/api/tasks', taskRoutes);

app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Task Manager API! The server is running.' });
});

app.use((req, res, next) => {
  res.status(404).json({ message: 'The requested resource was not found.' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

module.exports = app;