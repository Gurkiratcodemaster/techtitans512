"use client";
import { Navbar } from "@/components/navbar";
import { useEffect, useState } from "react";

export default function About() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 50);
    
    return () => clearTimeout(timer);
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center mb-16 transform transition-all duration-500 ease-out ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <h1 className={`text-5xl font-bold text-gray-800 mb-6 transform transition-all duration-400 ${
              loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`} style={{ transitionDelay: '50ms' }}>
              About <span className="text-blue-600">Career Choice</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-400 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`} style={{ transitionDelay: '100ms' }}>
              Empowering individuals to make informed career decisions through personalized guidance and intelligent recommendations.
            </p>
          </div>

          {/* Mission Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg transform transition-all duration-500 ease-out ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`} style={{ transitionDelay: '150ms' }}>
            <h2 className={`text-3xl font-bold text-gray-800 mb-6 transform transition-all duration-400 ${
              loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`} style={{ transitionDelay: '200ms' }}>Our Mission</h2>
            <p className={`text-lg text-gray-700 mb-4 transform transition-all duration-400 ${
              loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`} style={{ transitionDelay: '250ms' }}>
              At Career Choice, we believe that everyone deserves to find their perfect career path. Our mission is to bridge the gap between talent and opportunity by providing comprehensive career guidance, skill assessment, and personalized recommendations.
            </p>
            <p className={`text-lg text-gray-700 transform transition-all duration-400 ${
              loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
            }`} style={{ transitionDelay: '300ms' }}>
              We leverage advanced AI technology and industry insights to help individuals discover careers that align with their skills, interests, and aspirations.
            </p>
          </div>

          {/* Features Section */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`} style={{ transitionDelay: '250ms' }}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>AI-Powered Guidance</h3>
              <p className={`text-gray-600 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '350ms' }}>
                Our intelligent chatbot provides personalized career advice based on your unique profile, skills, and career goals.
              </p>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '250ms' }}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
              }`} style={{ transitionDelay: '300ms' }}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '350ms' }}>Skill Assessment</h3>
              <p className={`text-gray-600 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>
                Comprehensive evaluation of your skills, interests, and aptitudes to match you with suitable career opportunities.
              </p>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '300ms' }}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`} style={{ transitionDelay: '350ms' }}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>Industry Insights</h3>
              <p className={`text-gray-600 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '450ms' }}>
                Stay updated with the latest industry trends, job market analysis, and emerging career opportunities.
              </p>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '350ms' }}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
              }`} style={{ transitionDelay: '400ms' }}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '450ms' }}>Learning Resources</h3>
              <p className={`text-gray-600 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '500ms' }}>
                Access curated educational content, courses, and resources to develop skills for your chosen career path.
              </p>
            </div>
          </div>

          {/* Team Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg transform transition-all duration-500 ease-out ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`} style={{ transitionDelay: '400ms' }}>
            <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center transform transition-all duration-400 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '450ms' }}>Our Vision</h2>
            <p className={`text-lg text-gray-700 text-center max-w-3xl mx-auto transform transition-all duration-400 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`} style={{ transitionDelay: '500ms' }}>
              We envision a world where every individual can discover and pursue a career that brings them fulfillment, 
              success, and happiness. Through technology and human insight, we're building the future of career guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}