# Bin Data Format Guide

## Overview

The WasteBin API supports two different data formats for listing bins:

1. **GeoJSON Format** (default) - Optimized for mapping applications
2. **Regular JSON Format** - Simplified format for general applications

## Why GeoJSON Format?

The bin list data is returned in GeoJSON format by default because:

- **Mapping Integration**: GeoJSON is the standard format for geographic data in mapping libraries (Leaflet, Mapbox, Google Maps, etc.)
- **Spatial Queries**: Enables efficient spatial operations and distance calculations
- **GIS Compatibility**: Works seamlessly with Geographic Information Systems
- **Industry Standard**: Widely adopted format for location-based data

## Available Formats

### 1. GeoJSON Format (Default)
**Endpoint**: `GET /wasgo/api/v1/waste/bins/`

**Response Structure**:
```json
{
    "type": "FeatureCollection",
    "features": [
        {
            "id": "bin-uuid",
            "type": "Feature",
            "geometry": {
                "type": "Point",
                "coordinates": [longitude, latitude]
            },
            "properties": {
                "bin_id": "BIN001",
                "name": "Bin Name",
                "address": "Bin Address",
                "fill_level": 75,
                "status": "active",
                // ... other properties
            }
        }
    ]
}
```

### 2. Regular JSON Format
**Endpoint**: `GET /wasgo/api/v1/waste/bins/?format=json`

**Response Structure**:
```json
[
    {
        "id": "bin-uuid",
        "bin_id": "BIN001",
        "name": "Bin Name",
        "latitude": 5.65294,
        "longitude": -0.17968,
        "address": "Bin Address",
        "fill_level": 75,
        "status": "active",
        // ... other properties
    }
]
```

## Format Comparison

| Aspect | GeoJSON | Regular JSON |
|--------|---------|--------------|
| **Structure** | Complex (FeatureCollection) | Simple (Array) |
| **Mapping** | ✅ Native support | ⚠️ Requires conversion |
| **Data Access** | `bin.properties.field` | `bin.field` |
| **Coordinates** | `geometry.coordinates` | `latitude`/`longitude` |
| **File Size** | Larger | Smaller |
| **Parsing** | More complex | Simpler |

## Usage Examples

### Frontend JavaScript

#### GeoJSON Format (for maps):
```javascript
// Using Leaflet.js
fetch('/wasgo/api/v1/waste/bins/')
  .then(response => response.json())
  .then(data => {
    data.features.forEach(feature => {
      const [lng, lat] = feature.geometry.coordinates;
      const properties = feature.properties;
      
      L.marker([lat, lng])
        .bindPopup(`Bin ${properties.bin_id}: ${properties.fill_level}% full`)
        .addTo(map);
    });
  });
```

#### Regular JSON Format (for lists):
```javascript
// Simple list display
fetch('/wasgo/api/v1/waste/bins/?format=json')
  .then(response => response.json())
  .then(bins => {
    bins.forEach(bin => {
      console.log(`Bin ${bin.bin_id} at ${bin.latitude}, ${bin.longitude}`);
    });
  });
```

### Backend Integration

#### Python with GeoJSON:
```python
import requests

# Get GeoJSON format
response = requests.get('http://localhost:8000/wasgo/api/v1/waste/bins/')
data = response.json()

for feature in data['features']:
    coordinates = feature['geometry']['coordinates']
    properties = feature['properties']
    print(f"Bin {properties['bin_id']} at {coordinates}")
```

#### Python with Regular JSON:
```python
import requests

# Get regular JSON format
response = requests.get('http://localhost:8000/wasgo/api/v1/waste/bins/?format=json')
bins = response.json()

for bin in bins:
    print(f"Bin {bin['bin_id']} at {bin['latitude']}, {bin['longitude']}")
```

## When to Use Each Format

### Use GeoJSON when:
- Building mapping applications
- Using mapping libraries (Leaflet, Mapbox, etc.)
- Performing spatial operations
- Integrating with GIS systems
- Need coordinate precision

### Use Regular JSON when:
- Building simple lists or tables
- Don't need mapping functionality
- Want simpler data structure
- Working with mobile apps that don't use maps
- Need faster parsing

## API Parameters

### Format Selection
- `?format=geojson` - Force GeoJSON format (default)
- `?format=json` - Use regular JSON format

### Other Available Filters
- `?status=active` - Filter by bin status
- `?area=Legon` - Filter by area
- `?min_fill_level=80` - Filter by fill level
- `?needs_collection=true` - Show bins needing collection
- `?user_id=uuid` - Filter by user ownership

## Migration Guide

If you're currently using GeoJSON and want to switch to regular JSON:

### Before (GeoJSON):
```javascript
const bin = data.features[0];
const binId = bin.properties.bin_id;
const coordinates = bin.geometry.coordinates;
```

### After (Regular JSON):
```javascript
const bin = data[0];
const binId = bin.bin_id;
const coordinates = [bin.longitude, bin.latitude];
```

## Performance Considerations

- **GeoJSON**: Slightly larger payload, but optimized for spatial operations
- **Regular JSON**: Smaller payload, faster parsing for simple applications
- Both formats support the same filtering and pagination options
- Choose based on your application's primary use case
