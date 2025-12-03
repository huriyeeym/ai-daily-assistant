import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { Text, Button } from 'react-native-paper';
import GradientBackground from '../../components/common/GradientBackground';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
} from 'react-native-reanimated';
import { AnimatedBot } from '../../components/animations';
import { GRADIENT_COLORS, THEME_COLORS } from '../../constants';

const { width, height } = Dimensions.get('window');

interface WelcomeScreenProps {
  onContinue: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onContinue }) => {
  const botOpacity = useSharedValue(0);
  const botScale = useSharedValue(0.5);
  const titleOpacity = useSharedValue(0);
  const titleTranslateY = useSharedValue(30);
  const subtitleOpacity = useSharedValue(0);
  const subtitleTranslateY = useSharedValue(30);
  const buttonOpacity = useSharedValue(0);
  const buttonScale = useSharedValue(0.8);

  useEffect(() => {
    // Bot animation
    botOpacity.value = withDelay(200, withSpring(1));
    botScale.value = withDelay(200, withSpring(1));

    // Title animation
    titleOpacity.value = withDelay(600, withSpring(1));
    titleTranslateY.value = withDelay(600, withSpring(0));

    // Subtitle animation
    subtitleOpacity.value = withDelay(900, withSpring(1));
    subtitleTranslateY.value = withDelay(900, withSpring(0));

    // Button animation
    buttonOpacity.value = withDelay(1200, withSpring(1));
    buttonScale.value = withDelay(1200, withSpring(1));
  }, []);

  const botStyle = useAnimatedStyle(() => ({
    opacity: botOpacity.value,
    transform: [{ scale: botScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [{ translateY: titleTranslateY.value }],
  }));

  const subtitleStyle = useAnimatedStyle(() => ({
    opacity: subtitleOpacity.value,
    transform: [{ translateY: subtitleTranslateY.value }],
  }));

  const buttonStyle = useAnimatedStyle(() => ({
    opacity: buttonOpacity.value,
    transform: [{ scale: buttonScale.value }],
  }));

  return (
    <GradientBackground
      colors={GRADIENT_COLORS.bot}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.content}>
        {/* Bot Section */}
        <Animated.View style={[styles.botContainer, botStyle]}>
          <AnimatedBot size={240} />
        </Animated.View>

        {/* Text Section */}
        <View style={styles.textContainer}>
          <Animated.View style={titleStyle}>
            <Text variant="displaySmall" style={styles.title}>
              Meet Your AI
            </Text>
            <Text variant="displaySmall" style={styles.title}>
              Daily Assistant
            </Text>
          </Animated.View>

          <Animated.View style={subtitleStyle}>
            <Text variant="bodyLarge" style={styles.subtitle}>
              Understanding your emotions,
            </Text>
            <Text variant="bodyLarge" style={styles.subtitle}>
              guiding your journey
            </Text>
          </Animated.View>
        </View>

        {/* Button Section */}
        <Animated.View style={[styles.buttonContainer, buttonStyle]}>
          <Button
            mode="contained"
            onPress={onContinue}
            style={styles.button}
            labelStyle={styles.buttonLabel}
            contentStyle={styles.buttonContent}
          >
            Get Started
          </Button>
          <Text variant="bodySmall" style={styles.footerText}>
            Your personal AI companion for daily insights
          </Text>
        </Animated.View>
      </View>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 24,
  },
  botContainer: {
    marginTop: 40,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    color: THEME_COLORS.textLight,
    fontWeight: 'bold',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: THEME_COLORS.textLight,
    textAlign: 'center',
    marginTop: 8,
    opacity: 0.9,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 30,
    backgroundColor: THEME_COLORS.textLight,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonContent: {
    paddingVertical: 8,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  footerText: {
    color: THEME_COLORS.textLight,
    textAlign: 'center',
    marginTop: 16,
    opacity: 0.8,
  },
});

export default WelcomeScreen;
