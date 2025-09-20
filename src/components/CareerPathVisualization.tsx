"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CareerNode, CareerLink, filterDataByDegrees } from "@/data/careerPathData";

interface CareerPathVisualizationProps {
  recommendedDegrees: string[];
}

const CareerPathVisualization: React.FC<CareerPathVisualizationProps> = ({ recommendedDegrees }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CareerNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: container.clientWidth,
          height: Math.max(600, container.clientWidth * 0.6)
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const data = filterDataByDegrees(recommendedDegrees);
    const { width, height } = dimensions;

    // Set up the simulation
    const simulation = d3.forceSimulation<CareerNode>(data.nodes)
      .force("link", d3.forceLink<CareerNode, CareerLink>(data.links).id(d => d.id).distance(120))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(50));

    // Create arrow markers for directed edges
    svg.append("defs")
      .selectAll("marker")
      .data(["arrow"])
      .enter()
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 25)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#666");

    // Create links
    const link = svg.append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(data.links)
      .enter()
      .append("line")
      .attr("stroke", "#666")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2)
      .attr("marker-end", "url(#arrow)")
      .style("cursor", "pointer");

    // Create node groups
    const node = svg.append("g")
      .attr("class", "nodes")
      .selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, CareerNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Add circles to nodes
    const nodeColors = {
      degree: "#3B82F6",    // Blue
      exam: "#EF4444",      // Red
      career: "#10B981",    // Green
      specialization: "#8B5CF6" // Purple
    };

    node.append("circle")
      .attr("r", 25)
      .attr("fill", d => nodeColors[d.type])
      .attr("stroke", "#fff")
      .attr("stroke-width", 3)
      .style("filter", "drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1))")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);

    // Add icons to nodes
    node.append("text")
      .text(d => d.icon || "📚")
      .attr("text-anchor", "middle")
      .attr("dy", "0.35em")
      .attr("font-size", "16px")
      .style("pointer-events", "none");

    // Add labels to nodes
    node.append("text")
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "3.5em")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .style("pointer-events", "none");

    // Add type labels
    node.append("text")
      .text(d => d.type.charAt(0).toUpperCase() + d.type.slice(1))
      .attr("text-anchor", "middle")
      .attr("dy", "5em")
      .attr("font-size", "10px")
      .attr("fill", "#6B7280")
      .style("pointer-events", "none");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", d => {
          const source = typeof d.source === 'string' ? 
            data.nodes.find(n => n.id === d.source) : d.source;
          return source?.x || 0;
        })
        .attr("y1", d => {
          const source = typeof d.source === 'string' ? 
            data.nodes.find(n => n.id === d.source) : d.source;
          return source?.y || 0;
        })
        .attr("x2", d => {
          const target = typeof d.target === 'string' ? 
            data.nodes.find(n => n.id === d.target) : d.target;
          return target?.x || 0;
        })
        .attr("y2", d => {
          const target = typeof d.target === 'string' ? 
            data.nodes.find(n => n.id === d.target) : d.target;
          return target?.y || 0;
        });

      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });

    function handleMouseOver(event: MouseEvent, d: CareerNode) {
      setHoveredNode(d);
      
      // Highlight connected nodes and links
      const connectedNodeIds = new Set<string>();
      data.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        
        if (sourceId === d.id || targetId === d.id) {
          connectedNodeIds.add(sourceId);
          connectedNodeIds.add(targetId);
        }
      });

      node.selectAll("circle")
        .style("opacity", function(this: any) {
          const nodeData = d3.select(this.parentNode).datum() as CareerNode;
          return connectedNodeIds.has(nodeData.id) ? 1 : 0.3;
        });

      link.style("opacity", function(this: any) {
        const linkData = d3.select(this).datum() as CareerLink;
        const sourceId = typeof linkData.source === 'string' ? linkData.source : linkData.source.id;
        const targetId = typeof linkData.target === 'string' ? linkData.target : linkData.target.id;
        return (sourceId === d.id || targetId === d.id) ? 1 : 0.1;
      });
    }

    function handleMouseOut() {
      setHoveredNode(null);
      node.selectAll("circle").style("opacity", 1);
      link.style("opacity", 0.6);
    }

    function handleClick(event: MouseEvent, d: CareerNode) {
      setSelectedNode(d === selectedNode ? null : d);
    }

    function dragstarted(event: d3.D3DragEvent<SVGGElement, CareerNode, CareerNode>) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: d3.D3DragEvent<SVGGElement, CareerNode, CareerNode>) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: d3.D3DragEvent<SVGGElement, CareerNode, CareerNode>) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

  }, [dimensions, recommendedDegrees, selectedNode]);

  return (
    <div className="w-full">
      <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
        <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          Interactive Career Path Explorer
        </h3>
        
        {/* Legend */}
        <div className="flex flex-wrap justify-center gap-4 mb-6 text-sm">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-blue-500 rounded-full mr-2"></div>
            <span>Degrees</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-red-500 rounded-full mr-2"></div>
            <span>Entrance Exams</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-purple-500 rounded-full mr-2"></div>
            <span>Specializations</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-green-500 rounded-full mr-2"></div>
            <span>Careers</span>
          </div>
        </div>

        {/* Visualization Container */}
        <div className="w-full overflow-hidden rounded-lg border border-gray-200">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          />
        </div>

        {/* Instructions */}
        <div className="mt-4 text-sm text-gray-600 text-center">
          <p>💡 <strong>How to explore:</strong> Hover over nodes to see connections • Click to view details • Drag nodes to rearrange</p>
        </div>

        {/* Node Details Panel */}
        {(selectedNode || hoveredNode) && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="flex items-center mb-3">
              <span className="text-2xl mr-3">{(selectedNode || hoveredNode)?.icon}</span>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{(selectedNode || hoveredNode)?.name}</h4>
                <span className="text-sm bg-blue-500 text-white px-2 py-1 rounded-full">
                  {(selectedNode || hoveredNode)?.type}
                </span>
              </div>
            </div>
            
            <p className="text-gray-700 mb-3">{(selectedNode || hoveredNode)?.description}</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              {(selectedNode || hoveredNode)?.duration && (
                <div>
                  <span className="font-semibold text-gray-600">Duration:</span>
                  <div>{(selectedNode || hoveredNode)?.duration}</div>
                </div>
              )}
              {(selectedNode || hoveredNode)?.difficulty && (
                <div>
                  <span className="font-semibold text-gray-600">Difficulty:</span>
                  <div className={`inline-block px-2 py-1 rounded text-xs ${
                    (selectedNode || hoveredNode)?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    (selectedNode || hoveredNode)?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(selectedNode || hoveredNode)?.difficulty}
                  </div>
                </div>
              )}
              {(selectedNode || hoveredNode)?.salary && (
                <div>
                  <span className="font-semibold text-gray-600">Salary Range:</span>
                  <div>{(selectedNode || hoveredNode)?.salary}</div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerPathVisualization;