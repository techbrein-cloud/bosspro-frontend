"use client";
import { useEffect } from "react";
import { useProjects } from "@/lib/hooks/useProjects";
import { useRouter } from "next/navigation";
import { LoaderFive } from "@/components/ui/loader";

export default function TasksPage() {
  const { projects } = useProjects();
  const router = useRouter();

  // Auto-redirect to first project's tasks page
  useEffect(() => {
    if (projects.length > 0) {
      router.push(`/project/${projects[0].id}`);
    }
  }, [projects, router]);

  // Show loading while redirecting
  if (projects.length > 0) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="flex items-center justify-center h-64">
          <LoaderFive text="Loading Tasks..." />
        </div>
      </main>
    );
  }

  // Show message if no projects exist
  if (projects.length === 0) {
    return (
      <main className="ml-16 transition-all duration-300 p-8">
        <div className="text-center py-12">
          <div className="text-gray-500 mb-4">No projects found</div>
          <button 
            onClick={() => router.push('/projects')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Create a Project
          </button>
        </div>
      </main>
    );
  }

  return null; // This should never be reached
}
