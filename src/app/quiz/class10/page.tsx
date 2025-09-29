"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import Link from "next/link";
import { fetchQuizQuestions, saveQuizResult, UserUtils } from "@/lib/database";
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

export default function Class10Quiz() {
  const { user } = useAuth();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  

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
            userId: UserUtils.getId(user),
            quizType: 'class10',
            score: quizResult.score,
            totalQuestions: quizResult.totalQuestions,
            answers: newAnswers
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
            <div className="text-xl font-semibold text-gray-700">
              Loading Quiz...
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-gray-100">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen pt-16">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg">
            <div className="text-red-600 text-xl font-semibold mb-4">Error loading quiz</div>
            <p className="text-gray-600 mb-4">{error}</p>
            <Link href="/" className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      <HeroSection 
        title={showResults ? "Your Quiz Results" : "Class 10 Career Assessment"}
        subtitle={showResults ? "Here's what we recommend based on your answers" : "Discover your career interests and potential paths after Class 10"}
        
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-16">
        <div className="max-w-4xl mx-auto">
          {showResults && results ? (
            // Results Card
            <div
              key="results"
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
            >
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 transition-transform duration-300">
                  <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">
                  Your Best Match:
                </h2>
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">
                  {results.category}
                </h3>
                <div className="text-lg font-medium text-gray-700 mb-4">
                  Score: {results.score}/{results.totalQuestions} ({results.percentage}%)
                </div>
                <p className="text-lg text-gray-700 mb-8">
                  {results.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/50 rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Careers:</h4>
                  <ul className="space-y-2">
                    {results.careers.map((career, i) => (
                      <li 
                        key={i} 
                        className="flex items-center text-gray-700"
                      >
                        <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                        {career}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="bg-white/50 rounded-2xl p-6 hover:scale-[1.02] transition-transform duration-200">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h4>
                  <ul className="space-y-3 text-gray-700">
                    {results.recommendations.map((step, i) => (
                      <li key={i}>
                        • {step}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="text-center mt-12 space-x-4">
                <button
                  onClick={restartQuiz}
                  className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700  font-semibold hover:scale-105"
                >
                  Retake Quiz
                </button>
                <Link href="/career-paths">
                  <span className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:to-blue-700  font-semibold hover:scale-105">
                    Explore Career Paths
                  </span>
                </Link>
                <Link href="/">
                  <span className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700  font-semibold hover:scale-105">
                    Back to Home
                  </span>
                </Link>
              </div>
            </div>
          ) : (
            // Quiz Card
            <div
              key="quiz"
              className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg"
            >
              {questions.length > 0 ? (
                <>
                  {/* Progress Section */}
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-600">
                        Question {currentQuestion + 1} of {questions.length}
                      </span>
                      <span className="text-sm font-medium text-blue-600">
                        {Math.round(progress)}% Complete
                      </span>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full "
                        style={{ width: `${progress}%` }}
                      >
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20" />
                      </div>
                    </div>

                    {/* Progress Dots */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {questions.map((_, index) => (
                        <div
                          key={index}
                          className="w-2 h-2 rounded-full"
                        />
                      ))}
                    </div>
                  </div>

                  {/* Question Section */}
                  <div key={currentQuestion} className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6">
                      {questions[currentQuestion].question_text}
                    </h2>

                    <div className="space-y-4">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                          disabled={isTransitioning}
                          className="w-full p-4 text-left bg-white/50 hover:bg-white/80 rounded-2xl  border border-gray-200 hover:border-blue-300 hover:shadow-md group hover:scale-[1.02]"
                        >
                          <div className="flex items-start">
                            <div className="w-8 h-8 bg-gray-100 rounded-full mr-4 flex items-center justify-center mt-1 group-hover:bg-blue-50 transition-colors duration-200">
                              <div className="w-4 h-4 border-2 border-gray-400 rounded-full group-hover:border-blue-500" />
                            </div>
                            <span className="text-gray-700 font-medium flex-1">{option}</span>
                            <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center mt-1 group-hover:border-blue-400 transition-colors duration-200">
                              <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center text-gray-600">
                  No quiz questions available. Please try again later.
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


