const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  // Get token from the header, typically looks like "Bearer <token>"
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Access denied. No token provided.' });
  }

  // Extract the token from "Bearer <token>"
  const token = authHeader.split(' ')[1];

  try {
    // Verify the token using the secret key from our .env file
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
    
   
    req.user = { id: decodedToken.userId };
    
   
    next();
  } catch (error) {
    // Worst case scenario if the token is invalid
    return res.status(401).json({ message: 'Invalid or expired token.' });
  }
};

module.exports = authMiddleware;