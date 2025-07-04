
import React, { useState, useEffect } from 'react';
import { dashboardAPI, tradingAPI, userAPI } from './services/api';

function ConnectedApp({ user, onLogout }) {
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState('BTC/USDT');
  const [selectedStrategy, setSelectedStrategy] = useState('steady_climb');
  const [dashboardData, setDashboardData] = useState(null);
  const [recentTrades, setRecentTrades] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState(null);

  const cryptoPairs = [
    'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 'ADA/USDT', 
    'SOL/USDT', 'XRP/USDT', 'DOT/USDT', 'AVAX/USDT'
  ];

  const strategies = [
    { value: 'steady_climb', name: 'Steady Climb - Conservative' },
    { value: 'power_surge', name: 'Power Surge - Aggressive' }
  ];

  // Load dashboard data when component mounts
  useEffect(() => {
    loadDashboardData();
    
    // Set up automatic refresh every 30 seconds
    const interval = setInterval(loadDashboardData, 30000);
    
    return () => clearInterval(interval);
  }, []);

  // Update initial values from user data
  useEffect(() => {
    if (user?.trading) {
      setSelectedPair(user.trading.tradingPair || 'BTC/USDT');
      setSelectedStrategy(user.trading.strategy || 'steady_climb');
      setIsTrading(user.trading.isActive || false);
    }
  }, [user]);

  const loadDashboardData = async () => {
    try {
      const [statsData, tradesData] = await Promise.all([
        dashboardAPI.getStats(),
        dashboardAPI.getTrades(1, 5) // Get latest 5 trades
      ]);
      
      setDashboardData(statsData.user);
      setRecentTrades(tradesData.trades || []);
      setError(null);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
      setError('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTradingToggle = async () => {
    if (isUpdating) return;
    
    setIsUpdating(true);
    try {
      const newTradingState = !isTrading;
      
      // Update trading settings on backend
      await dashboardAPI.updateTradingSettings({
        tradingPair: selectedPair,
        strategy: selectedStrategy,
        isActive: newTradingState
      });
      
      setIsTrading(newTradingState);
      
      // Refresh dashboard data
      await loadDashboardData();
      
    } catch (err) {
      console.error('Error toggling trading:', err);
      setError('Failed to update trading status');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSettingsChange = async (field, value) => {
    try {
      if (field === 'tradingPair') {
        setSelectedPair(value);
      } else if (field === 'strategy') {
        setSelectedStrategy(value);
      }
      
      // Update backend if trading is active
      if (isTrading) {
        await dashboardAPI.updateTradingSettings({
          tradingPair: field === 'tradingPair' ? value : selectedPair,
          strategy: field === 'strategy' ? value : selectedStrategy,
          isActive: isTrading
        });
        
        // Refresh data
        await loadDashboardData();
      }
    } catch (err) {
      console.error('Error updating settings:', err);
      setError('Failed to update settings');
    }
  };

  const refreshData = async () => {
    setIsLoading(true);
    await loadDashboardData();
  };

  const styles = {
    container: {
      minHeight: '100vh',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, sans-serif'
    },
    nav: {
      backgroundColor: 'white',
      borderBottom: '1px solid #e5e7eb',
      padding: '1rem 2rem',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
    },
    navContent: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      maxWidth: '1200px',
      margin: '0 auto'
    },
    logo: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    logoIcon: {
      width: '32px',
      height: '32px',
      background: 'linear-gradient(45deg, #3b82f6, #8b5cf6)',
      borderRadius: '8px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontWeight: 'bold'
    },
    logoText: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    userSection: {
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    statusIndicator: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '500',
      backgroundColor: isTrading ? '#dcfce7' : '#fee2e2',
      color: isTrading ? '#166534' : '#991b1b'
    },
    statusDot: {
      width: '8px',
      height: '8px',
      borderRadius: '50%',
      backgroundColor: isTrading ? '#22c55e' : '#ef4444'
    },
    username: {
      color: '#6b7280',
      fontSize: '0.875rem'
    },
    logoutButton: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.75rem',
      cursor: 'pointer',
      fontWeight: '500',
      transition: 'background-color 0.2s'
    },
    main: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '2rem'
    },
    loadingOverlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    loadingSpinner: {
      width: '32px',
      height: '32px',
      border: '3px solid #e5e7eb',
      borderTop: '3px solid #3b82f6',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    },
    errorBanner: {
      backgroundColor: '#fee2e2',
      border: '1px solid #fca5a5',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem',
      color: '#991b1b'
    },
    header: {
      marginBottom: '2rem'
    },
    title: {
      fontSize: '2rem',
      fontWeight: 'bold',
      color: '#111827',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#6b7280',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    },
    refreshButton: {
      padding: '0.25rem 0.5rem',
      backgroundColor: '#3b82f6',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      fontSize: '0.75rem',
      cursor: 'pointer'
    },
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '1.5rem',
      marginBottom: '2rem'
    },
    statCard: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6'
    },
    statHeader: {
      fontSize: '0.875rem',
      color: '#6b7280',
      marginBottom: '0.5rem',
      fontWeight: '500'
    },
    statValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#111827'
    },
    profitValue: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#16a34a'
    },
    tradingPanel: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6',
      marginBottom: '2rem'
    },
    panelTitle: {
      fontSize: '1.25rem',
      fontWeight: '600',
      color: '#111827',
      marginBottom: '1.5rem'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '0.5rem'
    },
    select: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      backgroundColor: 'white',
      fontSize: '0.875rem'
    },
    statusPanel: {
      backgroundColor: '#f9fafb',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e5e7eb'
    },
    statusRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    button: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.5rem 1rem',
      borderRadius: '8px',
      border: 'none',
      fontWeight: '500',
      cursor: 'pointer',
      fontSize: '0.875rem',
      backgroundColor: isTrading ? '#ef4444' : '#22c55e',
      color: 'white',
      disabled: isUpdating
    },
    tradingInfo: {
      marginTop: '0.75rem',
      fontSize: '0.875rem',
      color: '#6b7280'
    },
    welcomeCard: {
      backgroundColor: '#dbeafe',
      border: '1px solid #93c5fd',
      borderRadius: '12px',
      padding: '1rem',
      marginBottom: '2rem'
    },
    welcomeText: {
      color: '#1e40af',
      fontSize: '0.875rem',
      fontWeight: '500'
    }
  };

  // Show loading spinner on initial load
  if (isLoading && !dashboardData) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingOverlay}>
          <div style={styles.loadingSpinner}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Navigation */}
      <nav style={styles.nav}>
        <div style={styles.navContent}>
          <div style={styles.logo}>
            <div style={styles.logoIcon}>V</div>
            <span style={styles.logoText}>Voltex Profits</span>
          </div>
          <div style={styles.userSection}>
            <div style={styles.statusIndicator}>
              <div style={styles.statusDot}></div>
              {isTrading ? 'Trading Active' : 'Trading Stopped'}
            </div>
            <span style={styles.username}>
              {user?.username || 'Demo User'}
            </span>
            <button 
              onClick={onLogout}
              style={styles.logoutButton}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dc2626'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#ef4444'}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.main}>
        {/* Error Banner */}
        {error && (
          <div style={styles.errorBanner}>
            {error}
          </div>
        )}

        {/* Welcome Message */}
        {user && (
          <div style={styles.welcomeCard}>
            <p style={styles.welcomeText}>
              🎉 Welcome to Voltex Profits, {user.username}! Your account is connected to {user.trading?.exchange || 'your exchange'} and ready for automated trading.
            </p>
          </div>
        )}

        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Live Trading Dashboard</h1>
          <div style={styles.subtitle}>
            <span>Real-time data from your trading bot</span>
            <button onClick={refreshData} style={styles.refreshButton}>
              🔄 Refresh
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Account Balance</div>
            <div style={styles.statValue}>
              ${dashboardData?.trading?.accountBalance?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Total Profit</div>
            <div style={styles.profitValue}>
              ${dashboardData?.stats?.totalProfit?.toFixed(2) || '0.00'}
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Success Rate</div>
            <div style={styles.statValue}>
              {dashboardData?.stats?.successRate || '0'}%
            </div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statHeader}>Yield Wallet</div>
            <div style={{ ...styles.statValue, color: '#ea580c' }}>
              ${dashboardData?.yieldWallet?.balance?.toFixed(2) || '0.00'}
            </div>
          </div>
        </div>

        {/* Trading Controls */}
        <div style={styles.tradingPanel}>
          <h2 style={styles.panelTitle}>Live Trading Controls</h2>
          
          <div style={styles.formGrid}>
            <div>
              <label style={styles.label}>Trading Pair</label>
              <select 
                style={styles.select}
                value={selectedPair}
                onChange={(e) => handleSettingsChange('tradingPair', e.target.value)}
              >
                {cryptoPairs.map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={styles.label}>Strategy</label>
              <select 
                style={styles.select}
                value={selectedStrategy}
                onChange={(e) => handleSettingsChange('strategy', e.target.value)}
              >
                {strategies.map(strategy => (
                  <option key={strategy.value} value={strategy.value}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div style={styles.statusPanel}>
            <div style={styles.statusRow}>
              <div style={styles.statusIndicator}>
                <div style={styles.statusDot}></div>
                <span style={styles.statusText}>
                  Status: {isTrading ? 'Active Trading' : 'Stopped'}
                </span>
              </div>
              <button 
                style={{
                  ...styles.button,
                  opacity: isUpdating ? 0.5 : 1,
                  cursor: isUpdating ? 'not-allowed' : 'pointer'
                }}
                onClick={handleTradingToggle}
                disabled={isUpdating}
              >
                <span>{isUpdating ? '⏳' : (isTrading ? '⏸️' : '▶️')}</span>
                <span>
                  {isUpdating ? 'Updating...' : (isTrading ? 'Pause Trading' : 'Start Trading')}
                </span>
              </button>
            </div>
            
            {isTrading && (
              <div style={styles.tradingInfo}>
                <p>Current Martingale Level: <strong>{dashboardData?.stats?.currentMartingaleLevel || 0}</strong></p>
                <p>Total Trades: <strong>{dashboardData?.stats?.totalTrades || 0}</strong></p>
                <p>Selected Strategy: <strong>{selectedStrategy === 'steady_climb' ? 'Steady Climb (Conservative)' : 'Power Surge (Aggressive)'}</strong></p>
                <p>Exchange: <strong>{user?.trading?.exchange || 'Not set'}</strong></p>
                <p>Daily P&L: <strong style={{color: dashboardData?.stats?.dailyPnL > 0 ? '#16a34a' : '#ef4444'}}>
                  ${dashboardData?.stats?.dailyPnL || '0.00'}
                </strong></p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Trades */}
        {recentTrades.length > 0 && (
          <div style={styles.tradingPanel}>
            <h2 style={styles.panelTitle}>Recent Trades</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #e5e7eb' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>Pair</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>Side</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>Amount</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>P&L</th>
                    <th style={{ textAlign: 'left', padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTrades.map(trade => (
                    <tr key={trade.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{trade.symbol}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          backgroundColor: trade.side === 'buy' ? '#dcfce7' : '#fee2e2',
                          color: trade.side === 'buy' ? '#166534' : '#991b1b'
                        }}>
                          {trade.side.toUpperCase()}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem' }}>{trade.quantity}</td>
                      <td style={{ padding: '0.75rem' }}>
                        <span style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: parseFloat(trade.pnl) >= 0 ? '#16a34a' : '#ef4444'
                        }}>
                          ${parseFloat(trade.pnl) >= 0 ? '+' : ''}{trade.pnl}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem', fontSize: '0.875rem', color: '#6b7280' }}>
                        {new Date(trade.timestamp).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ConnectedApp;