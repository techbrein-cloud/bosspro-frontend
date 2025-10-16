"use client";
import { motion } from "framer-motion";
import { Eye, Calendar, User, Tag, Clock, Search, Filter } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";
import { Project, ProjectStatus, ProjectPriority, ProjectType } from "@/types";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { LoaderFive } from "@/components/ui/loader";

export default function ProjectsPage() {
  const router = useRouter();
  const { projects, loading, error, fetchProjects } = useProjects();
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isViewingProject, setIsViewingProject] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    status: "" as ProjectStatus | "",
    priority: "" as ProjectPriority | "",
    projectType: "" as ProjectType | "",
  });

  // Filter projects based on current filters
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      if (filters.search && !project.title.toLowerCase().includes(filters.search.toLowerCase()) && 
          !project.owner_name.toLowerCase().includes(filters.search.toLowerCase())) {
        return false;
      }
      if (filters.status && project.status !== filters.status) {
        return false;
      }
      if (filters.priority && project.priority !== filters.priority) {
        return false;
      }
      if (filters.projectType && project.project_type !== filters.projectType) {
        return false;
      }
      return true;
    });
  }, [projects, filters]);

  const getStatusColor = (status: ProjectStatus) => {
    switch (status) {
      case "planning": return "bg-gray-100 text-gray-800 border-gray-200";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "on_hold": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getPriorityColor = (priority: ProjectPriority) => {
    switch (priority) {
      case "low": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      status: "",
      priority: "",
      projectType: "",
    });
  };

  const hasActiveFilters = filters.search || filters.status || filters.priority || filters.projectType;

  if (loading && projects.length === 0) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-center h-64">
          <LoaderFive text="Loading Projects..." />
        </div>
      </main>
    );
  }

  if (error && projects.length === 0) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="text-red-600 mb-2">Error loading projects</div>
            <div className="text-gray-500 text-sm mb-4">{error}</div>
            <button
              onClick={() => fetchProjects()}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              suppressHydrationWarning
            >
              Retry
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pr-16 md:pr-20">
          <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white rounded-lg border p-4">
          <div className="flex items-center space-x-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search projects..."
                value={filters.search}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                suppressHydrationWarning
              />
            </div>

            {/* Filter Toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border ${
                showFilters || hasActiveFilters
                  ? "bg-blue-50 border-blue-200 text-blue-700"
                  : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
              suppressHydrationWarning
            >
              <Filter size={20} />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1">
                  {[filters.status, filters.priority, filters.projectType].filter(Boolean).length}
                </span>
              )}
            </button>

            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800"
                suppressHydrationWarning
              >
                Clear
              </button>
            )}
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <select
                    value={filters.status}
                    onChange={(e) => setFilters({ ...filters, status: e.target.value as ProjectStatus | "" })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    suppressHydrationWarning
                  >
                    <option value="">All Statuses</option>
                    <option value="planning">Planning</option>
                    <option value="in_progress">In Progress</option>
                    <option value="on_hold">On Hold</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
                  <select
                    value={filters.priority}
                    onChange={(e) => setFilters({ ...filters, priority: e.target.value as ProjectPriority | "" })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    suppressHydrationWarning
                  >
                    <option value="">All Priorities</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={filters.projectType}
                    onChange={(e) => setFilters({ ...filters, projectType: e.target.value as ProjectType | "" })}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    suppressHydrationWarning
                  >
                    <option value="">All Types</option>
                    <option value="internal">Internal</option>
                    <option value="external">External</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-gray-600 pr-16 md:pr-20">
          <span>
            Showing {filteredProjects.length} of {projects.length} projects
          </span>
          {hasActiveFilters && (
            <span className="text-blue-600">Filters applied</span>
          )}
        </div>

        {/* Project Grid */}
        {filteredProjects.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <div className="text-gray-500 mb-2">No projects found</div>
            <div className="text-gray-400 text-sm">
              {hasActiveFilters
                ? "Try adjusting your filters"
                : "No projects have been assigned to you yet"
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pr-8 md:pr-12 xl:pr-16">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => router.push(`/project/${project.id}`)}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-gray-900 truncate">{project.title}</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProject(project);
                      setIsViewingProject(true);
                    }}
                    className="p-1 text-gray-400 hover:text-blue-600"
                    title="View project"
                    suppressHydrationWarning
                  >
                    <Eye size={16} />
                  </button>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-2" />
                    <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <User size={14} className="mr-2" />
                    <span>Owner: {project.owner_name}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                      {project.status.replace('_', ' ').toUpperCase()}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
                      {project.priority.toUpperCase()}
                    </span>
                    <span className="px-2 py-1 text-xs font-medium rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                      {project.project_type.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Clock size={14} />
                      <span className="text-gray-600">Tasks:</span>
                      <span className="font-medium text-gray-900">{project.task_count}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Tag size={14} />
                      <span className="text-gray-600">Labels:</span>
                      <span className="font-medium text-gray-900">{project.labels_count}</span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="text-xs text-gray-500">
                    Created: {formatDate(project.created_at)}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Project View Modal */}
      {isViewingProject && selectedProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{selectedProject.title}</h2>
              <button 
                onClick={() => setIsViewingProject(false)}
                className="text-gray-400 hover:text-gray-600"
                suppressHydrationWarning
              >
                ×
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Project Type</h3>
                  <p className="text-gray-600 capitalize">{selectedProject.project_type}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Owner</h3>
                  <p className="text-gray-600">{selectedProject.owner_name}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Start Date</h3>
                  <p className="text-gray-600">{formatDate(selectedProject.start_date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">End Date</h3>
                  <p className="text-gray-600">{formatDate(selectedProject.end_date)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Task Count</h3>
                  <p className="text-gray-600">{selectedProject.task_count}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Labels Count</h3>
                  <p className="text-gray-600">{selectedProject.labels_count}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex space-x-2">
                  <span className={`px-3 py-1 rounded border ${getStatusColor(selectedProject.status)}`}>
                    {selectedProject.status.replace('_', ' ').toUpperCase()}
                  </span>
                  <span className={`px-3 py-1 rounded border ${getPriorityColor(selectedProject.priority)}`}>
                    {selectedProject.priority.toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Created: {formatDate(selectedProject.created_at)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
