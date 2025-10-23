import React, { useState, useEffect, useRef } from 'react';
import { MapPin, Search } from 'lucide-react';
import './AirportSearch.css';

const AirportSearch = ({ value, onChange, placeholder = "Search airports...", className = "" }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [airports, setAirports] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (value) {
      // If there's a value, try to find the airport name
      fetchAirports(value);
    }
  }, []);

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      if (searchTerm.length >= 2) {
        fetchAirports(searchTerm);
      } else {
        setAirports([]);
      }
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchAirports = async (search) => {
    if (!search || search.length < 2) return;
    
    setLoading(true);
    try {
      const response = await fetch(`/api/booking/airports?search=${encodeURIComponent(search)}`);
      const result = await response.json();
      
      if (result.success) {
        setAirports(result.airports);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Failed to fetch airports:', error);
      setAirports([]);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
    setSelectedIndex(-1); // Reset selection when typing
  };

  const handleKeyDown = (e) => {
    if (!isOpen || airports.length === 0) {
      if (e.key === 'ArrowDown' && airports.length > 0) {
        setIsOpen(true);
        setSelectedIndex(0);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < airports.length - 1 ? prev + 1 : 0
        );
        break;
      
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : airports.length - 1
        );
        break;
      
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < airports.length) {
          handleAirportSelect(airports[selectedIndex]);
        }
        break;
      
      case 'Escape':
        setIsOpen(false);
        setSelectedIndex(-1);
        inputRef.current?.blur();
        break;
      
      default:
        break;
    }
  };

  const handleAirportSelect = (airport) => {
    setSearchTerm(`${airport.city} (${airport.code})`);
    setIsOpen(false);
    setSelectedIndex(-1);
    if (onChange) {
      onChange(airport.code, airport);
    }
  };

  const handleInputFocus = () => {
    if (airports.length > 0) {
      setIsOpen(true);
    }
  };

  const getDisplayValue = () => {
    if (value && !searchTerm) {
      // Try to find the airport by code
      const airport = airports.find(a => a.code === value);
      return airport ? `${airport.city} (${airport.code})` : value;
    }
    return searchTerm;
  };

  return (
    <div className={`airport-search ${className}`} ref={dropdownRef}>
      <div className="airport-input-container">
        <MapPin size={20} className="airport-icon" />
        <input
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="airport-input"
          autoComplete="off"
        />
        {loading && (
          <div className="airport-loading">
            <Search size={16} className="spinning" />
          </div>
        )}
      </div>

      {isOpen && airports.length > 0 && (
        <div className="airport-dropdown">
          <div className="airport-list">
            {airports.map((airport, index) => (
              <div
                key={airport.code}
                className={`airport-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => handleAirportSelect(airport)}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="airport-main">
                  <span className="airport-code">{airport.code}</span>
                  <span className="airport-city">{airport.city}</span>
                </div>
                <div className="airport-details">
                  <span className="airport-name">{airport.name}</span>
                  <span className="airport-country">{airport.country}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {isOpen && searchTerm.length >= 2 && airports.length === 0 && !loading && (
        <div className="airport-dropdown">
          <div className="airport-no-results">
            <MapPin size={24} />
            <span>No airports found</span>
            <small>Try searching by city, airport name, or code</small>
          </div>
        </div>
      )}
    </div>
  );
};

export default AirportSearch;


