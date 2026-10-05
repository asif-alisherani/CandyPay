// ============================================================
// CandyPay — useAuth Hook (Fixed)
// ============================================================

import { useState, useCallback } from 'react';
import { useAuthContext } from '../context';
import { showToast } from '../utils';

const useAuth = () => {
  const { login, register, logout, user, isLoggedIn, isAuthLoading } =
    useAuthContext();

  // ─── Login ───────────────────────────
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const handleLogin = useCallback(
    async ({ email, password }) => {
      try {
        setIsLoginLoading(true);

        console.log('HOOK: handleLogin called');

        const result = await login({ email, password });

        console.log('HOOK: Login result:', result.success);

        if (result.success) {
          showToast('success', 'Welcome back!', result.message);
        } else {
          showToast('error', 'Login Failed', result.message);
        }

        return result;
      } catch (error) {
        console.log('HOOK LOGIN ERROR:', error.message);
        showToast('error', 'Error', 'An unexpected error occurred.');
        return { success: false, message: 'Unexpected error.' };
      } finally {
        setIsLoginLoading(false);
      }
    },
    [login],
  );

  // ─── Referral Validation ─────────────
  const [isReferralLoading, setIsReferralLoading] = useState(false);

  const handleValidateReferral = useCallback(async (code) => {
    try {
      setIsReferralLoading(true);
      const { validateReferralCode } = require('../services/authService');
      const result = await validateReferralCode(code);

      if (!result.success) {
        showToast('error', 'Invalid Code', result.message);
      }

      return result;
    } catch (error) {
      console.log('HOOK REFERRAL ERROR:', error.message);
      showToast('error', 'Error', 'Failed to validate referral code.');
      return { success: false, message: 'Unexpected error.' };
    } finally {
      setIsReferralLoading(false);
    }
  }, []);

  // ─── Register ────────────────────────
  const [isRegisterLoading, setIsRegisterLoading] = useState(false);

  const handleRegister = useCallback(
    async (userData) => {
      try {
        setIsRegisterLoading(true);

        console.log('HOOK: handleRegister called');

        const result = await register(userData);

        console.log('HOOK: Register result:', result.success);

        if (result.success) {
          showToast('success', 'Account Created!', 'Welcome to CandyPay.');
        } else {
          showToast('error', 'Registration Failed', result.message);
        }

        return result;
      } catch (error) {
        console.log('HOOK REGISTER ERROR:', error.message);
        showToast('error', 'Error', 'Registration failed.');
        return { success: false, message: 'Unexpected error.' };
      } finally {
        setIsRegisterLoading(false);
      }
    },
    [register],
  );

  // ─── Logout ──────────────────────────
  const [isLogoutLoading, setIsLogoutLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    try {
      setIsLogoutLoading(true);
      const result = await logout();

      if (!result.success) {
        showToast('error', 'Error', 'Logout failed. Try again.');
      }

      return result;
    } catch (error) {
      showToast('error', 'Error', 'Logout failed.');
      return { success: false };
    } finally {
      setIsLogoutLoading(false);
    }
  }, [logout]);

  return {
    user,
    isLoggedIn,
    isAuthLoading,
    handleLogin,
    isLoginLoading,
    handleValidateReferral,
    isReferralLoading,
    handleRegister,
    isRegisterLoading,
    handleLogout,
    isLogoutLoading,
  };
};

export default useAuth;