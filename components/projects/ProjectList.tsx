"use client";

import { useState, useMemo } from "react";
import { Project, ProjectStatus, ProjectPriority, ProjectType } from "@/types";
import { useProjects } from "@/lib/hooks/useProjects";
import { LoaderFive } from "@/components/ui/loader";
import { Calendar, User, Tag, Clock, Eye, Search, Filter } from "lucide-react";

interface ProjectListProps {
  onViewProject?: (project: Project) => void;
}

interface ProjectFilters {
  search: string;
  status: ProjectStatus | "";
  priority: ProjectPriority | "";
  projectType: ProjectType | "";
}

export default function ProjectList({ onViewProject }: ProjectListProps) {
  const { projects, loading, error, fetchProjects } = useProjects();
  
  const [filters, setFilters] = useState<ProjectFilters>({
    search: "",
    status: "",
    priority: "",
    projectType: "",
  });

  const [showFilters, setShowFilters] = useState(false);

  // Frontend filtering logic
  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch = 
          (project.title || '').toLowerCase().includes(searchLower) ||
          (project.owner_name || '').toLowerCase().includes(searchLower);
        
        if (!matchesSearch) return false;
      }

      // Status filter
      if (filters.status && project.status !== filters.status) {
        return false;
      }

      // Priority filter
      if (filters.priority && project.priority !== filters.priority) {
        return false;
      }

      // Project type filter
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
      <div className="flex justify-center items-center py-12">
        <LoaderFive text="Loading projects..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-600 mb-2">Error loading projects</div>
        <div className="text-gray-500 text-sm">{error}</div>
        <button
          onClick={() => fetchProjects()}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
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
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {filteredProjects.length} of {projects.length} projects
        </div>
        {hasActiveFilters && (
          <div className="text-sm text-blue-600">
            Filters applied
          </div>
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
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-lg border border-gray-200 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
              onClick={() => onViewProject?.(project)}
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {project.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Created {formatDate(project.created_at)}
                    </p>
                  </div>
                  {onViewProject && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewProject(project);
                      }}
                      className="p-2 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50"
                      title="View project"
                    >
                      <Eye size={16} />
                    </button>
                  )}
                </div>

                {/* Status and Priority */}
                <div className="flex items-center space-x-2 mb-4">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(project.status)}`}>
                    {project.status.replace("_", " ").toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(project.priority)}`}>
                    {project.priority.toUpperCase()}
                  </span>
                  <span className="px-2 py-1 text-xs font-medium rounded-full border bg-purple-100 text-purple-800 border-purple-200">
                    {project.project_type.toUpperCase()}
                  </span>
                </div>

                {/* Project Details */}
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <User size={14} />
                    <span>Owner: {project.owner_name}</span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Calendar size={14} />
                    <span>
                      {formatDate(project.start_date)} - {formatDate(project.end_date)}
                    </span>
                  </div>
                </div>

                {/* Task and Label Count */}
                <div className="mt-4 pt-4 border-t border-gray-100">
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
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
