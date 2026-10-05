// ============================================================
// CandyPay — Withdraw Service
// Mock data + service functions
// Mirrors: withdraw_requests table
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG, STORAGE_KEYS, STATUS, TRANSACTION_TYPES } from '../constants';
import { getMockUsers, updateMockUser } from './authService';
import { addTransaction } from './walletService';

// ─────────────────────────────────────────
// HELPERS
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

const generateUUID = () =>
  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

const getCurrentUserId = async () => {
  const id = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  return id ? parseInt(id, 10) : null;
};

// ─────────────────────────────────────────
// MOCK WITHDRAW REQUESTS
// Mirrors: withdraw_requests table
// ─────────────────────────────────────────
let MOCK_WITHDRAWALS = [
  {
    id: 1,
    uuid: 'wit-0001-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    bank_account_id: 1,
    withdraw_usdt: 100.0,
    withdraw_rate: 87.20,
    withdraw_inr: 8720.0,
    transaction_reference: 'IMPS2024080512345',
    admin_remark: 'Transferred successfully.',
    status: STATUS.APPROVED,
    reviewed_by: 1,
    created_at: '2024-08-05T09:00:00.000Z',
    updated_at: '2024-08-05T09:15:00.000Z',
  },
  {
    id: 2,
    uuid: 'wit-0002-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    bank_account_id: 1,
    withdraw_usdt: 200.0,
    withdraw_rate: 87.20,
    withdraw_inr: 17440.0,
    transaction_reference: 'IMPS2024101267890',
    admin_remark: 'Processed.',
    status: STATUS.APPROVED,
    reviewed_by: 1,
    created_at: '2024-10-12T11:00:00.000Z',
    updated_at: '2024-10-12T11:20:00.000Z',
  },
  {
    id: 3,
    uuid: 'wit-0003-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    bank_account_id: 2,
    withdraw_usdt: 50.0,
    withdraw_rate: 87.20,
    withdraw_inr: 4360.0,
    transaction_reference: null,
    admin_remark: 'Bank details mismatch. Rejected.',
    status: STATUS.REJECTED,
    reviewed_by: 1,
    created_at: '2024-12-01T08:00:00.000Z',
    updated_at: '2024-12-01T10:00:00.000Z',
  },
  {
    id: 4,
    uuid: 'wit-0004-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    bank_account_id: 1,
    withdraw_usdt: 75.0,
    withdraw_rate: 87.20,
    withdraw_inr: 6540.0,
    transaction_reference: null,
    admin_remark: null,
    status: STATUS.PENDING,
    reviewed_by: null,
    created_at: '2025-01-14T15:00:00.000Z',
    updated_at: '2025-01-14T15:00:00.000Z',
  },
];

// ─────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Submit a new withdrawal request
 * Deducts balance immediately (held)
 */
export const submitWithdraw = async ({
  withdraw_usdt,
  bank_account_id,
  withdraw_rate,
}) => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    if (!userId) {
      return failure('Session expired. Please login again.');
    }

    const amount = parseFloat(withdraw_usdt);

    // Validate minimum
    if (amount < 5) {
      return failure('Minimum withdrawal amount is 5 USDT.');
    }

    // Validate maximum
    if (amount > 5000) {
      return failure('Maximum withdrawal amount is 5,000 USDT.');
    }

    // Check balance
    const users = getMockUsers();
    const user = users.find((u) => u.id === userId);

    if (!user || !user.wallet) {
      return failure('Wallet not found.');
    }

    if (parseFloat(user.wallet.balance_usdt) < amount) {
      return failure('Insufficient wallet balance.');
    }

    const rate = parseFloat(withdraw_rate);
    const inrAmount = parseFloat((amount * rate).toFixed(2));
    const now = new Date().toISOString();
    const newId = MOCK_WITHDRAWALS.length + 1;

    const newWithdrawal = {
      id: newId,
      uuid: generateUUID(),
      user_id: userId,
      bank_account_id: parseInt(bank_account_id, 10),
      withdraw_usdt: amount,
      withdraw_rate: rate,
      withdraw_inr: inrAmount,
      transaction_reference: null,
      admin_remark: null,
      status: STATUS.PENDING,
      reviewed_by: null,
      created_at: now,
      updated_at: now,
    };

    MOCK_WITHDRAWALS.push(newWithdrawal);

    // Deduct balance (held for admin)
    const updatedUser = {
      ...user,
      wallet: {
        ...user.wallet,
        balance_usdt: parseFloat(
          (parseFloat(user.wallet.balance_usdt) - amount).toFixed(8),
        ),
        updated_at: now,
      },
    };
    updateMockUser(updatedUser);

    return success(
      newWithdrawal,
      'Withdrawal request submitted. Admin will process it shortly.',
    );
  } catch (error) {
    return failure('Failed to submit withdrawal. Please try again.');
  }
};

/**
 * Get all withdrawal requests for current user
 */
export const getWithdrawRequests = async (filter = 'all') => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    let withdrawals = MOCK_WITHDRAWALS.filter((w) => w.user_id === userId);

    if (filter !== 'all') {
      withdrawals = withdrawals.filter((w) => w.status === filter);
    }

    withdrawals.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    return success(withdrawals, 'Withdrawal requests fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch withdrawal requests.');
  }
};

/**
 * Get pending withdrawals
 * Used by HomeScreen pending card
 */
export const getPendingWithdrawals = async () => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    const pending = MOCK_WITHDRAWALS.filter(
      (w) => w.user_id === userId && w.status === STATUS.PENDING,
    );

    return success(pending, 'Pending withdrawals fetched.');
  } catch (error) {
    return failure('Failed to fetch pending withdrawals.');
  }
};

/**
 * Get single withdrawal by UUID
 * Used by WithdrawDetailScreen
 */
export const getWithdrawByUUID = async (uuid) => {
  try {
    await mockDelay();

    const withdrawal = MOCK_WITHDRAWALS.find((w) => w.uuid === uuid);

    if (!withdrawal) {
      return failure('Withdrawal request not found.');
    }

    return success(withdrawal, 'Withdrawal fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch withdrawal details.');
  }
};

/**
 * Simulate admin approval — for testing
 */
export const simulateApproveWithdraw = async (uuid) => {
  try {
    const index = MOCK_WITHDRAWALS.findIndex((w) => w.uuid === uuid);

    if (index === -1) {
      return failure('Withdrawal not found.');
    }

    const withdrawal = MOCK_WITHDRAWALS[index];

    if (withdrawal.status !== STATUS.PENDING) {
      return failure('Only pending withdrawals can be approved.');
    }

    MOCK_WITHDRAWALS[index] = {
      ...withdrawal,
      status: STATUS.APPROVED,
      transaction_reference: `IMPS${Date.now()}`,
      admin_remark: 'Transfer completed successfully.',
      reviewed_by: 1,
      updated_at: new Date().toISOString(),
    };

    // Add wallet transaction record
    addTransaction({
      wallet_id: withdrawal.user_id,
      user_id: withdrawal.user_id,
      transaction_type: TRANSACTION_TYPES.WITHDRAW,
      amount_usdt: withdrawal.withdraw_usdt,
      amount_inr: withdrawal.withdraw_inr,
      reference_id: withdrawal.id,
    });

    return success(MOCK_WITHDRAWALS[index], 'Withdrawal approved.');
  } catch (error) {
    return failure('Failed to approve withdrawal.');
  }
};

export const getMockWithdrawals = () => MOCK_WITHDRAWALS;

const withdrawService = {
  submitWithdraw,
  getWithdrawRequests,
  getPendingWithdrawals,
  getWithdrawByUUID,
  simulateApproveWithdraw,
};

export default withdrawService;