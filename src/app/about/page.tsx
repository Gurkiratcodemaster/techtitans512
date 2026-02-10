"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/database"; // adjust path if needed
import { HeroSection } from "@/components/HeroSection";
import { FeatureCard } from "@/app/about/FeatureCard";

interface Feature {
  title: string;
  description: string;
}
export default function About() {
  const [features, setFeatures] = useState<
    Feature[]
  >([]);

  useEffect(() => {
    async function fetchFeatures() {
      const { data, error } = await supabase
        .from("features")
        .select("title,description");
      console.log("Fetched features:", data, error);
      if (!error && data) {
        setFeatures(data);
      }
    }
    fetchFeatures();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <HeroSection
        title="About Career Choice"
        subtitle="Empowering individuals to make informed career decisions through personalized guidance and intelligent recommendations."
      />

        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, i) => (
              <FeatureCard
                key={feature.title}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 mb-12 shadow-lg">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
              Our Vision
            </h2>
            <p className="text-lg text-gray-700 text-center max-w-3xl mx-auto">
              We envision a world where every individual can discover and pursue a career that brings them fulfillment,
              success, and happiness. Through technology and human insight, we're building the future of career guidance.
            </p>
          </div>
        </div>
      </div>
  );
}