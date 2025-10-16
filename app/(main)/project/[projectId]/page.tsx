"use client";
import { useState, useEffect, use } from "react";
import { useAppContext } from "@/context/AppContext";
import SecondSidebar from "@/components/layout/SecondSidebar";
import KanbanBoard from "@/components/tasks/KanbanBoard";
import TaskTableView from "@/components/tasks/TaskTableView";
import TaskListView from "@/components/tasks/TaskListView";
import TaskEditModal from "@/components/tasks/TaskEditModal";
import { Plus, Filter, LayoutDashboard, ArrowLeft } from "lucide-react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useRouter } from "next/navigation";
import { LoaderFive } from "@/components/ui/loader";
import TaskCreationWizard from "@/components/tasks/TaskCreationWizard";
import TaskFilters from "@/components/tasks/TaskFilters";
import { TaskListItem, TaskStatus, TaskPriority } from "@/types";

interface TasksPageProps {
  params: Promise<{
    projectId: string;
  }>;
}

export default function TasksPage({ params }: TasksPageProps) {
  const router = useRouter();
  const { setIsCreatingTask, isSecondSidebarOpen, setIsSecondSidebarOpen } = useAppContext();
  const { projects } = useProjects();
  const [viewMode, setViewMode] = useState<"kanban" | "table" | "list">("kanban");
  const [editingTask, setEditingTask] = useState<TaskListItem | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [taskFilters, setTaskFilters] = useState<{
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  }>({
    is_active: true, // Show only active tasks by default
  });
  
  // Unwrap params using React.use() for Next.js 15 compatibility
  const resolvedParams = use(params);
  const projectIdParam = resolvedParams.projectId;
  const projectId = parseInt(projectIdParam);
  
  // Validate projectId and ensure it's a valid number
  const isValidProjectId = !isNaN(projectId) && projectId > 0;
  
  if (!isValidProjectId) {
    console.error('Invalid project ID:', projectIdParam, 'parsed as:', projectId);
  }
  
  const selectedProject = projects.find(p => p.id === projectId);
    


  const mainMargin = "ml-[304px]"; // 64+240 - sidebar is always visible

  // Redirect if project not found
  useEffect(() => {
    if (projects.length > 0 && !selectedProject) {
      router.push('/projects');
    }
  }, [projects, selectedProject, router]);
  


  // Ensure sidebar is open when viewing project tasks
  useEffect(() => {
    if (!isSecondSidebarOpen) {
      setIsSecondSidebarOpen(true);
    }
  }, [isSecondSidebarOpen, setIsSecondSidebarOpen]);

  const handleProjectSelect = (projectId: number) => {
    if (!projectId || projectId <= 0) {
      console.error('Cannot select project: Invalid project ID:', projectId);
      return;
    }
    console.log('Selecting project:', projectId);
    router.push(`/project/${projectId}`);
  };

  const handleBackToTasks = () => {
    router.push('/projects');
  };

  const handleEditTask = (task: TaskListItem) => {
    if (!isValidProjectId) {
      console.error('Cannot edit task: Invalid project ID:', projectId);
      return;
    }
    console.log('Editing task:', task, 'for project:', projectId);
    setEditingTask(task);
  };

  const handleCloseEditModal = () => {
    setEditingTask(null);
  };

  const handleTaskUpdated = () => {
    // Force re-render by updating task filters with current values
    // This will trigger useEffect in view components to refresh data
    setTaskFilters(prev => ({ ...prev }));
  };

  const handleFiltersChange = (filters: {
    status_filter?: TaskStatus;
    priority_filter?: TaskPriority;
    is_active?: boolean;
  }) => {
    setTaskFilters(filters);
  };

  const handleOpenFilters = () => {
    setIsFiltersOpen(true);
  };

  const handleCloseFilters = () => {
    setIsFiltersOpen(false);
  };

  // Show loading state if we don't have a valid project ID or selected project
  if (!isValidProjectId || !selectedProject) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-center h-64">
          <LoaderFive text="Loading Tasks..." />
        </div>
      </main>
    );
  }

  return (
    <>
      <SecondSidebar 
        onProjectSelect={handleProjectSelect}
        selectedProjectId={projectId}
      />
      <main className={`${mainMargin} transition-all duration-300 p-8`}>
        <div className="space-y-6">
          <div className="flex items-center justify-between pr-16 md:pr-20">
            <div className="flex items-center space-x-4">
              <button onClick={() => setIsSecondSidebarOpen(!isSecondSidebarOpen)} className="text-gray-500 hover:text-gray-700">
                <LayoutDashboard size={20} />
              </button>
              <button onClick={handleBackToTasks} className="text-gray-500 hover:text-gray-700">
                <ArrowLeft size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{selectedProject.title}</h1>
                <p className="text-sm text-gray-500">Owner: {selectedProject.owner_name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleOpenFilters}
                className="flex items-center text-gray-500 hover:text-gray-700"
              >
                <Filter size={16} className="mr-2" />
                Filter
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between pr-16 md:pr-20">
            <div className="flex bg-gray-100 rounded-lg p-1">
              <button onClick={() => setViewMode("kanban")} className={`px-3 py-1 text-sm ${viewMode === "kanban" ? "bg-white rounded-md shadow-sm font-medium" : "text-gray-500"}`}>
                Kanban
              </button>
              <button onClick={() => setViewMode("table")} className={`px-3 py-1 text-sm ${viewMode === "table" ? "bg-white rounded-md shadow-sm font-medium" : "text-gray-500"}`}>
                Table
              </button>
              <button onClick={() => setViewMode("list")} className={`px-3 py-1 text-sm ${viewMode === "list" ? "bg-white rounded-md shadow-sm font-medium" : "text-gray-500"}`}>
                List view
              </button>
            </div>

            <button 
              onClick={() => setIsCreatingTask(true)} 
              disabled={!isValidProjectId}
              className={`flex items-center px-4 py-2 rounded-lg ${
                isValidProjectId
                  ? 'bg-blue-600 text-white hover:bg-blue-700' 
                  : 'bg-gray-400 text-gray-200 cursor-not-allowed'
              }`}
            >
              <Plus size={16} className="mr-2" />
              Create Task
            </button>
          </div>

          {viewMode === "kanban" && isValidProjectId && <KanbanBoard projectId={projectId} filters={taskFilters} />}
          {viewMode === "table" && isValidProjectId && (
            <TaskTableView 
              projectId={projectId} 
              onEditTask={handleEditTask}
              filters={taskFilters}
            />
          )}
          {viewMode === "list" && isValidProjectId && (
            <TaskListView 
              projectId={projectId} 
              onEditTask={handleEditTask}
              filters={taskFilters}
            />
          )}
        </div>
      </main>

      {/* Task Creation Wizard - only render when we have a valid project ID */}
      {isValidProjectId && selectedProject && (
        <TaskCreationWizard projectId={projectId} />
      )}
      

      
      {/* Task Edit Modal - only render when we have a valid project ID */}
      {editingTask && isValidProjectId && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={handleCloseEditModal}
          projectId={projectId}
          onUpdated={handleTaskUpdated}
        />
      )}

      {/* Task Filters Modal */}
      {isFiltersOpen && (
        <TaskFilters
          onFiltersChange={handleFiltersChange}
          onClose={handleCloseFilters}
          currentFilters={taskFilters}
        />
      )}
    </>
  );
}