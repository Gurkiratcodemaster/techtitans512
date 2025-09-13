"use client";
import { useState } from "react";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">
          {isSignup ? "Sign Up" : "Login"}
        </h2>


        <input
          type="text"
          placeholder="Email or Mobile"
          className="w-full p-2 border rounded mb-3"
        />
        <input
          type="password"
          placeholder="Password"
          className="w-full p-2 border rounded mb-3"
        />


        {isSignup && (
          <>
            <input
              type="text"
              placeholder="Full Name"
              className="w-full p-2 border rounded mb-3"
            />
            <select className="w-full p-2 border rounded mb-3">
              <option value="student">Student</option>
              <option value="teacher">Teacher</option>
              <option value="admin">Admin</option>
              <option value="parent">Parent</option>
            </select>
          </>
        )}

        <button className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">
          {isSignup ? "Create Account" : "Login"}
        </button>

        <p className="text-sm mt-4 text-center">
          {isSignup ? "Already have an account?" : "Don’t have an account?"}{" "}
          <button
            className="text-blue-600 underline"
            onClick={() => setIsSignup(!isSignup)}
          >
            {isSignup ? "Login" : "Sign Up"}
          </button>
        </p>
      </div>
    </div>
  );
}