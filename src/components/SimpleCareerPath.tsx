"use client";
import { useState } from "react";

interface CareerStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  details: string[];
  timeline: string;
}

interface SimpleCareerPathProps {
  pathType?: "engineering" | "medical" | "business" | "general";
  className?: string;
}

const careerPaths = {
  engineering: {
    title: "🔧 Engineering Career Path",
    subtitle: "From Class 12 to Your Dream Tech Job",
    steps: [
      {
        id: "class12",
        title: "Class 12 (PCM)",
        description: "Complete your 12th with Physics, Chemistry, Mathematics",
        icon: "🎓",
        color: "#3B82F6",
        details: ["Focus on JEE preparation", "Maintain 75% aggregate", "Practice daily problem solving"],
        timeline: "1 Year"
      },
      {
        id: "entrance",
        title: "JEE Main/Advanced",
        description: "Clear engineering entrance exams",
        icon: "📝",
        color: "#EF4444",
        details: ["JEE Main for NITs/IIITs", "JEE Advanced for IITs", "State CETs for local colleges"],
        timeline: "6 Months Prep"
      },
      {
        id: "degree",
        title: "B.Tech Degree",
        description: "Complete your engineering degree",
        icon: "🏫",
        color: "#8B5CF6",
        details: ["Choose specialization (CS/IT/ECE/Mechanical)", "Maintain good CGPA", "Work on projects & internships"],
        timeline: "4 Years"
      },
      {
        id: "skills",
        title: "Skill Development",
        description: "Build industry-relevant skills",
        icon: "💻",
        color: "#F59E0B",
        details: ["Learn programming languages", "Complete internships", "Build portfolio projects"],
        timeline: "Throughout Degree"
      },
      {
        id: "career",
        title: "Dream Job",
        description: "Land your ideal engineering role",
        icon: "🚀",
        color: "#10B981",
        details: ["Software Engineer ₹4-15 LPA", "Data Scientist ₹6-20 LPA", "Product Manager ₹8-25 LPA"],
        timeline: "After Graduation"
      }
    ]
  },
  medical: {
    title: "⚕️ Medical Career Path",
    subtitle: "Your Journey to Becoming a Doctor",
    steps: [
      {
        id: "class12",
        title: "Class 12 (PCB)",
        description: "Complete your 12th with Physics, Chemistry, Biology",
        icon: "🎓",
        color: "#3B82F6",
        details: ["Focus on NEET preparation", "Strong foundation in Biology", "Practice NCERT thoroughly"],
        timeline: "1 Year"
      },
      {
        id: "neet",
        title: "NEET Exam",
        description: "Clear the National Eligibility cum Entrance Test",
        icon: "📋",
        color: "#EF4444",
        details: ["NEET UG for MBBS/BDS", "High competition exam", "Biology weightage: 50%"],
        timeline: "1 Year Prep"
      },
      {
        id: "mbbs",
        title: "MBBS Degree",
        description: "Complete your medical degree",
        icon: "🏥",
        color: "#8B5CF6",
        details: ["5.5 years including internship", "Theoretical + Practical training", "Clinical rotations"],
        timeline: "5.5 Years"
      },
      {
        id: "internship",
        title: "Medical Practice",
        description: "Start practicing or specialize further",
        icon: "👨‍⚕️",
        color: "#F59E0B",
        details: ["General Practice", "PG entrance for specialization", "Rural service (some states)"],
        timeline: "1+ Years"
      },
      {
        id: "career",
        title: "Medical Career",
        description: "Establish your medical practice",
        icon: "🏆",
        color: "#10B981",
        details: ["General Practitioner ₹8-15 LPA", "Specialist ₹15-30+ LPA", "Hospital roles ₹6-18 LPA"],
        timeline: "Lifelong Journey"
      }
    ]
  },
  business: {
    title: "💼 Business Career Path",
    subtitle: "From Commerce Student to Business Leader",
    steps: [
      {
        id: "class12",
        title: "Class 12 (Commerce)",
        description: "Complete your 12th with Commerce subjects",
        icon: "🎓",
        color: "#3B82F6",
        details: ["Accountancy, Business Studies, Economics", "Strong foundation in math", "Consider CA foundation"],
        timeline: "1 Year"
      },
      {
        id: "entrance",
        title: "Entrance Exams",
        description: "Prepare for business school entrances",
        icon: "📊",
        color: "#EF4444",
        details: ["CAT for IIMs", "XAT, MAT, CMAT", "BBA entrance exams"],
        timeline: "6-12 Months"
      },
      {
        id: "degree",
        title: "BBA/B.Com",
        description: "Complete your undergraduate business degree",
        icon: "🏛️",
        color: "#8B5CF6",
        details: ["BBA for management focus", "B.Com for accounting/finance", "Internships in final year"],
        timeline: "3 Years"
      },
      {
        id: "mba",
        title: "MBA (Optional)",
        description: "Pursue Master's for better opportunities",
        icon: "📈",
        color: "#F59E0B",
        details: ["Finance, Marketing, Operations", "IIMs, ISB, top B-schools", "2-year full-time program"],
        timeline: "2 Years"
      },
      {
        id: "career",
        title: "Business Role",
        description: "Start your business career",
        icon: "💰",
        color: "#10B981",
        details: ["Manager roles ₹6-18 LPA", "Consultant ₹8-25 LPA", "Banking/Finance ₹5-20 LPA"],
        timeline: "Career Growth"
      }
    ]
  },
  general: {
    title: "🎯 General Career Path",
    subtitle: "Universal Steps to Career Success",
    steps: [
      {
        id: "education",
        title: "Complete Education",
        description: "Finish your basic education (10+2)",
        icon: "🎓",
        color: "#3B82F6",
        details: ["Choose right stream", "Maintain good grades", "Develop study habits"],
        timeline: "12 Years"
      },
      {
        id: "explore",
        title: "Explore Interests",
        description: "Discover your passion and strengths",
        icon: "🔍",
        color: "#EF4444",
        details: ["Take career assessments", "Try different activities", "Talk to professionals"],
        timeline: "Ongoing"
      },
      {
        id: "prepare",
        title: "Skill Building",
        description: "Develop relevant skills for your field",
        icon: "💪",
        color: "#8B5CF6",
        details: ["Learn in-demand skills", "Get certifications", "Build experience"],
        timeline: "2-4 Years"
      },
      {
        id: "network",
        title: "Build Network",
        description: "Connect with industry professionals",
        icon: "🤝",
        color: "#F59E0B",
        details: ["Join professional groups", "Attend networking events", "Maintain relationships"],
        timeline: "Continuous"
      },
      {
        id: "career",
        title: "Launch Career",
        description: "Start your professional journey",
        icon: "🚀",
        color: "#10B981",
        details: ["Apply strategically", "Prepare for interviews", "Continuous learning"],
        timeline: "Lifelong"
      }
    ]
  }
};

const SimpleCareerPath: React.FC<SimpleCareerPathProps> = ({ 
  pathType = "general", 
  className = "" 
}) => {
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  const pathData = careerPaths[pathType];

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {pathData.title}
          </h3>
          <p className="text-gray-600 text-lg">
            {pathData.subtitle}
          </p>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-all duration-200"
          >
            {showDetails ? "Hide Details" : "Show Timeline Details"}
          </button>
        </div>

        {/* Steps Container */}
        <div className="relative">
          {/* Progress Line */}
          <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full hidden md:block"></div>
          
          {/* Steps */}
          <div className="space-y-6">
            {pathData.steps.map((step, index) => (
              <div 
                key={step.id}
                className={`relative flex items-start space-x-6 p-6 rounded-2xl transition-all duration-300 cursor-pointer group ${
                  activeStep === step.id 
                    ? 'bg-blue-50 border-2 border-blue-200 shadow-lg transform scale-105' 
                    : 'bg-white/50 hover:bg-white/80 border border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setActiveStep(activeStep === step.id ? null : step.id)}
              >
                {/* Step Number & Icon */}
                <div className="relative flex-shrink-0">
                  {/* Progress Dot */}
                  <div 
                    className="absolute left-1/2 transform -translate-x-1/2 w-4 h-4 rounded-full border-4 border-white shadow-lg hidden md:block"
                    style={{ backgroundColor: step.color, top: '1.5rem', left: '-3.25rem' }}
                  ></div>
                  
                  {/* Icon Circle */}
                  <div 
                    className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg"
                    style={{ backgroundColor: step.color }}
                  >
                    {step.icon}
                  </div>
                  
                  {/* Step Number */}
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{step.title}</h4>
                    {showDetails && (
                      <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm font-medium">
                        {step.timeline}
                      </span>
                    )}
                  </div>
                  
                  <p className="text-gray-600 text-lg mb-3">{step.description}</p>
                  
                  {/* Details */}
                  {(activeStep === step.id || showDetails) && (
                    <div className="mt-4 p-4 bg-white/80 rounded-xl border border-gray-200 animate-slideDown">
                      <h5 className="font-semibold text-gray-800 mb-3">Key Points:</h5>
                      <ul className="space-y-2">
                        {step.details.map((detail, detailIndex) => (
                          <li key={detailIndex} className="flex items-start space-x-2 text-gray-700">
                            <span className="text-blue-500 mt-1">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Expand Indicator */}
                  <div className="flex items-center justify-between mt-3">
                    <div className="text-sm text-gray-500">
                      Click to {activeStep === step.id ? 'collapse' : 'expand'} details
                    </div>
                    <svg 
                      className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${
                        activeStep === step.id ? 'rotate-180' : ''
                      }`}
                      fill="none" 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 text-center p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
          <h4 className="text-xl font-bold text-gray-800 mb-2">Ready to Start Your Journey?</h4>
          <p className="text-gray-600 mb-4">
            Take our career assessment to get personalized guidance for your path
          </p>
          <div className="flex justify-center space-x-4">
            <button className="px-6 py-3 bg-blue-500 text-white rounded-full font-semibold hover:bg-blue-600 transition-all duration-200 transform hover:scale-105">
              Take Assessment
            </button>
            <button className="px-6 py-3 bg-purple-500 text-white rounded-full font-semibold hover:bg-purple-600 transition-all duration-200 transform hover:scale-105">
              Talk to Counselor
            </button>
          </div>
        </div>

        {/* Path Selection */}
        <div className="mt-6 flex justify-center">
          <div className="text-sm text-gray-500">
            💡 This is the <span className="font-semibold text-blue-600">{pathType}</span> career path. 
            Different paths available on other pages.
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slideDown {
          animation: slideDown 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default SimpleCareerPath;