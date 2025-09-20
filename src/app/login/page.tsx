"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("student");
  const [standard, setStandard] = useState("");
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
        <div className="max-w-md mx-auto">
          {/* Hero Section */}
          <div className={`text-center mb-8 transform transition-all duration-500 ease-out delay-50 ${loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
            }`}>
            <h1 className={`text-4xl font-bold text-gray-800 mb-4 transform transition-all duration-400 delay-100 ${loaded ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
              }`}>
              {isSignup ? "Join" : "Welcome to"} <span className="text-blue-600">Career Choice</span>
            </h1>
            <p className={`text-lg text-gray-600 transform transition-all duration-400 delay-150 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
              {isSignup ? "Create your account to get started" : "Sign in to continue your career journey"}
            </p>
          </div>

          {/* Login Form */}
          <div className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-200 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
            <h2 className={`text-2xl font-bold text-gray-800 text-center mb-6 transform transition-all duration-400 delay-250 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              {isSignup ? "Create Account" : "Welcome Back"}
            </h2>

            <form className={`space-y-5 transform transition-all duration-400 delay-300 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
              <div className={`transform transition-all duration-300 delay-350 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}>
                <input
                  type="text"
                  placeholder="Email or Mobile"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                />
              </div>
              
              <div className={`transform transition-all duration-300 delay-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}>
                <input
                  type="password"
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                />
              </div>

              {isSignup && (
                <>
                  <div className={`transform transition-all duration-300 delay-450 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}>
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                    />
                  </div>
                  
                  <div className={`transform transition-all duration-300 delay-500 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                    }`}>
                    <select
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-gray-700 bg-white/80"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="teacher">Teacher</option>
                      <option value="admin">Admin</option>
                      <option value="parent">Parent</option>
                    </select>
                  </div>
                  
                  {role === "student" && (
                    <div className={`transform transition-all duration-300 delay-550 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                      }`}>
                      <input
                        type="text"
                        placeholder="Class/Standard"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                        value={standard}
                        onChange={(e) => setStandard(e.target.value)}
                      />
                    </div>
                  )}
                </>
              )}

              <button
                type="submit"
                className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 delay-450 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-5 opacity-0 scale-95'
                  }`}
              >
                {isSignup ? "Create Account" : "Sign In"}
              </button>
            </form>

            <div className={`mt-6 text-center transform transition-all duration-400 delay-500 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
              }`}>
              <p className="text-sm text-gray-600">
                {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
                <button
                  type="button"
                  className="text-blue-600 hover:text-blue-700 font-medium focus:outline-none hover:underline"
                  onClick={() => setIsSignup(!isSignup)}
                >
                  {isSignup ? "Sign In" : "Sign Up"}
                </button>
              </p>
            </div>
          </div>

          {/* Additional Info */}
          <div className={`mt-8 bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg text-center transform transition-all duration-500 ease-out delay-400 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-20 opacity-0 scale-95'
            }`}>
            <p className={`text-sm text-gray-600 transform transition-all duration-400 delay-550 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
              }`}>
              By signing in, you agree to our{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="#" className="text-blue-600 hover:text-blue-700 hover:underline">
                Privacy Policy
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}