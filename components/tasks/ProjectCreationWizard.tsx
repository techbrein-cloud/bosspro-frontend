"use client";
import { useAppContext } from "@/context/AppContext";
import { X } from "lucide-react";

export default function ProjectCreationWizard() {
  const { isCreatingProject, setIsCreatingProject } = useAppContext();
  
  // Temporary placeholder - disable project creation wizard until properly implemented
  if (!isCreatingProject) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Project Creation</h2>
          <button
            onClick={() => setIsCreatingProject(false)}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Project creation wizard is currently under development.</p>
          <p className="text-sm text-gray-500">This feature will be available soon.</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setIsCreatingProject(false)}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO: Implement full project creation wizard with correct types
// The original implementation had type mismatches with the Project interface
