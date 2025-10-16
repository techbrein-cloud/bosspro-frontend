"use client";
import { useState } from "react";
import { X } from "lucide-react";
import { TaskStatus, TaskPriority } from "@/types";

interface TaskFiltersProps {
  onFiltersChange: (filters: {
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  }) => void;
  onClose: () => void;
  currentFilters?: {
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  };
}

export default function TaskFilters({ onFiltersChange, onClose, currentFilters }: TaskFiltersProps) {
  const [filters, setFilters] = useState({
    status_filter: (currentFilters?.status_filter || "") as TaskStatus | "",
    priority_filter: (currentFilters?.priority_filter || "") as TaskPriority | "",
    is_active: (currentFilters?.is_active ?? true) as boolean | null,
  });

  const handleFilterChange = (key: string, value: string | boolean | null) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    
    // Convert empty strings to undefined for API
    const apiFilters = {
      status_filter: newFilters.status_filter || undefined,
      priority_filter: newFilters.priority_filter || undefined,
      is_active: newFilters.is_active === null ? undefined : newFilters.is_active,
    };
    
    onFiltersChange(apiFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      status_filter: "" as TaskStatus | "",
      priority_filter: "" as TaskPriority | "",
      is_active: true as boolean | null,
    };
    setFilters(clearedFilters);
    onFiltersChange({
      status_filter: undefined,
      priority_filter: undefined,
      is_active: true,
    });
  };

  const statusOptions: { value: TaskStatus | ""; label: string }[] = [
    { value: "", label: "All Statuses" },
    { value: "todo", label: "To Do" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "completed", label: "Completed" },
    { value: "cancelled", label: "Cancelled" },
  ];

  const priorityOptions: { value: TaskPriority | ""; label: string }[] = [
    { value: "", label: "All Priorities" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const activeOptions: { value: boolean | null; label: string }[] = [
    { value: true, label: "Active Only" },
    { value: false, label: "Inactive Only" },
    { value: null, label: "All Tasks" },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Filter Tasks</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Status
            </label>
            <select
              value={filters.status_filter}
              onChange={(e) => handleFilterChange("status_filter", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Priority Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Priority
            </label>
            <select
              value={filters.priority_filter}
              onChange={(e) => handleFilterChange("priority_filter", e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priorityOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Active Status Filter */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Active Status
            </label>
            <select
              value={filters.is_active === null ? "null" : filters.is_active.toString()}
              onChange={(e) => {
                const value = e.target.value === "null" ? null : e.target.value === "true";
                handleFilterChange("is_active", value);
              }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {activeOptions.map((option) => (
                <option key={option.value === null ? "null" : option.value.toString()} value={option.value === null ? "null" : option.value.toString()}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          <button
            onClick={clearFilters}
            className="px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Apply Filters
          </button>
        </div>
      </div>
    </div>
  );
}
