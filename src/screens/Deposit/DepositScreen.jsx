// ============================================================
// CandyPay — Deposit Screen
// Static QR, wallet address, deposit form, recent requests
// ============================================================

import React, { useState, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  TouchableWithoutFeedback,
  Image,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';
import { useForm, Controller } from 'react-hook-form';

import { ROUTES, VALIDATION, APP_CONFIG, ASSETS } from '../../constants';
import {
  colors,
  gradients,
  spacing,
  radius,
  typography,
  shadows,
  animations,
} from '../../theme';
import {
  useDepositRequests,
  useSubmitDeposit,
} from '../../hooks/useWallet';
import { useClipboard } from '../../hooks/useApp';
import { useSettings } from '../../hooks/useApp';

import {
  ScreenWrapper,
  GlassCard,
  PrimaryButton,
  AppTextInput,
  AmountInput,
  DepositCard,
  EmptyState,
  ListSkeleton,
  FadeInView,
  SuccessModal,
  SectionHeader,
  StatusBadge,
  UploadCard,
} from '../../components';

// ─────────────────────────────────────────
// QR CODE CARD
// Static wallet QR + address + copy
// ─────────────────────────────────────────
const QRCard = ({ walletAddress, network, onCopy, copied }) => (
  <FadeInView style={qrStyles.container}>
    <LinearGradient
      colors={['rgba(94,23,235,0.15)', 'rgba(94,23,235,0.05)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={qrStyles.gradient}>

      {/* Network Badge */}
      <View style={qrStyles.networkBadge}>
        <View style={qrStyles.networkDot} />
        <Text style={qrStyles.networkText}>{network}</Text>
      </View>

      {/* QR Code */}
      <View style={qrStyles.qrWrapper}>
        <View style={qrStyles.qrContainer}>
          {/* Corner decorations */}
          <View style={[qrStyles.corner, qrStyles.cornerTL]} />
          <View style={[qrStyles.corner, qrStyles.cornerTR]} />
          <View style={[qrStyles.corner, qrStyles.cornerBL]} />
          <View style={[qrStyles.corner, qrStyles.cornerBR]} />

          {/* QR Image */}
          <Image
            source={ASSETS.QR_CODE}
            style={qrStyles.qrImage}
            resizeMode="contain"
          />
        </View>
      </View>

      {/* Wallet Address */}
      <View style={qrStyles.addressContainer}>
        <Text style={qrStyles.addressLabel}>Wallet Address</Text>
        <View style={qrStyles.addressRow}>
          <Text
            style={qrStyles.addressText}
            numberOfLines={1}
            ellipsizeMode="middle">
            {walletAddress}
          </Text>
          <TouchableWithoutFeedback onPress={onCopy}>
            <View
              style={[
                qrStyles.copyButton,
                copied && qrStyles.copyButtonActive,
              ]}>
              <Icon
                name={copied ? 'checkmark' : 'copy-outline'}
                size={16}
                color={copied ? colors.cryptoGreen : colors.accent}
              />
              <Text
                style={[
                  qrStyles.copyText,
                  copied && { color: colors.cryptoGreen },
                ]}>
                {copied ? 'Copied!' : 'Copy'}
              </Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </View>
    </LinearGradient>
  </FadeInView>
);

const qrStyles = StyleSheet.create({
  container: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
    borderRadius: radius.card,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: `${colors.accent}30`,
    ...shadows.card,
  },
  gradient: {
    padding: spacing.lg,
    alignItems: 'center',
  },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,196,159,0.15)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
    marginBottom: spacing.lg,
    borderWidth: 1,
    borderColor: 'rgba(0,196,159,0.3)',
    gap: spacing.xs,
  },
  networkDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.cryptoGreen,
  },
  networkText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 12,
    color: colors.cryptoGreen,
    letterSpacing: 1,
    marginLeft: 4,
  },
  qrWrapper: {
    alignItems: 'center',
    marginBottom: spacing.lg,
  },
  qrContainer: {
    width: 180,
    height: 180,
    backgroundColor: colors.white,
    borderRadius: radius.md,
    padding: spacing.sm,
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: colors.primary,
    borderWidth: 3,
    zIndex: 1,
  },
  cornerTL: {
    top: -1,
    left: -1,
    borderRightWidth: 0,
    borderBottomWidth: 0,
    borderTopLeftRadius: radius.sm,
  },
  cornerTR: {
    top: -1,
    right: -1,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
    borderTopRightRadius: radius.sm,
  },
  cornerBL: {
    bottom: -1,
    left: -1,
    borderRightWidth: 0,
    borderTopWidth: 0,
    borderBottomLeftRadius: radius.sm,
  },
  cornerBR: {
    bottom: -1,
    right: -1,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomRightRadius: radius.sm,
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  addressContainer: {
    width: '100%',
  },
  addressLabel: {
    ...typography.styles.caption,
    color: colors.textMuted,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: spacing.xs,
    textAlign: 'center',
  },
  addressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundInput,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    gap: spacing.sm,
  },
  addressText: {
    ...typography.styles.caption,
    color: colors.textSecondary,
    flex: 1,
    fontFamily: 'SpaceGrotesk-Medium',
    fontSize: 12,
    letterSpacing: 0.5,
  },
  copyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.accent}18`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.xs,
    gap: 4,
    borderWidth: 1,
    borderColor: `${colors.accent}30`,
  },
  copyButtonActive: {
    backgroundColor: `${colors.cryptoGreen}18`,
    borderColor: `${colors.cryptoGreen}30`,
  },
  copyText: {
    ...typography.styles.caption,
    color: colors.accent,
    fontWeight: '600',
    fontSize: 12,
  },
});

// ─────────────────────────────────────────
// DEPOSIT INSTRUCTIONS
// ─────────────────────────────────────────
const DepositInstructions = () => {
  const instructions = [
    {
      icon: 'copy-outline',
      text: 'Copy the wallet address above.',
    },
    {
      icon: 'phone-portrait-outline',
      text: 'Open your USDT wallet or exchange app.',
    },
    {
      icon: 'send-outline',
      text: 'Send USDT to the copied address on TRC20 network.',
    },
    {
      icon: 'camera-outline',
      text: 'Take a screenshot of the transaction.',
    },
    {
      icon: 'document-text-outline',
      text: 'Copy the transaction hash from the receipt.',
    },
    {
      icon: 'checkmark-circle-outline',
      text: 'Fill the form below and submit.',
    },
  ];

  return (
    <GlassCard style={instrStyles.card}>
      <View style={instrStyles.header}>
        <LinearGradient
          colors={gradients.primary.colors}
          start={gradients.primary.start}
          end={gradients.primary.end}
          style={instrStyles.headerIcon}>
          <Icon
            name="information-circle-outline"
            size={18}
            color={colors.white}
          />
        </LinearGradient>
        <Text style={instrStyles.title}>How to Deposit</Text>
      </View>

      {instructions.map((item, index) => (
        <View key={index} style={instrStyles.item}>
          <View style={instrStyles.stepNumber}>
            <Text style={instrStyles.stepNumberText}>
              {index + 1}
            </Text>
          </View>
          <View style={instrStyles.itemIcon}>
            <Icon
              name={item.icon}
              size={16}
              color={colors.accent}
            />
          </View>
          <Text style={instrStyles.itemText}>{item.text}</Text>
        </View>
      ))}

      {/* Warning */}
      <View style={instrStyles.warning}>
        <Icon
          name="warning-outline"
          size={14}
          color={colors.statusPending}
        />
        <Text style={instrStyles.warningText}>
          Only send USDT on TRC20 network. Sending other tokens
          or using wrong network may result in permanent loss.
        </Text>
      </View>
    </GlassCard>
  );
};

const instrStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.styles.cardTitle,
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm,
    gap: spacing.sm,
  },
  stepNumber: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: `${colors.accent}20`,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: `${colors.accent}40`,
  },
  stepNumberText: {
    fontFamily: 'Inter-Bold',
    fontSize: 11,
    color: colors.accent,
  },
  itemIcon: {
    width: 28,
    height: 28,
    borderRadius: radius.xs,
    backgroundColor: colors.backgroundInput,
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemText: {
    ...typography.styles.bodyMuted,
    fontSize: 13,
    flex: 1,
    lineHeight: 18,
  },
  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,184,48,0.08)',
    borderRadius: radius.sm,
    padding: spacing.sm,
    marginTop: spacing.xs,
    gap: spacing.xs,
    borderWidth: 1,
    borderColor: 'rgba(255,184,48,0.2)',
  },
  warningText: {
    ...typography.styles.caption,
    color: colors.statusPending,
    flex: 1,
    lineHeight: 16,
    marginLeft: 4,
  },
});

// ─────────────────────────────────────────
// DEPOSIT FORM
// ─────────────────────────────────────────
const DepositForm = ({ onSuccess, minDeposit, maxDeposit }) => {
  const { submitDeposit, isSubmitting } = useSubmitDeposit();
  const [uploadedImage, setUploadedImage] = useState(null);
  const [imageError, setImageError] = useState(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      requested_usdt: '',
      transaction_hash: '',
    },
  });

  const hashRef = useRef(null);

  const onSubmit = async (data) => {
    // Validate image
    if (!uploadedImage) {
      setImageError('Please upload a payment screenshot.');
      return;
    }
    setImageError(null);

    const result = await submitDeposit(
      {
        requested_usdt: parseFloat(data.requested_usdt),
        transaction_hash: data.transaction_hash,
        payment_image: uploadedImage.uri,
      },
      () => {
        reset();
        setUploadedImage(null);
        onSuccess && onSuccess();
      },
    );
  };

  return (
    <GlassCard style={formStyles.card}>
      {/* Header */}
      <View style={formStyles.header}>
        <LinearGradient
          colors={gradients.success.colors}
          start={gradients.success.start}
          end={gradients.success.end}
          style={formStyles.headerIcon}>
          <Icon
            name="cloud-upload-outline"
            size={18}
            color={colors.white}
          />
        </LinearGradient>
        <Text style={formStyles.title}>Submit Deposit</Text>
      </View>

      <View style={formStyles.divider} />

      {/* USDT Amount */}
      <Controller
        control={control}
        name="requested_usdt"
        rules={{
          required: 'Amount is required.',
          validate: (val) => {
            const num = parseFloat(val);
            if (isNaN(num)) return 'Enter a valid amount.';
            if (num < minDeposit)
              return `Minimum deposit is ${minDeposit} USDT.`;
            if (num > maxDeposit)
              return `Maximum deposit is ${maxDeposit} USDT.`;
            return true;
          },
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <AmountInput
            label="USDT Amount"
            placeholder="Enter amount"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.requested_usdt?.message}
            helperText={`Min: ${minDeposit} USDT — Max: ${maxDeposit} USDT`}
            returnKeyType="next"
            onSubmitEditing={() => hashRef.current?.focus()}
          />
        )}
      />

      {/* Transaction Hash */}
      <Controller
        control={control}
        name="transaction_hash"
        rules={VALIDATION.transactionHash}
        render={({ field: { onChange, onBlur, value } }) => (
          <AppTextInput
            label="Transaction Hash"
            placeholder="Paste transaction hash here"
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.transaction_hash?.message}
            leadingIcon="document-text-outline"
            autoCapitalize="none"
            returnKeyType="done"
            inputRef={hashRef}
            helperText="Find this in your USDT transfer receipt"
          />
        )}
      />

      {/* Upload Screenshot */}
      <UploadCard
        image={uploadedImage}
        onImageSelected={(img) => {
          setUploadedImage(img);
          setImageError(null);
        }}
        onRemove={() => setUploadedImage(null)}
        error={imageError}
        label="Payment Screenshot"
        helperText="Upload a clear screenshot of your transfer"
      />

      {/* Submit */}
      <PrimaryButton
        label="Submit Deposit Request"
        onPress={handleSubmit(onSubmit)}
        loading={isSubmitting}
        disabled={isSubmitting}
        icon="cloud-upload-outline"
        iconPosition="right"
      />
    </GlassCard>
  );
};

const formStyles = StyleSheet.create({
  card: {
    marginHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: radius.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    ...typography.styles.cardTitle,
    fontSize: 16,
    marginLeft: spacing.xs,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    marginBottom: spacing.lg,
  },
});

// ─────────────────────────────────────────
// DEPOSIT SCREEN
// ─────────────────────────────────────────
const DepositScreen = ({ navigation }) => {
  const { copy, copied } = useClipboard();
  const { minDeposit, maxDeposit } = useSettings();
  const [successVisible, setSuccessVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const {
    deposits,
    isLoading,
    refetch,
    isEmpty,
  } = useDepositRequests(activeFilter);

  // ─── Pull to Refresh ───
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  }, []);

  const goToDetail = (deposit) =>
    navigation.navigate(ROUTES.DEPOSIT_DETAIL, {
      uuid: deposit.uuid,
    });

  return (
    <ScreenWrapper>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.primary}
            colors={[colors.primary]}
            progressBackgroundColor={colors.backgroundSecondary}
          />
        }>

        {/* ── Title ── */}
        <FadeInView style={styles.titleRow}>
          <Text style={styles.screenTitle}>Deposit USDT</Text>
          <View style={styles.titleBadge}>
            <Icon
              name="arrow-down-circle-outline"
              size={14}
              color={colors.cryptoGreen}
            />
            <Text style={styles.titleBadgeText}>Receive</Text>
          </View>
        </FadeInView>

        {/* ── QR Card ── */}
        <QRCard
          walletAddress={APP_CONFIG.DEPOSIT_WALLET_ADDRESS}
          network={APP_CONFIG.DEFAULT_NETWORK}
          onCopy={() =>
            copy(
              APP_CONFIG.DEPOSIT_WALLET_ADDRESS,
              'Wallet Address',
            )
          }
          copied={copied}
        />

        {/* ── Instructions ── */}
        <FadeInView delay={100}>
          <DepositInstructions />
        </FadeInView>

        {/* ── Deposit Form ── */}
        <FadeInView delay={150}>
          <DepositForm
            onSuccess={() => setSuccessVisible(true)}
            minDeposit={minDeposit}
            maxDeposit={maxDeposit}
          />
        </FadeInView>

        {/* ── Recent Deposit Requests ── */}
        <FadeInView delay={200}>
          <SectionHeader
            title="Recent Deposits"
            style={styles.sectionHeader}
          />

          {isLoading ? (
            <ListSkeleton count={3} />
          ) : isEmpty ? (
            <EmptyState
              title="No Deposits Yet"
              description="Your deposit requests will appear here."
              style={styles.emptyState}
            />
          ) : (
            deposits.map((deposit) => (
              <DepositCard
                key={deposit.uuid}
                deposit={deposit}
                onPress={goToDetail}
              />
            ))
          )}
        </FadeInView>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={successVisible}
        onClose={() => setSuccessVisible(false)}
        title="Deposit Submitted!"
        message="Your deposit request has been submitted successfully. Admin will verify and credit your wallet shortly."
        actionLabel="Got it"
        onAction={() => {
          setSuccessVisible(false);
          refetch();
        }}
      />
    </ScreenWrapper>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 120,
    paddingTop: spacing.md,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.screenHorizontal,
    marginBottom: spacing.md,
  },

  screenTitle: {
    ...typography.styles.screenTitle,
  },

  titleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${colors.cryptoGreen}15`,
    borderWidth: 1,
    borderColor: `${colors.cryptoGreen}30`,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    borderRadius: radius.badge,
    gap: spacing.xs,
  },

  titleBadgeText: {
    ...typography.styles.caption,
    color: colors.cryptoGreen,
    fontWeight: '600',
    marginLeft: 3,
  },

  sectionHeader: {
    marginTop: spacing.sm,
  },

  emptyState: {
    paddingVertical: spacing.xl,
    marginHorizontal: spacing.screenHorizontal,
  },
});

export default DepositScreen;