"use client";
import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  Clock, 
  Tag, 
  CheckCircle, 
  Circle,
  Plus,
  Edit
} from "lucide-react";
import { getTask, getTaskSubtasks, updateSubtask } from "@/lib/api";
import { TaskResponse, SubtaskListItem, UpdateSubtaskRequest } from "@/types";
import { LoaderFive } from "@/components/ui/loader";

interface TaskDetailPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default function TaskDetailPage({ params }: TaskDetailPageProps) {
  const router = useRouter();
  const { taskId: taskIdParam } = use(params);
  const taskId = parseInt(taskIdParam);

  const [task, setTask] = useState<TaskResponse | null>(null);
  const [subtasks, setSubtasks] = useState<SubtaskListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtasksLoading, setSubtasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [updatingSubtasks, setUpdatingSubtasks] = useState<Set<number>>(new Set());

  useEffect(() => {
    if (taskId && taskId > 0) {
      loadTaskData();
    } else {
      setError('Invalid task ID');
      setLoading(false);
    }
  }, [taskId]);

  const loadTaskData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Load task details and subtasks in parallel
      const [taskData, subtasksData] = await Promise.all([
        getTask(taskId),
        getTaskSubtasks(taskId)
      ]);
      
      setTask(taskData);
      setSubtasks(subtasksData);
    } catch (err) {
      console.error('Failed to load task data:', err);
      setError(err instanceof Error ? err.message : 'Failed to load task');
    } finally {
      setLoading(false);
    }
  };

  const handleSubtaskToggle = async (subtask: SubtaskListItem) => {
    const subtaskId = subtask.id;
    setUpdatingSubtasks(prev => new Set(prev).add(subtaskId));
    
    try {
      const updateData: UpdateSubtaskRequest = {
        title: subtask.title,
        task: subtask.task,
        is_completed: !subtask.is_completed
      };
      
      await updateSubtask(subtaskId, updateData);
      
      // Update local state
      setSubtasks(prev => prev.map(st => 
        st.id === subtaskId 
          ? { ...st, is_completed: !st.is_completed }
          : st
      ));
    } catch (err) {
      console.error('Failed to update subtask:', err);
      alert('Failed to update subtask. Please try again.');
    } finally {
      setUpdatingSubtasks(prev => {
        const newSet = new Set(prev);
        newSet.delete(subtaskId);
        return newSet;
      });
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800 border-red-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "low": return "bg-green-100 text-green-800 border-green-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusColor = (status: string) => {
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
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const isOverdue = (dueDateString: string) => {
    const dueDate = new Date(dueDateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return dueDate < today;
  };

  const completedSubtasks = subtasks.filter(st => st.is_completed).length;
  const totalSubtasks = subtasks.length;
  const completionPercentage = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoaderFive text="Loading task details..." />
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <div className="text-red-500 text-lg mb-4">
          {error || 'Task not found'}
        </div>
        <button
          onClick={() => router.back()}
          className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
        >
          <ArrowLeft size={16} className="mr-2" />
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.back()}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
                <p className="text-sm text-gray-500">
                  Task #{task.id} • {task.project_details?.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getPriorityColor(task.priority)}`}>
                {task.priority.toUpperCase()}
              </span>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Task Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Task Info Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Task Details</h2>
              
              {task.description && (
                <div className="mb-6">
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Description</h3>
                  <p className="text-gray-600 whitespace-pre-wrap">{task.description}</p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <User size={16} className="text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Assignee</div>
                      <div className="font-medium text-gray-900">{task.assignee_details?.full_name}</div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Calendar size={16} className={isOverdue(task.due_date) ? "text-red-500" : "text-gray-400"} />
                    <div>
                      <div className="text-xs text-gray-500">Due Date</div>
                      <div className={`font-medium ${isOverdue(task.due_date) ? "text-red-600" : "text-gray-900"}`}>
                        {formatDate(task.due_date)}
                        {isOverdue(task.due_date) && (
                          <span className="ml-2 text-xs text-red-500">(Overdue)</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Clock size={16} className="text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Estimated Time</div>
                      <div className="font-medium text-gray-900">{task.estimated_time} hours</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Tag size={16} className="text-gray-400" />
                    <div>
                      <div className="text-xs text-gray-500">Labels</div>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {task.labels_details?.map((label) => (
                          <span
                            key={label.id}
                            className="px-2 py-1 text-xs rounded-full text-white"
                            style={{ backgroundColor: label.color }}
                          >
                            {label.name}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs text-gray-500 mb-2">Progress</div>
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-300 ${
                            task.done_percentage === 100 ? 'bg-green-500' : 'bg-blue-600'
                          }`}
                          style={{ width: `${task.done_percentage}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {task.done_percentage}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Subtasks Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Subtasks</h2>
                  <p className="text-sm text-gray-500">
                    {completedSubtasks} of {totalSubtasks} completed ({completionPercentage}%)
                  </p>
                </div>
                <button className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <Plus size={16} className="mr-2" />
                  Add Subtask
                </button>
              </div>

              {subtasks.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <div className="text-lg mb-2">No subtasks yet</div>
                  <div className="text-sm">Break down this task into smaller subtasks</div>
                </div>
              ) : (
                <div className="space-y-3">
                  {subtasks.map((subtask) => (
                    <motion.div
                      key={subtask.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex items-center space-x-3 p-3 rounded-lg border transition-all ${
                        subtask.is_completed 
                          ? 'bg-green-50 border-green-200' 
                          : 'bg-gray-50 border-gray-200 hover:bg-gray-100'
                      }`}
                    >
                      <button
                        onClick={() => handleSubtaskToggle(subtask)}
                        disabled={updatingSubtasks.has(subtask.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors ${
                          subtask.is_completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        } ${updatingSubtasks.has(subtask.id) ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      >
                        {updatingSubtasks.has(subtask.id) ? (
                          <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : subtask.is_completed ? (
                          <CheckCircle size={12} />
                        ) : null}
                      </button>
                      
                      <div className="flex-1">
                        <div className={`font-medium ${
                          subtask.is_completed 
                            ? 'text-green-800 line-through' 
                            : 'text-gray-900'
                        }`}>
                          {subtask.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          Assigned to {subtask.assignee_name} • Created {formatDate(subtask.created_at)}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Info */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Project</h3>
              <div className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {task.project_details?.title}
                  </div>
                  <div className="text-xs text-gray-500">
                    Owner: {task.project_details?.owner_name}
                  </div>
                </div>
                <div className="text-xs text-gray-500">
                  {task.project_details?.task_count} tasks • {task.project_details?.labels_count} labels
                </div>
              </div>
            </motion.div>

            {/* Task Meta */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Task Info</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created</span>
                  <span className="text-gray-900">{formatDate(task.created_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Updated</span>
                  <span className="text-gray-900">{formatDate(task.updated_at)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created by</span>
                  <span className="text-gray-900">{task.created_by_details?.full_name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time spent</span>
                  <span className="text-gray-900">{task.time_spent} hours</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
