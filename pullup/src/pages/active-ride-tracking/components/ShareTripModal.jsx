import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const ShareTripModal = ({ isOpen, onClose, tripData }) => {
  const [shareMethod, setShareMethod] = useState('link');
  const [contactInput, setContactInput] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [shareSuccess, setShareSuccess] = useState(false);

  const tripShareLink = `https://pullup.com/track/${tripData?.id || 'TR-2024-001'}`;

  const shareOptions = [
    {
      id: 'link',
      title: 'Share Link',
      description: 'Copy shareable tracking link',
      icon: 'Link',
      color: 'text-primary'
    },
    {
      id: 'sms',
      title: 'Send SMS',
      description: 'Send tracking link via text',
      icon: 'MessageSquare',
      color: 'text-success'
    },
    {
      id: 'email',
      title: 'Send Email',
      description: 'Email tracking details',
      icon: 'Mail',
      color: 'text-warning'
    }
  ];

  const handleShare = async () => {
    setIsSharing(true);
    
    // Simulate sharing process
    setTimeout(() => {
      setIsSharing(false);
      setShareSuccess(true);
      
      // Auto close after success
      setTimeout(() => {
        setShareSuccess(false);
        onClose();
      }, 2000);
    }, 1500);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(tripShareLink);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 2000);
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-surface rounded-lg shadow-modal max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-50 rounded-full flex items-center justify-center">
              <Icon name="Share" size={20} className="text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-text-primary">Share Trip</h2>
              <p className="text-sm text-text-secondary">Let others track your journey</p>
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
          {shareSuccess ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-success-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Check" size={24} className="text-success" />
              </div>
              <h3 className="text-lg font-semibold text-text-primary mb-2">
                Trip Shared Successfully!
              </h3>
              <p className="text-text-secondary">
                Your contacts can now track your journey
              </p>
            </div>
          ) : (
            <>
              {/* Trip Information */}
              <div className="bg-surface-secondary rounded-lg p-4 mb-6">
                <h3 className="font-medium text-text-primary mb-3">Trip Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-success" />
                    <span className="text-text-secondary">From:</span>
                    <span className="text-text-primary">
                      {tripData?.pickup?.address || "123 Main Street"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <span className="text-text-secondary">To:</span>
                    <span className="text-text-primary">
                      {tripData?.destination?.address || "456 Business Ave"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Icon name="Clock" size={16} className="text-text-secondary" />
                    <span className="text-text-secondary">ETA:</span>
                    <span className="text-text-primary">
                      {new Date(Date.now() + 15 * 60000).toLocaleTimeString([], {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Share Methods */}
              <div className="space-y-3 mb-6">
                <h3 className="font-medium text-text-primary">Share Method</h3>
                {shareOptions.map((option) => (
                  <button
                    key={option.id}
                    onClick={() => setShareMethod(option.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg border-2 transition-all duration-fast ${
                      shareMethod === option.id
                        ? 'border-primary bg-primary-50' :'border-border hover:border-border-muted'
                    }`}
                  >
                    <Icon name={option.icon} size={20} className={option.color} />
                    <div className="flex-1 text-left">
                      <h4 className="font-medium text-text-primary">{option.title}</h4>
                      <p className="text-sm text-text-secondary">{option.description}</p>
                    </div>
                    {shareMethod === option.id && (
                      <Icon name="Check" size={20} className="text-primary" />
                    )}
                  </button>
                ))}
              </div>

              {/* Share Input */}
              {shareMethod === 'link' ? (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-primary">
                    Tracking Link
                  </label>
                  <div className="flex space-x-2">
                    <Input
                      type="text"
                      value={tripShareLink}
                      readOnly
                      className="flex-1"
                    />
                    <Button
                      variant="outline"
                      onClick={handleCopyLink}
                      iconName="Copy"
                    >
                      Copy
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-text-primary">
                    {shareMethod === 'sms' ? 'Phone Number' : 'Email Address'}
                  </label>
                  <Input
                    type={shareMethod === 'sms' ? 'tel' : 'email'}
                    placeholder={shareMethod === 'sms' ? '+1 (555) 123-4567' : 'friend@example.com'}
                    value={contactInput}
                    onChange={(e) => setContactInput(e.target.value)}
                  />
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 mt-6">
                <Button
                  variant="outline"
                  onClick={onClose}
                  fullWidth
                >
                  Cancel
                </Button>
                {shareMethod !== 'link' && (
                  <Button
                    variant="primary"
                    onClick={handleShare}
                    loading={isSharing}
                    fullWidth
                    iconName="Send"
                    iconPosition="left"
                  >
                    {isSharing ? 'Sharing...' : `Send ${shareMethod.toUpperCase()}`}
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareTripModal;