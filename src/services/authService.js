// ============================================================
// CandyPay — Auth Service (Fixed)
// ============================================================

import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG, STORAGE_KEYS, STATUS } from '../constants';

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

const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

const generateReferralCode = (name) => {
  const prefix = name.replace(/\s/g, '').substring(0, 3).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${suffix}`;
};

// ─────────────────────────────────────────
// MOCK USERS DATABASE
// ─────────────────────────────────────────
let MOCK_USERS = [
  {
    id: 1,
    uuid: 'usr-0001-aaaa-bbbb-cccccccccccc',
    referral_code: 'ASIF7X9K',
    referred_by: null,
    name: 'Asif Khan',
    email: 'asif@candypay.in',
    mobile: '9876543210',
    password: 'password123',
    status: 'active',
    remember_token: null,
    created_at: '2024-06-01T10:00:00.000Z',
    updated_at: '2025-01-01T10:00:00.000Z',
    deleted_at: null,
    wallet: {
      id: 1,
      uuid: 'wal-0001-aaaa-bbbb-cccccccccccc',
      user_id: 1,
      balance_usdt: 1245.56,
      created_at: '2024-06-01T10:00:00.000Z',
      updated_at: '2025-01-15T10:00:00.000Z',
    },
  },
  {
    id: 2,
    uuid: 'usr-0002-aaaa-bbbb-cccccccccccc',
    referral_code: 'SARA2M4N',
    referred_by: 1,
    name: 'Sara Ahmed',
    email: 'sara@candypay.in',
    mobile: '9123456789',
    password: 'password123',
    status: 'active',
    remember_token: null,
    created_at: '2024-07-15T10:00:00.000Z',
    updated_at: '2025-01-10T10:00:00.000Z',
    deleted_at: null,
    wallet: {
      id: 2,
      uuid: 'wal-0002-aaaa-bbbb-cccccccccccc',
      user_id: 2,
      balance_usdt: 320.0,
      created_at: '2024-07-15T10:00:00.000Z',
      updated_at: '2025-01-10T10:00:00.000Z',
    },
  },
];

// ─────────────────────────────────────────
// SANITIZE USER (remove password)
// ─────────────────────────────────────────
const sanitizeUser = (user) => {
  if (!user) return null;
  return {
    id: user.id,
    uuid: user.uuid,
    name: user.name,
    email: user.email,
    mobile: user.mobile,
    referral_code: user.referral_code,
    referred_by: user.referred_by,
    status: user.status,
    created_at: user.created_at,
    wallet: user.wallet,
  };
};

// ─────────────────────────────────────────
// LOGIN
// ─────────────────────────────────────────
export const login = async ({ email, password }) => {
  try {
    await mockDelay();

    console.log('LOGIN ATTEMPT:', email, password);
    console.log('MOCK USERS COUNT:', MOCK_USERS.length);

    // Find user
    const user = MOCK_USERS.find((u) => {
      const emailMatch = u.email.toLowerCase().trim() === email.toLowerCase().trim();
      const passMatch = u.password === password;
      const notDeleted = u.deleted_at === null;
      console.log(
        'Checking:',
        u.email,
        '| Email Match:',
        emailMatch,
        '| Pass Match:',
        passMatch,
        '| Not Deleted:',
        notDeleted,
      );
      return emailMatch && passMatch && notDeleted;
    });

    if (!user) {
      console.log('LOGIN FAILED: No matching user found');
      return failure('Invalid email or password. Please try again.');
    }

    if (user.status === 'blocked') {
      console.log('LOGIN FAILED: User blocked');
      return failure('Your account has been blocked. Please contact support.');
    }

    console.log('LOGIN SUCCESS:', user.name);

    // Save session
    const sanitized = sanitizeUser(user);

    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, String(user.id));
    await AsyncStorage.setItem(STORAGE_KEYS.USER_UUID, user.uuid);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(sanitized));

    console.log('SESSION SAVED');

    return success(sanitized, 'Login successful. Welcome back!');
  } catch (error) {
    console.log('LOGIN ERROR:', error.message);
    return failure('Login failed. Please try again.');
  }
};

// ─────────────────────────────────────────
// VALIDATE REFERRAL CODE
// ─────────────────────────────────────────
export const validateReferralCode = async (code) => {
  try {
    await mockDelay();

    console.log('VALIDATING REFERRAL:', code);

    if (!code || code.trim() === '') {
      return failure('Referral code is required.');
    }

    const cleanCode = code.trim().toUpperCase();
    const validCodes = MOCK_USERS.filter((u) => u.status === 'active').map(
      (u) => u.referral_code,
    );

    console.log('VALID CODES:', validCodes);
    console.log('CHECKING CODE:', cleanCode);

    if (!validCodes.includes(cleanCode)) {
      return failure('Invalid referral code. Please check and try again.');
    }

    return success(
      { referral_code: cleanCode },
      'Referral code verified successfully.',
    );
  } catch (error) {
    console.log('REFERRAL ERROR:', error.message);
    return failure('Failed to validate referral code.');
  }
};

// ─────────────────────────────────────────
// REGISTER
// ─────────────────────────────────────────
export const register = async ({ email, password, referral_code, name, mobile }) => {
  try {
    await mockDelay();

    console.log('REGISTER ATTEMPT:', { email, name, mobile, referral_code });

    // Check email
    const emailExists = MOCK_USERS.find(
      (u) => u.email.toLowerCase().trim() === email.toLowerCase().trim(),
    );
    if (emailExists) {
      console.log('REGISTER FAILED: Email exists');
      return failure('This email is already registered.');
    }

    // Check mobile
    const mobileExists = MOCK_USERS.find((u) => u.mobile === mobile.trim());
    if (mobileExists) {
      console.log('REGISTER FAILED: Mobile exists');
      return failure('This mobile number is already registered.');
    }

    // Find referrer
    const cleanCode = referral_code.trim().toUpperCase();
    const referrer = MOCK_USERS.find(
      (u) => u.referral_code === cleanCode && u.status === 'active',
    );

    if (!referrer) {
      console.log('REGISTER FAILED: Invalid referral');
      return failure('Invalid referral code.');
    }

    // Create user
    const newId = MOCK_USERS.length + 1;
    const newUUID = generateUUID();
    const newReferralCode = generateReferralCode(name);
    const now = new Date().toISOString();
    const SIGNUP_BONUS = 1.0;

    const newUser = {
      id: newId,
      uuid: newUUID,
      referral_code: newReferralCode,
      referred_by: referrer.id,
      name: name.trim(),
      email: email.toLowerCase().trim(),
      mobile: mobile.trim(),
      password: password,
      status: 'active',
      remember_token: null,
      created_at: now,
      updated_at: now,
      deleted_at: null,
      wallet: {
        id: newId,
        uuid: generateUUID(),
        user_id: newId,
        balance_usdt: SIGNUP_BONUS,
        created_at: now,
        updated_at: now,
      },
    };

    MOCK_USERS.push(newUser);
    console.log('USER CREATED:', newUser.name, 'Total users:', MOCK_USERS.length);

    // Save session
    const sanitized = sanitizeUser(newUser);

    await AsyncStorage.setItem(STORAGE_KEYS.IS_LOGGED_IN, 'true');
    await AsyncStorage.setItem(STORAGE_KEYS.USER_ID, String(newUser.id));
    await AsyncStorage.setItem(STORAGE_KEYS.USER_UUID, newUser.uuid);
    await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(sanitized));

    console.log('SESSION SAVED FOR NEW USER');

    return success(sanitized, 'Account created successfully!');
  } catch (error) {
    console.log('REGISTER ERROR:', error.message);
    return failure('Registration failed. Please try again.');
  }
};

// ─────────────────────────────────────────
// CHECK AUTH STATUS
// ─────────────────────────────────────────
export const checkAuthStatus = async () => {
  try {
    const isLoggedIn = await AsyncStorage.getItem(STORAGE_KEYS.IS_LOGGED_IN);
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

    console.log('AUTH CHECK:', { isLoggedIn, hasUserData: !!userData });

    if (isLoggedIn === 'true' && userData) {
      return success(JSON.parse(userData), 'Session active.');
    }

    return failure('No active session.');
  } catch (error) {
    console.log('AUTH CHECK ERROR:', error.message);
    return failure('Failed to check session.');
  }
};

// ─────────────────────────────────────────
// GET CURRENT USER
// ─────────────────────────────────────────
export const getCurrentUser = async () => {
  try {
    await mockDelay();

    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);

    if (!userData) {
      return failure('User not found.');
    }

    const user = JSON.parse(userData);
    const freshUser = MOCK_USERS.find((u) => u.uuid === user.uuid);

    if (!freshUser) {
      return failure('User not found.');
    }

    return success(sanitizeUser(freshUser), 'User fetched successfully.');
  } catch (error) {
    return failure('Failed to fetch user details.');
  }
};

// ─────────────────────────────────────────
// LOGOUT
// ─────────────────────────────────────────
export const logout = async () => {
  try {
    await mockDelay();

    await AsyncStorage.removeItem(STORAGE_KEYS.IS_LOGGED_IN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_ID);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_UUID);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);

    console.log('LOGOUT SUCCESS');

    return success(null, 'Logged out successfully.');
  } catch (error) {
    console.log('LOGOUT ERROR:', error.message);
    return failure('Logout failed.');
  }
};

// ─────────────────────────────────────────
// EXPOSE MOCK USERS
// ─────────────────────────────────────────
export const getMockUsers = () => MOCK_USERS;
export const updateMockUser = (updatedUser) => {
  const index = MOCK_USERS.findIndex((u) => u.id === updatedUser.id);
  if (index !== -1) {
    MOCK_USERS[index] = updatedUser;
  }
};

const authService = {
  login,
  validateReferralCode,
  register,
  checkAuthStatus,
  getCurrentUser,
  logout,
};

export default authService;