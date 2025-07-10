import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const EmergencyModal = ({ isOpen, onClose, currentMode, tripData }) => {
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [isContacting, setIsContacting] = useState(false);

  const emergencyOptions = [
    {
      id: 'police',
      title: 'Police',
      description: 'Contact local police',
      icon: 'Shield',
      color: 'text-error',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200'
    },
    {
      id: 'medical',
      title: 'Medical Emergency',
      description: 'Call ambulance/medical help',
      icon: 'Heart',
      color: 'text-error',
      bgColor: 'bg-error-50',
      borderColor: 'border-error-200'
    },
    {
      id: 'safety',
      title: 'Safety Concern',
      description: 'Report safety issue',
      icon: 'AlertTriangle',
      color: 'text-warning',
      bgColor: 'bg-warning-50',
      borderColor: 'border-warning-200'
    },
    {
      id: 'support',
      title: 'PullUp Support',
      description: 'Contact app support',
      icon: 'Headphones',
      color: 'text-primary',
      bgColor: 'bg-primary-50',
      borderColor: 'border-primary-200'
    }
  ];

  const handleEmergencySelect = (option) => {
    setSelectedEmergency(option);
  };

  const handleContactEmergency = () => {
    setIsContacting(true);
    
    // Simulate emergency contact
    setTimeout(() => {
      setIsContacting(false);
      onClose();
      // Show success message or redirect
    }, 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-surface rounded-lg shadow-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-error-50 rounded-full flex items-center justify-center">
              <Icon name="AlertTriangle" size={20} className="text-error" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Emergency</h2>
              <p className="text-sm text-text-secondary">Get help immediately</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-surface-secondary rounded-lg transition-colors duration-fast"
          >
            <Icon name="X" size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {!selectedEmergency ? (
            <>
              {/* Trip Information */}
              <div className="bg-surface-secondary rounded-lg p-4 mb-6">
                <h3 className="font-medium text-text-primary mb-2">Current Trip</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Trip ID:</span>
                    <span className="text-text-primary font-data">
                      {tripData?.id || 'TR-2024-001'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">
                      {currentMode === 'rider' ? 'Driver:' : 'Passenger:'}
                    </span>
                    <span className="text-text-primary">
                      {currentMode === 'rider' ? tripData?.driver?.name ||'John Smith' : tripData?.passenger?.name ||'Sarah Johnson'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Location:</span>
                    <span className="text-text-primary">En route</span>
                  </div>
                </div>
              </div>

              {/* Emergency Options */}
              <div className="space-y-3">
                <h3 className="font-medium text-text-primary">Select Emergency Type</h3>
                {emergencyOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => handleEmergencySelect(option)}
                    className={`w-full flex items-center space-x-3 p-4 rounded-lg border-2 transition-all duration-fast hover:shadow-card ${option.bgColor} ${option.borderColor}`}
                  >
                    <div className="w-10 h-10 bg-surface rounded-full flex items-center justify-center">
                      <Icon name={option.icon} size={20} className={option.color} />
                    </div>
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-text-primary">{option.title}</h4>
                      <p className="text-sm text-text-secondary">{option.description}</p>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-text-secondary" />
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              {/* Selected Emergency */}
              <div className="text-center mb-6">
                <div className={`w-16 h-16 ${selectedEmergency.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <Icon name={selectedEmergency.icon} size={24} className={selectedEmergency.color} />
                </div>
                <h3 className="text-lg font-semibold text-text-primary mb-2">
                  {selectedEmergency.title}
                </h3>
                <p className="text-text-secondary">
                  {selectedEmergency.description}
                </p>
              </div>

              {/* Contact Information */}
              <div className="bg-surface-secondary rounded-lg p-4 mb-6">
                <h4 className="font-medium text-text-primary mb-3">Emergency Contact</h4>
                <div className="space-y-2 text-sm">
                  {selectedEmergency.id === 'police' && (
                    <p className="text-text-primary">📞 911 (Emergency Services)</p>
                  )}
                  {selectedEmergency.id === 'medical' && (
                    <p className="text-text-primary">🚑 911 (Medical Emergency)</p>
                  )}
                  {selectedEmergency.id === 'safety' && (
                    <p className="text-text-primary">🛡️ PullUp Safety: +1-800-PULLUP</p>
                  )}
                  {selectedEmergency.id === 'support' && (
                    <p className="text-text-primary">📞 PullUp Support: +1-800-SUPPORT</p>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  variant="danger"
                  onClick={handleContactEmergency}
                  loading={isContacting}
                  fullWidth
                  iconName="Phone"
                  iconPosition="left"
                >
                  {isContacting ? 'Contacting...' : `Contact ${selectedEmergency.title}`}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedEmergency(null)}
                  fullWidth
                >
                  Back to Options
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmergencyModal;