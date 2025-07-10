import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const PreferencesSection = ({ preferences, onUpdatePreferences }) => {
  const [localPreferences, setLocalPreferences] = useState({
    notifications: {
      rideUpdates: preferences?.notifications?.rideUpdates ?? true,
      promotions: preferences?.notifications?.promotions ?? false,
      emailNotifications: preferences?.notifications?.emailNotifications ?? true,
      smsNotifications: preferences?.notifications?.smsNotifications ?? true
    },
    privacy: {
      shareLocation: preferences?.privacy?.shareLocation ?? true,
      shareRideHistory: preferences?.privacy?.shareRideHistory ?? false,
      allowDataCollection: preferences?.privacy?.allowDataCollection ?? true
    },
    accessibility: {
      wheelchairAccessible: preferences?.accessibility?.wheelchairAccessible ?? false,
      audioAssistance: preferences?.accessibility?.audioAssistance ?? false,
      largeText: preferences?.accessibility?.largeText ?? false
    },
    language: preferences?.language || 'en',
    currency: preferences?.currency || 'USD',
    favoriteLocations: preferences?.favoriteLocations || []
  });

  const [newLocation, setNewLocation] = useState({ name: '', address: '' });
  const [isAddingLocation, setIsAddingLocation] = useState(false);

  const handleToggle = (category, setting) => {
    setLocalPreferences(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSelectChange = (field, value) => {
    setLocalPreferences(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleAddLocation = () => {
    if (newLocation.name && newLocation.address) {
      setLocalPreferences(prev => ({
        ...prev,
        favoriteLocations: [
          ...prev.favoriteLocations,
          { ...newLocation, id: Date.now() }
        ]
      }));
      setNewLocation({ name: '', address: '' });
      setIsAddingLocation(false);
    }
  };

  const handleRemoveLocation = (locationId) => {
    setLocalPreferences(prev => ({
      ...prev,
      favoriteLocations: prev.favoriteLocations.filter(loc => loc.id !== locationId)
    }));
  };

  const handleSave = () => {
    onUpdatePreferences(localPreferences);
  };

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' }
  ];

  const currencies = [
    { code: 'USD', name: 'US Dollar ($)' },
    { code: 'EUR', name: 'Euro (€)' },
    { code: 'GBP', name: 'British Pound (£)' },
    { code: 'CAD', name: 'Canadian Dollar (C$)' }
  ];

  const ToggleSwitch = ({ enabled, onToggle, label, description }) => (
    <div className="flex items-center justify-between py-3">
      <div className="flex-1">
        <p className="text-sm font-medium text-text-primary">{label}</p>
        {description && (
          <p className="text-xs text-text-secondary mt-1">{description}</p>
        )}
      </div>
      <button
        onClick={onToggle}
        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
          enabled ? 'bg-primary' : 'bg-secondary-300'
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
            enabled ? 'translate-x-6' : 'translate-x-1'
          }`}
        />
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Notifications */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Notification Preferences
        </h3>
        <div className="space-y-2">
          <ToggleSwitch
            enabled={localPreferences.notifications.rideUpdates}
            onToggle={() => handleToggle('notifications', 'rideUpdates')}
            label="Ride Updates"
            description="Get notified about ride status changes"
          />
          <ToggleSwitch
            enabled={localPreferences.notifications.promotions}
            onToggle={() => handleToggle('notifications', 'promotions')}
            label="Promotions & Offers"
            description="Receive promotional notifications and special offers"
          />
          <ToggleSwitch
            enabled={localPreferences.notifications.emailNotifications}
            onToggle={() => handleToggle('notifications', 'emailNotifications')}
            label="Email Notifications"
            description="Receive notifications via email"
          />
          <ToggleSwitch
            enabled={localPreferences.notifications.smsNotifications}
            onToggle={() => handleToggle('notifications', 'smsNotifications')}
            label="SMS Notifications"
            description="Receive notifications via text message"
          />
        </div>
      </div>

      {/* Privacy */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Privacy Settings
        </h3>
        <div className="space-y-2">
          <ToggleSwitch
            enabled={localPreferences.privacy.shareLocation}
            onToggle={() => handleToggle('privacy', 'shareLocation')}
            label="Share Location"
            description="Allow location sharing for better ride experience"
          />
          <ToggleSwitch
            enabled={localPreferences.privacy.shareRideHistory}
            onToggle={() => handleToggle('privacy', 'shareRideHistory')}
            label="Share Ride History"
            description="Share ride history for service improvements"
          />
          <ToggleSwitch
            enabled={localPreferences.privacy.allowDataCollection}
            onToggle={() => handleToggle('privacy', 'allowDataCollection')}
            label="Data Collection"
            description="Allow data collection for analytics and improvements"
          />
        </div>
      </div>

      {/* Accessibility */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Accessibility Options
        </h3>
        <div className="space-y-2">
          <ToggleSwitch
            enabled={localPreferences.accessibility.wheelchairAccessible}
            onToggle={() => handleToggle('accessibility', 'wheelchairAccessible')}
            label="Wheelchair Accessible Vehicles"
            description="Prefer wheelchair accessible vehicles"
          />
          <ToggleSwitch
            enabled={localPreferences.accessibility.audioAssistance}
            onToggle={() => handleToggle('accessibility', 'audioAssistance')}
            label="Audio Assistance"
            description="Enable audio assistance features"
          />
          <ToggleSwitch
            enabled={localPreferences.accessibility.largeText}
            onToggle={() => handleToggle('accessibility', 'largeText')}
            label="Large Text"
            description="Use larger text for better readability"
          />
        </div>
      </div>

      {/* Language & Currency */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Language & Currency
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Language
            </label>
            <select
              value={localPreferences.language}
              onChange={(e) => handleSelectChange('language', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {languages.map(lang => (
                <option key={lang.code} value={lang.code}>
                  {lang.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-2">
              Currency
            </label>
            <select
              value={localPreferences.currency}
              onChange={(e) => handleSelectChange('currency', e.target.value)}
              className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              {currencies.map(currency => (
                <option key={currency.code} value={currency.code}>
                  {currency.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Favorite Locations */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-medium text-text-primary">
            Favorite Locations
          </h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            onClick={() => setIsAddingLocation(true)}
          >
            Add Location
          </Button>
        </div>

        {isAddingLocation && (
          <div className="bg-surface-secondary rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Location name (e.g., Home, Work)"
                value={newLocation.name}
                onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="text"
                placeholder="Address"
                value={newLocation.address}
                onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
              />
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddLocation}
                >
                  Add
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingLocation(false);
                    setNewLocation({ name: '', address: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {localPreferences.favoriteLocations.map((location) => (
            <div
              key={location.id}
              className="flex items-center justify-between p-3 bg-surface-secondary rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="MapPin" size={16} className="text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {location.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {location.address}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveLocation(location.id)}
                className="p-1 text-text-muted hover:text-error transition-colors duration-fast"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
          {localPreferences.favoriteLocations.length === 0 && (
            <p className="text-text-secondary text-center py-4">
              No favorite locations added yet
            </p>
          )}
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          variant="primary"
          iconName="Save"
          onClick={handleSave}
        >
          Save Preferences
        </Button>
      </div>
    </div>
  );
};

export default PreferencesSection;