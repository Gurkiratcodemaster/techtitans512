"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { ClientDatabaseService } from "@/lib/database";
import { COLORS, BACKGROUNDS, ANIMATIONS } from "@/lib/theme";

interface QuizQuestion {
  id: number | string;
  question: string;
  question_text?: string; // For database compatibility
  options: string[];
  correct_answer?: number;
  category: string;
}

interface QuizResult {
  category: string;
  score: number;
  totalQuestions?: number;
  maxScore?: number;
  percentage: number;
  careers: string[];
  description: string;
  recommendations?: string[];
  colleges?: string[];
}

interface UnifiedQuizProps {
  quizType: 'aptitude' | 'class10' | 'class12';
  title?: string;
  subtitle?: string;
  className?: string;
}

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { 
    opacity: 1, 
    scale: 1, 
    y: 0
  },
  exit: { 
    opacity: 0, 
    scale: 0.95, 
    y: -20
  }
};

const questionVariants = {
  initial: { opacity: 0, x: 50 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -50 }
};

const resultVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 }
};

// Default quiz questions for each type
const getDefaultQuestions = (quizType: string): QuizQuestion[] => {
  switch (quizType) {
    case 'aptitude':
      return [
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
        {
          id: 5,
          question: "Which word is the odd one out?",
          options: ["Happy", "Joyful", "Elated", "Sad"],
          category: 'verbal'
        }
      ];
    
    case 'class10':
      return [
        {
          id: 1,
          question: "Which subject interests you the most?",
          options: ["Science", "Mathematics", "Arts", "Commerce"],
          category: 'interest'
        },
        {
          id: 2,
          question: "What type of activities do you enjoy?",
          options: ["Experiments", "Problem Solving", "Creative Work", "Business Activities"],
          category: 'activity'
        },
        {
          id: 3,
          question: "Which career sounds most appealing?",
          options: ["Doctor/Engineer", "Researcher", "Artist/Writer", "Entrepreneur"],
          category: 'career_preference'
        }
      ];
    
    case 'class12':
      return [
        {
          id: 1,
          question: "What is your preferred stream?",
          options: ["Science (PCM)", "Science (PCB)", "Commerce", "Arts"],
          category: 'stream'
        },
        {
          id: 2,
          question: "Which entrance exam are you preparing for?",
          options: ["JEE Main/Advanced", "NEET", "CAT/MAT", "CLAT"],
          category: 'exam'
        },
        {
          id: 3,
          question: "What is your career goal?",
          options: ["Engineering", "Medical", "Business", "Law/Government"],
          category: 'goal'
        }
      ];
    
    default:
      return [];
  }
};

// Default result configurations
const getResultConfigurations = (quizType: string): Record<string, Omit<QuizResult, 'score' | 'percentage'>> => {
  switch (quizType) {
    case 'aptitude':
      return {
        logical: {
          category: "Logical Reasoning",
          careers: ["Software Developer", "Data Analyst", "Management Consultant"],
          description: "You have strong logical thinking skills suitable for analytical careers.",
          recommendations: ["Consider programming courses", "Practice analytical thinking", "Explore data science"]
        },
        mathematical: {
          category: "Mathematical Skills",
          careers: ["Engineer", "Mathematician", "Financial Analyst"],
          description: "You excel in mathematical problem-solving.",
          recommendations: ["Pursue engineering", "Consider actuarial science", "Explore quantitative finance"]
        },
        verbal: {
          category: "Verbal Skills",
          careers: ["Writer", "Teacher", "Journalist"],
          description: "You have excellent communication and language skills.",
          recommendations: ["Consider content writing", "Explore journalism", "Think about teaching"]
        }
      };
    
    case 'class10':
      return {
        science: {
          category: "Science Stream",
          careers: ["Doctor", "Engineer", "Researcher", "Scientist"],
          description: "You show strong interest in scientific subjects and problem-solving.",
          recommendations: ["Take Science in Class 11-12", "Prepare for JEE/NEET", "Join science clubs"],
          colleges: ["IIT", "NIT", "AIIMS", "Top Medical Colleges"]
        },
        arts: {
          category: "Arts Stream", 
          careers: ["Lawyer", "Teacher", "Writer", "Civil Servant"],
          description: "You have strong creative and analytical thinking skills.",
          recommendations: ["Consider Arts stream", "Prepare for CLAT", "Develop writing skills"],
          colleges: ["Delhi University", "JNU", "BHU", "Top Law Schools"]
        }
      };
    
    case 'class12':
      return {
        engineering: {
          category: "Engineering",
          careers: ["Software Engineer", "Mechanical Engineer", "Civil Engineer"],
          description: "Your skills align well with engineering disciplines.",
          recommendations: ["Focus on JEE preparation", "Practice mathematics", "Learn programming"],
          colleges: ["IIT Delhi", "IIT Bombay", "NIT Trichy", "BITS Pilani"]
        },
        medical: {
          category: "Medical",
          careers: ["Doctor", "Surgeon", "Medical Researcher"],
          description: "You show aptitude for medical sciences.",
          recommendations: ["Prepare for NEET", "Focus on Biology", "Volunteer at hospitals"],
          colleges: ["AIIMS Delhi", "CMC Vellore", "JIPMER", "King George Medical University"]
        }
      };
    
    default:
      return {};
  }
};

export default function UnifiedQuiz({ 
  quizType, 
  title, 
  subtitle, 
  className = "" 
}: UnifiedQuizProps) {
  const { user } = useAuth();
  const router = useRouter();
  
  // State management
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load questions on component mount
  useEffect(() => {
    loadQuestions();
  }, [quizType]);

  const loadQuestions = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Try to fetch from API first, fall back to default questions
      try {
        const response = await fetch(`/api/quiz-questions?type=${quizType}`);
        if (response.ok) {
          const data = await response.json();
          if (data.questions && data.questions.length > 0) {
            setQuestions(data.questions.map((q: any) => ({
              ...q,
              question: q.question_text || q.question
            })));
            return;
          }
        }
      } catch (apiError) {
        console.log('API not available, using default questions');
      }
      
      // Use default questions
      const defaultQuestions = getDefaultQuestions(quizType);
      setQuestions(defaultQuestions);
      
    } catch (error) {
      console.error('Error loading questions:', error);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (optionIndex: number) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [currentQuestionIndex]: optionIndex
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const calculateResults = (): QuizResult[] => {
    const resultConfigs = getResultConfigurations(quizType);
    const categoryScores: Record<string, { correct: number; total: number }> = {};

    // Calculate scores by category
    questions.forEach((question, index) => {
      const userAnswer = selectedAnswers[index];
      const category = question.category;
      
      if (!categoryScores[category]) {
        categoryScores[category] = { correct: 0, total: 0 };
      }
      
      categoryScores[category].total += 1;
      
      // For aptitude quiz, check correct answer
      if (quizType === 'aptitude' && question.correct_answer !== undefined) {
        if (userAnswer === question.correct_answer) {
          categoryScores[category].correct += 1;
        }
      } else {
        // For other quizzes, just count selections
        if (userAnswer !== undefined) {
          categoryScores[category].correct += 1;
        }
      }
    });

    // Generate results
    return Object.entries(categoryScores).map(([category, scores]) => {
      const percentage = (scores.correct / scores.total) * 100;
      const config = resultConfigs[category] || {
        category: category.charAt(0).toUpperCase() + category.slice(1),
        careers: [],
        description: `Results for ${category}`,
        recommendations: []
      };

      return {
        ...config,
        score: scores.correct,
        totalQuestions: scores.total,
        maxScore: scores.total,
        percentage: Math.round(percentage)
      };
    });
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);
    setError(null);

    try {
      const calculatedResults = calculateResults();
      setResults(calculatedResults);
      setQuizCompleted(true);

      // Save results to database if user is logged in
      if (user) {
        try {
          await ClientDatabaseService.saveQuizResults({
            userId: user.id,
            quizType: quizType,
            responses: selectedAnswers,
            scores: calculatedResults.reduce((acc, result) => {
              acc[result.category] = result.percentage;
              return acc;
            }, {} as Record<string, number>),
            recommendations: calculatedResults.flatMap(r => r.recommendations || []),
            completedAt: new Date().toISOString()
          });
        } catch (dbError) {
          console.error('Failed to save quiz results:', dbError);
          // Don't block the UI for database errors
        }
      }

    } catch (error) {
      console.error('Error calculating results:', error);
      setError('Failed to calculate results. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getQuizTitle = () => {
    if (title) return title;
    
    switch (quizType) {
      case 'aptitude':
        return 'Aptitude Assessment';
      case 'class10':
        return 'Class 10 Career Guidance';
      case 'class12':
        return 'Class 12 Stream Selection';
      default:
        return 'Career Quiz';
    }
  };

  const getQuizSubtitle = () => {
    if (subtitle) return subtitle;
    
    switch (quizType) {
      case 'aptitude':
        return 'Discover your strengths and suitable career paths';
      case 'class10':
        return 'Find the right stream for your interests and goals';
      case 'class12':
        return 'Get personalized recommendations for your future';
      default:
        return 'Take this quiz to explore your career options';
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${BACKGROUNDS.GRADIENT_PRIMARY} flex items-center justify-center ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${BACKGROUNDS.GRADIENT_PRIMARY} flex items-center justify-center ${className}`}>
        <div className="text-center bg-white rounded-lg p-8 shadow-xl max-w-md">
          <div className="text-red-500 text-4xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Quiz</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={loadQuestions}
            className={`px-6 py-2 bg-gradient-to-r ${COLORS.GRADIENT_PRIMARY} text-white rounded-lg hover:shadow-lg transition-all duration-300`}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Quiz completed - show results
  if (quizCompleted) {
    return (
      <div className={`min-h-screen bg-gradient-to-br ${BACKGROUNDS.GRADIENT_PRIMARY} py-8 ${className}`}>
        <div className="container mx-auto px-4">
          <motion.div
            variants={resultVariants}
            initial="initial"
            animate="animate"
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold text-white mb-2">Quiz Completed! 🎉</h1>
              <p className="text-xl text-white/80">Here are your personalized results</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {results.map((result, index) => (
                <motion.div
                  key={result.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-white/95 backdrop-blur-sm rounded-2xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-bold text-gray-800">{result.category}</h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                      result.percentage >= 80 ? 'bg-green-100 text-green-800' :
                      result.percentage >= 60 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-red-100 text-red-800'
                    }`}>
                      {result.percentage}%
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">{result.description}</p>
                  
                  <div className="mb-4">
                    <h4 className="font-semibold text-gray-800 mb-2">Recommended Careers:</h4>
                    <div className="flex flex-wrap gap-2">
                      {result.careers.map((career) => (
                        <span
                          key={career}
                          className={`px-3 py-1 bg-gradient-to-r ${COLORS.GRADIENT_SECONDARY} text-white rounded-full text-sm`}
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>

                  {result.recommendations && result.recommendations.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-800 mb-2">Recommendations:</h4>
                      <ul className="list-disc list-inside text-sm text-gray-600 space-y-1">
                        {result.recommendations.map((rec, i) => (
                          <li key={i}>{rec}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.colleges && result.colleges.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-2">Top Colleges:</h4>
                      <div className="flex flex-wrap gap-2">
                        {result.colleges.map((college) => (
                          <span
                            key={college}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs"
                          >
                            {college}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="text-center mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push('/recommendations')}
                className={`px-8 py-3 bg-gradient-to-r ${COLORS.GRADIENT_PRIMARY} text-white rounded-lg font-semibold hover:shadow-lg transition-all duration-300`}
              >
                View Detailed Recommendations
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Quiz in progress
  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;
  const selectedAnswer = selectedAnswers[currentQuestionIndex];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${BACKGROUNDS.GRADIENT_PRIMARY} ${className}`}>
      <div className="container mx-auto px-4 py-8">
        <motion.div
          variants={pageVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="max-w-3xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">{getQuizTitle()}</h1>
            <p className="text-xl text-white/80 mb-4">{getQuizSubtitle()}</p>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div 
                className={`h-2 bg-gradient-to-r ${COLORS.GRADIENT_SECONDARY} rounded-full transition-all duration-300`}
                style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
            <p className="text-white/80 mt-2">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>

          {/* Question Card */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIndex}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3 }}
              className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-xl"
            >
              <motion.div
                variants={questionVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  {currentQuestion?.question}
                </h2>

                <div className="space-y-4">
                  {currentQuestion?.options.map((option, index) => (
                    <motion.button
                      key={index}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 text-left rounded-lg transition-all duration-300 border-2 ${
                        selectedAnswer === index
                          ? `border-blue-500 bg-blue-50 shadow-md`
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center ${
                          selectedAnswer === index
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300'
                        }`}>
                          {selectedAnswer === index && (
                            <div className="w-2 h-2 bg-white rounded-full" />
                          )}
                        </div>
                        <span className="text-gray-700 font-medium">{option}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation */}
          <div className="flex justify-between items-center mt-8">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                currentQuestionIndex === 0
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'bg-white/20 text-white hover:bg-white/30 hover:shadow-lg'
              }`}
            >
              Previous
            </button>

            <div className="flex space-x-2">
              {questions.map((_, index) => (
                <div
                  key={index}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentQuestionIndex
                      ? 'bg-white'
                      : selectedAnswers[index] !== undefined
                      ? 'bg-white/60'
                      : 'bg-white/20'
                  }`}
                />
              ))}
            </div>

            {isLastQuestion ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSubmitQuiz}
                disabled={selectedAnswer === undefined || isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedAnswer === undefined || isSubmitting
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : `bg-gradient-to-r ${COLORS.GRADIENT_ACCENT} text-white hover:shadow-lg`
                }`}
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </motion.button>
            ) : (
              <button
                onClick={handleNextQuestion}
                disabled={selectedAnswer === undefined}
                className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 ${
                  selectedAnswer === undefined
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                    : 'bg-white/20 text-white hover:bg-white/30 hover:shadow-lg'
                }`}
              >
                Next
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}