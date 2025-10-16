# Project API Integration

This document describes the integration of the project management API endpoints into the application.

## API Endpoints Integrated

### 1. Get Projects
- **Endpoint**: `GET /api/v1/projects/`
- **Description**: Retrieve projects with optional filtering and pagination
- **Parameters**: `skip`, `limit`, `status_filter`, `is_active`
- **Usage**: Used in the projects list page to fetch all projects

### 2. Create Project
- **Endpoint**: `POST /api/v1/projects/`
- **Description**: Create a new project
- **Usage**: Used in the project creation wizard

### 3. Get Project
- **Endpoint**: `GET /api/v1/projects/{project_id}`
- **Description**: Get a specific project by ID
- **Usage**: Used to fetch individual project details

### 4. Update Project
- **Endpoint**: `PUT /api/v1/projects/{project_id}`
- **Description**: Update an existing project
- **Usage**: Used in the project edit modal

### 5. Delete Project
- **Endpoint**: `DELETE /api/v1/projects/{project_id}`
- **Description**: Delete a project (soft delete by setting is_active to False)
- **Usage**: Used in the projects list page

### 6. Get Project With Tasks
- **Endpoint**: `GET /api/v1/projects/{project_id}/with-tasks`
- **Description**: Get a specific project with all its tasks
- **Usage**: Available for future task integration

## Configuration

### Environment Variables
Create a `.env.local` file in your project root with:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8000
```

Replace with your actual API base URL.

### API Service
The API integration is handled by `lib/api.ts` which provides:
- Centralized API request handling
- Error handling for validation errors (422) and other HTTP errors
- Type-safe request/response handling

## Components Created/Updated

### 1. Project Creation Wizard (`components/tasks/ProjectCreationWizard.tsx`)
- Updated to use real API instead of mock data
- Form validation and error handling
- Proper type definitions matching API schema

### 2. Project Edit Modal (`components/tasks/ProjectEditModal.tsx`)
- New component for editing existing projects
- Pre-populated form with current project data
- Real-time updates to project information

### 3. Project Filters (`components/tasks/ProjectFilters.tsx`)
- New component for filtering and searching projects
- Search by name/description
- Filter by status, priority, project type, and active status

### 4. Projects Page (`app/projects/page.tsx`)
- Updated to use real API data
- Integrated filtering and search functionality
- Project view, edit, and delete operations
- Loading states and error handling

### 5. Custom Hook (`lib/hooks/useProjects.ts`)
- Manages project state and API calls
- Provides CRUD operations for projects
- Handles loading states and errors

## Type Definitions

Updated `types/index.d.ts` with:
- `Project` interface matching API response
- `CreateProjectRequest` and `UpdateProjectRequest` types
- `ProjectPriority`, `ProjectStatus`, `ProjectType` enums
- `ProjectFilters` interface for filtering

## Features Implemented

### ✅ Project Management
- [x] List all projects
- [x] Create new projects
- [x] View project details
- [x] Edit existing projects
- [x] Delete projects (soft delete)
- [x] Search and filter projects

### ✅ User Experience
- [x] Loading states
- [x] Error handling and display
- [x] Form validation
- [x] Responsive design
- [x] Smooth animations

### ✅ Data Handling
- [x] Real-time updates
- [x] Optimistic UI updates
- [x] Proper error boundaries
- [x] Type safety

## Usage Examples

### Creating a Project
```typescript
import { useProjects } from '@/lib/hooks/useProjects';

const { createProject } = useProjects();

const handleCreate = async () => {
  const newProject = await createProject({
    name: "My Project",
    description: "Project description",
    department_id: 1,
    project_type: "internal",
    // ... other fields
  });
};
```

### Filtering Projects
```typescript
const { fetchProjects } = useProjects();

// Filter by status
await fetchProjects({ status_filter: "active" });

// Filter by active status
await fetchProjects({ is_active: true });

// Pagination
await fetchProjects({ skip: 0, limit: 10 });
```

## Error Handling

The API integration includes comprehensive error handling:
- **Validation Errors (422)**: Displayed to users with specific field errors
- **Network Errors**: Graceful fallbacks with user-friendly messages
- **Loading States**: Visual feedback during API operations
- **Error Boundaries**: Prevents app crashes from API failures

## Future Enhancements

### Potential Improvements
1. **Real-time Updates**: WebSocket integration for live project updates
2. **Offline Support**: Service worker for offline project viewing
3. **Bulk Operations**: Batch create, update, or delete multiple projects
4. **Advanced Filtering**: Date range filters, custom field filters
5. **Export/Import**: CSV/Excel export of project data
6. **Audit Trail**: Track project changes and history

### API Extensions
1. **Project Templates**: Pre-defined project structures
2. **Project Dependencies**: Link related projects
3. **Resource Allocation**: Track team member assignments
4. **Time Tracking**: Integrate with time logging systems
5. **File Attachments**: Support for project documents and media

## Testing

To test the API integration:

1. **Start your API server** on the configured base URL
2. **Create a `.env.local` file** with the correct API URL
3. **Navigate to the projects page** to see real data
4. **Test CRUD operations** by creating, editing, and deleting projects
5. **Verify filtering** works with different criteria

## Troubleshooting

### Common Issues

1. **API Connection Failed**
   - Check your `.env.local` file has the correct `NEXT_PUBLIC_API_BASE_URL`
   - Verify your API server is running
   - Check browser console for CORS errors

2. **Validation Errors**
   - Ensure all required fields are filled
   - Check field formats (dates, numbers, etc.)
   - Review API response for specific field errors

3. **Type Errors**
   - Run `npm run build` to check for TypeScript errors
   - Ensure all imports are correct
   - Verify type definitions match API schema

### Debug Mode
Enable debug logging by adding to your environment:
```bash
NEXT_PUBLIC_DEBUG=true
```

This will log all API requests and responses to the console.
