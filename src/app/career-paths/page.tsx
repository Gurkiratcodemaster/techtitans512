"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import { HeroSection } from "@/components/HeroSection";
import CornerChatbot from "@/components/CornerChatbot";
import { CareerPathService, DegreeOverview } from "@/lib/supabaseClient";import * as d3 from "d3";

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
        setLoading(true);
        const data = await CareerPathService.getDegreeOverviews();
        if (data.length > 0) {
            // Set the first degree as the default selection
            setSelectedDegree(data[0]);
        }
        setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      <Navbar />
      <HeroSection 
        title="Career Path Mapping"
        subtitle="Explore diverse career opportunities and plan your academic journey"
        loaded={loaded}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a Degree to Explore</h2>
            {loading ? (
              <div className="text-center">Loading degrees...</div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {careerPathsData.map((degree) => (
                  <button
                    key={degree.id}
                    onClick={() => setSelectedDegree(degree)}
                    className={`p-4 rounded-2xl text-left transition-all duration-300 transform hover:scale-105 ${
                      selectedDegree?.id === degree.id
                        ? 'bg-blue-600 text-white shadow-lg'
                        : 'bg-white/80 backdrop-blur-sm text-gray-800 hover:shadow-lg'
                    }`}
                  >
                    <h3 className="font-bold text-lg mb-2">{degree.degree}</h3>
                    <p className={`text-sm ${selectedDegree?.id === degree.id ? 'text-blue-100' : 'text-gray-600'}`}>
                      {degree.description}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          {/* ... (The rest of your JSX for visualization and details remains the same) ... */}
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