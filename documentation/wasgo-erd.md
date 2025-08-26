# Wasgo Entity Relationship Diagram (ERD) - High-Level Chen's Notation

## Database Schema Overview
Wasgo uses PostgreSQL with PostGIS extension for geospatial capabilities. The Django backend implements a comprehensive data model for smart waste management operations in Ghana.

## High-Level Conceptual ERD - Chen's Notation

This high-level ERD shows the main entities and their key attributes arranged around them for clarity. Only the most important attributes are displayed to maintain readability.

```mermaid
graph TB
    %% USER ENTITY WITH ATTRIBUTES
    User[User]
    u_id((id))
    u_email((email))
    u_phone((phone))
    u_type((type))
    u_name((name))
    
    u_id -.->|PK| User
    u_email -.-> User
    u_phone -.-> User
    u_type -.-> User
    u_name -.-> User
    
    %% SMART BIN ENTITY WITH ATTRIBUTES
    SmartBin[SmartBin]
    b_id((id))
    b_number((number))
    b_location((location))
    b_fill((fill_level))
    b_status((status))
    
    b_id -.->|PK| SmartBin
    b_number -.-> SmartBin
    b_location -.-> SmartBin
    b_fill -.-> SmartBin
    b_status -.-> SmartBin
    
    %% SERVICE REQUEST ENTITY WITH ATTRIBUTES
    ServiceRequest[ServiceRequest]
    sr_id((id))
    sr_type((type))
    sr_status((status))
    sr_date((date))
    sr_cost((cost))
    
    sr_id -.->|PK| ServiceRequest
    sr_type -.-> ServiceRequest
    sr_status -.-> ServiceRequest
    sr_date -.-> ServiceRequest
    sr_cost -.-> ServiceRequest
    
    %% DRIVER ENTITY WITH ATTRIBUTES
    Driver[Driver]
    d_id((id))
    d_name((name))
    d_license((license))
    d_status((status))
    d_rating((rating))
    
    d_id -.->|PK| Driver
    d_name -.-> Driver
    d_license -.-> Driver
    d_status -.-> Driver
    d_rating -.-> Driver
    
    %% VEHICLE ENTITY WITH ATTRIBUTES
    Vehicle[Vehicle]
    v_id((id))
    v_reg((registration))
    v_type((type))
    v_capacity((capacity))
    v_status((status))
    
    v_id -.->|PK| Vehicle
    v_reg -.-> Vehicle
    v_type -.-> Vehicle
    v_capacity -.-> Vehicle
    v_status -.-> Vehicle
    
    %% PAYMENT ENTITY WITH ATTRIBUTES
    Payment[Payment]
    p_id((id))
    p_amount((amount))
    p_method((method))
    p_status((status))
    p_date((date))
    
    p_id -.->|PK| Payment
    p_amount -.-> Payment
    p_method -.-> Payment
    p_status -.-> Payment
    p_date -.-> Payment
    
    %% ZONE ENTITY WITH ATTRIBUTES
    Zone[Zone]
    z_id((id))
    z_name((name))
    z_area((area))
    z_boundary((boundary))
    
    z_id -.->|PK| Zone
    z_name -.-> Zone
    z_area -.-> Zone
    z_boundary -.-> Zone
    
    %% SENSOR ENTITY WITH ATTRIBUTES
    Sensor[Sensor]
    s_id((id))
    s_type((type))
    s_battery((battery))
    s_status((status))
    
    s_id -.->|PK| Sensor
    s_type -.-> Sensor
    s_battery -.-> Sensor
    s_status -.-> Sensor
    
    %% ROUTE ENTITY WITH ATTRIBUTES
    Route[Route]
    rt_id((id))
    rt_distance((distance))
    rt_duration((duration))
    rt_efficiency((efficiency))
    
    rt_id -.->|PK| Route
    rt_distance -.-> Route
    rt_duration -.-> Route
    rt_efficiency -.-> Route
    
    %% MAIN RELATIONSHIPS
    owns{owns}
    creates{creates}
    monitors{monitors}
    handles{handles}
    drives{drives}
    pays_for{pays_for}
    located_in{located_in}
    follows{follows}
    optimizes{optimizes}
    
    User -->|1:N| owns --> SmartBin
    User -->|1:N| creates --> ServiceRequest
    SmartBin -->|1:1| monitors --> Sensor
    Driver -->|N:M| handles --> ServiceRequest
    Driver -->|N:1| drives --> Vehicle
    Driver -->|N:M| follows --> Route
    Route -->|N:M| optimizes --> SmartBin
    Payment -->|1:1| pays_for --> ServiceRequest
    SmartBin -->|N:1| located_in --> Zone
```

## Core System Components - Simplified View

```mermaid
graph TB
    %% CORE ENTITIES ONLY
    User[User]
    SmartBin[SmartBin]
    ServiceRequest[ServiceRequest]
    Driver[Driver]
    Payment[Payment]
    
    %% CORE RELATIONSHIPS
    requests{requests}
    collects{collects}
    pays{pays}
    manages{manages}
    
    User -->|1:N| requests --> ServiceRequest
    Driver -->|N:M| collects --> SmartBin
    User -->|1:N| pays --> Payment
    Driver -->|N:M| manages --> ServiceRequest
```

## Main Business Entities with Primary Attributes

```mermaid
graph TB
    %% USER DOMAIN
    subgraph "User Domain"
        User[User]
        user_email((email))
        user_phone((phone))
        user_type((type))
        
        user_email -.-> User
        user_phone -.-> User
        user_type -.-> User
    end
    
    %% WASTE MANAGEMENT DOMAIN
    subgraph "Waste Management"
        SmartBin[SmartBin]
        bin_location((location))
        bin_fill((fill_level))
        bin_status((status))
        
        bin_location -.-> SmartBin
        bin_fill -.-> SmartBin
        bin_status -.-> SmartBin
    end
    
    %% SERVICE DOMAIN
    subgraph "Service Domain"
        ServiceRequest[ServiceRequest]
        req_type((type))
        req_status((status))
        req_cost((cost))
        
        req_type -.-> ServiceRequest
        req_status -.-> ServiceRequest
        req_cost -.-> ServiceRequest
    end
    
    %% OPERATIONS DOMAIN
    subgraph "Operations"
        Driver[Driver]
        driver_name((name))
        driver_status((status))
        
        Vehicle[Vehicle]
        vehicle_reg((registration))
        vehicle_capacity((capacity))
        
        driver_name -.-> Driver
        driver_status -.-> Driver
        vehicle_reg -.-> Vehicle
        vehicle_capacity -.-> Vehicle
    end
```

## IoT and Monitoring Subsystem

```mermaid
graph TB
    %% IOT ENTITIES
    SmartBin[SmartBin]
    bin_id((bin_id))
    bin_location((location))
    bin_fill_level((fill_level))
    
    bin_id -.->|PK| SmartBin
    bin_location -.-> SmartBin
    bin_fill_level -.-> SmartBin
    
    Sensor[Sensor]
    sensor_type((type))
    sensor_battery((battery))
    sensor_status((status))
    
    sensor_type -.-> Sensor
    sensor_battery -.-> Sensor
    sensor_status -.-> Sensor
    
    SensorReading[[SensorReading]]
    reading_value((value))
    reading_time((timestamp))
    
    reading_value -.-> SensorReading
    reading_time -.-> SensorReading
    
    BinAlert[[BinAlert]]
    alert_type((type))
    alert_severity((severity))
    
    alert_type -.-> BinAlert
    alert_severity -.-> BinAlert
    
    %% IOT RELATIONSHIPS
    equipped_with{equipped_with}
    produces{{produces}}
    generates{{generates}}
    
    SmartBin -->|1:1| equipped_with --> Sensor
    Sensor -->|1:N| produces --> SensorReading
    SmartBin -->|1:N| generates --> BinAlert
```

## Collection Management & Route Optimization Subsystem

```mermaid
graph TB
    %% COLLECTION ENTITIES
    Zone[Zone]
    zone_name((name))
    zone_area((area))
    
    zone_name -.-> Zone
    zone_area -.-> Zone
    
    CollectionRoute[Route]
    route_id((id))
    route_distance((distance))
    route_duration((duration))
    route_status((status))
    
    route_id -.->|PK| CollectionRoute
    route_distance -.-> CollectionRoute
    route_duration -.-> CollectionRoute
    route_status -.-> CollectionRoute
    
    RouteStop[RouteStop]
    stop_sequence((sequence))
    stop_arrival((arrival_time))
    stop_type((type))
    
    stop_sequence -.-> RouteStop
    stop_arrival -.-> RouteStop
    stop_type -.-> RouteStop
    
    CollectionAssignment[Assignment]
    assign_date((date))
    assign_status((status))
    
    assign_date -.-> CollectionAssignment
    assign_status -.-> CollectionAssignment
    
    Driver[Driver]
    driver_id((id))
    driver_name((name))
    driver_location((location))
    
    driver_id -.->|PK| Driver
    driver_name -.-> Driver
    driver_location -.-> Driver
    
    SmartBin[SmartBin]
    bin_number((number))
    bin_priority((priority))
    
    bin_number -.-> SmartBin
    bin_priority -.-> SmartBin
    
    %% COLLECTION & ROUTE RELATIONSHIPS
    optimizes{optimizes}
    follows{follows}
    includes{{includes}}
    visits{visits}
    performs{performs}
    
    CollectionAssignment -->|1:1| optimizes --> CollectionRoute
    Driver -->|N:M| follows --> CollectionRoute
    CollectionRoute -->|1:N| includes --> RouteStop
    RouteStop -->|N:1| visits --> SmartBin
    Driver -->|1:N| performs --> CollectionAssignment
```

## Route Optimization System

```mermaid
graph TB
    %% ROUTE OPTIMIZATION ENTITIES
    CollectionRoute[Route]
    r_id((id))
    r_name((name))
    r_distance((total_km))
    r_duration((est_hours))
    r_efficiency((efficiency_score))
    r_fuel_cost((fuel_estimate))
    
    r_id -.->|PK| CollectionRoute
    r_name -.-> CollectionRoute
    r_distance -.-> CollectionRoute
    r_duration -.-> CollectionRoute
    r_efficiency -.-> CollectionRoute
    r_fuel_cost -.-> CollectionRoute
    
    RouteOptimization[Optimization]
    opt_algorithm((algorithm))
    opt_criteria((criteria))
    opt_savings((time_saved))
    
    opt_algorithm -.-> RouteOptimization
    opt_criteria -.-> RouteOptimization
    opt_savings -.-> RouteOptimization
    
    RouteStop[[RouteStop]]
    rs_sequence((sequence))
    rs_arrival((arrival))
    rs_departure((departure))
    rs_distance((distance_km))
    
    rs_sequence -.-> RouteStop
    rs_arrival -.-> RouteStop
    rs_departure -.-> RouteStop
    rs_distance -.-> RouteStop
    
    TrafficData[Traffic]
    traffic_level((congestion))
    traffic_time((peak_hours))
    
    traffic_level -.-> TrafficData
    traffic_time -.-> TrafficData
    
    %% ROUTE RELATIONSHIPS
    generates{generates}
    contains{{contains}}
    considers{considers}
    navigates{navigates}
    
    RouteOptimization -->|1:N| generates --> CollectionRoute
    CollectionRoute -->|1:N| contains --> RouteStop
    RouteOptimization -->|N:M| considers --> TrafficData
    Driver -->|1:N| navigates --> CollectionRoute
```

## Service Request and Payment Flow

```mermaid
graph TB
    %% SERVICE ENTITIES
    User[User]
    user_id((id))
    user_name((name))
    
    user_id -.->|PK| User
    user_name -.-> User
    
    ServiceRequest[ServiceRequest]
    request_type((type))
    request_date((date))
    request_status((status))
    
    request_type -.-> ServiceRequest
    request_date -.-> ServiceRequest
    request_status -.-> ServiceRequest
    
    ServiceProvider[Provider]
    provider_name((name))
    provider_rating((rating))
    
    provider_name -.-> ServiceProvider
    provider_rating -.-> ServiceProvider
    
    Payment[Payment]
    payment_amount((amount))
    payment_method((method))
    payment_status((status))
    
    payment_amount -.-> Payment
    payment_method -.-> Payment
    payment_status -.-> Payment
    
    Driver[Driver]
    driver_name((name))
    
    driver_name -.-> Driver
    
    %% SERVICE RELATIONSHIPS
    creates{creates}
    assigned_to{assigned_to}
    handles{handles}
    requires{requires}
    employs{employs}
    
    User -->|1:N| creates --> ServiceRequest
    ServiceRequest -->|N:1| assigned_to --> ServiceProvider
    Driver -->|N:M| handles --> ServiceRequest
    ServiceRequest -->|1:1| requires --> Payment
    ServiceProvider -->|1:N| employs --> Driver
```

## System Overview - Highest Level Abstraction

```mermaid
graph LR
    %% SUPER HIGH LEVEL - JUST 5 MAIN ENTITIES
    subgraph "Core System"
        User[User]
        Bin[SmartBin]
        Service[Service]
        Operation[Operations]
        Analytics[Analytics]
    end
    
    %% SIMPLE RELATIONSHIPS
    interacts{interacts}
    monitors{monitors}
    manages{manages}
    analyzes{analyzes}
    
    User --> interacts --> Service
    Service --> manages --> Bin
    Operation --> monitors --> Bin
    Analytics --> analyzes --> Bin
```

## Entity Groupings by Business Domain

```mermaid
graph TB
    subgraph "Customer Interface"
        User[User]
        u_attr((email, phone, type))
        u_attr -.-> User
        
        ServiceRequest[ServiceRequest]
        sr_attr((type, date, status))
        sr_attr -.-> ServiceRequest
        
        Payment[Payment]
        p_attr((amount, method))
        p_attr -.-> Payment
    end
    
    subgraph "IoT Infrastructure"
        SmartBin[SmartBin]
        b_attr((location, fill_level))
        b_attr -.-> SmartBin
        
        Sensor[Sensor]
        s_attr((type, battery))
        s_attr -.-> Sensor
    end
    
    subgraph "Operations Management"
        Driver[Driver]
        d_attr((name, license))
        d_attr -.-> Driver
        
        Vehicle[Vehicle]
        v_attr((registration, capacity))
        v_attr -.-> Vehicle
        
        Zone[Zone]
        z_attr((name, boundary))
        z_attr -.-> Zone
    end
```

## Chen's Notation Legend for High-Level ERD

| Symbol | Meaning | Example |
|--------|---------|---------|
| `[Entity]` | Entity (Rectangle) | `[User]`, `[SmartBin]` |
| `((attribute))` | Attribute (Oval) | `((email))`, `((fill_level))` |
| `{relationship}` | Relationship (Diamond) | `{owns}`, `{monitors}` |
| `[[Weak Entity]]` | Weak Entity (Double Rectangle) | `[[SensorReading]]` |
| `{{relationship}}` | Identifying Relationship (Double Diamond) | `{{produces}}` |
| `-.->` | Attribute Connection | Links attributes to entities |
| `-->` | Relationship Connection | Links entities via relationships |
| `1:N`, `N:M` | Cardinality | One-to-Many, Many-to-Many |
| `PK` | Primary Key | Unique identifier |

## Key Design Principles

1. **High-Level Abstraction**: Only showing main entities and their key attributes
2. **Attribute Grouping**: Attributes shown as ovals around entities for clarity
3. **Simplified Relationships**: Only critical relationships displayed
4. **Domain Separation**: Entities grouped by business function
5. **Chen's Standard**: Following proper Chen's notation conventions

## Main System Components Summary

| Entity | Purpose | Key Attributes |
|--------|---------|----------------|
| **User** | System users (customers, admins) | id, email, phone, type |
| **SmartBin** | IoT-enabled waste bins | id, location, fill_level, status, priority |
| **Sensor** | IoT monitoring devices | type, battery, status |
| **ServiceRequest** | Waste collection requests | type, date, status, cost |
| **Driver** | Collection personnel | name, license, status, rating, location |
| **Vehicle** | Collection trucks | registration, type, capacity |
| **Payment** | Transaction records | amount, method, status |
| **Zone** | Geographic areas | name, area, boundary |
| **Route** | Optimized collection paths | id, distance, duration, efficiency |
| **RouteStop** | Individual stops on route | sequence, arrival_time, bin_id |
| **RouteOptimization** | Route planning engine | algorithm, criteria, time_saved |

## Route Optimization Architecture

```mermaid
graph LR
    subgraph "Input Data"
        BinData[Bin Fill Levels]
        LocationData[GPS Locations]
        TrafficData[Traffic Patterns]
        HistoricalData[Historical Routes]
    end
    
    subgraph "Optimization Engine"
        Algorithm[TSP Algorithm]
        Constraints[Constraints]
        Scoring[Efficiency Scoring]
    end
    
    subgraph "Output"
        OptimizedRoute[Optimized Route]
        EstimatedTime[Time Estimate]
        FuelEstimate[Fuel Estimate]
    end
    
    BinData --> Algorithm
    LocationData --> Algorithm
    TrafficData --> Constraints
    HistoricalData --> Scoring
    Algorithm --> OptimizedRoute
    Constraints --> OptimizedRoute
    Scoring --> EstimatedTime
    OptimizedRoute --> FuelEstimate
```

### Route Optimization Features

1. **Dynamic Route Planning**
   - Real-time route calculation based on bin fill levels
   - Priority-based collection (critical bins first)
   - Multi-vehicle route coordination
   - Time window constraints

2. **Optimization Algorithms**
   - Traveling Salesman Problem (TSP) solver
   - Vehicle Routing Problem (VRP) with capacity constraints
   - Genetic algorithms for large-scale optimization
   - Machine learning for pattern prediction

3. **Constraints & Factors**
   - Vehicle capacity limits
   - Driver working hours
   - Traffic congestion patterns
   - Road restrictions (weight limits, one-way streets)
   - Fuel efficiency optimization
   - Emergency collection priorities

4. **Route Tracking & Monitoring**
   - Real-time GPS tracking
   - Route deviation alerts
   - Performance metrics (actual vs planned)
   - Historical route analysis

## Database Implementation Notes

The high-level ERD translates to approximately 20-25 main tables in PostgreSQL with PostGIS extensions for spatial data. The route optimization system adds:
- `routes` table for planned collection routes
- `route_stops` for individual waypoints
- `route_optimizations` for optimization history
- `traffic_patterns` for traffic data
- Spatial indexes for efficient geographic queries
- Junction tables for many-to-many relationships
- Audit tables for tracking changes