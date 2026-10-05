// ============================================================
// CandyPay — Wallet Screen
// Full transaction history with filters
// ============================================================

import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableWithoutFeedback,
  Animated,
  RefreshControl,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { ROUTES, WALLET_FILTERS } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
} from '../../theme';
import { useWalletContext } from '../../context';
import { useTransactions } from '../../hooks/useWallet';
import { useSettings } from '../../hooks/useApp';
import { formatUSDT, formatRate } from '../../utils';

import {
  ScreenWrapper,
  GlassCard,
  TransactionCard,
  EmptyState,
  ListSkeleton,
  WalletCardSkeleton,
  FadeInView,
  StatusBadge,
} from '../../components';

// ─────────────────────────────────────────
// FILTER TABS
// ─────────────────────────────────────────
const FilterTabs = ({ activeFilter, onFilterChange }) => {
  const scrollRef = useRef(null);

  return (
    <ScrollView
      ref={scrollRef}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={filterStyles.container}
      style={filterStyles.scrollView}>
      {WALLET_FILTERS.map((filter) => {
        const isActive = activeFilter === filter.key;

        return (
          <TouchableWithoutFeedback
            key={filter.key}
            onPress={() => onFilterChange(filter.key)}>
            <View style={filterStyles.tabWrapper}>
              {isActive ? (
                <LinearGradient
                  colors={gradients.primary.colors}
                  start={gradients.primary.start}
                  end={gradients.primary.end}
                  style={filterStyles.activeTab}>
                  <Text style={filterStyles.activeTabText}>
                    {filter.label}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={filterStyles.inactiveTab}>
                  <Text style={filterStyles.inactiveTabText}>
                    {filter.label}
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        );
      })}
    </ScrollView>
  );
};

const filterStyles = StyleSheet.create({
  scrollView: {
    marginBottom: spacing.md,
  },
  container: {
    paddingHorizontal: spacing.screenHorizontal,
    gap: spacing.sm,
    paddingVertical: spacing.xs,
  },
  tabWrapper: {},
  activeTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.badge,
  },
  activeTabText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
    color: colors.white,
    letterSpacing: 0.3,
  },
  inactiveTab: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.badge,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
  },
  inactiveTabText: {
    fontFamily: 'Inter-Medium',
    fontSize: 13,
    color: colors.textMuted,
    letterSpacing: 0.3,
  },
});

// ─────────────────────────────────────────
// WALLET BALANCE HERO
// ─────────────────────────────────────────
const WalletHero = ({ balance, rate }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.duration.normal,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        useNativeDriver: true,
        ...animations.spring.gentle,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        heroStyles.container,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }],
        },
      ]}>
      <LinearGradient
        colors={gradients.walletCard.colors}
        start={gradients.walletCard.start}
        end={gradients.walletCard.end}
        style={heroStyles.card}>

        {/* Decorative elements */}
        <View style={heroStyles.circle1} />
        <View style={heroStyles.circle2} />

        {/* Label */}
        <View style={heroStyles.labelRow}>
          <Icon
            name="wallet-outline"
            size={14}
            color="rgba(255,255,255,0.7)"
          />
          <Text style={heroStyles.label}>Total Balance</Text>
        </View>

        {/* Balance */}
        <Text style={heroStyles.balance}>
          {formatUSDT(balance, false)}
        </Text>
        <Text style={heroStyles.currency}>USDT</Text>

        {/* Rate */}
        <View style={heroStyles.rateRow}>
          <View style={heroStyles.rateBadge}>
            <Icon
              name="trending-up-outline"
              size={12}
              color={colors.seafoam}
            />
            <Text style={heroStyles.rateText}>
              {formatRate(rate)}
            </Text>
          </View>
        </View>
      </LinearGradient>
    </Animated.View>
  );
};

const heroStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },
  card: {
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    alignItems: 'center',
    overflow: 'hidden',
    minHeight: 160,
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -80,
    right: -60,
  },
  circle2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -50,
    left: -40,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    marginBottom: spacing.sm,
  },
  label: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginLeft: 4,
  },
  balance: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 42,
    color: colors.white,
    letterSpacing: 0.5,
    lineHeight: 52,
  },
  currency: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 18,
    color: 'rgba(255,255,255,0.65)',
    marginBottom: spacing.md,
  },
  rateRow: {
    alignItems: 'center',
  },
  rateBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
    gap: spacing.xs,
  },
  rateText: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },
});

// ─────────────────────────────────────────
// WALLET SCREEN
// ─────────────────────────────────────────
const WalletScreen = ({ navigation }) => {
  const { balance, isBalanceLoading, refreshBalance } = useWalletContext();
  const { usdtRate } = useSettings();
  const [activeFilter, setActiveFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  const {
    transactions,
    isLoading,
    isRefetching,
    refetch,
    isEmpty,
  } = useTransactions(activeFilter);

  // ─── Pull to Refresh ───
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([refreshBalance(), refetch()]);
    setRefreshing(false);
  }, [activeFilter]);

  // ─── Navigate to detail ───
  const goToDetail = (transaction) => {
    navigation.navigate(ROUTES.TRANSACTION_DETAIL, {
      uuid: transaction.uuid,
    });
  };

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

        {/* ── Screen Title ── */}
        <FadeInView style={styles.titleRow}>
          <Text style={styles.screenTitle}>My Wallet</Text>
          <View style={styles.titleBadge}>
            <Text style={styles.titleBadgeText}>
              {transactions.length} transactions
            </Text>
          </View>
        </FadeInView>

        {/* ── Balance Hero ── */}
        <FadeInView delay={80}>
          {isBalanceLoading ? (
            <WalletCardSkeleton />
          ) : (
            <WalletHero balance={balance} rate={usdtRate} />
          )}
        </FadeInView>

        {/* ── Filters ── */}
        <FadeInView delay={140}>
          <FilterTabs
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
        </FadeInView>

        {/* ── Transactions ── */}
        <FadeInView delay={200}>
          {isLoading ? (
            <ListSkeleton count={6} />
          ) : isEmpty ? (
            <EmptyState
              title="No Transactions"
              description={
                activeFilter === 'all'
                  ? 'Your transaction history will appear here.'
                  : `No ${activeFilter} transactions found.`
              }
              style={styles.emptyState}
            />
          ) : (
            <View style={styles.transactionList}>
              {/* Stats row */}
              <TransactionStats
                transactions={transactions}
                filter={activeFilter}
              />

              {/* List */}
              {transactions.map((txn) => (
                <TransactionCard
                  key={txn.uuid}
                  transaction={txn}
                  onPress={goToDetail}
                />
              ))}
            </View>
          )}
        </FadeInView>
      </ScrollView>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// TRANSACTION STATS
// Summary above the list
// ─────────────────────────────────────────
const TransactionStats = ({ transactions, filter }) => {
  const totalIn = transactions
    .filter((t) =>
      ['signup_bonus', 'referral_bonus', 'deposit', 'refund'].includes(
        t.transaction_type,
      ),
    )
    .reduce((sum, t) => sum + parseFloat(t.amount_usdt ?? 0), 0);

  const totalOut = transactions
    .filter((t) => t.transaction_type === 'withdraw')
    .reduce((sum, t) => sum + parseFloat(t.amount_usdt ?? 0), 0);

  if (filter !== 'all') return null;

  return (
    <View style={statStyles.container}>
      <View style={statStyles.stat}>
        <View style={statStyles.statIcon}>
          <Icon
            name="arrow-down-circle-outline"
            size={16}
            color={colors.cryptoGreen}
          />
        </View>
        <View>
          <Text style={statStyles.statLabel}>Total In</Text>
          <Text style={[statStyles.statValue, { color: colors.cryptoGreen }]}>
            +{formatUSDT(totalIn)}
          </Text>
        </View>
      </View>

      <View style={statStyles.separator} />

      <View style={statStyles.stat}>
        <View style={statStyles.statIcon}>
          <Icon
            name="arrow-up-circle-outline"
            size={16}
            color={colors.statusRejected}
          />
        </View>
        <View>
          <Text style={statStyles.statLabel}>Total Out</Text>
          <Text style={[statStyles.statValue, { color: colors.statusRejected }]}>
            -{formatUSDT(totalOut)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const statStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: spacing.md,
  },
  stat: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  statIcon: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginBottom: 2,
  },
  statValue: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    letterSpacing: 0.3,
  },
  separator: {
    width: 1,
    height: 40,
    backgroundColor: colors.divider,
    marginHorizontal: spacing.md,
  },
});

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },

  scrollContent: {
    paddingBottom: 120,
    paddingTop: spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  screenTitle: {
    ...typography.styles.screenTitle,
  },

  titleBadge: {
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
  },

  titleBadgeText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    fontSize: 11,
  },

  transactionList: {},

  emptyState: {
    marginTop: spacing.xl,
  },
});

export default WalletScreen;