"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CareerNode, CareerLink, filterDataByDegrees } from "@/data/careerPathData";

interface EnhancedCareerVisualizationProps {
  recommendedDegrees: string[];
}

const EnhancedCareerVisualization: React.FC<EnhancedCareerVisualizationProps> = ({ recommendedDegrees }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CareerNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [animationProgress, setAnimationProgress] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: Math.max(container.clientWidth, 800),
          height: Math.max(700, container.clientWidth * 0.7)
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

    // Create beautiful background gradient
    const defs = svg.append("defs");
    
    // Background gradient
    const bgGradient = defs.append("radialGradient")
      .attr("id", "background-gradient")
      .attr("cx", "50%")
      .attr("cy", "50%")
      .attr("r", "50%");
    
    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#f0f9ff")
      .attr("stop-opacity", 1);
    
    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#e0f2fe")
      .attr("stop-opacity", 0.8);

    // Add background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#background-gradient)");

    // Node gradients and glows
    const nodeTypes = ["degree", "exam", "career", "specialization"];
    const nodeColors = {
      degree: { primary: "#3B82F6", secondary: "#60A5FA", glow: "#DBEAFE" },
      exam: { primary: "#EF4444", secondary: "#F87171", glow: "#FEE2E2" },
      career: { primary: "#10B981", secondary: "#34D399", glow: "#D1FAE5" },
      specialization: { primary: "#8B5CF6", secondary: "#A78BFA", glow: "#EDE9FE" }
    };

    nodeTypes.forEach(type => {
      // Node gradient
      const gradient = defs.append("radialGradient")
        .attr("id", `node-gradient-${type}`)
        .attr("cx", "30%")
        .attr("cy", "30%")
        .attr("r", "70%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", nodeColors[type as keyof typeof nodeColors].secondary);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", nodeColors[type as keyof typeof nodeColors].primary);

      // Glow filter
      const filter = defs.append("filter")
        .attr("id", `glow-${type}`)
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      filter.append("feGaussianBlur")
        .attr("stdDeviation", "4")
        .attr("result", "coloredBlur");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");

      // Pulse animation filter
      const pulseFilter = defs.append("filter")
        .attr("id", `pulse-${type}`)
        .attr("x", "-100%")
        .attr("y", "-100%")
        .attr("width", "300%")
        .attr("height", "300%");

      pulseFilter.append("feGaussianBlur")
        .attr("stdDeviation", "6")
        .attr("result", "pulseBlur");

      pulseFilter.append("feColorMatrix")
        .attr("in", "pulseBlur")
        .attr("values", `1 0 0 0 0
                        0 1 0 0 0
                        0 0 1 0 0
                        0 0 0 0.6 0`);
    });

    // Beautiful arrow markers
    const arrowMarkers = ["default", "highlighted", "path"];
    const arrowColors = { default: "#94A3B8", highlighted: "#F59E0B", path: "#EC4899" };

    arrowMarkers.forEach(type => {
      defs.append("marker")
        .attr("id", `arrow-${type}`)
        .attr("viewBox", "0 -8 16 16")
        .attr("refX", 35)
        .attr("refY", 0)
        .attr("markerWidth", 8)
        .attr("markerHeight", 8)
        .attr("orient", "auto")
        .append("path")
        .attr("d", "M0,-6L12,0L0,6L3,0Z")
        .attr("fill", arrowColors[type as keyof typeof arrowColors])
        .attr("stroke", arrowColors[type as keyof typeof arrowColors])
        .attr("stroke-width", 1);
    });

    // Enhanced force simulation
    const simulation = d3.forceSimulation<CareerNode>(data.nodes)
      .force("link", d3.forceLink<CareerNode, CareerLink>(data.links)
        .id(d => d.id)
        .distance(d => {
          const source = d.source as CareerNode;
          const target = d.target as CareerNode;
          // Adjust distance based on node types
          if (source.type === "exam" && target.type === "degree") return 150;
          if (source.type === "degree" && target.type === "specialization") return 120;
          if (source.type === "specialization" && target.type === "career") return 140;
          return 130;
        })
        .strength(0.8))
      .force("charge", d3.forceManyBody().strength(-800))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(55))
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY(height / 2).strength(0.1));

    // Create particle system for background effects
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.3 + 0.1
    }));

    // Background particles
    const particleGroup = svg.append("g").attr("class", "particles");
    
    particles.forEach(particle => {
      particleGroup.append("circle")
        .attr("r", particle.size)
        .attr("fill", "#BFDBFE")
        .attr("opacity", particle.opacity)
        .attr("transform", `translate(${particle.x},${particle.y})`)
        .transition()
        .duration(20000)
        .ease(d3.easeLinear)
        .attrTween("transform", () => {
          return (t: number) => {
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = width;
            if (particle.x > width) particle.x = 0;
            if (particle.y < 0) particle.y = height;
            if (particle.y > height) particle.y = 0;
            
            return `translate(${particle.x},${particle.y})`;
          };
        })
        .on("end", function() {
          // Restart animation
          d3.select(this)
            .transition()
            .duration(20000)
            .ease(d3.easeLinear)
            .attrTween("transform", () => (t: number) => {
              particle.x += particle.vx;
              particle.y += particle.vy;
              
              if (particle.x < 0) particle.x = width;
              if (particle.x > width) particle.x = 0;
              if (particle.y < 0) particle.y = height;
              if (particle.y > height) particle.y = 0;
              
              return `translate(${particle.x},${particle.y})`;
            });
        });
    });

    // Enhanced links with gradients
    const linkGroup = svg.append("g").attr("class", "links");
    
    const link = linkGroup.selectAll("path")
      .data(data.links)
      .enter()
      .append("path")
      .attr("fill", "none")
      .attr("stroke", "#CBD5E1")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 3)
      .attr("marker-end", "url(#arrow-default)")
      .style("cursor", "pointer")
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))")
      .on("mouseover", handleLinkHover)
      .on("mouseout", handleLinkOut);

    // Enhanced nodes with beautiful styling
    const nodeGroup = svg.append("g").attr("class", "nodes");
    
    const node = nodeGroup.selectAll("g")
      .data(data.nodes)
      .enter()
      .append("g")
      .style("cursor", "pointer")
      .call(d3.drag<SVGGElement, CareerNode>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended));

    // Outer glow circle
    node.append("circle")
      .attr("r", 45)
      .attr("fill", d => nodeColors[d.type as keyof typeof nodeColors].glow)
      .attr("opacity", 0.3)
      .style("filter", d => `url(#glow-${d.type})`);

    // Main node circle with gradient
    node.append("circle")
      .attr("r", 30)
      .attr("fill", d => `url(#node-gradient-${d.type})`)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4)
      .style("filter", "drop-shadow(0 4px 12px rgba(0,0,0,0.15))")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", handleClick);

    // Icon background circle
    node.append("circle")
      .attr("r", 20)
      .attr("fill", "rgba(255,255,255,0.9)")
      .attr("stroke", "rgba(255,255,255,0.5)")
      .attr("stroke-width", 1);

    // Icons with enhanced styling
    node.append("text")
      .text(d => d.icon || "📚")
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("font-size", "20px")
      .style("pointer-events", "none")
      .style("filter", "drop-shadow(0 1px 2px rgba(0,0,0,0.1))");

    // Enhanced labels with background
    const labelGroup = node.append("g").attr("transform", "translate(0, 50)");
    
    // Label background
    labelGroup.append("rect")
      .attr("x", d => -(d.name.length * 4))
      .attr("y", -12)
      .attr("width", d => d.name.length * 8)
      .attr("height", 20)
      .attr("rx", 10)
      .attr("fill", "rgba(255,255,255,0.9)")
      .attr("stroke", "rgba(0,0,0,0.1)")
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    // Label text
    labelGroup.append("text")
      .text(d => d.name.length > 15 ? d.name.substring(0, 15) + "..." : d.name)
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("font-size", "12px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .style("pointer-events", "none");

    // Type badge
    const badgeGroup = node.append("g").attr("transform", "translate(0, 72)");
    
    badgeGroup.append("rect")
      .attr("x", d => -(d.type.length * 3.5))
      .attr("y", -8)
      .attr("width", d => d.type.length * 7)
      .attr("height", 16)
      .attr("rx", 8)
      .attr("fill", d => nodeColors[d.type as keyof typeof nodeColors].primary)
      .attr("opacity", 0.8);

    badgeGroup.append("text")
      .text(d => d.type.charAt(0).toUpperCase() + d.type.slice(1))
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("font-size", "9px")
      .attr("font-weight", "600")
      .attr("fill", "#ffffff")
      .style("pointer-events", "none");

    // Animate nodes on entrance
    node.style("opacity", 0)
      .style("transform", "scale(0)")
      .transition()
      .duration(1000)
      .delay((d, i) => i * 100)
      .ease(d3.easeElasticOut)
      .style("opacity", 1)
      .style("transform", "scale(1)");

    // Animate links
    link.style("opacity", 0)
      .transition()
      .duration(800)
      .delay(500)
      .ease(d3.easeQuadOut)
      .style("opacity", 0.6);

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link.attr("d", d => {
        const source = d.source as CareerNode;
        const target = d.target as CareerNode;
        
        if (!source || !target || source.x === undefined || source.y === undefined || 
            target.x === undefined || target.y === undefined) return "";
        
        const dx = target.x - source.x;
        const dy = target.y - source.y;
        const dr = Math.sqrt(dx * dx + dy * dy) * 0.1; // Curve factor
        
        return `M${source.x},${source.y}A${dr},${dr} 0 0,1 ${target.x},${target.y}`;
      });

      node.attr("transform", d => `translate(${d.x || 0},${d.y || 0})`);
    });

    function handleMouseOver(event: MouseEvent, d: CareerNode) {
      setHoveredNode(d);
      
      // Enhance hovered node
      d3.select(event.currentTarget as SVGElement)
        .transition()
        .duration(200)
        .attr("r", 35)
        .style("filter", `url(#pulse-${d.type})`);
      
      // Highlight connected elements
      const connectedNodeIds = new Set<string>();
      const connectedLinks = new Set<CareerLink>();
      
      data.links.forEach(link => {
        const sourceId = typeof link.source === 'string' ? link.source : link.source.id;
        const targetId = typeof link.target === 'string' ? link.target : link.target.id;
        
        if (sourceId === d.id || targetId === d.id) {
          connectedNodeIds.add(sourceId);
          connectedNodeIds.add(targetId);
          connectedLinks.add(link);
        }
      });

      // Fade non-connected elements
      node.selectAll("circle:nth-child(2)")
        .transition()
        .duration(200)
        .style("opacity", function(this: any) {
          const nodeData = d3.select(this.parentNode).datum() as CareerNode;
          return connectedNodeIds.has(nodeData.id) ? 1 : 0.3;
        });

      link.transition()
        .duration(200)
        .style("opacity", function(this: any) {
          const linkData = d3.select(this).datum() as CareerLink;
          return connectedLinks.has(linkData) ? 1 : 0.1;
        })
        .attr("stroke", function(this: any) {
          const linkData = d3.select(this).datum() as CareerLink;
          return connectedLinks.has(linkData) ? "#F59E0B" : "#CBD5E1";
        })
        .attr("marker-end", function(this: any) {
          const linkData = d3.select(this).datum() as CareerLink;
          return connectedLinks.has(linkData) ? "url(#arrow-highlighted)" : "url(#arrow-default)";
        });
    }

    function handleMouseOut(event: MouseEvent, d: CareerNode) {
      if (d !== selectedNode) {
        setHoveredNode(null);
      }
      
      // Reset hovered node
      d3.select(event.currentTarget as SVGElement)
        .transition()
        .duration(200)
        .attr("r", 30)
        .style("filter", "drop-shadow(0 4px 12px rgba(0,0,0,0.15))");

      // Reset all elements
      node.selectAll("circle:nth-child(2)")
        .transition()
        .duration(200)
        .style("opacity", 1);

      link.transition()
        .duration(200)
        .style("opacity", 0.6)
        .attr("stroke", "#CBD5E1")
        .attr("marker-end", "url(#arrow-default)");
    }

    function handleLinkHover(event: MouseEvent, d: CareerLink) {
      d3.select(event.currentTarget as SVGElement)
        .transition()
        .duration(200)
        .attr("stroke", "#EC4899")
        .attr("stroke-width", 5)
        .attr("marker-end", "url(#arrow-path)");
    }

    function handleLinkOut(event: MouseEvent, d: CareerLink) {
      d3.select(event.currentTarget as SVGElement)
        .transition()
        .duration(200)
        .attr("stroke", "#CBD5E1")
        .attr("stroke-width", 3)
        .attr("marker-end", "url(#arrow-default)");
    }

    function handleClick(event: MouseEvent, d: CareerNode) {
      setSelectedNode(d === selectedNode ? null : d);
      
      // Special selection animation
      if (d !== selectedNode) {
        d3.select(event.currentTarget as SVGElement)
          .transition()
          .duration(300)
          .ease(d3.easeBounceOut)
          .attr("r", 35)
          .transition()
          .duration(200)
          .attr("r", 30);
      }
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
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-white/20">
        {/* Enhanced Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
            </svg>
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            ✨ Interactive Career Universe ✨
          </h3>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Explore your personalized career journey through this beautiful interactive diagram. 
            Watch connections come alive as you discover pathways from entrance exams to dream careers!
          </p>
        </div>
        
        {/* Beautiful Legend */}
        <div className="flex flex-wrap justify-center gap-6 mb-8 p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl">
          {[
            { type: 'degree', color: 'bg-blue-500', label: '🎓 Degrees', icon: '💻' },
            { type: 'exam', color: 'bg-red-500', label: '📝 Exams', icon: '📋' },
            { type: 'specialization', color: 'bg-purple-500', label: '🎯 Specializations', icon: '🔧' },
            { type: 'career', color: 'bg-green-500', label: '💼 Careers', icon: '👨‍💻' }
          ].map(({ type, color, label, icon }) => (
            <div key={type} className="flex items-center bg-white rounded-lg px-3 py-2 shadow-md">
              <div className={`w-4 h-4 ${color} rounded-full mr-2 shadow-sm`}></div>
              <span className="text-sm font-medium text-gray-700 mr-1">{label}</span>
              <span className="text-lg">{icon}</span>
            </div>
          ))}
        </div>

        {/* Enhanced Visualization Container */}
        <div className="relative w-full overflow-hidden rounded-2xl border-2 border-gradient-to-r from-blue-200 to-purple-200 shadow-inner">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-purple-50/30 pointer-events-none"></div>
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
            style={{ background: 'transparent' }}
          />
        </div>

        {/* Interactive Instructions */}
        <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm">
          <div className="bg-blue-50 p-4 rounded-xl border border-blue-200">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">🖱️</span>
              <span className="font-semibold text-blue-900">Hover</span>
            </div>
            <p className="text-blue-700">Hover over nodes to see magical connections light up</p>
          </div>
          <div className="bg-green-50 p-4 rounded-xl border border-green-200">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">👆</span>
              <span className="font-semibold text-green-900">Click</span>
            </div>
            <p className="text-green-700">Click nodes to pin details and explore information</p>
          </div>
          <div className="bg-purple-50 p-4 rounded-xl border border-purple-200">
            <div className="flex items-center mb-2">
              <span className="text-xl mr-2">✋</span>
              <span className="font-semibold text-purple-900">Drag</span>
            </div>
            <p className="text-purple-700">Drag nodes to rearrange and customize your view</p>
          </div>
        </div>

        {/* Enhanced Details Panel */}
        {(selectedNode || hoveredNode) && (
          <div className="mt-8 p-8 bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl border border-blue-200 shadow-lg">
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mr-4 shadow-lg">
                  <span className="text-3xl">{(selectedNode || hoveredNode)?.icon}</span>
                </div>
                <div>
                  <h4 className="text-2xl font-bold text-gray-800 mb-1">
                    {(selectedNode || hoveredNode)?.name}
                  </h4>
                  <span className="inline-block text-sm font-semibold text-white px-4 py-2 rounded-full shadow-md" 
                        style={{
                          background: `linear-gradient(135deg, ${
                            (selectedNode || hoveredNode)?.type === 'degree' ? '#3B82F6, #60A5FA' :
                            (selectedNode || hoveredNode)?.type === 'exam' ? '#EF4444, #F87171' :
                            (selectedNode || hoveredNode)?.type === 'career' ? '#10B981, #34D399' :
                            '#8B5CF6, #A78BFA'
                          })`
                        }}>
                    {((selectedNode || hoveredNode)?.type || '').charAt(0).toUpperCase() + ((selectedNode || hoveredNode)?.type || '').slice(1)}
                  </span>
                </div>
              </div>
              {selectedNode && (
                <button
                  onClick={() => setSelectedNode(null)}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            
            <p className="text-gray-700 text-lg mb-6 leading-relaxed">
              {(selectedNode || hoveredNode)?.description}
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {(selectedNode || hoveredNode)?.duration && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">⏱️</span>
                    <span className="font-semibold text-gray-700">Duration</span>
                  </div>
                  <div className="text-lg font-bold text-blue-600">
                    {(selectedNode || hoveredNode)?.duration}
                  </div>
                </div>
              )}
              {(selectedNode || hoveredNode)?.difficulty && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">📊</span>
                    <span className="font-semibold text-gray-700">Difficulty</span>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${
                    (selectedNode || hoveredNode)?.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                    (selectedNode || hoveredNode)?.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {(selectedNode || hoveredNode)?.difficulty}
                  </div>
                </div>
              )}
              {(selectedNode || hoveredNode)?.salary && (
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex items-center mb-2">
                    <span className="text-xl mr-2">💰</span>
                    <span className="font-semibold text-gray-700">Salary Range</span>
                  </div>
                  <div className="text-lg font-bold text-green-600">
                    {(selectedNode || hoveredNode)?.salary}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCareerVisualization;