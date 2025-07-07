
import React, { useState } from 'react';

function SettingsPage({ user }) {
  const [activeSection, setActiveSection] = useState('exchanges');
  const [editMode, setEditMode] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showApiModal, setShowApiModal] = useState(false);
  const [selectedExchange, setSelectedExchange] = useState('');
  const [apiCredentials, setApiCredentials] = useState({
    bybit: { apiKey: '', secret: '', connected: true },
    binance: { apiKey: '', secret: '', connected: false },
    bitget: { apiKey: '', secret: '', connected: false }
  });
  const [testingConnection, setTestingConnection] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    name: user?.email?.split('@')[0] || 'User',
    email: user?.email || 'user@example.com',
    timezone: 'UTC+3 (Kenya)',
    language: 'English',
    joinDate: 'January 2025'
  });

  const handleConfigureExchange = (exchange) => {
    setSelectedExchange(exchange);
    setShowApiModal(true);
  };

  const handleApiSubmit = async () => {
    setTestingConnection(true);
    
    try {
      // Call your backend to test API connection
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/trading/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          exchange: selectedExchange,
          apiKey: apiCredentials[selectedExchange].apiKey,
          secret: apiCredentials[selectedExchange].secret
        })
      });

      const result = await response.json();
      
      if (result.success) {
        setApiCredentials(prev => ({
          ...prev,
          [selectedExchange]: {
            ...prev[selectedExchange],
            connected: true
          }
        }));
        alert(`✅ ${selectedExchange.charAt(0).toUpperCase() + selectedExchange.slice(1)} connected successfully!\nBalance: $${result.balance || '0.00'}`);
        setShowApiModal(false);
      } else {
        alert(`❌ Connection failed: ${result.message}`);
      }
    } catch (error) {
      alert(`❌ Connection error: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const handleTestConnection = async (exchange) => {
    setTestingConnection(true);
    
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/trading/balance`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      const result = await response.json();
      
      if (result.success) {
        alert(`✅ ${exchange.charAt(0).toUpperCase() + exchange.slice(1)} connection test successful!\nBalance: $${result.balance}\nMargin: $${result.margin || '0.00'}`);
      } else {
        alert(`❌ Test failed: ${result.message}`);
      }
    } catch (error) {
      alert(`❌ Test error: ${error.message}`);
    } finally {
      setTestingConnection(false);
    }
  };

  const sections = [
    { id: 'profile', name: 'Profile', icon: '👤', desc: 'Personal information' },
    { id: 'trading', name: 'Trading', icon: '📊', desc: 'Trading preferences' },
    { id: 'exchanges', name: 'Exchanges', icon: '🔗', desc: 'API configurations' },
    { id: 'assets', name: 'Assets', icon: '💰', desc: 'Portfolio allocation' },
    { id: 'security', name: 'Security', icon: '🔒', desc: 'Account security' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', desc: 'Alert settings' },
    { id: 'subscription', name: 'Subscription', icon: '💳', desc: 'Billing & plans' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️', desc: 'Advanced options' }
  ];

  const exchanges = [
    { id: 'bybit', name: 'Bybit', connected: apiCredentials.bybit.connected, leverage: '25x • Mainnet' },
    { id: 'binance', name: 'Binance', connected: apiCredentials.binance.connected, leverage: '20x • Testnet' },
    { id: 'bitget', name: 'Bitget', connected: apiCredentials.bitget.connected, leverage: '20x • Testnet' }
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'profile':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <button
                onClick={() => setEditMode(!editMode)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                {editMode ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({...profile, name: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  value={profile.email}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Timezone</label>
                <select
                  value={profile.timezone}
                  onChange={(e) => setProfile({...profile, timezone: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option>UTC+3 (Kenya)</option>
                  <option>UTC+0 (London)</option>
                  <option>UTC+1 (Paris)</option>
                  <option>UTC-5 (New York)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                <select
                  value={profile.language}
                  onChange={(e) => setProfile({...profile, language: e.target.value})}
                  disabled={!editMode}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-gray-50"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 'exchanges':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Exchange API Configuration</h3>
              <span className="text-sm text-gray-500">Connect your trading accounts</span>
            </div>
            
            <div className="space-y-4">
              {exchanges.map((exchange) => (
                <div key={exchange.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold">{exchange.name[0]}</span>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">{exchange.name}</h4>
                      <p className="text-sm text-gray-500">
                        <span className={exchange.connected ? 'text-green-600' : 'text-red-600'}>
                          {exchange.connected ? 'connected' : 'disconnected'}
                        </span>
                        <span className="ml-2">{exchange.leverage}</span>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    {exchange.connected && (
                      <button
                        onClick={() => handleTestConnection(exchange.id)}
                        disabled={testingConnection}
                        className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50"
                      >
                        {testingConnection ? 'Testing...' : 'Test'}
                      </button>
                    )}
                    <button
                      onClick={() => handleConfigureExchange(exchange.id)}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Configure
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-start space-x-3">
                <span className="text-yellow-600">⚠️</span>
                <div>
                  <h4 className="font-medium text-yellow-800">Security Notice</h4>
                  <p className="text-sm text-yellow-700 mt-1">
                    API keys are encrypted and stored securely. Only trading permissions are required. 
                    Never share your API keys or enable withdrawal permissions.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'trading':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Trading Preferences</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Strategy Selection</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-3 border-2 border-blue-200 rounded-lg bg-blue-50">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-blue-900">🛡️ Steady Climb</span>
                      <input type="radio" name="strategy" defaultChecked className="text-blue-600" />
                    </div>
                    <p className="text-sm text-blue-700">Conservative approach • Lower risk</p>
                  </div>
                  
                  <div className="p-3 border-2 border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">🚀 Power Surge</span>
                      <input type="radio" name="strategy" className="text-blue-600" />
                    </div>
                    <p className="text-sm text-gray-700">Aggressive approach • Higher returns</p>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Risk Management 🔒</h4>
                <p className="text-sm text-gray-600 mb-4">All parameters are professionally optimized and locked</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Capital Base</label>
                    <input
                      type="text"
                      value="0.1% of balance"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <span className="text-xs text-gray-500">🔒 Optimized</span>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Leverage</label>
                    <input
                      type="text"
                      value="25x futures"
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50"
                    />
                    <span className="text-xs text-gray-500">🔒 Battle-tested</span>
                  </div>
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-3">Trading Schedule</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">24/7 Trading</span>
                    <input type="checkbox" defaultChecked className="text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Weekend Trading</span>
                    <input type="checkbox" defaultChecked className="text-blue-600" />
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-700">Auto-restart after stops</span>
                    <input type="checkbox" className="text-blue-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">Security Settings</h3>
            
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Two-Factor Authentication</h4>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                  <input type="checkbox" className="text-blue-600" />
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Login Alerts</h4>
                    <p className="text-sm text-gray-600">Get notified of new logins</p>
                  </div>
                  <input type="checkbox" defaultChecked className="text-blue-600" />
                </div>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-900">Trading Confirmations</h4>
                    <p className="text-sm text-gray-600">Confirm before placing large trades</p>
                  </div>
                  <input type="checkbox" defaultChecked className="text-blue-600" />
                </div>
              </div>

              <button
                onClick={() => setShowPasswordModal(true)}
                className="w-full px-4 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                Change Password
              </button>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-8">
            <p className="text-gray-500">Section under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="flex">
            {/* Sidebar */}
            <div className="w-64 bg-gray-50 border-r border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">⚙️ Settings</h2>
                <nav className="space-y-2">
                  {sections.map((section) => (
                    <button
                      key={section.id}
                      onClick={() => setActiveSection(section.id)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                        activeSection === section.id
                          ? 'bg-blue-100 text-blue-700 border border-blue-200'
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span>{section.icon}</span>
                        <div>
                          <div className="font-medium">{section.name}</div>
                          <div className="text-xs text-gray-500">{section.desc}</div>
                        </div>
                      </div>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>

      {/* API Configuration Modal */}
      {showApiModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Configure {selectedExchange?.charAt(0).toUpperCase() + selectedExchange?.slice(1)} API
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                <input
                  type="text"
                  value={apiCredentials[selectedExchange]?.apiKey || ''}
                  onChange={(e) => setApiCredentials(prev => ({
                    ...prev,
                    [selectedExchange]: {
                      ...prev[selectedExchange],
                      apiKey: e.target.value
                    }
                  }))}
                  placeholder="Enter your API key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Secret Key</label>
                <input
                  type="password"
                  value={apiCredentials[selectedExchange]?.secret || ''}
                  onChange={(e) => setApiCredentials(prev => ({
                    ...prev,
                    [selectedExchange]: {
                      ...prev[selectedExchange],
                      secret: e.target.value
                    }
                  }))}
                  placeholder="Enter your secret key"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  ⚠️ Only enable <strong>Contract Trading</strong> and <strong>Read</strong> permissions. 
                  Never enable withdrawal permissions.
                </p>
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowApiModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleApiSubmit}
                disabled={testingConnection || !apiCredentials[selectedExchange]?.apiKey || !apiCredentials[selectedExchange]?.secret}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {testingConnection ? 'Testing...' : 'Connect & Test'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPasswordModal(false)}
                className="flex-1 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                Update Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default SettingsPage;