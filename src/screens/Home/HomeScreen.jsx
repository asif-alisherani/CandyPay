// ============================================================
// CandyPay — Home Screen
// Dashboard with wallet card, pending requests, recent txns
// ============================================================

import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  shadows,
} from '../../theme';
import { useAuthContext, useWalletContext } from '../../context';
import {
  useRecentTransactions,
  usePendingDeposits,
  usePendingWithdrawals,
} from '../../hooks/useWallet';
import { useSettings } from '../../hooks/useApp';
import {
  getGreeting,
  getFirstName,
  formatUSDT,
  formatRate,
} from '../../utils';

import {
  ScreenWrapper,
  GlassCard,
  SectionHeader,
  WalletCard,
  TransactionCard,
  EmptyState,
  ListSkeleton,
  WalletCardSkeleton,
  FadeInView,
  PendingCard,
  RateCard,
} from '../../components';

// ─────────────────────────────────────────
// HOME SCREEN
// ─────────────────────────────────────────
const HomeScreen = ({ navigation }) => {
  const { user } = useAuthContext();
  const { balance, isBalanceLoading, refreshBalance } = useWalletContext();
  const { usdtRate } = useSettings();

  const [refreshing, setRefreshing] = useState(false);

  // ─── Data Hooks ───
  const {
    transactions,
    isLoading: txLoading,
    refetch: refetchTxns,
  } = useRecentTransactions(5);

  const {
    pendingDeposits,
    pendingCount: pendingDepositCount,
    refetch: refetchPendingDeposits,
  } = usePendingDeposits();

  const {
    pendingWithdrawals,
    pendingCount: pendingWithdrawCount,
    refetch: refetchPendingWithdrawals,
  } = usePendingWithdrawals();

  // ─── Pull to Refresh ───
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      refreshBalance(),
      refetchTxns(),
      refetchPendingDeposits(),
      refetchPendingWithdrawals(),
    ]);
    setRefreshing(false);
  }, []);

  // ─── Navigation ───
  const goToDeposit = () =>
    navigation.navigate(ROUTES.DEPOSIT);

  const goToWithdraw = () =>
    navigation.navigate(ROUTES.WITHDRAW);

  const goToWallet = () =>
    navigation.navigate(ROUTES.WALLET);

  const goToTransactionDetail = (transaction) =>
    navigation.navigate(ROUTES.TRANSACTION_DETAIL, {
      uuid: transaction.uuid,
    });

  return (
    <ScreenWrapper>
      <ScrollView
        style={styles.scroll}
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

        {/* ── Greeting Header ── */}
        <FadeInView delay={0} style={styles.header}>
          <View style={styles.headerLeft}>
            <Text style={styles.greetingText}>
              {getGreeting()} 👋
            </Text>
            <Text style={styles.nameText}>
              {getFirstName(user?.name ?? 'User')}
            </Text>
          </View>

          {/* Avatar */}
          <TouchableWithoutFeedback
            onPress={() => navigation.navigate(ROUTES.PROFILE)}>
            <View style={styles.avatarContainer}>
              <LinearGradient
                colors={gradients.primary.colors}
                start={gradients.primary.start}
                end={gradients.primary.end}
                style={styles.avatar}>
                <Text style={styles.avatarText}>
                  {(user?.name ?? 'U').charAt(0).toUpperCase()}
                </Text>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        </FadeInView>

        {/* ── Wallet Card ── */}
        <FadeInView delay={100}>
          {isBalanceLoading ? (
            <WalletCardSkeleton />
          ) : (
            <WalletCard
              balance={balance}
              rate={usdtRate}
              onDepositPress={goToDeposit}
              onWithdrawPress={goToWithdraw}
              showActions
            />
          )}
        </FadeInView>

        {/* ── Rate Card ── */}
        <FadeInView delay={150}>
          <RateCard rate={usdtRate} />
        </FadeInView>

        {/* ── Pending Requests ── */}
        {(pendingDepositCount > 0 || pendingWithdrawCount > 0) && (
          <FadeInView delay={200}>
            <PendingCard
              pendingDeposits={pendingDepositCount}
              pendingWithdrawals={pendingWithdrawCount}
              onDepositPress={goToDeposit}
              onWithdrawPress={goToWithdraw}
              style={styles.pendingCard}
            />
          </FadeInView>
        )}

        {/* ── Quick Actions ── */}
        <FadeInView delay={220}>
          <QuickActions
            onDepositPress={goToDeposit}
            onWithdrawPress={goToWithdraw}
            onWalletPress={goToWallet}
            onProfilePress={() =>
              navigation.navigate(ROUTES.PROFILE)
            }
          />
        </FadeInView>

        {/* ── Recent Transactions ── */}
        <FadeInView delay={280}>
          <SectionHeader
            title="Recent Transactions"
            rightText="See All"
            onRightPress={goToWallet}
          />

          {txLoading ? (
            <ListSkeleton count={3} />
          ) : transactions.length === 0 ? (
            <EmptyState
              title="No Transactions Yet"
              description="Your recent transactions will appear here."
              actionLabel="Make a Deposit"
              onAction={goToDeposit}
              style={styles.emptyState}
            />
          ) : (
            transactions.map((txn) => (
              <TransactionCard
                key={txn.uuid}
                transaction={txn}
                onPress={goToTransactionDetail}
              />
            ))
          )}
        </FadeInView>

        {/* ── Referral Banner ── */}
        <FadeInView delay={320}>
          <ReferralBanner
            referralCode={user?.referral_code}
            onPress={() => navigation.navigate(ROUTES.PROFILE)}
          />
        </FadeInView>

      </ScrollView>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// QUICK ACTIONS
// ─────────────────────────────────────────
const QuickActions = ({
  onDepositPress,
  onWithdrawPress,
  onWalletPress,
  onProfilePress,
}) => {
  const actions = [
    {
      icon: 'arrow-down-circle-outline',
      label: 'Deposit',
      color: colors.cryptoGreen,
      bgColor: 'rgba(0,196,159,0.12)',
      onPress: onDepositPress,
    },
    {
      icon: 'arrow-up-circle-outline',
      label: 'Withdraw',
      color: colors.statusRejected,
      bgColor: 'rgba(255,76,76,0.12)',
      onPress: onWithdrawPress,
    },
    {
      icon: 'wallet-outline',
      label: 'Wallet',
      color: colors.accent,
      bgColor: 'rgba(160,32,240,0.12)',
      onPress: onWalletPress,
    },
    {
      icon: 'person-outline',
      label: 'Profile',
      color: colors.secondary,
      bgColor: 'rgba(224,25,184,0.12)',
      onPress: onProfilePress,
    },
  ];

  return (
    <View style={qaStyles.container}>
      <Text style={qaStyles.title}>Quick Actions</Text>
      <View style={qaStyles.grid}>
        {actions.map((action) => (
          <QuickActionItem key={action.label} {...action} />
        ))}
      </View>
    </View>
  );
};

const QuickActionItem = ({
  icon,
  label,
  color,
  bgColor,
  onPress,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={qaStyles.item}>
      <View
        style={[
          qaStyles.iconBox,
          { backgroundColor: bgColor },
        ]}>
        <Icon name={icon} size={24} color={color} />
      </View>
      <Text style={qaStyles.label}>{label}</Text>
    </View>
  </TouchableWithoutFeedback>
);

const qaStyles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.lg,
  },
  title: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.md,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  item: {
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
  label: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    fontSize: 12,
    textAlign: 'center',
  },
});

// ─────────────────────────────────────────
// REFERRAL BANNER
// ─────────────────────────────────────────
const ReferralBanner = ({ referralCode, onPress }) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={refStyles.container}>
      <LinearGradient
        colors={['rgba(94,23,235,0.2)', 'rgba(224,25,184,0.15)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={refStyles.gradient}>
        {/* Left */}
        <View style={refStyles.left}>
          <View style={refStyles.iconBox}>
            <Icon
              name="people-outline"
              size={22}
              color={colors.accent}
            />
          </View>
          <View style={refStyles.textBox}>
            <Text style={refStyles.title}>
              Invite Friends, Earn USDT
            </Text>
            <Text style={refStyles.subtitle}>
              Your code:{' '}
              <Text style={refStyles.code}>
                {referralCode ?? '———'}
              </Text>
            </Text>
          </View>
        </View>

        {/* Right */}
        <Icon
          name="chevron-forward"
          size={18}
          color={colors.textMuted}
        />
      </LinearGradient>
    </View>
  </TouchableWithoutFeedback>
);

const refStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.xl,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.accent}25`,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.md,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(160,32,240,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
  },
  title: {
    ...typography.styles.label,
    color: colors.textPrimary,
    marginBottom: 3,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },
  code: {
    color: colors.accent,
    fontFamily: 'SpaceGrotesk-Bold',
    letterSpacing: 1,
  },
});

// ─────────────────────────────────────────
// MAIN STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.md,
    paddingBottom: spacing.sm,
    marginBottom: spacing.sm,
  },

  headerLeft: {
    flex: 1,
  },

  greetingText: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
  },

  nameText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
    color: colors.white,
    marginTop: 2,
    letterSpacing: 0.3,
  },

  // Avatar
  avatarContainer: {
    marginLeft: spacing.md,
  },

  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadows.card,
  },

  avatarText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 20,
    color: colors.white,
  },

  // Misc
  pendingCard: {
    marginBottom: spacing.md,
  },

  emptyState: {
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.screenHorizontal,
  },
});

export default HomeScreen;