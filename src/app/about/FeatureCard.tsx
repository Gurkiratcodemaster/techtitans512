"use client";

type FeatureCardProps = {
  icon_svg: string;
  title: string;
  description: string;
  loaded: boolean;
  delay?: number;
  negative?: boolean;
};

export function FeatureCard({
  icon_svg,
  title,
  description,
  loaded,
  delay = 200,
  negative = false,
}: FeatureCardProps) {
  return (
    <div
      className={`bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 ease-out delay-${delay} ${
        loaded
          ? "translate-y-0 opacity-100 scale-100"
          : "translate-y-20 opacity-0 scale-95"
      }`}
    >
      <div
        className={`w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4 transform transition-all duration-400 delay-${
          delay + 50
        } ${
          loaded
            ? "rotate-0 scale-100"
            : `${negative ? "-rotate-180" : "rotate-180"} scale-0`
        }`}
        dangerouslySetInnerHTML={{ __html: icon_svg }}
      />
      <h3
        className={`text-xl font-bold text-gray-800 mb-3 transform transition-all duration-400 delay-${
          delay + 100
        } ${
          loaded
            ? "translate-x-0 opacity-100"
            : `${negative ? "-translate-x-10" : "translate-x-10"} opacity-0`
        }`}
      >
        {title}
      </h3>
      <p
        className={`text-gray-600 transform transition-all duration-400 delay-${
          delay + 150
        } ${
          loaded
            ? "translate-x-0 opacity-100"
            : `${negative ? "-translate-x-10" : "translate-x-10"} opacity-0`
        }`}
      >
        {description}
      </p>
    </div>
  );
}