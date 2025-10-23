import React, { useState, useEffect, useCallback } from 'react';
import { User, UserCheck, AlertCircle, Zap } from 'lucide-react';
import './SeatMap.css';

const SeatMap = ({ flightId, passengers, onSeatSelect, selectedSeats = [] }) => {
  const [seatMap, setSeatMap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCabin, setSelectedCabin] = useState('economy');
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const fetchSeatMap = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/booking/seat-map/${flightId}`);
      const result = await response.json();
      
      if (result.success) {
        setSeatMap(result);
        // Set default cabin to first available cabin
        const availableCabins = Object.keys(result.seatMap);
        if (availableCabins.length > 0) {
          setSelectedCabin(availableCabins[0]);
        }
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Failed to load seat map');
      console.error('Seat map error:', err);
    } finally {
      setLoading(false);
    }
  }, [flightId]);

  useEffect(() => {
    if (flightId) {
      fetchSeatMap();
    }
  }, [flightId, fetchSeatMap]);

  const getSeatStatusClass = (seat) => {
    const classes = ['seat'];
    
    // Check if seat is selected by current user
    const isSelected = selectedSeats.some(selected => selected.seatId === seat.id);
    if (isSelected) {
      classes.push('selected');
      return classes.join(' ');
    }
    
    // Status-based classes
    switch (seat.status) {
      case 'available':
        classes.push('available');
        break;
      case 'booked':
        classes.push('booked');
        break;
      case 'occupied_male':
        classes.push('occupied-male');
        break;
      case 'occupied_female':
        classes.push('occupied-female');
        break;
      default:
        classes.push('unavailable');
    }
    
    // Type-based classes
    switch (seat.type) {
      case 'extra_legroom':
        classes.push('extra-legroom');
        break;
      case 'emergency_exit':
        classes.push('emergency-exit');
        break;
      case 'window':
        classes.push('window');
        break;
      case 'aisle':
        classes.push('aisle');
        break;
      default:
        classes.push('standard');
    }
    
    return classes.join(' ');
  };

  const getSeatIcon = (seat) => {
    if (selectedSeats.some(selected => selected.seatId === seat.id)) {
      return <UserCheck size={16} />;
    }
    
    switch (seat.status) {
      case 'occupied_male':
        return <User size={16} />;
      case 'occupied_female':
        return <User size={16} />;
      case 'booked':
        return <User size={16} />;
      default:
        if (seat.type === 'emergency_exit') {
          return <AlertCircle size={16} />;
        }
        if (seat.type === 'extra_legroom') {
          return <Zap size={16} />;
        }
        return null;
    }
  };

  const handleSeatClick = (seat) => {
    if (seat.status !== 'available') return;
    
    // Check if seat is already selected
    const isSelected = selectedSeats.some(selected => selected.seatId === seat.id);
    
    if (isSelected) {
      // Deselect seat
      if (onSeatSelect) {
        onSeatSelect(null, seat);
      }
    } else {
      // Select seat for next available passenger
      const unassignedPassenger = passengers.find(passenger => 
        !selectedSeats.some(selected => selected.passengerId === passenger.id)
      );
      
      if (unassignedPassenger && onSeatSelect) {
        onSeatSelect(unassignedPassenger, seat);
      }
    }
  };

  const getSeatPrice = (seat) => {
    if (seat.price && seat.price > 0) {
      return `+$${seat.price}`;
    }
    return '';
  };

  const getSeatTooltip = (seat) => {
    const parts = [];
    parts.push(`Seat ${seat.id}`);
    
    if (seat.type !== 'standard') {
      parts.push(seat.type.replace('_', ' ').toUpperCase());
    }
    
    if (seat.price > 0) {
      parts.push(`+$${seat.price}`);
    }
    
    if (seat.status !== 'available') {
      parts.push(seat.status.replace('_', ' ').toUpperCase());
    }
    
    return parts.join(' • ');
  };

  const renderSeatRow = (row, rowIndex, cabin) => {
    const seatLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
    
    return (
      <div key={rowIndex} className="seat-row">
        <div className="row-number">{rowIndex + 1}</div>
        <div className="seats">
          {row.map((seat, seatIndex) => (
            <div
              key={seat.id}
              className={getSeatStatusClass(seat)}
              onClick={() => handleSeatClick(seat)}
              onMouseEnter={() => setHoveredSeat(seat)}
              onMouseLeave={() => setHoveredSeat(null)}
              title={getSeatTooltip(seat)}
            >
              <div className="seat-content">
                {getSeatIcon(seat)}
                <span className="seat-label">{seat.seat || seatLetters[seatIndex]}</span>
                {seat.price > 0 && (
                  <span className="seat-price">{getSeatPrice(seat)}</span>
                )}
              </div>
            </div>
          ))}
        </div>
        <div className="row-number">{rowIndex + 1}</div>
      </div>
    );
  };

  const renderCabinSelector = () => {
    if (!seatMap) return null;
    
    const cabins = Object.keys(seatMap.seatMap);
    
    return (
      <div className="cabin-selector">
        {cabins.map(cabin => (
          <button
            key={cabin}
            className={`cabin-btn ${selectedCabin === cabin ? 'active' : ''}`}
            onClick={() => setSelectedCabin(cabin)}
          >
            {cabin.charAt(0).toUpperCase() + cabin.slice(1)}
          </button>
        ))}
      </div>
    );
  };

  const renderLegend = () => (
    <div className="seat-legend">
      <h4 className="legend-title">Seat Legend</h4>
      <div className="legend-items">
        <div className="legend-item">
          <div className="seat available legend-seat"></div>
          <span>Available</span>
        </div>
        <div className="legend-item">
          <div className="seat selected legend-seat">
            <UserCheck size={12} />
          </div>
          <span>Selected</span>
        </div>
        <div className="legend-item">
          <div className="seat occupied-male legend-seat">
            <User size={12} />
          </div>
          <span>Occupied (Male)</span>
        </div>
        <div className="legend-item">
          <div className="seat occupied-female legend-seat">
            <User size={12} />
          </div>
          <span>Occupied (Female)</span>
        </div>
        <div className="legend-item">
          <div className="seat booked legend-seat">
            <User size={12} />
          </div>
          <span>Booked</span>
        </div>
        <div className="legend-item">
          <div className="seat extra-legroom legend-seat">
            <Zap size={12} />
          </div>
          <span>Extra Legroom (+$)</span>
        </div>
        <div className="legend-item">
          <div className="seat emergency-exit legend-seat">
            <AlertCircle size={12} />
          </div>
          <span>Emergency Exit</span>
        </div>
      </div>
    </div>
  );

  const renderPassengerAssignments = () => {
    if (passengers.length === 0) return null;
    
    return (
      <div className="passenger-assignments">
        <h4 className="assignments-title">Passenger Seat Assignments</h4>
        <div className="assignments-list">
          {passengers.map(passenger => {
            const assignment = selectedSeats.find(seat => seat.passengerId === passenger.id);
            return (
              <div key={passenger.id} className="assignment-item">
                <div className="passenger-info">
                  <span className="passenger-name">
                    {passenger.firstName} {passenger.lastName}
                  </span>
                  <span className="passenger-type">
                    {passenger.type || 'Adult'}
                  </span>
                </div>
                <div className="seat-assignment">
                  {assignment ? (
                    <span className="assigned-seat">Seat {assignment.seatId}</span>
                  ) : (
                    <span className="no-seat">No seat selected</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="seat-map-loading">
        <div className="loading-spinner"></div>
        <p>Loading seat map...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="seat-map-error">
        <AlertCircle size={48} />
        <p>{error}</p>
        <button className="retry-btn btn-secondary" onClick={fetchSeatMap}>
          Retry
        </button>
      </div>
    );
  }

  if (!seatMap) {
    return null;
  }

  const currentCabinSeats = seatMap.seatMap[selectedCabin] || [];

  return (
    <div className="seat-map-container">
      <div className="seat-map-header">
        <div className="flight-info">
          <h3 className="flight-title">Select Your Seats</h3>
          <p className="flight-details">
            {seatMap.flightNumber} • {seatMap.aircraft}
          </p>
        </div>
        {renderCabinSelector()}
      </div>

      <div className="seat-map-content">
        <div className="seat-map-main">
          <div className="aircraft-outline">
            <div className="aircraft-nose"></div>
            <div className="cabin-section">
              <h4 className="cabin-title">
                {selectedCabin.charAt(0).toUpperCase() + selectedCabin.slice(1)} Class
              </h4>
              <div className="seat-grid">
                {currentCabinSeats.map((row, rowIndex) => 
                  renderSeatRow(row, rowIndex, selectedCabin)
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="seat-map-sidebar">
          {renderLegend()}
          {renderPassengerAssignments()}
          
          {hoveredSeat && (
            <div className="seat-details">
              <h4 className="details-title">Seat Details</h4>
              <div className="details-content">
                <p><strong>Seat:</strong> {hoveredSeat.id}</p>
                <p><strong>Type:</strong> {hoveredSeat.type.replace('_', ' ')}</p>
                <p><strong>Status:</strong> {hoveredSeat.status}</p>
                {hoveredSeat.price > 0 && (
                  <p><strong>Upgrade Fee:</strong> ${hoveredSeat.price}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatMap;
