# Waste Management System - Wasgo Backend

This document describes the waste management system architecture and how the different apps work together to provide a comprehensive waste collection and management solution.

## System Overview

The waste management system consists of two main standalone apps:

1. **WasteBin** - IoT-enabled smart waste bin management
2. **WasteProvider** - Uber-style waste collection provider system

These apps are supported by enhanced versions of existing apps that have been updated with waste management capabilities.

## Architecture

### Core Apps

#### 1. WasteBin App (`apps/WasteBin/`)
**Purpose**: Manages IoT-enabled smart waste bins with real-time monitoring and analytics.

**Key Features**:
- Smart bin registration and management
- Real-time sensor data collection (fill level, temperature, humidity)
- GPS tracking and location management
- Automated alerts and notifications
- Collection route optimization
- Waste analytics and reporting
- Citizen reporting system

**Models**:
- `SmartBin` - IoT-enabled waste bins
- `BinType` - Different types of waste bins
- `SensorReading` - Real-time sensor data
- `BinAlert` - Automated alerts
- `CollectionRoute` - Optimized collection routes
- `WasteAnalytics` - Analytics and reporting

#### 2. WasteProvider App (`apps/WasteProvider/`)
**Purpose**: Manages waste collection providers and facilitates waste collection requests.

**Key Features**:
- Provider registration and verification
- Waste category management
- Real-time provider matching
- Pickup request management
- Job offers and bidding system
- Provider earnings tracking
- Rating and review system

**Models**:
- `WasteProvider` - Waste collection providers
- `WasteCategory` - Types of waste handled
- `PickupRequest` - Waste collection requests
- `JobOffer` - Provider job offers
- `ProviderEarnings` - Earnings tracking
- `ProviderRating` - Rating system

### Enhanced Apps

#### 3. Location App (`apps/Location/`)
**Enhanced with**:
- GIS capabilities (PointField, PolygonField)
- Waste collection specific fields
- Service area management
- Location type classification

**New Features**:
- GPS coordinate management
- Waste collection scheduling
- Vehicle access information
- Waste volume estimation

#### 4. Vehicle App (`apps/Vehicle/`)
**Enhanced with**:
- Waste collection vehicle types
- GIS location tracking
- Waste collection specific equipment
- Maintenance tracking

**New Features**:
- Waste collection methods
- Compaction system tracking
- Bin capacity management
- Waste load monitoring

#### 5. Provider App (`apps/Provider/`)
**Enhanced with**:
- Waste collection business types
- Waste management licenses
- Environmental permits
- Collection capabilities

**New Features**:
- Waste type handling
- Collection methods
- Service availability
- Waste collection statistics

### Shared Utilities

#### Waste Management Utilities (`utils/waste_management.py`)
Provides common functionality used across all waste management apps:

- `WasteTypeManager` - Waste type definitions and management
- `LocationUtils` - Location-based calculations and route optimization
- `WasteCollectionUtils` - Collection cost and time calculations
- `BinStatusUtils` - Bin status management and collection frequency
- `ProviderMatchingUtils` - Provider matching and scoring algorithms

## Installation and Setup

### Prerequisites

1. **PostgreSQL with PostGIS extension**
2. **GDAL libraries** (for geospatial operations)
3. **Redis** (for real-time communication and caching)

### Installation Steps

1. **Install system dependencies**:
   ```bash
   # Ubuntu/Debian
   sudo apt-get install postgresql postgresql-contrib postgis gdal-bin libgdal-dev
   
   # Windows
   # Download and install OSGeo4W which includes GDAL
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements_waste_management.txt
   ```

3. **Configure database**:
   ```sql
   -- Enable PostGIS extension
   CREATE EXTENSION postgis;
   ```

4. **Run migrations**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

5. **Create superuser**:
   ```bash
   python manage.py createsuperuser
   ```

## Configuration

### Environment Variables

Add these to your `.env` file:

```env
# Database
DATABASE_URL=postgis://user:password@localhost:5432/wasgo_db

# Redis (for real-time features)
REDIS_URL=redis://localhost:6379/0

# GIS Settings
GDAL_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgdal.so
GEOS_LIBRARY_PATH=/usr/lib/x86_64-linux-gnu/libgeos_c.so

# Waste Management Settings
WASTE_COLLECTION_RADIUS_KM=50
DEFAULT_COLLECTION_FREQUENCY_DAYS=7
EMERGENCY_RESPONSE_TIME_MINUTES=30
```

### Django Settings

The following apps are automatically configured:

```python
INSTALLED_APPS = [
    # ... other apps ...
    "django.contrib.gis",  # Django GIS support
    "rest_framework_gis",  # GIS support for DRF
    "apps.WasteBin",
    "apps.WasteProvider",
    # ... other apps ...
]
```

## API Endpoints

### WasteBin API

- `GET /api/waste-bin/bins/` - List all smart bins
- `POST /api/waste-bin/bins/` - Register new smart bin
- `GET /api/waste-bin/bins/{id}/` - Get bin details
- `PUT /api/waste-bin/bins/{id}/` - Update bin information
- `GET /api/waste-bin/sensor-data/` - Get sensor readings
- `POST /api/waste-bin/sensor-data/` - Submit sensor data
- `GET /api/waste-bin/alerts/` - Get bin alerts
- `GET /api/waste-bin/routes/` - Get collection routes
- `GET /api/waste-bin/analytics/` - Get waste analytics

### WasteProvider API

- `GET /api/waste-provider/providers/` - List all providers
- `POST /api/waste-provider/providers/` - Register new provider
- `GET /api/waste-provider/providers/{id}/` - Get provider details
- `PUT /api/waste-provider/providers/{id}/` - Update provider
- `GET /api/waste-provider/pickup-requests/` - List pickup requests
- `POST /api/waste-provider/pickup-requests/` - Create pickup request
- `GET /api/waste-provider/job-offers/` - List job offers
- `POST /api/waste-provider/job-offers/` - Create job offer

## Usage Examples

### Registering a Smart Bin

```python
from apps.WasteBin.models import SmartBin, BinType
from django.contrib.gis.geos import Point

# Create bin type
bin_type = BinType.objects.create(
    name="general",
    description="General waste collection",
    color_code="#666666",
    capacity_liters=240
)

# Create smart bin
bin_location = Point(-0.1869644, 5.6037168)  # Accra coordinates
smart_bin = SmartBin.objects.create(
    bin_id="BIN001",
    name="Accra Central Market Bin",
    bin_type=bin_type,
    location=bin_location,
    address="Accra Central Market, Accra",
    sensor_id="SENSOR001",
    fill_level=45
)
```

### Creating a Waste Provider

```python
from apps.WasteProvider.models import WasteProvider, WasteCategory
from django.contrib.gis.geos import Point

# Create waste category
category = WasteCategory.objects.create(
    code="general",
    name="General Trash Collection",
    base_price_per_kg=0.50
)

# Create provider
provider_location = Point(-0.1869644, 5.6037168)
provider = WasteProvider.objects.create(
    user=user,
    provider_type="company",
    company_name="Green Waste Solutions",
    phone="+233201234567",
    email="info@greenwaste.com",
    address="123 Waste Street, Accra",
    base_location=provider_location,
    waste_license_number="WL123456"
)
provider.waste_categories.add(category)
```

### Finding Nearby Providers

```python
from utils.waste_management import ProviderMatchingUtils
from apps.WasteProvider.models import WasteProvider

# Find providers within 10km of a location
location_point = Point(-0.1869644, 5.6037168)
nearby_providers = ProviderMatchingUtils.find_nearby_providers(
    location_point, 
    10, 
    WasteProvider.objects.filter(is_active=True)
)

# Rank providers by suitability
ranked_providers = ProviderMatchingUtils.rank_providers(
    nearby_providers,
    location_point,
    "general",
    urgency="normal"
)
```

## Real-time Features

### WebSocket Connections

The system uses Django Channels for real-time communication:

- **Bin Status Updates**: Real-time bin fill level updates
- **Provider Location Tracking**: Live provider location updates
- **Collection Alerts**: Instant notifications for collection events
- **Route Optimization**: Real-time route updates

### IoT Integration

Smart bins can send data via:

1. **REST API**: Direct HTTP requests
2. **WebSocket**: Real-time data streaming
3. **MQTT**: IoT protocol support (configurable)

## Analytics and Reporting

### Waste Analytics

The system provides comprehensive analytics:

- **Collection Efficiency**: Track collection performance
- **Waste Volume Trends**: Historical waste volume data
- **Route Optimization**: Analyze and optimize collection routes
- **Provider Performance**: Track provider efficiency and ratings

### Reports Available

- Daily/Weekly/Monthly collection reports
- Provider performance reports
- Route efficiency analysis
- Waste type distribution
- Environmental impact metrics

## Security and Compliance

### Data Protection

- All location data is encrypted
- Personal information is anonymized where possible
- GDPR compliance measures implemented

### Waste Management Compliance

- License verification system
- Environmental permit tracking
- Hazardous waste handling protocols
- Audit trail for all waste movements

## Testing

### Running Tests

```bash
# Run all tests
python manage.py test

# Run specific app tests
python manage.py test apps.WasteBin
python manage.py test apps.WasteProvider

# Run with coverage
coverage run --source='.' manage.py test
coverage report
```

### Test Data

Use the management commands to populate test data:

```bash
python manage.py populate_wastebins
python manage.py populate_waste_providers
```

## Deployment

### Production Checklist

- [ ] Configure production database with PostGIS
- [ ] Set up Redis for real-time features
- [ ] Configure GDAL libraries
- [ ] Set up monitoring and logging
- [ ] Configure backup strategy
- [ ] Set up SSL certificates
- [ ] Configure load balancing
- [ ] Set up CI/CD pipeline

### Docker Deployment

```dockerfile
# Example Dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    postgresql-client \
    gdal-bin \
    libgdal-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements_waste_management.txt .
RUN pip install -r requirements_waste_management.txt

# Copy application code
COPY . /app
WORKDIR /app

# Run migrations and start server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]
```

## Support and Maintenance

### Monitoring

- **Health Checks**: Regular system health monitoring
- **Performance Metrics**: Track API response times
- **Error Tracking**: Monitor and alert on errors
- **Usage Analytics**: Track system usage patterns

### Maintenance Tasks

- **Database Optimization**: Regular database maintenance
- **Cache Management**: Redis cache optimization
- **Log Rotation**: Manage log files
- **Backup Verification**: Ensure backups are working

## Contributing

### Development Guidelines

1. Follow PEP 8 coding standards
2. Write comprehensive tests
3. Update documentation
4. Use type hints where appropriate
5. Follow Git flow branching strategy

### Code Review Process

1. Create feature branch
2. Write tests
3. Submit pull request
4. Code review
5. Merge to develop
6. Deploy to staging
7. Deploy to production

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

For support and questions:
- Email: support@wasgo.com
- Documentation: https://docs.wasgo.com
- Issues: https://github.com/wasgo/backend/issues
