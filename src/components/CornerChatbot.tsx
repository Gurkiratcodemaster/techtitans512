"use client";
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface CornerChatbotProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
  context?: string;
}

// Animation variants
const chatbotVariants = {
  closed: {
    opacity: 0,
    scale: 0.8,
    y: 20
  },
  open: {
    opacity: 1,
    scale: 1,
    y: 0
  }
};

const messageVariants = {
  initial: {
    opacity: 0,
    y: 20,
    scale: 0.95
  },
  animate: {
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95
  }
};

const inputVariants = {
  focus: {
    scale: 1.02
  },
  blur: {
    scale: 1
  }
};

const buttonVariants = {
  idle: {
    scale: 1,
    rotate: 0
  },
  hover: {
    scale: 1.05,
    rotate: 15
  },
  tap: {
    scale: 0.95,
    rotate: 5
  }
};

export default function CornerChatbot({ isOpen, onClose, initialMessage, context }: CornerChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: initialMessage || 'Hi! I can help you with career guidance. What would you like to know?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
          messages: [...messages, { role: 'user', content: contextualInput }]
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(`HTTP error! status: ${response.status} - ${errorData.error || 'Unknown error'}`);
      }

      // Handle streaming response
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, assistantMessage]);

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (reader) {
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
                // Ignore parsing errors for individual chunks
              }
            }
          }
        }
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed bottom-20 right-6 w-[450px] h-[600px] max-w-[90vw] max-h-[80vh] bg-white rounded-2xl shadow-2xl border border-gray-200 z-50 flex flex-col"
          variants={chatbotVariants}
          initial="closed"
          animate="open"
          exit="closed"
        >
          {/* Header */}
          <motion.div 
            className="flex items-center justify-between p-5 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-t-2xl"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <motion.div 
                className="w-3 h-3 bg-green-400 rounded-full"
                animate={{ 
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1]
                }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <h3 className="font-semibold text-lg">Career Assistant</h3>
            </div>
            <motion.button
              onClick={onClose}
              className="text-white hover:text-gray-200 transition-colors duration-200 p-1 hover:bg-white/20 rounded-full"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </motion.button>
          </motion.div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-gradient-to-b from-gray-50 to-blue-50/30 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={message.id}
                  className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                  variants={messageVariants}
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 relative ${
                      message.role === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg'
                        : 'bg-white text-gray-800 shadow-md border border-gray-200'
                    }`}
                    whileHover={{ 
                      y: -2,
                      boxShadow: "0 10px 25px rgba(0,0,0,0.15)"
                    }}
                    transition={{ duration: 0.2 }}
                  >
                    {message.role === 'assistant' && (
                      <motion.div 
                        className="absolute -left-2 top-3 w-4 h-4 bg-white border border-gray-200 transform rotate-45"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                    {message.role === 'user' && (
                      <motion.div 
                        className="absolute -right-2 top-3 w-4 h-4 bg-gradient-to-r from-blue-600 to-blue-700 transform rotate-45"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.1 }}
                      />
                    )}
                    <div>
                      <p className="whitespace-pre-wrap leading-relaxed text-sm">{message.content}</p>
                      <div className={`text-xs mt-2 opacity-70 ${
                        message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                      }`}>
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {isLoading && (
              <motion.div 
                className="flex justify-start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <motion.div 
                  className="bg-white text-gray-800 rounded-2xl px-4 py-3 shadow-md border border-gray-200 relative"
                  animate={{ scale: [1, 1.02, 1] }}
                  transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
                >
                  <div className="absolute -left-2 top-3 w-4 h-4 bg-white border border-gray-200 transform rotate-45" />
                  <div className="flex space-x-1">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-blue-500 rounded-full"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{
                          duration: 0.8,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <motion.form 
            onSubmit={handleSubmit} 
            className="p-5 border-t border-gray-200 bg-white rounded-b-2xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.3 }}
          >
            <div className="flex space-x-3">
              <motion.input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about this career path..."
                className="flex-1 px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm transition-all duration-200"
                disabled={isLoading}
                variants={inputVariants}
                whileFocus="focus"
                animate="blur"
              />
              <motion.button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="px-5 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[50px] shadow-lg"
                whileHover={!isLoading && input.trim() ? { scale: 1.05, rotate: 15 } : {}}
                whileTap={!isLoading && input.trim() ? { scale: 0.95, rotate: 5 } : {}}
                animate={isLoading ? { rotate: 360 } : { rotate: 0 }}
                transition={isLoading ? { duration: 0.6, ease: "linear", repeat: Infinity } : { duration: 0.2 }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </motion.button>
            </div>
          </motion.form>
        </motion.div>
      )}
    </AnimatePresence>
  );
}