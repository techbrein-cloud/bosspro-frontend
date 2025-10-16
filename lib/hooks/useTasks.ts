import { useState, useEffect, useCallback } from 'react';
import { useAppContext } from '@/context/AppContext';
import { getTasksByProject, updateTask } from '@/lib/api';
import { TaskListItem, TaskStatus, UpdateTaskRequest } from '@/types';

export const useTasks = (projectId?: number) => {
  const { tasksRefreshKey } = useAppContext();
  
  const [tasks, setTasks] = useState<TaskListItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchTasks = useCallback(async (_filters?: { status?: string; priority?: string; assignee?: number; label?: string; search?: string }) => {
    if (!projectId || projectId <= 0) {
      setTasks([]);
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      console.log(`Fetching tasks for project ${projectId}`);
      const fetchedTasks = await getTasksByProject(projectId);
      console.log(`Fetched ${fetchedTasks.length} tasks for project ${projectId}:`, fetchedTasks);
      setTasks(fetchedTasks);
    } catch (err) {
      console.error('Failed to fetch tasks:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  const updateTaskData = useCallback(async (taskId: number, data: UpdateTaskRequest) => {
    try {
      console.log(`Updating task ${taskId} with data:`, data);
      await updateTask(taskId, data);
      
      // Update the task in local state
      setTasks(prev => prev.map(task => 
        task.id === taskId ? { ...task, ...data } : task
      ));
      
      // Refresh tasks to get the latest data
      await fetchTasks();
      
      console.log(`Successfully updated task ${taskId}`);
    } catch (error) {
      console.error(`Failed to update task ${taskId}:`, error);
      throw error;
    }
  }, [fetchTasks]);

  const updateTaskStatus = useCallback(async (taskId: number, newStatus: TaskStatus) => {
    return updateTaskData(taskId, { status: newStatus });
  }, [updateTaskData]);

  const getTasksByStatus = useCallback((status: TaskStatus) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  // Group tasks by status for Kanban board
  const tasksByStatus = {
    todo: getTasksByStatus('todo'),
    in_progress: getTasksByStatus('in_progress'),
    review: getTasksByStatus('review'),
    completed: getTasksByStatus('completed'),
    cancelled: getTasksByStatus('cancelled'),
  };

  useEffect(() => {
    console.log(`useTasks useEffect triggered with projectId: ${projectId}`);
    if (projectId && projectId > 0) {
      fetchTasks();
    } else {
      setTasks([]);
    }
  }, [projectId, tasksRefreshKey, fetchTasks]);

  return {
    tasks,
    tasksByStatus,
    loading,
    error,
    fetchTasks,
    updateTaskData,
    updateTaskStatus,
    getTasksByStatus,
  };
};
