// Task API Types
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "todo" | "in_progress" | "review" | "completed" | "cancelled";
export type TaskType = "feature" | "bug" | "improvement" | "documentation" | "testing" | "other";

export type Subtask = {
  id: number;
  title: string;
  description: string;
  is_completed: boolean;
  is_active: boolean;
  task_id: number;
  created_at: string;
  updated_at: string | null;
};

// Task list response (simplified for task list)
export type TaskListItem = {
  id: number;
  title: string;
  project: number;
  project_title: string;
  assignee: number;
  assignee_name: string;
  priority: TaskPriority;
  status: TaskStatus;
  done_percentage: number;
  due_date: string;
  subtask_count: number;
  created_at: string;
};

// Full task details response
export type Task = {
  id: number;
  title: string;
  description: string;
  project: number;
  project_details: {
    id: number;
    title: string;
    project_type: ProjectType;
    priority: ProjectPriority;
    status: ProjectStatus;
    start_date: string;
    end_date: string;
    owner_name: string;
    task_count: number;
    labels_count: number;
    created_at: string;
  };
  department: number;
  department_details: {
    id: number;
    name: string;
    description: string;
    department_lead: number;
    department_lead_name: string;
    member_count: number;
    created_at: string;
  };
  start_date: string;
  due_date: string;
  end_date: string | null;
  estimated_time: number;
  time_spent: number;
  minimum_spend: number;
  done_percentage: number;
  assignee: number;
  assignee_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
  owner: number;
  owner_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
  priority: TaskPriority;
  status: TaskStatus;
  task_type: TaskType;
  labels: number[];
  labels_details: {
    id: number;
    name: string;
    color: string;
    is_active: boolean;
  }[];
  subtask_count: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
};

// Simplified task creation request
export type CreateTaskRequest = {
  title: string;
  description: string;
  project: number;
  department: number;
  assignee: number;
  start_date: string;
  due_date: string;
  estimated_time: number;
  priority: TaskPriority;
  status: TaskStatus;
  task_type: TaskType;
  labels: number[];
};

// Simplified task update request
export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  assignee?: number;
  project?: number;
  due_date?: string;
  estimated_time?: number;
  priority?: TaskPriority;
  status?: TaskStatus;
};

// Subtask types
export type SubtaskListItem = {
  id: number;
  title: string;
  task: number;
  task_title: string;
  assignee: number;
  assignee_name: string;
  is_completed: boolean;
  is_active: boolean;
  created_at: string;
};

export type UpdateSubtaskRequest = {
  title?: string;
  description?: string;
  task?: number;
  is_completed?: boolean;
};

export type SubtaskResponse = {
  id: number;
  title: string;
  description: string;
  task: number;
  task_details: {
    id: number;
    title: string;
    project: number;
    project_title: string;
    assignee: number;
    assignee_name: string;
    priority: TaskPriority;
    status: TaskStatus;
    done_percentage: number;
    due_date: string;
    subtask_count: number;
    created_at: string;
  };
  assignee: number;
  assignee_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
  is_completed: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
  };
};

// User types for user service - removed duplicate, using the one below
export type User = {
  id: number;
  full_name: string;
  email: string;
};

export type UserListResponse = {
  users: User[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_users: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export type UserListParams = {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
};

export type CreateSubtaskRequest = {
  title: string;
  description: string;
  is_completed: boolean;
  is_active: boolean;
  task_id: number;
  assignee?: number;
};

export type UpdateSubtaskRequest = {
  title?: string;
  description?: string;
  is_completed?: boolean;
  is_active?: boolean;
  assignee?: number;
};

export type TaskFilters = {
  skip?: number;
  limit?: number;
  project_id?: number;
  status_filter?: TaskStatus;
  priority_filter?: TaskPriority;
  is_active?: boolean;
};

// User Profile and Roles types
export type UserProfile = {
  id: number;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  full_name: string;
  profile_image_url: string;
  is_active: boolean;
  email_verified: boolean;
  phone_number: string | null;
  organization: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
};

// Admin User Management types
export type AdminUser = {
  id: number;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  full_name: string;
  profile_image_url: string;
  is_active: boolean;
  email_verified: boolean;
  phone_number: string | null;
  organization: string | null;
  role: string;
  created_at: string;
  updated_at: string;
  last_sign_in_at: string | null;
};

export type AdminUsersResponse = {
  users: AdminUser[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_users: number;
    page_size: number;
    has_next: boolean;
    has_previous: boolean;
  };
};

export type AdminUsersFilters = {
  page?: number;
  page_size?: number;
  search?: string;
  role?: string;
  is_active?: boolean;
};

// User Role Management types
export type UserRoleResponse = {
  user_id: number;
  role_id: number; // Now required as API always returns it
  email: string;
  full_name: string;
  role: string | null;
  role_display: string | null;
  has_role: boolean;
  created_at?: string;
  updated_at?: string;
  message?: string;
};

export type CreateUserRoleRequest = {
  user: number;
  role: "admin" | "employee" | "project_manager";
};

export type UpdateUserRoleRequest = {
  user: number;
  role: "admin" | "employee" | "project_manager";
};

export type CreateUserRoleResponse = {
  id: number;
  user: number;
  user_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
  role: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
};

export type UserRole = {
  id: number;
  user: number;
  user_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
  role: string;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: string | null;
  };
};

export type TaskListResponse = Task[];
export type TaskResponse = Task;

// Legacy Task Types (keeping for backward compatibility)
export type LegacyTaskPriority = "High" | "Medium" | "Low";
export type LegacyTaskStatus = "Pending" | "In Progress" | "Complete" | "Do Later" | "Archived";

export type LegacyTask = {
  id: number;
  title: string;
  description: string;
  priority: LegacyTaskPriority;
  status: LegacyTaskStatus;
  assignees?: { name: string; avatar: string }[];
  attachments: number;
  comments: number;
  checklist?: { completed: number; total: number };
  type: "Bug" | "Feature" | "Task" | "Review" | "Request";
  department: string;
};
// Project API Types
export type ProjectPriority = "low" | "medium" | "high";
export type ProjectStatus = "planning" | "in_progress" | "completed" | "on_hold" | "cancelled";
export type ProjectType = "internal" | "external";

export interface Project {
  id: number;
  title: string;
  project_type: ProjectType;
  priority: ProjectPriority;
  status: ProjectStatus;
  start_date: string;
  end_date: string;
  owner_name: string;
  task_count: number;
  labels_count: number;
  created_at: string;
};

// CreateProjectRequest is defined below in the Admin section

export type ProjectFilters = {
  skip?: number;
  limit?: number;
  status_filter?: ProjectStatus;
  is_active?: boolean;
};

export type ProjectListResponse = Project[];
export type ProjectResponse = Project;
export type ProjectWithTasksResponse = string; // This seems to be a placeholder in the API

// Department API Types
export type Department = {
  id: number;
  name: string;
  description: string;
  department_lead: number;
  department_lead_name: string;
  member_count: number;
  created_at: string;
};

export type DepartmentListResponse = Department[];
export type DepartmentResponse = Department;

export type DepartmentFilters = {
  search?: string;
  sortBy?: 'name' | 'created_at' | 'member_count';
  sortOrder?: 'asc' | 'desc';
};

export type CreateDepartmentRequest = {
  name: string;
  description: string;
  department_lead: number;
  members: number[];
};

export type DepartmentUserDetails = {
  id: number;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  full_name: string;
  profile_image_url: string;
  is_active: boolean;
  phone_number: string | null;
  organization: string | null;
};

export type CreateDepartmentResponse = {
  id: number;
  name: string;
  description: string;
  department_lead: number;
  department_lead_details: DepartmentUserDetails;
  members: number[];
  members_details: DepartmentUserDetails[];
  member_count: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: DepartmentUserDetails;
};

export type DepartmentDetailsResponse = {
  id: number;
  name: string;
  description: string;
  department_lead: number;
  department_lead_details: DepartmentUserDetails;
  members: number[];
  members_details: DepartmentUserDetails[];
  member_count: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: DepartmentUserDetails;
};

export type UpdateDepartmentRequest = {
  name?: string;
  description?: string;
  department_lead?: number;
  members?: number[];
};

export type AddDepartmentMemberRequest = {
  user_id: number;
};

export type RemoveDepartmentMemberRequest = {
  user_id: number;
};

export type MemberOperationResponse = {
  message: string;
};

// Admin Projects Types
export type AdminProject = {
  id: number;
  title: string;
  project_type: 'internal' | 'external';
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  start_date: string;
  end_date: string;
  owner_name: string;
  task_count: number;
  labels_count: number;
  created_at: string;
};

export type AdminProjectsResponse = AdminProject[];

export type CreateProjectRequest = {
  title: string;
  description: string;
  project_type: 'internal' | 'external';
  start_date: string;
  end_date: string;
  estimated_duration: number;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  department: number | null;
  project_owner: number | null;
  labels: number[];
};

export type CreateProjectResponse = {
  id: number;
  title: string;
  description: string;
  project_type: 'internal' | 'external';
  start_date: string;
  end_date: string;
  estimated_duration: number;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  department: number | null;
  department_details: any | null;
  project_owner: number;
  project_owner_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: any | null;
  };
  owner_name: string;
  labels: number[];
  labels_details: any[];
  task_count: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: {
    id: number;
    clerk_id: string;
    email: string;
    first_name: string;
    last_name: string;
    username: string | null;
    full_name: string;
    profile_image_url: string;
    is_active: boolean;
    phone_number: string | null;
    organization: any | null;
  };
};

// Label API Types
export type Label = {
  id: number;
  name: string;
  description: string;
  color: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};
export type LabelListResponse = Label[];
export type LabelResponse = Label;

// AI Chat API Types
export type AIChatRequest = {
  token: string;
  message: string;
};

export type AIChatResponse = {
  output: string;
};

// My Department API Types
export type MyDepartmentUser = {
  id: number;
  clerk_id: string;
  email: string;
  first_name: string;
  last_name: string;
  username: string | null;
  full_name: string;
  profile_image_url: string;
  is_active: boolean;
  phone_number: string | null;
  organization: string | null;
  role?: string;
  role_details?: {
    id: number;
    role: string;
    created_at: string;
    updated_at: string;
  };
  created_at: string;
  last_sign_in_at: string | null;
};

export type MyDepartmentProject = {
  id: number;
  title: string;
  description: string;
  project_type: 'internal' | 'external';
  start_date: string;
  end_date: string;
  estimated_duration: number;
  priority: 'low' | 'medium' | 'high';
  status: 'planning' | 'in_progress' | 'completed' | 'on_hold' | 'cancelled';
  department: number;
  department_details: {
    id: number;
    name: string;
    description: string;
    department_lead: number;
    department_lead_name: string;
    member_count: number;
    created_at: string;
  };
  project_owner: number | null;
  project_owner_details: MyDepartmentUser | null;
  owner_name: string;
  labels: number[];
  labels_details: Label[];
  task_count: number;
  created_at: string;
  updated_at: string;
  created_by: number;
  created_by_details: MyDepartmentUser;
};

export type MyDepartmentData = {
  id: number;
  name: string;
  description: string;
  department_lead: number;
  department_lead_details: MyDepartmentUser;
  members: number[];
  members_details: MyDepartmentUser[];
  created_by: number;
  created_by_details: MyDepartmentUser;
  projects: MyDepartmentProject[];
  member_count: number;
  project_count: number;
  active_project_count: number;
  completed_project_count: number;
  total_tasks_count: number;
  user_role_in_department: 'lead' | 'member';
  created_at: string;
  updated_at: string;
};

export type MyDepartmentResponse = {
  department: MyDepartmentData;
  user_role_in_department: 'lead' | 'member';
  message: string;
};

// Dashboard API Types
export interface DashboardProject {
  id: number;
  title: string;
  project_type: string;
  priority: string;
  status: string;
  start_date: string;
  end_date: string;
  owner_name: string;
  task_count: number;
  labels_count: number;
  created_at: string;
}

export interface DashboardTask {
  id: number;
  title: string;
  project: number;
  project_title: string;
  assignee: number;
  assignee_name: string;
  priority: string;
  status: string;
  done_percentage: number;
  due_date: string;
  subtask_count: number;
  created_at: string;
}

export interface DashboardSubtask {
  id: number;
  title: string;
  task: number;
  task_title: string;
  assignee: number;
  assignee_name: string;
  is_completed: boolean;
  is_active: boolean;
  created_at: string;
}

export interface DashboardResponse {
  projects: DashboardProject[];
  tasks: DashboardTask[];
  subtasks: DashboardSubtask[];
  total_projects: number;
  total_tasks: number;
  total_subtasks: number;
  completed_tasks: number;
  pending_tasks: number;
}
