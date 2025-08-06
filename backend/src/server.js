// This file is the entry point for LOCAL DEVELOPMENT ONLY.
// It imports the configured Express app and starts a Node.js server.

const app = require('./app'); // 1. Import the configured Express app from app.js

// 2. Import the database configuration. For local dev, we want to test
//    the connection as soon as the server starts.
require('./config/db'); 

// 3. Get the port from the environment variables, defaulting to 3001
const PORT = process.env.PORT || 3001;

// 4. Start the server and listen for incoming connections on the specified port
app.listen(PORT, () => {
  console.log(`Server is running for local development on port ${PORT}`);
});