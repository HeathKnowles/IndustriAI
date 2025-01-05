const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');

const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL, // Set this to your Elasticsearch HTTPS URL
  ssl: {
    rejectUnauthorized: false, // Disables certificate validation (for self-signed certificates)
    ca: fs.readFileSync(process.env.ELASTICSEARCH_CA || '../http_ca.crt'), // Optionally, provide the CA certificate file if needed
  },
  auth: {
    username: "elastic", // Elasticsearch Username
    password: "V27SI=sXzfAoTsrR1wFC", // Elasticsearch Password
  },
});

async function saveLog(logEntry) {
  try {
    await esClient.index({
      index: 'cloud-scribe-logs',
      body: logEntry,
    });
    console.log('Log saved to Elasticsearch:', logEntry);
  } catch (err) {
    console.error('Failed to save log to Elasticsearch:', err);
  }
}

module.exports = { saveLog };
