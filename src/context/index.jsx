// ============================================================
// CandyPay — Context Layer (Fixed)
// ============================================================

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { STORAGE_KEYS } from '../constants';

// ─────────────────────────────────────────
// 1. AUTH CONTEXT
// ─────────────────────────────────────────
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  // Check session on app start
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setIsAuthLoading(true);

      const loggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

      console.log('CONTEXT CHECK SESSION:', { loggedIn, hasData: !!userData });

      if (loggedIn === 'true' && userData) {
        const parsed = JSON.parse(userData);
        setUser(parsed);
        setIsLoggedIn(true);
        console.log('CONTEXT: User restored:', parsed.name);
      } else {
        setUser(null);
        setIsLoggedIn(false);
        console.log('CONTEXT: No session found');
      }
    } catch (error) {
      console.log('CONTEXT CHECK SESSION ERROR:', error.message);
      setUser(null);
      setIsLoggedIn(false);
    } finally {
      setIsAuthLoading(false);
    }
  };

  /**
   * Login
   */
  const login = useCallback(async (credentials) => {
    try {
      console.log('CONTEXT: Login called with', credentials.email);
      const { login: loginService } = require('../services/authService');
      const result = await loginService(credentials);

      console.log('CONTEXT: Login result:', result.success, result.message);

      if (result.success && result.data) {
        setUser(result.data);
        setIsLoggedIn(true);
        console.log('CONTEXT: Login state updated — isLoggedIn = true');
      }

      return result;
    } catch (error) {
      console.log('CONTEXT LOGIN ERROR:', error.message);
      return {
        success: false,
        message: 'Login failed. Please try again.',
        data: null,
      };
    }
  }, []);

  /**
   * Register
   */
  const register = useCallback(async (userData) => {
    try {
      console.log('CONTEXT: Register called');
      const { register: registerService } = require('../services/authService');
      const result = await registerService(userData);

      console.log('CONTEXT: Register result:', result.success, result.message);

      if (result.success && result.data) {
        setUser(result.data);
        setIsLoggedIn(true);
        console.log('CONTEXT: Register state updated — isLoggedIn = true');
      }

      return result;
    } catch (error) {
      console.log('CONTEXT REGISTER ERROR:', error.message);
      return {
        success: false,
        message: 'Registration failed. Please try again.',
        data: null,
      };
    }
  }, []);

  /**
   * Logout
   */
  const logout = useCallback(async () => {
    try {
      const { logout: logoutService } = require('../services/authService');
      const result = await logoutService();

      if (result.success) {
        setUser(null);
        setIsLoggedIn(false);
        console.log('CONTEXT: Logout done — isLoggedIn = false');
      }

      return result;
    } catch (error) {
      console.log('CONTEXT LOGOUT ERROR:', error.message);
      return { success: false, message: 'Logout failed.' };
    }
  }, []);

  /**
   * Update user data locally
   */
  const updateUser = useCallback((updatedUser) => {
    setUser(updatedUser);
    AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(updatedUser));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        isAuthLoading,
        login,
        register,
        logout,
        updateUser,
        refreshUser: checkSession,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used inside AuthProvider');
  }
  return context;
};

// ─────────────────────────────────────────
// 2. APP CONTEXT
// ─────────────────────────────────────────
const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [settings, setSettings] = useState(null);
  const [isSettingsLoading, setIsSettingsLoading] = useState(true);
  const [isMaintenanceMode, setIsMaintenanceMode] = useState(false);
  const [usdtRate, setUsdtRate] = useState(87.2);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setIsSettingsLoading(true);
      const { getSettings } = require('../services/settingsService');
      const result = await getSettings();

      if (result.success && result.data) {
        setSettings(result.data);
        setUsdtRate(parseFloat(result.data.usdt_price_inr));
        setIsMaintenanceMode(result.data.maintenance_mode || false);
      }
    } catch (error) {
      console.log('SETTINGS ERROR:', error.message);
    } finally {
      setIsSettingsLoading(false);
    }
  };

  return (
    <AppContext.Provider
      value={{
        settings,
        isSettingsLoading,
        isMaintenanceMode,
        usdtRate,
        refreshSettings: loadSettings,
      }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used inside AppProvider');
  }
  return context;
};

// ─────────────────────────────────────────
// 3. WALLET CONTEXT
// ─────────────────────────────────────────
const WalletContext = createContext(null);

export const WalletProvider = ({ children }) => {
  const [balance, setBalance] = useState(0);
  const [isBalanceLoading, setIsBalanceLoading] = useState(false);
  const { isLoggedIn } = useAuthContext();

  useEffect(() => {
    if (isLoggedIn) {
      refreshBalance();
    } else {
      setBalance(0);
    }
  }, [isLoggedIn]);

  const refreshBalance = useCallback(async () => {
    try {
      setIsBalanceLoading(true);
      const { getWalletBalance } = require('../services/walletService');
      const result = await getWalletBalance();
      if (result.success && result.data) {
        setBalance(parseFloat(result.data.balance_usdt));
      }
    } catch (error) {
      console.log('WALLET BALANCE ERROR:', error.message);
    } finally {
      setIsBalanceLoading(false);
    }
  }, []);

  return (
    <WalletContext.Provider
      value={{
        balance,
        isBalanceLoading,
        refreshBalance,
        setBalance,
      }}>
      {children}
    </WalletContext.Provider>
  );
};

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWalletContext must be used inside WalletProvider');
  }
  return context;
};

// ─────────────────────────────────────────
// COMBINED PROVIDER (not used, but available)
// ─────────────────────────────────────────
export const AppProviders = ({ children }) => {
  return (
    <AuthProvider>
      <AppProvider>
        <WalletProvider>{children}</WalletProvider>
      </AppProvider>
    </AuthProvider>
  );
};