import { useState, useEffect, useCallback, useMemo } from 'react';
import { Department, DepartmentFilters, CreateDepartmentRequest } from '@/types';
import { getDepartments, createDepartment } from '@/lib/api';

export function useDepartments() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<DepartmentFilters>({
    search: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  const fetchDepartments = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await getDepartments();
      setDepartments(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch departments';
      setError(errorMessage);
      console.error('Failed to fetch departments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter and sort departments on the frontend
  const filteredDepartments = useMemo(() => {
    let filtered = [...departments];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(dept => 
        dept.name.toLowerCase().includes(searchLower) ||
        dept.description.toLowerCase().includes(searchLower) ||
        dept.department_lead_name.toLowerCase().includes(searchLower)
      );
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;

      switch (filters.sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'created_at':
          aValue = new Date(a.created_at).getTime();
          bValue = new Date(b.created_at).getTime();
          break;
        case 'member_count':
          aValue = a.member_count;
          bValue = b.member_count;
          break;
        default:
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
      }

      if (aValue < bValue) {
        return filters.sortOrder === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return filters.sortOrder === 'asc' ? 1 : -1;
      }
      return 0;
    });

    return filtered;
  }, [departments, filters]);

  const refreshDepartments = useCallback(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  const createNewDepartment = useCallback(async (data: CreateDepartmentRequest) => {
    try {
      const response = await createDepartment(data);
      // Convert CreateDepartmentResponse to Department format
      const newDepartment: Department = {
        id: response.id,
        name: response.name,
        description: response.description,
        department_lead: response.department_lead,
        department_lead_name: response.department_lead_details.full_name,
        member_count: response.member_count,
        created_at: response.created_at,
      };
      // Add the new department to the list
      setDepartments(prev => [newDepartment, ...prev]);
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create department';
      setError(errorMessage);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, [fetchDepartments]);

  return {
    departments: filteredDepartments,
    loading,
    error,
    filters,
    setFilters,
    refreshDepartments,
    createNewDepartment,
    totalDepartments: departments.length,
    filteredCount: filteredDepartments.length,
  };
}
