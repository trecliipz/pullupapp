import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import Icon from '../AppIcon';
import Button from './Button';
import LoginModal from '../auth/LoginModal';
import SignupModal from '../auth/SignupModal';

const AppHeader = ({ currentMode, activeRide, onModeChange }) => {
  const navigate = useNavigate();
  const { user, userProfile, signOut, loading } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
      setShowUserMenu(false);
      navigate('/');
    } catch (error) {
      console.log('Sign out error:', error);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    setShowUserMenu(false);
  };

  const handleModeSwitch = () => {
    const newMode = currentMode === 'rider' ? 'driver' : 'rider';
    onModeChange?.(newMode);
    
    if (newMode === 'rider') {
      navigate('/rider-dashboard');
    } else {
      navigate('/driver-dashboard');
    }
    setShowUserMenu(false);
  };

  const handleLoginSuccess = () => {
    setShowLoginModal(false);
  };

  const handleSignupSuccess = () => {
    setShowSignupModal(false);
  };

  const switchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const switchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 bg-surface border-b border-border z-30">
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-text-primary hover:text-primary transition-colors duration-fast"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold">PullUp</span>
            </button>
          </div>

          {/* Center - Active Ride Status */}
          {activeRide && (
            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-primary-100 rounded-lg">
              <Icon name="Car" size={16} className="text-primary" />
              <span className="text-sm font-medium text-primary">
                {activeRide?.status === 'driver_assigned' && 'Driver Assigned'}
                {activeRide?.status === 'driver_en_route' && 'Driver En Route'}
                {activeRide?.status === 'arrived' && 'Driver Arrived'}
                {activeRide?.status === 'in_progress' && 'In Progress'}
              </span>
            </div>
          )}

          {/* Right Side */}
          <div className="flex items-center space-x-3">
            {user ? (
              // Authenticated User Menu
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-surface-secondary transition-colors duration-fast"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    {userProfile?.avatar_url ? (
                      <img
                        src={userProfile.avatar_url}
                        alt="Profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <Icon name="User" size={16} className="text-primary" />
                    )}
                  </div>
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-text-primary">
                      {userProfile?.full_name || 'User'}
                    </p>
                    <p className="text-xs text-text-secondary capitalize">
                      {currentMode || userProfile?.role || 'rider'}
                    </p>
                  </div>
                  <Icon name="ChevronDown" size={16} className="text-text-secondary" />
                </button>

                {/* User Dropdown Menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 bg-surface border border-border rounded-lg shadow-card z-40">
                    <div className="p-4 border-b border-border-muted">
                      <p className="font-medium text-text-primary">
                        {userProfile?.full_name || 'User'}
                      </p>
                      <p className="text-sm text-text-secondary">
                        {userProfile?.email || user?.email}
                      </p>
                      <div className="flex items-center space-x-2 mt-2">
                        <div className="w-2 h-2 bg-success rounded-full"></div>
                        <span className="text-xs text-text-secondary capitalize">
                          {currentMode || userProfile?.role || 'rider'} mode
                        </span>
                      </div>
                    </div>

                    <div className="p-2">
                      {/* Mode Switch */}
                      <button
                        onClick={handleModeSwitch}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-surface-secondary rounded-lg transition-colors duration-fast"
                      >
                        <Icon name="RefreshCw" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-primary">
                          Switch to {currentMode === 'rider' ? 'Driver' : 'Rider'}
                        </span>
                      </button>

                      {/* Navigation Links */}
                      <button
                        onClick={() => handleNavigation('/user-profile-settings')}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-surface-secondary rounded-lg transition-colors duration-fast"
                      >
                        <Icon name="Settings" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-primary">Profile Settings</span>
                      </button>

                      <button
                        onClick={() => handleNavigation('/payment-wallet-management')}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-surface-secondary rounded-lg transition-colors duration-fast"
                      >
                        <Icon name="Wallet" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-primary">Payment & Wallet</span>
                      </button>

                      <button
                        onClick={() => handleNavigation('/active-ride-tracking')}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-surface-secondary rounded-lg transition-colors duration-fast"
                      >
                        <Icon name="MapPin" size={16} className="text-text-secondary" />
                        <span className="text-sm text-text-primary">Ride History</span>
                      </button>

                      <div className="border-t border-border-muted my-2"></div>

                      <button
                        onClick={handleSignOut}
                        className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-error-50 rounded-lg transition-colors duration-fast text-error"
                      >
                        <Icon name="LogOut" size={16} className="text-error" />
                        <span className="text-sm">Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              // Guest User Actions
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowLoginModal(true)}
                  disabled={loading}
                >
                  Sign In
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setShowSignupModal(true)}
                  disabled={loading}
                >
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Emergency Banner for Active Rides */}
        {activeRide && (
          <div className="bg-error-50 border-b border-error-200 px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Icon name="Shield" size={16} className="text-error" />
                <span className="text-sm text-error-600">
                  Need help? Tap emergency for immediate assistance
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-error text-error hover:bg-error-100"
              >
                Emergency
              </Button>
            </div>
          </div>
        )}
      </header>

      {/* Auth Modals */}
      <LoginModal
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignup={switchToSignup}
        onSuccess={handleLoginSuccess}
      />

      <SignupModal
        isOpen={showSignupModal}
        onClose={() => setShowSignupModal(false)}
        onSwitchToLogin={switchToLogin}
        onSuccess={handleSignupSuccess}
      />
    </>
  );
};

export default AppHeader;