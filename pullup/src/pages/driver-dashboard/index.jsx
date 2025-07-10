import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import DriverStatusPanel from './components/DriverStatusPanel';
import RideRequestCard from './components/RideRequestCard';
import ActiveRidePanel from './components/ActiveRidePanel';
import DriverMap from './components/DriverMap';
import EarningsTracker from './components/EarningsTracker';

import Button from '../../components/ui/Button';

const DriverDashboard = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState('driver');
  const [isOnline, setIsOnline] = useState(false);
  const [activeRide, setActiveRide] = useState(null);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [isEarningsExpanded, setIsEarningsExpanded] = useState(false);

  // Mock user data
  const mockUser = {
    id: "driver_001",
    name: "Michael Rodriguez",
    email: "michael.rodriguez@email.com",
    phone: "+1 (555) 123-4567",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    rating: 4.8,
    totalTrips: 1247,
    vehicleInfo: {
      make: "Toyota",
      model: "Camry",
      year: 2020,
      color: "Silver",
      licensePlate: "ABC-1234"
    }
  };

  // Mock driver location
  const driverLocation = {
    lat: 40.7128,
    lng: -74.0060,
    heading: 45
  };

  // Mock ride requests
  const mockRideRequests = [
    {
      id: "req_001",
      passengerName: "Sarah Johnson",
      passengerPhone: "+1 (555) 987-6543",
      passengerRating: 4.9,
      totalRides: 156,
      pickupAddress: "123 Main St, New York, NY",
      destinationAddress: "456 Broadway, New York, NY",
      estimatedFare: 12.50,
      distance: "0.8 mi",
      tripDistance: "3.2 mi",
      estimatedDuration: "15 min",
      pickupLocation: { lat: 40.7589, lng: -73.9851 },
      destinationLocation: { lat: 40.7505, lng: -73.9934 }
    },
    {
      id: "req_002",
      passengerName: "David Chen",
      passengerPhone: "+1 (555) 456-7890",
      passengerRating: 4.7,
      totalRides: 89,
      pickupAddress: "789 Park Ave, New York, NY",
      destinationAddress: "321 5th Ave, New York, NY",
      estimatedFare: 18.75,
      distance: "1.2 mi",
      tripDistance: "4.8 mi",
      estimatedDuration: "22 min",
      pickupLocation: { lat: 40.7614, lng: -73.9776 },
      destinationLocation: { lat: 40.7549, lng: -73.9840 }
    }
  ];

  // Mock earnings data
  const earningsData = {
    today: 127.50,
    weekly: 892.25,
    monthly: 3456.80,
    acceptanceRate: 94,
    tripsCompleted: 7,
    recentTrips: [
      {
        id: "trip_001",
        destination: "Central Park",
        time: "2:30 PM",
        distance: "3.2 mi",
        earnings: 15.25
      },
      {
        id: "trip_002",
        destination: "Times Square",
        time: "1:45 PM",
        distance: "2.8 mi",
        earnings: 12.50
      },
      {
        id: "trip_003",
        destination: "Brooklyn Bridge",
        time: "12:15 PM",
        distance: "4.1 mi",
        earnings: 18.75
      }
    ]
  };

  // Simulate incoming ride requests when online
  useEffect(() => {
    if (isOnline && !activeRide && !pendingRequest) {
      const timer = setTimeout(() => {
        const randomRequest = mockRideRequests[Math.floor(Math.random() * mockRideRequests.length)];
        setPendingRequest(randomRequest);
      }, Math.random() * 10000 + 5000); // Random delay between 5-15 seconds

      return () => clearTimeout(timer);
    }
  }, [isOnline, activeRide, pendingRequest]);

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
  };

  const handleToggleOnlineStatus = () => {
    setIsOnline(!isOnline);
    if (isOnline) {
      // Going offline - clear any pending requests
      setPendingRequest(null);
    }
  };

  const handleAcceptRide = (request) => {
    setActiveRide({
      ...request,
      status: 'accepted',
      acceptedAt: new Date(),
      fare: request.estimatedFare
    });
    setPendingRequest(null);
  };

  const handleDeclineRide = () => {
    setPendingRequest(null);
  };

  const handleArrivedAtPickup = () => {
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: 'arrived',
        arrivedAt: new Date()
      });
    }
  };

  const handleStartTrip = () => {
    if (activeRide) {
      setActiveRide({
        ...activeRide,
        status: 'in_progress',
        startedAt: new Date()
      });
    }
  };

  const handleCompleteTrip = () => {
    if (activeRide) {
      // Navigate to ride completion/rating screen
      navigate('/active-ride-tracking', { 
        state: { 
          ride: activeRide, 
          mode: 'driver',
          status: 'completed' 
        } 
      });
      setActiveRide(null);
    }
  };

  const handleContactPassenger = () => {
    if (activeRide) {
      // Simulate phone call
      alert(`Calling ${activeRide.passengerName} at ${activeRide.passengerPhone}`);
    }
  };

  const handleEmergency = () => {
    alert("Emergency services have been contacted. Stay safe!");
  };

  const handleRequestSelect = (request) => {
    // Handle map request selection if needed
    console.log('Selected request:', request);
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={mockUser}
        currentMode={currentMode}
        activeRide={activeRide}
        onModeChange={handleModeChange}
      />

      <main className="pt-16 h-screen flex flex-col">
        {/* Map Container */}
        <div className="flex-1 relative">
          <DriverMap
            driverLocation={driverLocation}
            rideRequests={isOnline ? mockRideRequests : []}
            activeRide={activeRide}
            onRequestSelect={handleRequestSelect}
            mapCenter={driverLocation}
            zoom={15}
          />

          {/* Earnings Tracker */}
          <EarningsTracker
            todayEarnings={earningsData.today}
            weeklyEarnings={earningsData.weekly}
            monthlyEarnings={earningsData.monthly}
            recentTrips={earningsData.recentTrips}
            isExpanded={isEarningsExpanded}
            onToggleExpanded={() => setIsEarningsExpanded(!isEarningsExpanded)}
          />

          {/* Emergency Button */}
          <Button
            variant="danger"
            size="lg"
            onClick={handleEmergency}
            iconName="AlertTriangle"
            className="fixed bottom-32 left-4 z-40 shadow-floating"
          >
            Emergency
          </Button>
        </div>

        {/* Bottom Panel */}
        <div className="relative">
          {activeRide ? (
            <ActiveRidePanel
              activeRide={activeRide}
              onArrivedAtPickup={handleArrivedAtPickup}
              onStartTrip={handleStartTrip}
              onCompleteTrip={handleCompleteTrip}
              onContactPassenger={handleContactPassenger}
              onEmergency={handleEmergency}
            />
          ) : (
            <DriverStatusPanel
              isOnline={isOnline}
              onToggleStatus={handleToggleOnlineStatus}
              earnings={earningsData.today}
              acceptanceRate={earningsData.acceptanceRate}
              tripsCompleted={earningsData.tripsCompleted}
            />
          )}
        </div>

        {/* Ride Request Modal */}
        {pendingRequest && (
          <RideRequestCard
            request={pendingRequest}
            onAccept={handleAcceptRide}
            onDecline={handleDeclineRide}
            countdownTime={30}
          />
        )}
      </main>
    </div>
  );
};

export default DriverDashboard;