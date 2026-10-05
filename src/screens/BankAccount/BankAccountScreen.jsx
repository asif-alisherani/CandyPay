// ============================================================
// CandyPay — Bank Account Screen
// List, edit, delete bank accounts
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../../constants';
import { colors, spacing, typography } from '../../theme';
import {
  useBankAccounts,
  useDeleteBankAccount,
} from '../../hooks/useApp';

import {
  ScreenWrapper,
  AppHeader,
  PrimaryButton,
  BankAccountCard,
  EmptyState,
  ListSkeleton,
  FadeInView,
  ConfirmationModal,
} from '../../components';

// ─────────────────────────────────────────
// BANK ACCOUNT SCREEN
// ─────────────────────────────────────────
const BankAccountScreen = ({ navigation }) => {
  const {
    bankAccounts,
    isLoading,
    isRefetching,
    refetch,
    isEmpty,
  } = useBankAccounts();

  const { deleteBankAccount, isDeleting } = useDeleteBankAccount();

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // ─── Pull to Refresh ───
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  // ─── Delete ───
  const handleDeletePress = (account) => {
    setDeleteTarget(account);
    setDeleteModalVisible(true);
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    setDeleteModalVisible(false);
    await deleteBankAccount(deleteTarget.id, () => {
      setDeleteTarget(null);
    });
  };

  // ─── Edit ───
  const handleEdit = (account) => {
    navigation.navigate(ROUTES.EDIT_BANK_ACCOUNT, {
      account,
      isEdit: true,
    });
  };

  // ─── Add New ───
  const handleAddNew = () => {
    navigation.navigate(ROUTES.ADD_BANK_ACCOUNT);
  };

  return (
    <ScreenWrapper>
      {/* Header */}
      <AppHeader
        title="Bank Accounts"
        navigation={navigation}
        rightIcon="add-circle-outline"
        onRightPress={handleAddNew}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.backgroundSecondary}
          />
        }>

        {/* ── Info Banner ── */}
        <FadeInView style={styles.infoBanner}>
          <Icon
            name="information-circle-outline"
            size={16}
            color={colors.accent}
          />
          <Text style={styles.infoText}>
            Your bank accounts are used for USDT withdrawals.
            Make sure the details are correct.
          </Text>
        </FadeInView>

        {/* ── Account Count ── */}
        {!isLoading && bankAccounts.length > 0 && (
          <FadeInView style={styles.countRow}>
            <Text style={styles.countText}>
              {bankAccounts.length}{' '}
              {bankAccounts.length === 1 ? 'Account' : 'Accounts'} Saved
            </Text>
          </FadeInView>
        )}

        {/* ── Bank Account List ── */}
        {isLoading ? (
          <ListSkeleton count={3} />
        ) : isEmpty ? (
          <EmptyState
            title="No Bank Accounts"
            description="Add your bank account to start withdrawing USDT as INR."
            actionLabel="Add Bank Account"
            onAction={handleAddNew}
            style={styles.emptyState}
          />
        ) : (
          <FadeInView>
            {bankAccounts.map((account) => (
              <BankAccountCard
                key={account.uuid}
                account={account}
                onEdit={handleEdit}
                onDelete={handleDeletePress}
                style={styles.bankCard}
              />
            ))}
          </FadeInView>
        )}

        {/* ── Add Button ── */}
        {!isLoading && bankAccounts.length > 0 && (
          <FadeInView style={styles.addBtnContainer}>
            <PrimaryButton
              label="Add New Bank Account"
              onPress={handleAddNew}
              icon="add-circle-outline"
            />
          </FadeInView>
        )}
      </ScrollView>

      {/* Delete Confirmation */}
      <ConfirmationModal
        visible={deleteModalVisible}
        onClose={() => setDeleteModalVisible(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Account"
        message={
          deleteTarget
            ? `Remove ${deleteTarget.bank_name} (${deleteTarget.account_number.slice(-4)}) from your saved accounts?`
            : ''
        }
        confirmLabel="Delete"
        cancelLabel="Cancel"
        isDanger
        isLoading={isDeleting}
        icon="trash-outline"
      />
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingTop: spacing.sm,
  },

  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: `${colors.accent}10`,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: `${colors.accent}25`,
    padding: spacing.md,
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  infoText: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
    marginLeft: spacing.xs,
  },

  countRow: {
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.sm,
  },

  countText: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  bankCard: {},

  emptyState: {
    marginTop: spacing.xl,
  },

  addBtnContainer: {
    paddingHorizontal: spacing.screenHorizontal,
    marginTop: spacing.md,
  },
});

export default BankAccountScreen;