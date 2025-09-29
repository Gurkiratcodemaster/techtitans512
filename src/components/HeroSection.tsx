import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  loaded?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  loaded = true
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-blue-600 to-black">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className={`text-center transform transition-all duration-1000 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;