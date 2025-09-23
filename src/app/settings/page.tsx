"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  // Settings state
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    career: true,
    exam: true,
    newsletter: false
  });
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEmail: false,
    showProgress: true
  });
  const [preferences, setPreferences] = useState({
    theme: 'light',
    language: 'english',
    timezone: 'Asia/Kolkata',
    careerField: 'engineering',
    educationLevel: 'undergraduate'
  });
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  const handleSaveSettings = async () => {
    setSuccess("");
    setError("");
    
    try {
      // Here you would typically save to a database
      // For now, we'll just save to localStorage
      const settings = {
        notifications,
        privacy,
        preferences,
        userId: user?.uid,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem('userSettings', JSON.stringify(settings));
      setSuccess("Settings saved successfully!");
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (error: any) {
      setError("Failed to save settings. Please try again.");
    }
  };

  const handleResetSettings = () => {
    setNotifications({
      email: true,
      push: false,
      career: true,
      exam: true,
      newsletter: false
    });
    setPrivacy({
      profileVisibility: 'public',
      showEmail: false,
      showProgress: true
    });
    setPreferences({
      theme: 'light',
      language: 'english',
      timezone: 'Asia/Kolkata',
      careerField: 'engineering',
      educationLevel: 'undergraduate'
    });
    setSuccess("Settings reset to defaults!");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Load settings from localStorage on component mount
  useEffect(() => {
    try {
      const savedSettings = localStorage.getItem('userSettings');
      if (savedSettings) {
        const settings = JSON.parse(savedSettings);
        if (settings.userId === user?.uid) {
          setNotifications(settings.notifications || notifications);
          setPrivacy(settings.privacy || privacy);
          setPreferences(settings.preferences || preferences);
        }
      }
    } catch (error) {
      console.log("No saved settings found");
    }
  }, [user?.uid]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="pt-20 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-20 px-8 pb-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Settings</h1>
            <p className="text-lg text-gray-600">Customize your Career Choice experience</p>
          </div>

          {/* Success/Error Messages */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-6 max-w-2xl mx-auto">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm mb-6 max-w-2xl mx-auto">
              {success}
            </div>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Notifications Settings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-5 5V4a1 1 0 011-1h13a1 1 0 011 1v8z"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Notifications</h2>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email Notifications</label>
                    <p className="text-xs text-gray-500">Receive updates via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.email}
                      onChange={(e) => setNotifications({...notifications, email: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Push Notifications</label>
                    <p className="text-xs text-gray-500">Browser push notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.push}
                      onChange={(e) => setNotifications({...notifications, push: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Career Updates</label>
                    <p className="text-xs text-gray-500">New career opportunities and trends</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.career}
                      onChange={(e) => setNotifications({...notifications, career: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Exam Alerts</label>
                    <p className="text-xs text-gray-500">Important exam dates and deadlines</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.exam}
                      onChange={(e) => setNotifications({...notifications, exam: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Newsletter</label>
                    <p className="text-xs text-gray-500">Weekly career guidance newsletter</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.newsletter}
                      onChange={(e) => setNotifications({...notifications, newsletter: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Privacy Settings */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Privacy</h2>
              </div>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Profile Visibility</label>
                  <select
                    value={privacy.profileVisibility}
                    onChange={(e) => setPrivacy({...privacy, profileVisibility: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="public">Public - Everyone can see</option>
                    <option value="private">Private - Only you can see</option>
                    <option value="friends">Friends - Only connections can see</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Email Address</label>
                    <p className="text-xs text-gray-500">Display email on public profile</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.showEmail}
                      onChange={(e) => setPrivacy({...privacy, showEmail: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Show Learning Progress</label>
                    <p className="text-xs text-gray-500">Display your quiz scores and achievements</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={privacy.showProgress}
                      onChange={(e) => setPrivacy({...privacy, showProgress: e.target.checked})}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Theme</label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({...preferences, theme: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({...preferences, language: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="english">English</option>
                    <option value="hindi">हिंदी (Hindi)</option>
                    <option value="bengali">বাংলা (Bengali)</option>
                    <option value="tamil">தமிழ் (Tamil)</option>
                    <option value="telugu">తెలుగు (Telugu)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({...preferences, timezone: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="Asia/Kolkata">India (IST)</option>
                    <option value="Asia/Dubai">Dubai (UAE)</option>
                    <option value="America/New_York">New York (EST)</option>
                    <option value="Europe/London">London (GMT)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Career Preferences */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <div className="flex items-center mb-6">
                <svg className="w-6 h-6 text-blue-600 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6"/>
                </svg>
                <h2 className="text-2xl font-bold text-gray-800">Career Preferences</h2>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Primary Career Field</label>
                  <select
                    value={preferences.careerField}
                    onChange={(e) => setPreferences({...preferences, careerField: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="engineering">Engineering & Technology</option>
                    <option value="medical">Medical & Healthcare</option>
                    <option value="business">Business & Management</option>
                    <option value="science">Science & Research</option>
                    <option value="arts">Arts & Humanities</option>
                    <option value="law">Law & Legal</option>
                    <option value="education">Education & Teaching</option>
                    <option value="creative">Creative & Design</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Education Level</label>
                  <select
                    value={preferences.educationLevel}
                    onChange={(e) => setPreferences({...preferences, educationLevel: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white"
                  >
                    <option value="high-school">High School (10th/12th)</option>
                    <option value="undergraduate">Undergraduate</option>
                    <option value="postgraduate">Postgraduate</option>
                    <option value="doctorate">Doctorate/PhD</option>
                    <option value="professional">Professional Course</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-8 flex justify-center space-x-4">
            <button
              onClick={handleSaveSettings}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-semibold shadow-lg"
            >
              Save Settings
            </button>
            <button
              onClick={handleResetSettings}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-semibold shadow-lg"
            >
              Reset to Defaults
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}