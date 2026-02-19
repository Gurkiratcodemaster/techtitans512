import { HeroSection } from "@/components/HeroSection";

export default function About() {
  return (
    <div>
      <HeroSection
        title="About Career Choice"
        subtitle="Empowering individuals to make informed career decisions through personalized guidance and intelligent recommendations."
      />
      <div className="max-w-4xl mx-auto grid grid-cols-2 gap-4">
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Personalized Career Guidance
          </h2>
          <p className="text-lg text-gray-700 text-center">
            Get AI-powered career recommendations based on your skills, interests, and academic background.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Skill Assessment
          </h2>
          <p className="text-lg text-gray-700 text-center">
            Analyze your strengths and weaknesses through smart assessments and performance tracking.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Career Roadmaps
          </h2>
          <p className="text-lg text-gray-700 text-center">
            Step-by-step learning paths and career roadmaps to help you achieve your professional goals.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
            Real-Time Job Insights
          </h2>
          <p className="text-lg text-gray-700 text-center">
            Stay updated with the latest job trends, salary data, and market demands in real time.
          </p>
        </div>
        <div className="bg-white rounded-3xl p-8 mb-12 shadow-lg col-span-2">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Our Vision</h2>
          <p className="text-lg text-gray-700 text-center">
            We envision a world where every individual can discover and pursue a career that brings them fulfillment,
            success, and happiness. Through technology and human insight, we're building the future of career guidance.
          </p>
        </div>
      </div>
    </div>
  );
}