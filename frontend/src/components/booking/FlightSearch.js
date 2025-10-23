import React, { useState } from 'react';
import { Search, Calendar, Users, RotateCcw, Plus, Minus } from 'lucide-react';
import AirportSearch from './AirportSearch';
import './FlightSearch.css';

const FlightSearch = ({ onSearch, onFlightSelect }) => {
  const [searchData, setSearchData] = useState({
    tripType: 'round-trip',
    origin: '',
    destination: '',
    departureDate: '',
    returnDate: '',
    passengers: 1,
    travelClass: 'economy'
  });

  const [multiCitySegments, setMultiCitySegments] = useState([
    { id: 1, origin: '', destination: '', date: '' },
    { id: 2, origin: '', destination: '', date: '' }
  ]);

  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear return date if switching to one-way
    if (field === 'tripType' && value === 'one-way') {
      setSearchData(prev => ({
        ...prev,
        returnDate: ''
      }));
    }
  };

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      origin: prev.destination,
      destination: prev.origin
    }));
  };

  const addMultiCitySegment = () => {
    if (multiCitySegments.length < 6) {
      setMultiCitySegments(prev => [
        ...prev,
        { id: Date.now(), origin: '', destination: '', date: '' }
      ]);
    }
  };

  const removeMultiCitySegment = (segmentId) => {
    if (multiCitySegments.length > 2) {
      setMultiCitySegments(prev => prev.filter(segment => segment.id !== segmentId));
    }
  };

  const updateMultiCitySegment = (segmentId, field, value) => {
    setMultiCitySegments(prev => prev.map(segment => 
      segment.id === segmentId ? { ...segment, [field]: value } : segment
    ));
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);

    try {
      let searchPayload;

      if (searchData.tripType === 'multi-city') {
        // Multi-city search
        const segments = multiCitySegments.map(segment => ({
          ...segment,
          passengers: searchData.passengers,
          travelClass: searchData.travelClass
        }));

        const response = await fetch('/api/booking/multi-city/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ segments })
        });

        const result = await response.json();
        if (result.success) {
          setSearchResults(result.itinerary);
          if (onSearch) onSearch(result.itinerary);
        } else {
          setError(result.error);
        }
      } else {
        // Regular search
        searchPayload = {
          origin: searchData.origin,
          destination: searchData.destination,
          departureDate: searchData.departureDate,
          returnDate: searchData.tripType === 'round-trip' ? searchData.returnDate : null,
          passengers: searchData.passengers,
          travelClass: searchData.travelClass,
          tripType: searchData.tripType
        };

        const response = await fetch('/api/booking/search', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(searchPayload)
        });

        const result = await response.json();
        if (result.success) {
          setSearchResults(result);
          if (onSearch) onSearch(result);
        } else {
          setError(result.error);
        }
      }
    } catch (err) {
      setError('Failed to search flights. Please try again.');
      console.error('Search error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectFlight = (flight, type = 'outbound') => {
    if (onFlightSelect) {
      onFlightSelect(flight, type);
    }
  };

  const formatDuration = (duration) => {
    return duration || 'N/A';
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  return (
    <div className="flight-search">
      <div className="search-form-container">
        <div className="search-form glass">
          {/* Trip Type Selector */}
          <div className="trip-type-selector">
            <button 
              className={`trip-type-btn ${searchData.tripType === 'one-way' ? 'active' : ''}`}
              onClick={() => handleInputChange('tripType', 'one-way')}
            >
              One-way
            </button>
            <button 
              className={`trip-type-btn ${searchData.tripType === 'round-trip' ? 'active' : ''}`}
              onClick={() => handleInputChange('tripType', 'round-trip')}
            >
              Round-trip
            </button>
            <button 
              className={`trip-type-btn ${searchData.tripType === 'multi-city' ? 'active' : ''}`}
              onClick={() => handleInputChange('tripType', 'multi-city')}
            >
              Multi-city
            </button>
          </div>

          {searchData.tripType === 'multi-city' ? (
            /* Multi-city Form */
            <div className="multi-city-form">
              {multiCitySegments.map((segment, index) => (
                <div key={segment.id} className="multi-city-segment">
                  <div className="segment-header">
                    <span className="segment-number">Flight {index + 1}</span>
                    {multiCitySegments.length > 2 && (
                      <button 
                        className="remove-segment-btn"
                        onClick={() => removeMultiCitySegment(segment.id)}
                      >
                        <Minus size={16} />
                      </button>
                    )}
                  </div>
                  
                  <div className="segment-fields">
                    <div className="search-field">
                      <label className="field-label">From</label>
                      <AirportSearch
                        value={segment.origin}
                        onChange={(code) => updateMultiCitySegment(segment.id, 'origin', code)}
                        placeholder="Origin airport"
                      />
                    </div>

                    <div className="search-field">
                      <label className="field-label">To</label>
                      <AirportSearch
                        value={segment.destination}
                        onChange={(code) => updateMultiCitySegment(segment.id, 'destination', code)}
                        placeholder="Destination airport"
                      />
                    </div>

                    <div className="search-field">
                      <label className="field-label">Date</label>
                      <div className="field-input">
                        <Calendar size={20} className="field-icon" />
                        <input
                          type="date"
                          value={segment.date}
                          onChange={(e) => updateMultiCitySegment(segment.id, 'date', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {multiCitySegments.length < 6 && (
                <button className="add-segment-btn" onClick={addMultiCitySegment}>
                  <Plus size={16} />
                  Add Another Flight
                </button>
              )}
            </div>
          ) : (
            /* Regular Form */
            <div className="search-row">
            <div className="search-field">
              <label className="field-label">From</label>
              <AirportSearch
                value={searchData.origin}
                onChange={(code) => handleInputChange('origin', code)}
                placeholder="Departure airport"
              />
            </div>

            <button className="swap-btn" onClick={swapLocations}>
              <RotateCcw size={20} />
            </button>

            <div className="search-field">
              <label className="field-label">To</label>
              <AirportSearch
                value={searchData.destination}
                onChange={(code) => handleInputChange('destination', code)}
                placeholder="Destination airport"
              />
            </div>

              <div className="search-field">
                <label className="field-label">Depart</label>
                <div className="field-input">
                  <Calendar size={20} className="field-icon" />
                  <input
                    type="date"
                    value={searchData.departureDate}
                    onChange={(e) => handleInputChange('departureDate', e.target.value)}
                  />
                </div>
              </div>

              {searchData.tripType === 'round-trip' && (
                <div className="search-field">
                  <label className="field-label">Return</label>
                  <div className="field-input">
                    <Calendar size={20} className="field-icon" />
                    <input
                      type="date"
                      value={searchData.returnDate}
                      onChange={(e) => handleInputChange('returnDate', e.target.value)}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Passengers and Class */}
          <div className="search-options">
            <div className="search-field">
              <label className="field-label">Passengers</label>
              <div className="field-input">
                <Users size={20} className="field-icon" />
                <select
                  value={searchData.passengers}
                  onChange={(e) => handleInputChange('passengers', parseInt(e.target.value))}
                >
                  {[1,2,3,4,5,6,7,8,9].map(num => (
                    <option key={num} value={num}>{num} {num === 1 ? 'Passenger' : 'Passengers'}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="search-field">
              <label className="field-label">Class</label>
              <div className="field-input">
                <select
                  value={searchData.travelClass}
                  onChange={(e) => handleInputChange('travelClass', e.target.value)}
                >
                  <option value="economy">Economy</option>
                  <option value="premium">Premium Economy</option>
                  <option value="business">Business</option>
                  <option value="first">First Class</option>
                </select>
              </div>
            </div>
          </div>

          {/* Search Button */}
          <button 
            className="search-btn btn-primary" 
            onClick={handleSearch}
            disabled={loading}
          >
            {loading ? (
              <span>Searching...</span>
            ) : (
              <>
                <Search size={20} />
                <span>Search Flights</span>
              </>
            )}
          </button>

          {error && (
            <div className="search-error">
              {error}
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchResults && (
        <div className="search-results">
          <h3 className="results-title">Available Flights</h3>
          
          {searchResults.outboundFlights && (
            <div className="flights-section">
              <h4 className="section-title">Outbound Flights</h4>
              <div className="flights-list">
                {searchResults.outboundFlights.map(flight => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-info">
                      <div className="flight-route">
                        <span className="flight-number">{flight.flightNumber}</span>
                        <span className="route">{flight.origin} → {flight.destination}</span>
                      </div>
                      <div className="flight-times">
                        <span className="time">{flight.departureTime}</span>
                        <span className="duration">{formatDuration(flight.duration)}</span>
                        <span className="time">{flight.arrivalTime}</span>
                      </div>
                      <div className="flight-details">
                        <span className="aircraft">{flight.aircraft}</span>
                        <span className="available-seats">{flight.availableSeats} seats left</span>
                      </div>
                    </div>
                    <div className="flight-price">
                      <span className="price">{formatPrice(flight.totalFare)}</span>
                      <button 
                        className="select-flight-btn btn-secondary"
                        onClick={() => selectFlight(flight, 'outbound')}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {searchResults.returnFlights && searchResults.returnFlights.length > 0 && (
            <div className="flights-section">
              <h4 className="section-title">Return Flights</h4>
              <div className="flights-list">
                {searchResults.returnFlights.map(flight => (
                  <div key={flight.id} className="flight-card">
                    <div className="flight-info">
                      <div className="flight-route">
                        <span className="flight-number">{flight.flightNumber}</span>
                        <span className="route">{flight.origin} → {flight.destination}</span>
                      </div>
                      <div className="flight-times">
                        <span className="time">{flight.departureTime}</span>
                        <span className="duration">{formatDuration(flight.duration)}</span>
                        <span className="time">{flight.arrivalTime}</span>
                      </div>
                      <div className="flight-details">
                        <span className="aircraft">{flight.aircraft}</span>
                        <span className="available-seats">{flight.availableSeats} seats left</span>
                      </div>
                    </div>
                    <div className="flight-price">
                      <span className="price">{formatPrice(flight.totalFare)}</span>
                      <button 
                        className="select-flight-btn btn-secondary"
                        onClick={() => selectFlight(flight, 'return')}
                      >
                        Select
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FlightSearch;
