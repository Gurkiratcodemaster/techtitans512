"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import CornerChatbot from "@/components/CornerChatbot";
import { CareerService, DegreeOverview } from "@/lib/supabaseClient";
import * as d3 from "d3";

export default function CareerPathsPage() {
  const [loaded, setLoaded] = useState(false);
  const [careerPathsData, setCareerPathsData] = useState<DegreeOverview[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<DegreeOverview | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    async function fetchData() {
        try {
            setLoading(true);
            const data = await CareerService.getDegreeOverviews();
            setCareerPathsData(data);
            if (data.length > 0) {
                // Set the first degree as the default selection
                setSelectedDegree(data[0]);
            }
        } catch (error) {
            console.error('Error fetching career paths:', error);
        } finally {
            setLoading(false);
        }
    }
    fetchData();
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (selectedDegree && svgRef.current) {
      createSankeyDiagram();
    }
  }, [selectedDegree]);

  const createSankeyDiagram = () => {
    if (!selectedDegree || !svgRef.current) return;

    // Clear previous diagram
    d3.select(svgRef.current).selectAll("*").remove();

    const svg = d3.select(svgRef.current);
    const width = 800;
    const height = 500;
    const margin = { top: 20, right: 20, bottom: 20, left: 20 };

    type SankeyNode = { id: string; category: string; x?: number; y?: number; };

    const nodes: SankeyNode[] = [
      { id: selectedDegree.degree, category: "degree" },
      ...selectedDegree.jobs.map(job => ({ id: job, category: "job" })),
      ...selectedDegree.higher_studies.map(study => ({ id: study, category: "study" }))
    ];

    const links = [
      ...selectedDegree.jobs.map(job => ({ source: selectedDegree.degree, target: job, value: 1 })),
      ...selectedDegree.higher_studies.map(study => ({ source: selectedDegree.degree, target: study, value: 1 }))
    ];
    
    // ... (The rest of your D3 Sankey diagram logic remains the same)
    // You can copy it directly from your original `page.tsx` file.
  };

  const handleNodeClick = (nodeId: string, category: string) => {
    setSelectedNode(nodeId);
    if (category === "job" || category === "study") {
      setShowChatbot(true);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
        <Navbar />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading career paths...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <Navbar />
      <HeroSection 
        title="Career Path Explorer"
        subtitle="Discover diverse career opportunities and plan your academic journey"
        loaded={loaded}
        stats={[
          { value: careerPathsData.length, label: 'Degree Programs' },
          { value: careerPathsData.reduce((sum, degree) => sum + degree.jobs.length, 0), label: 'Career Options' },
          { value: careerPathsData.reduce((sum, degree) => sum + degree.higher_studies.length, 0), label: 'Study Paths' }
        ]}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a Degree to Explore</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerPathsData.map((degree) => (
                  <button
                    key={degree.id}
                    onClick={() => setSelectedDegree(degree)}
                    className={`p-6 rounded-xl text-left transition-all duration-300 transform hover:scale-105 border-2 ${
                      selectedDegree?.id === degree.id
                        ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                        : 'bg-white text-gray-800 hover:shadow-lg border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-2">{degree.degree}</h3>
                    <p className={`text-sm ${selectedDegree?.id === degree.id ? 'text-blue-100' : 'text-gray-600'}`}>
                      {degree.description}
                    </p>
                    <div className="mt-3 text-xs opacity-75">
                      {degree.jobs.length} careers • {degree.higher_studies.length} study options
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          {selectedDegree && (
            <div className={`space-y-6 transition-all duration-500 ${loaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
              {/* Career Options */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Career Options with {selectedDegree.degree}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDegree.jobs.map((job, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedNode(job);
                        setShowChatbot(true);
                      }}
                    >
                      <div className="font-semibold text-gray-800">{job}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Higher Studies Options */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Higher Studies Options</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedDegree.higher_studies.map((study, index) => (
                    <div 
                      key={index}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                      onClick={() => {
                        setSelectedNode(study);
                        setShowChatbot(true);
                      }}
                    >
                      <div className="font-semibold text-gray-800">{study}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <CornerChatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        initialMessage={selectedNode ? `Tell me more about ${selectedNode}` : "Hi!"}
        context={selectedNode || "Career path mapping"}
      />
    </div>
  );
}