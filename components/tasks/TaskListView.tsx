"use client";
import { useState, useEffect } from "react";
import { Calendar, User, Tag, Eye, Clock, Edit } from "lucide-react";
import { TaskListItem, TaskStatus, TaskPriority } from "@/types";
import { useTasks } from "@/lib/hooks/useTasks";
import { LoaderFive } from "@/components/ui/loader";
import { useRouter } from "next/navigation";

interface TaskListViewProps {
  projectId: number;
  onEditTask?: (task: TaskListItem) => void;
  filters?: {
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  };
}

export default function TaskListView({ projectId, onEditTask, filters }: TaskListViewProps) {
  const router = useRouter();
  const { tasks, loading, error, fetchTasks } = useTasks(projectId);
  const [filteredTasks, setFilteredTasks] = useState<TaskListItem[]>([]);

  // Apply filters to tasks
  useEffect(() => {
    let filtered = tasks;

    if (filters?.status_filter) {
      filtered = filtered.filter(task => task.status === filters.status_filter);
    }

    if (filters?.priority_filter) {
      filtered = filtered.filter(task => task.priority === filters.priority_filter);
    }

    setFilteredTasks(filtered);
  }, [tasks, filters]);

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800 border-gray-200";
      case "in_progress": return "bg-blue-100 text-blue-800 border-blue-200";
      case "review": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed": return "bg-green-100 text-green-800 border-green-200";
      case "cancelled": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const isOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
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
    <div className="space-y-4">
      {filteredTasks.length === 0 ? (
        <div className="text-center py-12 text-gray-500 bg-white rounded-lg border border-gray-200">
          <div className="text-lg mb-2">No tasks found</div>
          <div className="text-sm">Try adjusting your filters or create a new task</div>
        </div>
      ) : (
        filteredTasks.map((task) => (
          <div
            key={task.id}
            className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            {/* Task Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {task.title}
                  </h3>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                    {task.priority.toUpperCase()}
                  </span>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(task.status)}`}>
                    {task.status.replace('_', ' ').toUpperCase()}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  #{task.id} • {task.project_title}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => router.push(`/task/${task.id}`)}
                  className="text-indigo-600 hover:text-indigo-900 p-2 rounded-lg hover:bg-gray-100"
                  title="View task details"
                >
                  <Eye size={20} />
                </button>
                <button
                  onClick={() => onEditTask?.(task)}
                  className="text-gray-600 hover:text-gray-900 p-2 rounded-lg hover:bg-gray-100"
                  title="Edit task"
                >
                  <Edit size={20} />
                </button>
              </div>
            </div>

            {/* Task Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              {/* Assignee */}
              <div className="flex items-center space-x-2">
                <User size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Assignee</div>
                  <div className="text-sm font-medium text-gray-900">{task.assignee_name}</div>
                </div>
              </div>

              {/* Due Date */}
              <div className="flex items-center space-x-2">
                <Calendar size={16} className={isOverdue(task.due_date) ? "text-red-500" : "text-gray-400"} />
                <div>
                  <div className="text-xs text-gray-500">Due Date</div>
                  <div className={`text-sm font-medium ${isOverdue(task.due_date) ? "text-red-600" : "text-gray-900"}`}>
                    {formatDate(task.due_date)}
                    {isOverdue(task.due_date) && (
                      <span className="ml-1 text-xs text-red-500">(Overdue)</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Subtasks */}
              <div className="flex items-center space-x-2">
                <Tag size={16} className="text-gray-400" />
                <div>
                  <div className="text-xs text-gray-500">Subtasks</div>
                  <div className="text-sm font-medium text-gray-900">{task.subtask_count}</div>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Progress</span>
                <span className="text-sm text-gray-500">{task.done_percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    task.done_percentage === 100 ? 'bg-green-500' : 'bg-blue-600'
                  }`}
                  style={{ width: `${task.done_percentage}%` }}
                />
              </div>
            </div>

            {/* Task Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-4 text-xs text-gray-500">
                <div className="flex items-center space-x-1">
                  <Clock size={12} />
                  <span>Created {formatDate(task.created_at)}</span>
                </div>
              </div>
              <div className="text-xs text-gray-400">
                Task ID: #{task.id}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
