import React, { useState } from 'react';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import Icon from '../../../components/AppIcon';

const AddFundsModal = ({ isOpen, onClose, onAddFunds, paymentMethods }) => {
  const [amount, setAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const quickAmounts = [10, 25, 50, 100];

  const handleAmountChange = (value) => {
    // Only allow numbers and decimal point
    const cleanValue = value.replace(/[^0-9.]/g, '');
    // Prevent multiple decimal points
    const parts = cleanValue.split('.');
    if (parts.length > 2) return;
    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) return;
    
    setAmount(cleanValue);
  };

  const handleQuickAmount = (quickAmount) => {
    setAmount(quickAmount.toString());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!amount || !selectedMethod) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API call
      onAddFunds(parseFloat(amount), selectedMethod);
      onClose();
      setAmount('');
      setSelectedMethod('');
    } catch (error) {
      console.error('Error adding funds:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-surface rounded-xl max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-text-primary">Add Funds</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-text-secondary hover:text-text-primary"
            >
              <Icon name="X" size={20} />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Amount
              </label>
              
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text-secondary">
                  $
                </span>
                <Input
                  type="text"
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => handleAmountChange(e.target.value)}
                  className="pl-8 text-lg font-semibold"
                  required
                />
              </div>

              <div className="grid grid-cols-4 gap-2 mt-3">
                {quickAmounts.map((quickAmount) => (
                  <Button
                    key={quickAmount}
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => handleQuickAmount(quickAmount)}
                    className="text-sm"
                  >
                    ${quickAmount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-primary mb-3">
                Payment Method
              </label>
              
              <div className="space-y-2">
                {paymentMethods.map((method) => (
                  <label
                    key={method.id}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors duration-fast ${
                      selectedMethod === method.id
                        ? 'border-primary bg-primary-50' :'border-border hover:bg-surface-secondary'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.id}
                      checked={selectedMethod === method.id}
                      onChange={(e) => setSelectedMethod(e.target.value)}
                      className="sr-only"
                    />
                    
                    <div className="flex items-center space-x-3 flex-1">
                      <div className="w-8 h-6 bg-gray-200 rounded flex items-center justify-center">
                        <Icon name="CreditCard" size={14} className="text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">
                          {method.type} •••• {method.lastFour}
                        </p>
                        <p className="text-sm text-text-secondary">
                          Expires {method.expiryMonth}/{method.expiryYear}
                        </p>
                      </div>
                    </div>
                    
                    {selectedMethod === method.id && (
                      <Icon name="Check" size={16} className="text-primary" />
                    )}
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
                disabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                loading={isLoading}
                disabled={!amount || !selectedMethod}
                className="flex-1"
              >
                Add ${amount || '0.00'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;