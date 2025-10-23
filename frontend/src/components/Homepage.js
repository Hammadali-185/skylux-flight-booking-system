import React, { useEffect } from 'react';
import Navigation from './Navigation';
import HeroSection from './HeroSection';
import SupportingCards from './SupportingCards';
import TopDestinations from './TopDestinations';
import LuxuryExperience from './LuxuryExperience';
import Testimonials from './Testimonials';
import Rewards from './Rewards';
import Newsletter from './Newsletter';
import Partners from './Partners';
import Footer from './Footer';
import './Homepage.css';

const Homepage = () => {
  useEffect(() => {
    // Add scroll-based animations
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
        }
      });
    }, observerOptions);

    // Observe all elements with animation classes
    const animatedElements = document.querySelectorAll('.fade-in-up, .fade-in, .slide-in-left, .slide-in-right');
    animatedElements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="homepage">
      <Navigation />
      <main>
        <HeroSection />
        <SupportingCards />
        <TopDestinations />
        <LuxuryExperience />
        <Testimonials />
        <Rewards />
        <Newsletter />
        <Partners />
      </main>
      <Footer />
    </div>
  );
};

export default Homepage;


