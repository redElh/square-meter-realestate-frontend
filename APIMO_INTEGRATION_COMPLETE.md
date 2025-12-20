# Apimo CRM API Integration

## Overview
This document describes the integration of the Apimo CRM API into the Square Meter Real Estate web application. The integration allows the application to fetch and display real property listings directly from the agency's CRM system.

## API Configuration

### Credentials
- **Provider ID**: 4567
- **Agency ID**: 25311
- **Token**: d07da6e744bb033d1299469f1f6f7334531ec05c
- **Base URL**: https://api.apimo.pro

### Authentication
The API uses HTTP Basic Authentication:
- **Username**: Provider ID (4567)
- **Password**: API Token

## Implementation

### 1. API Service (`src/services/apimoService.ts`)

The `apimoService.ts` file contains:
- **Type Definitions**: Complete TypeScript interfaces for Apimo API responses
- **Property Mapping**: Conversion logic from Apimo format to application format
- **API Methods**:
  - `getProperties()`: Fetches all properties with optional filtering
  - `getPropertyById()`: Fetches a single property by ID

### 2. Data Mapping

The service maps Apimo CRM fields to the application's property structure:

| Apimo Field | Application Field | Notes |
|-------------|-------------------|-------|
| `id` | `id` | Unique property identifier |
| `reference` | `reference` | Human-readable reference |
| `comments[].title` | `title` | Property title from French comments |
| `comments[].comment` | `description` | Full description |
| `category` | `type` | Mapped: 1=buy, 2=rent, 4=seasonal |
| `price.value` | `price` | Property price |
| `price.currency` | `currency` | Currency code (EUR, MAD, etc.) |
| `city.name` | `location`, `city` | City name |
| `city.zipcode` | `zipcode` | Postal code |
| `area.value` | `surface` | Living surface in m² |
| `area.total` | `landSurface` | Total land surface |
| `bedrooms` | `bedrooms` | Number of bedrooms |
| `rooms` | `rooms` | Total number of rooms |
| `pictures[]` | `images` | Array of property images |
| `user` | `agent` | Agent information |
| `areas[]` | `areas` | Detailed room breakdown |
| `latitude`, `longitude` | GPS coordinates | For map display |
| `construction.construction_year` | `yearBuilt` | Year of construction |
| `ranking` | `featured` | Featured if ranking >= 4 |
| `!publish_address` | `confidential` | Hide address details |

### 3. Property Categories

Apimo categories are mapped as follows:
- **Category 1**: Sale (`buy`)
- **Category 2**: Long-term rental (`rent`)
  - Subcategory 22-23: Seasonal rental (`seasonal`)
- **Category 4**: Seasonal rental (`seasonal`)

### 4. Property Types

The service includes mapping for property types and subtypes:
- Types: Apartment, House, Land, Parking, Commercial, Office, Building, Castle, Villa, Loft
- Subtypes: Studio, T2, T3, T4, T5+, Duplex, Triplex, etc.

### 5. Room/Area Types

Detailed area information is mapped:
- Type 1: Bedroom (Chambre)
- Type 2: Living room (Salon)
- Type 3: Kitchen (Cuisine)
- Type 4: Bathroom (Salle de bain)
- Type 5: Shower room (Salle d'eau)
- Type 6: Parking
- Type 15: Entrance (Entrée)
- Type 20: Living/Dining (Séjour)
- Type 41: Toilet (WC)

## Pages Integration

### Properties Page (`src/pages/Properties.tsx`)
- Fetches all properties on component mount
- Displays properties in a grid layout
- Supports filtering by type, location, and bedrooms
- Shows property cards with images, price, and key details

### Property Detail Page (`src/pages/PropertyDetail.tsx`)
- Fetches individual property details by ID
- Displays full property information including:
  - Image carousel
  - Detailed specifications
  - Room breakdown from `areas` array
  - Agent contact information
  - Similar properties

## API Response Example

```json
{
  "total_items": 2,
  "timestamp": 1765999805,
  "properties": [
    {
      "id": 86379445,
      "reference": "86379445",
      "type": 2,
      "subtype": 5,
      "category": 1,
      "price": {
        "value": 1648000,
        "currency": "MAD"
      },
      "city": {
        "name": "Essaouira",
        "zipcode": "44000"
      },
      "area": {
        "value": 25
      },
      "bedrooms": 0,
      "pictures": [...],
      "comments": [
        {
          "language": "fr",
          "title": "Cosy Riad",
          "comment": "..."
        }
      ]
    }
  ]
}
```

## Testing

A test script (`testApimoAPI.js`) is provided to verify the API connection:

```bash
cd frontend
node testApimoAPI.js
```

The test will:
1. Connect to the Apimo API
2. Fetch properties
3. Display response statistics
4. Show a sample property

## Current Status

✅ **Completed**:
- API service implementation with complete type definitions
- Data mapping from Apimo to application format
- Properties page integration
- Property detail page integration
- API connection test successful
- Retrieved 2 properties from the CRM

## Error Handling

The service includes comprehensive error handling:
- Network errors are caught and logged
- API errors (non-200 responses) are properly handled
- Empty states are handled in the UI (loading, no properties found)
- Fallback images are provided if properties have no pictures

## Future Enhancements

Possible improvements for the future:
1. **Caching**: Implement local caching to reduce API calls
2. **Pagination**: Add pagination for large property lists
3. **Advanced Filtering**: Use API parameters for server-side filtering
4. **Real-time Updates**: Implement webhook or polling for property updates
5. **Image Optimization**: Lazy load images and use appropriate sizes
6. **Multi-language**: Support multiple language comments from the API
7. **Search**: Implement full-text search using API parameters
8. **Favorites**: Sync favorites with CRM system

## API Documentation

Full API documentation is available at: https://apimo.net/fr/api/webservice/

## Notes

- The API returns properties in MAD (Moroccan Dirham) currency
- Images are hosted on S3 and are accessible via HTTPS
- The agency currently has 2 properties in the system
- Property comments are available in French language
- GPS coordinates are provided for map integration
