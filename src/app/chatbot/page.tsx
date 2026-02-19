"use client";

import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export default function ChatbotPage() {
  const { user } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content:
        "Hi! I'm your personalized AI career guidance assistant. I can help you with careers, exams, and salary info!",
      timestamp: new Date(),
    },
  ]);

  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!user) return;

    try {
      const profileData = localStorage.getItem("userProfile");

      if (profileData) {
        const profile = JSON.parse(profileData);

        if (profile.userId === user.id) {
          setUserProfile(profile);

          setMessages([
            {
              id: "1",
              role: "assistant",
              content: `Hi ${profile.fullName}! I know you're interested in ${profile.careerInterests
                .slice(0, 2)
                .join(" and ")}. How can I help you today?`,
              timestamp: new Date(),
            },
          ]);
        }
      }
    } catch {
      console.log("No profile found");
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (shouldAutoScroll && messages.length > 1) {
      scrollToBottom();
      setShouldAutoScroll(false);
    }
  }, [messages, shouldAutoScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setShouldAutoScroll(true);

    const currentInput = input;

    setInput("");
    setIsLoading(true);

    try {
      let userContext = "";

      if (userProfile) {
        userContext = `
Name: ${userProfile.fullName}
Education: ${userProfile.currentClass}
Location: ${userProfile.location}
Interests: ${userProfile.careerInterests.join(", ")}
`;
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...(userContext
              ? [{ role: "system", content: userContext }]
              : []),
            ...messages.map((m) => ({
              role: m.role,
              content: m.content,
            })),
            { role: "user", content: currentInput },
          ],
        }),
      });

      const data = await response.json();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content:
          data.answer || data.content || "Sorry, I couldn't reply.",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setShouldAutoScroll(true);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "assistant",
          content: "Error. Please try again.",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100 py-12 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-3xl p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-center mb-6">
          AI Career Guidance Chatbot
        </h1>

        <div className="h-96 overflow-y-auto space-y-4 bg-gray-50 rounded-lg p-4 mb-6">

          {messages.map((msg) => (
            <div key={msg.id}>
              {msg.role === "user" ? (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-3 rounded-lg max-w-md">
                    {msg.content}
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="bg-white p-3 rounded-lg shadow max-w-2xl">
                    {msg.content}
                  </div>
                </div>
              )}
            </div>
          ))}

          {isLoading && (
            <div className="text-sm text-gray-500">
              Thinking...
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSubmit} className="flex gap-3">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 border p-3 rounded-lg"
            placeholder="Ask about careers, exams, salaries..."
          />

          <button
            disabled={isLoading}
            className="bg-blue-600 text-white px-6 rounded-lg hover:bg-blue-700"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
