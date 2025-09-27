"use client";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
// Supabase auth placeholder; password/profile updates can be implemented via Supabase later
import { supabase, UserUtils } from "@/lib/database";
// import D3ProgressChart from "@/components/D3ProgressChart";
// import D3CareerJourney from "@/components/D3CareerJourney";
// import D3SkillsWheel from "@/components/D3SkillsWheel";
// import D3CareerPathway from "@/components/D3CareerPathway";

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
    if (user) {
      setDisplayName(UserUtils.getDisplayName(user));
    }
  }, [user, loading, router]);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Save displayName into your Supabase profile table
      setSuccess("Profile updated successfully!");
      setIsEditing(false);
    } catch (error: any) {
      setError(error.message);
    }
    setIsUpdating(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !user.email) return;

    if (newPassword !== confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setIsUpdating(true);
    setError("");
    setSuccess("");

    try {
      // TODO: Implement password change via Supabase if needed (requires server-side or OTP flow)
      setSuccess("Password updated (placeholder). Implement via Supabase auth.");
      setShowPasswordForm(false);
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (error: any) {
      setError(error.message);
    }
    setIsUpdating(false);
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

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="pt-24 px-8 pb-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Profile Settings</h1>
            <p className="text-lg text-gray-600">Manage your account information</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-6">
            {/* Profile Header */}
            <div className="flex items-center space-x-4 mb-6 pb-6 border-b border-gray-200">
              {UserUtils.getPhotoURL(user) ? (
                <img 
                  src={UserUtils.getPhotoURL(user)!} 
                  alt="Profile" 
                  className="w-20 h-20 rounded-full border-4 border-blue-200"
                />
              ) : (
                <div className="w-20 h-20 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {UserUtils.getDisplayName(user)}
                </h2>
                <p className="text-gray-600">{user.email}</p>
                <span className="inline-block mt-2 px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                  Verified Account
                </span>
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm mb-4">
                {error}
              </div>
            )}
            {success && (
              <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm mb-4">
                {success}
              </div>
            )}

            {/* Profile Form */}
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Display Name
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    disabled={!isEditing}
                    className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 ${
                      !isEditing ? 'bg-gray-50 text-gray-500' : 'bg-white'
                    }`}
                    placeholder="Enter your display name"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={user.email || ""}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>

              {/* Profile Actions */}
              <div className="flex space-x-4 pt-4">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      type="submit"
                      disabled={isUpdating}
                      className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
                    >
                      {isUpdating ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(UserUtils.getDisplayName(user));
                        setError("");
                        setSuccess("");
                      }}
                      className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                    >
                      Cancel
                    </button>
                  </>
                )}
                
                {UserUtils.isEmailAuth(user) && (
                  <button
                    type="button"
                    onClick={() => setShowPasswordForm(!showPasswordForm)}
                    className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors duration-200 font-medium"
                  >
                    Change Password
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Password Change Form */}
          {showPasswordForm && UserUtils.isEmailAuth(user) && (
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 shadow-lg">
              <h3 className="text-xl font-bold text-gray-800 mb-4">Change Password</h3>
              <form onSubmit={handleUpdatePassword} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Current Password
                  </label>
                  <input
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 font-medium disabled:opacity-50"
                  >
                    {isUpdating ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordForm(false);
                      setCurrentPassword("");
                      setNewPassword("");
                      setConfirmPassword("");
                      setError("");
                      setSuccess("");
                    }}
                    className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors duration-200 font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Progress Tracking and Career Journey */}
          <div className="mt-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Your Journey</h2>
            
            {/* Progress Chart */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Progress Overview</h3>
              <D3ProgressChart 
                completedSteps={userProgress}
                totalSteps={careerPlan}
              />
            </div>

            {/* Career Journey */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Career Journey</h3>
              <D3CareerJourney 
                currentPosition={user.classLevel}
                targetCareers={user.interests}
                timelineEvents={milestones}
              />
            </div>

            {/* Skills Wheel */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg mb-4">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Skills Wheel</h3>
              <D3SkillsWheel 
                currentSkills={user.skills}
                targetSkills={careerRequirements}
                progressPercentage={skillProgress}
              />
            </div>

            {/* Career Pathway */}
            <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-6 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Career Pathway</h3>
              <D3CareerPathway 
                currentLevel={user.education}
                goalCareer={user.targetCareer}
                milestones={educationMilestones}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}