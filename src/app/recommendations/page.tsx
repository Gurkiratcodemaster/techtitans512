"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClientDatabaseService as DatabaseService, UserUtils } from "@/lib/database";

interface UserProfileData {
  fullName: string;
  age: number;
  gender: string;
  location: string;
  currentEducation: string;
  currentClass: string;
  previousAcademicPerformance?: string;
  currentSubjects: string[];
  careerInterests: string[];
  preferredStudyMode: string;
  academicGoals: string;
  strengths: string[];
  challenges: string[];
  parentOccupation?: string;
  familyIncome?: string;
  userId: string;
  onboardingCompleted: boolean;
}

interface AIRecommendation {
  id: string;
  category: 'COURSE' | 'COLLEGE' | 'CAREER' | 'STUDY_MATERIAL';
  title: string;
  description: string;
  reason: string;
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  actionUrl?: string;
  details: string[];
}

export default function RecommendationsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [userProfile, setUserProfile] = useState<UserProfileData | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendation[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }

    if (user) {
      loadUserProfile();
    }
  }, [user, loading, router]);

  const loadUserProfile = async () => {
    if (!user) return;

    try {
      const profile = await DatabaseService.getUserProfile(UserUtils.getId(user));
      
      if (profile && profile.onboardingCompleted) {
        setUserProfile({
          fullName: profile.fullName,
          age: profile.age,
          gender: profile.gender,
          location: profile.location,
          currentEducation: profile.currentEducation,
          currentClass: profile.currentClass,
          previousAcademicPerformance: profile.previousAcademicPerformance,
          currentSubjects: profile.currentSubjects,
          careerInterests: profile.careerInterests,
          preferredStudyMode: profile.preferredStudyMode,
          academicGoals: profile.academicGoals,
          strengths: profile.strengths,
          challenges: profile.challenges,
          parentOccupation: profile.parentOccupation,
          familyIncome: profile.familyIncome,
          userId: profile.userId,
          onboardingCompleted: profile.onboardingCompleted
        });
        
        await loadRecommendations(profile);
      } else {
        router.push("/onboarding");
      }
    } catch (error) {
      console.error("Error loading user profile:", error);
      router.push("/onboarding");
    }
  };

  const loadRecommendations = async (profile: any) => {
    try {
      const existingRecommendations = await DatabaseService.getAIRecommendations(profile.userId);
      
      if (existingRecommendations && existingRecommendations.length > 0) {
        const formattedRecs = existingRecommendations.map((rec: any) => ({
          id: rec.id,
          category: rec.category,
          title: rec.title,
          description: rec.description,
          reason: rec.reason,
          priority: rec.priority,
          actionUrl: rec.actionUrl || undefined,
          details: rec.details
        }));
        setRecommendations(formattedRecs);
      } else {
        await generateRecommendations(profile);
      }
    } catch (error) {
      console.error("Error loading recommendations:", error);
      await generateRecommendations(profile);
    }
  };

  const generateRecommendations = async (profile: UserProfileData) => {
    setIsGenerating(true);
    
    try {
      const generatedRecommendations: Omit<AIRecommendation, 'id'>[] = [];

      if (profile.careerInterests.includes('ENGINEERING_TECHNOLOGY')) {
        generatedRecommendations.push({
          category: 'COURSE',
          title: 'JEE Main & Advanced Preparation',
          description: 'Comprehensive engineering entrance exam preparation',
          reason: `Recommended for your Engineering & Technology interest`,
          priority: 'HIGH',
          details: [
            'Physics, Chemistry, Mathematics intensive course',
            'Mock tests and previous year papers',
            'Online and offline study materials',
            'Doubt clearing sessions'
          ]
        });
      }

      if (profile.careerInterests.includes('MEDICAL_HEALTHCARE')) {
        generatedRecommendations.push({
          category: 'COURSE',
          title: 'NEET Preparation Course',
          description: 'Medical entrance exam preparation',
          reason: 'Perfect match for Medical & Healthcare interest',
          priority: 'HIGH',
          details: [
            'Biology, Chemistry, Physics focused curriculum',
            'AIIMS and JIPMER preparation included',
            'Medical terminology and basics',
            'Hospital visit opportunities'
          ]
        });
      }

      generatedRecommendations.push({
        category: 'COLLEGE',
        title: `Top Colleges near ${profile.location}`,
        description: 'Recommended colleges in your area',
        reason: `Located near ${profile.location} and matches your interests`,
        priority: 'MEDIUM',
        details: [
          'Local Engineering College - Engineering (4.2/5)',
          'State Medical College - Medical (4.5/5)',
          'Business Management Institute - Management (4.1/5)',
          'Arts & Sciences College - Liberal Arts (4.0/5)'
        ]
      });

      if (profile.strengths.includes('Analytical Thinking')) {
        generatedRecommendations.push({
          category: 'CAREER',
          title: 'Software Engineering Career Path',
          description: 'High-growth career in technology sector',
          reason: 'Your analytical thinking skills make this ideal',
          priority: 'HIGH',
          details: [
            'Average starting salary: ₹6-12 LPA',
            'High growth potential',
            'Remote work opportunities',
            'Continuous learning and innovation'
          ]
        });
      }

      generatedRecommendations.push({
        category: 'STUDY_MATERIAL',
        title: 'Personalized Study Plan',
        description: 'Custom study materials for your learning style',
        reason: 'Tailored for your preferences and education level',
        priority: 'HIGH',
        details: [
          'Subject-wise study schedule',
          'Practice tests and quizzes',
          'Video lectures and tutorials',
          'Progress tracking system'
        ]
      });

      if (profile.challenges.includes('Mathematics')) {
        generatedRecommendations.push({
          category: 'STUDY_MATERIAL',
          title: 'Mathematics Improvement Course',
          description: 'Focused mathematics course',
          reason: 'Identified as an area for improvement',
          priority: 'HIGH',
          details: [
            'Basic to advanced mathematics concepts',
            'Step-by-step problem solving',
            'Practice worksheets',
            'One-on-one doubt sessions'
          ]
        });
      }

      await DatabaseService.saveAIRecommendations(profile.userId, generatedRecommendations);
      const savedRecommendations = await DatabaseService.getAIRecommendations(profile.userId);
      
      const formattedRecs = savedRecommendations.map((rec: any) => ({
        id: rec.id,
        category: rec.category,
        title: rec.title,
        description: rec.description,
        reason: rec.reason,
        priority: rec.priority,
        actionUrl: rec.actionUrl || undefined,
        details: rec.details
      }));
      
      setRecommendations(formattedRecs);
    } catch (error) {
      console.error("Error generating recommendations:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const filteredRecommendations = selectedCategory === 'all' 
    ? recommendations 
    : recommendations.filter(rec => rec.category === selectedCategory);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH': return 'bg-red-100 text-red-800';
      case 'MEDIUM': return 'bg-yellow-100 text-yellow-800';
      case 'LOW': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'COURSE':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
        );
      case 'COLLEGE':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
        );
      case 'CAREER':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
          </svg>
        );
      case 'STUDY_MATERIAL':
        return (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-20 px-8 pb-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Hi {userProfile.fullName}! 👋
            </h1>
            <p className="text-lg text-gray-600 mb-4">
              Here are your personalized AI-powered recommendations
            </p>
            <p className="text-sm text-blue-600">
              Based on your profile: {userProfile.currentClass} • {userProfile.location} • 
              {userProfile.careerInterests.slice(0, 2).join(", ").replace(/_/g, " ")}
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <Link 
              href="/quiz/aptitude" 
              className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">Take Aptitude Quiz</h3>
                  <p className="text-sm opacity-90">Get more personalized recommendations</p>
                </div>
              </div>
            </Link>

            <button 
              onClick={() => router.push("/chatbot")}
              className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">AI Career Counselor</h3>
                  <p className="text-sm opacity-90">Chat with personalized guidance</p>
                </div>
              </div>
            </button>

            <Link 
              href="/profile" 
              className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              <div className="flex items-center">
                <svg className="w-8 h-8 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div>
                  <h3 className="font-bold text-lg">Update Profile</h3>
                  <p className="text-sm opacity-90">Refresh your recommendations</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Category Filter */}
          <div className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filter Recommendations</h2>
            <div className="flex flex-wrap gap-3">
              {[
                { key: 'all', label: 'All Recommendations' },
                { key: 'COURSE', label: 'Courses' },
                { key: 'COLLEGE', label: 'Colleges' },
                { key: 'CAREER', label: 'Career Paths' },
                { key: 'STUDY_MATERIAL', label: 'Study Materials' }
              ].map(category => (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-white text-gray-700 hover:bg-blue-50'
                  }`}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>

          {/* Loading State */}
          {isGenerating && (
            <div className="text-center py-12">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-600">Generating personalized recommendations...</p>
            </div>
          )}

          {/* Recommendations Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredRecommendations.map(recommendation => (
              <div key={recommendation.id} className="bg-white/70 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <div className="p-2 bg-blue-100 rounded-lg mr-3">
                      {getCategoryIcon(recommendation.category)}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800">{recommendation.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(recommendation.priority)}`}>
                        {recommendation.priority} PRIORITY
                      </span>
                    </div>
                  </div>
                </div>

                <p className="text-gray-600 mb-3">{recommendation.description}</p>
                
                <div className="bg-blue-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-blue-700">
                    <strong>Why recommended:</strong> {recommendation.reason}
                  </p>
                </div>

                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Key Details:</h4>
                  <ul className="space-y-1">
                    {recommendation.details.map((detail, index) => (
                      <li key={index} className="text-sm text-gray-600 flex items-center">
                        <svg className="w-4 h-4 text-blue-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                        </svg>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>

                <button className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 font-medium">
                  Learn More
                </button>
              </div>
            ))}
          </div>

          {filteredRecommendations.length === 0 && !isGenerating && (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">No recommendations found for the selected category.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}