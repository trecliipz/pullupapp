import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import MapContainer from './components/MapContainer';
import SearchPanel from './components/SearchPanel';
import VehicleSelector from './components/VehicleSelector';
import ActiveRidePanel from './components/ActiveRidePanel';
import Icon from '../../components/AppIcon';

const RiderDashboard = () => {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({
    lat: 40.7128,
    lng: -74.0060,
    address: '123 Main Street, New York, NY 10001'
  });
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [availableDrivers, setAvailableDrivers] = useState([]);
  const [selectedDriver, setSelectedDriver] = useState(null);
  const [activeRide, setActiveRide] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isRequestingRide, setIsRequestingRide] = useState(false);
  const [showVehicleSelector, setShowVehicleSelector] = useState(false);
  const [currentMode, setCurrentMode] = useState('rider');

  // Mock user data
  const user = {
    id: 1,
    name: 'John Smith',
    email: 'john.smith@example.com',
    phone: '+1 (555) 123-4567',
    photo: 'https://randomuser.me/api/portraits/men/1.jpg'
  };

  // Mock available drivers
  const mockDrivers = [
    {
      id: 1,
      name: 'Michael Rodriguez',
      rating: 4.9,
      photo: 'https://randomuser.me/api/portraits/men/32.jpg',
      vehicle: {
        make: 'Toyota',
        model: 'Camry',
        color: 'Silver',
        licensePlate: 'ABC-1234'
      },
      location: {
        lat: 40.7138,
        lng: -74.0070
      },
      eta: '3 min',
      distance: 0.5
    },
    {
      id: 2,
      name: 'Sarah Johnson',
      rating: 4.8,
      photo: 'https://randomuser.me/api/portraits/women/44.jpg',
      vehicle: {
        make: 'Honda',
        model: 'Accord',
        color: 'Black',
        licensePlate: 'XYZ-5678'
      },
      location: {
        lat: 40.7118,
        lng: -74.0050
      },
      eta: '5 min',
      distance: 0.8
    },
    {
      id: 3,
      name: 'David Chen',
      rating: 4.7,
      photo: 'https://randomuser.me/api/portraits/men/22.jpg',
      vehicle: {
        make: 'Nissan',
        model: 'Altima',
        color: 'White',
        licensePlate: 'DEF-9012'
      },
      location: {
        lat: 40.7148,
        lng: -74.0040
      },
      eta: '7 min',
      distance: 1.2
    }
  ];

  // Mock recent locations
  const recentLocations = [
    {
      id: 1,
      name: 'Central Park',
      address: 'Central Park, New York, NY',
      type: 'park'
    },
    {
      id: 2,
      name: 'Times Square',
      address: 'Times Square, New York, NY',
      type: 'landmark'
    },
    {
      id: 3,
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York, NY',
      type: 'landmark'
    }
  ];

  // Initialize location on mount
  useEffect(() => {
    // Simulate GPS location detection
    const detectLocation = () => {
      setCurrentLocation({
        lat: 40.7128,
        lng: -74.0060,
        address: '123 Main Street, New York, NY 10001'
      });
    };

    detectLocation();
    setAvailableDrivers(mockDrivers);
  }, []);

  // Handle destination change
  const handleDestinationChange = (newDestination) => {
    setDestination(newDestination);
    setIsSearching(true);
    
    // Simulate search delay
    setTimeout(() => {
      setIsSearching(false);
      if (newDestination.trim()) {
        setShowVehicleSelector(true);
      } else {
        setShowVehicleSelector(false);
      }
    }, 1000);
  };

  // Handle quick location selection
  const handleQuickLocationSelect = (location) => {
    setDestination(location.address);
    setShowVehicleSelector(true);
  };

  // Handle vehicle selection
  const handleVehicleSelect = (vehicle) => {
    setSelectedVehicle(vehicle);
  };

  // Handle driver selection
  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver);
  };

  // Handle ride request
  const handleRequestRide = async () => {
    if (!selectedVehicle || !destination) return;

    setIsRequestingRide(true);
    
    // Simulate ride request process
    setTimeout(() => {
      const mockActiveRide = {
        id: Date.now(),
        status: 'driver_assigned',
        pickup: {
          address: currentLocation.address,
          coordinates: currentLocation
        },
        destination: {
          address: destination,
          coordinates: { lat: 40.7589, lng: -73.9851 }
        },
        driver: mockDrivers[0],
        vehicle: selectedVehicle,
        eta: '5 min',
        fare: selectedVehicle.price,
        createdAt: new Date()
      };

      setActiveRide(mockActiveRide);
      setIsRequestingRide(false);
      setShowVehicleSelector(false);
    }, 3000);
  };

  // Handle ride cancellation
  const handleCancelRide = () => {
    setActiveRide(null);
    setSelectedVehicle(null);
    setSelectedDriver(null);
    setDestination('');
    setShowVehicleSelector(false);
  };

  // Handle driver contact
  const handleContactDriver = (type, driver) => {
    if (type === 'message') {
      // Simulate opening message interface
      console.log('Opening message interface with driver:', driver.name);
    } else if (type === 'call') {
      // Simulate initiating call
      console.log('Initiating call with driver:', driver.name);
    }
  };

  // Handle emergency
  const handleEmergency = () => {
    // Simulate emergency protocol
    console.log('Emergency protocol activated');
    alert('Emergency services have been notified. Stay safe!');
  };

  // Handle ride tracking
  const handleTrackRide = () => {
    navigate('/active-ride-tracking');
  };

  // Handle mode change
  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
  };

  // Handle location update
  const handleLocationUpdate = (newLocation) => {
    setCurrentLocation(newLocation);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={user}
        currentMode={currentMode}
        activeRide={activeRide}
        onModeChange={handleModeChange}
      />

      <main className="pt-16 h-screen flex flex-col">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            currentLocation={currentLocation}
            destination={destination}
            availableDrivers={availableDrivers}
            selectedDriver={selectedDriver}
            onDriverSelect={handleDriverSelect}
            activeRide={activeRide}
            onLocationUpdate={handleLocationUpdate}
          />

          {/* Location Permission Banner */}
          <div className="absolute top-4 left-4 right-4 z-10">
            <div className="bg-surface rounded-lg shadow-card border border-border p-3 flex items-center space-x-3">
              <Icon name="MapPin" size={20} className="text-primary" />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-primary">Location Services Active</p>
                <p className="text-xs text-text-secondary">We're using your location to find nearby drivers</p>
              </div>
              <button className="text-xs text-primary hover:text-primary-700 transition-colors duration-fast">
                Settings
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Panel */}
        <div className="relative z-20">
          {activeRide ? (
            <ActiveRidePanel
              activeRide={activeRide}
              onCancelRide={handleCancelRide}
              onContactDriver={handleContactDriver}
              onEmergency={handleEmergency}
              onTrackRide={handleTrackRide}
            />
          ) : showVehicleSelector ? (
            <VehicleSelector
              selectedVehicle={selectedVehicle}
              onVehicleSelect={handleVehicleSelect}
              onRequestRide={handleRequestRide}
              isLoading={isRequestingRide}
            />
          ) : (
            <SearchPanel
              currentLocation={currentLocation}
              destination={destination}
              onDestinationChange={handleDestinationChange}
              onQuickLocationSelect={handleQuickLocationSelect}
              isSearching={isSearching}
              recentLocations={recentLocations}
            />
          )}
        </div>
      </main>
    </div>
  );
};

export default RiderDashboard;