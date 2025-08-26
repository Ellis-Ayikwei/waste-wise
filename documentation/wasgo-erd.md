# Wasgo Entity Relationship Diagram (ERD) - Chen's Notation

## Database Schema Overview
Wasgo uses PostgreSQL with PostGIS extension for geospatial capabilities. The Django backend implements a comprehensive data model for smart waste management operations in Ghana.

## Complete Entity Relationship Diagram - Chen's Notation

```mermaid
graph TB
    %% Entities (Rectangles)
    User[User]
    SmartBin[SmartBin]
    BinType[BinType]
    Sensor[Sensor]
    SensorReading[SensorReading]
    BinAlert[BinAlert]
    ServiceRequest[ServiceRequest]
    Driver[Driver]
    Vehicle[Vehicle]
    ServiceProvider[ServiceProvider]
    Payment[Payment]
    Zone[Zone]
    Notification[Notification]
    CollectionSchedule[CollectionSchedule]
    CollectionAssignment[CollectionAssignment]
    CollectionRecord[CollectionRecord]
    DriverLocation[DriverLocation]

    %% Relationships (Diamonds)
    owns{owns}
    creates{creates}
    makes{makes}
    receives{receives}
    has_type{has_type}
    equipped_with{equipped_with}
    generates{generates}
    produces{produces}
    assigned_to{assigned_to}
    handled_by{handled_by}
    uses{uses}
    requires{requires}
    works_for{works_for}
    tracks_location{tracks_location}
    performs{performs}
    drives{drives}
    employs{employs}
    owns_vehicle{owns}
    services{services}
    located_in{located_in}
    contains{contains}
    has_schedule{has_schedule}
    assigns{assigns}
    includes{includes}
    pays_for{pays_for}
    about_bin{about}
    about_request{about}
    collected_in{collected_in}

    %% Entity Relationships
    User -->|1:N| owns --> SmartBin
    User -->|1:N| creates --> ServiceRequest
    User -->|1:N| makes --> Payment
    User -->|1:N| receives --> Notification
    
    SmartBin -->|N:1| has_type --> BinType
    SmartBin -->|1:1| equipped_with --> Sensor
    SmartBin -->|1:N| generates --> BinAlert
    SmartBin -->|1:N| collected_in --> CollectionRecord
    SmartBin -->|N:1| located_in --> Zone
    
    Sensor -->|1:N| produces --> SensorReading
    
    ServiceRequest -->|N:1| assigned_to --> ServiceProvider
    ServiceRequest -->|N:1| handled_by --> Driver
    ServiceRequest -->|N:1| uses --> Vehicle
    ServiceRequest -->|1:1| requires --> Payment
    
    Driver -->|N:1| works_for --> ServiceProvider
    Driver -->|1:N| tracks_location --> DriverLocation
    Driver -->|1:N| performs --> CollectionAssignment
    Driver -->|N:1| drives --> Vehicle
    
    Vehicle -->|N:1| owns_vehicle --> ServiceProvider
    
    ServiceProvider -->|1:N| employs --> Driver
    ServiceProvider -->|1:N| owns_vehicle --> Vehicle
    ServiceProvider -->|1:N| services --> Zone
    
    Zone -->|1:N| contains --> SmartBin
    Zone -->|1:N| has_schedule --> CollectionSchedule
    Zone -->|1:N| assigns --> CollectionAssignment
    
    CollectionAssignment -->|1:N| includes --> CollectionRecord
    
    Payment -->|N:1| pays_for --> ServiceRequest
    
    Notification -->|N:1| about_bin --> SmartBin
    Notification -->|N:1| about_request --> ServiceRequest
```

## Detailed Chen's Notation ERD with Attributes

### User Management System

```mermaid
graph TB
    %% Entity
    User[User]
    
    %% Attributes (Ovals)
    user_id((user_id))
    email((email))
    phone((phone))
    user_type((user_type))
    first_name((first_name))
    last_name((last_name))
    password_hash((password_hash))
    is_verified((is_verified))
    is_active((is_active))
    profile_image((profile_image))
    address((address))
    city((city))
    postal_code((postal_code))
    created_at((created_at))
    updated_at((updated_at))
    
    %% Primary Key (Underlined)
    user_id -.->|PK| User
    email -.->|UK| User
    phone -.-> User
    user_type -.-> User
    first_name -.-> User
    last_name -.-> User
    password_hash -.-> User
    is_verified -.-> User
    is_active -.-> User
    profile_image -.-> User
    address -.-> User
    city -.-> User
    postal_code -.-> User
    created_at -.-> User
    updated_at -.-> User
    
    %% Relationships
    owns{owns}
    creates{creates}
    makes{makes}
    receives{receives}
    
    User -->|1:N| owns
    User -->|1:N| creates
    User -->|1:N| makes
    User -->|1:N| receives
```

### Smart Bin & IoT System

```mermaid
graph TB
    %% Entities
    SmartBin[SmartBin]
    BinType[BinType]
    Sensor[Sensor]
    SensorReading[SensorReading]
    BinAlert[BinAlert]
    
    %% SmartBin Attributes
    bin_id((bin_id))
    bin_number((bin_number))
    bin_name((name))
    location((location))
    bin_address((address))
    area((area))
    bin_city((city))
    status((status))
    fill_status((fill_status))
    current_fill_level((current_fill_level))
    capacity_kg((capacity_kg))
    current_weight_kg((current_weight_kg))
    last_collected((last_collected))
    next_collection((next_collection))
    qr_code((qr_code))
    
    bin_id -.->|PK| SmartBin
    bin_number -.->|UK| SmartBin
    bin_name -.-> SmartBin
    location -.-> SmartBin
    bin_address -.-> SmartBin
    area -.-> SmartBin
    bin_city -.-> SmartBin
    status -.-> SmartBin
    fill_status -.-> SmartBin
    current_fill_level -.-> SmartBin
    capacity_kg -.-> SmartBin
    current_weight_kg -.-> SmartBin
    last_collected -.-> SmartBin
    next_collection -.-> SmartBin
    qr_code -.->|UK| SmartBin
    
    %% BinType Attributes
    type_id((type_id))
    type_name((name))
    description((description))
    color_code((color_code))
    capacity_liters((capacity_liters))
    icon((icon))
    
    type_id -.->|PK| BinType
    type_name -.->|UK| BinType
    description -.-> BinType
    color_code -.-> BinType
    capacity_liters -.-> BinType
    icon -.-> BinType
    
    %% Sensor Attributes
    sensor_id((sensor_id))
    sensor_code((sensor_code))
    sensor_type((sensor_type))
    manufacturer((manufacturer))
    model((model))
    firmware_version((firmware_version))
    is_active((is_active))
    is_online((is_online))
    battery_level((battery_level))
    signal_strength((signal_strength))
    mqtt_topic((mqtt_topic))
    
    sensor_id -.->|PK| Sensor
    sensor_code -.->|UK| Sensor
    sensor_type -.-> Sensor
    manufacturer -.-> Sensor
    model -.-> Sensor
    firmware_version -.-> Sensor
    is_active -.-> Sensor
    is_online -.-> Sensor
    battery_level -.-> Sensor
    signal_strength -.-> Sensor
    mqtt_topic -.-> Sensor
    
    %% Relationships
    has_type{has_type}
    equipped_with{equipped_with}
    generates{generates}
    produces{produces}
    
    SmartBin -->|N:1| has_type --> BinType
    SmartBin -->|1:1| equipped_with --> Sensor
    SmartBin -->|1:N| generates --> BinAlert
    Sensor -->|1:N| produces --> SensorReading
```

### Service Request System

```mermaid
graph TB
    %% Entity
    ServiceRequest[ServiceRequest]
    
    %% Attributes
    request_id((request_id))
    request_number((request_number))
    service_type((service_type))
    waste_type((waste_type))
    pickup_location((pickup_location))
    pickup_address((pickup_address))
    requested_date((requested_date))
    requested_time_slot((requested_time_slot))
    sr_status((status))
    estimated_weight_kg((estimated_weight_kg))
    actual_weight_kg((actual_weight_kg))
    sr_description((description))
    photos((photos))
    estimated_cost((estimated_cost))
    final_cost((final_cost))
    payment_status((payment_status))
    completed_at((completed_at))
    
    request_id -.->|PK| ServiceRequest
    request_number -.->|UK| ServiceRequest
    service_type -.-> ServiceRequest
    waste_type -.-> ServiceRequest
    pickup_location -.-> ServiceRequest
    pickup_address -.-> ServiceRequest
    requested_date -.-> ServiceRequest
    requested_time_slot -.-> ServiceRequest
    sr_status -.-> ServiceRequest
    estimated_weight_kg -.-> ServiceRequest
    actual_weight_kg -.-> ServiceRequest
    sr_description -.-> ServiceRequest
    photos -.-> ServiceRequest
    estimated_cost -.-> ServiceRequest
    final_cost -.-> ServiceRequest
    payment_status -.-> ServiceRequest
    completed_at -.-> ServiceRequest
    
    %% Relationships
    assigned_to{assigned_to}
    handled_by{handled_by}
    uses{uses}
    requires{requires}
    
    ServiceRequest -->|N:1| assigned_to
    ServiceRequest -->|N:1| handled_by
    ServiceRequest -->|N:1| uses
    ServiceRequest -->|1:1| requires
```

### Driver & Vehicle System

```mermaid
graph TB
    %% Entities
    Driver[Driver]
    Vehicle[Vehicle]
    DriverLocation[DriverLocation]
    
    %% Driver Attributes
    driver_id((driver_id))
    driver_name((name))
    driver_email((email))
    driver_phone((phone))
    license_number((license_number))
    license_expiry((license_expiry))
    employment_type((employment_type))
    is_available((is_available))
    is_on_duty((is_on_duty))
    driver_location((location))
    rating((rating))
    total_trips((total_trips))
    
    driver_id -.->|PK| Driver
    driver_name -.-> Driver
    driver_email -.->|UK| Driver
    driver_phone -.-> Driver
    license_number -.->|UK| Driver
    license_expiry -.-> Driver
    employment_type -.-> Driver
    is_available -.-> Driver
    is_on_duty -.-> Driver
    driver_location -.-> Driver
    rating -.-> Driver
    total_trips -.-> Driver
    
    %% Vehicle Attributes
    vehicle_id((vehicle_id))
    registration((registration))
    make((make))
    v_model((model))
    year((year))
    vehicle_category((vehicle_category))
    fuel_type((fuel_type))
    payload_capacity_kg((payload_capacity_kg))
    load_volume_m3((load_volume_m3))
    has_gps_tracking((has_gps_tracking))
    v_is_active((is_active))
    current_location((current_location))
    odometer_km((odometer_km))
    
    vehicle_id -.->|PK| Vehicle
    registration -.->|UK| Vehicle
    make -.-> Vehicle
    v_model -.-> Vehicle
    year -.-> Vehicle
    vehicle_category -.-> Vehicle
    fuel_type -.-> Vehicle
    payload_capacity_kg -.-> Vehicle
    load_volume_m3 -.-> Vehicle
    has_gps_tracking -.-> Vehicle
    v_is_active -.-> Vehicle
    current_location -.-> Vehicle
    odometer_km -.-> Vehicle
    
    %% Relationships
    works_for{works_for}
    tracks_location{tracks_location}
    drives{drives}
    
    Driver -->|N:1| works_for
    Driver -->|1:N| tracks_location --> DriverLocation
    Driver -->|N:1| drives --> Vehicle
```

### Payment System

```mermaid
graph TB
    %% Entity
    Payment[Payment]
    
    %% Attributes
    payment_id((payment_id))
    transaction_id((transaction_id))
    amount((amount))
    currency((currency))
    payment_method((payment_method))
    p_status((status))
    mobile_money_provider((mobile_money_provider))
    mobile_money_number((mobile_money_number))
    initiated_at((initiated_at))
    completed_at((completed_at))
    reference((reference))
    receipt_url((receipt_url))
    
    payment_id -.->|PK| Payment
    transaction_id -.->|UK| Payment
    amount -.-> Payment
    currency -.-> Payment
    payment_method -.-> Payment
    p_status -.-> Payment
    mobile_money_provider -.-> Payment
    mobile_money_number -.-> Payment
    initiated_at -.-> Payment
    completed_at -.-> Payment
    reference -.-> Payment
    receipt_url -.-> Payment
    
    %% Relationships
    pays_for{pays_for}
    made_by{made_by}
    
    Payment -->|N:1| pays_for
    Payment -->|N:1| made_by
```

## Cardinality and Participation Constraints

### Notation Legend
- **1:1** - One-to-One relationship
- **1:N** - One-to-Many relationship
- **M:N** - Many-to-Many relationship
- **Total Participation** (double line): Entity must participate in relationship
- **Partial Participation** (single line): Entity may or may not participate

### Key Relationships with Cardinality

```mermaid
graph LR
    %% One-to-One
    SmartBin ---|1:1| equipped_with{equipped_with} ---|1:1| Sensor
    ServiceRequest ---|1:1| requires{requires} ---|1:1| Payment
    
    %% One-to-Many
    User ---|1| owns{owns} ---|N| SmartBin
    Sensor ---|1| produces{produces} ---|N| SensorReading
    SmartBin ---|1| generates{generates} ---|N| BinAlert
    Driver ---|1| tracks{tracks_location} ---|N| DriverLocation
    ServiceProvider ---|1| employs{employs} ---|N| Driver
    Zone ---|1| contains{contains} ---|N| SmartBin
    
    %% Many-to-One
    SmartBin ---|N| has_type{has_type} ---|1| BinType
    ServiceRequest ---|N| assigned_to{assigned_to} ---|1| ServiceProvider
    Driver ---|N| works_for{works_for} ---|1| ServiceProvider
    Vehicle ---|N| owned_by{owned_by} ---|1| ServiceProvider
    
    %% Many-to-Many (resolved with junction tables)
    CollectionAssignment ---|M| includes{includes} ---|N| CollectionRecord
```

## Weak Entities

```mermaid
graph TB
    %% Strong Entity
    SmartBin[SmartBin]
    
    %% Weak Entities (double rectangle in Chen's notation)
    SensorReading[[SensorReading]]
    BinAlert[[BinAlert]]
    
    %% Identifying Relationships (double diamond)
    produces{{produces}}
    generates{{generates}}
    
    %% Relationships
    SmartBin -->|1| generates --> |N| BinAlert
    Sensor -->|1| produces --> |N| SensorReading
    
    %% Weak entity attributes
    reading_timestamp((timestamp))
    reading_value((value))
    alert_timestamp((timestamp))
    alert_message((message))
    
    reading_timestamp -.-> SensorReading
    reading_value -.-> SensorReading
    alert_timestamp -.-> BinAlert
    alert_message -.-> BinAlert
```

## Specialization/Generalization Hierarchy

```mermaid
graph TB
    %% Supertype
    User[User]
    
    %% ISA relationship (triangle)
    ISA{ISA}
    
    %% Subtypes
    Customer[Customer]
    Driver[Driver]
    Administrator[Administrator]
    
    %% Hierarchy
    User --> ISA
    ISA --> Customer
    ISA --> Driver
    ISA --> Administrator
    
    %% Specialized attributes
    subscription_plan((subscription_plan))
    license_number((license_number))
    admin_level((admin_level))
    
    subscription_plan -.-> Customer
    license_number -.-> Driver
    admin_level -.-> Administrator
```

## Multi-valued Attributes

```mermaid
graph TB
    %% Entity
    ServiceProvider[ServiceProvider]
    
    %% Single-valued attributes
    provider_id((provider_id))
    company_name((company_name))
    
    %% Multi-valued attributes (double oval)
    service_areas(((service_areas)))
    services_offered(((services_offered)))
    waste_types_handled(((waste_types_handled)))
    
    provider_id -.->|PK| ServiceProvider
    company_name -.-> ServiceProvider
    service_areas -.-> ServiceProvider
    services_offered -.-> ServiceProvider
    waste_types_handled -.-> ServiceProvider
```

## Composite Attributes

```mermaid
graph TB
    %% Entity
    SmartBin[SmartBin]
    
    %% Composite attribute
    location((location))
    
    %% Component attributes
    latitude((latitude))
    longitude((longitude))
    altitude((altitude))
    
    location -.-> SmartBin
    latitude -.-> location
    longitude -.-> location
    altitude -.-> location
    
    %% Another composite attribute
    address_comp((address))
    street((street))
    area_comp((area))
    city_comp((city))
    postal((postal_code))
    
    address_comp -.-> SmartBin
    street -.-> address_comp
    area_comp -.-> address_comp
    city_comp -.-> address_comp
    postal -.-> address_comp
```

## Derived Attributes

```mermaid
graph TB
    %% Entity
    SmartBin[SmartBin]
    
    %% Regular attributes
    capacity_kg((capacity_kg))
    current_weight_kg((current_weight_kg))
    
    %% Derived attribute (dashed oval)
    fill_percentage((fill_percentage))
    
    capacity_kg -.-> SmartBin
    current_weight_kg -.-> SmartBin
    fill_percentage -.->|derived| SmartBin
    
    %% Formula notation
    Note[fill_percentage = current_weight_kg / capacity_kg * 100]
```

## Complete Chen's ERD Legend

| Symbol | Meaning |
|--------|---------|
| Rectangle `[ ]` | Entity |
| Double Rectangle `[[ ]]` | Weak Entity |
| Diamond `{ }` | Relationship |
| Double Diamond `{{ }}` | Identifying Relationship |
| Oval `( )` | Attribute |
| Double Oval `(( ))` | Multi-valued Attribute |
| Dashed Oval | Derived Attribute |
| Underlined Attribute | Primary Key |
| Triangle | ISA (Generalization) |
| Lines | Participation |
| Double Lines | Total Participation |
| 1, N, M | Cardinality |

## Key Constraints in Chen's Notation

1. **Participation Constraints**
   - Total: Every SmartBin MUST have a BinType
   - Partial: A User MAY own SmartBins

2. **Cardinality Constraints**
   - (1,1): A SmartBin has exactly one Sensor
   - (0,N): A User can create zero or many ServiceRequests
   - (1,N): A Sensor produces at least one SensorReading

3. **Key Constraints**
   - Primary Key: Uniquely identifies entity instances
   - Foreign Key: References another entity
   - Unique Key: Alternative key constraint

## Database Implementation Notes

### PostgreSQL with PostGIS Implementation
```sql
-- Entity tables based on Chen's notation
CREATE TABLE users (
    user_id UUID PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    user_type VARCHAR(20) CHECK (user_type IN ('customer', 'driver', 'admin', 'provider')),
    -- other attributes
);

CREATE TABLE smart_bins (
    bin_id UUID PRIMARY KEY,
    bin_number VARCHAR(50) UNIQUE NOT NULL,
    bin_type_id INTEGER REFERENCES bin_types(type_id),
    user_id UUID REFERENCES users(user_id),
    location GEOMETRY(Point, 4326),
    -- other attributes
);

-- Relationship tables for M:N relationships
CREATE TABLE collection_assignments_bins (
    assignment_id UUID REFERENCES collection_assignments(assignment_id),
    bin_id UUID REFERENCES smart_bins(bin_id),
    PRIMARY KEY (assignment_id, bin_id)
);

-- Weak entity with composite key
CREATE TABLE sensor_readings (
    sensor_id UUID REFERENCES sensors(sensor_id),
    timestamp TIMESTAMP,
    fill_level INTEGER,
    -- other attributes
    PRIMARY KEY (sensor_id, timestamp)
);
```