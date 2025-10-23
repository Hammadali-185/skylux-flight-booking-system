import React, { useState, useEffect } from 'react';
import { 
  Star, 
  Quote, 
  MapPin, 
  Shield, 
  CheckCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import './Testimonials.css';

const Testimonials = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Premium testimonials data with diverse travelers
  const testimonials = [
    {
      id: 1,
      name: "Michael Richardson",
      location: "London, UK",
      rating: 5,
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      review: "SkyLux turned my 14-hour flight into a spa experience. The staff was phenomenal and the First Class suite was absolutely luxurious.",
      cabin: "First Class",
      verified: true
    },
    {
      id: 2,
      name: "Sophia Laurent",
      location: "New York, USA",
      rating: 5,
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      review: "Business Class exceeded all expectations — comfort, meals, everything was perfect. The lie-flat seats made the long journey feel like a breeze.",
      cabin: "Business Class",
      verified: true
    },
    {
      id: 3,
      name: "Arjun Patel",
      location: "Dubai, UAE",
      rating: 4,
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      review: "The seamless check-in and premium lounges made traveling stress-free and enjoyable. SkyLux truly understands luxury travel.",
      cabin: "Business Class",
      verified: true
    },
    {
      id: 4,
      name: "Emma Thompson",
      location: "Sydney, Australia",
      rating: 5,
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      review: "Premium Economy was a pleasant surprise! Extra legroom, delicious meals, and excellent service. Great value for money.",
      cabin: "Premium Economy",
      verified: true
    },
    {
      id: 5,
      name: "James Wilson",
      location: "Toronto, Canada",
      rating: 5,
      image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      review: "From booking to landing, everything was flawless. The crew's attention to detail and genuine care made all the difference.",
      cabin: "First Class",
      verified: true
    },
    {
      id: 6,
      name: "Isabella Rodriguez",
      location: "Madrid, Spain",
      rating: 5,
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      review: "SkyLux's Business Class lounge in Dubai is incredible. The flight was just as amazing. Highly recommend!",
      cabin: "Business Class",
      verified: true
    }
  ];

  // Calculate average rating
  const averageRating = (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1);
  const totalReviews = testimonials.length;

  // Handle scroll animation
  useEffect(() => {
    const handleScroll = () => {
      const element = document.getElementById('testimonials-section');
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

  // Carousel navigation
  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % testimonials.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Render star rating
  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={`star ${index < rating ? 'filled' : 'empty'}`}
      />
    ));
  };

  // Get visible testimonials for carousel
  const getVisibleTestimonials = () => {
    const visible = [];
    for (let i = 0; i < 3; i++) {
      const index = (currentSlide + i) % testimonials.length;
      visible.push(testimonials[index]);
    }
    return visible;
  };

  return (
    <section id="testimonials-section" className="testimonials section">
      <div className="container">
        {/* Section Header */}
        <div className={`section-header fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="header-content">
            <h2 className="section-title">What Our Travelers Say</h2>
            <p className="section-subtitle">
              Real experiences from passengers who've flown with SkyLux
            </p>
          </div>
        </div>

        {/* Average Rating Bar */}
        <div className={`rating-bar fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="rating-content">
            <div className="rating-stats">
              <div className="average-rating">
                <span className="rating-number">{averageRating}</span>
                <div className="stars">
                  {renderStars(Math.floor(parseFloat(averageRating)))}
                </div>
              </div>
              <div className="rating-text">
                <span className="rating-label">Average Rating</span>
                <span className="review-count">Based on {totalReviews}+ verified reviews</span>
              </div>
            </div>
            <div className="rating-badge">
              <Shield size={16} />
              <span>Verified Travelers</span>
            </div>
          </div>
        </div>

        {/* Testimonials Grid */}
        <div className={`testimonials-grid fade-in-up ${isVisible ? 'visible' : ''}`}>
          {testimonials.slice(0, 3).map((testimonial, index) => (
            <div 
              key={testimonial.id} 
              className="testimonial-card"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="card-content">
                <div className="quote-icon">
                  <Quote size={24} />
                </div>
                
                <div className="testimonial-header">
                  <div className="profile-section">
                    <div className="profile-image">
                      <img 
                        src={testimonial.image} 
                        alt={testimonial.name}
                        loading="lazy"
                      />
                      {testimonial.verified && (
                        <div className="verified-badge">
                          <CheckCircle size={12} />
                        </div>
                      )}
                    </div>
                    <div className="profile-info">
                      <h4 className="passenger-name">{testimonial.name}</h4>
                      <div className="passenger-location">
                        <MapPin size={12} />
                        <span>{testimonial.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="rating-section">
                    <div className="stars">
                      {renderStars(testimonial.rating)}
                    </div>
                    <div className="cabin-badge">
                      {testimonial.cabin}
                    </div>
                  </div>
                </div>
                
                <blockquote className="testimonial-text">
                  "{testimonial.review}"
                </blockquote>
              </div>
            </div>
          ))}
        </div>

        {/* Carousel for Mobile */}
        <div className={`testimonials-carousel fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="carousel-container">
            <button 
              className="carousel-btn prev"
              onClick={prevSlide}
              aria-label="Previous testimonial"
            >
              <ArrowLeft size={20} />
            </button>
            
            <div className="carousel-track">
              {getVisibleTestimonials().map((testimonial, index) => (
                <div 
                  key={`${testimonial.id}-${index}`}
                  className={`carousel-slide ${index === 1 ? 'active' : ''}`}
                >
                  <div className="testimonial-card">
                    <div className="card-content">
                      <div className="quote-icon">
                        <Quote size={20} />
                      </div>
                      
                      <div className="testimonial-header">
                        <div className="profile-section">
                          <div className="profile-image">
                            <img 
                              src={testimonial.image} 
                              alt={testimonial.name}
                              loading="lazy"
                            />
                            {testimonial.verified && (
                              <div className="verified-badge">
                                <CheckCircle size={10} />
                              </div>
                            )}
                          </div>
                          <div className="profile-info">
                            <h4 className="passenger-name">{testimonial.name}</h4>
                            <div className="passenger-location">
                              <MapPin size={10} />
                              <span>{testimonial.location}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="rating-section">
                          <div className="stars">
                            {renderStars(testimonial.rating)}
                          </div>
                          <div className="cabin-badge">
                            {testimonial.cabin}
                          </div>
                        </div>
                      </div>
                      
                      <blockquote className="testimonial-text">
                        "{testimonial.review}"
                      </blockquote>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <button 
              className="carousel-btn next"
              onClick={nextSlide}
              aria-label="Next testimonial"
            >
              <ArrowRight size={20} />
            </button>
          </div>
          
          <div className="carousel-dots">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className={`cta-section fade-in-up ${isVisible ? 'visible' : ''}`}>
          <div className="cta-content">
            <h3>Ready to Experience SkyLux?</h3>
            <p>Join thousands of satisfied travelers who choose SkyLux for their luxury journeys</p>
            <div className="cta-actions">
              <button className="btn btn-primary">
                <Star size={18} />
                <span>Book Your Flight</span>
              </button>
              <button className="btn btn-secondary">
                <span>Read More Reviews</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
