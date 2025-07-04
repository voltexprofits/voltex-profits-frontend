
// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // Check if we're in production (deployed)
  if (process.env.NODE_ENV === 'production' || window.location.hostname === 'www.voltexprofits.com') {
    return 'https://api.voltexprofits.com';
  }
  
  // Development environment
  return 'http://localhost:5000';
};

const API_BASE_URL = getApiBaseUrl();

// Log the API URL for debugging (remove in production)
console.log('API Base URL:', API_BASE_URL);

// Get auth token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

// Helper function to make authenticated API calls
const apiCall = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    // Handle unauthorized (token expired)
    if (response.status === 401) {
      console.log('Token expired, redirecting to login...');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.reload();
      return;
    }

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || `HTTP error! status: ${response.status}`);
    }
    
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },

  getProfile: () => apiCall('/api/auth/profile'),

  updateTradingConfig: (config) => apiCall('/api/auth/trading-config', {
    method: 'PUT',
    body: JSON.stringify(config),
  }),

  testSubscription: (action) => apiCall('/api/auth/test-subscription', {
    method: 'POST',
    body: JSON.stringify({ action }),
  }),
};

// Dashboard API calls
export const dashboardAPI = {
  getStats: () => apiCall('/api/dashboard/stats'),
  
  updateTradingSettings: (settings) => apiCall('/api/dashboard/trading/settings', {
    method: 'PUT',
    body: JSON.stringify(settings),
  }),
  
  getTrades: (page = 1, limit = 10) => 
    apiCall(`/api/dashboard/trades?page=${page}&limit=${limit}`),
  
  getAnalytics: (period = '7d') => 
    apiCall(`/api/dashboard/analytics?period=${period}`),
  
  depositToYieldWallet: (amount) => apiCall('/api/dashboard/yield-wallet/deposit', {
    method: 'POST',
    body: JSON.stringify({ amount }),
  }),
};

// Trading API calls
export const tradingAPI = {
  getStatus: () => apiCall('/api/trading/status'),
  
  toggleTrading: (isActive) => apiCall('/api/trading/toggle', {
    method: 'POST',
    body: JSON.stringify({ isActive }),
  }),
};

// Payment API calls
export const paymentAPI = {
  // Stripe payments (if you want to keep them as backup)
  createSubscription: (paymentMethodId) => apiCall('/api/payments/subscribe', {
    method: 'POST',
    body: JSON.stringify({ paymentMethodId }),
  }),

  cancelSubscription: () => apiCall('/api/payments/cancel-subscription', {
    method: 'POST',
  }),

  getBilling: () => apiCall('/api/payments/billing'),

  // Crypto payments
  verifyCryptoPayment: (paymentData) => apiCall('/api/payments/verify-crypto', {
    method: 'POST',
    body: JSON.stringify(paymentData),
  }),
};

// User settings API
export const userAPI = {
  updateProfile: (profileData) => apiCall('/api/auth/profile', {
    method: 'PUT',
    body: JSON.stringify(profileData),
  }),

  changePassword: (passwordData) => apiCall('/api/auth/change-password', {
    method: 'PUT',
    body: JSON.stringify(passwordData),
  }),

  updateTradingConfig: (config) => apiCall('/api/auth/trading-config', {
    method: 'PUT',
    body: JSON.stringify(config),
  }),
};

// Health check API
export const healthAPI = {
  ping: () => apiCall('/api/health'),
  status: () => apiCall('/api/status'),
};

// Export default object with all APIs
export default {
  auth: authAPI,
  dashboard: dashboardAPI,
  trading: tradingAPI,
  payments: paymentAPI,
  user: userAPI,
  health: healthAPI,
};

// Export the base URL for other components that might need it
export { API_BASE_URL };

// Utility function to check if API is reachable
export const checkApiConnection = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/`);
    return response.ok;
  } catch (error) {
    console.error('API connection check failed:', error);
    return false;
  }
};

// Development helper - test API connection on load
if (process.env.NODE_ENV === 'development') {
  checkApiConnection().then(isConnected => {
    if (isConnected) {
      console.log('✅ API connection successful');
    } else {
      console.log('❌ API connection failed - make sure backend is running');
    }
  });
}