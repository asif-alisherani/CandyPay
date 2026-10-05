// ============================================================
// CandyPay — About Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { APP_CONFIG } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
} from '../../theme';
import { useSettings } from '../../hooks/useApp';

import {
  ScreenWrapper,
  AppHeader,
  GlassCard,
  FadeInView,
  Divider,
  InfoRow,
} from '../../components';

// ─────────────────────────────────────────
// ABOUT SCREEN
// ─────────────────────────────────────────
const AboutScreen = ({ navigation }) => {
  const { settings } = useSettings();

  const features = [
    {
      icon: 'wallet-outline',
      color: colors.accent,
      title: 'USDT Wallet',
      desc: 'Manage your USDT balance easily.',
    },
    {
      icon: 'arrow-down-circle-outline',
      color: colors.cryptoGreen,
      title: 'Easy Deposits',
      desc: 'Deposit USDT via QR or wallet address.',
    },
    {
      icon: 'arrow-up-circle-outline',
      color: colors.secondary,
      title: 'Fast Withdrawals',
      desc: 'Withdraw USDT as INR to your bank.',
    },
    {
      icon: 'people-outline',
      color: colors.statusPending,
      title: 'Referral Rewards',
      desc: 'Earn bonus USDT for every referral.',
    },
    {
      icon: 'shield-checkmark-outline',
      color: colors.statusApproved,
      title: 'Secure & Safe',
      desc: 'Admin-verified transactions only.',
    },
  ];

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <AppHeader title="About CandyPay" navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── App Logo Hero ── */}
        <FadeInView style={styles.heroSection}>
          {/* Glow */}
          <View style={styles.heroGlow} />

          {/* Logo */}
          <LinearGradient
            colors={gradients.walletCard.colors}
            start={gradients.walletCard.start}
            end={gradients.walletCard.end}
            style={styles.logoContainer}>
            <Icon
              name="logo-bitcoin"
              size={48}
              color={colors.white}
            />
          </LinearGradient>

          {/* Name */}
          <Text style={styles.appName}>CandyPay</Text>
          <Text style={styles.tagline}>
            Your USDT Wallet, Simplified
          </Text>

          {/* Version Badge */}
          <View style={styles.versionBadge}>
            <Icon
              name="checkmark-circle"
              size={14}
              color={colors.cryptoGreen}
            />
            <Text style={styles.versionText}>
              Version {APP_CONFIG.APP_VERSION} (Build{' '}
              {APP_CONFIG.BUILD_NUMBER})
            </Text>
          </View>
        </FadeInView>

        {/* ── App Info Card ── */}
        <FadeInView delay={100}>
          <GlassCard style={styles.infoCard}>
            <InfoRow
              icon="business-outline"
              iconColor={colors.accent}
              label="Company"
              value={
                settings?.company_name ?? APP_CONFIG.COMPANY_NAME
              }
            />
            <InfoRow
              icon="code-slash-outline"
              iconColor={colors.secondary}
              label="Version"
              value={APP_CONFIG.APP_VERSION}
            />
            <InfoRow
              icon="hammer-outline"
              iconColor={colors.cryptoGreen}
              label="Build"
              value={APP_CONFIG.BUILD_NUMBER}
            />
            <InfoRow
              icon="phone-portrait-outline"
              iconColor={colors.statusPending}
              label="Platform"
              value="Android"
              isLast
            />
          </GlassCard>
        </FadeInView>

        {/* ── Features ── */}
        <FadeInView delay={150}>
          <Text style={styles.sectionTitle}>Features</Text>
          <GlassCard style={styles.featuresCard}>
            {features.map((feature, index) => (
              <View
                key={feature.title}
                style={[
                  styles.featureItem,
                  index < features.length - 1 &&
                    styles.featureItemBorder,
                ]}>
                <View
                  style={[
                    styles.featureIcon,
                    {
                      backgroundColor: `${feature.color}15`,
                    },
                  ]}>
                  <Icon
                    name={feature.icon}
                    size={20}
                    color={feature.color}
                  />
                </View>
                <View style={styles.featureText}>
                  <Text style={styles.featureTitle}>
                    {feature.title}
                  </Text>
                  <Text style={styles.featureDesc}>
                    {feature.desc}
                  </Text>
                </View>
              </View>
            ))}
          </GlassCard>
        </FadeInView>

        {/* ── Disclaimer ── */}
        <FadeInView delay={200}>
          <GlassCard style={styles.disclaimerCard}>
            <View style={styles.disclaimerHeader}>
              <Icon
                name="warning-outline"
                size={18}
                color={colors.statusPending}
              />
              <Text style={styles.disclaimerTitle}>
                Disclaimer
              </Text>
            </View>
            <Text style={styles.disclaimerText}>
              CandyPay is a manual USDT wallet management
              application. All transactions are manually verified
              by our team. CandyPay is not an exchange, trading
              platform, or automated payment gateway. Use
              responsibly.
            </Text>
          </GlassCard>
        </FadeInView>

        {/* ── Tech Stack ── */}
        <FadeInView delay={240}>
          <GlassCard style={styles.techCard}>
            <View style={styles.techHeader}>
              <Icon
                name="code-slash-outline"
                size={18}
                color={colors.accent}
              />
              <Text style={styles.techTitle}>Built With</Text>
            </View>
            <View style={styles.techGrid}>
              {[
                'React Native',
                'JavaScript',
                'React Query',
                'React Hook Form',
              ].map((tech) => (
                <View key={tech} style={styles.techBadge}>
                  <Text style={styles.techBadgeText}>{tech}</Text>
                </View>
              ))}
            </View>
          </GlassCard>
        </FadeInView>

        {/* ── Copyright ── */}
        <FadeInView delay={280}>
          <View style={styles.copyrightSection}>
            <LinearGradient
              colors={gradients.primary.colors}
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.copyrightIcon}>
              <Icon
                name="heart"
                size={16}
                color={colors.white}
              />
            </LinearGradient>
            <Text style={styles.copyrightText}>
              {APP_CONFIG.COPYRIGHT}
            </Text>
            <Text style={styles.madeWith}>
              Made with ❤️ in India
            </Text>
          </View>
        </FadeInView>
      </ScrollView>
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: spacing.xxl,
    paddingHorizontal: spacing.screenHorizontal,
    paddingTop: spacing.sm,
  },

  // Hero
  heroSection: {
    alignItems: 'center',
    paddingVertical: spacing.xl,
    position: 'relative',
  },

  heroGlow: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: colors.glowPurple,
    top: spacing.md,
  },

  logoContainer: {
    width: 96,
    height: 96,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },

  appName: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 28,
    color: colors.white,
    letterSpacing: 1,
    marginBottom: spacing.xs,
  },

  tagline: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
    textAlign: 'center',
    marginBottom: spacing.md,
  },

  versionBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.cryptoGreen}15`,
    borderWidth: 1,
    borderColor: `${colors.cryptoGreen}30`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
    gap: spacing.xs,
  },

  versionText: {
    ...typography.styles.caption,
    color: colors.cryptoGreen,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Info Card
  infoCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },

  // Section title
  sectionTitle: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.md,
  },

  // Features
  featuresCard: {
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },

  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },

  featureItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  featureText: {
    flex: 1,
  },

  featureTitle: {
    ...typography.styles.label,
    color: colors.textPrimary,
    marginBottom: 3,
  },

  featureDesc: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },

  // Disclaimer
  disclaimerCard: {
    marginBottom: spacing.md,
    borderColor: `${colors.statusPending}25`,
  },

  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.sm,
  },

  disclaimerTitle: {
    ...typography.styles.cardTitle,
    fontSize: 15,
    color: colors.statusPending,
    marginLeft: spacing.xs,
  },

  disclaimerText: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    lineHeight: 20,
  },

  // Tech
  techCard: {
    marginBottom: spacing.md,
  },

  techHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  techTitle: {
    ...typography.styles.cardTitle,
    fontSize: 15,
    marginLeft: spacing.xs,
  },

  techGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },

  techBadge: {
    backgroundColor: `${colors.accent}15`,
    borderWidth: 1,
    borderColor: `${colors.accent}30`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.badge,
  },

  techBadgeText: {
    ...typography.styles.caption,
    color: colors.accent,
    fontWeight: '600',
  },

  // Copyright
  copyrightSection: {
    alignItems: 'center',
    paddingVertical: spacing.lg,
    gap: spacing.sm,
  },

  copyrightIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xs,
  },

  copyrightText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },

  madeWith: {
    ...typography.styles.caption,
    color: colors.textDisabled,
    textAlign: 'center',
  },
});

export default AboutScreen;