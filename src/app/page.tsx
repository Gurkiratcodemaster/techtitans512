export default function Home() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 via-sky-500 to-teal-500 p-4">
      <main className="w-full max-w-2xl p-8 sm:p-12 flex flex-col items-center text-center bg-white/90 backdrop-blur-lg rounded-3xl shadow-2xl shadow-black/20 border border-white/20 animate-fadeIn">
        <h1 className="mb-4 text-4xl sm:text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Welcome to Your Hub
        </h1>
        <p className="mb-8 text-lg text-gray-700 max-w-md">
          Your all-in-one place to manage school life. Students, teachers, and parents—you're covered.
        </p>
        <button className="px-8 py-3 font-semibold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full shadow-lg transition-transform duration-300 hover:from-purple-700 hover:to-indigo-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-purple-500">
          Get Started
        </button>
      </main>
    </div>
  );
}
