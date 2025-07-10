import React from 'react';

import Button from '../../../components/ui/Button';

const DriverStatusPanel = ({ 
  isOnline, 
  onToggleStatus, 
  earnings, 
  acceptanceRate, 
  tripsCompleted 
}) => {
  return (
    <div className="bg-surface rounded-t-xl shadow-floating border-t border-border p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success animate-pulse-slow' : 'bg-secondary-400'}`}></div>
          <span className="font-medium text-text-primary">
            {isOnline ? 'Online' : 'Offline'}
          </span>
        </div>
        
        <Button
          variant={isOnline ? "danger" : "success"}
          size="sm"
          onClick={onToggleStatus}
          iconName={isOnline ? "Power" : "Play"}
          iconPosition="left"
        >
          {isOnline ? 'Go Offline' : 'Go Online'}
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="text-center">
          <div className="text-lg font-semibold text-success">
            ${earnings.toFixed(2)}
          </div>
          <div className="text-xs text-text-secondary">Today's Earnings</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {acceptanceRate}%
          </div>
          <div className="text-xs text-text-secondary">Acceptance Rate</div>
        </div>
        
        <div className="text-center">
          <div className="text-lg font-semibold text-text-primary">
            {tripsCompleted}
          </div>
          <div className="text-xs text-text-secondary">Trips Today</div>
        </div>
      </div>
    </div>
  );
};

export default DriverStatusPanel;