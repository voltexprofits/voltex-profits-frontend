
import React, { useState, useEffect } from 'react';

function SettingsPage({ user }) {
  const [activeSection, setActiveSection] = useState('profile');
  const [profileData, setProfileData] = useState({
    username: user?.username || 'trader_pro',
    email: user?.email || 'trader@voltexprofits.com',
    firstName: 'John',
    lastName: 'Trader',
    phone: '+1 (555) 123-4567',
    timezone: 'UTC-5',
    country: 'United States',
    language: 'English',
    avatar: null
  });

  const [tradingSettings, setTradingSettings] = useState({
    defaultStrategy: 'steady_climb',
    riskLevel: 'medium',
    maxPositionSize: 500,
    stopLossPercent: 5,
    takeProfitPercent: 10,
    martingaleEnabled: true,
    maxMartingaleLevel: 3,
    autoTradingEnabled: true,
    tradingHours: {
      enabled: true,
      start: '08:00',
      end: '18:00',
      timezone: 'UTC'
    }
  });

  const [exchangeConfig, setExchangeConfig] = useState({
    bybit: {
      enabled: true,
      apiKey: 'bbt_••••••••••••••••••••••••••••••••',
      apiSecret: '••••••••••••••••••••••••••••••••••••••••',
      testnet: false,
      leverage: 25,
      status: 'connected'
    },
    binance: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
      testnet: true,
      leverage: 20,
      status: 'disconnected'
    },
    bitget: {
      enabled: false,
      apiKey: '',
      apiSecret: '',
      testnet: true,
      leverage: 20,
      status: 'disconnected'
    }
  });

  const [assetPreferences, setAssetPreferences] = useState({
    'BTC/USDT': { enabled: true, allocation: 25, priority: 1 },
    'ETH/USDT': { enabled: true, allocation: 20, priority: 2 },
    'HYPE/USDT': { enabled: true, allocation: 18, priority: 3 },
    'BNB/USDT': { enabled: true, allocation: 15, priority: 4 },
    'SOL/USDT': { enabled: true, allocation: 12, priority: 5 },
    'ADA/USDT': { enabled: false, allocation: 5, priority: 6 },
    'XRP/USDT': { enabled: false, allocation: 5, priority: 7 }
  });

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
    tradeConfirmations: true,
    passwordLastChanged: new Date('2024-06-15'),
    sessionTimeout: 60,
    ipWhitelist: [],
    apiRestrictions: true
  });

  const [notificationSettings, setNotificationSettings] = useState({
    tradeExecuted: true,
    profitTarget: true,
    stopLoss: true,
    marketAlerts: true,
    systemUpdates: true,
    weeklyReports: true,
    monthlyReports: true,
    emailDigest: 'daily',
    pushNotifications: true,
    soundAlerts: false
  });

  const [isEditing, setIsEditing] = useState(false);
  const [activeModal, setActiveModal] = useState(null);

  const sectionItems = [
    { id: 'profile', name: 'Profile', icon: '👤', description: 'Personal information' },
    { id: 'trading', name: 'Trading', icon: '📊', description: 'Trading preferences' },
    { id: 'exchanges', name: 'Exchanges', icon: '🔗', description: 'API configurations' },
    { id: 'assets', name: 'Assets', icon: '💰', description: 'Portfolio allocation' },
    { id: 'security', name: 'Security', icon: '🔒', description: 'Account security' },
    { id: 'notifications', name: 'Notifications', icon: '🔔', description: 'Alert settings' },
    { id: 'subscription', name: 'Subscription', icon: '💳', description: 'Billing & plans' },
    { id: 'advanced', name: 'Advanced', icon: '⚙️', description: 'Advanced options' }
  ];

  const handleSave = (section) => {
    // Simulate save operation
    setIsEditing(false);
    alert(`${section} settings saved successfully!`);
  };

  const handlePasswordChange = () => {
    setActiveModal('password');
  };

  const handleApiKeyTest = (exchange) => {
    alert(`Testing ${exchange} API connection... This would verify the API keys in a real implementation.`);
  };

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      display: 'flex',
      gap: '24px'
    },
    sidebar: {
      width: '280px',
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '20px',
      height: 'fit-content',
      position: 'sticky',
      top: '20px'
    },
    sidebarTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '20px'
    },
    sectionList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '4px'
    },
    sectionItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      padding: '12px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'all 0.2s',
      color: '#64748b'
    },
    sectionItemActive: {
      background: '#eff6ff',
      color: '#2563eb',
      borderLeft: '4px solid #2563eb'
    },
    sectionIcon: {
      fontSize: '18px',
      minWidth: '20px'
    },
    sectionText: {
      flex: 1
    },
    sectionName: {
      fontSize: '14px',
      fontWeight: '500',
      marginBottom: '2px'
    },
    sectionDescription: {
      fontSize: '12px',
      color: '#94a3b8'
    },
    content: {
      flex: 1,
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e2e8f0',
      padding: '24px'
    },
    contentHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '24px',
      paddingBottom: '16px',
      borderBottom: '1px solid #e2e8f0'
    },
    contentTitle: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1e293b'
    },
    editButton: {
      padding: '8px 16px',
      background: isEditing ? '#10b981' : '#667eea',
      color: 'white',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    formGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px'
    },
    label: {
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151'
    },
    input: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    inputDisabled: {
      background: '#f9fafb',
      color: '#6b7280'
    },
    select: {
      padding: '10px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '6px',
      fontSize: '14px',
      background: 'white'
    },
    toggleSwitch: {
      position: 'relative',
      display: 'inline-block',
      width: '48px',
      height: '24px'
    },
    toggleInput: {
      opacity: 0,
      width: 0,
      height: 0
    },
    toggleSlider: {
      position: 'absolute',
      cursor: 'pointer',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: '#cbd5e1',
      transition: '0.4s',
      borderRadius: '24px'
    },
    toggleSliderActive: {
      backgroundColor: '#10b981'
    },
    toggleSliderBefore: {
      position: 'absolute',
      content: '',
      height: '18px',
      width: '18px',
      left: '3px',
      bottom: '3px',
      backgroundColor: 'white',
      transition: '0.4s',
      borderRadius: '50%'
    },
    card: {
      background: '#f8fafc',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px',
      marginBottom: '16px'
    },
    cardTitle: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '12px'
    },
    exchangeCard: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      marginBottom: '12px'
    },
    exchangeInfo: {
      flex: 1
    },
    exchangeName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b',
      marginBottom: '4px'
    },
    exchangeStatus: {
      fontSize: '12px',
      padding: '2px 8px',
      borderRadius: '12px',
      fontWeight: '500'
    },
    statusConnected: {
      background: '#d1fae5',
      color: '#065f46'
    },
    statusDisconnected: {
      background: '#fee2e2',
      color: '#991b1b'
    },
    exchangeActions: {
      display: 'flex',
      gap: '8px'
    },
    actionButton: {
      padding: '6px 12px',
      border: '1px solid #d1d5db',
      borderRadius: '4px',
      background: 'white',
      cursor: 'pointer',
      fontSize: '12px'
    },
    assetGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
      gap: '16px'
    },
    assetCard: {
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      padding: '16px'
    },
    assetHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '12px'
    },
    assetName: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#1e293b'
    },
    rangeInput: {
      width: '100%',
      margin: '8px 0'
    },
    allocationValue: {
      fontSize: '14px',
      color: '#64748b',
      textAlign: 'center'
    },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: 'white',
      borderRadius: '12px',
      padding: '24px',
      maxWidth: '400px',
      width: '90%'
    },
    modalTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '16px'
    },
    modalActions: {
      display: 'flex',
      gap: '12px',
      justifyContent: 'flex-end',
      marginTop: '20px'
    },
    button: {
      padding: '8px 16px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '14px',
      fontWeight: '500',
      cursor: 'pointer'
    },
    buttonPrimary: {
      background: '#667eea',
      color: 'white'
    },
    buttonSecondary: {
      background: '#f1f5f9',
      color: '#64748b'
    }
  };

  const renderProfileSection = () => (
    <div>
      <div style={styles.formGrid}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Username</label>
          <input
            style={{ ...styles.input, ...(isEditing ? {} : styles.inputDisabled) }}
            type="text"
            value={profileData.username}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Email Address</label>
          <input
            style={{ ...styles.input, ...(isEditing ? {} : styles.inputDisabled) }}
            type="email"
            value={profileData.email}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>First Name</label>
          <input
            style={{ ...styles.input, ...(isEditing ? {} : styles.inputDisabled) }}
            type="text"
            value={profileData.firstName}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, firstName: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Last Name</label>
          <input
            style={{ ...styles.input, ...(isEditing ? {} : styles.inputDisabled) }}
            type="text"
            value={profileData.lastName}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, lastName: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            style={{ ...styles.input, ...(isEditing ? {} : styles.inputDisabled) }}
            type="tel"
            value={profileData.phone}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
          />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Timezone</label>
          <select
            style={{ ...styles.select, ...(isEditing ? {} : styles.inputDisabled) }}
            value={profileData.timezone}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, timezone: e.target.value })}
          >
            <option value="UTC-8">UTC-8 (Pacific)</option>
            <option value="UTC-5">UTC-5 (Eastern)</option>
            <option value="UTC+0">UTC+0 (London)</option>
            <option value="UTC+1">UTC+1 (Berlin)</option>
            <option value="UTC+8">UTC+8 (Singapore)</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Country</label>
          <select
            style={{ ...styles.select, ...(isEditing ? {} : styles.inputDisabled) }}
            value={profileData.country}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, country: e.target.value })}
          >
            <option value="United States">United States</option>
            <option value="Canada">Canada</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="Germany">Germany</option>
            <option value="Singapore">Singapore</option>
          </select>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Language</label>
          <select
            style={{ ...styles.select, ...(isEditing ? {} : styles.inputDisabled) }}
            value={profileData.language}
            disabled={!isEditing}
            onChange={(e) => setProfileData({ ...profileData, language: e.target.value })}
          >
            <option value="English">English</option>
            <option value="Spanish">Spanish</option>
            <option value="French">French</option>
            <option value="German">German</option>
            <option value="Chinese">Chinese</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderTradingSection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🎯 Strategy Preferences</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Default Strategy</label>
            <select
              style={styles.select}
              value={tradingSettings.defaultStrategy}
              onChange={(e) => setTradingSettings({ ...tradingSettings, defaultStrategy: e.target.value })}
            >
              <option value="steady_climb">📊 Steady Climb</option>
              <option value="power_surge">🚀 Power Surge</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Risk Level</label>
            <select
              style={styles.select}
              value={tradingSettings.riskLevel}
              onChange={(e) => setTradingSettings({ ...tradingSettings, riskLevel: e.target.value })}
            >
              <option value="low">🟢 Low Risk</option>
              <option value="medium">🟡 Medium Risk</option>
              <option value="high">🔴 High Risk</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Position Size ($)</label>
            <input
              style={styles.input}
              type="number"
              value={tradingSettings.maxPositionSize}
              onChange={(e) => setTradingSettings({ ...tradingSettings, maxPositionSize: parseInt(e.target.value) })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Stop Loss (%)</label>
            <input
              style={styles.input}
              type="number"
              step="0.1"
              value={tradingSettings.stopLossPercent}
              onChange={(e) => setTradingSettings({ ...tradingSettings, stopLossPercent: parseFloat(e.target.value) })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Take Profit (%)</label>
            <input
              style={styles.input}
              type="number"
              step="0.1"
              value={tradingSettings.takeProfitPercent}
              onChange={(e) => setTradingSettings({ ...tradingSettings, takeProfitPercent: parseFloat(e.target.value) })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Max Martingale Level</label>
            <select
              style={styles.select}
              value={tradingSettings.maxMartingaleLevel}
              onChange={(e) => setTradingSettings({ ...tradingSettings, maxMartingaleLevel: parseInt(e.target.value) })}
            >
              <option value={1}>Level 1</option>
              <option value={2}>Level 2</option>
              <option value={3}>Level 3</option>
              <option value={4}>Level 4</option>
              <option value={5}>Level 5</option>
            </select>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>⏰ Trading Schedule</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={tradingSettings.tradingHours.enabled}
                onChange={(e) => setTradingSettings({
                  ...tradingSettings,
                  tradingHours: { ...tradingSettings.tradingHours, enabled: e.target.checked }
                })}
                style={{ marginRight: '8px' }}
              />
              Enable Trading Hours
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Start Time</label>
            <input
              style={styles.input}
              type="time"
              value={tradingSettings.tradingHours.start}
              disabled={!tradingSettings.tradingHours.enabled}
              onChange={(e) => setTradingSettings({
                ...tradingSettings,
                tradingHours: { ...tradingSettings.tradingHours, start: e.target.value }
              })}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>End Time</label>
            <input
              style={styles.input}
              type="time"
              value={tradingSettings.tradingHours.end}
              disabled={!tradingSettings.tradingHours.enabled}
              onChange={(e) => setTradingSettings({
                ...tradingSettings,
                tradingHours: { ...tradingSettings.tradingHours, end: e.target.value }
              })}
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderExchangesSection = () => (
    <div>
      {Object.entries(exchangeConfig).map(([exchange, config]) => (
        <div key={exchange} style={styles.exchangeCard}>
          <div style={styles.exchangeInfo}>
            <div style={styles.exchangeName}>
              {exchange.charAt(0).toUpperCase() + exchange.slice(1)}
            </div>
            <div>
              <span style={{
                ...styles.exchangeStatus,
                ...(config.status === 'connected' ? styles.statusConnected : styles.statusDisconnected)
              }}>
                {config.status}
              </span>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Leverage: {config.leverage}x • {config.testnet ? 'Testnet' : 'Mainnet'}
            </div>
          </div>

          <div style={styles.exchangeActions}>
            <button
              style={styles.actionButton}
              onClick={() => handleApiKeyTest(exchange)}
            >
              Test
            </button>
            <button
              style={styles.actionButton}
              onClick={() => setActiveModal(`${exchange}_config`)}
            >
              Configure
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderAssetsSection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>💰 Portfolio Allocation</div>
        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '20px' }}>
          Adjust the allocation percentage for each trading pair. Total should equal 100%.
        </p>

        <div style={styles.assetGrid}>
          {Object.entries(assetPreferences).map(([asset, config]) => (
            <div key={asset} style={styles.assetCard}>
              <div style={styles.assetHeader}>
                <div style={styles.assetName}>{asset}</div>
                <label style={styles.toggleSwitch}>
                  <input
                    style={styles.toggleInput}
                    type="checkbox"
                    checked={config.enabled}
                    onChange={(e) => setAssetPreferences({
                      ...assetPreferences,
                      [asset]: { ...config, enabled: e.target.checked }
                    })}
                  />
                  <span style={{
                    ...styles.toggleSlider,
                    ...(config.enabled ? styles.toggleSliderActive : {})
                  }}>
                    <span style={{
                      ...styles.toggleSliderBefore,
                      transform: config.enabled ? 'translateX(24px)' : 'translateX(0)'
                    }} />
                  </span>
                </label>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Allocation: {config.allocation}%</label>
                <input
                  style={styles.rangeInput}
                  type="range"
                  min="0"
                  max="50"
                  value={config.allocation}
                  disabled={!config.enabled}
                  onChange={(e) => setAssetPreferences({
                    ...assetPreferences,
                    [asset]: { ...config, allocation: parseInt(e.target.value) }
                  })}
                />
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Priority</label>
                <select
                  style={styles.select}
                  value={config.priority}
                  disabled={!config.enabled}
                  onChange={(e) => setAssetPreferences({
                    ...assetPreferences,
                    [asset]: { ...config, priority: parseInt(e.target.value) }
                  })}
                >
                  {[1, 2, 3, 4, 5, 6, 7].map(num => (
                    <option key={num} value={num}>Priority {num}</option>
                  ))}
                </select>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSecuritySection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🔒 Authentication & Security</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Two-Factor Authentication</label>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <label style={styles.toggleSwitch}>
                <input
                  style={styles.toggleInput}
                  type="checkbox"
                  checked={securitySettings.twoFactorEnabled}
                  onChange={(e) => setSecuritySettings({ ...securitySettings, twoFactorEnabled: e.target.checked })}
                />
                <span style={{
                  ...styles.toggleSlider,
                  ...(securitySettings.twoFactorEnabled ? styles.toggleSliderActive : {})
                }}>
                  <span style={{
                    ...styles.toggleSliderBefore,
                    transform: securitySettings.twoFactorEnabled ? 'translateX(24px)' : 'translateX(0)'
                  }} />
                </span>
              </label>
              <span style={{ fontSize: '14px', color: securitySettings.twoFactorEnabled ? '#10b981' : '#64748b' }}>
                {securitySettings.twoFactorEnabled ? 'Enabled' : 'Disabled'}
              </span>
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Session Timeout (minutes)</label>
            <select
              style={styles.select}
              value={securitySettings.sessionTimeout}
              onChange={(e) => setSecuritySettings({ ...securitySettings, sessionTimeout: parseInt(e.target.value) })}
            >
              <option value={15}>15 minutes</option>
              <option value={30}>30 minutes</option>
              <option value={60}>1 hour</option>
              <option value={120}>2 hours</option>
              <option value={480}>8 hours</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Password</label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                style={{ ...styles.input, flex: 1 }}
                type="password"
                value="••••••••••••"
                disabled
              />
              <button
                style={styles.actionButton}
                onClick={handlePasswordChange}
              >
                Change
              </button>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
              Last changed: {securitySettings.passwordLastChanged.toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🛡️ Account Protection</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={securitySettings.loginAlerts}
                onChange={(e) => setSecuritySettings({ ...securitySettings, loginAlerts: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Login Alerts
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={securitySettings.tradeConfirmations}
                onChange={(e) => setSecuritySettings({ ...securitySettings, tradeConfirmations: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Trade Confirmations
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={securitySettings.apiRestrictions}
                onChange={(e) => setSecuritySettings({ ...securitySettings, apiRestrictions: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              API Access Restrictions
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderNotificationsSection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>🔔 Trading Notifications</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={notificationSettings.tradeExecuted}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, tradeExecuted: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Trade Executed
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={notificationSettings.profitTarget}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, profitTarget: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Profit Target Reached
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={notificationSettings.stopLoss}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, stopLoss: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Stop Loss Triggered
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={notificationSettings.marketAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, marketAlerts: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Market Alerts
            </label>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>📧 Communication Preferences</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Email Digest Frequency</label>
            <select
              style={styles.select}
              value={notificationSettings.emailDigest}
              onChange={(e) => setNotificationSettings({ ...notificationSettings, emailDigest: e.target.value })}
            >
              <option value="none">No emails</option>
              <option value="daily">Daily digest</option>
              <option value="weekly">Weekly summary</option>
              <option value="monthly">Monthly report</option>
            </select>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={notificationSettings.pushNotifications}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, pushNotifications: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Push Notifications
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={notificationSettings.soundAlerts}
                onChange={(e) => setNotificationSettings({ ...notificationSettings, soundAlerts: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Sound Alerts
            </label>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSubscriptionSection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>💳 Current Plan</div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#1e293b' }}>
              {user?.subscription?.plan === 'free_trial' ? '🎁 Free Trial' : '💎 Premium Plan'}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {user?.subscription?.plan === 'free_trial' 
                ? 'Trial expires in 12 days' 
                : '$15.00/month • Next billing: Aug 7, 2024'}
            </div>
          </div>
          <button style={styles.buttonPrimary}>
            {user?.subscription?.plan === 'free_trial' ? 'Upgrade to Premium' : 'Manage Billing'}
          </button>
        </div>

        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ fontSize: '14px', color: '#15803d', fontWeight: '500' }}>
            ✅ <strong>Premium Features Active:</strong>
          </div>
          <div style={{ fontSize: '12px', color: '#15803d', marginTop: '8px' }}>
            • All 7 trading pairs • Advanced analytics • Priority support • API access • Custom strategies
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>💰 Payment Methods</div>
        <div style={{ border: '1px solid #e2e8f0', borderRadius: '8px', padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '16px', fontWeight: '600' }}>USDT (TRC20)</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Address: TQn9Y2khEsLMfWd...4vdw (Primary)
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500' }}>✅ Verified</div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderAdvancedSection = () => (
    <div>
      <div style={styles.card}>
        <div style={styles.cardTitle}>⚙️ Advanced Trading Options</div>
        <div style={styles.formGrid}>
          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={tradingSettings.martingaleEnabled}
                onChange={(e) => setTradingSettings({ ...tradingSettings, martingaleEnabled: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Enable Martingale Strategy
            </label>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>
              <input
                type="checkbox"
                checked={tradingSettings.autoTradingEnabled}
                onChange={(e) => setTradingSettings({ ...tradingSettings, autoTradingEnabled: e.target.checked })}
                style={{ marginRight: '8px' }}
              />
              Auto Trading
            </label>
          </div>
        </div>
      </div>

      <div style={styles.card}>
        <div style={styles.cardTitle}>🗂️ Data Management</div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            📊 Export Trading Data
          </button>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            📈 Download Reports
          </button>
          <button style={{ ...styles.button, ...styles.buttonSecondary }}>
            🔄 Reset Settings
          </button>
          <button style={{ ...styles.button, background: '#ef4444', color: 'white' }}>
            🗑️ Delete Account
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case 'profile': return renderProfileSection();
      case 'trading': return renderTradingSection();
      case 'exchanges': return renderExchangesSection();
      case 'assets': return renderAssetsSection();
      case 'security': return renderSecuritySection();
      case 'notifications': return renderNotificationsSection();
      case 'subscription': return renderSubscriptionSection();
      case 'advanced': return renderAdvancedSection();
      default: return renderProfileSection();
    }
  };

  const getCurrentSectionTitle = () => {
    const section = sectionItems.find(item => item.id === activeSection);
    return section ? `${section.icon} ${section.name}` : '👤 Profile';
  };

  return (
    <div style={styles.container}>
      {/* Sidebar Navigation */}
      <div style={styles.sidebar}>
        <div style={styles.sidebarTitle}>⚙️ Settings</div>
        <div style={styles.sectionList}>
          {sectionItems.map(section => (
            <div
              key={section.id}
              style={{
                ...styles.sectionItem,
                ...(activeSection === section.id ? styles.sectionItemActive : {})
              }}
              onClick={() => setActiveSection(section.id)}
            >
              <span style={styles.sectionIcon}>{section.icon}</span>
              <div style={styles.sectionText}>
                <div style={styles.sectionName}>{section.name}</div>
                <div style={styles.sectionDescription}>{section.description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div style={styles.content}>
        <div style={styles.contentHeader}>
          <div style={styles.contentTitle}>{getCurrentSectionTitle()}</div>
          {(activeSection === 'profile' || activeSection === 'trading') && (
            <button
              style={styles.editButton}
              onClick={() => isEditing ? handleSave(activeSection) : setIsEditing(true)}
            >
              {isEditing ? '💾 Save Changes' : '✏️ Edit'}
            </button>
          )}
        </div>

        {renderContent()}
      </div>

      {/* Password Change Modal */}
      {activeModal === 'password' && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <div style={styles.modalTitle}>🔒 Change Password</div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Current Password</label>
              <input style={styles.input} type="password" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input style={styles.input} type="password" />
            </div>
            <div style={styles.formGroup}>
              <label style={styles.label}>Confirm New Password</label>
              <input style={styles.input} type="password" />
            </div>
            <div style={styles.modalActions}>
              <button
                style={{ ...styles.button, ...styles.buttonSecondary }}
                onClick={() => setActiveModal(null)}
              >
                Cancel
              </button>
              <button
                style={{ ...styles.button, ...styles.buttonPrimary }}
                onClick={() => {
                  setActiveModal(null);
                  alert('Password changed successfully!');
                }}
              >
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