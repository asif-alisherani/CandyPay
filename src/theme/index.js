// ============================================================
// CandyPay Theme System
// Neo Cyber Glass Design Language
// All theme values centralized here
// ============================================================

// ─────────────────────────────────────────
// COLORS
// ─────────────────────────────────────────
export const colors = {
  // Backgrounds
  background: '#000000',
  backgroundSecondary: '#0A0A0F',
  backgroundCard: 'rgba(255,255,255,0.04)',
  backgroundInput: 'rgba(255,255,255,0.06)',
  backgroundOverlay: 'rgba(0,0,0,0.85)',

  // Primary Purple
  primary: '#5E17EB',
  primaryDark: '#4A00E0',
  primaryLight: '#7B3FF2',

  // Secondary Pink
  secondary: '#E019B8',
  secondaryDark: '#FF007F',
  secondaryLight: '#F040C8',

  // Accent
  accent: '#A020F0',
  accentLight: '#B94CF5',

  // Crypto Colors
  cryptoGreen: '#00C49F',
  seafoam: '#33F0C8',

  // Text
  textPrimary: '#FFFFFF',
  textSecondary: '#EAE6FF',
  textMuted: '#B0B0B0',
  textDisabled: '#555555',
  textDanger: '#FF4C4C',
  textSuccess: '#00C49F',
  textWarning: '#FFB830',

  // Status
  statusPending: '#FFB830',
  statusApproved: '#00C49F',
  statusRejected: '#FF4C4C',

  // Borders
  border: 'rgba(255,255,255,0.12)',
  borderFocus: 'rgba(94,23,235,0.8)',
  borderCard: 'rgba(255,255,255,0.10)',
  borderGlow: 'rgba(160,32,240,0.5)',

  // Divider
  divider: 'rgba(255,255,255,0.08)',

  // Glow Colors
  glowPurple: 'rgba(94,23,235,0.4)',
  glowPink: 'rgba(224,25,184,0.4)',
  glowGreen: 'rgba(0,196,159,0.4)',
  glowWhite: 'rgba(255,255,255,0.1)',

  // Transparent
  transparent: 'transparent',

  // Overlay blobs (background decoration)
  blobPurple: 'rgba(94,23,235,0.12)',
  blobPink: 'rgba(224,25,184,0.10)',
  blobGreen: 'rgba(0,196,159,0.08)',

  // Navigation
  navBackground: 'rgba(10,10,20,0.92)',
  navBorder: 'rgba(255,255,255,0.10)',
  navActive: '#5E17EB',
  navInactive: '#555555',

  // Toast
  toastSuccess: '#00C49F',
  toastError: '#FF4C4C',
  toastWarning: '#FFB830',
  toastInfo: '#3B82F6',

  // White & Black
  white: '#FFFFFF',
  black: '#000000',
};

// ─────────────────────────────────────────
// GRADIENTS
// ─────────────────────────────────────────
export const gradients = {
  // Primary Button / Wallet Card
  primary: {
    colors: ['#5E17EB', '#4A00E0'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Secondary / CTA
  secondary: {
    colors: ['#E019B8', '#FF007F'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Wallet Card Hero
  walletCard: {
    colors: ['#5E17EB', '#8A2BE2', '#E019B8'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Success
  success: {
    colors: ['#00C49F', '#33F0C8'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Danger
  danger: {
    colors: ['#FF4C4C', '#FF007F'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Active Navigation Tab
  navActive: {
    colors: ['#5E17EB', '#4A00E0'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Background Screen Blobs
  blobPurple: {
    colors: ['rgba(94,23,235,0.25)', 'rgba(94,23,235,0)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  blobPink: {
    colors: ['rgba(224,25,184,0.20)', 'rgba(224,25,184,0)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Glass Card Overlay
  glassCard: {
    colors: ['rgba(255,255,255,0.07)', 'rgba(255,255,255,0.02)'],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 1 },
  },

  // Skeleton shimmer
  skeleton: {
    colors: [
      'rgba(255,255,255,0.03)',
      'rgba(255,255,255,0.08)',
      'rgba(255,255,255,0.03)',
    ],
    start: { x: 0, y: 0 },
    end: { x: 1, y: 0 },
  },
};

// ─────────────────────────────────────────
// SPACING
// ─────────────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 56,

  // Screen horizontal padding
  screenHorizontal: 20,

  // Card inner padding
  cardPadding: 20,

  // Section gap
  sectionGap: 28,

  // Item gap inside lists
  itemGap: 12,

  // Input height
  inputHeight: 56,

  // Button height
  buttonHeight: 56,

  // Bottom nav height
  bottomNavHeight: 70,

  // Bottom nav margin from screen edge
  bottomNavMargin: 16,
};

// ─────────────────────────────────────────
// TYPOGRAPHY
// ─────────────────────────────────────────
export const typography = {
  // Font Families
  fonts: {
    primary: 'SpaceGrotesk-Bold',
    primaryMedium: 'SpaceGrotesk-Medium',
    primaryRegular: 'SpaceGrotesk-Regular',
    secondary: 'Inter-Regular',
    secondaryMedium: 'Inter-Medium',
    secondarySemiBold: 'Inter-SemiBold',
    secondaryBold: 'Inter-Bold',
  },

  // Font Sizes
  sizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 24,
    xxxl: 30,
    display: 36,
    hero: 44,
  },

  // Line Heights
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.7,
  },

  // Font Weights (for system fonts fallback)
  weights: {
    regular: '400',
    medium: '500',
    semiBold: '600',
    bold: '700',
    extraBold: '800',
  },

  // Preset Text Styles
  styles: {
    heroBalance: {
      fontFamily: 'SpaceGrotesk-Bold',
      fontSize: 36,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    screenTitle: {
      fontFamily: 'SpaceGrotesk-Bold',
      fontSize: 24,
      color: '#FFFFFF',
      letterSpacing: 0.3,
    },
    cardTitle: {
      fontFamily: 'SpaceGrotesk-Medium',
      fontSize: 17,
      color: '#FFFFFF',
      letterSpacing: 0.2,
    },
    sectionTitle: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 15,
      color: '#EAE6FF',
      letterSpacing: 0.3,
    },
    body: {
      fontFamily: 'Inter-Regular',
      fontSize: 15,
      color: '#EAE6FF',
      lineHeight: 22,
    },
    bodyMuted: {
      fontFamily: 'Inter-Regular',
      fontSize: 14,
      color: '#B0B0B0',
      lineHeight: 20,
    },
    caption: {
      fontFamily: 'Inter-Regular',
      fontSize: 12,
      color: '#B0B0B0',
      letterSpacing: 0.2,
    },
    label: {
      fontFamily: 'Inter-Medium',
      fontSize: 13,
      color: '#EAE6FF',
      letterSpacing: 0.3,
    },
    buttonText: {
      fontFamily: 'Inter-SemiBold',
      fontSize: 16,
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    amount: {
      fontFamily: 'SpaceGrotesk-Bold',
      fontSize: 20,
      color: '#00C49F',
      letterSpacing: 0.3,
    },
    rate: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: '#B0B0B0',
    },
    link: {
      fontFamily: 'Inter-Medium',
      fontSize: 14,
      color: '#5E17EB',
    },
  },
};

// ─────────────────────────────────────────
// BORDER RADIUS
// ─────────────────────────────────────────
export const radius = {
  xs: 6,
  sm: 12,
  md: 18,
  lg: 24,
  xl: 30,
  xxl: 40,
  full: 999,

  // Specific uses
  button: 18,
  card: 20,
  input: 14,
  badge: 999,
  modal: 28,
  bottomNav: 28,
  image: 12,
};

// ─────────────────────────────────────────
// SHADOWS
// ─────────────────────────────────────────
export const shadows = {
  // Card shadow
  card: {
    shadowColor: '#5E17EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },

  // Button shadow
  button: {
    shadowColor: '#5E17EB',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 10,
  },

  // Wallet card hero shadow
  walletCard: {
    shadowColor: '#5E17EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 16,
  },

  // Bottom nav shadow
  bottomNav: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.6,
    shadowRadius: 16,
    elevation: 20,
  },

  // Modal shadow
  modal: {
    shadowColor: '#5E17EB',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 24,
    elevation: 24,
  },

  // Input focus glow
  inputFocus: {
    shadowColor: '#5E17EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
    elevation: 4,
  },

  // Soft glow for icons
  iconGlow: {
    shadowColor: '#A020F0',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
    elevation: 4,
  },

  // No shadow
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
};

// ─────────────────────────────────────────
// ANIMATIONS
// ─────────────────────────────────────────
export const animations = {
  // Durations in milliseconds
  duration: {
    instant: 100,
    fast: 200,
    normal: 300,
    slow: 500,
    verySlow: 800,
    splash: 7000,
  },

  // Spring configs
  spring: {
    gentle: {
      damping: 20,
      stiffness: 200,
      mass: 0.8,
    },
    bouncy: {
      damping: 14,
      stiffness: 180,
      mass: 1,
    },
    snappy: {
      damping: 30,
      stiffness: 300,
      mass: 0.6,
    },
  },

  // Scale values for press animations
  press: {
    scaleDown: 0.97,
    scaleUp: 1.0,
  },

  // Fade
  fade: {
    in: { from: 0, to: 1 },
    out: { from: 1, to: 0 },
  },

  // Slide
  slide: {
    fromBottom: { from: 60, to: 0 },
    fromTop: { from: -60, to: 0 },
    fromRight: { from: 60, to: 0 },
  },
};

// ─────────────────────────────────────────
// Z-INDEX
// ─────────────────────────────────────────
export const zIndex = {
  background: -1,
  base: 0,
  card: 10,
  header: 20,
  bottomNav: 30,
  modal: 40,
  toast: 50,
  overlay: 60,
  top: 999,
};

// ─────────────────────────────────────────
// DEFAULT EXPORT (complete theme object)
// ─────────────────────────────────────────
const theme = {
  colors,
  gradients,
  spacing,
  typography,
  radius,
  shadows,
  animations,
  zIndex,
};

export default theme;