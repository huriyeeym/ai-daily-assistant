import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
  withDelay,
} from 'react-native-reanimated';
import Svg, { Circle, Path, Defs, RadialGradient, Stop } from 'react-native-svg';

interface AnimatedBotProps {
  size?: number;
  isListening?: boolean;
  sentiment?: 'positive' | 'negative' | 'neutral' | null;
  faceScale?: number;
}

const AnimatedBot: React.FC<AnimatedBotProps> = ({ size = 200, isListening = false, sentiment = null, faceScale = 1 }) => {
  // Animation values
  const floatingY = useSharedValue(0);
  const leftEyeScale = useSharedValue(1);
  const rightEyeScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0.3);

  useEffect(() => {
    // Floating animation - smooth hovering effect
    floatingY.value = withRepeat(
      withSequence(
        withTiming(-12, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease)
        }),
        withTiming(12, {
          duration: 4000,
          easing: Easing.inOut(Easing.ease)
        }),
        withTiming(0, {
          duration: 2000,
          easing: Easing.inOut(Easing.ease)
        })
      ),
      -1,
      false
    );

    // Blinking animation - rare intervals (every 6 seconds)
    const startBlinking = () => {
      leftEyeScale.value = withDelay(
        6000,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 5750 }), // Wait 5.75s
            withTiming(0.1, { duration: 100 }), // Close quickly
            withTiming(1, { duration: 150 })    // Open
          ),
          -1,
          false
        )
      );

      rightEyeScale.value = withDelay(
        6000,
        withRepeat(
          withSequence(
            withTiming(1, { duration: 5750 }), // Wait 5.75s
            withTiming(0.1, { duration: 100 }), // Close quickly
            withTiming(1, { duration: 150 })    // Open
          ),
          -1,
          false
        )
      );
    };

    startBlinking();

    // Glow animation when listening
    if (isListening) {
      glowOpacity.value = withRepeat(
        withTiming(0.8, { duration: 1000, easing: Easing.inOut(Easing.ease) }),
        -1,
        true
      );
    }
  }, [isListening]);

  // Animated styles
  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: floatingY.value },
    ],
  }));

  const animatedLeftEyeStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: leftEyeScale.value },
    ],
  }));

  const animatedRightEyeStyle = useAnimatedStyle(() => ({
    transform: [
      { scaleY: rightEyeScale.value },
    ],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View style={styles.container}>
      {/* Halo glow effect - luminous ring around circle */}
      <View style={[styles.haloGlow, { width: size * 0.72, height: size * 0.72 }]} />

      {/* Glow effect when listening */}
      {isListening && (
        <Animated.View style={[styles.glow, animatedGlowStyle, { width: size * 1.5, height: size * 1.5 }]} />
      )}

      <Animated.View style={[animatedContainerStyle, { width: size, height: size }]}>
        <Svg width={size} height={size} viewBox="0 0 200 200">
          <Defs>
            {/* Enhanced gradient with glow */}
            <RadialGradient id="botGradient" cx="50%" cy="40%" r="58%" fx="50%" fy="40%">
              <Stop offset="0%" stopColor="#E8DCFF" stopOpacity="1" />
              <Stop offset="50%" stopColor="#C5B3F5" stopOpacity="1" />
              <Stop offset="100%" stopColor="#9B8AE8" stopOpacity="1" />
            </RadialGradient>
          </Defs>

          {/* Bot head - single smooth circle with unified gradient */}
          <Circle cx="100" cy="100" r="65" fill="url(#botGradient)" />
        </Svg>

        {/* Animated eyes - closer together */}
        <View style={[styles.eyesContainer, { transform: [{ scale: faceScale }] }]}>
          <Animated.View style={[styles.eyeCapsule, { left: size * 0.37 }, animatedLeftEyeStyle]}>
            <View style={styles.eyeWhite} />
          </Animated.View>
          <Animated.View style={[styles.eyeCapsule, { right: size * 0.37 }, animatedRightEyeStyle]}>
            <View style={styles.eyeWhite} />
          </Animated.View>
        </View>

        {/* Emotion-based mouth - consistent positioning and stroke */}
        {sentiment && (
          <Svg
            width={size}
            height={size}
            viewBox="0 0 200 200"
            style={{ position: 'absolute', top: 0, left: 0, transform: [{ scale: faceScale }] }}
          >
            {sentiment === 'positive' && (
              <Path
                d="M 72 157 Q 100 180 128 157"
                stroke="#FFFFFF"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            )}
            {sentiment === 'negative' && (
              <Path
                d="M 72 170 Q 100 155 128 170"
                stroke="#FFFFFF"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            )}
            {sentiment === 'neutral' && (
              <Path
                d="M 75 164 L 125 164"
                stroke="#FFFFFF"
                strokeWidth="5"
                fill="none"
                strokeLinecap="round"
              />
            )}
          </Svg>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  haloGlow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#E8DCFF',
    shadowColor: '#C5B3F5',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 10,
    opacity: 0.4,
  },
  glow: {
    position: 'absolute',
    borderRadius: 1000,
    backgroundColor: '#8B5CF6',
    shadowColor: '#8B5CF6',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 40,
    elevation: 12,
  },
  eyesContainer: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    top: 0,
    left: 0,
  },
  eyeCapsule: {
    position: 'absolute',
    top: '35%',
    width: 22,
    height: 36,
  },
  eyeWhite: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
  },
});

export default AnimatedBot;
