import React from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const WalletBalanceCard = ({ balance, onAddFunds }) => {
  return (
    <div className="bg-gradient-to-r from-primary to-primary-700 rounded-xl p-6 text-white shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-primary-100 text-sm font-medium">Wallet Balance</p>
          <p className="text-3xl font-bold">${balance.toFixed(2)}</p>
        </div>
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
          <Icon name="Wallet" size={24} className="text-white" />
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="text-primary-100 text-sm">
          <p>Available for rides</p>
        </div>
        <Button
          variant="secondary"
          size="sm"
          onClick={onAddFunds}
          className="bg-white/20 hover:bg-white/30 text-white border-white/30"
        >
          <Icon name="Plus" size={16} className="mr-2" />
          Add Funds
        </Button>
      </div>
    </div>
  );
};

export default WalletBalanceCard;