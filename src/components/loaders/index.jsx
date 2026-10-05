// ============================================================
// CandyPay — Loader Components
// LoadingOverlay, SkeletonLoader
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Animated,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
} from '../../theme';

// ─────────────────────────────────────────
// 1. LOADING OVERLAY
// Full screen loading modal
// ─────────────────────────────────────────
export const LoadingOverlay = ({
  visible = false,
  message = 'Please wait...',
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: animations.duration.fast,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
          ...animations.spring.gentle,
        }),
      ]).start();
    } else {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: animations.duration.fast,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent>
      <Animated.View style={[styles.overlayContainer, { opacity: fadeAnim }]}>
        <Animated.View
          style={[
            styles.overlayCard,
            { transform: [{ scale: scaleAnim }] },
          ]}>
          {/* Gradient ring */}
          <View style={styles.loaderRing}>
            <LinearGradient
              colors={gradients.primary.colors}
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.loaderRingGradient}>
              <View style={styles.loaderRingInner}>
                <ActivityIndicator
                  size="large"
                  color={colors.primary}
                />
              </View>
            </LinearGradient>
          </View>

          <Text style={styles.overlayMessage}>{message}</Text>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
};

// ─────────────────────────────────────────
// 2. SKELETON BLOCK
// Single animated skeleton block
// ─────────────────────────────────────────
const SkeletonBlock = ({ width, height, borderRadius = radius.sm, style = {} }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 900,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  const opacity = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.3, 0.7],
  });

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.backgroundCard,
          opacity,
        },
        style,
      ]}
    />
  );
};

// ─────────────────────────────────────────
// 3. WALLET CARD SKELETON
// ─────────────────────────────────────────
export const WalletCardSkeleton = () => (
  <View style={styles.walletCardSkeleton}>
    <SkeletonBlock width="40%" height={14} borderRadius={radius.xs} />
    <SkeletonBlock
      width="70%"
      height={36}
      borderRadius={radius.sm}
      style={{ marginTop: spacing.sm }}
    />
    <SkeletonBlock
      width="50%"
      height={12}
      borderRadius={radius.xs}
      style={{ marginTop: spacing.sm }}
    />
    <View style={styles.skeletonButtonRow}>
      <SkeletonBlock width="45%" height={44} borderRadius={radius.md} />
      <SkeletonBlock width="45%" height={44} borderRadius={radius.md} />
    </View>
  </View>
);

// ─────────────────────────────────────────
// 4. TRANSACTION CARD SKELETON
// ─────────────────────────────────────────
export const TransactionCardSkeleton = () => (
  <View style={styles.transactionSkeleton}>
    <SkeletonBlock
      width={44}
      height={44}
      borderRadius={radius.full}
    />
    <View style={styles.transactionSkeletonInfo}>
      <SkeletonBlock width="60%" height={14} borderRadius={radius.xs} />
      <SkeletonBlock
        width="40%"
        height={11}
        borderRadius={radius.xs}
        style={{ marginTop: spacing.xs }}
      />
    </View>
    <View style={styles.transactionSkeletonRight}>
      <SkeletonBlock width={70} height={14} borderRadius={radius.xs} />
      <SkeletonBlock
        width={50}
        height={20}
        borderRadius={radius.badge}
        style={{ marginTop: spacing.xs }}
      />
    </View>
  </View>
);

// ─────────────────────────────────────────
// 5. LIST SKELETON
// Multiple transaction skeletons
// ─────────────────────────────────────────
export const ListSkeleton = ({ count = 5 }) => (
  <View style={styles.listSkeleton}>
    {Array.from({ length: count }).map((_, i) => (
      <TransactionCardSkeleton key={i} />
    ))}
  </View>
);

// ─────────────────────────────────────────
// 6. CARD SKELETON
// Generic card placeholder
// ─────────────────────────────────────────
export const CardSkeleton = ({
  height = 80,
  style = {},
}) => (
  <View
    style={[
      styles.cardSkeleton,
      { minHeight: height },
      style,
    ]}>
    <SkeletonBlock width="30%" height={12} borderRadius={radius.xs} />
    <SkeletonBlock
      width="80%"
      height={16}
      borderRadius={radius.xs}
      style={{ marginTop: spacing.sm }}
    />
    <SkeletonBlock
      width="50%"
      height={12}
      borderRadius={radius.xs}
      style={{ marginTop: spacing.xs }}
    />
  </View>
);

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  // LoadingOverlay
  overlayContainer: {
    flex: 1,
    backgroundColor: colors.backgroundOverlay,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlayCard: {
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.modal,
    padding: spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.borderCard,
    minWidth: 180,
  },

  loaderRing: {
    width: 72,
    height: 72,
    borderRadius: radius.full,
    overflow: 'hidden',
    marginBottom: spacing.md,
  },

  loaderRingGradient: {
    flex: 1,
    padding: 2,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loaderRingInner: {
    flex: 1,
    width: '100%',
    backgroundColor: colors.backgroundSecondary,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },

  overlayMessage: {
    ...typography.styles.bodyMuted,
    textAlign: 'center',
  },

  // Skeletons
  walletCardSkeleton: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    marginHorizontal: spacing.screenHorizontal,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },

  skeletonButtonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: spacing.md,
  },

  transactionSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.sm,
    marginBottom: spacing.sm,
  },

  transactionSkeletonInfo: {
    flex: 1,
    marginLeft: spacing.md,
  },

  transactionSkeletonRight: {
    alignItems: 'flex-end',
  },

  listSkeleton: {
    paddingTop: spacing.sm,
  },

  cardSkeleton: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.card,
    padding: spacing.cardPadding,
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.sm,
    borderWidth: 1,
    borderColor: colors.borderCard,
  },
});