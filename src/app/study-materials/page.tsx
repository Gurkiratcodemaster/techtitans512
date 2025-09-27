"use client";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import { supabase } from "@/lib/database";

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
  link: string; // <-- new field for video or material link
}



// Utility function to get a color for the material type
const getTypeColor = (type: StudyMaterial['type']) => {
  switch (type) {
    case 'eBook':
      return 'bg-blue-100 text-blue-800';
    case 'Video':
      return 'bg-gray-100 text-gray-800';
    case 'PDF':
      return 'bg-blue-500 text-white';
    case 'Quiz':
      return 'bg-black text-white';
    case 'Notes':
      return 'bg-gray-200 text-gray-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

// Utility function to get a color for the difficulty level
const getDifficultyColor = (difficulty: StudyMaterial['difficulty']) => {
  switch (difficulty) {
    case 'Easy':
      return 'bg-blue-100 text-blue-800';
    case 'Medium':
      return 'bg-gray-100 text-gray-800';
    case 'Hard':
      return 'bg-black text-white';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export default function StudyMaterialsPage() {
  const [loaded, setLoaded] = useState(false);
  const [studyMaterials, setStudyMaterials] = useState<StudyMaterial[]>([]);
  const [filteredMaterials, setFilteredMaterials] = useState<StudyMaterial[]>([]);
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [selectedClass, setSelectedClass] = useState("All");
  const [selectedType, setSelectedType] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  // Set 'loaded' to true once the page is mounted for the animations
  useEffect(() => {
    setLoaded(true);
  }, []);

  // ✅ Fetch data from Supabase
  useEffect(() => {
    const fetchData = async () => {
      // Use a try-catch block for robust error handling
      try {
        const { data, error } = await supabase.from("StudyMaterial").select("*");
        if (error) {
          throw error;
        }
        setStudyMaterials(data as StudyMaterial[]);
      } catch (error) {
        console.error("Error fetching study materials:", error);
        // Handle the error state in your UI, e.g., display an error message
      }
    };
    fetchData();
  }, []);

  // ✅ Filtering logic (re-filter whenever dependencies change)
  useEffect(() => {
    let filtered = studyMaterials;

    if (selectedSubject !== "All") {
      filtered = filtered.filter(m => m.subject === selectedSubject);
    }
    if (selectedClass !== "All") {
      filtered = filtered.filter(m => m.class === selectedClass);
    }
    if (selectedType !== "All") {
      filtered = filtered.filter(m => m.type === selectedType);
    }
    if (searchTerm) {
      filtered = filtered.filter(m =>
        m.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        m.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    setFilteredMaterials(filtered);
  }, [studyMaterials, selectedSubject, selectedClass, selectedType, searchTerm]);

  // ✅ Dynamic dropdowns
  const subjects = ["All", ...Array.from(new Set(studyMaterials.map(m => m.subject)))];
  const classes = ["All", ...Array.from(new Set(studyMaterials.map(m => m.class)))];
  const types = ["All", ...Array.from(new Set(studyMaterials.map(m => m.type)))];

  // Function to reset all filters
  const resetFilters = () => {
    setSelectedSubject("All");
    setSelectedClass("All");
    setSelectedType("All");
    setSearchTerm("");
  };

  // ✅ The UI part of your component is here
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      {/* Hero Section */}
      <HeroSection
        title="Study Materials"
        subtitle="Access comprehensive study resources designed to help you excel in your academics"
        stats={[
          { value: studyMaterials.length.toString(), label: "Total Resources" },
          { value: subjects.filter(s => s !== 'All').length.toString(), label: "Subjects" },
          { value: classes.filter(c => c !== 'All').length.toString(), label: "Class Levels" }
        ]}
        loaded={loaded}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className={`bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100 transform transition-all duration-1000 delay-500 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-wrap gap-6 items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Find Study Materials</h2>
          </div>
          {/* Search Bar */}
          <div className="mb-8">
            <div className="relative max-w-2xl mx-auto">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300" placeholder="Search materials by title, description, or tags..." />
            </div>
          </div>
          {/* Filters */}
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Subject</label>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300">
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Class</label>
              <select value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300">
                {classes.map(cls => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Type</label>
              <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-300">
                {types.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        {/* Study Materials Grid */}
        {filteredMaterials.length > 0 ? (
          <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 transform transition-all duration-1000 delay-700 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            {filteredMaterials.map((material, index) => (
              <div key={material.id} className="bg-white rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden hover:-translate-y-3 transform border border-gray-100" style={{animationDelay: `${index * 100}ms`}}>
                <div className="relative">
                  <img src={material.thumbnail} alt={material.title} className="w-full h-48 object-cover" />
                  <div className="absolute top-4 left-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${getTypeColor(material.type)} shadow-lg`}>
                      {material.type}
                    </span>
                  </div>
                  <div className="absolute top-4 right-4">
                    <span className={`px-4 py-2 rounded-full text-xs font-bold ${getDifficultyColor(material.difficulty)} shadow-lg`}>
                      {material.difficulty}
                    </span>
                  </div>
                </div>
                <div className="p-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-full">{material.class}</span>
                    <span className="text-sm text-gray-600 font-medium">{material.subject}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2 leading-tight">
                    {material.title}
                  </h3>
                  <p className="text-gray-600 text-sm mb-6 line-clamp-3 leading-relaxed">
                    {material.description}
                  </p>
                  <div className="flex items-center mb-6">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      <span className="text-sm font-semibold text-gray-700">{material.rating}</span>
                      <span className="text-sm text-gray-500 ml-3">({material.downloads} downloads)</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    {material.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                        {tag}
                      </span>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-gray-100">
                    <div>
                      <p className="text-sm text-gray-500 font-medium">By {material.author}</p>
                      <p className="text-sm text-gray-600">{material.duration}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-blue-600 mb-2">{material.price}</p>
                      <button className="px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl">
                        {material.price === "Free" ? "Access Now" : "Purchase"}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className={`text-center py-20 transform transition-all duration-1000 delay-600 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
            <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">No study materials found</h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your search term or filters to find what you're looking for.</p>
            <button onClick={resetFilters} className="px-8 py-4 bg-gradient-to-r from-black from-20% via-blue-600 via-50% to-black to-80% text-white font-semibold rounded-xl hover:from-gray-900 hover:from-20% hover:via-blue-700 hover:via-50% hover:to-gray-900 hover:to-80% transition-all duration-300 shadow-lg hover:shadow-xl">
              Clear All Filters
            </button>
          </div>
        )}
        {/* Popular Categories Section */}
        <div className={`mt-20 transform transition-all duration-500 delay-400 ${loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
          <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Popular Categories</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {subjects.filter(s => s !== "All").map(subject => (
              <button key={subject} onClick={() => setSelectedSubject(subject)} className="p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 text-center group hover:-translate-y-2 border border-gray-100">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-gray-200 transition-all duration-300 border border-blue-200">
                  <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <h3 className="font-bold text-gray-900 text-lg mb-2">{subject}</h3>
                <p className="text-sm text-gray-600 font-medium">
                  {studyMaterials.filter(m => m.subject === subject).length} materials
                </p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
