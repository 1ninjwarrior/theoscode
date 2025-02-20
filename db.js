import express from 'express';
import cors from 'cors';
import { createBand, getBands, pool } from './database.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Configure CORS with specific options
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type']
}));

app.use(express.json());

// OpenAI configuration
const openai = new OpenAI({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

let messages = {}; // Use an object to store messages by session ID

// Add a test route
app.get('/test', (req, res) => {
    res.json({ message: 'Server is working' });
});

// Define routes
app.get('/bands', async (req, res) => {
    try {
        const bands = await getBands();
        console.log('Bands retrieved:', bands);
        res.json(bands);
    } catch (err) {
        console.error('Error in /bands route:', err);
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
        console.log('Attempting to create band:', name);
        const result = await createBand(name);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error in POST /bands route:', err);
        res.status(500).json({ 
            error: 'Database error',
            details: err.message,
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
});

// Chatbot route
app.post('/message/new', async (req, res) => {
    const { message, sessionId } = req.body;
    try {
        console.log('Received message:', message);
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });

        // Initialize session if it doesn't exist
        if (!messages[sessionId]) {
            messages[sessionId] = [];
        }

        // Create a new message object
        const newMessage = {
            id: messages[sessionId].length + 1,
            content: message,
            response: response.choices[0].message.content
        };

        // Store the message under the session ID
        messages[sessionId].push(newMessage);

        res.json(newMessage);
    } catch (error) {
        console.error('Error in /message/new route:', error);
        if (error.code === 'insufficient_quota') {
            res.status(429).json({ error: 'Quota exceeded. Please try again later.' });
        } else {
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
});

app.get('/messages', (req, res) => {
    res.json(messages);
});

app.post('/message/:id', async (req, res) => {
    const { id } = req.params;
    const { message } = req.body;
    try {
        console.log(`Received message for session ${id}:`, message);

        // Fetch the existing conversation from the database
        const [rows] = await pool.execute('SELECT * FROM conversations WHERE session_id = ?', [id]);

        // Initialize messages array
        let messages = [];

        // Check if a conversation was found
        if (rows.length > 0) {
            // Parse the messages from the database
            try {
                messages = rows[0].messages;
            } catch (error) {
                console.error('Error parsing messages:', error);
                messages = []; // Reset messages if parsing fails
            }
        }

        // Add the new user message to the conversation
        messages.push({ role: "user", content: message });

        // Send the entire conversation to OpenAI
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: messages,
        });

        // Add the assistant's response to the conversation
        messages.push({ role: "assistant", content: response.choices[0].message.content });

        // Update the conversation in the database
        if (rows.length > 0) {
            await pool.execute('UPDATE conversations SET messages = ? WHERE session_id = ?', [JSON.stringify(messages), id]);
        } else {
            await pool.execute('INSERT INTO conversations (session_id, messages) VALUES (?, ?)', [id, JSON.stringify(messages)]);
        }

        res.json({ id: rows.length > 0 ? rows[0].id : null, response: response.choices[0].message.content });
    } catch (error) {
        console.error('Error in /message/:id route:', error.message);
        console.error('Stack trace:', error.stack);
        if (error.code === 'insufficient_quota') {
            res.status(429).json({ error: 'Quota exceeded. Please try again later.' });
        } else {
            res.status(500).json({ error: 'Internal Server Error', details: error.message });
        }
    }
});

// Error handling middleware
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
    console.log(`Server is running on port ${PORT}`);
});