import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Homepage from './components/Homepage';
import BookingFlow from './components/booking/BookingFlow';
import FlightStatus from './components/FlightStatus';
import ManageBooking from './components/ManageBooking';
import CheckIn from './components/CheckIn';
import Destinations from './components/Destinations';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/book" element={<BookingFlow />} />
          <Route path="/flight-status" element={<FlightStatus />} />
          <Route path="/manage-booking" element={<ManageBooking />} />
          <Route path="/check-in" element={<CheckIn />} />
          <Route path="/destinations" element={<Destinations />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
