import React, { useState } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput as RNTextInput } from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEntries, useToast } from '../../hooks';
import { DiaryEntry } from '../../models';
import { formatDateTime, getSentimentColor } from '../../utils';
import GradientBackground from '../../components/common/GradientBackground';
import GlassCard from '../../components/common/GlassCard';
import { GRADIENT_COLORS, THEME_COLORS } from '../../constants';

// Helper function to get sentiment badge style (pastel colors aligned with purple palette)
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

// Helper function to get emotion icon based on emotion type
const getEmotionIcon = (emotionType: string): string => {
  const emotion = emotionType.toLowerCase();

  // Positive emotions
  if (emotion.includes('happy') || emotion.includes('joy') || emotion.includes('excited')) {
    return 'emoticon-happy-outline';
  }
  // Calm/peaceful emotions
  if (emotion.includes('calm') || emotion.includes('peaceful') || emotion.includes('content')) {
    return 'emoticon-outline';
  }
  // Sad emotions
  if (emotion.includes('sad') || emotion.includes('down') || emotion.includes('depressed')) {
    return 'emoticon-sad-outline';
  }
  // Anxious/stressed emotions
  if (emotion.includes('anxious') || emotion.includes('stress') || emotion.includes('worried')) {
    return 'emoticon-confused-outline';
  }
  // Angry emotions
  if (emotion.includes('angry') || emotion.includes('frustrated')) {
    return 'emoticon-angry-outline';
  }

  // Default neutral icon
  return 'emoticon-outline';
};

type FilterType = 'all' | 'positive' | 'neutral' | 'negative';

const HistoryScreen = () => {
  const { entries, loading, deleteEntry } = useEntries();
  const { showSuccess, showError } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSuggestionId, setExpandedSuggestionId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');

  // Filter entries based on selected filter
  const filteredEntries = selectedFilter === 'all'
    ? entries
    : entries.filter(entry => entry.analysis.sentiment.type === selectedFilter);

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
      showSuccess('Entry deleted');
    } catch (err) {
      console.error('Error deleting entry:', err);
      showError('An error occurred while deleting the entry');
    }
  };

  const renderFilterChip = (filter: FilterType, label: string) => {
    const isSelected = selectedFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        onPress={() => setSelectedFilter(filter)}
        style={[
          styles.filterChip,
          isSelected && styles.filterChipSelected,
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.filterChipText,
          isSelected && styles.filterChipTextSelected,
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderEntry = ({ item }: { item: DiaryEntry }) => {
    const sentimentBadge = getSentimentBadge(item.analysis.sentiment.type);
    const isExpanded = expandedId === item.id;
    const maxLines = 3;
    const textLines = item.text.split('\n');
    const shouldTruncate = textLines.length > maxLines || item.text.length > 150;
    const displayText = isExpanded || !shouldTruncate
      ? item.text
      : item.text.slice(0, 150) + (item.text.length > 150 ? '...' : '');

    return (
      <GlassCard style={styles.card}>
        {/* Card Header */}
        <View style={styles.cardHeader}>
          <View style={styles.sentimentBadge}>
            <View style={[styles.sentimentDot, { backgroundColor: sentimentBadge.dotColor }]} />
            <Text style={[styles.sentimentLabel, { color: sentimentBadge.textColor }]}>
              {sentimentBadge.label}
            </Text>
          </View>
          <View style={styles.headerRight}>
            <Text style={styles.dateText}>{formatDateTime(item.createdAt)}</Text>
            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon name="delete-outline" size={18} color="#B0B0C0" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Entry Text */}
        <Text style={styles.entryText}>
          {displayText}
        </Text>
        {shouldTruncate && !isExpanded && (
          <TouchableOpacity
            onPress={() => setExpandedId(item.id)}
            style={styles.viewDetailsButton}
          >
            <Text style={styles.viewDetails}>View details</Text>
            <Icon name="chevron-right" size={16} color={THEME_COLORS.primary} />
          </TouchableOpacity>
        )}
        {isExpanded && (
          <TouchableOpacity
            onPress={() => setExpandedId(null)}
            style={styles.viewDetailsButton}
          >
            <Text style={styles.viewDetails}>Show less</Text>
            <Icon name="chevron-up" size={16} color={THEME_COLORS.primary} />
          </TouchableOpacity>
        )}

        {/* Footer - Meta Info */}
        <View style={styles.footer}>
          {item.analysis.emotions[0] && (
            <View style={styles.chip}>
              <Icon
                name={getEmotionIcon(item.analysis.emotions[0].type)}
                size={16}
                color={THEME_COLORS.primary}
                style={{ opacity: 0.7 }}
              />
              <Text style={styles.chipValue}>{item.analysis.emotions[0].type}</Text>
            </View>
          )}

          {/* AI Suggestion Hint Icon */}
          {item.analysis.suggestion && (
            <TouchableOpacity
              style={styles.suggestionChip}
              onPress={() => setExpandedSuggestionId(
                expandedSuggestionId === item.id ? null : item.id
              )}
              activeOpacity={0.7}
            >
              <Icon
                name="lightbulb-outline"
                size={16}
                color="#F59E0B"
                style={{ opacity: 0.8 }}
              />
              <Text style={styles.suggestionChipText}>AI Tip</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Expanded AI Suggestion */}
        {expandedSuggestionId === item.id && item.analysis.suggestion && (
          <View style={styles.suggestionExpanded}>
            <View style={styles.suggestionHeader}>
              <Icon name="lightbulb" size={18} color="#F59E0B" />
              <Text style={styles.suggestionTitle}>AI Suggestion</Text>
            </View>
            <Text style={styles.suggestionText}>{item.analysis.suggestion}</Text>
          </View>
        )}
      </GlassCard>
    );
  };

  if (loading) {
    return (
      <GradientBackground
        colors={GRADIENT_COLORS.primary}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.container}
      >
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={THEME_COLORS.primary} />
        </View>
      </GradientBackground>
    );
  }

  if (entries.length === 0) {
    return (
      <GradientBackground
        colors={GRADIENT_COLORS.primary}
        locations={[0, 0.3, 0.7, 1]}
        style={styles.container}
      >
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>History</Text>
          <Text style={styles.pageSubtitle}>0 entries</Text>
        </View>
        <View style={styles.empty}>
          <View style={styles.emptyIconContainer}>
            <Icon name="notebook-outline" size={64} color={THEME_COLORS.primary} />
          </View>
          <Text style={styles.emptyText}>No entries yet</Text>
          <Text style={styles.emptySubtext}>
            Go to the Home page to create your first mood entry
          </Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground
      colors={GRADIENT_COLORS.primary}
      locations={[0, 0.3, 0.7, 1]}
      style={styles.container}
    >
      <View style={styles.pageHeader}>
        <Text style={styles.pageTitle}>History</Text>
        <Text style={styles.pageSubtitle}>
          {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
        </Text>

        {/* Filter Bar */}
        <View style={styles.filterBar}>
          {renderFilterChip('all', 'All')}
          {renderFilterChip('positive', 'Positive')}
          {renderFilterChip('neutral', 'Neutral')}
          {renderFilterChip('negative', 'Negative')}
        </View>
      </View>

      {filteredEntries.length === 0 ? (
        <View style={styles.empty}>
          <View style={styles.emptyIconContainer}>
            <Icon name="filter-outline" size={64} color={THEME_COLORS.primary} />
          </View>
          <Text style={styles.emptyText}>No {selectedFilter} entries</Text>
          <Text style={styles.emptySubtext}>
            Try a different filter to see your entries
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredEntries}
          renderItem={renderEntry}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Page Header (like Home screen)
  pageHeader: {
    paddingHorizontal: 28,
    paddingTop: 60,
    paddingBottom: 24,
  },
  pageTitle: {
    fontSize: 32,
    color: THEME_COLORS.primary,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  pageSubtitle: {
    fontSize: 14,
    color: THEME_COLORS.primary,
    fontWeight: '400',
    letterSpacing: -0.1,
    opacity: 0.6,
    marginTop: 4,
  },
  // Filter Bar
  filterBar: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
  },
  filterChipSelected: {
    backgroundColor: THEME_COLORS.primary,
  },
  filterChipText: {
    fontSize: 14,
    fontWeight: '600',
    color: THEME_COLORS.primary,
    letterSpacing: -0.1,
  },
  filterChipTextSelected: {
    color: '#FFFFFF',
  },
  // Empty State
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
    marginTop: -100,
  },
  emptyIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(139, 92, 246, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  emptyText: {
    fontSize: 24,
    color: THEME_COLORS.primary,
    fontWeight: '700',
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  emptySubtext: {
    fontSize: 16,
    color: THEME_COLORS.primary,
    textAlign: 'center',
    opacity: 0.7,
    lineHeight: 24,
    fontWeight: '400',
  },
  // List
  list: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 100,
  },
  // Card (using GlassCard)
  card: {
    marginBottom: 24,
    padding: 20,
  },
  // Card Header
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sentimentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sentimentDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  sentimentLabel: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dateText: {
    fontSize: 11,
    color: '#A0A0B0',
    fontWeight: '400',
    opacity: 0.8,
  },
  deleteButton: {
    padding: 4,
  },
  // Entry Text
  entryText: {
    fontSize: 16,
    lineHeight: 24,
    color: THEME_COLORS.text,
    fontWeight: '400',
    marginBottom: 8,
  },
  viewDetailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  viewDetails: {
    fontSize: 13,
    color: THEME_COLORS.primary,
    fontWeight: '500',
    opacity: 0.8,
  },
  // Footer - Chips
  footer: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 4,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(139, 92, 246, 0.04)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  chipValue: {
    fontSize: 13,
    color: THEME_COLORS.primary,
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  suggestionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(245, 158, 11, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  suggestionChipText: {
    fontSize: 13,
    color: '#D97706',
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  suggestionExpanded: {
    marginTop: 12,
    padding: 14,
    backgroundColor: 'rgba(245, 158, 11, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#F59E0B',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    color: '#D97706',
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  suggestionText: {
    fontSize: 14,
    lineHeight: 20,
    color: THEME_COLORS.text,
    fontWeight: '400',
  },
});

export default HistoryScreen;
