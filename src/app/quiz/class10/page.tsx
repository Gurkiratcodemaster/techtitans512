"use client";
import { useState, useEffect } from "react";
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
      "🖥️ Working with computers and technology",
      "🤝 Helping and caring for people", 
      "🎨 Creating art, music, or writing",
      "🔢 Working with numbers and solving problems"
    ],
    category: "interest"
  },
  {
    id: 2,
    question: "Which subject do you find most interesting?",
    options: [
      "🧮 Mathematics and Science",
      "📚 English and Literature",
      "🏛️ Social Studies and History", 
      "🎭 Art and Music"
    ],
    category: "academic"
  },
  {
    id: 3,
    question: "What kind of environment do you prefer to work in?",
    options: [
      "🌳 Outdoor and active environments",
      "📖 Quiet office or library settings",
      "🎪 Creative studios or workshops",
      "🔬 Laboratories or technical facilities"
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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Question category icons
  const getQuestionIcon = (category: string) => {
    switch (category) {
      case 'interest':
        return (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        );
      case 'academic':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'environment':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'motivation':
        return (
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'skill':
        return (
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
          </svg>
        );
      case 'lifestyle':
        return (
          <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m0 0V9a3 3 0 013-3h2.343M9 10H6a3 3 0 00-3 3v4a3 3 0 003 3h8a3 3 0 003-3v-1" />
          </svg>
        );
      default:
        return (
          <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
    }
  };

  // Option icons based on content
  const getOptionIcon = (option: string, index: number) => {
    // Technology/Computer related
    if (option.toLowerCase().includes('computer') || option.toLowerCase().includes('technology') || option.toLowerCase().includes('coding') || option.toLowerCase().includes('games') || option.toLowerCase().includes('technical')) {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    }
    // People/Healthcare related
    if (option.toLowerCase().includes('people') || option.toLowerCase().includes('caring') || option.toLowerCase().includes('help') || option.toLowerCase().includes('community') || option.toLowerCase().includes('social')) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      );
    }
    // Creative/Art related
    if (option.toLowerCase().includes('art') || option.toLowerCase().includes('music') || option.toLowerCase().includes('creative') || option.toLowerCase().includes('design') || option.toLowerCase().includes('writing') || option.toLowerCase().includes('drawing') || option.toLowerCase().includes('painting')) {
      return (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5z" />
        </svg>
      );
    }
    // Numbers/Math/Business related
    if (option.toLowerCase().includes('math') || option.toLowerCase().includes('number') || option.toLowerCase().includes('problem') || option.toLowerCase().includes('money') || option.toLowerCase().includes('business')) {
      return (
        <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
        </svg>
      );
    }
    // Sports/Outdoor related
    if (option.toLowerCase().includes('sport') || option.toLowerCase().includes('outdoor') || option.toLowerCase().includes('active') || option.toLowerCase().includes('physical')) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      );
    }
    // Reading/Study related
    if (option.toLowerCase().includes('read') || option.toLowerCase().includes('book') || option.toLowerCase().includes('study') || option.toLowerCase().includes('research')) {
      return (
        <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      );
    }
    // Default icon based on option index
    const defaultIcons = [
      <svg key={0} className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
      </svg>,
      <svg key={1} className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>,
      <svg key={2} className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
      </svg>,
      <svg key={3} className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ];
    return defaultIcons[index % 4];
  };

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    setIsTransitioning(true);

    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(currentQuestion + 1);
      } else {
        calculateResults(newAnswers);
      }
      setIsTransitioning(false);
    }, 300);
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

              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-xl font-bold text-gray-800">🎯 Ready to Explore Your Career Journey?</h4>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Discover detailed career paths, salary expectations, and the exact steps to achieve your dream career with our interactive diagrams!
                  </p>
                  <Link
                    href="/career-paths"
                    className="inline-block px-10 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white text-lg font-semibold rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
                  >
                    🚀 View Interactive Career Path Diagrams
                  </Link>
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
                  href="/career-paths"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold mr-4"
                >
                  🎯 Explore Career Paths
                </Link>
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
          <div className={`text-center mb-8 transform transition-all duration-500 delay-100 ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Class 10 <span className="text-blue-600">Career Assessment</span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover your career interests and potential paths after Class 10
            </p>
          </div>

          <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            {/* Progress Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-500 ease-out"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                ></div>
              </div>
            </div>

            {/* Question Section */}
            <div className={`mb-8 transform transition-all duration-300 ${
              isTransitioning ? 'opacity-0 translate-x-10' : 'opacity-100 translate-x-0'
            }`}>
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                  {getQuestionIcon(questions[currentQuestion].category)}
                </div>
                <div>
                  <p className="text-sm text-gray-500 uppercase tracking-wide font-medium">
                    {questions[currentQuestion].category.replace('_', ' ')}
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {questions[currentQuestion].question}
                  </h2>
                </div>
              </div>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={isTransitioning}
                    className={`w-full p-5 text-left bg-white/60 hover:bg-white/90 rounded-2xl transition-all duration-300 border-2 border-gray-200 hover:border-blue-300 hover:shadow-lg group transform hover:scale-[1.02] ${
                      isTransitioning ? 'pointer-events-none opacity-50' : ''
                    }`}
                    style={{ transitionDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-gray-100 group-hover:bg-blue-100 rounded-full mr-4 flex items-center justify-center transition-colors duration-200">
                        {getOptionIcon(option, index)}
                      </div>
                      <div className="flex-1">
                        <span className="text-gray-800 font-medium text-base leading-relaxed">
                          {option}
                        </span>
                      </div>
                      <div className="w-6 h-6 border-2 border-gray-300 group-hover:border-blue-500 rounded-full flex items-center justify-center transition-colors duration-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Question Counter Dots */}
            <div className="flex justify-center space-x-2 mt-6">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuestion ? 'bg-blue-600 w-6' :
                    index < currentQuestion ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}