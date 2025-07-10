import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CommunicationControls = ({ 
  currentMode, 
  onMessageClick, 
  onCallClick, 
  onEmergencyClick,
  onShareTrip 
}) => {
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  const handleCallClick = () => {
    if (isCallActive) {
      setIsCallActive(false);
      setCallDuration(0);
    } else {
      setIsCallActive(true);
      // Simulate call duration
      const interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
      
      // Auto end call after 30 seconds for demo
      setTimeout(() => {
        setIsCallActive(false);
        setCallDuration(0);
        clearInterval(interval);
      }, 30000);
    }
    onCallClick?.();
  };

  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-surface border-t border-border p-4">
      <div className="flex items-center justify-between space-x-3">
        {/* Message Button */}
        <Button
          variant="outline"
          onClick={onMessageClick}
          className="flex-1 flex items-center justify-center space-x-2 py-3"
          iconName="MessageCircle"
          iconPosition="left"
        >
          <span className="hidden sm:inline">Message</span>
        </Button>

        {/* Call Button */}
        <Button
          variant={isCallActive ? "danger" : "primary"}
          onClick={handleCallClick}
          className="flex-1 flex items-center justify-center space-x-2 py-3"
          iconName={isCallActive ? "PhoneOff" : "Phone"}
          iconPosition="left"
        >
          <span className="hidden sm:inline">
            {isCallActive ? formatCallDuration(callDuration) : "Call"}
          </span>
        </Button>

        {/* Share Trip Button (Rider only) */}
        {currentMode === 'rider' && (
          <Button
            variant="ghost"
            onClick={onShareTrip}
            className="flex-1 flex items-center justify-center space-x-2 py-3"
            iconName="Share"
            iconPosition="left"
          >
            <span className="hidden sm:inline">Share</span>
          </Button>
        )}

        {/* Emergency Button */}
        <Button
          variant="danger"
          onClick={onEmergencyClick}
          className="flex-1 flex items-center justify-center space-x-2 py-3"
          iconName="AlertTriangle"
          iconPosition="left"
        >
          <span className="hidden sm:inline">SOS</span>
        </Button>
      </div>

      {/* Call Status Indicator */}
      {isCallActive && (
        <div className="mt-3 bg-success-50 border border-success-200 rounded-lg p-3">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-2 h-2 bg-success rounded-full animate-pulse-slow"></div>
            <span className="text-sm font-medium text-success-700">
              Call in progress - {formatCallDuration(callDuration)}
            </span>
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => onMessageClick?.('arrived')}
          className="flex items-center space-x-2 p-3 bg-surface-secondary rounded-lg hover:bg-border-muted transition-colors duration-fast"
        >
          <Icon name="MapPin" size={16} className="text-primary" />
          <span className="text-sm text-text-primary">
            {currentMode === 'rider' ? "I'm here" : "Arrived"}
          </span>
        </button>
        <button
          onClick={() => onMessageClick?.('running_late')}
          className="flex items-center space-x-2 p-3 bg-surface-secondary rounded-lg hover:bg-border-muted transition-colors duration-fast"
        >
          <Icon name="Clock" size={16} className="text-warning" />
          <span className="text-sm text-text-primary">Running late</span>
        </button>
      </div>
    </div>
  );
};

export default CommunicationControls;