import { NextResponse } from "next/server";
import { Mistral } from "@mistralai/mistralai";

function getIntelligentResponse(question: string): string {
  const q = question.toLowerCase();

  if (q.includes("engineering") || q.includes("btech") || q.includes("jee")) {
    return `🎓 Engineering Guidance:

• CSE, ECE, Mechanical, Civil
• Exams: JEE Main, JEE Advanced, CETs
• Careers: Software, Data, R&D
• Salary: ₹4–15 LPA (Fresher)`;
  }

  if (q.includes("medical") || q.includes("neet") || q.includes("mbbs")) {
    return `⚕️ Medical Guidance:

• Exam: NEET
• Courses: MBBS, BDS, BAMS
• Salary: ₹8–25+ LPA
• Careers: Practice, Research`;
  }

  if (q.includes("mba") || q.includes("cat") || q.includes("business")) {
    return `💼 MBA Guidance:

• Exams: CAT, XAT, SNAP
• Specializations: Finance, Marketing, HR
• Salary: ₹8–30+ LPA`;
  }

  if (q.includes("government") || q.includes("upsc") || q.includes("ssc")) {
    return `🏛️ Govt Jobs:

• UPSC, SSC, Banking
• IAS/IPS/PO
• Salary: ₹4–15 LPA + perks`;
  }

  if (q.includes("salary") || q.includes("package")) {
    return `💰 Salary Info:

• Engineering: ₹4–15 LPA
• Medical: ₹8–25+ LPA
• MBA: ₹8–40+ LPA
• Govt: ₹4–15 LPA`;
  }

  if (q.includes("study") || q.includes("prepare")) {
    return `📚 Study Tips:

• Consistency
• Mock Tests
• NCERT Focus
• Daily Practice`;
  }

  return `👋 Hi! I’m your AI career assistant.

Ask me about:
• Engineering
• Medical
• MBA
• Govt Jobs
• Salaries
• Preparation`;
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const messages = body.messages || [];

    const lastMessage = messages[messages.length - 1];
    const question = lastMessage?.content || "";

    const apiKey = process.env.MISTRAL_API_KEY;

    if (apiKey) {
      try {
        const mistral = new Mistral({
          apiKey: apiKey,
        });

        const mistralMessages = [
          {
            role: "system",
            content: `You are a career guidance assistant for Indian students.
Give concise, helpful advice.`,
          },
          ...messages,
        ];

        const response = await mistral.chat.complete({
          model: "mistral-small-latest",
          messages: mistralMessages,
          temperature: 0.7,
          maxTokens: 500,
        });

        const answer =
          response.choices?.[0]?.message?.content ||
          "Sorry, I couldn't generate a response.";

        return NextResponse.json({ answer });
      } catch (err) {
        console.error("Mistral Error:", err);
      }
    }

    const fallback = getIntelligentResponse(question);

    return NextResponse.json({ answer: fallback });

  } catch (error) {
    console.error("API Error:", error);

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
