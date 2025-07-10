import React, { useEffect, useRef, useState } from 'react';
import Icon from '../../../components/AppIcon';

const DriverMap = ({ 
  driverLocation, 
  rideRequests, 
  activeRide, 
  onRequestSelect,
  mapCenter,
  zoom = 15 
}) => {
  const mapRef = useRef(null);
  const [selectedRequest, setSelectedRequest] = useState(null);

  // Mock Google Maps implementation
  useEffect(() => {
    if (mapRef.current) {
      // Initialize map simulation
      const mapContainer = mapRef.current;
      mapContainer.style.backgroundImage = `url('https://images.unsplash.com/photo-1524661135-423995f22d0b?w=800&h=600&fit=crop')`;
      mapContainer.style.backgroundSize = 'cover';
      mapContainer.style.backgroundPosition = 'center';
    }
  }, [mapCenter, zoom]);

  const handleRequestClick = (request) => {
    setSelectedRequest(request);
    onRequestSelect?.(request);
  };

  return (
    <div className="relative w-full h-full bg-surface-secondary overflow-hidden">
      {/* Map Container */}
      <div 
        ref={mapRef}
        className="w-full h-full relative"
        style={{
          background: 'linear-gradient(135deg, #e2e8f0 0%, #cbd5e1 100%)'
        }}
      >
        {/* Map Overlay Pattern */}
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%" className="w-full h-full">
            <defs>
              <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#64748b" strokeWidth="1"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Driver Location */}
        {driverLocation && (
          <div 
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-20"
            style={{
              left: '50%',
              top: '50%'
            }}
          >
            <div className="relative">
              <div className="w-4 h-4 bg-primary rounded-full border-2 border-surface shadow-lg animate-pulse-slow"></div>
              <div className="absolute -top-1 -left-1 w-6 h-6 bg-primary-200 rounded-full animate-ping opacity-75"></div>
              {/* Direction indicator */}
              <div className="absolute -top-2 left-1/2 transform -translate-x-1/2">
                <Icon name="Navigation" size={12} className="text-primary" />
              </div>
            </div>
          </div>
        )}

        {/* Ride Request Pins */}
        {rideRequests.map((request, index) => (
          <div
            key={request.id}
            className="absolute transform -translate-x-1/2 -translate-y-full cursor-pointer z-10"
            style={{
              left: `${30 + (index * 15)}%`,
              top: `${40 + (index * 10)}%`
            }}
            onClick={() => handleRequestClick(request)}
          >
            <div className={`relative transition-all duration-fast hover-scale ${
              selectedRequest?.id === request.id ? 'scale-110' : ''
            }`}>
              <div className="bg-success text-success-foreground px-2 py-1 rounded-lg text-xs font-medium shadow-lg">
                ${request.estimatedFare}
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-success mx-auto"></div>
              <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                <div className="w-3 h-3 bg-success rounded-full border border-success-foreground"></div>
              </div>
            </div>
          </div>
        ))}

        {/* Active Ride Route */}
        {activeRide && (
          <>
            {/* Pickup Location */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full z-15"
              style={{
                left: '35%',
                top: '30%'
              }}
            >
              <div className="bg-primary text-primary-foreground p-2 rounded-lg shadow-lg">
                <Icon name="MapPin" size={16} />
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary mx-auto"></div>
            </div>

            {/* Destination Location */}
            <div 
              className="absolute transform -translate-x-1/2 -translate-y-full z-15"
              style={{
                left: '70%',
                top: '60%'
              }}
            >
              <div className="bg-accent text-accent-foreground p-2 rounded-lg shadow-lg">
                <Icon name="Navigation" size={16} />
              </div>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-accent mx-auto"></div>
            </div>

            {/* Route Line */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-5">
              <path
                d="M 35% 30% Q 50% 40% 70% 60%"
                stroke="var(--color-primary)"
                strokeWidth="3"
                fill="none"
                strokeDasharray="5,5"
                className="animate-pulse"
              />
            </svg>
          </>
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-30">
        <button className="w-10 h-10 bg-surface rounded-lg shadow-card flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast">
          <Icon name="Plus" size={20} className="text-text-primary" />
        </button>
        <button className="w-10 h-10 bg-surface rounded-lg shadow-card flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast">
          <Icon name="Minus" size={20} className="text-text-primary" />
        </button>
        <button className="w-10 h-10 bg-surface rounded-lg shadow-card flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast">
          <Icon name="Locate" size={20} className="text-text-primary" />
        </button>
      </div>

      {/* Traffic/Route Info */}
      {activeRide && (
        <div className="absolute top-4 left-4 bg-surface rounded-lg shadow-card p-3 z-30">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Navigation" size={16} className="text-primary" />
            <span className="text-sm font-medium text-text-primary">Route Active</span>
          </div>
          <div className="text-xs text-text-secondary">
            {activeRide.distance} • {activeRide.estimatedDuration}
          </div>
          <div className="flex items-center space-x-1 mt-1">
            <div className="w-2 h-2 bg-success rounded-full"></div>
            <span className="text-xs text-success">Light traffic</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default DriverMap;