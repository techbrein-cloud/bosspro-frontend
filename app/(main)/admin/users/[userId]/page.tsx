"use client";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, User, Mail, Shield, Calendar, CheckCircle, XCircle, UserPlus, AlertCircle, Edit } from "lucide-react";
import { useUserRole } from "@/lib/hooks/useUserRole";

const ROLE_OPTIONS = [
  { value: "admin", label: "Admin", color: "bg-red-100 text-red-800" },
  { value: "employee", label: "Employee", color: "bg-green-100 text-green-800" },
  { value: "project_manager", label: "Project Manager", color: "bg-blue-100 text-blue-800" },
] as const;

export default function UserDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const userId = parseInt(params.userId as string);
  
  const { userRole, loading, error, assigningRole, updatingRole, assignRole, updateRole, refreshUserRole } = useUserRole(userId);
  const [selectedRole, setSelectedRole] = useState<"admin" | "employee" | "project_manager">("employee");
  const [showAssignForm, setShowAssignForm] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const handleAssignRole = async () => {
    try {
      await assignRole(selectedRole);
      setShowAssignForm(false);
      setAssignSuccess(true);
      setTimeout(() => setAssignSuccess(false), 3000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleUpdateRole = async () => {
    try {
      await updateRole(selectedRole);
      setShowUpdateForm(false);
      setUpdateSuccess(true);
      setTimeout(() => setUpdateSuccess(false), 3000);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const getRoleBadgeColor = (role: string | null) => {
    const roleOption = ROLE_OPTIONS.find(option => option.value === role);
    return roleOption ? roleOption.color : 'bg-gray-100 text-gray-800';
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gray-200 rounded-full"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-gray-200 rounded w-48"></div>
                  <div className="h-4 bg-gray-200 rounded w-64"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Users
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            <div className="flex items-center">
              <AlertCircle size={20} className="mr-2" />
              Error loading user details: {error}
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!userRole) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="max-w-4xl mx-auto">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 mb-6"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Users
          </button>
          <div className="bg-gray-50 border border-gray-200 text-gray-700 px-4 py-3 rounded">
            User not found
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft size={20} className="mr-2" />
            Back to Users
          </button>
          
          {(assignSuccess || updateSuccess) && (
            <div className="flex items-center bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded">
              <CheckCircle size={16} className="mr-2" />
              {assignSuccess ? 'Role assigned successfully!' : 'Role updated successfully!'}
            </div>
          )}
        </div>

        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center">
                  <User size={32} className="text-gray-400" />
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{userRole.full_name}</h1>
                <div className="flex items-center text-gray-600 mt-1">
                  <Mail size={16} className="mr-2" />
                  {userRole.email}
                </div>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500 mr-2">User ID:</span>
                  <span className="text-sm font-medium text-gray-900">{userRole.user_id}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Role Information Card */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Shield className="mr-2" size={20} />
              Role Information
            </h2>
          </div>

          {userRole.has_role ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm text-gray-600">Current Role:</span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getRoleBadgeColor(userRole.role)}`}>
                      {userRole.role_display}
                    </span>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="flex items-center text-green-600">
                    <CheckCircle size={16} className="mr-1" />
                    <span className="text-sm">Role Assigned</span>
                  </div>
                  {!showUpdateForm && (
                    <button
                      onClick={() => {
                        setSelectedRole(userRole.role as "admin" | "employee" | "project_manager");
                        setShowUpdateForm(true);
                      }}
                      className="flex items-center px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                    >
                      <Edit size={14} className="mr-1" />
                      Change Role
                    </button>
                  )}
                </div>
              </div>

              {userRole.created_at && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Role assigned on: {formatDate(userRole.created_at)}</span>
                </div>
              )}

              {userRole.updated_at && userRole.updated_at !== userRole.created_at && (
                <div className="flex items-center text-sm text-gray-600">
                  <Calendar size={16} className="mr-2" />
                  <span>Last updated: {formatDate(userRole.updated_at)}</span>
                </div>
              )}

              {showUpdateForm && (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900">Change User Role</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select New Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as "admin" | "employee" | "project_manager")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      suppressHydrationWarning
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleUpdateRole}
                      disabled={updatingRole}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {updatingRole ? 'Updating...' : 'Update Role'}
                    </button>
                    <button
                      onClick={() => setShowUpdateForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center text-amber-600">
                  <AlertCircle size={16} className="mr-2" />
                  <span className="text-sm">No role assigned</span>
                </div>
              </div>

              {userRole.message && (
                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
                  {userRole.message}
                </div>
              )}

              {!showAssignForm ? (
                <button
                  onClick={() => setShowAssignForm(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <UserPlus size={16} className="mr-2" />
                  Assign Role
                </button>
              ) : (
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-medium text-gray-900">Assign Role to User</h3>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Select Role
                    </label>
                    <select
                      value={selectedRole}
                      onChange={(e) => setSelectedRole(e.target.value as "admin" | "employee" | "project_manager")}
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      suppressHydrationWarning
                    >
                      {ROLE_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex space-x-3">
                    <button
                      onClick={handleAssignRole}
                      disabled={assigningRole}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {assigningRole ? 'Assigning...' : 'Assign Role'}
                    </button>
                    <button
                      onClick={() => setShowAssignForm(false)}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Additional Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">User ID:</span>
              <span className="ml-2 font-medium">{userRole.user_id}</span>
            </div>
            <div>
              <span className="text-gray-600">Email:</span>
              <span className="ml-2 font-medium">{userRole.email}</span>
            </div>
            <div>
              <span className="text-gray-600">Full Name:</span>
              <span className="ml-2 font-medium">{userRole.full_name}</span>
            </div>
            <div>
              <span className="text-gray-600">Has Role:</span>
              <span className="ml-2">
                {userRole.has_role ? (
                  <span className="flex items-center text-green-600">
                    <CheckCircle size={14} className="mr-1" />
                    Yes
                  </span>
                ) : (
                  <span className="flex items-center text-red-600">
                    <XCircle size={14} className="mr-1" />
                    No
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
