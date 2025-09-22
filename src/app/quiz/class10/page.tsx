"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient"; // Adjust path if needed

// Interfaces remain the same
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

export default function Class10Quiz() {
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
    // Fetches all necessary data from Supabase when the component mounts
    const fetchData = async () => {
      // Fetch questions and their options (using Class 10 tables)
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select(`id, question_text, category, question_options (option_text, option_index)`)
        .order('id', { ascending: true });

      if (questionsError) {
        console.error("Error fetching questions:", questionsError);
        return setIsLoading(false);
      }

      const formattedQuestions: Question[] = questionsData.map((q: any) => ({
        id: q.id,
        question: q.question_text,
        category: q.category,
        options: q.question_options
          .sort((a: any, b: any) => a.option_index - b.option_index)
          .map((opt: any) => opt.option_text),
      }));
      setQuestions(formattedQuestions);
      
      // Fetch career categories and their recommended careers (using Class 10 tables)
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('career_categories')
        .select(`key_name, display_name, description, recommended_careers (career_name)`);

      if (categoriesError) {
        console.error("Error fetching career data:", categoriesError);
        return setIsLoading(false);
      }
      
      const formattedResults = categoriesData.reduce((acc, cat: any) => {
        acc[cat.key_name] = {
          category: cat.display_name,
          description: cat.description,
          careers: cat.recommended_careers.map((c: any) => c.career_name),
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

  // --- ICON HELPER FUNCTIONS (No changes needed) ---
  const getQuestionIcon = (category: string) => {
    switch (category) {
      case 'interest': return <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>;
      case 'academic': return <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>;
      case 'environment': return <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>;
      case 'motivation': return <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>;
      case 'skill': return <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" /></svg>;
      case 'lifestyle': return <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m0 0V9a3 3 0 013-3h2.343M9 10H6a3 3 0 00-3 3v4a3 3 0 003 3h8a3 3 0 003-3v-1" /></svg>;
      default: return <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>;
    }
  };
  const getOptionIcon = (option: string, index: number) => { /* Function can be copied from previous version */ return <svg key={index} className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>; };

  // --- QUIZ LOGIC (No changes needed) ---
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
    const scores = { technology: 0, healthcare: 0, creative: 0, analytical: 0 };
    userAnswers.forEach((answer, index) => {
      switch (index) {
        case 0: if (answer === 0) scores.technology += 3; if (answer === 1) scores.healthcare += 3; if (answer === 2) scores.creative += 3; if (answer === 3) scores.analytical += 3; break;
        case 1: if (answer === 0) scores.analytical += 2; if (answer === 1) scores.creative += 2; if (answer === 2) scores.healthcare += 2; if (answer === 3) scores.creative += 3; break;
        case 2: if (answer === 0) scores.healthcare += 1; if (answer === 1) scores.analytical += 2; if (answer === 2) scores.creative += 3; if (answer === 3) scores.technology += 3; break;
        case 3: if (answer === 0) scores.healthcare += 3; if (answer === 1) scores.analytical += 2; if (answer === 2) scores.creative += 3; if (answer === 3) scores.technology += 2; break;
        case 4: if (answer === 0) scores.technology += 3; if (answer === 1) scores.analytical += 2; if (answer === 2) scores.creative += 3; if (answer === 3) scores.healthcare += 3; break;
        case 5: if (answer === 0) scores.technology += 2; if (answer === 1) scores.analytical += 1; if (answer === 2) scores.creative += 3; if (answer === 3) scores.healthcare += 2; break;
        case 6: if (answer === 0) scores.technology += 3; if (answer === 1) scores.analytical += 2; if (answer === 2) scores.creative += 3; if (answer === 3) scores.healthcare += 1; break;
        case 7: if (answer === 0) scores.technology += 3; if (answer === 1) scores.healthcare += 3; if (answer === 2) scores.creative += 2; if (answer === 3) scores.analytical += 3; break;
      }
    });

    const topCategory = Object.keys(scores).reduce((a, b) =>
      scores[a as keyof typeof scores] > scores[b as keyof typeof scores] ? a : b
    );
    
    const resultData = careerResults[topCategory];
    if (resultData) {
        const finalResult = { ...resultData, score: scores[topCategory as keyof typeof scores] };
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

  // --- RENDER LOGIC ---
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gray-100"><div className="text-xl font-semibold text-gray-700">Loading Quiz...</div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      <HeroSection 
        title={showResults ? "Your Quiz Results" : "Class 10 Career Assessment"}
        subtitle={showResults ? "Here's what we recommend based on your answers" : "Discover your career interests and potential paths after Class 10"}
        loaded={loaded}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          {showResults && results ? (
            // ========== RESULTS CARD ==========
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="text-center mb-8">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"><svg className="w-10 h-10 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Best Match:</h2>
                <h3 className="text-2xl font-semibold text-blue-600 mb-6">{results.category}</h3>
                <p className="text-lg text-gray-700 mb-8">{results.description}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="bg-white/50 rounded-2xl p-6"><h4 className="text-xl font-semibold text-gray-800 mb-4">Recommended Careers:</h4><ul className="space-y-2">{results.careers.map((career, i) => <li key={i} className="flex items-center text-gray-700"><div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>{career}</li>)}</ul></div>
                <div className="bg-white/50 rounded-2xl p-6"><h4 className="text-xl font-semibold text-gray-800 mb-4">Next Steps:</h4><ul className="space-y-3 text-gray-700"><li>• Focus on subjects related to your career interest</li><li>• Talk to professionals in these fields</li><li>• Look for internship or volunteer opportunities</li><li>• Consider relevant courses after Class 10</li><li>• Discuss with parents and career counselors</li></ul></div>
              </div>
              <div className="text-center mt-12 space-x-4">
                <button onClick={restartQuiz} className="px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold">Retake Quiz</button>
                <Link href="/career-paths" className="inline-block px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:to-blue-700 transition-all duration-300 font-semibold">Explore Career Paths</Link>
                <Link href="/" className="inline-block px-8 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-full hover:from-gray-600 hover:to-gray-700 transition-all duration-300 font-semibold">Back to Home</Link>
              </div>
            </div>
          ) : (
            // ========== QUIZ CARD (with new animations) ==========
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transition-all duration-500 ${isTransitioning ? 'opacity-50 scale-95' : 'opacity-100 scale-100'}`}>
              {questions.length > 0 ? (
                <>
                  <div className="mb-6">
                    <div className="flex justify-between items-center mb-4">
                      <span className="text-sm font-medium text-gray-600">Question {currentQuestion + 1} of {questions.length}</span>
                      <span className="text-sm font-medium text-blue-600">{Math.round(((currentQuestion + 1) / questions.length) * 100)}% Complete</span>
                    </div>
                    {/* Animated Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 relative overflow-hidden">
                      <div className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all duration-300 relative" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}>
                        <div className="absolute top-0 left-0 w-full h-full bg-white/20 animate-pulse"></div>
                      </div>
                    </div>
                    {/* Progress Dots with new color */}
                    <div className="flex justify-center space-x-2 mt-4">
                      {questions.map((_, index) => (
                        <div key={index} className={`w-2 h-2 rounded-full transition-all duration-300 ${
                          index === currentQuestion ? 'bg-blue-600 scale-125' : 
                          index < currentQuestion ? 'bg-blue-400' : 'bg-gray-300'
                        }`} />
                      ))}
                    </div>
                  </div>
                  <div className={`mb-8 transition-opacity duration-300 ${isTransitioning ? 'opacity-0' : 'opacity-100'}`}>
                    <div className="flex items-center mb-6">
                      {getQuestionIcon(questions[currentQuestion].category)}
                      <h2 className="text-2xl font-bold text-gray-800 ml-3">{questions[currentQuestion].question}</h2>
                    </div>
                    <div className="space-y-4">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button key={index} onClick={() => handleAnswer(index)} disabled={isTransitioning} className={`w-full p-4 text-left bg-white/50 hover:bg-white/80 rounded-2xl transition-all duration-300 border border-gray-200 hover:border-blue-300 hover:shadow-md hover:scale-[1.02] group ${isTransitioning ? 'cursor-not-allowed opacity-50' : ''}`}>
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
                </>
              ) : (
                <div className="text-center text-gray-600">Failed to load quiz questions. Please try again later.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}