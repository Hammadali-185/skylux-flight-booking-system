import React, { useState, useEffect } from 'react';
import { MapPin, Plane, Calendar, DollarSign, ArrowRight } from 'lucide-react';
import './TopDestinations.css';

const TopDestinations = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Top destinations data with high-quality images
  const destinations = [
    {
      id: 1,
      city: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$450",
      bestTime: "April–June",
      description: "The City of Light awaits with its romantic charm and world-class cuisine."
    },
    {
      id: 2,
      city: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80",
      avgPrice: "$650",
      bestTime: "March–May",
      description: "Experience the perfect blend of ancient traditions and modern innovation."
    },
    {
      id: 3,
      city: "Dubai",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$520",
      bestTime: "November–March",
      description: "Discover luxury shopping, stunning architecture, and desert adventures."
    },
    {
      id: 4,
      city: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$380",
      bestTime: "Year-round",
      description: "The city that never sleeps offers endless entertainment and iconic landmarks."
    },
    {
      id: 5,
      city: "London",
      country: "UK",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$480",
      bestTime: "May–September",
      description: "Rich history meets modern sophistication in this iconic capital city."
    },
    {
      id: 6,
      city: "Sydney",
      country: "Australia",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$720",
      bestTime: "September–November",
      description: "Stunning harbor views, world-class beaches, and vibrant cultural scene."
    }
  ];

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('top-destinations');
      if (element) {
        const rect = element.getBoundingClientRect();
        const isInView = rect.top < window.innerHeight && rect.bottom > 0;
        setIsVisible(isInView);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Check initial state
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Placeholder function for booking integration
  const handleBook = (destination) => {
    console.log('Booking destination:', destination);
    // TODO: Integrate with booking form
    // This will later connect to the flight booking system
  };

  return (
    <section id="top-destinations" className="top-destinations section">
      <div className="container">
        {/* Section Header */}
        <div className={`section-header fade-in-up ${isVisible ? 'visible' : ''}`}>
          <h2 className="section-title">Where Will You Go Next?</h2>
          <p className="section-subtitle">
            Discover iconic cities and luxury getaways around the world
          </p>
        </div>

        {/* Destinations Grid */}
        <div className={`destinations-grid fade-in-up ${isVisible ? 'visible' : ''}`}>
          {destinations.map((destination, index) => (
            <div 
              key={destination.id} 
              className="destination-card"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="card-image">
                <img 
                  src={destination.image} 
                  alt={`${destination.city}, ${destination.country}`}
                  loading="lazy"
                />
                <div className="card-overlay">
                  <div className="overlay-content">
                    <div className="destination-info">
                      <h3 className="city-name">{destination.city}</h3>
                      <p className="country-name">{destination.country}</p>
                    </div>
                    <button 
                      className="book-now-btn"
                      onClick={() => handleBook(destination)}
                    >
                      <Plane size={16} />
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="destination-header">
                  <div className="location">
                    <MapPin size={16} />
                    <span>{destination.city}, {destination.country}</span>
                  </div>
                </div>
                
                <p className="description">{destination.description}</p>
                
                <div className="destination-details">
                  <div className="detail-item">
                    <DollarSign size={14} />
                    <span>From {destination.avgPrice}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={14} />
                    <span>{destination.bestTime}</span>
                  </div>
                </div>
                
                <button 
                  className="card-cta btn-primary"
                  onClick={() => handleBook(destination)}
                >
                  <Plane size={16} />
                  Book Now
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Call to Action */}
        <div className={`cta-section fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="cta-content">
            <h3>Ready to Explore More?</h3>
            <p>Discover all our destinations and find your perfect getaway</p>
            <button className="btn btn-secondary">
              <span>View All Destinations</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TopDestinations;
