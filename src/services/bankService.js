// ============================================================
// CandyPay — Bank Account Service
// Mock data + service functions
// Mirrors: user_bank_accounts table
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG, STORAGE_KEYS } from '../constants';

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
// MOCK BANK ACCOUNTS
// Mirrors: user_bank_accounts table
// ─────────────────────────────────────────
let MOCK_BANK_ACCOUNTS = [
  {
    id: 1,
    uuid: 'bnk-0001-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    account_holder_name: 'Asif Khan',
    bank_name: 'State Bank of India',
    account_number: '123456789012',
    ifsc_code: 'SBIN0001234',
    upi_id: 'asif@upi',
    created_at: '2024-06-05T10:00:00.000Z',
    updated_at: '2024-06-05T10:00:00.000Z',
  },
  {
    id: 2,
    uuid: 'bnk-0002-aaaa-bbbb-cccccccccccc',
    user_id: 1,
    account_holder_name: 'Asif Khan',
    bank_name: 'HDFC Bank',
    account_number: '987654321098',
    ifsc_code: 'HDFC0009876',
    upi_id: null,
    created_at: '2024-08-10T11:00:00.000Z',
    updated_at: '2024-08-10T11:00:00.000Z',
  },
  {
    id: 3,
    uuid: 'bnk-0003-aaaa-bbbb-cccccccccccc',
    user_id: 2,
    account_holder_name: 'Sara Ahmed',
    bank_name: 'ICICI Bank',
    account_number: '456789012345',
    ifsc_code: 'ICIC0004567',
    upi_id: 'sara@icici',
    created_at: '2024-07-20T09:00:00.000Z',
    updated_at: '2024-07-20T09:00:00.000Z',
  },
];

// ─────────────────────────────────────────
// SERVICE FUNCTIONS
// ─────────────────────────────────────────

/**
 * Get all bank accounts for current user
 */
export const getBankAccounts = async () => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    const accounts = MOCK_BANK_ACCOUNTS.filter(
      (b) => b.user_id === userId,
    ).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

    return success(accounts, 'Bank accounts fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch bank accounts.');
  }
};

/**
 * Get single bank account by ID
 */
export const getBankAccountById = async (id) => {
  try {
    await mockDelay();

    const account = MOCK_BANK_ACCOUNTS.find((b) => b.id === parseInt(id, 10));

    if (!account) {
      return failure('Bank account not found.');
    }

    return success(account, 'Bank account fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch bank account.');
  }
};

/**
 * Add a new bank account
 */
export const addBankAccount = async ({
  account_holder_name,
  bank_name,
  account_number,
  ifsc_code,
  upi_id,
}) => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();

    if (!userId) {
      return failure('Session expired. Please login again.');
    }

    // Check duplicate account number for this user
    const duplicate = MOCK_BANK_ACCOUNTS.find(
      (b) =>
        b.user_id === userId &&
        b.account_number === account_number.trim(),
    );

    if (duplicate) {
      return failure('This account number is already saved.');
    }

    const newId = MOCK_BANK_ACCOUNTS.length + 1;
    const now = new Date().toISOString();

    const newAccount = {
      id: newId,
      uuid: generateUUID(),
      user_id: userId,
      account_holder_name: account_holder_name.trim(),
      bank_name: bank_name.trim(),
      account_number: account_number.trim(),
      ifsc_code: ifsc_code.trim().toUpperCase(),
      upi_id: upi_id ? upi_id.trim() : null,
      created_at: now,
      updated_at: now,
    };

    MOCK_BANK_ACCOUNTS.push(newAccount);

    return success(newAccount, 'Bank account added successfully.');
  } catch (error) {
    return failure('Failed to add bank account.');
  }
};

/**
 * Update an existing bank account
 */
export const updateBankAccount = async (
  id,
  { account_holder_name, bank_name, account_number, ifsc_code, upi_id },
) => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();
    const index = MOCK_BANK_ACCOUNTS.findIndex(
      (b) => b.id === parseInt(id, 10) && b.user_id === userId,
    );

    if (index === -1) {
      return failure('Bank account not found.');
    }

    MOCK_BANK_ACCOUNTS[index] = {
      ...MOCK_BANK_ACCOUNTS[index],
      account_holder_name: account_holder_name.trim(),
      bank_name: bank_name.trim(),
      account_number: account_number.trim(),
      ifsc_code: ifsc_code.trim().toUpperCase(),
      upi_id: upi_id ? upi_id.trim() : null,
      updated_at: new Date().toISOString(),
    };

    return success(
      MOCK_BANK_ACCOUNTS[index],
      'Bank account updated successfully.',
    );
  } catch (error) {
    return failure('Failed to update bank account.');
  }
};

/**
 * Delete a bank account
 */
export const deleteBankAccount = async (id) => {
  try {
    await mockDelay();

    const userId = await getCurrentUserId();
    const index = MOCK_BANK_ACCOUNTS.findIndex(
      (b) => b.id === parseInt(id, 10) && b.user_id === userId,
    );

    if (index === -1) {
      return failure('Bank account not found.');
    }

    MOCK_BANK_ACCOUNTS.splice(index, 1);

    return success(null, 'Bank account deleted successfully.');
  } catch (error) {
    return failure('Failed to delete bank account.');
  }
};

export const getMockBankAccounts = () => MOCK_BANK_ACCOUNTS;

const bankService = {
  getBankAccounts,
  getBankAccountById,
  addBankAccount,
  updateBankAccount,
  deleteBankAccount,
};

export default bankService;