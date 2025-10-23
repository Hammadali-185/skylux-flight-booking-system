const axios = require('axios');

// Nominatim API service for city autocomplete
const nominatimService = {
  // Base URL for Nominatim API
  baseURL: 'https://nominatim.openstreetmap.org',
  
  // Search for cities using Nominatim
  searchCities: async (query, limit = 10) => {
    try {
      if (!query || query.length < 2) {
        return {
          success: false,
          error: 'Query must be at least 2 characters long'
        };
      }

      const params = {
        q: query,
        format: 'json',
        addressdetails: 1,
        limit: limit,
        'accept-language': 'en',
        countrycodes: 'us,gb,fr,de,jp,au,ca,ae,sg,in,kr,th,my,nl,ch,it,es,br', // Limit to countries with major airports
        class: 'place',
        type: 'city,town,village'
      };

      const response = await axios.get(`${nominatimService.baseURL}/search`, {
        params: params,
        headers: {
          'User-Agent': 'SkyLux-Airlines-Booking-System/1.0 (contact@skylux.com)'
        },
        timeout: 5000
      });

      if (!response.data || response.data.length === 0) {
        return {
          success: false,
          error: 'No cities found matching your search'
        };
      }

      // Process and format the results
      const cities = response.data.map(item => {
        const address = item.address || {};
        
        // Extract city name (prefer city, then town, then village)
        const cityName = address.city || address.town || address.village || 
                         address.municipality || address.county || item.display_name.split(',')[0];
        
        // Extract country
        const country = address.country || 'Unknown';
        
        // Extract state/region if available
        const state = address.state || address.region || address.province || '';
        
        return {
          id: item.place_id,
          name: cityName,
          displayName: item.display_name,
          country: country,
          state: state,
          latitude: parseFloat(item.lat),
          longitude: parseFloat(item.lon),
          importance: item.importance || 0,
          type: item.type,
          boundingBox: item.boundingbox ? {
            north: parseFloat(item.boundingbox[1]),
            south: parseFloat(item.boundingbox[0]),
            west: parseFloat(item.boundingbox[2]),
            east: parseFloat(item.boundingbox[3])
          } : null
        };
      });

      // Sort by importance (higher is better)
      cities.sort((a, b) => b.importance - a.importance);

      return {
        success: true,
        query: query,
        resultCount: cities.length,
        cities: cities
      };

    } catch (error) {
      console.error('Nominatim API error:', error.message);
      
      if (error.code === 'ECONNABORTED') {
        return {
          success: false,
          error: 'Search request timed out. Please try again.'
        };
      }
      
      if (error.response && error.response.status === 429) {
        return {
          success: false,
          error: 'Too many requests. Please wait a moment and try again.'
        };
      }
      
      return {
        success: false,
        error: 'Failed to search cities. Please try again later.'
      };
    }
  },

  // Get detailed information about a specific place
  getPlaceDetails: async (placeId) => {
    try {
      const params = {
        place_id: placeId,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'en'
      };

      const response = await axios.get(`${nominatimService.baseURL}/details`, {
        params: params,
        headers: {
          'User-Agent': 'SkyLux-Airlines-Booking-System/1.0 (contact@skylux.com)'
        },
        timeout: 5000
      });

      if (!response.data) {
        return {
          success: false,
          error: 'Place details not found'
        };
      }

      const place = response.data;
      const address = place.address || {};

      return {
        success: true,
        place: {
          id: place.place_id,
          name: address.city || address.town || address.village || place.display_name.split(',')[0],
          displayName: place.display_name,
          country: address.country,
          state: address.state || address.region,
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon),
          type: place.type,
          importance: place.importance
        }
      };

    } catch (error) {
      console.error('Nominatim place details error:', error.message);
      return {
        success: false,
        error: 'Failed to get place details'
      };
    }
  },

  // Reverse geocoding - get city from coordinates
  reverseGeocode: async (latitude, longitude) => {
    try {
      const params = {
        lat: latitude,
        lon: longitude,
        format: 'json',
        addressdetails: 1,
        'accept-language': 'en'
      };

      const response = await axios.get(`${nominatimService.baseURL}/reverse`, {
        params: params,
        headers: {
          'User-Agent': 'SkyLux-Airlines-Booking-System/1.0 (contact@skylux.com)'
        },
        timeout: 5000
      });

      if (!response.data) {
        return {
          success: false,
          error: 'No location found for these coordinates'
        };
      }

      const place = response.data;
      const address = place.address || {};

      return {
        success: true,
        location: {
          name: address.city || address.town || address.village || 'Unknown',
          country: address.country || 'Unknown',
          state: address.state || address.region || '',
          displayName: place.display_name,
          latitude: parseFloat(place.lat),
          longitude: parseFloat(place.lon)
        }
      };

    } catch (error) {
      console.error('Reverse geocoding error:', error.message);
      return {
        success: false,
        error: 'Failed to reverse geocode coordinates'
      };
    }
  },

  // Search for cities with airport validation
  searchCitiesWithAirports: async (query, airportService, limit = 10) => {
    try {
      // First get cities from Nominatim
      const cityResults = await nominatimService.searchCities(query, limit * 2); // Get more results to filter
      
      if (!cityResults.success) {
        return cityResults;
      }

      // Check each city for airports
      const citiesWithAirports = [];
      const citiesWithoutAirports = [];

      for (const city of cityResults.cities) {
        // Check if city has airports
        const airportResult = await airportService.validateCityAndGetAirports(
          city.name,
          { latitude: city.latitude, longitude: city.longitude }
        );

        if (airportResult.success) {
          citiesWithAirports.push({
            ...city,
            hasAirports: true,
            airportCount: airportResult.airportCount,
            airports: airportResult.airports,
            bounds: airportResult.bounds
          });
        } else {
          citiesWithoutAirports.push({
            ...city,
            hasAirports: false,
            error: airportResult.error
          });
        }
      }

      // Sort: cities with airports first, then by importance
      const sortedCities = [
        ...citiesWithAirports.sort((a, b) => b.importance - a.importance),
        ...citiesWithoutAirports.sort((a, b) => b.importance - a.importance)
      ].slice(0, limit);

      return {
        success: true,
        query: query,
        totalResults: cityResults.resultCount,
        citiesWithAirports: citiesWithAirports.length,
        citiesWithoutAirports: citiesWithoutAirports.length,
        cities: sortedCities
      };

    } catch (error) {
      console.error('City search with airports error:', error.message);
      return {
        success: false,
        error: 'Failed to search cities with airport validation'
      };
    }
  }
};

module.exports = nominatimService;


