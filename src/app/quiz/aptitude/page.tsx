"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  category: 'logical' | 'mathematical' | 'verbal' | 'spatial' | 'technical';
}

interface QuizResult {
  category: string;
  score: number;
  maxScore: number;
  percentage: number;
}

const quizQuestions: QuizQuestion[] = [
  // Logical Reasoning
  {
    id: 1,
    question: "If all roses are flowers and some flowers are red, which statement is definitely true?",
    options: [
      "All roses are red",
      "Some roses might be red",
      "No roses are red",
      "All flowers are roses"
    ],
    category: 'logical'
  },
  {
    id: 2,
    question: "What comes next in the sequence: 2, 6, 12, 20, 30, ?",
    options: ["40", "42", "44", "46"],
    category: 'logical'
  },

  // Mathematical
  {
    id: 3,
    question: "If a train travels 240 km in 3 hours, what is its speed in km/h?",
    options: ["70", "75", "80", "85"],
    category: 'mathematical'
  },
  {
    id: 4,
    question: "What is 15% of 240?",
    options: ["32", "36", "38", "42"],
    category: 'mathematical'
  },

  // Verbal
  {
    id: 5,
    question: "Choose the word that best completes the analogy: Book : Pages :: Computer : ?",
    options: ["Monitor", "Keyboard", "Programs", "Mouse"],
    category: 'verbal'
  },
  {
    id: 6,
    question: "Which word is the antonym of 'Abundant'?",
    options: ["Plentiful", "Scarce", "Sufficient", "Ample"],
    category: 'verbal'
  },

  // Spatial
  {
    id: 7,
    question: "If you fold a square paper in half twice, how many layers will you have?",
    options: ["2", "3", "4", "8"],
    category: 'spatial'
  },

  // Technical
  {
    id: 8,
    question: "Which of the following is NOT a programming language?",
    options: ["Python", "JavaScript", "HTML", "Photoshop"],
    category: 'technical'
  }
];

const correctAnswers: { [key: number]: number } = {
  1: 1, // Some roses might be red
  2: 1, // 42
  3: 2, // 80
  4: 1, // 36
  5: 2, // Programs
  6: 1, // Scarce
  7: 2, // 4
  8: 3  // Photoshop
};

export default function AptitudeQuizPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: number]: number }>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (quizStarted && timeLeft > 0 && !quizCompleted) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleQuizSubmit();
    }
  }, [timeLeft, quizStarted, quizCompleted]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (questionId: number, answerIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answerIndex
    }));
  };

  const handleNext = () => {
    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const calculateResults = () => {
    const categoryScores: { [key: string]: { correct: number, total: number } } = {};
    
    quizQuestions.forEach(question => {
      if (!categoryScores[question.category]) {
        categoryScores[question.category] = { correct: 0, total: 0 };
      }
      categoryScores[question.category].total++;
      
      if (selectedAnswers[question.id] === correctAnswers[question.id]) {
        categoryScores[question.category].correct++;
      }
    });

    const results: QuizResult[] = Object.entries(categoryScores).map(([category, scores]) => ({
      category: category.charAt(0).toUpperCase() + category.slice(1),
      score: scores.correct,
      maxScore: scores.total,
      percentage: Math.round((scores.correct / scores.total) * 100)
    }));

    return results;
  };

  const handleQuizSubmit = () => {
    const results = calculateResults();
    setResults(results);
    setQuizCompleted(true);

    // Save quiz results to user profile
    try {
      const profileData = localStorage.getItem('userProfile');
      if (profileData) {
        const profile = JSON.parse(profileData);
        profile.quizResults = {
          aptitudeTest: results,
          completedAt: new Date().toISOString(),
          totalScore: results.reduce((sum, r) => sum + r.score, 0),
          maxPossibleScore: results.reduce((sum, r) => sum + r.maxScore, 0)
        };
        localStorage.setItem('userProfile', JSON.stringify(profile));
      }
    } catch (error) {
      console.log('Error saving quiz results');
    }
  };

  const getRecommendationsBasedOnResults = () => {
    const strongAreas = results.filter(r => r.percentage >= 75);
    const recommendations = [];

    if (strongAreas.some(area => area.category === 'Mathematical' || area.category === 'Logical')) {
      recommendations.push("Consider engineering fields like Computer Science, Mechanical, or Electrical Engineering");
    }
    if (strongAreas.some(area => area.category === 'Verbal')) {
      recommendations.push("Explore careers in Journalism, Literature, Law, or Content Writing");
    }
    if (strongAreas.some(area => area.category === 'Technical')) {
      recommendations.push("Technology careers like Software Development, IT, or Data Science would suit you");
    }
    if (strongAreas.some(area => area.category === 'Spatial')) {
      recommendations.push("Consider Architecture, Design, or Engineering fields");
    }

    return recommendations;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!quizStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        
        <div className="pt-20 px-8">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-4">Aptitude Assessment</h1>
              <p className="text-lg text-gray-600">
                Take this assessment to get more personalized career recommendations
              </p>
            </div>

            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="space-y-6">
                <div className="flex items-center justify-center mb-6">
                  <svg className="w-16 h-16 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>

                <h2 className="text-2xl font-bold text-center text-gray-800 mb-4">Assessment Details</h2>
                
                <div className="space-y-4 text-gray-700">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Duration:</strong> 10 minutes</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Questions:</strong> {quizQuestions.length} questions</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Categories:</strong> Logical, Mathematical, Verbal, Spatial, Technical</span>
                  </div>
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-green-500 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span><strong>Result:</strong> Personalized career recommendations</span>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-6">
                  <h3 className="font-semibold text-blue-800 mb-2">Instructions:</h3>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Read each question carefully</li>
                    <li>• Select the best answer from the given options</li>
                    <li>• You can navigate between questions</li>
                    <li>• The quiz will auto-submit after 10 minutes</li>
                  </ul>
                </div>

                <button
                  onClick={() => setQuizStarted(true)}
                  className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg shadow-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
                >
                  Start Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (quizCompleted) {
    const recommendations = getRecommendationsBasedOnResults();
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        
        <div className="pt-20 px-8 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Assessment Complete! 🎉</h1>
              <p className="text-lg text-gray-600">Here are your results and recommendations</p>
            </div>

            {/* Results Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {results.map(result => (
                <div key={result.category} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{result.category}</h3>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {result.percentage}%
                  </div>
                  <p className="text-gray-600">
                    {result.score}/{result.maxScore} correct
                  </p>
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-3">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${result.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Recommendations */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Recommendations</h2>
              <div className="space-y-4">
                {recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start">
                    <svg className="w-5 h-5 text-green-500 mr-3 mt-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
                {recommendations.length === 0 && (
                  <p className="text-gray-600">
                    Your results show balanced abilities across different areas. Consider exploring multiple career paths to find what interests you most!
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => router.push('/recommendations')}
                className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-semibold shadow-lg"
              >
                View Updated Recommendations
              </button>
              <button
                onClick={() => router.push('/chatbot')}
                className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 font-semibold shadow-lg"
              >
                Chat with AI Counselor
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = quizQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      
      <div className="pt-20 px-8">
        <div className="max-w-2xl mx-auto">
          {/* Header with Timer */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-800">Aptitude Assessment</h1>
              <p className="text-gray-600">Question {currentQuestion + 1} of {quizQuestions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">{formatTime(timeLeft)}</div>
              <p className="text-sm text-gray-500">Time remaining</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-8">
            <div 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
              style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
            ></div>
          </div>

          {/* Question Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
            <div className="mb-6">
              <span className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full font-medium">
                {currentQ.category.charAt(0).toUpperCase() + currentQ.category.slice(1)}
              </span>
            </div>
            
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <label 
                  key={index} 
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                    selectedAnswers[currentQ.id] === index
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <input
                    type="radio"
                    name={`question-${currentQ.id}`}
                    value={index}
                    checked={selectedAnswers[currentQ.id] === index}
                    onChange={() => handleAnswerSelect(currentQ.id, index)}
                    className="sr-only"
                  />
                  <div className="flex items-center">
                    <div className={`w-5 h-5 rounded-full border-2 mr-3 ${
                      selectedAnswers[currentQ.id] === index
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-gray-300'
                    }`}>
                      {selectedAnswers[currentQ.id] === index && (
                        <div className="w-full h-full rounded-full bg-white transform scale-50"></div>
                      )}
                    </div>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <button
              onClick={handlePrevious}
              disabled={currentQuestion === 0}
              className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <span className="text-gray-600">
              {selectedAnswers[currentQ.id] !== undefined ? '✓' : '○'} Question {currentQuestion + 1}
            </span>

            {currentQuestion === quizQuestions.length - 1 ? (
              <button
                onClick={handleQuizSubmit}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Submit Quiz
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
              >
                Next
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}