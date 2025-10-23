const Flight = require('../models/Flight');

// Generate comprehensive flight data for October 1-30, 2024
const generateFlightData = () => {
  const flights = [];
  const routes = [
    // Popular US Routes
    { from: 'JFK', to: 'LAX', duration: '6h 30m', basePrice: { economy: 299, premium: 499, business: 899, first: 1599 } },
    { from: 'LAX', to: 'JFK', duration: '5h 45m', basePrice: { economy: 319, premium: 519, business: 919, first: 1699 } },
    { from: 'JFK', to: 'MIA', duration: '3h 15m', basePrice: { economy: 199, premium: 349, business: 649, first: 1199 } },
    { from: 'MIA', to: 'JFK', duration: '3h 00m', basePrice: { economy: 219, premium: 369, business: 669, first: 1249 } },
    { from: 'ORD', to: 'SFO', duration: '4h 30m', basePrice: { economy: 249, premium: 429, business: 799, first: 1449 } },
    { from: 'SFO', to: 'ORD', duration: '4h 15m', basePrice: { economy: 269, premium: 449, business: 819, first: 1499 } },
    
    // International Routes - US to Europe
    { from: 'JFK', to: 'LHR', duration: '7h 00m', basePrice: { economy: 599, premium: 999, business: 2499, first: 4999 } },
    { from: 'LHR', to: 'JFK', duration: '8h 30m', basePrice: { economy: 649, premium: 1099, business: 2699, first: 5299 } },
    { from: 'JFK', to: 'CDG', duration: '7h 30m', basePrice: { economy: 629, premium: 1029, business: 2599, first: 5199 } },
    { from: 'CDG', to: 'JFK', duration: '8h 45m', basePrice: { economy: 679, premium: 1129, business: 2799, first: 5499 } },
    { from: 'LAX', to: 'FRA', duration: '11h 30m', basePrice: { economy: 799, premium: 1299, business: 3199, first: 6399 } },
    { from: 'FRA', to: 'LAX', duration: '12h 15m', basePrice: { economy: 849, premium: 1399, business: 3399, first: 6799 } },
    
    // US to Asia
    { from: 'LAX', to: 'NRT', duration: '11h 30m', basePrice: { economy: 899, premium: 1499, business: 3499, first: 6999 } },
    { from: 'NRT', to: 'LAX', duration: '10h 45m', basePrice: { economy: 949, premium: 1599, business: 3699, first: 7399 } },
    { from: 'SFO', to: 'ICN', duration: '12h 00m', basePrice: { economy: 999, premium: 1699, business: 3899, first: 7799 } },
    { from: 'ICN', to: 'SFO', duration: '11h 15m', basePrice: { economy: 1049, premium: 1799, business: 4099, first: 8199 } },
    { from: 'LAX', to: 'SIN', duration: '17h 30m', basePrice: { economy: 1199, premium: 1999, business: 4499, first: 8999 } },
    { from: 'SIN', to: 'LAX', duration: '16h 45m', basePrice: { economy: 1249, premium: 2099, business: 4699, first: 9399 } },
    
    // Europe to Asia
    { from: 'LHR', to: 'DXB', duration: '7h 00m', basePrice: { economy: 499, premium: 799, business: 1999, first: 3999 } },
    { from: 'DXB', to: 'LHR', duration: '7h 30m', basePrice: { economy: 549, premium: 849, business: 2199, first: 4399 } },
    { from: 'FRA', to: 'BOM', duration: '8h 30m', basePrice: { economy: 699, premium: 1199, business: 2799, first: 5599 } },
    { from: 'BOM', to: 'FRA', duration: '9h 15m', basePrice: { economy: 749, premium: 1299, business: 2999, first: 5999 } },
    
    // Asia Pacific
    { from: 'NRT', to: 'SYD', duration: '9h 30m', basePrice: { economy: 799, premium: 1299, business: 2999, first: 5999 } },
    { from: 'SYD', to: 'NRT', duration: '9h 15m', basePrice: { economy: 849, premium: 1399, business: 3199, first: 6399 } },
    { from: 'SIN', to: 'BKK', duration: '2h 30m', basePrice: { economy: 199, premium: 329, business: 599, first: 1199 } },
    { from: 'BKK', to: 'SIN', duration: '2h 15m', basePrice: { economy: 219, premium: 349, business: 629, first: 1299 } },
    
    // Middle East Hub Routes
    { from: 'DXB', to: 'BOM', duration: '3h 15m', basePrice: { economy: 299, premium: 499, business: 999, first: 1999 } },
    { from: 'BOM', to: 'DXB', duration: '3h 30m', basePrice: { economy: 319, premium: 529, business: 1099, first: 2199 } },
    { from: 'DXB', to: 'SIN', duration: '7h 30m', basePrice: { economy: 599, premium: 999, business: 2299, first: 4599 } },
    { from: 'SIN', to: 'DXB', duration: '7h 15m', basePrice: { economy: 629, premium: 1049, business: 2499, first: 4999 } },
    
    // Pakistani Routes
    { from: 'KHI', to: 'DXB', duration: '2h 30m', basePrice: { economy: 450, premium: 750, business: 1499, first: 2999 } },
    { from: 'DXB', to: 'KHI', duration: '2h 30m', basePrice: { economy: 450, premium: 750, business: 1499, first: 2999 } },
    { from: 'LHE', to: 'DXB', duration: '2h 30m', basePrice: { economy: 480, premium: 800, business: 1599, first: 3199 } },
    { from: 'DXB', to: 'LHE', duration: '2h 30m', basePrice: { economy: 480, premium: 800, business: 1599, first: 3199 } },
    { from: 'SKT', to: 'DXB', duration: '2h 30m', basePrice: { economy: 420, premium: 700, business: 1399, first: 2799 } },
    { from: 'DXB', to: 'SKT', duration: '2h 30m', basePrice: { economy: 420, premium: 700, business: 1399, first: 2799 } },
    { from: 'ISB', to: 'DXB', duration: '2h 30m', basePrice: { economy: 460, premium: 760, business: 1519, first: 3039 } },
    { from: 'DXB', to: 'ISB', duration: '2h 30m', basePrice: { economy: 460, premium: 760, business: 1519, first: 3039 } },
    { from: 'KHI', to: 'LHE', duration: '1h 30m', basePrice: { economy: 180, premium: 300, business: 599, first: 1199 } },
    { from: 'LHE', to: 'KHI', duration: '1h 30m', basePrice: { economy: 175, premium: 295, business: 589, first: 1179 } },
    { from: 'SKT', to: 'KHI', duration: '1h 45m', basePrice: { economy: 120, premium: 200, business: 399, first: 799 } },
    { from: 'KHI', to: 'SKT', duration: '1h 45m', basePrice: { economy: 125, premium: 210, business: 419, first: 839 } },
    { from: 'LHE', to: 'ISB', duration: '1h 00m', basePrice: { economy: 100, premium: 170, business: 339, first: 679 } },
    { from: 'ISB', to: 'LHE', duration: '1h 00m', basePrice: { economy: 105, premium: 175, business: 349, first: 699 } }
  ];

  const airlines = ['SkyLux Airlines'];
  const aircraftTypes = [
    { type: 'Boeing 787-9', seats: { economy: 50, premium: 20, business: 15, first: 8 } },
    { type: 'Airbus A350', seats: { economy: 45, premium: 18, business: 12, first: 6 } },
    { type: 'Boeing 777-300ER', seats: { economy: 60, premium: 25, business: 20, first: 10 } },
    { type: 'Airbus A380', seats: { economy: 80, premium: 35, business: 25, first: 12 } },
    { type: 'Boeing 747-8', seats: { economy: 70, premium: 30, business: 22, first: 14 } }
  ];

  let flightCounter = 1;

  // Generate flights for each day in October 2024 and 2025
  const years = [2024, 2025];
  
  years.forEach(year => {
    for (let day = 1; day <= 30; day++) {
      const date = `${year}-10-${day.toString().padStart(2, '0')}`;
    
    routes.forEach((route, routeIndex) => {
      // Generate 2-4 flights per route per day
      const flightsPerDay = Math.floor(Math.random() * 3) + 2;
      
      for (let flightNum = 0; flightNum < flightsPerDay; flightNum++) {
        const aircraft = aircraftTypes[Math.floor(Math.random() * aircraftTypes.length)];
        const flightNumber = `SL ${(flightCounter).toString().padStart(3, '0')}`;
        
        // Generate departure times spread throughout the day
        const baseHour = Math.floor((flightNum * 24) / flightsPerDay);
        const hour = (baseHour + Math.floor(Math.random() * 3)) % 24;
        const minute = Math.floor(Math.random() * 60);
        const departureTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Calculate arrival time
        const durationParts = route.duration.split('h ');
        const durationHours = parseInt(durationParts[0]);
        const durationMinutes = parseInt(durationParts[1].replace('m', ''));
        
        const arrivalHour = (hour + durationHours + Math.floor((minute + durationMinutes) / 60)) % 24;
        const arrivalMinute = (minute + durationMinutes) % 60;
        const arrivalTime = `${arrivalHour.toString().padStart(2, '0')}:${arrivalMinute.toString().padStart(2, '0')}`;
        
        // Add some price variation (+/- 20%)
        const priceVariation = 0.8 + (Math.random() * 0.4);
        const baseFares = {};
        Object.keys(route.basePrice).forEach(cabin => {
          baseFares[cabin] = Math.round(route.basePrice[cabin] * priceVariation);
        });
        
        // Generate available seats (80-100% capacity)
        const availableSeats = {};
        Object.keys(aircraft.seats).forEach(cabin => {
          const maxSeats = aircraft.seats[cabin];
          availableSeats[cabin] = Math.floor(maxSeats * (0.8 + Math.random() * 0.2));
        });
        
        const flight = new Flight({
          id: `SL${flightCounter.toString().padStart(3, '0')}`,
          flightNumber: flightNumber,
          airline: airlines[0],
          aircraft: aircraft.type,
          origin: route.from,
          destination: route.to,
          departureTime: departureTime,
          arrivalTime: arrivalTime,
          duration: route.duration,
          date: date,
          availableSeats: availableSeats,
          baseFares: baseFares,
          taxes: Math.floor(50 + Math.random() * 200), // Random taxes between $50-250
          surcharges: Math.floor(25 + Math.random() * 100), // Random surcharges between $25-125
          amenities: [
            'Premium Lounge Access',
            'Gourmet Dining',
            'High-Speed WiFi',
            'In-flight Entertainment',
            'Extra Legroom',
            'Priority Boarding'
          ],
          status: 'active'
        });
        
        flights.push(flight);
        flightCounter++;
      }
    });
    }
  });

  return flights;
};

// Generate and export flight data
const flightData = generateFlightData();

console.log(`Generated ${flightData.length} flights for October 2024`);
console.log(`Sample routes: ${flightData.slice(0, 5).map(f => `${f.flightNumber}: ${f.origin}-${f.destination}`).join(', ')}`);

module.exports = flightData;


