// ============================================================
// CandyPay — Utility Functions (Fixed)
// All helper functions centralized
// ============================================================

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { colors, radius, typography, spacing } from '../theme';

// ─────────────────────────────────────────
// CURRENCY FORMATTERS
// ─────────────────────────────────────────

/**
 * Format USDT amount
 * Example: 1245.56000000 → "1,245.56 USDT"
 */
export const formatUSDT = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '0.00 USDT' : '0.00';
  }
  const formatted = parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `${formatted} USDT` : formatted;
};

/**
 * Format INR amount
 * Example: 87200 → "₹87,200.00"
 */
export const formatINR = (amount, showSymbol = true) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return showSymbol ? '₹0.00' : '0.00';
  }
  const formatted = parseFloat(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  return showSymbol ? `₹${formatted}` : formatted;
};

/**
 * Format USDT with sign (+ or -)
 */
export const formatUSDTWithSign = (amount, type) => {
  const CREDIT_TYPES = ['signup_bonus', 'referral_bonus', 'deposit', 'refund'];
  const sign = CREDIT_TYPES.includes(type) ? '+' : '-';
  return `${sign}${formatUSDT(Math.abs(amount))}`;
};

/**
 * Format rate display
 * Example: 87.20 → "1 USDT = ₹87.20"
 */
export const formatRate = (rate) => {
  if (!rate) return '1 USDT = ₹0.00';
  return `1 USDT = ₹${parseFloat(rate).toFixed(2)}`;
};

/**
 * Calculate INR from USDT
 */
export const calculateINR = (usdtAmount, rate) => {
  if (!usdtAmount || !rate || isNaN(usdtAmount) || isNaN(rate)) {
    return 0;
  }
  return parseFloat((parseFloat(usdtAmount) * parseFloat(rate)).toFixed(2));
};

/**
 * Mask account number
 * Example: "123456789012" → "••••••789012"
 */
export const maskAccountNumber = (accountNumber) => {
  if (!accountNumber || accountNumber.length < 4) return accountNumber;
  const last4 = accountNumber.slice(-4);
  const masked = '•'.repeat(accountNumber.length - 4);
  return `${masked}${last4}`;
};

// ─────────────────────────────────────────
// DATE FORMATTERS
// ─────────────────────────────────────────

/**
 * Format date to readable string
 * Example: "2024-07-10T14:30:00.000Z" → "10 Jul 2024"
 */
export const formatDate = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
};

/**
 * Format date with time
 * Example: "2024-07-10T14:30:00.000Z" → "10 Jul 2024, 2:30 PM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
};

/**
 * Format relative time
 * Example: "2 hours ago", "Just now", "Yesterday"
 */
export const formatRelativeTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);

    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    if (diff < 172800) return 'Yesterday';
    return formatDate(dateString);
  } catch {
    return '—';
  }
};

/**
 * Format time only
 * Example: "2:30 PM"
 */
export const formatTime = (dateString) => {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-IN', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return '—';
  }
};

// ─────────────────────────────────────────
// VALIDATORS
// ─────────────────────────────────────────

export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const isValidMobile = (mobile) => {
  const regex = /^[6-9]\d{9}$/;
  return regex.test(mobile);
};

export const isValidIFSC = (ifsc) => {
  const regex = /^[A-Z]{4}0[A-Z0-9]{6}$/;
  return regex.test(ifsc);
};

export const isValidAccountNumber = (number) => {
  const regex = /^\d{9,18}$/;
  return regex.test(number);
};

export const isValidUSDTAmount = (amount, min = 1, max = 10000) => {
  const value = parseFloat(amount);
  return !isNaN(value) && value >= min && value <= max;
};

export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// ─────────────────────────────────────────
// CLIPBOARD
// ─────────────────────────────────────────

export const copyToClipboard = async (text) => {
  try {
    const Clipboard = require('@react-native-clipboard/clipboard').default;
    Clipboard.setString(String(text));
    return true;
  } catch (error) {
    console.log('Clipboard error:', error.message);
    return false;
  }
};

export const getFromClipboard = async () => {
  try {
    const Clipboard = require('@react-native-clipboard/clipboard').default;
    const text = await Clipboard.getString();
    return text;
  } catch {
    return '';
  }
};

// ─────────────────────────────────────────
// UUID & CODE GENERATORS
// ─────────────────────────────────────────

export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const generateReferralCode = (name = '') => {
  const prefix = name.replace(/\s/g, '').substring(0, 3).toUpperCase();
  const suffix = Math.random().toString(36).substring(2, 7).toUpperCase();
  return `${prefix}${suffix}`;
};

export const truncate = (str, maxLength = 20) => {
  if (!str) return '';
  if (str.length <= maxLength) return str;
  return `${str.substring(0, 6)}...${str.substring(str.length - 6)}`;
};

export const truncateHash = (hash) => {
  if (!hash || hash.length < 16) return hash;
  return `${hash.substring(0, 8)}...${hash.substring(hash.length - 8)}`;
};

// ─────────────────────────────────────────
// TOAST COMPONENTS
// ─────────────────────────────────────────

const ToastBase = ({ text1, text2, iconName, bgColor, borderColor, onPress }) => (
  <TouchableOpacity
    activeOpacity={0.8}
    onPress={onPress}
    style={[toastStyles.container, { borderLeftColor: borderColor }]}>
    <View style={[toastStyles.iconBox, { backgroundColor: bgColor }]}>
      <Icon name={iconName} size={18} color={colors.white} />
    </View>
    <View style={toastStyles.textBox}>
      {text1 ? (
        <Text style={toastStyles.text1} numberOfLines={1}>
          {text1}
        </Text>
      ) : null}
      {text2 ? (
        <Text style={toastStyles.text2} numberOfLines={2}>
          {text2}
        </Text>
      ) : null}
    </View>
    <View style={toastStyles.closeBox}>
      <Icon name="close" size={14} color={colors.textMuted} />
    </View>
  </TouchableOpacity>
);

export const toastConfig = {
  success: ({ text1, text2, hide }) => (
    <ToastBase
      text1={text1}
      text2={text2}
      iconName="checkmark-circle"
      bgColor={colors.toastSuccess}
      borderColor={colors.toastSuccess}
      onPress={hide}
    />
  ),
  error: ({ text1, text2, hide }) => (
    <ToastBase
      text1={text1}
      text2={text2}
      iconName="close-circle"
      bgColor={colors.toastError}
      borderColor={colors.toastError}
      onPress={hide}
    />
  ),
  warning: ({ text1, text2, hide }) => (
    <ToastBase
      text1={text1}
      text2={text2}
      iconName="warning"
      bgColor={colors.toastWarning}
      borderColor={colors.toastWarning}
      onPress={hide}
    />
  ),
  info: ({ text1, text2, hide }) => (
    <ToastBase
      text1={text1}
      text2={text2}
      iconName="information-circle"
      bgColor={colors.toastInfo}
      borderColor={colors.toastInfo}
      onPress={hide}
    />
  ),
};

/**
 * Show toast helper
 * Usage: showToast('success', 'Title', 'Message')
 */
export const showToast = (type = 'success', text1 = '', text2 = '') => {
  try {
    const Toast = require('react-native-toast-message').default;
    Toast.show({
      type,
      text1,
      text2,
      position: 'top',
      visibilityTime: 3000,
      autoHide: true,
      topOffset: 60,
      onPress: () => {
        Toast.hide();
      },
    });
  } catch (error) {
    console.log('Toast error:', error.message);
  }
};

const toastStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1A1A2E',
    borderRadius: radius.md,
    borderLeftWidth: 4,
    marginHorizontal: spacing.md,
    paddingVertical: spacing.sm + 4,
    paddingHorizontal: spacing.md,
    minHeight: 56,
    width: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  iconBox: {
    width: 32,
    height: 32,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: spacing.sm,
  },
  textBox: {
    flex: 1,
  },
  text1: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  text2: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textMuted,
    marginTop: 2,
    letterSpacing: 0.2,
  },
  closeBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.08)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },
});

// ─────────────────────────────────────────
// MISC HELPERS
// ─────────────────────────────────────────

export const delay = (ms) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get greeting based on time
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good Morning';
  if (hour < 17) return 'Good Afternoon';
  if (hour < 21) return 'Good Evening';
  return 'Good Night';
};

/**
 * Get first name from full name
 */
export const getFirstName = (fullName = '') => {
  return fullName.split(' ')[0] || fullName;
};

/**
 * Safe parse float
 */
export const safeParseFloat = (value, fallback = 0) => {
  const parsed = parseFloat(value);
  return isNaN(parsed) ? fallback : parsed;
};

/**
 * Check if object is empty
 */
export const isEmpty = (obj) => {
  if (!obj) return true;
  return Object.keys(obj).length === 0;
};