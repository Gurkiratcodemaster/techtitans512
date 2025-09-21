"use client";
import Link from "next/link";
import { useState } from "react";
import LoginButton from "./loginbutton";

export function Navbar() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
              className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              onClick={closeDropdown}
            >
              Home
            </Link>

            {/* Education Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('education')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              >
                Education
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'education' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link href="/colleges" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      Colleges Directory
                    </div>
                  </Link>
                  <Link href="/study-materials" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                      Study Materials
                    </div>
                  </Link>
                  <Link href="/scholarships" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Scholarships
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Career Guidance Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('career')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300"
              >
                Career Guidance
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'career' && (
                <div className="absolute top-full left-0 mt-1 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link href="/quiz/class10" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Class 10 Quiz
                    </div>
                  </Link>
                  <Link href="/quiz/class12" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Class 12 Quiz
                    </div>
                  </Link>
                  <Link href="/career-paths" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      Career Path Mapping
                    </div>
                  </Link>
                  <Link href="/chatbot" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600 cursor-pointer" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      AI Career Chat
                    </div>
                  </Link>
                </div>
              )}
            </div>

            {/* Skills & Development */}
            <Link 
              href="/skills" 
              className="px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              onClick={closeDropdown}
            >
              Skills & Development
            </Link>

            {/* About & Contact Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('info')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                className="flex items-center px-3 py-2 text-gray-700 font-medium hover:text-blue-600 transition-colors duration-300 cursor-pointer"
              >
                More
                <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {activeDropdown === 'info' && (
                <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <Link href="/about" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      About Us
                    </div>
                  </Link>
                  <Link href="/contact" className="block px-4 py-2 text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={closeDropdown}>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      Contact
                    </div>
                  </Link>
                </div>
              )}
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

          {/* Login Button - Desktop */}
          <div className="hidden md:block">
            <LoginButton />
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t border-gray-200">
              <Link href="/" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Education</div>
              <Link href="/colleges" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Colleges Directory
              </Link>
              <Link href="/study-materials" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Study Materials
              </Link>
              <Link href="/scholarships" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Scholarships
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide">Career Guidance</div>
              <Link href="/quiz/class10" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Class 10 Quiz
              </Link>
              <Link href="/quiz/class12" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Class 12 Quiz
              </Link>
              <Link href="/career-paths" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Career Path Mapping
              </Link>
              <Link href="/chatbot" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                AI Career Chat
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <Link href="/skills" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Skills & Development
              </Link>
              <Link href="/about" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                About Us
              </Link>
              <Link href="/contact" className="block px-3 py-2 text-gray-700 hover:text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>
                Contact
              </Link>
              <div className="border-t border-gray-100 my-2"></div>
              <div className="px-3 py-2">
                <LoginButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
