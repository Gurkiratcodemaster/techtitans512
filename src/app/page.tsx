"use client";
import { Navbar } from "@/components/navbar";
import Link from "next/link";
import Image from "next/image";
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
          <div className={`text-center mb-16 transform transition-all duration-500 ease-out ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}>
            <h1 className={`text-5xl font-bold text-gray-800 mb-6 transform transition-all duration-400 delay-50 ${loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}>
              Welcome to <span className="text-blue-600">Career Choice</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-400 delay-100 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
              Discover your perfect career path with our AI-powered guidance, personalized assessments, and expert recommendations.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Career Quiz Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-100 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-150 ${loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}>
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-200 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>Career Assessment</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-250 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>Take our comprehensive quiz to discover which career paths align with your skills and interests.</p>
              <div className={`space-y-3 transform transition-all duration-400 delay-300 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
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
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-150 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-200 ${loaded ? 'rotate-0 scale-100' : '-rotate-180 scale-0'
                }`}>
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-250 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>AI Career Guidance</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-300 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>Chat with our intelligent assistant for personalized career advice and guidance tailored to your goals.</p>

              <button
                onClick={() => openChatbot()}
                className={`w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full font-semibold transform transition-transform duration-300 ease-in-out hover:scale-105 hover:from-blue-500 hover:to-blue-600 delay-350 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-10 opacity-0 scale-95'
                  }`}
              >
                Start Conversation
              </button>
            </div>


            {/* Resources Card */}
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-200 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
              }`}>
              <div className={`w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 transform transition-all duration-400 delay-250 ${loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
                }`}>
                <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-300 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>Learning Resources</h2>
              <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-350 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>Access curated educational content, courses, and materials to develop skills for your chosen career path.</p>
              <button className={`w-full px-6 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-blue-500 hover:to-blue-600 transition-all duration-500 ease-in-out font-semibold transform hover:scale-105 delay-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                Coming Soon
              </button>
            </div>
          </div>

          {/* How We Help Students Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg transform transition-all duration-500 ease-out delay-250 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
            <div className="grid md:grid-cols-2 gap-8 items-center">
              {/* Left Side - Text Content */}
              <div className={`transform transition-all duration-400 delay-300 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-10 opacity-0'
                }`}>
                <h2 className={`text-3xl font-bold text-gray-800 mb-6 transform transition-all duration-400 delay-350 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                  }`}>How We Help Students</h2>
                
                <div className="space-y-4">
                  <div className={`flex items-start space-x-3 transform transition-all duration-400 delay-400 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}>
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700"><strong>Personalized Career Assessment:</strong> Our comprehensive quiz analyzes your interests, skills, and personality to recommend the most suitable career paths.</p>
                  </div>

                  <div className={`flex items-start space-x-3 transform transition-all duration-400 delay-450 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}>
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700"><strong>24/7 AI Guidance:</strong> Get instant answers to your career questions from our intelligent chatbot, available anytime you need support.</p>
                  </div>

                  <div className={`flex items-start space-x-3 transform transition-all duration-400 delay-500 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}>
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700"><strong>Future-Ready Skills:</strong> Access curated learning resources and courses to develop in-demand skills for tomorrow's careers.</p>
                  </div>

                  <div className={`flex items-start space-x-3 transform transition-all duration-400 delay-550 ${loaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}>
                    <div className="flex-shrink-0 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center mt-1">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <p className="text-gray-700"><strong>Expert-Backed Insights:</strong> Our recommendations are based on industry trends, job market data, and expert career guidance.</p>
                  </div>
                </div>
              </div>

              {/* Right Side - Image */}
              <div className={`transform transition-all duration-400 delay-400 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                }`}>
                <div className="relative rounded-2xl overflow-hidden aspect-square shadow-lg">
                  <Image
                    src="/images/student1.jpg"
                    alt="Students in classroom studying and collaborating"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="transition-transform duration-300 hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 50vw"
                    priority
                  />
                  {/* Overlay gradient for better visual appeal */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  
                  {/* Optional overlay text */}
                  <div className="absolute bottom-4 left-4 text-white">
                    <h4 className="text-lg font-semibold mb-1">Interactive Learning</h4>
                    <p className="text-sm text-white/80">Students collaborating and growing together</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats Section */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-300 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div className={`transform transition-all duration-400 delay-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Students Guided</div>
              </div>
              <div className={`transform transition-all duration-400 delay-450 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                <div className="text-gray-600">Career Paths</div>
              </div>
              <div className={`transform transition-all duration-400 delay-500 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                }`}>
                <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                <div className="text-gray-600">Success Rate</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
