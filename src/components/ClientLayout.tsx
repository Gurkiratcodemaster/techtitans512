"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import Footer from "@/components/footer";
import OfflineSupport from "@/components/OfflineSupport";
import CornerChatbot from "@/components/CornerChatbot";

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const hideNavbar = pathname === "/login";
  const hideChatbot = pathname === "/login" || pathname === "/chatbot";

  return (
    <div className="bg-blue-50 min-h-screen">
      <OfflineSupport />
      {!hideNavbar && <Navbar />}
      <main className="pt-12">{children}</main>
      {!hideNavbar && <Footer />}
      
      {/* Floating Chatbot Button */}
      {!hideChatbot && (
        <>
          <button
            onClick={() => setIsChatbotOpen(true)}
            className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg transition-all duration-300 z-40 hover:scale-110"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </button>
          
          <CornerChatbot 
            isOpen={isChatbotOpen} 
            onClose={() => setIsChatbotOpen(false)} 
          />
        </>
      )}
    </div>
  );
}
