"use client";

import { useState, useEffect } from "react";
import { Shield, Users, Settings, Database, Activity, ArrowRight, Building2, FolderOpen } from "lucide-react";
import Link from "next/link";
import { getUserProfile, getUserRoles } from "@/lib/api";
import { UserProfile, UserRole } from "@/types";
import { LoaderFive } from "@/components/ui/loader";

export default function AdminPage() {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [userRoles, setUserRoles] = useState<UserRole[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load user profile and roles in parallel
      const [profile, roles] = await Promise.all([
        getUserProfile(),
        getUserRoles()
      ]);
      
      setUserProfile(profile);
      setUserRoles(roles);
      
      // Check if user has admin role
      const hasAdminRole = roles.some(role => 
        role.user === profile.id && role.role === 'admin'
      );
      setIsAdmin(hasAdminRole);
      
    } catch (err) {
      console.error('Failed to load user data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <LoaderFive />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <h2 className="font-semibold mb-2">Error Loading Admin Panel</h2>
          <p>{error}</p>
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <Shield className="mr-2" size={20} />
            <div>
              <h2 className="font-semibold">Access Denied</h2>
              <p>You don&apos;t have admin privileges to access this page.</p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Shield className="mr-3 text-blue-600" size={28} />
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-1">
              Welcome, {userProfile?.full_name}. Manage your AIPMS system from here.
            </p>
          </div>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Database className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                <p className="text-2xl font-bold text-gray-900">-</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Settings className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">System Health</p>
                <p className="text-2xl font-bold text-green-600">Good</p>
              </div>
            </div>
          </div>
        </div>

        {/* User Profile Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Profile</h2>
          <div className="flex items-center space-x-4">
            <img
              src={userProfile?.profile_image_url}
              alt={userProfile?.full_name}
              className="w-16 h-16 rounded-full"
            />
            <div>
              <h3 className="text-lg font-medium text-gray-900">{userProfile?.full_name}</h3>
              <p className="text-gray-600">{userProfile?.email}</p>
              <div className="flex items-center space-x-2 mt-2">
                {userRoles.map((role) => (
                  <span
                    key={role.id}
                    className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full"
                  >
                    {role.role}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Admin Features Section */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Admin Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link href="/admin/users" className="block">
              <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                <Users className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">User Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage users, roles, and permissions</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Available
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Link>

            <Link href="/admin/departments" className="block">
              <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                <Building2 className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Department Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage departments, leads, and members</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Available
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Link>

            <Link href="/admin/projects" className="block">
              <div className="p-4 border border-gray-200 rounded-lg bg-white hover:bg-blue-50 hover:border-blue-300 transition-colors cursor-pointer">
                <FolderOpen className="h-8 w-8 text-blue-600 mb-2" />
                <h3 className="font-medium text-gray-900">Project Management</h3>
                <p className="text-sm text-gray-600 mt-1">Manage all organization projects</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="inline-block px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                    Available
                  </span>
                  <ArrowRight className="h-4 w-4 text-blue-600" />
                </div>
              </div>
            </Link>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <Database className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900">System Analytics</h3>
              <p className="text-sm text-gray-600 mt-1">View system usage and performance metrics</p>
              <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Coming Soon
              </span>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
              <Settings className="h-8 w-8 text-gray-400 mb-2" />
              <h3 className="font-medium text-gray-900">System Settings</h3>
              <p className="text-sm text-gray-600 mt-1">Configure system-wide settings and preferences</p>
              <span className="inline-block mt-2 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded">
                Coming Soon
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
