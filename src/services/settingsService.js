// ============================================================
// CandyPay — Settings Service
// Mock data + service functions
// Replace mock with axios calls when Laravel is ready
// ============================================================

import { APP_CONFIG } from '../constants';

// ─────────────────────────────────────────
// MOCK DATA
// Mirrors: settings table
// ─────────────────────────────────────────
const MOCK_SETTINGS = {
  id: 1,
  uuid: 'set-0001-xxxx-xxxx-xxxxxxxxxxxx',
  company_name: 'CandyPay',
  support_email: 'support@candypay.in',
  support_mobile: '+91 98765 43210',
  support_whatsapp: '+919876543210',
  minimum_deposit_usdt: 10.0,
  maximum_deposit_usdt: 10000.0,
  minimum_withdraw_usdt: 5.0,
  maximum_withdraw_usdt: 5000.0,
  usdt_price_inr: 105.68,
  level1_percent: 5.00,
  level2_percent: 3.00,
  level3_percent: 1.00,
  signup_bonus: 1.00000000,
  maintenance_mode: false,
  created_at: '2024-01-01T00:00:00.000Z',
  updated_at: '2025-01-01T00:00:00.000Z',
};

// ─────────────────────────────────────────
// HELPER
// Simulate network delay
// ─────────────────────────────────────────
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const mockDelay = () =>
  delay(
    Math.floor(
      Math.random() *
        (APP_CONFIG.MOCK_DELAY_MAX - APP_CONFIG.MOCK_DELAY_MIN + 1) +
        APP_CONFIG.MOCK_DELAY_MIN,
    ),
  );

// ─────────────────────────────────────────
// RESPONSE HELPERS
// ─────────────────────────────────────────
const success = (data, message = 'Success') => ({
  success: true,
  message,
  data,
});

const failure = (message = 'Something went wrong.') => ({
  success: false,
  message,
  data: null,
});

// ─────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Fetch app settings
 * Used by: AppContext, HomeScreen, WithdrawScreen
 */
export const getSettings = async () => {
  try {
    await mockDelay();
    return success(MOCK_SETTINGS, 'Settings fetched successfully.');
  } catch (error) {
    return failure('Failed to load settings.');
  }
};

/**
 * Get current USDT rate
 * Used by: HomeScreen, WithdrawScreen, WalletCard
 */
export const getUSDTRate = async () => {
  try {
    await mockDelay();
    return success(
      { usdt_price_inr: MOCK_SETTINGS.usdt_price_inr },
      'Rate fetched successfully.',
    );
  } catch (error) {
    return failure('Failed to fetch rate.');
  }
};

/**
 * Check maintenance mode
 * Used by: AppNavigator on startup
 */
export const checkMaintenance = async () => {
  try {
    await mockDelay();
    return success(
      { maintenance_mode: MOCK_SETTINGS.maintenance_mode },
      'Status checked.',
    );
  } catch (error) {
    return failure('Failed to check maintenance status.');
  }
};

const settingsService = {
  getSettings,
  getUSDTRate,
  checkMaintenance,
};

export default settingsService;