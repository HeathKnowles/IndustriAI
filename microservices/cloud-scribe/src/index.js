const express = require('express');
const bodyParser = require('body-parser');
const { saveLog, getLogs, getLogsCategory } = require('./mongo');
const dotenv = require('dotenv');
dotenv.config();

const app = express();

// Middleware
app.use(bodyParser.json());

// HTTP POST endpoint to collect logs
app.post('/logs', async (req, res) => {
  try {
    const logEntry = req.body;

    // Validate input
    if (!logEntry.service_name || !logEntry.level || !logEntry.message) {
      return res.status(400).json({
        error: "Invalid log format. 'service_name', 'level', and 'message' are required.",
      });
    }

    // Add timestamp if missing
    logEntry.timestamp = logEntry.timestamp || new Date().toISOString();

    console.log('Received log:', logEntry);

    // Save log entry to Elasticsearch
    await saveLog(logEntry);

    res.json({ status: 'Log received and forwarded to Elasticsearch' });
  } catch (err) {
    console.error('Failed to process log:', err);
    res.status(500).json({ error: 'Failed to process log' });
  }
});

app.get('/logs', (req, res) => {
  getLogs()
    .then((logs) => {
      res.json(logs);
    })
    .catch((err) => {
      console.error('Error getting logs:', err);
      res.status(500).json({ error: 'Failed to get logs' });
    });
});

app.get('/logs/:category', (req, res) => {
  const category = req.params.category;
  getLogsCategory(category)
    .then((logs) => {
      res.json(logs);
    })
    .catch((err) => {
      console.error('Error getting logs:', err);
      res.status(500).json({ error: 'Failed to get logs' });
    });
});

// Start the HTTP server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Cloud Scribe (Log Collection) running on http://localhost:${port}`);
});
