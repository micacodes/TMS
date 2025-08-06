const serverless = require('serverless-http');
// We import our existing, fully configured Express app
const app = require('../../src/server');

// We wrap our app with the serverless-http handler
module.exports.handler = serverless(app);