"use client";

import { useState, useEffect } from "react";
import { X, Building2, User, Users, AlertCircle, CheckCircle } from "lucide-react";
import { CreateDepartmentRequest, AdminUser } from "@/types";
import { getAdminUsers } from "@/lib/api";

interface DepartmentCreationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateDepartmentRequest) => Promise<void>;
  loading?: boolean;
}

export default function DepartmentCreationModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
}: DepartmentCreationModalProps) {
  const [formData, setFormData] = useState<CreateDepartmentRequest>({
    name: '',
    description: '',
    department_lead: 0,
    members: [],
  });
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);

  // Load users when modal opens
  useEffect(() => {
    if (isOpen) {
      loadUsers();
      // Reset form when modal opens
      setFormData({
        name: '',
        description: '',
        department_lead: 0,
        members: [],
      });
      setErrors({});
      setStep(1);
    }
  }, [isOpen]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response = await getAdminUsers();
      setUsers(response.users || []);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const validateStep1 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Department name is required';
    } else if (formData.name.length < 2) {
      newErrors.name = 'Department name must be at least 2 characters';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Department description is required';
    } else if (formData.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.department_lead) {
      newErrors.department_lead = 'Department lead is required';
    }
    
    if (formData.members.length === 0) {
      newErrors.members = 'At least one member is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    }
  };

  const handleBack = () => {
    setStep(1);
    setErrors({});
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (step === 1) {
      handleNext();
      return;
    }
    
    if (!validateStep2()) return;
    
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to create department:', error);
    }
  };

  const handleMemberToggle = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.includes(userId)
        ? prev.members.filter(id => id !== userId)
        : [...prev.members, userId]
    }));
    
    // Clear members error when user selects members
    if (errors.members) {
      setErrors(prev => ({ ...prev, members: '' }));
    }
  };

  const handleLeadChange = (userId: number) => {
    setFormData(prev => ({
      ...prev,
      department_lead: userId,
      // Automatically add lead to members if not already included
      members: prev.members.includes(userId) ? prev.members : [...prev.members, userId]
    }));
    
    // Clear lead error when user selects a lead
    if (errors.department_lead) {
      setErrors(prev => ({ ...prev, department_lead: '' }));
    }
  };

  const selectedLead = users.find(user => user.id === formData.department_lead);
  const selectedMembers = users.filter(user => formData.members.includes(user.id));

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Department
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            disabled={loading}
          >
            <X size={24} />
          </button>
        </div>

        {/* Progress Indicator */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center">
            <div className={`flex items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                1
              </div>
              <span className="ml-2 text-sm font-medium">Basic Info</span>
            </div>
            <div className={`flex-1 h-0.5 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`} />
            <div className={`flex items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
              }`}>
                2
              </div>
              <span className="ml-2 text-sm font-medium">Team Setup</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col flex-1 min-h-0">
          <div className="flex-1 overflow-y-auto p-4">
            {step === 1 ? (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, name: e.target.value }));
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
                      errors.name ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="e.g., Engineering, Marketing, Sales"
                    disabled={loading}
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description *
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => {
                      setFormData(prev => ({ ...prev, description: e.target.value }));
                      if (errors.description) setErrors(prev => ({ ...prev, description: '' }));
                    }}
                    rows={4}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${
                      errors.description ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Describe the department's purpose and responsibilities..."
                    disabled={loading}
                  />
                  {errors.description && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.description}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Department Lead Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Department Lead *
                  </label>
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading users...</span>
                    </div>
                  ) : (
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            formData.department_lead === user.id ? 'bg-blue-50 border-blue-200' : ''
                          }`}
                          onClick={() => handleLeadChange(user.id)}
                        >
                          <input
                            type="radio"
                            checked={formData.department_lead === user.id}
                            onChange={() => handleLeadChange(user.id)}
                            className="mr-3 text-blue-600"
                          />
                          <img
                            src={user.profile_image_url}
                            alt={user.full_name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                          <User size={16} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.department_lead && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.department_lead}
                    </p>
                  )}
                </div>

                {/* Members Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    Department Members * ({formData.members.length} selected)
                  </label>
                  {loadingUsers ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-gray-600">Loading users...</span>
                    </div>
                  ) : (
                    <div className="max-h-32 overflow-y-auto border border-gray-200 rounded-lg">
                      {users.map((user) => (
                        <div
                          key={user.id}
                          className={`flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 ${
                            formData.members.includes(user.id) ? 'bg-green-50 border-green-200' : ''
                          }`}
                          onClick={() => handleMemberToggle(user.id)}
                        >
                          <input
                            type="checkbox"
                            checked={formData.members.includes(user.id)}
                            onChange={() => handleMemberToggle(user.id)}
                            className="mr-3 text-blue-600"
                          />
                          <img
                            src={user.profile_image_url}
                            alt={user.full_name}
                            className="w-8 h-8 rounded-full mr-3"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                            <p className="text-xs text-gray-600">{user.email}</p>
                          </div>
                          {formData.department_lead === user.id && (
                            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full mr-2">
                              Lead
                            </span>
                          )}
                          <Users size={16} className="text-gray-400" />
                        </div>
                      ))}
                    </div>
                  )}
                  {errors.members && (
                    <p className="mt-1 text-sm text-red-600 flex items-center">
                      <AlertCircle size={16} className="mr-1" />
                      {errors.members}
                    </p>
                  )}
                </div>

                {/* Summary */}
                {selectedLead && selectedMembers.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Summary</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <p><strong>Department:</strong> {formData.name}</p>
                      <p><strong>Lead:</strong> {selectedLead.full_name}</p>
                      <p><strong>Members:</strong> {selectedMembers.length} people</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50 flex-shrink-0">
            <div className="flex space-x-3">
              {step === 2 && (
                <button
                  type="button"
                  onClick={handleBack}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={loading}
                >
                  Back
                </button>
              )}
            </div>
            
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : step === 1 ? (
                  'Next'
                ) : (
                  <>
                    <CheckCircle size={16} className="mr-2" />
                    Create Department
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
