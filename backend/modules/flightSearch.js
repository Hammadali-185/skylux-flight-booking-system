const Flight = require('../models/Flight');
const flightData = require('../data/flightData');
const { airports } = require('../data/airports');

// Use comprehensive flight data for October 2024
const mockFlights = flightData.map(flight => {
  flight.seatMap = generateSeatMap(flight.aircraft);
  return flight;
});

// Generate seat map for different aircraft types
function generateSeatMap(aircraftType) {
  const seatMaps = {
    'Boeing 787-9': {
      first: { rows: 2, seatsPerRow: 4, prefix: 'F' },
      business: { rows: 5, seatsPerRow: 6, prefix: 'J' },
      premium: { rows: 3, seatsPerRow: 6, prefix: 'W' },
      economy: { rows: 25, seatsPerRow: 9, prefix: 'Y' }
    },
    'Airbus A350': {
      first: { rows: 2, seatsPerRow: 4, prefix: 'F' },
      business: { rows: 4, seatsPerRow: 6, prefix: 'J' },
      premium: { rows: 3, seatsPerRow: 6, prefix: 'W' },
      economy: { rows: 28, seatsPerRow: 9, prefix: 'Y' }
    },
    'Boeing 777-300ER': {
      first: { rows: 3, seatsPerRow: 4, prefix: 'F' },
      business: { rows: 6, seatsPerRow: 6, prefix: 'J' },
      premium: { rows: 4, seatsPerRow: 7, prefix: 'W' },
      economy: { rows: 30, seatsPerRow: 10, prefix: 'Y' }
    }
  };

  const config = seatMaps[aircraftType] || seatMaps['Boeing 787-9'];
  const seatMap = {};

  Object.keys(config).forEach(cabin => {
    seatMap[cabin] = [];
    const { rows, seatsPerRow } = config[cabin];
    
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let seat = 1; seat <= seatsPerRow; seat++) {
        const seatLetter = String.fromCharCode(64 + seat); // A, B, C, etc.
        // Generate realistic seat availability (70-90% booked)
        const randomStatus = Math.random();
        let status = 'available';
        let occupiedBy = null;
        let gender = null;
        
        if (randomStatus < 0.75) { // 75% chance seat is occupied
          if (randomStatus < 0.4) { // 40% chance occupied by male
            status = 'occupied_male';
            occupiedBy = 'male';
            gender = 'male';
          } else { // 35% chance occupied by female
            status = 'occupied_female';
            occupiedBy = 'female';
            gender = 'female';
          }
        }
        
        rowSeats.push({
          id: `${row}${seatLetter}`,
          row: row,
          seat: seatLetter,
          status: status, // available, booked, occupied_male, occupied_female
          type: 'standard', // standard, extra_legroom, emergency_exit
          price: 0,
          occupiedBy: occupiedBy,
          gender: gender
        });
      }
      seatMap[cabin].push(rowSeats);
    }
  });

  return seatMap;
}

// Flight Search Functions
const flightSearch = {
  // Main search function
  searchFlights: async (origin, destination, departureDate, returnDate, passengers, travelClass, tripType) => {
    try {
      // Validate input
      const validation = flightSearch.validateSearchInput({
        origin,
        destination,
        departureDate,
        returnDate,
        passengers,
        travelClass,
        tripType
      });

      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Get available flights
      let outboundFlights = flightSearch.getAvailableFlights({
        origin,
        destination,
        date: departureDate,
        passengers,
        travelClass
      });

      let returnFlights = [];
      if (tripType === 'round-trip' && returnDate) {
        returnFlights = flightSearch.getAvailableFlights({
          origin: destination,
          destination: origin,
          date: returnDate,
          passengers,
          travelClass
        });
      }

      return {
        success: true,
        outboundFlights,
        returnFlights,
        searchParams: {
          origin,
          destination,
          departureDate,
          returnDate,
          passengers,
          travelClass,
          tripType
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        outboundFlights: [],
        returnFlights: []
      };
    }
  },

  // Validate search input
  validateSearchInput: (data) => {
    const errors = [];
    const { origin, destination, departureDate, passengers, travelClass, tripType } = data;

    if (!origin || origin.length < 3) {
      errors.push('Valid origin airport code is required');
    }

    if (!destination || destination.length < 3) {
      errors.push('Valid destination airport code is required');
    }

    if (origin === destination) {
      errors.push('Origin and destination cannot be the same');
    }

    if (!departureDate) {
      errors.push('Departure date is required');
    } else {
      const depDate = new Date(departureDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Allow dates from today onwards (remove the past date restriction for testing)
      // In production, you might want to keep this validation
      // if (depDate < today) {
      //   errors.push('Departure date cannot be in the past');
      // }
    }

    if (tripType === 'round-trip' && data.returnDate) {
      const depDate = new Date(departureDate);
      const retDate = new Date(data.returnDate);
      
      if (retDate <= depDate) {
        errors.push('Return date must be after departure date');
      }
    }

    if (!passengers || passengers < 1 || passengers > 9) {
      errors.push('Number of passengers must be between 1 and 9');
    }

    const validClasses = ['economy', 'premium', 'business', 'first'];
    if (!validClasses.includes(travelClass)) {
      errors.push('Invalid travel class');
    }

    const validTripTypes = ['one-way', 'round-trip', 'multi-city'];
    if (!validTripTypes.includes(tripType)) {
      errors.push('Invalid trip type');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Get available flights based on filters
  getAvailableFlights: (filters) => {
    const { origin, destination, date, passengers, travelClass } = filters;

    return mockFlights.filter(flight => {
      // Check route
      if (flight.origin !== origin || flight.destination !== destination) {
        return false;
      }

      // Check date (simplified - in production would be more sophisticated)
      if (flight.date !== date) {
        return false;
      }

      // Check availability - use availableSeats object
      const availableSeats = flight.availableSeats[travelClass] || 0;
      if (availableSeats < passengers) {
        return false;
      }

      // Check if flight is active
      if (flight.status !== 'active') {
        return false;
      }

      return true;
    }).map(flight => {
      // Calculate total fare
      const baseFare = flight.baseFares[travelClass] || 0;
      const taxes = flight.taxes || 0;
      const surcharges = flight.surcharges || 0;
      const totalFare = (baseFare + taxes + surcharges) * passengers;

      return {
        ...flight,
        totalFare: totalFare,
        availableSeats: flight.availableSeats[travelClass] || 0
      };
    });
  },

  // Filter flights by class and fare
  filterByClassAndFare: (flights, travelClass, passengers, maxFare = null, minFare = null) => {
    return flights.filter(flight => {
      // Calculate total fare
      const baseFare = flight.baseFares[travelClass] || 0;
      const taxes = flight.taxes || 0;
      const surcharges = flight.surcharges || 0;
      const totalFare = (baseFare + taxes + surcharges) * passengers;
      
      if (maxFare && totalFare > maxFare) return false;
      if (minFare && totalFare < minFare) return false;
      
      // Check availability
      const availableSeats = flight.availableSeats[travelClass] || 0;
      return availableSeats >= passengers;
    }).sort((a, b) => {
      // Sort by fare (ascending)
      const fareA = (a.baseFares[travelClass] || 0) + (a.taxes || 0) + (a.surcharges || 0);
      const fareB = (b.baseFares[travelClass] || 0) + (b.taxes || 0) + (b.surcharges || 0);
      return fareA - fareB;
    });
  },

  // Get flight by ID
  getFlightById: (flightId) => {
    return mockFlights.find(flight => flight.id === flightId);
  },

  // Update flight availability (for booking)
  updateFlightAvailability: (flightId, travelClass, passengerCount) => {
    const flight = flightSearch.getFlightById(flightId);
    if (flight) {
      flight.updateAvailableSeats(travelClass, -passengerCount);
      return true;
    }
    return false;
  }
};

module.exports = flightSearch;
