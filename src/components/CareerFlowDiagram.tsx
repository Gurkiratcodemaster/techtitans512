"use client";
import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface FlowStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  x?: number;
  y?: number;
}

interface CareerFlowDiagramProps {
  steps?: FlowStep[];
  title?: string;
  className?: string;
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
    title: "Dream Career",
    description: "Land your ideal job",
    icon: "CR",
    color: "#3B82F6"
  }
];

const CareerFlowDiagram: React.FC<CareerFlowDiagramProps> = ({ 
  steps = defaultSteps, 
  title = "Your Career Journey",
  className = ""
}) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [activeStep, setActiveStep] = useState<string | null>(null);
  const [dimensions, setDimensions] = useState({ width: 800, height: 300 });

  useEffect(() => {
    const handleResize = () => {
      const container = svgRef.current?.parentElement;
      if (container) {
        setDimensions({
          width: Math.max(container.clientWidth, 600),
          height: 300
        });
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!svgRef.current || steps.length === 0) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const stepWidth = (width - 100) / steps.length;
    const centerY = height / 2;

    // Create beautiful background gradient
    const defs = svg.append("defs");
    
    const bgGradient = defs.append("linearGradient")
      .attr("id", "flow-background")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "100%");
    
    bgGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#faf7ff")
      .attr("stop-opacity", 0.8);
    
    bgGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#f0f9ff")
      .attr("stop-opacity", 0.8);

    // Add background
    svg.append("rect")
      .attr("width", width)
      .attr("height", height)
      .attr("fill", "url(#flow-background)")
      .attr("rx", 20);

    // Create gradients and filters for each step
    steps.forEach((step, index) => {
      // Gradient for the step
      const gradient = defs.append("radialGradient")
        .attr("id", `step-gradient-${index}`)
        .attr("cx", "30%")
        .attr("cy", "30%")
        .attr("r", "70%");
      
      gradient.append("stop")
        .attr("offset", "0%")
        .attr("stop-color", d3.color(step.color)?.brighter(0.5)?.toString() || step.color);
      
      gradient.append("stop")
        .attr("offset", "100%")
        .attr("stop-color", step.color);

      // Glow filter
      const filter = defs.append("filter")
        .attr("id", `step-glow-${index}`)
        .attr("x", "-50%")
        .attr("y", "-50%")
        .attr("width", "200%")
        .attr("height", "200%");

      filter.append("feGaussianBlur")
        .attr("stdDeviation", "8")
        .attr("result", "coloredBlur");

      const feMerge = filter.append("feMerge");
      feMerge.append("feMergeNode").attr("in", "coloredBlur");
      feMerge.append("feMergeNode").attr("in", "SourceGraphic");
    });

    // Position steps
    const stepData = steps.map((step, index) => ({
      ...step,
      x: 50 + (stepWidth * index) + (stepWidth / 2),
      y: centerY
    }));

    // Draw connecting paths
    for (let i = 0; i < stepData.length - 1; i++) {
      const current = stepData[i];
      const next = stepData[i + 1];
      
      svg.append("path")
        .attr("d", `M${current.x + 35},${current.y} Q${current.x + stepWidth/2},${current.y - 30} ${next.x - 35},${next.y}`)
        .attr("stroke", "url(#connection-gradient)")
        .attr("stroke-width", 4)
        .attr("fill", "none")
        .attr("opacity", 0.6)
        .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");
    }

    // Connection gradient
    const connectionGradient = defs.append("linearGradient")
      .attr("id", "connection-gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "100%")
      .attr("y2", "0%");
    
    connectionGradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#A855F7");
    
    connectionGradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#3B82F6");

    // Draw floating particles
    const particles = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 2 + 1,
      speed: Math.random() * 0.5 + 0.2
    }));

    particles.forEach(particle => {
      svg.append("circle")
        .attr("r", particle.size)
        .attr("fill", "#C084FC")
        .attr("opacity", 0.4)
        .attr("cx", particle.x)
        .attr("cy", particle.y)
        .transition()
        .duration(10000)
        .ease(d3.easeLinear)
        .attr("cx", particle.x + (particle.speed * 100))
        .attr("cy", particle.y + Math.sin(particle.x * 0.01) * 20)
        .on("end", function() {
          d3.select(this).attr("cx", 0).transition().duration(10000).attr("cx", width);
        });
    });

    // Create step groups
    const stepGroups = svg.selectAll(".step-group")
      .data(stepData)
      .enter()
      .append("g")
      .attr("class", "step-group")
      .attr("transform", (d, i) => `translate(${d.x}, ${d.y})`)
      .style("cursor", "pointer")
      .on("mouseenter", handleStepHover)
      .on("mouseleave", handleStepLeave)
      .on("click", handleStepClick);

    // Add step circles with glow
    stepGroups.append("circle")
      .attr("r", 45)
      .attr("fill", (d, i) => `url(#step-gradient-${i})`)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 4)
      .style("filter", (d, i) => `url(#step-glow-${i})`)
      .style("drop-shadow", "0 8px 16px rgba(0,0,0,0.15)");

    // Add inner circle for icon
    stepGroups.append("circle")
      .attr("r", 25)
      .attr("fill", "rgba(255,255,255,0.9)")
      .attr("stroke", "rgba(255,255,255,0.5)")
      .attr("stroke-width", 2);

    // Add icons
    stepGroups.append("text")
      .text(d => d.icon)
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("font-size", "24px")
      .style("pointer-events", "none");

    // Add step numbers
    stepGroups.append("circle")
      .attr("r", 12)
      .attr("fill", (d, i) => d.color)
      .attr("cy", -55)
      .attr("stroke", "#ffffff")
      .attr("stroke-width", 2);

    stepGroups.append("text")
      .text((d, i) => i + 1)
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("cy", -55)
      .attr("font-size", "12px")
      .attr("font-weight", "bold")
      .attr("fill", "#ffffff")
      .style("pointer-events", "none");

    // Add titles with background
    const titleGroup = stepGroups.append("g")
      .attr("transform", "translate(0, 70)");

    titleGroup.append("rect")
      .attr("x", d => -(d.title.length * 6))
      .attr("y", -15)
      .attr("width", d => d.title.length * 12)
      .attr("height", 25)
      .attr("rx", 12)
      .attr("fill", "rgba(255,255,255,0.95)")
      .attr("stroke", "rgba(0,0,0,0.1)")
      .attr("stroke-width", 1)
      .style("filter", "drop-shadow(0 2px 4px rgba(0,0,0,0.1))");

    titleGroup.append("text")
      .text(d => d.title)
      .attr("text-anchor", "middle")
      .attr("dy", "0.1em")
      .attr("font-size", "14px")
      .attr("font-weight", "600")
      .attr("fill", "#374151")
      .style("pointer-events", "none");

    // Animate steps on load
    stepGroups.style("opacity", 0)
      .style("transform", (d, i) => `translate(${d.x}, ${d.y}) scale(0)`)
      .transition()
      .duration(800)
      .delay((d, i) => i * 200)
      .ease(d3.easeElasticOut)
      .style("opacity", 1)
      .style("transform", (d, i) => `translate(${d.x}, ${d.y}) scale(1)`);

    function handleStepHover(event: any, d: FlowStep) {
      setActiveStep(d.id);
      
      d3.select(event.currentTarget).select("circle:first-child")
        .transition()
        .duration(200)
        .attr("r", 50)
        .style("filter", (d, i) => `url(#step-glow-${i})`);
    }

    function handleStepLeave(event: any, d: FlowStep) {
      if (activeStep === d.id) {
        setActiveStep(null);
      }
      
      d3.select(event.currentTarget).select("circle:first-child")
        .transition()
        .duration(200)
        .attr("r", 45);
    }

    function handleStepClick(event: any, d: FlowStep) {
      setActiveStep(activeStep === d.id ? null : d.id);
      
      // Bounce animation
      d3.select(event.currentTarget)
        .transition()
        .duration(200)
        .ease(d3.easeBounceOut)
        .style("transform", () => `translate(${d.x}, ${d.y}) scale(1.1)`)
        .transition()
        .duration(200)
        .style("transform", () => `translate(${d.x}, ${d.y}) scale(1)`);
    }

  }, [dimensions, steps, activeStep]);

  const activeStepData = steps.find(step => step.id === activeStep);

  return (
    <div className={`w-full ${className}`}>
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/20">
        {/* Header */}
        <div className="text-center mb-8">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
            {title}
          </h3>
          <p className="text-gray-600">
            Follow these steps to reach your career goals
          </p>
        </div>

        {/* Flow Diagram */}
        <div className="relative w-full overflow-hidden rounded-2xl">
          <svg
            ref={svgRef}
            width={dimensions.width}
            height={dimensions.height}
            className="w-full h-full"
          />
        </div>

        {/* Step Details */}
        {activeStepData && (
          <div className="mt-6 p-6 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl border border-blue-200">
            <div className="flex items-center mb-4">
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4 shadow-lg"
                style={{ backgroundColor: activeStepData.color }}
              >
                {activeStepData.icon}
              </div>
              <div>
                <h4 className="text-xl font-bold text-gray-800">{activeStepData.title}</h4>
                <p className="text-gray-600">{activeStepData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Instructions */}
        <div className="mt-4 text-center text-sm text-gray-500">
          Click on any step to learn more about it
        </div>
      </div>
    </div>
  );
};

export default CareerFlowDiagram;