// Flight Model - Data structure for flights
class Flight {
  constructor(data) {
    this.id = data.id;
    this.flightNumber = data.flightNumber;
    this.airline = data.airline;
    this.aircraft = data.aircraft;
    this.origin = data.origin;
    this.destination = data.destination;
    this.departureTime = data.departureTime;
    this.arrivalTime = data.arrivalTime;
    this.duration = data.duration;
    this.date = data.date;
    this.availableSeats = data.availableSeats || {};
    this.baseFares = data.baseFares || {};
    this.taxes = data.taxes || 0;
    this.surcharges = data.surcharges || 0;
    this.amenities = data.amenities || [];
    this.status = data.status || 'active';
    this.seatMap = data.seatMap || {};
  }

  // Get available seats for a specific class
  getAvailableSeats(travelClass) {
    return this.availableSeats[travelClass] || 0;
  }

  // Get base fare for a specific class
  getBaseFare(travelClass) {
    return this.baseFares[travelClass] || 0;
  }

  // Check if flight has enough seats
  hasAvailableSeats(travelClass, passengerCount) {
    return this.getAvailableSeats(travelClass) >= passengerCount;
  }

  // Update available seats
  updateAvailableSeats(travelClass, count) {
    if (!this.availableSeats[travelClass]) {
      this.availableSeats[travelClass] = 0;
    }
    this.availableSeats[travelClass] = Math.max(0, this.availableSeats[travelClass] + count);
  }

  // Get total fare including taxes and surcharges
  getTotalFare(travelClass, passengerCount = 1) {
    const baseFare = this.getBaseFare(travelClass) * passengerCount;
    const totalTaxes = this.taxes * passengerCount;
    const totalSurcharges = this.surcharges * passengerCount;
    return baseFare + totalTaxes + totalSurcharges;
  }
}

module.exports = Flight;


