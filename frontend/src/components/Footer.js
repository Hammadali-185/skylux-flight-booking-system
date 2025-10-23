import React, { useState } from 'react';
import { ArrowRight, Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
    // Handle newsletter signup logic here
  };

  const footerLinks = {
    company: [
      { name: 'About Us', href: '#about' },
      { name: 'Our Fleet', href: '#fleet' },
      { name: 'Careers', href: '#careers' },
      { name: 'Press', href: '#press' },
      { name: 'Investors', href: '#investors' }
    ],
    support: [
      { name: 'Help Center', href: '#help' },
      { name: 'Contact Us', href: '#contact' },
      { name: 'Baggage Info', href: '#baggage' },
      { name: 'Travel Alerts', href: '#alerts' },
      { name: 'Accessibility', href: '#accessibility' }
    ],
    services: [
      { name: 'Premium Lounges', href: '#lounges' },
      { name: 'In-flight Services', href: '#services' },
      { name: 'Special Assistance', href: '#assistance' },
      { name: 'Group Travel', href: '#group' },
      { name: 'Cargo Services', href: '#cargo' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook size={20} />, href: '#facebook', name: 'Facebook' },
    { icon: <Twitter size={20} />, href: '#twitter', name: 'Twitter' },
    { icon: <Instagram size={20} />, href: '#instagram', name: 'Instagram' },
    { icon: <Linkedin size={20} />, href: '#linkedin', name: 'LinkedIn' }
  ];

  return (
    <footer className="footer">
      <div className="container">
        {/* Main Footer Content */}
        <div className="footer-main">
          <div className="footer-grid">
            {/* Brand Section */}
            <div className="footer-brand">
              <div className="footer-logo">
                <div className="logo-icon">
                  <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 2L38 35H2L20 2Z" fill="currentColor" fillOpacity="0.1"/>
                    <path d="M20 8L32 28H8L20 8Z" fill="currentColor"/>
                    <circle cx="20" cy="18" r="3" fill="var(--deep-navy)"/>
                  </svg>
                </div>
                <span className="logo-text">SkyLux</span>
              </div>
              <p className="footer-description">
                Experience luxury above the clouds with our premium airline service. 
                Your journey begins with unparalleled comfort and exceptional hospitality.
              </p>
              
              {/* Contact Info */}
              <div className="contact-info">
                <div className="contact-item">
                  <Phone size={16} />
                  <span>+1 (555) 123-4567</span>
                </div>
                <div className="contact-item">
                  <Mail size={16} />
                  <span>info@skylux.com</span>
                </div>
                <div className="contact-item">
                  <MapPin size={16} />
                  <span>New York, NY 10001</span>
                </div>
              </div>
            </div>

            {/* Links Sections */}
            <div className="footer-links">
              <div className="links-column">
                <h4 className="links-title">Company</h4>
                <ul className="links-list">
                  {footerLinks.company.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4 className="links-title">Support</h4>
                <ul className="links-list">
                  {footerLinks.support.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="links-column">
                <h4 className="links-title">Services</h4>
                <ul className="links-list">
                  {footerLinks.services.map((link, index) => (
                    <li key={index}>
                      <a href={link.href} className="footer-link">
                        {link.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Newsletter Section */}
            <div className="footer-newsletter">
              <h4 className="newsletter-title">Stay Updated</h4>
              <p className="newsletter-description">
                Subscribe to receive exclusive offers, travel tips, and the latest news from SkyLux.
              </p>
              
              <form className="newsletter-form" onSubmit={handleNewsletterSubmit}>
                <div className="newsletter-input-group">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="newsletter-input"
                    required
                  />
                  <button type="submit" className="newsletter-btn">
                    <ArrowRight size={18} />
                  </button>
                </div>
              </form>

              {/* Social Links */}
              <div className="social-links">
                <span className="social-title">Follow Us</span>
                <div className="social-icons">
                  {socialLinks.map((social, index) => (
                    <a
                      key={index}
                      href={social.href}
                      className="social-link"
                      aria-label={social.name}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-legal">
              <p>&copy; 2024 SkyLux Airlines. All rights reserved.</p>
              <div className="legal-links">
                <a href="#privacy" className="legal-link">Privacy Policy</a>
                <a href="#terms" className="legal-link">Terms of Service</a>
                <a href="#cookies" className="legal-link">Cookie Policy</a>
              </div>
            </div>
            
            <div className="footer-certifications">
              <span className="certification">IATA Certified</span>
              <span className="certification">ISO 9001</span>
              <span className="certification">SKYTRAX 5★</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;


