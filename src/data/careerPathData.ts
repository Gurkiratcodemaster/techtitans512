// Career path data structure for interactive visualization
import { SimulationNodeDatum, SimulationLinkDatum } from 'd3';

export interface CareerNode extends SimulationNodeDatum {
  id: string;
  name: string;
  type: 'degree' | 'exam' | 'career' | 'specialization';
  description: string;
  requirements?: string[];
  salary?: string;
  duration?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  icon?: string;
}

export interface CareerLink extends SimulationLinkDatum<CareerNode> {
  source: string | CareerNode;
  target: string | CareerNode;
  type: 'requires' | 'leads_to' | 'optional';
  description?: string;
}

export interface CareerPathData {
  nodes: CareerNode[];
  links: CareerLink[];
}

export const careerPathData: CareerPathData = {
  nodes: [
    // Degrees
    {
      id: "btech-cs",
      name: "B.Tech Computer Science",
      type: "degree",
      description: "Bachelor of Technology in Computer Science & Engineering",
      duration: "4 years",
      difficulty: "Medium",
      icon: "💻"
    },
    {
      id: "btech-ece",
      name: "B.Tech Electronics",
      type: "degree",
      description: "Bachelor of Technology in Electronics & Communication",
      duration: "4 years", 
      difficulty: "Medium",
      icon: "⚡"
    },
    {
      id: "bsc-data-science",
      name: "B.Sc Data Science",
      type: "degree",
      description: "Bachelor of Science in Data Science",
      duration: "3 years",
      difficulty: "Medium",
      icon: "📊"
    },
    {
      id: "bca",
      name: "BCA",
      type: "degree",
      description: "Bachelor of Computer Applications",
      duration: "3 years",
      difficulty: "Easy",
      icon: "💼"
    },
    {
      id: "btech-mech",
      name: "B.Tech Mechanical",
      type: "degree",
      description: "Bachelor of Technology in Mechanical Engineering",
      duration: "4 years",
      difficulty: "Hard",
      icon: "⚙️"
    },
    {
      id: "btech-civil",
      name: "B.Tech Civil",
      type: "degree",
      description: "Bachelor of Technology in Civil Engineering",
      duration: "4 years",
      difficulty: "Medium",
      icon: "🏗️"
    },

    // Entrance Exams
    {
      id: "jee-main",
      name: "JEE Main",
      type: "exam",
      description: "Joint Entrance Examination for Engineering",
      difficulty: "Hard",
      icon: "📝"
    },
    {
      id: "jee-advanced",
      name: "JEE Advanced",
      type: "exam",
      description: "Advanced level exam for IIT admission",
      difficulty: "Hard",
      icon: "🎯"
    },
    {
      id: "bitsat",
      name: "BITSAT",
      type: "exam",
      description: "Birla Institute of Technology and Science Admission Test",
      difficulty: "Medium",
      icon: "✏️"
    },
    {
      id: "cucet",
      name: "CUCET",
      type: "exam",
      description: "Central Universities Common Entrance Test",
      difficulty: "Medium",
      icon: "📋"
    },

    // Specializations
    {
      id: "ai-ml",
      name: "AI & Machine Learning",
      type: "specialization",
      description: "Artificial Intelligence and Machine Learning",
      icon: "🤖"
    },
    {
      id: "cyber-security",
      name: "Cyber Security",
      type: "specialization", 
      description: "Information Security and Ethical Hacking",
      icon: "🔒"
    },
    {
      id: "web-dev",
      name: "Web Development",
      type: "specialization",
      description: "Full Stack Web Development",
      icon: "🌐"
    },
    {
      id: "mobile-dev",
      name: "Mobile Development",
      type: "specialization",
      description: "iOS and Android App Development",
      icon: "📱"
    },
    {
      id: "embedded-systems",
      name: "Embedded Systems",
      type: "specialization",
      description: "IoT and Embedded System Design",
      icon: "🔧"
    },
    {
      id: "vlsi-design",
      name: "VLSI Design",
      type: "specialization",
      description: "Very Large Scale Integration",
      icon: "⚡"
    },

    // Career Paths
    {
      id: "software-engineer",
      name: "Software Engineer",
      type: "career",
      description: "Design and develop software applications",
      salary: "₹4-15 LPA",
      icon: "👨‍💻"
    },
    {
      id: "data-scientist",
      name: "Data Scientist",
      type: "career",
      description: "Analyze complex data to help companies make decisions",
      salary: "₹6-20 LPA",
      icon: "📈"
    },
    {
      id: "ai-engineer",
      name: "AI Engineer",
      type: "career",
      description: "Develop AI and ML solutions",
      salary: "₹8-25 LPA",
      icon: "🧠"
    },
    {
      id: "cybersecurity-analyst",
      name: "Cybersecurity Analyst",
      type: "career",
      description: "Protect organizations from cyber threats",
      salary: "₹5-18 LPA",
      icon: "🛡️"
    },
    {
      id: "mobile-developer",
      name: "Mobile App Developer",
      type: "career",
      description: "Create mobile applications for iOS and Android",
      salary: "₹4-12 LPA",
      icon: "📲"
    },
    {
      id: "hardware-engineer",
      name: "Hardware Engineer",
      type: "career",
      description: "Design and develop computer hardware",
      salary: "₹5-15 LPA",
      icon: "🔩"
    },
    {
      id: "civil-engineer",
      name: "Civil Engineer",
      type: "career",
      description: "Design and supervise construction projects",
      salary: "₹3-12 LPA",
      icon: "🏢"
    },
    {
      id: "mechanical-engineer",
      name: "Mechanical Engineer",
      type: "career",
      description: "Design and develop mechanical systems",
      salary: "₹4-14 LPA",
      icon: "⚙️"
    }
  ],

  links: [
    // Exam to Degree connections
    { source: "jee-main", target: "btech-cs", type: "leads_to" },
    { source: "jee-main", target: "btech-ece", type: "leads_to" },
    { source: "jee-main", target: "btech-mech", type: "leads_to" },
    { source: "jee-main", target: "btech-civil", type: "leads_to" },
    { source: "jee-advanced", target: "btech-cs", type: "leads_to" },
    { source: "bitsat", target: "btech-cs", type: "leads_to" },
    { source: "bitsat", target: "btech-ece", type: "leads_to" },
    { source: "cucet", target: "bca", type: "leads_to" },
    { source: "cucet", target: "bsc-data-science", type: "leads_to" },

    // Degree to Specialization connections
    { source: "btech-cs", target: "ai-ml", type: "leads_to" },
    { source: "btech-cs", target: "cyber-security", type: "leads_to" },
    { source: "btech-cs", target: "web-dev", type: "leads_to" },
    { source: "btech-cs", target: "mobile-dev", type: "leads_to" },
    { source: "btech-ece", target: "embedded-systems", type: "leads_to" },
    { source: "btech-ece", target: "vlsi-design", type: "leads_to" },
    { source: "bca", target: "web-dev", type: "leads_to" },
    { source: "bca", target: "mobile-dev", type: "leads_to" },
    { source: "bsc-data-science", target: "ai-ml", type: "leads_to" },

    // Specialization to Career connections
    { source: "ai-ml", target: "ai-engineer", type: "leads_to" },
    { source: "ai-ml", target: "data-scientist", type: "leads_to" },
    { source: "cyber-security", target: "cybersecurity-analyst", type: "leads_to" },
    { source: "web-dev", target: "software-engineer", type: "leads_to" },
    { source: "mobile-dev", target: "mobile-developer", type: "leads_to" },
    { source: "embedded-systems", target: "hardware-engineer", type: "leads_to" },
    { source: "vlsi-design", target: "hardware-engineer", type: "leads_to" },

    // Direct Degree to Career connections
    { source: "btech-cs", target: "software-engineer", type: "leads_to" },
    { source: "btech-ece", target: "hardware-engineer", type: "leads_to" },
    { source: "btech-civil", target: "civil-engineer", type: "leads_to" },
    { source: "btech-mech", target: "mechanical-engineer", type: "leads_to" },
    { source: "bca", target: "software-engineer", type: "leads_to" },
    { source: "bsc-data-science", target: "data-scientist", type: "leads_to" }
  ]
};

// Helper functions
export const getNodesByType = (type: CareerNode['type']) => {
  return careerPathData.nodes.filter(node => node.type === type);
};

export const getConnectedNodes = (nodeId: string, direction: 'in' | 'out' | 'both' = 'both') => {
  const connections: CareerNode[] = [];
  
  careerPathData.links.forEach(link => {
    if (direction === 'out' && link.source === nodeId) {
      const targetNode = careerPathData.nodes.find(n => n.id === link.target);
      if (targetNode) connections.push(targetNode);
    }
    if (direction === 'in' && link.target === nodeId) {
      const sourceNode = careerPathData.nodes.find(n => n.id === link.source);
      if (sourceNode) connections.push(sourceNode);
    }
    if (direction === 'both') {
      if (link.source === nodeId) {
        const targetNode = careerPathData.nodes.find(n => n.id === link.target);
        if (targetNode) connections.push(targetNode);
      }
      if (link.target === nodeId) {
        const sourceNode = careerPathData.nodes.find(n => n.id === link.source);
        if (sourceNode) connections.push(sourceNode);
      }
    }
  });
  
  return connections;
};

export const filterDataByDegrees = (recommendedDegrees: string[]): CareerPathData => {
  // Map degree names to IDs
  const degreeNameToId: Record<string, string> = {
    "B.Tech Computer Science": "btech-cs",
    "B.Tech Electronics": "btech-ece", 
    "B.Sc Data Science": "bsc-data-science",
    "BCA": "bca",
    "B.Tech Mechanical": "btech-mech",
    "B.Tech Civil": "btech-civil"
  };

  const relevantDegreeIds = recommendedDegrees
    .map(degree => degreeNameToId[degree])
    .filter(Boolean);

  // Get all nodes and links connected to recommended degrees
  const relevantNodeIds = new Set<string>();
  const relevantLinks: CareerLink[] = [];

  // Add recommended degrees
  relevantDegreeIds.forEach(id => relevantNodeIds.add(id));

  // Add connected nodes and links
  careerPathData.links.forEach(link => {
    const getSourceId = (source: string | CareerNode): string => 
      typeof source === 'string' ? source : source.id;
    const getTargetId = (target: string | CareerNode): string => 
      typeof target === 'string' ? target : target.id;
    
    const sourceId = getSourceId(link.source);
    const targetId = getTargetId(link.target);
    
    const sourceRelevant = relevantDegreeIds.includes(sourceId) || relevantNodeIds.has(sourceId);
    const targetRelevant = relevantDegreeIds.includes(targetId) || relevantNodeIds.has(targetId);
    
    if (sourceRelevant || targetRelevant) {
      relevantNodeIds.add(sourceId);
      relevantNodeIds.add(targetId);
      relevantLinks.push(link);
    }
  });

  const relevantNodes = careerPathData.nodes.filter(node => relevantNodeIds.has(node.id));

  return {
    nodes: relevantNodes,
    links: relevantLinks
  };
};