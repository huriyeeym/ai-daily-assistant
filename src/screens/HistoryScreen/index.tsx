import React, { useState, useMemo, useRef } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import {
  Text,
  ActivityIndicator,
} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useEntries, useToast } from '../../hooks';
import { DiaryEntry } from '../../models';
import { formatDateTime, isToday, isLast7Days, isThisMonth } from '../../utils';
import { PieChart } from 'react-native-chart-kit';
import { Dimensions } from 'react-native';
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
type DateFilterType = 'all' | 'today' | 'last7days' | 'thismonth' | 'custom';

const HistoryScreen = () => {
  const { entries, loading, deleteEntry } = useEntries();
  const { showSuccess, showError } = useToast();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [expandedSuggestionId, setExpandedSuggestionId] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [selectedDateFilter, setSelectedDateFilter] = useState<DateFilterType>('all');
  const [isWeeklySummaryExpanded, setIsWeeklySummaryExpanded] = useState(true);
  const flatListRef = useRef<FlatList>(null);


  // Filter entries based on selected filters (sentiment + date)
  const filteredEntries = useMemo(() => {
    let result = entries;

    // Apply sentiment filter
    if (selectedFilter !== 'all') {
      result = result.filter(entry => entry.analysis.sentiment.type === selectedFilter);
    }

    // Apply date filter
    if (selectedDateFilter === 'today') {
      result = result.filter(entry => isToday(entry.createdAt));
    } else if (selectedDateFilter === 'last7days') {
      result = result.filter(entry => isLast7Days(entry.createdAt));
    } else if (selectedDateFilter === 'thismonth') {
      result = result.filter(entry => isThisMonth(entry.createdAt));
    }
    // 'custom' will be handled later with date picker

    return result;
  }, [entries, selectedFilter, selectedDateFilter]);

  // Calculate summary based on filtered entries
  const weeklySummary = useMemo(() => {
    if (filteredEntries.length === 0) {
      return null;
    }

    const sentimentCounts = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    filteredEntries.forEach(entry => {
      sentimentCounts[entry.analysis.sentiment.type]++;
    });

    const dominantSentiment = Object.entries(sentimentCounts).reduce((a, b) =>
      sentimentCounts[a[0] as keyof typeof sentimentCounts] > sentimentCounts[b[0] as keyof typeof sentimentCounts] ? a : b
    )[0] as 'positive' | 'neutral' | 'negative';

    return {
      total: filteredEntries.length,
      sentimentCounts,
      dominantSentiment,
    };
  }, [filteredEntries]);

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

  const renderDateFilterChip = (filter: DateFilterType, label: string) => {
    const isSelected = selectedDateFilter === filter;
    return (
      <TouchableOpacity
        key={filter}
        onPress={() => setSelectedDateFilter(filter)}
        style={[
          styles.dateFilterChip,
          isSelected && styles.dateFilterChipSelected,
        ]}
        activeOpacity={0.7}
      >
        <Text style={[
          styles.dateFilterChipText,
          isSelected && styles.dateFilterChipTextSelected,
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
                color="#60A5FA"
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
              <Icon name="lightbulb" size={18} color="#60A5FA" />
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
          <Text style={styles.entriesCount}>0 entries</Text>
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
        <View style={styles.headerTop}>
          <Text style={styles.pageTitle}>History</Text>
          {weeklySummary && (
            <Text style={styles.entriesCount}>{weeklySummary.total} entries</Text>
          )}
        </View>

        {/* Emotion Filter Bar */}
        <View style={styles.filterBar}>
          {renderFilterChip('all', 'All')}
          {renderFilterChip('positive', 'Positive')}
          {renderFilterChip('neutral', 'Neutral')}
          {renderFilterChip('negative', 'Negative')}
        </View>

        {/* Date Filter Bar */}
        <View style={styles.dateFilterBar}>
          {renderDateFilterChip('all', 'All Time')}
          {renderDateFilterChip('today', 'Today')}
          {renderDateFilterChip('last7days', 'Last 7 Days')}
          {renderDateFilterChip('thismonth', 'This Month')}
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
          ref={flatListRef}
          data={filteredEntries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            weeklySummary ? (
              <View style={styles.summaryContainer}>
                <GlassCard style={[styles.summaryCard, { padding: 8 }]}>
                  <TouchableOpacity
                    onPress={() => setIsWeeklySummaryExpanded(!isWeeklySummaryExpanded)}
                    style={styles.summaryHeader}
                    activeOpacity={0.7}
                  >
                    <View style={styles.summaryHeaderLeft}>
                      <Icon name="calendar-outline" size={18} color={THEME_COLORS.primary} style={{ opacity: 0.6 }} />
                      <Text style={styles.summaryTitle}>Weekly Summary</Text>
                    </View>
                    <Icon
                      name={isWeeklySummaryExpanded ? "chevron-up" : "chevron-down"}
                      size={16}
                      color={THEME_COLORS.primary}
                      style={{ opacity: 0.5 }}
                    />
                  </TouchableOpacity>
                  
                  {isWeeklySummaryExpanded && (
                    <>
                      {/* Soft Clean Chart - With Custom Legend */}
                      {weeklySummary.sentimentCounts.positive + weeklySummary.sentimentCounts.neutral + weeklySummary.sentimentCounts.negative > 0 && (
                        <View style={styles.chartContainer}>
                          <View style={styles.chartWithLegend}>
                            <PieChart
                              data={[
                                {
                                  name: '',
                                  population: weeklySummary.sentimentCounts.positive,
                                  color: '#B7F3D3',
                                  legendFontColor: 'transparent',
                                  legendFontSize: 0,
                                },
                                {
                                  name: '',
                                  population: weeklySummary.sentimentCounts.neutral,
                                  color: '#C5D3E0',
                                  legendFontColor: 'transparent',
                                  legendFontSize: 0,
                                },
                                {
                                  name: '',
                                  population: weeklySummary.sentimentCounts.negative,
                                  color: '#FFB8A8',
                                  legendFontColor: 'transparent',
                                  legendFontSize: 0,
                                },
                              ]}
                              width={160}
                              height={140}
                              chartConfig={{
                                backgroundColor: 'transparent',
                                backgroundGradientFrom: 'transparent',
                                backgroundGradientTo: 'transparent',
                                color: (opacity = 1) => `rgba(139, 92, 246, ${opacity * 0.3})`,
                              }}
                              accessor="population"
                              backgroundColor="transparent"
                              paddingLeft="15"
                              absolute
                              hasLegend={false}
                              style={{
                                marginVertical: 8,
                              }}
                            />
                            {/* Custom Legend with Smaller Dots and Counts */}
                            <View style={styles.customLegend}>
                              {weeklySummary.sentimentCounts.positive > 0 && (
                                <View style={styles.legendItem}>
                                  <View style={[styles.legendDot, { backgroundColor: '#B7F3D3' }]} />
                                  <Text style={[styles.legendText, { color: '#4A9B74' }]}>
                                    {weeklySummary.sentimentCounts.positive} Positive
                                  </Text>
                                </View>
                              )}
                              {weeklySummary.sentimentCounts.neutral > 0 && (
                                <View style={styles.legendItem}>
                                  <View style={[styles.legendDot, { backgroundColor: '#C5D3E0' }]} />
                                  <Text style={[styles.legendText, { color: '#7A8FA3' }]}>
                                    {weeklySummary.sentimentCounts.neutral} Neutral
                                  </Text>
                                </View>
                              )}
                              {weeklySummary.sentimentCounts.negative > 0 && (
                                <View style={styles.legendItem}>
                                  <View style={[styles.legendDot, { backgroundColor: '#FFB8A8' }]} />
                                  <Text style={[styles.legendText, { color: '#C16B5A' }]}>
                                    {weeklySummary.sentimentCounts.negative} Negative
                                  </Text>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      )}

                      {/* Weekly Mood - Small, Clean Row - Only Badge Background */}
                      <View style={styles.summaryDominant}>
                        <Icon 
                          name={getSentimentBadge(weeklySummary.dominantSentiment).label === 'Positive' ? 'emoticon-happy-outline' : 
                                getSentimentBadge(weeklySummary.dominantSentiment).label === 'Negative' ? 'emoticon-sad-outline' : 
                                'emoticon-neutral-outline'} 
                          size={18} 
                          color={THEME_COLORS.primary}
                          style={{ opacity: 0.55 }}
                        />
                        <View style={[
                          styles.summaryDominantBadge,
                          { backgroundColor: 'rgba(139, 92, 246, 0.15)' }
                        ]}>
                          <Text style={[
                            styles.summaryDominantText,
                            { color: 'rgba(139, 92, 246, 0.85)' }
                          ]}>
                            Weekly Mood: {getSentimentBadge(weeklySummary.dominantSentiment).label}
                          </Text>
                        </View>
                      </View>
                    </>
                  )}
                </GlassCard>
    </View>
            ) : null
          }
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
  headerTop: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 12,
    marginBottom: 16,
  },
  pageTitle: {
    fontSize: 32,
    color: THEME_COLORS.primary,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  entriesCount: {
    fontSize: 12,
    color: THEME_COLORS.textSecondary,
    fontWeight: '400',
    opacity: 0.7,
  },
  // Emotion Filter Bar - Primary, Soft
  filterBar: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: 'rgba(139, 92, 246, 0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 92, 246, 0.12)',
  },
  filterChipSelected: {
    backgroundColor: 'rgba(139, 92, 246, 0.18)',
    borderColor: 'rgba(139, 92, 246, 0.25)',
  },
  filterChipText: {
    fontSize: 12,
    fontWeight: '500',
    color: THEME_COLORS.primary,
    letterSpacing: -0.1,
    opacity: 0.75,
  },
  filterChipTextSelected: {
    color: THEME_COLORS.primary,
    opacity: 1,
    fontWeight: '600',
  },
  // Date Filter Bar - Secondary, Muted
  dateFilterBar: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 10,
    flexWrap: 'wrap',
  },
  dateFilterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    backgroundColor: 'rgba(139, 126, 153, 0.06)',
    borderWidth: 0.5,
    borderColor: 'rgba(139, 126, 153, 0.1)',
  },
  dateFilterChipSelected: {
    backgroundColor: 'rgba(139, 126, 153, 0.12)',
    borderColor: 'rgba(139, 126, 153, 0.18)',
  },
  dateFilterChipText: {
    fontSize: 11,
    fontWeight: '400',
    color: '#8B7E99',
    letterSpacing: -0.05,
    opacity: 0.65,
  },
  dateFilterChipTextSelected: {
    color: '#8B7E99',
    opacity: 0.85,
    fontWeight: '500',
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
  // Filtered Summary - Matches Entry Cards Style
  summaryContainer: {
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 0,
  },
  summaryCard: {
    marginBottom: 24, // Same as entry cards
  },
  summaryCardCompact: {
    padding: 18,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
    paddingTop: 3,
    paddingBottom: 0,
  },
  summaryHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: THEME_COLORS.primary,
    letterSpacing: -0.2,
    opacity: 0.9,
  },
  chartContainer: {
    marginVertical: 8,
    marginHorizontal: 0,
    alignItems: 'center',
  },
  chartWithLegend: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    gap: 0,
  },
  customLegend: {
    flexDirection: 'column',
    gap: 10,
    justifyContent: 'center',
    marginLeft: -12,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  legendDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  legendText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  summarySentiments: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  summarySentimentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: 'rgba(139, 92, 246, 0.1)',
  },
  summarySentimentDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
  },
  summarySentimentText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
  },
  summaryDominant: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 16,
    marginTop: 8,
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(139, 92, 246, 0.1)',
  },
  summaryDominantBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 0.5,
    borderColor: 'rgba(139, 92, 246, 0.18)',
  },
  summaryDominantText: {
    fontSize: 12,
    fontWeight: '500',
    letterSpacing: -0.1,
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
    backgroundColor: 'rgba(96, 165, 250, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
  },
  suggestionChipText: {
    fontSize: 13,
    color: '#3B82F6',
    fontWeight: '600',
    letterSpacing: -0.1,
  },
  suggestionExpanded: {
    marginTop: 12,
    padding: 14,
    backgroundColor: 'rgba(96, 165, 250, 0.05)',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#60A5FA',
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  suggestionTitle: {
    fontSize: 14,
    color: '#3B82F6',
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
