const { Client } = require('@elastic/elasticsearch');
const fs = require('fs');
const dotenv = require('dotenv');
dotenv.config();

// Debugging connection URL
console.log('Connecting to Elasticsearch:', process.env.ELASTICSEARCH_URL);

// Updated Elasticsearch Client Configuration
const esClient = new Client({
  node: process.env.ELASTICSEARCH_URL, // Ensure this URL includes protocol (http or https) and correct hostname/IP
  ssl: {
    ca: fs.readFileSync('C:/Users/dhivi/Experiments/IndustriAI/microservices/cloud-scribe/http_ca.crt'), // Path to CA certificate if needed
    rejectUnauthorized: false, // Allow self-signed certificates
  },
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || '',
  }
});

// Check if connection is successful
esClient.ping({}, { requestTimeout: 3000 }, (error) => {
  if (error) {
    console.error('Elasticsearch cluster is down!', error);
  } else {
    console.log('Elasticsearch cluster is up and running!');
  }
});

async function saveLog(logEntry) {
  try {
    const response = await esClient.index({
      index: 'cloud-scribe-logs',
      body: logEntry, // Log entry
    });
    console.log('Log saved to Elasticsearch:', response.body); // Display response details
  } catch (err) {
    console.error('Error saving log to Elasticsearch:', err.message); // Show meaningful error
    console.error(err.meta?.body || err); // Log detailed metadata for debugging
  }
}

module.exports = { saveLog };