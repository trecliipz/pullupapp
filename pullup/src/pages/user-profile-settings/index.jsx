import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AppHeader from '../../components/ui/AppHeader';
import Icon from '../../components/AppIcon';

import ProfileSection from './components/ProfileSection';
import VehicleSection from './components/VehicleSection';
import PreferencesSection from './components/PreferencesSection';
import SecuritySection from './components/SecuritySection';
import AccountSection from './components/AccountSection';

const UserProfileSettings = () => {
  const navigate = useNavigate();
  const [currentMode, setCurrentMode] = useState('rider');
  const [activeSection, setActiveSection] = useState('profile');
  const [user, setUser] = useState({
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+1 (555) 123-4567",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face"
  });

  const [vehicleInfo, setVehicleInfo] = useState({
    make: "Toyota",
    model: "Camry",
    year: "2020",
    color: "Silver",
    licensePlate: "ABC-1234",
    vehicleImage: "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=400&h=300&fit=crop",
    insurance: "State Farm - Policy #SF123456",
    registration: "Valid until 12/2024"
  });

  const [preferences, setPreferences] = useState({
    notifications: {
      rideUpdates: true,
      promotions: false,
      emailNotifications: true,
      smsNotifications: true
    },
    privacy: {
      shareLocation: true,
      shareRideHistory: false,
      allowDataCollection: true
    },
    accessibility: {
      wheelchairAccessible: false,
      audioAssistance: false,
      largeText: false
    },
    language: 'en',
    currency: 'USD',
    favoriteLocations: [
      {
        id: 1,
        name: "Home",
        address: "123 Main St, New York, NY 10001"
      },
      {
        id: 2,
        name: "Work",
        address: "456 Business Ave, New York, NY 10002"
      }
    ]
  });

  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') || 'rider';
    setCurrentMode(savedMode);
  }, []);

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    localStorage.setItem('userMode', newMode);
  };

  const handleUpdateProfile = (updatedProfile) => {
    setUser(prev => ({ ...prev, ...updatedProfile }));
    // Show success message
    alert('Profile updated successfully!');
  };

  const handleUpdateVehicle = (updatedVehicle) => {
    setVehicleInfo(prev => ({ ...prev, ...updatedVehicle }));
    alert('Vehicle information updated successfully!');
  };

  const handleUpdatePreferences = (updatedPreferences) => {
    setPreferences(updatedPreferences);
    alert('Preferences updated successfully!');
  };

  const handleUpdateSecurity = (securityData) => {
    console.log('Security update:', securityData);
    alert('Security settings updated successfully!');
  };

  const handleAccountAction = (action, data) => {
    switch (action) {
      case 'download':
        alert('Your data download will begin shortly. You will receive an email when it\'s ready.');
        break;
      case 'export':
        alert('Data export initiated. You will receive an email with download instructions.');
        break;
      case 'deactivate':
        if (confirm('Are you sure you want to deactivate your account?')) {
          alert('Account deactivated successfully.');
        }
        break;
      case 'delete':
        alert('Account deletion request submitted. You will receive a confirmation email.');
        break;
      case 'support': alert('Redirecting to support...');
        break;
      case 'faq': alert('Opening FAQ section...');
        break;
      default:
        break;
    }
  };

  const sidebarSections = [
    {
      id: 'profile',
      label: 'Profile Information',
      icon: 'User',
      description: 'Personal details and photo'
    },
    {
      id: 'vehicle',
      label: 'Vehicle Information',
      icon: 'Car',
      description: 'Car details and documents',
      driverOnly: true
    },
    {
      id: 'preferences',
      label: 'Preferences',
      icon: 'Settings',
      description: 'Notifications and privacy'
    },
    {
      id: 'security',
      label: 'Security',
      icon: 'Shield',
      description: 'Password and safety settings'
    },
    {
      id: 'account',
      label: 'Account Management',
      icon: 'UserCog',
      description: 'Data and account actions'
    }
  ];

  const filteredSections = sidebarSections.filter(section => 
    !section.driverOnly || currentMode === 'driver'
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <ProfileSection
            user={user}
            currentMode={currentMode}
            onUpdateProfile={handleUpdateProfile}
          />
        );
      case 'vehicle':
        return (
          <VehicleSection
            vehicleInfo={vehicleInfo}
            onUpdateVehicle={handleUpdateVehicle}
          />
        );
      case 'preferences':
        return (
          <PreferencesSection
            preferences={preferences}
            onUpdatePreferences={handleUpdatePreferences}
          />
        );
      case 'security':
        return (
          <SecuritySection
            onUpdateSecurity={handleUpdateSecurity}
          />
        );
      case 'account':
        return (
          <AccountSection
            onAccountAction={handleAccountAction}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <AppHeader
        user={user}
        currentMode={currentMode}
        onModeChange={handleModeChange}
      />

      <div className="pt-16">
        {/* Breadcrumb */}
        <div className="bg-surface border-b border-border">
          <div className="px-4 lg:px-6 py-4">
            <div className="flex items-center space-x-2 text-sm">
              <button
                onClick={() => navigate(currentMode === 'rider' ? '/rider-dashboard' : '/driver-dashboard')}
                className="text-text-secondary hover:text-primary transition-colors duration-fast"
              >
                Dashboard
              </button>
              <Icon name="ChevronRight" size={16} className="text-text-muted" />
              <span className="text-text-primary font-medium">Profile & Settings</span>
            </div>
          </div>
        </div>

        <div className="flex">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-80 bg-surface border-r border-border min-h-screen">
            <div className="p-6">
              <h1 className="text-2xl font-heading font-semibold text-text-primary mb-6">
                Profile & Settings
              </h1>
              <nav className="space-y-2">
                {filteredSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-fast ${
                      activeSection === section.id
                        ? 'bg-primary-50 text-primary border border-primary-200' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }`}
                  >
                    <Icon 
                      name={section.icon} 
                      size={20} 
                      className={activeSection === section.id ? 'text-primary' : 'text-text-muted'} 
                    />
                    <div>
                      <p className="text-sm font-medium">{section.label}</p>
                      <p className="text-xs opacity-75">{section.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Mobile Section Selector */}
          <div className="lg:hidden w-full bg-surface border-b border-border">
            <div className="p-4">
              <select
                value={activeSection}
                onChange={(e) => setActiveSection(e.target.value)}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {filteredSections.map((section) => (
                  <option key={section.id} value={section.id}>
                    {section.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 min-h-screen">
            <div className="p-4 lg:p-8">
              <div className="max-w-4xl mx-auto">
                {/* Mobile Section Header */}
                <div className="lg:hidden mb-6">
                  <div className="flex items-center space-x-3">
                    <Icon 
                      name={filteredSections.find(s => s.id === activeSection)?.icon || 'Settings'} 
                      size={24} 
                      className="text-primary" 
                    />
                    <div>
                      <h1 className="text-xl font-heading font-semibold text-text-primary">
                        {filteredSections.find(s => s.id === activeSection)?.label}
                      </h1>
                      <p className="text-sm text-text-secondary">
                        {filteredSections.find(s => s.id === activeSection)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                {renderContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSettings;