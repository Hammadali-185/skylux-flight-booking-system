import React, { useState } from 'react';
import { ArrowRight, Calendar, Users, RotateCcw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import AirportSearch from './booking/AirportSearch';
import './HeroSection.css';

const HeroSection = () => {
  const [tripType, setTripType] = useState('round-trip');
  const [videoError, setVideoError] = useState(false);
  const navigate = useNavigate();
  const [searchData, setSearchData] = useState({
    from: '',
    to: '',
    departDate: '',
    returnDate: '',
    passengers: '1 Adult',
    class: 'Economy'
  });

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSearch = () => {
    // Navigate to booking flow with search parameters
    const searchParams = new URLSearchParams({
      tripType,
      from: searchData.from,
      to: searchData.to,
      departDate: searchData.departDate,
      returnDate: searchData.returnDate,
      passengers: searchData.passengers,
      class: searchData.class
    });
    
    navigate(`/book?${searchParams.toString()}`);
  };

  const swapLocations = () => {
    setSearchData(prev => ({
      ...prev,
      from: prev.to,
      to: prev.from
    }));
  };

  return (
    <section className="hero-section">
      {/* Background Video */}
      <div className="hero-background">
        <div className="hero-overlay"></div>
        <video 
          className="hero-video" 
          autoPlay 
          muted 
          loop 
          playsInline
          preload="auto"
          controls={false}
          onError={(e) => {
            console.error('Video error:', e);
            setVideoError(true);
          }}
          onLoadStart={() => console.log('Video loading started')}
          onCanPlay={() => console.log('Video can play')}
          onLoadedData={() => console.log('Video data loaded')}
          onPlay={() => console.log('Video is playing')}
          style={{ 
            display: videoError ? 'none' : 'block',
            width: '100%',
            height: '100%',
            objectFit: 'cover'
          }}
        >
          <source src="/airoplane.mp4" type="video/mp4" />
          <source src="./airoplane.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        {videoError && <div className="hero-image-fallback"></div>}
      </div>

      <div className="hero-content">
        <div className="container">
          <div className="hero-text">
            <h1 className="hero-title fade-in-up">
              Experience Luxury
              <span className="title-accent"> Above the Clouds</span>
            </h1>
            <p className="hero-subtitle fade-in-up">
              Discover premium travel with unmatched comfort, exceptional service, 
              and destinations that inspire your wanderlust.
            </p>
          </div>

          {/* Flight Search Widget */}
          <div className="search-widget glass fade-in-up">
            {/* Trip Type Selector */}
            <div className="trip-type-selector">
              <button 
                className={`trip-type-btn ${tripType === 'one-way' ? 'active' : ''}`}
                onClick={() => setTripType('one-way')}
              >
                One-way
              </button>
              <button 
                className={`trip-type-btn ${tripType === 'round-trip' ? 'active' : ''}`}
                onClick={() => setTripType('round-trip')}
              >
                Round-trip
              </button>
              <button 
                className={`trip-type-btn ${tripType === 'multi-city' ? 'active' : ''}`}
                onClick={() => setTripType('multi-city')}
              >
                Multi-city
              </button>
            </div>

            {/* Search Form */}
            <div className="search-form">
              <div className="search-row">
                {/* From */}
                <div className="search-field">
                  <label className="field-label">From</label>
                  <AirportSearch
                    value={searchData.from}
                    onChange={(code) => handleInputChange('from', code)}
                    placeholder="Departure airport"
                  />
                </div>

                {/* Swap Button */}
                <button className="swap-btn" onClick={swapLocations}>
                  <RotateCcw size={20} />
                </button>

                {/* To */}
                <div className="search-field">
                  <label className="field-label">To</label>
                  <AirportSearch
                    value={searchData.to}
                    onChange={(code) => handleInputChange('to', code)}
                    placeholder="Destination airport"
                  />
                </div>

                {/* Depart Date */}
                <div className="search-field">
                  <label className="field-label">Depart</label>
                  <div className="field-input">
                    <Calendar size={20} className="field-icon" />
                    <input
                      type="date"
                      value={searchData.departDate}
                      onChange={(e) => handleInputChange('departDate', e.target.value)}
                    />
                  </div>
                </div>

                {/* Return Date */}
                {tripType === 'round-trip' && (
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

                {/* Passengers & Class */}
                <div className="search-field">
                  <label className="field-label">Passengers</label>
                  <div className="field-input">
                    <Users size={20} className="field-icon" />
                    <select
                      value={`${searchData.passengers}, ${searchData.class}`}
                      onChange={(e) => {
                        const [passengers, classType] = e.target.value.split(', ');
                        handleInputChange('passengers', passengers);
                        handleInputChange('class', classType);
                      }}
                    >
                      <option value="1 Adult, Economy">1 Adult, Economy</option>
                      <option value="1 Adult, Premium Economy">1 Adult, Premium Economy</option>
                      <option value="1 Adult, Business">1 Adult, Business</option>
                      <option value="1 Adult, First Class">1 Adult, First Class</option>
                      <option value="2 Adults, Economy">2 Adults, Economy</option>
                      <option value="2 Adults, Business">2 Adults, Business</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Search Button */}
              <button className="search-btn btn-primary" onClick={handleSearch}>
                <span>Search Flights</span>
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
