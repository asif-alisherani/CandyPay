// ============================================================
// CandyPay — Support Screen
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Linking,
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
} from '../../theme';
import { useSettings } from '../../hooks/useApp';

import {
  ScreenWrapper,
  AppHeader,
  GlassCard,
  PrimaryButton,
  SecondaryButton,
  FadeInView,
} from '../../components';

// ─────────────────────────────────────────
// SUPPORT CHANNEL CARD
// ─────────────────────────────────────────
const SupportChannel = ({
  icon,
  iconColor,
  gradientColors,
  title,
  subtitle,
  buttonLabel,
  onPress,
}) => (
  <TouchableWithoutFeedback onPress={onPress}>
    <View style={channelStyles.card}>
      <LinearGradient
        colors={gradientColors}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={channelStyles.gradient}>

        {/* Icon */}
        <View
          style={[
            channelStyles.iconBox,
            { backgroundColor: `${iconColor}20` },
          ]}>
          <Icon name={icon} size={28} color={iconColor} />
        </View>

        {/* Text */}
        <View style={channelStyles.textBox}>
          <Text style={channelStyles.title}>{title}</Text>
          <Text style={channelStyles.subtitle}>{subtitle}</Text>
        </View>

        {/* Arrow */}
        <View style={channelStyles.arrow}>
          <Icon
            name="arrow-forward"
            size={18}
            color={iconColor}
          />
        </View>
      </LinearGradient>
    </View>
  </TouchableWithoutFeedback>
);

const channelStyles = StyleSheet.create({
  card: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.borderCard,
    marginBottom: spacing.sm,
  },
  gradient: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 52,
    height: 52,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBox: {
    flex: 1,
  },
  title: {
    ...typography.styles.label,
    color: colors.textPrimary,
    fontSize: 15,
    marginBottom: 3,
  },
  subtitle: {
    ...typography.styles.caption,
    color: colors.textMuted,
  },
  arrow: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─────────────────────────────────────────
// SUPPORT SCREEN
// ─────────────────────────────────────────
const SupportScreen = ({ navigation }) => {
  const { settings } = useSettings();

  const supportEmail = settings?.support_email ?? 'support@candypay.in';
  const supportMobile = settings?.support_mobile ?? '+91 98765 43210';
  const supportWhatsapp = settings?.support_whatsapp ?? '+919876543210';
  const companyName = settings?.company_name ?? 'CandyPay';

  const handleCall = () => {
    Linking.openURL(`tel:${supportMobile}`);
  };

  const handleEmail = () => {
    Linking.openURL(
      `mailto:${supportEmail}?subject=Support Request - CandyPay`,
    );
  };

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      'Hello CandyPay Support, I need help with...',
    );
    Linking.openURL(
      `https://wa.me/${supportWhatsapp.replace(/\D/g, '')}?text=${message}`,
    );
  };

  return (
    <ScreenWrapper scrollable>
      {/* Header */}
      <AppHeader title="Support" navigation={navigation} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* ── Hero Section ── */}
        <FadeInView style={styles.heroSection}>
          <LinearGradient
            colors={gradients.primary.colors}
            start={gradients.primary.start}
            end={gradients.primary.end}
            style={styles.heroIcon}>
            <Icon
              name="headset-outline"
              size={40}
              color={colors.white}
            />
          </LinearGradient>
          <Text style={styles.heroTitle}>
            How can we help?
          </Text>
          <Text style={styles.heroSubtitle}>
            Our support team is available to help you with any
            questions or issues.
          </Text>
        </FadeInView>

        {/* ── Support Channels ── */}
        <FadeInView delay={100}>
          <Text style={styles.sectionTitle}>
            Contact Channels
          </Text>

          <View style={styles.channelContainer}>
            {/* WhatsApp */}
            <SupportChannel
              icon="logo-whatsapp"
              iconColor="#25D366"
              gradientColors={[
                'rgba(37,211,102,0.10)',
                'rgba(37,211,102,0.03)',
              ]}
              title="WhatsApp"
              subtitle={supportWhatsapp}
              buttonLabel="Chat Now"
              onPress={handleWhatsApp}
            />

            {/* Phone */}
            <SupportChannel
              icon="call-outline"
              iconColor={colors.accent}
              gradientColors={[
                'rgba(160,32,240,0.10)',
                'rgba(160,32,240,0.03)',
              ]}
              title="Phone Call"
              subtitle={supportMobile}
              buttonLabel="Call Now"
              onPress={handleCall}
            />

            {/* Email */}
            <SupportChannel
              icon="mail-outline"
              iconColor={colors.secondary}
              gradientColors={[
                'rgba(224,25,184,0.10)',
                'rgba(224,25,184,0.03)',
              ]}
              title="Email Support"
              subtitle={supportEmail}
              buttonLabel="Send Email"
              onPress={handleEmail}
            />
          </View>
        </FadeInView>

        {/* ── Quick Action Buttons ── */}
        <FadeInView delay={180}>
          <GlassCard style={styles.actionCard}>
            <Text style={styles.actionCardTitle}>
              Quick Actions
            </Text>

            <PrimaryButton
              label="Chat on WhatsApp"
              onPress={handleWhatsApp}
              icon="logo-whatsapp"
              style={styles.whatsappBtn}
              gradient={{
                colors: ['#25D366', '#128C7E'],
                start: { x: 0, y: 0 },
                end: { x: 1, y: 0 },
              }}
            />

            <SecondaryButton
              label="Send Email"
              onPress={handleEmail}
              icon="mail-outline"
              style={styles.emailBtn}
            />

            <SecondaryButton
              label="Call Support"
              onPress={handleCall}
              icon="call-outline"
            />
          </GlassCard>
        </FadeInView>

        {/* ── Business Hours ── */}
        <FadeInView delay={240}>
          <GlassCard style={styles.hoursCard}>
            <View style={styles.hoursHeader}>
              <Icon
                name="time-outline"
                size={18}
                color={colors.accent}
              />
              <Text style={styles.hoursTitle}>
                Support Hours
              </Text>
            </View>

            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Monday — Friday</Text>
              <Text style={styles.hoursTime}>
                9:00 AM — 8:00 PM
              </Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Saturday</Text>
              <Text style={styles.hoursTime}>
                10:00 AM — 6:00 PM
              </Text>
            </View>
            <View style={styles.hoursRow}>
              <Text style={styles.hoursDay}>Sunday</Text>
              <Text style={[styles.hoursTime, styles.closed]}>
                Closed
              </Text>
            </View>

            <View style={styles.tzNote}>
              <Icon
                name="globe-outline"
                size={13}
                color={colors.textMuted}
              />
              <Text style={styles.tzText}>
                All times in IST (Indian Standard Time)
              </Text>
            </View>
          </GlassCard>
        </FadeInView>

        {/* ── FAQ Note ── */}
        <FadeInView delay={280}>
          <GlassCard style={styles.faqCard}>
            <View style={styles.faqRow}>
              <Icon
                name="help-circle-outline"
                size={20}
                color={colors.accent}
              />
              <View style={styles.faqText}>
                <Text style={styles.faqTitle}>
                  Common Questions
                </Text>
                <Text style={styles.faqDesc}>
                  For deposit/withdrawal queries, please include
                  your transaction hash or reference ID.
                </Text>
              </View>
            </View>
          </GlassCard>
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
  },

  heroIcon: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },

  heroTitle: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 22,
    color: colors.white,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },

  heroSubtitle: {
    ...typography.styles.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: spacing.md,
  },

  // Section
  sectionTitle: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.md,
  },

  channelContainer: {
    marginBottom: spacing.md,
  },

  // Action Card
  actionCard: {
    marginBottom: spacing.md,
  },

  actionCardTitle: {
    ...typography.styles.sectionTitle,
    marginBottom: spacing.md,
  },

  whatsappBtn: {
    marginBottom: spacing.sm,
  },

  emailBtn: {
    marginBottom: spacing.sm,
  },

  // Hours
  hoursCard: {
    marginBottom: spacing.md,
  },

  hoursHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    marginBottom: spacing.md,
  },

  hoursTitle: {
    ...typography.styles.cardTitle,
    fontSize: 15,
    marginLeft: spacing.xs,
  },

  hoursRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs + 2,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
  },

  hoursDay: {
    ...typography.styles.body,
    fontSize: 14,
  },

  hoursTime: {
    ...typography.styles.label,
    color: colors.cryptoGreen,
    fontSize: 13,
  },

  closed: {
    color: colors.statusRejected,
  },

  tzNote: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.md,
    gap: spacing.xs,
  },

  tzText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    marginLeft: 4,
  },

  // FAQ
  faqCard: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },

  faqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: spacing.md,
  },

  faqText: {
    flex: 1,
  },

  faqTitle: {
    ...typography.styles.label,
    color: colors.textPrimary,
    marginBottom: 4,
  },

  faqDesc: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    lineHeight: 18,
  },
});

export default SupportScreen;