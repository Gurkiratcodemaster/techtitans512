"use client";
import { useState, useEffect } from "react";
import { Navbar } from "@/components/navbar";

// College interface matching Prisma model
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
  const [loaded, setLoaded] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [filteredColleges, setFilteredColleges] = useState<College[]>([]);
  const [allColleges, setAllColleges] = useState<College[]>([]);

  // Load colleges from API
  useEffect(() => {
    async function loadColleges() {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch('/api/colleges');
        if (!response.ok) {
          throw new Error('Failed to fetch colleges');
        }
        const data = await response.json();
        setAllColleges(data.colleges);
      } catch (err) {
        console.error('Error loading colleges:', err);
        setError('Failed to load colleges. Please try again later.');
      } finally {
        setLoading(false);
      }
    }

    loadColleges();
  }, []);

  // Dynamic filter options based on loaded data
  const states = [...new Set(allColleges.map(college => college.state))].sort();
  const types = [...new Set(allColleges.map(college => college.type))];
  const allCourses = [...new Set(allColleges.flatMap(college => college.courses))].sort();

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

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
  }, [searchTerm, selectedState, selectedType, selectedCourse]);

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedState("");
    setSelectedType("");
    setSelectedCourse("");
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
              Find Your <span className="text-blue-600">Perfect College</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover government and private colleges across India with detailed information about courses, fees, and facilities.
            </p>
          </div>

          {/* Filters */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg transform transition-all duration-500 delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            <div className="grid md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search Colleges</label>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by name or location..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">State</label>
                <select
                  value={selectedState}
                  onChange={(e) => setSelectedState(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All States</option>
                  {states.map(state => (
                    <option key={state} value={state}>{state}</option>
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
                  <option value="">All Types</option>
                  {types.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Course</label>
                <select
                  value={selectedCourse}
                  onChange={(e) => setSelectedCourse(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Courses</option>
                  {allCourses.map(course => (
                    <option key={course} value={course}>{course}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Showing {filteredColleges.length} of {allColleges.length} colleges
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Colleges Grid */}
          <div className="grid gap-6">
            {filteredColleges.map((college, index) => (
              <div
                key={college.id}
                className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg transform transition-all duration-500 hover:shadow-xl ${
                  loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + index * 100}ms` }}
              >
                <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{college.name}</h3>
                        <div className="flex items-center text-gray-600 mb-2">
                          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          </svg>
                          {college.location}, {college.state}
                        </div>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                          college.type === 'ENGINEERING' ? 'bg-blue-100 text-blue-800' :
                          college.type === 'MEDICAL' ? 'bg-red-100 text-red-800' :
                          college.type === 'BUSINESS' ? 'bg-green-100 text-green-800' :
                          college.type === 'ARTS' ? 'bg-purple-100 text-purple-800' :
                          college.type === 'SCIENCE' ? 'bg-indigo-100 text-indigo-800' :
                          college.type === 'LAW' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {college.type}
                        </span>
                      </div>
                      <a
                        href={college.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Courses Offered</h4>
                        <div className="flex flex-wrap gap-2">
                          {college.courses.slice(0, 4).map(course => (
                            <span key={course} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                              {course}
                            </span>
                          ))}
                          {college.courses.length > 4 && (
                            <span className="px-2 py-1 bg-gray-200 text-gray-600 rounded text-sm">
                              +{college.courses.length - 4} more
                            </span>
                          )}
                        </div>
                      </div>

                      {college.rating && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Rating</h4>
                          <div className="text-sm text-gray-600">
                            <div>{college.rating}/10</div>
                          </div>
                        </div>
                      )}

                      <div>
                        <h4 className="font-semibold text-gray-800 mb-2">Fees</h4>
                        <div className="text-sm text-gray-600">
                          <div>{college.fees || 'Contact for details'}</div>
                        </div>
                      </div>

                      {college.placement && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Placement</h4>
                          <div className="text-sm text-gray-600">
                            <div>{college.placement}</div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      {college.established && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Established</h4>
                          <div className="text-sm text-gray-600">{college.established}</div>
                        </div>
                      )}

                      {college.website && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Website</h4>
                          <a href={college.website} target="_blank" rel="noopener noreferrer" 
                             className="text-blue-600 hover:text-blue-800 text-sm">
                            Visit Website
                          </a>
                        </div>
                      )}

                      {college.phone && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Phone</h4>
                          <div className="text-sm text-gray-600">{college.phone}</div>
                        </div>
                      )}

                      {college.email && (
                        <div>
                          <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                          <div className="text-sm text-gray-600">{college.email}</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredColleges.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V20a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No colleges found</h3>
              <p className="text-gray-600 mb-4">Try adjusting your search criteria or filters.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}