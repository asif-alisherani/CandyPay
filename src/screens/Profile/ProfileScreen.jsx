// ============================================================
// CandyPay — Profile Screen
// User info, referral, menu items, logout
// ============================================================

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
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
import { useAuthContext } from '../../context';
import useAuth from '../../hooks/useAuth';
import { useClipboard } from '../../hooks/useApp';
import { formatDate } from '../../utils';

import {
  ScreenWrapper,
  GlassCard,
  FadeInView,
  ConfirmationModal,
  MenuItem,
  InfoRow,
  Divider,
} from '../../components';

// ─────────────────────────────────────────
// PROFILE AVATAR
// Large gradient avatar with initials
// ─────────────────────────────────────────
const ProfileAvatar = ({ name, email, referralCode, onCopy, copied }) => {
  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .substring(0, 2)
    : 'U';

  return (
    <View style={avatarStyles.container}>
      {/* Glow */}
      <View style={avatarStyles.glow} />

      {/* Avatar */}
      <LinearGradient
        colors={gradients.walletCard.colors}
        start={gradients.walletCard.start}
        end={gradients.walletCard.end}
        style={avatarStyles.avatar}>
        <Text style={avatarStyles.initials}>{initials}</Text>
      </LinearGradient>

      {/* Name */}
      <Text style={avatarStyles.name}>{name}</Text>
      <Text style={avatarStyles.email}>{email}</Text>

      {/* Referral Code */}
      <TouchableWithoutFeedback
        onPress={onCopy}>
        <View
          style={[
            avatarStyles.referralBadge,
            copied && avatarStyles.referralBadgeCopied,
          ]}>
          <Icon
            name={copied ? 'checkmark-circle' : 'people-outline'}
            size={14}
            color={copied ? colors.cryptoGreen : colors.accent}
          />
          <Text
            style={[
              avatarStyles.referralLabel,
              copied && { color: colors.cryptoGreen },
            ]}>
            {copied ? 'Copied!' : 'Referral:'}
          </Text>
          <Text
            style={[
              avatarStyles.referralCode,
              copied && { color: colors.cryptoGreen },
            ]}>
            {referralCode}
          </Text>
          <Icon
            name="copy-outline"
            size={12}
            color={copied ? colors.cryptoGreen : colors.textMuted}
          />
        </View>
      </TouchableWithoutFeedback>
    </View>
  );
};

const avatarStyles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
    position: 'relative',
  },
  glow: {
    position: 'absolute',
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: colors.glowPurple,
    top: spacing.md,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    ...shadows.walletCard,
  },
  initials: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 36,
    color: colors.white,
    letterSpacing: 1,
  },
  name: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    color: colors.white,
    marginBottom: spacing.xs,
    letterSpacing: 0.3,
  },
  email: {
    ...typography.styles.bodyMuted,
    fontSize: 14,
    marginBottom: spacing.md,
  },
  referralBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent}15`,
    borderWidth: 1,
    borderColor: `${colors.accent}30`,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs + 2,
    borderRadius: radius.badge,
    gap: spacing.xs,
  },
  referralBadgeCopied: {
    backgroundColor: `${colors.cryptoGreen}15`,
    borderColor: `${colors.cryptoGreen}30`,
  },
  referralLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginLeft: 2,
  },
  referralCode: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    color: colors.accent,
    letterSpacing: 1.5,
  },
});

// ─────────────────────────────────────────
// ACCOUNT INFO CARD
// ─────────────────────────────────────────
const AccountInfoCard = ({ user }) => (
  <GlassCard style={infoStyles.card}>
    <Text style={infoStyles.cardTitle}>Account Information</Text>

    <InfoRow
      icon="mail-outline"
      iconColor={colors.accent}
      label="Email"
      value={user?.email ?? '—'}
    />
    <InfoRow
      icon="call-outline"
      iconColor={colors.cryptoGreen}
      label="Mobile"
      value={user?.mobile ?? '—'}
    />
    <InfoRow
      icon="calendar-outline"
      iconColor={colors.secondary}
      label="Joined"
      value={formatDate(user?.created_at)}
    />
    <InfoRow
      icon="shield-checkmark-outline"
      iconColor={colors.statusApproved}
      label="Status"
      value="Active"
      valueColor={colors.statusApproved}
      isLast
    />
  </GlassCard>
);

const infoStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },
  cardTitle: {
    ...typography.styles.sectionTitle,
    paddingHorizontal: spacing.cardPadding,
    paddingTop: spacing.cardPadding,
    paddingBottom: spacing.sm,
  },
});

// ─────────────────────────────────────────
// PROFILE SCREEN
// ─────────────────────────────────────────
const ProfileScreen = ({ navigation }) => {
  const { user } = useAuthContext();
  const { handleLogout, isLogoutLoading } = useAuth();
  const { copy, copied } = useClipboard();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  const onLogout = async () => {
    setLogoutModalVisible(false);
    await handleLogout(() => {
      // Navigation is handled by AppNavigator
      // which watches isLoggedIn from AuthContext
    });
  };

  return (
    <ScreenWrapper scrollable>
      {/* ── Avatar Section ── */}
      <FadeInView>
        <ProfileAvatar
          name={user?.name ?? 'User'}
          email={user?.email ?? ''}
          referralCode={user?.referral_code ?? '———'}
          onCopy={() => copy(user?.referral_code ?? '', 'Referral Code')}
          copied={copied}
        />
      </FadeInView>

      {/* ── Account Info ── */}
      <FadeInView delay={80}>
        <AccountInfoCard user={user} />
      </FadeInView>

      {/* ── Menu Card ── */}
      <FadeInView delay={140}>
        <GlassCard style={styles.menuCard}>
          <Text style={styles.menuCardTitle}>Account</Text>

          <MenuItem
            icon="business-outline"
            iconColor={colors.accent}
            label="Bank Accounts"
            onPress={() => navigation.navigate(ROUTES.BANK_ACCOUNTS)}
          />

          <MenuItem
            icon="headset-outline"
            iconColor={colors.cryptoGreen}
            label="Support"
            onPress={() => navigation.navigate(ROUTES.SUPPORT)}
          />

          <MenuItem
            icon="shield-checkmark-outline"
            iconColor={colors.secondary}
            label="About CandyPay"
            onPress={() => navigation.navigate(ROUTES.ABOUT)}
            isLast
          />
        </GlassCard>
      </FadeInView>

      {/* ── Referral Stats Card ── */}
      <FadeInView delay={180}>
        <GlassCard style={styles.referralCard}>
          <View style={styles.referralHeader}>
            <LinearGradient
              colors={gradients.secondary.colors}
              start={gradients.secondary.start}
              end={gradients.secondary.end}
              style={styles.referralIcon}>
              <Icon
                name="people-outline"
                size={18}
                color={colors.white}
              />
            </LinearGradient>
            <Text style={styles.referralTitle}>
              Referral Program
            </Text>
          </View>

          <Text style={styles.referralDesc}>
            Share your referral code and earn bonus USDT when
            your friends join and deposit.
          </Text>

          <View style={styles.referralLevels}>
            <ReferralLevel
              level="Level 1"
              percent="5%"
              color={colors.cryptoGreen}
            />
            <ReferralLevel
              level="Level 2"
              percent="3%"
              color={colors.accent}
            />
            <ReferralLevel
              level="Level 3"
              percent="1%"
              color={colors.secondary}
            />
          </View>

          {/* Copy referral */}
          <TouchableWithoutFeedback
            onPress={() =>
              copy(user?.referral_code ?? '', 'Referral Code')
            }>
            <View
              style={[
                styles.copyReferralBtn,
                copied && styles.copyReferralBtnActive,
              ]}>
              <Icon
                name={copied ? 'checkmark' : 'copy-outline'}
                size={16}
                color={copied ? colors.cryptoGreen : colors.white}
              />
              <Text
                style={[
                  styles.copyReferralText,
                  copied && { color: colors.cryptoGreen },
                ]}>
                {copied
                  ? 'Code Copied!'
                  : `Copy Code: ${user?.referral_code ?? '———'}`}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </GlassCard>
      </FadeInView>

      {/* ── Logout ── */}
      <FadeInView delay={220}>
        <GlassCard style={styles.logoutCard}>
          <MenuItem
            icon="log-out-outline"
            iconColor={colors.statusRejected}
            label="Logout"
            onPress={() => setLogoutModalVisible(true)}
            showChevron={false}
            isDanger
            isLast
          />
        </GlassCard>
      </FadeInView>

      {/* Version */}
      <FadeInView delay={260}>
        <Text style={styles.version}>CandyPay v1.0.0</Text>
      </FadeInView>

      {/* Logout Confirmation */}
      <ConfirmationModal
        visible={logoutModalVisible}
        onClose={() => setLogoutModalVisible(false)}
        onConfirm={onLogout}
        title="Logout"
        message="Are you sure you want to logout from CandyPay?"
        confirmLabel="Logout"
        cancelLabel="Cancel"
        isDanger
        isLoading={isLogoutLoading}
        icon="log-out-outline"
      />
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// REFERRAL LEVEL ITEM
// ─────────────────────────────────────────
const ReferralLevel = ({ level, percent, color }) => (
  <View style={levelStyles.container}>
    <View
      style={[
        levelStyles.dot,
        { backgroundColor: color },
      ]}
    />
    <Text style={levelStyles.level}>{level}</Text>
    <Text style={[levelStyles.percent, { color }]}>
      {percent}
    </Text>
  </View>
);

const levelStyles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: spacing.xs,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  level: {
    ...typography.styles.caption,
    color: colors.textMuted,
    flex: 1,
    marginLeft: 2,
  },
  percent: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 14,
    letterSpacing: 0.3,
  },
});

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  // Menu Card
  menuCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },

  menuCardTitle: {
    ...typography.styles.sectionTitle,
    paddingHorizontal: spacing.cardPadding,
    paddingTop: spacing.cardPadding,
    paddingBottom: spacing.sm,
  },

  // Referral Card
  referralCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  referralHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },

  referralIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },

  referralTitle: {
    ...typography.styles.cardTitle,
    fontSize: 15,
    marginLeft: spacing.xs,
  },

  referralDesc: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    lineHeight: 18,
    marginBottom: spacing.md,
  },

  referralLevels: {
    flexDirection: 'row',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  copyReferralBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: radius.button,
    paddingVertical: spacing.sm + 2,
    paddingHorizontal: spacing.lg,
    gap: spacing.sm,
  },

  copyReferralBtnActive: {
    backgroundColor: `${colors.cryptoGreen}20`,
    borderWidth: 1,
    borderColor: `${colors.cryptoGreen}40`,
  },

  copyReferralText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: colors.white,
    letterSpacing: 0.3,
    marginLeft: spacing.xs,
  },

  // Logout Card
  logoutCard: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    padding: 0,
    overflow: 'hidden',
  },

  // Version
  version: {
    ...typography.styles.caption,
    color: colors.textDisabled,
    textAlign: 'center',
    marginBottom: spacing.xxl,
  },
});

export default ProfileScreen;