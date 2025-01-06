const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();

// Debugging connection URL
console.log('Connecting to MongoDB:', process.env.MONGODB_URL);

const client = new MongoClient(process.env.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

async function connectToMongoDB() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
  }
}

async function saveLog(logEntry) {
  try {
    const database = client.db('cloud-scribe');
    const collection = database.collection('logs');
    const response = await collection.insertOne(logEntry);
    console.log('Log saved to MongoDB:', response.insertedId); // Display response details
  } catch (err) {
    console.error('Error saving log to MongoDB:', err.message); // Show meaningful error
  }
}

async function getLogs() {
  try {
    const database = client.db('cloud-scribe');
    const collection = database.collection('logs');
    const logs = await collection.find().toArray();
    return logs;
  } catch (err) {
    console.error('Error getting logs from MongoDB:', err.message);
    return [];
  }
}

async function getLogsCategory(category) {
  try {
    const database = client.db('cloud-scribe');
    const collection = database.collection('logs');
    const logs = await collection.find({
      category
    }).toArray();
    return logs;
  }
  catch (err) {
    console.error('Error getting logs from MongoDB:', err.message);
    return [];
  }
}

connectToMongoDB();

module.exports = { saveLog, getLogs, getLogsCategory };