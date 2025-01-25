// import express from 'express';
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as fs from 'node:fs';
// export const getMedicines = async (base64Image, mimeType = "image/png") => {
//     try {
//         // Initialize the GoogleGenerativeAI instance with the Gemini API key
//         const genAI = new GoogleGenerativeAI("AIzaSyCJNEigZukgJCmYoomSJopPUuZRGh6tpRg");
//         const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

//         // Convert Base64 image to generative part
//         function base64ToGenerativePart(base64Data, mimeType) {
//             return {
//                 inlineData: {
//                     data: base64Data,
//                     mimeType,
//                 },
//             };
//         }

//         // Example prompt (modify this as per your requirements)
//         const prompt = "Describe the medicines or prescriptions in the uploaded image.";

//         // Use the uploaded image (Base64 format) for the imagePart
//         const imagePart = base64ToGenerativePart(base64Image, mimeType);

//         // Generate content using the Gemini model
//         const result = await model.generateContent([prompt, imagePart]);

//         // Output the response text
//         console.log(result.response.text());
//         return result.response.text();
//     } catch (error) {
//         console.error("Error generating medicines data:", error);
//         throw error; // Rethrow error to handle it elsewhere if needed
//     }
// };
