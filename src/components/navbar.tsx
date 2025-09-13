"use client";
import { useState } from "react";

// LoginButton component (not included in Navbar)
export function LoginButton() {
    return (
        <button
            className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:-translate-y-1 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
        >
            Login
        </button>
    );
}

// Navbar component
export function Navbar() {
    return (
        <>
            <style>{`
                @keyframes navbarFadeIn {
                    0% { opacity: 0; transform: translateY(-30px) scale(0.98); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
            `}</style>
            <nav
                className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 rounded-full"
                style={{
                    animation: 'navbarFadeIn 0.7s cubic-bezier(0.4,0,0.2,1)'
                }}
            >
                <div className="flex items-center justify-between bg-white/50 backdrop-blur-md border border-white/30 shadow-2xl rounded-full py-2 px-6">
                    <span className="text-lg font-extrabold text-blue-700 tracking-wide mr-12">MyApp</span>
                    <div className="flex items-center space-x-6">
                        <a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded-full hover:bg-blue-100/50">Home</a>
                        <a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded-full hover:bg-blue-100/50">About</a>
                        <a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded-full hover:bg-blue-100/50">Announcements</a>
                        <a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded-full hover:bg-blue-100/50">Contact</a>
                    </div>
                </div>
            </nav>
            <div className="mt-32"></div>
        </>
    );
}


//
// Home component removed for clarity and maintainability.
// Only Navbar and LoginButton components are exported from this file.
//
