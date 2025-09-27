"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useOnlineStatus } from './OfflineSupport';
import { useAuth } from '@/contexts/AuthContext';
import { UserUtils } from '@/lib/database';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatbotSystemProps {
  mode?: 'fullscreen' | 'floating' | 'corner' | 'embedded';
  isOpen?: boolean;
  onClose?: () => void;
  initialMessage?: string;
  context?: string;
  className?: string;
}

const ChatbotSystem: React.FC<ChatbotSystemProps> = ({ 
  mode = 'floating',
  isOpen: externalIsOpen, 
  onClose, 
  initialMessage, 
  context,
  className = ''
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
  const [shouldAutoScroll, setShouldAutoScroll] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Determine if chatbot is open based on mode
  const isOpen = mode === 'fullscreen' || mode === 'embedded' ? true : 
    (externalIsOpen !== undefined ? externalIsOpen : internalIsOpen);

  // Initialize messages
  useEffect(() => {
    const getInitialMessage = () => {
      if (initialMessage) return initialMessage;
      
      if (userProfile) {
        return `Hi ${userProfile.fullName}! I'm your personalized AI career guidance assistant. I know you're interested in ${userProfile.careerInterests?.slice(0, 2).join(' and ')}, currently in ${userProfile.currentClass}, and I'm here to help with tailored advice about careers, entrance exams, and educational paths!`;
      }
      
      if (user) {
        return `Hi ${UserUtils.getDisplayName(user)}! I'm your AI career assistant. I can help with career guidance, entrance exams, and educational paths.`;
      }
      
      return "Hi! 👋 I'm your AI career assistant. Ask me about courses, colleges, entrance exams, or career paths!";
    };

    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: getInitialMessage(),
        timestamp: new Date()
      }]);
    }
  }, [userProfile, user, initialMessage, messages.length]);

  // Load user profile
  useEffect(() => {
    if (user) {
      try {
        const profileData = localStorage.getItem('userProfile');
        if (profileData) {
          const profile = JSON.parse(profileData);
          if (profile.userId === user.id) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.log('No user profile found');
      }
    }
  }, [user]);

  // Auto-scroll management
  const scrollToBottom = () => {
    if (shouldAutoScroll) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (shouldAutoScroll) {
      scrollToBottom();
    }
  }, [messages, shouldAutoScroll]);

  // Show notification for new messages when chatbot is closed
  useEffect(() => {
    if (!isOpen && messages.length > 1 && messages[messages.length - 1].role === 'assistant') {
      setHasNewMessage(true);
    }
  }, [messages, isOpen]);

  // Clear notification when opened
  useEffect(() => {
    if (isOpen) {
      setHasNewMessage(false);
    }
  }, [isOpen]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      setInternalIsOpen(false);
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || isLoading || !isOnline) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setIsStreaming(true);
    setShouldAutoScroll(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: input.trim(),
          context: context,
          userProfile: userProfile,
          conversationHistory: messages.slice(-10) // Last 10 messages for context
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      if (!response.body) {
        throw new Error('No response body');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      const assistantMessage: Message = {
        id: Date.now().toString() + '_assistant',
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.content) {
                setMessages(prev => prev.map(msg => 
                  msg.id === assistantMessage.id 
                    ? { ...msg, content: msg.content + data.content }
                    : msg
                ));
              }
            } catch (e) {
              // Ignore parsing errors for incomplete chunks
            }
          }
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString() + '_error',
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
      setIsStreaming(false);
      setShouldAutoScroll(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  // Different layouts based on mode
  const getContainerClasses = () => {
    const baseClasses = "bg-white rounded-lg shadow-2xl border border-gray-200";
    
    switch (mode) {
      case 'fullscreen':
        return `${baseClasses} w-full h-full max-h-screen ${className}`;
      case 'floating':
        return `${baseClasses} fixed bottom-6 right-6 w-80 h-96 z-50 ${className}`;
      case 'corner':
        return `${baseClasses} fixed bottom-4 right-4 w-80 h-96 z-50 ${className}`;
      case 'embedded':
        return `${baseClasses} w-full h-full ${className}`;
      default:
        return `${baseClasses} ${className}`;
    }
  };

  const getChatHeight = () => {
    switch (mode) {
      case 'fullscreen':
        return 'calc(100vh - 140px)';
      case 'floating':
      case 'corner':
        return '280px';
      case 'embedded':
        return '400px';
      default:
        return '300px';
    }
  };

  // Floating action button for floating and corner modes
  const FloatingButton = () => {
    if (mode !== 'floating' && mode !== 'corner') return null;
    
    if (!isOpen) {
      return (
        <button
          onClick={() => mode === 'floating' ? setInternalIsOpen(true) : onClose?.()}
          className={`fixed ${mode === 'corner' ? 'bottom-4 right-4' : 'bottom-6 right-6'} 
            w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 
            rounded-full shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center justify-center text-white z-50 group
            hover:scale-110 active:scale-90`}
        >
          <svg 
            className="w-6 h-6 transition-transform group-hover:scale-110" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          {hasNewMessage && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      );
    }

  const ChatInterface = () => (
    <div className={getContainerClasses()}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 rounded-t-lg">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">AI Career Assistant</h3>
            <p className="text-xs text-gray-600">
              {!isOnline ? 'Offline' : isStreaming ? 'Typing...' : 'Online'}
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-1">
          {(mode === 'floating' || mode === 'corner') && (
            <button
              onClick={() => setIsMinimized(!isMinimized)}
              className="p-1 hover:bg-gray-200 rounded text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
          )}
          {mode !== 'fullscreen' && mode !== 'embedded' && (
            <button
              onClick={handleClose}
              className="p-1 hover:bg-gray-200 rounded text-gray-600"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      {!isMinimized && (
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white"
          style={{ height: getChatHeight() }}
        >
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={messageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.3 }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white' 
                    : 'bg-white border border-gray-200 text-gray-800 shadow-sm'
                }`}>
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  {message.role === 'assistant' && isStreaming && message === messages[messages.length - 1] && (
                    <div className="mt-1">
                      <div className="typing-indicator">
                        <span></span>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      {!isMinimized && (
        <div className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
          {!isOnline && (
            <div className="mb-2 text-center">
              <span className="text-xs text-red-500 bg-red-50 px-2 py-1 rounded">
                You're offline. Please check your connection.
              </span>
            </div>
          )}
          <div className="flex space-x-2">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={isOnline ? "Ask about careers, courses, or exams..." : "You're offline"}
              disabled={!isOnline || isLoading}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isLoading || !isOnline}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center min-w-[44px]"
            >
              {isLoading ? (
                <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );

  // Return based on mode
  if (mode === 'fullscreen' || mode === 'embedded') {
    return <ChatInterface />;
  }

  return (
    <>
      <FloatingButton />
      <AnimatePresence>
        {isOpen && (
          <motion.div
            variants={chatbotVariants}
            initial="closed"
            animate="open"
            exit="closed"
            transition={{ duration: 0.3 }}
          >
            <ChatInterface />
          </motion.div>
        )}
      </AnimatePresence>
      
      <style jsx>{`
        .typing-indicator {
          display: flex;
          gap: 2px;
        }
        .typing-indicator span {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background-color: #6b7280;
          animation: typing 1.4s infinite ease-in-out;
        }
        .typing-indicator span:nth-child(1) { animation-delay: -0.32s; }
        .typing-indicator span:nth-child(2) { animation-delay: -0.16s; }
        
        @keyframes typing {
          0%, 80%, 100% { transform: scale(0); opacity: 0.5; }
          40% { transform: scale(1); opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default ChatbotSystem;