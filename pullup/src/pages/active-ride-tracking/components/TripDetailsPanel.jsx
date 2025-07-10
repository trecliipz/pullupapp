import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const TripDetailsPanel = ({ 
  tripData, 
  currentMode, 
  estimatedArrival, 
  currentFare, 
  distanceRemaining 
}) => {
  const formatTime = (minutes) => {
    if (minutes < 60) {
      return `${minutes} min`;
    }
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const formatDistance = (meters) => {
    if (meters < 1000) {
      return `${meters}m`;
    }
    return `${(meters / 1000).toFixed(1)}km`;
  };

  return (
    <div className="bg-surface border-t border-border p-4 space-y-4">
      {/* Trip Progress */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-success rounded-full animate-pulse-slow"></div>
          <span className="text-sm font-medium text-text-primary">Trip in Progress</span>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-text-primary">
            ${currentFare?.toFixed(2) || '0.00'}
          </p>
          <p className="text-xs text-text-secondary">Current fare</p>
        </div>
      </div>

      {/* ETA and Distance */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="Clock" size={16} className="text-primary" />
            <span className="text-xs font-medium text-text-secondary">ETA</span>
          </div>
          <p className="text-lg font-semibold text-text-primary">
            {formatTime(estimatedArrival)}
          </p>
        </div>
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="flex items-center space-x-2 mb-1">
            <Icon name="MapPin" size={16} className="text-primary" />
            <span className="text-xs font-medium text-text-secondary">Distance</span>
          </div>
          <p className="text-lg font-semibold text-text-primary">
            {formatDistance(distanceRemaining)}
          </p>
        </div>
      </div>

      {/* Driver/Passenger Information */}
      {currentMode === 'rider' ? (
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Image
                src={tripData?.driver?.avatar || "https://randomuser.me/api/portraits/men/32.jpg"}
                alt={tripData?.driver?.name || "Driver"}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface"></div>
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-text-primary">
                  {tripData?.driver?.name || "John Smith"}
                </h3>
                <div className="flex items-center space-x-1">
                  <Icon name="Star" size={14} className="text-warning fill-current" />
                  <span className="text-sm font-medium text-text-primary">
                    {tripData?.driver?.rating || "4.9"}
                  </span>
                </div>
              </div>
              <p className="text-sm text-text-secondary">
                {tripData?.vehicle?.make} {tripData?.vehicle?.model} • {tripData?.vehicle?.plate}
              </p>
              <p className="text-xs text-text-secondary">
                {tripData?.vehicle?.color} • {tripData?.driver?.totalTrips || 1247} trips
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface-secondary rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-medium text-text-primary">Trip Details</h3>
            <span className="text-sm font-medium text-success">
              +${tripData?.earnings?.toFixed(2) || '12.50'}
            </span>
          </div>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Icon name="User" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">
                {tripData?.passenger?.name || "Sarah Johnson"}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="MapPin" size={16} className="text-text-secondary" />
              <span className="text-sm text-text-primary">
                {tripData?.destination?.address || "Downtown Business District"}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Route Details */}
      <div className="space-y-3">
        <div className="flex items-start space-x-3">
          <div className="flex flex-col items-center mt-1">
            <div className="w-3 h-3 bg-success rounded-full"></div>
            <div className="w-0.5 h-6 bg-border"></div>
            <div className="w-3 h-3 bg-primary rounded-full"></div>
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <p className="text-sm font-medium text-text-primary">Pickup</p>
              <p className="text-xs text-text-secondary">
                {tripData?.pickup?.address || "123 Main Street, Downtown"}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">Destination</p>
              <p className="text-xs text-text-secondary">
                {tripData?.destination?.address || "456 Business Ave, Financial District"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripDetailsPanel;