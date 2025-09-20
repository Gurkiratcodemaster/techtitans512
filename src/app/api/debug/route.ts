import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export async function GET() {
  return NextResponse.json({
    message: 'API is working',
    timestamp: new Date().toISOString(),
    env: {
      hasOpenAIKey: !!process.env.OPENAI_API_KEY,
      hasHFToken: !!process.env.HF_TOKEN,
      openAIKeyPrefix: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none',
      nodeEnv: process.env.NODE_ENV
    }
  });
}

export async function POST(request: Request) {
  console.log("=== API ROUTE CALLED ===");
  
  try {
    const body = await request.json();
    console.log("Request body received:", body);
    
    const { messages } = body;
    
    if (!messages || !Array.isArray(messages)) {
      console.log("Invalid messages format");
      return NextResponse.json({ error: 'Invalid messages format' }, { status: 400 });
    }

    // Get environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const hfToken = process.env.HF_TOKEN;
    
    console.log("Environment check:");
    console.log("- OpenAI key exists:", !!openaiApiKey);
    console.log("- OpenAI key prefix:", openaiApiKey?.substring(0, 10) || 'none');
    console.log("- HF token exists:", !!hfToken);
    
    if (!openaiApiKey || openaiApiKey === "your_openai_api_key_here") {
      console.log("No valid OpenAI API key found");
      return NextResponse.json({ 
        error: 'OpenAI API key not configured',
        details: 'Please check your .env.local file' 
      }, { status: 500 });
    }

    console.log("Initializing OpenAI client...");
    
    const openai = new OpenAI({
      apiKey: openaiApiKey,
    });

    console.log("Making OpenAI API call...");

    // Simple non-streaming request first to test
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: 'system',
          content: 'You are a helpful career guidance assistant. Keep responses concise.'
        },
        ...messages
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    console.log("OpenAI response received successfully");

    const assistantMessage = response.choices[0]?.message?.content || 'No response generated';

    return NextResponse.json({
      success: true,
      message: assistantMessage,
      model: response.model,
      usage: response.usage
    });

  } catch (error) {
    console.error('=== API ERROR ===');
    console.error('Error type:', error?.constructor?.name);
    
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    console.error('Full error:', error);
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error?.constructor?.name || 'UnknownError'
      },
      { status: 500 }
    );
  }
}