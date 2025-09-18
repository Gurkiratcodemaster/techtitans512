"use client";
import { useEffect } from "react";

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
