// ============================================================
// CandyPay — Withdraw Card (Fixed)
// ============================================================

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

import {
  colors,
  spacing,
  radius,
  typography,
} from '../../theme';
import { formatUSDT, formatINR, formatDate } from '../../utils';
import { StatusBadge } from '../badges';

const WithdrawCard = ({
  withdrawal,
  onPress = null,
  style = {},
}) => {
  const {
    withdraw_usdt,
    withdraw_inr,
    withdraw_rate,
    status,
    created_at,
    admin_remark,
    transaction_reference,
  } = withdrawal;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress && onPress(withdrawal)}
      disabled={!onPress}
      delayPressIn={100}
      style={[styles.card, style]}>

      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={[`${colors.statusRejected}25`, `${colors.statusRejected}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}>
          <Icon
            name="arrow-up-circle-outline"
            size={22}
            color={colors.statusRejected}
          />
        </LinearGradient>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.usdtAmount}>
            -{formatUSDT(withdraw_usdt)}
          </Text>
          <StatusBadge status={status} size="small" />
        </View>

        <View style={styles.inrRow}>
          <Icon
            name="logo-usd"
            size={11}
            color={colors.textMuted}
          />
          <Text style={styles.inrText}>
            {formatINR(withdraw_inr)} @ ₹{parseFloat(withdraw_rate).toFixed(2)}
          </Text>
        </View>

        <Text style={styles.dateText}>
          {formatDate(created_at)}
        </Text>

        {status === 'approved' && transaction_reference ? (
          <View style={styles.refRow}>
            <Icon
              name="checkmark-circle-outline"
              size={11}
              color={colors.statusApproved}
            />
            <Text style={styles.refText} numberOfLines={1}>
              Ref: {transaction_reference}
            </Text>
          </View>
        ) : null}

        {status === 'rejected' && admin_remark ? (
          <View style={styles.remarkRow}>
            <Icon
              name="alert-circle-outline"
              size={11}
              color={colors.statusRejected}
            />
            <Text style={styles.remarkText} numberOfLines={1}>
              {admin_remark}
            </Text>
          </View>
        ) : null}
      </View>

      {/* Chevron */}
      {onPress && (
        <Icon
          name="chevron-forward"
          size={16}
          color={colors.textDisabled}
        />
      )}
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
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    marginBottom: spacing.sm,
    marginHorizontal: spacing.screenHorizontal,
  },
  iconContainer: {
    marginRight: spacing.md,
  },
  iconGradient: {
    width: 46,
    height: 46,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  usdtAmount: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: colors.statusRejected,
    letterSpacing: 0.3,
  },
  inrRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 4,
  },
  inrText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textMuted,
    marginLeft: 3,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textDisabled,
  },
  refRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 3,
  },
  refText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.statusApproved,
    flex: 1,
    marginLeft: 2,
  },
  remarkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
    gap: 3,
  },
  remarkText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.statusRejected,
    flex: 1,
    marginLeft: 2,
  },
});

export default WithdrawCard;