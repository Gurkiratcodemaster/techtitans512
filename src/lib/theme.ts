/**
 * Unified Theme & Utility System
 * Combines theme constants, enum converters, and utility functions
 */

// ===== COLOR SYSTEM =====
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
    700: 'bg-amber-700 text-white',
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
    700: 'bg-cyan-700 text-white',
    gradient: 'bg-gradient-to-r from-cyan-600 to-cyan-700'
  },

  // Additional gradients for variety
  GRADIENT_PRIMARY: 'from-blue-600 to-purple-600',
  GRADIENT_SECONDARY: 'from-purple-600 to-pink-600',
  GRADIENT_ACCENT: 'from-green-500 to-blue-500',
  GRADIENT_WARM: 'from-orange-500 to-red-500',
  GRADIENT_COOL: 'from-blue-500 to-cyan-500'
};

// ===== BACKGROUND PATTERNS =====
export const BACKGROUNDS = {
  // Page backgrounds
  PAGE_PRIMARY: 'bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100',
  PAGE_DARK: 'bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900',
  
  // Gradient backgrounds
  GRADIENT_PRIMARY: 'bg-gradient-to-br from-blue-600 via-purple-600 to-blue-700',
  GRADIENT_SECONDARY: 'bg-gradient-to-br from-purple-600 via-pink-600 to-purple-700',
  GRADIENT_SUCCESS: 'bg-gradient-to-br from-green-500 via-emerald-500 to-green-600',
  GRADIENT_WARNING: 'bg-gradient-to-br from-amber-500 via-yellow-500 to-orange-500',
  
  // Card backgrounds
  card: 'bg-white/70 backdrop-blur-sm',
  cardSolid: 'bg-white',
  cardGlass: 'bg-white/20 backdrop-blur-md',
  modal: 'bg-white/95 backdrop-blur-md',
  
  // Pattern backgrounds
  dots: "bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.15)_1px,transparent_0)] bg-[size:20px_20px]",
  grid: "bg-[linear-gradient(rgba(255,255,255,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[size:20px_20px]"
};

// ===== RESPONSIVE UTILITIES =====
export const RESPONSIVE = {
  // Container classes
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  containerSmall: 'max-w-4xl mx-auto px-4 sm:px-6',
  containerLarge: 'max-w-full mx-auto px-4 sm:px-6 lg:px-8',
  
  // Section spacing
  section: 'py-12 pt-16',
  sectionSmall: 'py-8',
  sectionLarge: 'py-20',
  
  // Card styling
  card: 'rounded-2xl shadow-lg',
  cardLarge: 'rounded-3xl shadow-xl',
  cardSmall: 'rounded-xl shadow-md',
  
  // Form elements
  input: 'px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
  inputLarge: 'px-6 py-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300',
  textarea: 'px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-all duration-300',
  select: 'px-4 py-3 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white transition-all duration-300',
  
  // Button styling
  button: 'px-6 py-3 rounded-xl font-semibold transition-all duration-300',
  buttonLarge: 'px-8 py-4 rounded-xl font-bold transition-all duration-300',
  buttonSmall: 'px-4 py-2 rounded-lg font-medium transition-all duration-300',
  
  // Grid layouts
  grid2: 'grid grid-cols-1 md:grid-cols-2 gap-6',
  grid3: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  grid4: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6',
  
  // Flexbox utilities
  centerFlex: 'flex items-center justify-center',
  betweenFlex: 'flex items-center justify-between',
  spaceFlex: 'flex items-center space-x-4'
};

// ===== ANIMATION CLASSES =====
export const ANIMATIONS = {
  // Basic transitions
  fadeIn: 'transition-all duration-500 ease-out',
  slideUp: 'transform transition-all duration-500 ease-out',
  slideDown: 'transform transition-all duration-500 ease-out translate-y-0',
  slideLeft: 'transform transition-all duration-500 ease-out translate-x-0',
  slideRight: 'transform transition-all duration-500 ease-out translate-x-0',
  
  // Hover effects
  hover: 'transition-all duration-300 hover:scale-105',
  hoverSlight: 'transition-all duration-300 hover:scale-102',
  buttonHover: 'transition-all duration-300 hover:scale-105 hover:shadow-lg',
  cardHover: 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
  
  // Loading states
  pulse: 'animate-pulse',
  spin: 'animate-spin',
  bounce: 'animate-bounce',
  ping: 'animate-ping',
  
  // Custom animations
  heartbeat: 'animate-pulse hover:animate-bounce',
  wiggle: 'hover:animate-bounce',
  float: 'animate-pulse hover:animate-bounce'
};

// ===== ENUM CONVERTERS =====
export const EnumConverters = {
  // Gender conversion
  convertToGender: (value: string): string => {
    const upperValue = value.toUpperCase();
    const validValues = ['MALE', 'FEMALE', 'OTHER', 'PREFER_NOT_TO_SAY'];
    
    if (validValues.includes(upperValue)) {
      return upperValue;
    }
    
    // Handle common variations
    switch (upperValue) {
      case 'M':
      case 'MAN':
        return 'MALE';
      case 'F':
      case 'WOMAN':
        return 'FEMALE';
      case 'NON-BINARY':
      case 'NON_BINARY':
        return 'OTHER';
      default:
        return 'PREFER_NOT_TO_SAY';
    }
  },

  // Education level conversion
  convertToEducationLevel: (value: string): string => {
    const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
    const validValues = ['HIGH_SCHOOL', 'SENIOR_SECONDARY', 'UNDERGRADUATE', 'POSTGRADUATE', 'DIPLOMA', 'PROFESSIONAL'];
    
    if (validValues.includes(upperValue)) {
      return upperValue;
    }
    
    // Handle common variations
    switch (upperValue) {
      case '10TH':
      case 'CLASS_10':
      case 'TENTH':
        return 'HIGH_SCHOOL';
      case '12TH':
      case 'CLASS_12':
      case 'TWELFTH':
        return 'SENIOR_SECONDARY';
      case 'BACHELOR':
      case 'BACHELORS':
      case 'UG':
        return 'UNDERGRADUATE';
      case 'MASTER':
      case 'MASTERS':
      case 'PG':
        return 'POSTGRADUATE';
      default:
        return 'HIGH_SCHOOL';
    }
  },

  // Academic performance conversion
  convertToAcademicPerformance: (value: string): string => {
    const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
    const validValues = ['EXCELLENT', 'VERY_GOOD', 'GOOD', 'AVERAGE', 'BELOW_AVERAGE'];
    
    if (validValues.includes(upperValue)) {
      return upperValue;
    }
    
    // Handle common variations
    switch (upperValue) {
      case 'OUTSTANDING':
      case 'A_GRADE':
      case 'A':
        return 'EXCELLENT';
      case 'B_GRADE':
      case 'B':
        return 'VERY_GOOD';
      case 'C_GRADE':
      case 'C':
        return 'GOOD';
      case 'D_GRADE':
      case 'D':
        return 'AVERAGE';
      case 'F_GRADE':
      case 'F':
      case 'POOR':
        return 'BELOW_AVERAGE';
      default:
        return 'GOOD';
    }
  },

  // Study mode conversion
  convertToStudyMode: (value: string): string => {
    const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
    const validValues = ['ONLINE', 'OFFLINE', 'HYBRID', 'SELF_PACED'];
    
    if (validValues.includes(upperValue)) {
      return upperValue;
    }
    
    // Handle common variations
    switch (upperValue) {
      case 'IN_PERSON':
      case 'PHYSICAL':
        return 'OFFLINE';
      case 'REMOTE':
      case 'VIRTUAL':
        return 'ONLINE';
      case 'BLENDED':
      case 'MIXED':
        return 'HYBRID';
      case 'FLEXIBLE':
      case 'SELF_STUDY':
        return 'SELF_PACED';
      default:
        return 'OFFLINE';
    }
  },

  // Income range conversion
  convertToIncomeRange: (value: string): string => {
    const upperValue = value.toUpperCase().replace(/[\s-]/g, '_');
    const validValues = ['BELOW_2_LPA', '2_5_LPA', '5_10_LPA', '10_20_LPA', 'ABOVE_20_LPA', 'PREFER_NOT_TO_SAY'];
    
    if (validValues.includes(upperValue)) {
      return upperValue;
    }
    
    // Handle numeric ranges
    const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
    if (!isNaN(numericValue)) {
      if (numericValue < 200000) return 'BELOW_2_LPA';
      if (numericValue < 500000) return '2_5_LPA';
      if (numericValue < 1000000) return '5_10_LPA';
      if (numericValue < 2000000) return '10_20_LPA';
      return 'ABOVE_20_LPA';
    }
    
    return 'PREFER_NOT_TO_SAY';
  }
};

// Form validation and conversion function
export const validateAndConvertFormData = (formData: any) => {
  return {
    ...formData,
    gender: EnumConverters.convertToGender(formData.gender || ''),
    currentEducation: EnumConverters.convertToEducationLevel(formData.currentEducation || ''),
    previousAcademicPerformance: EnumConverters.convertToAcademicPerformance(formData.previousAcademicPerformance || ''),
    preferredStudyMode: EnumConverters.convertToStudyMode(formData.preferredStudyMode || ''),
    familyIncome: EnumConverters.convertToIncomeRange(formData.familyIncome || ''),
    age: parseInt(formData.age) || 18
  };
};

// ===== UTILITY FUNCTIONS =====
export const ThemeUtils = {
  // Get theme-based classes
  getButtonClass: (variant: 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' = 'primary', size: 'small' | 'medium' | 'large' = 'medium') => {
    const baseClass = size === 'small' ? RESPONSIVE.buttonSmall : size === 'large' ? RESPONSIVE.buttonLarge : RESPONSIVE.button;
    
    let variantClass: string;
    switch (variant) {
      case 'primary':
        variantClass = COLORS.primary.gradient;
        break;
      case 'secondary':
        variantClass = COLORS.secondary[600];
        break;
      case 'success':
        variantClass = COLORS.success.gradient;
        break;
      case 'warning':
        variantClass = COLORS.warning.gradient;
        break;
      case 'error':
        variantClass = COLORS.error.gradient;
        break;
      case 'info':
        variantClass = COLORS.info.gradient;
        break;
      default:
        variantClass = COLORS.primary.gradient;
    }
    
    return `${baseClass} ${variantClass} ${ANIMATIONS.buttonHover}`;
  },

  // Get card classes
  getCardClass: (variant: 'default' | 'glass' | 'solid' = 'default', size: 'small' | 'medium' | 'large' = 'medium') => {
    const sizeClass = size === 'small' ? RESPONSIVE.cardSmall : size === 'large' ? RESPONSIVE.cardLarge : RESPONSIVE.card;
    const variantClass = variant === 'glass' ? BACKGROUNDS.cardGlass : variant === 'solid' ? BACKGROUNDS.cardSolid : BACKGROUNDS.card;
    return `${sizeClass} ${variantClass} ${ANIMATIONS.cardHover}`;
  },

  // Get input classes with validation state
  getInputClass: (hasError: boolean = false, size: 'medium' | 'large' = 'medium') => {
    const baseClass = size === 'large' ? RESPONSIVE.inputLarge : RESPONSIVE.input;
    const errorClass = hasError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : '';
    return `${baseClass} ${errorClass}`;
  },

  // Generate responsive text classes
  getTextClass: (size: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' = 'base', weight: 'normal' | 'medium' | 'semibold' | 'bold' = 'normal') => {
    const sizeMap = {
      xs: 'text-xs',
      sm: 'text-sm', 
      base: 'text-base',
      lg: 'text-lg',
      xl: 'text-xl',
      '2xl': 'text-2xl',
      '3xl': 'text-3xl',
      '4xl': 'text-4xl'
    };
    
    const weightMap = {
      normal: 'font-normal',
      medium: 'font-medium',
      semibold: 'font-semibold',
      bold: 'font-bold'
    };
    
    return `${sizeMap[size]} ${weightMap[weight]}`;
  },

  // Get status-based styling
  getStatusClass: (status: 'success' | 'warning' | 'error' | 'info') => {
    switch (status) {
      case 'success':
        return {
          bg: COLORS.success[100],
          text: COLORS.success[700],
          border: 'border-emerald-200',
          icon: '✅'
        };
      case 'warning':
        return {
          bg: COLORS.warning[100],
          text: COLORS.warning[700],
          border: 'border-amber-200',
          icon: '⚠️'
        };
      case 'error':
        return {
          bg: COLORS.error[100],
          text: COLORS.error[700],
          border: 'border-red-200',
          icon: '❌'
        };
      case 'info':
        return {
          bg: COLORS.info[100],
          text: COLORS.info[700],
          border: 'border-cyan-200',
          icon: 'ℹ️'
        };
      default:
        return {
          bg: COLORS.secondary[100],
          text: COLORS.secondary[700],
          border: 'border-gray-200',
          icon: 'ℹ️'
        };
    }
  },

  // Combine multiple classes safely
  combineClasses: (...classes: (string | undefined | null | false)[]): string => {
    return classes.filter(Boolean).join(' ');
  },

  // Generate hover gradient effect
  generateHoverGradient: (from: string, to: string): string => {
    return `bg-gradient-to-r from-${from} to-${to} hover:from-${from}-600 hover:to-${to}-600 transition-all duration-300`;
  }
};

// ===== INDIAN LOCALIZATION =====
export const IndianTheme = {
  // Indian flag colors
  colors: {
    saffron: 'from-orange-500 to-orange-600',
    white: 'from-white to-gray-50',
    green: 'from-green-600 to-green-700',
    navy: 'from-blue-900 to-blue-800'
  },
  
  // Common Indian educational terms
  terms: {
    class10: 'Class X (CBSE/ICSE)',
    class12: 'Class XII (PCM/PCB/Commerce)',
    entrance: 'Competitive Exams (JEE/NEET/CA)',
    streams: ['Science (PCM)', 'Science (PCB)', 'Commerce', 'Arts/Humanities']
  },
  
  // Indian number formatting
  formatCurrency: (amount: number): string => {
    return `₹${amount.toLocaleString('en-IN')}`;
  },
  
  // Educational year format
  formatAcademicYear: (year: number): string => {
    return `${year}-${(year + 1).toString().slice(-2)}`;
  }
};

// Export everything for easy importing
export default {
  COLORS,
  BACKGROUNDS,
  RESPONSIVE,
  ANIMATIONS,
  EnumConverters,
  ThemeUtils,
  IndianTheme
};