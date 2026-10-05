// ============================================================
// CandyPay — Common Components
// ScreenWrapper, GlassCard, Divider, SectionHeader, EmptyState
// ============================================================

import React, { useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
  Animated,
  Image,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import {
  colors,
  gradients,
  spacing,
  radius,
  shadows,
  typography,
  animations,
} from '../../theme';

// ─────────────────────────────────────────
// 1. SCREEN WRAPPER
// Used by every screen
// Handles SafeArea, Background, Keyboard,
// ScrollView, Pull to Refresh
// ─────────────────────────────────────────
export const ScreenWrapper = ({
  children,
  scrollable = false,
  keyboardAware = false,
  refreshing = false,
  onRefresh = null,
  style = {},
  contentStyle = {},
  showsVerticalScrollIndicator = false,
  edges = ['top', 'left', 'right'],
}) => {
  // Background blob animations
  const blob1Anim = useRef(new Animated.Value(0)).current;
  const blob2Anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(blob1Anim, {
        toValue: 1,
        duration: animations.duration.verySlow,
        useNativeDriver: true,
      }),
      Animated.timing(blob2Anim, {
        toValue: 1,
        duration: animations.duration.verySlow,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const content = scrollable ? (
    <ScrollView
      style={[styles.scrollView, style]}
      contentContainerStyle={[
        styles.scrollContent,
        contentStyle,
      ]}
      showsVerticalScrollIndicator={showsVerticalScrollIndicator}
      keyboardShouldPersistTaps="handled"
      refreshControl={
        onRefresh ? (
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.backgroundSecondary}
          />
        ) : undefined
      }>
      {children}
    </ScrollView>
  ) : (
    <View style={[styles.staticContent, style, contentStyle]}>
      {children}
    </View>
  );

  const wrappedContent = keyboardAware ? (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        {content}
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  ) : (
    content
  );

  return (
    <SafeAreaView style={styles.safeArea} edges={edges}>
      {/* Background */}
      <View style={styles.background} />

      {/* Background Blobs */}
      <Animated.View
        style={[
          styles.blob1,
          {
            opacity: blob1Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
        pointerEvents="none">
        <LinearGradient
          colors={gradients.blobPurple.colors}
          start={gradients.blobPurple.start}
          end={gradients.blobPurple.end}
          style={styles.blobGradient}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.blob2,
          {
            opacity: blob2Anim.interpolate({
              inputRange: [0, 1],
              outputRange: [0, 1],
            }),
          },
        ]}
        pointerEvents="none">
        <LinearGradient
          colors={gradients.blobPink.colors}
          start={gradients.blobPink.start}
          end={gradients.blobPink.end}
          style={styles.blobGradient}
        />
      </Animated.View>

      {/* Content */}
      {wrappedContent}
    </SafeAreaView>
  );
};

// ─────────────────────────────────────────
// 2. GLASS CARD
// Base glass container
// Used everywhere for cards
// ─────────────────────────────────────────
// ✅ Fixed GlassCard — replace the onPress handler

export const GlassCard = ({
  children,
  style = {},
  onPress = null,
  glowColor = null,
  noPadding = false,
}) => {
  const cardContent = (
    <View
      style={[
        styles.glassCard,
        noPadding && styles.noPadding,
        glowColor && {
          shadowColor: glowColor,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
          borderColor: `${glowColor}30`,
        },
        style,
      ]}>
      <LinearGradient
        colors={gradients.glassCard.colors}
        start={gradients.glassCard.start}
        end={gradients.glassCard.end}
        style={styles.glassOverlay}
        pointerEvents="none"
      />
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={onPress}
        delayPressIn={100}>
        {cardContent}
      </TouchableOpacity>
    );
  }

  return cardContent;
};

// ─────────────────────────────────────────
// 3. DIVIDER
// Thin horizontal separator
// ─────────────────────────────────────────
export const Divider = ({
  style = {},
  color = colors.divider,
  thickness = 1,
  marginVertical = spacing.md,
}) => (
  <View
    style={[
      styles.divider,
      {
        backgroundColor: color,
        height: thickness,
        marginVertical,
      },
      style,
    ]}
  />
);

// ─────────────────────────────────────────
// 4. SECTION HEADER
// Label above a section
// ─────────────────────────────────────────
export const SectionHeader = ({
  title,
  rightText = null,
  onRightPress = null,
  style = {},
}) => (
  <View style={[styles.sectionHeader, style]}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {rightText ? (
      <TouchableWithoutFeedback onPress={onRightPress}>
        <Text style={styles.sectionRight}>{rightText}</Text>
      </TouchableWithoutFeedback>
    ) : null}
  </View>
);

// ─────────────────────────────────────────
// 5. EMPTY STATE
// Shown when lists are empty
// ─────────────────────────────────────────
export const EmptyState = ({
  illustration = null,
  title = 'Nothing Here',
  description = '',
  actionLabel = null,
  onAction = null,
  style = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.emptyContainer,
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      {/* Illustration */}
      {illustration ? (
        <View style={styles.emptyIllustration}>
          <Image
            source={illustration}
            style={styles.emptyImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.emptyIconContainer}>
          <LinearGradient
            colors={gradients.primary.colors}
            start={gradients.primary.start}
            end={gradients.primary.end}
            style={styles.emptyIconGradient}>
            <Icon name="file-tray-outline" size={36} color={colors.white} />
          </LinearGradient>
        </View>
      )}

      {/* Text */}
      <Text style={styles.emptyTitle}>{title}</Text>
      {description ? (
        <Text style={styles.emptyDescription}>{description}</Text>
      ) : null}

      {/* Action */}
      {actionLabel && onAction ? (
        <TouchableWithoutFeedback onPress={onAction}>
          <View style={styles.emptyAction}>
            <LinearGradient
              colors={gradients.primary.colors}
              start={gradients.primary.start}
              end={gradients.primary.end}
              style={styles.emptyActionGradient}>
              <Text style={styles.emptyActionText}>{actionLabel}</Text>
            </LinearGradient>
          </View>
        </TouchableWithoutFeedback>
      ) : null}
    </Animated.View>
  );
};

// ─────────────────────────────────────────
// 6. FADE IN VIEW
// Animate any view on mount
// ─────────────────────────────────────────
export const FadeInView = ({
  children,
  delay = 0,
  duration = animations.duration.normal,
  style = {},
}) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration,
        delay,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        delay,
        useNativeDriver: true,
        ...animations.spring.gentle,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View
      style={[
        style,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}>
      {children}
    </Animated.View>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  // ScreenWrapper
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  background: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
  blob1: {
    position: 'absolute',
    top: -100,
    right: -80,
    width: 300,
    height: 300,
    borderRadius: 150,
    overflow: 'hidden',
  },
  blob2: {
    position: 'absolute',
    bottom: 100,
    left: -100,
    width: 280,
    height: 280,
    borderRadius: 140,
    overflow: 'hidden',
  },
  blobGradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 120,
  },
  staticContent: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },

  // GlassCard
  glassCard: {
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.card,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: spacing.cardPadding,
    overflow: 'hidden',
    position: 'relative',
    ...shadows.card,
  },
  noPadding: {
    padding: 0,
  },
  glassOverlay: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: radius.card,
    pointerEvents: 'none',
  },

  // Divider
  divider: {
    width: '100%',
    borderRadius: radius.full,
  },

  // SectionHeader
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    paddingHorizontal: spacing.screenHorizontal,
  },
  sectionTitle: {
    ...typography.styles.sectionTitle,
  },
  sectionRight: {
    ...typography.styles.link,
    fontSize: 13,
  },

  // EmptyState
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xl,
    paddingVertical: spacing.xxl,
  },
  emptyIllustration: {
    marginBottom: spacing.lg,
  },
  emptyImage: {
    width: 160,
    height: 160,
  },
  emptyIconContainer: {
    marginBottom: spacing.lg,
  },
  emptyIconGradient: {
    width: 80,
    height: 80,
    borderRadius: radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    ...typography.styles.cardTitle,
    marginBottom: spacing.sm,
    textAlign: 'center',
  },
  emptyDescription: {
    ...typography.styles.bodyMuted,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: spacing.lg,
  },
  emptyAction: {
    borderRadius: radius.button,
    overflow: 'hidden',
    marginTop: spacing.sm,
  },
  emptyActionGradient: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.button,
  },
  emptyActionText: {
    ...typography.styles.buttonText,
    fontSize: 14,
  },
});