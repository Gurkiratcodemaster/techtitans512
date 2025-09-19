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
}

const questions: Question[] = [
  {
    id: 1,
    question: "What type of activities do you enjoy most?",
    options: [
      "Working with computers and technology",
      "Helping and caring for people", 
      "Creating art, music, or writing",
      "Working with numbers and solving problems"
    ],
    category: "interest"
  },
  {
    id: 2,
    question: "Which subject do you find most interesting?",
    options: [
      "Mathematics and Science",
      "English and Literature",
      "Social Studies and History", 
      "Art and Music"
    ],
    category: "academic"
  },
  {
    id: 3,
    question: "What kind of environment do you prefer to work in?",
    options: [
      "Outdoor and active environments",
      "Quiet office or library settings",
      "Creative studios or workshops",
      "Laboratories or technical facilities"
    ],
    category: "environment"
  },
  {
    id: 4,
    question: "What motivates you the most?",
    options: [
      "Making a difference in people's lives",
      "Earning good money and recognition",
      "Being creative and expressing myself",
      "Solving complex problems and challenges"
    ],
    category: "motivation"
  },
  {
    id: 5,
    question: "Which activity would you choose for a school project?",
    options: [
      "Building a working model or robot",
      "Writing and presenting a research paper",
      "Creating a video or artistic presentation",
      "Organizing a community service event"
    ],
    category: "skill"
  },
  {
    id: 6,
    question: "What type of books or content do you enjoy?",
    options: [
      "Science fiction and technology magazines",
      "Biographies and self-help books",
      "Art, design, and creative magazines",
      "News, current affairs, and social issues"
    ],
    category: "interest"
  },
  {
    id: 7,
    question: "How do you prefer to spend your free time?",
    options: [
      "Playing video games or coding",
      "Reading books or studying",
      "Drawing, painting, or making music",
      "Playing sports or outdoor activities"
    ],
    category: "lifestyle"
  },
  {
    id: 8,
    question: "What type of problems do you enjoy solving?",
    options: [
      "Technical and mechanical problems",
      "People-related and emotional issues",
      "Creative and design challenges",
      "Mathematical and logical puzzles"
    ],
    category: "skill"
  }
];

const careerResults: Record<string, QuizResult> = {
  technology: {
    category: "Technology & Engineering",
    score: 0,
    careers: ["Software Developer", "Computer Engineer", "Data Scientist", "Cybersecurity Specialist", "Web Designer"],
    description: "You have a strong aptitude for technology and problem-solving. Consider pursuing computer science, engineering, or technology-related fields."
  },
  healthcare: {
    category: "Healthcare & Social Services", 
    score: 0,
    careers: ["Doctor", "Nurse", "Psychologist", "Social Worker", "Therapist"],
    description: "You show great empathy and interest in helping others. Healthcare, counseling, and social services would be excellent career paths for you."
  },
  creative: {
    category: "Arts & Creative Industries",
    score: 0,
    careers: ["Graphic Designer", "Writer", "Musician", "Artist", "Filmmaker"],
    description: "Your creative talents shine through! Consider careers in arts, design, media, or entertainment industries."
  },
  analytical: {
    category: "Business & Analytics",
    score: 0,
    careers: ["Business Analyst", "Accountant", "Researcher", "Mathematician", "Financial Advisor"],
    description: "You excel at analytical thinking and working with data. Business, finance, and research fields would suit you well."
  }
};

export default function Class10Quiz() {
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
      technology: 0,
      healthcare: 0, 
      creative: 0,
      analytical: 0
    };

    userAnswers.forEach((answer, index) => {
      switch (index) {
        case 0: // Activity preference
          if (answer === 0) scores.technology += 3;
          if (answer === 1) scores.healthcare += 3;
          if (answer === 2) scores.creative += 3;
          if (answer === 3) scores.analytical += 3;
          break;
        case 1: // Subject interest
          if (answer === 0) scores.analytical += 2;
          if (answer === 1) scores.creative += 2;
          if (answer === 2) scores.healthcare += 2;
          if (answer === 3) scores.creative += 3;
          break;
        case 2: // Work environment
          if (answer === 0) scores.healthcare += 1;
          if (answer === 1) scores.analytical += 2;
          if (answer === 2) scores.creative += 3;
          if (answer === 3) scores.technology += 3;
          break;
        case 3: // Motivation
          if (answer === 0) scores.healthcare += 3;
          if (answer === 1) scores.analytical += 2;
          if (answer === 2) scores.creative += 3;
          if (answer === 3) scores.technology += 2;
          break;
        case 4: // Project choice
          if (answer === 0) scores.technology += 3;
          if (answer === 1) scores.analytical += 2;
          if (answer === 2) scores.creative += 3;
          if (answer === 3) scores.healthcare += 3;
          break;
        case 5: // Reading preference
          if (answer === 0) scores.technology += 2;
          if (answer === 1) scores.analytical += 1;
          if (answer === 2) scores.creative += 3;
          if (answer === 3) scores.healthcare += 2;
          break;
        case 6: // Free time
          if (answer === 0) scores.technology += 3;
          if (answer === 1) scores.analytical += 2;
          if (answer === 2) scores.creative += 3;
          if (answer === 3) scores.healthcare += 1;
          break;
        case 7: // Problem solving
          if (answer === 0) scores.technology += 3;
          if (answer === 1) scores.healthcare += 3;
          if (answer === 2) scores.creative += 2;
          if (answer === 3) scores.analytical += 3;
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
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                Class 10 <span className="text-blue-600">Quiz Results</span>
              </h1>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Best Match:</h2>
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">{results.category}</h3>
                <p className="text-lg text-gray-700 mb-8">{results.description}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/50 rounded-2xl p-6">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Careers:</h4>
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
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h4>
                  <ul className="space-y-3 text-gray-700">
                    <li>• Focus on subjects related to your career interest</li>
                    <li>• Talk to professionals in these fields</li>
                    <li>• Look for internship or volunteer opportunities</li>
                    <li>• Consider relevant courses after Class 10</li>
                    <li>• Discuss with parents and career counselors</li>
                  </ul>
                </div>
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
              Class 10 <span className="text-blue-600">Career Assessment</span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover your career interests and potential paths after Class 10
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
                    <div className="flex items-center">
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
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