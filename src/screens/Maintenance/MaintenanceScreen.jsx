// ============================================================
// CandyPay — Maintenance Screen
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableWithoutFeedback,
  Linking,
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
import { useSettings } from '../../hooks/useApp';
import { ScreenWrapper } from '../../components';

// ─────────────────────────────────────────
// MAINTENANCE SCREEN
// ─────────────────────────────────────────
const MaintenanceScreen = () => {
  const { settings } = useSettings();

  // ─── Animations ───
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const iconAnim = useRef(new Animated.Value(0)).current;
  const gear1Anim = useRef(new Animated.Value(0)).current;
  const gear2Anim = useRef(new Animated.Value(0)).current;

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
      Animated.spring(iconAnim, {
        toValue: 1,
        delay: 300,
        useNativeDriver: true,
        ...animations.spring.bouncy,
      }),
    ]).start();

    // Gear rotation loops
    const gear1Loop = Animated.loop(
      Animated.timing(gear1Anim, {
        toValue: 1,
        duration: 4000,
        useNativeDriver: true,
      }),
    );

    const gear2Loop = Animated.loop(
      Animated.timing(gear2Anim, {
        toValue: 1,
        duration: 3000,
        useNativeDriver: true,
      }),
    );

    gear1Loop.start();
    gear2Loop.start();

    return () => {
      gear1Loop.stop();
      gear2Loop.stop();
    };
  }, []);

  const gear1Rotate = gear1Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const gear2Rotate = gear2Anim.interpolate({
    inputRange: [0, 1],
    outputRange: ['360deg', '0deg'],
  });

  const handleContactSupport = () => {
    const whatsapp = settings?.support_whatsapp ?? '';
    if (whatsapp) {
      const msg = encodeURIComponent(
        'CandyPay is showing maintenance mode. When will it be back?',
      );
      Linking.openURL(
        `https://wa.me/${whatsapp.replace(/\D/g, '')}?text=${msg}`,
      );
    }
  };

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

        {/* ── Gear Animation ── */}
        <View style={styles.gearsContainer}>
          {/* Background glow */}
          <View style={styles.gearsGlow} />

          {/* Large gear */}
          <Animated.View
            style={[
              styles.gear1,
              { transform: [{ rotate: gear1Rotate }] },
            ]}>
            <Icon
              name="settings-outline"
              size={80}
              color={`${colors.accent}60`}
            />
          </Animated.View>

          {/* Small gear */}
          <Animated.View
            style={[
              styles.gear2,
              { transform: [{ rotate: gear2Rotate }] },
            ]}>
            <Icon
              name="settings-outline"
              size={44}
              color={`${colors.secondary}50`}
            />
          </Animated.View>

          {/* Center icon */}
          <Animated.View
            style={[
              styles.centerIconWrapper,
              { transform: [{ scale: iconAnim }] },
            ]}>
            <LinearGradient
              colors={gradients.primary.colors}
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.centerIcon}>
              <Icon
                name="construct-outline"
                size={36}
                color={colors.white}
              />
            </LinearGradient>
          </Animated.View>
        </View>

        {/* ── Text ── */}
        <Text style={styles.title}>Under Maintenance</Text>
        <Text style={styles.subtitle}>
          CandyPay is currently undergoing scheduled maintenance
          to improve your experience.
        </Text>

        {/* ── Info Card ── */}
        <View style={styles.infoCard}>
          {[
            {
              icon: 'time-outline',
              color: colors.statusPending,
              title: 'Estimated Duration',
              desc: 'Usually takes 30–60 minutes',
            },
            {
              icon: 'shield-checkmark-outline',
              color: colors.cryptoGreen,
              title: 'Your Funds Are Safe',
              desc: 'All balances are secure during maintenance',
            },
            {
              icon: 'notifications-outline',
              color: colors.accent,
              title: 'Auto Refresh',
              desc: 'App will restore automatically when ready',
            },
          ].map((item, index) => (
            <View
              key={index}
              style={[
                styles.infoItem,
                index < 2 && styles.infoItemBorder,
              ]}>
              <View
                style={[
                  styles.infoIconBox,
                  { backgroundColor: `${item.color}15` },
                ]}>
                <Icon
                  name={item.icon}
                  size={20}
                  color={item.color}
                />
              </View>
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>{item.title}</Text>
                <Text style={styles.infoDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── Contact Support ── */}
        {settings?.support_whatsapp ? (
          <TouchableWithoutFeedback onPress={handleContactSupport}>
            <View style={styles.supportButton}>
              <LinearGradient
                colors={['#25D366', '#128C7E']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.supportGradient}>
                <Icon
                  name="logo-whatsapp"
                  size={20}
                  color={colors.white}
                />
                <Text style={styles.supportText}>
                  Contact Support
                </Text>
              </LinearGradient>
            </View>
          </TouchableWithoutFeedback>
        ) : null}

        {/* App name */}
        <View style={styles.brandRow}>
          <LinearGradient
            colors={gradients.primary.colors}
            start={gradients.primary.start}
            end={gradients.primary.end}
            style={styles.brandIcon}>
            <Icon
              name="logo-bitcoin"
              size={16}
              color={colors.white}
            />
          </LinearGradient>
          <Text style={styles.brandName}>CandyPay</Text>
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

  // Gears
  gearsContainer: {
    position: 'relative',
    width: 160,
    height: 160,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },

  gearsGlow: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: colors.glowPurple,
  },

  gear1: {
    position: 'absolute',
    top: 0,
    left: 0,
  },

  gear2: {
    position: 'absolute',
    bottom: 0,
    right: 0,
  },

  centerIconWrapper: {
    zIndex: 10,
  },

  centerIcon: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadows.walletCard,
  },

  // Text
  title: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 24,
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

  // Info Card
  infoCard: {
    width: '100%',
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderCard,
    overflow: 'hidden',
    marginBottom: spacing.xl,
  },

  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },

  infoItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  infoIconBox: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  infoText: {
    flex: 1,
  },

  infoTitle: {
    ...typography.styles.label,
    color: colors.textPrimary,
    marginBottom: 3,
  },

  infoDesc: {
    ...typography.styles.caption,
    color: colors.textMuted,
    lineHeight: 16,
  },

  // Support Button
  supportButton: {
    width: '100%',
    borderRadius: radius.button,
    overflow: 'hidden',
    marginBottom: spacing.lg,
    ...shadows.button,
  },

  supportGradient: {
    height: spacing.buttonHeight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    borderRadius: radius.button,
  },

  supportText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: colors.white,
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },

  // Brand
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },

  brandIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },

  brandName: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 16,
    color: colors.textMuted,
    letterSpacing: 0.5,
    marginLeft: spacing.xs,
  },
});

export default MaintenanceScreen;