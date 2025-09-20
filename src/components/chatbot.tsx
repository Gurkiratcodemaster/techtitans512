"use client";
import { useState } from "react";

export default function Chatbot() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("Hi! I'm your career guidance assistant. Ask me about engineering, medical, business careers, entrance exams, or salary information!");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setLoading(true);
    const currentQuestion = question;
    setQuestion("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: currentQuestion }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setAnswer(data.answer || "No response from bot");
      
    } catch (err) {
      console.error("Chat error:", err);
      setAnswer(`Error: ${err instanceof Error ? err.message : 'Unable to get response'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border">
        <div className="text-gray-800 leading-relaxed">{loading ? "Thinking..." : answer}</div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4 shadow-sm">
        <div className="flex space-x-3">
          <input
            type="text"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask about careers, exams, salaries..."
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            disabled={loading || !question.trim()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Thinking..." : "Send"}
          </button>
        </div>
      </form>
    </div>
  );
}

export const openChatbot = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/chatbot';
  }
};
