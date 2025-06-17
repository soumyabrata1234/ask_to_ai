import {main} from '../ai/ai.js';

export const test = (req, res) => {
    res.send('Welcome to the AI Route!');

}

export const generateContent = async (req, res) => {
   try {
       const { p } = req.body;
       const response = await main(p);
       res.status(200).json({ response });
   } catch (error) {
       console.error('Error generating content:', error);
       res.status(500).json({ error: 'Failed to generate content' });
   }
};
// import { GoogleGenAI } from "@google/genai";

// const ai = new GoogleGenAI({ apiKey: "YOUR_API_KEY" });

// async function main() {
//   const response = await ai.models.generateContent({
//     model: "gemini-2.0-flash",
//     contents: "Explain how AI works in a few words",
//   });
//   console.log(response.text);
// }

// await main();