"use client";
import { useState } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("student");
  const [standard, setStandard] = useState("");

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="bg-white p-8 sm:p-10 rounded-2xl shadow-2xl w-full max-w-sm transform transition-all duration-500 hover:scale-105">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          {isSignup ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-gray-600 mb-8">
          {isSignup ? "Join our community!" : "Sign in to your account."}
        </p>

        <form className="space-y-5">
          <input
            type="text"
            placeholder="Email or Mobile"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400"
          />

          {isSignup && (
            <>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400"
              />
              <select
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 text-gray-700"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="parent">Parent</option>
              </select>
              {role === "student" && (
                <input
                  type="text"
                  placeholder="Class/Standard"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 focus:border-transparent outline-none transition-all duration-300 placeholder-gray-400"
                  value={standard}
                  onChange={(e) => setStandard(e.target.value)}
                />
              )}
            </>
          )}

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 rounded-xl shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300"
          >
            {isSignup ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-sm mt-6 text-center text-gray-600">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            type="button"
            className="text-purple-600 hover:underline font-medium focus:outline-none"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}
