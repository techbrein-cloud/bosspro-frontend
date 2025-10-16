import { useState, useEffect, useCallback } from 'react';
import { MyDepartmentResponse, MyDepartmentData } from '@/types';
import { getMyDepartment } from '@/lib/api';

export function useMyDepartment() {
  const [department, setDepartment] = useState<MyDepartmentData | null>(null);
  const [userRole, setUserRole] = useState<'lead' | 'member' | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [noDepartment, setNoDepartment] = useState(false);

  const fetchMyDepartment = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNoDepartment(false);
    
    try {
      const response: MyDepartmentResponse = await getMyDepartment();
      setDepartment(response.department);
      setUserRole(response.user_role_in_department);
    } catch (err) {
      const error = err as Error & { type?: string };
      
      if (error.type === 'no_department') {
        console.log('User not assigned to department - showing assignment message');
        setNoDepartment(true);
        setError(error.message);
      } else {
        console.error('Failed to fetch department details:', error.message);
        const errorMessage = error.message || 'Failed to fetch department details';
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshDepartment = useCallback(() => {
    fetchMyDepartment();
  }, [fetchMyDepartment]);

  useEffect(() => {
    fetchMyDepartment();
  }, [fetchMyDepartment]);

  return {
    department,
    userRole,
    loading,
    error,
    noDepartment,
    refreshDepartment,
  };
}
