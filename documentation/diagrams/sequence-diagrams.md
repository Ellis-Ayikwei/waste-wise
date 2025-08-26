# Sequence Diagrams

## Overview
This document contains sequence diagrams for the key processes in the Task Management System. Each diagram illustrates the interaction between different system components and actors.

## 1. User Registration Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant Auth as Auth Service
    participant DB as Database
    participant Email as Email Service
    participant Redis as Redis Cache

    U->>UI: Click "Sign Up"
    UI->>U: Show registration form
    U->>UI: Fill form (email, password, name)
    UI->>UI: Validate input format
    UI->>API: POST /api/auth/register
    API->>API: Validate request data
    API->>DB: Check if email exists
    DB-->>API: Email availability
    
    alt Email already exists
        API-->>UI: Error: Email already registered
        UI-->>U: Show error message
    else Email available
        API->>Auth: Hash password
        Auth-->>API: Password hash
        API->>API: Generate verification token
        API->>DB: Create user record
        DB-->>API: User created
        API->>Redis: Store verification token
        Redis-->>API: Token stored
        API->>Email: Send verification email
        Email-->>U: Verification email sent
        API-->>UI: Success response
        UI-->>U: Show success message
    end
```

## 2. User Login Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant Auth as Auth Service
    participant DB as Database
    participant Redis as Redis Cache
    participant WS as WebSocket Server

    U->>UI: Enter credentials
    UI->>API: POST /api/auth/login
    API->>DB: Find user by email
    DB-->>API: User data
    
    alt User not found
        API-->>UI: Error: Invalid credentials
        UI-->>U: Show error
    else User found
        API->>Auth: Verify password
        Auth-->>API: Password valid/invalid
        
        alt Password invalid
            API->>DB: Increment failed attempts
            DB-->>API: Updated
            API-->>UI: Error: Invalid credentials
            UI-->>U: Show error
        else Password valid
            API->>Auth: Generate JWT token
            Auth-->>API: Access & Refresh tokens
            API->>Redis: Store session
            Redis-->>API: Session stored
            API->>DB: Update last login
            DB-->>API: Updated
            API->>WS: Initialize WebSocket connection
            WS-->>API: Connection established
            API-->>UI: Success + Tokens
            UI->>UI: Store tokens
            UI-->>U: Redirect to dashboard
        end
    end
```

## 3. Create Task Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    participant WS as WebSocket Server
    participant Notif as Notification Service
    participant Cache as Redis Cache

    U->>UI: Click "Create Task"
    UI->>U: Show task form
    U->>UI: Fill task details
    UI->>API: POST /api/tasks
    API->>API: Validate request
    API->>DB: Verify project access
    DB-->>API: Access confirmed
    
    API->>DB: Generate task key
    DB-->>API: Task key (PROJ-123)
    API->>DB: Create task record
    DB-->>API: Task created
    
    par Parallel operations
        API->>DB: Create activity log
        DB-->>API: Logged
    and
        API->>Cache: Invalidate project cache
        Cache-->>API: Cache cleared
    and
        API->>WS: Broadcast task creation
        WS-->>UI: Real-time update
    end
    
    alt Has assignees
        API->>DB: Create assignments
        DB-->>API: Assignments created
        API->>Notif: Send notifications
        Notif-->>API: Notifications queued
    end
    
    API-->>UI: Task created response
    UI->>UI: Update task list
    UI-->>U: Show success message
```

## 4. Sprint Planning Process

```mermaid
sequenceDiagram
    participant SM as Scrum Master
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    participant WS as WebSocket Server
    participant Team as Team Members

    SM->>UI: Open Sprint Planning
    UI->>API: GET /api/sprints/current
    API->>DB: Fetch current sprint
    DB-->>API: Sprint data
    API-->>UI: Sprint details
    
    UI->>API: GET /api/backlog
    API->>DB: Fetch backlog items
    DB-->>API: Backlog tasks
    API-->>UI: Backlog list
    
    SM->>UI: Drag task to sprint
    UI->>API: POST /api/sprints/{id}/tasks
    API->>DB: Verify sprint capacity
    DB-->>API: Capacity check
    
    alt Capacity exceeded
        API-->>UI: Warning: Over capacity
        UI-->>SM: Show warning
    else Within capacity
        API->>DB: Assign task to sprint
        DB-->>API: Task assigned
        API->>DB: Update sprint metrics
        DB-->>API: Metrics updated
        API->>WS: Broadcast update
        WS-->>Team: Real-time update
        API-->>UI: Success
        UI->>UI: Update sprint board
    end
    
    SM->>UI: Start sprint
    UI->>API: PUT /api/sprints/{id}/start
    API->>DB: Update sprint status
    DB-->>API: Sprint started
    API->>WS: Broadcast sprint start
    WS-->>Team: Sprint started notification
```

## 5. Task Status Update Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    participant WS as WebSocket Server
    participant AL as Activity Logger
    participant Notif as Notification Service

    U->>UI: Drag task to new column
    UI->>API: PATCH /api/tasks/{id}/status
    API->>DB: Verify task access
    DB-->>API: Access verified
    
    API->>DB: Get current task state
    DB-->>API: Current state
    API->>DB: Update task status
    DB-->>API: Status updated
    
    par Parallel processing
        API->>AL: Log status change
        AL->>DB: Create activity log
        DB-->>AL: Logged
    and
        API->>WS: Broadcast status change
        WS-->>UI: Real-time update
    and
        alt Status is "Done"
            API->>DB: Update completion timestamp
            DB-->>API: Timestamp updated
            API->>DB: Calculate actual hours
            DB-->>API: Hours calculated
        end
    end
    
    API->>Notif: Check notification rules
    Notif->>DB: Get watchers
    DB-->>Notif: Watcher list
    Notif->>Notif: Queue notifications
    
    API-->>UI: Success response
    UI->>UI: Update board
    UI-->>U: Show updated status
```

## 6. Real-time Collaboration Flow

```mermaid
sequenceDiagram
    participant U1 as User 1
    participant U2 as User 2
    participant UI1 as UI Client 1
    participant UI2 as UI Client 2
    participant WS as WebSocket Server
    participant API as Backend API
    participant Redis as Redis PubSub

    U1->>UI1: Open project board
    UI1->>WS: Connect WebSocket
    WS->>WS: Authenticate token
    WS->>Redis: Subscribe to project channel
    Redis-->>WS: Subscribed
    WS-->>UI1: Connection established
    
    U2->>UI2: Open same project
    UI2->>WS: Connect WebSocket
    WS->>Redis: Subscribe to project channel
    Redis-->>WS: Subscribed
    WS-->>UI2: Connection established
    
    U1->>UI1: Start editing task
    UI1->>WS: Send "user typing" event
    WS->>Redis: Publish to channel
    Redis->>WS: Broadcast to subscribers
    WS-->>UI2: User 1 is typing
    UI2-->>U2: Show typing indicator
    
    U1->>UI1: Save changes
    UI1->>API: Update task
    API->>API: Process update
    API->>Redis: Publish update event
    Redis->>WS: Broadcast update
    WS-->>UI1: Update confirmed
    WS-->>UI2: Task updated
    UI2->>UI2: Refresh task data
    UI2-->>U2: Show updated task
```

## 7. File Upload Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant Auth as Auth Service
    participant S3 as AWS S3
    participant DB as Database
    participant AV as Antivirus Service

    U->>UI: Select file to upload
    UI->>UI: Validate file size/type
    
    alt File invalid
        UI-->>U: Show error
    else File valid
        UI->>API: POST /api/upload/presigned-url
        API->>Auth: Verify user permissions
        Auth-->>API: Authorized
        API->>API: Generate presigned URL
        API-->>UI: Presigned URL + upload ID
        
        UI->>S3: Upload file directly
        S3-->>UI: Upload progress
        S3-->>UI: Upload complete
        
        UI->>API: POST /api/attachments
        API->>S3: Verify file exists
        S3-->>API: File confirmed
        
        API->>AV: Scan file
        AV-->>API: Scan result
        
        alt Virus detected
            API->>S3: Delete file
            S3-->>API: Deleted
            API-->>UI: Error: Malicious file
            UI-->>U: Show error
        else File clean
            API->>DB: Create attachment record
            DB-->>API: Record created
            API->>API: Generate thumbnail (if image)
            API-->>UI: Attachment details
            UI->>UI: Update UI
            UI-->>U: Show uploaded file
        end
    end
```

## 8. Report Generation Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    participant Report as Report Service
    participant Cache as Redis Cache
    participant S3 as AWS S3

    U->>UI: Request report
    UI->>UI: Select parameters
    U->>UI: Click "Generate"
    UI->>API: POST /api/reports/generate
    API->>Cache: Check cached report
    Cache-->>API: Cache miss
    
    API->>DB: Query report data
    DB-->>API: Raw data
    API->>Report: Process data
    Report->>Report: Generate charts
    Report->>Report: Create PDF/Excel
    Report-->>API: Report file
    
    par Store report
        API->>S3: Upload report
        S3-->>API: File URL
    and
        API->>Cache: Cache report metadata
        Cache-->>API: Cached
    and
        API->>DB: Log report generation
        DB-->>API: Logged
    end
    
    API-->>UI: Report URL
    UI->>UI: Download report
    UI-->>U: Open report
```

## 9. Password Reset Process

```mermaid
sequenceDiagram
    participant U as User
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    participant Email as Email Service
    participant Redis as Redis Cache

    U->>UI: Click "Forgot Password"
    UI->>U: Show email form
    U->>UI: Enter email
    UI->>API: POST /api/auth/forgot-password
    API->>DB: Find user by email
    DB-->>API: User found/not found
    
    Note over API: Always return success to prevent email enumeration
    
    alt User exists
        API->>API: Generate reset token
        API->>Redis: Store token (1hr TTL)
        Redis-->>API: Token stored
        API->>Email: Send reset email
        Email-->>U: Reset link sent
    end
    
    API-->>UI: Success message
    UI-->>U: Check your email
    
    U->>UI: Click reset link
    UI->>API: GET /api/auth/verify-reset-token
    API->>Redis: Validate token
    Redis-->>API: Token valid/invalid
    
    alt Token invalid
        API-->>UI: Error: Invalid/expired
        UI-->>U: Show error
    else Token valid
        UI->>U: Show password form
        U->>UI: Enter new password
        UI->>API: POST /api/auth/reset-password
        API->>Redis: Verify token again
        Redis-->>API: Valid
        API->>DB: Update password
        DB-->>API: Updated
        API->>Redis: Delete token
        Redis-->>API: Deleted
        API->>DB: Invalidate all sessions
        DB-->>API: Sessions cleared
        API-->>UI: Success
        UI-->>U: Password reset successful
    end
```

## 10. Sprint Retrospective Process

```mermaid
sequenceDiagram
    participant Team as Team Members
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    participant WS as WebSocket Server
    participant Report as Report Service

    Team->>UI: Open Retrospective
    UI->>API: GET /api/sprints/{id}/retrospective
    API->>DB: Fetch sprint data
    DB-->>API: Sprint details
    API->>DB: Fetch sprint metrics
    DB-->>API: Metrics data
    API-->>UI: Retrospective data
    
    loop Team Discussion
        Team->>UI: Add feedback item
        UI->>API: POST /api/retrospective/items
        API->>DB: Save feedback
        DB-->>API: Saved
        API->>WS: Broadcast new item
        WS-->>UI: Update all clients
        UI-->>Team: Show new item
    end
    
    Team->>UI: Vote on items
    UI->>API: POST /api/retrospective/votes
    API->>DB: Record votes
    DB-->>API: Votes recorded
    API->>WS: Broadcast vote update
    WS-->>UI: Update vote counts
    
    Team->>UI: Create action items
    UI->>API: POST /api/action-items
    API->>DB: Create action items
    DB-->>API: Items created
    API->>DB: Link to next sprint
    DB-->>API: Linked
    
    Team->>UI: Complete retrospective
    UI->>API: POST /api/retrospective/complete
    API->>Report: Generate summary
    Report-->>API: Summary report
    API->>DB: Archive retrospective
    DB-->>API: Archived
    API-->>UI: Retrospective completed
```

## Component Interaction Summary

### Key Components:
1. **Frontend UI**: React-based SPA handling user interactions
2. **Backend API**: Node.js/Express REST API
3. **Database**: PostgreSQL for persistent storage
4. **Redis**: Caching and session management
5. **WebSocket Server**: Real-time communication
6. **Email Service**: SendGrid for transactional emails
7. **AWS S3**: File storage
8. **Notification Service**: Push and email notifications
9. **Report Service**: Report generation engine
10. **Auth Service**: Authentication and authorization

### Communication Patterns:
- **Synchronous**: REST API calls for CRUD operations
- **Asynchronous**: WebSocket for real-time updates
- **Event-driven**: Redis PubSub for distributed events
- **Batch Processing**: Background jobs for reports and notifications

### Security Measures:
- JWT token validation on every request
- Rate limiting on sensitive endpoints
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- CORS configuration
- File upload scanning

### Performance Optimizations:
- Redis caching for frequently accessed data
- Database connection pooling
- Lazy loading of resources
- Pagination for large datasets
- CDN for static assets
- Gzip compression
- WebSocket connection pooling