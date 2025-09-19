"use client";
import { useEffect } from "react";

declare global {
  interface Window {
    botpressWebChat?: any;
  }
}

export default function Chatbot() {
  useEffect(() => {
    const script1 = document.createElement("script");
    script1.src = "https://cdn.botpress.cloud/webchat/v3.3/inject.js";
    script1.async = true;
    script1.onload = () => {
      const script2 = document.createElement("script");
      script2.src = "https://files.bpcontent.cloud/2025/09/18/16/20250918165952-O27BEY8P.js";
      script2.defer = true;
      document.body.appendChild(script2);
    };
    document.body.appendChild(script1);

    return () => {
      document.body.removeChild(script1);
    };
  }, []);

  return (
    <div className="fixed bottom-4 right-4 z-50" id="bp-web-chat" />
  );
}

// Function to open the chatbot from anywhere in the app
export const openChatbot = () => {
  if (typeof window !== 'undefined' && window.botpressWebChat) {
    window.botpressWebChat.toggle();
  } else {
    // If botpress isn't loaded yet, try to find the trigger button
    const botpressButton = document.querySelector('[data-testid="bp-widget-web-chat"] button');
    if (botpressButton) {
      (botpressButton as HTMLButtonElement).click();
    }
  }
};
