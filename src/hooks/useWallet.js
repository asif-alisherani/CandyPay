// ============================================================
// CandyPay — useWallet Hook
// Wallet balance + transactions + deposit + withdraw logic
// ============================================================

import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useWalletContext } from '../context';
import {
  walletService,
  depositService,
  withdrawService,
} from '../services';
import { showToast, calculateINR } from '../utils';

// ─────────────────────────────────────────
// QUERY KEYS
// ─────────────────────────────────────────
export const QUERY_KEYS = {
  WALLET_BALANCE: 'walletBalance',
  TRANSACTIONS: 'transactions',
  RECENT_TRANSACTIONS: 'recentTransactions',
  TRANSACTION_DETAIL: 'transactionDetail',
  DEPOSIT_REQUESTS: 'depositRequests',
  DEPOSIT_DETAIL: 'depositDetail',
  PENDING_DEPOSITS: 'pendingDeposits',
  WITHDRAW_REQUESTS: 'withdrawRequests',
  WITHDRAW_DETAIL: 'withdrawDetail',
  PENDING_WITHDRAWALS: 'pendingWithdrawals',
};

// ─────────────────────────────────────────
// WALLET BALANCE
// ─────────────────────────────────────────
export const useWalletBalance = () => {
  const { refreshBalance } = useWalletContext();

  const query = useQuery({
    queryKey: [QUERY_KEYS.WALLET_BALANCE],
    queryFn: async () => {
      const result = await walletService.getWalletBalance();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    onSuccess: () => {
      refreshBalance();
    },
    staleTime: 1000 * 30, // 30 seconds
  });

  return {
    wallet: query.data,
    balance: query.data?.balance_usdt ?? 0,
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    error: query.error,
  };
};

// ─────────────────────────────────────────
// TRANSACTIONS LIST
// ─────────────────────────────────────────
export const useTransactions = (filter = 'all') => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTIONS, filter],
    queryFn: async () => {
      const result = await walletService.getTransactions(filter);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 30,
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    error: query.error,
    isEmpty: !query.isLoading && (query.data ?? []).length === 0,
  };
};

// ─────────────────────────────────────────
// RECENT TRANSACTIONS (Home)
// ─────────────────────────────────────────
export const useRecentTransactions = (limit = 5) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.RECENT_TRANSACTIONS, limit],
    queryFn: async () => {
      const result = await walletService.getRecentTransactions(limit);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 30,
  });

  return {
    transactions: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    isEmpty: !query.isLoading && (query.data ?? []).length === 0,
  };
};

// ─────────────────────────────────────────
// TRANSACTION DETAIL
// ─────────────────────────────────────────
export const useTransactionDetail = (uuid) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.TRANSACTION_DETAIL, uuid],
    queryFn: async () => {
      const result = await walletService.getTransactionByUUID(uuid);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!uuid,
  });

  return {
    transaction: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// ─────────────────────────────────────────
// DEPOSIT REQUESTS
// ─────────────────────────────────────────
export const useDepositRequests = (filter = 'all') => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.DEPOSIT_REQUESTS, filter],
    queryFn: async () => {
      const result = await depositService.getDepositRequests(filter);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 30,
  });

  return {
    deposits: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    isEmpty: !query.isLoading && (query.data ?? []).length === 0,
  };
};

// ─────────────────────────────────────────
// PENDING DEPOSITS (Home)
// ─────────────────────────────────────────
export const usePendingDeposits = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.PENDING_DEPOSITS],
    queryFn: async () => {
      const result = await depositService.getPendingDeposits();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 30,
  });

  return {
    pendingDeposits: query.data ?? [],
    pendingCount: (query.data ?? []).length,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

// ─────────────────────────────────────────
// DEPOSIT DETAIL
// ─────────────────────────────────────────
export const useDepositDetail = (uuid) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.DEPOSIT_DETAIL, uuid],
    queryFn: async () => {
      const result = await depositService.getDepositByUUID(uuid);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!uuid,
  });

  return {
    deposit: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// ─────────────────────────────────────────
// SUBMIT DEPOSIT
// ─────────────────────────────────────────
export const useSubmitDeposit = () => {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitDeposit = useCallback(
    async (depositData, onSuccess) => {
      try {
        setIsSubmitting(true);
        const result = await depositService.submitDeposit(depositData);

        if (result.success) {
          showToast(
            'success',
            'Deposit Submitted!',
            'Awaiting admin approval.',
          );

          // Invalidate queries to refresh data
          queryClient.invalidateQueries([QUERY_KEYS.DEPOSIT_REQUESTS]);
          queryClient.invalidateQueries([QUERY_KEYS.PENDING_DEPOSITS]);

          onSuccess && onSuccess(result.data);
        } else {
          showToast('error', 'Submission Failed', result.message);
        }

        return result;
      } catch (error) {
        showToast('error', 'Error', 'Failed to submit deposit.');
        return { success: false };
      } finally {
        setIsSubmitting(false);
      }
    },
    [queryClient],
  );

  return { submitDeposit, isSubmitting };
};

// ─────────────────────────────────────────
// WITHDRAW REQUESTS
// ─────────────────────────────────────────
export const useWithdrawRequests = (filter = 'all') => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.WITHDRAW_REQUESTS, filter],
    queryFn: async () => {
      const result = await withdrawService.getWithdrawRequests(filter);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 30,
  });

  return {
    withdrawals: query.data ?? [],
    isLoading: query.isLoading,
    isRefetching: query.isRefetching,
    refetch: query.refetch,
    isEmpty: !query.isLoading && (query.data ?? []).length === 0,
  };
};

// ─────────────────────────────────────────
// PENDING WITHDRAWALS (Home)
// ─────────────────────────────────────────
export const usePendingWithdrawals = () => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.PENDING_WITHDRAWALS],
    queryFn: async () => {
      const result = await withdrawService.getPendingWithdrawals();
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    staleTime: 1000 * 30,
  });

  return {
    pendingWithdrawals: query.data ?? [],
    pendingCount: (query.data ?? []).length,
    isLoading: query.isLoading,
    refetch: query.refetch,
  };
};

// ─────────────────────────────────────────
// WITHDRAW DETAIL
// ─────────────────────────────────────────
export const useWithdrawDetail = (uuid) => {
  const query = useQuery({
    queryKey: [QUERY_KEYS.WITHDRAW_DETAIL, uuid],
    queryFn: async () => {
      const result = await withdrawService.getWithdrawByUUID(uuid);
      if (!result.success) throw new Error(result.message);
      return result.data;
    },
    enabled: !!uuid,
  });

  return {
    withdrawal: query.data,
    isLoading: query.isLoading,
    error: query.error,
  };
};

// ─────────────────────────────────────────
// SUBMIT WITHDRAW
// ─────────────────────────────────────────
export const useSubmitWithdraw = () => {
  const queryClient = useQueryClient();
  const { refreshBalance } = useWalletContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitWithdraw = useCallback(
    async (withdrawData, onSuccess) => {
      try {
        setIsSubmitting(true);
        const result = await withdrawService.submitWithdraw(withdrawData);

        if (result.success) {
          showToast(
            'success',
            'Withdrawal Submitted!',
            'Admin will process it shortly.',
          );

          // Refresh balance and queries
          queryClient.invalidateQueries([QUERY_KEYS.WITHDRAW_REQUESTS]);
          queryClient.invalidateQueries([QUERY_KEYS.PENDING_WITHDRAWALS]);
          queryClient.invalidateQueries([QUERY_KEYS.WALLET_BALANCE]);
          refreshBalance();

          onSuccess && onSuccess(result.data);
        } else {
          showToast('error', 'Submission Failed', result.message);
        }

        return result;
      } catch (error) {
        showToast('error', 'Error', 'Failed to submit withdrawal.');
        return { success: false };
      } finally {
        setIsSubmitting(false);
      }
    },
    [queryClient, refreshBalance],
  );

  return { submitWithdraw, isSubmitting };
};

// ─────────────────────────────────────────
// INR CALCULATOR (live)
// ─────────────────────────────────────────
export const useINRCalculator = (usdtAmount, rate) => {
  const inrAmount = calculateINR(usdtAmount, rate);
  const isValid = !isNaN(inrAmount) && inrAmount > 0;

  return {
    inrAmount,
    isValid,
    formatted: isValid ? `₹${inrAmount.toLocaleString('en-IN')}` : '₹0.00',
  };
};

export default {
  useWalletBalance,
  useTransactions,
  useRecentTransactions,
  useTransactionDetail,
  useDepositRequests,
  usePendingDeposits,
  useDepositDetail,
  useSubmitDeposit,
  useWithdrawRequests,
  usePendingWithdrawals,
  useWithdrawDetail,
  useSubmitWithdraw,
  useINRCalculator,
};