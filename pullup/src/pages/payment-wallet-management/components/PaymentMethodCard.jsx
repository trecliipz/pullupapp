import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const PaymentMethodCard = ({ method, isDefault, onSetDefault, onEdit, onDelete }) => {
  const getCardIcon = (type) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return 'CreditCard';
      case 'mastercard':
        return 'CreditCard';
      case 'paypal':
        return 'Smartphone';
      case 'apple pay':
        return 'Smartphone';
      default:
        return 'CreditCard';
    }
  };

  const getCardColor = (type) => {
    switch (type.toLowerCase()) {
      case 'visa':
        return 'bg-blue-500';
      case 'mastercard':
        return 'bg-red-500';
      case 'paypal':
        return 'bg-blue-600';
      case 'apple pay':
        return 'bg-gray-800';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="bg-surface border border-border rounded-lg p-4 hover:shadow-md transition-shadow duration-fast">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-8 ${getCardColor(method.type)} rounded flex items-center justify-center`}>
            <Icon name={getCardIcon(method.type)} size={16} className="text-white" />
          </div>
          
          <div>
            <div className="flex items-center space-x-2">
              <p className="font-medium text-text-primary">
                {method.type} •••• {method.lastFour}
              </p>
              {isDefault && (
                <span className="bg-primary-100 text-primary-700 text-xs px-2 py-1 rounded-full font-medium">
                  Default
                </span>
              )}
            </div>
            <p className="text-sm text-text-secondary">
              Expires {method.expiryMonth}/{method.expiryYear}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          {!isDefault && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSetDefault(method.id)}
              className="text-primary hover:text-primary-700"
            >
              Set Default
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(method)}
            className="text-text-secondary hover:text-text-primary"
          >
            <Icon name="Edit" size={16} />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(method.id)}
            className="text-error hover:text-error-700"
          >
            <Icon name="Trash2" size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodCard;