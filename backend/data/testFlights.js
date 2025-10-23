// Quick reference for testing the booking system
// October 2024 Flight Test Data

const testRoutes = [
  // US Domestic Routes (October 1-30, 2024)
  {
    route: 'JFK → LAX',
    description: 'New York to Los Angeles',
    sampleDates: ['2024-10-01', '2024-10-05', '2024-10-10', '2024-10-15', '2024-10-20', '2024-10-25'],
    priceRange: '$299 - $1,699',
    flightTime: '6h 30m',
    aircraft: ['Boeing 787-9', 'Airbus A350', 'Boeing 777-300ER']
  },
  {
    route: 'LAX → JFK',
    description: 'Los Angeles to New York',
    sampleDates: ['2024-10-02', '2024-10-06', '2024-10-11', '2024-10-16', '2024-10-21', '2024-10-26'],
    priceRange: '$319 - $1,799',
    flightTime: '5h 45m',
    aircraft: ['Boeing 787-9', 'Airbus A350', 'Boeing 777-300ER']
  },
  {
    route: 'JFK → MIA',
    description: 'New York to Miami',
    sampleDates: ['2024-10-03', '2024-10-07', '2024-10-12', '2024-10-17', '2024-10-22', '2024-10-27'],
    priceRange: '$199 - $1,299',
    flightTime: '3h 15m',
    aircraft: ['Boeing 787-9', 'Airbus A350']
  },

  // International Routes
  {
    route: 'JFK → LHR',
    description: 'New York to London',
    sampleDates: ['2024-10-01', '2024-10-04', '2024-10-08', '2024-10-12', '2024-10-18', '2024-10-25'],
    priceRange: '$599 - $5,299',
    flightTime: '7h 00m',
    aircraft: ['Boeing 787-9', 'Airbus A350', 'Boeing 777-300ER', 'Airbus A380']
  },
  {
    route: 'LHR → JFK',
    description: 'London to New York',
    sampleDates: ['2024-10-02', '2024-10-05', '2024-10-09', '2024-10-13', '2024-10-19', '2024-10-26'],
    priceRange: '$649 - $5,599',
    flightTime: '8h 30m',
    aircraft: ['Boeing 787-9', 'Airbus A350', 'Boeing 777-300ER', 'Airbus A380']
  },
  {
    route: 'LAX → NRT',
    description: 'Los Angeles to Tokyo',
    sampleDates: ['2024-10-01', '2024-10-06', '2024-10-11', '2024-10-16', '2024-10-21', '2024-10-28'],
    priceRange: '$899 - $7,399',
    flightTime: '11h 30m',
    aircraft: ['Boeing 777-300ER', 'Airbus A350', 'Boeing 747-8']
  },
  {
    route: 'NRT → LAX',
    description: 'Tokyo to Los Angeles',
    sampleDates: ['2024-10-02', '2024-10-07', '2024-10-12', '2024-10-17', '2024-10-22', '2024-10-29'],
    priceRange: '$949 - $7,799',
    flightTime: '10h 45m',
    aircraft: ['Boeing 777-300ER', 'Airbus A350', 'Boeing 747-8']
  },
  {
    route: 'DXB → BOM',
    description: 'Dubai to Mumbai',
    sampleDates: ['2024-10-03', '2024-10-08', '2024-10-13', '2024-10-18', '2024-10-23', '2024-10-30'],
    priceRange: '$299 - $2,199',
    flightTime: '3h 15m',
    aircraft: ['Boeing 787-9', 'Airbus A350']
  }
];

const popularDestinations = [
  {
    code: 'LHR',
    city: 'London',
    country: 'United Kingdom',
    description: 'Historic charm meets modern luxury',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&h=600&fit=crop',
    highlights: ['Big Ben', 'Tower Bridge', 'British Museum', 'West End Shows']
  },
  {
    code: 'CDG',
    city: 'Paris',
    country: 'France',
    description: 'The City of Light and romance',
    image: 'https://images.unsplash.com/photo-1502602898536-47ad22581b52?w=800&h=600&fit=crop',
    highlights: ['Eiffel Tower', 'Louvre Museum', 'Champs-Élysées', 'Notre-Dame']
  },
  {
    code: 'NRT',
    city: 'Tokyo',
    country: 'Japan',
    description: 'Where tradition meets innovation',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&h=600&fit=crop',
    highlights: ['Shibuya Crossing', 'Mount Fuji', 'Senso-ji Temple', 'Tokyo Skytree']
  },
  {
    code: 'DXB',
    city: 'Dubai',
    country: 'United Arab Emirates',
    description: 'Luxury and adventure in the desert',
    image: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&h=600&fit=crop',
    highlights: ['Burj Khalifa', 'Palm Jumeirah', 'Dubai Mall', 'Desert Safari']
  },
  {
    code: 'SYD',
    city: 'Sydney',
    country: 'Australia',
    description: 'Harbor city with iconic landmarks',
    image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop',
    highlights: ['Sydney Opera House', 'Harbour Bridge', 'Bondi Beach', 'Blue Mountains']
  },
  {
    code: 'SIN',
    city: 'Singapore',
    country: 'Singapore',
    description: 'Garden city with world-class dining',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=800&h=600&fit=crop',
    highlights: ['Marina Bay Sands', 'Gardens by the Bay', 'Sentosa Island', 'Hawker Centers']
  }
];

const testingInstructions = {
  searchTips: [
    'Try searching "JFK" to "LAX" for October 1-30, 2024',
    'Search "New York" to find JFK airport',
    'Search "London" to find LHR (Heathrow)',
    'Try "Tokyo" for NRT (Narita) airport',
    'Search dates between 2024-10-01 and 2024-10-30'
  ],
  
  availableClasses: [
    'Economy: Starting from $199',
    'Premium Economy: Starting from $329', 
    'Business: Starting from $599',
    'First Class: Starting from $1,199'
  ],
  
  seatFeatures: [
    'Standard seats: No extra charge',
    'Extra legroom: +$50-100',
    'Emergency exit: +$75-125',
    'Window/Aisle preference: +$25-50'
  ],
  
  promoCodes: [
    'WELCOME10: 10% off (min $100)',
    'SAVE50: $50 off (min $200)',
    'LUXURY20: 20% off business/first (min $1000)',
    'FIRSTCLASS: 15% off first class (min $2000)'
  ]
};

module.exports = {
  testRoutes,
  popularDestinations,
  testingInstructions
};


