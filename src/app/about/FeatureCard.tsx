"use client";

type FeatureCardProps = {
  icon_svg: string;
  title: string;
  description: string;
  negative?: boolean;
};

export function FeatureCard({
  icon_svg,
  title,
  description,
  negative = false,
}: FeatureCardProps) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
      <div
        className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4"
        dangerouslySetInnerHTML={{ __html: icon_svg }}
      />
      <h3 className="text-xl font-bold text-gray-800 mb-3">
        {title}
      </h3>
      <p className="text-gray-600">
        {description}
      </p>
    </div>
  );
}