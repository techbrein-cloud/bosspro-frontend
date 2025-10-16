"use client";
import { useState } from "react";
import { Search, Filter, X } from "lucide-react";
import { ProjectStatus, ProjectPriority, ProjectType } from "@/types";

interface ProjectFiltersProps {
  onFiltersChange: (filters: {
    search: string;
    status: ProjectStatus | "";
    priority: ProjectPriority | "";
    projectType: ProjectType | "";
    isActive: boolean | null;
  }) => void;
}

export default function ProjectFilters({ onFiltersChange }: ProjectFiltersProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<ProjectStatus | "">("");
  const [priority, setPriority] = useState<ProjectPriority | "">("");
  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [isActive, setIsActive] = useState<boolean | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const emit = (next: {
    search?: string;
    status?: ProjectStatus | "";
    priority?: ProjectPriority | "";
    projectType?: ProjectType | "";
    isActive?: boolean | null;
  }) => {
    onFiltersChange({
      search: next.search !== undefined ? next.search : search,
      status: next.status !== undefined ? next.status : status,
      priority: next.priority !== undefined ? next.priority : priority,
      projectType: next.projectType !== undefined ? next.projectType : projectType,
      isActive: next.isActive !== undefined ? next.isActive : isActive,
    });
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setProjectType("");
    setIsActive(null);
    onFiltersChange({
      search: "",
      status: "",
      priority: "",
      projectType: "",
      isActive: null,
    });
  };

  const hasActiveFilters = search || status || priority || projectType || isActive !== null;

  return (
    <div className="bg-white p-4 rounded-lg border mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search projects..."
              value={search}
              onChange={(e) => {
                const value = e.target.value;
                setSearch(value);
                emit({ search: value });
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center px-3 py-2 rounded-lg border ${
              showFilters ? "bg-blue-50 border-blue-200 text-blue-700" : "border-gray-300 text-gray-600"
            }`}
          >
            <Filter size={16} className="mr-2" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                {[search, status, priority, projectType, isActive !== null].filter(Boolean).length}
              </span>
            )}
          </button>
        </div>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center px-3 py-2 text-gray-600 hover:text-gray-800"
          >
            <X size={16} className="mr-1" />
            Clear
          </button>
        )}
      </div>

      {showFilters && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
            <select
              value={status}
              onChange={(e) => {
                const value = e.target.value as ProjectStatus | "";
                setStatus(value);
                emit({ status: value });
              }}
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
              value={priority}
              onChange={(e) => {
                const value = e.target.value as ProjectPriority | "";
                setPriority(value);
                emit({ priority: value });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Priorities</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Project Type</label>
            <select
              value={projectType}
              onChange={(e) => {
                const value = e.target.value as ProjectType | "";
                setProjectType(value);
                emit({ projectType: value });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Types</option>
              <option value="internal">Internal</option>
              <option value="external">External</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Active Status</label>
            <select
              value={isActive === null ? "" : isActive.toString()}
              onChange={(e) => {
                const value = e.target.value;
                const next = value === "" ? null : value === "true";
                setIsActive(next);
                emit({ isActive: next });
              }}
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
