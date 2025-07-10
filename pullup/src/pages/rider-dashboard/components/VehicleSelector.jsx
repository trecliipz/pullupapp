import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const VehicleSelector = ({ 
  availableVehicles, 
  selectedVehicle, 
  onVehicleSelect, 
  onRequestRide,
  isLoading 
}) => {
  const [showDetails, setShowDetails] = useState(false);

  const vehicleTypes = [
    {
      id: 'economy',
      name: 'PullUp Economy',
      description: 'Affordable rides for everyday trips',
      icon: 'Car',
      capacity: '1-4 passengers',
      eta: '3-5 min',
      price: '$12.50',
      priceRange: '$10-15',
      features: ['Standard ride', 'Everyday cars'],
      color: 'text-secondary'
    },
    {
      id: 'premium',
      name: 'PullUp Premium',
      description: 'Higher-end cars with extra comfort',
      icon: 'Car',
      capacity: '1-4 passengers',
      eta: '5-8 min',
      price: '$18.75',
      priceRange: '$16-22',
      features: ['Premium vehicles', 'Professional drivers', 'Extra comfort'],
      color: 'text-primary',
      popular: true
    },
    {
      id: 'xl',
      name: 'PullUp XL',
      description: 'Larger vehicles for groups',
      icon: 'Car',
      capacity: '1-6 passengers',
      eta: '8-12 min',
      price: '$24.00',
      priceRange: '$20-28',
      features: ['6 seats', 'Extra space', 'Group rides'],
      color: 'text-accent'
    }
  ];

  const handleVehicleSelect = (vehicle) => {
    onVehicleSelect(vehicle);
    setShowDetails(false);
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
  };

  return (
    <div className="bg-surface rounded-t-2xl shadow-modal border border-border">
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-text-primary">Choose a ride</h2>
          <button
            onClick={toggleDetails}
            className="flex items-center space-x-1 text-sm text-primary hover:text-primary-700 transition-colors duration-fast"
          >
            <span>{showDetails ? 'Less details' : 'More details'}</span>
            <Icon 
              name={showDetails ? 'ChevronUp' : 'ChevronDown'} 
              size={16} 
            />
          </button>
        </div>

        {/* Vehicle Options */}
        <div className="space-y-3 mb-6">
          {vehicleTypes.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`relative p-4 rounded-lg border-2 cursor-pointer transition-all duration-fast hover:shadow-card ${
                selectedVehicle?.id === vehicle.id
                  ? 'border-primary bg-primary-50' :'border-border bg-surface hover:border-border-muted'
              }`}
              onClick={() => handleVehicleSelect(vehicle)}
            >
              {/* Popular Badge */}
              {vehicle.popular && (
                <div className="absolute -top-2 left-4 bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                  Most Popular
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {/* Vehicle Icon */}
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    selectedVehicle?.id === vehicle.id ? 'bg-primary-100' : 'bg-surface-secondary'
                  }`}>
                    <Icon 
                      name={vehicle.icon} 
                      size={24} 
                      className={selectedVehicle?.id === vehicle.id ? 'text-primary' : vehicle.color} 
                    />
                  </div>

                  {/* Vehicle Info */}
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-text-primary">{vehicle.name}</h3>
                      <span className="text-sm text-text-secondary">• {vehicle.eta}</span>
                    </div>
                    <p className="text-sm text-text-secondary">{vehicle.description}</p>
                    {showDetails && (
                      <div className="mt-2 space-y-1">
                        <p className="text-xs text-text-secondary">{vehicle.capacity}</p>
                        <div className="flex flex-wrap gap-1">
                          {vehicle.features.map((feature, index) => (
                            <span
                              key={index}
                              className="text-xs bg-surface-secondary text-text-secondary px-2 py-1 rounded-full"
                            >
                              {feature}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="font-semibold text-text-primary">{vehicle.price}</p>
                  {showDetails && (
                    <p className="text-xs text-text-secondary">{vehicle.priceRange}</p>
                  )}
                </div>
              </div>

              {/* Selection Indicator */}
              {selectedVehicle?.id === vehicle.id && (
                <div className="absolute top-4 right-4">
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <Icon name="Check" size={12} className="text-primary-foreground" />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Pricing Info */}
        <div className="bg-surface-secondary rounded-lg p-3 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Info" size={16} className="text-text-secondary" />
            <span className="text-sm font-medium text-text-primary">Pricing Details</span>
          </div>
          <div className="text-xs text-text-secondary space-y-1">
            <p>• Base fare includes first 2 miles</p>
            <p>• Additional charges may apply for tolls and airport pickups</p>
            <p>• Prices may increase during high demand periods</p>
          </div>
        </div>

        {/* Request Ride Button */}
        <Button
          variant="primary"
          size="lg"
          fullWidth
          onClick={onRequestRide}
          disabled={!selectedVehicle || isLoading}
          loading={isLoading}
          className="font-semibold"
        >
          {isLoading ? 'Finding drivers...' : `Request ${selectedVehicle?.name || 'Ride'}`}
        </Button>

        {/* Payment Method */}
        <div className="flex items-center justify-between mt-4 p-3 bg-surface-secondary rounded-lg">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-surface rounded-lg flex items-center justify-center border border-border">
              <Icon name="CreditCard" size={16} className="text-text-secondary" />
            </div>
            <div>
              <p className="text-sm font-medium text-text-primary">•••• 4242</p>
              <p className="text-xs text-text-secondary">Default payment</p>
            </div>
          </div>
          <button className="text-sm text-primary hover:text-primary-700 transition-colors duration-fast">
            Change
          </button>
        </div>
      </div>
    </div>
  );
};

export default VehicleSelector;