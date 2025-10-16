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
  Edit,
  Check
} from "lucide-react";
import { getTask, getTaskSubtasks, updateSubtask } from "@/lib/api";
import { TaskResponse, SubtaskListItem, UpdateSubtaskRequest, Task, Subtask } from "@/types";
import { LoaderFive } from "@/components/ui/loader";
import SubtaskCreationModal from "@/components/tasks/SubtaskCreationModal";

interface TaskViewPageProps {
  params: Promise<{
    taskId: string;
  }>;
}

export default function TaskViewPage({ params }: TaskViewPageProps) {
  const router = useRouter();
  const { taskId: taskIdParam } = use(params);
  const taskId = parseInt(taskIdParam);

  const [task, setTask] = useState<TaskResponse | null>(null);
  const [subtasks, setSubtasks] = useState<SubtaskListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [subtasksLoading, setSubtasksLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubtaskModalOpen, setIsSubtaskModalOpen] = useState(false);
  const [updatingSubtasks, setUpdatingSubtasks] = useState<Set<number>>(new Set());

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

  useEffect(() => {
    if (taskId && taskId > 0) {
      loadTaskData();
    } else {
      setError('Invalid task ID');
      setLoading(false);
    }
  }, [taskId]);

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

  const handleSubtaskCreated = () => {
    loadTaskData(); // Reload task to get new subtasks
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800"; 
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "todo": return "bg-gray-100 text-gray-800";
      case "in_progress": return "bg-blue-100 text-blue-800";
      case "review": return "bg-yellow-100 text-yellow-800";
      case "completed": return "bg-green-100 text-green-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  if (loading || !task) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-between mb-6 pr-16 md:pr-20">
          <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
            <ArrowLeft size={20} />
          </button>
          {/* <div className="text-gray-900 font-semibold">Task Details</div> */}
          <div />
        </div>
        <div className="flex items-center justify-center h-64">
          {error ? <div className="text-red-500">Error: {error}</div> : <LoaderFive text="Loading Task..." />}
        </div>
      </main>
    );
  }

  return (
    <main className="ml-16 transition-all duration-300 p-8">
      <div className="space-y-6">
        <div className="flex items-center justify-between pr-16 md:pr-20">
          <div className="flex items-center space-x-4">
            <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
              <p className="text-sm text-gray-500">Task ID: {task.id}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pr-16 md:pr-20">
          <div className="lg:col-span-2 space-y-6">
            <section className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-3">Description</h2>
              <p className="text-gray-700 whitespace-pre-wrap">{task.description || "No description provided"}</p>
            </section>

            <section className="bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Timeline</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
                <div><span className="text-gray-500">Start:</span> {task.start_date ? new Date(task.start_date).toLocaleDateString() : 'Not set'}</div>
                <div><span className="text-gray-500">Due:</span> {new Date(task.due_date).toLocaleDateString()}</div>
                <div><span className="text-gray-500">End:</span> {task.end_date ? new Date(task.end_date).toLocaleDateString() : 'Not set'}</div>
              </div>
            </section>

            {/* Subtasks Section */}
            <section className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-lg font-semibold">Subtasks</h2>
                  {subtasks.length > 0 && (
                    <p className="text-sm text-gray-500">
                      {subtasks.filter(st => st.is_completed).length} of {subtasks.length} completed
                    </p>
                  )}
                </div>
                <button
                  onClick={() => setIsSubtaskModalOpen(true)}
                  className="flex items-center space-x-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  <Plus size={16} />
                  <span>Add Subtask</span>
                </button>
              </div>
              
              {subtasks.length > 0 ? (
                <div className="space-y-2">
                  {subtasks.map((subtask: SubtaskListItem) => (
                    <div
                      key={subtask.id}
                      className="flex items-center space-x-3 p-3 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
                    >
                      <button
                        onClick={() => handleSubtaskToggle(subtask)}
                        disabled={updatingSubtasks.has(subtask.id)}
                        className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          subtask.is_completed
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 hover:border-green-400'
                        } ${updatingSubtasks.has(subtask.id) ? 'opacity-50' : ''}`}
                      >
                        {subtask.is_completed && <Check size={12} />}
                      </button>
                      <div className="flex-1">
                        <div
                          className={`text-sm font-medium ${
                            subtask.is_completed
                              ? 'line-through text-gray-500'
                              : 'text-gray-900'
                          }`}
                        >
                          {subtask.title}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Assigned to {subtask.assignee_name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CheckCircle size={48} className="mx-auto mb-2 text-gray-300" />
                  <p>No subtasks yet</p>
                  <p className="text-sm">Click &quot;Add Subtask&quot; to create your first subtask</p>
                </div>
              )}
            </section>
          </div>

          <aside className="space-y-6">
            <section className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Status & Priority</h3>
              <div className="flex flex-wrap gap-2 text-xs">
                <span className={`px-2 py-1 rounded font-medium ${getStatusColor(task.status)}`}>
                  {task.status.replace('_', ' ').toUpperCase()}
                </span>
                <span className={`px-2 py-1 rounded font-medium ${getPriorityColor(task.priority)}`}>
                  {task.priority.toUpperCase()}
                </span>
                <span className="px-2 py-1 rounded bg-gray-100 text-gray-800 font-medium">
                  {task.task_type}
                </span>
              </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border p-6 space-y-2 text-sm text-gray-700">
              <div><span className="text-gray-500">Project:</span> {task.project_details?.title}</div>
              <div><span className="text-gray-500">Department:</span> {task.department_details?.name || 'Not assigned'}</div>
              <div><span className="text-gray-500">Labels:</span> {task.labels_details?.map(label => label.name).join(', ') || 'None'}</div>
              <div><span className="text-gray-500">Estimated:</span> {task.estimated_time}h</div>
              <div><span className="text-gray-500">Spent:</span> {task.time_spent}h</div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Progress</span>
                  <span className="text-gray-900 font-medium">{task.done_percentage}%</span>
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
              <div><span className="text-gray-500">Assignee:</span> {task.assignee_details?.full_name || 'Unassigned'}</div>
              <div className="text-xs text-gray-400">Created: {new Date(task.created_at).toLocaleString()}</div>
              <div className="text-xs text-gray-400">Updated: {new Date(task.updated_at).toLocaleString()}</div>
            </section>
          </aside>
        </div>
      </div>

      {/* Subtask Creation Modal */}
      <SubtaskCreationModal
        isOpen={isSubtaskModalOpen}
        onClose={() => setIsSubtaskModalOpen(false)}
        taskId={taskId}
        onSubtaskCreated={handleSubtaskCreated}
      />
    </main>
  );
}


