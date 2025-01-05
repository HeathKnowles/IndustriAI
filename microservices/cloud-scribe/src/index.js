require('dotenv').config();
const express = require('express');
const { createGrpcServer } = require('./grpc-service');
const logger = require('./logger');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Endpoint to receive logs via HTTP
app.post('/logs', async (req, res) => {
  const { service_name, level, message } = req.body;
  const logEntry = { service_name, level, message, timestamp: new Date().toISOString() };

  try {
    logger.sendToFluentd(logEntry);
    return res.status(200).json({ status: 'Log received and forwarded.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to process log.' });
  }
});

// Start HTTP server
app.listen(PORT, () => {
  console.log(`Cloud Scribe HTTP server running on port ${PORT}`);
});

// Start gRPC server
createGrpcServer();
