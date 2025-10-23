import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Briefcase, 
  Star, 
  ArrowRight, 
  Wifi, 
  Coffee, 
  Bed, 
  Headphones,
  Utensils,
  Shield,
  Sparkles
} from 'lucide-react';
import './LuxuryExperience.css';

const LuxuryExperience = () => {
  const [isVisible, setIsVisible] = useState(false);

  // Premium cabin data with local cabin images
  const cabins = [
    {
      id: 1,
      name: "First Class",
      description: "Private suites, fine dining, and dedicated lounge access",
      image: "/videos_images/first_class.jpg",
      icon: <Crown size={24} />,
      color: "var(--champagne-gold)",
      features: ["Private Suite", "Fine Dining", "Lounge Access", "24/7 Concierge"]
    },
    {
      id: 2,
      name: "Business Class",
      description: "Flatbed seats, priority check-in, and gourmet meals",
      image: "/videos_images/business_class.jpg",
      icon: <Briefcase size={24} />,
      color: "var(--light-gold)",
      features: ["Lie-flat Seats", "Priority Boarding", "Gourmet Meals", "Premium WiFi"]
    },
    {
      id: 3,
      name: "Premium Economy",
      description: "Extra legroom, enhanced meals, and superior comfort",
      image: "/videos_images/premium_econmy.jpg",
      icon: <Star size={24} />,
      color: "var(--white)",
      features: ["Extra Legroom", "Enhanced Meals", "Priority Check-in", "Complimentary WiFi"]
    }
  ];

  // Premium features comparison
  const premiumFeatures = [
    { icon: <Wifi size={20} />, label: "Premium WiFi", available: [true, true, true] },
    { icon: <Coffee size={20} />, label: "Lounge Access", available: [true, true, false] },
    { icon: <Bed size={20} />, label: "Lie-flat Seats", available: [true, true, false] },
    { icon: <Utensils size={20} />, label: "Fine Dining", available: [true, true, true] },
    { icon: <Headphones size={20} />, label: "Noise Canceling", available: [true, true, true] },
    { icon: <Shield size={20} />, label: "24/7 Concierge", available: [true, false, false] }
  ];

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('luxury-experience');
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

  // Placeholder function for cabin details
  const handleViewCabin = (cabin) => {
    console.log('Viewing cabin:', cabin.name);
    // TODO: Open modal or navigate to cabin details page
  };

  return (
    <section id="luxury-experience" className="luxury-experience section">
      <div className="container">
        {/* Section Header */}
        <div className={`section-header fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="header-content">
            <h2 className="section-title">The SkyLux Experience</h2>
            <p className="section-subtitle">
              Discover our premium cabin offerings designed for the ultimate in comfort and luxury
            </p>
          </div>
        </div>

        {/* Cabin Cards Grid */}
        <div className={`cabins-grid fade-in-up ${isVisible ? 'visible' : ''}`}>
          {cabins.map((cabin, index) => (
            <div 
              key={cabin.id} 
              className="cabin-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-image">
                <img 
                  src={cabin.image} 
                  alt={`${cabin.name} cabin`}
                  loading="lazy"
                />
                <div className="card-overlay">
                  <div className="overlay-content">
                    <div className="cabin-icon" style={{ color: cabin.color }}>
                      {cabin.icon}
                    </div>
                    <h3 className="cabin-name">{cabin.name}</h3>
                    <button 
                      className="view-cabin-btn"
                      onClick={() => handleViewCabin(cabin)}
                    >
                      <span>View Cabin</span>
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="cabin-header">
                  <div className="cabin-icon-small" style={{ color: cabin.color }}>
                    {cabin.icon}
                  </div>
                  <h3 className="cabin-title">{cabin.name}</h3>
                </div>
                
                <p className="cabin-description">{cabin.description}</p>
                
                <div className="cabin-features">
                  {cabin.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-tag">
                      <Sparkles size={12} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
                
                <button 
                  className="cabin-cta btn-primary"
                  onClick={() => handleViewCabin(cabin)}
                >
                  <span>Explore {cabin.name}</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Premium Features Comparison */}
        <div className={`features-comparison fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="comparison-header">
            <h3>Premium Features Comparison</h3>
            <p>Discover what's included in each cabin class</p>
          </div>
          
          <div className="comparison-grid">
            <div className="feature-labels">
              <div className="label-header">Features</div>
              {premiumFeatures.map((feature, index) => (
                <div key={index} className="feature-label">
                  <div className="feature-icon">{feature.icon}</div>
                  <span>{feature.label}</span>
                </div>
              ))}
            </div>
            
            <div className="cabin-columns">
              {cabins.map((cabin, cabinIndex) => (
                <div key={cabin.id} className="cabin-column">
                  <div className="column-header">
                    <div className="cabin-icon-small" style={{ color: cabin.color }}>
                      {cabin.icon}
                    </div>
                    <span className="cabin-name-small">{cabin.name}</span>
                  </div>
                  
                  {premiumFeatures.map((feature, featureIndex) => (
                    <div key={featureIndex} className="feature-check">
                      {feature.available[cabinIndex] ? (
                        <div className="check-icon available">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      ) : (
                        <div className="check-icon unavailable">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className={`cta-section fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="cta-content">
            <h3>Ready to Experience Luxury?</h3>
            <p>Book your premium flight and discover the SkyLux difference</p>
            <div className="cta-actions">
              <button className="btn btn-primary">
                <Crown size={18} />
                <span>Book First Class</span>
                <ArrowRight size={18} />
              </button>
              <button className="btn btn-secondary">
                <Briefcase size={18} />
                <span>View All Cabins</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LuxuryExperience;
