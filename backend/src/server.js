require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet'); 
const rateLimit = require('express-rate-limit'); 

//Importing the routes handlers
const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');

require('./config/db');

const app = express();
const PORT = process.env.PORT || 3001;

// --- Security Middleware ---
app.use(cors()); 
app.use(helmet()); 


app.use(express.json()); 

// --- Rate Limiting ---
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 10, 
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many authentication attempts from this IP, please try again after 15 minutes',
});


app.use('/api/auth', authLimiter, authRoutes); 
app.use('/api/tasks', taskRoutes);


app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Task Manager API! The server is running.' });
});

// All 404(not found errors)
app.use((req, res, next) => {
  res.status(404).json({ message: 'The requested resource was not found on this server.' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'An unexpected error occurred on the server.' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});