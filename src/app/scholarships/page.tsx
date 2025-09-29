"use client";
import { useState, useEffect } from "react";
import { supabase } from "@/lib/database"; // Adjust this path if necessary

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
  
  
  // ✨ ADDED: States for data, loading, and errors
  const [scholarships, setScholarships] = useState<Scholarship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("Open");
  const [filteredScholarships, setFilteredScholarships] = useState<Scholarship[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // ✨ REMOVED: The hardcoded `scholarships` array is gone.
  
  const categories = ["All", "Merit", "Need-based", "Minority", "Sports", "Arts", "Research"];
  const levels = ["All", "School", "Undergraduate", "Postgraduate"];
  const statuses = ["All", "Open", "Closed", "Upcoming"];

  useEffect(() => {
    
    
  }, []);

  // ✨ ADDED: useEffect to fetch data from Supabase on component mount
  useEffect(() => {
    const fetchScholarships = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data, error } = await supabase
          .from("Scholarship") // Use your exact table name
          .select("*")
          .order("deadline", { ascending: true }); // Optional: sort the data

        if (error) {
          throw error;
        }

        setScholarships(data as Scholarship[]);
      } catch (err: any) {
        console.error("Error fetching scholarships:", err);
        setError("Could not fetch scholarship data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchScholarships();
  }, []);


  // ✨ CHANGED: This useEffect now depends on the `scholarships` state fetched from Supabase
  useEffect(() => {
    let filtered = scholarships;

    // ... (Your filtering logic remains exactly the same, which is great!)
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
  }, [searchTerm, selectedCategory, selectedLevel, selectedStatus, scholarships]); // ✨ Added `scholarships` to dependency array

  // Helper functions
  const resetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("All");
    setSelectedLevel("All");
    setSelectedStatus("Open");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open':
        return 'bg-blue-100 text-blue-800';
      case 'Closed':
        return 'bg-blue-200 text-blue-900';
      case 'Upcoming':
        return 'bg-blue-50 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Merit':
        return 'bg-blue-100 text-blue-800';
      case 'Need-based':
        return 'bg-blue-200 text-blue-900';
      case 'Minority':
        return 'bg-blue-50 text-blue-700';
      case 'Sports':
        return 'bg-slate-100 text-slate-800';
      case 'Arts':
        return 'bg-sky-100 text-sky-800';
      case 'Research':
        return 'bg-cyan-100 text-cyan-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDaysLeft = (deadline: string) => {
    const deadlineDate = new Date(deadline);
    const today = new Date();
    const timeDiff = deadlineDate.getTime() - today.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    if (daysDiff < 0) return null; // Past deadline
    if (daysDiff === 0) return "Today";
    if (daysDiff === 1) return "1 day";
    return `${daysDiff} days`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-gray-800 via-blue-600 to-black">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Scholarships Directory
            </h1>
            <p className="text-xl md:text-2xl text-gray-200 font-medium mb-8 max-w-3xl mx-auto">
              Discover funding opportunities to support your educational journey
            </p>
            
            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{scholarships.length}</div>
                <div className="text-blue-100">Total Scholarships</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{categories.filter(c => c !== 'All').length}</div>
                <div className="text-gray-200">Categories</div>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
                <div className="text-3xl font-bold text-white">{filteredScholarships.filter(s => s.status === 'Open').length}</div>
                <div className="text-gray-200">Open Now</div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="px-8 -mt-10 relative">
        <div className="max-w-7xl mx-auto">
          {/* ... (Header and Alert Banner are fine) ... */}

          {/* Search and Filters */}
          <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 mb-12 border border-gray-100">
            <div className="flex flex-wrap gap-6 items-center justify-between mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Find Scholarships</h2>
            </div>
            {/* Search Bar */}
            <div className="mb-8">
              <div className="relative max-w-2xl mx-auto">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-6 w-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input 
                  type="text" 
                  value={searchTerm} 
                  onChange={(e) => setSearchTerm(e.target.value)} 
                  className="block w-full pl-12 pr-4 py-4 text-lg border-2 border-gray-200 rounded-2xl leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 " 
                  placeholder="Search scholarships by title, provider, or tags..." 
                />
              </div>
            </div>
            {/* Filters */}
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Category</label>
                <select 
                  value={selectedCategory} 
                  onChange={(e) => setSelectedCategory(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 "
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Level</label>
                <select 
                  value={selectedLevel} 
                  onChange={(e) => setSelectedLevel(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 "
                >
                  {levels.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Status</label>
                <select 
                  value={selectedStatus} 
                  onChange={(e) => setSelectedStatus(e.target.value)} 
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl bg-white text-gray-700 focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 "
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* View Mode Toggle */}
            <div className="mt-8 flex justify-center">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 3h7v7H3V3zm0 11h7v7H3v-7zm11-11h7v7h-7V3zm0 11h7v7h-7v-7z"/>
                  </svg>
                  Grid
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"/>
                  </svg>
                  List
                </button>
              </div>
            </div>
            
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">
                {loading ? 'Searching...' : `Showing ${filteredScholarships.length} of ${scholarships.length} scholarships`}
              </p>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <svg className="w-12 h-12 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Loading Scholarships...</h3>
              <p className="text-gray-600">Please wait while we fetch the opportunities.</p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="text-center py-20 bg-blue-50 rounded-3xl border border-blue-200">
              <div className="w-32 h-32 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-blue-200">
                <svg className="w-12 h-12 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-blue-700 mb-4">An Error Occurred</h3>
              <p className="text-blue-600 mb-6">{error}</p>
            </div>
          )}

          {/* Scholarships Grid/List */}
          {!loading && !error && filteredScholarships.length > 0 && (
            <div className="${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 lg:grid-cols-2 gap-8' 
                : 'space-y-6'
            }">
              {filteredScholarships.map((scholarship, index) => (
                <div 
                  key={scholarship.id} 
                  className="bg-white rounded-3xl shadow-xl hover:shadow-2xl  overflow-hidden hover:-translate-y-2 transform border border-gray-100"
                  style={{animationDelay: `${index * 100}ms`}}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="p-8">
                      {/* Header */}
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-3">
                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${getStatusColor(scholarship.status)} shadow-lg`}>
                              {scholarship.status}
                            </span>
                            <span className={`px-4 py-2 rounded-full text-xs font-bold ${getCategoryColor(scholarship.category)} shadow-lg`}>
                              {scholarship.category}
                            </span>
                          </div>
                          <h3 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
                            {scholarship.title}
                          </h3>
                          <p className="text-blue-600 font-semibold text-lg mb-4">{scholarship.provider}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-3xl font-black text-gray-900 mb-1">{scholarship.amount}</div>
                          <div className="text-sm text-gray-500 font-medium">{scholarship.level}</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mb-6 leading-relaxed line-clamp-3">
                        {scholarship.description}
                      </p>

                      {/* Deadline */}
                      <div className="flex items-center mb-6 p-4 bg-blue-50 rounded-2xl border border-blue-100">
                        <svg className="w-5 h-5 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <div>
                          <div className="text-sm font-semibold text-blue-900">Application Deadline</div>
                          <div className="text-blue-700 font-bold">{scholarship.deadline}</div>
                        </div>
                        {getDaysLeft(scholarship.deadline) && (
                          <div className="ml-auto text-right">
                            <div className="text-xs text-blue-600 font-medium">Days Left</div>
                            <div className="text-lg font-black text-blue-700">{getDaysLeft(scholarship.deadline)}</div>
                          </div>
                        )}
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2 mb-6">
                        {scholarship.tags.slice(0, 3).map(tag => (
                          <span key={tag} className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full font-medium">
                            {tag}
                          </span>
                        ))}
                        {scholarship.tags.length > 3 && (
                          <span className="px-3 py-1 bg-gray-200 text-gray-600 text-xs rounded-full font-medium">
                            +{scholarship.tags.length - 3} more
                          </span>
                        )}
                      </div>

                      {/* Action Button */}
                      <div className="flex gap-3">
                        <a 
                          href={scholarship.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex-1 px-6 py-3 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700  shadow-lg hover:shadow-xl text-center"
                        >
                          Apply Now
                        </a>
                      </div>
                    </div>
                  ) : (
                    // List View
                    <div className="p-6 flex items-center gap-6">
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="px-3 py-1 rounded-full text-xs font-bold">
                                {scholarship.status}
                              </span>
                              <span className="px-3 py-1 rounded-full text-xs font-bold">
                                {scholarship.category}
                              </span>
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {scholarship.title}
                            </h3>
                            <p className="text-blue-600 font-semibold text-sm mb-2">{scholarship.provider}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-gray-900 mb-1">{scholarship.amount}</div>
                            <div className="text-xs text-gray-500 font-medium">{scholarship.level}</div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                          <span className="flex items-center gap-1">
                            <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Deadline: {scholarship.deadline}
                          </span>
                          {getDaysLeft(scholarship.deadline) && (
                            <span className="text-blue-600 font-semibold">
                              {getDaysLeft(scholarship.deadline)} days left
                            </span>
                          )}
                        </div>

                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {scholarship.description}
                        </p>

                        <div className="flex flex-wrap gap-2 mb-3">
                          {scholarship.tags.slice(0, 4).map(tag => (
                            <span key={tag} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                          {scholarship.tags.length > 4 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                              +{scholarship.tags.length - 4} more
                            </span>
                          )}
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center gap-3">
                            <a 
                              href={scholarship.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-lg hover:bg-blue-700 "
                            >
                              Apply Now
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          
          {/* No Results */}
          {!loading && !error && filteredScholarships.length === 0 && (
            <div className="text-center py-20">
              <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 border border-gray-200">
                <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">No scholarships found</h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">Try adjusting your search term or filters to find what you're looking for.</p>
              <button 
                onClick={() => {
                  setSearchTerm("");
                  setSelectedCategory("All");
                  setSelectedLevel("All");
                  setSelectedStatus("Open");
                }}
                className="px-8 py-4 bg-gradient-to-r from-black from-20% via-blue-600 via-50% to-black to-80% text-white font-semibold rounded-xl hover:from-gray-900 hover:from-20% hover:via-blue-700 hover:via-50% hover:to-gray-900 hover:to-80%  shadow-lg hover:shadow-xl"
              >
                Clear All Filters
              </button>
            </div>
          )}

          {/* Popular Categories Section */}
          {!loading && !error && (
            <div className="mt-20">
              <h2 className="text-4xl font-bold text-gray-900 mb-12 text-center">Popular Categories</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
                {categories.filter(c => c !== "All").map(category => (
                  <button 
                    key={category} 
                    onClick={() => setSelectedCategory(category)} 
                    className="p-8 bg-white/95 backdrop-blur-sm rounded-3xl shadow-xl hover:shadow-2xl  text-center group hover:-translate-y-2 border border-gray-100"
                  >
                    <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:from-blue-200 group-hover:to-gray-200  border border-blue-200">
                      <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-2">{category}</h3>
                    <p className="text-sm text-gray-600 font-medium">
                      {scholarships.filter(s => s.category === category).length} scholarships
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


