import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Ensure this is the correct package
import dotenv from 'dotenv';
import promptSync from 'prompt-sync';

dotenv.config();

const prompt = promptSync();

const app = express();
const port = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEM_API_KEY;

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let context = 'You will always reply with a lisp, changing s for th';

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
  systemInstruction: context,
});

let chat = model.startChat({
  history: [
    {
      role: 'user',
      parts: [{ text: 'Hello' }],
    },
    {
      role: 'model',
      parts: [{ text: 'Hello, how can I help you?' }],
    },
  ],
});

app.use(cors());
app.use(bodyParser.json());

app.post('/chat', async (req, res) => {
  const message = req.body.message;

  console.log("message recieved is: ", message)
  console.log("with context is: ", model.systemInstruction)
  try {
    const result = await chat.sendMessage(message);
    const response = await result.response.text();
    res.json({ response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error communicating with the server.' });
  }
});

app.post('/context', async (req, res) => {
  const newContext = req.body.context;
  const oldHistory = chat.history
  console.log("history: ", oldHistory)

  chat = model.startChat({
    history: oldHistory,
  })

  if (newContext) {
    model.systemInstruction = newContext;
    // chat.history = []; // Clear chat history
  }
  console.log("New context recieved is: ", newContext)
  res.json({ newContext });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

