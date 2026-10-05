// ============================================================
// CandyPay — Upload Card
// Payment screenshot upload component
// ============================================================

import React, { useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Animated,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  animations,
} from '../../theme';

// ─────────────────────────────────────────
// UPLOAD CARD
// ─────────────────────────────────────────
const UploadCard = ({
  image = null,
  onImageSelected,
  onRemove,
  label = 'Upload Payment Screenshot',
  helperText = 'Tap to upload from gallery or camera',
  error = null,
  style = {},
}) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.97,
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
  };

  const openGallery = () => {
    launchImageLibrary(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1600,
        includeBase64: false,
      },
      (response) => {
        if (
          !response.didCancel &&
          !response.error &&
          response.assets?.[0]
        ) {
          onImageSelected && onImageSelected(response.assets[0]);
        }
      },
    );
  };

  const openCamera = () => {
    launchCamera(
      {
        mediaType: 'photo',
        quality: 0.8,
        maxWidth: 1200,
        maxHeight: 1600,
        includeBase64: false,
        saveToPhotos: false,
      },
      (response) => {
        if (
          !response.didCancel &&
          !response.error &&
          response.assets?.[0]
        ) {
          onImageSelected && onImageSelected(response.assets[0]);
        }
      },
    );
  };

  // If image is selected — show preview
  if (image) {
    return (
      <View style={[styles.container, style]}>
        {label ? <Text style={styles.uploadLabel}>{label}</Text> : null}

        <View style={styles.previewContainer}>
          <Image
            source={{ uri: image.uri }}
            style={styles.previewImage}
            resizeMode="cover"
          />

          {/* Overlay actions */}
          <View style={styles.previewOverlay}>
            <TouchableWithoutFeedback onPress={openGallery}>
              <View style={styles.previewAction}>
                <Icon
                  name="image-outline"
                  size={18}
                  color={colors.white}
                />
                <Text style={styles.previewActionText}>Replace</Text>
              </View>
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback onPress={onRemove}>
              <View
                style={[
                  styles.previewAction,
                  styles.previewActionDanger,
                ]}>
                <Icon
                  name="trash-outline"
                  size={18}
                  color={colors.white}
                />
                <Text style={styles.previewActionText}>Remove</Text>
              </View>
            </TouchableWithoutFeedback>
          </View>

          {/* Success indicator */}
          <View style={styles.previewBadge}>
            <Icon
              name="checkmark-circle"
              size={20}
              color={colors.cryptoGreen}
            />
            <Text style={styles.previewBadgeText}>
              Screenshot uploaded
            </Text>
          </View>
        </View>

        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : null}
      </View>
    );
  }

  // Upload area — no image selected
  return (
    <View style={[styles.container, style]}>
      {label ? <Text style={styles.uploadLabel}>{label}</Text> : null}

      <View style={styles.uploadOptions}>
        {/* Gallery */}
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={() => {
            handlePressOut();
            openGallery();
          }}>
          <Animated.View
            style={[
              styles.uploadOption,
              { transform: [{ scale: scaleAnim }] },
            ]}>
            <LinearGradient
              colors={[
                'rgba(94,23,235,0.15)',
                'rgba(94,23,235,0.05)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.uploadOptionGradient}>
              <View style={styles.uploadIconBox}>
                <Icon
                  name="image-outline"
                  size={28}
                  color={colors.accent}
                />
              </View>
              <Text style={styles.uploadOptionLabel}>Gallery</Text>
              <Text style={styles.uploadOptionHint}>
                Choose from photos
              </Text>
            </LinearGradient>
          </Animated.View>
        </TouchableWithoutFeedback>

        {/* Camera */}
        <TouchableWithoutFeedback
          onPressIn={handlePressIn}
          onPressOut={() => {
            handlePressOut();
            openCamera();
          }}>
          <Animated.View
            style={[
              styles.uploadOption,
              { transform: [{ scale: scaleAnim }] },
            ]}>
            <LinearGradient
              colors={[
                'rgba(224,25,184,0.15)',
                'rgba(224,25,184,0.05)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.uploadOptionGradient}>
              <View style={styles.uploadIconBoxPink}>
                <Icon
                  name="camera-outline"
                  size={28}
                  color={colors.secondary}
                />
              </View>
              <Text style={styles.uploadOptionLabel}>Camera</Text>
              <Text style={styles.uploadOptionHint}>
                Take a photo now
              </Text>
            </LinearGradient>
          </Animated.View>
        </TouchableWithoutFeedback>
      </View>

      {helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}

      {error ? (
        <View style={styles.errorRow}>
          <Icon
            name="alert-circle-outline"
            size={13}
            color={colors.statusRejected}
          />
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    marginBottom: spacing.md,
  },

  uploadLabel: {
    ...typography.styles.label,
    marginBottom: spacing.sm,
    paddingHorizontal: spacing.xs,
  },

  // Upload options
  uploadOptions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },

  uploadOption: {
    flex: 1,
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
  },

  uploadOptionGradient: {
    padding: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 120,
  },

  uploadIconBox: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: 'rgba(94,23,235,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  uploadIconBoxPink: {
    width: 56,
    height: 56,
    borderRadius: radius.md,
    backgroundColor: 'rgba(224,25,184,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.sm,
  },

  uploadOptionLabel: {
    ...typography.styles.label,
    color: colors.textPrimary,
    marginBottom: 3,
  },

  uploadOptionHint: {
    ...typography.styles.caption,
    color: colors.textMuted,
    textAlign: 'center',
  },

  helperText: {
    ...typography.styles.caption,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: spacing.sm,
  },

  // Preview
  previewContainer: {
    borderRadius: radius.md,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.cryptoGreen}40`,
  },

  previewImage: {
    width: '100%',
    height: 200,
  },

  previewOverlay: {
    position: 'absolute',
    top: spacing.sm,
    right: spacing.sm,
    flexDirection: 'row',
    gap: spacing.xs,
  },

  previewAction: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(94,23,235,0.85)',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
    gap: 4,
  },

  previewActionDanger: {
    backgroundColor: 'rgba(255,76,76,0.85)',
  },

  previewActionText: {
    ...typography.styles.caption,
    color: colors.white,
    fontWeight: '600',
    fontSize: 12,
  },

  previewBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,196,159,0.12)',
    paddingVertical: spacing.sm,
    gap: spacing.xs,
  },

  previewBadgeText: {
    ...typography.styles.caption,
    color: colors.cryptoGreen,
    fontWeight: '600',
    marginLeft: 4,
  },

  // Errors
  errorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: spacing.xs,
    gap: 4,
  },

  errorText: {
    ...typography.styles.caption,
    color: colors.statusRejected,
    marginTop: spacing.xs,
    marginLeft: 2,
  },
});

export default UploadCard;