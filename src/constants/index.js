// ============================================================
// CandyPay Constants
// All app-wide constants centralized
// ============================================================

// ─────────────────────────────────────────
// ROUTES
// Screen name constants for navigation
// ─────────────────────────────────────────
export const ROUTES = {
  // Auth Stack
  SPLASH: 'Splash',
  LOGIN: 'Login',
  REGISTER_STEP1: 'RegisterStep1',
  REGISTER_STEP2: 'RegisterStep2',

  // Main (Bottom Tab)
  MAIN: 'Main',
  HOME: 'Home',
  WALLET: 'Wallet',
  DEPOSIT: 'Deposit',
  WITHDRAW: 'Withdraw',
  PROFILE: 'Profile',

  // Stack Screens (open above tabs)
  TRANSACTION_DETAIL: 'TransactionDetail',
  DEPOSIT_DETAIL: 'DepositDetail',
  WITHDRAW_DETAIL: 'WithdrawDetail',
  BANK_ACCOUNTS: 'BankAccounts',
  ADD_BANK_ACCOUNT: 'AddBankAccount',
  EDIT_BANK_ACCOUNT: 'EditBankAccount',
  SUPPORT: 'Support',
  ABOUT: 'About',

  // Utility Screens
  NO_INTERNET: 'NoInternet',
  MAINTENANCE: 'Maintenance',
};

// ─────────────────────────────────────────
// STORAGE KEYS
// AsyncStorage key names
// ─────────────────────────────────────────
export const STORAGE_KEYS = {
  IS_LOGGED_IN: '@candypay_is_logged_in',
  USER_ID: '@candypay_user_id',
  USER_UUID: '@candypay_user_uuid',
  USER_DATA: '@candypay_user_data',
  APP_SETTINGS: '@candypay_app_settings',
  LAST_ACTIVE: '@candypay_last_active',
};

// ─────────────────────────────────────────
// STATUS ENUMS
// Match database ENUM values exactly
// ─────────────────────────────────────────
export const STATUS = {
  // Common
  PENDING: 'pending',
  APPROVED: 'approved',
  REJECTED: 'rejected',

  // User
  ACTIVE: 'active',
  BLOCKED: 'blocked',
};

// ─────────────────────────────────────────
// TRANSACTION TYPES
// Match wallet_transactions ENUM values
// ─────────────────────────────────────────
export const TRANSACTION_TYPES = {
  SIGNUP_BONUS: 'signup_bonus',
  REFERRAL_BONUS: 'referral_bonus',
  DEPOSIT: 'deposit',
  WITHDRAW: 'withdraw',
  REFUND: 'refund',
};

// ─────────────────────────────────────────
// VALIDATION RULES
// Centralized validation constraints
// ─────────────────────────────────────────
export const VALIDATION = {
  email: {
    required: 'Email is required.',
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: 'Please enter a valid email address.',
    },
  },
  password: {
    required: 'Password is required.',
    minLength: {
      value: 6,
      message: 'Password must be at least 6 characters.',
    },
  },
  name: {
    required: 'Full name is required.',
    minLength: {
      value: 2,
      message: 'Name must be at least 2 characters.',
    },
  },
  mobile: {
    required: 'Mobile number is required.',
    pattern: {
      value: /^[6-9]\d{9}$/,
      message: 'Please enter a valid 10-digit Indian mobile number.',
    },
  },
  referralCode: {
    required: 'Referral code is required.',
    minLength: {
      value: 6,
      message: 'Invalid referral code.',
    },
  },
  usdtAmount: {
    required: 'USDT amount is required.',
    min: {
      value: 1,
      message: 'Minimum amount is 1 USDT.',
    },
  },
  transactionHash: {
    required: 'Transaction hash is required.',
    minLength: {
      value: 10,
      message: 'Please enter a valid transaction hash.',
    },
  },
  bankAccountHolder: {
    required: 'Account holder name is required.',
  },
  bankName: {
    required: 'Bank name is required.',
  },
  accountNumber: {
    required: 'Account number is required.',
    pattern: {
      value: /^\d{9,18}$/,
      message: 'Please enter a valid account number.',
    },
  },
  ifscCode: {
    required: 'IFSC code is required.',
    pattern: {
      value: /^[A-Z]{4}0[A-Z0-9]{6}$/,
      message: 'Please enter a valid IFSC code.',
    },
  },
};

// ─────────────────────────────────────────
// APP CONFIG
// Global application configuration
// ─────────────────────────────────────────
export const APP_CONFIG = {
  APP_NAME: 'CandyPay',
  APP_VERSION: '1.0.0',
  BUILD_NUMBER: '1',
  COMPANY_NAME: 'CandyPay Technologies',
  COPYRIGHT: `© ${new Date().getFullYear()} CandyPay Technologies. All rights reserved.`,

  // API (future)
  API_BASE_URL: 'https://api.candypay.in/v1',
  API_TIMEOUT: 15000,

  // Mock delays (ms)
  MOCK_DELAY_MIN: 400,
  MOCK_DELAY_MAX: 900,

  // Pagination
  PAGE_SIZE: 20,

  // Referral code length
  REFERRAL_CODE_LENGTH: 8,

  // Splash video duration
  SPLASH_DURATION: 7000,

  // Toast auto hide
  TOAST_DURATION: 3000,

  // Default network (for deposit QR)
  DEFAULT_NETWORK: 'TRC20',

  // Static wallet address (mock)
  DEPOSIT_WALLET_ADDRESS: 'TQHLxxx1234567890abcdefMockWalletAddress',
};

// ─────────────────────────────────────────
// ASSET PATHS
// Centralized asset references
// ─────────────────────────────────────────
export const ASSETS = {
  // Videos
  SPLASH_VIDEO: require('../assets/videos/splash.mp4'),

  // Logo
  LOGO: require('../assets/logo/candypay-logo.png'),
  LOGO_SVG: require('../assets/logo/candypay-logo.svg'),

  // QR Code
  QR_CODE: require('../assets/qr/deposit-qr.png'),

  // Illustrations (empty states)
  ILLUSTRATION_EMPTY_TRANSACTIONS: require('../assets/illustrations/empty-transactions.png'),
  ILLUSTRATION_EMPTY_DEPOSIT: require('../assets/illustrations/empty-deposit.png'),
  ILLUSTRATION_EMPTY_WITHDRAW: require('../assets/illustrations/empty-withdraw.png'),
  ILLUSTRATION_EMPTY_BANK: require('../assets/illustrations/empty-bank.png'),
  ILLUSTRATION_NO_INTERNET: require('../assets/illustrations/no-internet.png'),
  ILLUSTRATION_MAINTENANCE: require('../assets/illustrations/maintenance.png'),
  ILLUSTRATION_SUCCESS: require('../assets/illustrations/success.png'),
};

// ─────────────────────────────────────────
// FILTER OPTIONS
// Used across wallet, deposit, withdraw lists
// ─────────────────────────────────────────
export const WALLET_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'deposit', label: 'Deposit' },
  { key: 'withdraw', label: 'Withdraw' },
  { key: 'signup_bonus', label: 'Bonus' },
  { key: 'refund', label: 'Refund' },
];

export const DEPOSIT_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

export const WITHDRAW_FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'pending', label: 'Pending' },
  { key: 'approved', label: 'Approved' },
  { key: 'rejected', label: 'Rejected' },
];

// ─────────────────────────────────────────
// ICON NAMES
// Centralized icon references (Ionicons)
// ─────────────────────────────────────────
export const ICONS = {
  // Navigation
  home: 'home-outline',
  homeActive: 'home',
  wallet: 'wallet-outline',
  walletActive: 'wallet',
  deposit: 'arrow-down-circle-outline',
  depositActive: 'arrow-down-circle',
  withdraw: 'arrow-up-circle-outline',
  withdrawActive: 'arrow-up-circle',
  profile: 'person-outline',
  profileActive: 'person',

  // Actions
  copy: 'copy-outline',
  share: 'share-outline',
  qr: 'qr-code-outline',
  camera: 'camera-outline',
  gallery: 'image-outline',
  upload: 'cloud-upload-outline',
  download: 'cloud-download-outline',
  refresh: 'refresh-outline',
  search: 'search-outline',
  filter: 'filter-outline',
  edit: 'pencil-outline',
  delete: 'trash-outline',
  add: 'add-circle-outline',
  close: 'close',
  back: 'arrow-back',
  forward: 'chevron-forward',
  eye: 'eye-outline',
  eyeOff: 'eye-off-outline',
  logout: 'log-out-outline',
  settings: 'settings-outline',
  info: 'information-circle-outline',
  check: 'checkmark-circle',
  alert: 'alert-circle-outline',
  bell: 'notifications-outline',

  // Feature
  bank: 'business-outline',
  support: 'headset-outline',
  referral: 'people-outline',
  about: 'shield-checkmark-outline',
  rate: 'trending-up-outline',
  send: 'send-outline',
  receive: 'download-outline',

  // Transaction types
  bonus: 'gift-outline',
  refund: 'return-down-back-outline',
};

// ─────────────────────────────────────────
// TRANSACTION TYPE CONFIG
// Display config per transaction type
// ─────────────────────────────────────────
export const TRANSACTION_CONFIG = {
  signup_bonus: {
    label: 'Signup Bonus',
    icon: ICONS.bonus,
    color: '#00C49F',
    sign: '+',
  },
  referral_bonus: {
    label: 'Referral Bonus',
    icon: ICONS.referral,
    color: '#00C49F',
    sign: '+',
  },
  deposit: {
    label: 'Deposit',
    icon: ICONS.deposit,
    color: '#00C49F',
    sign: '+',
  },
  withdraw: {
    label: 'Withdraw',
    icon: ICONS.withdraw,
    color: '#FF4C4C',
    sign: '-',
  },
  refund: {
    label: 'Refund',
    icon: ICONS.refund,
    color: '#FFB830',
    sign: '+',
  },
};

// ─────────────────────────────────────────
// STATUS CONFIG
// Display config per status
// ─────────────────────────────────────────
export const STATUS_CONFIG = {
  pending: {
    label: 'Pending',
    color: '#FFB830',
    background: 'rgba(255,184,48,0.15)',
  },
  approved: {
    label: 'Approved',
    color: '#00C49F',
    background: 'rgba(0,196,159,0.15)',
  },
  rejected: {
    label: 'Rejected',
    color: '#FF4C4C',
    background: 'rgba(255,76,76,0.15)',
  },
};