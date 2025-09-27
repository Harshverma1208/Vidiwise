"use server"

import { GoogleGenerativeAI } from "@google/generative-ai"
import { env } from "~/env";

// const apiKey = process.env.! ;

const genAI = new GoogleGenerativeAI(env.GEMINI_API_KEY);

const prompt =
  "Analyze this paragraph which is a transcript of a video, and refer to it as video in your answers as well not text or transcript. Make sure the answers are point-wise and not a big paragraph. Answer user questions based solely on the provided text, avoiding external knowledge. Given Transcript:";


export const textTotext =async (inp: string, para: string) =>{
  // Check if GEMINI_API_KEY is configured
  if (!env.GEMINI_API_KEY) {
    return "AI chat requires GEMINI_API_KEY configuration. Please set up the API key to use this feature.";
  }
  
  // Additional check for empty API key
  if (env.GEMINI_API_KEY.trim().length < 10) {
    console.log('⚠️ GEMINI_API_KEY appears to be invalid or too short');
    return "AI functionality requires a valid GEMINI_API_KEY. Please check your configuration.";
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
  let text, result, response;
  try {
    if (para) {
      const finalPrompt =
        prompt +
        para.slice(0, 2500) +
        "Based on only this answer the following user input: " +
        inp;
      // console.log("Para", para)
      result = await model.generateContent(finalPrompt);
      response = result.response;
      text = response.text();
    } else {
      result = await model.generateContent(
        "Analyze the question and give a simplified ans. The question is: " +
          inp,
      );
      response = result.response;
      text = result.response.text();
    }
    } catch (error) {
      console.error('Gemini API error (attempt 1):', error);
      try {
        result = await model.generateContent(
          "Analyze the question and give a simplified ans. The question is: " +
            inp,
        );
        response = result.response;
        text = result.response.text(); 
      } catch (error2) {
        console.error('Gemini API error (attempt 2):', error2);
        // Throw error so calling code can handle fallback
        throw new Error("Gemini API unavailable: " + (error2 as Error).message);
      }
    }
//   setresponse(text);
  return text
}