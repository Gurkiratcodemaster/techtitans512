import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Career Path Data (from previous data file)
const careerPathData = {
  nodes: [
    // Degrees
    { id: "btech-cs", name: "B.Tech Computer Science", type: "degree", description: "Bachelor of Technology in Computer Science & Engineering", duration: "4 years", difficulty: "Medium", icon: "💻" },
    { id: "btech-ece", name: "B.Tech Electronics", type: "degree", description: "Bachelor of Technology in Electronics & Communication", duration: "4 years", difficulty: "Medium", icon: "⚡" },
    { id: "bsc-data-science", name: "B.Sc Data Science", type: "degree", description: "Bachelor of Science in Data Science", duration: "3 years", difficulty: "Medium", icon: "📊" },
    { id: "bca", name: "BCA", type: "degree", description: "Bachelor of Computer Applications", duration: "3 years", difficulty: "Easy", icon: "💼" },
    { id: "btech-mech", name: "B.Tech Mechanical", type: "degree", description: "Bachelor of Technology in Mechanical Engineering", duration: "4 years", difficulty: "Hard", icon: "⚙️" },
    { id: "btech-civil", name: "B.Tech Civil", type: "degree", description: "Bachelor of Technology in Civil Engineering", duration: "4 years", difficulty: "Medium", icon: "🏗️" },

    // Entrance Exams
    { id: "jee-main", name: "JEE Main", type: "exam", description: "Joint Entrance Examination for Engineering", difficulty: "Hard", icon: "📝" },
    { id: "jee-advanced", name: "JEE Advanced", type: "exam", description: "Advanced level exam for IIT admission", difficulty: "Hard", icon: "🎯" },
    { id: "bitsat", name: "BITSAT", type: "exam", description: "Birla Institute of Technology and Science Admission Test", difficulty: "Medium", icon: "✏️" },
    { id: "cucet", name: "CUCET", type: "exam", description: "Central Universities Common Entrance Test", difficulty: "Medium", icon: "📋" },

    // Specializations
    { id: "ai-ml", name: "AI & Machine Learning", type: "specialization", description: "Artificial Intelligence and Machine Learning", icon: "🤖" },
    { id: "cyber-security", name: "Cyber Security", type: "specialization", description: "Information Security and Ethical Hacking", icon: "🔒" },
    { id: "web-dev", name: "Web Development", type: "specialization", description: "Full Stack Web Development", icon: "🌐" },
    { id: "mobile-dev", name: "Mobile Development", type: "specialization", description: "iOS and Android App Development", icon: "📱" },
    { id: "embedded-systems", name: "Embedded Systems", type: "specialization", description: "IoT and Embedded System Design", icon: "🔧" },
    { id: "vlsi-design", name: "VLSI Design", type: "specialization", description: "Very Large Scale Integration", icon: "⚡" },

    // Career Paths
    { id: "software-engineer", name: "Software Engineer", type: "career", description: "Design and develop software applications", salary: "₹4-15 LPA", icon: "👨‍💻" },
    { id: "data-scientist", name: "Data Scientist", type: "career", description: "Analyze complex data to help companies make decisions", salary: "₹6-20 LPA", icon: "📈" },
    { id: "ai-engineer", name: "AI Engineer", type: "career", description: "Develop AI and ML solutions", salary: "₹8-25 LPA", icon: "🧠" },
    { id: "cybersecurity-analyst", name: "Cybersecurity Analyst", type: "career", description: "Protect organizations from cyber threats", salary: "₹5-18 LPA", icon: "🛡️" },
    { id: "mobile-developer", name: "Mobile App Developer", type: "career", description: "Create mobile applications for iOS and Android", salary: "₹4-12 LPA", icon: "📲" },
    { id: "hardware-engineer", name: "Hardware Engineer", type: "career", description: "Design and develop computer hardware", salary: "₹5-15 LPA", icon: "🔩" },
    { id: "civil-engineer", name: "Civil Engineer", type: "career", description: "Design and supervise construction projects", salary: "₹3-12 LPA", icon: "🏢" },
    { id: "mechanical-engineer", name: "Mechanical Engineer", type: "career", description: "Design and develop mechanical systems", salary: "₹4-14 LPA", icon: "⚙️" }
  ],
  links: [
    // Exam to Degree connections
    { id: "link_1", source_id: "jee-main", target_id: "btech-cs", type: "leads_to" },
    { id: "link_2", source_id: "jee-main", target_id: "btech-ece", type: "leads_to" },
    { id: "link_3", source_id: "jee-main", target_id: "btech-mech", type: "leads_to" },
    { id: "link_4", source_id: "jee-main", target_id: "btech-civil", type: "leads_to" },
    { id: "link_5", source_id: "jee-advanced", target_id: "btech-cs", type: "leads_to" },
    { id: "link_6", source_id: "bitsat", target_id: "btech-cs", type: "leads_to" },
    { id: "link_7", source_id: "bitsat", target_id: "btech-ece", type: "leads_to" },
    { id: "link_8", source_id: "cucet", target_id: "bca", type: "leads_to" },
    { id: "link_9", source_id: "cucet", target_id: "bsc-data-science", type: "leads_to" },

    // Degree to Specialization connections
    { id: "link_10", source_id: "btech-cs", target_id: "ai-ml", type: "leads_to" },
    { id: "link_11", source_id: "btech-cs", target_id: "cyber-security", type: "leads_to" },
    { id: "link_12", source_id: "btech-cs", target_id: "web-dev", type: "leads_to" },
    { id: "link_13", source_id: "btech-cs", target_id: "mobile-dev", type: "leads_to" },
    { id: "link_14", source_id: "btech-ece", target_id: "embedded-systems", type: "leads_to" },
    { id: "link_15", source_id: "btech-ece", target_id: "vlsi-design", type: "leads_to" },
    { id: "link_16", source_id: "bca", target_id: "web-dev", type: "leads_to" },
    { id: "link_17", source_id: "bca", target_id: "mobile-dev", type: "leads_to" },
    { id: "link_18", source_id: "bsc-data-science", target_id: "ai-ml", type: "leads_to" },

    // Specialization to Career connections
    { id: "link_19", source_id: "ai-ml", target_id: "ai-engineer", type: "leads_to" },
    { id: "link_20", source_id: "ai-ml", target_id: "data-scientist", type: "leads_to" },
    { id: "link_21", source_id: "cyber-security", target_id: "cybersecurity-analyst", type: "leads_to" },
    { id: "link_22", source_id: "web-dev", target_id: "software-engineer", type: "leads_to" },
    { id: "link_23", source_id: "mobile-dev", target_id: "mobile-developer", type: "leads_to" },
    { id: "link_24", source_id: "embedded-systems", target_id: "hardware-engineer", type: "leads_to" },
    { id: "link_25", source_id: "vlsi-design", target_id: "hardware-engineer", type: "leads_to" },

    // Direct Degree to Career connections
    { id: "link_26", source_id: "btech-cs", target_id: "software-engineer", type: "leads_to" },
    { id: "link_27", source_id: "btech-ece", target_id: "hardware-engineer", type: "leads_to" },
    { id: "link_28", source_id: "btech-civil", target_id: "civil-engineer", type: "leads_to" },
    { id: "link_29", source_id: "btech-mech", target_id: "mechanical-engineer", type: "leads_to" },
    { id: "link_30", source_id: "bca", target_id: "software-engineer", type: "leads_to" },
    { id: "link_31", source_id: "bsc-data-science", target_id: "data-scientist", type: "leads_to" }
  ]
};

// Colleges Data (extracted from colleges page)
const collegesData = [
  { id: "1", name: "University of Jammu", location: "Jammu", state: "Jammu and Kashmir", type: "Government", courses: ["B.A.", "B.Sc.", "B.Com.", "BBA", "BCA", "M.A.", "M.Sc.", "MBA"], cutoff: { general: 85, obc: 80, sc: 75, st: 70 }, facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports Complex", "Canteen"], medium_of_instruction: ["English", "Hindi"], website: "https://jammuuniversity.ac.in", fees: { tuition: "₹15,000/year", hostel: "₹25,000/year" } },
  { id: "2", name: "Government College for Women, Jammu", location: "Jammu", state: "Jammu and Kashmir", type: "Government", courses: ["B.A.", "B.Sc.", "B.Com.", "M.A.", "M.Sc."], cutoff: { general: 80, obc: 75, sc: 70, st: 65 }, facilities: ["Library", "Laboratory", "Internet", "Computer Lab", "Canteen"], medium_of_instruction: ["English"], website: "https://gcwjammu.ac.in", fees: { tuition: "₹12,000/year", hostel: "Not Available" } },
  { id: "3", name: "Government Medical College, Jammu", location: "Jammu", state: "Jammu and Kashmir", type: "Government", courses: ["MBBS", "MD", "MS"], cutoff: { general: 600, obc: 580, sc: 550, st: 530 }, facilities: ["Hostel", "Library", "Laboratory", "Hospital", "Internet", "Medical Equipment"], medium_of_instruction: ["English"], website: "https://gmcjammu.nic.in", fees: { tuition: "₹50,000/year", hostel: "₹30,000/year" } },
  { id: "4", name: "Shri Mata Vaishno Devi University", location: "Katra", state: "Jammu and Kashmir", type: "Government", courses: ["B.Tech", "MBA", "M.Tech", "BCA", "MCA", "B.Sc.", "M.Sc."], cutoff: { general: 75, obc: 70, sc: 65, st: 60 }, facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports Complex", "Cafeteria"], medium_of_instruction: ["English"], website: "https://smvdu.ac.in", fees: { tuition: "₹80,000/year", hostel: "₹40,000/year" } },
  { id: "5", name: "Central University of Kashmir", location: "Ganderbal", state: "Jammu and Kashmir", type: "Government", courses: ["B.A.", "B.Sc.", "B.Tech", "MBA", "M.A.", "M.Sc.", "Ph.D."], cutoff: { general: 82, obc: 77, sc: 72, st: 67 }, facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports", "Medical Center"], medium_of_instruction: ["English", "Urdu"], website: "https://cukashmir.ac.in", fees: { tuition: "₹20,000/year", hostel: "₹35,000/year" } },
  { id: "6", name: "Delhi University", location: "Delhi", state: "Delhi", type: "Government", courses: ["B.A.", "B.Sc.", "B.Com.", "BBA", "MBA", "M.A.", "M.Sc."], cutoff: { general: 95, obc: 90, sc: 85, st: 80 }, facilities: ["Hostel", "Library", "Laboratory", "Internet", "Sports Complex", "Multiple Campuses"], medium_of_instruction: ["English", "Hindi"], website: "https://du.ac.in", fees: { tuition: "₹25,000/year", hostel: "₹45,000/year" } },
  { id: "7", name: "Jawaharlal Nehru University", location: "Delhi", state: "Delhi", type: "Government", courses: ["B.A.", "M.A.", "M.Phil", "Ph.D.", "MBA"], cutoff: { general: 90, obc: 85, sc: 80, st: 75 }, facilities: ["Hostel", "Library", "Laboratory", "Internet", "Cultural Center"], medium_of_instruction: ["English"], website: "https://jnu.ac.in", fees: { tuition: "₹20,000/year", hostel: "₹40,000/year" } },
  { id: "8", name: "Banaras Hindu University", location: "Varanasi", state: "Uttar Pradesh", type: "Government", courses: ["B.A.", "B.Sc.", "B.Tech", "MBBS", "MBA", "M.A.", "M.Sc."], cutoff: { general: 88, obc: 83, sc: 78, st: 73 }, facilities: ["Hostel", "Library", "Laboratory", "Internet", "Hospital", "Sports"], medium_of_instruction: ["English", "Hindi"], website: "https://bhu.ac.in", fees: { tuition: "₹30,000/year", hostel: "₹35,000/year" } }
];

// Scholarships Data (extracted from scholarships page)  
const scholarshipsData = [
  { id: "1", title: "National Merit Scholarship", description: "Merit-based scholarship for outstanding academic performance in Class 12.", provider: "Ministry of Education, India", amount: "₹50,000/year", deadline: "2024-03-15", eligibility: ["Class 12 passed with 85%+", "Indian citizen", "Family income <₹8 LPA"], category: "Merit", level: "Undergraduate", requirements: ["Academic certificates", "Income certificate", "Caste certificate (if applicable)"], application_process: ["Online application on portal", "Document verification", "Merit list publication"], status: "Open", website: "https://scholarships.gov.in", tags: ["Government", "Academic Excellence", "Renewable"] },
  { id: "2", title: "Post Matric Scholarship for SC Students", description: "Financial assistance for SC students pursuing higher education.", provider: "Ministry of Social Justice & Empowerment", amount: "Up to ₹2,00,000/year", deadline: "2024-02-28", eligibility: ["SC category", "Family income <₹2.5 LPA", "Enrolled in recognized institution"], category: "Minority", level: "All", requirements: ["SC certificate", "Income certificate", "Admission proof", "Bank details"], application_process: ["Apply through NSP portal", "Institute verification", "State verification"], status: "Open", website: "https://scholarships.gov.in", tags: ["SC Students", "Government", "Income-based"] },
  { id: "3", title: "INSPIRE Scholarship", description: "Scholarship for students pursuing higher education in Natural and Basic Sciences.", provider: "Department of Science & Technology", amount: "₹80,000/year + ₹20,000 annual", deadline: "2024-04-30", eligibility: ["Top 1% in Class 12", "Pursuing B.Sc./B.S./Int. M.Sc.", "Age <22 years"], category: "Merit", level: "Undergraduate", requirements: ["Class 12 marksheet", "Admission letter", "Research aptitude"], application_process: ["Online application", "Document submission", "Selection process"], status: "Upcoming", website: "https://online-inspire.gov.in", tags: ["Science", "Research", "DST", "Innovation"] },
  { id: "4", title: "Sports Talent Search Scholarship", description: "Supporting talented athletes in their educational and sports journey.", provider: "Sports Authority of India", amount: "₹1,500/month + coaching", deadline: "2024-01-31", eligibility: ["Age 8-14 years", "Representation in district/state level", "Academic performance 60%+"], category: "Sports", level: "School", requirements: ["Sports certificates", "Academic records", "Medical fitness"], application_process: ["Sports trial", "Academic assessment", "Final selection"], status: "Closed", website: "https://sai.gov.in", tags: ["Sports", "Talent Development", "Coaching"] },
  { id: "5", title: "Cultural Talent Search Scholarship", description: "For students with exceptional talent in performing and visual arts.", provider: "Ministry of Culture", amount: "₹2,000/month", deadline: "2024-03-31", eligibility: ["Age 10-14 years", "Exceptional talent in arts", "Regular school attendance"], category: "Arts", level: "School", requirements: ["Performance video", "Academic certificates", "Recommendation letters"], application_process: ["Online application", "Audition/portfolio review", "Selection"], status: "Open", website: "https://indiaculture.nic.in", tags: ["Arts", "Culture", "Performance", "Visual Arts"] },
  { id: "6", title: "Minority Community Scholarship", description: "Pre-matric and post-matric scholarships for minority community students.", provider: "Ministry of Minority Affairs", amount: "₹10,000 - ₹50,000/year", deadline: "2024-02-15", eligibility: ["Religious minority", "Family income <₹2 LPA", "Academic merit"], category: "Minority", level: "All", requirements: ["Community certificate", "Income certificate", "Academic records"], application_process: ["NSP portal application", "Document verification", "Approval"], status: "Open", website: "https://scholarships.gov.in", tags: ["Minority", "Religious", "Income-based"] },
  { id: "7", title: "Research Fellowship for PG Students", description: "Supporting postgraduate students in research and development activities.", provider: "University Grants Commission", amount: "₹25,000/month + contingency", deadline: "2024-05-15", eligibility: ["M.Sc./M.A. with 55%+", "Research proposal", "Age <28 years"], category: "Research", level: "Postgraduate", requirements: ["Research proposal", "Academic transcripts", "Recommendation letters"], application_process: ["Online application", "Research proposal review", "Interview"], status: "Upcoming", website: "https://ugcnet.nta.nic.in", tags: ["Research", "UGC", "Fellowship", "Postgraduate"] },
  { id: "8", title: "Girls Education Scholarship", description: "Encouraging girls to pursue higher education in STEM fields.", provider: "Department of Higher Education", amount: "₹30,000/year", deadline: "2024-04-15", eligibility: ["Female students", "STEM courses", "Family income <₹6 LPA"], category: "Merit", level: "Undergraduate", requirements: ["Gender certificate", "Course admission proof", "Income certificate"], application_process: ["Online registration", "Document upload", "Merit-based selection"], status: "Open", website: "https://scholarships.gov.in", tags: ["Girls Education", "STEM", "Gender Equality"] }
];

// Study Materials Data (extracted from study-materials page)
const studyMaterialsData = [
  { id: "1", title: "Complete Mathematics Guide for Class 12", description: "Comprehensive mathematics guide covering all topics from NCERT and additional practice questions.", type: "eBook", subject: "Mathematics", class: "Class 12", difficulty: "Medium", duration: "200 pages", size: "15 MB", author: "Dr. R.S. Aggarwal", rating: 4.8, downloads: 15420, tags: ["NCERT", "JEE", "Board Exam", "Calculus", "Algebra"], price: "Free", thumbnail: "/api/placeholder/300/400" },
  { id: "2", title: "Physics Video Lectures - Wave Optics", description: "Detailed video explanations of wave optics concepts with solved examples and demonstrations.", type: "Video", subject: "Physics", class: "Class 12", difficulty: "Hard", duration: "4.5 hours", author: "Prof. H.C. Verma", rating: 4.9, downloads: 8750, tags: ["Optics", "Waves", "JEE Advanced", "Visual Learning"], price: "₹299", thumbnail: "/api/placeholder/300/400" },
  { id: "3", title: "English Literature Notes - Class 11", description: "Comprehensive notes for English literature covering all prescribed poems and prose.", type: "Notes", subject: "English", class: "Class 11", difficulty: "Easy", duration: "150 pages", size: "8 MB", author: "Mrs. Kavita Sharma", rating: 4.6, downloads: 12300, tags: ["Literature", "Poetry", "Board Exam", "Analysis"], price: "Free", thumbnail: "/api/placeholder/300/400" },
  { id: "4", title: "Chemistry Practical Manual", description: "Step-by-step chemistry practical experiments with observations and conclusions.", type: "PDF", subject: "Chemistry", class: "Class 12", difficulty: "Medium", duration: "80 pages", size: "12 MB", author: "Dr. O.P. Tandon", rating: 4.7, downloads: 9850, tags: ["Practical", "Experiments", "Lab Manual", "Inorganic"], price: "₹199", thumbnail: "/api/placeholder/300/400" },
  { id: "5", title: "History Interactive Quiz - Ancient India", description: "Interactive quiz covering ancient Indian history with detailed explanations.", type: "Quiz", subject: "History", class: "Class 11", difficulty: "Medium", duration: "45 minutes", author: "Prof. Bipan Chandra", rating: 4.5, downloads: 6420, tags: ["Ancient India", "Interactive", "UPSC", "Board Exam"], price: "Free", thumbnail: "/api/placeholder/300/400" },
  { id: "6", title: "Biology Video Series - Human Physiology", description: "Complete video series on human physiology with 3D animations and diagrams.", type: "Video", subject: "Biology", class: "Class 12", difficulty: "Medium", duration: "6 hours", author: "Dr. Trueman", rating: 4.8, downloads: 11200, tags: ["Physiology", "NEET", "3D Animation", "Human Body"], price: "₹499", thumbnail: "/api/placeholder/300/400" },
  { id: "7", title: "Computer Science Programming Notes", description: "Complete programming notes with Python examples and practice problems.", type: "Notes", subject: "Computer Science", class: "Class 12", difficulty: "Medium", duration: "120 pages", size: "10 MB", author: "Mr. Sumita Arora", rating: 4.7, downloads: 7890, tags: ["Python", "Programming", "Data Structures", "Algorithms"], price: "Free", thumbnail: "/api/placeholder/300/400" },
  { id: "8", title: "Economics Case Studies Collection", description: "Real-world case studies for economics with analysis and solutions.", type: "PDF", subject: "Economics", class: "Class 12", difficulty: "Hard", duration: "100 pages", size: "6 MB", author: "Prof. Sandeep Garg", rating: 4.6, downloads: 5670, tags: ["Case Studies", "Microeconomics", "Macroeconomics", "Analysis"], price: "₹399", thumbnail: "/api/placeholder/300/400" }
];

// Skill Programs Data (extracted from skills page)
const skillProgramsData = [
  { id: "1", title: "Full Stack Web Development", description: "Master modern web development with React, Node.js, and database integration.", duration: "6 months", level: "Beginner", category: "Programming", price: "Free", skills: ["HTML/CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git"], outcomes: ["Build complete web applications", "Deploy to production", "Portfolio projects"], provider: "TechAcademy", rating: 4.8, enrollments: 12500, image_url: "/api/placeholder/300/200" },
  { id: "2", title: "Digital Marketing Mastery", description: "Learn SEO, social media marketing, content marketing, and paid advertising.", duration: "4 months", level: "Beginner", category: "Marketing", price: "₹9,999", skills: ["SEO", "Social Media", "Google Ads", "Content Marketing", "Analytics"], outcomes: ["Run successful campaigns", "Increase online presence", "Certification"], provider: "MarketingPro", rating: 4.6, enrollments: 8700, image_url: "/api/placeholder/300/200" },
  { id: "3", title: "Data Science with Python", description: "Analyze data, build machine learning models, and create data visualizations.", duration: "8 months", level: "Intermediate", category: "Data Science", price: "₹15,999", skills: ["Python", "Pandas", "NumPy", "Matplotlib", "Scikit-learn", "SQL"], outcomes: ["Build ML models", "Data analysis projects", "Industry certification"], provider: "DataLearn", rating: 4.9, enrollments: 6200, image_url: "/api/placeholder/300/200" },
  { id: "4", title: "Graphic Design & UI/UX", description: "Create stunning designs and user-friendly interfaces using modern design tools.", duration: "5 months", level: "Beginner", category: "Design", price: "₹12,999", skills: ["Photoshop", "Illustrator", "Figma", "Adobe XD", "Design Principles"], outcomes: ["Professional portfolio", "Client projects", "Design certification"], provider: "DesignStudio", rating: 4.7, enrollments: 9400, image_url: "/api/placeholder/300/200" },
  { id: "5", title: "Mobile App Development", description: "Build native and cross-platform mobile apps for iOS and Android.", duration: "7 months", level: "Intermediate", category: "Programming", price: "₹18,999", skills: ["React Native", "Flutter", "Firebase", "API Integration", "App Store"], outcomes: ["Publish apps", "Freelance projects", "Mobile dev expertise"], provider: "AppBuilders", rating: 4.8, enrollments: 4300, image_url: "/api/placeholder/300/200" },
  { id: "6", title: "Financial Planning & Investment", description: "Learn personal finance, investment strategies, and wealth management.", duration: "3 months", level: "Beginner", category: "Finance", price: "₹7,999", skills: ["Investment Planning", "Tax Planning", "Mutual Funds", "Insurance", "Banking"], outcomes: ["Personal wealth management", "Financial advisory skills", "Certification"], provider: "FinanceGuru", rating: 4.5, enrollments: 7800, image_url: "/api/placeholder/300/200" },
  { id: "7", title: "Content Writing & Copywriting", description: "Master the art of persuasive writing for marketing and content creation.", duration: "2 months", level: "Beginner", category: "Writing", price: "₹5,999", skills: ["SEO Writing", "Copywriting", "Blog Writing", "Social Media Content"], outcomes: ["Freelance writing", "Content strategy", "Portfolio development"], provider: "WriteWell", rating: 4.4, enrollments: 11200, image_url: "/api/placeholder/300/200" },
  { id: "8", title: "Artificial Intelligence & Machine Learning", description: "Dive deep into AI/ML algorithms, neural networks, and deep learning.", duration: "10 months", level: "Advanced", category: "Technology", price: "₹25,999", skills: ["TensorFlow", "PyTorch", "Neural Networks", "Computer Vision", "NLP"], outcomes: ["AI projects", "Research papers", "Industry certification"], provider: "AIInstitute", rating: 4.9, enrollments: 2800, image_url: "/api/placeholder/300/200" }
];

async function createAllTables() {
  console.log('🏗️ Creating all required Supabase tables...');

  const createTablesSQL = `
    -- Career nodes and links tables
    CREATE TABLE IF NOT EXISTS career_nodes (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('degree', 'exam', 'career', 'specialization')),
      description TEXT NOT NULL,
      requirements TEXT[],
      salary TEXT,
      duration TEXT,
      difficulty TEXT CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
      icon TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    CREATE TABLE IF NOT EXISTS career_links (
      id TEXT PRIMARY KEY,
      source_id TEXT NOT NULL REFERENCES career_nodes(id),
      target_id TEXT NOT NULL REFERENCES career_nodes(id),
      type TEXT NOT NULL CHECK (type IN ('requires', 'leads_to', 'optional')),
      description TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Colleges table
    CREATE TABLE IF NOT EXISTS colleges (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      location TEXT NOT NULL,
      state TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('Government', 'Private', 'Deemed')),
      courses TEXT[] NOT NULL,
      cutoff JSONB,
      facilities TEXT[] NOT NULL,
      medium_of_instruction TEXT[],
      website TEXT,
      fees JSONB,
      rating FLOAT,
      established INTEGER,
      placement TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Scholarships table
    CREATE TABLE IF NOT EXISTS scholarships (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      provider TEXT NOT NULL,
      amount TEXT NOT NULL,
      deadline DATE,
      eligibility TEXT[] NOT NULL,
      category TEXT NOT NULL CHECK (category IN ('Merit', 'Need-based', 'Minority', 'Sports', 'Arts', 'Research')),
      level TEXT NOT NULL CHECK (level IN ('School', 'Undergraduate', 'Postgraduate', 'All')),
      requirements TEXT[] NOT NULL,
      application_process TEXT[] NOT NULL,
      status TEXT NOT NULL CHECK (status IN ('Open', 'Closed', 'Upcoming')),
      website TEXT,
      tags TEXT[],
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Study materials table
    CREATE TABLE IF NOT EXISTS study_materials (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      type TEXT NOT NULL CHECK (type IN ('eBook', 'Video', 'PDF', 'Quiz', 'Notes')),
      subject TEXT NOT NULL,
      class TEXT NOT NULL,
      difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
      duration TEXT,
      size TEXT,
      author TEXT NOT NULL,
      rating FLOAT NOT NULL DEFAULT 0,
      downloads INTEGER NOT NULL DEFAULT 0,
      tags TEXT[],
      price TEXT NOT NULL,
      thumbnail TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Skill programs table
    CREATE TABLE IF NOT EXISTS skill_programs (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT NOT NULL,
      duration TEXT NOT NULL,
      level TEXT NOT NULL CHECK (level IN ('Beginner', 'Intermediate', 'Advanced')),
      category TEXT NOT NULL,
      price TEXT NOT NULL,
      skills TEXT[] NOT NULL,
      outcomes TEXT[] NOT NULL,
      provider TEXT NOT NULL,
      rating FLOAT NOT NULL DEFAULT 0,
      enrollments INTEGER NOT NULL DEFAULT 0,
      image_url TEXT,
      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
    );

    -- Create indexes for better performance
    CREATE INDEX IF NOT EXISTS idx_career_nodes_type ON career_nodes(type);
    CREATE INDEX IF NOT EXISTS idx_career_links_source ON career_links(source_id);
    CREATE INDEX IF NOT EXISTS idx_career_links_target ON career_links(target_id);
    CREATE INDEX IF NOT EXISTS idx_colleges_state ON colleges(state);
    CREATE INDEX IF NOT EXISTS idx_colleges_type ON colleges(type);
    CREATE INDEX IF NOT EXISTS idx_scholarships_category ON scholarships(category);
    CREATE INDEX IF NOT EXISTS idx_scholarships_status ON scholarships(status);
    CREATE INDEX IF NOT EXISTS idx_study_materials_subject ON study_materials(subject);
    CREATE INDEX IF NOT EXISTS idx_study_materials_class ON study_materials(class);
    CREATE INDEX IF NOT EXISTS idx_skill_programs_category ON skill_programs(category);
    CREATE INDEX IF NOT EXISTS idx_skill_programs_level ON skill_programs(level);
  `;

  console.log('📋 Execute this SQL in your Supabase SQL editor:');
  console.log(createTablesSQL);
  
  console.log('\n✅ After creating tables, run the data migration...');
}

async function migrateAllData() {
  console.log('🚀 Starting comprehensive data migration to Supabase...');

  try {
    console.log('📊 Migrating career path data...');
    
    // Clear existing data
    await supabase.from('career_links').delete().neq('id', '');
    await supabase.from('career_nodes').delete().neq('id', '');

    // Insert career nodes
    const { error: nodesError } = await supabase.from('career_nodes').insert(careerPathData.nodes);
    if (nodesError) throw nodesError;
    console.log(`✅ Inserted ${careerPathData.nodes.length} career nodes`);

    // Insert career links
    const { error: linksError } = await supabase.from('career_links').insert(careerPathData.links);
    if (linksError) throw linksError;
    console.log(`✅ Inserted ${careerPathData.links.length} career links`);

    console.log('🏫 Migrating colleges data...');
    await supabase.from('colleges').delete().neq('id', '');
    const { error: collegesError } = await supabase.from('colleges').insert(collegesData);
    if (collegesError) throw collegesError;
    console.log(`✅ Inserted ${collegesData.length} colleges`);

    console.log('🎓 Migrating scholarships data...');
    await supabase.from('scholarships').delete().neq('id', '');
    const { error: scholarshipsError } = await supabase.from('scholarships').insert(scholarshipsData);
    if (scholarshipsError) throw scholarshipsError;
    console.log(`✅ Inserted ${scholarshipsData.length} scholarships`);

    console.log('📚 Migrating study materials data...');
    await supabase.from('study_materials').delete().neq('id', '');
    const { error: studyError } = await supabase.from('study_materials').insert(studyMaterialsData);
    if (studyError) throw studyError;
    console.log(`✅ Inserted ${studyMaterialsData.length} study materials`);

    console.log('💼 Migrating skill programs data...');
    await supabase.from('skill_programs').delete().neq('id', '');
    const { error: skillsError } = await supabase.from('skill_programs').insert(skillProgramsData);
    if (skillsError) throw skillsError;
    console.log(`✅ Inserted ${skillProgramsData.length} skill programs`);

    console.log('🎉 Complete data migration successful!');
    console.log('\n📊 Migration Summary:');
    console.log(`   - Career Nodes: ${careerPathData.nodes.length}`);
    console.log(`   - Career Links: ${careerPathData.links.length}`);
    console.log(`   - Colleges: ${collegesData.length}`);
    console.log(`   - Scholarships: ${scholarshipsData.length}`);
    console.log(`   - Study Materials: ${studyMaterialsData.length}`);
    console.log(`   - Skill Programs: ${skillProgramsData.length}`);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
}

// Main execution
async function main() {
  console.log('🎯 Complete Data Migration Script');
  console.log('================================\n');

  try {
    // Check if we should create tables or migrate data
    const args = process.argv.slice(2);
    
    if (args.includes('--create-tables')) {
      await createAllTables();
    } else {
      await migrateAllData();
    }

  } catch (error) {
    console.error('💥 Script failed:', error);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

export {
  createAllTables,
  migrateAllData
};