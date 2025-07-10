import React, { useState, useEffect } from 'react';
import AppHeader from '../../components/ui/AppHeader';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import WalletBalanceCard from './components/WalletBalanceCard';
import PaymentMethodCard from './components/PaymentMethodCard';
import TransactionItem from './components/TransactionItem';
import AddPaymentMethodModal from './components/AddPaymentMethodModal';
import AddFundsModal from './components/AddFundsModal';
import TransactionFilters from './components/TransactionFilters';

const PaymentWalletManagement = () => {
  const [activeTab, setActiveTab] = useState('wallet');
  const [isAddPaymentModalOpen, setIsAddPaymentModalOpen] = useState(false);
  const [isAddFundsModalOpen, setIsAddFundsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [currentMode, setCurrentMode] = useState('rider');
  
  const [walletBalance, setWalletBalance] = useState(127.50);
  const [paymentMethods, setPaymentMethods] = useState([
    {
      id: '1',
      type: 'Visa',
      lastFour: '4532',
      expiryMonth: '12',
      expiryYear: '25',
      cardholderName: 'John Doe',
      isDefault: true
    },
    {
      id: '2',
      type: 'Mastercard',
      lastFour: '8901',
      expiryMonth: '08',
      expiryYear: '26',
      cardholderName: 'John Doe',
      isDefault: false
    },
    {
      id: '3',
      type: 'PayPal',
      lastFour: 'john@example.com',
      expiryMonth: '',
      expiryYear: '',
      cardholderName: 'John Doe',
      isDefault: false
    }
  ]);

  const [transactions, setTransactions] = useState([
    {
      id: 'TXN001',
      type: 'ride_payment',
      description: 'Ride to Downtown',
      amount: 24.50,
      date: new Date(Date.now() - 86400000).toISOString(),
      status: 'completed',
      paymentMethod: 'Visa •••• 4532',
      rideId: 'RIDE123',
      breakdown: {
        base_fare: 18.00,
        distance_fee: 4.50,
        service_fee: 2.00
      }
    },
    {
      id: 'TXN002',
      type: 'wallet_topup',
      description: 'Wallet Top-up',
      amount: 50.00,
      date: new Date(Date.now() - 172800000).toISOString(),
      status: 'completed',
      paymentMethod: 'Mastercard •••• 8901'
    },
    {
      id: 'TXN003',
      type: 'ride_payment',
      description: 'Ride to Airport',
      amount: 45.75,
      date: new Date(Date.now() - 259200000).toISOString(),
      status: 'completed',
      paymentMethod: 'Visa •••• 4532',
      rideId: 'RIDE124',
      breakdown: {
        base_fare: 35.00,
        distance_fee: 8.75,
        service_fee: 2.00
      }
    },
    {
      id: 'TXN004',
      type: 'refund',
      description: 'Ride Cancellation Refund',
      amount: 12.25,
      date: new Date(Date.now() - 345600000).toISOString(),
      status: 'completed',
      paymentMethod: 'Visa •••• 4532',
      rideId: 'RIDE125'
    },
    {
      id: 'TXN005',
      type: 'earning',
      description: 'Driver Earnings - Week 42',
      amount: 285.50,
      date: new Date(Date.now() - 432000000).toISOString(),
      status: 'completed',
      paymentMethod: 'Bank Transfer'
    }
  ]);

  const [transactionFilters, setTransactionFilters] = useState({
    search: '',
    type: 'all',
    status: 'all',
    dateFrom: '',
    dateTo: ''
  });

  const mockUser = {
    name: 'John Doe',
    email: 'john.doe@example.com'
  };

  useEffect(() => {
    const savedMode = localStorage.getItem('userMode') || 'rider';
    setCurrentMode(savedMode);
  }, []);

  const handleModeChange = (newMode) => {
    setCurrentMode(newMode);
    localStorage.setItem('userMode', newMode);
  };

  const handleAddPaymentMethod = (newMethod) => {
    setPaymentMethods(prev => [...prev, newMethod]);
  };

  const handleSetDefaultPayment = (methodId) => {
    setPaymentMethods(prev => 
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId
      }))
    );
  };

  const handleDeletePaymentMethod = (methodId) => {
    setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
  };

  const handleAddFunds = (amount, methodId) => {
    setWalletBalance(prev => prev + amount);
    
    const newTransaction = {
      id: `TXN${Date.now()}`,
      type: 'wallet_topup',
      description: 'Wallet Top-up',
      amount: amount,
      date: new Date().toISOString(),
      status: 'completed',
      paymentMethod: paymentMethods.find(m => m.id === methodId)?.type + ' •••• ' + paymentMethods.find(m => m.id === methodId)?.lastFour
    };
    
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const handleFilterChange = (key, value) => {
    setTransactionFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setTransactionFilters({
      search: '',
      type: 'all',
      status: 'all',
      dateFrom: '',
      dateTo: ''
    });
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = !transactionFilters.search || 
      transaction.description.toLowerCase().includes(transactionFilters.search.toLowerCase()) ||
      transaction.id.toLowerCase().includes(transactionFilters.search.toLowerCase()) ||
      transaction.amount.toString().includes(transactionFilters.search);

    const matchesType = transactionFilters.type === 'all' || transaction.type === transactionFilters.type;
    const matchesStatus = transactionFilters.status === 'all' || transaction.status === transactionFilters.status;

    const transactionDate = new Date(transaction.date);
    const matchesDateFrom = !transactionFilters.dateFrom || 
      transactionDate >= new Date(transactionFilters.dateFrom);
    const matchesDateTo = !transactionFilters.dateTo || 
      transactionDate <= new Date(transactionFilters.dateTo + 'T23:59:59');

    return matchesSearch && matchesType && matchesStatus && matchesDateFrom && matchesDateTo;
  });

  const tabs = [
    { id: 'wallet', label: 'Wallet', icon: 'Wallet' },
    { id: 'payment-methods', label: 'Payment Methods', icon: 'CreditCard' },
    { id: 'transactions', label: 'Transaction History', icon: 'Receipt' }
  ];

  const recentTransactions = transactions.slice(0, 3);
  const totalSpent = transactions
    .filter(t => ['ride_payment'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);
  const totalEarned = transactions
    .filter(t => ['earning', 'refund'].includes(t.type))
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="min-h-screen bg-background">
      <AppHeader 
        user={mockUser}
        currentMode={currentMode}
        onModeChange={handleModeChange}
      />
      
      <div className="pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-text-primary mb-2">
              Payment & Wallet Management
            </h1>
            <p className="text-text-secondary">
              Manage your payment methods, wallet balance, and transaction history
            </p>
          </div>

          {/* Wallet Balance Card */}
          <div className="mb-8">
            <WalletBalanceCard 
              balance={walletBalance}
              onAddFunds={() => setIsAddFundsModalOpen(true)}
            />
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">This Month</p>
                  <p className="text-2xl font-bold text-text-primary">${totalSpent.toFixed(2)}</p>
                  <p className="text-sm text-text-secondary">Total Spent</p>
                </div>
                <div className="w-12 h-12 bg-error-100 rounded-full flex items-center justify-center">
                  <Icon name="TrendingDown" size={24} className="text-error" />
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">This Month</p>
                  <p className="text-2xl font-bold text-text-primary">${totalEarned.toFixed(2)}</p>
                  <p className="text-sm text-text-secondary">Total Earned</p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-full flex items-center justify-center">
                  <Icon name="TrendingUp" size={24} className="text-success" />
                </div>
              </div>
            </div>

            <div className="bg-surface border border-border rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Recent</p>
                  <p className="text-2xl font-bold text-text-primary">{transactions.length}</p>
                  <p className="text-sm text-text-secondary">Transactions</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon name="Receipt" size={24} className="text-primary" />
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-surface border border-border rounded-lg overflow-hidden">
            <div className="border-b border-border-muted">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center space-x-2 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors duration-fast ${
                      activeTab === tab.id
                        ? 'text-primary border-b-2 border-primary bg-primary-50' :'text-text-secondary hover:text-text-primary hover:bg-surface-secondary'
                    }`}
                  >
                    <Icon name={tab.icon} size={16} />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="p-6">
              {activeTab === 'wallet' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Wallet Overview</h3>
                    <Button
                      variant="primary"
                      onClick={() => setIsAddFundsModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Add Funds
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <h4 className="font-medium text-text-primary">Recent Transactions</h4>
                      <div className="space-y-3">
                        {recentTransactions.map((transaction) => (
                          <TransactionItem key={transaction.id} transaction={transaction} />
                        ))}
                      </div>
                      <Button
                        variant="outline"
                        onClick={() => setActiveTab('transactions')}
                        className="w-full"
                      >
                        View All Transactions
                      </Button>
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium text-text-primary">Auto-Reload Settings</h4>
                      <div className="bg-surface-secondary rounded-lg p-4">
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-sm font-medium text-text-primary">Auto-Reload</span>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                          </label>
                        </div>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-text-secondary mb-1">
                              When balance falls below
                            </label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm">
                              <option>$10.00</option>
                              <option>$20.00</option>
                              <option>$50.00</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm text-text-secondary mb-1">
                              Add amount
                            </label>
                            <select className="w-full px-3 py-2 border border-border rounded-lg bg-surface text-text-primary text-sm">
                              <option>$25.00</option>
                              <option>$50.00</option>
                              <option>$100.00</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'payment-methods' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Payment Methods</h3>
                    <Button
                      variant="primary"
                      onClick={() => setIsAddPaymentModalOpen(true)}
                      iconName="Plus"
                      iconPosition="left"
                    >
                      Add Payment Method
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <PaymentMethodCard
                        key={method.id}
                        method={method}
                        isDefault={method.isDefault}
                        onSetDefault={handleSetDefaultPayment}
                        onEdit={(method) => console.log('Edit method:', method)}
                        onDelete={handleDeletePaymentMethod}
                      />
                    ))}
                  </div>

                  {paymentMethods.length === 0 && (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                        <Icon name="CreditCard" size={32} className="text-text-secondary" />
                      </div>
                      <h4 className="text-lg font-medium text-text-primary mb-2">No Payment Methods</h4>
                      <p className="text-text-secondary mb-6">Add a payment method to start using PullUp</p>
                      <Button
                        variant="primary"
                        onClick={() => setIsAddPaymentModalOpen(true)}
                      >
                        Add Your First Payment Method
                      </Button>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'transactions' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-text-primary">Transaction History</h3>
                    <Button
                      variant="outline"
                      iconName="Download"
                      iconPosition="left"
                      size="sm"
                    >
                      Export
                    </Button>
                  </div>

                  <TransactionFilters
                    filters={transactionFilters}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                    isFiltersOpen={isFiltersOpen}
                    onToggleFilters={() => setIsFiltersOpen(!isFiltersOpen)}
                  />

                  <div className="space-y-4">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((transaction) => (
                        <TransactionItem key={transaction.id} transaction={transaction} />
                      ))
                    ) : (
                      <div className="text-center py-12">
                        <div className="w-16 h-16 bg-surface-secondary rounded-full flex items-center justify-center mx-auto mb-4">
                          <Icon name="Receipt" size={32} className="text-text-secondary" />
                        </div>
                        <h4 className="text-lg font-medium text-text-primary mb-2">No Transactions Found</h4>
                        <p className="text-text-secondary">Try adjusting your filters or check back later</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPaymentMethodModal
        isOpen={isAddPaymentModalOpen}
        onClose={() => setIsAddPaymentModalOpen(false)}
        onAdd={handleAddPaymentMethod}
      />

      <AddFundsModal
        isOpen={isAddFundsModalOpen}
        onClose={() => setIsAddFundsModalOpen(false)}
        onAddFunds={handleAddFunds}
        paymentMethods={paymentMethods.filter(method => method.type !== 'PayPal')}
      />
    </div>
  );
};

export default PaymentWalletManagement;