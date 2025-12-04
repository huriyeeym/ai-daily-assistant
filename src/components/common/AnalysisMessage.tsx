import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { THEME_COLORS } from '../../constants';
import { AnalysisResult } from '../../models';

interface AnalysisMessageProps {
  analysis?: AnalysisResult;
  isAnalyzing?: boolean;
}

const getSentimentBadge = (type: 'positive' | 'negative' | 'neutral') => {
  switch (type) {
    case 'positive':
      return { dotColor: '#B7F3D3', textColor: '#4A9B74', label: 'Positive' };
    case 'negative':
      return { dotColor: '#FFB8A8', textColor: '#C16B5A', label: 'Negative' };
    case 'neutral':
    default:
      return { dotColor: '#C5D3E0', textColor: '#7A8FA3', label: 'Neutral' };
  }
};

const AnalysisMessage: React.FC<AnalysisMessageProps> = ({ analysis, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <View style={styles.container}>
        <View style={[styles.bubble, styles.analyzingBubble]}>
          <ActivityIndicator color={THEME_COLORS.primary} size="small" />
          <Text style={styles.analyzingText}>Analyzing...</Text>
        </View>
      </View>
    );
  }

  if (!analysis) return null;

  const badge = getSentimentBadge(analysis.sentiment.type);
  const isOffline = analysis.summary.toLowerCase().includes('offline');

  return (
    <View style={styles.container}>
      <View style={styles.bubble}>
        {/* Sentiment Badge */}
        <View style={styles.sentimentRow}>
          <View style={[styles.dot, { backgroundColor: badge.dotColor }]} />
          <Text style={[styles.sentimentLabel, { color: badge.textColor }]}>
            {badge.label}
          </Text>
        </View>

        {/* Summary */}
        <Text style={styles.summary}>
          {analysis.summary.replace(' (Offline mode)', '').replace(' (offline)', '')}
        </Text>

        {/* Emotions */}
        {analysis.emotions.length > 0 && (
          <View style={styles.emotionsRow}>
            <Text style={styles.emotionsLabel}>Emotions: </Text>
            {analysis.emotions.slice(0, 2).map((emotion, index) => (
              <View key={index} style={styles.emotionChip}>
                <Text style={styles.emotionText}>{emotion.type}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Suggestion */}
        <View style={styles.suggestionContainer}>
          <Icon name="lightbulb-on" size={18} color="#60A5FA" style={styles.bulbIcon} />
          <Text style={styles.suggestion}>{analysis.suggestion}</Text>
        </View>

        {/* Offline indicator */}
        {isOffline && (
          <Text style={styles.offlineText}>
            Offline mode – local analysis
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  bubble: {
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderRadius: 18,
    borderTopRightRadius: 4,
    paddingHorizontal: 16,
    paddingVertical: 12,
    maxWidth: '85%',
  },
  analyzingBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 10,
  },
  analyzingText: {
    fontSize: 14,
    color: THEME_COLORS.primary,
    fontWeight: '500',
  },
  sentimentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sentimentLabel: {
    fontSize: 13,
    fontWeight: '600',
  },
  summary: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME_COLORS.text,
    marginBottom: 8,
    fontWeight: '400',
  },
  emotionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 8,
  },
  emotionsLabel: {
    fontSize: 12,
    color: THEME_COLORS.textSecondary,
    fontWeight: '400',
  },
  emotionChip: {
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  emotionText: {
    fontSize: 11,
    color: THEME_COLORS.primary,
    fontWeight: '600',
  },
  suggestionContainer: {
    flexDirection: 'row',
    gap: 10,
    alignItems: 'flex-start',
    backgroundColor: 'rgba(96, 165, 250, 0.12)',
    padding: 14,
    borderRadius: 12,
    marginTop: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#60A5FA',
  },
  bulbIcon: {
    marginTop: 2,
  },
  suggestion: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: THEME_COLORS.text,
    fontWeight: '500',
  },
  offlineText: {
    fontSize: 9,
    color: THEME_COLORS.textSecondary,
    opacity: 0.5,
    fontStyle: 'italic',
    marginTop: 6,
  },
});

export default AnalysisMessage;