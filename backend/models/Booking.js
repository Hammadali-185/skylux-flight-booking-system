// Booking Model - Data structure for bookings
class Booking {
  constructor(data) {
    this.id = data.id;
    this.pnr = data.pnr;
    this.passengers = data.passengers || [];
    this.flights = data.flights || [];
    this.seats = data.seats || [];
    this.totalFare = data.totalFare || 0;
    this.fareBreakdown = data.fareBreakdown || {};
    this.paymentInfo = data.paymentInfo || {};
    this.promoCode = data.promoCode || null;
    this.discount = data.discount || 0;
    this.status = data.status || 'pending'; // pending, confirmed, cancelled
    this.bookingDate = data.bookingDate || new Date();
    this.contactInfo = data.contactInfo || {};
    this.eTicketGenerated = data.eTicketGenerated || false;
    this.eTicketPath = data.eTicketPath || null;
  }

  // Add passenger to booking
  addPassenger(passenger) {
    this.passengers.push({
      id: passenger.id,
      title: passenger.title,
      firstName: passenger.firstName,
      lastName: passenger.lastName,
      dateOfBirth: passenger.dateOfBirth,
      gender: passenger.gender,
      nationality: passenger.nationality,
      passportNumber: passenger.passportNumber,
      passportExpiry: passenger.passportExpiry,
      specialRequests: passenger.specialRequests || []
    });
  }

  // Add flight to booking
  addFlight(flight, travelClass) {
    this.flights.push({
      flightId: flight.id,
      flightNumber: flight.flightNumber,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: flight.departureTime,
      arrivalTime: flight.arrivalTime,
      date: flight.date,
      travelClass: travelClass,
      baseFare: flight.getBaseFare(travelClass)
    });
  }

  // Add seat assignment
  addSeatAssignment(passengerId, flightId, seatNumber, seatType = 'standard', upgradeFee = 0) {
    this.seats.push({
      passengerId,
      flightId,
      seatNumber,
      seatType,
      upgradeFee
    });
  }

  // Calculate total fare
  calculateTotalFare() {
    let total = 0;
    
    // Base fares
    this.flights.forEach(flight => {
      total += flight.baseFare * this.passengers.length;
    });

    // Seat upgrade fees
    this.seats.forEach(seat => {
      total += seat.upgradeFee;
    });

    // Apply discount
    total -= this.discount;

    this.totalFare = Math.max(0, total);
    return this.totalFare;
  }

  // Generate fare breakdown
  generateFareBreakdown() {
    const breakdown = {
      baseFare: 0,
      taxes: 0,
      surcharges: 0,
      seatUpgrades: 0,
      discount: this.discount,
      total: 0
    };

    this.flights.forEach(flight => {
      breakdown.baseFare += flight.baseFare * this.passengers.length;
    });

    this.seats.forEach(seat => {
      breakdown.seatUpgrades += seat.upgradeFee;
    });

    breakdown.total = breakdown.baseFare + breakdown.taxes + breakdown.surcharges + breakdown.seatUpgrades - breakdown.discount;
    
    this.fareBreakdown = breakdown;
    return breakdown;
  }

  // Confirm booking
  confirm() {
    this.status = 'confirmed';
    this.calculateTotalFare();
    this.generateFareBreakdown();
  }

  // Cancel booking
  cancel() {
    this.status = 'cancelled';
  }
}

module.exports = Booking;


