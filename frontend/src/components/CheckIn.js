import React, { useState, useEffect } from 'react';
import { 
  Search, 
  User, 
  Plane, 
  MapPin, 
  Clock, 
  CheckCircle, 
  AlertCircle, 
  Download, 
  QrCode,
  Calendar,
  Armchair,
  X,
  Check
} from 'lucide-react';
import Navigation from './Navigation';
import './CheckIn.css';

const CheckIn = () => {
  const [searchInput, setSearchInput] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [checkInConfirmed, setCheckInConfirmed] = useState(false);
  const [seatMap, setSeatMap] = useState([]);

  // Generate seat map based on aircraft type
  const generateSeatMap = (aircraftType = 'Boeing 737') => {
    const seatMap = [];
    const rows = aircraftType.includes('737') ? 30 : 25;
    const seatsPerRow = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    for (let row = 1; row <= rows; row++) {
      for (let seat of seatsPerRow) {
        const seatId = `${row}${seat}`;
        const isOccupied = Math.random() < 0.7; // 70% chance of being occupied
        const isCurrentSeat = booking?.seat === seatId;
        
        seatMap.push({
          id: seatId,
          row: row,
          seat: seat,
          occupied: isOccupied || isCurrentSeat,
          currentSeat: isCurrentSeat,
          selected: false
        });
      }
    }
    
    return seatMap;
  };

  // Fetch booking details
  const fetchBooking = async (searchTerm) => {
    setLoading(true);
    setError('');
    setBooking(null);
    setCheckInConfirmed(false);

    try {
      const bookings = JSON.parse(localStorage.getItem('airlineBookings') || '[]');
      const foundBooking = bookings.find(
        booking => 
          booking.id.toLowerCase() === searchTerm.toLowerCase() ||
          booking.email.toLowerCase() === searchTerm.toLowerCase()
      );

      if (foundBooking) {
        setBooking(foundBooking);
        const seats = generateSeatMap();
        setSeatMap(seats);
        setSuccessMessage('Booking found successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('Booking not found. Please check your booking reference or email address.');
      }
    } catch (err) {
      setError('Error searching for booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Validate check-in time (24 hours before departure)
  const validateCheckInTime = (flightTime) => {
    const now = new Date();
    const departure = new Date(flightTime);
    const hoursUntilDeparture = (departure - now) / (1000 * 60 * 60);
    
    return hoursUntilDeparture >= 24;
  };

  // Handle seat selection
  const selectSeat = (seatId) => {
    if (booking && !validateCheckInTime(booking.flightTime)) {
      setError('Check-in opens 24 hours before flight departure.');
      return;
    }

    setSeatMap(prev => prev.map(seat => ({
      ...seat,
      selected: seat.id === seatId && !seat.occupied
    })));
    
    setSelectedSeat(seatId);
    setError('');
  };

  // Confirm check-in
  const confirmCheckIn = () => {
    if (!selectedSeat) {
      setError('Please select a seat before confirming check-in.');
      return;
    }

    try {
      // Update booking in localStorage
      const bookings = JSON.parse(localStorage.getItem('airlineBookings') || '[]');
      const updatedBookings = bookings.map(b => 
        b.id === booking.id 
          ? { ...b, seat: selectedSeat, checkInStatus: 'confirmed', checkInTime: new Date().toISOString() }
          : b
      );
      localStorage.setItem('airlineBookings', JSON.stringify(updatedBookings));

      // Update local booking state
      setBooking(prev => ({
        ...prev,
        seat: selectedSeat,
        checkInStatus: 'confirmed',
        checkInTime: new Date().toISOString()
      }));

      setCheckInConfirmed(true);
      setSuccessMessage('Check-in confirmed successfully!');
    } catch (err) {
      setError('Error confirming check-in. Please try again.');
    }
  };

  // Generate boarding pass
  const generateBoardingPass = () => {
    if (!booking) return;

    const boardingPassData = {
      passenger: booking.passengerName,
      flight: booking.flightNumber,
      route: `${booking.departure} → ${booking.arrival}`,
      seat: booking.seat,
      gate: booking.gate,
      terminal: booking.terminal,
      departure: new Date(booking.flightTime).toLocaleString(),
      bookingId: booking.id
    };

    // Create HTML boarding pass
    const boardingPassHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Boarding Pass - ${booking.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .boarding-pass { 
            border: 2px solid #333; 
            padding: 20px; 
            max-width: 600px; 
            background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
            color: white;
          }
          .header { text-align: center; margin-bottom: 20px; }
          .airline-name { font-size: 24px; font-weight: bold; }
          .boarding-pass-title { font-size: 18px; color: #fbbf24; }
          .passenger-info { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 20px; 
            margin-bottom: 20px;
          }
          .info-section h4 { color: #fbbf24; margin-bottom: 10px; }
          .info-item { margin-bottom: 8px; }
          .label { font-weight: bold; }
          .qr-section { 
            text-align: center; 
            margin-top: 20px; 
            padding: 20px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 10px;
          }
          .footer { 
            text-align: center; 
            margin-top: 20px; 
            font-size: 12px; 
            color: #cbd5e1;
          }
        </style>
      </head>
      <body>
        <div class="boarding-pass">
          <div class="header">
            <div class="airline-name">SkyLux Airlines</div>
            <div class="boarding-pass-title">BOARDING PASS</div>
          </div>
          <div class="passenger-info">
            <div class="info-section">
              <h4>Passenger Information</h4>
              <div class="info-item">
                <span class="label">Name:</span> ${boardingPassData.passenger}
              </div>
              <div class="info-item">
                <span class="label">Flight:</span> ${boardingPassData.flight}
              </div>
              <div class="info-item">
                <span class="label">Route:</span> ${boardingPassData.route}
              </div>
            </div>
            <div class="info-section">
              <h4>Flight Details</h4>
              <div class="info-item">
                <span class="label">Seat:</span> ${boardingPassData.seat}
              </div>
              <div class="info-item">
                <span class="label">Gate:</span> ${boardingPassData.gate}
              </div>
              <div class="info-item">
                <span class="label">Terminal:</span> ${boardingPassData.terminal}
              </div>
              <div class="info-item">
                <span class="label">Departure:</span> ${boardingPassData.departure}
              </div>
            </div>
          </div>
          <div class="qr-section">
            <div style="font-weight: bold; margin-bottom: 10px;">QR Code for Boarding</div>
            <div style="background: white; padding: 20px; display: inline-block; border-radius: 10px;">
              [QR Code: ${JSON.stringify(boardingPassData)}]
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing SkyLux Airlines!</p>
            <p>Please arrive at the gate 30 minutes before departure</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([boardingPassHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `boarding-pass-${booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessMessage('Boarding pass downloaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchBooking(searchInput.trim());
    }
  };

  // Get seat status class
  const getSeatStatusClass = (seat) => {
    if (seat.occupied) return 'occupied';
    if (seat.selected) return 'selected';
    if (seat.currentSeat) return 'current';
    return 'available';
  };

  return (
    <div className="checkin-container">
      <Navigation />
      
      <div className="checkin-content">
        {/* Header */}
        <div className="checkin-header">
          <div className="header-content">
            <div className="header-title">
              <Plane size={32} className="header-icon" />
              <div>
                <h1>Online Check-in</h1>
                <p>Check in for your flight and select your seat</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        {!booking && (
          <div className="search-section">
            <div className="search-card">
              <div className="search-header">
                <h3>Find Your Booking</h3>
                <p>Enter your booking reference number or email address</p>
              </div>
              
              <form onSubmit={handleSearch} className="search-form">
                <div className="search-input-group">
                  <Search size={20} className="search-icon" />
                  <input
                    type="text"
                    placeholder="Enter booking reference or email"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="search-input"
                  />
                  <button 
                    type="submit" 
                    className="search-btn"
                    disabled={loading || !searchInput.trim()}
                  >
                    {loading ? 'Searching...' : 'Search'}
                  </button>
                </div>
              </form>

              {/* Messages */}
              {error && (
                <div className="message error">
                  <AlertCircle size={16} />
                  <span>{error}</span>
                  <button onClick={() => setError('')} className="close-btn">
                    <X size={16} />
                  </button>
                </div>
              )}

              {successMessage && (
                <div className="message success">
                  <CheckCircle size={16} />
                  <span>{successMessage}</span>
                  <button onClick={() => setSuccessMessage('')} className="close-btn">
                    <X size={16} />
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Booking Details */}
        {booking && !checkInConfirmed && (
          <div className="booking-details-section">
            <div className="booking-card">
              <div className="booking-header">
                <div className="booking-title">
                  <h3>Booking Details</h3>
                  <div className="booking-id">#{booking.id}</div>
                </div>
                <div className="booking-status">
                  <span className={`status-badge ${booking.status}`}>
                    {booking.status.toUpperCase()}
                  </span>
                </div>
              </div>

              <div className="booking-content">
                <div className="booking-info-grid">
                  <div className="info-section">
                    <h4>Passenger Information</h4>
                    <div className="info-item">
                      <User size={16} />
                      <span className="label">Name:</span>
                      <span className="value">{booking.passengerName}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Email:</span>
                      <span className="value">{booking.email}</span>
                    </div>
                  </div>

                  <div className="info-section">
                    <h4>Flight Information</h4>
                    <div className="info-item">
                      <Plane size={16} />
                      <span className="label">Flight:</span>
                      <span className="value">{booking.flightNumber}</span>
                    </div>
                    <div className="info-item">
                      <MapPin size={16} />
                      <span className="label">Route:</span>
                      <span className="value">{booking.departure} → {booking.arrival}</span>
                    </div>
                    <div className="info-item">
                      <Calendar size={16} />
                      <span className="label">Date & Time:</span>
                      <span className="value">{new Date(booking.flightTime).toLocaleString()}</span>
                    </div>
                    <div className="info-item">
                      <Armchair size={16} />
                      <span className="label">Current Seat:</span>
                      <span className="value">{booking.seat}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Gate:</span>
                      <span className="value">{booking.gate}</span>
                    </div>
                    <div className="info-item">
                      <span className="label">Terminal:</span>
                      <span className="value">{booking.terminal}</span>
                    </div>
                  </div>
                </div>

                {/* Check-in Time Validation */}
                {!validateCheckInTime(booking.flightTime) && (
                  <div className="checkin-restriction">
                    <AlertCircle size={24} />
                    <div>
                      <h4>Check-in Not Available</h4>
                      <p>Check-in opens 24 hours before flight departure.</p>
                      <p>Your flight departs: {new Date(booking.flightTime).toLocaleString()}</p>
                    </div>
                  </div>
                )}

                {/* Seat Selection */}
                {validateCheckInTime(booking.flightTime) && (
                  <div className="seat-selection-section">
                    <h4>Select Your Seat</h4>
                    <div className="seat-map">
                      <div className="seat-map-header">
                        <div className="seat-legend">
                          <div className="legend-item">
                            <div className="legend-color available"></div>
                            <span>Available</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color occupied"></div>
                            <span>Occupied</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color current"></div>
                            <span>Your Current Seat</span>
                          </div>
                          <div className="legend-item">
                            <div className="legend-color selected"></div>
                            <span>Selected</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="seat-grid">
                        {seatMap.map((seat) => (
                          <button
                            key={seat.id}
                            className={`seat ${getSeatStatusClass(seat)}`}
                            onClick={() => selectSeat(seat.id)}
                            disabled={seat.occupied}
                            title={seat.occupied ? 'Occupied' : `Seat ${seat.id}`}
                          >
                            {seat.id}
                          </button>
                        ))}
                      </div>
                    </div>

                    {selectedSeat && (
                      <div className="seat-selection-actions">
                        <p>Selected Seat: <strong>{selectedSeat}</strong></p>
                        <button 
                          className="btn btn-primary"
                          onClick={confirmCheckIn}
                        >
                          <Check size={16} />
                          Confirm Seat Selection
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Check-in Confirmation */}
        {checkInConfirmed && (
          <div className="checkin-confirmation-section">
            <div className="confirmation-card">
              <div className="confirmation-header">
                <div className="success-icon">
                  <CheckCircle size={48} />
                </div>
                <h2 className="confirmation-title">Check-in Confirmed!</h2>
                <p className="confirmation-subtitle">
                  Your check-in is complete. You can now download your boarding pass.
                </p>
              </div>

              <div className="confirmation-details">
                <div className="booking-summary">
                  <h4>Booking Summary</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="label">Passenger:</span>
                      <span className="value">{booking.passengerName}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Flight:</span>
                      <span className="value">{booking.flightNumber}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Route:</span>
                      <span className="value">{booking.departure} → {booking.arrival}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Seat:</span>
                      <span className="value">{booking.seat}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Gate:</span>
                      <span className="value">{booking.gate}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Departure:</span>
                      <span className="value">{new Date(booking.flightTime).toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="boarding-pass-section">
                  <h4>Boarding Pass</h4>
                  <div className="qr-code-placeholder">
                    <QrCode size={64} />
                    <p>QR Code for {booking.id}</p>
                    <small>Scan at gate for boarding</small>
                  </div>
                </div>
              </div>

              <div className="confirmation-actions">
                <button 
                  className="btn btn-primary"
                  onClick={generateBoardingPass}
                >
                  <Download size={16} />
                  Download Boarding Pass
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => {
                    setBooking(null);
                    setCheckInConfirmed(false);
                    setSearchInput('');
                    setSelectedSeat(null);
                  }}
                >
                  Check-in Another Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckIn;
