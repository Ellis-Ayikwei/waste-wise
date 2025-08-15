import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFileInvoice,
  faCreditCard,
  faMoneyBillWave,
  faCalendarAlt,
  faDownload,
  faSearch,
  faFilter,
  faWallet,
  faChartLine,
  faDollarSign,
  faCheck,
  faChevronDown,
  faChevronUp,
  faExternalLinkAlt,
  faInfoCircle,
  faHandHoldingUsd,
  faPiggyBank,
  faExclamationCircle,
  faUniversity,
  faFileExport,
  faReceipt,
  faCoins,
  faArrowRight
} from '@fortawesome/free-solid-svg-icons';

interface BankAccount {
  id: string;
  bankName: string;
  accountType: string;
  lastFour: string;
  isDefault: boolean;
}

interface Payout {
  id: string;
  amount: number;
  status: 'processing' | 'completed' | 'failed';
  date: string;
  bankAccountId: string;
  reference: string;
  estimatedArrival?: string;
}

interface Earning {
  id: string;
  bookingId: string;
  serviceType: string;
  customerName: string;
  amount: number;
  serviceFee: number;
  netAmount: number;
  status: 'available' | 'pending' | 'paid';
  date: string;
}

// Mock data for provider payments
const mockBankAccounts: BankAccount[] = [
  {
    id: 'ba_1',
    bankName: 'Chase Bank',
    accountType: 'Checking',
    lastFour: '4567',
    isDefault: true
  },
  {
    id: 'ba_2',
    bankName: 'Bank of America',
    accountType: 'Savings',
    lastFour: '8901',
    isDefault: false
  }
];

const mockPayouts: Payout[] = [
  {
    id: 'po_1',
    amount: 567.89,
    status: 'completed',
    date: '2025-03-30',
    bankAccountId: 'ba_1',
    reference: 'PYT-30MAR2025'
  },
  {
    id: 'po_2',
    amount: 1243.50,
    status: 'completed',
    date: '2025-03-15',
    bankAccountId: 'ba_1',
    reference: 'PYT-15MAR2025'
  },
  {
    id: 'po_3',
    amount: 349.99,
    status: 'processing',
    date: '2025-04-01',
    bankAccountId: 'ba_1',
    reference: 'PYT-01APR2025',
    estimatedArrival: '2025-04-03'
  }
];

const mockEarnings: Earning[] = [
  {
    id: 'ern_1',
    bookingId: 'REQ-12345',
    serviceType: 'Residential Moving',
    customerName: 'John Smith',
    amount: 249.99,
    serviceFee: 37.50,
    netAmount: 212.49,
    status: 'paid',
    date: '2025-04-01'
  },
  {
    id: 'ern_2',
    bookingId: 'REQ-23456',
    serviceType: 'Office Relocation',
    customerName: 'Acme Corp',
    amount: 1299.99,
    serviceFee: 195.00,
    netAmount: 1104.99,
    status: 'pending',
    date: '2025-04-05'
  },
  {
    id: 'ern_3',
    bookingId: 'REQ-34567',
    serviceType: 'Piano Moving',
    customerName: 'Jane Doe',
    amount: 399.99,
    serviceFee: 60.00,
    netAmount: 339.99,
    status: 'paid',
    date: '2025-03-20'
  },
  {
    id: 'ern_4',
    bookingId: 'REQ-45678',
    serviceType: 'Storage Services',
    customerName: 'Mike Johnson',
    amount: 89.99,
    serviceFee: 13.50,
    netAmount: 76.49,
    status: 'available',
    date: '2025-04-02'
  }
];

const ProviderPayments: React.FC = () => {
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(mockBankAccounts);
  const [payouts, setPayouts] = useState<Payout[]>(mockPayouts);
  const [earnings, setEarnings] = useState<Earning[]>(mockEarnings);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedEarning, setExpandedEarning] = useState<string | null>(null);
  const [expandedPayout, setExpandedPayout] = useState<string | null>(null);
  const [addingNewAccount, setAddingNewAccount] = useState(false);
  const [activeTab, setActiveTab] = useState<'earnings' | 'payouts'>('earnings');
  const [withdrawAmount, setWithdrawAmount] = useState<string>('');
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  // Filter earnings based on status and search query
  const filteredEarnings = earnings.filter(earning => {
    const matchesStatus = filterStatus === 'all' || earning.status === filterStatus;
    const matchesSearch = 
      earning.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      earning.bookingId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      earning.serviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      earning.customerName.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  // Calculate totals
  const totalAvailable = earnings
    .filter(e => e.status === 'available')
    .reduce((sum, earning) => sum + earning.netAmount, 0);
  
  const totalPending = earnings
    .filter(e => e.status === 'pending')
    .reduce((sum, earning) => sum + earning.netAmount, 0);

  const totalPaid = earnings
    .filter(e => e.status === 'paid')
    .reduce((sum, earning) => sum + earning.netAmount, 0);

  const toggleEarningDetails = (earningId: string) => {
    if (expandedEarning === earningId) {
      setExpandedEarning(null);
    } else {
      setExpandedEarning(earningId);
    }
  };

  const togglePayoutDetails = (payoutId: string) => {
    if (expandedPayout === payoutId) {
      setExpandedPayout(null);
    } else {
      setExpandedPayout(payoutId);
    }
  };

  const handleWithdrawal = () => {
    setIsWithdrawing(true);
    // Simulate API call
    setTimeout(() => {
      setIsWithdrawing(false);
      // Create new payout and reduce available balance
      const newPayout: Payout = {
        id: `po_${Date.now()}`,
        amount: parseFloat(withdrawAmount),
        status: 'processing',
        date: new Date().toISOString().split('T')[0],
        bankAccountId: 'ba_1',
        reference: `PYT-${new Date().toISOString().slice(0,10).replace(/-/g,'')}`,
        estimatedArrival: new Date(Date.now() + 2*24*60*60*1000).toISOString().split('T')[0]
      };
      setPayouts([newPayout, ...payouts]);
      setWithdrawAmount('');
      
      // Update some available earnings to paid
      const availableEarnings = earnings.filter(e => e.status === 'available');
      let amountToWithdraw = parseFloat(withdrawAmount);
      
      const updatedEarnings = earnings.map(earning => {
        if (earning.status === 'available' && amountToWithdraw > 0) {
          amountToWithdraw -= earning.netAmount;
          return { ...earning, status: 'paid' };
        }
        return earning;
      });
      
      setEarnings(updatedEarnings);
      setActiveTab('payouts');
    }, 1500);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'paid':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'failed':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200';
    }
  };

  const handleSetDefaultAccount = (accountId: string) => {
    setBankAccounts(accounts => 
      accounts.map(account => ({
        ...account,
        isDefault: account.id === accountId
      }))
    );
  };

  const handleRemoveAccount = (accountId: string) => {
    // Don't allow removing the default account
    const isDefault = bankAccounts.find(a => a.id === accountId)?.isDefault;
    if (isDefault) {
      alert("You can't remove your default account. Please set another account as default first.");
      return;
    }
    
    setBankAccounts(accounts => accounts.filter(account => account.id !== accountId));
  };

  return (
    <div className="w-full px-4 md:px-8 py-8 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {/* Header with gradient background */}
      <div className="relative py-8 mb-8 bg-gradient-to-r from-blue-600 to-teal-500">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">
            Provider Dashboard
          </h1>
          <p className="text-white text-opacity-90 mt-2">Track earnings and manage your payouts</p>
        </div>
      </div>

      {/* Content container */}
      <div className="w-full max-w-[90rem] mx-auto">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faHandHoldingUsd} className="text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Available Balance</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalAvailable.toFixed(2)}</div>
            <button 
              onClick={() => setIsWithdrawing(true)} 
              disabled={totalAvailable <= 0}
              className={`mt-2 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 
                        text-white px-3 py-1 rounded-md text-sm font-medium transition-colors
                        ${totalAvailable <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}>
              Withdraw to Bank
            </button>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faCalendarAlt} className="text-yellow-600 dark:text-yellow-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Pending Earnings</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalPending.toFixed(2)}</div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Available after service completion</p>
          </div>
          
          <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-md dark:shadow-gray-900/30">
            <div className="flex items-center mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center mr-3">
                <FontAwesomeIcon icon={faChartLine} className="text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Total Paid Out</h3>
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">${totalPaid.toFixed(2)}</div>
            <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">Lifetime earnings</p>
          </div>
        </div>

        {/* Withdrawal Modal */}
        {isWithdrawing && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl max-w-md w-full animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Withdraw Funds</h3>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Available Balance
                </label>
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  ${totalAvailable.toFixed(2)}
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Withdrawal Amount
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faDollarSign} className="text-gray-500 dark:text-gray-400" />
                  </div>
                  <input
                    type="number"
                    value={withdrawAmount}
                    onChange={(e) => setWithdrawAmount(e.target.value)}
                    max={totalAvailable}
                    min="0.01"
                    step="0.01"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                            focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                            bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Enter amount to withdraw"
                  />
                </div>
              </div>
              
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Destination
                </label>
                <div className="flex items-center p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faUniversity} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200">
                      {bankAccounts.find(a => a.isDefault)?.bankName} ({bankAccounts.find(a => a.isDefault)?.accountType})
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      •••• {bankAccounts.find(a => a.isDefault)?.lastFour}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setIsWithdrawing(false)}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 
                           text-gray-800 dark:text-gray-200 px-4 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleWithdrawal}
                  disabled={!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > totalAvailable}
                  className={`flex-1 bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 
                             text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex justify-center items-center
                             ${(!withdrawAmount || parseFloat(withdrawAmount) <= 0 || parseFloat(withdrawAmount) > totalAvailable) ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {parseFloat(withdrawAmount) > totalAvailable ? 'Insufficient Funds' : 'Confirm Withdrawal'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Bank Accounts Section */}
        <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg dark:shadow-gray-900/30 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Payout Methods</h2>
            <button 
              onClick={() => setAddingNewAccount(!addingNewAccount)} 
              className="px-3 py-1 bg-blue-600 text-white rounded-md text-sm flex items-center hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600"
            >
              {addingNewAccount ? 'Cancel' : '+ Add Bank Account'}
            </button>
          </div>
          
          {addingNewAccount && (
            <div className="mb-4 p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-750 animate-fadeIn">
              <h3 className="text-md font-medium text-gray-700 dark:text-gray-300 mb-3">Add New Bank Account</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Bank Name</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="e.g. Chase Bank"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Type</label>
                  <select className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Routing Number</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="9 digits"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Account Number</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Your account number"
                  />
                </div>
                <div className="md:col-span-2">
                  <button className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 transition-colors dark:bg-blue-700 dark:hover:bg-blue-600 w-full md:w-auto">
                    <FontAwesomeIcon icon={faCheck} className="mr-2" />
                    Add Bank Account
                  </button>
                </div>
              </div>
            </div>
          )}
          
          <div className="space-y-2">
            {bankAccounts.map((account) => (
              <div key={account.id} className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-md">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mr-3">
                    <FontAwesomeIcon icon={faUniversity} className="text-gray-600 dark:text-gray-300" />
                  </div>
                  <div>
                    <div className="font-medium text-gray-800 dark:text-gray-200 flex items-center">
                      {account.bankName} ({account.accountType})
                      {account.isDefault && (
                        <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-0.5 rounded-full">
                          Default
                        </span>
                      )}
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">•••• {account.lastFour}</div>
                  </div>
                </div>
                <div className="flex space-x-2">
                  {!account.isDefault && (
                    <button 
                      onClick={() => handleSetDefaultAccount(account.id)}
                      className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors">
                      Set as Default
                    </button>
                  )}
                  <button 
                    onClick={() => handleRemoveAccount(account.id)}
                    className="px-2 py-1 text-xs border border-red-300 dark:border-red-700 rounded hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 transition-colors">
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Tabs Navigation */}
        <div className="mb-6 flex border-b border-gray-200 dark:border-gray-700">
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'earnings' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('earnings')}
          >
            <FontAwesomeIcon icon={faDollarSign} className="mr-2" />
            Earnings
          </button>
          <button 
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === 'payouts' 
                ? 'border-b-2 border-blue-500 text-blue-600 dark:text-blue-400' 
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
            }`}
            onClick={() => setActiveTab('payouts')}
          >
            <FontAwesomeIcon icon={faPiggyBank} className="mr-2" />
            Payouts
          </button>
        </div>

        {activeTab === 'earnings' && (
          <>
            {/* Filters and Search */}
            <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-lg shadow-lg dark:shadow-gray-900/30 mb-6">
              <div className="flex flex-col md:flex-row justify-between gap-4">
                <div className="relative flex-grow">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FontAwesomeIcon icon={faSearch} className="text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                           focus:outline-none focus:ring-blue-500 focus:border-blue-500 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    placeholder="Search by booking ID, customer, or service"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </div>
                
                <div className="flex items-center">
                  <FontAwesomeIcon icon={faFilter} className="mr-2 text-gray-500 dark:text-gray-400" />
                  <label className="mr-2 text-sm font-medium text-gray-700 dark:text-gray-300">Status:</label>
                  <select 
                    className="border border-gray-300 dark:border-gray-700 rounded-md shadow-sm 
                             focus:outline-none focus:ring-blue-500 focus:border-blue-500 py-2 px-3
                             bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">All Earnings</option>
                    <option value="available">Available</option>
                    <option value="pending">Pending</option>
                    <option value="paid">Paid</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Earnings List */}
            <div className="space-y-4">
              {filteredEarnings.length > 0 ? (
                filteredEarnings.map((earning) => (
                  <div key={earning.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 overflow-hidden">
                    {/* Earning Header */}
                    <div 
                      className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                               hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                      onClick={() => toggleEarningDetails(earning.id)}
                    >
                      <div className="flex flex-col md:flex-row md:items-center justify-between">
                        <div className="flex-grow">
                          <div className="flex items-center mb-2">
                            <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 mr-3">
                              {earning.serviceType}
                            </span>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(earning.status)}`}>
                              {earning.status.charAt(0).toUpperCase() + earning.status.slice(1)}
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            <span className="font-medium">Booking {earning.bookingId}</span> • Customer: {earning.customerName}
                          </div>

                          <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 gap-y-1 sm:gap-x-4">
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500 dark:text-blue-400" />
                              {new Date(earning.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <FontAwesomeIcon icon={faMoneyBillWave} className="mr-2 text-blue-500 dark:text-blue-400" />
                              ${earning.netAmount.toFixed(2)} (net)
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center mt-4 md:mt-0">
                          <div className="text-right mr-4">
                            <div className="font-semibold text-gray-900 dark:text-gray-100">
                              ${earning.amount.toFixed(2)}
                            </div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              Gross Amount
                            </div>
                          </div>
                          <FontAwesomeIcon 
                            icon={expandedEarning === earning.id ? faChevronUp : faChevronDown} 
                            className="text-gray-500 dark:text-gray-400" 
                          />
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {expandedEarning === earning.id && (
                      <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-750 animate-fadeIn">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                          <div>
                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Earning Details</h3>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Earning ID</p>
                                  <p className="text-sm font-medium dark:text-gray-200">{earning.id}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Booking ID</p>
                                  <p className="text-sm font-medium dark:text-gray-200">{earning.bookingId}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                  <p className="text-sm font-medium dark:text-gray-200">{new Date(earning.date).toLocaleDateString()}</p>
                                </div>
                                
                                <div>
                                  <p className="text-xs text-gray-500 dark:text-gray-400">Customer</p>
                                  <p className="text-sm font-medium dark:text-gray-200">{earning.customerName}</p>
                                </div>
                              </div>
                              
                              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Gross Amount</span>
                                  <span className="text-sm font-medium dark:text-gray-200">${earning.amount.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between mb-1">
                                  <span className="text-sm text-gray-600 dark:text-gray-400">Service Fee (15%)</span>
                                  <span className="text-sm font-medium dark:text-gray-200">-${earning.serviceFee.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700">
                                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">Net Earnings</span>
                                  <span className="text-sm font-bold text-green-600 dark:text-green-400">${earning.netAmount.toFixed(2)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                          
                          <div>
                            <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Actions</h3>
                            
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                              <div className="flex flex-wrap gap-2">
                                <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 
                                                text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                  <FontAwesomeIcon icon={faDownload} className="mr-2" />
                                  Download Statement
                                </button>
                                
                                <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                                                text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 
                                                px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                  <FontAwesomeIcon icon={faExternalLinkAlt} className="mr-2" />
                                  View Booking
                                </button>
                              </div>

                              {earning.status === 'available' && (
                                <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                    This amount is available for withdrawal to your bank account.
                                  </p>
                                  <button 
                                    onClick={() => {
                                      setWithdrawAmount(earning.netAmount.toFixed(2));
                                      setIsWithdrawing(true);
                                    }}
                                    className="w-full bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 
                                            text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center justify-center"
                                  >
                                    <FontAwesomeIcon icon={faUniversity} className="mr-2" />
                                    Transfer ${earning.netAmount.toFixed(2)} to Bank
                                  </button>
                                </div>
                              )}

                              {earning.status === 'pending' && (
                                <div className="mt-4 bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 p-3 rounded-r-md">
                                  <div className="flex">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-yellow-500 mr-3 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                        This earning will be available after service completion and customer confirmation.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}

                              {earning.status === 'paid' && (
                                <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-md">
                                  <div className="flex">
                                    <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-3 mt-0.5" />
                                    <div>
                                      <p className="text-sm text-blue-700 dark:text-blue-300">
                                        This earning has been included in a previous payout.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-8 text-center">
                  <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No earnings found</div>
                  <p className="text-gray-500 dark:text-gray-400 mb-4">
                    {searchQuery || filterStatus !== 'all' ? 
                      'Try adjusting your filters or search terms' : 
                      'You haven\'t received any earnings yet'
                    }
                  </p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'payouts' && (
          <div className="space-y-4">
            {payouts.length > 0 ? (
              payouts.map((payout) => (
                <div key={payout.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 overflow-hidden">
                  {/* Payout Header */}
                  <div 
                    className="p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 cursor-pointer 
                             hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors"
                    onClick={() => togglePayoutDetails(payout.id)}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between">
                      <div className="flex-grow">
                        <div className="flex items-center mb-2">
                          <span className="font-semibold text-lg text-gray-800 dark:text-gray-100 mr-3">
                            Payout {payout.reference}
                          </span>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(payout.status)}`}>
                            {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                          </span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center text-sm text-gray-600 dark:text-gray-400 gap-y-1 sm:gap-x-4">
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faCalendarAlt} className="mr-2 text-blue-500 dark:text-blue-400" />
                            {new Date(payout.date).toLocaleDateString()}
                          </div>
                          <div className="flex items-center">
                            <FontAwesomeIcon icon={faUniversity} className="mr-2 text-blue-500 dark:text-blue-400" />
                            {bankAccounts.find(a => a.id === payout.bankAccountId)?.bankName} (••••{bankAccounts.find(a => a.id === payout.bankAccountId)?.lastFour})
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center mt-4 md:mt-0">
                        <div className="text-right mr-4">
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            ${payout.amount.toFixed(2)}
                          </div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {payout.status === 'processing' ? 'Processing' : 'Completed'}
                          </div>
                        </div>
                        <FontAwesomeIcon 
                          icon={expandedPayout === payout.id ? faChevronUp : faChevronDown} 
                          className="text-gray-500 dark:text-gray-400" 
                        />
                      </div>
                    </div>
                  </div>

                  {/* Expanded Details */}
                  {expandedPayout === payout.id && (
                    <div className="p-4 md:p-6 bg-gray-50 dark:bg-gray-750 animate-fadeIn">
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Payout Details</h3>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Payout ID</p>
                                <p className="text-sm font-medium dark:text-gray-200">{payout.id}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Reference</p>
                                <p className="text-sm font-medium dark:text-gray-200">{payout.reference}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Date</p>
                                <p className="text-sm font-medium dark:text-gray-200">{new Date(payout.date).toLocaleDateString()}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Status</p>
                                <p className="text-sm font-medium dark:text-gray-200">
                                  <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(payout.status)}`}>
                                    {payout.status.charAt(0).toUpperCase() + payout.status.slice(1)}
                                  </span>
                                </p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Amount</p>
                                <p className="text-sm font-medium text-green-600 dark:text-green-400">${payout.amount.toFixed(2)}</p>
                              </div>
                              
                              <div>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Destination</p>
                                <p className="text-sm font-medium dark:text-gray-200">
                                  {bankAccounts.find(a => a.id === payout.bankAccountId)?.bankName} (••••{bankAccounts.find(a => a.id === payout.bankAccountId)?.lastFour})
                                </p>
                              </div>
                            </div>
                            
                            {payout.status === 'processing' && payout.estimatedArrival && (
                              <div className="mt-4 pt-3 border-t border-gray-100 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                  <FontAwesomeIcon icon={faInfoCircle} className="mr-2 text-blue-500 dark:text-blue-400" />
                                  Estimated arrival: {new Date(payout.estimatedArrival).toLocaleDateString()}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div>
                          <h3 className="text-md font-semibold mb-3 text-gray-700 dark:text-gray-300">Actions</h3>
                          
                          <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm dark:shadow-gray-900/20">
                            <div className="flex flex-wrap gap-2">
                              <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 
                                              text-white px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                <FontAwesomeIcon icon={faFileExport} className="mr-2" />
                                Download Receipt
                              </button>
                              
                              <button className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 
                                              text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 
                                              px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center">
                                <FontAwesomeIcon icon={faReceipt} className="mr-2" />
                                View Statement
                              </button>
                            </div>

                            {payout.status === 'processing' && (
                              <div className="mt-4 bg-blue-50 dark:bg-blue-900/30 border-l-4 border-blue-500 p-3 rounded-r-md">
                                <div className="flex">
                                  <FontAwesomeIcon icon={faInfoCircle} className="text-blue-500 mr-3 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-blue-700 dark:text-blue-300">
                                      This payout is being processed and will be deposited to your bank account soon.
                                      {payout.estimatedArrival && (
                                        <> Expected arrival: <span className="font-medium">{new Date(payout.estimatedArrival).toLocaleDateString()}</span>.</>
                                      )}
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {payout.status === 'completed' && (
                              <div className="mt-4 bg-green-50 dark:bg-green-900/30 border-l-4 border-green-500 p-3 rounded-r-md">
                                <div className="flex">
                                  <FontAwesomeIcon icon={faCheck} className="text-green-500 mr-3 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-green-700 dark:text-green-300">
                                      This payout has been successfully processed and deposited to your bank account.
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )}

                            {payout.status === 'failed' && (
                              <div className="mt-4 bg-red-50 dark:bg-red-900/30 border-l-4 border-red-500 p-3 rounded-r-md">
                                <div className="flex">
                                  <FontAwesomeIcon icon={faExclamationCircle} className="text-red-500 mr-3 mt-0.5" />
                                  <div>
                                    <p className="text-sm text-red-700 dark:text-red-300">
                                      This payout has failed. Please check your bank account details or contact support.
                                    </p>
                                    <button className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded">
                                      Retry Payout
                                    </button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg dark:shadow-gray-900/30 p-8 text-center">
                <div className="text-gray-500 dark:text-gray-400 text-lg mb-2">No payouts found</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">
                  You haven't initiated any payouts yet
                </p>
                <button 
                  onClick={() => setIsWithdrawing(true)}
                  disabled={totalAvailable <= 0}
                  className={`bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 
                           text-white px-6 py-2 rounded-lg transition-colors
                           ${totalAvailable <= 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <FontAwesomeIcon icon={faCoins} className="mr-2" />
                  {totalAvailable <= 0 ? 'No Funds Available' : 'Withdraw Available Funds'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProviderPayments;