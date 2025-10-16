"use client";
// import { Plus } from "lucide-react"; // Commented out as not currently used
import TaskCard from "./TaskCard";
// import { useAppContext } from "@/context/AppContext"; // Commented out as not currently used
import { useTasks } from "@/lib/hooks/useTasks";
import { TaskStatus, TaskPriority } from "@/types";
import { LoaderFive } from "@/components/ui/loader";
import { useEffect } from "react";

interface KanbanBoardProps {
  projectId?: number;
  filters?: {
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  };
}

export default function KanbanBoard({ projectId, filters }: KanbanBoardProps) {
  // const { setIsCreatingTask } = useAppContext(); // Commented out as not currently used
  const { tasksByStatus, loading, error, updateTaskStatus, fetchTasks } = useTasks(projectId);

  // Fetch tasks with filters when filters change
  useEffect(() => {
    if (filters) {
      // Transform filters to match fetchTasks expected format
      const transformedFilters = {
        status: filters.status_filter,
        priority: filters.priority_filter,
        // Note: fetchTasks doesn't currently use is_active, but we could extend it
      };
      fetchTasks(transformedFilters);
    }
  }, [filters, fetchTasks]);

  // Handler to refresh tasks with current filters
  const handleTaskUpdated = () => {
    if (filters) {
      const transformedFilters = {
        status: filters.status_filter,
        priority: filters.priority_filter,
      };
      fetchTasks(transformedFilters);
    } else {
      fetchTasks();
    }
  };

  const columns = [
    { 
      id: "todo" as TaskStatus, 
      title: "To Do", 
      color: "bg-gray-100",
      count: tasksByStatus.todo.length
    },
    { 
      id: "in_progress" as TaskStatus, 
      title: "In Progress", 
      color: "bg-blue-100",
      count: tasksByStatus.in_progress.length
    },
    { 
      id: "review" as TaskStatus, 
      title: "Review", 
      color: "bg-yellow-100",
      count: tasksByStatus.review.length
    },
    { 
      id: "completed" as TaskStatus, 
      title: "Completed", 
      color: "bg-green-100",
      count: tasksByStatus.completed.length
    },
    { 
      id: "cancelled" as TaskStatus, 
      title: "Cancelled", 
      color: "bg-red-100",
      count: tasksByStatus.cancelled.length
    }
  ] as const;

  const handleDragEnd = async (taskId: number, newStatus: TaskStatus) => {
    try {
      await updateTaskStatus(taskId, newStatus);
    } catch (error) {
      console.error('Failed to update task status:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoaderFive text="Loading Tasks..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-red-500">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="flex space-x-6 h-full overflow-x-auto">
      {columns.map((col) => (
        <div key={col.id} className="flex-shrink-0 w-80">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2">
              <h3 className="font-semibold text-gray-900">{col.title}</h3>
              <span className="bg-gray-200 text-gray-700 text-xs px-2 py-1 rounded-full">
                {col.count}
              </span>
            </div>
            {/* Removed inline Add new to avoid duplicate create entry points */}
          </div>

          <div className={`${col.color} rounded-lg p-4 min-h-96`}>
            {tasksByStatus[col.id].map((task) => (
              <TaskCard 
                key={task.id} 
                task={task} 
                onStatusChange={(newStatus) => handleDragEnd(task.id, newStatus)}
                onUpdated={handleTaskUpdated}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
