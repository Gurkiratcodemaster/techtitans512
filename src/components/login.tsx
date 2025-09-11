 'use client';
import React, { useState } from 'react';

export default function Login() {
	const [isSignUp, setIsSignUp] = useState(false);

	return (
		<div className="min-h-screen flex items-center justify-center bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
				<h2 className="text-2xl font-bold mb-6 text-center text-blue-600">
					{isSignUp ? 'Sign Up' : 'Login'}
				</h2>
				<form className="space-y-4">
					<div>
						<label className="block text-gray-700 mb-1">Email</label>
						<input type="email" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your email" required />
					</div>
					<div>
						<label className="block text-gray-700 mb-1">Password</label>
						<input type="password" className="w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="Enter your password" required />
					</div>
					<button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors font-semibold">
						{isSignUp ? 'Sign Up' : 'Login'}
					</button>
				</form>
				<div className="my-4 flex items-center">
					<div className="flex-grow h-px bg-gray-300" />
					<span className="mx-2 text-gray-400 text-sm">or</span>
					<div className="flex-grow h-px bg-gray-300" />
				</div>
				<button className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 transition-colors mb-2">
					<img src="/google.svg" alt="Google" className="w-5 h-5" />
					<span>Continue with Google</span>
				</button>
				{/* Add more social sign up buttons here if needed */}
				<div className="text-center mt-4">
					{isSignUp ? (
						<span className="text-sm text-gray-600">
							Already have an account?{' '}
							<button className="text-blue-600 hover:underline" onClick={() => setIsSignUp(false)} type="button">Login</button>
						</span>
					) : (
						<span className="text-sm text-gray-600">
							Don't have an account?{' '}
							<button className="text-blue-600 hover:underline" onClick={() => setIsSignUp(true)} type="button">Sign Up</button>
						</span>
					)}
				</div>
			</div>
		</div>
	);
}
