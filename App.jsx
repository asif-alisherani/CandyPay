import React from 'react';
import { StatusBar, LogBox } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';

import AppNavigator from './src/navigation';
import { AuthProvider, AppProvider, WalletProvider } from './src/context';
import { colors } from './src/theme';
import { toastConfig } from './src/utils';

// ─────────────────────────────────────────
// Suppress known non-critical warnings
// ─────────────────────────────────────────
LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
  'VirtualizedLists should never be nested',
]);

// ─────────────────────────────────────────
// React Query Client
// ─────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: false,
      refetchOnMount: true,
    },
    mutations: {
      retry: 0,
    },
  },
});

// ─────────────────────────────────────────
// App Root
// ─────────────────────────────────────────
const App = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <AuthProvider>
            <AppProvider>
              <WalletProvider>
                {/* Global Status Bar */}
                <StatusBar
                  barStyle="light-content"
                  backgroundColor={colors.background}
                  translucent={false}
                />

                {/* Root Navigator */}
                <AppNavigator />

                {/* Global Toast */}
                <Toast
                  config={toastConfig}
                  position="top"
                  topOffset={60}
                  visibilityTime={3000}
                  autoHide={true}
                />
              </WalletProvider>
            </AppProvider>
          </AuthProvider>
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;