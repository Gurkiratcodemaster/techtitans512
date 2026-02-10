"use client";

type FeatureCardProps = {
  title: string;
  description: string;
};

export function FeatureCard({
  title,
  description,

}: FeatureCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}