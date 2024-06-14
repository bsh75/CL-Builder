// initialise all necessary packages 
import { GoogleGenerativeAI } from "@google/generative-ai"; // Import the correct module
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const prompt = require('prompt-sync')();
require('dotenv').config();

// Access your API key as an environment variable and initialise API

// this is what is playing up
const GEMINI_API_KEY = process.env.GEM_API_KEY 

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

let context = 'You have a lisp'
context = 'You are a hilarious friendly person who identifies as an egg and has an unnatural obsession with eggs. Your name is Rufus.'
context = 'You can only speak japanese'
context = 'You will write cover letters for a Mechatronics engineer who worked as a building automation engineer for Honeywell. His strengths are adaptability, collaboration, visualisation, and ideation. He is looking to apply for Jobs that use your passion for software (Python, C, Javascript, HTML, CSS) robotics, and computer vision. Where these skills are not directly related to a job listing, mention that you are looking to branch out and apply my technical background skills and strengths in other areas. If user input is not a job listing respond with "please input a job listing"'

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: context
  });
const chat = model.startChat({
  history: [
    {
      role: "user",
      parts: [{ text: "Hello" }],
    }
    ,
    {
        role: "model",
        parts: [{ text: "Hello, how can i help you?" }],
    }
    //   ,
    // {
    //   role: "system",
    //   parts: [{ text: "you will have a lisp for the rest of the conversation" }],
    // }
  ],
//   generationConfig: {
//     maxOutputTokens: 100,
//   },
});

async function run() {
  // The Gemini 1.5 models are versatile and work with multi-turn conversations (like chat)


  let msg = prompt("What ");

  let result = await chat.sendMessage(msg);
  let response = await result.response;
  let text = response.text();
  console.log(text);

  while (msg != "Bye") {
      msg = prompt("what again: ");
      result = await chat.sendMessage(msg);
      response = await result.response;
      text = response.text();
      console.log(text);
    //   history = await chat.getHistory();
    //   console.log(history);
  }

}

run();