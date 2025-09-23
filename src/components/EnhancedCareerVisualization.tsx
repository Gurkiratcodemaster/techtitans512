"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CareerPathService, CareerNode, CareerLink, CareerPathData } from "@/lib/supabaseClient";

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
        const degrees = await CareerPathService.getAllDegrees();
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
        const data = await CareerPathService.getCareerPathForDegree(selectedDegree);
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
    if (!svgRef.current || !careerData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { nodes = [], links = [] } = careerData;
    if (nodes.length === 0) return;

    const simulation = d3.forceSimulation<CareerNode>(nodes)
      .force("link", d3.forceLink<CareerNode, CareerLink>(links as any).id((d: any) => d.id).distance(140))
      .force("charge", d3.forceManyBody().strength(-400))
      .force("center", d3.forceCenter(dimensions.width / 2, dimensions.height / 2))
      .force("collision", d3.forceCollide().radius(48));

    const defs = svg.append("defs");
    defs.append("marker")
      .attr("id", "arrow-e")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 28)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#CBD5E1");

    const link = svg.append("g").selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-opacity", 0.7)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow-e)");

    const groups = svg.append("g").selectAll("g")
      .data(nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(d3.drag<any, CareerNode>()
        .on("start", (event, d) => { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; })
        .on("drag", (event, d) => { d.fx = event.x; d.fy = event.y; })
        .on("end", (event, d) => { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; })
      );

    const color: Record<string, string> = { degree: "#2563EB", exam: "#60A5FA", specialization: "#93C5FD", career: "#6B7280" };

    groups.append("circle")
      .attr("r", 28)
      .attr("fill", d => color[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .on("mouseover", (_e, d) => setHoveredNode(d))
      .on("mouseout", () => setHoveredNode(null))
      .on("click", (_e, d) => setSelectedNode(prev => prev?.id === d.id ? null : d));

    groups.append("text")
      .text(d => d.icon || "📚")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", 18)
      .attr("fill", "#fff")
      .style("pointer-events", "none");

    groups.append("text")
      .text(d => d.name)
      .attr("text-anchor", "middle")
      .attr("dy", 42)
      .attr("font-size", 12)
      .attr("fill", "#111827")
      .attr("font-weight", 600);

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => (d.source as any).x)
        .attr("y1", (d: any) => (d.source as any).y)
        .attr("x2", (d: any) => (d.target as any).x)
        .attr("y2", (d: any) => (d.target as any).y);

      groups
        .each((d: any) => {
          const r = 30;
          d.x = Math.max(r, Math.min(dimensions.width - r, d.x));
          d.y = Math.max(r, Math.min(dimensions.height - r, d.y));
        })
        .attr("transform", (d: any) => `translate(${d.x},${d.y})`);
    });

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