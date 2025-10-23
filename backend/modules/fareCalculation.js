const flightSearch = require('./flightSearch');
const seatSelection = require('./seatSelection');

// Fare Calculation Functions
const fareCalculation = {
  // Calculate base fare for flight and passengers
  calculateBaseFare: (flightId, travelClass, passengers) => {
    try {
      const flight = flightSearch.getFlightById(flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }

      const baseFarePerPerson = flight.getBaseFare(travelClass);
      const totalBaseFare = baseFarePerPerson * passengers;

      return {
        success: true,
        baseFarePerPerson,
        passengers,
        totalBaseFare,
        currency: 'USD'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Calculate taxes and surcharges
  calculateTaxesAndSurcharges: (flightId, passengers = 1) => {
    try {
      const flight = flightSearch.getFlightById(flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }

      const taxesPerPerson = flight.taxes;
      const surchargesPerPerson = flight.surcharges;
      
      const totalTaxes = taxesPerPerson * passengers;
      const totalSurcharges = surchargesPerPerson * passengers;
      const totalTaxesAndSurcharges = totalTaxes + totalSurcharges;

      return {
        success: true,
        breakdown: {
          taxesPerPerson,
          surchargesPerPerson,
          totalTaxes,
          totalSurcharges,
          totalTaxesAndSurcharges
        },
        passengers,
        currency: 'USD'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Calculate seat upgrade fare
  calculateSeatUpgradeFare: (flightId, seatId, travelClass) => {
    try {
      const seatMap = seatSelection.getSeatMap(flightId);
      if (!seatMap.success) {
        throw new Error('Could not get seat map');
      }

      let seatInfo = null;
      let cabin = null;

      // Find the seat in the seat map
      Object.keys(seatMap.seatMap).forEach(cabinName => {
        seatMap.seatMap[cabinName].forEach(row => {
          row.forEach(seat => {
            if (seat.id === seatId) {
              seatInfo = seat;
              cabin = cabinName;
            }
          });
        });
      });

      if (!seatInfo) {
        throw new Error('Seat not found');
      }

      const upgradeFee = seatSelection.getSeatPrice(seatInfo, cabin);

      return {
        success: true,
        seatId,
        seatType: seatInfo.type,
        cabin,
        upgradeFee,
        currency: 'USD'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get total fare for booking
  getTotalFare: (flightId, passengers, selectedSeats = [], promoCode = null) => {
    try {
      const flight = flightSearch.getFlightById(flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }

      // Determine travel class from first selected seat or default to economy
      let travelClass = 'economy';
      if (selectedSeats.length > 0) {
        const seatMap = seatSelection.getSeatMap(flightId);
        if (seatMap.success) {
          // Find cabin of first selected seat
          Object.keys(seatMap.seatMap).forEach(cabin => {
            seatMap.seatMap[cabin].forEach(row => {
              row.forEach(seat => {
                if (seat.id === selectedSeats[0].seatId) {
                  travelClass = cabin;
                }
              });
            });
          });
        }
      }

      // Calculate base fare
      const baseFareResult = fareCalculation.calculateBaseFare(flightId, travelClass, passengers.length);
      if (!baseFareResult.success) {
        throw new Error(baseFareResult.error);
      }

      // Calculate taxes and surcharges
      const taxesResult = fareCalculation.calculateTaxesAndSurcharges(flightId, passengers.length);
      if (!taxesResult.success) {
        throw new Error(taxesResult.error);
      }

      // Calculate seat upgrade fees
      let totalSeatUpgrades = 0;
      const seatUpgradeDetails = [];

      selectedSeats.forEach(seatSelection => {
        const upgradeResult = fareCalculation.calculateSeatUpgradeFare(flightId, seatSelection.seatId, travelClass);
        if (upgradeResult.success) {
          totalSeatUpgrades += upgradeResult.upgradeFee;
          seatUpgradeDetails.push({
            passengerId: seatSelection.passengerId,
            seatId: seatSelection.seatId,
            seatType: upgradeResult.seatType,
            upgradeFee: upgradeResult.upgradeFee
          });
        }
      });

      // Calculate subtotal
      const subtotal = baseFareResult.totalBaseFare + taxesResult.breakdown.totalTaxesAndSurcharges + totalSeatUpgrades;

      // Apply promo code discount
      let discount = 0;
      let promoDetails = null;
      if (promoCode) {
        const promoResult = fareCalculation.applyPromoDiscount(subtotal, promoCode);
        if (promoResult.success) {
          discount = promoResult.discount;
          promoDetails = promoResult.promoDetails;
        }
      }

      // Calculate final total
      const totalFare = Math.max(0, subtotal - discount);

      return {
        success: true,
        fareBreakdown: {
          baseFare: baseFareResult.totalBaseFare,
          taxes: taxesResult.breakdown.totalTaxes,
          surcharges: taxesResult.breakdown.totalSurcharges,
          seatUpgrades: totalSeatUpgrades,
          subtotal,
          discount,
          totalFare
        },
        seatUpgradeDetails,
        promoDetails,
        passengers: passengers.length,
        currency: 'USD'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Apply promo code discount
  applyPromoDiscount: (subtotal, promoCode) => {
    // Mock promo codes (in production, this would come from database)
    const promoCodes = {
      'WELCOME10': { type: 'percentage', value: 10, minAmount: 100, maxDiscount: 200, description: 'Welcome 10% off' },
      'SAVE50': { type: 'fixed', value: 50, minAmount: 200, maxDiscount: 50, description: 'Save $50' },
      'LUXURY20': { type: 'percentage', value: 20, minAmount: 1000, maxDiscount: 500, description: 'Luxury 20% off' },
      'FIRSTCLASS': { type: 'percentage', value: 15, minAmount: 2000, maxDiscount: 1000, description: 'First Class 15% off' }
    };

    const promo = promoCodes[promoCode.toUpperCase()];
    if (!promo) {
      return {
        success: false,
        error: 'Invalid promo code'
      };
    }

    if (subtotal < promo.minAmount) {
      return {
        success: false,
        error: `Minimum amount of $${promo.minAmount} required for this promo code`
      };
    }

    let discount = 0;
    if (promo.type === 'percentage') {
      discount = Math.min((subtotal * promo.value) / 100, promo.maxDiscount);
    } else if (promo.type === 'fixed') {
      discount = Math.min(promo.value, promo.maxDiscount);
    }

    return {
      success: true,
      discount: Math.round(discount * 100) / 100, // Round to 2 decimal places
      promoDetails: {
        code: promoCode.toUpperCase(),
        description: promo.description,
        type: promo.type,
        value: promo.value,
        appliedDiscount: discount
      }
    };
  },

  // Update fare when selection changes
  updateFareOnSelectionChange: (bookingData) => {
    try {
      const { flightId, passengers, selectedSeats, promoCode } = bookingData;
      
      return fareCalculation.getTotalFare(flightId, passengers, selectedSeats, promoCode);
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Calculate fare for multiple flights (round-trip or multi-city)
  calculateMultiFlightFare: (flights, passengers, seatSelections = [], promoCode = null) => {
    try {
      let totalBaseFare = 0;
      let totalTaxes = 0;
      let totalSurcharges = 0;
      let totalSeatUpgrades = 0;
      const flightBreakdowns = [];

      flights.forEach((flightInfo, index) => {
        const { flightId, travelClass } = flightInfo;
        const flightSeats = seatSelections.filter(seat => seat.flightId === flightId);

        // Calculate fare for this flight
        const fareResult = fareCalculation.getTotalFare(flightId, passengers, flightSeats);
        if (fareResult.success) {
          totalBaseFare += fareResult.fareBreakdown.baseFare;
          totalTaxes += fareResult.fareBreakdown.taxes;
          totalSurcharges += fareResult.fareBreakdown.surcharges;
          totalSeatUpgrades += fareResult.fareBreakdown.seatUpgrades;

          flightBreakdowns.push({
            flightIndex: index + 1,
            flightId,
            travelClass,
            fareBreakdown: fareResult.fareBreakdown
          });
        }
      });

      const subtotal = totalBaseFare + totalTaxes + totalSurcharges + totalSeatUpgrades;

      // Apply promo code discount
      let discount = 0;
      let promoDetails = null;
      if (promoCode) {
        const promoResult = fareCalculation.applyPromoDiscount(subtotal, promoCode);
        if (promoResult.success) {
          discount = promoResult.discount;
          promoDetails = promoResult.promoDetails;
        }
      }

      const totalFare = Math.max(0, subtotal - discount);

      return {
        success: true,
        fareBreakdown: {
          baseFare: totalBaseFare,
          taxes: totalTaxes,
          surcharges: totalSurcharges,
          seatUpgrades: totalSeatUpgrades,
          subtotal,
          discount,
          totalFare
        },
        flightBreakdowns,
        promoDetails,
        passengers: passengers.length,
        currency: 'USD'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get fare comparison for different classes
  getFareComparison: (flightId, passengers) => {
    try {
      const flight = flightSearch.getFlightById(flightId);
      if (!flight) {
        throw new Error('Flight not found');
      }

      const classes = ['economy', 'premium', 'business', 'first'];
      const comparison = {};

      classes.forEach(travelClass => {
        if (flight.availableSeats[travelClass] > 0) {
          const fareResult = fareCalculation.getTotalFare(flightId, passengers, [], null);
          if (fareResult.success) {
            comparison[travelClass] = {
              baseFare: flight.getBaseFare(travelClass) * passengers.length,
              totalFare: flight.getTotalFare(travelClass, passengers.length),
              availableSeats: flight.availableSeats[travelClass],
              savings: travelClass === 'economy' ? 0 : 
                      flight.getTotalFare('economy', passengers.length) - flight.getTotalFare(travelClass, passengers.length)
            };
          }
        }
      });

      return {
        success: true,
        comparison,
        currency: 'USD'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
};

module.exports = fareCalculation;


