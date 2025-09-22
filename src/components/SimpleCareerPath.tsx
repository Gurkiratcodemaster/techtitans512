"use client";
import { useState, useEffect } from "react";
import { CareerService, CareerPath } from "@/lib/supabaseClient";

interface SimpleCareerPathProps {
  pathType: "engineering" | "medical" | "business";
  className?: string;
}

const SimpleCareerPath: React.FC<SimpleCareerPathProps> = ({ pathType, className = "" }) => {
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const [pathData, setPathData] = useState<CareerPath | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        setLoading(true);
        const data = await CareerService.getLinearCareerPath(pathType);
        setPathData(data);
        setLoading(false);
    }
    fetchData();
  }, [pathType]);

  if (loading) {
    return (
        <div className="w-full bg-white/90 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-600">Loading Career Path...</h3>
        </div>
    );
  }

  if (!pathData) {
    return <div className="text-center text-red-500">Could not load career path data.</div>;
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
        <div className="text-center mb-8">
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {pathData.title}
          </h3>
          <p className="text-gray-600 text-lg">{pathData.subtitle}</p>
          <button 
            onClick={() => setShowDetails(!showDetails)}
            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600"
          >
            {showDetails ? "Hide Details" : "Show Timeline Details"}
          </button>
        </div>

        <div className="relative">
          <div className="absolute left-8 top-16 bottom-0 w-1 bg-gradient-to-b from-blue-500 via-purple-500 to-green-500 rounded-full hidden md:block"></div>
          <div className="space-y-6">
            {pathData.steps.map((step, index) => (
              <div 
                key={step.node.id}
                className={`relative flex items-start space-x-6 p-6 rounded-2xl transition-all cursor-pointer group ${
                  activeStepId === step.node.id ? 'bg-blue-50 border-2 border-blue-200 shadow-lg' : 'bg-white/50 hover:bg-white/80 border'
                }`}
                onClick={() => setActiveStepId(activeStepId === step.node.id ? null : step.node.id)}
              >
                <div className="relative flex-shrink-0">
                  <div className="absolute w-4 h-4 rounded-full border-4 border-white shadow-lg hidden md:block" style={{ backgroundColor: step.color, top: '1.5rem', left: '-3.25rem' }}></div>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-2xl text-white font-bold shadow-lg" style={{ backgroundColor: step.color }}>
                    {step.node.icon}
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 bg-gray-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="text-xl font-bold text-gray-800">{step.node.name}</h4>
                    {showDetails && <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-sm">{step.timeline}</span>}
                  </div>
                  <p className="text-gray-600 text-lg mb-3">{step.node.description}</p>
                  {(activeStepId === step.node.id || showDetails) && (
                    <div className="mt-4 p-4 bg-white/80 rounded-xl border">
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
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleCareerPath;