"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import dynamic from 'next/dynamic';

// Dynamically import the D3 component to avoid SSR issues
const CareerPathVisualization = dynamic(
  () => import("../../components/CareerPathVisualization"),
  { 
    ssr: false,
    loading: () => <p className="text-center py-8">Loading visualization...</p>
  }
);

interface QuizResults {
  score: number;
  interests: string[];
  strengths: string[];
  recommendedDegrees: string[];
}

export default function CareerResultsPage() {
  const [loaded, setLoaded] = useState(false);
  const [showVisualization, setShowVisualization] = useState(true);
  
  // Mock quiz results - in real app, this would come from quiz completion
  const [results] = useState<QuizResults>({
    score: 85,
    interests: ["Technology", "Problem Solving", "Innovation"],
    strengths: ["Analytical Thinking", "Mathematics", "Science"],
    recommendedDegrees: ["B.Tech Computer Science", "B.Tech Electronics", "B.Sc Data Science", "BCA"]
  });

  useEffect(() => {
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
          {/* Results Header */}
          <div className={`text-center mb-12 transform transition-all duration-500 ease-out delay-50 ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <div className="mb-4">
              <span className="inline-block px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-semibold mb-4">
                🎯 Interactive Career Path Explorer
              </span>
            </div>
            <h1 className={`text-5xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-100 ${
              loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
            }`}>
              Your Career Assessment <span className="text-blue-600">Results</span>
            </h1>
            <p className={`text-xl text-gray-600 max-w-3xl mx-auto transform transition-all duration-400 delay-150 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>
              Explore interactive diagrams showing your complete journey from degrees to dream careers!
            </p>
          </div>

          {/* Score Card */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg transform transition-all duration-500 ease-out delay-200 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full mb-4 transform transition-all duration-400 delay-250 ${
                loaded ? 'rotate-0 scale-100' : 'rotate-180 scale-0'
              }`}>
                <span className="text-3xl font-bold text-white">{results.score}%</span>
              </div>
              <h2 className={`text-2xl font-bold text-gray-800 mb-2 transform transition-all duration-400 delay-300 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                Assessment Score
              </h2>
              <p className={`text-gray-600 transform transition-all duration-400 delay-350 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                Great job! Your responses show strong potential in technical fields.
              </p>
            </div>
          </div>

          {/* Recommended Degrees */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg transform transition-all duration-500 ease-out delay-300 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <h2 className={`text-3xl font-bold text-gray-800 mb-6 text-center transform transition-all duration-400 delay-350 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Recommended Degrees
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {results.recommendedDegrees.map((degree, index) => (
                <div
                  key={degree}
                  className={`bg-gradient-to-r from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200 transform transition-all duration-400 ${
                    loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
                  }`}
                  style={{ transitionDelay: `${400 + index * 50}ms` }}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-3"></div>
                    <h3 className="text-lg font-semibold text-gray-800">{degree}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    High compatibility based on your interests and strengths
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Interests & Strengths */}
          <div className="grid md:grid-cols-2 gap-8 mb-8">
            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-400 ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
              <h3 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-450 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                Your Interests
              </h3>
              <div className="space-y-3">
                {results.interests.map((interest, index) => (
                  <div
                    key={interest}
                    className={`flex items-center transform transition-all duration-300 ${
                      loaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}
                    style={{ transitionDelay: `${500 + index * 50}ms` }}
                  >
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{interest}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-450 ${
              loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
              <h3 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-500 ${
                loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
                Your Strengths
              </h3>
              <div className="space-y-3">
                {results.strengths.map((strength, index) => (
                  <div
                    key={strength}
                    className={`flex items-center transform transition-all duration-300 ${
                      loaded ? 'translate-x-0 opacity-100' : '-translate-x-5 opacity-0'
                    }`}
                    style={{ transitionDelay: `${550 + index * 50}ms` }}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                    <span className="text-gray-700">{strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Career Path Visualization Button */}
          <div className={`text-center mb-12 transform transition-all duration-500 ease-out delay-500 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <button
              onClick={() => setShowVisualization(!showVisualization)}
              className={`px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold rounded-full shadow-lg hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 ${
                showVisualization ? 'bg-blue-700' : ''
              }`}
            >
              {showVisualization ? 'Hide' : 'Explore'} Interactive Career Path Diagram
            </button>
          </div>

          {/* Career Path Visualization */}
          {showVisualization && (
            <div className={`transform transition-all duration-500 ease-out ${
              showVisualization ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <CareerPathVisualization recommendedDegrees={results.recommendedDegrees} />
            </div>
          )}

          {/* Next Steps */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-8 shadow-lg text-center transform transition-all duration-500 ease-out delay-600 ${
            loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
          }`}>
            <h3 className={`text-2xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-650 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Ready to Take the Next Step?
            </h3>
            <p className={`text-gray-600 mb-6 transform transition-all duration-400 delay-700 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Talk to our career counselor for personalized guidance
            </p>
            <button className={`px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 transform hover:scale-105 delay-750 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
            }`}>
              Book Counseling Session
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}