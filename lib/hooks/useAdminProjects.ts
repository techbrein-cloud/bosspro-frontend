import { useState, useEffect, useCallback } from 'react';
import { AdminProject, CreateProjectRequest, CreateProjectResponse, AdminUser, Department, Label } from '@/types';
import { getAllProjects, createProject, getAdminUsers, getDepartments, getLabels } from '@/lib/api';

export function useAdminProjects() {
  const [projects, setProjects] = useState<AdminProject[]>([]);
  const [availableUsers, setAvailableUsers] = useState<AdminUser[]>([]);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const projectsData = await getAllProjects();
      setProjects(projectsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      setError(errorMessage);
      console.error('Failed to fetch projects:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchFormData = useCallback(async () => {
    try {
      const [usersData, departmentsData, labelsData] = await Promise.all([
        getAdminUsers(),
        getDepartments(),
        getLabels({ is_active: true })
      ]);
      
      setAvailableUsers(usersData.users || []);
      setDepartments(departmentsData);
      setLabels(labelsData || []);
    } catch (err) {
      console.error('Failed to fetch form data:', err);
    }
  }, []);

  const createNewProject = useCallback(async (data: CreateProjectRequest): Promise<CreateProjectResponse> => {
    setCreating(true);
    setError(null);
    
    try {
      const newProject = await createProject(data);
      // Refresh projects list after creation
      await fetchProjects();
      return newProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    } finally {
      setCreating(false);
    }
  }, [fetchProjects]);

  const refreshProjects = useCallback(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    fetchProjects();
    fetchFormData();
  }, [fetchProjects, fetchFormData]);

  return {
    projects,
    availableUsers,
    departments,
    labels,
    loading,
    error,
    creating,
    createNewProject,
    refreshProjects,
  };
}
