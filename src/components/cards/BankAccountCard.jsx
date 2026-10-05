// ============================================================
// CandyPay — Bank Account Card (Fixed)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
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
} from '../../theme';
import { maskAccountNumber } from '../../utils';

const BankAccountCard = ({
  account,
  onPress = null,
  onEdit = null,
  onDelete = null,
  isSelected = false,
  selectable = false,
  style = {},
}) => {
  const {
    account_holder_name,
    bank_name,
    account_number,
    ifsc_code,
    upi_id,
  } = account;

  const handlePress = () => {
    if (onPress) {
      onPress(account);
    }
  };

  const isClickable = !!(onPress || selectable);

  return (
    <TouchableOpacity
      activeOpacity={isClickable ? 0.7 : 1}
      onPress={handlePress}
      disabled={!isClickable}
      delayPressIn={100}
      style={[
        styles.card,
        isSelected && styles.selectedCard,
        style,
      ]}>

      {/* Selected gradient overlay */}
      {isSelected && (
        <LinearGradient
          colors={['rgba(94,23,235,0.12)', 'rgba(94,23,235,0.04)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFill}
        />
      )}

      {/* Bank Icon */}
      <View style={styles.bankIconContainer}>
        <LinearGradient
          colors={
            isSelected
              ? gradients.primary.colors
              : [colors.backgroundCard, colors.backgroundInput]
          }
          start={gradients.primary.start}
          end={gradients.primary.end}
          style={styles.bankIconGradient}>
          <Icon
            name="business-outline"
            size={22}
            color={isSelected ? colors.white : colors.textMuted}
          />
        </LinearGradient>
      </View>

      {/* Account Info */}
      <View style={styles.accountInfo}>
        <Text style={styles.bankName} numberOfLines={1}>
          {bank_name}
        </Text>
        <Text style={styles.holderName} numberOfLines={1}>
          {account_holder_name}
        </Text>
        <View style={styles.accountRow}>
          <Text style={styles.accountNumber}>
            {maskAccountNumber(account_number)}
          </Text>
          {ifsc_code ? (
            <>
              <Text style={styles.separator}>•</Text>
              <Text style={styles.ifscCode}>{ifsc_code}</Text>
            </>
          ) : null}
        </View>
        {upi_id ? (
          <View style={styles.upiRow}>
            <Icon
              name="phone-portrait-outline"
              size={11}
              color={colors.accent}
            />
            <Text style={styles.upiText} numberOfLines={1}>
              {upi_id}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Right Actions */}
      <View style={styles.rightActions}>
        {/* Selected check */}
        {selectable && (
          <View
            style={[
              styles.selectCircle,
              isSelected && styles.selectCircleActive,
            ]}>
            {isSelected && (
              <Icon
                name="checkmark"
                size={14}
                color={colors.white}
              />
            )}
          </View>
        )}

        {/* Edit / Delete */}
        {!selectable && (onEdit || onDelete) && (
          <View style={styles.actionButtons}>
            {onEdit && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onEdit(account)}
                delayPressIn={50}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionBtn}>
                <Icon
                  name="pencil-outline"
                  size={16}
                  color={colors.accent}
                />
              </TouchableOpacity>
            )}
            {onDelete && (
              <TouchableOpacity
                activeOpacity={0.6}
                onPress={() => onDelete(account)}
                delayPressIn={50}
                hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                style={styles.actionBtn}>
                <Icon
                  name="trash-outline"
                  size={16}
                  color={colors.statusRejected}
                />
              </TouchableOpacity>
            )}
          </View>
        )}

        {/* Chevron for non-selectable press */}
        {onPress && !selectable && (
          <Icon
            name="chevron-forward"
            size={16}
            color={colors.textDisabled}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundCard,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.borderCard,
    padding: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.screenHorizontal,
    overflow: 'hidden',
    ...shadows.card,
  },

  selectedCard: {
    borderColor: colors.primary,
    borderWidth: 1.5,
  },

  bankIconContainer: {
    marginRight: spacing.md,
  },

  bankIconGradient: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },

  accountInfo: {
    flex: 1,
  },

  bankName: {
    fontFamily: 'Inter-Medium',
    fontSize: 15,
    color: colors.textPrimary,
    marginBottom: 2,
  },

  holderName: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textSecondary,
    marginBottom: 3,
  },

  accountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },

  accountNumber: {
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 12,
    color: colors.textMuted,
    letterSpacing: 1,
  },

  separator: {
    color: colors.textDisabled,
    marginHorizontal: spacing.xs,
    fontSize: 10,
  },

  ifscCode: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textMuted,
  },

  upiRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },

  upiText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.accent,
    marginLeft: 3,
  },

  // Right actions
  rightActions: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    marginLeft: spacing.sm,
  },

  selectCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },

  selectCircleActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },

  actionButtons: {
    flexDirection: 'row',
    gap: spacing.xs,
  },

  actionBtn: {
    width: 36,
    height: 36,
    borderRadius: radius.xs,
    backgroundColor: colors.backgroundInput,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default BankAccountCard;