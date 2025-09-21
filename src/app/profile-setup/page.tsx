"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Navbar } from "@/components/navbar";

export default function ProfileSetup() {
  const [loaded, setLoaded] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    age: "",
    gender: "",
    currentClass: "",
    schoolName: "",
    interests: [] as string[],
    careerGoals: "",
    academicStrength: "",
    location: "",
    languages: [] as string[],
  });
  const router = useRouter();

  const interestOptions = [
    "Science & Technology",
    "Mathematics",
    "Literature & Arts",
    "Sports & Fitness", 
    "Music & Dance",
    "Business & Entrepreneurship",
    "Medicine & Healthcare",
    "Engineering",
    "Teaching & Education",
    "Social Work",
    "Law & Justice",
    "Agriculture",
    "Fashion & Design",
    "Cooking & Hospitality",
    "Photography & Media"
  ];

  const languageOptions = [
    "Hindi",
    "English", 
    "Punjabi",
    "Urdu",
    "Sanskrit",
    "French",
    "German",
    "Spanish"
  ];

  useEffect(() => {
    const timer = setTimeout(() => setLoaded(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleLanguageToggle = (language: string) => {
    setFormData(prev => ({
      ...prev,
      languages: prev.languages.includes(language)
        ? prev.languages.filter(l => l !== language)
        : [...prev.languages, language]
    }));
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    // Save profile data and redirect to quiz assessment suggestion
    localStorage.setItem("userProfile", JSON.stringify(formData));
    router.push("/profile-complete");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="pt-20 px-8">
        <div className="max-w-2xl mx-auto">
          {/* Progress Indicator */}
          <div className={`mb-8 transform transition-all duration-500 delay-100 ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <div className="flex items-center justify-center mb-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                    step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                  } transition-colors duration-300`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    } transition-colors duration-300`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-gray-600">Step {currentStep} of 3</p>
          </div>

          {/* Header */}
          <div className={`text-center mb-8 transform transition-all duration-500 delay-200 ${
            loaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'
          }`}>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Let's Get To Know <span className="text-blue-600">You Better</span>
            </h1>
            <p className="text-lg text-gray-600">
              Help us personalize your career guidance journey
            </p>
          </div>

          {/* Form */}
          <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg transform transition-all duration-500 delay-300 ${
            loaded ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'
          }`}>
            
            {/* Step 1: Basic Info */}
            {currentStep === 1 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Basic Information</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData(prev => ({...prev, age: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                    <select
                      value={formData.gender}
                      onChange={(e) => setFormData(prev => ({...prev, gender: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                      <option value="prefer-not-to-say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Class/Standard</label>
                    <select
                      value={formData.currentClass}
                      onChange={(e) => setFormData(prev => ({...prev, currentClass: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Select Class</option>
                      <option value="10">Class 10</option>
                      <option value="11">Class 11</option>
                      <option value="12">Class 12</option>
                      <option value="graduated">Graduated</option>
                      <option value="college">College Student</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({...prev, location: e.target.value}))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="City, State"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">School/Institution Name</label>
                  <input
                    type="text"
                    value={formData.schoolName}
                    onChange={(e) => setFormData(prev => ({...prev, schoolName: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your school/institution name"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Interests & Languages */}
            {currentStep === 2 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Interests & Languages</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    What are you interested in? (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`p-3 rounded-lg border text-sm text-center transition-all duration-200 ${
                          formData.interests.includes(interest)
                            ? 'bg-blue-600 text-white border-blue-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-blue-500'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-4">
                    Languages you know (Select multiple)
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {languageOptions.map((language) => (
                      <button
                        key={language}
                        type="button"
                        onClick={() => handleLanguageToggle(language)}
                        className={`p-3 rounded-lg border text-sm text-center transition-all duration-200 ${
                          formData.languages.includes(language)
                            ? 'bg-green-600 text-white border-green-600'
                            : 'bg-white border-gray-300 text-gray-700 hover:border-green-500'
                        }`}
                      >
                        {language}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Goals & Strengths */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Goals & Academic Strength</h2>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What are your career goals? (Optional)
                  </label>
                  <textarea
                    value={formData.careerGoals}
                    onChange={(e) => setFormData(prev => ({...prev, careerGoals: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={4}
                    placeholder="Describe what you want to achieve in your career..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    What is your academic strength?
                  </label>
                  <select
                    value={formData.academicStrength}
                    onChange={(e) => setFormData(prev => ({...prev, academicStrength: e.target.value}))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">Select your strength</option>
                    <option value="mathematics">Mathematics</option>
                    <option value="science">Science (Physics, Chemistry, Biology)</option>
                    <option value="languages">Languages & Literature</option>
                    <option value="social-studies">Social Studies & History</option>
                    <option value="arts">Creative Arts</option>
                    <option value="sports">Physical Education & Sports</option>
                    <option value="technology">Computer Science & Technology</option>
                    <option value="commerce">Commerce & Business Studies</option>
                  </select>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 transform hover:scale-105"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-200 transform hover:scale-105"
                >
                  Complete Profile
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}