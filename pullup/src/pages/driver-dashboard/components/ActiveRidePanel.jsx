import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActiveRidePanel = ({ 
  activeRide, 
  onArrivedAtPickup, 
  onStartTrip, 
  onCompleteTrip, 
  onContactPassenger, 
  onEmergency 
}) => {
  if (!activeRide) return null;

  const getRideStatusDisplay = () => {
    switch (activeRide.status) {
      case 'accepted':
        return {
          title: 'Heading to Pickup',
          subtitle: 'Navigate to passenger location',
          action: 'Arrived at Pickup',
          actionHandler: onArrivedAtPickup,
          actionIcon: 'MapPin'
        };
      case 'arrived':
        return {
          title: 'Arrived at Pickup',
          subtitle: 'Waiting for passenger',
          action: 'Start Trip',
          actionHandler: onStartTrip,
          actionIcon: 'Play'
        };
      case 'in_progress':
        return {
          title: 'Trip in Progress',
          subtitle: 'Navigate to destination',
          action: 'Complete Trip',
          actionHandler: onCompleteTrip,
          actionIcon: 'CheckCircle'
        };
      default:
        return null;
    }
  };

  const statusDisplay = getRideStatusDisplay();
  if (!statusDisplay) return null;

  return (
    <div className="bg-surface rounded-t-xl shadow-floating border-t border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-semibold text-text-primary">{statusDisplay.title}</h3>
          <p className="text-sm text-text-secondary">{statusDisplay.subtitle}</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onEmergency}
            iconName="AlertTriangle"
            className="text-error border-error hover:bg-error-50"
          >
            Emergency
          </Button>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center space-x-3 bg-surface-secondary rounded-lg p-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="font-medium text-text-primary">{activeRide.passengerName}</div>
            <div className="text-sm text-text-secondary">{activeRide.passengerPhone}</div>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onContactPassenger}
            iconName="Phone"
          >
            Call
          </Button>
        </div>

        <div className="space-y-2">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center mt-1">
              <Icon name="MapPin" size={12} className="text-primary-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-text-secondary">
                {activeRide.status === 'accepted' || activeRide.status === 'arrived' ? 'Pickup' : 'From'}
              </div>
              <div className="font-medium text-text-primary">{activeRide.pickupAddress}</div>
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-accent rounded-full flex items-center justify-center mt-1">
              <Icon name="Navigation" size={12} className="text-accent-foreground" />
            </div>
            <div className="flex-1">
              <div className="text-sm text-text-secondary">
                {activeRide.status === 'in_progress' ? 'Destination' : 'To'}
              </div>
              <div className="font-medium text-text-primary">{activeRide.destinationAddress}</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-success-50 rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span className="font-semibold text-success">${activeRide.fare}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{activeRide.estimatedDuration}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Navigation" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{activeRide.distance}</span>
          </div>
        </div>
      </div>

      <Button
        variant="primary"
        size="lg"
        fullWidth
        onClick={statusDisplay.actionHandler}
        iconName={statusDisplay.actionIcon}
        iconPosition="left"
      >
        {statusDisplay.action}
      </Button>
    </div>
  );
};

export default ActiveRidePanel;