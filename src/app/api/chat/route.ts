import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("API route called");
    
    const body = await req.json();
    console.log("Request body:", body);
    
    const { question } = body as { question: string };

    if (!question) {
      console.log("No question provided");
      return NextResponse.json({ answer: "No question provided" }, { status: 400 });
    }

    console.log("Processing question:", question);

    // Career guidance responses based on common questions
    const careerResponses: { [key: string]: string } = {
      // Engineering questions
      "engineering": "Engineering offers diverse paths like Computer Science, Mechanical, Electrical, and Civil Engineering. Consider your interests in technology, math, and problem-solving. Popular entrance exams include JEE Main and JEE Advanced.",
      
      "computer science": "Computer Science is excellent for those interested in programming, AI, and technology. Career options include Software Developer, Data Scientist, Cybersecurity Specialist, and AI Engineer. Average salary ranges from 4-15 LPA for freshers.",
      
      "data science": "Data Science combines statistics, programming, and domain knowledge. High demand field with roles in analytics, machine learning, and business intelligence. Requires skills in Python, R, SQL, and statistics.",
      
      // Medical questions  
      "medical": "Medical field requires NEET qualification. Options include MBBS, BDS, BAMS, BHMS. Consider your interest in biology, helping others, and long study periods. Very rewarding but demanding career path.",
      
      "doctor": "Becoming a doctor requires MBBS (5.5 years) followed by specialization. High responsibility, good income potential, and social respect. Consider if you can handle pressure and long working hours.",
      
      // Business questions
      "business": "Business careers include MBA, CA, CS, Marketing, Finance. Good communication skills and analytical thinking are important. Consider Commerce stream after 10th and prepare for relevant entrance exams.",
      
      "mba": "MBA is great for leadership roles and higher salaries. Top colleges require CAT, XAT, or GMAT. Work experience before MBA can be beneficial. Specializations include Finance, Marketing, Operations, HR.",
      
      // General guidance
      "career choice": "Choose based on your interests, strengths, and market demand. Consider taking aptitude tests, talking to professionals, and researching salary trends. Don't just follow peer pressure.",
      
      "salary": "Salary depends on field, skills, location, and company. Engineering/Tech: 3-12 LPA, Medical: 4-10 LPA, Business/Finance: 3-8 LPA for freshers. Focus on skills development for better opportunities.",
      
      "entrance exams": "Major exams: JEE (Engineering), NEET (Medical), CAT (MBA), CLAT (Law), NATA (Architecture). Start preparation early, understand exam pattern, and practice regularly."
    };

    // Convert question to lowercase for matching
    const lowerQuestion = question.toLowerCase();

    // Find matching response
    let answer = "I'm here to help with career guidance! You can ask me about:\n\n• Engineering careers and entrance exams\n• Medical field and NEET preparation\n• Business and MBA options\n• Salary expectations\n• Career choice guidance\n\nWhat specific career topic interests you?";

    // Check for keywords in the question
    for (const [keyword, response] of Object.entries(careerResponses)) {
      if (lowerQuestion.includes(keyword)) {
        answer = response;
        break;
      }
    }

    // Handle specific question types
    if (lowerQuestion.includes("salary") || lowerQuestion.includes("pay") || lowerQuestion.includes("income")) {
      answer = careerResponses["salary"];
    } else if (lowerQuestion.includes("exam") || lowerQuestion.includes("entrance") || lowerQuestion.includes("test")) {
      answer = careerResponses["entrance exams"];
    } else if (lowerQuestion.includes("choose") || lowerQuestion.includes("which") || lowerQuestion.includes("best")) {
      answer = careerResponses["career choice"];
    }

    console.log("Sending answer:", answer);
    return NextResponse.json({ answer });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}