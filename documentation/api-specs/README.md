# API Specifications

## Overview
RESTful API design following OpenAPI 3.0 specification for the Task Management System.

## Base URL
```
Production: https://api.taskmanager.com/v1
Staging: https://staging-api.taskmanager.com/v1
Development: http://localhost:3000/api/v1
```

## Authentication
All API requests require authentication using JWT tokens except for auth endpoints.

```http
Authorization: Bearer <access_token>
```

## Common Headers
```http
Content-Type: application/json
Accept: application/json
X-Request-ID: <uuid>
X-Client-Version: 1.0.0
```

## Response Format
```json
{
  "success": true,
  "data": {},
  "message": "Operation successful",
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "timestamp": "2024-01-15T10:30:00Z",
  "request_id": "550e8400-e29b-41d4-a716-446655440000"
}
```

## API Endpoints

### 1. Authentication Endpoints

#### POST /auth/register
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "first_name": "John",
  "last_name": "Doe",
  "phone": "+1234567890"
}
```

**Response:** `201 Created`
```json
{
  "success": true,
  "data": {
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "created_at": "2024-01-15T10:30:00Z"
    },
    "message": "Verification email sent"
  }
}
```

---

#### POST /auth/login
Authenticate user and receive tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "remember_me": true
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900,
    "user": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "email": "user@example.com",
      "first_name": "John",
      "last_name": "Doe",
      "role": "developer"
    }
  }
}
```

---

#### POST /auth/refresh
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refresh_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
    "expires_in": 900
  }
}
```

---

#### POST /auth/logout
Invalidate current session.

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

---

#### POST /auth/forgot-password
Request password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "If the email exists, a reset link has been sent"
}
```

---

#### POST /auth/reset-password
Reset password using token.

**Request Body:**
```json
{
  "token": "reset_token_here",
  "new_password": "NewSecurePass123!"
}
```

**Response:** `200 OK`
```json
{
  "success": true,
  "message": "Password reset successfully"
}
```

---

### 2. User Endpoints

#### GET /users/profile
Get current user profile.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "user_id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "first_name": "John",
    "last_name": "Doe",
    "avatar_url": "https://cdn.example.com/avatars/user.jpg",
    "phone": "+1234567890",
    "role": "developer",
    "created_at": "2024-01-15T10:30:00Z",
    "last_login": "2024-01-20T09:00:00Z"
  }
}
```

---

#### PUT /users/profile
Update user profile.

**Request Body:**
```json
{
  "first_name": "John",
  "last_name": "Smith",
  "phone": "+9876543210",
  "notification_preferences": {
    "email": true,
    "push": false,
    "sms": false
  }
}
```

**Response:** `200 OK`

---

#### POST /users/avatar
Upload user avatar.

**Request:** `multipart/form-data`
```
avatar: [binary file data]
```

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "avatar_url": "https://cdn.example.com/avatars/new-avatar.jpg"
  }
}
```

---

### 3. Project Endpoints

#### GET /projects
List all projects for the user.

**Query Parameters:**
- `page` (integer): Page number (default: 1)
- `limit` (integer): Items per page (default: 20)
- `search` (string): Search term
- `status` (string): Filter by status (active, archived)
- `sort` (string): Sort field (name, created_at, updated_at)
- `order` (string): Sort order (asc, desc)

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "projects": [
      {
        "project_id": "123e4567-e89b-12d3-a456-426614174000",
        "project_key": "PROJ",
        "name": "Website Redesign",
        "description": "Redesign company website",
        "owner": {
          "user_id": "550e8400-e29b-41d4-a716-446655440000",
          "name": "John Doe"
        },
        "status": "active",
        "member_count": 5,
        "task_count": 42,
        "created_at": "2024-01-01T00:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 100,
      "pages": 5
    }
  }
}
```

---

#### GET /projects/:id
Get project details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "project_id": "123e4567-e89b-12d3-a456-426614174000",
    "project_key": "PROJ",
    "name": "Website Redesign",
    "description": "Complete redesign of company website",
    "owner": {
      "user_id": "550e8400-e29b-41d4-a716-446655440000",
      "name": "John Doe",
      "email": "john@example.com"
    },
    "visibility": "private",
    "status": "active",
    "start_date": "2024-01-01",
    "end_date": "2024-06-30",
    "members": [
      {
        "user_id": "user_id_1",
        "name": "Jane Smith",
        "role": "developer",
        "joined_at": "2024-01-02T00:00:00Z"
      }
    ],
    "statistics": {
      "total_tasks": 42,
      "completed_tasks": 15,
      "in_progress_tasks": 10,
      "overdue_tasks": 2
    },
    "created_at": "2024-01-01T00:00:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

#### POST /projects
Create a new project.

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description",
  "visibility": "private",
  "start_date": "2024-02-01",
  "end_date": "2024-08-31",
  "members": [
    {
      "user_id": "user_id_1",
      "role": "developer"
    }
  ]
}
```

**Response:** `201 Created`

---

#### PUT /projects/:id
Update project details.

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description",
  "status": "active",
  "end_date": "2024-09-30"
}
```

**Response:** `200 OK`

---

#### DELETE /projects/:id
Archive a project.

**Response:** `200 OK`

---

#### POST /projects/:id/members
Add members to project.

**Request Body:**
```json
{
  "members": [
    {
      "user_id": "user_id_2",
      "role": "developer"
    },
    {
      "email": "newuser@example.com",
      "role": "viewer"
    }
  ]
}
```

**Response:** `200 OK`

---

### 4. Task Endpoints

#### GET /tasks
List tasks with filters.

**Query Parameters:**
- `project_id` (string): Filter by project
- `sprint_id` (string): Filter by sprint
- `assignee` (string): Filter by assignee user_id
- `status` (string): Filter by status (todo, in_progress, review, done)
- `priority` (string): Filter by priority (low, medium, high, critical)
- `search` (string): Search in title and description
- `due_date_from` (date): Filter by due date range start
- `due_date_to` (date): Filter by due date range end

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "tasks": [
      {
        "task_id": "task_id_1",
        "task_key": "PROJ-123",
        "title": "Implement user authentication",
        "description": "Add JWT authentication",
        "status": "in_progress",
        "priority": "high",
        "story_points": 5,
        "assignees": [
          {
            "user_id": "user_id_1",
            "name": "John Doe",
            "avatar_url": "https://..."
          }
        ],
        "project": {
          "project_id": "project_id_1",
          "name": "Website Redesign"
        },
        "sprint": {
          "sprint_id": "sprint_id_1",
          "name": "Sprint 1"
        },
        "due_date": "2024-02-15T23:59:59Z",
        "created_at": "2024-01-15T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150
    }
  }
}
```

---

#### GET /tasks/:id
Get task details.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "task_id": "task_id_1",
    "task_key": "PROJ-123",
    "title": "Implement user authentication",
    "description": "Add JWT authentication to the application",
    "status": "in_progress",
    "priority": "high",
    "task_type": "feature",
    "story_points": 5,
    "estimated_hours": 8,
    "actual_hours": 4.5,
    "assignees": [
      {
        "user_id": "user_id_1",
        "name": "John Doe",
        "avatar_url": "https://..."
      }
    ],
    "reporter": {
      "user_id": "user_id_2",
      "name": "Jane Smith"
    },
    "project": {
      "project_id": "project_id_1",
      "name": "Website Redesign",
      "key": "PROJ"
    },
    "sprint": {
      "sprint_id": "sprint_id_1",
      "name": "Sprint 1",
      "status": "active"
    },
    "labels": ["backend", "authentication"],
    "attachments": [
      {
        "attachment_id": "attach_1",
        "file_name": "design.pdf",
        "file_size": 1024000,
        "file_url": "https://...",
        "uploaded_by": "John Doe",
        "created_at": "2024-01-16T10:00:00Z"
      }
    ],
    "comments_count": 5,
    "watchers": ["user_id_3", "user_id_4"],
    "due_date": "2024-02-15T23:59:59Z",
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-20T14:20:00Z"
  }
}
```

---

#### POST /tasks
Create a new task.

**Request Body:**
```json
{
  "project_id": "project_id_1",
  "title": "New Feature Implementation",
  "description": "Detailed description here",
  "task_type": "feature",
  "priority": "medium",
  "story_points": 3,
  "estimated_hours": 6,
  "assignees": ["user_id_1", "user_id_2"],
  "labels": ["frontend", "ui"],
  "due_date": "2024-02-28T23:59:59Z",
  "sprint_id": "sprint_id_1"
}
```

**Response:** `201 Created`

---

#### PUT /tasks/:id
Update task details.

**Request Body:**
```json
{
  "title": "Updated Task Title",
  "description": "Updated description",
  "status": "review",
  "priority": "high",
  "assignees": ["user_id_3"],
  "due_date": "2024-03-01T23:59:59Z"
}
```

**Response:** `200 OK`

---

#### PATCH /tasks/:id/status
Update task status only.

**Request Body:**
```json
{
  "status": "done",
  "comment": "Task completed successfully"
}
```

**Response:** `200 OK`

---

#### DELETE /tasks/:id
Delete a task.

**Response:** `204 No Content`

---

### 5. Comment Endpoints

#### GET /tasks/:taskId/comments
Get task comments.

**Query Parameters:**
- `page` (integer): Page number
- `limit` (integer): Items per page

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "comments": [
      {
        "comment_id": "comment_1",
        "content": "This looks good to me",
        "author": {
          "user_id": "user_id_1",
          "name": "John Doe",
          "avatar_url": "https://..."
        },
        "mentions": ["user_id_2"],
        "is_edited": false,
        "created_at": "2024-01-20T10:00:00Z",
        "replies": [
          {
            "comment_id": "comment_2",
            "content": "Thanks for the review",
            "author": {
              "user_id": "user_id_2",
              "name": "Jane Smith"
            },
            "created_at": "2024-01-20T10:30:00Z"
          }
        ]
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 5
    }
  }
}
```

---

#### POST /tasks/:taskId/comments
Add comment to task.

**Request Body:**
```json
{
  "content": "Please review this implementation @user_id_2",
  "parent_id": null
}
```

**Response:** `201 Created`

---

### 6. Sprint Endpoints

#### GET /projects/:projectId/sprints
List project sprints.

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sprints": [
      {
        "sprint_id": "sprint_1",
        "sprint_number": 1,
        "name": "Sprint 1",
        "goal": "Complete authentication module",
        "status": "completed",
        "start_date": "2024-01-01",
        "end_date": "2024-01-14",
        "capacity": 100,
        "completed_points": 85,
        "task_count": {
          "total": 20,
          "completed": 18,
          "in_progress": 2
        }
      }
    ]
  }
}
```

---

#### POST /projects/:projectId/sprints
Create a new sprint.

**Request Body:**
```json
{
  "name": "Sprint 2",
  "goal": "Implement task management features",
  "start_date": "2024-01-15",
  "end_date": "2024-01-28",
  "capacity": 120
}
```

**Response:** `201 Created`

---

#### PUT /sprints/:id/start
Start a sprint.

**Response:** `200 OK`

---

#### PUT /sprints/:id/complete
Complete a sprint.

**Request Body:**
```json
{
  "move_incomplete_to": "backlog"
}
```

**Response:** `200 OK`

---

### 7. Report Endpoints

#### GET /reports/burndown
Get burndown chart data.

**Query Parameters:**
- `sprint_id` (string): Sprint ID

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "sprint_id": "sprint_1",
    "start_date": "2024-01-01",
    "end_date": "2024-01-14",
    "total_points": 100,
    "ideal_line": [100, 92, 85, 77, 69, 61, 54, 46, 38, 31, 23, 15, 8, 0],
    "actual_line": [100, 95, 88, 80, 75, 68, 60, 50, 42, 35, 25, 15, 10, 5],
    "dates": ["2024-01-01", "2024-01-02", "..."]
  }
}
```

---

#### GET /reports/velocity
Get team velocity data.

**Query Parameters:**
- `project_id` (string): Project ID
- `sprints` (integer): Number of sprints (default: 6)

**Response:** `200 OK`

---

#### POST /reports/custom
Generate custom report.

**Request Body:**
```json
{
  "type": "task_summary",
  "filters": {
    "project_id": "project_1",
    "date_from": "2024-01-01",
    "date_to": "2024-01-31"
  },
  "format": "pdf",
  "email_to": "manager@example.com"
}
```

**Response:** `202 Accepted`
```json
{
  "success": true,
  "data": {
    "report_id": "report_123",
    "status": "processing",
    "estimated_time": 30
  }
}
```

---

### 8. Search Endpoints

#### GET /search
Global search across all entities.

**Query Parameters:**
- `q` (string): Search query
- `type` (string): Entity type (task, project, user)
- `limit` (integer): Results per type

**Response:** `200 OK`
```json
{
  "success": true,
  "data": {
    "results": {
      "tasks": [
        {
          "task_id": "task_1",
          "task_key": "PROJ-123",
          "title": "Matching task",
          "highlight": "...search term..."
        }
      ],
      "projects": [],
      "users": []
    },
    "total_results": 15
  }
}
```

---

### 9. Notification Endpoints

#### GET /notifications
Get user notifications.

**Query Parameters:**
- `unread` (boolean): Filter unread only
- `type` (string): Notification type

**Response:** `200 OK`

---

#### PUT /notifications/:id/read
Mark notification as read.

**Response:** `200 OK`

---

#### PUT /notifications/mark-all-read
Mark all notifications as read.

**Response:** `200 OK`

---

### 10. WebSocket Events

#### Connection
```javascript
const socket = io('wss://api.taskmanager.com', {
  auth: {
    token: 'jwt_token_here'
  }
});
```

#### Events

**Subscribe to project updates:**
```javascript
socket.emit('subscribe', { project_id: 'project_1' });
```

**Receive task updates:**
```javascript
socket.on('task.updated', (data) => {
  console.log('Task updated:', data);
});
```

**Available events:**
- `task.created`
- `task.updated`
- `task.deleted`
- `task.assigned`
- `comment.added`
- `sprint.started`
- `sprint.completed`
- `user.typing`
- `user.online`
- `user.offline`

## Rate Limiting

| Endpoint Category | Rate Limit | Window |
|------------------|------------|---------|
| Authentication | 5 requests | 15 minutes |
| Read Operations | 100 requests | 1 minute |
| Write Operations | 30 requests | 1 minute |
| File Uploads | 10 requests | 5 minutes |
| Reports | 5 requests | 10 minutes |

## Status Codes

| Code | Description |
|------|-------------|
| 200 | OK - Request successful |
| 201 | Created - Resource created |
| 202 | Accepted - Request accepted for processing |
| 204 | No Content - Request successful, no content |
| 400 | Bad Request - Invalid request data |
| 401 | Unauthorized - Authentication required |
| 403 | Forbidden - Access denied |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Resource conflict |
| 422 | Unprocessable Entity - Validation failed |
| 429 | Too Many Requests - Rate limit exceeded |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## Error Codes

| Code | Description |
|------|-------------|
| AUTH_FAILED | Authentication failed |
| TOKEN_EXPIRED | Access token expired |
| TOKEN_INVALID | Invalid token |
| VALIDATION_ERROR | Request validation failed |
| RESOURCE_NOT_FOUND | Requested resource not found |
| PERMISSION_DENIED | Insufficient permissions |
| DUPLICATE_RESOURCE | Resource already exists |
| RATE_LIMIT_EXCEEDED | Too many requests |
| SERVER_ERROR | Internal server error |