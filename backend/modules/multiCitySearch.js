const flightSearch = require('./flightSearch');

// Multi-city Search Functions
const multiCitySearch = {
  // Build multi-city itinerary
  buildMultiCityItinerary: async (segments) => {
    try {
      // Validate segments
      const validation = multiCitySearch.validateSegments(segments);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      const itinerary = {
        segments: [],
        totalFare: 0,
        totalDuration: 0,
        connections: []
      };

      // Process each segment
      for (let i = 0; i < segments.length; i++) {
        const segment = segments[i];
        const availableFlights = flightSearch.getAvailableFlights({
          origin: segment.origin,
          destination: segment.destination,
          date: segment.date,
          passengers: segment.passengers,
          travelClass: segment.travelClass
        });

        if (availableFlights.length === 0) {
          throw new Error(`No flights available for segment ${i + 1}: ${segment.origin} to ${segment.destination}`);
        }

        // Select best flight (lowest fare for now)
        const selectedFlight = availableFlights.sort((a, b) => 
          a.getTotalFare(segment.travelClass, segment.passengers) - 
          b.getTotalFare(segment.travelClass, segment.passengers)
        )[0];

        itinerary.segments.push({
          segmentNumber: i + 1,
          flight: selectedFlight,
          passengers: segment.passengers,
          travelClass: segment.travelClass,
          fare: selectedFlight.getTotalFare(segment.travelClass, segment.passengers)
        });

        itinerary.totalFare += selectedFlight.getTotalFare(segment.travelClass, segment.passengers);
      }

      // Calculate connections
      itinerary.connections = multiCitySearch.getAvailableConnections(segments);

      return {
        success: true,
        itinerary
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validate multi-city segments
  validateSegments: (segments) => {
    const errors = [];

    if (!segments || !Array.isArray(segments) || segments.length < 2) {
      errors.push('At least 2 segments are required for multi-city travel');
      return { isValid: false, errors };
    }

    if (segments.length > 6) {
      errors.push('Maximum 6 segments allowed for multi-city travel');
    }

    segments.forEach((segment, index) => {
      const segmentNum = index + 1;

      if (!segment.origin || segment.origin.length < 3) {
        errors.push(`Segment ${segmentNum}: Valid origin airport code is required`);
      }

      if (!segment.destination || segment.destination.length < 3) {
        errors.push(`Segment ${segmentNum}: Valid destination airport code is required`);
      }

      if (segment.origin === segment.destination) {
        errors.push(`Segment ${segmentNum}: Origin and destination cannot be the same`);
      }

      if (!segment.date) {
        errors.push(`Segment ${segmentNum}: Date is required`);
      } else {
        const segmentDate = new Date(segment.date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (segmentDate < today) {
          errors.push(`Segment ${segmentNum}: Date cannot be in the past`);
        }

        // Check if dates are in chronological order
        if (index > 0) {
          const prevDate = new Date(segments[index - 1].date);
          if (segmentDate <= prevDate) {
            errors.push(`Segment ${segmentNum}: Date must be after previous segment date`);
          }
        }
      }

      if (!segment.passengers || segment.passengers < 1 || segment.passengers > 9) {
        errors.push(`Segment ${segmentNum}: Number of passengers must be between 1 and 9`);
      }

      const validClasses = ['economy', 'premium', 'business', 'first'];
      if (!validClasses.includes(segment.travelClass)) {
        errors.push(`Segment ${segmentNum}: Invalid travel class`);
      }
    });

    // Check for logical routing (destination of segment N should connect to origin of segment N+1)
    for (let i = 0; i < segments.length - 1; i++) {
      const currentSegment = segments[i];
      const nextSegment = segments[i + 1];

      if (currentSegment.destination !== nextSegment.origin) {
        errors.push(`Segments ${i + 1} and ${i + 2}: Destination of segment ${i + 1} (${currentSegment.destination}) must match origin of segment ${i + 2} (${nextSegment.origin})`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Calculate multi-city fare
  calculateMultiCityFare: (segments, passengers) => {
    let totalFare = 0;
    const fareBreakdown = [];

    segments.forEach((segment, index) => {
      const flight = flightSearch.getFlightById(segment.flightId);
      if (flight) {
        const segmentFare = flight.getTotalFare(segment.travelClass, passengers);
        totalFare += segmentFare;
        
        fareBreakdown.push({
          segmentNumber: index + 1,
          origin: flight.origin,
          destination: flight.destination,
          flightNumber: flight.flightNumber,
          travelClass: segment.travelClass,
          baseFare: flight.getBaseFare(segment.travelClass) * passengers,
          taxes: flight.taxes * passengers,
          surcharges: flight.surcharges * passengers,
          totalFare: segmentFare
        });
      }
    });

    return {
      totalFare,
      fareBreakdown,
      passengers
    };
  },

  // Get available connections between segments
  getAvailableConnections: (segments) => {
    const connections = [];

    for (let i = 0; i < segments.length - 1; i++) {
      const currentSegment = segments[i];
      const nextSegment = segments[i + 1];

      // Calculate layover time
      const currentArrival = new Date(`${currentSegment.date} ${currentSegment.arrivalTime || '12:00'}`);
      const nextDeparture = new Date(`${nextSegment.date} ${nextSegment.departureTime || '12:00'}`);
      
      const layoverHours = (nextDeparture - currentArrival) / (1000 * 60 * 60);

      connections.push({
        from: currentSegment.destination,
        to: nextSegment.origin,
        layoverHours: Math.max(0, layoverHours),
        isValidConnection: layoverHours >= 2, // Minimum 2 hours for international connections
        connectionType: layoverHours < 4 ? 'short' : layoverHours < 12 ? 'medium' : 'long'
      });
    }

    return connections;
  },

  // Add multi-city segment
  addMultiCitySegment: (segments, origin, destination, date, passengers, travelClass) => {
    const newSegment = {
      id: `segment_${Date.now()}`,
      origin,
      destination,
      date,
      passengers,
      travelClass,
      flightId: null // Will be set when flight is selected
    };

    return [...segments, newSegment];
  },

  // Remove multi-city segment
  removeMultiCitySegment: (segments, segmentId) => {
    return segments.filter(segment => segment.id !== segmentId);
  },

  // Update multi-city segment
  updateMultiCitySegment: (segments, segmentId, updates) => {
    return segments.map(segment => {
      if (segment.id === segmentId) {
        return { ...segment, ...updates };
      }
      return segment;
    });
  },

  // Get multi-city search suggestions
  getMultiCitySearchSuggestions: (currentSegments) => {
    // Popular multi-city routes
    const popularRoutes = [
      ['JFK', 'LHR', 'CDG', 'JFK'], // New York → London → Paris → New York
      ['LAX', 'NRT', 'ICN', 'LAX'], // Los Angeles → Tokyo → Seoul → Los Angeles
      ['DXB', 'BOM', 'DEL', 'DXB'], // Dubai → Mumbai → Delhi → Dubai
      ['SIN', 'KUL', 'BKK', 'SIN'], // Singapore → Kuala Lumpur → Bangkok → Singapore
      ['FRA', 'VIE', 'PRG', 'FRA']  // Frankfurt → Vienna → Prague → Frankfurt
    ];

    const suggestions = [];
    
    if (currentSegments.length === 0) {
      // Suggest complete routes
      popularRoutes.forEach((route, index) => {
        suggestions.push({
          id: `suggestion_${index}`,
          name: `Popular Route ${index + 1}`,
          cities: route,
          description: `${route.join(' → ')}`
        });
      });
    } else {
      // Suggest next destinations based on current last destination
      const lastDestination = currentSegments[currentSegments.length - 1]?.destination;
      if (lastDestination) {
        const possibleNext = ['LHR', 'CDG', 'FRA', 'NRT', 'ICN', 'SIN', 'DXB', 'BOM'];
        possibleNext.forEach(airport => {
          if (airport !== lastDestination) {
            suggestions.push({
              id: `next_${airport}`,
              airport,
              description: `Continue to ${airport}`
            });
          }
        });
      }
    }

    return suggestions;
  }
};

module.exports = multiCitySearch;


