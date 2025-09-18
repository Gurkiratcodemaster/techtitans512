export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-br from-indigo-500 via-sky-500 to-teal-500 p-4">
      <h1 className="text-4xl sm:text-5xl font-bold text-white mb-8">
        Welcome to Your Hub
      </h1>

      {/* Row of three boxes */}
      <div className="flex flex-col sm:flex-row gap-6">
        
        {/* Box 1: Quiz */}
        <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Career Quiz</h2>
          <p className="mb-4">Find out which career suits you best!</p>
          <div className="flex flex-col gap-3">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-105">
              Class 10 Quiz
            </button>
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-all duration-300 hover:scale-105">
              Class 12 Quiz
            </button>
          </div>
        </div>

        {/* Box 2: Chatbot */}
        <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Chat with AI</h2>
          <p className="mb-4">Get personalized guidance about your career path.</p>
          <button className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-all duration-300 hover:scale-105">
            Start Chat
          </button>
        </div>

        {/* Box 3: Placeholder */}
        <div className="flex-1 bg-white/90 backdrop-blur-lg rounded-3xl p-6 shadow-lg text-center">
          <h2 className="text-2xl font-semibold mb-4">Coming Soon</h2>
          <p>Stay tuned! We will add something exciting here soon.</p>
        </div>

      </div>
    </div>
  );
}
