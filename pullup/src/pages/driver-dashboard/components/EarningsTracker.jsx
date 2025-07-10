import React from 'react';
import Icon from '../../../components/AppIcon';

const EarningsTracker = ({ 
  todayEarnings, 
  weeklyEarnings, 
  monthlyEarnings, 
  recentTrips,
  isExpanded = false,
  onToggleExpanded 
}) => {
  if (!isExpanded) {
    return (
      <button
        onClick={onToggleExpanded}
        className="fixed top-20 right-4 bg-success text-success-foreground px-4 py-2 rounded-lg shadow-floating flex items-center space-x-2 z-40 hover-scale"
      >
        <Icon name="DollarSign" size={16} />
        <span className="font-semibold">${todayEarnings.toFixed(2)}</span>
        <Icon name="ChevronUp" size={16} />
      </button>
    );
  }

  return (
    <div className="fixed top-20 right-4 bg-surface rounded-lg shadow-floating border border-border p-4 w-80 z-40">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-text-primary">Earnings Tracker</h3>
        <button
          onClick={onToggleExpanded}
          className="p-1 hover:bg-surface-secondary rounded transition-colors duration-fast"
        >
          <Icon name="ChevronDown" size={16} className="text-text-secondary" />
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="text-center p-3 bg-success-50 rounded-lg">
          <div className="text-lg font-semibold text-success">
            ${todayEarnings.toFixed(2)}
          </div>
          <div className="text-xs text-success-700">Today</div>
        </div>
        
        <div className="text-center p-3 bg-primary-50 rounded-lg">
          <div className="text-lg font-semibold text-primary">
            ${weeklyEarnings.toFixed(2)}
          </div>
          <div className="text-xs text-primary-700">This Week</div>
        </div>
        
        <div className="text-center p-3 bg-accent-50 rounded-lg">
          <div className="text-lg font-semibold text-accent">
            ${monthlyEarnings.toFixed(2)}
          </div>
          <div className="text-xs text-accent-700">This Month</div>
        </div>
      </div>

      <div className="border-t border-border-muted pt-4">
        <h4 className="text-sm font-medium text-text-primary mb-3">Recent Trips</h4>
        <div className="space-y-2 max-h-40 overflow-y-auto">
          {recentTrips.map((trip) => (
            <div key={trip.id} className="flex items-center justify-between p-2 bg-surface-secondary rounded-lg">
              <div className="flex-1">
                <div className="text-sm font-medium text-text-primary">
                  {trip.destination}
                </div>
                <div className="text-xs text-text-secondary">
                  {trip.time} • {trip.distance}
                </div>
              </div>
              <div className="text-sm font-semibold text-success">
                +${trip.earnings}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border-muted pt-4 mt-4">
        <div className="flex items-center justify-between text-sm">
          <span className="text-text-secondary">Trip Goal Progress</span>
          <span className="text-text-primary font-medium">7/10 trips</span>
        </div>
        <div className="w-full bg-surface-secondary rounded-full h-2 mt-2">
          <div className="bg-success h-2 rounded-full" style={{ width: '70%' }}></div>
        </div>
        <div className="text-xs text-text-secondary mt-1">
          3 more trips to reach daily goal
        </div>
      </div>
    </div>
  );
};

export default EarningsTracker;