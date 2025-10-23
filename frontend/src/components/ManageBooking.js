import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Edit3, 
  Trash2, 
  Download, 
  QrCode, 
  Plane, 
  User, 
  Mail, 
  Calendar, 
  MapPin, 
  Clock, 
  Utensils,
  CheckCircle,
  AlertCircle,
  X,
  Save,
  RotateCcw
} from 'lucide-react';
import Navigation from './Navigation';
import './ManageBooking.css';

const ManageBooking = () => {
  const [searchInput, setSearchInput] = useState('');
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  // Initialize dummy bookings in localStorage if not exists
  useEffect(() => {
    const existingBookings = localStorage.getItem('airlineBookings');
    if (!existingBookings) {
      const dummyBookings = [
        {
          id: 'SL001234',
          passengerName: 'Ahmed Khan',
          email: 'ahmed.khan@email.com',
          flightNumber: 'SL001',
          departure: 'Karachi (KHI)',
          arrival: 'Dubai (DXB)',
          seat: '12A',
          meal: 'Vegetarian',
          flightTime: '2024-10-15T08:00:00',
          status: 'confirmed',
          bookingDate: '2024-10-01T10:30:00',
          gate: 'A12',
          terminal: 'T1',
          class: 'Economy',
          price: 450
        },
        {
          id: 'SL005678',
          passengerName: 'Fatima Ali',
          email: 'fatima.ali@email.com',
          flightNumber: 'SL002',
          departure: 'Lahore (LHE)',
          arrival: 'Dubai (DXB)',
          seat: '8C',
          meal: 'Halal',
          flightTime: '2024-10-16T14:30:00',
          status: 'confirmed',
          bookingDate: '2024-10-02T15:45:00',
          gate: 'B8',
          terminal: 'T1',
          class: 'Business',
          price: 850
        },
        {
          id: 'SL009012',
          passengerName: 'Muhammad Hassan',
          email: 'm.hassan@email.com',
          flightNumber: 'SL003',
          departure: 'Dubai (DXB)',
          arrival: 'Karachi (KHI)',
          seat: '15F',
          meal: 'Non-Vegetarian',
          flightTime: '2024-10-17T18:00:00',
          status: 'confirmed',
          bookingDate: '2024-10-03T09:15:00',
          gate: 'C15',
          terminal: 'T2',
          class: 'Economy',
          price: 420
        }
      ];
      localStorage.setItem('airlineBookings', JSON.stringify(dummyBookings));
    }
  }, []);

  // Search for booking by reference or email
  const fetchBooking = async (searchTerm) => {
    setLoading(true);
    setError('');
    setBooking(null);

    try {
      const bookings = JSON.parse(localStorage.getItem('airlineBookings') || '[]');
      const foundBooking = bookings.find(
        booking => 
          booking.id.toLowerCase() === searchTerm.toLowerCase() ||
          booking.email.toLowerCase() === searchTerm.toLowerCase()
      );

      if (foundBooking) {
        setBooking(foundBooking);
        setEditForm(foundBooking);
        setSuccessMessage('Booking found successfully!');
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setError('No booking found with the provided reference or email.');
      }
    } catch (err) {
      setError('Error searching for booking. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Update booking details
  const updateBooking = () => {
    try {
      const bookings = JSON.parse(localStorage.getItem('airlineBookings') || '[]');
      const updatedBookings = bookings.map(b => 
        b.id === booking.id ? { ...b, ...editForm } : b
      );
      localStorage.setItem('airlineBookings', JSON.stringify(updatedBookings));
      
      setBooking({ ...booking, ...editForm });
      setIsEditing(false);
      setSuccessMessage('Booking updated successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error updating booking. Please try again.');
    }
  };

  // Cancel/Delete booking
  const deleteBooking = () => {
    try {
      const bookings = JSON.parse(localStorage.getItem('airlineBookings') || '[]');
      const updatedBookings = bookings.filter(b => b.id !== booking.id);
      localStorage.setItem('airlineBookings', JSON.stringify(updatedBookings));
      
      setBooking(null);
      setSearchInput('');
      setShowCancelDialog(false);
      setSuccessMessage('Booking cancelled successfully!');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Error cancelling booking. Please try again.');
    }
  };

  // Generate QR Code data
  const generateQRData = (bookingData) => {
    return JSON.stringify({
      id: bookingData.id,
      passenger: bookingData.passengerName,
      flight: bookingData.flightNumber,
      route: `${bookingData.departure} → ${bookingData.arrival}`,
      date: new Date(bookingData.flightTime).toLocaleDateString(),
      seat: bookingData.seat,
      status: bookingData.status
    });
  };

  // Download ticket as PDF
  const downloadTicket = () => {
    if (!booking) return;

    // Create a simple HTML ticket
    const ticketHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Flight Ticket - ${booking.id}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          .ticket { border: 2px solid #333; padding: 20px; max-width: 600px; }
          .header { text-align: center; margin-bottom: 20px; }
          .airline-name { font-size: 24px; font-weight: bold; color: #1e40af; }
          .ticket-id { font-size: 18px; color: #666; }
          .details { display: grid; grid-template-columns: 1fr 1fr; gap: 15px; }
          .detail-item { margin-bottom: 10px; }
          .label { font-weight: bold; color: #333; }
          .value { color: #666; }
          .qr-section { text-align: center; margin-top: 20px; }
          .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }
        </style>
      </head>
      <body>
        <div class="ticket">
          <div class="header">
            <div class="airline-name">SkyLux Airlines</div>
            <div class="ticket-id">Ticket #${booking.id}</div>
          </div>
          <div class="details">
            <div class="detail-item">
              <div class="label">Passenger:</div>
              <div class="value">${booking.passengerName}</div>
            </div>
            <div class="detail-item">
              <div class="label">Flight:</div>
              <div class="value">${booking.flightNumber}</div>
            </div>
            <div class="detail-item">
              <div class="label">Route:</div>
              <div class="value">${booking.departure} → ${booking.arrival}</div>
            </div>
            <div class="detail-item">
              <div class="label">Date & Time:</div>
              <div class="value">${new Date(booking.flightTime).toLocaleString()}</div>
            </div>
            <div class="detail-item">
              <div class="label">Seat:</div>
              <div class="value">${booking.seat}</div>
            </div>
            <div class="detail-item">
              <div class="label">Meal:</div>
              <div class="value">${booking.meal}</div>
            </div>
            <div class="detail-item">
              <div class="label">Gate:</div>
              <div class="value">${booking.gate}</div>
            </div>
            <div class="detail-item">
              <div class="label">Terminal:</div>
              <div class="value">${booking.terminal}</div>
            </div>
          </div>
          <div class="qr-section">
            <div style="font-weight: bold; margin-bottom: 10px;">QR Code for Check-in</div>
            <div style="background: #f0f0f0; padding: 20px; display: inline-block;">
              [QR Code: ${generateQRData(booking)}]
            </div>
          </div>
          <div class="footer">
            <p>Thank you for choosing SkyLux Airlines!</p>
            <p>For assistance, contact: support@skylux.com</p>
          </div>
        </div>
      </body>
      </html>
    `;

    // Create and download the file
    const blob = new Blob([ticketHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ticket-${booking.id}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setSuccessMessage('Ticket downloaded successfully!');
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  // Handle search form submission
  const handleSearch = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      fetchBooking(searchInput.trim());
    }
  };

  // Handle edit form changes
  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="manage-booking-container">
      <Navigation />
      
      <div className="manage-booking-content">
        {/* Header */}
        <div className="booking-header">
          <div className="header-content">
            <div className="header-title">
              <Plane size={32} className="header-icon" />
              <div>
                <h1>Manage Booking</h1>
                <p>Search, view, and modify your flight bookings</p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
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

        {/* Booking Details */}
        {booking && (
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

              {!isEditing ? (
                // View Mode
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
                        <Mail size={16} />
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
                        <span className="label">Seat:</span>
                        <span className="value">{booking.seat}</span>
                      </div>
                      <div className="info-item">
                        <Utensils size={16} />
                        <span className="label">Meal:</span>
                        <span className="value">{booking.meal}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Gate:</span>
                        <span className="value">{booking.gate}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Terminal:</span>
                        <span className="value">{booking.terminal}</span>
                      </div>
                      <div className="info-item">
                        <span className="label">Class:</span>
                        <span className="value">{booking.class}</span>
                      </div>
                    </div>
                  </div>

                  {/* QR Code Section */}
                  <div className="qr-section">
                    <h4>Check-in QR Code</h4>
                    <div className="qr-container">
                      <div className="qr-placeholder">
                        <QrCode size={48} />
                        <p>QR Code for {booking.id}</p>
                        <small>Scan at airport for quick check-in</small>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="action-buttons">
                    <button 
                      className="btn btn-primary"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit3 size={16} />
                      Edit Booking
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={downloadTicket}
                    >
                      <Download size={16} />
                      Download Ticket
                    </button>
                    <button 
                      className="btn btn-danger"
                      onClick={() => setShowCancelDialog(true)}
                    >
                      <Trash2 size={16} />
                      Cancel Booking
                    </button>
                  </div>
                </div>
              ) : (
                // Edit Mode
                <div className="booking-content">
                  <div className="edit-form">
                    <div className="form-section">
                      <h4>Passenger Information</h4>
                      <div className="form-group">
                        <label>Passenger Name</label>
                        <input
                          type="text"
                          value={editForm.passengerName || ''}
                          onChange={(e) => handleEditChange('passengerName', e.target.value)}
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email"
                          value={editForm.email || ''}
                          onChange={(e) => handleEditChange('email', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>

                    <div className="form-section">
                      <h4>Flight Preferences</h4>
                      <div className="form-group">
                        <label>Seat</label>
                        <input
                          type="text"
                          value={editForm.seat || ''}
                          onChange={(e) => handleEditChange('seat', e.target.value)}
                          className="form-input"
                          placeholder="e.g., 12A"
                        />
                      </div>
                      <div className="form-group">
                        <label>Meal Preference</label>
                        <select
                          value={editForm.meal || ''}
                          onChange={(e) => handleEditChange('meal', e.target.value)}
                          className="form-select"
                        >
                          <option value="Vegetarian">Vegetarian</option>
                          <option value="Non-Vegetarian">Non-Vegetarian</option>
                          <option value="Halal">Halal</option>
                          <option value="Kosher">Kosher</option>
                          <option value="Vegan">Vegan</option>
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Flight Time</label>
                        <input
                          type="datetime-local"
                          value={editForm.flightTime ? new Date(editForm.flightTime).toISOString().slice(0, 16) : ''}
                          onChange={(e) => handleEditChange('flightTime', e.target.value)}
                          className="form-input"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="edit-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={updateBooking}
                    >
                      <Save size={16} />
                      Save Changes
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => {
                        setIsEditing(false);
                        setEditForm(booking);
                      }}
                    >
                      <RotateCcw size={16} />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cancel Confirmation Dialog */}
        {showCancelDialog && (
          <div className="modal-overlay">
            <div className="modal">
              <div className="modal-header">
                <h3>Cancel Booking</h3>
                <button 
                  className="close-btn"
                  onClick={() => setShowCancelDialog(false)}
                >
                  <X size={20} />
                </button>
              </div>
              <div className="modal-content">
                <AlertCircle size={48} className="warning-icon" />
                <p>Are you sure you want to cancel this booking?</p>
                <p><strong>Booking #{booking?.id}</strong> - {booking?.passengerName}</p>
                <p className="warning-text">This action cannot be undone.</p>
              </div>
              <div className="modal-actions">
                <button 
                  className="btn btn-secondary"
                  onClick={() => setShowCancelDialog(false)}
                >
                  Keep Booking
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={deleteBooking}
                >
                  <Trash2 size={16} />
                  Cancel Booking
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBooking;
