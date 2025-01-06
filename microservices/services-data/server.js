const express = require('express');
const { MongoClient } = require('mongodb');
const dotenv = require('dotenv');
const cors = require('cors');
dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const mongoUrl = process.env.MONGODB_URL || 'mongodb://localhost:27017';
const dbName = 'service_summary';
const collectionName = 'service';

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
    } catch (error) {
        console.error('Failed to connect to MongoDB', error);
    }
}

connectToMongoDB();

app.get('/allServices', async (req, res) => {
    try {
        const database = await client.db(dbName);
        const collection = await database.collection(collectionName);
        const services = await collection.find({}).toArray();
        console.log(services);
        res.status(200).json(services);
    }
    catch (error) {
        res.status(500).json({ message: 'Error retrieving services', error });
    }
});

app.get('/service/:service', async (req, res) => {
    const serviceName = req.params.service;
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const service = await collection.findOne({ name: serviceName });
        if (service) {
            res.status(200).json(service);
        } else {
            res.status(404).json({ message: 'Service not found' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving service', error });
    }
});

app.post('/service/:service', async (req, res) => {
    const serviceName = req.params.service;
    const status = req.body.status;
    try {
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
        const result = await collection.updateOne(
            { name: serviceName },
            { $set: { status: status } },
            { upsert: true }
        );
        res.status(200).json({ message: 'Service status updated', result });
    } catch (error) {
        res.status(500).json({ message: 'Error updating service status', error });
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
async function createDatabaseAndCollection() {
    try {
        const database = client.db(dbName);
        const collections = await database.listCollections({ name: collectionName }).toArray();
        if (collections.length === 0) {
            await database.createCollection(collectionName);
            console.log(`Collection '${collectionName}' created`);
        } else {
            console.log(`Collection '${collectionName}' already exists`);
        }
    } catch (error) {
        console.error('Error creating database or collection', error);
    }
}

createDatabaseAndCollection();