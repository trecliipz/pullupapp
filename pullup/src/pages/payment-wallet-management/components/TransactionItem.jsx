import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';

const TransactionItem = ({ transaction }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'ride_payment':
        return 'Car';
      case 'wallet_topup':
        return 'Plus';
      case 'refund':
        return 'RotateCcw';
      case 'earning':
        return 'TrendingUp';
      default:
        return 'DollarSign';
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'ride_payment':
        return 'text-error';
      case 'wallet_topup':
        return 'text-success';
      case 'refund':
        return 'text-success';
      case 'earning':
        return 'text-success';
      default:
        return 'text-text-secondary';
    }
  };

  const getAmountDisplay = (amount, type) => {
    const isPositive = ['wallet_topup', 'refund', 'earning'].includes(type);
    return `${isPositive ? '+' : '-'}$${Math.abs(amount).toFixed(2)}`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { color: 'bg-success-100 text-success-700', label: 'Completed' },
      pending: { color: 'bg-warning-100 text-warning-700', label: 'Pending' },
      failed: { color: 'bg-error-100 text-error-700', label: 'Failed' },
      refunded: { color: 'bg-secondary-100 text-secondary-700', label: 'Refunded' }
    };

    const config = statusConfig[status] || statusConfig.completed;
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="bg-surface border border-border rounded-lg overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-surface-secondary transition-colors duration-fast"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className={`w-10 h-10 rounded-full bg-surface-secondary flex items-center justify-center ${getTransactionColor(transaction.type)}`}>
              <Icon name={getTransactionIcon(transaction.type)} size={20} />
            </div>
            
            <div>
              <p className="font-medium text-text-primary">{transaction.description}</p>
              <div className="flex items-center space-x-2 mt-1">
                <p className="text-sm text-text-secondary">
                  {new Date(transaction.date).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </p>
                {getStatusBadge(transaction.status)}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <p className={`font-semibold ${getTransactionColor(transaction.type)}`}>
              {getAmountDisplay(transaction.amount, transaction.type)}
            </p>
            <Icon 
              name="ChevronDown" 
              size={16} 
              className={`text-text-secondary transition-transform duration-fast ${
                isExpanded ? 'rotate-180' : ''
              }`} 
            />
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border-muted bg-surface-secondary/50">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <p className="text-sm font-medium text-text-primary mb-2">Transaction Details</p>
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Transaction ID:</span>
                  <span className="text-text-primary font-mono">{transaction.id}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-secondary">Payment Method:</span>
                  <span className="text-text-primary">{transaction.paymentMethod}</span>
                </div>
                {transaction.rideId && (
                  <div className="flex justify-between text-sm">
                    <span className="text-text-secondary">Ride ID:</span>
                    <span className="text-text-primary font-mono">{transaction.rideId}</span>
                  </div>
                )}
              </div>
            </div>
            
            {transaction.breakdown && (
              <div>
                <p className="text-sm font-medium text-text-primary mb-2">Amount Breakdown</p>
                <div className="space-y-1">
                  {Object.entries(transaction.breakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className="text-text-secondary capitalize">{key.replace('_', ' ')}:</span>
                      <span className="text-text-primary">${value.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TransactionItem;