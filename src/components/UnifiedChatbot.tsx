"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useOnlineStatus } from './OfflineSupport';
import { useAuth } from '@/contexts/AuthContext';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface UnifiedChatbotProps {
  isOpen?: boolean;
  onClose?: () => void;
  initialMessage?: string;
  context?: string;
  mode?: 'floating' | 'corner' | 'fullscreen';
}

const UnifiedChatbot: React.FC<UnifiedChatbotProps> = ({ 
  isOpen: externalIsOpen, 
  onClose, 
  initialMessage, 
  context,
  mode = 'floating'
}) => {
  const isOnline = useOnlineStatus();
  const { user } = useAuth();
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [hasNewMessage, setHasNewMessage] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if chatbot is open based on mode
  const isOpen = mode === 'fullscreen' ? true : (externalIsOpen !== undefined ? externalIsOpen : internalIsOpen);

  useEffect(() => {
    // Initialize messages based on context and user profile
    const initMessage = initialMessage || (user ? 
      `Hi ${user.displayName || 'there'}! I'm your AI career assistant. I can help with career guidance, entrance exams, and educational paths.` :
      `Hi! I'm your AI career assistant. Ask me about courses, colleges, entrance exams, or career paths!`
    );

    setMessages([{
      id: '1',
      role: 'assistant',
      content: initMessage,
      timestamp: new Date()
    }]);

    // Load user profile for personalized responses
    if (user) {
      try {
        const profileData = localStorage.getItem('userProfile');
        if (profileData) {
          const profile = JSON.parse(profileData);
          if (profile.userId === user.uid) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.log('No user profile found');
      }
    }
  }, [user, initialMessage]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Show notification dot for new assistant messages when closed
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  useEffect(() => {
    // Clear notification when opened
    if (isOpen) {
      setHasNewMessage(false);
      // Auto-focus input when opened
      if (!isMinimized && inputRef.current) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  }, [isOpen, isMinimized]);

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

      // Add context to the message if provided
      const contextualInput = context 
        ? `Context: ${context}. Question: ${currentInput}`
        : currentInput;

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...(userContext ? [{ role: 'system', content: userContext }] : []),
            ...messages.map(m => ({ role: m.role, content: m.content })),
            { role: 'user', content: contextualInput }
          ],
          userProfile: userProfile
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
        setIsStreaming(true);
        let assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, assistantMessage]);

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk.split('\\n');

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
                console.log('Parse error:', e);
              }
            }
          }
        }
        setIsStreaming(false);
      } else {
        const data = await response.json();
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.answer || data.content || 'Sorry, I couldn\'t generate a response.',
          timestamp: new Date()
        };
        setMessages(prev => [...prev, assistantMessage]);
      }

    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I'm having trouble connecting right now. Please try asking: "What are good career options after 12th?" or check your internet connection.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
    }
  };

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const handleOpen = () => {
    if (mode === 'floating') {
      setInternalIsOpen(true);
    }
  };

  const quickSuggestions = [
    "Career options after 12th",
    "Engineering vs Medical",
    "Scholarship opportunities",
    "Top colleges in India",
    "JEE vs NEET preparation"
  ];

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Fullscreen mode (for /chatbot page)
  if (mode === 'fullscreen') {
    return (
      <div className="w-full max-w-4xl mx-auto">
        {/* Chat Messages */}
        <div className="mb-6 h-96 overflow-y-auto space-y-4 bg-white rounded-xl p-6 shadow-lg border">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              {message.role === 'user' ? (
                <div className="flex justify-end">
                  <div className="bg-blue-600 text-white p-4 rounded-2xl rounded-br-md max-w-xs lg:max-w-md shadow-sm">
                    <div className="text-sm">{message.content}</div>
                    <div className="text-xs opacity-75 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex justify-start">
                  <div className="bg-gray-50 border p-4 rounded-2xl rounded-bl-md max-w-xs lg:max-w-2xl shadow-sm">
                    <div className="text-sm text-gray-800 whitespace-pre-wrap">
                      {message.content}
                      {isStreaming && message.id === messages[messages.length - 1]?.id && (
                        <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
          
          {isLoading && !isStreaming && (
            <div className="flex justify-start">
              <div className="bg-gray-50 border p-4 rounded-2xl rounded-bl-md shadow-sm">
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                  <div className="text-sm text-gray-500">Thinking...</div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="bg-white border rounded-xl p-6 shadow-lg">
          {!isOnline && (
            <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-800 text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
              <span>Offline Mode - Limited AI features available</span>
            </div>
          )}
          
          <div className="flex space-x-3">
            <input
              ref={inputRef}
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
              className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Thinking..." : "Send"}
            </button>
          </div>
        </form>

        {/* Quick Suggestions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {quickSuggestions.map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => handleSuggestionClick(suggestion)}
              disabled={isLoading}
              className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-full hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Floating button (when not open)
  if (!isOpen) {
    return (
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={handleOpen}
          className="group relative w-14 h-14 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110"
        >
          <svg className="w-7 h-7 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-ping"></div>
          )}
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-800 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap pointer-events-none">
            Ask me about careers!
            <div className="absolute top-full right-3 w-2 h-2 bg-gray-800 rotate-45 transform -translate-y-1"></div>
          </div>
        </button>
      </div>
    );
  }

  // Corner/Modal mode (when open)
  const isCornerMode = mode === 'corner';
  const containerClasses = isCornerMode 
    ? "fixed bottom-20 right-6 w-[450px] h-[600px] max-w-[90vw] max-h-[80vh]"
    : "fixed bottom-6 right-6 w-80 max-w-sm";

  const heightClasses = isCornerMode 
    ? "h-[600px]" 
    : (isMinimized ? "h-16" : "h-96");

  return (
    <div className={`${containerClasses} bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col transform transition-all duration-300 ease-out translate-y-0 opacity-100 scale-100 pointer-events-auto ${heightClasses}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-2xl flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
          <h3 className="font-semibold text-lg">Career Assistant</h3>
          <div className="text-xs opacity-90">
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {!isCornerMode && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="w-6 h-6 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
            >
              {isMinimized ? (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              )}
            </button>
          )}
          <button
            onClick={handleClose}
            className="w-6 h-6 hover:bg-white/20 rounded flex items-center justify-center transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      </div>

      {!isMinimized && (
        <>
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white rounded-br-md'
                    : 'bg-white text-gray-800 shadow-sm border rounded-bl-md'
                }`}>
                  <p className="whitespace-pre-wrap leading-relaxed text-sm">
                    {message.content}
                    {isStreaming && message.id === messages[messages.length - 1]?.id && (
                      <span className="inline-block w-2 h-4 bg-blue-600 ml-1 animate-pulse"></span>
                    )}
                  </p>
                  <div className={`text-xs mt-1 opacity-70 ${
                    message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && !isStreaming && (
              <div className="flex justify-start">
                <div className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-sm border rounded-bl-md">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestions */}
          {messages.length <= 1 && (
            <div className="px-4 py-2 bg-gray-50 border-t border-gray-100 flex-shrink-0">
              <div className="text-xs text-gray-600 mb-2">Quick questions:</div>
              <div className="flex flex-wrap gap-1">
                {quickSuggestions.slice(0, 3).map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSuggestionClick(suggestion)}
                    disabled={isLoading}
                    className="px-2 py-1 text-xs bg-white border border-gray-200 rounded-full hover:bg-blue-50 hover:border-blue-200 transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input Area */}
          <div className="p-4 bg-white border-t border-gray-100 rounded-b-2xl flex-shrink-0">
            {!isOnline && (
              <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded text-amber-800 text-xs flex items-center gap-1">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span>Offline mode</span>
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="flex space-x-3">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about careers..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl flex items-center justify-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[50px]"
              >
                {isLoading ? (
                  <div className="animate-spin rounded-full h-3 w-3 border-b border-white"></div>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                )}
              </button>
            </form>
            
            <div className="mt-2 flex justify-between items-center">
              <div className="text-xs text-gray-400">
                Powered by AI
              </div>
              {mode !== 'corner' && (
                <a
                  href="/chatbot"
                  className="text-xs text-blue-600 hover:text-blue-800 underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Open full chat →
                </a>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default UnifiedChatbot;