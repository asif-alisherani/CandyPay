// ============================================================
// CandyPay — Deposit Card (Fixed)
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
import { formatUSDT, formatDate, truncateHash } from '../../utils';
import { StatusBadge } from '../badges';

const DepositCard = ({
  deposit,
  onPress = null,
  style = {},
}) => {
  const {
    requested_usdt,
    transaction_hash,
    status,
    created_at,
    admin_remark,
  } = deposit;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress && onPress(deposit)}
      disabled={!onPress}
      delayPressIn={100}
      style={[styles.card, style]}>

      {/* Left Icon */}
      <View style={styles.iconContainer}>
        <LinearGradient
          colors={[`${colors.cryptoGreen}25`, `${colors.cryptoGreen}10`]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.iconGradient}>
          <Icon
            name="arrow-down-circle-outline"
            size={22}
            color={colors.cryptoGreen}
          />
        </LinearGradient>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.topRow}>
          <Text style={styles.amountText}>
            +{formatUSDT(requested_usdt)}
          </Text>
          <StatusBadge status={status} size="small" />
        </View>

        <View style={styles.bottomRow}>
          <Icon
            name="document-text-outline"
            size={11}
            color={colors.textMuted}
          />
          <Text style={styles.hashText} numberOfLines={1}>
            {truncateHash(transaction_hash)}
          </Text>
        </View>

        <Text style={styles.dateText}>
          {formatDate(created_at)}
        </Text>

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
  amountText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: colors.cryptoGreen,
    letterSpacing: 0.3,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 3,
    gap: 4,
  },
  hashText: {
    fontFamily: 'Inter-Regular',
    fontSize: 12,
    color: colors.textMuted,
    flex: 1,
    marginLeft: 3,
  },
  dateText: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: colors.textDisabled,
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

export default DepositCard;