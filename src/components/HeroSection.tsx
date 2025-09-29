import React from 'react';

interface HeroSectionProps {
  title: string;
  subtitle: string;
  loaded?: boolean;
  stats?: { value: number; label: string }[];
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  title,
  subtitle,
  loaded = true,
  stats
}) => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-blue-600 to-black">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
  <div className="text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
            {title}
          </h1>
          <p className="text-xl md:text-2xl text-gray-200 font-medium mb-8 max-w-3xl mx-auto">
            {subtitle}
          </p>
          {stats && stats.length > 0 && (
            <div className="flex flex-wrap justify-center gap-6 mt-8">
              {stats.map((stat, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl px-6 py-4 min-w-[120px]">
                  <div className="text-2xl font-bold text-blue-200">{stat.value}</div>
                  <div className="text-sm text-gray-200 mt-1">{stat.label}</div>
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