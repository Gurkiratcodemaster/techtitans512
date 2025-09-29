"use client";
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/database';
import { Navbar } from '@/components/navbar';

export default function AdminDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [stats, setStats] = useState({
    totalUsers: 0,
    students: 0,
    teachers: 0,
    admins: 0
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }

    if (user) {
      checkUserProfile();
    }
  }, [user, loading, router]);

  const checkUserProfile = async () => {
    try {
      const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error);
        return;
      }

      if (!profile) {
        router.push('/profile-setup');
        return;
      }

      // Check if user is actually an admin
      if (profile.role !== 'admin') {
        router.push(`/dashboard/${profile.role}`);
        return;
      }

      setProfile(profile);
      loadStats();
    } catch (error) {
      console.error('Error checking profile:', error);
    } finally {
      setProfileLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      const { data: usersData, error } = await supabase
        .from('user_profiles')
        .select('role');

      if (error) {
        console.error('Error loading stats:', error);
        return;
      }

      const roleCounts = usersData?.reduce((acc: any, user: any) => {
        acc[user.role] = (acc[user.role] || 0) + 1;
        return acc;
      }, {});

      setStats({
        totalUsers: usersData?.length || 0,
        students: roleCounts?.student || 0,
        teachers: roleCounts?.teacher || 0,
        admins: roleCounts?.admin || 0
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">
              Admin Dashboard
            </h1>
            <p className="mt-2 text-gray-600">
              Welcome, {profile?.full_name || 'Admin'}! Manage the platform and users.
            </p>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Total Users</h3>
                  <p className="text-2xl font-bold text-blue-600">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Students</h3>
                  <p className="text-2xl font-bold text-green-600">{stats.students}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Teachers</h3>
                  <p className="text-2xl font-bold text-purple-600">{stats.teachers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center">
                <div className="p-3 bg-red-100 rounded-full">
                  <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold">Admins</h3>
                  <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Admin Tools */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">System Management</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium mb-2">User Management</h4>
                    <p className="text-gray-600 text-sm">Manage students, teachers, and admin accounts</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium mb-2">Content Management</h4>
                    <p className="text-gray-600 text-sm">Manage study materials and resources</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium mb-2">System Settings</h4>
                    <p className="text-gray-600 text-sm">Configure platform settings and preferences</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                    <h4 className="font-medium mb-2">Analytics</h4>
                    <p className="text-gray-600 text-sm">View detailed platform usage analytics</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg">
                    <span className="font-medium text-blue-800">Add New Admin</span>
                  </button>
                  <button className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg">
                    <span className="font-medium text-green-800">Approve Teacher</span>
                  </button>
                  <button className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg">
                    <span className="font-medium text-purple-800">System Backup</span>
                  </button>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Platform Health</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Database Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Online</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Server Status</span>
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Healthy</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Backup</span>
                    <span className="text-sm text-gray-500">2 hours ago</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold mb-4">Admin Tools</h3>
                <div className="space-y-3">
                  <a href="/migrate" className="block text-blue-600 hover:text-blue-800">
                    Database Migration
                  </a>
                  <a href="/debug" className="block text-blue-600 hover:text-blue-800">
                    Debug Console
                  </a>
                  <a href="/settings" className="block text-blue-600 hover:text-blue-800">
                    Platform Settings
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}