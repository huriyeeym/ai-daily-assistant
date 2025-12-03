import React, { useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import GradientBackground from '../common/GradientBackground';

interface VoiceWaveProps {
  isActive?: boolean;
  size?: number;
}

const VoiceWave: React.FC<VoiceWaveProps> = ({ isActive = false, size = 200 }) => {
  const wave1Scale = useSharedValue(0.3);
  const wave2Scale = useSharedValue(0.3);
  const wave3Scale = useSharedValue(0.3);
  const wave4Scale = useSharedValue(0.3);
  const wave5Scale = useSharedValue(0.3);

  const wave1Opacity = useSharedValue(0.8);
  const wave2Opacity = useSharedValue(0.8);
  const wave3Opacity = useSharedValue(0.8);
  const wave4Opacity = useSharedValue(0.8);
  const wave5Opacity = useSharedValue(0.8);

  useEffect(() => {
    if (isActive) {
      // Wave 1 - Center, largest amplitude
      wave1Scale.value = withRepeat(
        withSequence(
          withTiming(1.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 600, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      wave1Opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 600 }),
          withTiming(0.8, { duration: 600 })
        ),
        -1,
        false
      );

      // Wave 2
      wave2Scale.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 500 }),
          withTiming(1.0, { duration: 500, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 500 })
        ),
        -1,
        false
      );
      wave2Opacity.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 500 }),
          withTiming(0.2, { duration: 500 }),
          withTiming(0.8, { duration: 500 })
        ),
        -1,
        false
      );

      // Wave 3
      wave3Scale.value = withRepeat(
        withSequence(
          withTiming(0.8, { duration: 700, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 700, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      wave3Opacity.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 700 }),
          withTiming(0.7, { duration: 700 })
        ),
        -1,
        false
      );

      // Wave 4
      wave4Scale.value = withRepeat(
        withSequence(
          withTiming(0.3, { duration: 550 }),
          withTiming(0.9, { duration: 550, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 550 })
        ),
        -1,
        false
      );
      wave4Opacity.value = withRepeat(
        withSequence(
          withTiming(0.7, { duration: 550 }),
          withTiming(0.3, { duration: 550 }),
          withTiming(0.7, { duration: 550 })
        ),
        -1,
        false
      );

      // Wave 5
      wave5Scale.value = withRepeat(
        withSequence(
          withTiming(1.0, { duration: 650, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.3, { duration: 650, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        false
      );
      wave5Opacity.value = withRepeat(
        withSequence(
          withTiming(0.2, { duration: 650 }),
          withTiming(0.6, { duration: 650 })
        ),
        -1,
        false
      );
    } else {
      // Reset to idle state
      wave1Scale.value = withTiming(0.3, { duration: 300 });
      wave2Scale.value = withTiming(0.3, { duration: 300 });
      wave3Scale.value = withTiming(0.3, { duration: 300 });
      wave4Scale.value = withTiming(0.3, { duration: 300 });
      wave5Scale.value = withTiming(0.3, { duration: 300 });

      wave1Opacity.value = withTiming(0.3, { duration: 300 });
      wave2Opacity.value = withTiming(0.3, { duration: 300 });
      wave3Opacity.value = withTiming(0.3, { duration: 300 });
      wave4Opacity.value = withTiming(0.3, { duration: 300 });
      wave5Opacity.value = withTiming(0.3, { duration: 300 });
    }
  }, [isActive]);

  const wave1Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: wave1Scale.value }],
    opacity: wave1Opacity.value,
  }));

  const wave2Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: wave2Scale.value }],
    opacity: wave2Opacity.value,
  }));

  const wave3Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: wave3Scale.value }],
    opacity: wave3Opacity.value,
  }));

  const wave4Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: wave4Scale.value }],
    opacity: wave4Opacity.value,
  }));

  const wave5Style = useAnimatedStyle(() => ({
    transform: [{ scaleY: wave5Scale.value }],
    opacity: wave5Opacity.value,
  }));

  const barWidth = size * 0.1;
  const barHeight = size * 0.8;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Animated.View style={[styles.wave, wave1Style, { width: barWidth, height: barHeight }]}>
        <GradientBackground
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.wave, wave2Style, { width: barWidth, height: barHeight }]}>
        <GradientBackground
          colors={['#764ba2', '#f093fb']}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.wave, wave3Style, { width: barWidth, height: barHeight }]}>
        <GradientBackground
          colors={['#f093fb', '#fa709a']}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.wave, wave4Style, { width: barWidth, height: barHeight }]}>
        <GradientBackground
          colors={['#764ba2', '#f093fb']}
          style={styles.gradient}
        />
      </Animated.View>
      <Animated.View style={[styles.wave, wave5Style, { width: barWidth, height: barHeight }]}>
        <GradientBackground
          colors={['#667eea', '#764ba2']}
          style={styles.gradient}
        />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
  },
  wave: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
  },
});

export default VoiceWave;
