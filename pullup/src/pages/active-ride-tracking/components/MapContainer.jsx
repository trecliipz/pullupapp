import React, { useState, useEffect, useRef } from 'react';
import Icon from '../../../components/AppIcon';

const MapContainer = ({ 
  currentLocation, 
  destination, 
  vehiclePosition, 
  routePath, 
  currentMode,
  onMapReady 
}) => {
  const mapRef = useRef(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(14);

  useEffect(() => {
    // Simulate map loading
    const timer = setTimeout(() => {
      setMapLoaded(true);
      onMapReady?.();
    }, 1000);

    return () => clearTimeout(timer);
  }, [onMapReady]);

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 1, 18));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 1, 10));
  };

  const handleRecenter = () => {
    setZoomLevel(14);
  };

  return (
    <div className="relative w-full h-full bg-surface-secondary overflow-hidden">
      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full">
        {!mapLoaded ? (
          <div className="w-full h-full flex items-center justify-center bg-surface-secondary">
            <div className="text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-text-secondary">Loading map...</p>
            </div>
          </div>
        ) : (
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Active Ride Route"
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps?q=${vehiclePosition?.lat || 40.7128},${vehiclePosition?.lng || -74.0060}&z=${zoomLevel}&output=embed`}
            className="w-full h-full"
          />
        )}
      </div>

      {/* Map Controls */}
      <div className="absolute top-4 right-4 flex flex-col space-y-2 z-10">
        <button
          onClick={handleZoomIn}
          className="w-10 h-10 bg-surface shadow-card rounded-lg flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast"
        >
          <Icon name="Plus" size={20} className="text-text-primary" />
        </button>
        <button
          onClick={handleZoomOut}
          className="w-10 h-10 bg-surface shadow-card rounded-lg flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast"
        >
          <Icon name="Minus" size={20} className="text-text-primary" />
        </button>
        <button
          onClick={handleRecenter}
          className="w-10 h-10 bg-surface shadow-card rounded-lg flex items-center justify-center hover:bg-surface-secondary transition-colors duration-fast"
        >
          <Icon name="Navigation" size={20} className="text-primary" />
        </button>
      </div>

      {/* Route Information Overlay */}
      <div className="absolute top-4 left-4 bg-surface shadow-card rounded-lg p-3 max-w-xs z-10">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-3 h-3 bg-success rounded-full"></div>
          <span className="text-sm font-medium text-text-primary">En Route</span>
        </div>
        <div className="space-y-1">
          <p className="text-xs text-text-secondary">
            From: {currentLocation?.address || "Current Location"}
          </p>
          <p className="text-xs text-text-secondary">
            To: {destination?.address || "Destination"}
          </p>
        </div>
      </div>

      {/* Vehicle Position Indicator (Simulated) */}
      {mapLoaded && vehiclePosition && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="relative">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-lg animate-pulse-slow">
              <Icon name="Car" size={14} className="text-primary-foreground" />
            </div>
            <div className="absolute inset-0 w-6 h-6 bg-primary rounded-full opacity-30 animate-ping"></div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapContainer;