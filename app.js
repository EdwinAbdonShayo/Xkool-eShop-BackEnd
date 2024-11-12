const express = require('express');
const cors = require('cors');
const { MongoClient } = require('mongodb');
const propertiesReader = require('properties-reader');

// Load configuration properties
const properties = propertiesReader('./config.properties');
const PORT = properties.get('server.port') || 5454;
const MONGO_URI = properties.get('mongodb.uri');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;

async function connectToMongoDB() {
    try {
        const client = new MongoClient(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await client.connect();
        db = client.db();
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
        process.exit(1);
    }
}

// Sample route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Example endpoint to get all items from a collection
app.get('/api/items', async (req, res) => {
    try {
        const items = await db.collection('items').find({}).toArray();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
    }
});

// Connect to MongoDB and start server
connectToMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(console.error);
