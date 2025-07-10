import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const SignupModal = ({ isOpen, onClose, onSwitchToLogin }) => {
  const { signUp, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'rider',
    phone: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [localError, setLocalError] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setLocalError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setLocalError('');

    // Validation
    if (!formData?.fullName || !formData?.email || !formData?.password) {
      setLocalError('Please fill in all required fields');
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setLocalError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (formData?.password?.length < 6) {
      setLocalError('Password must be at least 6 characters long');
      setIsLoading(false);
      return;
    }

    try {
      const userData = {
        fullName: formData.fullName,
        role: formData.role,
        phone: formData.phone
      };

      const result = await signUp(formData.email, formData.password, userData);
      
      if (result?.success) {
        onClose();
        setFormData({
          fullName: '',
          email: '',
          password: '',
          confirmPassword: '',
          role: 'rider',
          phone: ''
        });
      } else {
        setLocalError(result?.error || 'Signup failed');
      }
    } catch (error) {
      setLocalError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-card max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Join PullUp</h2>
          <button
            onClick={onClose}
            className="text-text-secondary hover:text-text-primary transition-colors duration-fast"
          >
            <Icon name="X" size={24} />
          </button>
        </div>

        {(authError || localError) && (
          <div className="mb-4 p-3 bg-error-100 border border-error-200 rounded-lg">
            <p className="text-sm text-error-600">{authError || localError}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="text"
            name="fullName"
            placeholder="Full name"
            value={formData?.fullName || ''}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <Input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData?.email || ''}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <Input
            type="tel"
            name="phone"
            placeholder="Phone number (optional)"
            value={formData?.phone || ''}
            onChange={handleInputChange}
            disabled={isLoading}
          />

          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">
              I want to:
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors duration-fast">
                <input
                  type="radio"
                  name="role"
                  value="rider"
                  checked={formData?.role === 'rider'}
                  onChange={handleInputChange}
                  className="text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="text-sm text-text-primary">Book rides</span>
              </label>
              <label className="flex items-center space-x-2 p-3 border border-border rounded-lg cursor-pointer hover:bg-surface-secondary transition-colors duration-fast">
                <input
                  type="radio"
                  name="role"
                  value="driver"
                  checked={formData?.role === 'driver'}
                  onChange={handleInputChange}
                  className="text-primary focus:ring-primary"
                  disabled={isLoading}
                />
                <span className="text-sm text-text-primary">Drive & earn</span>
              </label>
            </div>
          </div>

          <Input
            type="password"
            name="password"
            placeholder="Password (min. 6 characters)"
            value={formData?.password || ''}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            name="confirmPassword"
            placeholder="Confirm password"
            value={formData?.confirmPassword || ''}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            disabled={isLoading || loading}
            isLoading={isLoading || loading}
          >
            Create Account
          </Button>
        </form>

        <div className="mt-6 text-center">
          <span className="text-sm text-text-secondary">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-primary hover:text-primary-600 font-medium transition-colors duration-fast"
              disabled={isLoading}
            >
              Sign in
            </button>
          </span>
        </div>

        <div className="mt-4 text-xs text-text-secondary text-center">
          By creating an account, you agree to our{' '}
          <a href="/terms" className="text-primary hover:text-primary-600">Terms of Service</a> and{' '}
          <a href="/privacy" className="text-primary hover:text-primary-600">Privacy Policy</a>
        </div>
      </div>
    </div>
  );
};

export default SignupModal;