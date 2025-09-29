"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function ProfileComplete() {
  const [loaded, setLoaded] = useState(false);
  const [showSubscriptionPopup, setShowSubscriptionPopup] = useState(true);
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the email to your backend
    console.log("Subscribing email:", email);
    setSubscribed(true);
    
    setTimeout(() => {
      setShowSubscriptionPopup(false);
    }, 2000);
  };

  const skipSubscription = () => {
    setShowSubscriptionPopup(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 relative">
      
      <div className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          {/* Success Message */}
          <div className={`text-center mb-12 transform transition-all duration-500 delay-100 ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Profile Setup <span className="text-green-600">Complete!</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Great! We've got all the information we need to provide you with personalized career recommendations.
            </p>
          </div>

          {/* Next Steps */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Quiz Assessment */}
            <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 delay-200 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Take Assessment Quiz</h2>
              <p className="text-gray-600 mb-6">
                Get even more personalized recommendations by taking our comprehensive career assessment quiz based on your profile.
              </p>
              <div className="space-y-3">
                <Link 
                  href="/quiz/class10"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-center transform hover:scale-105"
                >
                  Class 10 Assessment
                </Link>
                <Link 
                  href="/quiz/class12"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold text-center transform hover:scale-105"
                >
                  Class 12 Assessment
                </Link>
              </div>
            </div>

            {/* AI Guidance */}
            <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center transform transition-all duration-500 delay-300 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Get AI Guidance</h2>
              <p className="text-gray-600 mb-6">
                Chat with our AI career counselor for instant, personalized advice based on your profile and interests.
              </p>
              <button 
                onClick={() => router.push("/chatbot")}
                className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 text-white rounded-full hover:from-purple-700 hover:to-purple-800 transition-all duration-300 font-semibold transform hover:scale-105"
              >
                Start AI Conversation
              </button>
            </div>
          </div>

          {/* Additional Resources */}
          <div className={`bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8 text-center transform transition-all duration-500 delay-400 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Explore More Resources</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Discover colleges, career paths, study materials, and skill development programs tailored to your goals.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link 
                href="/colleges"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-all duration-200 text-center group"
              >
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-orange-200 transition-colors">
                  <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">Colleges</span>
              </Link>

              <Link 
                href="/career-paths"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-all duration-200 text-center group"
              >
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-green-200 transition-colors">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">Career Paths</span>
              </Link>

              <Link 
                href="/study-materials"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-all duration-200 text-center group"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">Study Materials</span>
              </Link>

              <Link 
                href="/study-materials"
                className="p-4 bg-white rounded-lg hover:shadow-lg transition-all duration-200 text-center group"
              >
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-purple-200 transition-colors">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <span className="font-semibold text-sm">More Study Materials</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Subscription Popup */}
      {showSubscriptionPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-fade-in">
            <button
              onClick={skipSubscription}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {!subscribed ? (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5v-5zM12 17H7l5 5v-5z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">Stay Updated!</h3>
                  <p className="text-gray-600 text-sm">
                    Get notifications about admission dates, scholarship deadlines, entrance test schedules, and more!
                  </p>
                </div>

                <form onSubmit={handleSubscription} className="space-y-4">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <button
                    type="submit"
                    className="w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold"
                  >
                    Subscribe to Updates
                  </button>
                </form>

                <button
                  onClick={skipSubscription}
                  className="w-full mt-3 text-sm text-gray-500 hover:text-gray-700"
                >
                  Maybe later
                </button>
              </>
            ) : (
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Thank You!</h3>
                <p className="text-gray-600 text-sm">
                  You're now subscribed to our timeline tracker. We'll keep you updated on important dates and deadlines.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}