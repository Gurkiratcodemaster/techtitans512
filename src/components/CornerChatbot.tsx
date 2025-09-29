"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function CornerChatbot() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);

  const handleClick = () => {
    router.push('/chatbot');
  };

  if (!isOpen) return null;

  return (
    <button
      onClick={handleClick}
      className="fixed bottom-6 right-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-transform duration-200 z-50"
      aria-label="Open chatbot"
    >
      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.745A9.953 9.953 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
      </svg>
    </button>
  );
}
