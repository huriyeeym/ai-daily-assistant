import React, { useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import { useEntries } from '../../hooks';
import { getSentimentColor, getSentimentEmoji, getWeekNumber } from '../../utils';
import { SentimentType } from '../../models';

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

    return {
      total: entries.length,
      sentimentCounts,
      dominantSentiment,
      averageMotivation,
      thisWeek: thisWeek.length,
    };
  }, [entries]);

  if (!stats) {
    return (
      <View style={styles.empty}>
        <Text variant="headlineMedium">📊</Text>
        <Text variant="titleLarge" style={styles.emptyText}>
          Henüz veri yok
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          İstatistikleri görmek için günlük kayıtları oluştur
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Genel İstatistikler
          </Text>
          <View style={styles.statRow}>
            <Text variant="bodyLarge">Toplam Kayıt:</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {stats.total}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyLarge">Bu Hafta:</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {stats.thisWeek}
            </Text>
          </View>
          <View style={styles.statRow}>
            <Text variant="bodyLarge">Ortalama Motivasyon:</Text>
            <Text variant="titleMedium" style={styles.statValue}>
              {Math.round(stats.averageMotivation)}
            </Text>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            Duygu Dağılımı
          </Text>
          <View style={styles.dominantSentiment}>
            <Text variant="headlineLarge">
              {getSentimentEmoji(stats.dominantSentiment)}
            </Text>
            <View style={styles.dominantInfo}>
              <Text variant="titleMedium">Baskın Duygu</Text>
              <Text
                variant="headlineSmall"
                style={{
                  color: getSentimentColor(stats.dominantSentiment),
                }}
              >
                {stats.dominantSentiment === 'positive'
                  ? 'Pozitif'
                  : stats.dominantSentiment === 'neutral'
                  ? 'Nötr'
                  : 'Negatif'}
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
              Pozitif: {stats.sentimentCounts.positive}
            </Chip>
            <Chip
              icon="emoticon-neutral"
              style={[
                styles.sentimentChip,
                { backgroundColor: getSentimentColor('neutral') + '20' },
              ]}
            >
              Nötr: {stats.sentimentCounts.neutral}
            </Chip>
            <Chip
              icon="emoticon-sad"
              style={[
                styles.sentimentChip,
                { backgroundColor: getSentimentColor('negative') + '20' },
              ]}
            >
              Negatif: {stats.sentimentCounts.negative}
            </Chip>
          </View>
        </Card.Content>
      </Card>

      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.cardTitle}>
            💡 İçgörüler
          </Text>
          <Text variant="bodyMedium" style={styles.insight}>
            {stats.averageMotivation >= 70
              ? 'Harika gidiyorsun! Motivasyonun çok yüksek.'
              : stats.averageMotivation >= 50
              ? 'İyi bir durumdasın. Böyle devam et!'
              : 'Kendine daha fazla zaman ayırmayı dene.'}
          </Text>
          <Text variant="bodyMedium" style={styles.insight}>
            {stats.thisWeek >= 5
              ? 'Bu hafta çok aktifsin! 🎉'
              : stats.thisWeek >= 3
              ? 'İyi bir ritm tutturmuşsun.'
              : 'Daha düzenli kayıt yapmayı dene.'}
          </Text>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 8,
  },
  emptySubtext: {
    textAlign: 'center',
    opacity: 0.6,
  },
  card: {
    marginBottom: 16,
  },
  cardTitle: {
    marginBottom: 16,
    fontWeight: 'bold',
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  statValue: {
    fontWeight: 'bold',
  },
  dominantSentiment: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
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
    padding: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 8,
  },
});

export default StatisticsScreen;
