import { useState, useEffect, useCallback } from 'react';
import { UserRoleResponse, CreateUserRoleRequest, CreateUserRoleResponse, UpdateUserRoleRequest } from '@/types';
import { getUserRole, createUserRole, updateUserRole } from '@/lib/api';

export function useUserRole(userId: number) {
  const [userRole, setUserRole] = useState<UserRoleResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [assigningRole, setAssigningRole] = useState(false);
  const [updatingRole, setUpdatingRole] = useState(false);
  const [assignSuccess, setAssignSuccess] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const fetchUserRole = useCallback(async () => {
    if (!userId) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await getUserRole(userId);
      setUserRole(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch user role';
      setError(errorMessage);
      console.error('Failed to fetch user role:', err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const assignRole = useCallback(async (role: "admin" | "employee" | "project_manager") => {
    if (!userId) return;
    
    setAssigningRole(true);
    setError(null);
    
    try {
      const request: CreateUserRoleRequest = {
        user: userId,
        role: role,
      };
      
      const response: CreateUserRoleResponse = await createUserRole(request);
      
      setAssignSuccess(true);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setAssignSuccess(false), 3000);
      
      // Refresh user role data after successful assignment
      await fetchUserRole();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to assign role';
      setError(errorMessage);
      console.error('Failed to assign role:', err);
    } finally {
      setAssigningRole(false);
    }
  }, [userId, fetchUserRole]);

  const updateRole = useCallback(async (newRole: "admin" | "employee" | "project_manager") => {
    if (!userRole || !userRole.has_role) {
      setError('Cannot update role: User has no existing role');
      return;
    }

    // Validate inputs
    if (!userRole.role_id || !userRole.user_id) {
      setError('Missing required role or user ID');
      return;
    }

    // Validate role - allow the three valid roles
    const validRoles = ["admin", "employee", "project_manager"];
    
    if (!newRole || typeof newRole !== 'string') {
      setError('No role provided or invalid role type');
      return;
    }
    
    if (!validRoles.includes(newRole)) {
      setError(`Invalid role selected: ${newRole}. Valid roles are: ${validRoles.join(', ')}`);
      return;
    }

    setUpdatingRole(true);
    setError(null);
    
    try {
      // Use the role_id from the API response
      const updatePayload = {
        user: userRole.user_id,
        role: newRole,
      };
      
      await updateUserRole(userRole.role_id, updatePayload);
      
      setUpdateSuccess(true);
      // Auto-hide success message after 3 seconds
      setTimeout(() => setUpdateSuccess(false), 3000);
      
      // Refresh user role data
      await fetchUserRole();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to update user role';
      setError(errorMessage);
      console.error('Failed to update user role:', err);
    } finally {
      setUpdatingRole(false);
    }
  }, [userRole, userId, fetchUserRole]);

  const refreshUserRole = useCallback(() => {
    fetchUserRole();
  }, [fetchUserRole]);

  useEffect(() => {
    if (userId) {
      fetchUserRole();
    }
  }, [fetchUserRole, userId]);

  return {
    userRole,
    loading,
    error,
    assigningRole,
    updatingRole,
    assignSuccess,
    updateSuccess,
    assignRole,
    updateRole,
    refreshUserRole,
    setAssignSuccess,
    setUpdateSuccess,
  };
}
