# Backend Geocoding API Solution

## Overview

This solution resolves CORS issues with geocoding APIs by proxying requests through your Django backend instead of calling external APIs directly from the frontend.

## ✅ Benefits

-   **No CORS Issues**: Backend proxy eliminates cross-origin restrictions
-   **API Key Security**: Keys stay secure on the server side
-   **Better Error Handling**: Centralized error management
-   **Rate Limiting**: Control API usage from one place
-   **Production Ready**: Recommended approach for production environments

## 🏗️ Architecture

```
Frontend → Django Backend → Google Maps API
                ↓
Frontend ← Formatted Response ← API Response
```

## 🔧 Backend Setup

### 1. Django Views Added

Located in: `wasgo-BE/apps/Location/views.py`

-   `google_address_autocomplete` - Address suggestions
-   `google_place_details` - Detailed place information
-   `geocode_address` - Convert address to coordinates
-   `postcode_suggestions` - UK postcode suggestions

### 2. URL Endpoints

Located in: `wasgo-BE/apps/Location/urls.py`

```python
# Google Maps API proxy endpoints
path("locations/google-autocomplete/", views.google_address_autocomplete),
path("locations/google-place-details/", views.google_place_details),
path("locations/geocode/", views.geocode_address),
path("locations/postcode-suggestions/", views.postcode_suggestions),
```

### 3. API Key Configuration

Located in: `wasgo-BE/backend/settings.py`

```python
GOOGLE_MAPS_API_KEY = os.getenv('GOOGLE_MAPS_API_KEY', 'your-fallback-key')
```

## 🎯 Frontend Usage

### 1. Geocoding Service

Use the new service: `src/utils/geocodingService.ts`

```typescript
import { getAddressSuggestions, getPlaceDetails, geocodeAddress } from '../utils/geocodingService';

// Get address suggestions
const suggestions = await getAddressSuggestions('London Bridge');

// Get place details with coordinates
const details = await getPlaceDetails('place_id_here');

// Geocode an address
const results = await geocodeAddress('10 Downing Street, London');
```

### 2. Address Autocomplete Component

Use the example component: `src/components/AddressAutocomplete.tsx`

```tsx
import AddressAutocomplete from '../components/AddressAutocomplete';

function MyForm() {
    const handleAddressSelect = (address) => {
        console.log('Selected address:', address);
        // address.formatted_address
        // address.coordinates: { lat, lng }
        // address.components: { address_line1, city, county, postcode, country }
    };

    return <AddressAutocomplete placeholder="Enter your address..." onAddressSelect={handleAddressSelect} />;
}
```

## 🔌 API Endpoints

### Address Autocomplete

```http
GET /wasgo/api/v1/locations/google-autocomplete/?input=london%20bridge&sessiontoken=abc123
```

**Response:**

```json
{
    "predictions": [
        {
            "description": "London Bridge, London, UK",
            "place_id": "ChIJ...",
            "structured_formatting": {
                "main_text": "London Bridge",
                "secondary_text": "London, UK"
            }
        }
    ],
    "status": "OK"
}
```

### Place Details

```http
GET /wasgo/api/v1/locations/google-place-details/?place_id=ChIJ...&sessiontoken=abc123
```

**Response:**

```json
{
    "result": {
        "formatted_address": "London Bridge, London SE1, UK",
        "geometry": {
            "location": {
                "lat": 51.5078788,
                "lng": -0.0877321
            }
        },
        "parsed_address": {
            "street_number": "",
            "route": "London Bridge",
            "postal_town": "London",
            "postal_code": "SE1"
        }
    },
    "status": "OK"
}
```

### Geocoding

```http
GET /wasgo/api/v1/locations/geocode/?address=10%20Downing%20Street%20London
```

**Response:**

```json
{
    "results": [
        {
            "formatted_address": "10 Downing St, London SW1A 2AA, UK",
            "geometry": {
                "location": {
                    "lat": 51.5033635,
                    "lng": -0.1276248
                }
            }
        }
    ],
    "status": "OK"
}
```

### Postcode Suggestions

```http
GET /wasgo/api/v1/locations/postcode-suggestions/?q=SW1
```

**Response:**

```json
{
    "suggestions": ["SW1A", "SW1E", "SW1H", "SW1P", "SW1V", "SW1W", "SW1X", "SW1Y"]
}
```

## 🔐 Security Considerations

### 1. API Key Protection

-   Store API key in environment variables
-   Never expose keys in frontend code
-   Restrict key usage in Google Cloud Console

### 2. Rate Limiting

Add to Django settings if needed:

```python
REST_FRAMEWORK = {
    'DEFAULT_THROTTLE_CLASSES': [
        'rest_framework.throttling.UserRateThrottle'
    ],
    'DEFAULT_THROTTLE_RATES': {
        'user': '1000/day'
    }
}
```

### 3. Domain Restrictions

In Google Cloud Console:

-   Restrict API key to your domain
-   Enable only required APIs (Places, Geocoding)

## 🚀 Deployment

### Environment Variables

Set in production:

```bash
GOOGLE_MAPS_API_KEY=your_production_api_key
```

### Frontend Configuration

Update base URL in `.env`:

```env
VITE_API_BASE_URL=https://your-backend-domain.com
```

## 🔧 Migration from Direct API Calls

### Before (CORS Issues)

```typescript
// ❌ Direct call causes CORS issues
const response = await fetch('https://maps.googleapis.com/maps/api/...');
```

### After (Backend Proxy)

```typescript
// ✅ Backend proxy - no CORS issues
import { getAddressSuggestions } from '../utils/geocodingService';
const response = await getAddressSuggestions('query');
```

## 📝 Usage Examples

### Basic Address Search

```typescript
import { getAddressSuggestions, getPlaceDetails } from '../utils/geocodingService';

async function searchAddress(query: string) {
    try {
        // Get suggestions
        const suggestions = await getAddressSuggestions(query);

        if (suggestions.predictions.length > 0) {
            // Get details for first suggestion
            const details = await getPlaceDetails(suggestions.predictions[0].place_id);

            // Extract coordinates
            const coords = {
                lat: details.result.geometry.location.lat,
                lng: details.result.geometry.location.lng,
            };

            console.log('Address coordinates:', coords);
        }
    } catch (error) {
        console.error('Geocoding error:', error);
    }
}
```

### Form Integration

```typescript
function AddressForm() {
    const [selectedAddress, setSelectedAddress] = useState(null);

    const handleAddressSelect = (address) => {
        setSelectedAddress(address);

        // Auto-fill form fields
        setFormData({
            address_line1: address.components.address_line1,
            city: address.components.city,
            postcode: address.components.postcode,
            latitude: address.coordinates.lat,
            longitude: address.coordinates.lng,
        });
    };

    return <AddressAutocomplete onAddressSelect={handleAddressSelect} />;
}
```

## 🐛 Troubleshooting

### Common Issues

1. **API Key Not Found**

    - Check `GOOGLE_MAPS_API_KEY` in Django settings
    - Verify environment variable is set

2. **No Suggestions Returned**

    - Check network connectivity
    - Verify API key has Places API enabled
    - Check query length (minimum 3 characters)

3. **Backend URL Issues**
    - Verify `VITE_API_BASE_URL` in frontend
    - Check Django server is running
    - Ensure CORS settings allow frontend domain

### Debug Mode

Enable logging in Django:

```python
LOGGING = {
    'loggers': {
        'apps.Location.views': {
            'level': 'DEBUG',
            'handlers': ['console'],
        },
    },
}
```
