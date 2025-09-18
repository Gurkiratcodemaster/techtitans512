
"use client";
import LoginButton from "./loginbutton";

export function Navbar() {
  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-white/30 shadow-lg flex items-center justify-between px-8 py-3">
      {/* Left: App Title */}
      <span className="text-2xl font-bold text-blue-700">Career Choice</span>
      {/* Center: Navbar Links */}
      <div className="flex-1 flex justify-center">
        <nav className="flex items-center space-x-8">
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold hover:text-blue-700 hover:bg-blue-100/50 transition">Home</a>
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold hover:text-blue-700 hover:bg-blue-100/50 transition">About</a>
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold hover:text-blue-700 hover:bg-blue-100/50 transition">Announcements</a>
          <a href="#" className="px-2 py-1 rounded-full text-gray-600 font-semibold hover:text-blue-700 hover:bg-blue-100/50 transition">Contact</a>
        </nav>
      </div>
      {/* Right: Login Button */}
      <div>
        <LoginButton />
      </div>
    </div>
  );
}
