"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
// Supabase auth; placeholder for updating user metadata if needed later
import { supabase } from "@/lib/supabaseClient";
import { ClientDatabaseService } from "@/lib/client-database";
import { validateAndConvertFormData } from "@/lib/enum-converters";

interface UserProfileData {
  // Personal Information
  fullName: string;
  age: string;
  gender: string;
  location: string;
  
  // Educational Information
  currentEducation: string;
  currentClass: string;
  previousAcademicPerformance: string;
  currentSubjects: string[];
  
  // Interests and Goals
  careerInterests: string[];
  preferredStudyMode: string;
  academicGoals: string;
  
  // Additional Context
  strengths: string[];
  challenges: string[];
  parentOccupation: string;
  familyIncome: string;
}

export default function OnboardingPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<UserProfileData>({
    fullName: "",
    age: "",
    gender: "",
    location: "",
    currentEducation: "",
    currentClass: "",
    previousAcademicPerformance: "",
    currentSubjects: [],
    careerInterests: [],
    preferredStudyMode: "",
    academicGoals: "",
    strengths: [],
    challenges: [],
    parentOccupation: "",
    familyIncome: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const totalSteps = 4;

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setFormData(prev => ({
        ...prev,
        fullName: user.displayName || ""
      }));
    }
  }, [user, loading, router]);

  const handleInputChange = (field: keyof UserProfileData, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field: keyof UserProfileData, value: string) => {
    setFormData(prev => {
      const currentArray = prev[field] as string[];
      const newArray = currentArray.includes(value)
        ? currentArray.filter(item => item !== value)
        : [...currentArray, value];
      return {
        ...prev,
        [field]: newArray
      };
    });
  };

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setError("");

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user display name if changed (Supabase: store in your profile table later)
      // You can sync to Supabase user metadata if desired.

      // Save user profile data to database
      const convertedData = validateAndConvertFormData({
        userId: user.uid,
        fullName: formData.fullName,
        age: formData.age,
        gender: formData.gender,
        location: formData.location,
        currentEducation: formData.currentEducation,
        currentClass: formData.currentClass,
        previousAcademicPerformance: formData.previousAcademicPerformance,
        currentSubjects: formData.currentSubjects,
        careerInterests: formData.careerInterests,
        preferredStudyMode: formData.preferredStudyMode,
        academicGoals: formData.academicGoals,
        strengths: formData.strengths,
        challenges: formData.challenges,
        parentOccupation: formData.parentOccupation,
        familyIncome: formData.familyIncome,
      });
      
      console.log('Converted form data:', convertedData);
      
      await ClientDatabaseService.createUserProfile(convertedData);
      
      // Redirect to recommendations page
      router.push("/recommendations");
    } catch (error: any) {
      console.error("Error saving profile:", error);
      setError("Failed to save profile. Please try again.");
      setIsSubmitting(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.fullName && formData.age && formData.gender && formData.location;
      case 2:
        return formData.currentEducation && formData.currentClass && formData.currentSubjects.length > 0;
      case 3:
        return formData.careerInterests.length > 0 && formData.preferredStudyMode && formData.academicGoals;
      case 4:
        return formData.strengths.length > 0;
      default:
        return false;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="px-8 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome to Career Choice!</h1>
            <p className="text-lg text-gray-600 mb-4">Let's personalize your career guidance experience</p>
            
            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-blue-600 to-indigo-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              ></div>
            </div>
            <p className="text-sm text-gray-500">Step {currentStep} of {totalSteps}</p>
          </div>

          {/* Form Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6">
                {error}
              </div>
            )}

            {/* Step 1: Personal Information */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Personal Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => handleInputChange('fullName', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="Enter your full name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age *</label>
                    <select
                      value={formData.age}
                      onChange={(e) => handleInputChange('age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">Select age</option>
                      {Array.from({ length: 50 }, (_, i) => i + 13).map(age => (
                        <option key={age} value={age}>{age}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender *</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => handleInputChange('gender', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location (City, State) *</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., Mumbai, Maharashtra"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Educational Information */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Educational Background</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Education Level *</label>
                  <select
                    value={formData.currentEducation}
                    onChange={(e) => handleInputChange('currentEducation', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select education level</option>
                    <option value="high-school">High School (9th-10th)</option>
                    <option value="senior-secondary">Senior Secondary (11th-12th)</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="diploma">Diploma Course</option>
                    <option value="professional">Professional Course</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Current Class/Year *</label>
                  <input
                    type="text"
                    value={formData.currentClass}
                    onChange={(e) => handleInputChange('currentClass', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    placeholder="e.g., 12th Grade, 2nd Year B.Tech, Final Year MBA"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Previous Academic Performance</label>
                  <select
                    value={formData.previousAcademicPerformance}
                    onChange={(e) => handleInputChange('previousAcademicPerformance', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select performance</option>
                    <option value="excellent">Excellent (90%+ or A grade)</option>
                    <option value="good">Good (75-89% or B grade)</option>
                    <option value="average">Average (60-74% or C grade)</option>
                    <option value="below-average">Below Average (50-59%)</option>
                    <option value="struggling">Need Improvement (Below 50%)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Current Subjects/Stream *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Mathematics', 'Physics', 'Chemistry', 'Biology', 'English', 'Hindi',
                      'Computer Science', 'Economics', 'Accountancy', 'Business Studies',
                      'Political Science', 'History', 'Geography', 'Psychology', 'Arts',
                      'Physical Education', 'Home Science', 'Agriculture'
                    ].map(subject => (
                      <label key={subject} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.currentSubjects.includes(subject)}
                          onChange={() => handleArrayToggle('currentSubjects', subject)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Career Interests & Goals */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Career Interests & Goals</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Career Fields of Interest *</label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      'Engineering & Technology', 'Medical & Healthcare', 'Business & Management',
                      'Science & Research', 'Arts & Humanities', 'Law & Legal', 'Education & Teaching',
                      'Creative & Design', 'Media & Journalism', 'Sports & Fitness', 'Agriculture',
                      'Defense & Military', 'Aviation', 'Fashion & Beauty', 'Hospitality & Tourism',
                      'Banking & Finance', 'Government Services', 'Social Work'
                    ].map(field => (
                      <label key={field} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.careerInterests.includes(field)}
                          onChange={() => handleArrayToggle('careerInterests', field)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{field}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Study Mode *</label>
                  <select
                    value={formData.preferredStudyMode}
                    onChange={(e) => handleInputChange('preferredStudyMode', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="">Select study mode</option>
                    <option value="self-study">Self Study</option>
                    <option value="classroom">Classroom Learning</option>
                    <option value="online">Online Learning</option>
                    <option value="hybrid">Hybrid (Online + Classroom)</option>
                    <option value="tutoring">Private Tutoring</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Academic Goals *</label>
                  <textarea
                    value={formData.academicGoals}
                    onChange={(e) => handleInputChange('academicGoals', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                    rows={3}
                    placeholder="Describe your short-term and long-term academic goals..."
                  />
                </div>
              </div>
            )}

            {/* Step 4: Strengths & Additional Info */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Additional Information</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Your Strengths *</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Analytical Thinking', 'Creative Problem Solving', 'Communication',
                      'Leadership', 'Teamwork', 'Time Management', 'Research Skills',
                      'Technical Skills', 'Artistic Abilities', 'Mathematical Skills',
                      'Scientific Reasoning', 'Language Skills', 'Public Speaking',
                      'Organization', 'Innovation', 'Patience'
                    ].map(strength => (
                      <label key={strength} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.strengths.includes(strength)}
                          onChange={() => handleArrayToggle('strengths', strength)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{strength}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">Areas for Improvement</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      'Mathematics', 'Science', 'English', 'Time Management',
                      'Public Speaking', 'Writing Skills', 'Technical Skills',
                      'Study Habits', 'Concentration', 'Confidence', 'Social Skills'
                    ].map(challenge => (
                      <label key={challenge} className="flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.challenges.includes(challenge)}
                          onChange={() => handleArrayToggle('challenges', challenge)}
                          className="mr-2 text-blue-600 focus:ring-blue-500"
                        />
                        <span className="text-sm">{challenge}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Parent's Primary Occupation</label>
                    <input
                      type="text"
                      value={formData.parentOccupation}
                      onChange={(e) => handleInputChange('parentOccupation', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                      placeholder="e.g., Teacher, Engineer, Business"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Family Income Range</label>
                    <select
                      value={formData.familyIncome}
                      onChange={(e) => handleInputChange('familyIncome', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                    >
                      <option value="">Select range</option>
                      <option value="below-3">Below ₹3 Lakhs</option>
                      <option value="3-6">₹3-6 Lakhs</option>
                      <option value="6-12">₹6-12 Lakhs</option>
                      <option value="12-25">₹12-25 Lakhs</option>
                      <option value="above-25">Above ₹25 Lakhs</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < totalSteps ? (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!isStepValid() || isSubmitting}
                  className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Saving..." : "Complete Setup"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}