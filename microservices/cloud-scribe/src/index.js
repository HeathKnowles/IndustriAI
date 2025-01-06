const express = require('express');
const bodyParser = require('body-parser');
const { saveLog, getLogs, getLogsCategory } = require('./mongo');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors());

// HTTP POST endpoint to collect logs
app.post('/logs', async (req, res) => {
  try {
    const logEntry = req.body;

    // Validate input
    const requiredFields = ['incident_id', 'timestamp', 'description', 'status', 'assigned_to', 'severity'];
    for (const field of requiredFields) {
      if (!logEntry[field]) {
        return res.status(400).json({
          error: `Invalid log format. '${field}' is required.`,
        });
      }
    }

    // Increment incident_id
    const logs = await getLogs();
    const lastIncidentId = logs.length > 0 ? Math.max(...logs.map(log => log.incident_id)) : 0;
    logEntry.incident_id = lastIncidentId + 1;

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
const port = process.env.PORT || 3002;
app.listen(port, () => {
  console.log(`Cloud Scribe (Log Collection) running on http://localhost:${port}`);
});
