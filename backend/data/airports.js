// Airport and Country Data
const airports = {
  // United States
  'JFK': { name: 'John F. Kennedy International Airport', city: 'New York', country: 'United States', code: 'JFK' },
  'LAX': { name: 'Los Angeles International Airport', city: 'Los Angeles', country: 'United States', code: 'LAX' },
  'ORD': { name: "O'Hare International Airport", city: 'Chicago', country: 'United States', code: 'ORD' },
  'MIA': { name: 'Miami International Airport', city: 'Miami', country: 'United States', code: 'MIA' },
  'SFO': { name: 'San Francisco International Airport', city: 'San Francisco', country: 'United States', code: 'SFO' },
  'LAS': { name: 'McCarran International Airport', city: 'Las Vegas', country: 'United States', code: 'LAS' },
  'SEA': { name: 'Seattle-Tacoma International Airport', city: 'Seattle', country: 'United States', code: 'SEA' },
  'DFW': { name: 'Dallas/Fort Worth International Airport', city: 'Dallas', country: 'United States', code: 'DFW' },

  // United Kingdom
  'LHR': { name: 'Heathrow Airport', city: 'London', country: 'United Kingdom', code: 'LHR' },
  'LGW': { name: 'Gatwick Airport', city: 'London', country: 'United Kingdom', code: 'LGW' },
  'MAN': { name: 'Manchester Airport', city: 'Manchester', country: 'United Kingdom', code: 'MAN' },
  'EDI': { name: 'Edinburgh Airport', city: 'Edinburgh', country: 'United Kingdom', code: 'EDI' },

  // France
  'CDG': { name: 'Charles de Gaulle Airport', city: 'Paris', country: 'France', code: 'CDG' },
  'ORY': { name: 'Orly Airport', city: 'Paris', country: 'France', code: 'ORY' },
  'NCE': { name: 'Nice Côte d\'Azur Airport', city: 'Nice', country: 'France', code: 'NCE' },

  // Germany
  'FRA': { name: 'Frankfurt Airport', city: 'Frankfurt', country: 'Germany', code: 'FRA' },
  'MUC': { name: 'Munich Airport', city: 'Munich', country: 'Germany', code: 'MUC' },
  'BER': { name: 'Berlin Brandenburg Airport', city: 'Berlin', country: 'Germany', code: 'BER' },

  // Japan
  'NRT': { name: 'Narita International Airport', city: 'Tokyo', country: 'Japan', code: 'NRT' },
  'HND': { name: 'Haneda Airport', city: 'Tokyo', country: 'Japan', code: 'HND' },
  'KIX': { name: 'Kansai International Airport', city: 'Osaka', country: 'Japan', code: 'KIX' },

  // Australia
  'SYD': { name: 'Sydney Kingsford Smith Airport', city: 'Sydney', country: 'Australia', code: 'SYD' },
  'MEL': { name: 'Melbourne Airport', city: 'Melbourne', country: 'Australia', code: 'MEL' },
  'BNE': { name: 'Brisbane Airport', city: 'Brisbane', country: 'Australia', code: 'BNE' },

  // Canada
  'YYZ': { name: 'Toronto Pearson International Airport', city: 'Toronto', country: 'Canada', code: 'YYZ' },
  'YVR': { name: 'Vancouver International Airport', city: 'Vancouver', country: 'Canada', code: 'YVR' },
  'YUL': { name: 'Montréal-Pierre Elliott Trudeau International Airport', city: 'Montreal', country: 'Canada', code: 'YUL' },

  // United Arab Emirates
  'DXB': { name: 'Dubai International Airport', city: 'Dubai', country: 'United Arab Emirates', code: 'DXB' },
  'AUH': { name: 'Abu Dhabi International Airport', city: 'Abu Dhabi', country: 'United Arab Emirates', code: 'AUH' },

  // Singapore
  'SIN': { name: 'Singapore Changi Airport', city: 'Singapore', country: 'Singapore', code: 'SIN' },

  // India
  'BOM': { name: 'Chhatrapati Shivaji Maharaj International Airport', city: 'Mumbai', country: 'India', code: 'BOM' },
  'DEL': { name: 'Indira Gandhi International Airport', city: 'New Delhi', country: 'India', code: 'DEL' },
  'BLR': { name: 'Kempegowda International Airport', city: 'Bangalore', country: 'India', code: 'BLR' },

  // Pakistan
  'KHI': { name: 'Jinnah International Airport', city: 'Karachi', country: 'Pakistan', code: 'KHI' },
  'LHE': { name: 'Allama Iqbal International Airport', city: 'Lahore', country: 'Pakistan', code: 'LHE' },
  'SKT': { name: 'Sialkot International Airport', city: 'Sialkot', country: 'Pakistan', code: 'SKT' },
  'ISB': { name: 'Islamabad International Airport', city: 'Islamabad', country: 'Pakistan', code: 'ISB' },

  // South Korea
  'ICN': { name: 'Incheon International Airport', city: 'Seoul', country: 'South Korea', code: 'ICN' },

  // Thailand
  'BKK': { name: 'Suvarnabhumi Airport', city: 'Bangkok', country: 'Thailand', code: 'BKK' },

  // Malaysia
  'KUL': { name: 'Kuala Lumpur International Airport', city: 'Kuala Lumpur', country: 'Malaysia', code: 'KUL' },

  // Netherlands
  'AMS': { name: 'Amsterdam Airport Schiphol', city: 'Amsterdam', country: 'Netherlands', code: 'AMS' },

  // Switzerland
  'ZUR': { name: 'Zurich Airport', city: 'Zurich', country: 'Switzerland', code: 'ZUR' },

  // Italy
  'FCO': { name: 'Leonardo da Vinci International Airport', city: 'Rome', country: 'Italy', code: 'FCO' },
  'MXP': { name: 'Milan Malpensa Airport', city: 'Milan', country: 'Italy', code: 'MXP' },

  // Spain
  'MAD': { name: 'Adolfo Suárez Madrid–Barajas Airport', city: 'Madrid', country: 'Spain', code: 'MAD' },
  'BCN': { name: 'Barcelona-El Prat Airport', city: 'Barcelona', country: 'Spain', code: 'BCN' },

  // Brazil
  'GRU': { name: 'São Paulo/Guarulhos International Airport', city: 'São Paulo', country: 'Brazil', code: 'GRU' },
  'GIG': { name: 'Rio de Janeiro/Galeão International Airport', city: 'Rio de Janeiro', country: 'Brazil', code: 'GIG' }
};

const countries = [
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'FR', name: 'France', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷' }
];

module.exports = { airports, countries };


