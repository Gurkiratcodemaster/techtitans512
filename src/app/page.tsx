"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import CornerChatbot from "@/components/CornerChatbot";
import { supabase } from "@/lib/database";
import HeroSection from "@/components/HeroSection";
import { Navbar } from "@/components/navbar";
import { BACKGROUNDS, COLORS, RESPONSIVE } from "@/lib/theme";
import dynamic from 'next/dynamic';

// Dynamically import the CareerFlowDiagram component
const CareerFlowDiagram = dynamic(
  () => import("@/components/CareerFlowDiagram"),
  { ssr: false }
);

export default function Home() {
  const [currentQuote, setCurrentQuote] = useState(0);
  const [showCornerChatbot, setShowCornerChatbot] = useState(false);

  const [motivationalQuotes, setMotivationalQuotes] = useState<{ text: string; author: string }[]>([]);

  useEffect(() => {
    async function loadQuotes() {
      const { data } = await supabase
        .from('motivational_quotes')
        .select('text, author')
        .order('author');
      setMotivationalQuotes(data || []);
    }
    loadQuotes();
  }, []);

  useEffect(() => {
    if (motivationalQuotes.length === 0) return;
    const quoteInterval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % motivationalQuotes.length);
    }, 4000);
    return () => clearInterval(quoteInterval);
  }, [motivationalQuotes]);
  
  return (
    <div className={BACKGROUNDS.PAGE_PRIMARY + " min-h-screen"}>
      <Navbar />
      <HeroSection
        title="Welcome to Career Choice"
        subtitle="Discover your perfect career path with our AI-powered guidance, personalized assessments, and expert recommendations."
      />
      
      <div className={RESPONSIVE.container + " " + RESPONSIVE.section}>
        <div className="max-w-6xl mx-auto">
          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Career Quiz Card */}
            <div className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8 text-center"}>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Assessment</h2>
              <p className="text-gray-600 mb-6 font-medium">Take our comprehensive quiz to discover which career paths align with your skills and interests.</p>
              <div className="space-y-3">
                <Link href="/quiz/class10" className={`block w-full ${COLORS.primary.gradient} ${COLORS.primary.gradientHover} ${RESPONSIVE.button} text-center hover:scale-105 `}>
                  Class 10 Assessment
                </Link>
                <Link href="/quiz/class12" className={`block w-full ${COLORS.primary.gradient} ${COLORS.primary.gradientHover} ${RESPONSIVE.button} text-center hover:scale-105 `}>
                  Class 12 Assessment
                </Link>
              </div>
            </div>

            {/* AI Chatbot Card */}
            <div 
              className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8 text-center cursor-pointer hover:scale-[1.02] transition-transform duration-300"}
              onClick={() => setShowCornerChatbot(true)}
            >
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:-rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Career Guidance</h2>
              <p className="text-gray-600 mb-6 font-medium">Chat with our intelligent assistant for personalized career advice and guidance tailored to your goals.</p>

              <button
                onClick={() => setShowCornerChatbot(true)}
                className={`w-full ${COLORS.primary.gradient} ${COLORS.primary.gradientHover} ${RESPONSIVE.button} hover:scale-105 `}
              >
                Start Conversation
              </button>
            </div>

            {/* Resources Card */}
            <div className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8 text-center"}>
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 hover:scale-110 hover:rotate-12 transition-transform duration-300">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Resources</h2>
              <p className="text-gray-600 mb-6 font-medium">Access curated educational content, courses, and materials to develop skills for your chosen career path.</p>
              <Link 
                href="/study-materials" 
                className={`block w-full ${COLORS.primary.gradient} ${COLORS.primary.gradientHover} ${RESPONSIVE.button} text-center hover:scale-105 `}
              >
                Explore Resources
              </Link>
            </div>
          </div>



          {/* How We Help Students Section */}
          <div className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8 mb-12"}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-8">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">How We Help Students in Their Career Journey</h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
              {/* Personalized Assessment */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Personalized Assessment</h3>
                <p className="text-gray-600 text-sm">Comprehensive aptitude tests to identify your strengths and interests for perfect career matching.</p>
              </div>

              {/* AI-Powered Guidance */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">AI-Powered Guidance</h3>
                <p className="text-gray-600 text-sm font-medium">Smart recommendations based on current market trends, job opportunities, and your unique profile.</p>
              </div>

              {/* Career Roadmaps */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Career Roadmaps</h3>
                <p className="text-gray-600 text-sm font-medium">Step-by-step pathways showing required skills, education, and milestones for your chosen career.</p>
              </div>

              {/* College & Course Selection */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">College & Course Selection</h3>
                <p className="text-gray-600 text-sm font-medium">Comprehensive database of colleges, courses, and admission requirements tailored to your goals.</p>
              </div>

              {/* Skill Development */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Skill Development</h3>
                <p className="text-gray-600 text-sm font-medium">Industry-relevant training programs and certifications to boost your employability and career growth.</p>
              </div>

              {/* Ongoing Support */}
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM12 18a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM12 6a6 6 0 100 12 6 6 0 000-12z" />
                  </svg>
                </div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">Ongoing Support</h3>
                <p className="text-gray-600 text-sm font-medium">24/7 AI assistant and expert mentorship to guide you through every step of your career journey.</p>
              </div>
            </div>
          </div>

          {/* Timeline Tracker Section */}
          <div className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-6 mb-8"}>
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            
            <div className="text-center mb-6">
              <h2 className="text-2xl font-extrabold text-gray-800 mb-3">Never Miss Important Dates!</h2>
              <p className="text-base text-gray-700 mb-2 font-bold">Timeline Tracker - Your Personal Academic Calendar</p>
              <p className="text-gray-600 max-w-2xl mx-auto font-medium">
                Get timely notifications for admission deadlines, scholarship applications, entrance test dates, and career opportunities
              </p>
            </div>
            <div className="max-w-md mx-auto">
              {/* Subscription Form */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <h5 className="text-lg font-bold text-gray-800 mb-3 flex items-center">
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
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-semibold rounded-lg  transform hover:scale-105">
                    Start Timeline Tracking
                  </button>
                </div>
              </div>

              {/* View Full Timeline Link */}
              <div className="text-center mt-6">
                <Link 
                  href="/timeline" 
                  className="inline-block px-8 py-3 bg-white border-2 border-blue-600 text-blue-600 font-semibold rounded-full hover:bg-blue-50  transform hover:scale-105 text-center delay-650"
                >
                  View Full Timeline →
                </Link>
              </div>
            </div>

            {/* Features Preview */}
            <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
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
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">SMS Alerts</div>
                <div className="text-gray-600 text-xs">Never miss deadlines</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 01-2 2h-2a2 2 01-2-2z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">Progress Track</div>
                <div className="text-gray-600 text-xs">Application status</div>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="text-gray-800 font-medium text-sm">Expert Tips</div>
                <div className="text-gray-600 text-xs">Application guidance</div>
              </div>
            </div>
          </div>

          {/* Motivational Quotes Section */}
          <div className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8 mb-12 text-center"}>
            <div className="relative h-24 flex items-center justify-center">
              {/* This conditional check prevents the error */}
              {motivationalQuotes[currentQuote] && (
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
              )}
            </div>
            <div className="flex justify-center space-x-2 mt-4">
              {motivationalQuotes.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuote(index)}
                  className="w-2 h-2 rounded-full"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Floating Corner Chatbot Button */}
      {!showCornerChatbot && (
        <button
          onClick={() => setShowCornerChatbot(true)}
          className="fixed bottom-6 right-6 w-14 h-14 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-full shadow-lg hover:shadow-xl  z-40 flex items-center justify-center hover:scale-110 transform"
          style={{ transitionDelay: '1s' }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
        </button>
      )}

      {/* Corner Chatbot */}
      {showCornerChatbot && <CornerChatbot />}
    </div>
  );
}

