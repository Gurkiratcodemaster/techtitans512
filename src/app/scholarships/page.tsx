"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";

interface Scholarship {
  id: string;
  title: string;
  description: string;
  provider: string;
  amount: string;
  deadline: string;
  eligibility: string[];
  category: "Merit" | "Need-based" | "Minority" | "Sports" | "Arts" | "Research";
  level: "School" | "Undergraduate" | "Postgraduate" | "All";
  requirements: string[];
  applicationProcess: string[];
  status: "Open" | "Closed" | "Upcoming";
  website: string;
  tags: string[];
}

export default function ScholarshipsPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const scholarships: Scholarship[] = [
    {
      id: "1",
      title: "National Merit Scholarship",
      description: "Merit-based scholarship for outstanding academic performance in Class 12.",
      provider: "Ministry of Education, India",
      amount: "₹50,000/year",
      deadline: "2024-03-15",
      eligibility: ["Class 12 passed with 85%+", "Indian citizen", "Family income <₹8 LPA"],
      category: "Merit",
      level: "Undergraduate",
      requirements: ["Academic certificates", "Income certificate", "Caste certificate (if applicable)"],
      applicationProcess: ["Online application on portal", "Document verification", "Merit list publication"],
      status: "Open",
      website: "https://scholarships.gov.in",
      tags: ["Government", "Academic Excellence", "Renewable"]
    },
    {
      id: "2",
      title: "Post Matric Scholarship for SC Students",
      description: "Financial assistance for SC students pursuing higher education.",
      provider: "Ministry of Social Justice & Empowerment",
      amount: "Up to ₹2,00,000/year",
      deadline: "2024-02-28",
      eligibility: ["SC category", "Family income <₹2.5 LPA", "Enrolled in recognized institution"],
      category: "Minority",
      level: "All",
      requirements: ["SC certificate", "Income certificate", "Admission proof", "Bank details"],
      applicationProcess: ["Apply through NSP portal", "Institute verification", "State verification"],
      status: "Open",
      website: "https://scholarships.gov.in",
      tags: ["SC Students", "Government", "Income-based"]
    },
    {
      id: "3",
      title: "INSPIRE Scholarship",
      description: "Scholarship for students pursuing higher education in Natural and Basic Sciences.",
      provider: "Department of Science & Technology",
      amount: "₹80,000/year + ₹20,000 annual",
      deadline: "2024-04-30",
      eligibility: ["Top 1% in Class 12", "Pursuing B.Sc./B.S./Int. M.Sc.", "Age <22 years"],
      category: "Merit",
      level: "Undergraduate",
      requirements: ["Class 12 marksheet", "Admission letter", "Research aptitude"],
      applicationProcess: ["Online application", "Document submission", "Selection process"],
      status: "Upcoming",
      website: "https://online-inspire.gov.in",
      tags: ["Science", "Research", "DST", "Innovation"]
    },
    {
      id: "4",
      title: "Sports Talent Search Scholarship",
      description: "Supporting talented athletes in their educational and sports journey.",
      provider: "Sports Authority of India",
      amount: "₹1,500/month + coaching",
      deadline: "2024-01-31",
      eligibility: ["Age 8-14 years", "Representation in district/state level", "Academic performance 60%+"],
      category: "Sports",
      level: "School",
      requirements: ["Sports certificates", "Academic records", "Medical fitness"],
      applicationProcess: ["Sports trial", "Academic assessment", "Final selection"],
      status: "Closed",
      website: "https://sai.gov.in",
      tags: ["Sports", "Talent Development", "Coaching"]
    },
    {
      id: "5",
      title: "Cultural Talent Search Scholarship",
      description: "For students with exceptional talent in performing and visual arts.",
      provider: "Ministry of Culture",
      amount: "₹2,000/month",
      deadline: "2024-03-31",
      eligibility: ["Age 10-14 years", "Exceptional talent in arts", "Regular school attendance"],
      category: "Arts",
      level: "School",
      requirements: ["Performance video", "Academic certificates", "Recommendation letters"],
      applicationProcess: ["Online application", "Audition/portfolio review", "Selection"],
      status: "Open",
      website: "https://indiaculture.nic.in",
      tags: ["Arts", "Culture", "Performance", "Visual Arts"]
    },
    {
      id: "6",
      title: "Minority Community Scholarship",
      description: "Pre-matric and post-matric scholarships for minority community students.",
      provider: "Ministry of Minority Affairs",
      amount: "₹10,000 - ₹50,000/year",
      deadline: "2024-02-15",
      eligibility: ["Religious minority", "Family income <₹2 LPA", "Academic merit"],
      category: "Minority",
      level: "All",
      requirements: ["Community certificate", "Income certificate", "Academic records"],
      applicationProcess: ["NSP portal application", "Document verification", "Approval"],
      status: "Open",
      website: "https://scholarships.gov.in",
      tags: ["Minority", "Religious", "Income-based"]
    },
    {
      id: "7",
      title: "Research Fellowship for PG Students",
      description: "Supporting postgraduate students in research and development activities.",
      provider: "University Grants Commission",
      amount: "₹25,000/month + contingency",
      deadline: "2024-05-15",
      eligibility: ["M.Sc./M.A. with 55%+", "Research proposal", "Age <28 years"],
      category: "Research",
      level: "Postgraduate",
      requirements: ["Research proposal", "Academic transcripts", "Recommendation letters"],
      applicationProcess: ["Online application", "Research proposal review", "Interview"],
      status: "Upcoming",
      website: "https://ugcnet.nta.nic.in",
      tags: ["Research", "UGC", "Fellowship", "Postgraduate"]
    },
    {
      id: "8",
      title: "Girls Education Scholarship",
      description: "Encouraging girls to pursue higher education in STEM fields.",
      provider: "Department of Higher Education",
      amount: "₹30,000/year",
      deadline: "2024-04-15",
      eligibility: ["Female students", "STEM courses", "Family income <₹6 LPA"],
      category: "Merit",
      level: "Undergraduate",
      requirements: ["Gender certificate", "Course admission proof", "Income certificate"],
      applicationProcess: ["Online registration", "Document upload", "Merit-based selection"],
      status: "Open",
      website: "https://scholarships.gov.in",
      tags: ["Girls Education", "STEM", "Gender Equality"]
    }
  ];

  const categories = ["All", "Merit", "Need-based", "Minority", "Sports", "Arts", "Research"];
  const levels = ["All", "School", "Undergraduate", "Postgraduate"];
  const statuses = ["All", "Open", "Closed", "Upcoming"];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = scholarships;

    if (searchTerm) {
      filtered = filtered.filter(scholarship =>
        scholarship.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.provider.toLowerCase().includes(searchTerm.toLowerCase()) ||
        scholarship.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== "All") {
      filtered = filtered.filter(scholarship => scholarship.category === selectedCategory);
    }

    if (selectedLevel !== "All") {
      filtered = filtered.filter(scholarship => scholarship.level === selectedLevel || scholarship.level === "All");
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter(scholarship => scholarship.status === selectedStatus);
    }

    setFilteredScholarships(filtered);
  }, [searchTerm, selectedCategory, selectedLevel, selectedStatus]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSelectedStatus("All");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Open": return "bg-green-100 text-green-800";
      case "Closed": return "bg-red-100 text-red-800";
      case "Upcoming": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Merit": return "bg-blue-100 text-blue-800";
      case "Need-based": return "bg-green-100 text-green-800";
      case "Minority": return "bg-purple-100 text-purple-800";
      case "Sports": return "bg-orange-100 text-orange-800";
      case "Arts": return "bg-pink-100 text-pink-800";
      case "Research": return "bg-indigo-100 text-indigo-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDaysLeft = (deadline: string) => {
    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
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
              Scholarship <span className="text-blue-600">Opportunities</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover scholarship opportunities to support your educational journey. Find merit-based, need-based, and special category scholarships.
            </p>
          </div>

          {/* Alert Banner */}
          <div className={`bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-2xl p-6 mb-8 text-center transform transition-all duration-500 delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="flex items-center justify-center mb-2">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span className="font-bold">Important Notice</span>
            </div>
            <p>Several scholarship deadlines are approaching! Check the application deadlines and apply early to avoid last-minute issues.</p>
          </div>

          {/* Search and Filters */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg transform transition-all duration-500 delay-300 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            {/* Search Bar */}
            <div className="mb-6">
              <div className="relative max-w-xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Search scholarships by title, provider, or tags..."
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                <select
                  value={selectedLevel}
                  onChange={(e) => setSelectedLevel(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="w-full px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Showing {filteredScholarships.length} of {scholarships.length} scholarships
              </p>
            </div>
          </div>

          {/* Scholarships Grid */}
          <div className="grid lg:grid-cols-2 gap-6">
            {filteredScholarships.map((scholarship, index) => (
              <div
                key={scholarship.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 transform transition-all duration-500 hover:shadow-xl hover:-translate-y-1 ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
              >
                {/* Header */}
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(scholarship.status)}`}>
                        {scholarship.status}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(scholarship.category)}`}>
                        {scholarship.category}
                      </span>
                      {scholarship.status === "Open" && (
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-semibold">
                          {getDaysLeft(scholarship.deadline)} days left
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{scholarship.title}</h3>
                    <p className="text-gray-600 text-sm mb-2">{scholarship.description}</p>
                    <p className="text-blue-600 font-semibold text-sm">{scholarship.provider}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600">{scholarship.amount}</div>
                    <div className="text-xs text-gray-500">Scholarship Amount</div>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Application Deadline
                    </h4>
                    <p className="text-gray-600 text-sm">{new Date(scholarship.deadline).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      Eligibility Criteria
                    </h4>
                    <ul className="text-gray-600 text-sm space-y-1">
                      {scholarship.eligibility.slice(0, 3).map((criteria, idx) => (
                        <li key={idx} className="flex items-center">
                          <div className="w-1 h-1 bg-blue-500 rounded-full mr-2"></div>
                          {criteria}
                        </li>
                      ))}
                      {scholarship.eligibility.length > 3 && (
                        <li className="text-blue-600 text-xs cursor-pointer">View all criteria...</li>
                      )}
                    </ul>
                  </div>

                  <div>
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Required Documents
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {scholarship.requirements.slice(0, 3).map((req, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {req}
                        </span>
                      ))}
                      {scholarship.requirements.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs">
                          +{scholarship.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2">
                    {scholarship.tags.map(tag => (
                      <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded-full text-xs">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 mt-6">
                  <a
                    href={scholarship.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`flex-1 px-4 py-2 rounded-lg text-center font-semibold transition-all duration-300 ${
                      scholarship.status === "Open"
                        ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 transform hover:scale-105"
                        : scholarship.status === "Upcoming"
                        ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600"
                        : "bg-gray-300 text-gray-600 cursor-not-allowed"
                    }`}
                  >
                    {scholarship.status === "Open" ? "Apply Now" :
                     scholarship.status === "Upcoming" ? "Set Reminder" : "Closed"}
                  </a>
                  <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredScholarships.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No scholarships found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search term or filters to find more opportunities.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Tips Section */}
          <div className={`mt-16 transform transition-all duration-500 delay-500 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-3xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Scholarship Application Tips</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Apply Early</h3>
                  <p className="text-gray-600 text-sm">Don't wait for the last minute. Start your application process early to avoid technical issues.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Complete Documentation</h3>
                  <p className="text-gray-600 text-sm">Ensure all required documents are ready and properly attested before starting the application.</p>
                </div>

                <div className="text-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-gray-800 mb-2">Follow Up</h3>
                  <p className="text-gray-600 text-sm">Keep track of your application status and follow up with the scholarship provider if needed.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}