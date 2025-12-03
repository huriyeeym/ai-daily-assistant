import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientBackgroundProps {
  colors: string[];
  locations?: number[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
}

const GradientBackground: React.FC<GradientBackgroundProps> = ({
  colors,
  locations,
  start = { x: 0, y: 0 },
  end = { x: 0, y: 1 },
  style,
  children,
}) => {
  return (
    <LinearGradient
      colors={colors}
      locations={locations}
      start={start}
      end={end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default GradientBackground;
