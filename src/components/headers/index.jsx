// ============================================================
// CandyPay — App Header Component
// Reusable screen header with back button
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {
  colors,
  spacing,
  typography,
  radius,
  gradients,
  animations,
} from '../../theme';

// ─────────────────────────────────────────
// APP HEADER
// Consistent header across all stack screens
// ─────────────────────────────────────────
export const AppHeader = ({
  title,
  subtitle = null,
  onBack = null,
  navigation = null,
  rightComponent = null,
  rightIcon = null,
  onRightPress = null,
  transparent = false,
  style = {},
}) => {
  const backScaleAnim = useRef(new Animated.Value(1)).current;

  const handleBackPressIn = () => {
    Animated.spring(backScaleAnim, {
      toValue: 0.88,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handleBackPressOut = () => {
    Animated.spring(backScaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    if (onBack) {
      onBack();
    } else if (navigation) {
      navigation.goBack();
    }
  };

  const showBack = !!(onBack || navigation);

  return (
    <View
      style={[
        styles.header,
        transparent && styles.transparent,
        style,
      ]}>
      {/* Left — Back Button */}
      <View style={styles.headerLeft}>
        {showBack ? (
          <TouchableWithoutFeedback
            onPressIn={handleBackPressIn}
            onPressOut={handleBackPressOut}>
            <Animated.View
              style={[
                styles.backButton,
                { transform: [{ scale: backScaleAnim }] },
              ]}>
              <Icon
                name="arrow-back"
                size={22}
                color={colors.textPrimary}
              />
            </Animated.View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>

      {/* Center — Title */}
      <View style={styles.headerCenter}>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.headerSubtitle} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>

      {/* Right — Action */}
      <View style={styles.headerRight}>
        {rightComponent ? (
          rightComponent
        ) : rightIcon ? (
          <TouchableWithoutFeedback onPress={onRightPress}>
            <View style={styles.rightButton}>
              <Icon
                name={rightIcon}
                size={22}
                color={colors.textPrimary}
              />
            </View>
          </TouchableWithoutFeedback>
        ) : (
          <View style={styles.backPlaceholder} />
        )}
      </View>
    </View>
  );
};

// ─────────────────────────────────────────
// HOME HEADER
// Special header for HomeScreen
// Shows greeting + notification
// ─────────────────────────────────────────
export const HomeHeader = ({
  greeting,
  name,
  style = {},
}) => (
  <View style={[styles.homeHeader, style]}>
    <View>
      <Text style={styles.homeGreeting}>{greeting}</Text>
      <Text style={styles.homeName}>{name} 👋</Text>
    </View>
    {/* Notification icon — reserved for future */}
    <View style={styles.notificationPlaceholder} />
  </View>
);

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
    backgroundColor: colors.transparent,
  },

  transparent: {
    backgroundColor: 'transparent',
  },

  headerLeft: {
    width: 44,
    alignItems: 'flex-start',
  },

  headerCenter: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: spacing.sm,
  },

  headerRight: {
    width: 44,
    alignItems: 'flex-end',
  },

  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  backPlaceholder: {
    width: 40,
    height: 40,
  },

  rightButton: {
    width: 40,
    height: 40,
    borderRadius: radius.sm,
    backgroundColor: colors.backgroundCard,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  headerTitle: {
    ...typography.styles.cardTitle,
    fontSize: 18,
    textAlign: 'center',
  },

  headerSubtitle: {
    ...typography.styles.caption,
    textAlign: 'center',
    marginTop: 2,
  },

  // Home Header
  homeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    paddingVertical: spacing.md,
  },

  homeGreeting: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
  },

  homeName: {
    ...typography.styles.cardTitle,
    fontSize: 20,
    marginTop: 2,
  },

  notificationPlaceholder: {
    width: 40,
    height: 40,
  },
});