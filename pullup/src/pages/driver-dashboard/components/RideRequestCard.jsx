import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const RideRequestCard = ({ 
  request, 
  onAccept, 
  onDecline, 
  countdownTime = 30 
}) => {
  const [timeLeft, setTimeLeft] = useState(countdownTime);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      onDecline();
    }
  }, [timeLeft, onDecline]);

  if (!request) return null;

  return (
    <div className="fixed inset-x-4 bottom-4 bg-surface rounded-xl shadow-floating border border-border p-6 z-50 animate-slide-up">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-text-primary">New Ride Request</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${
            timeLeft > 10 ? 'border-success text-success' : 'border-warning text-warning'
          }`}>
            <span className="text-sm font-semibold">{timeLeft}</span>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-6">
        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center mt-1">
            <Icon name="MapPin" size={16} className="text-primary" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-text-secondary">Pickup Location</div>
            <div className="font-medium text-text-primary">{request.pickupAddress}</div>
            <div className="text-sm text-text-secondary">{request.distance} away</div>
          </div>
        </div>

        <div className="flex items-start space-x-3">
          <div className="w-8 h-8 bg-accent-100 rounded-full flex items-center justify-center mt-1">
            <Icon name="Navigation" size={16} className="text-accent" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-text-secondary">Destination</div>
            <div className="font-medium text-text-primary">{request.destinationAddress}</div>
            <div className="text-sm text-text-secondary">{request.tripDistance} trip</div>
          </div>
        </div>

        <div className="flex items-center justify-between bg-surface-secondary rounded-lg p-3">
          <div className="flex items-center space-x-2">
            <Icon name="DollarSign" size={16} className="text-success" />
            <span className="font-semibold text-success">${request.estimatedFare}</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Clock" size={16} className="text-text-secondary" />
            <span className="text-sm text-text-secondary">{request.estimatedDuration}</span>
          </div>
        </div>

        <div className="flex items-center space-x-3 bg-primary-50 rounded-lg p-3">
          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
            <Icon name="User" size={20} className="text-primary" />
          </div>
          <div>
            <div className="font-medium text-text-primary">{request.passengerName}</div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Icon
                    key={i}
                    name="Star"
                    size={12}
                    className={i < Math.floor(request.passengerRating) ? 'text-warning fill-current' : 'text-secondary-300'}
                  />
                ))}
              </div>
              <span className="text-sm text-text-secondary">
                {request.passengerRating} ({request.totalRides} rides)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <Button
          variant="outline"
          size="lg"
          fullWidth
          onClick={onDecline}
          iconName="X"
          iconPosition="left"
        >
          Decline
        </Button>
        <Button
          variant="success"
          size="lg"
          fullWidth
          onClick={() => onAccept(request)}
          iconName="Check"
          iconPosition="left"
        >
          Accept Ride
        </Button>
      </div>
    </div>
  );
};

export default RideRequestCard;