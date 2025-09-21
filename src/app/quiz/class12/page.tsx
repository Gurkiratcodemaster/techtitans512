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
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Get icon for question category
  const getQuestionIcon = (category: string) => {
    switch (category) {
      case 'stream':
        return (
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
        );
      case 'vision':
      case 'career_path':
        return (
          <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        );
      case 'exam':
        return (
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case 'environment':
        return (
          <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'subjects':
      case 'education':
        return (
          <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'motivation':
      case 'impact':
        return (
          <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        );
      case 'skills':
        return (
          <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
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
    if (option.toLowerCase().includes('science') || option.toLowerCase().includes('pcm') || option.toLowerCase().includes('pcb')) {
      return (
        <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      );
    }
    if (option.toLowerCase().includes('commerce') || option.toLowerCase().includes('business') || option.toLowerCase().includes('finance')) {
      return (
        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
        </svg>
      );
    }
    if (option.toLowerCase().includes('medical') || option.toLowerCase().includes('doctor') || option.toLowerCase().includes('health') || option.toLowerCase().includes('neet')) {
      return (
        <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      );
    }
    if (option.toLowerCase().includes('engineering') || option.toLowerCase().includes('jee') || option.toLowerCase().includes('technology') || option.toLowerCase().includes('iit')) {
      return (
        <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
        </svg>
      );
    }
    if (option.toLowerCase().includes('arts') || option.toLowerCase().includes('law') || option.toLowerCase().includes('creative') || option.toLowerCase().includes('journalism')) {
      return (
        <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h2a2 2 0 002-2V5z" />
        </svg>
      );
    }
    
    const defaultIcons = [
      <svg key={0} className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>,
      <svg key={1} className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg key={2} className="w-5 h-5 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>,
      <svg key={3} className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ];
    return defaultIcons[index % 4];
  };

  const handleAnswer = (answerIndex: number) => {
    setIsTransitioning(true);
    
    setTimeout(() => {
      const newAnswers = [...answers, answerIndex];
      setAnswers(newAnswers);

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

              <div className="mt-8 bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200">
                <div className="text-center">
                  <div className="flex items-center justify-center mb-4">
                    <svg className="w-8 h-8 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h4 className="text-xl font-bold text-gray-800">🎯 Ready to Explore Your Career Journey?</h4>
                  </div>
                  <p className="text-gray-700 mb-6">
                    Discover interactive diagrams showing exact paths from your chosen degree to dream careers, including entrance exams, specializations, and salary expectations!
                  </p>
                  <Link
                    href="/career-results"
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
                  href="/career-results"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold mr-4"
                >
                  🎯 View Interactive Career Path
                </Link>
                
                <Link
                  href="/"
                  className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold"
                >
                  Back to Home
                </Link>
              </div>
              
              <div className="mt-6 bg-blue-50 rounded-2xl p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Important Reminder:</h4>
                <p className="text-gray-700">
                  This quiz provides guidance based on your interests and preferences. Remember that success in any field requires dedication, hard work, and continuous learning. Consider talking to career counselors, professionals in your chosen field, and taking aptitude tests for more comprehensive career guidance.
                </p>
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
          <div className={`text-center mb-8 transition-opacity duration-1000 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Class 12 <span className="text-blue-600">Career Assessment</span>
            </h1>
            <p className="text-lg text-gray-600">
              Discover your ideal career path and college options after Class 12
            </p>
          </div>

          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <span className="text-sm font-medium text-gray-600">
                  Question {currentQuestion + 1} of {questions.length}
                </span>
                <span className="text-sm font-medium text-blue-600">
                  {Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 relative"
                  style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                >
                  <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                </div>
              </div>

              {/* Progress dots */}
              <div className="flex justify-center space-x-2 mt-4">
                {questions.map((_, index) => (
                  <div 
                    key={index}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentQuestion
                        ? 'bg-blue-600 scale-125'
                        : index < currentQuestion
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  ></div>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <div className="flex items-center mb-6">
                {getQuestionIcon(questions[currentQuestion].category)}
                <h2 className="text-2xl font-bold text-gray-800 ml-3">
                  {questions[currentQuestion].question}
                </h2>
              </div>

              <div className="space-y-4">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(index)}
                    disabled={isTransitioning}
                    className={`w-full p-4 text-left bg-white/50 hover:bg-white/80 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] group ${
                      isTransitioning ? 'cursor-not-allowed opacity-50' : ''
                    }`}
                  >
                    <div className="flex items-start">
                      <div className="w-8 h-8 bg-gray-100 rounded-full mr-4 flex items-center justify-center mt-1 group-hover:bg-blue-50 transition-colors duration-200">
                        {getOptionIcon(option, index)}
                      </div>
                      <span className="text-gray-700 font-medium flex-1">{option}</span>
                      <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center mt-1 group-hover:border-blue-400 transition-colors duration-200">
                        <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                      </div>
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