import { useState, useEffect, useCallback } from 'react';
import { DepartmentDetailsResponse, UpdateDepartmentRequest, AddDepartmentMemberRequest, RemoveDepartmentMemberRequest, AdminUser } from '@/types';
import { getDepartmentDetails, updateDepartment, addDepartmentMember, removeDepartmentMember, deleteDepartment, getAdminUsers } from '@/lib/api';

export function useDepartmentDetails(departmentId: number) {
  const [department, setDepartment] = useState<DepartmentDetailsResponse | null>(null);
  const [availableUsers, setAvailableUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [managingMembers, setManagingMembers] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const fetchDepartmentDetails = useCallback(async () => {
    if (!departmentId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const [departmentData, usersData] = await Promise.all([
        getDepartmentDetails(departmentId),
        getAdminUsers()
      ]);
      
      setDepartment(departmentData);
      setAvailableUsers(usersData.users || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch department details';
      setError(errorMessage);
      console.error('Failed to fetch department details:', err);
    } finally {
      setLoading(false);
    }
  }, [departmentId]);

  const updateDepartmentDetails = useCallback(async (data: UpdateDepartmentRequest) => {
    if (!departmentId) return;
    
    setUpdating(true);
    setError(null);
    
    try {
      const updatedDepartment = await updateDepartment(departmentId, data);
      setDepartment(updatedDepartment);
      return updatedDepartment;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update department';
      setError(errorMessage);
      throw err;
    } finally {
      setUpdating(false);
    }
  }, [departmentId]);

  const addMember = useCallback(async (userId: number) => {
    if (!departmentId) return;
    
    setManagingMembers(true);
    setError(null);
    
    try {
      const response = await addDepartmentMember(departmentId, { user_id: userId });
      // Refresh department details after successful addition
      await fetchDepartmentDetails();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to add member';
      setError(errorMessage);
      throw err;
    } finally {
      setManagingMembers(false);
    }
  }, [departmentId, fetchDepartmentDetails]);

  const removeMember = useCallback(async (userId: number) => {
    if (!departmentId) return;
    
    setManagingMembers(true);
    setError(null);
    
    try {
      const response = await removeDepartmentMember(departmentId, { user_id: userId });
      // Refresh department details after successful removal
      await fetchDepartmentDetails();
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to remove member';
      setError(errorMessage);
      throw err;
    } finally {
      setManagingMembers(false);
    }
  }, [departmentId, fetchDepartmentDetails]);

  const deleteDepartmentById = useCallback(async () => {
    if (!departmentId) return;
    
    setDeleting(true);
    setError(null);
    
    try {
      await deleteDepartment(departmentId);
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete department';
      setError(errorMessage);
      throw err;
    } finally {
      setDeleting(false);
    }
  }, [departmentId]);

  const refreshDepartment = useCallback(() => {
    fetchDepartmentDetails();
  }, [fetchDepartmentDetails]);

  // Get users who are not currently members
  const nonMembers = availableUsers.filter(user => 
    !department?.members.includes(user.id)
  );

  useEffect(() => {
    fetchDepartmentDetails();
  }, [fetchDepartmentDetails]);

  return {
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
  };
}
