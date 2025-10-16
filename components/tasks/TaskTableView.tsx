"use client";
import { useState, useEffect } from "react";
import { Calendar, User, Tag, Eye, Edit } from "lucide-react";
import { TaskListItem, TaskStatus, TaskPriority } from "@/types";
import { useTasks } from "@/lib/hooks/useTasks";
import { LoaderFive } from "@/components/ui/loader";
import { useRouter } from "next/navigation";

interface TaskTableViewProps {
  projectId: number;
  onEditTask?: (task: TaskListItem) => void;
  filters?: {
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  };
}

export default function TaskTableView({ projectId, onEditTask, filters }: TaskTableViewProps) {
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
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
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
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Task
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Assignee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Priority
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Due Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Progress
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Subtasks
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredTasks.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                  <div className="text-lg mb-2">No tasks found</div>
                  <div className="text-sm">Try adjusting your filters or create a new task</div>
                </td>
              </tr>
            ) : (
              filteredTasks.map((task) => (
                <tr key={task.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {task.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{task.id} • {task.project_title}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{task.assignee_name}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(task.status)}`}>
                      {task.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(task.priority)}`}>
                      {task.priority.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar size={16} className="text-gray-400 mr-2" />
                      <div className="text-sm text-gray-900">{formatDate(task.due_date)}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-full bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${task.done_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm text-gray-900 min-w-0">
                        {task.done_percentage}%
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Tag size={16} className="text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900">{task.subtask_count}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => router.push(`/task/${task.id}`)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-gray-100"
                        title="View task details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => onEditTask?.(task)}
                        className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-100"
                        title="Edit task"
                      >
                        <Edit size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
