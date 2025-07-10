import React, { useState, useRef, useEffect } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';


const SearchPanel = ({ 
  currentLocation, 
  destination, 
  onDestinationChange, 
  onQuickLocationSelect,
  isSearching,
  searchResults,
  recentLocations 
}) => {
  const [searchQuery, setSearchQuery] = useState(destination || '');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef(null);

  const quickLocations = [
    {
      id: 'home',
      name: 'Home',
      address: '123 Main Street, Downtown',
      icon: 'Home'
    },
    {
      id: 'work',
      name: 'Work',
      address: '456 Business Ave, Financial District',
      icon: 'Building'
    }
  ];

  const mockSuggestions = [
    {
      id: 1,
      name: 'Central Park',
      address: 'Central Park, New York, NY',
      type: 'park',
      distance: '2.3 miles'
    },
    {
      id: 2,
      name: 'Times Square',
      address: 'Times Square, New York, NY',
      type: 'landmark',
      distance: '1.8 miles'
    },
    {
      id: 3,
      name: 'JFK Airport',
      address: 'John F. Kennedy International Airport, NY',
      type: 'airport',
      distance: '15.2 miles'
    },
    {
      id: 4,
      name: 'Brooklyn Bridge',
      address: 'Brooklyn Bridge, New York, NY',
      type: 'landmark',
      distance: '3.1 miles'
    }
  ];

  useEffect(() => {
    if (destination) {
      setSearchQuery(destination);
    }
  }, [destination]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchQuery(value);
    setShowSuggestions(value.length > 0);
    onDestinationChange(value);
  };

  const handleSuggestionSelect = (suggestion) => {
    setSearchQuery(suggestion.address);
    setShowSuggestions(false);
    setIsExpanded(false);
    onDestinationChange(suggestion.address);
    inputRef.current?.blur();
  };

  const handleQuickLocationSelect = (location) => {
    setSearchQuery(location.address);
    setShowSuggestions(false);
    setIsExpanded(false);
    onQuickLocationSelect(location);
    inputRef.current?.blur();
  };

  const handleInputFocus = () => {
    setIsExpanded(true);
    setShowSuggestions(searchQuery.length > 0);
  };

  const handleInputBlur = () => {
    // Delay to allow suggestion clicks
    setTimeout(() => {
      setShowSuggestions(false);
      setIsExpanded(false);
    }, 200);
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'park': return 'Trees';
      case 'landmark': return 'MapPin';
      case 'airport': return 'Plane';
      case 'restaurant': return 'UtensilsCrossed';
      case 'shopping': return 'ShoppingBag';
      default: return 'MapPin';
    }
  };

  return (
    <div className="relative">
      {/* Main Search Container */}
      <div className={`bg-surface rounded-t-2xl shadow-modal border border-border transition-all duration-normal ${
        isExpanded ? 'rounded-b-none' : 'rounded-b-2xl'
      }`}>
        <div className="p-4 space-y-4">
          {/* Current Location Display */}
          <div className="flex items-center space-x-3 p-3 bg-surface-secondary rounded-lg">
            <div className="w-3 h-3 bg-accent rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-text-primary">Current Location</p>
              <p className="text-xs text-text-secondary">
                {currentLocation?.address || 'Detecting location...'}
              </p>
            </div>
            <Icon name="Navigation" size={16} className="text-text-secondary" />
          </div>

          {/* Destination Search */}
          <div className="relative">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 border-2 border-text-secondary rounded-sm"></div>
              <div className="flex-1 relative">
                <Input
                  ref={inputRef}
                  type="text"
                  placeholder="Where to?"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={handleInputFocus}
                  onBlur={handleInputBlur}
                  className="text-lg font-medium pr-10"
                />
                {isSearching && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          {!isExpanded && (
            <div className="flex space-x-3">
              {quickLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleQuickLocationSelect(location)}
                  className="flex-1 flex items-center space-x-2 p-3 bg-surface-secondary rounded-lg hover:bg-border-muted transition-colors duration-fast"
                >
                  <Icon name={location.icon} size={16} className="text-text-secondary" />
                  <span className="text-sm font-medium text-text-primary">{location.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && isExpanded && (
        <div className="bg-surface border-l border-r border-b border-border rounded-b-2xl shadow-modal max-h-80 overflow-y-auto">
          {/* Quick Locations */}
          <div className="p-4 border-b border-border-muted">
            <h3 className="text-sm font-medium text-text-secondary mb-3">Quick Access</h3>
            <div className="space-y-2">
              {quickLocations.map((location) => (
                <button
                  key={location.id}
                  onClick={() => handleQuickLocationSelect(location)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors duration-fast text-left"
                >
                  <div className="w-8 h-8 bg-primary-50 rounded-full flex items-center justify-center">
                    <Icon name={location.icon} size={16} className="text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{location.name}</p>
                    <p className="text-xs text-text-secondary">{location.address}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Search Results */}
          <div className="p-4">
            <h3 className="text-sm font-medium text-text-secondary mb-3">Suggestions</h3>
            <div className="space-y-2">
              {mockSuggestions
                .filter(suggestion => 
                  suggestion.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                  suggestion.address.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((suggestion) => (
                <button
                  key={suggestion.id}
                  onClick={() => handleSuggestionSelect(suggestion)}
                  className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors duration-fast text-left"
                >
                  <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center">
                    <Icon name={getLocationIcon(suggestion.type)} size={16} className="text-secondary" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-text-primary">{suggestion.name}</p>
                    <p className="text-xs text-text-secondary">{suggestion.address}</p>
                  </div>
                  <span className="text-xs text-text-muted">{suggestion.distance}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Locations */}
          {recentLocations && recentLocations.length > 0 && (
            <div className="p-4 border-t border-border-muted">
              <h3 className="text-sm font-medium text-text-secondary mb-3">Recent</h3>
              <div className="space-y-2">
                {recentLocations.slice(0, 3).map((location, index) => (
                  <button
                    key={index}
                    onClick={() => handleSuggestionSelect(location)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-surface-secondary transition-colors duration-fast text-left"
                  >
                    <div className="w-8 h-8 bg-secondary-50 rounded-full flex items-center justify-center">
                      <Icon name="Clock" size={16} className="text-secondary" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-text-primary">{location.name}</p>
                      <p className="text-xs text-text-secondary">{location.address}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPanel;