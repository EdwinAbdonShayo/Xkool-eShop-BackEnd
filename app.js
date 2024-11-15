// importing modules
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import propertiesReader from 'properties-reader';

// Load configuration properties
const properties = propertiesReader('./config.properties');
const PORT = properties.get('server.port') || 3000;
const MONGO_URI = properties.get('mongodb.uri');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
let db;
let client;

async function connectToMongoDB() {
    try {
        client = new MongoClient(MONGO_URI);
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
    res.send('Hello, Server Running Here!');
});

// endpoint to get all items from a collection
app.get('/programs', async (req, res) => {
    try {
        const database = client.db('Xkool-eShop');
        const items = await database.collection('Programs').find({}).toArray();
        console.log('Here found the database');
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
        process.exit(1);
    }
});

// Posting the new order into the database
app.post('/orders', async (req, res) => {
    try {
        const database = client.db('Xkool-eShop');
        const order = database.collection('Orders');
        const result = await order.insertOne(req.body);
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
        process.exit(1)    ;
    }
});

// endpoint to get all orders from a collection
app.get('/orders', async (req, res) => {
    try {
        const database = client.db('Xkool-eShop');
        const orders = await database.collection('Orders').find({}).toArray();
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
        process.exit(1);
    }
});

app.put('/orders/:orderNo', async (req, res) => {
    try {  
        const database = client.db('Xkool-eShop');
        const order = database.collection('Orders');

        const { orderNo } = req.params;

        const result = await order.updateOne(
            { orderNo: parseInt(orderNo) },
            { $set: req.body }
        );

        if (result.matchedCount === 0 ) {
            res.status(404).json({ error: 'Order not found' });
        }

        console.log("Updated Successfully");
        res.json(result);
   }catch (error) {
        res.status(500).json({error: "Operation Failed!"});
   }
});

// Connect to MongoDB and start server
connectToMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(console.error);
