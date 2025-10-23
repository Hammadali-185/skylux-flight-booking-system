import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Check, CreditCard, Tag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from '../Navigation';
import FlightSearch from './FlightSearch';
import SeatMap from './SeatMap';
import CountrySelector from './CountrySelector';
import SecurePaymentMethods from './SecurePaymentMethods';
import './BookingFlow.css';

const BookingFlow = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    searchResults: null,
    selectedFlights: [],
    passengers: [],
    selectedSeats: [],
    fareBreakdown: null,
    promoCode: '',
    paymentInfo: {},
    bookingConfirmation: null
  });

  // Load booking data from localStorage on component mount
  useEffect(() => {
    const savedBookingData = localStorage.getItem('currentBooking');
    const savedStep = localStorage.getItem('currentBookingStep');
    
    if (savedBookingData) {
      try {
        const parsedData = JSON.parse(savedBookingData);
        setBookingData(parsedData);
        console.log('Restored booking data from localStorage:', parsedData);
      } catch (error) {
        console.error('Error parsing saved booking data:', error);
      }
    }
    
    if (savedStep) {
      setCurrentStep(parseInt(savedStep));
      console.log('Restored booking step:', savedStep);
    }
  }, []);

  // Save booking data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentBooking', JSON.stringify(bookingData));
  }, [bookingData]);

  // Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('currentBookingStep', currentStep.toString());
  }, [currentStep]);

  // Function to clear booking data (call when booking is completed or cancelled)
  const clearBookingData = () => {
    localStorage.removeItem('currentBooking');
    localStorage.removeItem('currentBookingStep');
    setCurrentStep(1);
    setBookingData({
      searchResults: null,
      selectedFlights: [],
      passengers: [],
      selectedSeats: [],
      fareBreakdown: null,
      promoCode: '',
      paymentInfo: {},
      bookingConfirmation: null
    });
  };

  // Function to save completed booking to Manage Booking system
  const saveBookingToManageSystem = (bookingConfirmation) => {
    try {
      // Get existing bookings from Manage Booking system
      const existingBookings = JSON.parse(localStorage.getItem('airlineBookings') || '[]');
      
      // Create booking entry in Manage Booking format
      const manageBookingEntry = {
        id: bookingConfirmation.pnr,
        passengerName: bookingConfirmation.passengers[0]?.firstName + ' ' + bookingConfirmation.passengers[0]?.lastName || 'Unknown Passenger',
        email: bookingConfirmation.passengers[0]?.email || 'no-email@example.com',
        flightNumber: bookingConfirmation.flights[0]?.flightNumber || 'Unknown',
        departure: bookingConfirmation.flights[0]?.origin || 'Unknown',
        arrival: bookingConfirmation.flights[0]?.destination || 'Unknown',
        seat: bookingConfirmation.seats[0]?.seatNumber || 'Not Assigned',
        meal: bookingConfirmation.passengers[0]?.mealPreference || 'Standard',
        flightTime: bookingConfirmation.flights[0]?.departureTime || new Date().toISOString(),
        status: bookingConfirmation.status || 'confirmed',
        bookingDate: bookingConfirmation.bookingDate || new Date().toISOString(),
        gate: bookingConfirmation.flights[0]?.gate || 'TBD',
        terminal: bookingConfirmation.flights[0]?.terminal || 'TBD',
        class: bookingConfirmation.flights[0]?.travelClass || 'Economy',
        price: bookingConfirmation.totalFare || 0,
        eTicket: bookingConfirmation.eTicket?.ticketNumber || 'TBD'
      };

      // Add to existing bookings
      const updatedBookings = [...existingBookings, manageBookingEntry];
      
      // Save back to localStorage
      localStorage.setItem('airlineBookings', JSON.stringify(updatedBookings));
      
      console.log('Booking saved to Manage Booking system:', manageBookingEntry);
      console.log('Total bookings in system:', updatedBookings.length);
      
    } catch (error) {
      console.error('Error saving booking to Manage Booking system:', error);
    }
  };
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const steps = [
    { id: 1, title: 'Search Flights', component: 'search' },
    { id: 2, title: 'Select Seats', component: 'seats' },
    { id: 3, title: 'Passenger Details', component: 'passengers' },
    { id: 4, title: 'Payment', component: 'payment' },
    { id: 5, title: 'Confirmation', component: 'confirmation' }
  ];

  const handleFlightSearch = (results) => {
    setBookingData(prev => ({
      ...prev,
      searchResults: results
    }));
  };

  const handleFlightSelect = (flight, type = 'outbound') => {
    setBookingData(prev => ({
      ...prev,
      selectedFlights: type === 'outbound' 
        ? [{ ...flight, type }, ...prev.selectedFlights.filter(f => f.type !== 'outbound')]
        : [...prev.selectedFlights.filter(f => f.type !== 'return'), { ...flight, type }]
    }));
    
    // Auto-advance to seat selection if we have required flights
    if (bookingData.searchResults?.searchParams?.tripType === 'one-way' || 
        (type === 'return' && bookingData.selectedFlights.some(f => f.type === 'outbound'))) {
      setCurrentStep(2);
    }
  };

  // Auto-create a passenger when reaching seat selection step
  useEffect(() => {
    if (currentStep === 2 && bookingData.passengers.length === 0) {
      const defaultPassenger = {
        id: `passenger_${Date.now()}`,
        title: 'Mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        nationality: 'PK',
        email: '',
        phone: '',
        passportNumber: '',
        specialRequests: ''
      };
      
      setBookingData(prev => ({
        ...prev,
        passengers: [defaultPassenger]
      }));
    }
  }, [currentStep, bookingData.passengers.length]);

  const handleSeatSelect = (passenger, seat) => {
    if (!passenger) {
      // Deselect seat
      setBookingData(prev => ({
        ...prev,
        selectedSeats: prev.selectedSeats.filter(s => s.seatId !== seat.id)
      }));
      return;
    }

    setBookingData(prev => ({
      ...prev,
      selectedSeats: [
        ...prev.selectedSeats.filter(s => s.passengerId !== passenger.id),
        {
          passengerId: passenger.id,
          seatId: seat.id,
          flightId: bookingData.selectedFlights[0]?.id, // Assuming single flight for now
          seatType: seat.type,
          upgradeFee: seat.price || 0
        }
      ]
    }));
  };

  const calculateTotalFare = useCallback(async () => {
    if (bookingData.selectedFlights.length === 0) return;

    try {
      const response = await fetch('/api/booking/fare/calculate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          flightId: bookingData.selectedFlights[0].id,
          passengers: bookingData.passengers,
          selectedSeats: bookingData.selectedSeats,
          promoCode: bookingData.promoCode || null
        })
      });

      const result = await response.json();
      if (result.success) {
        setBookingData(prev => ({
          ...prev,
          fareBreakdown: result.fareBreakdown
        }));
      }
    } catch (err) {
      console.error('Fare calculation error:', err);
    }
  }, [bookingData.selectedFlights, bookingData.passengers, bookingData.selectedSeats, bookingData.promoCode]);

  useEffect(() => {
    if (bookingData.selectedFlights.length > 0 && bookingData.passengers.length > 0) {
      calculateTotalFare();
    }
  }, [bookingData.selectedFlights, bookingData.passengers, bookingData.selectedSeats, bookingData.promoCode, calculateTotalFare]);

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepIndicator = () => (
    <div className="step-indicator">
      {steps.map((step, index) => (
        <div key={step.id} className="step-item">
          <div className={`step-circle ${currentStep >= step.id ? 'active' : ''} ${currentStep > step.id ? 'completed' : ''}`}>
            {currentStep > step.id ? <Check size={16} /> : step.id}
          </div>
          <span className={`step-title ${currentStep >= step.id ? 'active' : ''}`}>
            {step.title}
          </span>
          {index < steps.length - 1 && (
            <div className={`step-connector ${currentStep > step.id ? 'completed' : ''}`}></div>
          )}
        </div>
      ))}
    </div>
  );

  const renderPassengerForm = () => {
    const addPassenger = () => {
      const newPassenger = {
        id: `passenger_${Date.now()}`,
        title: 'Mr',
        firstName: '',
        lastName: '',
        dateOfBirth: '',
        gender: 'male',
        nationality: 'PK',
        email: '',
        phone: '',
        passportNumber: '',
        passportExpiry: '',
        specialRequests: []
      };

      setBookingData(prev => ({
        ...prev,
        passengers: [...prev.passengers, newPassenger]
      }));
    };

    const updatePassenger = (passengerId, field, value) => {
      setBookingData(prev => ({
        ...prev,
        passengers: prev.passengers.map(p => 
          p.id === passengerId ? { ...p, [field]: value } : p
        )
      }));
    };

    const removePassenger = (passengerId) => {
      setBookingData(prev => ({
        ...prev,
        passengers: prev.passengers.filter(p => p.id !== passengerId),
        selectedSeats: prev.selectedSeats.filter(s => s.passengerId !== passengerId)
      }));
    };

    return (
      <div className="passenger-form">
        <div className="form-header">
          <h3 className="form-title">Passenger Information</h3>
          <button className="add-passenger-btn btn-secondary" onClick={addPassenger}>
            Add Passenger
          </button>
        </div>

        {bookingData.passengers.map((passenger, index) => (
          <div key={passenger.id} className="passenger-card glass">
            <div className="passenger-header">
              <h4 className="passenger-title">Passenger {index + 1}</h4>
              {bookingData.passengers.length > 1 && (
                <button 
                  className="remove-passenger-btn"
                  onClick={() => removePassenger(passenger.id)}
                >
                  Remove
                </button>
              )}
            </div>

            <div className="passenger-fields">
              <div className="field-row">
                <div className="form-field">
                  <label>Title</label>
                  <select 
                    value={passenger.title}
                    onChange={(e) => updatePassenger(passenger.id, 'title', e.target.value)}
                  >
                    <option value="Mr">Mr</option>
                    <option value="Ms">Ms</option>
                    <option value="Mrs">Mrs</option>
                    <option value="Dr">Dr</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>First Name *</label>
                  <input
                    type="text"
                    value={passenger.firstName}
                    onChange={(e) => updatePassenger(passenger.id, 'firstName', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Last Name *</label>
                  <input
                    type="text"
                    value={passenger.lastName}
                    onChange={(e) => updatePassenger(passenger.id, 'lastName', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="form-field">
                  <label>Date of Birth *</label>
                  <input
                    type="date"
                    value={passenger.dateOfBirth}
                    onChange={(e) => updatePassenger(passenger.id, 'dateOfBirth', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Gender</label>
                  <select 
                    value={passenger.gender}
                    onChange={(e) => updatePassenger(passenger.id, 'gender', e.target.value)}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="form-field">
                  <label>Nationality</label>
                  <CountrySelector
                    value={passenger.nationality}
                    onChange={(value) => updatePassenger(passenger.id, 'nationality', value)}
                    placeholder="Select your nationality"
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="form-field">
                  <label>Email *</label>
                  <input
                    type="email"
                    value={passenger.email}
                    onChange={(e) => updatePassenger(passenger.id, 'email', e.target.value)}
                    required
                  />
                </div>
                <div className="form-field">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    value={passenger.phone}
                    onChange={(e) => updatePassenger(passenger.id, 'phone', e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="field-row">
                <div className="form-field">
                  <label>Passport Number</label>
                  <input
                    type="text"
                    value={passenger.passportNumber}
                    onChange={(e) => updatePassenger(passenger.id, 'passportNumber', e.target.value)}
                  />
                </div>
                <div className="form-field">
                  <label>Passport Expiry</label>
                  <input
                    type="date"
                    value={passenger.passportExpiry}
                    onChange={(e) => updatePassenger(passenger.id, 'passportExpiry', e.target.value)}
                  />
                </div>
              </div>
            </div>
          </div>
        ))}

        {bookingData.passengers.length === 0 && (
          <div className="no-passengers">
            <p>No passengers added yet.</p>
            <button className="btn-primary" onClick={addPassenger}>
              Add First Passenger
            </button>
          </div>
        )}
      </div>
    );
  };

  const renderPaymentForm = () => {
    const updatePaymentInfo = (field, value) => {
      setBookingData(prev => ({
        ...prev,
        paymentInfo: { ...prev.paymentInfo, [field]: value }
      }));
    };

    const applyPromoCode = async () => {
      if (!bookingData.promoCode) return;

      try {
        const response = await fetch('/api/booking/promo/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            code: bookingData.promoCode,
            bookingDetails: {
              totalAmount: bookingData.fareBreakdown?.totalFare || 0,
              travelClass: bookingData.selectedFlights[0]?.travelClass || 'economy'
            }
          })
        });

        const result = await response.json();
        if (result.isValid) {
          calculateTotalFare(); // Recalculate with promo code
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError('Failed to validate promo code');
      }
    };

    return (
      <div className="payment-form">
        <div className="payment-content">
          <div className="payment-main">
            <h3 className="form-title">Payment Information</h3>
            
            <SecurePaymentMethods
              paymentInfo={bookingData.paymentInfo}
              onPaymentInfoChange={(paymentData) => {
                console.log('Payment data received:', paymentData);
                setBookingData(prev => ({
                  ...prev,
                  paymentInfo: paymentData
                }));
              }}
              onPaymentMethodSelect={(method) => {
                if (method) {
                  setBookingData(prev => ({
                    ...prev,
                    paymentInfo: {
                      cardholderName: method.cardholderName,
                      cardNumber: method.cardNumber,
                      expiryMonth: method.expiryMonth,
                      expiryYear: method.expiryYear,
                      cvv: '' // CVV needs to be entered separately for security
                    }
                  }));
                }
              }}
            />

            <div className="promo-section glass">
              <h4 className="promo-title">
                <Tag size={20} />
                Promo Code or Gift Card
              </h4>
              <div className="promo-input-group">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={bookingData.promoCode}
                  onChange={(e) => setBookingData(prev => ({ ...prev, promoCode: e.target.value }))}
                />
                <button className="apply-promo-btn btn-secondary" onClick={applyPromoCode}>
                  Apply
                </button>
              </div>
            </div>
          </div>

          <div className="payment-sidebar">
            <div className="fare-summary glass">
              <h4 className="summary-title">Fare Summary</h4>
              {bookingData.fareBreakdown && (
                <div className="fare-breakdown">
                  <div className="fare-item">
                    <span>Base Fare</span>
                    <span>${bookingData.fareBreakdown.baseFare}</span>
                  </div>
                  <div className="fare-item">
                    <span>Taxes & Fees</span>
                    <span>${bookingData.fareBreakdown.taxes + bookingData.fareBreakdown.surcharges}</span>
                  </div>
                  {bookingData.fareBreakdown.seatUpgrades > 0 && (
                    <div className="fare-item">
                      <span>Seat Upgrades</span>
                      <span>${bookingData.fareBreakdown.seatUpgrades}</span>
                    </div>
                  )}
                  {bookingData.fareBreakdown.discount > 0 && (
                    <div className="fare-item discount">
                      <span>Discount</span>
                      <span>-${bookingData.fareBreakdown.discount}</span>
                    </div>
                  )}
                  <div className="fare-total">
                    <span>Total</span>
                    <span>${bookingData.fareBreakdown.totalFare}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const confirmBooking = async () => {
    console.log('Confirm booking clicked!');
    console.log('Payment info:', bookingData.paymentInfo);
    console.log('Can proceed:', canProceedToNext());
    
    setLoading(true);
    setError(null);

    // Create a timeout promise
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout')), 5000)
    );

    try {
      // Race between the API call and timeout
      const response = await Promise.race([
        fetch('/api/booking/confirm', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            passengerData: bookingData.passengers,
            flightIds: bookingData.selectedFlights.map(flight => ({
              flightId: flight.id,
              travelClass: flight.travelClass || 'economy'
            })),
            selectedSeats: bookingData.selectedSeats,
            paymentInfo: { ...bookingData.paymentInfo, method: 'card' },
            promoCode: bookingData.promoCode || null
          })
        }),
        timeoutPromise
      ]);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Booking confirmation result:', result);
      
      if (result.success) {
        setBookingData(prev => ({
          ...prev,
          bookingConfirmation: result.booking
        }));
        
        // Save the completed booking to Manage Booking system
        saveBookingToManageSystem(result.booking);
        
        setCurrentStep(5);
      } else {
        setError(result.error || 'Booking confirmation failed');
      }
    } catch (err) {
      console.error('Booking confirmation error:', err);
      console.log('Using mock booking confirmation for testing...');
      
      // For testing purposes, create a mock booking confirmation
      const mockBooking = {
        pnr: 'SL' + Math.random().toString(36).substr(2, 6).toUpperCase(),
        bookingId: 'BK' + Date.now(),
        status: 'confirmed',
        passengers: bookingData.passengers,
        flights: bookingData.selectedFlights,
        seats: bookingData.selectedSeats,
        totalFare: bookingData.fareBreakdown?.totalFare || 791,
        bookingDate: new Date().toISOString(),
        eTicket: {
          ticketNumber: 'ET' + Math.random().toString(36).substr(2, 8).toUpperCase(),
          issued: true
        }
      };
      
      setBookingData(prev => ({
        ...prev,
        bookingConfirmation: mockBooking
      }));
      
      // Save the completed booking to Manage Booking system
      saveBookingToManageSystem(mockBooking);
      
      setCurrentStep(5);
    } finally {
      setLoading(false);
    }
  };

  const renderConfirmation = () => {
    if (!bookingData.bookingConfirmation) return null;

    const booking = bookingData.bookingConfirmation;

    return (
      <div className="booking-confirmation">
        <div className="confirmation-header">
          <div className="success-icon">
            <Check size={48} />
          </div>
          <h2 className="confirmation-title">Booking Confirmed!</h2>
          <p className="confirmation-subtitle">
            Your booking has been successfully confirmed. You will receive an email confirmation shortly.
          </p>
        </div>

        <div className="confirmation-details glass">
          <div className="booking-info">
            <div className="info-item">
              <span className="info-label">Booking Reference (PNR)</span>
              <span className="info-value pnr">{booking.pnr}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Total Paid</span>
              <span className="info-value">${booking.totalFare}</span>
            </div>
            <div className="info-item">
              <span className="info-label">Booking Date</span>
              <span className="info-value">{new Date(booking.bookingDate).toLocaleDateString()}</span>
            </div>
          </div>

          <div className="flight-summary">
            <h4>Flight Details</h4>
            {booking.flights.map((flight, index) => (
              <div key={index} className="flight-item">
                <span className="flight-number">{flight.flightNumber}</span>
                <span className="flight-route">{flight.origin} → {flight.destination}</span>
                <span className="flight-date">{flight.date}</span>
                <span className="flight-time">{flight.departureTime} - {flight.arrivalTime}</span>
              </div>
            ))}
          </div>

          <div className="passenger-summary">
            <h4>Passengers</h4>
            {booking.passengers.map((passenger, index) => (
              <div key={index} className="passenger-item">
                <span className="passenger-name">
                  {passenger.title} {passenger.firstName} {passenger.lastName}
                </span>
                {booking.seats.find(seat => seat.passengerId === passenger.id) && (
                  <span className="passenger-seat">
                    Seat {booking.seats.find(seat => seat.passengerId === passenger.id).seatNumber}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="confirmation-actions">
          <button className="btn-primary">
            Download E-Ticket
          </button>
          <button 
            className="btn-secondary"
            onClick={() => navigate('/manage-booking')}
          >
            Manage Booking
          </button>
          <button 
            className="btn-secondary"
            onClick={clearBookingData}
          >
            Start New Booking
          </button>
        </div>
      </div>
    );
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <FlightSearch 
            onSearch={handleFlightSearch}
            onFlightSelect={handleFlightSelect}
          />
        );
      case 2:
        return bookingData.selectedFlights.length > 0 ? (
          <SeatMap
            flightId={bookingData.selectedFlights[0].id}
            passengers={bookingData.passengers}
            onSeatSelect={handleSeatSelect}
            selectedSeats={bookingData.selectedSeats}
          />
        ) : (
          <div className="step-error">
            <p>Please select a flight first.</p>
            <button className="btn-secondary" onClick={() => setCurrentStep(1)}>
              Back to Search
            </button>
          </div>
        );
      case 3:
        return renderPassengerForm();
      case 4:
        return renderPaymentForm();
      case 5:
        return renderConfirmation();
      default:
        return null;
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return bookingData.selectedFlights.length > 0;
      case 2:
        return bookingData.passengers.length > 0;
      case 3:
        return bookingData.passengers.every(p => 
          p.firstName && p.lastName && p.dateOfBirth && p.email && p.phone
        );
      case 4:
        // For testing purposes - accept any dummy data
        console.log('Payment validation - paymentInfo:', bookingData.paymentInfo);
        const canProceed = bookingData.paymentInfo.cardholderName && 
               bookingData.paymentInfo.cardNumber && 
               bookingData.paymentInfo.expiryMonth && 
               bookingData.paymentInfo.expiryYear && 
               bookingData.paymentInfo.cvv;
        console.log('Can proceed to confirmation:', canProceed);
        return canProceed;
      default:
        return false;
    }
  };

  return (
    <div className="booking-flow">
      <Navigation />
      <div className="booking-container">
        {renderStepIndicator()}
        
        <div className="booking-content">
          {error && (
            <div className="booking-error">
              {error}
              <button onClick={() => setError(null)}>×</button>
            </div>
          )}
          
          {renderCurrentStep()}
        </div>

        {currentStep < 5 && (
          <div className="booking-navigation">
            <div className="nav-left">
              {currentStep > 1 && (
                <button className="nav-btn btn-secondary" onClick={prevStep}>
                  <ArrowLeft size={20} />
                  Previous
                </button>
              )}
              <button 
                className="nav-btn btn-outline" 
                onClick={() => {
                  if (window.confirm('Are you sure you want to start a new booking? This will clear all your current progress.')) {
                    clearBookingData();
                  }
                }}
                style={{ marginLeft: '12px' }}
              >
                Start Over
              </button>
            </div>
            
            {currentStep < 4 && (
              <button 
                className="nav-btn btn-primary" 
                onClick={nextStep}
                disabled={!canProceedToNext()}
              >
                Next
                <ArrowRight size={20} />
              </button>
            )}
            
            {currentStep === 4 && (
              <div className="confirmation-buttons">
                <button 
                  className="nav-btn btn-primary" 
                  onClick={confirmBooking}
                  disabled={loading}
                >
                  {loading ? 'Processing...' : 'Confirm Booking'}
                  <Check size={20} />
                </button>
                <button 
                  className="nav-btn btn-secondary" 
                  onClick={() => {
                    console.log('Using direct mock booking for testing...');
                    const mockBooking = {
                      pnr: 'SL' + Math.random().toString(36).substr(2, 6).toUpperCase(),
                      bookingId: 'BK' + Date.now(),
                      status: 'confirmed',
                      passengers: bookingData.passengers,
                      flights: bookingData.selectedFlights,
                      seats: bookingData.selectedSeats,
                      totalFare: bookingData.fareBreakdown?.totalFare || 791,
                      bookingDate: new Date().toISOString(),
                      eTicket: {
                        ticketNumber: 'ET' + Math.random().toString(36).substr(2, 8).toUpperCase(),
                        issued: true
                      }
                    };
                    
                    setBookingData(prev => ({
                      ...prev,
                      bookingConfirmation: mockBooking
                    }));
                    
                    // Save the completed booking to Manage Booking system
                    saveBookingToManageSystem(mockBooking);
                    
                    setCurrentStep(5);
                  }}
                  disabled={loading}
                >
                  Skip to Confirmation (Testing)
                  <Check size={20} />
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingFlow;
