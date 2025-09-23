"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { COLORS, BACKGROUNDS, RESPONSIVE, ANIMATIONS } from "@/lib/theme";

// Defines the structure for a single quiz question
interface Question {
  id: number;
  question: string;
  options: string[];
  category: string;
}

// Defines the structure for the final quiz result, now including colleges
interface QuizResult {
  category: string;
  score: number;
  careers: string[];
  description: string;
  colleges: string[];
}

// Animation variants
const cardVariants = {
  initial: { opacity: 0, scale: 0.95, y: 20 },
  animate: { opacity: 1, scale: 1, y: 0 },
  exit: { opacity: 0, scale: 0.95, y: -20 }
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

export default function Class12Quiz() {
  // State for quiz data fetched from Supabase
  const [questions, setQuestions] = useState<Question[]>([]);
  const [careerResults, setCareerResults] = useState<Record<string, Omit<QuizResult, 'score'>>>(
    {}
  );
  
  // State for component lifecycle and UI
  const [isLoading, setIsLoading] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // State for quiz progress
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<QuizResult | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch questions and their options from the new tables
      const { data: questionsData, error: qError } = await supabase
        .from('class12_questions')
        .select(`id, question_text, category, class12_question_options (option_text, option_index)`)
        .order('id', { ascending: true });

      if (qError) {
        console.error("Error fetching questions:", qError);
        return setIsLoading(false);
      }

      const formattedQuestions: Question[] = questionsData.map((q: any) => ({
        id: q.id,
        question: q.question_text,
        category: q.category,
        options: q.class12_question_options
          .sort((a: any, b: any) => a.option_index - b.option_index)
          .map((opt: any) => opt.option_text),
      }));
      setQuestions(formattedQuestions);
      
      // 2. Fetch career categories with their related careers AND colleges
      const { data: categoriesData, error: cError } = await supabase
        .from('class12_career_categories')
        .select(`
          key_name, display_name, description,
          class12_recommended_careers (career_name),
          class12_recommended_colleges (college_name)
        `);

      if (cError) {
        console.error("Error fetching career data:", cError);
        return setIsLoading(false);
      }
      
      // 3. Reshape career data into the required object format
      const formattedResults = categoriesData.reduce((acc, cat: any) => {
        acc[cat.key_name] = {
          category: cat.display_name,
          description: cat.description,
          careers: cat.class12_recommended_careers.map((c: any) => c.career_name),
          colleges: cat.class12_recommended_colleges.map((c: any) => c.college_name),
        };
        return acc;
      }, {} as Record<string, Omit<QuizResult, 'score'>>);

      setCareerResults(formattedResults);
      setIsLoading(false);
    };

    fetchData();
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // --- ICON HELPER FUNCTIONS (No changes needed here) ---
  const getQuestionIcon = (category: string) => {
     switch (category) {
       case 'stream': return <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>;
       case 'vision': case 'career_path': return <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>;
       case 'exam': return <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>;
       case 'environment': return <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
       case 'subjects': case 'education': return <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
       case 'motivation': case 'impact': return <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
       case 'skills': return <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
       default: return <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
     }
  };
  const getOptionIcon = (option: string, index: number) => { /* This function can be copied from your original code */ return <svg key={index} className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; };

  // --- QUIZ LOGIC (Scoring logic is identical to your provided code) ---
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
    const scores = { engineering: 0, medical: 0, business: 0, liberal: 0 };
    userAnswers.forEach((answer, index) => {
      // This is the exact scoring logic from your file
      switch (index) {
        case 0: if (answer === 0) scores.engineering += 4; if (answer === 1) scores.medical += 4; if (answer === 2) scores.business += 3; if (answer === 3) scores.liberal += 3; break;
        case 1: case 3: case 4: case 5: case 7: case 8: case 9:
          if (answer === 0) scores.engineering += 3; if (answer === 1) scores.medical += (index === 1 ? 4 : 3); if (answer === 2) scores.business += 3; if (answer === 3) scores.liberal += 3; break;
        case 2: case 6:
          if (answer === 0) scores.engineering += 4; if (answer === 1) scores.medical += 4; if (answer === 2) scores.business += 3; if (answer === 3) scores.liberal += 3; break;
      }
    });
    const topCategory = Object.keys(scores).reduce((a, b) => (scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b));
    const resultData = careerResults[topCategory];
    if (resultData) {
      const finalResult: QuizResult = { ...resultData, score: scores[topCategory as keyof typeof scores] };
      setResults(finalResult);
    }
    setShowResults(true);
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
        className={BACKGROUNDS.page + " min-h-screen"}
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

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <motion.div 
      className={BACKGROUNDS.page + " min-h-screen"}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <Navbar />
      <HeroSection 
        title={showResults ? "Your Quiz Results" : "Class 12 Career Assessment"}
        subtitle={showResults ? "Here's your ideal career path based on your answers" : "Discover your career path and college options after Class 12"}
        loaded={loaded}
      />
      
      <div className={RESPONSIVE.container + " " + RESPONSIVE.section}>
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {showResults && results ? (
              // Results Card
              <motion.div
                key="results"
                className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8"}
                variants={resultVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <motion.div className="text-center mb-8">
                  <motion.div 
                    className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
                    whileHover={{ scale: 1.1, rotate: 10 }}
                    transition={{ duration: 0.3 }}
                  >
                    <svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                    </svg>
                  </motion.div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Ideal Career Path:</h2>
                  <h3 className="text-2xl font-semibold text-blue-600 mb-6">{results.category}</h3>
                  <p className="text-lg text-gray-700 mb-8">{results.description}</p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <motion.div 
                    className="bg-white/50 rounded-2xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Top Career Options:</h4>
                    <ul className="space-y-2">
                      {results.careers.map((career, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center text-gray-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                          {career}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-white/50 rounded-2xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Colleges:</h4>
                    <ul className="space-y-2">
                      {results.colleges.map((college, i) => (
                        <motion.li 
                          key={i} 
                          className="flex items-center text-gray-700"
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: i * 0.1 }}
                        >
                          <div className="w-2 h-2 bg-blue-600 rounded-full mr-3" />
                          {college}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <motion.div 
                    className="bg-white/50 rounded-2xl p-6"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <h4 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h4>
                    <ul className="space-y-2 text-gray-700">
                      <li>• Research entrance exams</li>
                      <li>• Start intensive preparation</li>
                      <li>• Take coaching if needed</li>
                      <li>• Apply for relevant colleges</li>
                      <li>• Build skill portfolio</li>
                      <li>• Network with professionals</li>
                    </ul>
                  </motion.div>
                </div>

                <motion.div className="text-center space-x-4">
                  <motion.button
                    onClick={restartQuiz}
                    className={COLORS.primary.gradient + " " + COLORS.primary.gradientHover + " " + RESPONSIVE.button}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Retake Quiz
                  </motion.button>
                  <Link href="/career-paths">
                    <motion.span
                      className={COLORS.primary.gradient + " " + COLORS.primary.gradientHover + " " + RESPONSIVE.button + " inline-block"}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Explore Career Paths
                    </motion.span>
                  </Link>
                </motion.div>
              </motion.div>
            ) : (
              // Quiz Card
              <motion.div
                key="quiz"
                className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8"}
                variants={cardVariants}
                initial="initial"
                animate="animate"
                exit="exit"
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

                      <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                        <motion.div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                          initial={{ width: "0%" }}
                          animate={{ width: `${progress}%` }}
                          transition={{ duration: 0.6 }}
                        />
                      </div>

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
                    </div>

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
                        <div className="flex items-center mb-6">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-4">
                            {getQuestionIcon(questions[currentQuestion]?.category)}
                          </div>
                          <h2 className="text-2xl font-bold text-gray-800">
                            {questions[currentQuestion]?.question}
                          </h2>
                        </div>

                        <div className="space-y-4">
                          {questions[currentQuestion]?.options?.map((option, index) => (
                            <motion.button
                              key={index}
                              onClick={() => handleAnswer(index)}
                              disabled={isTransitioning}
                              className={`w-full p-4 text-left bg-white/50 hover:bg-white/80 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md ${
                                isTransitioning ? 'cursor-not-allowed opacity-50' : ''
                              }`}
                              whileHover={{ y: -2, scale: 1.01 }}
                              whileTap={{ scale: 0.99 }}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ 
                                opacity: 1, 
                                y: 0,
                                transition: { delay: index * 0.1 }
                              }}
                            >
                              <div className="flex items-center">
                                <div className="w-6 h-6 border-2 border-gray-300 rounded-full mr-4 flex items-center justify-center">
                                  <div className="w-2 h-2 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <span className="text-gray-700 font-medium">{option}</span>
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </>
                ) : (
                  <div className="text-center text-gray-600">
                    No quiz questions available. Please try again later.
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}