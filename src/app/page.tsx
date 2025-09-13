

export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen p-4 bg-gradient-to-br from-indigo-500 via-sky-500 to-teal-500">
      <main className="bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/20 p-8 sm:p-12 border border-white/20 max-w-2xl w-full animate-fadeIn flex flex-col items-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 mb-4 text-center">
          Welcome to Your Hub
        </h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-md">
          This is your all-in-one place to connect and manage your school life. Whether you're a student, teacher, or parent, we've got you covered.
        </p>
        <button className="px-8 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold rounded-full shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform hover:scale-105">
          Get Started
        </button>
      </main>
    </div>
  );
}

