
"use client";
import LoginButton from "./loginbutton";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-lg flex items-center justify-between px-8 py-1">
      <span className="text-2xl font-bold text-blue-700">Career Choice</span>
      <div className="flex-1 flex justify-center">
        <nav className="flex items-center space-x-8">
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold transition-colors duration-300 hover:bg-gradient-to-r from-blue-400 to-blue-600 hover:text-white">Home</a>
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold transition-colors duration-300 hover:bg-gradient-to-r from-blue-400 to-blue-600 hover:text-white">About</a>
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold transition-colors duration-300 hover:bg-gradient-to-r from-blue-400 to-blue-600 hover:text-white">Announcements</a>
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold transition-colors duration-300 hover:bg-gradient-to-r from-blue-400 to-blue-600 hover:text-white">Contact</a>
        </nav>
      </div>
      <div>
        <LoginButton />
      </div>
    </div>
  );
}
