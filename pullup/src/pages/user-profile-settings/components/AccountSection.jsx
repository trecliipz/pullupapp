import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const AccountSection = ({ onAccountAction }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');

  const accountStats = [
    {
      label: "Account Created",
      value: "March 15, 2023",
      icon: "Calendar"
    },
    {
      label: "Total Rides",
      value: "127",
      icon: "Car"
    },
    {
      label: "Rating",
      value: "4.9/5.0",
      icon: "Star"
    },
    {
      label: "Verification Status",
      value: "Verified",
      icon: "CheckCircle",
      status: "success"
    }
  ];

  const dataOptions = [
    {
      title: "Download Your Data",
      description: "Get a copy of all your account data including ride history, payments, and preferences",
      action: "download",
      icon: "Download",
      buttonText: "Download Data"
    },
    {
      title: "Data Portability",
      description: "Export your data in a format that can be imported to other services",
      action: "export",
      icon: "Share",
      buttonText: "Export Data"
    }
  ];

  const handleAccountAction = (action, data = null) => {
    onAccountAction(action, data);
  };

  const handleDeleteAccount = () => {
    if (deleteConfirmText === 'DELETE') {
      handleAccountAction('delete');
      setShowDeleteConfirm(false);
      setDeleteConfirmText('');
    }
  };

  return (
    <div className="space-y-6">
      {/* Account Overview */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Account Overview
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {accountStats.map((stat, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-4 bg-surface-secondary rounded-lg"
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                stat.status === 'success' ? 'bg-success-100' : 'bg-primary-100'
              }`}>
                <Icon 
                  name={stat.icon} 
                  size={20} 
                  className={stat.status === 'success' ? 'text-success-600' : 'text-primary'} 
                />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  {stat.label}
                </p>
                <p className="text-xs text-text-secondary">
                  {stat.value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Management */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Data Management
        </h3>
        <div className="space-y-4">
          {dataOptions.map((option, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-secondary-100 rounded-full flex items-center justify-center">
                  <Icon name={option.icon} size={20} className="text-secondary-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {option.title}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {option.description}
                  </p>
                </div>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleAccountAction(option.action)}
              >
                {option.buttonText}
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Account Actions */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Account Actions
        </h3>
        
        <div className="space-y-4">
          {/* Deactivate Account */}
          <div className="flex items-center justify-between p-4 bg-warning-50 border border-warning-200 rounded-lg">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-warning-100 rounded-full flex items-center justify-center">
                <Icon name="Pause" size={20} className="text-warning-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-text-primary">
                  Deactivate Account
                </p>
                <p className="text-xs text-text-secondary">
                  Temporarily disable your account. You can reactivate it anytime.
                </p>
              </div>
            </div>
            <Button
              variant="warning"
              size="sm"
              onClick={() => handleAccountAction('deactivate')}
            >
              Deactivate
            </Button>
          </div>

          {/* Delete Account */}
          <div className="p-4 bg-error-50 border border-error-200 rounded-lg">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="Trash2" size={20} className="text-error-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    Delete Account
                  </p>
                  <p className="text-xs text-text-secondary">
                    Permanently delete your account and all associated data. This action cannot be undone.
                  </p>
                </div>
              </div>
              <Button
                variant="danger"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
              >
                Delete Account
              </Button>
            </div>

            {showDeleteConfirm && (
              <div className="border-t border-error-200 pt-4">
                <div className="bg-surface rounded-lg p-4">
                  <div className="flex items-center space-x-2 mb-3">
                    <Icon name="AlertTriangle" size={20} className="text-error-600" />
                    <p className="text-sm font-medium text-error-600">
                      Confirm Account Deletion
                    </p>
                  </div>
                  <p className="text-xs text-text-secondary mb-4">
                    This will permanently delete your account, ride history, payment methods, and all associated data. 
                    Type "DELETE" to confirm this action.
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="Type DELETE to confirm"
                      value={deleteConfirmText}
                      onChange={(e) => setDeleteConfirmText(e.target.value)}
                      className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-error focus:border-transparent"
                    />
                    <div className="flex space-x-2">
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={handleDeleteAccount}
                        disabled={deleteConfirmText !== 'DELETE'}
                      >
                        Delete Account
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setDeleteConfirmText('');
                        }}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Support */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Need Help?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button
            variant="outline"
            iconName="MessageCircle"
            onClick={() => handleAccountAction('support')}
          >
            Contact Support
          </Button>
          <Button
            variant="outline"
            iconName="HelpCircle"
            onClick={() => handleAccountAction('faq')}
          >
            View FAQ
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccountSection;