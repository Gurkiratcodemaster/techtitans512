"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import Link from "next/link";
import { fetchQuizQuestions, saveQuizResult } from "@/lib/supabaseClient";
import { useAuth } from "@/contexts/AuthContext";

interface Question {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: number;
  category: string;
}

interface QuizResult {
  category: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  careers: string[];
  description: string;
  recommendations: string[];
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
  animate: { 
    opacity: 1, 
    x: 0
  },
  exit: { 
    opacity: 0, 
    x: -50
  }
};

const optionVariants = {
  initial: { opacity: 0, y: 20 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { 
      delay: i * 0.1,
      duration: 0.4
    }
  }),
  hover: { 
    scale: 1.02,
    y: -2
  },
  tap: { scale: 0.98 }
};

const progressVariants = {
  initial: { width: "0%" },
  animate: (progress: number) => ({
    width: `${progress}%`
  })
};

const resultVariants = {
  initial: { opacity: 0, scale: 0.8 },
  animate: {
    opacity: 1,
    scale: 1
  }
};

const resultItemVariants = {
  initial: { opacity: 0, y: 20 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4 }
  }
};

export default function Class10Quiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loaded, setLoaded] = useState(false);

  // Quiz state
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        setIsLoading(true);
        // Mock questions for Class 10 students
        const mockQuestions: Question[] = [
          {
            id: '1',
            question_text: 'Which subject do you enjoy the most?',
            options: ['Mathematics', 'Science', 'History', 'Literature'],
            correct_answer: 0,
            category: 'interest'
          },
          {
            id: '2',
            question_text: 'What type of activities do you prefer?',
            options: ['Problem solving', 'Creative writing', 'Experiments', 'Reading'],
            correct_answer: 0,
            category: 'activity'
          },
          {
            id: '3',
            question_text: 'Which career field interests you most?',
            options: ['Technology', 'Medicine', 'Business', 'Arts'],
            correct_answer: 0,
            category: 'career'
          },
          {
            id: '4',
            question_text: 'How do you prefer to work?',
            options: ['Independently', 'In teams', 'With guidance', 'Leading others'],
            correct_answer: 0,
            category: 'work_style'
          },
          {
            id: '5',
            question_text: 'What motivates you the most?',
            options: ['Solving complex problems', 'Helping others', 'Creating new things', 'Achieving goals'],
            correct_answer: 0,
            category: 'motivation'
          }
        ];

        try {
          const data = await fetchQuizQuestions(10);
          if (data && data.length > 0) {
            setQuestions(data);
          } else {
            setQuestions(mockQuestions);
          }
        } catch (error) {
          console.log('Using mock data due to error:', error);
          setQuestions(mockQuestions);
        }

      } catch (error) {
        console.error('Error loading questions:', error);
        setError('Failed to load quiz questions');
      } finally {
        setIsLoading(false);
        setTimeout(() => setLoaded(true), 100);
      }
    };

    loadQuestions();
  }, []);

  // Calculate results based on answers
  const calculateResults = (userAnswers: number[]): QuizResult => {
    const categoryScores: Record<string, number> = {};
    const totalQuestions = questions.length;
    let correctAnswers = 0;

    // Calculate scores
    questions.forEach((question, index) => {
      const userAnswer = userAnswers[index];
      const category = question.category;
      
      if (!categoryScores[category]) {
        categoryScores[category] = 0;
      }
      
      // Award points based on answer choice (simplified scoring)
      categoryScores[category] += userAnswer + 1;
      
      // Check if answer is correct (if we have correct answers)
      if (question.correct_answer !== undefined && userAnswer === question.correct_answer) {
        correctAnswers++;
      }
    });

    // Determine top category
    const topCategory = Object.keys(categoryScores).reduce((a, b) =>
      categoryScores[a] > categoryScores[b] ? a : b
    );

    // Generate recommendations based on top category
    const recommendations = generateRecommendations(topCategory, categoryScores);
    
    const percentage = Math.round((correctAnswers / totalQuestions) * 100);

    return {
      category: recommendations.category,
      score: correctAnswers,
      totalQuestions,
      percentage,
      careers: recommendations.careers,
      description: recommendations.description,
      recommendations: recommendations.recommendations
    };
  };

  const generateRecommendations = (topCategory: string, scores: Record<string, number>) => {
    const categoryMap: Record<string, any> = {
      interest: {
        category: 'STEM Fields',
        careers: ['Engineer', 'Data Scientist', 'Researcher', 'Software Developer'],
        description: 'You show strong interest in analytical and technical subjects. STEM careers would be an excellent fit for your interests.',
        recommendations: [
          'Focus on Mathematics and Science subjects',
          'Participate in science fairs and coding competitions',
          'Consider engineering entrance exam preparation',
          'Explore internships in tech companies'
        ]
      },
      activity: {
        category: 'Creative & Analytical',
        careers: ['Architect', 'Graphic Designer', 'Marketing Analyst', 'Product Manager'],
        description: 'You enjoy both creative and analytical activities. Consider careers that blend creativity with problem-solving.',
        recommendations: [
          'Develop both technical and creative skills',
          'Explore design and analytics courses',
          'Build a portfolio of creative projects',
          'Consider business and design programs'
        ]
      },
      career: {
        category: 'Technology & Innovation',
        careers: ['Software Engineer', 'Cybersecurity Analyst', 'AI/ML Engineer', 'Tech Entrepreneur'],
        description: 'Your interest in technology suggests a bright future in the tech industry. Consider specializing in emerging technologies.',
        recommendations: [
          'Learn programming languages',
          'Stay updated with latest tech trends',
          'Participate in hackathons and tech competitions',
          'Consider computer science or related fields'
        ]
      },
      work_style: {
        category: 'Leadership & Management',
        careers: ['Project Manager', 'Business Analyst', 'Consultant', 'Team Lead'],
        description: 'Your work style indicates leadership potential. Consider careers where you can guide teams and projects.',
        recommendations: [
          'Develop communication and leadership skills',
          'Take on leadership roles in school projects',
          'Consider business management courses',
          'Learn project management methodologies'
        ]
      },
      motivation: {
        category: 'Problem Solving & Innovation',
        careers: ['Research Scientist', 'Innovation Manager', 'Systems Analyst', 'Strategy Consultant'],
        description: 'Your motivation for problem-solving suggests careers in research and strategic thinking would suit you well.',
        recommendations: [
          'Engage in research projects',
          'Develop critical thinking skills',
          'Consider science or engineering research',
          'Explore strategy and consulting roles'
        ]
      }
    };

    return categoryMap[topCategory] || categoryMap.interest;
  };

  const handleAnswer = async (optionIndex: number) => {
    if (isTransitioning) return;
    
    setIsTransitioning(true);
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);

    // Wait for exit animation
    await new Promise(resolve => setTimeout(resolve, 300));

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate and show results
      const quizResult = calculateResults(newAnswers);
      setResults(quizResult);
      
      // Save results to Supabase if user is logged in
      if (user) {
        try {
          await saveQuizResult({
            user_id: user.id,
            class_level: 10,
            score: quizResult.score,
            total_questions: quizResult.totalQuestions,
            answers: newAnswers,
            category_scores: {},
            recommendations: quizResult.recommendations
          });
        } catch (error) {
          console.error('Error saving quiz result:', error);
        }
      }
      
      setShowResults(true);
    }
    
    setIsTransitioning(false);
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
    setResults(null);
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <motion.div
            className="text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.div
              className="text-xl font-semibold text-gray-700"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading Quiz...
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <motion.div
            className="text-center p-8 bg-white rounded-2xl shadow-lg"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-red-600 text-xl font-semibold mb-4">Error loading quiz</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Go Home
            </Link>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      <Navbar />
      <HeroSection 
        title={showResults ? "Your Quiz Results" : "Class 10 Career Assessment"}
        subtitle={showResults ? "Here's what we recommend based on your answers" : "Discover your career interests and potential paths after Class 10"}
        loaded={loaded}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {showResults && results ? (
              // Results Card
              <motion.div
                key="results"
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
                variants={resultVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div className="text-center mb-8" variants={resultItemVariants}>
                  <motion.div 
                    className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </motion.div>
                  <motion.h2 
                    className="text-3xl font-bold text-gray-800 mb-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Your Best Match:
                  </motion.h2>
                  <motion.h3 
                    className="text-2xl font-semibold text-blue-600 mb-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    {results.category}
                  </motion.h3>
                  <motion.div
                    className="text-lg font-medium text-gray-700 mb-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    Score: {results.score}/{results.totalQuestions} ({results.percentage}%)
                  </motion.div>
                  <motion.p 
                    className="text-lg text-gray-700 mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    {results.description}
                  </motion.p>
                </motion.div>

                <motion.div 
                  className="grid md:grid-cols-2 gap-8"
                  variants={resultItemVariants}
                >
                  <motion.div 
                    className="bg-white/50 rounded-2xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Careers:</h4>
                    <motion.ul className="space-y-2">
                      {results.careers.map((career, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center text-gray-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.6 + i * 0.1 }}
                        >
                          <motion.div 
                            className="w-2 h-2 bg-blue-600 rounded-full mr-3"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.7 + i * 0.1 }}
                          />
                          {career}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>

                  <motion.div 
                    className="bg-white/50 rounded-2xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h4>
                    <motion.ul className="space-y-3 text-gray-700">
                      {results.recommendations.map((step, i) => (
                        <motion.li 
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.8 + i * 0.1 }}
                        >
                          • {step}
                        </motion.li>
                      ))}
                    </motion.ul>
                  </motion.div>
                </motion.div>

                <motion.div 
                  className="text-center mt-12 space-x-4"
                  variants={resultItemVariants}
                >
                  <motion.button
                    onClick={restartQuiz}
                    className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retake Quiz
                  </motion.button>
                  <Link href="/career-paths">
                    <motion.span
                      className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:to-blue-700 transition-all duration-300 font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore Career Paths
                    </motion.span>
                  </Link>
                  <Link href="/">
                    <motion.span
                      className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Back to Home
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              // Quiz Card
              <motion.div
                key="quiz"
                className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                {questions.length > 0 ? (
                  <>
                    {/* Progress Section */}
                    <motion.div className="mb-6" layout>
                      <div className="flex justify-between items-center mb-4">
                        <motion.span 
                          className="text-sm font-medium text-gray-600"
                          key={`question-${currentQuestion}`}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          Question {currentQuestion + 1} of {questions.length}
                        </motion.span>
                        <motion.span 
                          className="text-sm font-medium text-blue-600"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          {Math.round(progress)}% Complete
                        </motion.span>
                      </div>

                      {/* Animated Progress Bar */}
                      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full relative"
                          variants={progressVariants}
                          initial="initial"
                          animate="animate"
                          custom={progress}
                        >
                          <motion.div
                            className="absolute top-0 left-0 w-full h-full bg-white/20"
                            animate={{ x: ["0%", "100%", "0%"] }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          />
                        </motion.div>
                      </div>

                      {/* Progress Dots */}
                      <div className="flex justify-center space-x-2 mt-4">
                        {questions.map((_, index) => (
                          <motion.div
                            key={index}
                            className={`w-2 h-2 rounded-full ${
                              index === currentQuestion ? 'bg-blue-600' : 
                              index < currentQuestion ? 'bg-blue-400' : 'bg-gray-300'
                            }`}
                            animate={{
                              scale: index === currentQuestion ? 1.25 : 1,
                            }}
                            transition={{ duration: 0.3 }}
                          />
                        ))}
                      </div>
                    </motion.div>

                    {/* Question Section */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={currentQuestion}
                        variants={questionVariants}
                        initial="initial"
                        animate="animate"
                        exit="exit"
                        className="mb-8"
                      >
                        <motion.h2 
                          className="text-2xl font-bold text-gray-800 mb-6"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.2 }}
                        >
                          {questions[currentQuestion].question_text}
                        </motion.h2>

                        <div className="space-y-4">
                          {questions[currentQuestion].options.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswer(index)}
                              disabled={isTransitioning}
                              className={`w-full p-4 text-left bg-white/50 hover:bg-white/80 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md group ${
                                isTransitioning ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              variants={optionVariants}
                              initial="initial"
                              animate="animate"
                              whileHover="hover"
                              whileTap="tap"
                              custom={index}
                            >
                              <div className="flex items-start">
                                <motion.div 
                                  className="w-8 h-8 bg-gray-100 rounded-full mr-4 flex items-center justify-center mt-1 group-hover:bg-blue-50 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <motion.div
                                    className="w-4 h-4 border-2 border-gray-400 rounded-full group-hover:border-blue-500"
                                    whileHover={{ borderWidth: "3px" }}
                                  />
                                </motion.div>
                                <span className="text-gray-700 font-medium flex-1">{option}</span>
                                <motion.div 
                                  className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center mt-1 group-hover:border-blue-400 transition-colors duration-200"
                                  whileHover={{ scale: 1.1 }}
                                >
                                  <motion.div
                                    className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                                    whileHover={{ scale: 1.2 }}
                                  />
                                </motion.div>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </>
                ) : (
                  <motion.div 
                    className="text-center text-gray-600"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No quiz questions available. Please try again later.
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}