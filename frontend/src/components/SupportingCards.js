import React from 'react';
import { ArrowRight, Percent, Wifi, Armchair, Coffee, CheckCircle, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './SupportingCards.css';

const SupportingCards = () => {
  const navigate = useNavigate();
  
  const features = [
    {
      icon: <Coffee size={32} />,
      title: 'Premium Lounges',
      description: 'Access to exclusive airport lounges worldwide'
    },
    {
      icon: <Wifi size={32} />,
      title: 'High-Speed WiFi',
      description: 'Stay connected with complimentary internet'
    },
    {
      icon: <Armchair size={32} />,
      title: 'Extra Legroom',
      description: 'Spacious seating for maximum comfort'
    }
  ];

  return (
    <section className="supporting-cards section">
      <div className="container">
        <div className="cards-grid">
          {/* Special Offers Card */}
          <div className="card special-offers-card fade-in-up">
            <div className="card-background"></div>
            <div className="card-overlay"></div>
            <div className="card-content">
              <div className="card-icon">
                <Percent size={48} />
              </div>
              <h3 className="card-title">Special Offers</h3>
              <p className="card-description">
                Discover exclusive deals and limited-time offers for your next luxury journey.
              </p>
              <button 
                className="card-cta btn-secondary"
                onClick={() => navigate('/destinations')}
              >
                <span>View Offers</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Why Fly With Us Card */}
          <div className="card features-card fade-in-up">
            <div className="card-content">
              <h3 className="card-title">Why Fly With Us</h3>
              <p className="card-description">
                Experience the difference with our premium amenities and world-class service.
              </p>
              
              <div className="features-list">
                {features.map((feature, index) => (
                  <div key={index} className="feature-item">
                    <div className="feature-icon">
                      {feature.icon}
                    </div>
                    <div className="feature-content">
                      <h4 className="feature-title">{feature.title}</h4>
                      <p className="feature-description">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              
              <button className="card-cta btn-secondary">
                <span>Learn More</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>

          {/* Manage Booking Card */}
          <div className="card manage-booking-card fade-in-up">
            <div className="card-content">
              <div className="card-icon">
                <CheckCircle size={48} />
              </div>
              <h3 className="card-title">Manage Your Journey</h3>
              <p className="card-description">
                Quick access to check-in, seat selection, and booking modifications.
              </p>
              
              <div className="quick-actions">
                <button 
                  className="quick-action-btn"
                  onClick={() => navigate('/check-in')}
                >
                  <Calendar size={20} />
                  <span>Check-in</span>
                </button>
                <button 
                  className="quick-action-btn"
                  onClick={() => navigate('/manage-booking')}
                >
                  <CheckCircle size={20} />
                  <span>Manage Booking</span>
                </button>
              </div>
              
              <button 
                className="card-cta btn-primary"
                onClick={() => navigate('/book')}
              >
                <span>Get Started</span>
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SupportingCards;


