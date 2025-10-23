const express = require('express');
const router = express.Router();

// Import modules
const flightSearch = require('../modules/flightSearch');
const multiCitySearch = require('../modules/multiCitySearch');
const seatSelection = require('../modules/seatSelection');
const fareCalculation = require('../modules/fareCalculation');
const bookingConfirmation = require('../modules/bookingConfirmation');
const promoSystem = require('../modules/promoSystem');
const { airports, countries } = require('../data/airports');

// Airport and Country Data Routes
router.get('/airports', (req, res) => {
  try {
    const { search } = req.query;
    let filteredAirports = Object.values(airports);
    
    if (search) {
      const searchTerm = search.toLowerCase();
      filteredAirports = filteredAirports.filter(airport => 
        airport.name.toLowerCase().includes(searchTerm) ||
        airport.city.toLowerCase().includes(searchTerm) ||
        airport.country.toLowerCase().includes(searchTerm) ||
        airport.code.toLowerCase().includes(searchTerm)
      );
    }
    
    res.json({
      success: true,
      airports: filteredAirports.slice(0, 20) // Limit to 20 results
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/countries', (req, res) => {
  try {
    res.json({
      success: true,
      countries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Flight Search Routes
router.post('/search', async (req, res) => {
  try {
    const { origin, destination, departureDate, returnDate, passengers, travelClass, tripType } = req.body;
    
    const result = await flightSearch.searchFlights(
      origin, 
      destination, 
      departureDate, 
      returnDate, 
      passengers, 
      travelClass, 
      tripType
    );
    
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get flight by ID
router.get('/flight/:flightId', (req, res) => {
  try {
    const { flightId } = req.params;
    const flight = flightSearch.getFlightById(flightId);
    
    if (!flight) {
      return res.status(404).json({
        success: false,
        error: 'Flight not found'
      });
    }
    
    res.json({
      success: true,
      flight
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Multi-city Search Routes
router.post('/multi-city/search', async (req, res) => {
  try {
    const { segments } = req.body;
    const result = await multiCitySearch.buildMultiCityItinerary(segments);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/multi-city/validate', (req, res) => {
  try {
    const { segments } = req.body;
    const result = multiCitySearch.validateSegments(segments);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Seat Selection Routes
router.get('/seat-map/:flightId', (req, res) => {
  try {
    const { flightId } = req.params;
    const result = seatSelection.getSeatMap(flightId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/seat/assign', (req, res) => {
  try {
    const { flightId, passengerId, seatId, passengerInfo } = req.body;
    const result = seatSelection.assignSeat(flightId, passengerId, seatId, passengerInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/seat/swap', (req, res) => {
  try {
    const { flightId, passengerId, newSeatId, passengerInfo } = req.body;
    const result = seatSelection.swapSeat(flightId, passengerId, newSeatId, passengerInfo);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/seat/status/:flightId/:seatId', (req, res) => {
  try {
    const { flightId, seatId } = req.params;
    const result = seatSelection.getSeatStatus(flightId, seatId);
    res.json({
      success: true,
      seatStatus: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/seat/auto-assign', (req, res) => {
  try {
    const { flightId, passengers, travelClass, preferences } = req.body;
    const result = seatSelection.autoAssignSeats(flightId, passengers, travelClass, preferences);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Fare Calculation Routes
router.post('/fare/calculate', (req, res) => {
  try {
    const { flightId, passengers, selectedSeats, promoCode } = req.body;
    const result = fareCalculation.getTotalFare(flightId, passengers, selectedSeats, promoCode);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/fare/base', (req, res) => {
  try {
    const { flightId, travelClass, passengers } = req.body;
    const result = fareCalculation.calculateBaseFare(flightId, travelClass, passengers);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/fare/seat-upgrade', (req, res) => {
  try {
    const { flightId, seatId, travelClass } = req.body;
    const result = fareCalculation.calculateSeatUpgradeFare(flightId, seatId, travelClass);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/fare/comparison/:flightId/:passengers', (req, res) => {
  try {
    const { flightId, passengers } = req.params;
    const result = fareCalculation.getFareComparison(flightId, parseInt(passengers));
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Booking Confirmation Routes
router.post('/confirm', async (req, res) => {
  try {
    const { passengerData, flightIds, selectedSeats, paymentInfo, promoCode } = req.body;
    const result = await bookingConfirmation.confirmBooking(
      passengerData, 
      flightIds, 
      selectedSeats, 
      paymentInfo, 
      promoCode
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/booking/:pnr', (req, res) => {
  try {
    const { pnr } = req.params;
    const result = bookingConfirmation.retrieveBooking(pnr);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/booking/:bookingId/summary', (req, res) => {
  try {
    const { bookingId } = req.params;
    const result = bookingConfirmation.getBookingSummary(bookingId);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/booking/:pnr/cancel', (req, res) => {
  try {
    const { pnr } = req.params;
    const result = bookingConfirmation.cancelBooking(pnr);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.put('/booking/:pnr', (req, res) => {
  try {
    const { pnr } = req.params;
    const { updates } = req.body;
    const result = bookingConfirmation.updateBooking(pnr, updates);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// E-ticket Routes
router.post('/eticket/generate/:bookingId', async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { format = 'PDF' } = req.body;
    const result = await bookingConfirmation.issueETicket(bookingId, format);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/eticket/email', async (req, res) => {
  try {
    const { email, ticketFile, bookingData } = req.body;
    const result = await bookingConfirmation.sendETicketByEmail(email, ticketFile, bookingData);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Promo Code Routes
router.post('/promo/validate', (req, res) => {
  try {
    const { code, bookingDetails } = req.body;
    const result = promoSystem.validatePromoCode(code, bookingDetails);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/promo/apply', (req, res) => {
  try {
    const { code, bookingId, totalAmount } = req.body;
    const result = promoSystem.applyPromoCode(code, bookingId, totalAmount);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/promo/discount/:code/:totalFare', (req, res) => {
  try {
    const { code, totalFare } = req.params;
    const { bookingDetails } = req.query;
    const result = promoSystem.getDiscountAmount(code, parseFloat(totalFare), bookingDetails);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/promo/active', (req, res) => {
  try {
    const result = promoSystem.getActivePromoCodes();
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Gift Card Routes
router.post('/gift-card/generate', (req, res) => {
  try {
    const { amount, purchaserEmail, recipientEmail, message } = req.body;
    const result = promoSystem.generateGiftCard(amount, purchaserEmail, recipientEmail, message);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/gift-card/validate', (req, res) => {
  try {
    const { code } = req.body;
    const result = promoSystem.validateGiftCard(code);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.get('/gift-card/balance/:code', (req, res) => {
  try {
    const { code } = req.params;
    const result = promoSystem.getGiftCardBalance(code);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

router.post('/gift-card/apply', (req, res) => {
  try {
    const { code, bookingId, amount } = req.body;
    const result = promoSystem.applyGiftCard(code, bookingId, amount);
    res.json(result);
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
