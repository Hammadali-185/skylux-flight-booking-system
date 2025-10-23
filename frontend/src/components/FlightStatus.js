import React, { useState, useEffect } from 'react';
import { 
  Plane, 
  Clock, 
  MapPin, 
  TrendingUp, 
  TrendingDown, 
  AlertCircle, 
  CheckCircle, 
  XCircle,
  Calendar,
  Users,
  BarChart3,
  PieChart,
  Activity,
  RefreshCw,
  Filter,
  Search,
  Globe,
  Thermometer,
  Wind,
  Eye,
  Zap
} from 'lucide-react';
import Navigation from './Navigation';
import './FlightStatus.css';

const FlightStatus = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedTimeRange, setSelectedTimeRange] = useState('today');
  const [lastUpdated, setLastUpdated] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Mock flight data with realistic statuses
  const mockFlights = [
    {
      id: 'SL001',
      flightNumber: 'SL001',
      route: 'KHI → DXB',
      origin: 'Karachi',
      destination: 'Dubai',
      scheduledDeparture: '08:00',
      scheduledArrival: '10:30',
      actualDeparture: '08:15',
      actualArrival: '10:45',
      status: 'delayed',
      delay: 15,
      aircraft: 'Boeing 777-300ER',
      gate: 'A12',
      terminal: 'T1',
      passengers: 245,
      capacity: 300,
      weather: 'Clear',
      temperature: '28°C'
    },
    {
      id: 'SL002',
      flightNumber: 'SL002',
      route: 'LHE → DXB',
      origin: 'Lahore',
      destination: 'Dubai',
      scheduledDeparture: '14:30',
      scheduledArrival: '17:00',
      actualDeparture: '14:30',
      actualArrival: '16:55',
      status: 'on-time',
      delay: 0,
      aircraft: 'Airbus A330-300',
      gate: 'B8',
      terminal: 'T1',
      passengers: 198,
      capacity: 250,
      weather: 'Clear',
      temperature: '26°C'
    },
    {
      id: 'SL003',
      flightNumber: 'SL003',
      route: 'DXB → KHI',
      origin: 'Dubai',
      destination: 'Karachi',
      scheduledDeparture: '18:00',
      scheduledArrival: '20:30',
      actualDeparture: '18:00',
      actualArrival: '20:30',
      status: 'on-time',
      delay: 0,
      aircraft: 'Boeing 777-300ER',
      gate: 'C15',
      terminal: 'T2',
      passengers: 267,
      capacity: 300,
      weather: 'Clear',
      temperature: '30°C'
    },
    {
      id: 'SL004',
      flightNumber: 'SL004',
      route: 'SKT → DXB',
      origin: 'Sialkot',
      destination: 'Dubai',
      scheduledDeparture: '20:00',
      scheduledArrival: '22:30',
      actualDeparture: '20:45',
      actualArrival: '23:15',
      status: 'delayed',
      delay: 45,
      aircraft: 'Boeing 737-800',
      gate: 'A5',
      terminal: 'T1',
      passengers: 156,
      capacity: 180,
      weather: 'Cloudy',
      temperature: '24°C'
    },
    {
      id: 'SL005',
      flightNumber: 'SL005',
      route: 'ISB → DXB',
      origin: 'Islamabad',
      destination: 'Dubai',
      scheduledDeparture: '06:00',
      scheduledArrival: '08:30',
      actualDeparture: '06:00',
      actualArrival: '08:25',
      status: 'on-time',
      delay: 0,
      aircraft: 'Boeing 777-200LR',
      gate: 'B12',
      terminal: 'T1',
      passengers: 189,
      capacity: 280,
      weather: 'Clear',
      temperature: '22°C'
    },
    {
      id: 'SL006',
      flightNumber: 'SL006',
      route: 'KHI → LHE',
      origin: 'Karachi',
      destination: 'Lahore',
      scheduledDeparture: '10:00',
      scheduledArrival: '11:30',
      actualDeparture: '10:00',
      actualArrival: '11:30',
      status: 'on-time',
      delay: 0,
      aircraft: 'Airbus A320-200',
      gate: 'C8',
      terminal: 'T1',
      passengers: 134,
      capacity: 150,
      weather: 'Clear',
      temperature: '29°C'
    },
    {
      id: 'SL007',
      flightNumber: 'SL007',
      route: 'DXB → SKT',
      origin: 'Dubai',
      destination: 'Sialkot',
      scheduledDeparture: '12:00',
      scheduledArrival: '14:30',
      actualDeparture: null,
      actualArrival: null,
      status: 'cancelled',
      delay: 0,
      aircraft: 'Boeing 737-800',
      gate: 'B15',
      terminal: 'T2',
      passengers: 0,
      capacity: 180,
      weather: 'Storm',
      temperature: '25°C'
    },
    {
      id: 'SL008',
      flightNumber: 'SL008',
      route: 'LHE → ISB',
      origin: 'Lahore',
      destination: 'Islamabad',
      scheduledDeparture: '16:00',
      scheduledArrival: '17:00',
      actualDeparture: '16:00',
      actualArrival: null,
      status: 'boarding',
      delay: 0,
      aircraft: 'Airbus A320-200',
      gate: 'A8',
      terminal: 'T1',
      passengers: 142,
      capacity: 150,
      weather: 'Clear',
      temperature: '27°C'
    }
  ];

  useEffect(() => {
    // Simulate API call
    const loadFlights = () => {
      setLoading(true);
      setTimeout(() => {
        setFlights(mockFlights);
        setLoading(false);
        setLastUpdated(new Date());
      }, 1000);
    };

    loadFlights();

    // Auto refresh every 30 seconds
    let interval;
    if (autoRefresh) {
      interval = setInterval(loadFlights, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [autoRefresh]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'on-time':
        return <CheckCircle size={20} className="status-icon on-time" />;
      case 'delayed':
        return <Clock size={20} className="status-icon delayed" />;
      case 'cancelled':
        return <XCircle size={20} className="status-icon cancelled" />;
      case 'boarding':
        return <Users size={20} className="status-icon boarding" />;
      default:
        return <AlertCircle size={20} className="status-icon unknown" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'on-time':
        return '#22c55e';
      case 'delayed':
        return '#f59e0b';
      case 'cancelled':
        return '#ef4444';
      case 'boarding':
        return '#3b82f6';
      default:
        return '#6b7280';
    }
  };

  const filteredFlights = flights.filter(flight => {
    const matchesSearch = flight.flightNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flight.route.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || flight.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate statistics
  const stats = {
    total: flights.length,
    onTime: flights.filter(f => f.status === 'on-time').length,
    delayed: flights.filter(f => f.status === 'delayed').length,
    cancelled: flights.filter(f => f.status === 'cancelled').length,
    averageDelay: flights.reduce((sum, f) => sum + f.delay, 0) / flights.length,
    totalPassengers: flights.reduce((sum, f) => sum + f.passengers, 0),
    averageLoadFactor: flights.reduce((sum, f) => sum + (f.passengers / f.capacity), 0) / flights.length * 100
  };

  if (loading) {
    return (
      <div className="flight-status-container">
        <div className="loading-state">
          <RefreshCw size={32} className="loading-spinner" />
          <p>Loading flight status...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flight-status-container">
      <Navigation />
      {/* Header */}
      <div className="status-header">
        <div className="header-content">
          <div className="header-title">
            <Plane size={32} className="header-icon" />
            <div>
              <h1>Flight Status Dashboard</h1>
              <p>Real-time flight information and analytics</p>
            </div>
          </div>
          <div className="header-actions">
            <div className="status-indicators">
              <div className="indicator">
                <div className="indicator-dot live"></div>
                <span>Live</span>
              </div>
              <div className="last-updated">
                Last updated: {lastUpdated.toLocaleTimeString()}
              </div>
            </div>
            <button 
              className={`refresh-btn ${autoRefresh ? 'auto-refresh' : ''}`}
              onClick={() => setAutoRefresh(!autoRefresh)}
            >
              <RefreshCw size={16} />
              {autoRefresh ? 'Auto Refresh ON' : 'Auto Refresh OFF'}
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <Plane size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.total}</h3>
            <p>Total Flights</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon on-time">
            <CheckCircle size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.onTime}</h3>
            <p>On Time</p>
            <span className="stat-percentage">
              {((stats.onTime / stats.total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon delayed">
            <Clock size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.delayed}</h3>
            <p>Delayed</p>
            <span className="stat-percentage">
              {((stats.delayed / stats.total) * 100).toFixed(1)}%
            </span>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Users size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.totalPassengers.toLocaleString()}</h3>
            <p>Total Passengers</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <Activity size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.averageDelay.toFixed(0)}m</h3>
            <p>Avg Delay</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">
            <BarChart3 size={24} />
          </div>
          <div className="stat-content">
            <h3>{stats.averageLoadFactor.toFixed(1)}%</h3>
            <p>Load Factor</p>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-card">
          <div className="chart-header">
            <h3>Flight Status Distribution</h3>
            <PieChart size={20} />
          </div>
          <div className="pie-chart">
            <div 
              className="pie-chart-container"
              style={{
                background: `conic-gradient(
                  #22c55e 0deg ${(stats.onTime / stats.total) * 360}deg,
                  #3b82f6 ${(stats.onTime / stats.total) * 360}deg ${((stats.onTime + (flights.filter(f => f.status === 'boarding').length)) / stats.total) * 360}deg,
                  #f59e0b ${((stats.onTime + (flights.filter(f => f.status === 'boarding').length)) / stats.total) * 360}deg ${((stats.onTime + (flights.filter(f => f.status === 'boarding').length) + stats.delayed) / stats.total) * 360}deg,
                  #ef4444 ${((stats.onTime + (flights.filter(f => f.status === 'boarding').length) + stats.delayed) / stats.total) * 360}deg 360deg
                )`
              }}
            ></div>
            <div className="chart-legend">
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#22c55e' }}></div>
                <span>On Time ({stats.onTime})</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#3b82f6' }}></div>
                <span>Boarding ({flights.filter(f => f.status === 'boarding').length})</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#f59e0b' }}></div>
                <span>Delayed ({stats.delayed})</span>
              </div>
              <div className="legend-item">
                <div className="legend-color" style={{ backgroundColor: '#ef4444' }}></div>
                <span>Cancelled ({stats.cancelled})</span>
              </div>
            </div>
          </div>
        </div>

        <div className="chart-card">
          <div className="chart-header">
            <h3>Load Factor by Route</h3>
            <BarChart3 size={20} />
          </div>
          <div className="bar-chart">
            {flights.map(flight => {
              const loadFactor = (flight.passengers / flight.capacity) * 100;
              return (
                <div key={flight.id} className="bar-item">
                  <div className="bar-label">{flight.route}</div>
                  <div className="bar-container">
                    <div 
                      className="bar-fill" 
                      style={{ 
                        width: `${loadFactor}%`,
                        backgroundColor: loadFactor > 80 ? '#22c55e' : loadFactor > 60 ? '#f59e0b' : '#ef4444'
                      }}
                    ></div>
                    <span className="bar-value">{loadFactor.toFixed(1)}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="performance-section">
        <div className="section-header">
          <h2>Performance Metrics</h2>
          <div className="performance-badge">
            <Zap size={16} />
            <span>Real-time Analytics</span>
          </div>
        </div>
        
        <div className="metrics-grid">
          <div className="metric-card">
            <div className="metric-header">
              <h4>On-Time Performance</h4>
              <TrendingUp size={20} className="trend-up" />
            </div>
            <div className="metric-value">
              <span className="value">94.2%</span>
              <span className="change positive">+2.1%</span>
            </div>
            <div className="metric-chart">
              <div className="mini-chart">
                <div className="chart-line" style={{ height: '60%' }}></div>
                <div className="chart-line" style={{ height: '75%' }}></div>
                <div className="chart-line" style={{ height: '80%' }}></div>
                <div className="chart-line" style={{ height: '85%' }}></div>
                <div className="chart-line" style={{ height: '90%' }}></div>
                <div className="chart-line" style={{ height: '94%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <h4>Average Delay</h4>
              <TrendingDown size={20} className="trend-down" />
            </div>
            <div className="metric-value">
              <span className="value">8.5 min</span>
              <span className="change negative">-1.2 min</span>
            </div>
            <div className="metric-chart">
              <div className="mini-chart">
                <div className="chart-line" style={{ height: '70%' }}></div>
                <div className="chart-line" style={{ height: '65%' }}></div>
                <div className="chart-line" style={{ height: '60%' }}></div>
                <div className="chart-line" style={{ height: '55%' }}></div>
                <div className="chart-line" style={{ height: '50%' }}></div>
                <div className="chart-line" style={{ height: '45%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <h4>Load Factor</h4>
              <TrendingUp size={20} className="trend-up" />
            </div>
            <div className="metric-value">
              <span className="value">87.3%</span>
              <span className="change positive">+3.4%</span>
            </div>
            <div className="metric-chart">
              <div className="mini-chart">
                <div className="chart-line" style={{ height: '75%' }}></div>
                <div className="chart-line" style={{ height: '78%' }}></div>
                <div className="chart-line" style={{ height: '82%' }}></div>
                <div className="chart-line" style={{ height: '85%' }}></div>
                <div className="chart-line" style={{ height: '87%' }}></div>
                <div className="chart-line" style={{ height: '87%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="metric-card">
            <div className="metric-header">
              <h4>Customer Satisfaction</h4>
              <TrendingUp size={20} className="trend-up" />
            </div>
            <div className="metric-value">
              <span className="value">4.7/5</span>
              <span className="change positive">+0.2</span>
            </div>
            <div className="metric-chart">
              <div className="rating-stars">
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star filled">★</span>
                <span className="star partial">★</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section">
        <div className="search-box">
          <Search size={20} />
          <input
            type="text"
            placeholder="Search flights by number or route..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        
        <div className="filter-buttons">
          <button 
            className={`filter-btn ${statusFilter === 'all' ? 'active' : ''}`}
            onClick={() => setStatusFilter('all')}
          >
            All Flights
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'on-time' ? 'active' : ''}`}
            onClick={() => setStatusFilter('on-time')}
          >
            On Time
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'boarding' ? 'active' : ''}`}
            onClick={() => setStatusFilter('boarding')}
          >
            Boarding
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'delayed' ? 'active' : ''}`}
            onClick={() => setStatusFilter('delayed')}
          >
            Delayed
          </button>
          <button 
            className={`filter-btn ${statusFilter === 'cancelled' ? 'active' : ''}`}
            onClick={() => setStatusFilter('cancelled')}
          >
            Cancelled
          </button>
        </div>
      </div>

      {/* Flight List */}
      <div className="flights-section">
        <div className="section-header">
          <h2>Flight Details</h2>
          <span className="flight-count">{filteredFlights.length} flights</span>
        </div>
        
        <div className="flights-grid">
          {filteredFlights.map(flight => (
            <div key={flight.id} className="flight-card">
              <div className="flight-header">
                <div className="flight-info">
                  <h3 className="flight-number">{flight.flightNumber}</h3>
                  <p className="flight-route">{flight.route}</p>
                </div>
                <div className="flight-status">
                  {getStatusIcon(flight.status)}
                  <span className={`status-text ${flight.status}`}>
                    {flight.status.replace('-', ' ').toUpperCase()}
                  </span>
                </div>
              </div>
              
              <div className="flight-details">
                <div className="detail-section">
                  <div className="detail-item">
                    <MapPin size={16} />
                    <span>{flight.origin} → {flight.destination}</span>
                  </div>
                  <div className="detail-item">
                    <Calendar size={16} />
                    <span>{flight.aircraft}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>Dep: {flight.actualDeparture || 'TBD'}</span>
                  </div>
                  <div className="detail-item">
                    <Clock size={16} />
                    <span>Arr: {flight.actualArrival || 'TBD'}</span>
                  </div>
                </div>
                
                <div className="detail-section">
                  <div className="detail-item">
                    <span>Gate: {flight.gate}</span>
                  </div>
                  <div className="detail-item">
                    <span>Terminal: {flight.terminal}</span>
                  </div>
                </div>
              </div>
              
              {flight.delay > 0 && (
                <div className="delay-info">
                  <AlertCircle size={16} />
                  <span>Delayed by {flight.delay} minutes</span>
                </div>
              )}
              
              <div className="flight-footer">
                <div className="passenger-info">
                  <Users size={16} />
                  <span>{flight.passengers}/{flight.capacity} passengers</span>
                </div>
                <div className="weather-info">
                  <span>{flight.weather} • {flight.temperature}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FlightStatus;
