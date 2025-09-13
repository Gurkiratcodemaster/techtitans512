"use client";
import Link from "next/link";

export default function LoginButton() {
  return (
    <div style={{ position: 'fixed', top: '1.5rem', right: '2rem', zIndex: 100 }}>
      <Link href="/login">
        <button className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold rounded-full shadow-xl transition-all duration-200 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 text-lg">
          Login
        </button>
      </Link>
    </div>
  );
}
