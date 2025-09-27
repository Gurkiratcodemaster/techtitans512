"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { HeroSection } from "@/components/HeroSection";
import CornerChatbot from "@/components/CornerChatbot";
import { CareerService, DegreeOverview } from "@/lib/database";
import CareerVisualization from '@/components/CareerVisualization';
import { Layers, Grid3X3, Network, BarChart3 } from 'lucide-react';

export default function CareerPathsPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<DegreeOverview | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [visualizationMode, setVisualizationMode] = useState<'grid' | 'flow' | 'network' | 'enhanced'>('grid');

  const { 
    data: careerPathsData, 
    isLoading, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['careerPaths'],
    queryFn: CareerService.getCareerPaths,
  });

  useEffect(() => {
    if (careerPathsData) {
      setLoaded(true);
    }
  }, [careerPathsData]);

  // Handle node click for chatbot
  const handleNodeClick = (nodeTitle: string) => {
    setSelectedNode(nodeTitle);
    setShowChatbot(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4 animate-spin" />
            <p className="text-gray-600 text-lg">Loading career paths...</p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white">
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md">
            <div className="text-red-600 text-2xl font-bold mb-4">⚠️ Error</div>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load career paths'}
            </p>
            <button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const totalCareers = careerPathsData?.reduce((sum, degree) => sum + (degree.jobs?.length || 0), 0) || 0;
  const totalStudies = careerPathsData?.reduce((sum, degree) => sum + (degree.higher_studies?.length || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white">
      <HeroSection 
        title="Career Path Explorer"
        subtitle="Discover diverse career opportunities and plan your academic journey"
        loaded={loaded}
        stats={[
          { value: careerPathsData?.length || 0, label: 'Degree Programs' },
          { value: totalCareers, label: 'Career Options' },
          { value: totalStudies, label: 'Study Paths' }
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-6xl mx-auto">
          
          {/* Degree Selection */}
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                Select a Degree to Explore
              </h2>
              
              {/* Visualization Mode Toggle */}
              <div className="flex justify-center mb-6">
                <div className="bg-gray-100 rounded-xl p-1 shadow-inner">
                  {[
                    { mode: 'grid', icon: Grid3X3, label: 'Grid View' },
                    { mode: 'flow', icon: BarChart3, label: 'Flow Chart' },
                    { mode: 'network', icon: Network, label: 'Network Graph' },
                    { mode: 'enhanced', icon: Layers, label: 'Interactive' }
                  ].map(({ mode, icon: Icon, label }) => (
                    <button
                      key={mode}
                      onClick={() => setVisualizationMode(mode as any)}
                      className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center space-x-2 ${
                        visualizationMode === mode
                          ? 'bg-blue-600 text-white shadow-md' 
                          : 'text-gray-600 hover:text-blue-600 hover:bg-white/50'
                      }`}
                    >
                      <Icon size={16} />
                      <span className="text-sm font-medium hidden sm:inline">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {careerPathsData && careerPathsData.length > 0 ? (
                  careerPathsData.map((degree) => (
                    <button
                      key={degree.id}
                      onClick={() => setSelectedDegree(degree)}
                      className={`p-6 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedDegree?.id === degree.id
                          ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                          : 'bg-white text-gray-800 hover:shadow-lg border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      <h3 className="font-bold text-lg mb-2">{degree.degree}</h3>
                      <p className={`text-sm mb-2 ${
                        selectedDegree?.id === degree.id ? 'text-blue-100' : 'text-gray-600'
                      }`}>
                        {degree.description}
                      </p>
                      {degree.duration && (
                        <p className={`text-xs opacity-75 mb-2 ${
                          selectedDegree?.id === degree.id ? 'text-blue-200' : 'text-gray-500'
                        }`}>
                          Duration: {degree.duration} • Difficulty: {degree.difficulty || 'N/A'}
                        </p>
                      )}
                      <div className="text-xs opacity-75">
                        {degree.jobs?.length || 0} careers • {degree.higher_studies?.length || 0} study options
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="col-span-full text-center py-8 text-gray-500">
                    No degree programs available
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Selected Degree Details */}
          {selectedDegree && (
            <div key={selectedDegree.id} className="space-y-6">
              {visualizationMode === 'grid' ? (
                <>
                  {/* Career Options */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-blue-600 rounded mr-3" />
                      Career Options with {selectedDegree.degree}
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDegree.jobs && selectedDegree.jobs.length > 0 ? (
                        selectedDegree.jobs.map((job, index) => (
                          <div
                            key={job.id}
                            className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer group"
                            onClick={() => handleNodeClick(job.job_title)}
                          >
                            <div className="font-semibold text-gray-800 mb-2 group-hover:text-blue-700 transition-colors">
                              {job.job_title}
                            </div>
                            {job.salary_range && (
                              <div className="text-sm text-green-600 font-medium mb-1">
                                💰 {job.salary_range}
                              </div>
                            )}
                            {job.job_description && (
                              <div className="text-sm text-gray-600 mb-2">
                                {job.job_description}
                              </div>
                            )}
                            {job.required_skills && job.required_skills.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {job.required_skills.slice(0, 3).map((skill: string, skillIndex: number) => (
                                  <span
                                    key={skillIndex}
                                    className="px-2 py-1 text-xs bg-blue-200 text-blue-800 rounded-full"
                                  >
                                    {skill}
                                  </span>
                                ))}
                                {job.required_skills.length > 3 && (
                                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                    +{job.required_skills.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          No career options available for this degree
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Higher Studies Options */}
                  <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg">
                    <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
                      <div className="w-6 h-6 bg-purple-600 rounded mr-3" />
                      Higher Studies Options
                    </h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedDegree.higher_studies && selectedDegree.higher_studies.length > 0 ? (
                        selectedDegree.higher_studies.map((study, index) => (
                          <div
                            key={study.id}
                            className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer group"
                            onClick={() => handleNodeClick(study.study_title)}
                          >
                            <div className="font-semibold text-gray-800 mb-2 group-hover:text-purple-700 transition-colors">
                              {study.study_title}
                            </div>
                            {study.duration && (
                              <div className="text-sm text-blue-600 font-medium mb-1">
                                ⏱️ {study.duration}
                              </div>
                            )}
                            {study.study_description && (
                              <div className="text-sm text-gray-600 mb-2">
                                {study.study_description}
                              </div>
                            )}
                            {study.specializations && study.specializations.length > 0 && (
                              <div className="flex flex-wrap gap-1 mt-2">
                                {study.specializations.slice(0, 3).map((spec: string, specIndex: number) => (
                                  <span
                                    key={specIndex}
                                    className="px-2 py-1 text-xs bg-purple-200 text-purple-800 rounded-full"
                                  >
                                    {spec}
                                  </span>
                                ))}
                                {study.specializations.length > 3 && (
                                  <span className="px-2 py-1 text-xs bg-gray-200 text-gray-600 rounded-full">
                                    +{study.specializations.length - 3} more
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))
                      ) : (
                        <div className="col-span-full text-center py-8 text-gray-500">
                          No higher studies options available for this degree
                        </div>
                      )}
                    </div>
                  </div>
                </>
              ) : (
                // D3 Visualization
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg min-h-[600px]">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-800 flex items-center">
                      <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded mr-3" />
                      Career Path Visualization: {selectedDegree.degree}
                    </h3>
                    <div className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                      {visualizationMode.charAt(0).toUpperCase() + visualizationMode.slice(1)} View
                    </div>
                  </div>
                  
                  <CareerVisualization 
                    mode={visualizationMode}
                    selectedDegree={selectedDegree.degree}
                    careerData={{
                      degree: selectedDegree,
                      jobs: selectedDegree.jobs || [],
                      studies: selectedDegree.higher_studies || [],
                      skills: selectedDegree.jobs?.flatMap(job => job.required_skills || []) || []
                    }}
                    onNodeClick={handleNodeClick}
                    width={800}
                    height={500}
                  />
                  
                  {/* Visualization Info Panel */}
                  <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
                    <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                      💡 Visualization Guide
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                        <span>Career Opportunities</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                        <span>Higher Studies</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span>Skills & Requirements</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <CornerChatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        initialMessage={selectedNode ? `Tell me more about ${selectedNode}` : "Hi!"}
        context={selectedNode || "Career path mapping"}
      />
    </div>
  );
}