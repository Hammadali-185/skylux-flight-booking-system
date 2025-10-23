const fs = require('fs');
const path = require('path');

// Load OpenFlights airport database
let airportsDatabase = [];

try {
  const airportsPath = path.join(__dirname, '../data/openflights-airports.json');
  const airportsData = fs.readFileSync(airportsPath, 'utf8');
  airportsDatabase = JSON.parse(airportsData);
  console.log(`✈️  Loaded ${airportsDatabase.length} airports from OpenFlights database`);
} catch (error) {
  console.error('❌ Failed to load airports database:', error.message);
}

// Airport validation and search functions
const airportService = {
  // Find airports by city name
  findAirportsByCity: (cityName) => {
    if (!cityName || typeof cityName !== 'string') {
      return {
        success: false,
        error: 'Invalid city name provided'
      };
    }

    const normalizedCityName = cityName.toLowerCase().trim();
    
    // Find airports in the specified city
    const airports = airportsDatabase.filter(airport => {
      const airportCity = airport.city.toLowerCase();
      const airportCountry = airport.country.toLowerCase();
      
      // Match by exact city name or partial match
      return airportCity.includes(normalizedCityName) || 
             normalizedCityName.includes(airportCity) ||
             // Also check if the search includes country (e.g., "London, UK")
             (normalizedCityName.includes(airportCity) && normalizedCityName.includes(airportCountry.split(' ')[0].toLowerCase()));
    });

    if (airports.length === 0) {
      return {
        success: false,
        error: 'No airport found in this city',
        cityName: cityName,
        suggestions: airportService.getSimilarCities(normalizedCityName)
      };
    }

    // Format airport data for response
    const formattedAirports = airports.map(airport => ({
      name: airport.name,
      iata: airport.iata,
      icao: airport.icao,
      city: airport.city,
      country: airport.country,
      latitude: airport.latitude,
      longitude: airport.longitude,
      altitude: airport.altitude,
      timezone: airport.timezone
    }));

    return {
      success: true,
      cityName: cityName,
      airportCount: airports.length,
      airports: formattedAirports,
      // Calculate bounding box for map display
      bounds: airportService.calculateBounds(formattedAirports)
    };
  },

  // Find airports by coordinates (for Nominatim integration)
  findAirportsByCoordinates: (latitude, longitude, radiusKm = 50) => {
    const airports = airportsDatabase.filter(airport => {
      const distance = airportService.calculateDistance(
        latitude, longitude,
        airport.latitude, airport.longitude
      );
      return distance <= radiusKm;
    });

    if (airports.length === 0) {
      return {
        success: false,
        error: 'No airports found within the specified radius',
        searchRadius: radiusKm
      };
    }

    const formattedAirports = airports.map(airport => ({
      name: airport.name,
      iata: airport.iata,
      icao: airport.icao,
      city: airport.city,
      country: airport.country,
      latitude: airport.latitude,
      longitude: airport.longitude,
      distance: airportService.calculateDistance(latitude, longitude, airport.latitude, airport.longitude)
    })).sort((a, b) => a.distance - b.distance); // Sort by distance

    return {
      success: true,
      airportCount: airports.length,
      airports: formattedAirports,
      bounds: airportService.calculateBounds(formattedAirports)
    };
  },

  // Get airport by IATA code
  getAirportByIATA: (iataCode) => {
    if (!iataCode || typeof iataCode !== 'string') {
      return {
        success: false,
        error: 'Invalid IATA code provided'
      };
    }

    const airport = airportsDatabase.find(airport => 
      airport.iata && airport.iata.toUpperCase() === iataCode.toUpperCase()
    );

    if (!airport) {
      return {
        success: false,
        error: 'Airport not found with the specified IATA code'
      };
    }

    return {
      success: true,
      airport: {
        name: airport.name,
        iata: airport.iata,
        icao: airport.icao,
        city: airport.city,
        country: airport.country,
        latitude: airport.latitude,
        longitude: airport.longitude,
        altitude: airport.altitude,
        timezone: airport.timezone
      }
    };
  },

  // Search airports with fuzzy matching
  searchAirports: (query, limit = 10) => {
    if (!query || typeof query !== 'string') {
      return {
        success: false,
        error: 'Invalid search query'
      };
    }

    const normalizedQuery = query.toLowerCase().trim();
    
    const results = airportsDatabase.filter(airport => {
      const searchableText = [
        airport.name,
        airport.city,
        airport.country,
        airport.iata,
        airport.icao
      ].join(' ').toLowerCase();
      
      return searchableText.includes(normalizedQuery);
    }).slice(0, limit);

    return {
      success: true,
      query: query,
      resultCount: results.length,
      airports: results.map(airport => ({
        name: airport.name,
        iata: airport.iata,
        city: airport.city,
        country: airport.country,
        latitude: airport.latitude,
        longitude: airport.longitude
      }))
    };
  },

  // Calculate distance between two coordinates (Haversine formula)
  calculateDistance: (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = airportService.toRadians(lat2 - lat1);
    const dLon = airportService.toRadians(lon2 - lon1);
    
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(airportService.toRadians(lat1)) * Math.cos(airportService.toRadians(lat2)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  },

  // Convert degrees to radians
  toRadians: (degrees) => {
    return degrees * (Math.PI / 180);
  },

  // Calculate bounding box for multiple airports
  calculateBounds: (airports) => {
    if (!airports || airports.length === 0) {
      return null;
    }

    if (airports.length === 1) {
      const airport = airports[0];
      return {
        north: airport.latitude + 0.1,
        south: airport.latitude - 0.1,
        east: airport.longitude + 0.1,
        west: airport.longitude - 0.1,
        center: {
          latitude: airport.latitude,
          longitude: airport.longitude
        }
      };
    }

    const lats = airports.map(a => a.latitude);
    const lngs = airports.map(a => a.longitude);
    
    const north = Math.max(...lats);
    const south = Math.min(...lats);
    const east = Math.max(...lngs);
    const west = Math.min(...lngs);
    
    // Add padding
    const latPadding = (north - south) * 0.1;
    const lngPadding = (east - west) * 0.1;

    return {
      north: north + latPadding,
      south: south - latPadding,
      east: east + lngPadding,
      west: west - lngPadding,
      center: {
        latitude: (north + south) / 2,
        longitude: (east + west) / 2
      }
    };
  },

  // Get similar cities for suggestions
  getSimilarCities: (cityName) => {
    const suggestions = airportsDatabase
      .filter(airport => {
        const airportCity = airport.city.toLowerCase();
        return airportCity.includes(cityName.substring(0, 3)) || 
               cityName.includes(airportCity.substring(0, 3));
      })
      .map(airport => ({
        city: airport.city,
        country: airport.country,
        iata: airport.iata
      }))
      .slice(0, 5);

    return suggestions;
  },

  // Get all available cities with airports
  getAllCitiesWithAirports: () => {
    const cities = [...new Set(airportsDatabase.map(airport => 
      `${airport.city}, ${airport.country}`
    ))].sort();

    return {
      success: true,
      cityCount: cities.length,
      cities: cities
    };
  },

  // Validate city and return airport information
  validateCityAndGetAirports: async (cityName, coordinates = null) => {
    try {
      // First try to find by city name
      let result = airportService.findAirportsByCity(cityName);
      
      // If no airports found by city name and coordinates are provided, try coordinate search
      if (!result.success && coordinates) {
        result = airportService.findAirportsByCoordinates(
          coordinates.latitude, 
          coordinates.longitude, 
          100 // 100km radius
        );
        
        if (result.success) {
          result.searchMethod = 'coordinates';
          result.originalCityName = cityName;
        }
      }
      
      return result;
    } catch (error) {
      return {
        success: false,
        error: 'Failed to validate city and find airports',
        details: error.message
      };
    }
  }
};

module.exports = airportService;


