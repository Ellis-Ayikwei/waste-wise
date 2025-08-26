# Wasgo Sequence Diagrams

## Overview
This document contains sequence diagrams for the key processes in the Wasgo Smart Waste Management System. Each diagram illustrates the interaction between different system components and actors in waste collection operations.

## Main System Overview - Complete Waste Management Process

```mermaid
sequenceDiagram
    participant Citizen as Citizen
    participant SmartBin as Smart Bin
    participant IoTSensor as IoT Sensor
    participant System as Wasgo System
    participant Admin as Administrator
    participant Provider as Service Provider
    participant Driver as Driver
    participant Vehicle as Collection Vehicle
    participant Payment as Payment Gateway

    Note over Citizen,Payment: Daily Waste Management Cycle
    
    %% Phase 1: Waste Disposal & Monitoring
    rect rgb(255, 255, 255)
        Note over Citizen,IoTSensor: 1. Waste Disposal & Monitoring
        Citizen->>SmartBin: Dispose waste
        SmartBin->>IoTSensor: Detect fill level change
        IoTSensor->>System: Send sensor data (MQTT)
        System->>System: Update bin status
        
        alt Fill level > 80%
            System->>Admin: Alert: Bin nearly full
            System->>Provider: Notify for collection
        end
    end
    
    %% Phase 2: Collection Planning
    rect rgb(255, 255, 255)
        Note over System,Provider: 2. Collection Planning & Assignment
        Provider->>System: Check pending collections
        System-->>Provider: List of full bins & requests
        Provider->>System: Create collection schedule
        System->>Driver: Assign collection task
        Driver->>System: Accept assignment
        System->>Citizen: SMS: Collection scheduled
    end
    
    %% Phase 3: Service Requests
    rect rgb(255, 255, 255)
        Note over Citizen,System: 3. On-Demand Service Requests
        opt Special Collection Needed
            Citizen->>System: Create service request
            System->>System: Validate location & service
            System->>Provider: New service request
            Provider->>System: Accept & quote price
            System->>Citizen: Confirmation & price
            Citizen->>Payment: Initiate payment
            Payment-->>System: Payment confirmed
            System->>Driver: Assign special pickup
        end
    end
    
    %% Phase 4: Collection Execution
    rect rgb(255, 255, 255)
        Note over Driver,Vehicle: 4. Collection Execution
        Driver->>System: Start shift check-in
        Driver->>Vehicle: Begin route
        
        loop For each collection point
            Vehicle->>System: Update GPS location
            Driver->>SmartBin: Arrive at bin
            Driver->>System: Scan QR code
            System-->>Driver: Bin details
            Driver->>SmartBin: Collect waste
            Driver->>System: Mark as collected
            System->>IoTSensor: Reset fill level
            System->>Citizen: Notify collection done
        end
        
        Driver->>System: End shift check-out
    end
    
    %% Phase 5: Analytics & Reporting
    rect rgb(255, 255, 255)
        Note over System,Admin: 5. Analytics & Reporting
        System->>System: Aggregate daily data
        System->>Admin: Generate reports
        Admin->>System: View dashboards
        System-->>Admin: Performance metrics
        
        opt Monthly reporting
            System->>Provider: Monthly invoice
            Provider->>Payment: Process payment
            System->>Admin: Environmental impact report
        end
    end
    
    %% Phase 6: Maintenance
    rect rgb(255, 255, 255)
        Note over IoTSensor,System: 6. System Maintenance
        alt Sensor battery low
            IoTSensor->>System: Battery alert
            System->>Admin: Schedule maintenance
            Admin->>Provider: Assign technician
        else Bin damage reported
            Citizen->>System: Report issue
            System->>Admin: Create maintenance ticket
        end
    end
```

## 1. Smart Bin Sensor Data Upload Process

```mermaid
sequenceDiagram
    participant Sensor as IoT Sensor
    participant MQTT as MQTT Broker
    participant API as Django API
    participant DB as PostgreSQL
    participant Alert as Alert Service
    participant Notif as Notification Service

    Sensor->>MQTT: Publish sensor data
    Note over MQTT: Topic: bins/{bin_id}/readings
    MQTT->>API: Forward reading
    API->>API: Validate sensor data
    API->>DB: Store SensorReading
    DB-->>API: Reading saved
    
    API->>DB: Update SmartBin status
    DB-->>API: Status updated
    
    alt Fill level >= 80%
        API->>Alert: Create BinAlert
        Alert->>DB: Store alert
        Alert->>Notif: Send notification
        Notif->>Notif: Queue SMS/Email
        Notif-->>API: Notification sent
    end
    
    API-->>MQTT: Acknowledge receipt
    MQTT-->>Sensor: Confirmation
```

## 2. Service Request Creation Process

```mermaid
sequenceDiagram
    participant Customer as Customer
    participant Web as Web/Mobile App
    participant API as Django API
    participant DB as PostgreSQL
    participant Provider as Provider Service
    participant Driver as Driver App
    participant SMS as SMS Service

    Customer->>Web: Request waste collection
    Web->>Web: Capture location
    Customer->>Web: Select waste type & quantity
    Web->>API: POST /api/service-requests/
    
    API->>API: Validate request
    API->>API: Generate request_id
    API->>DB: Create ServiceRequest
    DB-->>API: Request created
    
    API->>Provider: Find available providers
    Provider->>DB: Query by service area
    DB-->>Provider: Provider list
    
    Provider->>Provider: Select best match
    Provider->>API: Assign provider
    
    API->>DB: Update request status
    API->>Driver: Notify assigned driver
    Driver-->>API: Acknowledged
    
    API->>SMS: Send confirmation SMS
    SMS-->>Customer: SMS delivered
    
    API-->>Web: Request confirmed
    Web-->>Customer: Show tracking info
```

## 3. Driver Check-in and Assignment Process

```mermaid
sequenceDiagram
    participant Driver as Driver
    participant App as Driver Mobile App
    participant API as Django API
    participant DB as PostgreSQL
    participant GPS as GPS Service
    participant Dispatch as Dispatch Service

    Driver->>App: Start shift
    App->>GPS: Get current location
    GPS-->>App: Location coordinates
    
    App->>API: POST /api/drivers/check-in/
    API->>DB: Update driver status
    DB-->>API: Status: on_duty
    
    API->>DB: Log shift start
    DB-->>API: Logged
    
    API->>Dispatch: Driver available
    Dispatch->>DB: Query pending requests
    DB-->>Dispatch: Pending list
    
    Dispatch->>Dispatch: Match by location/capacity
    Dispatch->>DB: Assign requests to driver
    DB-->>Dispatch: Assignments created
    
    Dispatch->>API: Send assignments
    API->>App: Push assignments
    App->>App: Display route
    App-->>Driver: Show collection list
```

## 4. Bin Collection Process

```mermaid
sequenceDiagram
    participant Driver as Driver
    participant App as Driver App
    participant QR as QR Scanner
    participant API as Django API
    participant DB as PostgreSQL
    participant IoT as IoT Service
    participant Customer as Customer

    Driver->>App: Arrive at bin location
    App->>API: Update driver location
    API->>DB: Store location
    
    Driver->>QR: Scan bin QR code
    QR-->>App: Bin ID extracted
    
    App->>API: GET /api/bins/{bin_id}/
    API->>DB: Fetch bin details
    DB-->>API: Bin data
    API-->>App: Display bin info
    
    Driver->>App: Confirm collection
    App->>App: Take photo proof
    App->>API: POST /api/bins/{bin_id}/collect/
    
    API->>DB: Update bin status
    DB-->>API: Status: emptied
    
    API->>IoT: Reset bin fill level
    IoT-->>API: Confirmed
    
    API->>DB: Log collection record
    DB-->>API: Record saved
    
    API->>Customer: Send notification
    Customer-->>API: Delivered
    
    API-->>App: Collection confirmed
    App-->>Driver: Next bin location
```

## 5. Real-time Vehicle Tracking Process

```mermaid
sequenceDiagram
    participant Driver as Driver App
    participant GPS as GPS Module
    participant API as Django API
    participant WS as WebSocket Server
    participant DB as PostgreSQL
    participant Admin as Admin Dashboard
    participant Redis as Redis Cache

    loop Every 30 seconds
        Driver->>GPS: Get location
        GPS-->>Driver: Coordinates
        
        Driver->>API: PUT /api/drivers/location/
        API->>DB: Store DriverLocation
        DB-->>API: Saved
        
        API->>Redis: Update cache
        Redis-->>API: Cached
        
        API->>WS: Broadcast location
        WS-->>Admin: Real-time update
        Admin->>Admin: Update map
    end
    
    Admin->>API: Request route history
    API->>DB: Query locations
    DB-->>API: Location history
    API-->>Admin: Display route
```

## 6. Payment Processing (Mobile Money)

```mermaid
sequenceDiagram
    participant Customer as Customer
    participant App as Mobile App
    participant API as Django API
    participant DB as PostgreSQL
    participant MM as Mobile Money API
    participant SMS as SMS Service

    Customer->>App: Select payment
    App->>App: Choose Mobile Money
    Customer->>App: Enter phone number
    
    App->>API: POST /api/payments/initiate/
    API->>API: Generate transaction_id
    API->>DB: Create Payment record
    DB-->>API: Payment pending
    
    API->>MM: Initiate payment
    MM-->>Customer: USSD prompt
    Customer->>MM: Enter PIN
    MM->>MM: Process payment
    
    alt Payment successful
        MM->>API: Callback: Success
        API->>DB: Update payment status
        DB-->>API: Status: completed
        
        API->>DB: Update service request
        DB-->>API: Request paid
        
        API->>SMS: Send receipt
        SMS-->>Customer: Receipt SMS
        
        API-->>App: Payment successful
    else Payment failed
        MM->>API: Callback: Failed
        API->>DB: Update status
        API-->>App: Payment failed
        App-->>Customer: Show error
    end
```

## 7. Sensor Alert and Maintenance Process

```mermaid
sequenceDiagram
    participant Sensor as Smart Bin Sensor
    participant API as Django API
    participant DB as PostgreSQL
    participant Alert as Alert System
    participant Tech as Technician
    participant Admin as Admin Dashboard

    Sensor->>API: Low battery alert
    API->>DB: Check sensor history
    DB-->>API: Battery trend
    
    API->>Alert: Create maintenance alert
    Alert->>DB: Store BinAlert
    DB-->>Alert: Alert saved
    
    Alert->>Alert: Determine severity
    
    alt Critical (battery < 10%)
        Alert->>Tech: Urgent notification
        Tech-->>Alert: Acknowledged
        Alert->>DB: Assign technician
    else Warning (battery < 20%)
        Alert->>Admin: Dashboard notification
        Admin->>Admin: Schedule maintenance
    end
    
    Tech->>API: Arrive at bin
    API->>DB: Update alert status
    
    Tech->>API: Complete maintenance
    API->>DB: Log maintenance
    DB-->>API: Logged
    
    API->>DB: Reset sensor status
    API->>Alert: Close alert
    Alert->>DB: Alert resolved
    
    API-->>Admin: Update dashboard
```

## 8. Bulk Waste Collection Request

```mermaid
sequenceDiagram
    participant Customer as Customer
    participant Web as Website
    participant API as Django API
    participant DB as PostgreSQL
    participant Provider as Provider Service
    participant Payment as Payment Service
    participant Driver as Driver

    Customer->>Web: Request bulk collection
    Web->>Web: Upload photos
    Customer->>Web: Describe items
    
    Web->>API: POST /api/service-requests/bulk/
    API->>API: Estimate weight/volume
    API->>Provider: Get pricing
    Provider->>DB: Query rates
    DB-->>Provider: Pricing info
    Provider-->>API: Cost estimate
    
    API->>DB: Create ServiceRequest
    DB-->>API: Request saved
    
    API-->>Web: Show quote
    Web-->>Customer: Display price
    
    Customer->>Web: Accept quote
    Web->>API: Confirm request
    
    API->>Payment: Process payment
    Payment-->>API: Payment confirmed
    
    API->>Provider: Schedule pickup
    Provider->>Driver: Assign job
    Driver-->>Provider: Accepted
    
    API->>Customer: Send confirmation
    Customer-->>API: SMS/Email received
```

## 9. Environmental Report Generation

```mermaid
sequenceDiagram
    participant Admin as Administrator
    participant UI as Admin Dashboard
    participant API as Django API
    participant DB as PostgreSQL
    participant Analytics as Analytics Engine
    participant Report as Report Generator
    participant S3 as File Storage

    Admin->>UI: Request monthly report
    UI->>API: GET /api/reports/environmental/
    
    API->>DB: Query waste collected
    DB-->>API: Collection data
    
    API->>DB: Query recycling rates
    DB-->>API: Recycling data
    
    API->>DB: Query bin alerts
    DB-->>API: Overflow incidents
    
    API->>Analytics: Process data
    Analytics->>Analytics: Calculate metrics
    Analytics->>Analytics: Generate charts
    Analytics-->>API: Processed data
    
    API->>Report: Generate PDF
    Report->>Report: Create document
    Report->>S3: Upload report
    S3-->>Report: File URL
    
    Report-->>API: Report ready
    API-->>UI: Download link
    UI-->>Admin: View/Download report
```

## 10. Zone Coverage Analysis

```mermaid
sequenceDiagram
    participant Planner as City Planner
    participant UI as Web Interface
    participant API as Django API
    participant GIS as PostGIS Database
    participant Analytics as Analytics Service
    participant Map as Mapping Service

    Planner->>UI: Select analysis area
    UI->>Map: Draw polygon
    Map-->>UI: Area boundaries
    
    UI->>API: POST /api/analytics/coverage/
    API->>GIS: Query bins in area
    GIS-->>API: Bin locations
    
    API->>GIS: Calculate coverage
    Note over GIS: ST_Contains, ST_Distance
    GIS-->>API: Coverage data
    
    API->>Analytics: Analyze gaps
    Analytics->>Analytics: Identify underserved
    Analytics->>Analytics: Population density
    Analytics-->>API: Gap analysis
    
    API->>GIS: Generate heatmap
    GIS-->>API: Heatmap data
    
    API-->>UI: Analysis results
    UI->>Map: Display heatmap
    Map-->>Planner: Visual coverage
    
    UI->>UI: Show recommendations
    UI-->>Planner: Suggested bin locations
```

## Component Interaction Summary

### Key Components:
1. **Django Backend**: Core API and business logic
2. **PostgreSQL/PostGIS**: Spatial database
3. **MQTT Broker**: IoT communication
4. **Redis**: Caching and real-time data
5. **WebSocket Server**: Live updates
6. **Mobile Apps**: Driver and customer apps
7. **SMS Gateway**: Notifications (Twilio/Africa's Talking)
8. **Mobile Money API**: Payment processing
9. **File Storage**: AWS S3 or similar
10. **Analytics Engine**: Data processing

### Communication Patterns:
- **REST API**: Standard CRUD operations
- **MQTT**: IoT sensor data streaming
- **WebSocket**: Real-time dashboard updates
- **Webhooks**: Payment callbacks
- **Background Jobs**: Report generation (Celery)

### Security Measures:
- JWT authentication for API access
- API key validation for IoT devices
- SSL/TLS for all communications
- Input validation and sanitization
- Rate limiting on public endpoints
- Audit logging for all operations

### Ghana-Specific Integrations:
- Mobile Money providers (MTN, Vodafone, AirtelTigo)
- SMS gateways for local carriers
- Ghana Post GPS addressing system
- Local language support (Twi, Ga)
- DVLA vehicle registration validation