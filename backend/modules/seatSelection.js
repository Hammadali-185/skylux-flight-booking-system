const flightSearch = require('./flightSearch');

// In-memory seat status storage (in production, this would be in a database)
const seatStatus = new Map();

// Seat Selection Functions
const seatSelection = {
  // Get seat map for a flight
  getSeatMap: (flightId) => {
    try {
      const flight = flightSearch.getFlightById(flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }

      // Get current seat status from storage
      const currentStatus = seatStatus.get(flightId) || {};
      
      // Update seat map with current status
      const updatedSeatMap = { ...flight.seatMap };
      
      Object.keys(updatedSeatMap).forEach(cabin => {
        updatedSeatMap[cabin] = updatedSeatMap[cabin].map(row => 
          row.map(seat => ({
            ...seat,
            status: currentStatus[seat.id] ? currentStatus[seat.id].status : seat.status,
            occupiedBy: currentStatus[seat.id] ? currentStatus[seat.id].occupiedBy : null,
            price: seatSelection.getSeatPrice(seat, cabin)
          }))
        );
      });

      return {
        success: true,
        flightId,
        flightNumber: flight.flightNumber,
        aircraft: flight.aircraft,
        seatMap: updatedSeatMap
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get seat price based on type and cabin
  getSeatPrice: (seat, cabin) => {
    const pricingRules = {
      economy: {
        standard: 0,
        extra_legroom: 50,
        emergency_exit: 75,
        window: 25,
        aisle: 25
      },
      premium: {
        standard: 0,
        extra_legroom: 75,
        emergency_exit: 100,
        window: 35,
        aisle: 35
      },
      business: {
        standard: 0,
        extra_legroom: 100,
        window: 50,
        aisle: 50
      },
      first: {
        standard: 0,
        window: 75,
        aisle: 75
      }
    };

    const cabinPricing = pricingRules[cabin] || pricingRules.economy;
    return cabinPricing[seat.type] || 0;
  },

  // Mark seat as booked
  markSeatAsBooked: (flightId, seatId, passengerId, passengerGender = null) => {
    try {
      const currentStatus = seatStatus.get(flightId) || {};
      
      // Check if seat is available
      if (currentStatus[seatId] && currentStatus[seatId].status !== 'available') {
        throw new Error('Seat is not available');
      }

      // Determine status based on gender
      let status = 'booked';
      if (passengerGender === 'male') {
        status = 'occupied_male';
      } else if (passengerGender === 'female') {
        status = 'occupied_female';
      }

      currentStatus[seatId] = {
        status,
        passengerId,
        occupiedBy: passengerId,
        bookedAt: new Date(),
        gender: passengerGender
      };

      seatStatus.set(flightId, currentStatus);

      return {
        success: true,
        seatId,
        status,
        passengerId
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Mark seat as available
  markSeatAsAvailable: (flightId, seatId) => {
    try {
      const currentStatus = seatStatus.get(flightId) || {};
      
      if (currentStatus[seatId]) {
        currentStatus[seatId] = {
          status: 'available',
          passengerId: null,
          occupiedBy: null,
          bookedAt: null,
          gender: null
        };
      }

      seatStatus.set(flightId, currentStatus);

      return {
        success: true,
        seatId,
        status: 'available'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Assign seat to passenger
  assignSeat: (flightId, passengerId, seatId, passengerInfo = {}) => {
    try {
      // First, free up any previously assigned seat for this passenger
      seatSelection.freePreviousAssignment(flightId, passengerId);

      // Then assign the new seat
      const result = seatSelection.markSeatAsBooked(flightId, seatId, passengerId, passengerInfo.gender);
      
      if (result.success) {
        return {
          success: true,
          assignment: {
            flightId,
            passengerId,
            seatId,
            assignedAt: new Date(),
            passengerName: `${passengerInfo.firstName || ''} ${passengerInfo.lastName || ''}`.trim()
          }
        };
      }

      return result;
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Swap seat for passenger
  swapSeat: (flightId, passengerId, newSeatId, passengerInfo = {}) => {
    try {
      // Free the old seat
      seatSelection.freePreviousAssignment(flightId, passengerId);
      
      // Assign the new seat
      return seatSelection.assignSeat(flightId, passengerId, newSeatId, passengerInfo);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Free previous seat assignment for passenger
  freePreviousAssignment: (flightId, passengerId) => {
    const currentStatus = seatStatus.get(flightId) || {};
    
    // Find and free any seat currently assigned to this passenger
    Object.keys(currentStatus).forEach(seatId => {
      if (currentStatus[seatId].passengerId === passengerId) {
        currentStatus[seatId] = {
          status: 'available',
          passengerId: null,
          occupiedBy: null,
          bookedAt: null,
          gender: null
        };
      }
    });

    seatStatus.set(flightId, currentStatus);
  },

  // Get seat status
  getSeatStatus: (flightId, seatId) => {
    const currentStatus = seatStatus.get(flightId) || {};
    const seatInfo = currentStatus[seatId];

    if (!seatInfo) {
      return {
        status: 'available',
        passengerId: null,
        occupiedBy: null
      };
    }

    return {
      status: seatInfo.status,
      passengerId: seatInfo.passengerId,
      occupiedBy: seatInfo.occupiedBy,
      bookedAt: seatInfo.bookedAt,
      gender: seatInfo.gender
    };
  },

  // Highlight special seats
  highlightSpecialSeats: (flightId) => {
    try {
      const flight = flightSearch.getFlightById(flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }

      const specialSeats = {
        extraLegroom: [],
        emergencyExit: [],
        premium: [],
        window: [],
        aisle: []
      };

      Object.keys(flight.seatMap).forEach(cabin => {
        flight.seatMap[cabin].forEach((row, rowIndex) => {
          row.forEach((seat, seatIndex) => {
            // Mark extra legroom seats (first few rows and exit rows)
            if (rowIndex < 3 || (rowIndex > 10 && rowIndex < 13)) {
              seat.type = 'extra_legroom';
              specialSeats.extraLegroom.push(seat.id);
            }

            // Mark emergency exit seats
            if (rowIndex === 12 || rowIndex === 13) {
              seat.type = 'emergency_exit';
              specialSeats.emergencyExit.push(seat.id);
            }

            // Mark window and aisle seats
            if (seatIndex === 0 || seatIndex === row.length - 1) {
              if (seat.type === 'standard') {
                seat.type = 'window';
              }
              specialSeats.window.push(seat.id);
            } else if (seatIndex === 2 || seatIndex === row.length - 3) {
              if (seat.type === 'standard') {
                seat.type = 'aisle';
              }
              specialSeats.aisle.push(seat.id);
            }
          });
        });
      });

      return {
        success: true,
        specialSeats
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update seat map (refresh after changes)
  updateSeatMap: (flightId) => {
    return seatSelection.getSeatMap(flightId);
  },

  // Get passenger seat assignments for a flight
  getPassengerAssignments: (flightId) => {
    const currentStatus = seatStatus.get(flightId) || {};
    const assignments = [];

    Object.keys(currentStatus).forEach(seatId => {
      const seatInfo = currentStatus[seatId];
      if (seatInfo.passengerId) {
        assignments.push({
          seatId,
          passengerId: seatInfo.passengerId,
          status: seatInfo.status,
          bookedAt: seatInfo.bookedAt,
          gender: seatInfo.gender
        });
      }
    });

    return assignments;
  },

  // Auto-assign seats for passengers
  autoAssignSeats: (flightId, passengers, travelClass, preferences = {}) => {
    try {
      const seatMap = seatSelection.getSeatMap(flightId);
      if (!seatMap.success) {
        throw new Error('Could not get seat map');
      }

      const assignments = [];
      const cabinSeats = seatMap.seatMap[travelClass] || [];
      
      // Flatten seats and filter available ones
      const availableSeats = [];
      cabinSeats.forEach(row => {
        row.forEach(seat => {
          if (seat.status === 'available') {
            availableSeats.push(seat);
          }
        });
      });

      // Sort seats by preference (aisle/window first, then by row)
      availableSeats.sort((a, b) => {
        if (preferences.seatType === 'aisle' && a.type === 'aisle' && b.type !== 'aisle') return -1;
        if (preferences.seatType === 'window' && a.type === 'window' && b.type !== 'window') return -1;
        return a.row - b.row;
      });

      // Assign seats to passengers
      passengers.forEach((passenger, index) => {
        if (index < availableSeats.length) {
          const seat = availableSeats[index];
          const assignment = seatSelection.assignSeat(flightId, passenger.id, seat.id, passenger);
          if (assignment.success) {
            assignments.push(assignment.assignment);
          }
        }
      });

      return {
        success: true,
        assignments
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get seat selection summary
  getSeatSelectionSummary: (flightId, passengerIds) => {
    const assignments = seatSelection.getPassengerAssignments(flightId);
    const passengerAssignments = assignments.filter(assignment => 
      passengerIds.includes(assignment.passengerId)
    );

    let totalUpgradeFee = 0;
    const seatDetails = [];

    passengerAssignments.forEach(assignment => {
      const seatMap = seatSelection.getSeatMap(flightId);
      if (seatMap.success) {
        // Find seat details in the seat map
        Object.keys(seatMap.seatMap).forEach(cabin => {
          seatMap.seatMap[cabin].forEach(row => {
            row.forEach(seat => {
              if (seat.id === assignment.seatId) {
                const upgradeFee = seat.price || 0;
                totalUpgradeFee += upgradeFee;
                seatDetails.push({
                  passengerId: assignment.passengerId,
                  seatId: assignment.seatId,
                  seatType: seat.type,
                  cabin,
                  upgradeFee
                });
              }
            });
          });
        });
      }
    });

    return {
      totalAssignments: passengerAssignments.length,
      totalUpgradeFee,
      seatDetails,
      assignments: passengerAssignments
    };
  }
};

module.exports = seatSelection;


