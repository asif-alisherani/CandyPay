// ============================================================
// CandyPay — useApp Hook
// Settings + Bank Accounts + Network + Clipboard
// ============================================================

import { useState, useCallback, useEffect, useRef } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import NetInfo from '@react-native-community/netinfo';
import { useAppContext } from '../context';
import { bankService } from '../services';
import { copyToClipboard, showToast } from '../utils';

// ─────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────
const BANK_QUERY_KEYS = {
  BANK_ACCOUNTS: 'bankAccounts',
  BANK_ACCOUNT_DETAIL: 'bankAccountDetail',
};

// ─────────────────────────────────────────
// SETTINGS
// ─────────────────────────────────────────
export const useSettings = () => {
  const { settings, isSettingsLoading, usdtRate, refreshSettings } =
    useAppContext();

  return {
    settings,
    isSettingsLoading,
    usdtRate,
    refreshSettings,
    companyName: settings?.company_name ?? 'CandyPay',
    supportEmail: settings?.support_email ?? '',
    supportMobile: settings?.support_mobile ?? '',
    supportWhatsapp: settings?.support_whatsapp ?? '',
    minDeposit: settings?.minimum_deposit_usdt ?? 10,
    maxDeposit: settings?.maximum_deposit_usdt ?? 10000,
    minWithdraw: settings?.minimum_withdraw_usdt ?? 5,
    maxWithdraw: settings?.maximum_withdraw_usdt ?? 5000,
    signupBonus: settings?.signup_bonus ?? 1,
  };
};

// ─────────────────────────────────────────
// BANK ACCOUNTS
// ─────────────────────────────────────────
export const useBankAccounts = () => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: [BANK_QUERY_KEYS.BANK_ACCOUNTS],
    queryFn: async () => {
      const result = await bankService.getBankAccounts();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 60,
  });

  const refetch = useCallback(() => {
    queryClient.invalidateQueries([BANK_QUERY_KEYS.BANK_ACCOUNTS]);
  }, [queryClient]);

  return {
    bankAccounts: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch,
    isEmpty: !query.isLoading && (query.data ?? []).length === 0,
    error: query.error,
  };
};

// ─────────────────────────────────────────
// ADD BANK ACCOUNT
// ─────────────────────────────────────────
export const useAddBankAccount = () => {
  const queryClient = useQueryClient();
  const [isAdding, setIsAdding] = useState(false);

  const addBankAccount = useCallback(
    async (accountData, onSuccess) => {
      try {
        setIsAdding(true);
        const result = await bankService.addBankAccount(accountData);

        if (result.success) {
          showToast('success', 'Bank Added!', 'Account saved successfully.');
          queryClient.invalidateQueries([BANK_QUERY_KEYS.BANK_ACCOUNTS]);
          onSuccess && onSuccess(result.data);
        } else {
          showToast('error', 'Failed', result.message);
        }

        return result;
      } catch (error) {
        showToast('error', 'Error', 'Failed to add bank account.');
        return { success: false };
      } finally {
        setIsAdding(false);
      }
    },
    [queryClient],
  );

  return { addBankAccount, isAdding };
};

// ─────────────────────────────────────────
// UPDATE BANK ACCOUNT
// ─────────────────────────────────────────
export const useUpdateBankAccount = () => {
  const queryClient = useQueryClient();
  const [isUpdating, setIsUpdating] = useState(false);

  const updateBankAccount = useCallback(
    async (id, accountData, onSuccess) => {
      try {
        setIsUpdating(true);
        const result = await bankService.updateBankAccount(id, accountData);

        if (result.success) {
          showToast('success', 'Updated!', 'Bank account updated.');
          queryClient.invalidateQueries([BANK_QUERY_KEYS.BANK_ACCOUNTS]);
          onSuccess && onSuccess(result.data);
        } else {
          showToast('error', 'Failed', result.message);
        }

        return result;
      } catch (error) {
        showToast('error', 'Error', 'Failed to update bank account.');
        return { success: false };
      } finally {
        setIsUpdating(false);
      }
    },
    [queryClient],
  );

  return { updateBankAccount, isUpdating };
};

// ─────────────────────────────────────────
// DELETE BANK ACCOUNT
// ─────────────────────────────────────────
export const useDeleteBankAccount = () => {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteBankAccount = useCallback(
    async (id, onSuccess) => {
      try {
        setIsDeleting(true);
        const result = await bankService.deleteBankAccount(id);

        if (result.success) {
          showToast('success', 'Deleted', 'Bank account removed.');
          queryClient.invalidateQueries([BANK_QUERY_KEYS.BANK_ACCOUNTS]);
          onSuccess && onSuccess();
        } else {
          showToast('error', 'Failed', result.message);
        }

        return result;
      } catch (error) {
        showToast('error', 'Error', 'Failed to delete bank account.');
        return { success: false };
      } finally {
        setIsDeleting(false);
      }
    },
    [queryClient],
  );

  return { deleteBankAccount, isDeleting };
};

// ─────────────────────────────────────────
// CLIPBOARD
// ─────────────────────────────────────────
export const useClipboard = () => {
  const [copied, setCopied] = useState(false);
  const timeoutRef = useRef(null);

  const copy = useCallback(async (text, label = 'Text') => {
    const success = await copyToClipboard(text);

    if (success) {
      setCopied(true);
      showToast('success', 'Copied!', `${label} copied to clipboard.`);

      // Reset after 2 seconds
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setCopied(false);
      }, 2000);
    } else {
      showToast('error', 'Failed', 'Could not copy to clipboard.');
    }

    return success;
  }, []);

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  return { copy, copied };
};

// ─────────────────────────────────────────
// NETWORK STATUS
// ─────────────────────────────────────────
export const useNetworkStatus = () => {
  const [isConnected, setIsConnected] = useState(true);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    // Initial check
    NetInfo.fetch().then((state) => {
      setIsConnected(state.isConnected ?? true);
      setIsChecking(false);
    });

    // Subscribe to changes
    const unsubscribe = NetInfo.addEventListener((state) => {
      setIsConnected(state.isConnected ?? true);
    });

    return () => unsubscribe();
  }, []);

  const checkConnection = useCallback(async () => {
    const state = await NetInfo.fetch();
    setIsConnected(state.isConnected ?? true);
    return state.isConnected ?? true;
  }, []);

  return {
    isConnected,
    isChecking,
    checkConnection,
  };
};

export default {
  useSettings,
  useBankAccounts,
  useAddBankAccount,
  useUpdateBankAccount,
  useDeleteBankAccount,
  useClipboard,
  useNetworkStatus,
};