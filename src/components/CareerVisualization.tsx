"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";
import { CareerPathService, CareerService, CareerNode, CareerLink, CareerPathData, CareerPath } from "@/lib/database";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  x?: number;
  y?: number;
}

interface CareerVisualizationProps {
  mode?: 'flow' | 'network' | 'simple' | 'enhanced';
  pathType?: "engineering" | "medical" | "business";
  steps?: FlowStep[];
  title?: string;
  className?: string;
  selectedDegree?: string;
}

const defaultSteps: FlowStep[] = [
  {
    id: "step1",
    title: "Class 12",
    description: "Choose your stream (PCM/PCB/Commerce)",
    icon: "12",
    color: "#3B82F6"
  },
  {
    id: "step2", 
    title: "Entrance Exams",
    description: "JEE, NEET, CAT, etc.",
    icon: "EX",
    color: "#1E40AF"
  },
  {
    id: "step3",
    title: "Degree Selection",
    description: "Choose your undergraduate program",
    icon: "UG",
    color: "#1D4ED8"
  },
  {
    id: "step4",
    title: "Specialization",
    description: "Focus on specific skills",
    icon: "SP",
    color: "#2563EB"
  },
  {
    id: "step5",
    title: "Career Launch",
    description: "Start your professional journey",
    icon: "CL",
    color: "#1E3A8A"
  }
];

const CareerVisualization: React.FC<CareerVisualizationProps> = ({ 
  mode = 'flow',
  pathType = "engineering",
  steps = defaultSteps,
  title,
  className = "",
  selectedDegree
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [selectedNode, setSelectedNode] = useState<CareerNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<CareerNode | null>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [activeStepId, setActiveStepId] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  // Data states
  const [allDegrees, setAllDegrees] = useState<string[]>([]);
  const [internalSelectedDegree, setInternalSelectedDegree] = useState<string | null>(selectedDegree || null);
  const [careerData, setCareerData] = useState<CareerPathData | null>(null);
  const [pathData, setPathData] = useState<CareerPath | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load degrees for network/enhanced modes
  useEffect(() => {
    if (mode === 'network' || mode === 'enhanced') {
      async function loadDegrees() {
        try {
          const degrees = await CareerPathService.getAllDegrees();
          setAllDegrees(degrees);
          if (degrees.length > 0 && !internalSelectedDegree) {
            setInternalSelectedDegree(degrees[0]);
          }
        } catch (err) {
          setError('Failed to load degrees.');
        }
      }
      loadDegrees();
    }
  }, [mode, internalSelectedDegree]);

  // Load career data for network/enhanced modes
  useEffect(() => {
    if ((mode === 'network' || mode === 'enhanced') && internalSelectedDegree) {
      async function loadCareerData() {
        try {
          setLoading(true);
          setError(null);
          setSelectedNode(null);
          const data = await CareerPathService.getCareerPathForDegree(internalSelectedDegree!);
          setCareerData(data);
        } catch (err) {
          setError('Failed to load career path data.');
        } finally {
          setLoading(false);
        }
      }
      loadCareerData();
    }
  }, [mode, internalSelectedDegree]);

  // Load path data for simple mode
  useEffect(() => {
    if (mode === 'simple') {
      async function fetchData() {
        setLoading(true);
        try {
          const data = await CareerService.getLinearCareerPath(pathType);
          setPathData(data);
        } catch (err) {
          setError('Failed to load career path data.');
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [mode, pathType]);

  // Flow diagram visualization
  const renderFlowDiagram = () => {
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const width = dimensions.width;
    const height = dimensions.height;
    
    const stepWidth = 160;
    const stepHeight = 120;
    const spacing = (width - steps.length * stepWidth) / (steps.length + 1);

    // Position steps
    const positionedSteps = steps.map((step, index) => ({
      ...step,
      x: spacing + index * (stepWidth + spacing) + stepWidth / 2,
      y: height / 2
    }));

    // Create connections
    const connections = positionedSteps.slice(0, -1).map((step, index) => ({
      source: step,
      target: positionedSteps[index + 1]
    }));

    // Draw connections
    svg.selectAll(".connection")
      .data(connections)
      .enter()
      .append("line")
      .attr("class", "connection")
      .attr("x1", d => d.source.x! + stepWidth / 2)
      .attr("y1", d => d.source.y!)
      .attr("x2", d => d.target.x! - stepWidth / 2)
      .attr("y2", d => d.target.y!)
      .attr("stroke", "#CBD5E1")
      .attr("stroke-width", 3)
      .attr("stroke-dasharray", "8,4");

    // Draw arrow markers
    svg.append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-10 -5 10 10")
      .attr("refX", -5)
      .attr("refY", 0)
      .attr("markerWidth", 4)
      .attr("markerHeight", 4)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M -10,-5 L 0,0 L -10,5")
      .attr("fill", "#64748B");

    svg.selectAll(".connection")
      .attr("marker-end", "url(#arrowhead)");

    // Draw steps
    const stepGroups = svg.selectAll(".step")
      .data(positionedSteps)
      .enter()
      .append("g")
      .attr("class", "step")
      .attr("transform", d => `translate(${d.x! - stepWidth/2}, ${d.y! - stepHeight/2})`);

    // Step backgrounds
    stepGroups
      .append("rect")
      .attr("width", stepWidth)
      .attr("height", stepHeight)
      .attr("rx", 16)
      .attr("ry", 16)
      .attr("fill", "white")
      .attr("stroke", d => d.color)
      .attr("stroke-width", 2)
      .attr("class", "step-bg")
      .style("cursor", "pointer")
      .on("mouseenter", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 4)
          .attr("fill", d.color)
          .attr("fill-opacity", 0.1);
      })
      .on("mouseleave", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("stroke-width", 2)
          .attr("fill", "white");
      });

    // Step icons
    stepGroups
      .append("circle")
      .attr("cx", stepWidth / 2)
      .attr("cy", 30)
      .attr("r", 20)
      .attr("fill", d => d.color);

    stepGroups
      .append("text")
      .attr("x", stepWidth / 2)
      .attr("y", 36)
      .attr("text-anchor", "middle")
      .attr("fill", "white")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text(d => d.icon);

    // Step titles
    stepGroups
      .append("text")
      .attr("x", stepWidth / 2)
      .attr("y", 70)
      .attr("text-anchor", "middle")
      .attr("fill", "#1F2937")
      .attr("font-weight", "bold")
      .attr("font-size", "14px")
      .text(d => d.title);

    // Step descriptions
    stepGroups
      .append("foreignObject")
      .attr("x", 10)
      .attr("y", 80)
      .attr("width", stepWidth - 20)
      .attr("height", 30)
      .append("xhtml:div")
      .style("font-size", "12px")
      .style("color", "#6B7280")
      .style("text-align", "center")
      .style("line-height", "1.2")
      .text(d => d.description);
  };

  // Network visualization for enhanced/network modes
  const renderNetworkVisualization = () => {
    if (!careerData) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { nodes, links } = careerData;
    const width = dimensions.width;
    const height = dimensions.height;

    // Create force simulation
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links).id((d: any) => d.id).distance(100))
      .force("charge", d3.forceManyBody().strength(-300))
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(40));

    // Create links
    const link = svg.append("g")
      .selectAll("line")
      .data(links)
      .join("line")
      .attr("stroke", "#94A3B8")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", 2);

    // Create nodes
    const node = svg.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on("drag", (event, d: any) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on("end", (event, d: any) => {
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        }));

    // Node circles
    node.append("circle")
      .attr("r", d => Math.max(15, Math.min(25, (d.salary_range || 500000) / 50000)))
      .attr("fill", d => {
        switch(d.category) {
          case 'degree': return '#3B82F6';
          case 'skill': return '#10B981';
          case 'job': return '#F59E0B';
          default: return '#6B7280';
        }
      })
      .attr("stroke", "#fff")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", (event, d) => setHoveredNode(d))
      .on("mouseout", () => setHoveredNode(null))
      .on("click", (event, d) => setSelectedNode(d));

    // Node labels
    node.append("text")
      .text(d => d.title || d.name || 'Unknown')
      .attr("x", 0)
      .attr("y", 35)
      .attr("text-anchor", "middle")
      .attr("font-size", "12px")
      .attr("fill", "#374151");

    // Update positions on simulation tick
    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      node
        .attr("transform", d => `translate(${d.x},${d.y})`);
    });
  };

  // Run visualization based on mode
  useEffect(() => {
    if (mode === 'flow') {
      renderFlowDiagram();
    } else if ((mode === 'network' || mode === 'enhanced') && careerData) {
      renderNetworkVisualization();
    }
  }, [mode, steps, dimensions, careerData]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (svgRef.current) {
        const container = svgRef.current.parentElement;
        if (container) {
          setDimensions({
            width: container.clientWidth,
            height: container.clientHeight || 600
          });
        }
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize(); // Initial call

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Simple mode render
  if (mode === 'simple') {
    if (loading) {
      return (
        <div className={`w-full ${className}`}>
          <div className="w-full bg-white/90 rounded-3xl p-8 text-center">
            <h3 className="text-xl font-bold text-gray-600">Loading Career Path...</h3>
          </div>
        </div>
      );
    }

    if (!pathData) {
      return (
        <div className={`w-full ${className}`}>
          <div className="text-center text-red-500">Could not load career path data.</div>
        </div>
      );
    }

    return (
      <div className={`w-full ${className}`}>
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
              {pathData.title}
            </h3>
            <p className="text-gray-600 text-lg">{pathData.subtitle}</p>
            <button 
              onClick={() => setShowDetails(!showDetails)}
              className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-full text-sm hover:bg-blue-600 transition-colors"
            >
              {showDetails ? "Hide Details" : "Show Timeline Details"}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathData.steps.map((step, index) => (
              <div
                key={step.id}
                className={`relative p-6 rounded-2xl cursor-pointer transition-all duration-300 ${
                  activeStepId === step.id 
                    ? 'bg-blue-50 border-2 border-blue-300 shadow-lg' 
                    : 'bg-white/70 border border-gray-200 hover:shadow-md'
                }`}
                onClick={() => setActiveStepId(activeStepId === step.id ? null : step.id)}
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {index + 1}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h4>
                    <p className="text-gray-600 text-sm mb-3">{step.description}</p>
                    
                    {showDetails && activeStepId === step.id && (
                      <div className="mt-4 p-4 bg-blue-50/50 rounded-lg">
                        <div className="space-y-2 text-sm">
                          {step.duration && (
                            <p><span className="font-medium">Duration:</span> {step.duration}</p>
                          )}
                          {step.requirements && (
                            <p><span className="font-medium">Requirements:</span> {step.requirements}</p>
                          )}
                          {step.outcomes && (
                            <p><span className="font-medium">Outcomes:</span> {step.outcomes}</p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Network/Enhanced/Flow modes
  return (
    <div className={`w-full ${className}`}>
      {title && (
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
        </div>
      )}

      {/* Degree selector for network/enhanced modes */}
      {(mode === 'network' || mode === 'enhanced') && allDegrees.length > 0 && (
        <div className="mb-6 text-center">
          <select
            value={internalSelectedDegree || ''}
            onChange={(e) => setInternalSelectedDegree(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {allDegrees.map(degree => (
              <option key={degree} value={degree}>{degree}</option>
            ))}
          </select>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading visualization...</p>
        </div>
      )}

      {error && (
        <div className="text-center py-8 text-red-500">
          {error}
        </div>
      )}

      {/* SVG Container */}
      <div className="bg-white rounded-lg shadow-lg p-4" style={{ height: '600px' }}>
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          style={{ border: '1px solid #e5e7eb' }}
        />
      </div>

      {/* Node details panel for network modes */}
      {(mode === 'network' || mode === 'enhanced') && (selectedNode || hoveredNode) && (
        <div className="mt-4 p-4 bg-white rounded-lg shadow-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {(selectedNode || hoveredNode)?.title || (selectedNode || hoveredNode)?.name}
          </h3>
          <p className="text-gray-600 mb-2">
            {(selectedNode || hoveredNode)?.description}
          </p>
          {(selectedNode || hoveredNode)?.salary_range && (
            <p className="text-sm text-green-600">
              Salary Range: ₹{((selectedNode || hoveredNode)?.salary_range! / 100000).toFixed(1)} LPA
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CareerVisualization;