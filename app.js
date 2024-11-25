// importing modules
import express from 'express';
import cors from 'cors';
import { MongoClient } from 'mongodb';
import propertiesReader from 'properties-reader';
import path from 'path';
import morgan from 'morgan';

// Load configuration properties
const properties = propertiesReader('./config.properties');
const PORT = properties.get('server.port') || 3000;
const MONGO_PREFIX = properties.get('mongo.prefix');
const MONGO_PASS = encodeURIComponent(properties.get('mongo.pass'));
const MONGO_URL = properties.get('mongo.url');
const MONGO_URI = `${MONGO_PREFIX}${MONGO_PASS}${MONGO_URL}`;

// Initialize Express app
const app = express();
app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500', 'https://edwinabdonshayo.github.io']
}));


// Initializing the middleware logger

app.use(morgan('common'));

// app.use((req, res, next) => {
//     const time = new Date().toISOString();
//     console.log(`${req.method} ${req.url} - ${time}`);
//     next();
// })

// static file middleware

const imagePath = path.resolve(process.cwd(), 'Media');
app.use('/Media', express.static(imagePath, { fallthrough: true }));

// Handle 404 for missing images
app.use('/Media', (req, res) => {
    console.log(`Image not found: ${req.originalUrl}`);
});

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

// Base route
app.get('/', (req, res) => {
    res.send('Hey there, fancy my work? click <a href="https://github.com/EdwinAbdonShayo">here<a> to fancy more! <br>After you done fancing, you could buy me a <a href="https://buymeacoffee.com/EdwinAbdonShayo">Coffee<a>');
});

// endpoint to get all items from a collection
app.get('/programs', async (req, res) => {
    try {
        const database = client.db('Xkool-eShop');
        const items = await database.collection('Programs').find({}).toArray();
        res.json(items);
        console.log('Displaying data in the Programs Collection');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch items' });
        process.exit(1);
    }
});

// endpoint to get all orders from a collection (testing purposes, not used in the frontend)
app.get('/orders', async (req, res) => {
    try {
        const database = client.db('Xkool-eShop');
        const orders = await database.collection('Orders').find({}).toArray();
        res.json(orders);
        console.log('Displaying data in the Orders Collection');
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
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
        console.log('Posted a new order');
    } catch (error) {
        res.status(500).json({ error: 'Failed to create order' });
        process.exit(1);
    }
});

app.put('/programs/:id', async (req, res) => {
    try {  
        const database = client.db('Xkool-eShop');
        const program = database.collection('Programs');

        const { id } = req.params;

        const result = await program.updateOne(
            { id: parseInt(id) },
            { $set: req.body }
        );

        if (result.matchedCount === 0 ) {
            res.status(404).json({ error: 'Order not found' });
        }

        console.log("Updated a program successfully");
        res.json(result);
   }catch (error) {
        res.status(500).json({error: "Operation Failed!"});
   }
});

// endpoint to search documents in the database, the Programs Collection
app.get('/search', async (req, res) => {
    try {
        const searchQuery = req.query.term; 
        if (!searchQuery) {
            return res.status(400).json({ error: "Search query is required" });
        }

        const database = client.db('Xkool-eShop');
        const collection = database.collection('Programs');

        let query = {};
        

        if (!isNaN(searchQuery)) {
            const numberAsString = searchQuery.toString();
            query = {
                $or: [
                    { $expr: { $regexMatch: {input: { $toString: "$price" }, regex: numberAsString, options: "i" } } }, 
                    { $expr: { $regexMatch: {input: { $toString: "$availableSpaces" }, regex: numberAsString, options: "i" } } }
                ]
            };
        } else {
            query = {
                $or: [
                    { title: { $regex: searchQuery, $options: 'i' } }, 
                    { location: { $regex: searchQuery, $options: 'i' } }                 
                ]
            };
        }

        const results = await collection.find(query).toArray();

        res.json(results);
        console.log(`Search successful with query: "${searchQuery}"`);
    } catch (error) {
        res.status(500).json({ error: "Search Failed!" });
        console.error("Error performing search:", error);
    }
});

// Connect to MongoDB and start server
connectToMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
}).catch(console.error);
