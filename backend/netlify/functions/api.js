const serverless = require('serverless-http');

// This is the CRITICAL CHANGE for Netlify.
// We import the clean Express app configuration from `app.js`,
// which does NOT start a server or connect to the database on its own.
const app = require('../../src/app');

// The serverless-http library takes our Express app and converts it
// into a format that Netlify Functions can understand and execute.
// This is the bridge between our Express code and the Netlify environment.
module.exports.handler = serverless(app);