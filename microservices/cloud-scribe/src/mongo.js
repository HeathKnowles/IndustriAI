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

async function initializeDatabase() {
  try {
    const database = client.db('cloud-scribe');
    const collections = await database.listCollections({ name: 'logs' }).toArray();
    if (collections.length === 0) {
      await database.createCollection('logs');
      console.log('Collection "logs" created');
    } else {
      console.log('Collection "logs" already exists');
    }

    const collection = database.collection('logs');
    const logCount = await collection.countDocuments();
    if (logCount === 0) {
      const sampleLogs = [
        { incident_id: '1', timestamp: new Date(), description: 'Sample incident 1', status: 'open', assigned_to: 'user1', severity: 'low' },
        { incident_id: '2', timestamp: new Date(), description: 'Sample incident 2', status: 'closed', assigned_to: 'user2', severity: 'high' },
        { incident_id: '3', timestamp: new Date(), description: 'Sample incident 3', status: 'in-progress', assigned_to: 'user3', severity: 'medium' }
      ];
      await collection.insertMany(sampleLogs);
      console.log('Sample logs inserted');
    } else {
      console.log('Logs already exist in the collection');
    }
  } catch (err) {
    console.error('Error initializing database:', err.message);
  }
}

initializeDatabase();