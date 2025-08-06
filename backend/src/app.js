// Load environment variables from .env file
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Import the route handlers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

// Create the Express application instance
const app = express();

// --- Security Middleware ---
// Enable Cross-Origin Resource Sharing for your frontend
app.use(cors()); 
// Apply a suite of security-related HTTP headers
app.use(helmet()); 

// --- General Purpose Middleware ---
// Enable the express app to parse JSON payloads from request bodies
app.use(express.json()); 

// --- Rate Limiting ---
// Apply a rate limiter to authentication endpoints to prevent brute-force attacks
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});

// --- API Routes ---
// Wire up the route handlers to the main application under the /api path
app.use('/api/auth', authLimiter, authRoutes); 
app.use('/api/tasks', taskRoutes);

// --- Basic Root Route for Health Check ---
app.get('/api', (req, res) => {
  res.json({ message: 'Welcome to the Task Manager API! The server is running.' });
});

// --- Catch-all for 404 Not Found errors ---
app.use((req, res, next) => {
  res.status(404).json({ message: 'The requested resource was not found.' });
});

// --- Global Error Handler ---
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected server error occurred.' });
});

// --- EXPORT THE CONFIGURED APP ---
// This allows other files, like server.js and our Netlify function, to use this configuration.
module.exports = app;