"use client";
import { motion } from "framer-motion";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { Clock, User, Calendar } from "lucide-react";
import Link from "next/link";

export default function RecentTasks() {
  const { dashboardData, loading, error } = useDashboard();

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-blue-100 text-blue-800';
      case 'todo': return 'bg-gray-100 text-gray-800';
      case 'review': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Recent Tasks</h3>
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center space-x-4 p-3 border rounded-lg animate-pulse">
              <div className="w-8 h-8 bg-gray-200 rounded"></div>
              <div className="flex-1">
                <div className="w-48 h-4 bg-gray-200 rounded mb-2"></div>
                <div className="w-32 h-3 bg-gray-200 rounded"></div>
              </div>
              <div className="w-16 h-6 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Recent Tasks</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading tasks: {error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || dashboardData.tasks.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Recent Tasks</h3>
        <div className="text-center py-8 text-gray-500">
          No tasks found
        </div>
      </div>
    );
  }

  // Get the most recent 5 tasks
  const recentTasks = dashboardData.tasks.slice(0, 5);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold">Recent Tasks</h3>
        <Link 
          href="/projects" 
          className="text-sm text-blue-600 hover:text-blue-800 font-medium"
        >
          View all
        </Link>
      </div>
      <div className="space-y-3">
        {recentTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="flex items-center space-x-4 p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex-shrink-0">
              <div className={`w-3 h-3 rounded-full ${
                task.status === 'completed' ? 'bg-green-500' :
                task.status === 'in_progress' ? 'bg-blue-500' :
                'bg-gray-400'
              }`}></div>
            </div>
            
            <div className="flex-1 min-w-0">
              <Link 
                href={`/task/${task.id}`}
                className="text-sm font-medium text-gray-900 hover:text-blue-600 truncate block"
                title={task.title}
              >
                {task.title}
              </Link>
              <div className="flex items-center space-x-3 mt-1">
                <div className="flex items-center text-xs text-gray-500">
                  <User size={12} className="mr-1" />
                  {task.assignee_name}
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar size={12} className="mr-1" />
                  {formatDate(task.due_date)}
                </div>
                {task.done_percentage > 0 && (
                  <div className="flex items-center text-xs text-gray-500">
                    <Clock size={12} className="mr-1" />
                    {task.done_percentage}%
                  </div>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`text-xs px-2 py-1 rounded-full ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                {task.status.replace('_', ' ')}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {dashboardData.tasks.length > 5 && (
        <div className="mt-4 pt-4 border-t text-center">
          <span className="text-sm text-gray-500">
            +{dashboardData.tasks.length - 5} more tasks
          </span>
        </div>
      )}
    </div>
  );
}
