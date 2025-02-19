import express from 'express';
import cors from 'cors';
import { getBand, createBand, getBands } from './database.js';

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// Add a test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Define routes
app.get('/bands', async (req, res) => {
    try {
        const bands = await getBands();
        console.log('Bands retrieved:', bands); // Add logging
        res.json(bands);
    } catch (err) {
        console.error('Error in /bands route:', err); // Detailed error logging
        res.status(500).json({ 
            error: 'Database error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

app.post('/bands', async (req, res) => {
    try {
        const { name } = req.body;
        console.log('Attempting to create band:', name); // Add logging
        const result = await createBand(name);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error in POST /bands route:', err); // Detailed error logging
        res.status(500).json({ 
            error: 'Database error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Error handling middleware should come after routes
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

// Process handling
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
});

const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

