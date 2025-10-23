import React, { useState, useEffect } from 'react';
import { 
  Crown, 
  Star, 
  Gift, 
  Shield, 
  Zap, 
  Users, 
  Plane, 
  ArrowRight,
  CheckCircle,
  Sparkles,
  Award,
  TrendingUp,
  Clock,
  MapPin
} from 'lucide-react';
import './Rewards.css';

const Rewards = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredTier, setHoveredTier] = useState(null);

  // Reward tiers data
  const tiers = [
    {
      id: 1,
      title: "Silver",
      level: "Entry Level",
      points: "5 points per $1",
      color: "#C0C0C0",
      gradient: "linear-gradient(135deg, #C0C0C0 0%, #A8A8A8 100%)",
      perks: [
        { icon: <Star size={16} />, text: "Earn 5 points per $1 spent" },
        { icon: <Zap size={16} />, text: "Priority Check-In" },
        { icon: <CheckCircle size={16} />, text: "Free Seat Selection" },
        { icon: <Clock size={16} />, text: "Early Boarding" }
      ],
      benefits: ["Basic tier benefits", "Points never expire", "Member-only offers"]
    },
    {
      id: 2,
      title: "Gold",
      level: "Premium",
      points: "8 points per $1",
      color: "#FFD700",
      gradient: "linear-gradient(135deg, #FFD700 0%, #FFA500 100%)",
      perks: [
        { icon: <Star size={16} />, text: "Earn 8 points per $1" },
        { icon: <Users size={16} />, text: "Lounge Access" },
        { icon: <Gift size={16} />, text: "2× Baggage Allowance" },
        { icon: <Zap size={16} />, text: "Fast Track Boarding" }
      ],
      benefits: ["All Silver benefits", "Complimentary upgrades", "Priority customer service"]
    },
    {
      id: 3,
      title: "Platinum",
      level: "Elite",
      points: "12 points per $1",
      color: "#E5E4E2",
      gradient: "linear-gradient(135deg, #E5E4E2 0%, #C0C0C0 100%)",
      perks: [
        { icon: <Star size={16} />, text: "Earn 12 points per $1" },
        { icon: <Crown size={16} />, text: "First-Class Upgrade Vouchers" },
        { icon: <Shield size={16} />, text: "Dedicated Concierge Support" },
        { icon: <Users size={16} />, text: "Unlimited Lounge Access" }
      ],
      benefits: ["All Gold benefits", "Exclusive experiences", "Personal travel consultant"]
    }
  ];

  // Mock user progress
  const userProgress = {
    currentTier: "Silver",
    currentPoints: 3800,
    nextTier: "Gold",
    pointsNeeded: 1200,
    totalPoints: 5000
  };

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('rewards-section');
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

  // Handle tier hover
  const handleTierHover = (tierId) => {
    setHoveredTier(tierId);
  };

  const handleTierLeave = () => {
    setHoveredTier(null);
  };

  // Calculate progress percentage
  const progressPercentage = (userProgress.currentPoints / userProgress.totalPoints) * 100;

  return (
    <section id="rewards-section" className="rewards section">
      <div className="container">
        {/* Section Header */}
        <div className={`section-header fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="header-content">
            <h2 className="section-title">SkyLux Rewards</h2>
            <p className="section-subtitle">
              Earn miles, unlock upgrades, and travel smarter with our exclusive loyalty program
            </p>
          </div>
        </div>

        {/* Main Content */}
        <div className={`rewards-content fade-in-up ${isVisible ? 'visible' : ''}`}>
          {/* Left Side - Hero Images Gallery */}
          <div className="hero-section">
            <div className="images-gallery">
              {/* Main Image - Airplane Taking Off */}
              <div className="main-image">
                <img 
                  src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Airplane taking off"
                  loading="lazy"
                />
                <div className="image-overlay">
                  <div className="overlay-content">
                    <h3>Experience Luxury</h3>
                    <p>Join thousands of satisfied members</p>
                  </div>
                </div>
              </div>
              
              {/* Secondary Images Grid */}
              <div className="secondary-images">
                {/* In-Flight Dining */}
                <div className="secondary-image">
                  <img 
                    src="/videos_images/inflight_dinning.jpg"
                    alt="In-flight dining experience"
                    loading="lazy"
                  />
                  <div className="image-caption">
                    <span>In-Flight Dining</span>
                  </div>
                </div>
                
                {/* Premium Economy */}
                <div className="secondary-image">
                  <img 
                    src="/videos_images/premium_econmy.jpg"
                    alt="Premium economy cabin"
                    loading="lazy"
                  />
                  <div className="image-caption">
                    <span>Premium Economy</span>
                  </div>
                </div>
                
                {/* Premium Lounge Experience */}
                <div className="secondary-image">
                  <img 
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    alt="Luxury airport lounge with premium seating"
                    loading="lazy"
                  />
                  <div className="image-caption">
                    <span>Premium Lounges</span>
                  </div>
                </div>
                
                {/* Business Comfort with Laptop */}
                <div className="secondary-image laptop-image">
                  <img 
                    src="/videos_images/using_laptop.jpg"
                    alt="Business passenger working on laptop in cabin"
                    loading="lazy"
                  />
                  <div className="laptop-heading">
                    <h4>Yourself</h4>
                  </div>
                  <div className="image-caption">
                    <span>Work in Comfort</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Rewards Tiers */}
          <div className="tiers-section">
            {/* User Progress */}
            <div className="user-progress">
              <div className="progress-header">
                <h3>Your Progress</h3>
                <div className="current-tier">
                  <Award size={16} />
                  <span>{userProgress.currentTier} Member</span>
                </div>
              </div>
              
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${progressPercentage}%` }}></div>
              </div>
              
              <div className="progress-text">
                <span className="current-points">{userProgress.currentPoints.toLocaleString()} points</span>
                <span className="next-tier">
                  {userProgress.pointsNeeded.toLocaleString()} points to {userProgress.nextTier}
                </span>
              </div>
            </div>

            {/* Reward Tiers */}
            <div className="tiers-grid">
              {tiers.map((tier, index) => (
                <div 
                  key={tier.id}
                  className={`tier-card ${hoveredTier === tier.id ? 'hovered' : ''}`}
                  style={{ animationDelay: `${index * 0.2}s` }}
                  onMouseEnter={() => handleTierHover(tier.id)}
                  onMouseLeave={handleTierLeave}
                >
                  <div className="tier-header">
                    <div className="tier-icon" style={{ background: tier.gradient }}>
                      <Crown size={20} />
                    </div>
                    <div className="tier-info">
                      <h4 className="tier-title">{tier.title}</h4>
                      <p className="tier-level">{tier.level}</p>
                    </div>
                    <div className="tier-points">{tier.points}</div>
                  </div>
                  
                  <div className="tier-perks">
                    {tier.perks.map((perk, perkIndex) => (
                      <div key={perkIndex} className="perk-item">
                        <div className="perk-icon" style={{ color: tier.color }}>
                          {perk.icon}
                        </div>
                        <span className="perk-text">{perk.text}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="tier-benefits">
                    {tier.benefits.map((benefit, benefitIndex) => (
                      <div key={benefitIndex} className="benefit-item">
                        <CheckCircle size={12} />
                        <span>{benefit}</span>
                      </div>
                    ))}
                  </div>
                  
                  {hoveredTier === tier.id && (
                    <div className="tier-sparkle">
                      <Sparkles size={16} />
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Call to Action */}
            <div className="rewards-cta">
              <div className="cta-content">
                <h3>Ready to Start Earning?</h3>
                <p>Join SkyLux Rewards today and unlock exclusive benefits</p>
                <div className="cta-buttons">
                  <button className="btn btn-primary">
                    <Star size={18} />
                    <span>Join Now</span>
                    <ArrowRight size={18} />
                  </button>
                  <button className="btn btn-secondary">
                    <Shield size={18} />
                    <span>View Your Account</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Benefits Summary */}
        <div className={`benefits-summary fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="benefits-grid">
            <div className="benefit-card">
              <div className="benefit-icon">
                <TrendingUp size={24} />
              </div>
              <h4>Earn Faster</h4>
              <p>Accumulate points with every flight and purchase</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Gift size={24} />
              </div>
              <h4>Exclusive Upgrades</h4>
              <p>Redeem points for cabin upgrades and premium experiences</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Users size={24} />
              </div>
              <h4>Lounge Access</h4>
              <p>Relax in our premium lounges worldwide</p>
            </div>
            
            <div className="benefit-card">
              <div className="benefit-icon">
                <Shield size={24} />
              </div>
              <h4>Priority Service</h4>
              <p>Enjoy faster check-in and dedicated support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Rewards;
