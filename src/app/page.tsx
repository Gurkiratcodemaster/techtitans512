"use client";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import { useEffect, useState } from "react";
import { openChatbot } from "@/components/chatbot";

export default function Home() {
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
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className={`text-center mb-16 transform transition-all duration-500 ease-out ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <h1 className={`text-5xl font-bold text-gray-800 mb-6 transform transition-all duration-400 ${
              loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`} style={{ transitionDelay: '50ms' }}>
              Welcome to <span className="text-blue-600">Career Choice</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-400 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`} style={{ transitionDelay: '100ms' }}>
              Discover your perfect career path with our AI-powered guidance, personalized assessments, and expert recommendations.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Career Quiz Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '100ms' }}>
              <div className={`w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`} style={{ transitionDelay: '150ms' }}>
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '200ms' }}>Career Assessment</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '250ms' }}>Take our comprehensive quiz to discover which career paths align with your skills and interests.</p>
              <div className={`space-y-3 transform transition-all duration-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>
                <Link href="/quiz/class10" className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-center">
                  Class 10 Assessment
                </Link>
                <Link href="/quiz/class12" className="block w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold text-center">
                  Class 12 Assessment
                </Link>
              </div>
            </div>

            {/* AI Chatbot Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '150ms' }}>
              <div className={`w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
              }`} style={{ transitionDelay: '200ms' }}>
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '250ms' }}>AI Career Guidance</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>Chat with our intelligent assistant for personalized career advice and guidance tailored to your goals.</p>
              <button 
                onClick={() => {
                  console.log('Start Conversation button clicked');
                  console.log('Current DOM state:');
                  
                  // Let's inspect what's actually in the page
                  const allDivs = document.querySelectorAll('div');
                  console.log(`Total divs found: ${allDivs.length}`);
                  
                  const fixedElements = document.querySelectorAll('[style*="fixed"]');
                  console.log('Fixed positioned elements:', fixedElements);
                  
                  const bottomElements = document.querySelectorAll('[style*="bottom"]');
                  console.log('Bottom positioned elements:', bottomElements);
                  
                  // Try to click any element in the bottom-right area
                  setTimeout(() => {
                    const rightBottomElements = document.querySelectorAll('[style*="right"][style*="bottom"]');
                    console.log('Bottom-right elements:', rightBottomElements);
                    
                    if (rightBottomElements.length > 0) {
                      rightBottomElements.forEach((el, i) => {
                        console.log(`Clicking bottom-right element ${i}:`, el);
                        try {
                          (el as HTMLElement).click();
                        } catch (e) {
                          console.log(`Failed to click element ${i}:`, e);
                        }
                      });
                    }
                  }, 1000);
                  
                  openChatbot();
                }}
                className={`cursor-pointer w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold transform ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '350ms' }}>
                Start Conversation
              </button>
            </div>

            {/* Resources Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`} style={{ transitionDelay: '200ms' }}>
              <div className={`w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`} style={{ transitionDelay: '250ms' }}>
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '300ms' }}>Learning Resources</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 ${
                loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`} style={{ transitionDelay: '350ms' }}>Access curated educational content, courses, and materials to develop skills for your chosen career path.</p>
              <button className={`w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold transform ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>
                Coming Soon
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`} style={{ transitionDelay: '300ms' }}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className={`transform transition-all duration-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '400ms' }}>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Students Guided</div>
              </div>
              <div className={`transform transition-all duration-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '450ms' }}>
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Career Paths</div>
              </div>
              <div className={`transform transition-all duration-400 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`} style={{ transitionDelay: '500ms' }}>
                <div className="text-3xl font-bold text-purple-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
