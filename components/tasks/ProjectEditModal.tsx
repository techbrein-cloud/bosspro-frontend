"use client";
import { X } from "lucide-react";
import { Project } from "@/types";

interface ProjectEditModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ProjectEditModal({ project, isOpen, onClose }: ProjectEditModalProps) {
  // Temporary placeholder - project editing functionality was intentionally removed
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Edit Project</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Project editing functionality is currently disabled.</p>
          <p className="text-sm text-gray-500">
            {project ? `Project: ${project.title}` : 'No project selected'}
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

// TODO: Implement project editing functionality when needed
// Note: Project editing was intentionally removed from the current implementation
