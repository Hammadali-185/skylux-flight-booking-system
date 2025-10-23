import React, { useState, useEffect } from 'react';
import { ChevronDown, Globe, User, Menu, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import './Navigation.css';

const Navigation = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Book Flights', path: '/book' },
    { name: 'Manage Booking', path: '/manage-booking' },
    { name: 'Check-in', path: '/check-in' },
    { name: 'Flight Status', path: '/flight-status' },
    { name: 'Destinations', path: '/destinations' }
  ];

  return (
    <nav className={`navigation ${isScrolled ? 'scrolled' : ''}`}>
      <div className="nav-container">
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="logo-icon">
            <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 2L38 35H2L20 2Z" fill="currentColor" fillOpacity="0.1"/>
              <path d="M20 8L32 28H8L20 8Z" fill="currentColor"/>
              <circle cx="20" cy="18" r="3" fill="var(--deep-navy)"/>
            </svg>
          </div>
          <span className="logo-text">SkyLux</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="nav-menu">
          {navItems.map((item, index) => (
            item.path.startsWith('#') ? (
              <a key={index} href={item.path} className="nav-link">
                {item.name}
              </a>
            ) : (
              <Link key={index} to={item.path} className="nav-link">
                {item.name}
              </Link>
            )
          ))}
        </div>

        {/* Right Side Controls */}
        <div className="nav-controls">
          <div className="nav-selector">
            <Globe size={18} />
            <span>EN</span>
            <ChevronDown size={16} />
          </div>
          
          <div className="nav-selector">
            <span>USD</span>
            <ChevronDown size={16} />
          </div>
          
          <button className="nav-profile">
            <User size={18} />
            <span>Sign In</span>
          </button>

          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-btn"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-content">
          {navItems.map((item, index) => (
            item.path.startsWith('#') ? (
              <a 
                key={index} 
                href={item.path} 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </a>
            ) : (
              <Link 
                key={index} 
                to={item.path} 
                className="mobile-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {item.name}
              </Link>
            )
          ))}
          <div className="mobile-controls">
            <div className="mobile-selector">
              <Globe size={18} />
              <span>English</span>
            </div>
            <div className="mobile-selector">
              <span>USD</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
