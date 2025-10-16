"use client";
import { motion, AnimatePresence } from "framer-motion";
import { useProjects } from "@/lib/hooks/useProjects";
import { useRouter } from "next/navigation";

interface SecondSidebarProps {
  onProjectSelect?: (projectId: number) => void;
  selectedProjectId?: number;
}

export default function SecondSidebar({ onProjectSelect, selectedProjectId }: SecondSidebarProps) {
  const router = useRouter();
  const { projects } = useProjects();

  const handleProjectSelect = (project: typeof projects[0]) => {
    router.push(`/project/${project.id}`);
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ x: -240 }}
        animate={{ x: 0 }}
        exit={{ x: -240 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed left-16 top-0 h-full w-60 bg-white border-r border-gray-200 z-20 overflow-y-auto"
      >
        <div className="p-4">
          {/* Projects Section */}
          <div>
            <h3 className="text-xs uppercase tracking-wider text-gray-500 font-semibold mb-3">
              Projects
            </h3>
            {projects.length === 0 ? (
              <div className="text-center py-4 text-gray-500">
                <div className="text-sm">Loading projects...</div>
              </div>
            ) : (
              <div className="space-y-1">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => handleProjectSelect(project)}
                    className={`flex items-center w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors ${
                      selectedProjectId === project.id 
                        ? 'bg-blue-50 border border-blue-200' 
                        : 'border border-transparent'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mr-3 ${
                      selectedProjectId === project.id 
                        ? 'bg-blue-600' 
                        : 'bg-gray-400'
                    }`} />
                    <div className="flex-1 min-w-0">
                      <div className={`text-sm font-medium truncate ${
                        selectedProjectId === project.id 
                          ? 'text-blue-900' 
                          : 'text-gray-900'
                      }`}>
                        {project.title}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        Owner: {project.owner_name}
                      </div>
                      <div className="text-xs text-gray-500 truncate">
                        {project.task_count} tasks • {project.labels_count} labels
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
