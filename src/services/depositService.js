// ============================================================
// CandyPay — Deposit Service
// Mock data + service functions
// Mirrors: deposit_requests table
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
// MOCK DEPOSIT REQUESTS
// Mirrors: deposit_requests table
// ─────────────────────────────────────────
let MOCK_DEPOSITS = [
  {
    id: 1,
    uuid: 'dep-0001-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    requested_usdt: 500.0,
    payment_image: 'https://via.placeholder.com/400x600?text=Receipt+1',
    transaction_hash: 'abc123def456ghi789jkl012mno345pqr678stu901',
    admin_remark: 'Verified and approved.',
    status: STATUS.APPROVED,
    reviewed_by: 1,
    created_at: '2024-07-10T14:00:00.000Z',
    updated_at: '2024-07-10T14:30:00.000Z',
  },
  {
    id: 2,
    uuid: 'dep-0002-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    requested_usdt: 750.0,
    payment_image: 'https://via.placeholder.com/400x600?text=Receipt+2',
    transaction_hash: 'xyz999aaa888bbb777ccc666ddd555eee444fff333',
    admin_remark: 'Approved successfully.',
    status: STATUS.APPROVED,
    reviewed_by: 1,
    created_at: '2024-09-20T16:00:00.000Z',
    updated_at: '2024-09-20T16:45:00.000Z',
  },
  {
    id: 3,
    uuid: 'dep-0003-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    requested_usdt: 50.0,
    payment_image: 'https://via.placeholder.com/400x600?text=Receipt+3',
    transaction_hash: 'rej111aaa222bbb333ccc444ddd555eee666fff777',
    admin_remark: 'Screenshot is unclear. Please resubmit.',
    status: STATUS.REJECTED,
    reviewed_by: 1,
    created_at: '2024-10-28T10:00:00.000Z',
    updated_at: '2024-10-28T12:00:00.000Z',
  },
  {
    id: 4,
    uuid: 'dep-0004-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    requested_usdt: 220.56,
    payment_image: 'https://via.placeholder.com/400x600?text=Receipt+4',
    transaction_hash: 'pnd111aaa222bbb333ccc444ddd555eee666fff888',
    admin_remark: null,
    status: STATUS.PENDING,
    reviewed_by: null,
    created_at: '2025-01-05T12:30:00.000Z',
    updated_at: '2025-01-05T12:30:00.000Z',
  },
  // User 2 deposits
  {
    id: 5,
    uuid: 'dep-0005-aaaa-bbbb-cccccccccccc',
    user_id: 2,
    requested_usdt: 319.0,
    payment_image: 'https://via.placeholder.com/400x600?text=Receipt+5',
    transaction_hash: 'usr2111aaa222bbb333ccc444ddd555eee666fff999',
    admin_remark: 'Approved.',
    status: STATUS.APPROVED,
    reviewed_by: 1,
    created_at: '2024-08-01T09:00:00.000Z',
    updated_at: '2024-08-01T09:30:00.000Z',
  },
];

// ─────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Submit a new deposit request
 */
export const submitDeposit = async ({
  requested_usdt,
  transaction_hash,
  payment_image,
}) => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    if (!userId) {
      return failure('Session expired. Please login again.');
    }

    // Validate minimum deposit (from settings - hardcoded for mock)
    if (parseFloat(requested_usdt) < 10) {
      return failure('Minimum deposit amount is 10 USDT.');
    }

    if (parseFloat(requested_usdt) > 10000) {
      return failure('Maximum deposit amount is 10,000 USDT.');
    }

    // Check duplicate transaction hash
    const duplicate = MOCK_DEPOSITS.find(
      (d) => d.transaction_hash === transaction_hash,
    );
    if (duplicate) {
      return failure(
        'This transaction hash has already been submitted.',
      );
    }

    const newId = MOCK_DEPOSITS.length + 1;
    const now = new Date().toISOString();

    const newDeposit = {
      id: newId,
      uuid: generateUUID(),
      user_id: userId,
      requested_usdt: parseFloat(requested_usdt),
      payment_image: payment_image || null,
      transaction_hash: transaction_hash.trim(),
      admin_remark: null,
      status: STATUS.PENDING,
      reviewed_by: null,
      created_at: now,
      updated_at: now,
    };

    MOCK_DEPOSITS.push(newDeposit);

    return success(
      newDeposit,
      'Deposit request submitted successfully. Awaiting admin approval.',
    );
  } catch (error) {
    return failure('Failed to submit deposit. Please try again.');
  }
};

/**
 * Get all deposit requests for current user
 */
export const getDepositRequests = async (filter = 'all') => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    let deposits = MOCK_DEPOSITS.filter((d) => d.user_id === userId);

    if (filter !== 'all') {
      deposits = deposits.filter((d) => d.status === filter);
    }

    deposits.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at),
    );

    return success(deposits, 'Deposit requests fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch deposit requests.');
  }
};

/**
 * Get pending deposit requests
 * Used by HomeScreen pending card
 */
export const getPendingDeposits = async () => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    const pending = MOCK_DEPOSITS.filter(
      (d) => d.user_id === userId && d.status === STATUS.PENDING,
    );

    return success(pending, 'Pending deposits fetched.');
  } catch (error) {
    return failure('Failed to fetch pending deposits.');
  }
};

/**
 * Get single deposit by UUID
 * Used by DepositDetailScreen
 */
export const getDepositByUUID = async (uuid) => {
  try {
    await mockDelay();

    const deposit = MOCK_DEPOSITS.find((d) => d.uuid === uuid);

    if (!deposit) {
      return failure('Deposit request not found.');
    }

    return success(deposit, 'Deposit fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch deposit details.');
  }
};

/**
 * Simulate admin approval — for testing
 * Not visible to end users
 */
export const simulateApproveDeposit = async (uuid) => {
  try {
    const index = MOCK_DEPOSITS.findIndex((d) => d.uuid === uuid);

    if (index === -1) {
      return failure('Deposit not found.');
    }

    const deposit = MOCK_DEPOSITS[index];

    if (deposit.status !== STATUS.PENDING) {
      return failure('Only pending deposits can be approved.');
    }

    // Update deposit status
    MOCK_DEPOSITS[index] = {
      ...deposit,
      status: STATUS.APPROVED,
      admin_remark: 'Verified and approved.',
      reviewed_by: 1,
      updated_at: new Date().toISOString(),
    };

    // Update wallet balance
    const users = getMockUsers();
    const userIndex = users.findIndex((u) => u.id === deposit.user_id);

    if (userIndex !== -1) {
      const user = users[userIndex];
      const updatedUser = {
        ...user,
        wallet: {
          ...user.wallet,
          balance_usdt:
            parseFloat(user.wallet.balance_usdt) +
            parseFloat(deposit.requested_usdt),
          updated_at: new Date().toISOString(),
        },
      };
      updateMockUser(updatedUser);
    }

    // Add wallet transaction
    addTransaction({
      wallet_id: deposit.user_id,
      user_id: deposit.user_id,
      transaction_type: TRANSACTION_TYPES.DEPOSIT,
      amount_usdt: deposit.requested_usdt,
      amount_inr: null,
      reference_id: deposit.id,
    });

    return success(MOCK_DEPOSITS[index], 'Deposit approved.');
  } catch (error) {
    return failure('Failed to approve deposit.');
  }
};

export const getMockDeposits = () => MOCK_DEPOSITS;

const depositService = {
  submitDeposit,
  getDepositRequests,
  getPendingDeposits,
  getDepositByUUID,
  simulateApproveDeposit,
};

export default depositService;