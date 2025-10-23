import React, { useState } from 'react';
import { 
  MapPin, 
  Plane, 
  Calendar, 
  DollarSign, 
  Star, 
  Search, 
  Filter,
  ArrowRight,
  Clock,
  Users,
  TrendingUp
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Navigation from './Navigation';
import './Destinations.css';

const Destinations = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRegion, setSelectedRegion] = useState('all');
  const [priceRange, setPriceRange] = useState('all');

  // Comprehensive destinations data with high-quality images
  const destinations = [
    {
      id: 1,
      city: "Paris",
      country: "France",
      image: "https://images.unsplash.com/photo-1549144511-f099e773c147?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$450",
      bestTime: "April–June",
      deals: "Up to 20% off",
      region: "europe",
      priceCategory: "mid",
      rating: 4.8,
      description: "The City of Light awaits with its romantic charm and world-class cuisine.",
      featured: true
    },
    {
      id: 2,
      city: "Tokyo",
      country: "Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2094&q=80",
      avgPrice: "$650",
      bestTime: "March–May",
      deals: "Cherry Blossom Season",
      region: "asia",
      priceCategory: "high",
      rating: 4.9,
      description: "Experience the perfect blend of ancient traditions and modern innovation.",
      featured: true
    },
    {
      id: 3,
      city: "Dubai",
      country: "UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$380",
      bestTime: "November–March",
      deals: "Luxury Package Deals",
      region: "middle-east",
      priceCategory: "mid",
      rating: 4.7,
      description: "Discover luxury shopping, stunning architecture, and desert adventures.",
      featured: true
    },
    {
      id: 4,
      city: "New York",
      country: "USA",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$520",
      bestTime: "April–June, September–November",
      deals: "Broadway Show Packages",
      region: "north-america",
      priceCategory: "high",
      rating: 4.6,
      description: "The city that never sleeps offers endless entertainment and iconic landmarks.",
      featured: false
    },
    {
      id: 5,
      city: "London",
      country: "UK",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$420",
      bestTime: "May–September",
      deals: "Royal Palace Tours",
      region: "europe",
      priceCategory: "mid",
      rating: 4.5,
      description: "Rich history, royal palaces, and world-class museums await your visit.",
      featured: false
    },
    {
      id: 6,
      city: "Sydney",
      country: "Australia",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$580",
      bestTime: "September–November, March–May",
      deals: "Harbor Bridge Climb",
      region: "oceania",
      priceCategory: "high",
      rating: 4.7,
      description: "Stunning harbor views, iconic Opera House, and vibrant city life.",
      featured: false
    },
    {
      id: 7,
      city: "Karachi",
      country: "Pakistan",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$280",
      bestTime: "October–March",
      deals: "Cultural Heritage Tours",
      region: "asia",
      priceCategory: "low",
      rating: 4.3,
      description: "Pakistan's largest city offers rich culture, delicious cuisine, and warm hospitality.",
      featured: true
    },
    {
      id: 8,
      city: "Barcelona",
      country: "Spain",
      image: "https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$390",
      bestTime: "May–June, September–October",
      deals: "Gaudi Architecture Tours",
      region: "europe",
      priceCategory: "mid",
      rating: 4.6,
      description: "Art, architecture, and Mediterranean beaches in one vibrant city.",
      featured: false
    },
    {
      id: 9,
      city: "Singapore",
      country: "Singapore",
      image: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$320",
      bestTime: "February–April",
      deals: "Garden City Experience",
      region: "asia",
      priceCategory: "mid",
      rating: 4.8,
      description: "A modern metropolis with stunning gardens and diverse cultural experiences.",
      featured: false
    },
    {
      id: 10,
      city: "Rome",
      country: "Italy",
      image: "https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2076&q=80",
      avgPrice: "$410",
      bestTime: "April–June, September–October",
      deals: "Ancient History Tours",
      region: "europe",
      priceCategory: "mid",
      rating: 4.7,
      description: "Walk through history in the Eternal City with its ancient ruins and art.",
      featured: false
    },
    {
      id: 11,
      city: "Lahore",
      country: "Pakistan",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$250",
      bestTime: "October–March",
      deals: "Mughal Heritage Tours",
      region: "asia",
      priceCategory: "low",
      rating: 4.4,
      description: "The cultural heart of Pakistan with magnificent Mughal architecture.",
      featured: true
    },
    {
      id: 12,
      city: "Bangkok",
      country: "Thailand",
      image: "https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$290",
      bestTime: "November–March",
      deals: "Temple & Street Food Tours",
      region: "asia",
      priceCategory: "low",
      rating: 4.5,
      description: "Vibrant street life, golden temples, and world-famous cuisine.",
      featured: false
    },
    {
      id: 13,
      city: "Istanbul",
      country: "Turkey",
      image: "https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$350",
      bestTime: "April–May, September–October",
      deals: "Historic City Tours",
      region: "europe",
      priceCategory: "mid",
      rating: 4.6,
      description: "Where East meets West with stunning architecture and rich history.",
      featured: false
    },
    {
      id: 14,
      city: "Cairo",
      country: "Egypt",
      image: "https://images.unsplash.com/photo-1539650116574-75c0c6d73c6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$320",
      bestTime: "October–April",
      deals: "Pyramid & Nile Tours",
      region: "africa",
      priceCategory: "mid",
      rating: 4.4,
      description: "Ancient wonders and modern marvels in the heart of Egypt.",
      featured: false
    },
    {
      id: 15,
      city: "Mumbai",
      country: "India",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$280",
      bestTime: "November–March",
      deals: "Bollywood Experience",
      region: "asia",
      priceCategory: "low",
      rating: 4.3,
      description: "The city of dreams with vibrant culture and Bollywood magic.",
      featured: false
    },
    {
      id: 16,
      city: "Amsterdam",
      country: "Netherlands",
      image: "https://images.unsplash.com/photo-1534351590666-13e3e96b5017?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$420",
      bestTime: "April–September",
      deals: "Canal & Museum Tours",
      region: "europe",
      priceCategory: "mid",
      rating: 4.7,
      description: "Charming canals, world-class museums, and cycling culture.",
      featured: false
    },
    {
      id: 17,
      city: "Vancouver",
      country: "Canada",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$480",
      bestTime: "May–September",
      deals: "Nature & City Combo",
      region: "north-america",
      priceCategory: "mid",
      rating: 4.8,
      description: "Stunning natural beauty meets urban sophistication.",
      featured: false
    },
    {
      id: 18,
      city: "Melbourne",
      country: "Australia",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$520",
      bestTime: "March–May, September–November",
      deals: "Coffee Culture Tours",
      region: "oceania",
      priceCategory: "high",
      rating: 4.6,
      description: "Australia's cultural capital with world-class dining and arts.",
      featured: false
    },
    {
      id: 19,
      city: "Sialkot",
      country: "Pakistan",
      image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$220",
      bestTime: "October–March",
      deals: "Sports Equipment Tours",
      region: "asia",
      priceCategory: "low",
      rating: 4.2,
      description: "Known for sports manufacturing and rich cultural heritage.",
      featured: true
    },
    {
      id: 20,
      city: "Zurich",
      country: "Switzerland",
      image: "https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      avgPrice: "$580",
      bestTime: "June–September",
      deals: "Alpine & City Experience",
      region: "europe",
      priceCategory: "high",
      rating: 4.9,
      description: "Swiss precision meets natural beauty in this alpine city.",
      featured: false
    }
  ];

  // Filter destinations based on search and filters
  const filteredDestinations = destinations.filter(destination => {
    const matchesSearch = searchTerm === '' || 
                         destination.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         destination.country.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = selectedRegion === 'all' || destination.region === selectedRegion;
    const matchesPrice = priceRange === 'all' || destination.priceCategory === priceRange;
    
    return matchesSearch && matchesRegion && matchesPrice;
  });

  // DEBUG: Log the filtered destinations
  console.log('Total destinations:', destinations.length);
  console.log('Filtered destinations:', filteredDestinations.length);
  console.log('Search term:', searchTerm);
  console.log('Selected region:', selectedRegion);
  console.log('Price range:', priceRange);


  // Get featured destinations
  const featuredDestinations = destinations.filter(dest => dest.featured);

  // Handle view flights
  const handleViewFlights = (destination) => {
    // Navigate to booking page with destination pre-filled
    const searchParams = new URLSearchParams({
      to: destination.city,
      country: destination.country
    });
    navigate(`/book?${searchParams.toString()}`);
  };

  // Handle book now
  const handleBookNow = (destination) => {
    // Navigate to booking page with destination pre-filled
    const searchParams = new URLSearchParams({
      to: destination.city,
      country: destination.country
    });
    navigate(`/book?${searchParams.toString()}`);
  };

  // Get price range label
  const getPriceRangeLabel = (category) => {
    switch (category) {
      case 'low': return 'Under $300';
      case 'mid': return '$300 - $500';
      case 'high': return 'Over $500';
      default: return 'All Prices';
    }
  };

  // Get region label
  const getRegionLabel = (region) => {
    switch (region) {
      case 'europe': return 'Europe';
      case 'asia': return 'Asia';
      case 'north-america': return 'North America';
      case 'middle-east': return 'Middle East';
      case 'oceania': return 'Oceania';
      case 'africa': return 'Africa';
      default: return 'All Regions';
    }
  };

  return (
    <div className="destinations-container">
      <Navigation />

      <div className="destinations-content">
        {/* Header */}
        <div className="destinations-header">
          <div className="header-content">
            <div className="header-title">
              <Plane size={32} className="header-icon" />
              <div>
                <h1>Discover Amazing Destinations</h1>
                <p>Explore the world with our premium flight deals and exclusive packages</p>
              </div>
            </div>
          </div>
        </div>

        {/* Featured Deals Section */}
        <div className="featured-section">
          <div className="section-header">
            <h2>Featured Destinations</h2>
            <p>Handpicked destinations with exclusive deals and experiences</p>
          </div>
          
          <div className="featured-grid">
            {featuredDestinations.map((destination) => (
              <div key={destination.id} className="featured-card">
                <div className="card-image">
                  <img src={destination.image} alt={`${destination.city}, ${destination.country}`} />
                  <div className="card-overlay">
                    <div className="overlay-content">
                      <div className="destination-info">
                        <h3>{destination.city}</h3>
                        <p>{destination.country}</p>
                      </div>
                      <div className="deal-badge">
                        <TrendingUp size={16} />
                        <span>{destination.deals}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-content">
                  <div className="destination-header">
                    <div className="location">
                      <MapPin size={16} />
                      <span>{destination.city}, {destination.country}</span>
                    </div>
                    <div className="rating">
                      <Star size={14} className="star-icon" />
                      <span>{destination.rating}</span>
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
                  
                  <div className="card-actions">
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleViewFlights(destination)}
                    >
                      <Plane size={16} />
                      View Flights
                    </button>
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleBookNow(destination)}
                    >
                      Book Now
                      <ArrowRight size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="search-filter-section">
          <div className="section-header">
            <h2>All Destinations</h2>
            <p>Find your perfect destination with our advanced search and filters</p>
          </div>
          
          <div className="search-filter-bar">
            <div className="search-input-group">
              <Search size={20} className="search-icon" />
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
            </div>
            
            <div className="filter-group">
              <div className="filter-item">
                <Filter size={16} />
                <select 
                  value={selectedRegion} 
                  onChange={(e) => setSelectedRegion(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Regions</option>
                  <option value="europe">Europe</option>
                  <option value="asia">Asia</option>
                  <option value="north-america">North America</option>
                  <option value="middle-east">Middle East</option>
                  <option value="oceania">Oceania</option>
                  <option value="africa">Africa</option>
                </select>
              </div>
              
              <div className="filter-item">
                <DollarSign size={16} />
                <select 
                  value={priceRange} 
                  onChange={(e) => setPriceRange(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Prices</option>
                  <option value="low">Under $300</option>
                  <option value="mid">$300 - $500</option>
                  <option value="high">Over $500</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* All Destinations Grid */}
        <div className="destinations-grid">
          <div className="destinations-count">
            <p>Showing {filteredDestinations.length} of {destinations.length} destinations</p>
          </div>
          {filteredDestinations.map((destination) => (
            <div key={destination.id} className="destination-card">
              <div className="card-image">
                <img src={destination.image} alt={`${destination.city}, ${destination.country}`} />
                <div className="card-overlay">
                  <div className="overlay-content">
                    <div className="destination-info">
                      <h3>{destination.city}</h3>
                      <p>{destination.country}</p>
                    </div>
                    {destination.deals && (
                      <div className="deal-badge">
                        <TrendingUp size={14} />
                        <span>{destination.deals}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="card-content">
                <div className="destination-header">
                  <div className="location">
                    <MapPin size={14} />
                    <span>{destination.city}, {destination.country}</span>
                  </div>
                  <div className="rating">
                    <Star size={12} className="star-icon" />
                    <span>{destination.rating}</span>
                  </div>
                </div>
                
                <p className="description">{destination.description}</p>
                
                <div className="destination-details">
                  <div className="detail-item">
                    <DollarSign size={12} />
                    <span>From {destination.avgPrice}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={12} />
                    <span>{destination.bestTime}</span>
                  </div>
                </div>
                
                <div className="card-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleViewFlights(destination)}
                  >
                    <Plane size={14} />
                    View Flights
                  </button>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => handleBookNow(destination)}
                  >
                    Book Now
                    <ArrowRight size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredDestinations.length === 0 && (
          <div className="no-results">
            <Search size={48} />
            <h3>No destinations found</h3>
            <p>Try adjusting your search criteria or filters</p>
            <button 
              className="btn btn-primary"
              onClick={() => {
                setSearchTerm('');
                setSelectedRegion('all');
                setPriceRange('all');
              }}
            >
              Clear Filters
            </button>
          </div>
        )}

        {/* Call to Action */}
        <div className="cta-section">
          <div className="cta-content">
            <h2>Ready to Explore?</h2>
            <p>Book your next adventure with SkyLux Airlines and discover the world</p>
            <div className="cta-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={() => navigate('/book')}
              >
                <Plane size={20} />
                Start Booking
              </button>
              <button 
                className="btn btn-secondary btn-large"
                onClick={() => navigate('/flight-status')}
              >
                <Clock size={20} />
                Check Flight Status
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Destinations;
