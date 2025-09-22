"use client";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import { useEffect, useState } from "react";

export default function About() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      
      <HeroSection 
        title="About Career Choice"
        subtitle="Empowering individuals to make informed career decisions through personalized guidance and intelligent recommendations."
        loaded={loaded}
      />

      <div className="pt-8 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-200 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 delay-250 ${loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 delay-300 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>AI-Powered Guidance</h3>
              <p className={`text-gray-600 transform transition-all duration-400 delay-350 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>
                Our intelligent chatbot provides personalized career advice based on your unique profile, skills, and career goals.
              </p>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-250 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 delay-300 ${loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
                }`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 delay-350 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>Skill Assessment</h3>
              <p className={`text-gray-600 transform transition-all duration-400 delay-400 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>
                Comprehensive evaluation of your skills, interests, and aptitudes to match you with suitable career opportunities.
              </p>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-300 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 delay-350 ${loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 delay-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>Industry Insights</h3>
              <p className={`text-gray-600 transform transition-all duration-400 delay-450 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>
                Stay updated with the latest industry trends, job market analysis, and emerging career opportunities.
              </p>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-350 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 delay-400 ${loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
                }`}>
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 delay-450 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>Learning Resources</h3>
              <p className={`text-gray-600 transform transition-all duration-400 delay-500 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>
                Access curated educational content, courses, and resources to develop skills for your chosen career path.
              </p>
            </div>
          </div>
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg transform transition-all duration-500 ease-out delay-400 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
            <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center transform transition-all duration-400 delay-450 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>Our Vision</h2>
            <p className={`text-lg text-gray-700 text-center max-w-3xl mx-auto transform transition-all duration-400 delay-500 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              We envision a world where every individual can discover and pursue a career that brings them fulfillment,
              success, and happiness. Through technology and human insight, we're building the future of career guidance.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}