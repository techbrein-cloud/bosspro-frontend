import { useState, useEffect, useCallback } from 'react';
import { AdminUser, AdminUsersResponse, AdminUsersFilters } from '@/types';
import { getAdminUsers } from '@/lib/api';

export function useAdminUsers() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pagination, setPagination] = useState({
    current_page: 1,
    total_pages: 1,
    total_users: 0,
    page_size: 20,
    has_next: false,
    has_previous: false,
  });

  const fetchUsers = useCallback(async (filters: AdminUsersFilters = {}) => {
    setLoading(true);
    setError(null);
    
    try {
      const response: AdminUsersResponse = await getAdminUsers(filters);
      setUsers(response.users);
      setPagination(response.pagination);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch users';
      setError(errorMessage);
      console.error('Failed to fetch admin users:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshUsers = useCallback((filters?: AdminUsersFilters) => {
    fetchUsers(filters);
  }, [fetchUsers]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    pagination,
    fetchUsers,
    refreshUsers,
  };
}
