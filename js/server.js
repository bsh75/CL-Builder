// Import necessary modules
import express from 'express';        // Web framework for Node.js
import cors from 'cors';              // Enables cross-origin resource sharing
import bodyParser from 'body-parser'; // Middleware for parsing request bodies
import { GoogleGenerativeAI } from '@google/generative-ai'; // Gemini Pro API client
import dotenv from 'dotenv';        // Loads environment variables from .env file
import promptSync from 'prompt-sync'; // Allows for synchronous prompting (optional)

// Load environment variables
dotenv.config();

// Enable synchronous prompting (for interactive console if needed)
const prompt = promptSync();

// Create Express app
const app = express();
const port = process.env.PORT || 3000;  // Use port from environment or default to 3000
const GEMINI_API_KEY = process.env.GEM_API_KEY;  // Get Gemini API key from environment

// Initialize Gemini AI client
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

// Initial system instruction for the Gemini model
let context = 'You will always reply with a lisp, changing s for th';

// Create the initial Gemini model instance
const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',     // Specify the model to use
    systemInstruction: context,   // Set the initial system instruction
});

// Start the initial chat session
let chat = model.startChat({
    history: [                     // Provide initial conversation history
        {
            role: 'user',           
            parts: [{ text: 'Hello' }]  
        },
        {
            role: 'model',
            parts: [{ text: 'Hello, how can I help you?' }] 
        },
    ],
});

// Middleware setup
app.use(cors());                    // Enable CORS for all routes
app.use(bodyParser.json());          // Parse JSON request bodies

// Chat message handling endpoint
app.post('/chat', async (req, res) => {
    const message = req.body.message; // Get user's message from the request

    console.log("Message received is:", message);
    console.log("with context:", model.systemInstruction);

    try {
        // Send the message to the chatbot and await the response
        const result = await chat.sendMessage(message);
        const response = await result.response.text(); 
        res.json({ response });          // Send the response back to the client
    } catch (error) {
        console.error('Error sending message:', error);  // Log errors
        res.status(500).json({ error: 'Error communicating with the server.' }); // Send error response
    }
});

// Context update endpoint
app.post('/context', async (req, res) => {
    const newContext = req.body.context; // Get the new context from the request
    const oldHistory = chat.history;    // Store the current chat history
    console.log("history:", oldHistory);
    console.log("newContext:", newContext);

    // Update the model's system instruction with the new context
    if (newContext) {
      model.systemInstruction = {
          role: 'system',           
          parts: [{ text: newContext }] 
      };
    }

    try {
      // Start a new chat session with the updated model and old history
      chat = model.startChat({
          history: oldHistory,
      });
      console.log("New context received is:", newContext);
      res.json({ newContext }); // Acknowledge the context update
    } catch (error) {
      console.error("Error in starting new chat:", error); // Log errors
    }

});


// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
