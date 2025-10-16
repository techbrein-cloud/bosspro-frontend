"use client";

import { useState } from "react";
import { 
  Building2, 
  Users, 
  FolderOpen, 
  Calendar, 
  User, 
  Mail, 
  Crown, 
  CheckCircle, 
  Clock, 
  AlertCircle,
  BarChart3,
  ArrowRight
} from "lucide-react";
import { useMyDepartment } from "@/lib/hooks/useMyDepartment";
import { MyDepartmentProject, MyDepartmentUser } from "@/types";

export default function MyDepartmentPage() {
  const { department, userRole, loading, error, noDepartment } = useMyDepartment();
  const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'projects'>('overview');

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm border">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-4 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (noDepartment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-8 text-center">
            <Building2 className="h-16 w-16 text-blue-400 mx-auto mb-6" />
            <h2 className="text-2xl font-semibold text-blue-900 mb-4">No Department Assigned</h2>
            <p className="text-blue-700 text-lg mb-6">{error}</p>
            <div className="bg-white p-4 rounded-lg border border-blue-200 max-w-md mx-auto">
              <h3 className="font-medium text-gray-900 mb-2">What to do next:</h3>
              <ul className="text-sm text-gray-600 space-y-1 text-left">
                <li>• Contact your system administrator</li>
                <li>• Request to be assigned to a department</li>
                <li>• Check back after assignment is complete</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto p-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-lg font-semibold text-red-900 mb-2">Error Loading Department</h2>
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!department) {
    return null; // This should not happen as noDepartment flag handles this case
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on_hold': return 'bg-orange-100 text-orange-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityBadgeColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProjectTypeBadgeColor = (type: string) => {
    switch (type) {
      case 'internal': return 'bg-purple-100 text-purple-800';
      case 'external': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const UserCard = ({ user, isLead = false }: { user: MyDepartmentUser; isLead?: boolean }) => (
    <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-3">
        <div className="relative">
          {user.profile_image_url ? (
            <img
              src={user.profile_image_url}
              alt={user.full_name}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                // Replace with fallback avatar on error
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : null}
          <div className={`w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center ${user.profile_image_url ? 'hidden' : ''}`}>
            <User className="h-6 w-6 text-gray-500" />
          </div>
          {isLead && (
            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
              <Crown className="h-3 w-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            <h3 className="font-medium text-gray-900 truncate">{user.full_name}</h3>
            {isLead && (
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                Lead
              </span>
            )}
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
            <Mail className="h-3 w-3" />
            <span className="truncate">{user.email}</span>
          </div>
          {user.role && (
            <div className="mt-2">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                {user.role}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const ProjectCard = ({ project }: { project: MyDepartmentProject }) => (
    <div className="bg-white p-6 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 mb-2">{project.title}</h3>
          <p className="text-sm text-gray-600 line-clamp-2">{project.description}</p>
        </div>
        <div className="flex flex-col space-y-2 ml-4">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(project.status)}`}>
            {project.status.replace('_', ' ')}
          </span>
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getPriorityBadgeColor(project.priority)}`}>
            {project.priority}
          </span>
        </div>
      </div>
      
      <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(project.start_date)}</span>
          </div>
          <div className="flex items-center space-x-1">
            <ArrowRight className="h-4 w-4" />
            <span>{formatDate(project.end_date)}</span>
          </div>
        </div>
        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getProjectTypeBadgeColor(project.project_type)}`}>
          {project.project_type}
        </span>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <User className="h-4 w-4" />
          <span>{project.owner_name}</span>
        </div>
        <div className="flex items-center space-x-1 text-sm text-gray-600">
          <BarChart3 className="h-4 w-4" />
          <span>{project.task_count} tasks</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Building2 className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{department.name}</h1>
              <p className="text-gray-600">{department.description}</p>
              <div className="flex items-center space-x-2 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  userRole === 'lead' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {userRole === 'lead' ? 'Department Lead' : 'Member'}
                </span>
                <span className="text-sm text-gray-500">
                  Created {formatDate(department.created_at)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-lg">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Members</p>
              <p className="text-2xl font-bold text-gray-900">{department.member_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg">
              <FolderOpen className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Projects</p>
              <p className="text-2xl font-bold text-gray-900">{department.project_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Projects</p>
              <p className="text-2xl font-bold text-gray-900">{department.active_project_count}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-lg">
              <BarChart3 className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{department.total_tasks_count}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', label: 'Overview', icon: Building2 },
              { id: 'members', label: 'Members', icon: Users },
              { id: 'projects', label: 'Projects', icon: FolderOpen },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as 'overview' | 'members' | 'projects')}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Department Lead */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Department Lead</h3>
                <UserCard user={department.department_lead_details} isLead={true} />
              </div>

              {/* Quick Stats */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-5 w-5 text-green-600" />
                      <span className="font-medium">Completed Projects</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{department.completed_project_count}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-yellow-600" />
                      <span className="font-medium">In Progress</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{department.active_project_count}</p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <BarChart3 className="h-5 w-5 text-purple-600" />
                      <span className="font-medium">Total Tasks</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900 mt-2">{department.total_tasks_count}</p>
                  </div>
                </div>
              </div>

              {/* Created By */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Created By</h3>
                <UserCard user={department.created_by_details} />
              </div>
            </div>
          )}

          {activeTab === 'members' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Department Members ({department.member_count})
                </h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {department.members_details.map((member) => (
                  <UserCard 
                    key={member.id} 
                    user={member} 
                    isLead={member.id === department.department_lead}
                  />
                ))}
              </div>
            </div>
          )}

          {activeTab === 'projects' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Department Projects ({department.project_count})
                </h3>
              </div>
              {department.projects.length > 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {department.projects.map((project) => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FolderOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects Yet</h3>
                  <p className="text-gray-600">This department doesn&apos;t have any projects assigned yet.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
