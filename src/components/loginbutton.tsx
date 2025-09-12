'use client';
import Login from './login';
import React, { useState } from 'react';

	export default function LoginButton() {
		const [showLogin, setShowLogin] = useState(false);
		return (
			<>
				<style>{`
					@keyframes loginButtonPopIn {
						0% { opacity: 0; transform: scale(0.7); }
						80% { opacity: 1; transform: scale(1.05); }
						100% { opacity: 1; transform: scale(1); }
					}
					@keyframes loginModalFadeIn {
						0% { opacity: 0; }
						100% { opacity: 1; }
					}
				`}</style>
				<button
					className="bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-bold py-2 px-6 rounded-full shadow-lg transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
					style={{ animation: 'loginButtonPopIn 0.5s cubic-bezier(0.4,0,0.2,1)' }}
					onClick={() => setShowLogin(true)}
				>
					Login
				</button>
				{showLogin && (
					<div
						className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm transition-all"
						style={{ animation: 'loginModalFadeIn 0.4s cubic-bezier(0.4,0,0.2,1)' }}
					>
						<div className="relative bg-white rounded-2xl shadow-2xl p-2 sm:p-4 w-[90vw] max-w-md h-[80vh] flex flex-col justify-center overflow-y-auto">
							<button
								className="absolute top-3 right-3 text-gray-400 hover:text-blue-600 text-3xl font-bold rounded-full bg-gray-100 hover:bg-blue-100 w-10 h-10 flex items-center justify-center shadow transition-all"
								onClick={() => setShowLogin(false)}
								aria-label="Close login window"
							>
								&times;
							</button>
							<div className="pt-6 pb-2 px-2 sm:px-4 h-full flex flex-col justify-center">
								<Login />
							</div>
						</div>
					</div>
				)}
			</>
		);
	}
