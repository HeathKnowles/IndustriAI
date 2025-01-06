const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
dotenv.config();
const cors = require('cors');

const app = express();
const port = 3003;
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'access_decisions';
const collectionName = 'logs';

app.use(express.json());
app.use(cors());

const client = new MongoClient(mongoUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        const database = client.db(dbName);
        const collection = database.collection(collectionName);

        // Check if the collection is empty
        const count = await collection.countDocuments();
        if (count === 0) {
            console.log('Collection is empty, inserting sample data');
            await insertSampleData(collection);
        }
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

async function insertSampleData(collection) {
    const sampleData = [
        { timestamp: new Date(), status: 'ALLOWED', message: 'Sample allowed event' },
        { timestamp: new Date(), status: 'DENIED', message: 'Sample denied event' },
    ];
    await collection.insertMany(sampleData);
    console.log('Sample data inserted');
}

connectToMongoDB();

app.get('/accesses', async (req, res) => {
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const logs = await collection.find({}).toArray();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving logs', error });
    }
});

app.get('/accesses/allowed', async (req, res) => {
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const logs = await collection.find({ status: 'ALLOWED' }).toArray();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving logs', error });
    }
});

app.get('/accesses/denied', async (req, res) => {
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const logs = await collection.find({ status: 'DENIED' }).toArray();
        res.status(200).json(logs);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving logs', error });
    }
});

app.post('/accesses', async (req, res) => {
    const { status, message } = req.body;
    const timestamp = new Date();
    if (!['ALLOWED', 'DENIED'].includes(status)) {
        return res.status(400).json({ message: 'Invalid status' });
    }
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.insertOne({ timestamp, status, message });
        res.status(201).json({ message: 'Log entry created', result });
    } catch (error) {
        res.status(500).json({ message: 'Error creating log entry', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});