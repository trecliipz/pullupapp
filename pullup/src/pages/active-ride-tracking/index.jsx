import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import MapContainer from './components/MapContainer';
import TripDetailsPanel from './components/TripDetailsPanel';
import CommunicationControls from './components/CommunicationControls';
import EmergencyModal from './components/EmergencyModal';
import ShareTripModal from './components/ShareTripModal';
import MessagingModal from './components/MessagingModal';

const ActiveRideTracking = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState('rider');
  const [isEmergencyModalOpen, setIsEmergencyModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isMessagingModalOpen, setIsMessagingModalOpen] = useState(false);
  const [mapReady, setMapReady] = useState(false);

  // Mock user data
  const mockUser = {
    id: "user_123",
    name: "Alex Johnson",
    email: "alex.johnson@example.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg"
  };

  // Mock trip data
  const mockTripData = {
    id: "TR-2024-001",
    status: "in_progress",
    pickup: {
      address: "123 Main Street, Downtown",
      lat: 40.7128,
      lng: -74.0060
    },
    destination: {
      address: "456 Business Avenue, Financial District",
      lat: 40.7589,
      lng: -73.9851
    },
    driver: {
      id: "driver_456",
      name: "John Smith",
      avatar: "https://randomuser.me/api/portraits/men/32.jpg",
      rating: 4.9,
      totalTrips: 1247,
      phone: "+1 (555) 987-6543"
    },
    passenger: {
      id: "passenger_789",
      name: "Sarah Johnson",
      avatar: "https://randomuser.me/api/portraits/women/44.jpg",
      rating: 4.8,
      phone: "+1 (555) 456-7890"
    },
    vehicle: {
      make: "Toyota",
      model: "Camry",
      year: 2022,
      color: "Silver",
      plate: "ABC-1234"
    },
    fare: {
      base: 8.50,
      distance: 4.25,
      time: 2.75,
      total: 15.50
    },
    earnings: 12.50,
    startTime: new Date(Date.now() - 900000), // 15 minutes ago
    estimatedDuration: 25, // minutes
    estimatedArrival: 10, // minutes remaining
    distanceRemaining: 2400, // meters
    currentFare: 12.75
  };

  // Mock location data
  const mockCurrentLocation = {
    lat: 40.7300,
    lng: -73.9950,
    address: "Current Location - En Route"
  };

  const mockVehiclePosition = {
    lat: 40.7300,
    lng: -73.9950,
    heading: 45 // degrees
  };

  const mockRoutePath = [
    { lat: 40.7128, lng: -74.0060 },
    { lat: 40.7300, lng: -73.9950 },
    { lat: 40.7589, lng: -73.9851 }
  ];

  // Active ride data for header
  const activeRide = {
    id: mockTripData.id,
    destination: mockTripData.destination.address,
    status: mockTripData.status
  };

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      // Update trip progress, location, etc.
      // In a real app, this would be handled by Supabase subscriptions
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
  };

  const handleMapReady = () => {
    setMapReady(true);
  };

  const handleMessageClick = (quickMessage) => {
    if (quickMessage) {
      // Handle quick message
      console.log('Quick message:', quickMessage);
    } else {
      setIsMessagingModalOpen(true);
    }
  };

  const handleCallClick = () => {
    console.log('Initiating call...');
  };

  const handleEmergencyClick = () => {
    setIsEmergencyModalOpen(true);
  };

  const handleShareTrip = () => {
    setIsShareModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={mockUser}
        currentMode={currentMode}
        activeRide={activeRide}
        onModeChange={handleModeChange}
      />

      <div className="pt-16 h-screen flex flex-col">
        {/* Map Container */}
        <div className="flex-1 relative">
          <MapContainer
            currentLocation={mockCurrentLocation}
            destination={mockTripData.destination}
            vehiclePosition={mockVehiclePosition}
            routePath={mockRoutePath}
            currentMode={currentMode}
            onMapReady={handleMapReady}
          />
        </div>

        {/* Trip Details Panel - Desktop */}
        <div className="hidden lg:block">
          <TripDetailsPanel
            tripData={mockTripData}
            currentMode={currentMode}
            estimatedArrival={mockTripData.estimatedArrival}
            currentFare={mockTripData.currentFare}
            distanceRemaining={mockTripData.distanceRemaining}
          />
        </div>

        {/* Communication Controls - Desktop */}
        <div className="hidden lg:block">
          <CommunicationControls
            currentMode={currentMode}
            onMessageClick={handleMessageClick}
            onCallClick={handleCallClick}
            onEmergencyClick={handleEmergencyClick}
            onShareTrip={handleShareTrip}
          />
        </div>

        {/* Mobile Bottom Panel */}
        <div className="lg:hidden bg-surface border-t border-border">
          {/* Trip Summary */}
          <div className="p-4 border-b border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-success rounded-full animate-pulse-slow"></div>
                <span className="text-sm font-medium text-text-primary">En Route</span>
              </div>
              <div className="text-right">
                <p className="text-lg font-semibold text-text-primary">
                  ${mockTripData.currentFare.toFixed(2)}
                </p>
                <p className="text-xs text-text-secondary">Current fare</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">
                  {mockTripData.estimatedArrival} min
                </p>
                <p className="text-xs text-text-secondary">ETA</p>
              </div>
              <div className="text-center">
                <p className="text-lg font-semibold text-text-primary">
                  {(mockTripData.distanceRemaining / 1000).toFixed(1)}km
                </p>
                <p className="text-xs text-text-secondary">Distance</p>
              </div>
            </div>
          </div>

          {/* Communication Controls */}
          <CommunicationControls
            currentMode={currentMode}
            onMessageClick={handleMessageClick}
            onCallClick={handleCallClick}
            onEmergencyClick={handleEmergencyClick}
            onShareTrip={handleShareTrip}
          />
        </div>
      </div>

      {/* Modals */}
      <EmergencyModal
        isOpen={isEmergencyModalOpen}
        onClose={() => setIsEmergencyModalOpen(false)}
        currentMode={currentMode}
        tripData={mockTripData}
      />

      <ShareTripModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        tripData={mockTripData}
      />

      <MessagingModal
        isOpen={isMessagingModalOpen}
        onClose={() => setIsMessagingModalOpen(false)}
        currentMode={currentMode}
        tripData={mockTripData}
      />
    </div>
  );
};

export default ActiveRideTracking;