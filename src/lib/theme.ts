// Color theme constants for consistent styling across the application
export const COLORS = {
  // Primary brand colors
  primary: {
    50: 'bg-blue-50 text-blue-600',
    100: 'bg-blue-100 text-blue-800',
    500: 'bg-blue-500 text-white',
    600: 'bg-blue-600 text-white',
    700: 'bg-blue-700 text-white',
    gradient: 'bg-gradient-to-r from-blue-600 to-blue-700',
    gradientHover: 'hover:from-blue-700 hover:to-blue-800'
  },
  
  // Secondary colors
  secondary: {
    50: 'bg-gray-50 text-gray-700',
    100: 'bg-gray-100 text-gray-800',
    200: 'bg-gray-200 text-gray-800',
    300: 'bg-gray-300 text-gray-900',
    600: 'bg-gray-600 text-white',
    700: 'bg-gray-700 text-white',
    800: 'bg-gray-800 text-white'
  },
  
  // Success states
  success: {
    50: 'bg-emerald-50 text-emerald-700',
    100: 'bg-emerald-100 text-emerald-800',
    200: 'bg-emerald-200 text-emerald-800',
    600: 'bg-emerald-600 text-white',
    700: 'bg-emerald-700 text-white',
    gradient: 'bg-gradient-to-r from-emerald-600 to-emerald-700'
  },
  
  // Warning states  
  warning: {
    50: 'bg-amber-50 text-amber-700',
    100: 'bg-amber-100 text-amber-800',
    200: 'bg-amber-200 text-amber-800',
    600: 'bg-amber-600 text-white',
    gradient: 'bg-gradient-to-r from-amber-500 to-amber-600'
  },
  
  // Error states
  error: {
    50: 'bg-red-50 text-red-700',
    100: 'bg-red-100 text-red-800',
    200: 'bg-red-200 text-red-800',
    600: 'bg-red-600 text-white',
    700: 'bg-red-700 text-white',
    gradient: 'bg-gradient-to-r from-red-600 to-red-700'
  },
  
  // Info states
  info: {
    50: 'bg-cyan-50 text-cyan-700',
    100: 'bg-cyan-100 text-cyan-800',
    600: 'bg-cyan-600 text-white',
    gradient: 'bg-gradient-to-r from-cyan-600 to-cyan-700'
  }
};

// Common background patterns
export const BACKGROUNDS = {
  page: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
  card: 'bg-white/70 backdrop-blur-sm',
  cardSolid: 'bg-white',
  modal: 'bg-white/95 backdrop-blur-md'
};

// Common responsive breakpoints and spacing
export const RESPONSIVE = {
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-12 pt-16',
  card: 'rounded-2xl shadow-lg',
  cardLarge: 'rounded-3xl shadow-lg',
  input: 'px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
  button: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
  buttonLarge: 'px-8 py-4 rounded-xl font-bold transition-all duration-300'
};

// Animation classes
export const ANIMATIONS = {
  fadeIn: 'transition-all duration-500 ease-out',
  slideUp: 'transform transition-all duration-500 ease-out',
  hover: 'transition-all duration-300 hover:scale-105',
  buttonHover: 'transition-all duration-300 hover:scale-105 hover:shadow-lg'
};