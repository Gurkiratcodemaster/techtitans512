// Example of how to use OpenAI directly (for reference)
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Use environment variable for security
});

// Correct OpenAI API usage example
export async function generateHaiku() {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // Valid model name
      messages: [
        {
          role: "user",
          content: "Write a haiku about AI"
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const haiku = response.choices[0]?.message?.content;
    console.log("Generated Haiku:", haiku);
    return haiku;
    
  } catch (error) {
    console.error("OpenAI API Error:", error);
    throw error;
  }
}

// Streaming example (like in your chatbot)
export async function generateStreamingResponse(prompt: string) {
  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ],
      stream: true, // Enable streaming
      max_tokens: 500,
    });

    let fullResponse = "";
    
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      fullResponse += content;
      console.log(content); // This will print each chunk as it arrives
    }
    
    return fullResponse;
    
  } catch (error) {
    console.error("Streaming Error:", error);
    throw error;
  }
}