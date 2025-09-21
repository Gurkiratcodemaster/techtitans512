"use client";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { openChatbot } from "@/components/chatbot";
import CornerChatbot from "@/components/CornerChatbot";
import dynamic from 'next/dynamic';

// Dynamically import the CareerFlowDiagram component
const CareerFlowDiagram = dynamic(
  () => import("@/components/CareerFlowDiagram"),
  { ssr: false }
);

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showCornerChatbot, setShowCornerChatbot] = useState(false);

  const motivationalQuotes = [
    {
      text: "Education is the most powerful weapon which you can use to change the world.",
      author: "Nelson Mandela"
    },
    {
      text: "The beautiful thing about learning is that no one can take it away from you.",
      author: "B.B. King"
    },
    {
      text: "Education is not preparation for life; education is life itself.",
      author: "John Dewey"
    },
    {
      text: "The more that you read, the more things you will know. The more that you learn, the more places you'll go.",
      author: "Dr. Seuss"
    },
    {
      text: "Success is no accident. It is hard work, perseverance, learning, studying, sacrifice.",
      author: "Pele"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);

    return () => clearInterval(quoteInterval);
  }, [motivationalQuotes.length]);
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center mb-16 transform transition-all duration-500 ease-out ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <h1 className={`text-5xl font-bold text-gray-800 mb-6 transform transition-all duration-400 delay-50 ${
              loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              Welcome to <span className="text-blue-600 text-6xl">Career Choice</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-400 delay-100 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              Discover your perfect career path with our AI-powered guidance, personalized assessments, and expert recommendations.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Career Quiz Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-100 ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
              <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-150 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`}>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-200 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>Career Assessment</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-250 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>Take our comprehensive quiz to discover which career paths align with your skills and interests.</p>
              <div className={`space-y-3 transform transition-all duration-400 delay-300 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <Link href="/quiz/class10" className="block w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-500 ease-in-out font-semibold text-center transform hover:scale-105">
                  Class 10 Assessment
                </Link>
                <Link href="/quiz/class12" className="block w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-500 ease-in-out font-semibold text-center transform hover:scale-105">
                  Class 12 Assessment
                </Link>
              </div>
            </div>

            {/* AI Chatbot Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-150 cursor-pointer ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
              <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-200 ${
                loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
              }`}>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-250 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}>AI Career Guidance</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-300 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}>Chat with our intelligent assistant for personalized career advice and guidance tailored to your goals.</p>

              <button
                onClick={() => setShowCornerChatbot(true)}
                className={`w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold transform transition-transform duration-300 ease-in-out hover:scale-105 hover:from-blue-500 hover:to-blue-600 delay-350 ${
                  loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                }`}
              >
                Start Conversation
              </button>
            </div>

            {/* Resources Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-200 ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
              <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-250 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`}>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-300 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>Learning Resources</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-350 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>Access curated educational content, courses, and materials to develop skills for your chosen career path.</p>
              <Link 
                href="/study-materials" 
                className={`block w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-500 ease-in-out font-semibold text-center transform hover:scale-105 delay-400 ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}
              >
                Explore Resources
              </Link>
            </div>
          </div>

          {/* Skills Programs Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg transform transition-all duration-500 ease-out delay-250 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Left side - Text Content */}
              <div className="flex-1 text-center lg:text-left">
                <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-6 transform transition-all duration-400 delay-300 ${
                  loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}>
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
                </div>
                
                <h2 className={`text-3xl font-bold text-gray-800 mb-6 transform transition-all duration-400 delay-350 ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}>Transform Your Free Time Into Career Success</h2>
                
                <div className={`space-y-4 text-gray-600 mb-8 transform transition-all duration-400 delay-400 ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}>
                  <p className="text-lg leading-relaxed">
                    Just completed your 12th grade or have some free time on your hands? Don't let this valuable time go to waste! 
                    Our comprehensive skill development programs are designed specifically for students like you who want to get ahead in their career journey.
                  </p>
                  
                  <p className="text-base leading-relaxed">
                    Whether you're waiting for college admissions, preparing for entrance exams, or simply looking to enhance your skillset, 
                    our industry-aligned programs will give you the competitive edge you need. From technical skills like programming and digital marketing 
                    to soft skills like communication and leadership, we offer a wide range of courses taught by industry experts.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Industry-relevant curriculum</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Expert mentorship</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Practical projects & portfolio</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm">Certification upon completion</span>
                    </div>
                  </div>
                </div>
                
                <Link 
                  href="/skills" 
                  className={`inline-block px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-300 font-semibold transform hover:scale-105 delay-450 ${
                    loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                  }`}
                >
                  Explore Skill Programs →
                </Link>
              </div>
              
              {/* Right side - Image Space */}
              <div className={`flex-1 lg:max-w-md transform transition-all duration-500 delay-500 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
                <div className="relative">
                  {/* Student Image */}
                  <div className="aspect-square rounded-2xl overflow-hidden shadow-xl">
                    <img 
                      src="/images/student2.jpg" 
                      alt="Student learning and developing skills" 
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  
                  {/* Decorative elements */}
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-blue-200 rounded-full opacity-70"></div>
                  <div className="absolute -bottom-4 -left-4 w-6 h-6 bg-blue-300 rounded-full opacity-70"></div>
                  <div className="absolute top-1/2 -right-6 w-4 h-4 bg-blue-400 rounded-full opacity-70"></div>
                </div>
              </div>
            </div>
          </div>

          {/* How We Help Students Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg transform transition-all duration-500 ease-out delay-300 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8 transform transition-all duration-400 delay-350 ${
              loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
            }`}>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center transform transition-all duration-400 delay-400 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>How We Help Students in Their Career Journey</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {/* Personalized Assessment */}
              <div className={`text-center transform transition-all duration-400 delay-450 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Assessment</h3>
                <p className="text-gray-600 text-sm">Comprehensive aptitude tests to identify your strengths and interests for perfect career matching.</p>
              </div>

              {/* AI-Powered Guidance */}
              <div className={`text-center transform transition-all duration-400 delay-500 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">AI-Powered Guidance</h3>
                <p className="text-gray-600 text-sm">Smart recommendations based on current market trends, job opportunities, and your unique profile.</p>
              </div>

              {/* Career Roadmaps */}
              <div className={`text-center transform transition-all duration-400 delay-550 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Career Roadmaps</h3>
                <p className="text-gray-600 text-sm">Step-by-step pathways showing required skills, education, and milestones for your chosen career.</p>
              </div>

              {/* College & Course Selection */}
              <div className={`text-center transform transition-all duration-400 delay-600 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">College & Course Selection</h3>
                <p className="text-gray-600 text-sm">Comprehensive database of colleges, courses, and admission requirements tailored to your goals.</p>
              </div>

              {/* Skill Development */}
              <div className={`text-center transform transition-all duration-400 delay-650 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Skill Development</h3>
                <p className="text-gray-600 text-sm">Industry-relevant training programs and certifications to boost your employability and career growth.</p>
              </div>

              {/* Ongoing Support */}
              <div className={`text-center transform transition-all duration-400 delay-700 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM12 6a6 6 0 100 12 6 6 0 000-12z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Ongoing Support</h3>
                <p className="text-gray-600 text-sm">24/7 AI assistant and expert mentorship to guide you through every step of your career journey.</p>
              </div>
            </div>
          </div>

          {/* Timeline Tracker Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-6 mb-8 shadow-lg transform transition-all duration-500 ease-out delay-350 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-400 ${
              loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
            }`}>
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="text-center mb-6">
              <h2 className={`text-2xl font-bold text-gray-800 mb-3 transform transition-all duration-400 delay-450 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>Never Miss Important Dates!</h2>
              <p className={`text-base text-gray-700 mb-2 font-medium transform transition-all duration-400 delay-500 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>Timeline Tracker - Your Personal Academic Calendar</p>
              <p className={`text-gray-600 max-w-2xl mx-auto transform transition-all duration-400 delay-550 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
                Get timely notifications for admission deadlines, scholarship applications, entrance test dates, and career opportunities
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Subscription Form */}
              <div className={`bg-gray-50 rounded-2xl p-4 transform transition-all duration-400 delay-600 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`}>
                <h5 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                  <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM12 17H7l5 5v-5z" />
                  </svg>
                  Subscribe for Updates
                </h5>
                <div className="space-y-3">
                  <input 
                    type="email" 
                    placeholder="Enter your email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <label className="flex items-center text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input type="checkbox" className="mr-2 rounded text-blue-600" defaultChecked />
                      <span>Admission Dates</span>
                    </label>
                    <label className="flex items-center text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input type="checkbox" className="mr-2 rounded text-blue-600" defaultChecked />
                      <span>Scholarships</span>
                    </label>
                    <label className="flex items-center text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input type="checkbox" className="mr-2 rounded text-blue-600" defaultChecked />
                      <span>Entrance Tests</span>
                    </label>
                    <label className="flex items-center text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                      <input type="checkbox" className="mr-2 rounded text-blue-600" defaultChecked />
                      <span>Career Events</span>
                    </label>
                  </div>
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-105">
                    🔔 Start Timeline Tracking
                  </button>
                </div>
              </div>

              {/* Upcoming Deadlines Preview */}
              <div className={`bg-gray-50 rounded-2xl p-6 transform transition-all duration-400 delay-650 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
                <h5 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Upcoming Important Dates
                </h5>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between py-2 px-3 bg-red-50 border-l-4 border-red-500 rounded">
                    <div>
                      <div className="font-medium text-gray-800">JEE Main Registration</div>
                      <div className="text-red-600">Deadline: Dec 30, 2024</div>
                    </div>
                    <div className="text-red-600 text-xs bg-red-100 px-2 py-1 rounded-full font-medium">
                      5 days left
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-orange-50 border-l-4 border-orange-500 rounded">
                    <div>
                      <div className="font-medium text-gray-800">NEET Application</div>
                      <div className="text-orange-600">Opens: Jan 15, 2025</div>
                    </div>
                    <div className="text-orange-600 text-xs bg-orange-100 px-2 py-1 rounded-full font-medium">
                      21 days
                    </div>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 bg-blue-50 border-l-4 border-blue-500 rounded">
                    <div>
                      <div className="font-medium text-gray-800">Merit Scholarships</div>
                      <div className="text-blue-600">Deadline: Feb 28, 2025</div>
                    </div>
                    <div className="text-blue-600 text-xs bg-blue-100 px-2 py-1 rounded-full font-medium">
                      65 days
                    </div>
                  </div>
                  <div className="text-center mt-4">
                    <Link href="/timeline" className="text-blue-600 hover:text-blue-800 text-sm font-medium underline transition-colors">
                      View Full Timeline →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Preview */}
            <div className={`mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center transform transition-all duration-400 delay-700 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">Smart Calendar</div>
                <div className="text-gray-600 text-xs">Personalized dates</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">SMS Alerts</div>
                <div className="text-gray-600 text-xs">Never miss deadlines</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 012-2h2a2 2 012 2v14a2 2 01-2 2h-2a2 2 01-2-2z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">Progress Track</div>
                <div className="text-gray-600 text-xs">Application status</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">Expert Tips</div>
                <div className="text-gray-600 text-xs">Application guidance</div>
              </div>
            </div>
          </div>

          {/* Motivational Quotes Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg text-center transform transition-all duration-500 ease-out delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            <div className="relative h-24 flex items-center justify-center">
              <div 
                key={currentQuote}
                className="absolute inset-0 flex flex-col items-center justify-center animate-fade-in"
              >
                <blockquote className="text-lg md:text-xl text-gray-800 font-medium text-center mb-3 px-4">
                  "{motivationalQuotes[currentQuote].text}"
                </blockquote>
                <cite className="text-blue-600 font-semibold">
                  - {motivationalQuotes[currentQuote].author}
                </cite>
              </div>
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {motivationalQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentQuote ? 'bg-blue-600 w-6' : 'bg-blue-300 hover:bg-blue-400'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-300 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className={`transform transition-all duration-400 delay-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Students Guided</div>
              </div>
              <div className={`transform transition-all duration-400 delay-450 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Career Paths</div>
              </div>
              <div className={`transform transition-all duration-400 delay-500 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Corner Chatbot Button */}
      {!showCornerChatbot && (
        <button
          onClick={() => setShowCornerChatbot(true)}
          className={`fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 z-40 flex items-center justify-center hover:scale-110 transform ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
          style={{ transitionDelay: '1s' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Corner Chatbot */}
      <CornerChatbot
        isOpen={showCornerChatbot}
        onClose={() => setShowCornerChatbot(false)}
        initialMessage="Hi! I'm your career guidance assistant. I can help you with course selection, career advice, and entrance exam information. What would you like to know?"
        context="Homepage career guidance"
      />
    </div>
  );
}
