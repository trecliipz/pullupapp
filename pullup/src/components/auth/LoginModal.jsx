import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Icon from '../AppIcon';

const LoginModal = ({ isOpen, onClose, onSwitchToSignup }) => {
  const { signIn, authError, loading } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData?.email || !formData?.password) {
      setLocalError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signIn(formData.email, formData.password);
      
      if (result?.success) {
        onClose();
        setFormData({ email: '', password: '' });
      } else {
        setLocalError(result?.error || 'Login failed');
      }
    } catch (error) {
      setLocalError('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestLogin = (role) => {
    if (role === 'rider') {
      setFormData({
        email: 'john.rider@example.com',
        password: 'password123'
      });
    } else if (role === 'driver') {
      setFormData({
        email: 'mike.driver@example.com',
        password: 'password123'
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-lg shadow-card max-w-md w-full p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-text-primary">Welcome Back</h2>
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
            type="email"
            name="email"
            placeholder="Email address"
            value={formData?.email || ''}
            onChange={handleInputChange}
            required
            disabled={isLoading}
          />

          <Input
            type="password"
            name="password"
            placeholder="Password"
            value={formData?.password || ''}
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
            Sign In
          </Button>
        </form>

        <div className="mt-6 space-y-3">
          <div className="text-center">
            <span className="text-sm text-text-secondary">Test accounts:</span>
          </div>
          
          <div className="flex space-x-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleTestLogin('rider')}
              disabled={isLoading}
            >
              Demo Rider
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => handleTestLogin('driver')}
              disabled={isLoading}
            >
              Demo Driver
            </Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <span className="text-sm text-text-secondary">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-primary hover:text-primary-600 font-medium transition-colors duration-fast"
              disabled={isLoading}
            >
              Sign up
            </button>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;