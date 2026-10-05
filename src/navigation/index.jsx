// ============================================================
// CandyPay — Complete Navigation System (Fixed)
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

import { ROUTES } from '../constants';
import { useAuthContext } from '../context';
import { colors, gradients, spacing, radius, shadows, animations } from '../theme';

// ─────────────────────────────────────────
// SCREEN IMPORTS — Auth
// ─────────────────────────────────────────
import SplashScreen from '../screens/Splash/SplashScreen';
import LoginScreen from '../screens/Auth/LoginScreen';
import RegisterStep1Screen from '../screens/Auth/RegisterStep1Screen';
import RegisterStep2Screen from '../screens/Auth/RegisterStep2Screen';

// ─────────────────────────────────────────
// SCREEN IMPORTS — Main Tabs
// ─────────────────────────────────────────
import HomeScreen from '../screens/Home/HomeScreen';
import WalletScreen from '../screens/Wallet/WalletScreen';
import DepositScreen from '../screens/Deposit/DepositScreen';
import WithdrawScreen from '../screens/Withdraw/WithdrawScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';

// ─────────────────────────────────────────
// SCREEN IMPORTS — Stack (above tabs)
// ─────────────────────────────────────────
import TransactionDetailScreen from '../screens/Wallet/TransactionDetailScreen';
import DepositDetailScreen from '../screens/Deposit/DepositDetailScreen';
import WithdrawDetailScreen from '../screens/Withdraw/WithdrawDetailScreen';
import BankAccountScreen from '../screens/BankAccount/BankAccountScreen';
import AddBankAccountScreen from '../screens/BankAccount/AddBankAccountScreen';
import SupportScreen from '../screens/Support/SupportScreen';
import AboutScreen from '../screens/About/AboutScreen';
import NoInternetScreen from '../screens/NoInternet/NoInternetScreen';
import MaintenanceScreen from '../screens/Maintenance/MaintenanceScreen';

// ─────────────────────────────────────────
// STACK & TAB INSTANCES
// ─────────────────────────────────────────
const RootStack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();
const MainStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ─────────────────────────────────────────
// BOTTOM TAB CONFIG
// ─────────────────────────────────────────
const TAB_ITEMS = [
  {
    name: ROUTES.HOME,
    label: 'Home',
    icon: 'home-outline',
    iconActive: 'home',
  },
  {
    name: ROUTES.WALLET,
    label: 'Wallet',
    icon: 'wallet-outline',
    iconActive: 'wallet',
  },
  {
    name: ROUTES.DEPOSIT,
    label: 'Deposit',
    icon: 'arrow-down-circle-outline',
    iconActive: 'arrow-down-circle',
  },
  {
    name: ROUTES.WITHDRAW,
    label: 'Withdraw',
    icon: 'arrow-up-circle-outline',
    iconActive: 'arrow-up-circle',
  },
  {
    name: ROUTES.PROFILE,
    label: 'Profile',
    icon: 'person-outline',
    iconActive: 'person',
  },
];

// ─────────────────────────────────────────
// CUSTOM TAB BAR BUTTON
// ─────────────────────────────────────────
const TabBarButton = ({ item, isFocused, onPress }) => {
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const opacityAnim = useRef(new Animated.Value(isFocused ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(opacityAnim, {
      toValue: isFocused ? 1 : 0,
      duration: animations.duration.normal,
      useNativeDriver: true,
    }).start();
  }, [isFocused]);

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.press.scaleDown,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: animations.press.scaleUp,
      useNativeDriver: true,
      ...animations.spring.snappy,
    }).start();
    onPress();
  };

  return (
    <TouchableOpacity
      activeOpacity={1}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={tabStyles.tabButton}
      accessibilityRole="button"
      accessibilityLabel={item.label}
      accessibilityState={{ selected: isFocused }}>
      <Animated.View
        style={[
          tabStyles.tabButtonInner,
          { transform: [{ scale: scaleAnim }] },
        ]}>
        <Animated.View
          style={[tabStyles.activeGlow, { opacity: opacityAnim }]}>
          <LinearGradient
            colors={gradients.navActive.colors}
            start={gradients.navActive.start}
            end={gradients.navActive.end}
            style={tabStyles.activeGlowGradient}
          />
        </Animated.View>

        <Icon
          name={isFocused ? item.iconActive : item.icon}
          size={22}
          color={isFocused ? colors.white : colors.navInactive}
          style={tabStyles.tabIcon}
        />

        <Text
          style={[
            tabStyles.tabLabel,
            {
              color: isFocused ? colors.white : colors.navInactive,
              fontWeight: isFocused ? '600' : '400',
            },
          ]}>
          {item.label}
        </Text>
      </Animated.View>
    </TouchableOpacity>
  );
};

// ─────────────────────────────────────────
// CUSTOM BOTTOM TAB BAR
// ─────────────────────────────────────────
const CustomTabBar = ({ state, descriptors, navigation }) => {
  const insets = useSafeAreaInsets();

  return (
    <View
      style={[
        tabStyles.tabBarWrapper,
        { paddingBottom: insets.bottom > 0 ? insets.bottom : spacing.sm },
      ]}>
      <View style={tabStyles.tabBarContainer}>
        <View style={tabStyles.topBorderGlow} />
        <View style={tabStyles.tabBarInner}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const tabItem = TAB_ITEMS.find((t) => t.name === route.name);

            if (!tabItem) return null;

            const onPress = () => {
              const event = navigation.emit({
                type: 'tabPress',
                target: route.key,
                canPreventDefault: true,
              });

              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            };

            return (
              <TabBarButton
                key={route.key}
                item={tabItem}
                isFocused={isFocused}
                onPress={onPress}
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

// ─────────────────────────────────────────
// BOTTOM TAB NAVIGATOR
// ─────────────────────────────────────────
const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name={ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={ROUTES.WALLET} component={WalletScreen} />
      <Tab.Screen name={ROUTES.DEPOSIT} component={DepositScreen} />
      <Tab.Screen name={ROUTES.WITHDRAW} component={WithdrawScreen} />
      <Tab.Screen name={ROUTES.PROFILE} component={ProfileScreen} />
    </Tab.Navigator>
  );
};

// ─────────────────────────────────────────
// AUTH NAVIGATOR
// ─────────────────────────────────────────
const AuthNavigator = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <AuthStack.Screen name={ROUTES.LOGIN} component={LoginScreen} />
      <AuthStack.Screen
        name={ROUTES.REGISTER_STEP1}
        component={RegisterStep1Screen}
        options={{ animation: 'slide_from_right' }}
      />
      <AuthStack.Screen
        name={ROUTES.REGISTER_STEP2}
        component={RegisterStep2Screen}
        options={{ animation: 'slide_from_right' }}
      />
    </AuthStack.Navigator>
  );
};

// ─────────────────────────────────────────
// MAIN NAVIGATOR
// ─────────────────────────────────────────
const MainNavigator = () => {
  return (
    <MainStack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'slide_from_right',
        contentStyle: { backgroundColor: colors.background },
      }}>
      <MainStack.Screen
        name={ROUTES.MAIN}
        component={BottomTabNavigator}
        options={{ animation: 'fade' }}
      />
      <MainStack.Screen
        name={ROUTES.TRANSACTION_DETAIL}
        component={TransactionDetailScreen}
      />
      <MainStack.Screen
        name={ROUTES.DEPOSIT_DETAIL}
        component={DepositDetailScreen}
      />
      <MainStack.Screen
        name={ROUTES.WITHDRAW_DETAIL}
        component={WithdrawDetailScreen}
      />
      <MainStack.Screen
        name={ROUTES.BANK_ACCOUNTS}
        component={BankAccountScreen}
      />
      <MainStack.Screen
        name={ROUTES.ADD_BANK_ACCOUNT}
        component={AddBankAccountScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <MainStack.Screen
        name={ROUTES.EDIT_BANK_ACCOUNT}
        component={AddBankAccountScreen}
        options={{ animation: 'slide_from_bottom' }}
      />
      <MainStack.Screen
        name={ROUTES.SUPPORT}
        component={SupportScreen}
      />
      <MainStack.Screen
        name={ROUTES.ABOUT}
        component={AboutScreen}
      />
      <MainStack.Screen
        name={ROUTES.NO_INTERNET}
        component={NoInternetScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
      <MainStack.Screen
        name={ROUTES.MAINTENANCE}
        component={MaintenanceScreen}
        options={{ animation: 'fade', gestureEnabled: false }}
      />
    </MainStack.Navigator>
  );
};

// ─────────────────────────────────────────
// LOADING SCREEN
// Simple loading while checking auth
// ─────────────────────────────────────────
const LoadingScreen = () => (
  <View style={loadingStyles.container}>
    <ActivityIndicator size="large" color={colors.primary} />
  </View>
);

const loadingStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ─────────────────────────────────────────
// ROOT APP NAVIGATOR
// ─────────────────────────────────────────
const AppNavigator = () => {
  const { isLoggedIn, isAuthLoading } = useAuthContext();

  if (isAuthLoading) {
    return (
      <NavigationContainer>
        <RootStack.Navigator screenOptions={{ headerShown: false }}>
          <RootStack.Screen name="Loading" component={LoadingScreen} />
        </RootStack.Navigator>
      </NavigationContainer>
    );
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? <MainNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};

// ─────────────────────────────────────────
// TAB STYLES
// ─────────────────────────────────────────
const tabStyles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: spacing.md,
    paddingTop: spacing.sm,
    backgroundColor: colors.transparent,
  },
  tabBarContainer: {
    backgroundColor: colors.navBackground,
    borderRadius: radius.bottomNav,
    borderWidth: 1,
    borderColor: colors.navBorder,
    overflow: 'hidden',
    ...shadows.bottomNav,
  },
  topBorderGlow: {
    position: 'absolute',
    top: 0,
    left: '20%',
    right: '20%',
    height: 1,
    backgroundColor: colors.borderGlow,
    borderRadius: radius.full,
  },
  tabBarInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  tabButtonInner: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.md,
    minWidth: 56,
    position: 'relative',
  },
  activeGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: radius.md,
    overflow: 'hidden',
  },
  activeGlowGradient: {
    flex: 1,
  },
  tabIcon: {
    marginBottom: 3,
    zIndex: 1,
  },
  tabLabel: {
    fontSize: 10,
    letterSpacing: 0.3,
    zIndex: 1,
  },
});

export default AppNavigator;