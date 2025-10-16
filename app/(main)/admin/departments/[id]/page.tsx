"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Building2, 
  Users, 
  Calendar, 
  Edit, 
  Plus, 
  Trash2, 
  Crown, 
  Mail,
  User,
  CheckCircle,
  AlertCircle,
  X,
  AlertTriangle
} from "lucide-react";
import { useDepartmentDetails } from "@/lib/hooks/useDepartmentDetails";

export default function DepartmentDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const departmentId = parseInt(params.id as string);
  
  const {
    department,
    availableUsers,
    nonMembers,
    loading,
    error,
    updating,
    managingMembers,
    deleting,
    updateDepartmentDetails,
    addMember,
    removeMember,
    deleteDepartmentById,
    refreshDepartment,
  } = useDepartmentDetails(departmentId);

  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [editForm, setEditForm] = useState({
    name: '',
    description: '',
    department_lead: 0,
  });
  const [successMessage, setSuccessMessage] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleEditClick = () => {
    if (department) {
      setEditForm({
        name: department.name,
        description: department.description,
        department_lead: department.department_lead,
      });
      setShowEditModal(true);
    }
  };

  const handleUpdateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await updateDepartmentDetails(editForm);
      setShowEditModal(false);
      setSuccessMessage('Department updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update department:', error);
    }
  };

  const handleAddMember = async (userId: number) => {
    try {
      const response = await addMember(userId);
      setShowAddMemberModal(false);
      setSuccessMessage(response?.message || 'Member added successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  };

  const handleRemoveMember = async (userId: number, userName: string) => {
    if (confirm(`Are you sure you want to remove ${userName} from this department?`)) {
      try {
        const response = await removeMember(userId);
        setSuccessMessage(response?.message || 'Member removed successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } catch (error) {
        console.error('Failed to remove member:', error);
      }
    }
  };

  const handleDeleteDepartment = async () => {
    if (deleteConfirmText.toLowerCase() !== 'delete') {
      return;
    }

    try {
      await deleteDepartmentById();
      router.push('/admin/departments');
    } catch (error) {
      console.error('Failed to delete department:', error);
    }
  };

  if (loading && !department) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="flex items-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <span className="ml-3 text-gray-600">Loading department details...</span>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <AlertCircle className="mr-2" size={20} />
            <div>
              <h2 className="font-semibold">Error Loading Department</h2>
              <p>{error}</p>
            </div>
          </div>
          <button
            onClick={refreshDepartment}
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!department) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="text-center py-12">
          <Building2 size={48} className="mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Department Not Found</h3>
          <p className="text-gray-600 mb-4">The requested department could not be found.</p>
          <button
            onClick={() => router.push('/admin/departments')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Departments
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
          <div className="flex items-center">
            <button
              onClick={() => router.push('/admin/departments')}
              className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                <Building2 className="mr-3 text-blue-600" size={28} />
                {department.name}
              </h1>
              <p className="text-gray-600">Department Details & Management</p>
            </div>
          </div>
          <button
            onClick={handleEditClick}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            disabled={updating}
          >
            <Edit size={16} className="mr-2" />
            Edit Department
          </button>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
            <CheckCircle size={20} className="mr-2" />
            {successMessage}
          </div>
        )}

        {/* Department Info */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
              <p className="text-gray-900">{department.description}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Statistics</h3>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Users size={16} className="mr-2 text-gray-400" />
                  <span>{department.member_count} member{department.member_count !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Calendar size={16} className="mr-2 text-gray-400" />
                  <span>Created {formatDate(department.created_at)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Department Lead */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Crown className="mr-2 text-yellow-600" size={20} />
            Department Lead
          </h2>
          <div className="flex items-center">
            <img
              src={department.department_lead_details.profile_image_url}
              alt={department.department_lead_details.full_name}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h3 className="font-medium text-gray-900">{department.department_lead_details.full_name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <Mail size={14} className="mr-1" />
                {department.department_lead_details.email}
              </p>
            </div>
          </div>
        </div>

        {/* Department Members */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <Users className="mr-2 text-blue-600" size={20} />
              Department Members ({department.member_count})
            </h2>
            <button
              onClick={() => setShowAddMemberModal(true)}
              className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
              disabled={managingMembers}
            >
              <Plus size={16} className="mr-1" />
              Add Member
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {department.members_details.map((member) => (
              <div key={member.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center flex-1">
                    <img
                      src={member.profile_image_url}
                      alt={member.full_name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 truncate">{member.full_name}</h4>
                      <p className="text-sm text-gray-600 truncate">{member.email}</p>
                      {member.id === department.department_lead && (
                        <span className="inline-block mt-1 px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          Lead
                        </span>
                      )}
                    </div>
                  </div>
                  {member.id !== department.department_lead && (
                    <button
                      onClick={() => handleRemoveMember(member.id, member.full_name)}
                      className="ml-2 p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                      disabled={managingMembers}
                      title="Remove member"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Created By */}
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Created By</h2>
          <div className="flex items-center">
            <img
              src={department.created_by_details.profile_image_url}
              alt={department.created_by_details.full_name}
              className="w-10 h-10 rounded-full mr-3"
            />
            <div>
              <h3 className="font-medium text-gray-900">{department.created_by_details.full_name}</h3>
              <p className="text-sm text-gray-600">{formatDate(department.created_at)}</p>
            </div>
          </div>
        </div>

        {/* Danger Zone - Delete Department */}
        <div className="bg-white rounded-lg shadow-sm border border-red-200 p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
            <h2 className="text-lg font-semibold text-red-900">Danger Zone</h2>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="text-sm font-medium text-red-900 mb-2">Delete Department</h3>
            <p className="text-sm text-red-700 mb-4">
              Once you delete this department, there is no going back. This action cannot be undone and will permanently remove all department data.
            </p>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm font-medium"
              disabled={deleting}
            >
              <Trash2 size={16} className="mr-2" />
              Delete Department
            </button>
          </div>
        </div>
      </div>

      {/* Edit Department Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Edit Department</h3>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleUpdateDepartment} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Name
                  </label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm(prev => ({ ...prev, name: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department Lead
                  </label>
                  <select
                    value={editForm.department_lead}
                    onChange={(e) => setEditForm(prev => ({ ...prev, department_lead: parseInt(e.target.value) }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    {availableUsers.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {updating ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    'Update Department'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Member Modal */}
      {showAddMemberModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Department Member</h3>
              <button
                onClick={() => setShowAddMemberModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <p className="text-sm text-gray-600 mb-4">
                Select a user to add to the department:
              </p>
              
              {nonMembers.length === 0 ? (
                <div className="text-center py-8">
                  <User size={48} className="mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-600">All users are already members of this department.</p>
                </div>
              ) : (
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {nonMembers.map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleAddMember(user.id)}
                    >
                      <div className="flex items-center">
                        <img
                          src={user.profile_image_url}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full mr-3"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                          <p className="text-xs text-gray-600">{user.email}</p>
                        </div>
                      </div>
                      <Plus size={16} className="text-green-600" />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <AlertTriangle className="h-6 w-6 text-red-600 mr-3" />
                <h3 className="text-lg font-semibold text-red-900">Delete Department</h3>
              </div>
              <button
                onClick={() => {
                  setShowDeleteModal(false);
                  setDeleteConfirmText('');
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                disabled={deleting}
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6">
              <div className="mb-4">
                <p className="text-sm text-gray-700 mb-4">
                  This action cannot be undone. This will permanently delete the <strong>{department?.name}</strong> department and remove all associated data.
                </p>
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                  <p className="text-sm text-red-800">
                    <strong>Warning:</strong> All department members, data, and history will be permanently lost.
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type <strong>delete</strong> to confirm:
                </label>
                <input
                  type="text"
                  value={deleteConfirmText}
                  onChange={(e) => setDeleteConfirmText(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="delete"
                  disabled={deleting}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText('');
                  }}
                  className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteDepartment}
                  disabled={deleting || deleteConfirmText.toLowerCase() !== 'delete'}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {deleting ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 size={16} className="mr-2" />
                      Delete Department
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {(updating || managingMembers) && (
        <div className="fixed inset-0 bg-black bg-opacity-20 flex items-center justify-center z-40">
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-700">
                {updating ? 'Updating department...' : 'Managing members...'}
              </span>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
