"use client";
import { useState } from "react";
import { Calendar, User, Tag } from "lucide-react";
import { TaskListItem, TaskStatus } from "@/types";
import { useRouter } from "next/navigation";

interface TaskCardProps {
  task: TaskListItem;
  onStatusChange?: (newStatus: TaskStatus) => void;
  onUpdated?: () => void;
}

export default function TaskCard({ task, onStatusChange, onUpdated }: TaskCardProps) {
  const router = useRouter();
  const [isDragging, setIsDragging] = useState(false);
  const priorityColors: Record<TaskListItem["priority"], string> = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800"
  };

  const statusColors: Record<TaskListItem["status"], string> = {
    todo: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    review: "bg-yellow-100 text-yellow-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800"
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const handleDragStart = (e: React.DragEvent) => {
    setIsDragging(true);
    e.dataTransfer.setData('taskId', task.id.toString());
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = parseInt(e.dataTransfer.getData('taskId'));
    if (taskId === task.id && onStatusChange) {
      // Handle status change logic here
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent navigation if user was dragging
    if (isDragging) {
      setIsDragging(false);
      return;
    }
    
    console.log(`Navigating to task detail page: /task/${task.id}`);
    router.push(`/task/${task.id}`);
  };

  return (
    <div
      className="group bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-3 cursor-pointer hover:shadow-lg hover:border-blue-200 transition-all duration-200"
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleCardClick}
    >
      {/* Task Header */}
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-gray-900 text-sm line-clamp-2">
          {task.title}
        </h4>
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${priorityColors[task.priority]}`}>
          {task.priority.toUpperCase()}
        </span>
      </div>

      {/* Task Details */}
      <div className="space-y-2">
        {/* Assignee */}
        <div className="flex items-center text-xs text-gray-600">
          <User size={12} className="mr-1" />
          <span>{task.assignee_name}</span>
        </div>

        {/* Due Date */}
        <div className="flex items-center text-xs text-gray-600">
          <Calendar size={12} className="mr-1" />
          <span>Due: {formatDate(task.due_date)}</span>
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between text-xs text-gray-600">
          <span>Progress: {task.done_percentage}%</span>
          {task.subtask_count > 0 && (
            <span className="flex items-center">
              <Tag size={12} className="mr-1" />
              {task.subtask_count} subtasks
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div 
            className="bg-blue-600 h-1.5 rounded-full transition-all duration-300" 
            style={{ width: `${task.done_percentage}%` }}
          />
        </div>
      </div>

      {/* Task Footer */}
      <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-100">
        <span className={`px-2 py-1 text-xs rounded-full font-medium ${statusColors[task.status]}`}>
          {task.status.replace('_', ' ').toUpperCase()}
        </span>
        <div className="flex items-center space-x-2">
          <div className="text-xs text-gray-500">
            #{task.id}
          </div>
          <div className="text-xs text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
            Click to view →
          </div>
        </div>
      </div>
    </div>
  );
}
