import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  stats?: Array<{
    value: string | number;
    label: string;
  }>;
  loaded?: boolean;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  stats = [],
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
          
          {/* Stats */}
          {stats.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              {stats.map((stat, index) => (
                <div 
                  key={index}
                  className={`bg-white/10 backdrop-blur-sm rounded-lg p-4 transform transition-all duration-1000 delay-${200 + (index * 100)} ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                >
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;