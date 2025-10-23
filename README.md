# 🛫 SkyLux Airlines - Flight Booking System

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-16+-green.svg)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.18.2-lightgrey.svg)](https://expressjs.com/)

A comprehensive, full-stack flight booking and management system built with React, Node.js, and Express — featuring multi-step booking, real-time flight status, seat selection, and modern Glassmorphism UI.

## 🌟 Features

### ✈️ **Flight Booking System**
- **Multi-Step Booking Flow** - Search → Select → Seat → Fare → Confirm → E-Ticket
- **Real-time Flight Search** - Live airport and flight suggestions
- **Interactive Seat Map** - Visual seat selection with status indicators
- **Dynamic Pricing** - Real-time fare calculations
- **Multi-city Search** - Complex itinerary planning
- **E-Ticket Generation** - PDF tickets with QR codes

### 🎨 **Premium User Interface**
- **Glassmorphism Design** - Modern, elegant UI with frosted glass effects
- **Responsive Layout** - Works perfectly on all devices
- **Smooth Animations** - Professional motion design with Framer Motion
- **Video Background** - Cinematic homepage with airline aesthetic
- **Dark Theme** - Premium color palette with deep navy and gold accents

### 🛠️ **Advanced Functionality**
- **Booking Management** - Full CRUD operations for bookings
- **Check-in System** - Online check-in with boarding passes
- **Flight Status** - Real-time flight tracking with analytics
- **Seat Management** - Gender-based assignment, special seats
- **Promo Codes** - Discount and gift card system
- **Payment Integration** - Secure payment processing

## 🚀 Live Demo

- **Frontend**: [https://skylux-frontend.onrender.com](https://skylux-frontend.onrender.com)
- **Backend API**: [https://skylux-backend.onrender.com](https://skylux-backend.onrender.com)

## 📁 Project Structure

```
skylux-flight-booking-system/
├── frontend/                 # React frontend application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable React components
│   │   │   ├── booking/     # Booking flow components
│   │   │   ├── Navigation.jsx
│   │   │   ├── HeroSection.jsx
│   │   │   └── ...
│   │   ├── App.js           # Main application component
│   │   └── index.js         # Application entry point
│   ├── package.json
│   └── README.md
├── backend/                  # Node.js backend API
│   ├── routes/              # API route handlers
│   ├── middleware/          # Custom middleware
│   ├── data/               # Mock data and utilities
│   ├── server.js           # Server entry point
│   └── package.json
├── package.json             # Root package.json
├── render.yaml             # Render deployment config
└── README.md
```

## 🛠️ Technology Stack

### **Frontend**
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Framer Motion** - Animation library
- **Lucide React** - Beautiful icons
- **Leaflet.js** - Interactive maps
- **jsPDF** - PDF generation
- **QRCode React** - QR code generation

### **Backend**
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Compression** - Response compression
- **Axios** - HTTP client

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm (v8 or higher)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Hammadali-185/skylux-flight-booking-system.git
   cd skylux-flight-booking-system
   ```

2. **Install dependencies**
   ```bash
   npm run install-all
   ```

3. **Start development servers**
   ```bash
   npm run dev
   ```

4. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

### Available Scripts

```bash
# Install all dependencies
npm run install-all

# Start both frontend and backend in development
npm run dev

# Start only backend server
npm run server

# Start only frontend client
npm run client

# Build frontend for production
npm run build

# Start production server
npm start
```

## 🌐 Deployment

### Render Deployment

This project is configured for easy deployment on Render:

1. **Backend Deployment**
   - Connect your GitHub repository to Render
   - Create a new Web Service
   - Use the `render.yaml` configuration
   - Backend will be available at: `https://skylux-backend.onrender.com`

2. **Frontend Deployment**
   - Create a new Static Site on Render
   - Build Command: `cd frontend && npm install && npm run build`
   - Publish Directory: `frontend/build`
   - Frontend will be available at: `https://skylux-frontend.onrender.com`

### Environment Variables

#### Backend (.env)
```env
NODE_ENV=production
PORT=10000
CORS_ORIGIN=https://skylux-frontend.onrender.com
```

#### Frontend
```env
REACT_APP_API_URL=https://skylux-backend.onrender.com
```

## 📱 Features Overview

### 🏠 **Homepage**
- Cinematic video background
- Premium airline branding
- Interactive search widget
- Featured destinations
- Luxury experience showcase
- Customer testimonials
- Rewards program

### ✈️ **Flight Booking**
- Advanced search with filters
- Real-time airport suggestions
- Flight comparison
- Seat selection with visual map
- Fare breakdown
- Payment processing
- E-ticket generation

### 🎫 **Booking Management**
- View booking history
- Modify existing bookings
- Cancel bookings
- Download tickets
- Check-in online
- Boarding pass generation

### 📊 **Flight Status**
- Real-time flight tracking
- Performance analytics
- Status updates
- Delay notifications

## 🎨 Design System

### **Color Palette**
- **Deep Navy**: `#1a1a2e` - Primary background
- **Burgundy**: `#8b1538` - Accent color
- **Champagne Gold**: `#d4af37` - Premium highlights
- **White**: `#ffffff` - Text and accents

### **Typography**
- **Headings**: Playfair Display (serif)
- **Body**: Inter (sans-serif)

### **Components**
- Glassmorphism cards with backdrop blur
- Smooth hover animations
- Responsive grid layouts
- Interactive form elements

## 🔧 API Endpoints

### **Flight Search**
- `GET /api/flights/search` - Search available flights
- `GET /api/airports/search` - Search airports
- `GET /api/flights/:id` - Get flight details

### **Booking Management**
- `POST /api/bookings` - Create new booking
- `GET /api/bookings/:id` - Get booking details
- `PUT /api/bookings/:id` - Update booking
- `DELETE /api/bookings/:id` - Cancel booking

### **Seat Management**
- `GET /api/seats/:flightId` - Get seat map
- `POST /api/seats/select` - Select seat
- `PUT /api/seats/update` - Update seat selection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Hammad Ali**
- GitHub: [@Hammadali-185](https://github.com/Hammadali-185)
- Project Link: [https://github.com/Hammadali-185/skylux-flight-booking-system](https://github.com/Hammadali-185/skylux-flight-booking-system)

## 🙏 Acknowledgments

- React team for the amazing framework
- Express.js for the robust backend
- Tailwind CSS for the utility-first approach
- Framer Motion for smooth animations
- All open-source contributors

---

⭐ **Star this repository if you found it helpful!**