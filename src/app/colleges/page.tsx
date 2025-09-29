"use client";
import { useState, useEffect } from "react";
import HeroSection from "@/components/HeroSection";
import { supabase } from "@/lib/database";

interface College {
  id: string;
  name: string;
  location: string;
  state: string;
  city: string;
  type: 'ENGINEERING' | 'MEDICAL' | 'BUSINESS' | 'ARTS' | 'SCIENCE' | 'LAW' | 'MIXED' | 'TECHNICAL';
  rating?: number;
  established?: number;
  courses: string[];
  fees?: string;
  placement?: string;
  website?: string;
  phone?: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
}

export default function CollegesPage() {
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  useEffect(() => {
    const timer = setTimeout(() => {
      
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    async function loadColleges() {
      try {
        setLoading(true);
        setError(null);

        const { data, error } = await supabase
          .from("colleges")
          .select("*");

        if (error) throw error;

        setAllColleges(data as College[]);
        setFilteredColleges(data as College[]);
      } catch (err) {
        console.error("Error loading colleges:", err);
        setError("Failed to load colleges. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    loadColleges();
  }, []);

  // Dynamic filter options
  const states = [...new Set(allColleges.map(college => college.state))].sort();
  const types = [...new Set(allColleges.map(college => college.type))];
  const allCourses = [...new Set(allColleges.flatMap(college => college.courses))].sort();

  // Filtering logic
  useEffect(() => {
    let filtered = allColleges;

    if (searchTerm) {
      filtered = filtered.filter(college =>
        college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        college.state.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedState) {
      filtered = filtered.filter(college => college.state === selectedState);
    }

    if (selectedType) {
      filtered = filtered.filter(college => college.type === selectedType);
    }

    if (selectedCourse) {
      filtered = filtered.filter(college => college.courses.includes(selectedCourse));
    }

    setFilteredColleges(filtered);
  }, [searchTerm, selectedState, selectedType, selectedCourse, allColleges]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedType("");
    setSelectedCourse("");
    setFilteredColleges(allColleges);
  };

  const getTypeColor = (type: string) => {
    const colors = {
      'ENGINEERING': 'bg-blue-100 text-blue-800 border-blue-200',
      'MEDICAL': 'bg-gray-100 text-gray-800 border-gray-200',
      'BUSINESS': 'bg-blue-50 text-blue-700 border-blue-200',
      'ARTS': 'bg-gray-200 text-gray-800 border-gray-300',
      'SCIENCE': 'bg-blue-200 text-blue-800 border-blue-300',
      'LAW': 'bg-gray-100 text-black border-gray-200',
      'MIXED': 'bg-blue-100 text-blue-900 border-blue-200',
      'TECHNICAL': 'bg-gray-50 text-gray-700 border-gray-200'
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-gray-100">
      
      {/* Hero Section */}
      <HeroSection
        title="Colleges Directory"
        subtitle="Discover the perfect college for your career journey"
        stats={[
          { value: allColleges.length.toString(), label: "Total Colleges" },
          { value: states.length.toString(), label: "States Covered" },
          { value: types.length.toString(), label: "College Types" }
        ]}
        
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Filters Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex flex-wrap gap-4 items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Find Your Perfect College</h2>
            
            {/* View Mode Toggle */}
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">View:</span>
              <button
                onClick={() => setViewMode('grid')}
                className="p-2 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className="p-2 rounded-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search Bar */}
            <div className="relative lg:col-span-2">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search colleges, location, or state..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent "
              />
            </div>

            {/* State Filter */}
            <select 
              value={selectedState} 
              onChange={(e) => setSelectedState(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            >
              <option value="">All States</option>
              {states.map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>

            {/* Type Filter */}
            <select 
              value={selectedType} 
              onChange={(e) => setSelectedType(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            >
              <option value="">All Types</option>
              {types.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>

            {/* Course Filter */}
            <select 
              value={selectedCourse} 
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent "
            >
              <option value="">All Courses</option>
              {allCourses.map((course) => (
                <option key={course} value={course}>{course}</option>
              ))}
            </select>
          </div>

          {/* Results Count and Reset */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Showing <span className="font-semibold text-blue-600">{filteredColleges.length}</span> of <span className="font-semibold">{allColleges.length}</span> colleges
            </p>
            {(searchTerm || selectedState || selectedType || selectedCourse) && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200  flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filters
              </button>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="flex items-center gap-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-lg text-gray-600">Loading colleges...</span>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-red-800 font-medium">{error}</p>
            </div>
          </div>
        )}

        {/* Colleges Grid/List */}
        {!loading && !error && (
          <>
            {filteredColleges.length > 0 ? (
              <div className={viewMode === 'grid' 
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
              }>
                {filteredColleges.map((college, index) => (
                  <div
                    key={college.id}
                    className="bg-white rounded-2xl shadow-lg hover:shadow-xl  transform hover:-translate-y-1"
                    style={{ 
                      transitionDelay: `${Math.min(index * 100, 800)}ms`,
                      animation: loaded ? `slideInUp 0.6s ease-out ${Math.min(index * 0.1, 0.8)}s both` : undefined
                    }}
                  >
                    {viewMode === 'grid' ? (
                      // Grid View
                      <div className="p-6">
                        {/* Header */}
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-800 mb-2 line-clamp-2">
                              {college.name}
                            </h3>
                            <div className="flex items-center text-gray-600 mb-3">
                              <svg className="w-4 h-4 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              <span className="text-sm">{college.city}, {college.state}</span>
                            </div>
                          </div>
                          {college.rating && (
                            <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                              <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-sm font-medium text-gray-700">{college.rating}/10</span>
                            </div>
                          )}
                        </div>

                        {/* Type Badge */}
                        <div className="mb-4">
                          <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold border">
                            {college.type}
                          </span>
                        </div>

                        {/* Courses */}
                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-gray-700 mb-2">Courses Offered</h4>
                          <div className="flex flex-wrap gap-1">
                            {college.courses.slice(0, 3).map((course, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {course}
                              </span>
                            ))}
                            {college.courses.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{college.courses.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-2 mb-4">
                          {college.established && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              Est. {college.established}
                            </div>
                          )}
                          {college.fees && (
                            <div className="flex items-center text-sm text-gray-600">
                              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                              {college.fees}
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex gap-2">
                          {college.website && (
                            <a
                              href={college.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                              Visit Website
                            </a>
                          )}
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                            Details
                          </button>
                        </div>
                      </div>
                    ) : (
                      // List View
                      <div className="p-6 flex items-center gap-6">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h3 className="text-xl font-bold text-gray-800">
                              {college.name}
                            </h3>
                            {college.rating && (
                              <div className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded-lg">
                                <svg className="w-4 h-4 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                </svg>
                                <span className="text-sm font-medium text-gray-700">{college.rating}/10</span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600 mb-3">
                            <span className="flex items-center gap-1">
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              </svg>
                              {college.city}, {college.state}
                            </span>
                            <span className="px-2 py-1 rounded-full text-xs font-semibold border">
                              {college.type}
                            </span>
                            {college.established && <span>Est. {college.established}</span>}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-3">
                            {college.courses.slice(0, 5).map((course, idx) => (
                              <span key={idx} className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
                                {course}
                              </span>
                            ))}
                            {college.courses.length > 5 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                                +{college.courses.length - 5} more
                              </span>
                            )}
                          </div>
                          {college.fees && (
                            <p className="text-sm text-gray-600">
                              <span className="font-medium">Fees:</span> {college.fees}
                            </p>
                          )}
                        </div>
                        <div className="flex gap-2">
                          {college.website && (
                            <a
                              href={college.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-sm font-medium"
                            >
                              Visit Website
                            </a>
                          )}
                          <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 text-sm">
                            Details
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              // No Results State
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <h3 className="text-2xl font-semibold text-gray-800 mb-2">No colleges found</h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                  Try adjusting your search criteria or filters to find more colleges.
                </p>
                {(searchTerm || selectedState || selectedType || selectedCourse) && (
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Clear All Filters
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>

      {/* CSS for animations */}
      <style jsx>{`
        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}


