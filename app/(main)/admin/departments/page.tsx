"use client";

import { useState, useEffect } from "react";
import { Search, Plus, Users, Calendar, Building2, Filter, SortAsc, SortDesc, Eye, Edit } from "lucide-react";
import { useDepartments } from "@/lib/hooks/useDepartments";
import { DepartmentFilters, CreateDepartmentRequest } from "@/types";
import DepartmentCreationModal from "@/components/admin/DepartmentCreationModal";
import Link from "next/link";

export default function AdminDepartmentsPage() {
  const { 
    departments, 
    loading, 
    error, 
    filters, 
    setFilters, 
    refreshDepartments,
    createNewDepartment,
    totalDepartments,
    filteredCount 
  } = useDepartments();

  const [searchInput, setSearchInput] = useState(filters.search || '');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch by only rendering after client mount
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSearch = () => {
    setFilters(prev => ({
      ...prev,
      search: searchInput,
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleSortChange = (sortBy: DepartmentFilters['sortBy']) => {
    setFilters(prev => ({
      ...prev,
      sortBy,
      sortOrder: prev.sortBy === sortBy && prev.sortOrder === 'asc' ? 'desc' : 'asc',
    }));
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getSortIcon = (sortBy: DepartmentFilters['sortBy']) => {
    if (filters.sortBy !== sortBy) return null;
    return filters.sortOrder === 'asc' ? 
      <SortAsc size={16} className="ml-1" /> : 
      <SortDesc size={16} className="ml-1" />;
  };

  const handleCreateDepartment = async (data: CreateDepartmentRequest) => {
    setCreating(true);
    try {
      await createNewDepartment(data);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Failed to create department:', error);
      // Error is handled by the hook
    } finally {
      setCreating(false);
    }
  };

  // Show loading state until component is mounted to prevent hydration issues
  if (!mounted || (loading && departments.length === 0)) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
              <p className="text-gray-600">Manage organization departments</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading departments...</span>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          Error loading departments: {error}
          <button
            onClick={refreshDepartments}
            className="ml-4 px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
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
            <h1 className="text-2xl font-bold text-gray-900">Departments</h1>
            <p className="text-gray-600">
              Manage organization departments ({filteredCount} of {totalDepartments})
            </p>
          </div>
          <button 
            onClick={() => setShowCreateModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus size={20} className="mr-2" />
            Create Department
          </button>
        </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search departments by name, description, or lead..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={handleKeyPress}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Search
          </button>
        </div>

        {/* Sort Options */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200">
          <span className="text-sm text-gray-600 flex items-center mr-4">
            <Filter size={16} className="mr-1" />
            Sort by:
          </span>
          
          <button
            onClick={() => handleSortChange('name')}
            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
              filters.sortBy === 'name' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Name
            {getSortIcon('name')}
          </button>
          
          <button
            onClick={() => handleSortChange('member_count')}
            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
              filters.sortBy === 'member_count' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Members
            {getSortIcon('member_count')}
          </button>
          
          <button
            onClick={() => handleSortChange('created_at')}
            className={`flex items-center px-3 py-1 text-sm rounded-full transition-colors ${
              filters.sortBy === 'created_at' 
                ? 'bg-blue-100 text-blue-700' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Created Date
            {getSortIcon('created_at')}
          </button>
        </div>
      </div>

      {/* Departments Grid */}
      {departments.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm border p-12">
          <div className="text-center">
            <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {filters.search ? 'No departments found' : 'No departments yet'}
            </h3>
            <p className="text-gray-600 mb-6">
              {filters.search 
                ? 'Try adjusting your search criteria or clear the search to see all departments.'
                : 'Get started by creating your first department.'
              }
            </p>
            {filters.search ? (
              <button
                onClick={() => {
                  setSearchInput('');
                  setFilters(prev => ({ ...prev, search: '' }));
                }}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <button 
                onClick={() => setShowCreateModal(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus size={20} className="inline mr-2" />
                Create First Department
              </button>
            )}
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((department) => (
            <div key={department.id} className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
              <div className="p-6">
                {/* Department Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {department.name}
                    </h3>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {department.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Building2 size={24} className="text-blue-600" />
                  </div>
                </div>

                {/* Department Stats */}
                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users size={16} className="mr-2 text-gray-400" />
                    <span>{department.member_count} member{department.member_count !== 1 ? 's' : ''}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar size={16} className="mr-2 text-gray-400" />
                    <span>Created {formatDate(department.created_at)}</span>
                  </div>
                </div>

                {/* Department Lead */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">Department Lead</p>
                      <p className="text-sm font-medium text-gray-900">
                        {department.department_lead_name}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <Link 
                    href={`/admin/departments/${department.id}`}
                    className="flex-1 px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-center flex items-center justify-center"
                  >
                    <Eye size={16} className="mr-1" />
                    View Details
                  </Link>
                  <Link 
                    href={`/admin/departments/${department.id}`}
                    className="px-3 py-2 text-sm bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors flex items-center justify-center"
                  >
                    <Edit size={16} className="mr-1" />
                    Edit
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading overlay for refresh */}
      {loading && departments.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-700">Refreshing departments...</span>
            </div>
          </div>
        </div>
      )}

      {/* Department Creation Modal */}
      <DepartmentCreationModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onSubmit={handleCreateDepartment}
        loading={creating}
      />
      </div>
    </main>
  );
}
