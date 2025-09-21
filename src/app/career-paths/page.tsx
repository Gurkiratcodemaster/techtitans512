"use client";
import { useState, useEffect, useRef } from "react";
import { Navbar } from "@/components/navbar";
import CornerChatbot from "@/components/CornerChatbot";
import * as d3 from "d3";

interface CareerPath {
  id: string;
  degree: string;
  description: string;
  duration: string;
  jobs: string[];
  higherStudies: string[];
  industries: string[];
  governmentExams: string[];
  averageSalary: string;
}

export default function CareerPathsPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<CareerPath | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const careerPathsData: CareerPath[] = [
    {
      id: "ba",
      degree: "Bachelor of Arts (B.A.)",
      description: "A versatile degree focusing on humanities, social sciences, and liberal arts.",
      duration: "3 years",
      jobs: ["Content Writer", "Journalist", "Teacher", "Civil Services Officer", "HR Executive", "Social Worker"],
      higherStudies: ["M.A.", "MBA", "M.Ed.", "LLB", "Mass Communication", "Social Work"],
      industries: ["Media", "Education", "Government", "NGOs", "Corporate HR"],
      governmentExams: ["UPSC", "SSC", "Banking", "Teaching Eligibility Test"],
      averageSalary: "₹2.5 - 8 LPA"
    },
    {
      id: "bsc",
      degree: "Bachelor of Science (B.Sc.)",
      description: "Science-focused degree with specializations in various scientific fields.",
      duration: "3 years",
      jobs: ["Research Scientist", "Lab Technician", "Data Analyst", "Quality Control Analyst", "Environmental Consultant"],
      higherStudies: ["M.Sc.", "M.Tech", "MBA", "B.Ed.", "Research Programs"],
      industries: ["Healthcare", "Pharmaceuticals", "Research Labs", "IT", "Environmental"],
      governmentExams: ["CSIR-NET", "GATE", "Banking", "SSC Scientific Assistant"],
      averageSalary: "₹3 - 10 LPA"
    },
    {
      id: "bcom",
      degree: "Bachelor of Commerce (B.Com.)",
      description: "Commerce and business-focused degree covering accounting, finance, and economics.",
      duration: "3 years",
      jobs: ["Accountant", "Financial Analyst", "Banking Officer", "Tax Consultant", "Auditor", "Business Analyst"],
      higherStudies: ["M.Com.", "MBA", "CA", "CS", "CMA", "CFA"],
      industries: ["Banking", "Finance", "Accounting Firms", "Corporate", "Consulting"],
      governmentExams: ["Banking", "SSC", "Income Tax", "RBI"],
      averageSalary: "₹3 - 12 LPA"
    },
    {
      id: "bba",
      degree: "Bachelor of Business Administration (BBA)",
      description: "Management-focused degree covering all aspects of business administration.",
      duration: "3 years",
      jobs: ["Business Analyst", "Marketing Executive", "HR Coordinator", "Operations Manager", "Sales Manager"],
      higherStudies: ["MBA", "PGDM", "M.Com.", "Specialized Management Programs"],
      industries: ["Corporate", "Consulting", "Marketing", "Sales", "Operations"],
      governmentExams: ["Management Trainee", "Banking", "PSU"],
      averageSalary: "₹3.5 - 10 LPA"
    },
    {
      id: "btech",
      degree: "Bachelor of Technology (B.Tech)",
      description: "Engineering degree with specializations in various technical fields.",
      duration: "4 years",
      jobs: ["Software Engineer", "Data Scientist", "Project Manager", "System Analyst", "Technical Consultant"],
      higherStudies: ["M.Tech", "MBA", "MS", "Ph.D.", "Specialized Certifications"],
      industries: ["IT", "Software", "Manufacturing", "Telecommunications", "Consulting"],
      governmentExams: ["GATE", "PSU", "ESE", "SSC JE"],
      averageSalary: "₹4 - 25 LPA"
    },
    {
      id: "mbbs",
      degree: "Bachelor of Medicine (MBBS)",
      description: "Medical degree for becoming a qualified doctor.",
      duration: "5.5 years",
      jobs: ["General Practitioner", "Medical Officer", "Hospital Doctor", "Consultant", "Medical Researcher"],
      higherStudies: ["MD", "MS", "Diploma Courses", "Fellowship Programs"],
      industries: ["Healthcare", "Hospitals", "Research", "Pharmaceuticals", "Public Health"],
      governmentExams: ["NEET PG", "AIIMS", "Medical Services"],
      averageSalary: "₹5 - 20+ LPA"
    }
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
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

    // Create nodes and links data
    const nodes = [
      { id: selectedDegree.degree, category: "degree" },
      ...selectedDegree.jobs.map(job => ({ id: job, category: "job" })),
      ...selectedDegree.higherStudies.map(study => ({ id: study, category: "study" }))
    ];

    const links = [
      ...selectedDegree.jobs.map(job => ({
        source: selectedDegree.degree,
        target: job,
        value: 1
      })),
      ...selectedDegree.higherStudies.map(study => ({
        source: selectedDegree.degree,
        target: study,
        value: 1
      }))
    ];

    // Set up the diagram
    svg.attr("width", width).attr("height", height);

    // Create three columns for layout
    const degreeX = margin.left + 50;
    const jobsX = width / 2 - 100;
    const studiesX = width - margin.right - 150;

    // Position nodes
    nodes.forEach((node, i) => {
      if (node.category === "degree") {
        node.x = degreeX;
        node.y = height / 2;
      } else if (node.category === "job") {
        const jobIndex = selectedDegree.jobs.indexOf(node.id);
        node.x = jobsX;
        node.y = margin.top + 50 + (jobIndex * (height - 100) / selectedDegree.jobs.length);
      } else if (node.category === "study") {
        const studyIndex = selectedDegree.higherStudies.indexOf(node.id);
        node.x = studiesX;
        node.y = margin.top + 50 + (studyIndex * (height - 100) / selectedDegree.higherStudies.length);
      }
    });

    // Create links
    const linkGroup = svg.append("g").attr("class", "links");

    links.forEach(link => {
      const sourceNode = nodes.find(n => n.id === link.source);
      const targetNode = nodes.find(n => n.id === link.target);
      
      if (sourceNode && targetNode) {
        const path = linkGroup.append("path")
          .attr("class", "link")
          .attr("d", () => {
            const x1 = sourceNode.x + 100;
            const y1 = sourceNode.y;
            const x2 = targetNode.x - 10;
            const y2 = targetNode.y;
            const cx = (x1 + x2) / 2;
            
            return `M${x1},${y1} C${cx},${y1} ${cx},${y2} ${x2},${y2}`;
          })
          .style("fill", "none")
          .style("stroke", targetNode.category === "job" ? "#10B981" : "#3B82F6")
          .style("stroke-width", 2)
          .style("stroke-opacity", 0.6);
      }
    });

    // Create nodes
    const nodeGroup = svg.append("g").attr("class", "nodes");

    nodes.forEach(node => {
      const g = nodeGroup.append("g")
        .attr("transform", `translate(${node.x}, ${node.y})`);

      // Node background
      g.append("rect")
        .attr("width", node.category === "degree" ? 200 : 180)
        .attr("height", 40)
        .attr("rx", 8)
        .attr("ry", 8)
        .style("fill", 
          node.category === "degree" ? "#1E40AF" : 
          node.category === "job" ? "#059669" : "#7C3AED"
        )
        .style("cursor", "pointer")
        .on("click", () => handleNodeClick(node.id, node.category));

      // Node text
      g.append("text")
        .attr("x", node.category === "degree" ? 100 : 90)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .attr("dominant-baseline", "middle")
        .style("fill", "white")
        .style("font-size", "12px")
        .style("font-weight", "500")
        .style("cursor", "pointer")
        .text(node.id.length > 20 ? node.id.substring(0, 18) + "..." : node.id)
        .on("click", () => handleNodeClick(node.id, node.category));
    });

    // Add legend
    const legend = svg.append("g")
      .attr("transform", `translate(${margin.left}, ${height - 80})`);

    const legendData = [
      { color: "#1E40AF", label: "Degree" },
      { color: "#059669", label: "Career Options" },
      { color: "#7C3AED", label: "Higher Studies" }
    ];

    legendData.forEach((item, i) => {
      const g = legend.append("g")
        .attr("transform", `translate(${i * 120}, 0)`);
      
      g.append("rect")
        .attr("width", 15)
        .attr("height", 15)
        .style("fill", item.color);
      
      g.append("text")
        .attr("x", 20)
        .attr("y", 12)
        .style("font-size", "12px")
        .text(item.label);
    });
  };

  const handleNodeClick = (nodeId: string, category: string) => {
    setSelectedNode(nodeId);
    if (category === "job" || category === "study") {
      setShowChatbot(true);
    }
  };

  const handleDegreeSelect = (degree: CareerPath) => {
    setSelectedDegree(degree);
    setSelectedNode(null);
    setShowChatbot(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className={`text-center mb-8 transform transition-all duration-500 delay-100 ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Career <span className="text-blue-600">Path Mapping</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore what each degree can lead to - from career opportunities to higher education pathways.
            </p>
          </div>

          {/* Degree Selection */}
          <div className={`mb-8 transform transition-all duration-500 delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Select a Degree to Explore</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {careerPathsData.map((degree) => (
                <button
                  key={degree.id}
                  onClick={() => handleDegreeSelect(degree)}
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
          </div>

          {/* Visualization */}
          {selectedDegree && (
            <div className={`transform transition-all duration-500 delay-300 ${
              loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
            }`}>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  Career Path for {selectedDegree.degree}
                </h2>
                <p className="text-gray-600 mb-6 text-center">
                  Click on any career option or higher study to get AI guidance
                </p>
                
                <div className="flex justify-center">
                  <svg ref={svgRef} className="border rounded-lg bg-white shadow-inner"></svg>
                </div>
              </div>

              {/* Detailed Information */}
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Degree Details</h3>
                  <div className="space-y-3">
                    <div>
                      <span className="font-semibold text-gray-700">Duration:</span>
                      <span className="ml-2 text-gray-600">{selectedDegree.duration}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Average Salary:</span>
                      <span className="ml-2 text-gray-600">{selectedDegree.averageSalary}</span>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Industries:</span>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {selectedDegree.industries.map(industry => (
                          <span key={industry} className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                            {industry}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Government Exams</h3>
                  <div className="space-y-2">
                    {selectedDegree.governmentExams.map(exam => (
                      <div key={exam} className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                        <span className="text-gray-700">{exam}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Corner Chatbot */}
      <CornerChatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        initialMessage={selectedNode ? `Tell me more about career opportunities in ${selectedNode}` : "Hi! I can help you understand career paths and opportunities. What would you like to know?"}
        context={selectedNode ? `Career path context: ${selectedNode}` : "Career path mapping and guidance"}
      />
    </div>
  );
}