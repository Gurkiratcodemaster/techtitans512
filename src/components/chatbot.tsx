"use client";
import { useState, useRef, useEffect } from 'react';
import { useOnlineStatus } from './OfflineSupport';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function Chatbot() {
  const isOnline = useOnlineStatus();
  const { user } = useAuth();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: 'Hi! I\'m your personalized AI career guidance assistant. I have access to your profile information to provide tailored advice about engineering, medical, business careers, entrance exams, and salary information!',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false); // Track if we should auto-scroll
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load user profile for personalized responses
    if (user) {
      try {
        const profileData = localStorage.getItem('userProfile');
        if (profileData) {
          const profile = JSON.parse(profileData);
          if (profile.userId === user.id) {
            setUserProfile(profile);
            // Update initial message with personalized greeting without auto-scroll
            setMessages([{
              id: '1',
              role: 'assistant',
              content: `Hi ${profile.fullName}! I'm your personalized AI career guidance assistant. I know you're interested in ${profile.careerInterests.slice(0, 2).join(' and ')}, currently in ${profile.currentClass}, and I'm here to help with tailored advice about careers, entrance exams, and educational paths!`,
              timestamp: new Date()
            }]);
          }
        }
      } catch (error) {
        console.log('No user profile found');
      }
    }
  }, [user]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    // Only scroll to bottom if we should auto-scroll (after user interactions, not initial load)
    if (shouldAutoScroll && messages.length > 1) {
      scrollToBottom();
      setShouldAutoScroll(false); // Reset flag after scrolling
    }
  }, [messages, shouldAutoScroll]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setShouldAutoScroll(true); // Enable auto-scroll for user interactions
    const currentInput = input;
    setInput('');
    setIsLoading(true);

    try {
      // Prepare user context for personalized responses
      let userContext = '';
      if (userProfile) {
        userContext = `User Profile Context: 
        - Name: ${userProfile.fullName}
        - Education: ${userProfile.currentEducation}, ${userProfile.currentClass}
        - Location: ${userProfile.location}
        - Career Interests: ${userProfile.careerInterests.join(', ')}
        - Current Subjects: ${userProfile.currentSubjects.join(', ')}
        - Strengths: ${userProfile.strengths.join(', ')}
        - Academic Goals: ${userProfile.academicGoals}
        - Study Mode Preference: ${userProfile.preferredStudyMode}
        
        Please provide personalized career guidance based on this profile information.
        `;
      }

      // Check if we have OpenAI configured for streaming
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...(userContext ? [{ role: 'system', content: userContext }] : []),
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: currentInput }
          ],
          userProfile: userProfile // Include profile data
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.error('API Error Response:', errorData);
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        // Handle streaming response from OpenAI
        setIsStreaming(true);
        let assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);
        setShouldAutoScroll(true); // Enable auto-scroll for AI response

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') break;
              
              try {
                const parsed = JSON.parse(data);
                if (parsed.content) {
                  assistantMessage.content += parsed.content;
                  setMessages(prev => 
                    prev.map(m => 
                      m.id === assistantMessage.id 
                        ? { ...m, content: assistantMessage.content }
                        : m
                    )
                  );
                }
              } catch (e) {
                // Skip parsing errors
                console.log('Parse error:', e);
              }
            }
          }
        }
        setIsStreaming(false);
      } else {
        // Handle non-streaming response (fallback)
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer || data.content || 'Sorry, I couldn\'t generate a response.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
        setShouldAutoScroll(true); // Enable auto-scroll for AI response
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Error: ${error instanceof Error ? error.message : 'Unable to get response'}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
      setShouldAutoScroll(true); // Enable auto-scroll for error message
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="mb-6 h-96 overflow-y-auto space-y-4 bg-gray-50 rounded-lg p-4">
        {messages.map((message) => (
          <div key={message.id} className="space-y-2">
            {message.role === 'user' ? (
              <div className="flex justify-end">
                <div className="bg-blue-500 text-white p-3 rounded-lg max-w-xs lg:max-w-md">
                  <div className="text-sm">{message.content}</div>
                </div>
              </div>
            ) : (
              <div className="flex justify-start">
                <div className="bg-white p-3 rounded-lg max-w-xs lg:max-w-2xl shadow-sm">
                  <div className="text-sm text-gray-800 whitespace-pre-wrap">
                    {message.content}
                    {isStreaming && message.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-2 h-4 bg-blue-500 ml-1 animate-pulse"></span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
        
        {isLoading && !isStreaming && (
          <div className="flex justify-start">
            <div className="bg-white p-3 rounded-lg shadow-sm">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <div className="text-sm text-gray-500">Thinking...</div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-4 shadow-sm">
        {/* Connection Status */}
        {!isOnline && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
            <span>Offline Mode - Limited AI features. Basic career guidance available.</span>
          </div>
        )}
        
        <div className="flex space-x-3">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isOnline 
              ? "Ask about careers, exams, salaries, or study paths..."
              : "Try: 'engineering careers' or 'NEET preparation' (Offline mode)"
            }
            className="flex-1 p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className={`px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
              isOnline 
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-amber-600 hover:bg-amber-700 text-white'
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {isLoading ? "Thinking..." : isOnline ? "Send" : "Ask (Offline)"}
          </button>
        </div>
      </form>

      {/* Quick Suggestions */}
      <div className="mt-4 flex flex-wrap gap-2">
        {[
          "What careers are good after B.Tech?",
          "Tell me about NEET exam",
          "MBA vs M.Tech which is better?",
          "Software engineer salary in India"
        ].map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => handleSuggestionClick(suggestion)}
            disabled={isLoading}
            className="px-3 py-1 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
}

export const openChatbot = () => {
  if (typeof window !== 'undefined') {
    window.location.href = '/chatbot';
  }
};
