# ServiceRequest Migration Guide

## Overview

This guide documents the migration from separate `Request` and `Job` models to a unified `ServiceRequest` model. This consolidation eliminates data duplication, simplifies the architecture, and provides a single source of truth for service lifecycle management.

## What Changed

### Before (Separate Models)
- **Request Model**: Handled customer service requests
- **Job Model**: Handled work execution and provider management
- **OneToOne Relationship**: Request → Job
- **Data Duplication**: Many fields duplicated between models
- **Complex Synchronization**: Status and data had to be kept in sync

### After (Unified Model)
- **ServiceRequest Model**: Single comprehensive model for entire service lifecycle
- **No Relationships**: All data in one place
- **No Duplication**: Single source of truth
- **Simplified Architecture**: Easier to maintain and extend

## New ServiceRequest Model

### Key Features
- **Unified Status Flow**: `draft → pending → offered → accepted → assigned → en_route → arrived → in_progress → completed`
- **Provider Management**: Direct assignment and offer system
- **Timeline Tracking**: Complete audit trail of service events
- **Waste Management**: Specialized fields for waste collection services
- **Environmental Impact**: CO2 emissions and recycling tracking
- **Service Verification**: Photo proof and verification system

### Field Mapping

| Old Request Field | Old Job Field | New ServiceRequest Field |
|------------------|---------------|-------------------------|
| `request_id` | `job_number` | `request_id` |
| `request_type` | `job_type` | `service_type` |
| `user` | - | `user` |
| `provider` | `assigned_provider` | `assigned_provider` |
| `driver` | - | `driver` |
| `status` | `status` | `status` (unified) |
| `estimated_price` | `price` | `estimated_price` |
| `final_price` | - | `final_price` |
| - | `offered_provider` | `offered_provider` |
| - | `offered_price` | `offered_price` |
| - | `is_instant` | `is_instant` |

## Migration Steps

### 1. Database Migration

```bash
# Create and run migrations for the new ServiceRequest app
python manage.py makemigrations ServiceRequest
python manage.py migrate ServiceRequest

# Run the data migration command
python manage.py migrate_request_job_data --dry-run  # Test first
python manage.py migrate_request_job_data  # Actual migration
```

### 2. Code Updates

The `update_references.py` script will automatically update most references:

```bash
python update_references.py
```

### 3. Manual Updates Required

Some updates may need to be done manually:

#### URL Patterns
```python
# Old
path('requests/', include('apps.Request.urls')),
path('jobs/', include('apps.Job.urls')),

# New
path('service-requests/', include('apps.ServiceRequest.urls')),
```

#### API Endpoints
```python
# Old
GET /api/requests/
POST /api/jobs/

# New
GET /api/service-requests/
POST /api/service-requests/
```

#### Serializer Usage
```python
# Old
from apps.Request.serializer import RequestSerializer
from apps.Job.serializers import JobSerializer

# New
from apps.ServiceRequest.serializers import ServiceRequestSerializer
```

### 4. Testing

After migration, test the following:

1. **API Endpoints**: Verify all endpoints work correctly
2. **Data Integrity**: Check that all data migrated properly
3. **Business Logic**: Test service creation, assignment, and completion
4. **Timeline Events**: Verify timeline tracking works
5. **Provider Management**: Test offer and assignment functionality

## New API Endpoints

### Service Requests
- `GET /api/service-requests/` - List all service requests
- `POST /api/service-requests/` - Create new service request
- `GET /api/service-requests/{id}/` - Get service request details
- `PUT /api/service-requests/{id}/` - Update service request
- `DELETE /api/service-requests/{id}/` - Delete service request

### Service Request Actions
- `POST /api/service-requests/{id}/submit/` - Submit draft request
- `POST /api/service-requests/{id}/offer_to_provider/` - Offer to provider
- `POST /api/service-requests/{id}/accept_offer/` - Accept offer
- `POST /api/service-requests/{id}/reject_offer/` - Reject offer
- `POST /api/service-requests/{id}/assign_provider/` - Assign provider
- `POST /api/service-requests/{id}/start_service/` - Start service
- `POST /api/service-requests/{id}/complete_service/` - Complete service
- `POST /api/service-requests/{id}/cancel_service/` - Cancel service
- `GET /api/service-requests/{id}/timeline/` - Get timeline events
- `GET /api/service-requests/{id}/suitable_providers/` - Find suitable providers
- `POST /api/service-requests/{id}/auto_assign/` - Auto-assign provider

### Citizen Reports
- `GET /api/citizen-reports/` - List all citizen reports
- `POST /api/citizen-reports/` - Create new citizen report
- `GET /api/citizen-reports/{id}/` - Get citizen report details
- `PUT /api/citizen-reports/{id}/` - Update citizen report
- `POST /api/citizen-reports/{id}/assign_to_user/` - Assign to user
- `POST /api/citizen-reports/{id}/mark_resolved/` - Mark as resolved
- `POST /api/citizen-reports/{id}/schedule_follow_up/` - Schedule follow-up

## Status Flow

### Service Request Statuses
1. **draft** - Initial draft state
2. **pending** - Submitted and waiting for provider
3. **offered** - Offered to specific provider
4. **accepted** - Provider accepted the offer
5. **assigned** - Provider assigned (direct assignment)
6. **en_route** - Provider en route to location
7. **arrived** - Provider arrived at location
8. **in_progress** - Service in progress
9. **completed** - Service completed
10. **cancelled** - Service cancelled
11. **failed** - Service failed

### Status Transitions
```
draft → pending → offered → accepted → assigned → en_route → arrived → in_progress → completed
  ↓       ↓         ↓         ↓         ↓         ↓         ↓         ↓           ↓
cancelled ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ← ←
```

## Provider Management

### Offer System
1. **Create Offer**: System creates offer for specific provider
2. **Provider Response**: Provider accepts/rejects offer
3. **Auto-Assignment**: System can auto-assign best available provider

### Direct Assignment
- Admin or system can directly assign provider
- Bypasses offer system for urgent requests

## Timeline Events

Every significant action creates a timeline event:
- Service request creation
- Provider assignment
- Status changes
- Service completion
- Cancellations

## Environmental Impact Tracking

For waste collection services:
- **CO2 Emissions**: Track carbon footprint
- **Recycling Rate**: Percentage of waste recycled
- **Environmental Score**: Overall environmental impact score

## Service Verification

- **Collection Photos**: Photos taken during service
- **Verification Photos**: Photos for verification purposes
- **Collection Notes**: Notes from service provider
- **Verification Status**: Whether service has been verified

## Rollback Plan

If issues arise during migration:

1. **Database Rollback**:
   ```bash
   # Restore from backup
   python manage.py migrate ServiceRequest zero
   # Restore Request and Job tables from backup
   ```

2. **Code Rollback**:
   ```bash
   # Restore .backup files
   find . -name "*.py.backup" -exec sh -c 'cp "$1" "${1%.backup}"' _ {} \;
   ```

3. **URL Rollback**:
   - Restore original URL patterns
   - Update imports back to Request/Job

## Post-Migration Tasks

1. **Update Documentation**: Update API documentation
2. **Update Frontend**: Update frontend to use new endpoints
3. **Update Tests**: Update test suites for new model
4. **Performance Monitoring**: Monitor performance with new unified model
5. **Cleanup**: Remove old Request and Job apps after verification

## Benefits of Migration

1. **Simplified Architecture**: Single model to maintain
2. **Eliminated Duplication**: No more data synchronization issues
3. **Better Performance**: Fewer database queries
4. **Easier Development**: Simpler codebase to work with
5. **Improved Data Integrity**: Single source of truth
6. **Enhanced Features**: Timeline tracking, environmental impact, etc.

## Support

For issues during migration:
1. Check the migration logs
2. Review the backup files
3. Test with `--dry-run` flag first
4. Contact the development team

## Future Enhancements

With the unified model, future enhancements become easier:
- Advanced analytics
- Machine learning for provider matching
- Real-time tracking improvements
- Enhanced reporting capabilities
- Integration with external systems
