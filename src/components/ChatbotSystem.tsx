"use client";
import React from 'react';

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
  isOpen, 
  onClose, 
  initialMessage = "Hi! I'm your AI career assistant.",
  context,
  className = ''
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-lg p-4 ${className}`}>
      <div className="text-center">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">Career Assistant</h3>
        <p className="text-gray-600 text-sm">{initialMessage}</p>
        <p className="text-gray-500 text-xs mt-2">
          Advanced chatbot features are being updated. Please use the corner chatbot for full functionality.
        </p>
        {onClose && (
          <button 
            onClick={onClose}
            className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Close
          </button>
        )}
      </div>
    </div>
  );
};

export default ChatbotSystem;