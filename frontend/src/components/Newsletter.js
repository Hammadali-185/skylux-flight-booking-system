import React, { useState, useEffect } from 'react';
import { 
  Mail, 
  Plane, 
  Globe, 
  CheckCircle, 
  Send,
  Sparkles,
  Shield,
  Bell
} from 'lucide-react';
import './Newsletter.css';

const Newsletter = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [error, setError] = useState('');

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('newsletter-section');
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

  // Email validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Store in localStorage (simulate backend)
      const subscribers = JSON.parse(localStorage.getItem('newsletterSubscribers') || '[]');
      const newSubscriber = {
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
        id: Date.now()
      };
      
      // Check if email already exists
      const existingSubscriber = subscribers.find(sub => sub.email === email.trim());
      if (existingSubscriber) {
        setError('This email is already subscribed');
        setIsSubmitting(false);
        return;
      }
      
      subscribers.push(newSubscriber);
      localStorage.setItem('newsletterSubscribers', JSON.stringify(subscribers));
      
      setIsSubscribed(true);
      setEmail('');
      
      // Reset success state after 5 seconds
      setTimeout(() => {
        setIsSubscribed(false);
      }, 5000);
      
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle input change
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <section id="newsletter-section" className="newsletter section">
      <div className="container">
        <div className={`newsletter-card fade-in-up ${isVisible ? 'visible' : ''}`}>
          {/* Background Elements */}
          <div className="background-elements">
            <div className="floating-plane">
              <Plane size={24} />
            </div>
            <div className="floating-globe">
              <Globe size={20} />
            </div>
            <div className="floating-sparkles">
              <Sparkles size={16} />
            </div>
          </div>

          {/* Content */}
          <div className="newsletter-content">
            {/* Header */}
            <div className="newsletter-header">
              <div className="header-icon">
                <Bell size={32} />
              </div>
              <h2 className="newsletter-title">Stay Updated</h2>
              <p className="newsletter-subtitle">
                Subscribe for exclusive SkyLux offers, travel inspiration, and updates on premium destinations
              </p>
            </div>

            {/* Success Message */}
            {isSubscribed && (
              <div className="success-message">
                <div className="success-icon">
                  <CheckCircle size={24} />
                </div>
                <div className="success-content">
                  <h3>Thank you for subscribing!</h3>
                  <p>We'll keep you updated with our latest offers and exclusive deals.</p>
                </div>
              </div>
            )}

            {/* Newsletter Form */}
            {!isSubscribed && (
              <form onSubmit={handleSubmit} className="newsletter-form">
                <div className="form-group">
                  <div className="input-container">
                    <div className="input-icon">
                      <Mail size={20} />
                    </div>
                    <input
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="Enter your email address"
                      className="email-input"
                      disabled={isSubmitting}
                      autoFocus
                    />
                    <button 
                      type="submit" 
                      className={`subscribe-btn ${isSubmitting ? 'loading' : ''}`}
                      disabled={isSubmitting || !email.trim()}
                    >
                      {isSubmitting ? (
                        <div className="loading-spinner">
                          <div className="spinner"></div>
                        </div>
                      ) : (
                        <>
                          <Send size={18} />
                          <span>Subscribe</span>
                        </>
                      )}
                    </button>
                  </div>
                  
                  {error && (
                    <div className="error-message">
                      <span>{error}</span>
                    </div>
                  )}
                </div>

                {/* Privacy Notice */}
                <div className="privacy-notice">
                  <Shield size={14} />
                  <span>We respect your inbox. Unsubscribe anytime.</span>
                </div>
              </form>
            )}

            {/* Benefits */}
            <div className="newsletter-benefits">
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Plane size={16} />
                </div>
                <span>Exclusive flight deals</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Globe size={16} />
                </div>
                <span>Destination inspiration</span>
              </div>
              <div className="benefit-item">
                <div className="benefit-icon">
                  <Sparkles size={16} />
                </div>
                <span>Member-only perks</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Newsletter;
