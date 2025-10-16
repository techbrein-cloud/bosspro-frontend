"use client";
import { motion } from "framer-motion";
import { useDashboard } from "@/lib/hooks/useDashboard";
import { DashboardProject } from "@/types";

export default function ProjectProgressList() {
  const { dashboardData, loading, error } = useDashboard();

  // Calculate progress based on project status and task completion
  const getProjectProgress = (project: DashboardProject) => {
    const baseProgress = (() => {
      switch (project.status) {
        case "planning": return 10;
        case "in_progress": return 50;
        case "on_hold": return 30;
        case "completed": return 100;
        case "cancelled": return 0;
        default: return 0;
      }
    })();

    // If project has tasks, calculate based on task completion
    if (project.task_count > 0) {
      // This is a simplified calculation - in a real scenario, you'd want to get actual completion data
      return project.status === "completed" ? 100 : Math.min(baseProgress + (project.task_count * 5), 95);
    }

    return baseProgress;
  };

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="w-32 h-4 bg-gray-200 rounded animate-pulse"></div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2 animate-pulse"></div>
                <div className="w-8 h-4 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <p>Error loading project data: {error}</p>
        </div>
      </div>
    );
  }

  if (!dashboardData || dashboardData.projects.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
        <div className="text-center py-8 text-gray-500">
          No projects found
        </div>
      </div>
    );
  }

  // Get top 6 projects for dashboard display
  const dashboardProjects = dashboardData.projects.slice(0, 6);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <h3 className="text-lg font-semibold mb-6">Project Progress</h3>
      <div className="space-y-4">
        {dashboardProjects.map((project, index) => {
          const progress = getProjectProgress(project);
          return (
            <div key={project.id} className="flex items-center justify-between">
              <div className="flex-1 min-w-0 mr-4">
                <span className="text-sm font-medium text-gray-700 truncate block" title={project.title}>
                  {project.title}
                </span>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    project.status === 'completed' ? 'bg-green-100 text-green-800' :
                    project.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                    project.status === 'planning' ? 'bg-yellow-100 text-yellow-800' :
                    project.status === 'on_hold' ? 'bg-orange-100 text-orange-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {project.status.replace('_', ' ')}
                  </span>
                  <span className="text-xs text-gray-500">
                    {project.task_count} tasks
                  </span>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }} 
                    animate={{ width: `${progress}%` }} 
                    transition={{ delay: index * 0.2, duration: 1 }} 
                    className={`h-2 rounded-full ${
                      progress === 100 ? 'bg-green-600' : 
                      progress >= 75 ? 'bg-blue-600' : 
                      progress >= 50 ? 'bg-yellow-600' : 
                      progress >= 25 ? 'bg-orange-600' : 'bg-red-600'
                    }`} 
                  />
                </div>
                <span className="text-sm text-gray-500 min-w-[3rem] text-right">{progress}%</span>
              </div>
            </div>
          );
        })}
      </div>
      {dashboardData.projects.length > 6 && (
        <div className="mt-4 pt-4 border-t text-center">
          <span className="text-sm text-gray-500">
            +{dashboardData.projects.length - 6} more projects
          </span>
        </div>
      )}
    </div>
  );
}
