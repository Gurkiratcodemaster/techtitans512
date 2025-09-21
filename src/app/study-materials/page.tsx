"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";

interface StudyMaterial {
  id: string;
  title: string;
  description: string;
  type: "eBook" | "Video" | "PDF" | "Quiz" | "Notes";
  subject: string;
  class: string;
  difficulty: "Easy" | "Medium" | "Hard";
  duration: string;
  size?: string;
  author: string;
  rating: number;
  downloads: number;
  tags: string[];
  price: "Free" | string;
  thumbnail: string;
}

export default function StudyMaterialsPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  const studyMaterials: StudyMaterial[] = [
    {
      id: "1",
      title: "Complete Mathematics Guide for Class 12",
      description: "Comprehensive mathematics guide covering all topics from NCERT and additional practice questions.",
      type: "eBook",
      subject: "Mathematics",
      class: "Class 12",
      difficulty: "Medium",
      duration: "200 pages",
      size: "15 MB",
      author: "Dr. R.S. Aggarwal",
      rating: 4.8,
      downloads: 15420,
      tags: ["NCERT", "JEE", "Board Exam", "Calculus", "Algebra"],
      price: "Free",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "2",
      title: "Physics Video Lectures - Wave Optics",
      description: "Detailed video explanations of wave optics concepts with solved examples and demonstrations.",
      type: "Video",
      subject: "Physics",
      class: "Class 12",
      difficulty: "Hard",
      duration: "4.5 hours",
      author: "Prof. H.C. Verma",
      rating: 4.9,
      downloads: 8750,
      tags: ["Optics", "Waves", "JEE Advanced", "Visual Learning"],
      price: "₹299",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "3",
      title: "English Literature Notes - Class 11",
      description: "Comprehensive notes for English literature covering all prescribed poems and prose.",
      type: "Notes",
      subject: "English",
      class: "Class 11",
      difficulty: "Easy",
      duration: "150 pages",
      size: "8 MB",
      author: "Mrs. Kavita Sharma",
      rating: 4.6,
      downloads: 12300,
      tags: ["Literature", "Poetry", "Board Exam", "Analysis"],
      price: "Free",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "4",
      title: "Chemistry Practical Manual",
      description: "Step-by-step chemistry practical experiments with observations and conclusions.",
      type: "PDF",
      subject: "Chemistry",
      class: "Class 12",
      difficulty: "Medium",
      duration: "80 pages",
      size: "12 MB",
      author: "Dr. O.P. Tandon",
      rating: 4.7,
      downloads: 9850,
      tags: ["Practical", "Experiments", "Lab Manual", "Inorganic"],
      price: "₹199",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "5",
      title: "History Interactive Quiz - Ancient India",
      description: "Interactive quiz covering ancient Indian history with detailed explanations.",
      type: "Quiz",
      subject: "History",
      class: "Class 11",
      difficulty: "Medium",
      duration: "45 minutes",
      author: "Prof. Bipan Chandra",
      rating: 4.5,
      downloads: 6420,
      tags: ["Ancient India", "Interactive", "UPSC", "Board Exam"],
      price: "Free",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "6",
      title: "Biology Video Series - Human Physiology",
      description: "Complete video series on human physiology with 3D animations and diagrams.",
      type: "Video",
      subject: "Biology",
      class: "Class 12",
      difficulty: "Medium",
      duration: "6 hours",
      author: "Dr. Trueman",
      rating: 4.8,
      downloads: 11200,
      tags: ["Physiology", "NEET", "3D Animation", "Human Body"],
      price: "₹499",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "7",
      title: "Computer Science Programming Notes",
      description: "Complete programming notes with Python examples and practice problems.",
      type: "Notes",
      subject: "Computer Science",
      class: "Class 12",
      difficulty: "Medium",
      duration: "120 pages",
      size: "10 MB",
      author: "Mr. Sumita Arora",
      rating: 4.7,
      downloads: 7890,
      tags: ["Python", "Programming", "Data Structures", "Algorithms"],
      price: "Free",
      thumbnail: "/api/placeholder/300/400"
    },
    {
      id: "8",
      title: "Economics Case Studies Collection",
      description: "Real-world case studies for economics with analysis and solutions.",
      type: "PDF",
      subject: "Economics",
      class: "Class 12",
      difficulty: "Hard",
      duration: "100 pages",
      size: "6 MB",
      author: "Prof. Sandeep Garg",
      rating: 4.6,
      downloads: 5670,
      tags: ["Case Studies", "Microeconomics", "Macroeconomics", "Analysis"],
      price: "₹399",
      thumbnail: "/api/placeholder/300/400"
    }
  ];

  const subjects = ["All", ...Array.from(new Set(studyMaterials.map(m => m.subject)))].sort();
  const classes = ["All", ...Array.from(new Set(studyMaterials.map(m => m.class)))].sort();
  const types = ["All", ...Array.from(new Set(studyMaterials.map(m => m.type)))];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = studyMaterials;

    if (searchTerm) {
      filtered = filtered.filter(material =>
        material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        material.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedSubject !== "All") {
      filtered = filtered.filter(material => material.subject === selectedSubject);
    }

    if (selectedClass !== "All") {
      filtered = filtered.filter(material => material.class === selectedClass);
    }

    if (selectedType !== "All") {
      filtered = filtered.filter(material => material.type === selectedType);
    }

    setFilteredMaterials(filtered);
  }, [searchTerm, selectedSubject, selectedClass, selectedType]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedSubject("All");
    setSelectedClass("All");
    setSelectedType("All");
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "eBook":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case "Video":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m0 0V9a3 3 0 013-3h2.343M9 10H6a3 3 0 00-3 3v4a3 3 0 003 3h8a3 3 0 003-3v-1" />
          </svg>
        );
      case "PDF":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      case "Quiz":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        );
      case "Notes":
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        );
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "eBook": return "bg-blue-100 text-blue-800";
      case "Video": return "bg-red-100 text-red-800";
      case "PDF": return "bg-green-100 text-green-800";
      case "Quiz": return "bg-purple-100 text-purple-800";
      case "Notes": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Easy": return "bg-green-100 text-green-800";
      case "Medium": return "bg-yellow-100 text-yellow-800";
      case "Hard": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
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
              Study <span className="text-blue-600">Materials</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Access comprehensive study materials including eBooks, video lectures, notes, and interactive quizzes for all subjects.
            </p>
          </div>

          {/* Search and Filters */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg transform transition-all duration-500 delay-200 ${
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
                  placeholder="Search by title, description, or tags..."
                />
              </div>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <select
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {subjects.map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Class</label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {classes.map(cls => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
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
                Showing {filteredMaterials.length} of {studyMaterials.length} materials
              </p>
            </div>
          </div>

          {/* Materials Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMaterials.map((material, index) => (
              <div
                key={material.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden transform transition-all duration-500 hover:shadow-xl hover:-translate-y-2 ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                {/* Material Thumbnail */}
                <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 relative">
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getTypeColor(material.type)}`}>
                      {getTypeIcon(material.type)}
                      {material.type}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getDifficultyColor(material.difficulty)}`}>
                      {material.difficulty}
                    </span>
                  </div>
                  <div className="absolute bottom-3 left-3 text-gray-700">
                    <div className="flex items-center mb-1">
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <svg key={i} className={`w-3 h-3 ${i < Math.floor(material.rating) ? 'fill-current' : 'fill-gray-300'}`} viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-1 text-xs">{material.rating}</span>
                    </div>
                    <p className="text-xs">{material.downloads.toLocaleString()} downloads</p>
                  </div>
                </div>

                {/* Material Content */}
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <span className="text-xs text-blue-600 font-semibold">{material.subject} • {material.class}</span>
                    <span className="text-sm font-bold text-green-600">{material.price}</span>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-2">{material.title}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>
                  
                  <div className="flex items-center text-gray-600 text-xs mb-3">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="mr-3">{material.author}</span>
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>{material.duration}</span>
                  </div>

                  {/* Tags */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-1">
                      {material.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                          {tag}
                        </span>
                      ))}
                      {material.tags.length > 3 && (
                        <span className="px-2 py-1 bg-gray-200 text-gray-500 rounded text-xs">
                          +{material.tags.length - 3}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 px-3 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-300 text-sm font-semibold">
                      {material.type === "Video" ? "Watch" : "Download"}
                    </button>
                    <button className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                      Preview
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* No Results */}
          {filteredMaterials.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No study materials found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search term or filters.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Popular Categories Section */}
          <div className={`mt-16 transform transition-all duration-500 delay-400 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">Popular Categories</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {subjects.filter(s => s !== "All").map(subject => (
                <button
                  key={subject}
                  onClick={() => setSelectedSubject(subject)}
                  className="p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 text-center group hover:-translate-y-1"
                >
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 group-hover:bg-blue-200 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-800">{subject}</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {studyMaterials.filter(m => m.subject === subject).length} materials
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}