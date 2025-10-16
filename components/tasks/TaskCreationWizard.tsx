"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus } from "lucide-react";
import { useAppContext } from "@/context/AppContext";
import { useProjects } from "@/lib/hooks/useProjects";
import { CreateTaskRequest, UserListResponse } from "@/types";
import { createTask, getUsers, getLabels, createLabel } from "@/lib/api";
// import { useAuth } from "@clerk/nextjs"; // Commented out as not currently used

interface TaskCreationWizardProps {
  projectId: number;
}

const PREDEFINED_COLORS = [
  "#ff4444", "#ff8800", "#ffcc00", "#88cc00", "#00cc88",
  "#00ccff", "#4488ff", "#8844ff", "#cc44ff", "#ff4488"
];

export default function TaskCreationWizard({ projectId }: TaskCreationWizardProps) {
  const { isCreatingTask, setIsCreatingTask } = useAppContext();
  const { projects } = useProjects();
  // const { getToken } = useAuth(); // Commented out as not currently used
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [users, setUsers] = useState<Array<{ id: number; full_name: string; email: string }>>([]);
  const [labels, setLabels] = useState<Array<{ id: number; name: string; color: string }>>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingLabels, setLoadingLabels] = useState(false);
  
  // Label creation state
  const [isCreatingLabel, setIsCreatingLabel] = useState(false);
  const [newLabel, setNewLabel] = useState({
    name: "",
    description: "",
    color: "#ff4444",
    is_active: true
  });

  const [formData, setFormData] = useState<CreateTaskRequest>({
    title: "",
    description: "",
    project: projectId,
    department: 1, // Will be updated from selected project
    assignee: 0,
    start_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    estimated_time: 0,
    priority: "medium",
    status: "todo",
    task_type: "feature",
    labels: [],
  });

  // Find the selected project first
  const selectedProject = projects.find(p => p.id === projectId);

  // Load users and labels when modal opens
  useEffect(() => {
    if (isCreatingTask) {
      loadUsers();
      loadLabels();
    }
  }, [isCreatingTask]);

  // Update department from selected project
  useEffect(() => {
    if (selectedProject) {
      // Since the new API doesn't have department info in project, we'll use a default
      setFormData(prev => ({
        ...prev,
        department: 1 // Default department
      }));
    }
  }, [selectedProject]);
  
  if (!projectId || projectId <= 0) {
    return null;
  }

  const loadUsers = async () => {
    setLoadingUsers(true);
    try {
      const response: UserListResponse = await getUsers({ 
        page: 1, 
        page_size: 50, 
        is_active: true 
      });
      setUsers(response.users);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoadingUsers(false);
    }
  };

  const loadLabels = async () => {
    setLoadingLabels(true);
    try {
      const response = await getLabels();
      setLabels(response);
    } catch (error) {
      console.error('Failed to load labels:', error);
    } finally {
      setLoadingLabels(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'assignee' || name === 'estimated_time' || name === 'project' || name === 'department' 
        ? parseInt(value) || 0 
        : value
    }));
  };

  const handleLabelToggle = (labelId: number) => {
    setFormData(prev => ({
      ...prev,
      labels: prev.labels.includes(labelId)
        ? prev.labels.filter(id => id !== labelId)
        : [...prev.labels, labelId]
    }));
  };

  const handleCreateLabel = async () => {
    if (!newLabel.name.trim()) return;
    
    try {
      const createdLabel = await createLabel(newLabel);
      setLabels(prev => [...prev, createdLabel]);
      setFormData(prev => ({
        ...prev,
        labels: [...prev.labels, createdLabel.id]
      }));
      setNewLabel({
        name: "",
        description: "",
        color: "#ff4444",
        is_active: true
      });
      setIsCreatingLabel(false);
    } catch (error) {
      console.error('Failed to create label:', error);
    }
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      alert('Please enter a task title');
      return;
    }

    if (!formData.assignee || formData.assignee <= 0) {
      alert('Please select an assignee');
      return;
    }

    setIsSubmitting(true);
    try {
      await createTask(formData);
      setIsCreatingTask(false);
      // Reset form
      setFormData({
        title: "",
        description: "",
        project: projectId,
        department: 1,
        assignee: 0,
        start_date: new Date().toISOString().split('T')[0],
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        estimated_time: 0,
        priority: "medium",
        status: "todo",
        task_type: "feature",
        labels: [],
      });
      setCurrentStep(1);
    } catch (error) {
      console.error('Failed to create task:', error);
      alert('Failed to create task. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleClose = () => {
    setIsCreatingTask(false);
    setCurrentStep(1);
  };

  if (!isCreatingTask) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
              <p className="text-sm text-gray-500 mt-1">
                Project: {selectedProject?.title}
              </p>
            </div>
            <button
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>

          {/* Progress Steps */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-4">
              {[1, 2, 3].map((step) => (
                <div key={step} className="flex items-center">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step <= currentStep 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-600'
                  }`}>
                    {step}
                  </div>
                  {step < 3 && (
                    <div className={`w-16 h-1 mx-2 ${
                      step < currentStep ? 'bg-blue-600' : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-sm text-gray-600">
              <span>Basic Info</span>
              <span>Assignment</span>
              <span>Labels & Review</span>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6">
            {/* Step 1: Basic Information */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task title"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter task description"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start Date
                    </label>
                    <input
                      type="date"
                      name="start_date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Due Date *
                    </label>
                    <input
                      type="date"
                      name="due_date"
                      value={formData.due_date}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estimated Time (hours)
                  </label>
                  <input
                    type="number"
                    name="estimated_time"
                    value={formData.estimated_time}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Assignment & Priority */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Assignee *
                  </label>
                  <select
                    name="assignee"
                    value={formData.assignee}
                    onChange={handleInputChange}
                    disabled={loadingUsers}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50"
                  >
                    <option value={0}>Select an assignee</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.full_name} ({user.email})
                      </option>
                    ))}
                  </select>
                  {loadingUsers && (
                    <p className="text-sm text-gray-500 mt-1">Loading users...</p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Task Type
                    </label>
                    <select
                      name="task_type"
                      value={formData.task_type}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="feature">Feature</option>
                      <option value="bug">Bug</option>
                      <option value="improvement">Improvement</option>
                      <option value="documentation">Documentation</option>
                      <option value="testing">Testing</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="todo">To Do</option>
                    <option value="in_progress">In Progress</option>
                    <option value="review">Review</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3: Labels & Review */}
            {currentStep === 3 && (
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Labels
                    </label>
                    <button
                      onClick={() => setIsCreatingLabel(true)}
                      className="flex items-center text-sm text-blue-600 hover:text-blue-700"
                    >
                      <Plus size={16} className="mr-1" />
                      Create Label
                    </button>
                  </div>

                  {loadingLabels ? (
                    <p className="text-sm text-gray-500">Loading labels...</p>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {labels.map((label) => (
                        <button
                          key={label.id}
                          onClick={() => handleLabelToggle(label.id)}
                          className={`px-3 py-1 rounded-full text-sm font-medium border-2 transition-colors ${
                            formData.labels.includes(label.id)
                              ? 'border-blue-500 bg-blue-50 text-blue-700'
                              : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                          }`}
                          style={{
                            borderColor: formData.labels.includes(label.id) ? label.color : undefined,
                            backgroundColor: formData.labels.includes(label.id) ? `${label.color}20` : undefined,
                          }}
                        >
                          {label.name}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Create Label Form */}
                  {isCreatingLabel && (
                    <div className="mt-4 p-4 border border-gray-200 rounded-lg bg-gray-50">
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Create New Label</h4>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Label name"
                          value={newLabel.name}
                          onChange={(e) => setNewLabel(prev => ({ ...prev, name: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <input
                          type="text"
                          placeholder="Description (optional)"
                          value={newLabel.description}
                          onChange={(e) => setNewLabel(prev => ({ ...prev, description: e.target.value }))}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Color</label>
                          <div className="flex items-center space-x-2">
                            <div className="flex flex-wrap gap-2">
                              {PREDEFINED_COLORS.map((color) => (
                                <button
                                  key={color}
                                  onClick={() => setNewLabel(prev => ({ ...prev, color }))}
                                  className={`w-6 h-6 rounded-full border-2 ${
                                    newLabel.color === color ? 'border-gray-800' : 'border-gray-300'
                                  }`}
                                  style={{ backgroundColor: color }}
                                />
                              ))}
                            </div>
                            <input
                              type="color"
                              value={newLabel.color}
                              onChange={(e) => setNewLabel(prev => ({ ...prev, color: e.target.value }))}
                              className="w-8 h-8 rounded border border-gray-300"
                            />
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={handleCreateLabel}
                            className="px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm"
                          >
                            Create
                          </button>
                          <button
                            onClick={() => setIsCreatingLabel(false)}
                            className="px-3 py-1 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Task Summary */}
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-3">Task Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div><strong>Title:</strong> {formData.title}</div>
                    <div><strong>Assignee:</strong> {users.find(u => u.id === formData.assignee)?.full_name || 'Not selected'}</div>
                    <div><strong>Priority:</strong> {formData.priority}</div>
                    <div><strong>Due Date:</strong> {formData.due_date}</div>
                    <div><strong>Labels:</strong> {formData.labels.length} selected</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200">
            <div className="flex space-x-3">
              {currentStep > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Previous
                </button>
              )}
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleClose}
                className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              
              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={currentStep === 1 && !formData.title.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isSubmitting || !formData.title.trim() || !formData.assignee}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'Creating...' : 'Create Task'}
                </button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
