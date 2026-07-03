import { GoogleGenAI } from "@google/genai";

const API_KEYS = [
  process.env.GEMINI_API_KEY1,
  process.env.GEMINI_API_KEY2,
  process.env.GEMINI_API_KEY3
].filter(Boolean); // Removes undefined values if some keys aren't set yet[span_6](start_span)[span_6](end_span)

export async function handler(event) {
  if (event.httpMethod !== "POST") { // Only allow POST requests[span_7](start_span)[span_7](end_span)
    return {
      statusCode: 405,
      body: JSON.stringify({ error: "Method Not Allowed" }) // Reject non-POST requests[span_8](start_span)[span_8](end_span)
    };
  }

  try {
    const { message } = JSON.parse(event.body); // Parse the incoming user message[span_9](start_span)[span_9](end_span)

    if (!message) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: "Message is required" }) // Return error if message empty[span_10](start_span)[span_10](end_span)
      };
    }

    if (API_KEYS.length === 0) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Gemini API Keys are missing in Netlify Environment Variables" })
      };
    }

    // Randomly choose one of the configured API keys[span_11](start_span)[span_11](end_span)
    const apiKey = API_KEYS[Math.floor(Math.random() * API_KEYS.length)]; // Select key[span_12](start_span)[span_12](end_span)

    const ai = new GoogleGenAI({ apiKey }); // Initialize the client[span_13](start_span)[span_13](end_span)

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Target model[span_14](start_span)[span_14](end_span)
      contents: message // Send message data[span_15](start_span)[span_15](end_span)
    });

    // Fix: Safely extract text depending on how response returns it
    let replyText = "";
    if (typeof response.text === "function") {
      replyText = await response.text();
    } else if (response.text) {
      replyText = response.text;
    } else if (response.candidates && response.candidates[0]?.content?.parts[0]?.text) {
      replyText = response.candidates[0].content.parts[0].text;
    } else {
      replyText = "I couldn't generate a response.";
    }

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" }, // Specify json content type[span_16](start_span)[span_16](end_span)
      body: JSON.stringify({ reply: replyText })
    };

  } catch (error) {
    console.error("Gemini Function Error:", error); // Print serverless function errors to logs[span_17](start_span)[span_17](end_span)
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message || "Internal Server Error" }) // Return standard error[span_18](start_span)[span_18](end_span)
    };
  }
}
