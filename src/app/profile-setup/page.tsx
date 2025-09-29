"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import { useAuth } from '@/contexts/AuthContext';

const INTERESTS = [
  'Technology', 'Science', 'Mathematics', 'Arts', 'Sports', 'Music',
  'Literature', 'Business', 'Medicine', 'Engineering', 'Design', 'Teaching'
];

const STREAMS = ['Science', 'Commerce', 'Arts', 'Vocational'];

export default function ProfileSetup() {
  const { user } = useAuth();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: '',
    role: '',
    class_level: '',
    interests: [] as string[],
    career_goals: '',
    subjects_of_interest: [] as string[],
    dream_college: '',
    preferred_stream: ''
  });

  useEffect(() => {
    if (!user) {
      router.push('/login');
    }
  }, [user, router]);

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter(i => i !== interest)
        : [...prev.interests, interest]
    }));
  };

  const handleSubmit = async () => {
    if (!user) {
      alert('User not authenticated');
      return;
    }

    setLoading(true);
    try {
      console.log('Saving profile for user:', user.id);
      console.log('Profile data:', formData);

      const response = await fetch('/api/user-profile', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          email: user.email,
          ...formData
        }),
      });

      const result = await response.json();
      console.log('API Response:', result);

      if (!response.ok) {
        throw new Error(result.error || 'Failed to save profile');
      }

      if (result.success) {
        alert('Profile saved successfully!');
        
        // Redirect based on role and class level
        if (formData.role === 'student') {
          if (formData.class_level === '10th') {
            router.push('/quiz/class10');
          } else if (formData.class_level === '12th') {
            router.push('/quiz/class12');
          } else {
            router.push('/dashboard/student');
          }
        } else if (formData.role === 'teacher') {
          router.push('/dashboard/teacher');
        } else if (formData.role === 'admin') {
          router.push('/dashboard/admin');
        } else {
          router.push('/dashboard');
        }
      }

    } catch (error) {
      console.error('Profile save error:', error);
      if (error instanceof Error) {
        alert(`Error saving profile: ${error.message}`);
      } else {
        alert('Error saving profile');
      }
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => setStep(prev => Math.min(prev + 1, 3));
  const prevStep = () => setStep(prev => Math.max(prev - 1, 1));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-center mb-8">
            Complete Your Profile
          </h1>
          
          {/* Progress Indicator */}
          <div className="flex justify-center mb-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`w-8 h-8 rounded-full flex items-center justify-center mx-2 ${
                  i <= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
                }`}
              >
                {i}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Basic Information</h2>
              
              <input
                type="text"
                placeholder="Full Name"
                className="w-full p-3 border rounded-lg"
                value={formData.full_name}
                onChange={(e) => setFormData(prev => ({...prev, full_name: e.target.value}))}
              />

              <select
                className="w-full p-3 border rounded-lg"
                value={formData.role}
                onChange={(e) => setFormData(prev => ({...prev, role: e.target.value}))}
              >
                <option value="">Select Your Role</option>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
              </select>

              <select
                className="w-full p-3 border rounded-lg"
                value={formData.class_level}
                onChange={(e) => setFormData(prev => ({...prev, class_level: e.target.value}))}
              >
                <option value="">Select Your Class</option>
                <option value="10th">Class 10th</option>
                <option value="12th">Class 12th</option>
                <option value="Graduate">Graduate</option>
                <option value="Other">Other</option>
              </select>

              <select
                className="w-full p-3 border rounded-lg"
                value={formData.preferred_stream}
                onChange={(e) => setFormData(prev => ({...prev, preferred_stream: e.target.value}))}
              >
                <option value="">Preferred Stream</option>
                {STREAMS.map(stream => (
                  <option key={stream} value={stream}>{stream}</option>
                ))}
              </select>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Your Interests</h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {INTERESTS.map(interest => (
                  <button
                    key={interest}
                    onClick={() => handleInterestToggle(interest)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      formData.interests.includes(interest)
                        ? 'border-blue-600 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    {interest}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-semibold mb-4">Career Goals</h2>
              
              <textarea
                placeholder="What are your career goals?"
                className="w-full p-3 border rounded-lg h-24"
                value={formData.career_goals}
                onChange={(e) => setFormData(prev => ({...prev, career_goals: e.target.value}))}
              />

              <input
                type="text"
                placeholder="Dream College (Optional)"
                className="w-full p-3 border rounded-lg"
                value={formData.dream_college}
                onChange={(e) => setFormData(prev => ({...prev, dream_college: e.target.value}))}
              />
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8">
            {step > 1 && (
              <button
                onClick={prevStep}
                className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50"
              >
                Previous
              </button>
            )}
            
            {step < 3 ? (
              <button
                onClick={nextStep}
                disabled={
                  (step === 1 && (!formData.full_name || !formData.role || !formData.class_level)) ||
                  (step === 2 && formData.interests.length === 0)
                }
                className="ml-auto px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="ml-auto px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Complete Profile'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}