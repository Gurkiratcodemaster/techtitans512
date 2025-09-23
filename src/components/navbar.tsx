"use client";
import Link from "next/link";
import { useState } from "react";
import LoginButton from "./loginbutton";
import { useAuth } from "@/contexts/AuthContext";

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, loading, signOut } = useAuth();

  const handleDropdownToggle = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-white/30 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Career Choice</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="relative px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer group"
              onClick={closeDropdown}
            >
              Home
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* Education Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('education')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="relative flex items-center px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer group"
              >
                Education
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'education' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${activeDropdown === 'education' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <div className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transform transition-all duration-200 origin-top ${
                activeDropdown === 'education' 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <Link href="/colleges" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    Colleges Directory
                  </div>
                </Link>
                <Link href="/study-materials" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    Study Materials
                  </div>
                </Link>
                <Link href="/scholarships" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                    </svg>
                    Scholarships
                  </div>
                </Link>
              </div>
            </div>

            {/* Career Guidance Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('career')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="relative flex items-center px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 group"
              >
                Career Guidance
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'career' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${activeDropdown === 'career' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <div className={`absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transform transition-all duration-200 origin-top ${
                activeDropdown === 'career' 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <Link href="/quiz/class10" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Class 10 Quiz
                  </div>
                </Link>
                <Link href="/quiz/class12" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Class 12 Quiz
                  </div>
                </Link>
                <Link href="/career-paths" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                    Career Path Mapping
                  </div>
                </Link>
                <Link href="/chatbot" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    AI Career Chat
                  </div>
                </Link>
              </div>
            </div>

            {/* Skills & Development */}
            <Link 
              href="/skills" 
              className="relative px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer group"
              onClick={closeDropdown}
            >
              Skills & Development
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* About & Contact Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('info')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="relative flex items-center px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer group"
              >
                More
                <svg className={`ml-1 w-4 h-4 transition-transform duration-200 ${activeDropdown === 'info' ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
                <span className={`absolute bottom-0 left-0 h-0.5 bg-blue-600 transition-all duration-300 ${activeDropdown === 'info' ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </button>
              <div className={`absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 transform transition-all duration-200 origin-top ${
                activeDropdown === 'info' 
                  ? 'opacity-100 scale-100 translate-y-0' 
                  : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
              }`}>
                <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    About Us
                  </div>
                </Link>
                <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-colors duration-150" onClick={closeDropdown}>
                  <div className="flex items-center">
                    <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact
                  </div>
                </Link>
              </div>
            </div>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Login/Profile Button - Desktop */}
          <div className="hidden md:block">
            {loading ? (
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => handleDropdownToggle('profile')}
                  className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full font-semibold transition-all duration-300 hover:from-blue-700 hover:to-blue-800 cursor-pointer hover:scale-105"
                >
                  {user?.user_metadata?.avatar_url ? (
                    <img 
                      src={user.user_metadata.avatar_url} 
                      alt="Profile" 
                      className="w-6 h-6 rounded-full"
                    />
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  )}
                  <span className="max-w-24 truncate">
                    {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                  </span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div className={`absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-100 py-1 z-50 transform transition-all duration-200 origin-top-right ${
                  activeDropdown === 'profile' 
                    ? 'opacity-100 scale-100 translate-y-0' 
                    : 'opacity-0 scale-95 -translate-y-2 pointer-events-none'
                }`}>
                  <Link 
                    href="/profile" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
                    onClick={closeDropdown}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <Link 
                    href="/settings" 
                    className="flex items-center px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors duration-150"
                    onClick={closeDropdown}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    Settings
                  </Link>
                  <button 
                    onClick={signOut}
                    className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50 cursor-pointer transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <LoginButton />
            )}
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`md:hidden transform transition-all duration-300 origin-top ${
          isMobileMenuOpen 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-4 pointer-events-none'
        }`}>
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200 rounded-b-lg shadow-lg">
            <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Home
            </Link>
            <div className="border-t border-gray-100 my-2"></div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Education</div>
            <Link href="/colleges" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Colleges Directory
            </Link>
            <Link href="/study-materials" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Study Materials
            </Link>
            <Link href="/scholarships" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Scholarships
            </Link>
            <div className="border-t border-gray-100 my-2"></div>
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Career Guidance</div>
            <Link href="/quiz/class10" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Class 10 Quiz
            </Link>
            <Link href="/quiz/class12" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Class 12 Quiz
            </Link>
            <Link href="/career-paths" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Career Path Mapping
            </Link>
            <Link href="/chatbot" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              AI Career Chat
            </Link>
            <div className="border-t border-gray-100 my-2"></div>
            <Link href="/skills" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Skills & Development
            </Link>
            <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              About Us
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150" onClick={() => setIsMobileMenuOpen(false)}>
              Contact
            </Link>
            <div className="border-t border-gray-100 my-2"></div>
            <div className="px-3 py-2">
              {loading ? (
                <div className="flex justify-center">
                  <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="flex items-center space-x-3 px-2 py-2 bg-blue-50 rounded-lg">
                    {user?.user_metadata?.avatar_url ? (
                      <img 
                        src={user.user_metadata.avatar_url} 
                        alt="Profile" 
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    )}
                    <span className="font-medium text-gray-900 truncate">
                      {user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}
                    </span>
                  </div>
                  <Link 
                    href="/profile" 
                    className="flex items-center px-2 py-2 text-gray-700 hover:text-blue-600 transition-colors duration-150"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile
                  </Link>
                  <button 
                    onClick={() => { signOut(); setIsMobileMenuOpen(false); }}
                    className="flex items-center w-full px-2 py-2 text-red-600 hover:bg-red-50 transition-colors duration-150"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </div>
              ) : (
                <LoginButton />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}