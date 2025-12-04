import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { THEME_COLORS } from '../../constants';

interface GlassCardProps {
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
}

const GlassCard: React.FC<GlassCardProps> = ({ children, style }) => {
  return (
    <View style={[styles.container, style]}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: THEME_COLORS.cardLight,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: THEME_COLORS.cardBorder,
    padding: 20,
    shadowColor: THEME_COLORS.shadow,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 1,
    shadowRadius: 20,
    elevation: 8,
    // Additional depth with multiple shadows (iOS only, but harmless on Android)
    overflow: 'visible',
  },
});

export default GlassCard;
