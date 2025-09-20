// /app/chatbot/page.tsx
"use client";
import { Navbar } from "@/components/navbar";
import Chatbot from "@/components/chatbot";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-800 mb-4">
              AI Career <span className="text-blue-600">Guidance</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Get personalized career advice and guidance from our intelligent assistant
            </p>
          </div>

          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}
