const Booking = require('../models/Booking');
const flightSearch = require('./flightSearch');
const seatSelection = require('./seatSelection');
const fareCalculation = require('./fareCalculation');
const crypto = require('crypto');
const fs = require('fs').promises;
const path = require('path');

// In-memory booking storage (in production, this would be in a database)
const bookings = new Map();

// Booking Confirmation Functions
const bookingConfirmation = {
  // Generate unique PNR (Passenger Name Record)
  generatePNR: () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let pnr = '';
    for (let i = 0; i < 6; i++) {
      pnr += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    
    // Ensure PNR is unique
    if (bookings.has(pnr)) {
      return bookingConfirmation.generatePNR();
    }
    
    return pnr;
  },

  // Confirm booking
  confirmBooking: async (passengerData, flightIds, selectedSeats, paymentInfo, promoCode = null) => {
    try {
      // Validate input data
      const validation = bookingConfirmation.validateBookingData(passengerData, flightIds, paymentInfo);
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '));
      }

      // Generate unique booking ID and PNR
      const bookingId = crypto.randomUUID();
      const pnr = bookingConfirmation.generatePNR();

      // Create booking object
      const booking = new Booking({
        id: bookingId,
        pnr: pnr,
        status: 'pending'
      });

      // Add passengers
      passengerData.forEach(passenger => {
        booking.addPassenger(passenger);
      });

      // Add flights
      const flights = [];
      for (const flightInfo of flightIds) {
        const flight = flightSearch.getFlightById(flightInfo.flightId);
        if (!flight) {
          throw new Error(`Flight ${flightInfo.flightId} not found`);
        }
        
        booking.addFlight(flight, flightInfo.travelClass);
        flights.push({ flight, travelClass: flightInfo.travelClass });
      }

      // Process seat selections
      selectedSeats.forEach(seatInfo => {
        const passenger = passengerData.find(p => p.id === seatInfo.passengerId);
        if (passenger) {
          // Assign seat
          const seatResult = seatSelection.assignSeat(
            seatInfo.flightId, 
            seatInfo.passengerId, 
            seatInfo.seatId, 
            passenger
          );
          
          if (seatResult.success) {
            // Calculate seat upgrade fee
            const upgradeResult = fareCalculation.calculateSeatUpgradeFare(
              seatInfo.flightId, 
              seatInfo.seatId, 
              seatInfo.travelClass || 'economy'
            );
            
            booking.addSeatAssignment(
              seatInfo.passengerId,
              seatInfo.flightId,
              seatInfo.seatId,
              upgradeResult.success ? upgradeResult.seatType : 'standard',
              upgradeResult.success ? upgradeResult.upgradeFee : 0
            );
          }
        }
      });

      // Calculate total fare
      const fareResult = fareCalculation.getTotalFare(
        flightIds[0].flightId, 
        passengerData, 
        selectedSeats, 
        promoCode
      );

      if (fareResult.success) {
        booking.totalFare = fareResult.fareBreakdown.totalFare;
        booking.fareBreakdown = fareResult.fareBreakdown;
        booking.promoCode = promoCode;
        booking.discount = fareResult.fareBreakdown.discount;
      }

      // Store payment information (in production, this would be encrypted)
      booking.paymentInfo = {
        method: paymentInfo.method,
        last4: paymentInfo.cardNumber ? paymentInfo.cardNumber.slice(-4) : null,
        transactionId: crypto.randomUUID(),
        processedAt: new Date()
      };

      // Set contact information
      booking.contactInfo = {
        email: passengerData[0].email,
        phone: passengerData[0].phone,
        emergencyContact: passengerData[0].emergencyContact
      };

      // Confirm the booking
      booking.confirm();

      // Update flight availability
      flightIds.forEach(flightInfo => {
        flightSearch.updateFlightAvailability(
          flightInfo.flightId, 
          flightInfo.travelClass, 
          passengerData.length
        );
      });

      // Store booking
      bookings.set(pnr, booking);
      bookings.set(bookingId, booking); // Also store by ID for quick lookup

      // Generate e-ticket
      const eTicketResult = await bookingConfirmation.issueETicket(bookingId, 'PDF');

      return {
        success: true,
        booking: {
          id: bookingId,
          pnr: pnr,
          status: booking.status,
          totalFare: booking.totalFare,
          fareBreakdown: booking.fareBreakdown,
          passengers: booking.passengers,
          flights: booking.flights,
          seats: booking.seats,
          bookingDate: booking.bookingDate,
          eTicketGenerated: eTicketResult.success,
          eTicketPath: eTicketResult.success ? eTicketResult.filePath : null
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Validate booking data
  validateBookingData: (passengerData, flightIds, paymentInfo) => {
    const errors = [];

    // Validate passengers
    if (!passengerData || !Array.isArray(passengerData) || passengerData.length === 0) {
      errors.push('At least one passenger is required');
    } else {
      passengerData.forEach((passenger, index) => {
        if (!passenger.firstName || passenger.firstName.trim().length < 2) {
          errors.push(`Passenger ${index + 1}: First name is required (minimum 2 characters)`);
        }
        if (!passenger.lastName || passenger.lastName.trim().length < 2) {
          errors.push(`Passenger ${index + 1}: Last name is required (minimum 2 characters)`);
        }
        if (!passenger.dateOfBirth) {
          errors.push(`Passenger ${index + 1}: Date of birth is required`);
        }
        if (!passenger.email || !passenger.email.includes('@')) {
          errors.push(`Passenger ${index + 1}: Valid email is required`);
        }
        if (!passenger.phone || passenger.phone.length < 10) {
          errors.push(`Passenger ${index + 1}: Valid phone number is required`);
        }
      });
    }

    // Validate flights
    if (!flightIds || !Array.isArray(flightIds) || flightIds.length === 0) {
      errors.push('At least one flight is required');
    } else {
      flightIds.forEach((flightInfo, index) => {
        if (!flightInfo.flightId) {
          errors.push(`Flight ${index + 1}: Flight ID is required`);
        }
        if (!flightInfo.travelClass) {
          errors.push(`Flight ${index + 1}: Travel class is required`);
        }
      });
    }

    // Validate payment info
    if (!paymentInfo) {
      errors.push('Payment information is required');
    } else {
      if (!paymentInfo.method) {
        errors.push('Payment method is required');
      }
      if (paymentInfo.method === 'card') {
        if (!paymentInfo.cardNumber || paymentInfo.cardNumber.length < 13) {
          errors.push('Valid card number is required');
        }
        if (!paymentInfo.expiryMonth || !paymentInfo.expiryYear) {
          errors.push('Card expiry date is required');
        }
        if (!paymentInfo.cvv || paymentInfo.cvv.length < 3) {
          errors.push('Valid CVV is required');
        }
        if (!paymentInfo.cardholderName || paymentInfo.cardholderName.trim().length < 2) {
          errors.push('Cardholder name is required');
        }
      }
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  },

  // Issue e-ticket
  issueETicket: async (bookingId, format = 'PDF') => {
    try {
      const booking = bookings.get(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      // Generate e-ticket content
      const eTicketData = bookingConfirmation.generateETicketData(booking);
      
      // Create e-ticket file
      const fileName = `eticket_${booking.pnr}_${Date.now()}.${format.toLowerCase()}`;
      const filePath = path.join(__dirname, '../tickets', fileName);
      
      // Ensure tickets directory exists
      await fs.mkdir(path.dirname(filePath), { recursive: true });

      if (format.toUpperCase() === 'PDF') {
        // In production, you would use a PDF library like puppeteer or jsPDF
        const pdfContent = bookingConfirmation.generatePDFContent(eTicketData);
        await fs.writeFile(filePath, pdfContent);
      } else {
        // JSON format for development
        await fs.writeFile(filePath, JSON.stringify(eTicketData, null, 2));
      }

      // Update booking with e-ticket info
      booking.eTicketGenerated = true;
      booking.eTicketPath = filePath;

      return {
        success: true,
        filePath,
        fileName,
        eTicketData
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Generate e-ticket data
  generateETicketData: (booking) => {
    return {
      pnr: booking.pnr,
      bookingId: booking.id,
      issueDate: new Date().toISOString(),
      status: booking.status,
      passengers: booking.passengers.map(passenger => ({
        name: `${passenger.title || ''} ${passenger.firstName} ${passenger.lastName}`.trim(),
        dateOfBirth: passenger.dateOfBirth,
        nationality: passenger.nationality,
        passportNumber: passenger.passportNumber
      })),
      flights: booking.flights.map(flight => ({
        flightNumber: flight.flightNumber,
        route: `${flight.origin} → ${flight.destination}`,
        date: flight.date,
        departureTime: flight.departureTime,
        arrivalTime: flight.arrivalTime,
        travelClass: flight.travelClass
      })),
      seats: booking.seats.map(seat => ({
        passengerId: seat.passengerId,
        flightId: seat.flightId,
        seatNumber: seat.seatNumber,
        seatType: seat.seatType
      })),
      fareBreakdown: booking.fareBreakdown,
      totalFare: booking.totalFare,
      currency: 'USD',
      contactInfo: booking.contactInfo,
      specialInstructions: [
        'Please arrive at the airport at least 2 hours before domestic flights and 3 hours before international flights.',
        'Valid government-issued photo ID required for all passengers.',
        'Check-in online or at the airport kiosks for faster service.',
        'Baggage allowances and restrictions apply - check airline policy.'
      ],
      qrCode: bookingConfirmation.generateQRCode(booking.pnr),
      barcode: bookingConfirmation.generateBarcode(booking.pnr)
    };
  },

  // Generate PDF content (simplified - in production use proper PDF library)
  generatePDFContent: (eTicketData) => {
    return `
E-TICKET - ${eTicketData.pnr}
========================

Issue Date: ${new Date(eTicketData.issueDate).toLocaleDateString()}
Status: ${eTicketData.status.toUpperCase()}

PASSENGERS:
${eTicketData.passengers.map(p => `- ${p.name}`).join('\n')}

FLIGHTS:
${eTicketData.flights.map(f => `${f.flightNumber}: ${f.route} on ${f.date} at ${f.departureTime} (${f.travelClass})`).join('\n')}

SEATS:
${eTicketData.seats.map(s => `Seat ${s.seatNumber} (${s.seatType})`).join('\n')}

FARE BREAKDOWN:
Base Fare: $${eTicketData.fareBreakdown.baseFare}
Taxes: $${eTicketData.fareBreakdown.taxes}
Surcharges: $${eTicketData.fareBreakdown.surcharges}
Seat Upgrades: $${eTicketData.fareBreakdown.seatUpgrades}
Discount: -$${eTicketData.fareBreakdown.discount}
TOTAL: $${eTicketData.totalFare}

CONTACT: ${eTicketData.contactInfo.email} | ${eTicketData.contactInfo.phone}

QR Code: ${eTicketData.qrCode}
Barcode: ${eTicketData.barcode}

${eTicketData.specialInstructions.join('\n')}
    `.trim();
  },

  // Generate QR code data
  generateQRCode: (pnr) => {
    return `SKYLUX:${pnr}:${Date.now()}`;
  },

  // Generate barcode data
  generateBarcode: (pnr) => {
    return `*${pnr}*${Date.now().toString().slice(-6)}*`;
  },

  // Send e-ticket by email
  sendETicketByEmail: async (email, ticketFile, bookingData) => {
    try {
      // In production, this would integrate with an email service like SendGrid, AWS SES, etc.
      console.log(`Sending e-ticket to ${email}`);
      console.log(`Ticket file: ${ticketFile}`);
      console.log(`Booking PNR: ${bookingData.pnr}`);

      // Mock email sending
      const emailData = {
        to: email,
        subject: `Your SkyLux Airlines E-Ticket - ${bookingData.pnr}`,
        body: `
Dear ${bookingData.passengers[0].firstName},

Thank you for choosing SkyLux Airlines!

Your booking has been confirmed. Please find your e-ticket attached.

Booking Details:
- PNR: ${bookingData.pnr}
- Total Fare: $${bookingData.totalFare}
- Flights: ${bookingData.flights.length}

Important Reminders:
- Check-in online 24 hours before departure
- Arrive at airport 2-3 hours before flight time
- Bring valid government-issued photo ID

For any assistance, contact us at support@skylux.com or call 1-800-SKYLUX.

Safe travels!
SkyLux Airlines Team
        `,
        attachments: [ticketFile],
        sentAt: new Date()
      };

      return {
        success: true,
        emailData,
        message: 'E-ticket sent successfully'
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Get booking summary
  getBookingSummary: (bookingId) => {
    try {
      const booking = bookings.get(bookingId);
      if (!booking) {
        throw new Error('Booking not found');
      }

      return {
        success: true,
        summary: {
          pnr: booking.pnr,
          status: booking.status,
          bookingDate: booking.bookingDate,
          totalFare: booking.totalFare,
          currency: 'USD',
          passengerCount: booking.passengers.length,
          flightCount: booking.flights.length,
          seatCount: booking.seats.length,
          contactEmail: booking.contactInfo.email,
          eTicketGenerated: booking.eTicketGenerated
        }
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Store booking data
  storeBookingData: (bookingDetails) => {
    const bookingId = bookingDetails.id || crypto.randomUUID();
    bookings.set(bookingId, bookingDetails);
    if (bookingDetails.pnr) {
      bookings.set(bookingDetails.pnr, bookingDetails);
    }
    return bookingId;
  },

  // Retrieve booking
  retrieveBooking: (pnr) => {
    const booking = bookings.get(pnr);
    if (!booking) {
      return {
        success: false,
        error: 'Booking not found'
      };
    }

    return {
      success: true,
      booking: {
        id: booking.id,
        pnr: booking.pnr,
        status: booking.status,
        passengers: booking.passengers,
        flights: booking.flights,
        seats: booking.seats,
        totalFare: booking.totalFare,
        fareBreakdown: booking.fareBreakdown,
        bookingDate: booking.bookingDate,
        contactInfo: booking.contactInfo,
        eTicketGenerated: booking.eTicketGenerated
      }
    };
  },

  // Cancel booking
  cancelBooking: (pnr) => {
    try {
      const booking = bookings.get(pnr);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Booking is already cancelled');
      }

      // Cancel the booking
      booking.cancel();

      // Free up seats
      booking.seats.forEach(seat => {
        seatSelection.markSeatAsAvailable(seat.flightId, seat.seatNumber);
      });

      // Update flight availability
      booking.flights.forEach(flight => {
        flightSearch.updateFlightAvailability(
          flight.flightId, 
          flight.travelClass, 
          booking.passengers.length
        );
      });

      return {
        success: true,
        message: 'Booking cancelled successfully',
        pnr: booking.pnr,
        refundAmount: booking.totalFare * 0.8 // 80% refund (example policy)
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Update booking
  updateBooking: (pnr, newDetails) => {
    try {
      const booking = bookings.get(pnr);
      if (!booking) {
        throw new Error('Booking not found');
      }

      if (booking.status === 'cancelled') {
        throw new Error('Cannot update cancelled booking');
      }

      // Update allowed fields
      const allowedUpdates = ['contactInfo', 'specialRequests'];
      Object.keys(newDetails).forEach(key => {
        if (allowedUpdates.includes(key)) {
          booking[key] = { ...booking[key], ...newDetails[key] };
        }
      });

      return {
        success: true,
        message: 'Booking updated successfully',
        pnr: booking.pnr
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  },

  // Log booking activity
  logBookingActivity: (action, bookingId, timestamp = new Date()) => {
    const logEntry = {
      action,
      bookingId,
      timestamp,
      id: crypto.randomUUID()
    };

    console.log('Booking Activity:', logEntry);
    
    // In production, this would be stored in a database or logging service
    return logEntry;
  }
};

module.exports = bookingConfirmation;


