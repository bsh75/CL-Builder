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

const chat = model.startChat({
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
  const { message, newContext } = req.body;

  if (newContext) {
    context = newContext;
    model.systemInstruction = context;
    chat.history = []; // Clear chat history
  }

  try {
    const result = await chat.sendMessage(message);
    const response = await result.response.text();
    res.json({ response });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Error communicating with the server.' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// This is to simulate running in a command line
async function run() {
  let msg = prompt("What: ");
  while (msg !== "Bye") {
    const result = await chat.sendMessage(msg);
    const response = await result.response.text();
    console.log(response);
    msg = prompt("What again: ");
  }
}

run();
