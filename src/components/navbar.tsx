"use client";
import Link from "next/link";
import LoginButton from "./loginbutton";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-lg flex items-center justify-between px-8 py-1">
      <span className="text-2xl font-bold text-blue-600">Career Choice</span>
      <div className="flex-1 flex justify-center">
        <nav className="flex items-center space-x-8">
          <Link href="/" className="px-2 py-1 text-gray-600 font-semibold hover:text-blue-500 relative transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Home</Link>
          <Link href="/about" className="px-2 py-1 text-gray-600 font-semibold hover:text-blue-500 relative transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">About</Link>
          <a href="#" className="px-2 py-1 text-gray-600 font-semibold hover:text-blue-500 relative transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Announcements</a>
          <Link href="/contact" className="px-2 py-1 text-gray-600 font-semibold hover:text-blue-500 relative transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-blue-500 after:transition-all after:duration-300 hover:after:w-full">Contact</Link>
        </nav>
      </div>
      <div>
        <LoginButton />
      </div>
    </div>
  );
}
