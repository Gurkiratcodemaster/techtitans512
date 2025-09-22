"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";

interface SkillProgram {
  id: string;
  title: string;
  description: string;
  duration: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  category: string;
  price: string;
  skills: string[];
  outcomes: string[];
  provider: string;
  rating: number;
  enrollments: number;
  imageUrl: string;
}

export default function SkillsPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [filteredPrograms, setFilteredPrograms] = useState<SkillProgram[]>([]);

  const skillPrograms: SkillProgram[] = [
    {
      id: "1",
      title: "Full Stack Web Development",
      description: "Master modern web development with React, Node.js, and database integration.",
      duration: "6 months",
      level: "Beginner",
      category: "Programming",
      price: "Free",
      skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"],
      outcomes: ["Build complete web applications", "Deploy to production", "Portfolio projects"],
      provider: "TechAcademy",
      rating: 4.8,
      enrollments: 12500,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "2", 
      title: "Digital Marketing Mastery",
      description: "Learn SEO, social media marketing, content marketing, and paid advertising.",
      duration: "4 months",
      level: "Beginner",
      category: "Marketing",
      price: "₹9,999",
      skills: ["SEO", "Social Media", "Google Ads", "Content Marketing", "Analytics"],
      outcomes: ["Run successful campaigns", "Increase online presence", "Certification"],
      provider: "MarketingPro",
      rating: 4.6,
      enrollments: 8700,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "3",
      title: "Data Science with Python",
      description: "Analyze data, build machine learning models, and create data visualizations.",
      duration: "8 months",
      level: "Intermediate",
      category: "Data Science",
      price: "₹15,999",
      skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "SQL"],
      outcomes: ["Build ML models", "Data analysis projects", "Industry certification"],
      provider: "DataLearn",
      rating: 4.9,
      enrollments: 6200,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "4",
      title: "Graphic Design & UI/UX",
      description: "Create stunning designs and user-friendly interfaces using modern design tools.",
      duration: "5 months",
      level: "Beginner",
      category: "Design",
      price: "₹12,999",
      skills: ["Photoshop", "Illustrator", "Figma", "Adobe XD", "Design Principles"],
      outcomes: ["Professional portfolio", "Client projects", "Design certification"],
      provider: "DesignStudio",
      rating: 4.7,
      enrollments: 9400,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "5",
      title: "Mobile App Development",
      description: "Build native and cross-platform mobile apps for iOS and Android.",
      duration: "7 months",
      level: "Intermediate", 
      category: "Programming",
      price: "₹18,999",
      skills: ["React Native", "Flutter", "Firebase", "API Integration", "App Store"],
      outcomes: ["Publish apps", "Freelance projects", "Mobile dev expertise"],
      provider: "AppBuilders",
      rating: 4.8,
      enrollments: 4300,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "6",
      title: "Financial Planning & Investment",
      description: "Learn personal finance, investment strategies, and wealth management.",
      duration: "3 months",
      level: "Beginner",
      category: "Finance",
      price: "₹7,999",
      skills: ["Investment Planning", "Tax Planning", "Mutual Funds", "Insurance", "Banking"],
      outcomes: ["Personal wealth management", "Financial advisory skills", "Certification"],
      provider: "FinanceGuru",
      rating: 4.5,
      enrollments: 7800,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "7",
      title: "Content Writing & Copywriting",
      description: "Master the art of persuasive writing for marketing and content creation.",
      duration: "2 months",
      level: "Beginner",
      category: "Writing",
      price: "₹5,999",
      skills: ["SEO Writing", "Copywriting", "Blog Writing", "Social Media Content"],
      outcomes: ["Freelance writing", "Content strategy", "Portfolio development"],
      provider: "WriteWell",
      rating: 4.4,
      enrollments: 11200,
      imageUrl: "/api/placeholder/300/200"
    },
    {
      id: "8",
      title: "Artificial Intelligence & Machine Learning",
      description: "Dive deep into AI/ML algorithms, neural networks, and deep learning.",
      duration: "10 months",
      level: "Advanced",
      category: "Technology",
      price: "₹25,999",
      skills: ["TensorFlow", "PyTorch", "Neural Networks", "Computer Vision", "NLP"],
      outcomes: ["AI projects", "Research papers", "Industry certification"],
      provider: "AIInstitute",
      rating: 4.9,
      enrollments: 2800,
      imageUrl: "/api/placeholder/300/200"
    }
  ];

  const categories = ["All", ...Array.from(new Set(skillPrograms.map(p => p.category)))];
  const levels = ["All", "Beginner", "Intermediate", "Advanced"];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = skillPrograms;

    if (selectedCategory !== "All") {
      filtered = filtered.filter(program => program.category === selectedCategory);
    }

    if (selectedLevel !== "All") {
      filtered = filtered.filter(program => program.level === selectedLevel);
    }

    setFilteredPrograms(filtered);
  }, [selectedCategory, selectedLevel]);

  const resetFilters = () => {
    setSelectedCategory("All");
    setSelectedLevel("All");
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "Beginner": return "bg-blue-100 text-blue-800";
      case "Intermediate": return "bg-gray-100 text-gray-800";  
      case "Advanced": return "bg-slate-100 text-slate-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      
      <HeroSection 
        title="Skill Development"
        subtitle="Enhance your career prospects with industry-relevant skills and certifications"
        loaded={loaded}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Call to Action Banner */}
        <div className={`bg-white rounded-3xl p-8 mb-8 text-gray-800 text-center shadow-lg transform transition-all duration-500 delay-200 ${
          loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
        }`}>
          <h2 className="text-2xl font-bold mb-4">🎓 Just Completed 12th or Have Free Time?</h2>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Don't let your time go to waste! Invest in yourself with these carefully curated skill programs that will boost your career prospects and make you industry-ready.
          </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Industry Certified
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Practical Projects
              </div>
              <div className="flex items-center">
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Job Placement Support
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className={`bg-white rounded-2xl shadow-lg p-6 mb-8 transform transition-all duration-500 delay-300 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Level</label>
                  <select
                    value={selectedLevel}
                    onChange={(e) => setSelectedLevel(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {levels.map(level => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <p className="text-sm text-gray-600">
                  Showing {filteredPrograms.length} of {skillPrograms.length} programs
                </p>
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>
          </div>

          {/* Programs Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPrograms.map((program, index) => (
              <div
                key={program.id}
                className={`bg-white rounded-3xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                {/* Program Image */}
                <div className="h-48 bg-gradient-to-br from-blue-400 to-gray-600 relative">
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getLevelColor(program.level)}`}>
                      {program.level}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/90 text-gray-800 rounded-full text-xs font-semibold">
                      {program.category}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="flex items-center mb-2">
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-4 h-4 ${i < Math.floor(program.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-sm">{program.rating}</span>
                    </div>
                    <p className="text-sm">{program.enrollments.toLocaleString()} enrolled</p>
                  </div>
                </div>

                {/* Program Content */}
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-gray-800">{program.title}</h3>
                    <span className="text-lg font-bold text-blue-600">{program.price}</span>
                  </div>
                  
                  <p className="text-gray-600 mb-4 text-sm">{program.description}</p>
                  
                  <div className="mb-4">
                    <div className="flex items-center text-gray-600 mb-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="text-sm">{program.duration}</span>
                    </div>
                    <div className="flex items-center text-gray-600">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span className="text-sm">{program.provider}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">Skills you'll learn:</h4>
                    <div className="flex flex-wrap gap-2">
                      {program.skills.slice(0, 4).map(skill => (
                        <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {skill}
                        </span>
                      ))}
                      {program.skills.length > 4 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          +{program.skills.length - 4} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Outcomes */}
                  <div className="mb-6">
                    <h4 className="text-sm font-semibold text-gray-800 mb-2">What you'll achieve:</h4>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {program.outcomes.slice(0, 2).map(outcome => (
                        <li key={outcome} className="flex items-center">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                          {outcome}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <button className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-full hover:from-blue-700 hover:to-blue-800 transition-all duration-300 font-semibold transform hover:scale-105">
                    Enroll Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredPrograms.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No programs found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your filters to find more programs.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}