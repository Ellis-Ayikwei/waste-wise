# Smart Bin Online Status Guide

## Overview

The SmartBin model now automatically checks and updates its online status whenever it's accessed. This ensures that the online status is always accurate based on the current sensor conditions.

## How Online Status Works

### Online Status Criteria
A bin is considered **online** when:
- The bin has an assigned sensor
- The sensor is active (`is_active = True`)
- The sensor has good signal strength (`signal_strength > 30`)

### Automatic Updates
The online status is automatically checked and updated in the following scenarios:

1. **When a bin is saved** - The `save()` method calls `check_and_set_online()`
2. **When bins are listed** - The `get_queryset()` method updates online status for all bins
3. **When accessing bin data** - The `current_online_status` property provides real-time status

## Implementation Details

### Model Changes

#### SmartBin Model (`apps/WasteBin/models.py`)
```python
def check_and_set_online(self):
    """Set sensor as online if sensor is active"""
    if self.sensor and self.sensor.is_active and self.sensor.signal_strength > 30:
        self.is_online = True
        self.save()
    else:
        self.is_online = False
        self.save()

def save(self, *args, **kwargs):
    """Override save to always check online status"""
    if self.sensor:
        self.check_and_set_online()
    super().save(*args, **kwargs)

@property
def current_online_status(self):
    """Get current online status by checking sensor conditions"""
    if not self.sensor:
        return False
    return self.sensor.is_active and self.sensor.signal_strength > 30
```

### Serializer Changes

All SmartBin serializers now include the `is_online` field:
- `SmartBinSerializer`
- `SmartBinListSerializer` (GeoJSON)
- `SmartBinListJSONSerializer` (Regular JSON)

The `is_online` field uses the `current_online_status` property for real-time accuracy.

### View Changes

#### SmartBinViewSet (`apps/WasteBin/views.py`)
```python
def get_queryset(self):
    # ... existing filtering logic ...
    
    # Update online status for all bins in queryset
    queryset = queryset.select_related("bin_type", "sensor", "user")
    
    # Check and update online status for each bin
    for bin in queryset:
        bin.check_and_set_online()
    
    return queryset
```

## API Endpoints

### Get Bin List with Online Status
```bash
# GeoJSON format (default)
GET /wasgo/api/v1/waste/bins/

# Regular JSON format
GET /wasgo/api/v1/waste/bins/?format=json
```

**Response includes:**
```json
{
    "is_online": true,
    "battery_level": 85,
    "signal_strength": 92,
    // ... other bin data
}
```

### Manual Online Status Update
```bash
POST /wasgo/api/v1/waste/bins/update_online_status/
```

**Response:**
```json
{
    "message": "Updated online status for 3 bins",
    "total_bins": 10,
    "updated_count": 3
}
```

## Management Commands

### Update Online Status for All Bins
```bash
# Check what would be updated (dry run)
python manage.py update_bin_online_status --dry-run

# Actually update the online status
python manage.py update_bin_online_status
```

**Output:**
```
Checking online status for all smart bins...
Updated bin BIN001: False -> True
Updated bin BIN003: True -> False

==================================================
SUMMARY:
Total bins: 10
Online bins: 7
Offline bins: 3
Updated: 2 bins
==================================================
Online status update completed!
```

## Usage Examples

### Frontend Integration

#### JavaScript - Check Online Status
```javascript
fetch('/wasgo/api/v1/waste/bins/')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const bin = feature.properties;
      const statusClass = bin.is_online ? 'online' : 'offline';
      const statusText = bin.is_online ? 'Online' : 'Offline';
      
      console.log(`Bin ${bin.bin_id}: ${statusText}`);
    });
  });
```

#### Python - Update Online Status
```python
import requests

# Update online status for all bins
response = requests.post('http://localhost:8000/wasgo/api/v1/waste/bins/update_online_status/')
data = response.json()
print(f"Updated {data['updated_count']} out of {data['total_bins']} bins")
```

### Filtering by Online Status
```bash
# Get only online bins
GET /wasgo/api/v1/waste/bins/?status=active

# Get bins needing maintenance (includes offline status)
GET /wasgo/api/v1/waste/bins/?needs_maintenance=true
```

## Benefits

1. **Real-time Accuracy**: Online status is always current
2. **Automatic Updates**: No manual intervention required
3. **Consistent Data**: All API responses include accurate online status
4. **Performance**: Updates happen efficiently during normal operations
5. **Monitoring**: Easy to track which bins are online/offline

## Troubleshooting

### Bin Shows Offline When It Should Be Online
1. Check if the bin has an assigned sensor
2. Verify the sensor's `is_active` status
3. Check the sensor's `signal_strength` (should be > 30)
4. Run the management command to force update

### Performance Issues
- The online status check is lightweight
- Only runs when bins are accessed
- Can be disabled by removing the check from `get_queryset()` if needed

### Manual Override
If you need to manually set online status:
```python
bin = SmartBin.objects.get(bin_id="BIN001")
bin.is_online = True  # or False
bin.save()  # This will trigger the online status check
```

## Future Enhancements

1. **Scheduled Updates**: Cron job to update online status periodically
2. **Notification System**: Alert when bins go offline
3. **Historical Tracking**: Log online/offline status changes
4. **Advanced Criteria**: More sophisticated online status rules
