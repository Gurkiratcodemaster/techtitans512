"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/database";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";
import HeroSection from "@/components/HeroSection";
import { BACKGROUNDS, COLORS, RESPONSIVE } from "@/lib/theme";

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

    if (isSignup && !validatePassword(password).isValid) {
      setError("Password does not meet requirements");
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        // Sign up logic
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              role: role,
              standard: standard,
            }
          }
        });

        if (authError) {
          throw authError;
        }

        if (authData.user) {
          router.push("/onboarding");
        }
      } else {
        // Sign in logic
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (authError) {
          throw authError;
        }

        handleLoginSuccess(authData.user);
      }
    } catch (error: any) {
      setError(error.message);
    }
    setLoading(false);
  };

  const handleLoginSuccess = async (user: any) => {
    // Check if user has completed profile
    const { data: profile } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (!profile) {
      router.push('/profile-setup');
    } else {
      router.push('/dashboard');
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/onboarding`
        }
      });
      if (error) throw error;
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <div className={BACKGROUNDS.PAGE_PRIMARY + " min-h-screen"}>
      <Navbar />
      <HeroSection 
        title={isSignup ? "Join Career Choice" : "Welcome Back"}
        subtitle={isSignup ? "Create your account to unlock personalized career guidance and assessments" : "Sign in to continue your career discovery journey"}
        loaded={loaded}
      />
      
      <div className={RESPONSIVE.container + " " + RESPONSIVE.section}>
        <div className="max-w-md mx-auto">
          <div className={BACKGROUNDS.card + " " + RESPONSIVE.cardLarge + " p-8"}>
            <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
              {isSignup ? "Create Account" : "Sign In"}
            </h2>

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
              className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-300 hover:shadow-md disabled:opacity-50 mb-4"
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

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                />
              </div>
              
              <div>
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
                      <div 
                        key={rule} 
                        className={`flex items-center ${valid ? 'text-green-600' : 'text-red-600'}`}
                      >
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
                  <div>
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400 bg-white/80"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/80"
                    >
                      <option value="student">Student</option>
                      <option value="parent">Parent</option>
                      <option value="counselor">Counselor</option>
                    </select>

                    {role === "student" && (
                      <select
                        value={standard}
                        onChange={(e) => setStandard(e.target.value)}
                        required
                        className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 bg-white/80"
                      >
                        <option value="">Select Standard</option>
                        <option value="9">Class 9</option>
                        <option value="10">Class 10</option>
                        <option value="11">Class 11</option>
                        <option value="12">Class 12</option>
                        <option value="graduate">Graduate</option>
                      </select>
                    )}
                  </div>
                </>
              )}

              <button
                type="submit"
                disabled={loading}
                className={`w-full ${COLORS.primary.gradient} ${COLORS.primary.gradientHover} ${RESPONSIVE.button} disabled:opacity-50 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200`}
              >
                {loading ? (
                  <div className="flex items-center justify-center">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2 animate-spin" />
                    {isSignup ? "Creating Account..." : "Signing In..."}
                  </div>
                ) : (
                  isSignup ? "Create Account" : "Sign In"
                )}
              </button>
            </form>

            <div className="mt-6 text-center">
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
          <div className={BACKGROUNDS.card + " p-6 text-center mt-6"}>
            <p className="text-sm text-gray-600">
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