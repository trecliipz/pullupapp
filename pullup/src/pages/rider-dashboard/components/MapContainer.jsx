import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const MapContainer = ({ 
  currentLocation, 
  destination, 
  availableDrivers, 
  selectedDriver, 
  onDriverSelect,
  activeRide,
  onLocationUpdate 
}) => {
  const mapRef = useRef(null);
  const [mapCenter, setMapCenter] = useState(currentLocation);
  const [zoomLevel, setZoomLevel] = useState(15);

  // Mock Google Maps implementation
  useEffect(() => {
    if (currentLocation) {
      setMapCenter(currentLocation);
    }
  }, [currentLocation]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 20));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 1));
  };

  const handleRecenter = () => {
    if (currentLocation) {
      setMapCenter(currentLocation);
      setZoomLevel(15);
    }
  };

  return (
    <div className="relative w-full h-full bg-surface-secondary overflow-hidden">
      {/* Mock Google Maps iframe */}
      <iframe
        ref={mapRef}
        width="100%"
        height="100%"
        loading="lazy"
        title="Ride Location Map"
        referrerPolicy="no-referrer-when-downgrade"
        src={`https://www.google.com/maps?q=${mapCenter.lat},${mapCenter.lng}&z=${zoomLevel}&output=embed`}
        className="w-full h-full border-0"
      />

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-surface rounded-lg shadow-card border border-border flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast"
        >
          <Icon name="Plus" size={20} className="text-text-primary" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-surface rounded-lg shadow-card border border-border flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast"
        >
          <Icon name="Minus" size={20} className="text-text-primary" />
        </button>
        <button
          onClick={handleRecenter}
          className="w-10 h-10 bg-surface rounded-lg shadow-card border border-border flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast"
        >
          <Icon name="Navigation" size={20} className="text-primary" />
        </button>
      </div>

      {/* Current Location Indicator */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none">
        <div className="relative">
          <div className="w-4 h-4 bg-primary rounded-full border-2 border-surface shadow-lg"></div>
          <div className="absolute inset-0 w-4 h-4 bg-primary rounded-full animate-ping opacity-30"></div>
        </div>
      </div>

      {/* Available Drivers Overlay */}
      {availableDrivers && availableDrivers.length > 0 && !activeRide && (
        <div className="absolute inset-0 pointer-events-none">
          {availableDrivers.map((driver) => (
            <div
              key={driver.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-auto cursor-pointer ${
                selectedDriver?.id === driver.id ? 'z-10' : 'z-0'
              }`}
              style={{
                left: `${50 + (driver.location.lat - mapCenter.lat) * 1000}%`,
                top: `${50 + (driver.location.lng - mapCenter.lng) * 1000}%`
              }}
              onClick={() => onDriverSelect(driver)}
            >
              <div className={`relative ${selectedDriver?.id === driver.id ? 'animate-pulse-slow' : ''}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${
                  selectedDriver?.id === driver.id 
                    ? 'bg-primary border-primary-foreground' 
                    : 'bg-surface border-primary'
                }`}>
                  <Icon 
                    name="Car" 
                    size={16} 
                    className={selectedDriver?.id === driver.id ? 'text-primary-foreground' : 'text-primary'} 
                  />
                </div>
                {selectedDriver?.id === driver.id && (
                  <div className="absolute inset-0 w-8 h-8 bg-primary rounded-full animate-ping opacity-30"></div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Active Ride Driver Location */}
      {activeRide && activeRide.driver && (
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute transform -translate-x-1/2 -translate-y-1/2 z-10"
            style={{
              left: `${50 + (activeRide.driver.currentLocation.lat - mapCenter.lat) * 1000}%`,
              top: `${50 + (activeRide.driver.currentLocation.lng - mapCenter.lng) * 1000}%`
            }}
          >
            <div className="relative">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center shadow-lg border-2 border-surface">
                <Icon name="Car" size={20} className="text-surface" />
              </div>
              <div className="absolute inset-0 w-10 h-10 bg-accent rounded-full animate-pulse-slow opacity-30"></div>
            </div>
          </div>
        </div>
      )}

      {/* Route Path Visualization */}
      {destination && (
        <div className="absolute inset-0 pointer-events-none">
          <svg className="w-full h-full">
            <defs>
              <pattern id="routePattern" patternUnits="userSpaceOnUse" width="10" height="10">
                <rect width="10" height="10" fill="none" />
                <rect width="5" height="2" fill="var(--color-primary)" />
              </pattern>
            </defs>
            <path
              d={`M ${window.innerWidth / 2} ${window.innerHeight / 2} Q ${window.innerWidth * 0.7} ${window.innerHeight * 0.3} ${window.innerWidth * 0.8} ${window.innerHeight * 0.2}`}
              stroke="url(#routePattern)"
              strokeWidth="3"
              fill="none"
              strokeDasharray="10,5"
              className="animate-pulse"
            />
          </svg>
        </div>
      )}
    </div>
  );
};

export default MapContainer;