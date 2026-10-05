// ============================================================
// CandyPay — No Internet Screen
// ============================================================

import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
  shadows,
} from '../../theme';
import { useNetworkStatus } from '../../hooks/useApp';

import { ScreenWrapper } from '../../components';

// ─────────────────────────────────────────
// NO INTERNET SCREEN
// ─────────────────────────────────────────
const NoInternetScreen = ({ navigation }) => {
  const { isConnected, checkConnection } = useNetworkStatus();
  const [isRetrying, setIsRetrying] = useState(false);

  // ─── Animations ───
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const iconScaleAnim = useRef(new Animated.Value(0.8)).current;
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

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
      Animated.spring(iconScaleAnim, {
        toValue: 1,
        delay: 200,
        useNativeDriver: true,
        ...animations.spring.bouncy,
      }),
    ]).start();

    // Pulse loop
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.08,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  // ─── Auto navigate back if connected ───
  useEffect(() => {
    if (isConnected) {
      navigation.goBack();
    }
  }, [isConnected]);

  // ─── Retry ───
  const handleRetry = async () => {
    if (isRetrying) return;

    // Rotate animation
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start(() => rotateAnim.setValue(0));

    setIsRetrying(true);
    await checkConnection();
    setTimeout(() => setIsRetrying(false), 1000);
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <ScreenWrapper>
      <Animated.View
        style={[
          styles.container,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}>

        {/* ── Icon Section ── */}
        <Animated.View
          style={[
            styles.iconWrapper,
            { transform: [{ scale: iconScaleAnim }] },
          ]}>
          {/* Outer pulse ring */}
          <Animated.View
            style={[
              styles.pulseRing,
              { transform: [{ scale: pulseAnim }] },
            ]}
          />

          {/* Icon container */}
          <LinearGradient
            colors={[
              'rgba(255,76,76,0.25)',
              'rgba(255,76,76,0.10)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.iconContainer}>
            <Icon
              name="wifi-outline"
              size={56}
              color={colors.statusRejected}
            />

            {/* X overlay */}
            <View style={styles.iconXBadge}>
              <Icon
                name="close"
                size={14}
                color={colors.white}
              />
            </View>
          </LinearGradient>
        </Animated.View>

        {/* ── Text ── */}
        <Text style={styles.title}>No Internet Connection</Text>
        <Text style={styles.subtitle}>
          You're currently offline. Please check your Wi-Fi or
          mobile data and try again.
        </Text>

        {/* ── Tips ── */}
        <View style={styles.tipsCard}>
          {[
            { icon: 'wifi-outline', text: 'Check Wi-Fi connection' },
            {
              icon: 'cellular-outline',
              text: 'Check mobile data',
            },
            {
              icon: 'airplane-outline',
              text: 'Disable airplane mode',
            },
            {
              icon: 'refresh-outline',
              text: 'Restart your device if needed',
            },
          ].map((tip, index) => (
            <View key={index} style={styles.tipItem}>
              <View style={styles.tipIconBox}>
                <Icon
                  name={tip.icon}
                  size={16}
                  color={colors.accent}
                />
              </View>
              <Text style={styles.tipText}>{tip.text}</Text>
            </View>
          ))}
        </View>

        {/* ── Retry Button ── */}
        <TouchableWithoutFeedback
          onPress={handleRetry}
          disabled={isRetrying}>
          <View
            style={[
              styles.retryButton,
              isRetrying && styles.retryButtonDisabled,
            ]}>
            <LinearGradient
              colors={
                isRetrying
                  ? [colors.textDisabled, colors.textDisabled]
                  : gradients.primary.colors
              }
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.retryGradient}>
              <Animated.View
                style={{ transform: [{ rotate }] }}>
                <Icon
                  name="refresh-outline"
                  size={20}
                  color={colors.white}
                />
              </Animated.View>
              <Text style={styles.retryText}>
                {isRetrying ? 'Checking...' : 'Try Again'}
              </Text>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>

        {/* Status indicator */}
        <View style={styles.statusRow}>
          <View
            style={[
              styles.statusDot,
              {
                backgroundColor: isConnected
                  ? colors.statusApproved
                  : colors.statusRejected,
              },
            ]}
          />
          <Text style={styles.statusText}>
            {isConnected ? 'Connected' : 'Disconnected'}
          </Text>
        </View>
      </Animated.View>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
  },

  // Icon
  iconWrapper: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  pulseRing: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: `${colors.statusRejected}30`,
    backgroundColor: `${colors.statusRejected}08`,
  },

  iconContainer: {
    width: 110,
    height: 110,
    borderRadius: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${colors.statusRejected}30`,
    position: 'relative',
  },

  iconXBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.statusRejected,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Text
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    color: colors.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
    letterSpacing: 0.3,
  },

  subtitle: {
    ...typography.styles.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.xl,
    paddingHorizontal: spacing.md,
  },

  // Tips
  tipsCard: {
    width: '100%',
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: spacing.md,
    marginBottom: spacing.xl,
  },

  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    gap: spacing.sm,
  },

  tipIconBox: {
    width: 30,
    height: 30,
    borderRadius: radius.xs,
    backgroundColor: `${colors.accent}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },

  tipText: {
    ...typography.styles.body,
    fontSize: 14,
    color: colors.textSecondary,
    flex: 1,
    marginLeft: spacing.xs,
  },

  // Retry
  retryButton: {
    width: '100%',
    borderRadius: radius.button,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.button,
  },

  retryButtonDisabled: {
    opacity: 0.6,
  },

  retryGradient: {
    height: spacing.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.button,
  },

  retryText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },

  // Status
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },

  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },

  statusText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginLeft: spacing.xs,
  },
});

export default NoInternetScreen;