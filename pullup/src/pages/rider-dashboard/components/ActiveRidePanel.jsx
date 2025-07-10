import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Image from '../../../components/AppImage';

const ActiveRidePanel = ({ 
  activeRide, 
  onCancelRide, 
  onContactDriver, 
  onEmergency,
  onTrackRide 
}) => {
  const [rideStatus, setRideStatus] = useState(activeRide?.status || 'searching');
  const [eta, setEta] = useState(activeRide?.eta || '5 min');
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  // Mock real-time updates
  useEffect(() => {
    if (!activeRide) return;

    const interval = setInterval(() => {
      // Simulate ETA updates
      const currentEta = parseInt(eta);
      if (currentEta > 1) {
        setEta(`${currentEta - 1} min`);
      }
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [eta, activeRide]);

  const getStatusInfo = () => {
    switch (rideStatus) {
      case 'searching':
        return {
          title: 'Finding your driver...',
          subtitle: 'This usually takes 1-2 minutes',
          icon: 'Search',
          color: 'text-warning'
        };
      case 'driver_assigned':
        return {
          title: 'Driver assigned',
          subtitle: `${activeRide?.driver?.name} is on the way`,
          icon: 'UserCheck',
          color: 'text-primary'
        };
      case 'driver_arriving':
        return {
          title: 'Driver arriving',
          subtitle: `${eta} away`,
          icon: 'Navigation',
          color: 'text-accent'
        };
      case 'arrived':
        return {
          title: 'Driver has arrived',
          subtitle: 'Your driver is waiting',
          icon: 'MapPin',
          color: 'text-success'
        };
      case 'in_progress':
        return {
          title: 'On your way',
          subtitle: `${eta} to destination`,
          icon: 'Car',
          color: 'text-primary'
        };
      default:
        return {
          title: 'Ride in progress',
          subtitle: 'Please wait...',
          icon: 'Clock',
          color: 'text-secondary'
        };
    }
  };

  const statusInfo = getStatusInfo();

  const handleCancelRide = () => {
    if (showCancelConfirm) {
      onCancelRide();
      setShowCancelConfirm(false);
    } else {
      setShowCancelConfirm(true);
    }
  };

  const handleContactDriver = (type) => {
    onContactDriver(type, activeRide?.driver);
  };

  if (!activeRide) return null;

  return (
    <div className="bg-surface rounded-t-2xl shadow-modal border border-border">
      <div className="p-4">
        {/* Status Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center bg-surface-secondary`}>
              <Icon name={statusInfo.icon} size={20} className={statusInfo.color} />
            </div>
            <div>
              <h2 className="font-semibold text-text-primary">{statusInfo.title}</h2>
              <p className="text-sm text-text-secondary">{statusInfo.subtitle}</p>
            </div>
          </div>
          <button
            onClick={onTrackRide}
            className="p-2 rounded-lg hover:bg-surface-secondary transition-colors duration-fast"
          >
            <Icon name="Maximize2" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Driver Information */}
        {activeRide.driver && (
          <div className="bg-surface-secondary rounded-lg p-4 mb-4">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Image
                  src={activeRide.driver.photo}
                  alt={activeRide.driver.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-success rounded-full border-2 border-surface"></div>
              </div>
              
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <h3 className="font-medium text-text-primary">{activeRide.driver.name}</h3>
                  <div className="flex items-center space-x-1">
                    <Icon name="Star" size={14} className="text-warning fill-current" />
                    <span className="text-sm text-text-secondary">{activeRide.driver.rating}</span>
                  </div>
                </div>
                <p className="text-sm text-text-secondary">
                  {activeRide.driver.vehicle.make} {activeRide.driver.vehicle.model} • {activeRide.driver.vehicle.color}
                </p>
                <p className="text-sm font-mono text-text-secondary">{activeRide.driver.vehicle.licensePlate}</p>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium text-text-primary">{eta}</p>
                <p className="text-xs text-text-secondary">ETA</p>
              </div>
            </div>
          </div>
        )}

        {/* Trip Details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 bg-accent rounded-full mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Pickup</p>
              <p className="text-sm text-text-secondary">{activeRide.pickup.address}</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-3">
            <div className="w-3 h-3 border-2 border-text-secondary rounded-sm mt-2"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Destination</p>
              <p className="text-sm text-text-secondary">{activeRide.destination.address}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <Button
            variant="outline"
            onClick={() => handleContactDriver('message')}
            iconName="MessageCircle"
            iconPosition="left"
          >
            Message
          </Button>
          <Button
            variant="outline"
            onClick={() => handleContactDriver('call')}
            iconName="Phone"
            iconPosition="left"
          >
            Call
          </Button>
        </div>

        {/* Emergency and Cancel */}
        <div className="space-y-3">
          <Button
            variant="danger"
            size="sm"
            fullWidth
            onClick={onEmergency}
            iconName="AlertTriangle"
            iconPosition="left"
          >
            Emergency
          </Button>

          {!showCancelConfirm ? (
            <Button
              variant="ghost"
              size="sm"
              fullWidth
              onClick={handleCancelRide}
              className="text-text-secondary hover:text-error"
            >
              Cancel Ride
            </Button>
          ) : (
            <div className="bg-error-50 border border-error-200 rounded-lg p-3">
              <p className="text-sm text-error-700 mb-3">
                Are you sure you want to cancel this ride? You may be charged a cancellation fee.
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="danger"
                  size="sm"
                  onClick={handleCancelRide}
                  className="flex-1"
                >
                  Yes, Cancel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowCancelConfirm(false)}
                  className="flex-1"
                >
                  Keep Ride
                </Button>
              </div>
            </div>
          )}
        </div>

        {/* Ride Progress */}
        {rideStatus === 'in_progress' && (
          <div className="mt-4 p-3 bg-primary-50 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-primary">Trip Progress</span>
              <span className="text-sm text-primary">65%</span>
            </div>
            <div className="w-full bg-primary-100 rounded-full h-2">
              <div className="bg-primary h-2 rounded-full transition-all duration-slow" style={{ width: '65%' }}></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ActiveRidePanel;