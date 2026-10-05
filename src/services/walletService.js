// ============================================================
// CandyPay — Wallet Service
// Mock data + service functions
// Mirrors: user_wallets, wallet_transactions tables
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG, STORAGE_KEYS, TRANSACTION_TYPES } from '../constants';
import { getMockUsers } from './authService';

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

// ─────────────────────────────────────────
// MOCK WALLET TRANSACTIONS
// Mirrors: wallet_transactions table
// ─────────────────────────────────────────
let MOCK_TRANSACTIONS = [
  {
    id: 1,
    uuid: 'txn-0001-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.SIGNUP_BONUS,
    amount_usdt: 1.0,
    amount_inr: null,
    reference_id: null,
    created_at: '2024-06-01T10:05:00.000Z',
    updated_at: '2024-06-01T10:05:00.000Z',
  },
  {
    id: 2,
    uuid: 'txn-0002-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.DEPOSIT,
    amount_usdt: 500.0,
    amount_inr: null,
    reference_id: 1, // deposit_request id
    created_at: '2024-07-10T14:30:00.000Z',
    updated_at: '2024-07-10T14:30:00.000Z',
  },
  {
    id: 3,
    uuid: 'txn-0003-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.REFERRAL_BONUS,
    amount_usdt: 25.0,
    amount_inr: null,
    reference_id: null,
    created_at: '2024-07-15T10:00:00.000Z',
    updated_at: '2024-07-15T10:00:00.000Z',
  },
  {
    id: 4,
    uuid: 'txn-0004-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.WITHDRAW,
    amount_usdt: 100.0,
    amount_inr: 8720.0,
    reference_id: 1, // withdraw_request id
    created_at: '2024-08-05T09:15:00.000Z',
    updated_at: '2024-08-05T09:15:00.000Z',
  },
  {
    id: 5,
    uuid: 'txn-0005-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.DEPOSIT,
    amount_usdt: 750.0,
    amount_inr: null,
    reference_id: 2,
    created_at: '2024-09-20T16:45:00.000Z',
    updated_at: '2024-09-20T16:45:00.000Z',
  },
  {
    id: 6,
    uuid: 'txn-0006-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.WITHDRAW,
    amount_usdt: 200.0,
    amount_inr: 17440.0,
    reference_id: 2,
    created_at: '2024-10-12T11:20:00.000Z',
    updated_at: '2024-10-12T11:20:00.000Z',
  },
  {
    id: 7,
    uuid: 'txn-0007-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.REFUND,
    amount_usdt: 50.0,
    amount_inr: null,
    reference_id: 3,
    created_at: '2024-11-01T08:00:00.000Z',
    updated_at: '2024-11-01T08:00:00.000Z',
  },
  {
    id: 8,
    uuid: 'txn-0008-aaaa-bbbb-cccccccccccc',
    wallet_id: 1,
    user_id: 1,
    transaction_type: TRANSACTION_TYPES.DEPOSIT,
    amount_usdt: 220.56,
    amount_inr: null,
    reference_id: 3,
    created_at: '2025-01-05T13:00:00.000Z',
    updated_at: '2025-01-05T13:00:00.000Z',
  },
  // User 2 transactions
  {
    id: 9,
    uuid: 'txn-0009-aaaa-bbbb-cccccccccccc',
    wallet_id: 2,
    user_id: 2,
    transaction_type: TRANSACTION_TYPES.SIGNUP_BONUS,
    amount_usdt: 1.0,
    amount_inr: null,
    reference_id: null,
    created_at: '2024-07-15T10:05:00.000Z',
    updated_at: '2024-07-15T10:05:00.000Z',
  },
  {
    id: 10,
    uuid: 'txn-0010-aaaa-bbbb-cccccccccccc',
    wallet_id: 2,
    user_id: 2,
    transaction_type: TRANSACTION_TYPES.DEPOSIT,
    amount_usdt: 319.0,
    amount_inr: null,
    reference_id: 4,
    created_at: '2024-08-01T09:00:00.000Z',
    updated_at: '2024-08-01T09:00:00.000Z',
  },
];

// ─────────────────────────────────────────
// HELPER: Get current user ID from storage
// ─────────────────────────────────────────
const getCurrentUserId = async () => {
  const id = await AsyncStorage.getItem(STORAGE_KEYS.USER_ID);
  return id ? parseInt(id, 10) : null;
};

// ─────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Get wallet balance for current user
 */
export const getWalletBalance = async () => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();
    const users = getMockUsers();
    const user = users.find((u) => u.id === userId);

    if (!user || !user.wallet) {
      return failure('Wallet not found.');
    }

    return success(
      {
        uuid: user.wallet.uuid,
        balance_usdt: user.wallet.balance_usdt,
        updated_at: user.wallet.updated_at,
      },
      'Wallet fetched successfully.',
    );
  } catch (error) {
    return failure('Failed to fetch wallet balance.');
  }
};

/**
 * Get wallet transactions for current user
 * Supports filtering by transaction_type
 */
export const getTransactions = async (filter = 'all') => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    let transactions = MOCK_TRANSACTIONS.filter(
      (t) => t.user_id === userId,
    );

    if (filter !== 'all') {
      transactions = transactions.filter(
        (t) => t.transaction_type === filter,
      );
    }

    // Sort newest first
    transactions.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    return success(transactions, 'Transactions fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch transactions.');
  }
};

/**
 * Get recent transactions
 * Used by HomeScreen (last 5)
 */
export const getRecentTransactions = async (limit = 5) => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    const transactions = MOCK_TRANSACTIONS.filter(
      (t) => t.user_id === userId,
    )
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(0, limit);

    return success(transactions, 'Recent transactions fetched.');
  } catch (error) {
    return failure('Failed to fetch recent transactions.');
  }
};

/**
 * Get single transaction by UUID
 * Used by: TransactionDetailScreen
 */
export const getTransactionByUUID = async (uuid) => {
  try {
    await mockDelay();

    const transaction = MOCK_TRANSACTIONS.find((t) => t.uuid === uuid);

    if (!transaction) {
      return failure('Transaction not found.');
    }

    return success(transaction, 'Transaction fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch transaction.');
  }
};

/**
 * Add a new transaction to the mock DB
 * Used internally by deposit/withdraw services
 */
export const addTransaction = (transactionData) => {
  const newId = MOCK_TRANSACTIONS.length + 1;
  const newTransaction = {
    id: newId,
    uuid: generateUUID(),
    ...transactionData,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
  MOCK_TRANSACTIONS.push(newTransaction);
  return newTransaction;
};

/**
 * Expose mock transactions for other services
 */
export const getMockTransactions = () => MOCK_TRANSACTIONS;

const walletService = {
  getWalletBalance,
  getTransactions,
  getRecentTransactions,
  getTransactionByUUID,
  addTransaction,
};

export default walletService;