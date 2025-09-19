"use client";
import { useState } from "react";
import { Navbar } from "@/components/navbar";
import Link from "next/link";

interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

interface QuizResult {
  category: string;
  score: number;
  careers: string[];
  description: string;
  colleges: string[];
}

const questions: Question[] = [
  {
    id: 1,
    question: "Which stream did you choose after Class 10?",
    options: [
      "Science (PCM - Physics, Chemistry, Maths)",
      "Science (PCB - Physics, Chemistry, Biology)", 
      "Commerce (with Mathematics)",
      "Commerce (without Mathematics) or Arts"
    ],
    category: "stream"
  },
  {
    id: 2,
    question: "What type of career do you envision for yourself?",
    options: [
      "Research and innovation in cutting-edge technology",
      "Healthcare and medical profession",
      "Business, finance, and entrepreneurship",
      "Creative arts, media, and communication"
    ],
    category: "vision"
  },
  {
    id: 3,
    question: "Which competitive exam are you most interested in preparing for?",
    options: [
      "JEE Main/Advanced for engineering",
      "NEET for medical courses",
      "CA/CS/CMA for commerce",
      "CLAT/other exams for law/arts"
    ],
    category: "exam"
  },
  {
    id: 4,
    question: "What kind of work environment appeals to you most?",
    options: [
      "High-tech laboratories and research facilities",
      "Hospitals, clinics, and healthcare settings",
      "Corporate offices and business environments",
      "Creative studios, media houses, and flexible workspaces"
    ],
    category: "environment"
  },
  {
    id: 5,
    question: "Which subject combination interests you the most?",
    options: [
      "Advanced Mathematics and Physics",
      "Biology and Chemistry",
      "Economics and Business Studies",
      "Psychology and Sociology"
    ],
    category: "subjects"
  },
  {
    id: 6,
    question: "What motivates you to excel academically?",
    options: [
      "Solving complex technical problems",
      "Helping people and making a difference in health",
      "Building successful businesses and financial growth",
      "Expressing creativity and influencing society"
    ],
    category: "motivation"
  },
  {
    id: 7,
    question: "Which career path excites you the most?",
    options: [
      "Software Engineer, Data Scientist, or Aerospace Engineer",
      "Doctor, Surgeon, or Medical Researcher", 
      "Investment Banker, Business Analyst, or Entrepreneur",
      "Journalist, Lawyer, or Social Activist"
    ],
    category: "career_path"
  },
  {
    id: 8,
    question: "What type of higher education do you prefer?",
    options: [
      "Technical institutions like IITs, NITs",
      "Medical colleges and AIIMS",
      "Business schools and CA institutes",
      "Liberal arts colleges and universities"
    ],
    category: "education"
  },
  {
    id: 9,
    question: "Which skill do you want to develop most?",
    options: [
      "Programming, AI, and technical innovation",
      "Medical diagnosis and patient care",
      "Financial analysis and market understanding",
      "Communication, writing, and critical thinking"
    ],
    category: "skills"
  },
  {
    id: 10,
    question: "What impact do you want to make in the world?",
    options: [
      "Advance technology and scientific discovery",
      "Improve healthcare and save lives",
      "Drive economic growth and innovation",
      "Influence policy and social change"
    ],
    category: "impact"
  }
];

const careerResults: Record<string, QuizResult> = {
  engineering: {
    category: "Engineering & Technology",
    score: 0,
    careers: ["Software Engineer", "Data Scientist", "Mechanical Engineer", "Electrical Engineer", "Aerospace Engineer", "AI/ML Engineer"],
    description: "You have strong analytical and technical skills perfect for engineering. Focus on JEE preparation and consider top engineering colleges.",
    colleges: ["IIT Delhi", "IIT Bombay", "IIT Madras", "NIT Trichy", "BITS Pilani", "DTU Delhi"]
  },
  medical: {
    category: "Medical & Healthcare",
    score: 0,
    careers: ["Doctor (MBBS)", "Surgeon", "Medical Researcher", "Dentist", "Pharmacist", "Physiotherapist"],
    description: "Your passion for healthcare and helping people makes medicine an ideal choice. Focus on NEET preparation for medical colleges.",
    colleges: ["AIIMS Delhi", "AIIMS Bombay", "CMC Vellore", "KGMU Lucknow", "JIPMER Puducherry", "GMC Mumbai"]
  },
  business: {
    category: "Business & Finance",
    score: 0,
    careers: ["Chartered Accountant", "Investment Banker", "Business Analyst", "Entrepreneur", "Management Consultant", "Financial Advisor"],
    description: "You have excellent business acumen and analytical skills. Consider commerce courses, CA, or business management programs.",
    colleges: ["IIM Ahmedabad", "IIM Bangalore", "SRCC Delhi", "LSR Delhi", "ICAI (CA)", "ICSI (CS)"]
  },
  liberal: {
    category: "Liberal Arts & Social Sciences",
    score: 0,
    careers: ["Lawyer", "Journalist", "Civil Servant (IAS)", "Psychologist", "Social Worker", "Policy Analyst"],
    description: "Your creative thinking and social awareness make you perfect for liberal arts, law, or civil services. Consider humanities and social sciences.",
    colleges: ["JNU Delhi", "DU (St. Stephens)", "NALSAR Hyderabad", "NLSIU Bangalore", "Jamia Millia", "BHU Varanasi"]
  }
};

export default function Class12Quiz() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults(newAnswers);
    }
  };

  const calculateResults = (userAnswers: number[]) => {
    const scores = {
      engineering: 0,
      medical: 0,
      business: 0,
      liberal: 0
    };

    userAnswers.forEach((answer, index) => {
      switch (index) {
        case 0: // Stream choice
          if (answer === 0) scores.engineering += 4;
          if (answer === 1) scores.medical += 4;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 1: // Career vision
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 4;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 2: // Competitive exam
          if (answer === 0) scores.engineering += 4;
          if (answer === 1) scores.medical += 4;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 3: // Work environment
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 3;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 4: // Subject combination
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 3;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 5: // Academic motivation
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 3;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 6: // Career path
          if (answer === 0) scores.engineering += 4;
          if (answer === 1) scores.medical += 4;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 7: // Higher education
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 3;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 8: // Skills development
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 3;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
        case 9: // World impact
          if (answer === 0) scores.engineering += 3;
          if (answer === 1) scores.medical += 3;
          if (answer === 2) scores.business += 3;
          if (answer === 3) scores.liberal += 3;
          break;
      }
    });

    const topCategory = Object.keys(scores).reduce((a, b) => 
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    );

    const result = { ...careerResults[topCategory] };
    result.score = scores[topCategory as keyof typeof scores];
    
    setResults(result);
    setShowResults(true);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
  };

  if (showResults && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <Navbar />
        
        <div className="pt-20 px-8">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Class 12 <span className="text-blue-600">Quiz Results</span>
              </h1>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Ideal Career Path:</h2>
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">{results.category}</h3>
                <p className="text-lg text-gray-700 mb-8">{results.description}</p>
              </div>

              <div className="grid lg:grid-cols-3 gap-8">
                <div className="bg-white/50 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Top Career Options:</h4>
                  <ul className="space-y-2">
                    {results.careers.map((career, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/50 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Top Colleges/Institutes:</h4>
                  <ul className="space-y-2">
                    {results.colleges.map((college, index) => (
                      <li key={index} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-green-600 rounded-full mr-3"></div>
                        {college}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/50 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Research entrance exam patterns</li>
                    <li>• Start intensive preparation</li>
                    <li>• Take coaching if needed</li>
                    <li>• Apply for relevant colleges</li>
                    <li>• Build relevant skill portfolio</li>
                    <li>• Network with professionals</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 bg-blue-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Important Reminder:</h4>
                <p className="text-gray-700">
                  This quiz provides guidance based on your interests and preferences. Remember that success in any field requires dedication, hard work, and continuous learning. Consider talking to career counselors, professionals in your chosen field, and taking aptitude tests for more comprehensive career guidance.
                </p>
              </div>

              <div className="text-center mt-8 space-y-4">
                <button
                  onClick={restartQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold mr-4"
                >
                  Retake Quiz
                </button>
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold"
                >
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Class 12 <span className="text-blue-600">Career Assessment</span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover your ideal career path and college options after Class 12
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {questions[currentQuestion].question}
              </h2>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    className="w-full p-4 text-left bg-white/50 hover:bg-white/80 rounded-2xl transition-all duration-200 border border-gray-200 hover:border-blue-300 hover:shadow-md"
                  >
                    <div className="flex items-start">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center mt-1">
                        <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100"></div>
                      </div>
                      <span className="text-gray-700 font-medium">{option}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}