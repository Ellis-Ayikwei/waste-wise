# Wasgo Data Flow Diagrams (DFD)

## Overview
This document contains Data Flow Diagrams at different levels showing how data moves through the Wasgo Smart Waste Management System in Ghana.

## Level 0 - Context Diagram

```mermaid
graph TB
    Citizens[("👥 Citizens<br/>(Residents,<br/>Businesses)")]
    System[["🗑️ Wasgo Smart<br/>Waste Management<br/>System"]]
    Drivers[("🚛 Waste Collection<br/>Drivers")]
    Sensors[("📡 IoT Sensors<br/>(Smart Bins)")]
    Providers[("🏢 Service<br/>Providers")]
    Government[("🏛️ Municipal<br/>Authorities")]
    Payment[("💳 Payment<br/>Gateways<br/>(Mobile Money)")]
    
    Citizens -->|"Service Requests,<br/>Payments"| System
    System -->|"Notifications,<br/>Schedules"| Citizens
    
    Sensors -->|"Fill Levels,<br/>Battery Status"| System
    System -->|"Alerts,<br/>Maintenance"| Sensors
    
    Drivers <-->|"Assignments,<br/>Location Updates"| System
    
    Providers <-->|"Fleet Data,<br/>Service Areas"| System
    
    Government -->|"Regulations,<br/>Zones"| System
    System -->|"Reports,<br/>Analytics"| Government
    
    System <-->|"Transactions"| Payment
    
    style System fill:#e1f5fe
    style Citizens fill:#fff3e0
    style Sensors fill:#e8f5e9
    style Drivers fill:#f3e5f5
    style Providers fill:#fce4ec
    style Government fill:#e0f2f1
    style Payment fill:#fff9c4
```

## Level 1 - Main System Processes

```mermaid
graph TB
    subgraph "External Entities"
        Citizen[("👤 Citizen")]
        Driver[("🚛 Driver")]
        Sensor[("📡 Smart Bin")]
        Admin[("👨‍💼 Admin")]
        Provider[("🏢 Provider")]
        MobileMoney[("💰 Mobile Money")]
    end
    
    subgraph "Main Processes"
        BinMonitor["1.0<br/>Bin Monitoring<br/>Process"]
        ServiceMgmt["2.0<br/>Service Request<br/>Management"]
        Collection["3.0<br/>Waste Collection<br/>Process"]
        DriverMgmt["4.0<br/>Driver<br/>Management"]
        Payment["5.0<br/>Payment<br/>Processing"]
        Analytics["6.0<br/>Analytics &<br/>Reporting"]
    end
    
    subgraph "Data Stores"
        BinDB[("D1: Smart Bins")]
        RequestDB[("D2: Service Requests")]
        DriverDB[("D3: Drivers")]
        PaymentDB[("D4: Payments")]
        SensorDB[("D5: Sensor Readings")]
        AlertDB[("D6: Alerts")]
    end
    
    Sensor -->|"Sensor Data"| BinMonitor
    BinMonitor -->|"Fill Alert"| Citizen
    BinMonitor <-->|"Bin Status"| BinDB
    BinMonitor -->|"Readings"| SensorDB
    BinMonitor -->|"Alerts"| AlertDB
    
    Citizen -->|"Request Service"| ServiceMgmt
    ServiceMgmt -->|"Confirmation"| Citizen
    ServiceMgmt <-->|"Request Data"| RequestDB
    ServiceMgmt -->|"Assignment"| DriverMgmt
    
    Driver -->|"Location/Status"| DriverMgmt
    DriverMgmt -->|"Assignments"| Driver
    DriverMgmt <-->|"Driver Data"| DriverDB
    
    DriverMgmt -->|"Collection Task"| Collection
    Collection -->|"Update Status"| BinDB
    Collection -->|"Completion"| RequestDB
    
    Citizen -->|"Payment Info"| Payment
    Payment -->|"Process"| MobileMoney
    MobileMoney -->|"Confirmation"| Payment
    Payment -->|"Receipt"| Citizen
    Payment -->|"Transaction"| PaymentDB
    
    Admin -->|"Query"| Analytics
    Analytics -->|"Reports"| Admin
    Analytics -->|"Read"| BinDB
    Analytics -->|"Read"| RequestDB
    Analytics -->|"Read"| SensorDB
    
    style BinMonitor fill:#e3f2fd
    style ServiceMgmt fill:#f3e5f5
    style Collection fill:#e8f5e9
    style DriverMgmt fill:#fff3e0
    style Payment fill:#fce4ec
    style Analytics fill:#e0f2f1
```

## Level 2 - Bin Monitoring Process

```mermaid
graph TB
    subgraph "External Entities"
        Sensor[("📡 IoT Sensor")]
        Technician[("🔧 Technician")]
        Manager[("👔 Manager")]
        MQTT[("📨 MQTT Broker")]
    end
    
    subgraph "Bin Monitoring Processes"
        Receive["1.1<br/>Receive<br/>Sensor Data"]
        Validate["1.2<br/>Validate<br/>Reading"]
        Update["1.3<br/>Update Bin<br/>Status"]
        CheckAlert["1.4<br/>Check Alert<br/>Conditions"]
        CreateAlert["1.5<br/>Create<br/>Alert"]
        NotifyTech["1.6<br/>Notify<br/>Maintenance"]
    end
    
    subgraph "Data Stores"
        BinDB[("D1: Smart Bins")]
        SensorDB[("D5: Sensor Readings")]
        AlertDB[("D6: Alerts")]
        ConfigDB[("D7: Alert Config")]
    end
    
    Sensor -->|"MQTT Message"| MQTT
    MQTT -->|"Sensor Data"| Receive
    Receive -->|"Raw Data"| Validate
    Validate -->|"Valid Reading"| Update
    Validate -->|"Store"| SensorDB
    
    Update <-->|"Bin Status"| BinDB
    Update -->|"Current Status"| CheckAlert
    
    CheckAlert <-->|"Thresholds"| ConfigDB
    CheckAlert -->|"Alert Needed"| CreateAlert
    
    CreateAlert -->|"New Alert"| AlertDB
    CreateAlert -->|"Critical Alert"| NotifyTech
    
    NotifyTech -->|"SMS/Email"| Technician
    NotifyTech -->|"Dashboard Alert"| Manager
    
    style Receive fill:#c8e6c9
    style Validate fill:#ffecb3
    style Update fill:#d1c4e9
    style CheckAlert fill:#b3e5fc
    style CreateAlert fill:#ffccbc
    style NotifyTech fill:#f8bbd0
```

## Level 2 - Service Request Management

```mermaid
graph TB
    subgraph "External Entities"
        Customer[("👤 Customer")]
        Provider[("🏢 Provider")]
        Driver[("🚛 Driver")]
        SMS[("📱 SMS Gateway")]
    end
    
    subgraph "Service Request Processes"
        Create["2.1<br/>Create<br/>Request"]
        Validate["2.2<br/>Validate<br/>Location"]
        FindProvider["2.3<br/>Find<br/>Provider"]
        AssignDriver["2.4<br/>Assign<br/>Driver"]
        Track["2.5<br/>Track<br/>Progress"]
        Complete["2.6<br/>Complete<br/>Request"]
    end
    
    subgraph "Data Stores"
        RequestDB[("D2: Service Requests")]
        ProviderDB[("D8: Providers")]
        DriverDB[("D3: Drivers")]
        ZoneDB[("D9: Service Zones")]
    end
    
    Customer -->|"Request Details"| Create
    Create -->|"Location Data"| Validate
    Validate <-->|"Zone Check"| ZoneDB
    Validate -->|"Valid Request"| FindProvider
    
    FindProvider <-->|"Provider Data"| ProviderDB
    FindProvider -->|"Selected Provider"| AssignDriver
    
    AssignDriver <-->|"Available Drivers"| DriverDB
    AssignDriver -->|"Assignment"| Driver
    AssignDriver -->|"Update"| RequestDB
    
    Driver -->|"Status Updates"| Track
    Track <-->|"Request Status"| RequestDB
    Track -->|"Progress"| Customer
    
    Driver -->|"Completion Data"| Complete
    Complete -->|"Final Status"| RequestDB
    Complete -->|"Notification"| SMS
    SMS -->|"Confirmation"| Customer
    
    style Create fill:#e1bee7
    style Validate fill:#c5e1a5
    style FindProvider fill:#b2dfdb
    style AssignDriver fill:#b3e5fc
    style Track fill:#ffccbc
    style Complete fill:#d7ccc8
```

## Level 2 - Waste Collection Process

```mermaid
graph TB
    subgraph "External Entities"
        Driver[("🚛 Driver")]
        Vehicle[("🚚 Vehicle GPS")]
        QRScanner[("📷 QR Scanner")]
        Camera[("📸 Camera")]
    end
    
    subgraph "Collection Processes"
        Start["3.1<br/>Start<br/>Collection"]
        Navigate["3.2<br/>Navigate<br/>to Bin"]
        Scan["3.3<br/>Scan<br/>Bin QR"]
        Collect["3.4<br/>Collect<br/>Waste"]
        Photo["3.5<br/>Capture<br/>Proof"]
        UpdateBin["3.6<br/>Update Bin<br/>Status"]
    end
    
    subgraph "Data Stores"
        RouteDB[("D10: Collection Routes")]
        BinDB[("D1: Smart Bins")]
        CollectionDB[("D11: Collections")]
        MediaDB[("D12: Photos")]
    end
    
    Driver -->|"Start Route"| Start
    Start <-->|"Get Route"| RouteDB
    Start -->|"Route Info"| Navigate
    
    Vehicle -->|"GPS Location"| Navigate
    Navigate -->|"Arrival"| Scan
    
    QRScanner -->|"Bin ID"| Scan
    Scan <-->|"Bin Details"| BinDB
    Scan -->|"Verified"| Collect
    
    Driver -->|"Weight/Volume"| Collect
    Collect -->|"Collection Data"| CollectionDB
    
    Camera -->|"Photo"| Photo
    Photo -->|"Store Image"| MediaDB
    Photo -->|"Proof Added"| UpdateBin
    
    UpdateBin <-->|"Reset Status"| BinDB
    UpdateBin -->|"Completed"| Driver
    
    style Start fill:#e1bee7
    style Navigate fill:#c5e1a5
    style Scan fill:#b2dfdb
    style Collect fill:#b3e5fc
    style Photo fill:#ffccbc
    style UpdateBin fill:#d7ccc8
```

## Level 2 - Payment Processing

```mermaid
graph TB
    subgraph "External Entities"
        Customer[("👤 Customer")]
        MTN[("📱 MTN MoMo")]
        Vodafone[("📱 Vodafone Cash")]
        AirtelTigo[("📱 AirtelTigo")]
    end
    
    subgraph "Payment Processes"
        Initiate["5.1<br/>Initiate<br/>Payment"]
        SelectProvider["5.2<br/>Select MoMo<br/>Provider"]
        SendUSSD["5.3<br/>Send USSD<br/>Request"]
        VerifyPIN["5.4<br/>Verify<br/>PIN"]
        Process["5.5<br/>Process<br/>Transaction"]
        Receipt["5.6<br/>Generate<br/>Receipt"]
    end
    
    subgraph "Data Stores"
        PaymentDB[("D4: Payments")]
        TransactionDB[("D13: Transactions")]
        ReceiptDB[("D14: Receipts")]
    end
    
    Customer -->|"Payment Request"| Initiate
    Initiate -->|"Amount & Phone"| SelectProvider
    
    SelectProvider -->|"MTN Number"| MTN
    SelectProvider -->|"Vodafone Number"| Vodafone
    SelectProvider -->|"AirtelTigo Number"| AirtelTigo
    
    MTN -->|"USSD Prompt"| SendUSSD
    Vodafone -->|"USSD Prompt"| SendUSSD
    AirtelTigo -->|"USSD Prompt"| SendUSSD
    
    SendUSSD -->|"Enter PIN"| Customer
    Customer -->|"PIN"| VerifyPIN
    
    VerifyPIN -->|"Verified"| Process
    Process -->|"Transaction"| TransactionDB
    Process -->|"Update"| PaymentDB
    
    Process -->|"Success"| Receipt
    Receipt -->|"Store"| ReceiptDB
    Receipt -->|"SMS/Email"| Customer
    
    style Initiate fill:#fff9c4
    style SelectProvider fill:#c5cae9
    style SendUSSD fill:#b2ebf2
    style VerifyPIN fill:#ffccbc
    style Process fill:#c8e6c9
    style Receipt fill:#ffe0b2
```

## Data Dictionary

### Primary Data Stores

| Data Store | Description | Key Attributes |
|------------|-------------|----------------|
| D1: Smart Bins | IoT-enabled waste bins | bin_id, location, capacity, fill_level, sensor_id |
| D2: Service Requests | Customer service requests | request_id, customer_id, type, status, location |
| D3: Drivers | Driver information | driver_id, name, license, vehicle_id, status |
| D4: Payments | Payment transactions | payment_id, amount, method, status, reference |
| D5: Sensor Readings | IoT sensor data | reading_id, sensor_id, timestamp, values |
| D6: Alerts | System alerts | alert_id, type, severity, bin_id, status |
| D7: Alert Config | Alert thresholds | config_id, alert_type, threshold, action |
| D8: Providers | Service providers | provider_id, name, service_areas, fleet_size |
| D9: Service Zones | Geographic zones | zone_id, boundary, provider_id, frequency |
| D10: Collection Routes | Planned routes | route_id, driver_id, bins[], schedule |
| D11: Collections | Completed collections | collection_id, bin_id, timestamp, weight |
| D12: Photos | Media storage | photo_id, url, type, reference_id |
| D13: Transactions | Payment records | trans_id, provider, reference, status |
| D14: Receipts | Payment receipts | receipt_id, payment_id, url, sent_date |

### Data Flow Types

| Flow Type | Description | Format | Example |
|-----------|-------------|--------|---------|
| Sensor Data | IoT readings | JSON/MQTT | `{"fill_level": 85, "temp": 28}` |
| Location Data | GPS coordinates | GeoJSON | `{"lat": 5.6037, "lng": -0.1870}` |
| Service Request | Collection request | JSON | Request details with location |
| Payment Data | Mobile money | JSON | Transaction with phone number |
| Alert Message | System alerts | JSON/SMS | Alert with severity and action |
| Driver Update | Location/status | JSON | Real-time driver position |

## Data Flow Security Considerations

### Input Validation
- Validate all GPS coordinates
- Sanitize customer inputs
- Verify sensor data ranges
- Validate phone numbers for Mobile Money
- Check file uploads for photos

### Data Transmission
- MQTT over TLS for IoT data
- HTTPS for all API calls
- Encrypted mobile money transactions
- JWT tokens for authentication
- API rate limiting

### Data Storage
- Encrypted sensitive data (payments)
- PostGIS for spatial data
- S3 for media files
- Redis for real-time data
- Regular backups to cloud

### Data Access
- Role-based access (Admin, Driver, Customer)
- API authentication required
- Audit logging for all operations
- Data retention policies
- GDPR compliance

## Performance Optimization

### Caching Strategy
1. **Redis Cache**
   - Driver locations (30 second TTL)
   - Bin status (5 minute TTL)
   - Service areas (1 hour TTL)

2. **Database Optimization**
   - Spatial indexes for location queries
   - Time-series partitioning for sensor data
   - Read replicas for analytics

3. **Data Aggregation**
   - Hourly sensor reading summaries
   - Daily collection statistics
   - Monthly environmental reports

### Real-time Data Flow
- WebSocket for dashboard updates
- MQTT for sensor streaming
- Push notifications for alerts
- SMS for critical notifications

## Ghana-Specific Considerations

### Mobile Money Integration
- MTN Mobile Money
- Vodafone Cash
- AirtelTigo Money
- USSD fallback for feature phones

### Location Services
- Ghana Post GPS integration
- Local area names in Twi/Ga
- Offline maps for poor connectivity

### Network Optimization
- Data compression for slow networks
- Offline mode for drivers
- SMS fallback for notifications
- USSD support for payments