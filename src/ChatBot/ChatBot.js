import {Configuration, OpenAIApi} from "openai"
import dotenv from "dotenv"
import express from "express"
dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.REACT_APP_OPENAI_API_KEY,
});

const app = express()
const openai = new OpenAIApi(configuration);

app.use(express.json());

app.post('/message/:id', async (req, res) => {
    const {id} = req.params;
    const {message} = req.body;
    const response = await openai.createCompletion({
        model: "gpt-3.5-turbo",
        messages: [{role: "user", content: message}],
    });
    res.json({message: response.data.choices[0].message.content});
});

app.post('/message/new', async (req, res) => {
    const { message } = req.body;
    try {
        const response = await openai.createCompletion({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: message }],
        });
        res.json({ message: response.data.choices[0].message.content });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(3001, () => {
    console.log('Server running on port 3001');
});

export default app;