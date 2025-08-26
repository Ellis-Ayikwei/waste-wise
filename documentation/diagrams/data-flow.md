# Data Flow Diagrams (DFD)

## Overview
This document contains Data Flow Diagrams at different levels showing how data moves through the Task Management System.

## Level 0 - Context Diagram

```mermaid
graph TB
    User[("👤 Users<br/>(Team Members,<br/>Managers, Admins)")]
    System[["📊 Task Management<br/>System"]]
    Email[("📧 Email<br/>Service")]
    Storage[("☁️ Cloud<br/>Storage")]
    External[("🔗 External<br/>Integrations<br/>(GitHub, Slack)")]
    
    User -->|"Authentication,<br/>Tasks, Projects"| System
    System -->|"Notifications,<br/>Reports"| User
    System -->|"Send Emails"| Email
    Email -->|"Delivery Status"| System
    System -->|"Upload Files"| Storage
    Storage -->|"File URLs"| System
    System <-->|"Sync Data"| External
    
    style System fill:#e1f5fe
    style User fill:#fff3e0
    style Email fill:#f3e5f5
    style Storage fill:#e8f5e9
    style External fill:#fce4ec
```

## Level 1 - Main System Processes

```mermaid
graph TB
    subgraph "External Entities"
        User[("👤 User")]
        Admin[("👨‍💼 Admin")]
        Email[("📧 Email Service")]
        Storage[("☁️ S3 Storage")]
        Integration[("🔗 External APIs")]
    end
    
    subgraph "Main Processes"
        Auth["1.0<br/>Authentication<br/>Process"]
        Project["2.0<br/>Project<br/>Management"]
        Task["3.0<br/>Task<br/>Management"]
        Sprint["4.0<br/>Sprint<br/>Management"]
        Report["5.0<br/>Reporting<br/>Process"]
        Notify["6.0<br/>Notification<br/>System"]
    end
    
    subgraph "Data Stores"
        UserDB[("D1: Users")]
        ProjectDB[("D2: Projects")]
        TaskDB[("D3: Tasks")]
        SprintDB[("D4: Sprints")]
        ActivityDB[("D5: Activity Logs")]
    end
    
    User -->|"Login Credentials"| Auth
    Auth -->|"Token"| User
    Auth <-->|"User Data"| UserDB
    
    User -->|"Project Details"| Project
    Project -->|"Project Info"| User
    Project <-->|"Project Data"| ProjectDB
    
    User -->|"Task Details"| Task
    Task -->|"Task Status"| User
    Task <-->|"Task Data"| TaskDB
    Task -->|"Activity"| ActivityDB
    
    User -->|"Sprint Planning"| Sprint
    Sprint -->|"Sprint Board"| User
    Sprint <-->|"Sprint Data"| SprintDB
    
    Admin -->|"Report Request"| Report
    Report -->|"Generated Report"| Admin
    Report -->|"Query"| TaskDB
    Report -->|"Query"| SprintDB
    
    Task -->|"Trigger"| Notify
    Sprint -->|"Trigger"| Notify
    Notify -->|"Email Request"| Email
    Notify -->|"Push Notification"| User
    
    Task -->|"File Upload"| Storage
    Storage -->|"File URL"| Task
    
    Task <-->|"Sync"| Integration
    
    style Auth fill:#e3f2fd
    style Project fill:#f3e5f5
    style Task fill:#e8f5e9
    style Sprint fill:#fff3e0
    style Report fill:#fce4ec
    style Notify fill:#e0f2f1
```

## Level 2 - Task Management Process

```mermaid
graph TB
    subgraph "External Entities"
        User[("👤 User")]
        Assignee[("👥 Assignees")]
        Storage[("☁️ File Storage")]
        Notif[("🔔 Notification Service")]
    end
    
    subgraph "Task Management Processes"
        Create["3.1<br/>Create<br/>Task"]
        Update["3.2<br/>Update<br/>Task"]
        Assign["3.3<br/>Assign<br/>Task"]
        Comment["3.4<br/>Add<br/>Comment"]
        Attach["3.5<br/>Attach<br/>Files"]
        Track["3.6<br/>Track<br/>Time"]
    end
    
    subgraph "Data Stores"
        TaskDB[("D3: Tasks")]
        CommentDB[("D6: Comments")]
        AttachDB[("D7: Attachments")]
        TimeDB[("D8: Time Logs")]
        ActivityDB[("D5: Activity Logs")]
    end
    
    User -->|"Task Details"| Create
    Create -->|"Task Created"| User
    Create -->|"New Task"| TaskDB
    Create -->|"Log Entry"| ActivityDB
    
    User -->|"Changes"| Update
    Update -->|"Updated Info"| User
    Update <-->|"Task Data"| TaskDB
    Update -->|"Log Entry"| ActivityDB
    Update -->|"Notification"| Notif
    
    User -->|"Assignment"| Assign
    Assign -->|"Confirmation"| User
    Assign <-->|"Task Data"| TaskDB
    Assign -->|"Notify"| Assignee
    Assign -->|"Log Entry"| ActivityDB
    
    User -->|"Comment Text"| Comment
    Comment -->|"Posted"| User
    Comment -->|"New Comment"| CommentDB
    Comment -->|"Notification"| Assignee
    
    User -->|"File"| Attach
    Attach -->|"Upload to S3"| Storage
    Storage -->|"File URL"| Attach
    Attach -->|"Attachment Record"| AttachDB
    Attach -->|"Success"| User
    
    User -->|"Time Entry"| Track
    Track -->|"Logged"| User
    Track -->|"Time Record"| TimeDB
    Track <-->|"Update Hours"| TaskDB
    
    style Create fill:#c8e6c9
    style Update fill:#ffecb3
    style Assign fill:#d1c4e9
    style Comment fill:#b3e5fc
    style Attach fill:#ffccbc
    style Track fill:#f8bbd0
```

## Level 2 - Sprint Management Process

```mermaid
graph TB
    subgraph "External Entities"
        SM[("👨‍💼 Scrum Master")]
        Team[("👥 Team")]
        System[("⚙️ System")]
    end
    
    subgraph "Sprint Processes"
        Plan["4.1<br/>Sprint<br/>Planning"]
        Start["4.2<br/>Start<br/>Sprint"]
        Board["4.3<br/>Update<br/>Board"]
        Daily["4.4<br/>Daily<br/>Standup"]
        Close["4.5<br/>Close<br/>Sprint"]
        Retro["4.6<br/>Retrospective"]
    end
    
    subgraph "Data Stores"
        SprintDB[("D4: Sprints")]
        TaskDB[("D3: Tasks")]
        BacklogDB[("D9: Backlog")]
        MetricsDB[("D10: Metrics")]
        RetroB[("D11: Retrospectives")]
    end
    
    SM -->|"Sprint Config"| Plan
    Plan <-->|"Backlog Items"| BacklogDB
    Plan -->|"Selected Tasks"| SprintDB
    Plan -->|"Sprint Plan"| Team
    
    SM -->|"Start Command"| Start
    Start <-->|"Sprint Data"| SprintDB
    Start -->|"Update Status"| TaskDB
    Start -->|"Sprint Started"| Team
    
    Team -->|"Task Movement"| Board
    Board <-->|"Task Status"| TaskDB
    Board -->|"Updated Board"| Team
    Board -->|"Metrics"| MetricsDB
    
    Team -->|"Status Update"| Daily
    Daily -->|"Progress"| Team
    Daily <-->|"Task Data"| TaskDB
    
    System -->|"End Date Reached"| Close
    Close <-->|"Sprint Data"| SprintDB
    Close -->|"Move Incomplete"| BacklogDB
    Close -->|"Final Metrics"| MetricsDB
    Close -->|"Sprint Closed"| SM
    
    Team -->|"Feedback"| Retro
    Retro -->|"Action Items"| Team
    Retro -->|"Retro Data"| RetroB
    Retro -->|"Insights"| MetricsDB
    
    style Plan fill:#e1bee7
    style Start fill:#c5e1a5
    style Board fill:#b2dfdb
    style Daily fill:#b3e5fc
    style Close fill:#ffccbc
    style Retro fill:#d7ccc8
```

## Level 2 - Reporting Process

```mermaid
graph TB
    subgraph "External Entities"
        Manager[("📊 Manager")]
        Scheduler[("⏰ Scheduler")]
        Email[("📧 Email")]
    end
    
    subgraph "Reporting Processes"
        Request["5.1<br/>Request<br/>Report"]
        Generate["5.2<br/>Generate<br/>Report"]
        Format["5.3<br/>Format<br/>Output"]
        Deliver["5.4<br/>Deliver<br/>Report"]
        Cache["5.5<br/>Cache<br/>Results"]
    end
    
    subgraph "Data Stores"
        TaskDB[("D3: Tasks")]
        SprintDB[("D4: Sprints")]
        TimeDB[("D8: Time Logs")]
        ReportCache[("D12: Report Cache")]
        Templates[("D13: Templates")]
    end
    
    Manager -->|"Report Params"| Request
    Scheduler -->|"Scheduled Job"| Request
    Request -->|"Check Cache"| ReportCache
    
    alt "Cache Hit"
        ReportCache -->|"Cached Report"| Deliver
    else "Cache Miss"
        Request -->|"Query Request"| Generate
        Generate -->|"Fetch Data"| TaskDB
        Generate -->|"Fetch Data"| SprintDB
        Generate -->|"Fetch Data"| TimeDB
        Generate -->|"Raw Data"| Format
        
        Format -->|"Get Template"| Templates
        Format -->|"Formatted Report"| Deliver
        Format -->|"Store"| ReportCache
    end
    
    Deliver -->|"Report"| Manager
    Deliver -->|"Email Report"| Email
    
    style Request fill:#fff9c4
    style Generate fill:#c5cae9
    style Format fill:#b2ebf2
    style Deliver fill:#c8e6c9
    style Cache fill:#ffe0b2
```

## Data Dictionary

### Primary Data Stores

| Data Store | Description | Key Attributes |
|------------|-------------|----------------|
| D1: Users | User account information | user_id, email, password_hash, profile |
| D2: Projects | Project details | project_id, name, owner, members, settings |
| D3: Tasks | Task information | task_id, title, description, status, assignees |
| D4: Sprints | Sprint data | sprint_id, project_id, start_date, end_date |
| D5: Activity Logs | System audit trail | log_id, user_id, action, timestamp |
| D6: Comments | Task discussions | comment_id, task_id, user_id, content |
| D7: Attachments | File metadata | attachment_id, file_url, size, type |
| D8: Time Logs | Time tracking | time_id, task_id, user_id, hours |
| D9: Backlog | Product backlog | item_id, priority, story_points |
| D10: Metrics | Performance metrics | metric_id, type, value, timestamp |
| D11: Retrospectives | Sprint retrospectives | retro_id, sprint_id, feedback |
| D12: Report Cache | Cached reports | report_id, parameters, data, expiry |
| D13: Templates | Report templates | template_id, format, layout |

### Data Flow Types

| Flow Type | Description | Format |
|-----------|-------------|--------|
| User Input | Data entered by users | JSON/Form Data |
| API Response | System responses | JSON |
| Database Query | Database operations | SQL |
| File Upload | Binary file data | Multipart/Binary |
| Notifications | Alert messages | JSON/Push |
| Reports | Generated documents | PDF/Excel/CSV |
| Real-time Updates | WebSocket messages | JSON |
| Integration Sync | External API data | JSON/XML |

## Data Flow Security Considerations

### Input Validation
- All user inputs sanitized
- SQL injection prevention
- XSS protection
- File type validation
- Size limits enforced

### Data Transmission
- HTTPS for all API calls
- WebSocket over WSS
- Encrypted file uploads
- JWT token authentication
- API rate limiting

### Data Storage
- Encrypted passwords (bcrypt)
- Encrypted sensitive data at rest
- S3 bucket policies
- Database access control
- Regular backups

### Data Access
- Role-based access control (RBAC)
- Project-level permissions
- Row-level security
- API authentication required
- Session management

## Performance Optimization

### Caching Strategy
1. **Redis Cache**
   - User sessions
   - Frequently accessed data
   - Real-time collaboration data

2. **Database Query Cache**
   - Complex report queries
   - Aggregate calculations
   - Sprint metrics

3. **CDN**
   - Static assets
   - User avatars
   - File attachments

### Data Partitioning
1. **Time-based Partitioning**
   - Activity logs by month
   - Metrics by quarter
   - Archived sprints

2. **Project-based Partitioning**
   - Tasks by project
   - Comments by project
   - Files by project

### Indexing Strategy
- Primary keys on all tables
- Foreign key indexes
- Composite indexes for common queries
- Full-text search indexes
- Partial indexes for active records