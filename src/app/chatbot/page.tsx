// /app/chatbot/page.tsx
"use client";
import { Navbar } from "@/components/navbar";
import Chatbot from "@/components/chatbot";
import { HeroSection } from "@/components/HeroSection";

export default function ChatbotPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      
      <HeroSection 
        title="AI Career Guidance"
        subtitle="Get personalized career advice and guidance from our intelligent assistant"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            <Chatbot />
          </div>
        </div>
      </div>
    </div>
  );
}
