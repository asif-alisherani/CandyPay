// ============================================================
// CandyPay — Wallet Card
// Hero component shown on Home & Withdraw screens
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} from '../../theme';
import { formatUSDT, formatRate } from '../../utils';

// ─────────────────────────────────────────
// WALLET CARD
// ─────────────────────────────────────────
const WalletCard = ({
  balance = 0,
  rate = 0,
  onDepositPress = null,
  onWithdrawPress = null,
  showActions = true,
  style = {},
}) => {
  // Entrance animations
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const balanceScaleAnim = useRef(new Animated.Value(0.8)).current;

  // Glow pulse animation
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Entrance
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: animations.duration.slow,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        useNativeDriver: true,
        ...animations.spring.gentle,
      }),
      Animated.spring(balanceScaleAnim, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
        ...animations.spring.bouncy,
      }),
    ]).start();

    // Glow pulse loop
    const glowLoop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]),
    );
    glowLoop.start();

    return () => glowLoop.stop();
  }, []);

  const glowOpacity = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.6],
  });

  return (
    <Animated.View
      style={[
        styles.container,
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      {/* Outer glow */}
      <Animated.View
        style={[styles.outerGlow, { opacity: glowOpacity }]}
        pointerEvents="none"
      />

      {/* Card */}
      <LinearGradient
        colors={gradients.walletCard.colors}
        start={gradients.walletCard.start}
        end={gradients.walletCard.end}
        style={styles.card}>

        {/* Decorative circles */}
        <View style={styles.decorCircle1} />
        <View style={styles.decorCircle2} />
        <View style={styles.decorCircle3} />

        {/* Top Row — Label + Network */}
        <View style={styles.topRow}>
          <View style={styles.labelRow}>
            <Icon
              name="wallet-outline"
              size={16}
              color="rgba(255,255,255,0.7)"
            />
            <Text style={styles.walletLabel}>Wallet Balance</Text>
          </View>
          <View style={styles.networkBadge}>
            <View style={styles.networkDot} />
            <Text style={styles.networkText}>USDT</Text>
          </View>
        </View>

        {/* Balance */}
        <Animated.View
          style={[
            styles.balanceRow,
            { transform: [{ scale: balanceScaleAnim }] },
          ]}>
          <Text style={styles.balanceAmount}>
            {formatUSDT(balance, false)}
          </Text>
          <Text style={styles.balanceCurrency}>USDT</Text>
        </Animated.View>

        {/* Rate */}
        <View style={styles.rateRow}>
          <Icon
            name="trending-up-outline"
            size={14}
            color="rgba(255,255,255,0.6)"
          />
          <Text style={styles.rateText}>{formatRate(rate)}</Text>
        </View>

        {/* Divider */}
        {showActions && (
          <View style={styles.cardDivider} />
        )}

        {/* Quick Actions */}
        {showActions && (
          <View style={styles.actionsRow}>
            <ActionButton
              icon="arrow-down-circle-outline"
              label="Deposit"
              onPress={onDepositPress}
            />
            <View style={styles.actionSeparator} />
            <ActionButton
              icon="arrow-up-circle-outline"
              label="Withdraw"
              onPress={onWithdrawPress}
            />
          </View>
        )}
      </LinearGradient>
    </Animated.View>
  );
};

// ─────────────────────────────────────────
// ACTION BUTTON (inside wallet card)
// ─────────────────────────────────────────
const ActionButton = ({ icon, label, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.93,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    onPress && onPress();
  };

  return (
    <TouchableWithoutFeedback
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}>
      <Animated.View
        style={[
          styles.actionButton,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <View style={styles.actionIconBox}>
          <Icon name={icon} size={20} color={colors.white} />
        </View>
        <Text style={styles.actionLabel}>{label}</Text>
      </Animated.View>
    </TouchableWithoutFeedback>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.lg,
    position: 'relative',
  },

  outerGlow: {
    position: 'absolute',
    top: -10,
    left: -10,
    right: -10,
    bottom: -10,
    borderRadius: radius.card + 10,
    backgroundColor: colors.glowPurple,
    zIndex: -1,
  },

  card: {
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    overflow: 'hidden',
    ...shadows.walletCard,
  },

  // Decorative circles
  decorCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.06)',
    top: -60,
    right: -40,
  },
  decorCircle2: {
    position: 'absolute',
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: -30,
    left: -20,
  },
  decorCircle3: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: 20,
    right: 80,
  },

  // Top row
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.sm,
  },

  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  walletLabel: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },

  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: spacing.sm,
    paddingVertical: 3,
    borderRadius: radius.badge,
    gap: spacing.xs,
  },

  networkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.seafoam,
    marginRight: 4,
  },

  networkText: {
    ...typography.styles.caption,
    color: colors.white,
    fontSize: 11,
    fontWeight: '600',
  },

  // Balance
  balanceRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: spacing.xs,
    marginTop: spacing.xs,
  },

  balanceAmount: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 38,
    color: colors.white,
    letterSpacing: 0.5,
    lineHeight: 46,
  },

  balanceCurrency: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 16,
    color: 'rgba(255,255,255,0.7)',
    marginLeft: spacing.xs,
    marginBottom: 6,
  },

  // Rate
  rateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.xs,
  },

  rateText: {
    ...typography.styles.caption,
    color: 'rgba(255,255,255,0.65)',
    marginLeft: 4,
  },

  // Divider
  cardDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    marginBottom: spacing.md,
  },

  // Actions
  actionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
  },

  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: radius.sm,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  actionLabel: {
    ...typography.styles.buttonText,
    fontSize: 15,
    marginLeft: spacing.xs,
  },

  actionSeparator: {
    width: 1,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.2)',
    marginHorizontal: spacing.md,
  },
});

export default WalletCard;