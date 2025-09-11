"use client";


// LoginButton component (not included in Navbar)
export function LoginButton() {
	return (
		<button
			className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
		>
			Login
		</button>
	);
}


import React from 'react';


export default function Navbar() {
	return (
			<>
				<nav className="fixed top-6 left-1/2 transform -translate-x-1/2 z-50 bg-white shadow-md rounded-full">
					<div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 shadow-2xl rounded-full py-2 px-6">
						<span className="text-lg font-extrabold text-blue-700 tracking-wide mr-12">MyApp</span>
						<div className="flex items-center space-x-6">
							<a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded hover:bg-blue-100">Home</a>
							<a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded hover:bg-blue-100">About</a>
							<a href="#" className="text-gray-600 hover:text-blue-700 font-semibold transition-colors px-2 py-1 rounded hover:bg-blue-100">Contact</a>
						</div>
					</div>
				</nav>
				<div className="mt-32">
					
				</div>
			</>
	);
}


