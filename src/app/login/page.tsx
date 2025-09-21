"use client";
import { useState, useEffect } from "react";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Navbar } from "@/components/navbar";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("student");
  const [standard, setStandard] = useState("");
  const [loaded, setLoaded] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Password validation rules
  const validatePassword = (password: string) => {
    const minLength = password.length >= 8;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    
    return {
      isValid: minLength && hasUpper && hasLower && hasNumber && hasSpecial,
      rules: {
        minLength,
        hasUpper,
        hasLower,
        hasNumber,
        hasSpecial
      }
    };
  };

  useEffect(() => {
    // Trigger animations after component mounts
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 50);

    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isSignup) {
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
          throw new Error("Password does not meet security requirements");
        }
        
        await createUserWithEmailAndPassword(auth, email, password);
        // Redirect to onboarding for new users
        router.push("/onboarding");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        // Check if user has completed onboarding
        const existingProfile = localStorage.getItem('userProfile');
        if (existingProfile) {
          const profile = JSON.parse(existingProfile);
          if (profile.onboardingCompleted) {
            router.push("/");
          } else {
            router.push("/onboarding");
          }
        } else {
          router.push("/onboarding");
        }
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleGoogleAuth = async () => {
    setLoading(true);
    setError("");
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      
      // Check if this is a new user (Google signup) or existing user
      const existingProfile = localStorage.getItem('userProfile');
      if (existingProfile) {
        const profile = JSON.parse(existingProfile);
        if (profile.userId === result.user.uid && profile.onboardingCompleted) {
          router.push("/");
        } else {
          router.push("/onboarding");
        }
      } else {
        // New user or no profile found - go to onboarding
        router.push("/onboarding");
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

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

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}

            {/* Google Auth Button */}
            <button
              type="button"
              onClick={handleGoogleAuth}
              disabled={loading}
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 mb-4"
            >
              <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            <form onSubmit={handleSubmit} className={`space-y-5 transform transition-all duration-400 delay-300 ${loaded ? 'translate-x-0 opacity-100' : 'translate-x-10 opacity-0'
              }`}>
              <div className={`transform transition-all duration-300 delay-350 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                />
              </div>
              
              <div className={`transform transition-all duration-300 delay-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                }`}>
                <input
                  type="password"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                />
                {isSignup && password && (
                  <div className="mt-2 text-xs space-y-1">
                    {Object.entries(validatePassword(password).rules).map(([rule, valid]) => (
                      <div key={rule} className={`flex items-center ${valid ? 'text-green-600' : 'text-red-600'}`}>
                        <span className="mr-1">{valid ? '✓' : '✗'}</span>
                        <span>
                          {rule === 'minLength' && '8+ characters'}
                          {rule === 'hasUpper' && 'Uppercase letter'}
                          {rule === 'hasLower' && 'Lowercase letter'}
                          {rule === 'hasNumber' && 'Number'}
                          {rule === 'hasSpecial' && 'Special character'}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {isSignup && (
                <>
                    <div className={`transform transition-all duration-300 delay-450 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
                      }`}>
                      <input
                        type="text"
                        placeholder="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
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
                disabled={loading}
                className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white font-semibold py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 delay-450 ${loaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-5 opacity-0 scale-95'
                  }`}
              >
                {loading ? (isSignup ? "Creating Account..." : "Signing In...") : (isSignup ? "Create Account" : "Sign In")}
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