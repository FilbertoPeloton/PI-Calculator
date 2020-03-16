const express = require('express');
const app = express();

// Import services
const PiService = require('./services/pi.service');

// Init Services
const piService = new PiService();

// Register routes
require('./routes/pi.routes')(app, piService);

/**
 * TODO: We could spin up a cluster if we had a way to cache 
 * PI accross the cluster nodes.
 */
app.listen(process.env.PORT || 3141, () => {
  console.log(`Running on port ${process.env.PORT || 3141}`);
});
