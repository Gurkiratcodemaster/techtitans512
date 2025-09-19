import { Navbar } from "@/components/navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 px-8">
        <div className="max-w-6xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-bold text-gray-800 mb-6">
              Welcome to <span className="text-blue-600">Career Choice</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover your perfect career path with our AI-powered guidance, personalized assessments, and expert recommendations.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Career Quiz Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Career Assessment</h2>
              <p className="text-gray-600 mb-6">Take our comprehensive quiz to discover which career paths align with your skills and interests.</p>
              <div className="space-y-3">
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold cursor-pointer">
                  Class 10 Assessment
                </button>
                <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 font-semibold cursor-pointer">
                  Class 12 Assessment
                </button>
              </div>
            </div>

            {/* AI Chatbot Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">AI Career Guidance</h2>
              <p className="text-gray-600 mb-6">Chat with our intelligent assistant for personalized career advice and guidance tailored to your goals.</p>
              <button className="cursor-pointer w-full px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full hover:from-green-600 hover:to-green-700 transition-all duration-300 font-semibold">
                Start Conversation
              </button>
            </div>

            {/* Resources Card */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Learning Resources</h2>
              <p className="text-gray-600 mb-6">Access curated educational content, courses, and materials to develop skills for your chosen career path.</p>
              <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-full hover:from-purple-600 hover:to-purple-700 transition-all duration-300 font-semibold">
                Coming Soon
              </button>
            </div>
          </div>

          {/* Stats Section */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <div className="text-3xl font-bold text-blue-600 mb-2">10,000+</div>
                <div className="text-gray-600">Students Guided</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 mb-2">500+</div>
                <div className="text-gray-600">Career Paths</div>
              </div>
              <div>
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
