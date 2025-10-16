import { useState, useEffect, useCallback } from 'react';
import { Project, CreateProjectRequest } from '@/types';
import { projectAPI } from '@/lib/api';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchProjects = useCallback(async () => {
    console.log('useProjects: Fetching projects');
    setLoading(true);
    setError(null);
    
    try {
      const response = await projectAPI.getProjects();
      console.log('useProjects: Fetched projects:', response);
      setProjects(response);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch projects';
      console.error('useProjects: Failed to fetch projects:', err);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (projectId: number) => {
    try {
      // Since we don't have delete endpoint, just remove from local state
      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to delete project';
      setError(errorMessage);
      throw err;
    }
  }, []);

  // Get a specific project
  const getProject = useCallback(async (projectId: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const project = await projectAPI.getProject(projectId);
      return project;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch project');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new project
  const createProject = useCallback(async (projectData: CreateProjectRequest) => {
    setLoading(true);
    setError(null);
    
    try {
      // TODO: Add createProject API endpoint when available
      // const newProject = await projectAPI.createProject(projectData);
      // setProjects(prev => [...prev, newProject]);
      // return newProject;
      
      // Temporary placeholder - simulate project creation
      const mockProject: Project = {
        id: Date.now(), // Temporary ID
        title: projectData.title,
        project_type: projectData.project_type,
        priority: projectData.priority,
        status: projectData.status,
        start_date: projectData.start_date,
        end_date: projectData.end_date,
        owner_name: 'Unknown', // Placeholder
        task_count: 0,
        labels_count: 0,
        created_at: new Date().toISOString(),
      };
      setProjects(prev => [...prev, mockProject]);
      return mockProject;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create project';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Clear error state
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    projects,
    loading,
    error,
    fetchProjects,
    deleteProject,
    getProject,
    createProject,
    clearError,
  };
};
