"use client";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { HeroSection } from "@/components/HeroSection";
import CornerChatbot from "@/components/CornerChatbot";
import { CareerService, DegreeOverview } from "@/lib/supabaseClient";
import { easeOut } from "framer-motion";

// Animation variants
const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const cardVariants = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.4, ease: easeOut }
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function CareerPathsPage() {
  const [loaded, setLoaded] = useState(false);
  const [selectedDegree, setSelectedDegree] = useState<DegreeOverview | null>(null);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  // React Query for data fetching (Fixed: Removed deprecated onSuccess)
  const { 
    data: careerPathsData = [], 
    isLoading, 
    error,
    refetch,
    isSuccess
  } = useQuery({
    queryKey: ['career-paths'],
    queryFn: CareerService.getDegreeOverviews,
    staleTime: 10 * 60 * 1000, // 10 minutes
    retry: 3,
    refetchOnWindowFocus: false, // Added: Prevent unnecessary refetches
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Fixed: Use isSuccess instead of deprecated onSuccess callback
  useEffect(() => {
    if (isSuccess && careerPathsData.length > 0 && !selectedDegree) {
      setSelectedDegree(careerPathsData[0]);
    }
  }, [isSuccess, careerPathsData, selectedDegree]);

  const handleNodeClick = (nodeTitle: string) => {
    setSelectedNode(nodeTitle);
    setShowChatbot(true);
  };

  // Loading state
  if (isLoading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
            <motion.p
              className="text-gray-600 text-lg"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              Loading career paths...
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Error state
  if (error) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-gray-50 via-red-50 to-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        
        <div className="flex items-center justify-center min-h-screen">
          <motion.div
            className="text-center p-8 bg-white rounded-2xl shadow-lg max-w-md"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
          >
            <div className="text-red-600 text-2xl font-bold mb-4">⚠️ Error</div>
            <p className="text-gray-600 mb-4">
              {error instanceof Error ? error.message : 'Failed to load career paths'}
            </p>
            <motion.button
              onClick={() => refetch()}
              className="px-6 py-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Retry
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  // Fixed: Add safety checks for undefined data
  const totalCareers = careerPathsData?.reduce((sum, degree) => sum + (degree.jobs?.length || 0), 0) || 0;
  const totalStudies = careerPathsData?.reduce((sum, degree) => sum + (degree.higher_studies?.length || 0), 0) || 0;

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-white"
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
    >
      
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
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: loaded ? 1 : 0, y: loaded ? 0 : 20 }}
            transition={{ duration: 0.5 }}
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg">
              <motion.h2 
                className="text-2xl font-bold text-gray-800 mb-6 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Select a Degree to Explore
              </motion.h2>
              
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {careerPathsData && careerPathsData.length > 0 ? (
                  careerPathsData.map((degree) => (
                    <motion.button
                      key={degree.id}
                      onClick={() => setSelectedDegree(degree)}
                      className={`p-6 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedDegree?.id === degree.id
                          ? 'bg-blue-600 text-white shadow-lg border-blue-600'
                          : 'bg-white text-gray-800 hover:shadow-lg border-gray-200 hover:border-blue-300'
                      }`}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap={{ scale: 0.98 }}
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
                    </motion.button>
                  ))
                ) : (
                  <motion.div 
                    className="col-span-full text-center py-8 text-gray-500"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    No degree programs available
                  </motion.div>
                )}
              </motion.div>
            </div>
          </motion.div>
          
          {/* Selected Degree Details */}
          <AnimatePresence mode="wait">
            {selectedDegree && (
              <motion.div
                key={selectedDegree.id}
                className="space-y-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                {/* Career Options */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-4 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                  >
                    <motion.div
                      className="w-6 h-6 bg-blue-600 rounded mr-3"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    />
                    Career Options with {selectedDegree.degree}
                  </motion.h3>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {selectedDegree.jobs && selectedDegree.jobs.length > 0 ? (
                      selectedDegree.jobs.map((job, index) => (
                        <motion.div
                          key={job.id}
                          className="p-4 bg-blue-50 rounded-lg border border-blue-200 hover:bg-blue-100 transition-colors cursor-pointer group"
                          onClick={() => handleNodeClick(job.job_title)}
                          variants={cardVariants}
                          whileHover="hover"
                          whileTap={{ scale: 0.98 }}
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
                              {job.required_skills.slice(0, 3).map((skill, skillIndex) => (
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
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No career options available for this degree
                      </div>
                    )}
                  </motion.div>
                </motion.div>
                
                {/* Higher Studies Options */}
                <motion.div 
                  className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg"
                  variants={cardVariants}
                  initial="initial"
                  animate="animate"
                >
                  <motion.h3 
                    className="text-xl font-bold text-gray-800 mb-4 flex items-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <motion.div
                      className="w-6 h-6 bg-purple-600 rounded mr-3"
                      whileHover={{ rotate: 90 }}
                      transition={{ duration: 0.2 }}
                    />
                    Higher Studies Options
                  </motion.h3>
                  
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {selectedDegree.higher_studies && selectedDegree.higher_studies.length > 0 ? (
                      selectedDegree.higher_studies.map((study, index) => (
                        <motion.div
                          key={study.id}
                          className="p-4 bg-purple-50 rounded-lg border border-purple-200 hover:bg-purple-100 transition-colors cursor-pointer group"
                          onClick={() => handleNodeClick(study.study_title)}
                          variants={cardVariants}
                          whileHover="hover"
                          whileTap={{ scale: 0.98 }}
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
                              {study.specializations.slice(0, 3).map((spec, specIndex) => (
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
                        </motion.div>
                      ))
                    ) : (
                      <div className="col-span-full text-center py-8 text-gray-500">
                        No higher studies options available for this degree
                      </div>
                    )}
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <CornerChatbot
        isOpen={showChatbot}
        onClose={() => setShowChatbot(false)}
        initialMessage={selectedNode ? `Tell me more about ${selectedNode}` : "Hi!"}
        context={selectedNode || "Career path mapping"}
      />
    </motion.div>
  );
}