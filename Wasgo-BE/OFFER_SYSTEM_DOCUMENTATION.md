# Automatic Offer System Documentation

## Overview

The automatic offer system creates and manages offers for service requests based on provider proximity, ratings, and availability. The system automatically finds providers within a specified radius and creates offers with calculated pricing.

## Key Features

### 1. Automatic Offer Creation
- **Trigger**: When a service request is created with a pickup location
- **Radius**: 50m for normal priority, 100m for high priority jobs
- **Provider Selection**: Based on distance, rating, completion rate, and availability

### 2. Priority-Based Assignment
- **High Priority Jobs**: Direct assignment to the best provider
- **Normal Priority Jobs**: Multiple offers sent to top 5 providers
- **Urgent Jobs**: 2-hour offer expiry, others have 24-hour expiry

### 3. Smart Pricing Calculation
- **Base Price**: From service request estimated price
- **Distance Factor**: Closer providers get slightly lower prices
- **Rating Factor**: Higher-rated providers get slightly higher prices
- **Priority Factor**: Urgent jobs get 20% premium, high priority gets 10%

## System Components

### 1. OfferService (`apps/ServiceRequest/offer_service.py`)
Main service class that handles:
- Finding eligible providers within radius
- Calculating provider scores
- Creating offers with calculated pricing
- Managing offer expiry

### 2. Signal Handlers (`apps/ServiceRequest/signals.py`)
- `handle_service_request_creation`: Triggers offer creation on new requests
- `handle_service_request_pre_save`: Handles status changes
- Timeline event creation for tracking

### 3. Location Management (`apps/Provider/location_service.py`)
- Provider location updates
- Distance calculations
- Nearby provider searches

### 4. API Endpoints (`apps/Provider/location_views.py`)
- `POST /providers/location/update/`: Update provider location
- `GET /providers/location/availability/`: Get provider availability
- `GET /providers/location/nearby-requests/`: Get nearby service requests

## Provider Scoring Algorithm

The system calculates a composite score for each provider:

```python
score = 0
score += min(rating * 10, 50)  # Rating component (0-50 points)
score += max(0, 30 - (distance / max_distance) * 30)  # Distance (0-30 points)
score += completion_rate * 20  # Completion rate (0-20 points)
score += max(0, 15 - (avg_response_time / 60) * 15)  # Response time (0-15 points)
score += 5 if is_available else 0  # Availability bonus (5 points)
score += 10 if verification_status == 'verified' else 0  # Verification bonus (10 points)
score += 5 if service_type_match else 0  # Service type match (5 points)
```

## Configuration

### Search Radius
- **Normal Priority**: 50 meters
- **High Priority**: 100 meters
- **Urgent Priority**: 100 meters

### Offer Expiry
- **Normal/High Priority**: 24 hours
- **Urgent Priority**: 2 hours

### Provider Selection
- **Normal Priority**: Top 5 providers
- **High Priority**: Best provider only (direct assignment)

## Database Fields Added

### ServiceProvider Model
- `current_location`: PointField for real-time location
- `last_location_update`: DateTimeField for tracking updates
- `location_accuracy`: FloatField for location accuracy

## API Usage

### Update Provider Location
```bash
POST /wasgo/api/v1/providers/location/update/
{
    "latitude": 5.6221003,
    "longitude": -0.1733501,
    "accuracy": 10.5
}
```

### Get Provider Availability
```bash
GET /wasgo/api/v1/providers/location/availability/
```

### Get Nearby Requests
```bash
GET /wasgo/api/v1/providers/location/nearby-requests/?radius=100
```

## Management Commands

### Process Expired Offers
```bash
python manage.py process_offers
```

### Dry Run (Test Mode)
```bash
python manage.py process_offers --dry-run
```

## Workflow

1. **Service Request Created**
   - Signal triggers offer creation
   - System finds providers within radius
   - Calculates scores and sorts providers

2. **High Priority Jobs**
   - Direct assignment to best provider
   - Shorter offer expiry (2 hours)
   - Immediate notification sent

3. **Normal Priority Jobs**
   - Offers sent to top 5 providers
   - 24-hour expiry
   - Notifications sent to all providers

4. **Offer Response**
   - Provider accepts/rejects offer
   - System updates request status
   - Other offers cancelled if accepted

5. **Expired Offers**
   - Management command processes expired offers
   - New offers created for unassigned requests
   - Timeline events created for tracking

## Monitoring and Logging

The system includes comprehensive logging:
- Offer creation success/failure
- Provider selection process
- Distance calculations
- Pricing calculations
- Timeline events for audit trail

## Future Enhancements

1. **Machine Learning Integration**
   - Predict optimal pricing based on historical data
   - Improve provider selection algorithms

2. **Real-time Updates**
   - WebSocket notifications for offer updates
   - Live location tracking

3. **Advanced Optimization**
   - Route optimization for multiple requests
   - Dynamic pricing based on demand

4. **Analytics Dashboard**
   - Provider performance metrics
   - Offer acceptance rates
   - Distance vs. pricing analysis

## Troubleshooting

### Common Issues

1. **No Providers Found**
   - Check provider locations are set
   - Verify search radius settings
   - Ensure providers are active and available

2. **Offers Not Created**
   - Check service request has pickup location
   - Verify signal handlers are loaded
   - Check logs for errors

3. **Location Updates Failing**
   - Verify coordinate ranges (-90 to 90 for latitude, -180 to 180 for longitude)
   - Check provider exists and is authenticated
   - Verify database migration was applied

### Debug Commands

```bash
# Check provider locations
python manage.py shell
>>> from apps.Provider.models import ServiceProvider
>>> providers = ServiceProvider.objects.filter(current_location__isnull=False)
>>> for p in providers:
...     print(f"{p.business_name}: {p.current_location}")

# Check service requests without offers
>>> from apps.ServiceRequest.models import ServiceRequest
>>> requests = ServiceRequest.objects.filter(status='pending', pickup_location__isnull=False)
>>> print(f"Pending requests: {requests.count()}")
```

