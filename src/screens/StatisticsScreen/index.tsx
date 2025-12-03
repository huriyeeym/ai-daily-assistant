import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import GradientBackground from '../../components/common/GradientBackground';
import { LineChart, PieChart, BarChart } from 'react-native-chart-kit';
import { useEntries } from '../../hooks';
import { getSentimentColor, getSentimentEmoji, getWeekNumber, formatDate } from '../../utils';
import { SentimentType } from '../../models';
import { GRADIENT_COLORS, THEME_COLORS } from '../../constants';

const screenWidth = Dimensions.get('window').width;

const StatisticsScreen = () => {
  const { entries } = useEntries();

  const stats = useMemo(() => {
    if (entries.length === 0) {
      return null;
    }

    const sentimentCounts: Record<SentimentType, number> = {
      positive: 0,
      neutral: 0,
      negative: 0,
    };

    let totalMotivation = 0;
    const last7Days: number[] = [];
    const last7DaysLabels: string[] = [];

    // Get last 7 days data
    const today = new Date();
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dayEntries = entries.filter(entry => {
        const entryDate = new Date(entry.createdAt);
        return (
          entryDate.getDate() === date.getDate() &&
          entryDate.getMonth() === date.getMonth() &&
          entryDate.getFullYear() === date.getFullYear()
        );
      });
      last7Days.push(dayEntries.length);
      last7DaysLabels.push(formatDate(date).split(' ')[0]); // Just day name
    }

    entries.forEach(entry => {
      sentimentCounts[entry.analysis.sentiment.type]++;
      totalMotivation += entry.analysis.motivationScore;
    });

    const dominantSentiment = (Object.keys(sentimentCounts) as SentimentType[]).reduce(
      (a, b) => (sentimentCounts[a] > sentimentCounts[b] ? a : b),
    );

    const averageMotivation = totalMotivation / entries.length;

    const thisWeek = entries.filter(entry => {
      const entryWeek = getWeekNumber(new Date(entry.createdAt));
      const currentWeek = getWeekNumber(new Date());
      return entryWeek === currentWeek;
    });

    // Motivation trend (last 7 entries)
    const recentEntries = entries.slice(0, 7).reverse();
    const motivationTrend = recentEntries.map(e => Math.round(e.analysis.motivationScore));
    const motivationLabels = recentEntries.map(e => {
      const date = new Date(e.createdAt);
      return `${date.getDate()}/${date.getMonth() + 1}`;
    });

    return {
      total: entries.length,
      sentimentCounts,
      dominantSentiment,
      averageMotivation,
      thisWeek: thisWeek.length,
      last7Days,
      last7DaysLabels,
      motivationTrend,
      motivationLabels,
    };
  }, [entries]);

  if (!stats) {
    return (
      <GradientBackground
        colors={GRADIENT_COLORS.primary}
        style={styles.container}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.empty}>
          <Text variant="displaySmall" style={styles.emptyEmoji}>
            📊
          </Text>
          <Text variant="headlineMedium" style={styles.emptyText}>
            No data yet
          </Text>
          <Text variant="bodyLarge" style={styles.emptySubtext}>
            Create diary entries to see statistics
          </Text>
        </View>
      </GradientBackground>
    );
  }

  return (
    <GradientBackground
      colors={GRADIENT_COLORS.primary}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.header}>
        <Text variant="headlineLarge" style={styles.headerTitle}>
          Statistics
        </Text>
        <Text variant="bodyMedium" style={styles.headerSubtitle}>
          Insights from your journey
        </Text>
      </View>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            General Statistics
          </Text>
          <View style={styles.statRow}>
            <Text variant="bodyLarge">Total Entries:</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {stats.total}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyLarge">This Week:</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {stats.thisWeek}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyLarge">Average Motivation:</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {Math.round(stats.averageMotivation)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Sentiment Distribution
          </Text>
          
          {stats.sentimentCounts.positive + stats.sentimentCounts.neutral + stats.sentimentCounts.negative > 0 && (
            <View style={styles.chartContainer}>
              <PieChart
                data={[
                  {
                    name: 'Positive',
                    population: stats.sentimentCounts.positive,
                    color: getSentimentColor('positive'),
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                  },
                  {
                    name: 'Neutral',
                    population: stats.sentimentCounts.neutral,
                    color: getSentimentColor('neutral'),
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                  },
                  {
                    name: 'Negative',
                    population: stats.sentimentCounts.negative,
                    color: getSentimentColor('negative'),
                    legendFontColor: '#7F7F7F',
                    legendFontSize: 12,
                  },
                ]}
                width={screenWidth - 64}
                height={200}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#FFFFFF',
                  backgroundGradientTo: '#FFFFFF',
                  color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                accessor="population"
                backgroundColor="transparent"
                paddingLeft="15"
                absolute
              />
            </View>
          )}
          <View style={styles.dominantSentiment}>
            <Text variant="headlineLarge">
              {getSentimentEmoji(stats.dominantSentiment)}
            </Text>
            <View style={styles.dominantInfo}>
              <Text variant="titleMedium">Dominant Sentiment</Text>
              <Text
                variant="headlineSmall"
                style={{
                  color: getSentimentColor(stats.dominantSentiment),
                }}
              >
                {stats.dominantSentiment === 'positive'
                  ? 'Positive'
                  : stats.dominantSentiment === 'neutral'
                  ? 'Neutral'
                  : 'Negative'}
              </Text>
            </View>
          </View>

          <View style={styles.sentimentBreakdown}>
            <Chip
              icon="emoticon-happy"
              style={[
                styles.sentimentChip,
                { backgroundColor: getSentimentColor('positive') + '20' },
              ]}
            >
              Positive: {stats.sentimentCounts.positive}
            </Chip>
            <Chip
              icon="emoticon-neutral"
              style={[
                styles.sentimentChip,
                { backgroundColor: getSentimentColor('neutral') + '20' },
              ]}
            >
              Neutral: {stats.sentimentCounts.neutral}
            </Chip>
            <Chip
              icon="emoticon-sad"
              style={[
                styles.sentimentChip,
                { backgroundColor: getSentimentColor('negative') + '20' },
              ]}
            >
              Negative: {stats.sentimentCounts.negative}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      {stats.motivationTrend.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Motivation Trend
            </Text>
            <View style={styles.chartContainer}>
              <LineChart
                data={{
                  labels: stats.motivationLabels,
                  datasets: [
                    {
                      data: stats.motivationTrend,
                      color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                      strokeWidth: 2,
                    },
                  ],
                }}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#E8F5E9',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(76, 175, 80, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                  propsForDots: {
                    r: '6',
                    strokeWidth: '2',
                    stroke: '#4CAF50',
                  },
                }}
                bezier
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
              />
            </View>
          </Card.Content>
        </Card>
      )}

      {stats.last7Days.length > 0 && (
        <Card style={styles.card}>
          <Card.Content>
            <Text variant="titleLarge" style={styles.cardTitle}>
              Last 7 Days Activity
            </Text>
            <View style={styles.chartContainer}>
              <BarChart
                data={{
                  labels: stats.last7DaysLabels,
                  datasets: [
                    {
                      data: stats.last7Days,
                    },
                  ],
                }}
                width={screenWidth - 64}
                height={220}
                chartConfig={{
                  backgroundColor: '#FFFFFF',
                  backgroundGradientFrom: '#F5F5F5',
                  backgroundGradientTo: '#FFFFFF',
                  decimalPlaces: 0,
                  color: (opacity = 1) => `rgba(156, 39, 176, ${opacity})`,
                  labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                  style: {
                    borderRadius: 16,
                  },
                }}
                style={{
                  marginVertical: 8,
                  borderRadius: 16,
                }}
                showValuesOnTopOfBars
              />
            </View>
          </Card.Content>
        </Card>
      )}

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            💡 Insights
          </Text>
          <Text variant="bodyMedium" style={styles.insight}>
            {stats.averageMotivation >= 70
              ? 'You\'re doing great! Your motivation is very high.'
              : stats.averageMotivation >= 50
              ? 'You\'re in a good state. Keep it up!'
              : 'Try to take more time for yourself.'}
          </Text>
          <Text variant="bodyMedium" style={styles.insight}>
            {stats.thisWeek >= 5
              ? 'You\'re very active this week! 🎉'
              : stats.thisWeek >= 3
              ? 'You\'ve found a good rhythm.'
              : 'Try to make entries more regularly.'}
          </Text>
        </Card.Content>
      </Card>
      </ScrollView>
    </GradientBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 20,
  },
  headerTitle: {
    color: THEME_COLORS.textLight,
    fontWeight: 'bold',
  },
  headerSubtitle: {
    color: THEME_COLORS.textLight,
    opacity: 0.9,
    marginTop: 4,
  },
  content: {
    padding: 16,
    paddingBottom: 24,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyEmoji: {
    fontSize: 80,
    marginBottom: 24,
  },
  emptyText: {
    color: THEME_COLORS.textLight,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptySubtext: {
    color: THEME_COLORS.textLight,
    textAlign: 'center',
    opacity: 0.9,
  },
  card: {
    marginBottom: 16,
    borderRadius: 20,
    backgroundColor: THEME_COLORS.cardLight,
    shadowColor: THEME_COLORS.shadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontWeight: 'bold',
    color: THEME_COLORS.primary,
  },
  dominantSentiment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    padding: 16,
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 16,
  },
  dominantInfo: {
    marginLeft: 16,
  },
  sentimentBreakdown: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  sentimentChip: {
    marginBottom: 8,
  },
  insight: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: THEME_COLORS.surface,
    borderRadius: 12,
    fontSize: 15,
    lineHeight: 22,
  },
  chartContainer: {
    alignItems: 'center',
    marginVertical: 8,
  },
});

export default StatisticsScreen;
