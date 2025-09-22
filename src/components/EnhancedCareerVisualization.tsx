"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CareerService, CareerNode, CareerLink, CareerPathData } from "@/lib/supabaseClient";

const EnhancedCareerVisualization: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CareerNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });

  const [allDegrees, setAllDegrees] = useState<string[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [careerData, setCareerData] = useState<CareerPathData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDegrees() {
      try {
        const degrees = await CareerService.getAllDegreesForGraph();
        setAllDegrees(degrees);
        if (degrees.length > 0) {
          setSelectedDegree(degrees[0]);
        }
      } catch (err) { setError('Failed to load degrees.'); }
    }
    loadDegrees();
  }, []);

  useEffect(() => {
    if (!selectedDegree) return;
    async function loadCareerData() {
      try {
        setLoading(true);
        setError(null);
        setSelectedNode(null);
        const data = await CareerService.getGraphDataForDegree(selectedDegree);
        setCareerData(data);
      } catch (err) {
        setError('Failed to load career path data.');
      } finally {
        setLoading(false);
      }
    }
    loadCareerData();
  }, [selectedDegree]);

  useEffect(() => {
    // This is where your entire, large D3 rendering logic goes.
    // It should use the `careerData` state variable instead of a local constant.
    if (!svgRef.current || !careerData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();
    
    // ... (The rest of your D3 rendering logic from the original EnhancedCareerVisualization.tsx)
    // IMPORTANT: change the first line inside this useEffect from:
    // const data = filterDataByDegrees(recommendedDegrees);
    // TO:
    // const data = careerData;
    
  }, [dimensions, careerData, selectedNode]);

  return (
    <div className="w-full">
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl">
        <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ✨ Interactive Career Universe ✨
            </h3>
        </div>
        
        <div className="max-w-md mx-auto mb-6">
            <label htmlFor="degree-select" className="block text-sm font-medium text-gray-700 mb-1">Select a Degree Path:</label>
            <select
                id="degree-select"
                value={selectedDegree || ''}
                onChange={(e) => setSelectedDegree(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                disabled={allDegrees.length === 0}
            >
                {allDegrees.map(degree => <option key={degree} value={degree}>{degree}</option>)}
            </select>
        </div>
        
        {/* ... (The rest of your JSX from the original file, including legend, SVG container, and details panel) ... */}
        {loading && <div className="text-center">Loading Visualization...</div>}
        {error && <div className="text-center text-red-500">{error}</div>}
        <div className="relative w-full overflow-hidden rounded-2xl">
          <svg ref={svgRef} width={dimensions.width} height={dimensions.height} className="w-full h-full" />
        </div>
      </div>
    </div>
  );
};

export default EnhancedCareerVisualization;