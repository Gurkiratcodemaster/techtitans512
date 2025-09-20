import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { Mistral } from '@mistralai/mistralai';

export async function POST(request: Request) {
  console.log("API route called");
  
  try {
    const { messages } = await request.json();
    console.log("Request messages:", messages);

    // Get API keys from environment variables
    const openaiApiKey = process.env.OPENAI_API_KEY;
    const mistralApiKey = process.env.MISTRAL_API_KEY;
    const hfToken = process.env.HF_TOKEN;
    
    console.log("OpenAI key exists:", !!openaiApiKey);
    console.log("Mistral key exists:", !!mistralApiKey);
    console.log("HF token exists:", !!hfToken);
    
    if (openaiApiKey && openaiApiKey !== "your_openai_api_key_here") {
      console.log("Attempting OpenAI API...");
      
      try {
        // Initialize OpenAI client for OpenRouter
        const openai = new OpenAI({
          apiKey: openaiApiKey,
          baseURL: "https://openrouter.ai/api/v1",
          defaultHeaders: {
            "HTTP-Referer": "http://localhost:3000",
            "X-Title": "Career Choice App",
          },
        });
        
        console.log("OpenAI client initialized successfully");

        // Create chat completion with streaming
        console.log("Making OpenAI API call...");
        const stream = await openai.chat.completions.create({
          model: "meta-llama/llama-3.2-3b-instruct:free",
          messages: [
            {
              role: 'system',
              content: `You are a career guidance assistant specifically for Indian students. Help users with:
              - Engineering careers and entrance exams (JEE Main/Advanced, state CETs)
              - Medical field guidance (NEET, AIIMS, JIPMER)  
              - Business and MBA advice (CAT, XAT, MAT)
              - Government job preparation (UPSC, SSC, Banking)
              - Salary expectations and career growth in India
              - Study path recommendations for Indian education system
              
              Provide specific, helpful, and encouraging advice tailored to the Indian context. Keep responses concise but informative.`
            },
            ...messages
          ],
          temperature: 0.7,
          max_tokens: 500,
          stream: true,
        });
        
        console.log("OpenAI stream created successfully");

        // Create a streaming response
        const encoder = new TextEncoder();
        
        const readableStream = new ReadableStream({
          async start(controller) {
            try {
              console.log("Starting to read OpenAI stream...");
              for await (const chunk of stream) {
                const content = chunk.choices[0]?.delta?.content || '';
                if (content) {
                  const data = `data: ${JSON.stringify({ content })}\n\n`;
                  controller.enqueue(encoder.encode(data));
                }
              }
              console.log("OpenAI stream completed successfully");
              controller.enqueue(encoder.encode('data: [DONE]\n\n'));
              controller.close();
            } catch (streamError) {
              console.error('Streaming error:', streamError);
              controller.error(streamError);
            }
          },
        });

        return new Response(readableStream, {
          headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            'Connection': 'keep-alive',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
          },
        });
        
      } catch (openaiError: any) {
        console.error('OpenAI API error:', openaiError);
        
        // Check if it's a quota exceeded error or other API errors that should trigger fallback
        const isQuotaError = openaiError?.status === 429 || openaiError?.code === 'insufficient_quota';
        const isRateLimitError = openaiError?.status === 429;
        const isAuthError = openaiError?.status === 401;
        
        if ((isQuotaError || isRateLimitError || isAuthError) && (mistralApiKey || hfToken)) {
          console.log('OpenRouter failed with quota/auth error, falling back to other providers...');
          // Continue to Mistral or Hugging Face fallback below
        } else {
          // For other errors, throw the error
          throw new Error(`OpenRouter API failed: ${openaiError instanceof Error ? openaiError.message : 'Unknown OpenRouter error'}`);
        }
      }
    }
    
    if (mistralApiKey) {
      console.log("Using Mistral AI as fallback...");
      
      try {
        const mistral = new Mistral({
          apiKey: mistralApiKey,
        });
        
        console.log("Mistral client initialized successfully");
        
        const lastMessage = messages[messages.length - 1];
        const question = lastMessage?.content || '';
        
        // Prepare messages for Mistral
        const mistralMessages = [
          {
            role: 'system',
            content: `You are a career guidance assistant specifically for Indian students. Help users with:
            - Engineering careers and entrance exams (JEE Main/Advanced, state CETs)
            - Medical field guidance (NEET, AIIMS, JIPMER)  
            - Business and MBA advice (CAT, XAT, MAT)
            - Government job preparation (UPSC, SSC, Banking)
            - Salary expectations and career growth in India
            - Study path recommendations for Indian education system
            
            Provide specific, helpful, and encouraging advice tailored to the Indian context. Keep responses concise but informative.`
          },
          ...messages
        ];
        
        console.log("Making Mistral API call...");
        const mistralResponse = await mistral.chat.complete({
          model: "mistral-small-latest",
          messages: mistralMessages,
          temperature: 0.7,
          maxTokens: 500,
        });
        
        console.log('Mistral response received successfully');
        
        const answer = mistralResponse.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response.";
        
        return NextResponse.json({ answer });
        
      } catch (mistralError: any) {
        console.error('Mistral API error:', mistralError);
        console.log('Mistral failed, trying Hugging Face...');
        // Continue to Hugging Face fallback
      }
    }
    
    if (hfToken) {
      console.log("Using Hugging Face API as fallback...");
      
      // Fallback to Hugging Face API
      const lastMessage = messages[messages.length - 1];
      const question = lastMessage?.content || '';
      
      // Try multiple models in case one is unavailable
      const models = [
        "google/flan-t5-small",
        "distilbert-base-uncased-distilled-squad",
        "microsoft/DialoGPT-small",
        "gpt2"
      ];
      
      for (const model of models) {
        try {
          const apiUrl = `https://api-inference.huggingface.co/models/${model}`;

          console.log(`Trying Hugging Face model: ${model}`);
          const response = await fetch(apiUrl, {
            headers: {
              'Authorization': `Bearer ${hfToken}`,
              'Content-Type': 'application/json',
            },
            method: 'POST',
            body: JSON.stringify({ 
              "inputs": question,
              "parameters": {
                "max_length": 200,
                "temperature": 0.7,
                "do_sample": true,
                "return_full_text": false
              }
            }),
          });

          if (response.ok) {
            const data = await response.json();
            console.log(`Hugging Face response from ${model} received successfully`);
            
            let answer;
            if (Array.isArray(data) && data[0]) {
              answer = data[0]?.generated_text || data[0]?.text || "";
            } else if (data.generated_text) {
              answer = data.generated_text;
            } else if (typeof data === 'string') {
              answer = data;
            } else {
              answer = "I'm here to help with your career questions! Please ask me about engineering, medical, or business careers.";
            }
            
            // Clean up the response if it contains the input
            if (answer.includes(question)) {
              const parts = answer.split(question);
              answer = parts[parts.length - 1].trim();
            }
            
            // Ensure we have a meaningful response
            if (!answer || answer.length < 10) {
              answer = "I'm your career guidance assistant. I can help you with information about engineering careers (JEE, B.Tech), medical careers (NEET, MBBS), MBA options (CAT, XAT), and government jobs (UPSC, SSC). What would you like to know?";
            }

            return NextResponse.json({ answer });
          } else {
            console.log(`Model ${model} failed with status ${response.status}, trying next model...`);
            continue;
          }
        } catch (modelError) {
          console.log(`Error with model ${model}:`, modelError);
          continue;
        }
      }
      
      // If all models failed, use intelligent keyword-based responses
      console.log('All AI models failed, using intelligent keyword-based response');
      const intelligentResponse = getIntelligentResponse(question);
      return NextResponse.json({ answer: intelligentResponse });
      
    } else {
      console.log("No AI service available");
      return NextResponse.json(
        { error: 'No AI service available. All AI providers (OpenRouter, Mistral, Hugging Face) failed or are not configured. Please check your API keys.' },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error('AI Chat Error:', error);
    
    // Provide more detailed error information
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
      
      return NextResponse.json(
        { 
          error: 'Failed to process your question',
          details: error.message,
          type: error.constructor.name
        },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Unknown error occurred' },
      { status: 500 }
    );
  }
}

// Intelligent keyword-based career guidance responses
function getIntelligentResponse(question: string): string {
  const q = question.toLowerCase();
  
  // Engineering related questions
  if (q.includes('engineering') || q.includes('btech') || q.includes('b.tech') || q.includes('jee')) {
    return `🎓 **Engineering Career Guidance:**\n\nFor engineering careers in India, here are your key paths:\n\n**Popular Branches:**\n• Computer Science - High demand, ₹4-15 LPA starting\n• Electronics & Communication - ₹3-12 LPA\n• Mechanical - ₹3-10 LPA\n• Civil - ₹3-8 LPA\n\n**Entrance Exams:**\n• JEE Main (for NITs, IIITs, GFTIs)\n• JEE Advanced (for IITs)\n• State CETs (MHT-CET, KCET, etc.)\n• BITSAT (for BITS)\n\n**Career Options:**\n• Software Developer\n• Data Scientist\n• Product Manager\n• Research & Development\n• Higher Studies (M.Tech, MBA)`;
  }
  
  // Medical related questions
  if (q.includes('medical') || q.includes('doctor') || q.includes('neet') || q.includes('mbbs')) {
    return `⚕️ **Medical Career Guidance:**\n\n**Entrance Exam:** NEET (National Eligibility cum Entrance Test)\n\n**Course Options:**\n• MBBS (5.5 years) - ₹8-25+ LPA after specialization\n• BDS (Dental) - ₹4-15 LPA\n• BAMS (Ayurveda) - ₹3-12 LPA\n• BHMS (Homeopathy) - ₹3-10 LPA\n\n**Career Paths:**\n• Clinical Practice\n• Hospital Administration\n• Medical Research\n• Public Health\n• Pharmaceutical Industry\n\n**Specialization Options:**\n• General Medicine, Surgery, Pediatrics\n• Dermatology, Orthopedics, Radiology\n• Anesthesiology, Pathology`;
  }
  
  // MBA/Business related questions
  if (q.includes('mba') || q.includes('business') || q.includes('management') || q.includes('cat') || q.includes('xat')) {
    return `💼 **MBA & Business Career Guidance:**\n\n**MBA Entrance Exams:**\n• CAT (for IIMs)\n• XAT (for XLRI and other top colleges)\n• MAT, CMAT, SNAP for other institutions\n\n**Specializations:**\n• Finance - ₹8-30+ LPA\n• Marketing - ₹6-25 LPA\n• Operations - ₹7-20 LPA\n• HR - ₹6-18 LPA\n• Strategy & Consulting - ₹12-40+ LPA\n\n**Career Options:**\n• Management Consultant\n• Investment Banking\n• Product Management\n• Business Development\n• Entrepreneurship\n\n**Top Institutes:** IIMs, ISB, XLRI, FMS, JBIMS`;
  }
  
  // Government jobs
  if (q.includes('government') || q.includes('upsc') || q.includes('ssc') || q.includes('banking') || q.includes('civil service')) {
    return `🏛️ **Government Job Guidance:**\n\n**Civil Services (UPSC):**\n• IAS, IPS, IFS - ₹8-15 LPA + perks\n• Age: 21-32 years\n• Three stages: Prelims, Mains, Interview\n\n**SSC Jobs:**\n• SSC CGL - ₹4-8 LPA\n• SSC CHSL - ₹2-4 LPA\n• SSC MTS - ₹2-3 LPA\n\n**Banking:**\n• IBPS PO - ₹4-8 LPA\n• IBPS Clerk - ₹3-5 LPA\n• SBI PO - ₹6-10 LPA\n\n**Other Options:**\n• Railway Jobs (RRB)\n• Defence (NDA, CDS)\n• State PSCs\n• Teaching (CTET, UGC NET)`;
  }
  
  // Salary related questions
  if (q.includes('salary') || q.includes('package') || q.includes('pay') || q.includes('earn')) {
    return `💰 **Salary Expectations in India:**\n\n**Engineering (Fresher):**\n• Software Engineer: ₹4-15 LPA\n• Data Scientist: ₹6-20 LPA\n• Mechanical Engineer: ₹3-10 LPA\n• Civil Engineer: ₹3-8 LPA\n\n**Medical (After completing studies):**\n• General Practitioner: ₹8-15 LPA\n• Specialist Doctor: ₹15-30+ LPA\n• Hospital Administration: ₹6-18 LPA\n\n**MBA (Post-MBA):**\n• Tier-1 B-School: ₹15-40+ LPA\n• Tier-2 B-School: ₹8-20 LPA\n• Finance/Consulting: ₹20-50+ LPA\n\n**Government Jobs:**\n• IAS/IPS: ₹8-15 LPA + benefits\n• Bank PO: ₹4-10 LPA\n• SSC CGL: ₹4-8 LPA\n\n*Note: Salaries vary by location, company, and experience*`;
  }
  
  // Study/preparation related questions
  if (q.includes('study') || q.includes('prepare') || q.includes('tips') || q.includes('how to')) {
    return `📚 **Study & Preparation Tips:**\n\n**For JEE Preparation:**\n• Start early (Class 11)\n• Focus on NCERT first\n• Practice previous year questions\n• Join mock tests regularly\n• Physics: Focus on problem-solving\n• Chemistry: Memorize reactions & formulas\n• Math: Practice daily, focus on calculus\n\n**For NEET Preparation:**\n• NCERT is most important\n• Biology: 50% weightage\n• Practice MCQs extensively\n• Focus on diagrams and processes\n\n**For CAT Preparation:**\n• Start 10-12 months before\n• Focus on basics first\n• Practice mock tests\n• Improve reading speed\n• Time management is crucial\n\n**General Tips:**\n• Maintain consistency\n• Take regular breaks\n• Stay physically active\n• Join study groups`;
  }
  
  // After class 10/12 questions
  if (q.includes('class 10') || q.includes('10th') || q.includes('class 12') || q.includes('12th') || q.includes('after')) {
    return `🎯 **Career Options After Class 10/12:**\n\n**After Class 10:**\n• Science (PCM/PCB) - For Engineering/Medical\n• Commerce - For CA, CS, BBA, Economics\n• Humanities - For Law, Journalism, Psychology\n\n**After Class 12 (Science):**\n• Engineering (JEE Main/Advanced)\n• Medical (NEET)\n• Basic Sciences (BSc Physics, Chemistry, Math)\n• Integrated courses (5-year programs)\n\n**After Class 12 (Commerce):**\n• CA (Chartered Accountancy)\n• CS (Company Secretary)\n• BBA/BBM + MBA\n• Economics, Commerce degrees\n• Banking & Finance courses\n\n**After Class 12 (Humanities):**\n• Law (5-year integrated LLB)\n• Journalism & Mass Communication\n• Psychology, Sociology\n• Hotel Management\n• Design courses`;
  }
  
  // Default helpful response
  return `👋 Hi there! I'm your AI career guidance assistant, specifically designed to help Indian students!\n\n**I can help you with:**\n\n🎓 **Engineering Careers**\n• JEE Main/Advanced preparation\n• Branch selection & career paths\n• Salary expectations\n\n⚕️ **Medical Careers**\n• NEET preparation strategies\n• MBBS vs other medical courses\n• Specialization options\n\n💼 **Business & MBA**\n• CAT, XAT preparation\n• B-school selection\n• Career opportunities\n\n🏛️ **Government Jobs**\n• UPSC, SSC, Banking exams\n• Preparation strategies\n• Job profiles & salaries\n\n**Try asking me:**\n• \"What are good engineering branches?\"\n• \"How to prepare for NEET?\"\n• \"MBA vs M.Tech after B.Tech?\"\n• \"Government job options for graduates?\"\n\nWhat would you like to know about your career?`;
}
