import { 
  ProjectListResponse, 
  ProjectResponse,
  DepartmentListResponse, 
  DepartmentResponse,
  LabelListResponse, 
  LabelResponse,
  Task,
  TaskListItem,
  TaskFilters,
  TaskResponse,
  CreateTaskRequest, 
  UpdateTaskRequest, 
  TaskListResponse, 
  Subtask,
  SubtaskListItem,
  SubtaskResponse,
  CreateSubtaskRequest, 
  UpdateSubtaskRequest,
  UserListParams,
  UserListResponse,
  UserProfile,
  UserRole,
  DashboardResponse,
  AdminUsersResponse,
  AdminUsersFilters,
  UserRoleResponse,
  CreateUserRoleRequest,
  CreateUserRoleResponse,
  UpdateUserRoleRequest,
  CreateDepartmentRequest,
  CreateDepartmentResponse,
  DepartmentDetailsResponse,
  UpdateDepartmentRequest,
  AddDepartmentMemberRequest,
  RemoveDepartmentMemberRequest,
  MemberOperationResponse,
  AdminProjectsResponse,
  CreateProjectRequest,
  CreateProjectResponse,
  AIChatRequest,
  AIChatResponse,
  MyDepartmentResponse
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8003';
const USER_SERVICE_URL = process.env.NEXT_PUBLIC_USER_SERVICE_URL || 'http://localhost:8001';
const AI_SERVICE_URL = process.env.NEXT_PUBLIC_AI_SERVICE_URL || 'https://n8n.serperp.com/webhook-test/chat';

// Auth token provider
let authTokenProvider: (() => Promise<string | null | undefined>) | null = null;

export function setAuthTokenProvider(provider: (() => Promise<string | null | undefined>) | null) {
  authTokenProvider = provider;
}

// Auth readiness signaling
let authIsReady = false;
let authReadyResolvers: Array<() => void> = [];

export function setAuthReady(isReady: boolean) {
  authIsReady = isReady;
  if (isReady) {
    authReadyResolvers.forEach(resolve => resolve());
    authReadyResolvers = [];
  }
}

async function waitForAuthReady(timeoutMs = 3000): Promise<void> {
  if (authIsReady) return;
  await new Promise<void>((resolve) => {
    authReadyResolvers.push(resolve);
    const t = setTimeout(() => {
      const idx = authReadyResolvers.indexOf(resolve);
      if (idx >= 0) authReadyResolvers.splice(idx, 1);
      resolve();
    }, timeoutMs);
    const originalResolve = resolve;
    resolve = () => {
      clearTimeout(t);
      originalResolve();
    };
  });
}

class ProjectAPI {
  private async request<T>(endpoint: string, options: RequestInit = {}, baseUrl = API_BASE_URL): Promise<T> {
    const url = `${baseUrl}${endpoint}`;
    console.log(`API Request: ${options.method || 'GET'} ${url}`);
    
    await waitForAuthReady();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string> | undefined),
    };

    try {
      if (authTokenProvider) {
        const token = await authTokenProvider();
        if (token) {
          headers['Authorization'] = `Bearer ${token}`;
        }
      }
    } catch {
      console.warn('Auth token provider failed, proceeding without Authorization header.');
    }

    const config: RequestInit = {
      headers,
      ...options,
    };

    try {
      const response = await fetch(url, config);
      console.log(`API Response: ${response.status} ${response.statusText}`);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        let errorType = 'generic';
        
        try {
          const responseText = await response.text();
          
          let errorData: Record<string, unknown> = {};
          if (responseText) {
            try {
              errorData = JSON.parse(responseText);
              // Only log if there's actual error data (not empty object)
              if (Object.keys(errorData).length > 0) {
                console.log('Error response data:', errorData);
              }
            } catch {
              // Only log JSON parsing errors if response text is not empty
              if (responseText.trim()) {
                console.log('Non-JSON error response:', responseText);
              }
              // If it's not JSON, treat the text as the error message
              if (response.status === 404 && responseText.includes('not assigned to any department')) {
                errorType = 'no_department';
                errorMessage = 'Please contact your administrator to be assigned to a department';
              } else if (responseText.trim()) {
                errorMessage = `${errorMessage} - ${responseText}`;
              }
            }
          }
          
          // Handle specific "not assigned to department" case
          const errorObj = errorData as { error?: string; message?: string; detail?: unknown };
          if (response.status === 404 && (
            errorObj.error === "You are not assigned to any department" ||
            (typeof errorObj.message === 'string' && errorObj.message.includes('not assigned to any department')) ||
            responseText.includes('not assigned to any department')
          )) {
            errorType = 'no_department';
            errorMessage = errorObj.message || errorObj.error || 'Please contact your administrator to be assigned to a department';
          } else if (response.status === 422 && errorObj.detail) {
            errorMessage = `Validation Error: ${JSON.stringify(errorObj.detail)}`;
          } else if (response.status === 400) {
            errorMessage = `Bad Request: ${JSON.stringify(errorData)}`;
          } else if (errorObj.detail) {
            errorMessage = `${errorMessage} - ${JSON.stringify(errorObj.detail)}`;
          } else if (errorObj.message) {
            errorMessage = `${errorMessage} - ${errorObj.message}`;
          }
        } catch (parseError) {
          console.error('Could not process error response:', parseError);
          // Fallback for 404 errors that might be "no department" case
          if (response.status === 404) {
            errorType = 'no_department';
            errorMessage = 'Please contact your administrator to be assigned to a department';
          }
        }
        
        const error = new Error(errorMessage) as Error & { type?: string };
        error.type = errorType;
        
        // Only log as error if it's not the expected "no department" case
        if (errorType !== 'no_department') {
          console.error('API Error:', errorMessage);
        }
        
        throw error;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      // Only log unexpected errors, not our custom typed errors
      const typedError = error as Error & { type?: string };
      if (!typedError.type || typedError.type === 'generic') {
        console.error('API request failed:', error);
      }
      throw error;
    }
  }

  // Project endpoints - simplified for new API
  async getProjects(): Promise<ProjectListResponse> {
    return this.request<ProjectListResponse>('/projects/');
  }

  async getProject(projectId: number): Promise<ProjectResponse> {
    if (!projectId || projectId <= 0) {
      throw new Error(`Invalid project ID: ${projectId}`);
    }
    return this.request<ProjectResponse>(`/projects/${projectId}/`);
  }

  // Departments
  async getDepartments(): Promise<DepartmentListResponse> {
    return this.request<DepartmentListResponse>('/departments/');
  }

  async createDepartment(data: CreateDepartmentRequest): Promise<CreateDepartmentResponse> {
    return this.request<CreateDepartmentResponse>('/departments/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getDepartment(departmentId: number): Promise<DepartmentResponse> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request<DepartmentResponse>(`/departments/${departmentId}/`);
  }

  async getDepartmentDetails(departmentId: number): Promise<DepartmentDetailsResponse> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request<DepartmentDetailsResponse>(`/departments/${departmentId}/`);
  }

  async updateDepartment(departmentId: number, data: UpdateDepartmentRequest): Promise<DepartmentDetailsResponse> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request<DepartmentDetailsResponse>(`/departments/${departmentId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async partialUpdateDepartment(departmentId: number, data: Partial<UpdateDepartmentRequest>): Promise<DepartmentDetailsResponse> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request<DepartmentDetailsResponse>(`/departments/${departmentId}/update/`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async addDepartmentMember(departmentId: number, data: AddDepartmentMemberRequest): Promise<MemberOperationResponse> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request<MemberOperationResponse>(`/departments/${departmentId}/add-member/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async removeDepartmentMember(departmentId: number, data: RemoveDepartmentMemberRequest): Promise<MemberOperationResponse> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request<MemberOperationResponse>(`/departments/${departmentId}/remove-member/`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteDepartment(departmentId: number): Promise<void> {
    if (!departmentId || departmentId <= 0) {
      throw new Error(`Invalid department ID: ${departmentId}`);
    }
    return this.request(`/departments/${departmentId}/delete/`, {
      method: 'DELETE',
    });
  }

  async getMyDepartment(): Promise<MyDepartmentResponse> {
    return this.request('/my-department/');
  }

  // Admin Projects
  async getAllProjects(): Promise<AdminProjectsResponse> {
    return this.request<AdminProjectsResponse>('/projects/all/');
  }

  async createProject(data: CreateProjectRequest): Promise<CreateProjectResponse> {
    return this.request<CreateProjectResponse>('/projects/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Labels
  async getLabels(params?: { skip?: number; limit?: number; is_active?: boolean }): Promise<LabelListResponse> {
    const search = new URLSearchParams();
    if (params?.skip !== undefined) search.append('skip', params.skip.toString());
    if (params?.limit !== undefined) search.append('limit', params.limit.toString());
    if (params?.is_active !== undefined) search.append('is_active', params.is_active.toString());
    const qs = search.toString();
    return this.request<LabelListResponse>(`/labels/${qs ? `?${qs}` : ''}`);
  }

  async getLabel(labelId: number): Promise<LabelResponse> {
    if (!labelId || labelId <= 0) {
      throw new Error(`Invalid label ID: ${labelId}`);
    }
    return this.request<LabelResponse>(`/labels/${labelId}/`);
  }

  async createLabel(labelData: { name: string; description: string; color: string; is_active: boolean }): Promise<LabelResponse> {
    return this.request<LabelResponse>('/labels/create/', {
      method: 'POST',
      body: JSON.stringify(labelData),
    });
  }

  async updateLabel(labelId: number, labelData: { name?: string; description?: string; color?: string; is_active?: boolean }): Promise<LabelResponse> {
    if (!labelId || labelId <= 0) {
      throw new Error(`Invalid label ID: ${labelId}`);
    }
    return this.request<LabelResponse>(`/labels/${labelId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(labelData),
    });
  }

  async deleteLabel(labelId: number): Promise<void> {
    if (!labelId || labelId <= 0) {
      throw new Error(`Invalid label ID: ${labelId}`);
    }
    return this.request<void>(`/labels/${labelId}/delete/`, {
      method: 'DELETE',
    });
  }

  // Tasks - get tasks by project
  async getTasksByProject(projectId: number): Promise<TaskListItem[]> {
    if (!projectId || projectId <= 0) {
      throw new Error(`Invalid project ID: ${projectId}`);
    }
    return this.request<TaskListItem[]>(`/tasks/?project_id=${projectId}`);
  }

  async getTasks(filters: TaskFilters = {}): Promise<TaskListResponse> {
    const params = new URLSearchParams();
    
    if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
    if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
    if (filters.project_id !== undefined) params.append('project_id', filters.project_id.toString());
    if (filters.status_filter) params.append('status_filter', filters.status_filter);
    if (filters.priority_filter) params.append('priority_filter', filters.priority_filter);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

    const queryString = params.toString();
    const endpoint = `/tasks/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<TaskListResponse>(endpoint);
  }

  async getTask(taskId: number): Promise<TaskResponse> {
    if (!taskId || taskId <= 0) {
      throw new Error(`Invalid task ID: ${taskId}`);
    }
    return this.request<TaskResponse>(`/tasks/${taskId}/`, {
      method: 'GET',
    });
  }

  async createTask(data: CreateTaskRequest): Promise<Task> {
    return this.request<Task>('/tasks/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateTask(taskId: number, data: UpdateTaskRequest): Promise<Task> {
    if (!taskId || taskId <= 0) {
      throw new Error(`Invalid task ID: ${taskId}`);
    }
    return this.request<Task>(`/tasks/${taskId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async getTaskSubtasks(taskId: number): Promise<SubtaskListItem[]> {
    if (!taskId || taskId <= 0) {
      throw new Error(`Invalid task ID: ${taskId}`);
    }
    return this.request<SubtaskListItem[]>(`/tasks/${taskId}/subtasks/`, {
      method: 'GET',
    });
  }

  async updateSubtask(subtaskId: number, data: UpdateSubtaskRequest): Promise<SubtaskResponse> {
    if (!subtaskId || subtaskId <= 0) {
      throw new Error(`Invalid subtask ID: ${subtaskId}`);
    }
    return this.request<SubtaskResponse>(`/subtasks/${subtaskId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async deleteTask(taskId: number): Promise<void> {
    if (!taskId || taskId <= 0) {
      throw new Error(`Invalid task ID: ${taskId}`);
    }
    return this.request<void>(`/tasks/${taskId}/delete/`, {
      method: 'DELETE',
    });
  }

  // Subtasks
  async createSubtask(taskId: number, subtaskData: CreateSubtaskRequest): Promise<Subtask> {
    if (!taskId || taskId <= 0) {
      throw new Error(`Invalid task ID: ${taskId}`);
    }
    return this.request<Subtask>(`/tasks/${taskId}/subtasks/create/`, {
      method: 'POST',
      body: JSON.stringify(subtaskData),
    });
  }

  async deleteSubtask(subtaskId: number): Promise<void> {
    if (!subtaskId || subtaskId <= 0) {
      throw new Error(`Invalid subtask ID: ${subtaskId}`);
    }
    return this.request<void>(`/subtasks/${subtaskId}/delete/`, {
      method: 'DELETE',
    });
  }

  // User Service Methods
  async getUsers(params: UserListParams = {}): Promise<UserListResponse> {
    const searchParams = new URLSearchParams();
    
    if (params.page !== undefined) searchParams.append('page', params.page.toString());
    if (params.page_size !== undefined) searchParams.append('page_size', params.page_size.toString());
    if (params.search) searchParams.append('search', params.search);
    if (params.role) searchParams.append('role', params.role);
    if (params.is_active !== undefined) searchParams.append('is_active', params.is_active.toString());

    const queryString = searchParams.toString();
    const endpoint = `/users/${queryString ? `?${queryString}` : ''}`;
    
    return this.request<UserListResponse>(endpoint, {}, USER_SERVICE_URL);
  }

  async getUserProfile(): Promise<UserProfile> {
    return this.request<UserProfile>('/users/me/', {}, USER_SERVICE_URL);
  }

  async getUserRoles(): Promise<UserRole[]> {
    return this.request<UserRole[]>('/roles/');
  }

  async getDashboard(): Promise<DashboardResponse> {
    return this.request<DashboardResponse>('/dashboard/');
  }

  // Admin Users Management
  async getAdminUsers(filters: AdminUsersFilters = {}): Promise<AdminUsersResponse> {
    const params = new URLSearchParams();
    
    if (filters.page !== undefined) params.append('page', filters.page.toString());
    if (filters.page_size !== undefined) params.append('page_size', filters.page_size.toString());
    if (filters.search) params.append('search', filters.search);
    if (filters.role) params.append('role', filters.role);
    if (filters.is_active !== undefined) params.append('is_active', filters.is_active.toString());

    const queryString = params.toString();
    const url = queryString ? `/users/?${queryString}` : '/users/';
    
    return this.request<AdminUsersResponse>(url, {}, USER_SERVICE_URL);
  }

  // User Role Management
  async getUserRole(userId: number): Promise<UserRoleResponse> {
    return this.request<UserRoleResponse>(`/users/${userId}/role/`);
  }

  async createUserRole(data: CreateUserRoleRequest): Promise<CreateUserRoleResponse> {
    return this.request<CreateUserRoleResponse>('/roles/create/', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateUserRole(roleId: number, data: UpdateUserRoleRequest): Promise<CreateUserRoleResponse> {
    return this.request<CreateUserRoleResponse>(`/roles/${roleId}/update/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }
}

export const projectAPI = new ProjectAPI();

// Export individual functions for easier use
export const getProjects = () => projectAPI.getProjects();
export const getProject = (id: number) => projectAPI.getProject(id);
export const getDepartments = () => projectAPI.getDepartments();
export const createDepartment = (data: CreateDepartmentRequest) => projectAPI.createDepartment(data);
export const getDepartmentDetails = (departmentId: number) => projectAPI.getDepartmentDetails(departmentId);
export const updateDepartment = (departmentId: number, data: UpdateDepartmentRequest) => projectAPI.updateDepartment(departmentId, data);
export const partialUpdateDepartment = (departmentId: number, data: Partial<UpdateDepartmentRequest>) => projectAPI.partialUpdateDepartment(departmentId, data);
export const addDepartmentMember = (departmentId: number, data: AddDepartmentMemberRequest) => projectAPI.addDepartmentMember(departmentId, data);
export const removeDepartmentMember = (departmentId: number, data: RemoveDepartmentMemberRequest) => projectAPI.removeDepartmentMember(departmentId, data);
export const deleteDepartment = (departmentId: number) => projectAPI.deleteDepartment(departmentId);
export const getAllProjects = () => projectAPI.getAllProjects();
export const createProject = (data: CreateProjectRequest) => projectAPI.createProject(data);
export const getLabels = (params?: { skip?: number; limit?: number; is_active?: boolean }) => projectAPI.getLabels(params);
export const createLabel = (data: { name: string; description: string; color: string; is_active: boolean }) => projectAPI.createLabel(data);
export const getTasks = (filters?: TaskFilters) => projectAPI.getTasks(filters);
export const getTasksByProject = (projectId: number) => projectAPI.getTasksByProject(projectId);
export const getTask = (taskId: number) => projectAPI.getTask(taskId);
export const createTask = (data: CreateTaskRequest) => projectAPI.createTask(data);
export const updateTask = (taskId: number, data: UpdateTaskRequest) => projectAPI.updateTask(taskId, data);
export const createSubtask = (taskId: number, data: CreateSubtaskRequest) => projectAPI.createSubtask(taskId, data);
export const getTaskSubtasks = (taskId: number) => projectAPI.getTaskSubtasks(taskId);
export const updateSubtask = (subtaskId: number, data: UpdateSubtaskRequest) => projectAPI.updateSubtask(subtaskId, data);
export const getUsers = (params?: UserListParams) => projectAPI.getUsers(params);
export const getUserProfile = () => projectAPI.getUserProfile();
export const getUserRoles = () => projectAPI.getUserRoles();
export const getDashboard = () => projectAPI.getDashboard();
export const getAdminUsers = (filters?: AdminUsersFilters) => projectAPI.getAdminUsers(filters);
export const getUserRole = (userId: number) => projectAPI.getUserRole(userId);
export const createUserRole = (data: CreateUserRoleRequest) => projectAPI.createUserRole(data);
export const updateUserRole = (roleId: number, data: UpdateUserRoleRequest) => projectAPI.updateUserRole(roleId, data);
export const getMyDepartment = () => projectAPI.getMyDepartment();

// AI Chat API
class AIChatAPI {
  async sendMessage(message: string): Promise<AIChatResponse> {
    // Get JWT token from auth provider
    if (!authTokenProvider) {
      throw new Error('Auth token provider not set');
    }
    
    const token = await authTokenProvider();
    if (!token) {
      throw new Error('No authentication token available');
    }

    const requestBody: AIChatRequest = {
      token,
      message
    };

    const response = await fetch(AI_SERVICE_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`AI Chat API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }
}

const aiChatAPI = new AIChatAPI();

// AI Chat API exports
export const sendAIMessage = (message: string) => aiChatAPI.sendMessage(message);
