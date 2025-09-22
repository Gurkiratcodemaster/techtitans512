"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CareerPathService, CareerNode, CareerLink, CareerPathData } from "@/lib/supabaseClient"; // Adjust path if needed
import { Navbar } from "@/components/navbar"; // Assuming you have a Navbar

const CareerPathVisualizationPage = () => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  
  // State for data and loading
  const [allDegrees, setAllDegrees] = useState<string[]>([]);
  const [selectedDegree, setSelectedDegree] = useState<string | null>(null);
  const [careerData, setCareerData] = useState<CareerPathData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State for graph interactivity
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CareerNode | null>(null);

  // Effect to fetch the list of all degrees for the dropdown
  useEffect(() => {
    async function loadDegrees() {
      try {
        const degrees = await CareerPathService.getAllDegrees();
        setAllDegrees(degrees);
        if (degrees.length > 0) {
          setSelectedDegree(degrees[0]); // Select the first degree by default
        }
      } catch (err) {
        console.error('Error loading degrees:', err);
        setError('Failed to load available degrees.');
      }
    }
    loadDegrees();
  }, []);
  
  // Effect to fetch graph data when the selected degree changes
  useEffect(() => {
    if (!selectedDegree) return;

    async function loadCareerData() {
      try {
        setLoading(true);
        setError(null);
        setSelectedNode(null); // Clear selection on new data load
        // Use the efficient, single-degree fetching method
        const data = await CareerPathService.getCareerPathForDegree(selectedDegree!);
        setCareerData(data);
      } catch (err) {
        console.error('Error loading career data:', err);
        setError('Failed to load career path data for the selected degree.');
      } finally {
        setLoading(false);
      }
    }
    loadCareerData();
  }, [selectedDegree]);
  
  // Effect to handle resizing of the SVG container
  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(600, container.clientWidth * 0.7)
        });
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Main D3 rendering effect
  useEffect(() => {
    if (!svgRef.current || !careerData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    // Ensure we have nodes to render
    if (!careerData.nodes || careerData.nodes.length === 0) {
        return;
    }

    const { nodes, links } = careerData;
    const { width, height } = dimensions;

    const simulation = d3.forceSimulation<CareerNode>(nodes)
      .force("link", d3.forceLink<CareerNode, CareerLink>(links).id((d: any) => d.id).distance(150))
      .force("charge", d3.forceManyBody().strength(-450))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    svg.append("defs").append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 30)
      .attr("refY", 0)
      .attr("markerWidth", 6).attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path").attr("d", "M0,-5L10,0L0,5").attr("fill", "#9CA3AF");

    const link = svg.append("g").selectAll("line")
      .data(links).enter().append("line")
      .attr("stroke", "#9CA3AF").attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2).attr("marker-end", "url(#arrow)");

    const node = svg.append("g").selectAll("g")
      .data(nodes).enter().append("g")
      .style("cursor", "pointer")
      .call(d3.drag<any, CareerNode>().on("start", dragstarted).on("drag", dragged).on("end", dragended));

    const nodeColors: Record<string, string> = {
      degree: "#2563EB",
      exam: "#60A5FA",
      specialization: "#93C5FD",
      career: "#6B7280"
    };

    node.append("circle")
      .attr("r", 30)
      .attr("fill", d => nodeColors[d.type])
      .attr("stroke", "#FFFFFF").attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 4px 6px rgba(0,0,0,0.1))")
      .on("mouseover", handleMouseOver).on("mouseout", handleMouseOut).on("click", handleClick);

    node.append("text").text(d => d.icon || "📚")
      .attr("text-anchor", "middle").attr("dy", "0.35em")
      .attr("font-size", "20px").style("pointer-events", "none").attr("fill", "white");

    node.append("text").text(d => d.name)
      .attr("text-anchor", "middle").attr("dy", "3.2em")
      .attr("font-size", "12px").attr("font-weight", "600").attr("fill", "#1F2937");

    simulation.on("tick", () => {
      link
        .attr("x1", d => (d.source as CareerNode).x!)
        .attr("y1", d => (d.source as CareerNode).y!)
        .attr("x2", d => (d.target as CareerNode).x!)
        .attr("y2", d => (d.target as CareerNode).y!);
      
      node.each(d => {
        const radius = 30;
        d.x = Math.max(radius, Math.min(width - radius, d.x!));
        d.y = Math.max(radius, Math.min(height - radius, d.y!));
      }).attr("transform", d => `translate(${d.x},${d.y})`);
    });

    function handleMouseOver(event: MouseEvent, d: CareerNode) { setHoveredNode(d); }
    function handleMouseOut() { setHoveredNode(null); }
    function handleClick(event: MouseEvent, d: CareerNode) { setSelectedNode(d === selectedNode ? null : d); }
    function dragstarted(event: any, d: CareerNode) { if (!event.active) simulation.alphaTarget(0.3).restart(); d.fx = d.x; d.fy = d.y; }
    function dragged(event: any, d: CareerNode) { d.fx = event.x; d.fy = event.y; }
    function dragended(event: any, d: CareerNode) { if (!event.active) simulation.alphaTarget(0); d.fx = null; d.fy = null; }

  }, [dimensions, careerData]);

  const displayNode = selectedNode || hoveredNode;
  const nodeColors: Record<string, string> = {
      degree: "#2563EB",
      exam: "#60A5FA",
      specialization: "#93C5FD",
      career: "#6B7280"
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">Interactive Career Path Explorer</h2>
          
          <div className="max-w-md mx-auto mb-6">
            <label htmlFor="degree-select" className="block text-sm font-medium text-gray-700 mb-1">Select a Degree Path:</label>
            <select
              id="degree-select"
              value={selectedDegree || ''}
              onChange={(e) => setSelectedDegree(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              disabled={allDegrees.length === 0}
            >
              {allDegrees.length > 0 ? (
                allDegrees.map(degree => <option key={degree} value={degree}>{degree}</option>)
              ) : (
                <option>Loading degrees...</option>
              )}
            </select>
          </div>

          <div className="flex flex-wrap justify-center gap-x-4 gap-y-2 mb-6 text-sm text-gray-600">
            <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#2563EB" }}></div><span>Degree</span></div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#60A5FA" }}></div><span>Exam</span></div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#93C5FD" }}></div><span>Specialization</span></div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full mr-2" style={{ backgroundColor: "#6B7280" }}></div><span>Career</span></div>
          </div>

          <div className="w-full overflow-hidden rounded-lg border border-gray-200 bg-gray-50 relative">
            {(loading || error) && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-sm flex items-center justify-center z-10">
                {loading && <div className="text-lg font-semibold text-gray-700">Loading Visualization...</div>}
                {error && <div className="text-center text-red-600"><p className="font-bold">⚠️ Error</p><p>{error}</p></div>}
              </div>
            )}
            <svg ref={svgRef} className="w-full h-auto" width={dimensions.width} height={dimensions.height} />
          </div>
          
          <div className="mt-4 text-sm text-gray-500 text-center">
            <p>💡 <strong>How to explore:</strong> Hover over nodes to see connections • Click to view details • Drag nodes to rearrange</p>
          </div>

          {displayNode && (
            <div className="mt-6 p-6 bg-blue-50 rounded-2xl border border-blue-200 transition-all duration-300">
              <div className="flex items-center mb-3">
                <span className="text-3xl mr-4">{displayNode.icon}</span>
                <div>
                  <h4 className="text-xl font-bold text-gray-800">{displayNode.name}</h4>
                  <span className="text-xs font-semibold uppercase tracking-wider text-white px-2 py-1 rounded-full" style={{backgroundColor: nodeColors[displayNode.type]}}>
                    {displayNode.type}
                  </span>
                </div>
              </div>
              <p className="text-gray-700 mb-4">{displayNode.description}</p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm border-t border-blue-200 pt-4">
                {displayNode.duration && <div><span className="font-semibold text-gray-600">Duration: </span>{displayNode.duration}</div>}
                {displayNode.difficulty && <div><span className="font-semibold text-gray-600">Difficulty: </span>{displayNode.difficulty}</div>}
                {displayNode.salary && <div><span className="font-semibold text-gray-600">Salary Range: </span>{displayNode.salary}</div>}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default CareerPathVisualizationPage;