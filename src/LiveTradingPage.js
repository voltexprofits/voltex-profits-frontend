
import React, { useState, useEffect } from 'react';

function LiveTradingPage({ user }) {
  const [isTrading, setIsTrading] = useState(false);
  const [selectedPair, setSelectedPair] = useState('HYPE/USDT');
  const [selectedStrategy, setSelectedStrategy] = useState('steady_climb');
  const [isLoading, setIsLoading] = useState(false);
  const [marketData, setMarketData] = useState({
    'HYPE/USDT': { price: 12.45, change: 8.75, volume: '45M' },
    'BTC/USDT': { price: 43250.75, change: 2.45, volume: '1.2B' },
    'ETH/USDT': { price: 2650.30, change: -1.20, volume: '890M' },
    'BNB/USDT': { price: 315.85, change: 0.75, volume: '245M' },
    'SOL/USDT': { price: 98.42, change: 4.20, volume: '320M' },
    'XRP/USDT': { price: 0.625, change: -2.10, volume: '180M' },
    'ADA/USDT': { price: 0.485, change: 3.20, volume: '156M' },
    'DOT/USDT': { price: 7.85, change: 1.85, volume: '95M' }
  });
  
  const [positions, setPositions] = useState([
    { id: 1, pair: 'HYPE/USDT', side: 'LONG', size: 125.5, entry: 11.80, current: 12.45, pnl: 81.58, level: 1 },
    { id: 2, pair: 'BTC/USDT', side: 'LONG', size: 0.0125, entry: 42850.00, current: 43250.75, pnl: 5.01, level: 1 },
    { id: 3, pair: 'ETH/USDT', side: 'LONG', size: 0.85, entry: 2620.50, current: 2650.30, pnl: 25.33, level: 2 },
    { id: 4, pair: 'SOL/USDT', side: 'SHORT', size: 8.2, entry: 102.15, current: 98.42, pnl: 30.58, level: 1 }
  ]);

  const [tradingSettings, setTradingSettings] = useState({
    riskPerTrade: 0.2,
    maxPositions: 5,
    leverage: 25,
    stopLoss: 2.0,
    takeProfit: 1.5
  });

  const cryptoPairs = [
    'HYPE/USDT', 'BTC/USDT', 'ETH/USDT', 'BNB/USDT', 
    'SOL/USDT', 'XRP/USDT', 'ADA/USDT', 'DOT/USDT',
    'AVAX/USDT', 'LINK/USDT', 'MATIC/USDT', 'UNI/USDT',
    'ATOM/USDT', 'NEAR/USDT', 'FTM/USDT', 'ALGO/USDT',
    'VET/USDT', 'SAND/USDT', 'MANA/USDT', 'LTC/USDT'
  ];
  
  const strategies = [
    { 
      value: 'steady_climb', 
      name: 'Steady Climb', 
      description: 'Conservative martingale with 1.5x multiplier',
      riskLevel: 'Low',
      expectedReturn: '8-15%/month'
    },
    { 
      value: 'power_surge', 
      name: 'Power Surge', 
      description: 'Aggressive martingale with 2.2x multiplier',
      riskLevel: 'High',
      expectedReturn: '20-35%/month'
    }
  ];

  // Simulate real-time price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setMarketData(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(pair => {
          const changePercent = (Math.random() - 0.5) * 0.002; // ±0.1% change
          updated[pair].price *= (1 + changePercent);
          updated[pair].change += changePercent * 100;
        });
        return updated;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const handleTradingToggle = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'https://voltex-profits-backend.onrender.com';
      
      const response = await fetch(`${API_BASE_URL}/api/trading/toggle`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          isActive: !isTrading,
          strategy: selectedStrategy,
          tradingPair: selectedPair,
          settings: tradingSettings
        })
      });

      if (response.ok) {
        setIsTrading(!isTrading);
      } else {
        alert('Failed to update trading status');
      }
    } catch (error) {
      console.error('Trading toggle error:', error);
      // For demo purposes, still toggle the state
      setIsTrading(!isTrading);
    } finally {
      setIsLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'grid',
      gap: '1.5rem',
      gridTemplateColumns: '1fr',
      maxWidth: '1400px'
    },
    topRow: {
      display: 'grid',
      gridTemplateColumns: '2fr 1fr',
      gap: '1.5rem'
    },
    card: {
      backgroundColor: 'white',
      padding: '1.5rem',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
    },
    cardTitle: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1rem',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    },
    tradingControls: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '1.5rem',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1rem'
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
    input: {
      width: '100%',
      padding: '0.5rem 0.75rem',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '0.875rem'
    },
    statusCard: {
      backgroundColor: isTrading ? '#dcfce7' : '#fee2e2',
      border: `1px solid ${isTrading ? '#86efac' : '#fca5a5'}`,
      borderRadius: '8px',
      padding: '1rem',
      textAlign: 'center'
    },
    statusIcon: {
      fontSize: '2rem',
      marginBottom: '0.5rem'
    },
    statusText: {
      fontSize: '1.125rem',
      fontWeight: '600',
      color: isTrading ? '#166534' : '#991b1b',
      marginBottom: '0.5rem'
    },
    statusDescription: {
      fontSize: '0.875rem',
      color: isTrading ? '#065f46' : '#7f1d1d',
      marginBottom: '1rem'
    },
    toggleButton: {
      width: '100%',
      padding: '0.75rem 1.5rem',
      backgroundColor: isTrading ? '#ef4444' : '#22c55e',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      fontSize: '0.875rem',
      fontWeight: '600',
      cursor: isLoading ? 'not-allowed' : 'pointer',
      opacity: isLoading ? 0.5 : 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '0.5rem'
    },
    marketGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem'
    },
    marketCard: {
      backgroundColor: '#f8fafc',
      padding: '1rem',
      borderRadius: '8px',
      border: '1px solid #e2e8f0',
      textAlign: 'center'
    },
    marketPair: {
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.25rem'
    },
    marketPrice: {
      fontSize: '1rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.25rem'
    },
    marketChange: {
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    marketVolume: {
      fontSize: '0.75rem',
      color: '#64748b',
      marginTop: '0.25rem'
    },
    positionsTable: {
      width: '100%',
      borderCollapse: 'collapse'
    },
    tableHeader: {
      backgroundColor: '#f8fafc',
      padding: '0.75rem',
      textAlign: 'left',
      fontSize: '0.875rem',
      fontWeight: '500',
      color: '#64748b',
      borderBottom: '1px solid #e2e8f0'
    },
    tableCell: {
      padding: '0.75rem',
      fontSize: '0.875rem',
      borderBottom: '1px solid #f1f5f9'
    },
    sideTag: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    longTag: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    shortTag: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    pnlPositive: {
      color: '#059669',
      fontWeight: '600'
    },
    pnlNegative: {
      color: '#dc2626',
      fontWeight: '600'
    },
    strategyCard: {
      backgroundColor: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '1rem',
      marginBottom: '1rem'
    },
    strategyName: {
      fontSize: '1rem',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '0.5rem'
    },
    strategyDescription: {
      fontSize: '0.875rem',
      color: '#64748b',
      marginBottom: '0.5rem'
    },
    strategyMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '0.75rem'
    },
    riskBadge: {
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: '500'
    },
    lowRisk: {
      backgroundColor: '#dcfce7',
      color: '#166534'
    },
    highRisk: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    settingsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
      gap: '1rem'
    },
    spinner: {
      width: '16px',
      height: '16px',
      border: '2px solid #ffffff40',
      borderTop: '2px solid #ffffff',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }
  };

  const selectedStrategyData = strategies.find(s => s.value === selectedStrategy);

  return (
    <div style={styles.container}>
      {/* Top Row - Trading Controls & Status */}
      <div style={styles.topRow}>
        {/* Trading Controls */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            🎯 Trading Configuration
          </h3>
          
          <div style={styles.tradingControls}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Trading Pair</label>
              <select 
                style={styles.select}
                value={selectedPair}
                onChange={(e) => setSelectedPair(e.target.value)}
              >
                {cryptoPairs.map(pair => (
                  <option key={pair} value={pair}>{pair}</option>
                ))}
              </select>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Strategy</label>
              <select 
                style={styles.select}
                value={selectedStrategy}
                onChange={(e) => setSelectedStrategy(e.target.value)}
              >
                {strategies.map(strategy => (
                  <option key={strategy.value} value={strategy.value}>
                    {strategy.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Strategy Details */}
          {selectedStrategyData && (
            <div style={styles.strategyCard}>
              <div style={styles.strategyName}>{selectedStrategyData.name}</div>
              <div style={styles.strategyDescription}>{selectedStrategyData.description}</div>
              <div style={styles.strategyMeta}>
                <span style={{
                  ...styles.riskBadge,
                  ...(selectedStrategyData.riskLevel === 'Low' ? styles.lowRisk : styles.highRisk)
                }}>
                  {selectedStrategyData.riskLevel} Risk
                </span>
                <span style={{ color: '#059669', fontWeight: '500' }}>
                  {selectedStrategyData.expectedReturn}
                </span>
              </div>
            </div>
          )}

          {/* Risk Settings */}
          <div style={styles.settingsGrid}>
            <div>
              <label style={styles.label}>Risk Per Trade (%)</label>
              <input 
                type="number" 
                style={styles.input}
                value={tradingSettings.riskPerTrade}
                onChange={(e) => setTradingSettings(prev => ({
                  ...prev, 
                  riskPerTrade: parseFloat(e.target.value)
                }))}
                step="0.1"
                min="0.1"
                max="5"
              />
            </div>
            <div>
              <label style={styles.label}>Leverage</label>
              <input 
                type="number" 
                style={styles.input}
                value={tradingSettings.leverage}
                onChange={(e) => setTradingSettings(prev => ({
                  ...prev, 
                  leverage: parseInt(e.target.value)
                }))}
                min="1"
                max="50"
              />
            </div>
            <div>
              <label style={styles.label}>Max Positions</label>
              <input 
                type="number" 
                style={styles.input}
                value={tradingSettings.maxPositions}
                onChange={(e) => setTradingSettings(prev => ({
                  ...prev, 
                  maxPositions: parseInt(e.target.value)
                }))}
                min="1"
                max="10"
              />
            </div>
          </div>
        </div>

        {/* Trading Status */}
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>
            ⚡ Trading Status
          </h3>
          
          <div style={styles.statusCard}>
            <div style={styles.statusIcon}>
              {isTrading ? '🟢' : '🔴'}
            </div>
            <div style={styles.statusText}>
              {isTrading ? 'Trading Active' : 'Trading Stopped'}
            </div>
            <div style={styles.statusDescription}>
              {isTrading 
                ? `Running ${selectedStrategyData?.name} on ${selectedPair}`
                : 'Click start to begin automated trading'
              }
            </div>
            
            <button 
              style={styles.toggleButton}
              onClick={handleTradingToggle}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div style={styles.spinner}></div>
                  Updating...
                </>
              ) : (
                <>
                  {isTrading ? '⏸️ Stop Trading' : '▶️ Start Trading'}
                </>
              )}
            </button>
          </div>

          {/* Trading Stats */}
          <div style={{ marginTop: '1rem', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <div style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem' }}>
              <strong>Current Session:</strong>
            </div>
            <div style={{ fontSize: '0.875rem', color: '#1e293b' }}>
              • Active Positions: {positions.length}<br/>
              • Total P&L: <span style={styles.pnlPositive}>+$35.28</span><br/>
              • Win Rate: 73.5%<br/>
              • Exchange: {user?.trading?.exchange || 'Bybit'}
            </div>
          </div>
        </div>
      </div>

      {/* Market Data */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          📊 Live Market Data
        </h3>
        <div style={styles.marketGrid}>
          {Object.entries(marketData).map(([pair, data]) => (
            <div key={pair} style={styles.marketCard}>
              <div style={styles.marketPair}>{pair}</div>
              <div style={styles.marketPrice}>${data.price.toFixed(2)}</div>
              <div style={{
                ...styles.marketChange,
                color: data.change >= 0 ? '#059669' : '#dc2626'
              }}>
                {data.change >= 0 ? '+' : ''}{data.change.toFixed(2)}%
              </div>
              <div style={styles.marketVolume}>Vol: {data.volume}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Positions */}
      <div style={styles.card}>
        <h3 style={styles.cardTitle}>
          📈 Active Positions
        </h3>
        {positions.length > 0 ? (
          <div style={{ overflowX: 'auto' }}>
            <table style={styles.positionsTable}>
              <thead>
                <tr>
                  <th style={styles.tableHeader}>Pair</th>
                  <th style={styles.tableHeader}>Side</th>
                  <th style={styles.tableHeader}>Size</th>
                  <th style={styles.tableHeader}>Entry Price</th>
                  <th style={styles.tableHeader}>Current Price</th>
                  <th style={styles.tableHeader}>P&L</th>
                  <th style={styles.tableHeader}>Level</th>
                </tr>
              </thead>
              <tbody>
                {positions.map(position => (
                  <tr key={position.id}>
                    <td style={styles.tableCell}>{position.pair}</td>
                    <td style={styles.tableCell}>
                      <span style={{
                        ...styles.sideTag,
                        ...(position.side === 'LONG' ? styles.longTag : styles.shortTag)
                      }}>
                        {position.side}
                      </span>
                    </td>
                    <td style={styles.tableCell}>{position.size}</td>
                    <td style={styles.tableCell}>${position.entry.toFixed(2)}</td>
                    <td style={styles.tableCell}>${position.current.toFixed(2)}</td>
                    <td style={{
                      ...styles.tableCell,
                      ...(position.pnl >= 0 ? styles.pnlPositive : styles.pnlNegative)
                    }}>
                      ${position.pnl >= 0 ? '+' : ''}{position.pnl.toFixed(2)}
                    </td>
                    <td style={styles.tableCell}>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        backgroundColor: '#dbeafe', 
                        color: '#1e40af',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        L{position.level}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📊</div>
            <div>No active positions</div>
            <div style={{ fontSize: '0.875rem', marginTop: '0.25rem' }}>
              Start trading to see your positions here
            </div>
          </div>
        )}
      </div>

      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  );
}

export default LiveTradingPage;