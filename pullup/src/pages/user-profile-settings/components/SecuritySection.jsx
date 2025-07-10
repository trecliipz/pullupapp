import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';

const SecuritySection = ({ onUpdateSecurity }) => {
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState([
    {
      id: 1,
      name: "Sarah Johnson",
      phone: "+1 (555) 123-4567",
      relationship: "Sister"
    },
    {
      id: 2,
      name: "Mike Davis",
      phone: "+1 (555) 987-6543",
      relationship: "Friend"
    }
  ]);
  const [newContact, setNewContact] = useState({
    name: '',
    phone: '',
    relationship: ''
  });
  const [isAddingContact, setIsAddingContact] = useState(false);

  const activeSessions = [
    {
      id: 1,
      device: "iPhone 14 Pro",
      location: "New York, NY",
      lastActive: "2 minutes ago",
      current: true
    },
    {
      id: 2,
      device: "MacBook Pro",
      location: "New York, NY",
      lastActive: "1 hour ago",
      current: false
    },
    {
      id: 3,
      device: "Chrome Browser",
      location: "Brooklyn, NY",
      lastActive: "3 days ago",
      current: false
    }
  ];

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordSubmit = () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    onUpdateSecurity({ type: 'password', data: passwordForm });
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setIsChangingPassword(false);
  };

  const handleTwoFactorToggle = () => {
    setTwoFactorEnabled(!twoFactorEnabled);
    onUpdateSecurity({ type: 'twoFactor', enabled: !twoFactorEnabled });
  };

  const handleAddContact = () => {
    if (newContact.name && newContact.phone && newContact.relationship) {
      const contact = {
        ...newContact,
        id: Date.now()
      };
      setEmergencyContacts(prev => [...prev, contact]);
      setNewContact({ name: '', phone: '', relationship: '' });
      setIsAddingContact(false);
      onUpdateSecurity({ type: 'emergencyContacts', contacts: [...emergencyContacts, contact] });
    }
  };

  const handleRemoveContact = (contactId) => {
    const updatedContacts = emergencyContacts.filter(contact => contact.id !== contactId);
    setEmergencyContacts(updatedContacts);
    onUpdateSecurity({ type: 'emergencyContacts', contacts: updatedContacts });
  };

  const handleTerminateSession = (sessionId) => {
    onUpdateSecurity({ type: 'terminateSession', sessionId });
  };

  return (
    <div className="space-y-6">
      {/* Password Change */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-medium text-text-primary">
            Password & Authentication
          </h3>
          {!isChangingPassword && (
            <Button
              variant="outline"
              size="sm"
              iconName="Key"
              onClick={() => setIsChangingPassword(true)}
            >
              Change Password
            </Button>
          )}
        </div>

        {isChangingPassword ? (
          <div className="space-y-4">
            <Input
              type="password"
              name="currentPassword"
              placeholder="Current password"
              value={passwordForm.currentPassword}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="newPassword"
              placeholder="New password"
              value={passwordForm.newPassword}
              onChange={handlePasswordChange}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm new password"
              value={passwordForm.confirmPassword}
              onChange={handlePasswordChange}
            />
            <div className="flex space-x-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handlePasswordSubmit}
              >
                Update Password
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setIsChangingPassword(false);
                  setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Password</p>
              <p className="text-xs text-text-secondary">Last changed 3 months ago</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-success rounded-full"></div>
              <span className="text-sm text-success-600">Strong</span>
            </div>
          </div>
        )}

        {/* Two-Factor Authentication */}
        <div className="border-t border-border-muted pt-4 mt-4">
          <div className="flex items-center justify-between py-3">
            <div>
              <p className="text-sm font-medium text-text-primary">Two-Factor Authentication</p>
              <p className="text-xs text-text-secondary">Add an extra layer of security to your account</p>
            </div>
            <button
              onClick={handleTwoFactorToggle}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-fast ${
                twoFactorEnabled ? 'bg-primary' : 'bg-secondary-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform duration-fast ${
                  twoFactorEnabled ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <h3 className="text-lg font-heading font-medium text-text-primary mb-4">
          Active Sessions
        </h3>
        <div className="space-y-3">
          {activeSessions.map((session) => (
            <div
              key={session.id}
              className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon 
                    name={session.device.includes('iPhone') ? 'Smartphone' : 
                          session.device.includes('MacBook') ? 'Laptop' : 'Monitor'} 
                    size={20} 
                    className="text-primary" 
                  />
                </div>
                <div>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm font-medium text-text-primary">
                      {session.device}
                    </p>
                    {session.current && (
                      <span className="px-2 py-1 bg-success-100 text-success-600 text-xs rounded-full">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-text-secondary">
                    {session.location} • {session.lastActive}
                  </p>
                </div>
              </div>
              {!session.current && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleTerminateSession(session.id)}
                >
                  Terminate
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Contacts */}
      <div className="bg-surface rounded-lg shadow-card border border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-heading font-medium text-text-primary">
            Emergency Contacts
          </h3>
          <Button
            variant="outline"
            size="sm"
            iconName="Plus"
            onClick={() => setIsAddingContact(true)}
          >
            Add Contact
          </Button>
        </div>

        {isAddingContact && (
          <div className="bg-surface-secondary rounded-lg p-4 mb-4">
            <div className="space-y-3">
              <Input
                type="text"
                placeholder="Contact name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
              />
              <Input
                type="tel"
                placeholder="Phone number"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
              />
              <select
                value={newContact.relationship}
                onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                className="w-full px-3 py-2 bg-surface border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="">Select relationship</option>
                <option value="Family">Family</option>
                <option value="Friend">Friend</option>
                <option value="Colleague">Colleague</option>
                <option value="Other">Other</option>
              </select>
              <div className="flex space-x-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleAddContact}
                >
                  Add Contact
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsAddingContact(false);
                    setNewContact({ name: '', phone: '', relationship: '' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-3">
          {emergencyContacts.map((contact) => (
            <div
              key={contact.id}
              className="flex items-center justify-between p-4 bg-surface-secondary rounded-lg"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="Phone" size={20} className="text-error-600" />
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary">
                    {contact.name}
                  </p>
                  <p className="text-xs text-text-secondary">
                    {contact.phone} • {contact.relationship}
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleRemoveContact(contact.id)}
                className="p-1 text-text-muted hover:text-error transition-colors duration-fast"
              >
                <Icon name="Trash2" size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SecuritySection;