import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Award, 
  Globe, 
  CheckCircle,
  Star,
  Zap,
  Lock,
  Users
} from 'lucide-react';
import './Partners.css';

const Partners = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState(null);

  // Partners and certifications data
  const partners = [
    {
      id: 1,
      name: "IATA",
      description: "International Air Transport Association",
      category: "Aviation Authority",
      icon: <Globe size={32} />,
      color: "#1e40af",
      website: "https://www.iata.org"
    },
    {
      id: 2,
      name: "Skytrax",
      description: "World Airline Awards",
      category: "Quality Rating",
      icon: <Star size={32} />,
      color: "#dc2626",
      website: "https://www.skytraxratings.com"
    },
    {
      id: 3,
      name: "ISO 9001",
      description: "Quality Management System",
      category: "Certification",
      icon: <Award size={32} />,
      color: "#059669",
      website: "https://www.iso.org"
    },
    {
      id: 4,
      name: "Visa",
      description: "Global Payment Network",
      category: "Payment Partner",
      icon: <Lock size={32} />,
      color: "#1a365d",
      website: "https://www.visa.com"
    },
    {
      id: 5,
      name: "MasterCard",
      description: "Worldwide Payment Solutions",
      category: "Payment Partner",
      icon: <Zap size={32} />,
      color: "#eb001b",
      website: "https://www.mastercard.com"
    },
    {
      id: 6,
      name: "American Express",
      description: "Premium Travel Services",
      category: "Payment Partner",
      icon: <Users size={32} />,
      color: "#006fcf",
      website: "https://www.americanexpress.com"
    },
    {
      id: 7,
      name: "Emirates Skywards",
      description: "Loyalty Program Partnership",
      category: "Airline Alliance",
      icon: <Globe size={32} />,
      color: "#d97706",
      website: "https://www.emirates.com"
    },
    {
      id: 8,
      name: "Boeing",
      description: "Aircraft Manufacturer",
      category: "Aircraft Partner",
      icon: <Shield size={32} />,
      color: "#1f2937",
      website: "https://www.boeing.com"
    },
    {
      id: 9,
      name: "Airbus",
      description: "Aircraft Manufacturer",
      category: "Aircraft Partner",
      icon: <CheckCircle size={32} />,
      color: "#7c3aed",
      website: "https://www.airbus.com"
    },
    {
      id: 10,
      name: "TSA",
      description: "Transportation Security",
      category: "Security Partner",
      icon: <Shield size={32} />,
      color: "#dc2626",
      website: "https://www.tsa.gov"
    },
    {
      id: 11,
      name: "FAA",
      description: "Federal Aviation Administration",
      category: "Regulatory Authority",
      icon: <Award size={32} />,
      color: "#1e40af",
      website: "https://www.faa.gov"
    },
    {
      id: 12,
      name: "ICAO",
      description: "International Civil Aviation",
      category: "Aviation Authority",
      icon: <Globe size={32} />,
      color: "#059669",
      website: "https://www.icao.int"
    }
  ];

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('partners-section');
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

  // Handle logo hover
  const handleLogoHover = (partnerId) => {
    setHoveredLogo(partnerId);
  };

  const handleLogoLeave = () => {
    setHoveredLogo(null);
  };

  // Group partners by category
  const groupedPartners = partners.reduce((acc, partner) => {
    if (!acc[partner.category]) {
      acc[partner.category] = [];
    }
    acc[partner.category].push(partner);
    return acc;
  }, {});

  return (
    <section id="partners-section" className="partners section">
      <div className="container">
        {/* Section Header */}
        <div className={`section-header fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="header-content">
            <h2 className="section-title">Our Partners & Certifications</h2>
            <p className="section-subtitle">
              SkyLux collaborates with globally recognized organizations and partners to ensure safety, quality, and a world-class travel experience
            </p>
          </div>
        </div>

        {/* Partners Grid */}
        <div className={`partners-content fade-in-up ${isVisible ? 'visible' : ''}`}>
          {Object.entries(groupedPartners).map(([category, categoryPartners], categoryIndex) => (
            <div 
              key={category}
              className="partner-category"
              style={{ animationDelay: `${categoryIndex * 0.2}s` }}
            >
              <h3 className="category-title">{category}</h3>
              <div className="partners-grid">
                {categoryPartners.map((partner, index) => (
                  <div
                    key={partner.id}
                    className={`partner-card ${hoveredLogo === partner.id ? 'hovered' : ''}`}
                    style={{ animationDelay: `${(categoryIndex * 0.2) + (index * 0.1)}s` }}
                    onMouseEnter={() => handleLogoHover(partner.id)}
                    onMouseLeave={handleLogoLeave}
                  >
                    <div className="partner-logo">
                      <div 
                        className="logo-icon"
                        style={{ color: partner.color }}
                      >
                        {partner.icon}
                      </div>
                    </div>
                    <div className="partner-info">
                      <h4 className="partner-name">{partner.name}</h4>
                      <p className="partner-description">{partner.description}</p>
                    </div>
                    
                    {hoveredLogo === partner.id && (
                      <div className="partner-overlay">
                        <div className="overlay-content">
                          <div className="partner-icon" style={{ color: partner.color }}>
                            {partner.icon}
                          </div>
                          <h4>{partner.name}</h4>
                          <p>{partner.description}</p>
                          <span className="partner-category">{partner.category}</span>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust Indicators */}
        <div className={`trust-indicators fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon">
                <Shield size={24} />
              </div>
              <div className="trust-content">
                <h4>Certified Safety</h4>
                <p>Internationally recognized safety standards</p>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <Award size={24} />
              </div>
              <div className="trust-content">
                <h4>Quality Assured</h4>
                <p>ISO certified service excellence</p>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <Globe size={24} />
              </div>
              <div className="trust-content">
                <h4>Global Network</h4>
                <p>Worldwide partnership network</p>
              </div>
            </div>
            
            <div className="trust-item">
              <div className="trust-icon">
                <CheckCircle size={24} />
              </div>
              <div className="trust-content">
                <h4>Verified Partners</h4>
                <p>Trusted by industry leaders</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;
