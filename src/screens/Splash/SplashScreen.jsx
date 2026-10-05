// ============================================================
// CandyPay — Splash Screen
// Plays local video, checks auth, navigates accordingly
// ============================================================

import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  StatusBar,
  Dimensions,
} from 'react-native';
import Video from 'react-native-video';
import { useAuthContext } from '../../context';
import { ROUTES, ASSETS } from '../../constants';
import { colors, animations } from '../../theme';

const { width, height } = Dimensions.get('window');

// ─────────────────────────────────────────
// SPLASH SCREEN
// ─────────────────────────────────────────
const SplashScreen = ({ navigation }) => {
  const { isLoggedIn, isAuthLoading } = useAuthContext();
  const [videoEnded, setVideoEnded] = useState(false);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const hasNavigated = useRef(false);

  // ─── Navigate after fade out ───
  const navigateAway = () => {
    if (hasNavigated.current) return;
    hasNavigated.current = true;

    // Fade out
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: animations.duration.slow,
      useNativeDriver: true,
    }).start(() => {
      if (isLoggedIn) {
        navigation.replace(ROUTES.MAIN);
      } else {
        navigation.replace(ROUTES.LOGIN);
      }
    });
  };

  // ─── Video ended ───
  const handleVideoEnd = () => {
    setVideoEnded(true);
    if (!isAuthLoading) {
      navigateAway();
    }
  };

  // ─── Auth loaded after video ended ───
  useEffect(() => {
    if (videoEnded && !isAuthLoading) {
      navigateAway();
    }
  }, [isAuthLoading, videoEnded]);

  // ─── Safety fallback ───
  // If video fails to load after 8s, navigate anyway
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (!hasNavigated.current) {
        navigateAway();
      }
    }, 8000);

    return () => clearTimeout(timeout);
  }, [isAuthLoading]);

  return (
    <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
      <StatusBar
        hidden
        translucent
        backgroundColor="transparent"
      />

      {/* Video */}
      <Video
        source={ASSETS.SPLASH_VIDEO}
        style={styles.video}
        resizeMode="cover"
        repeat={false}
        muted={false}
        onEnd={handleVideoEnd}
        onError={handleVideoEnd}
        controls={false}
        paused={false}
        ignoreSilentSwitch="ignore"
        playWhenInactive={false}
        playInBackground={false}
      />

      {/* Fade overlay for transition */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [1, 0],
            }),
          },
        ]}
        pointerEvents="none"
      />
    </Animated.View>
  );
};

// ─────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width,
    height,
  },

  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
    width,
    height,
  },

  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.background,
  },
});

export default SplashScreen;