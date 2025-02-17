import express from 'express';
import cors from 'cors';
import { getBand, createBand, getBands } from './database.js';

const app = express();

app.use(cors());
app.use(express.json());

app.get('/bands', async (req, res) => {
  try {
    const bands = await getBands();
    res.json(bands);
  } catch (err) {
    console.error('Error:', err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/bands', async (req, res) => {
    try {
        const { name } = req.body;
        const result = await createBand(name);
        res.status(201).json(result);
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

