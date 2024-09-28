"use server";

import { GoogleGenerativeAI } from "@google/generative-ai";
// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

export async function generateDoctorResponse(
  userMessage,
  chatHistory,
  imageData = null,
  imageType = null
) {
  try {
    let model;
    let prompt;

    if (imageData) {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      prompt = [
        {
          text: `You are an AI doctor assistant called Care AI. Analyze the following image and the user's message: "${userMessage}". 
          Provide medical advice based on the image and message, but always recommend consulting a real doctor for serious concerns. 
          If you're unsure or the image is unclear, say so.`,
        },
        {
          inlineData: {
            mimeType: imageType,
            data: imageData.split(",")[1], // Remove the data URL prefix
          },
        },
      ];
    } else {
      model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      prompt = `You are an AI doctor assistant called CareAI. 
      Here's the chat history:
      ${chatHistory.map((msg) => `${msg.sender}: ${msg.text}`).join("\n")}
      
      User's latest message: "${userMessage}"
      
      Provide medical advice based on the user's message and chat history. Always recommend consulting a real doctor for serious concerns. If you're unsure, say so clearly.`;
    }

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return response;
  } catch (error) {
    console.error("Error generating doctor response:", error);
    return "I apologize, but I'm having trouble processing your request right now. Please consult with a real doctor for any urgent medical concerns.";
  }
}
