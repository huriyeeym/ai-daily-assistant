import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { THEME_COLORS } from '../../constants';

interface UserMessageProps {
  text: string;
  timestamp?: number;
}

const UserMessage: React.FC<UserMessageProps> = ({ text, timestamp }) => {
  const formatTime = (ts: number) => {
    const date = new Date(ts);
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        <Text style={styles.text}>{text}</Text>
        {timestamp && (
          <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  bubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.04)',
    borderRadius: 18,
    borderTopLeftRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '75%',
  },
  text: {
    fontSize: 15,
    lineHeight: 22,
    color: THEME_COLORS.text,
    fontWeight: '400',
  },
  timestamp: {
    fontSize: 10,
    color: THEME_COLORS.textSecondary,
    opacity: 0.5,
    marginTop: 4,
  },
});

export default UserMessage;