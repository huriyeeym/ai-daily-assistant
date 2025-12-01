import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import {
  Card,
  Text,
  ActivityIndicator,
  IconButton,
  Chip,
} from 'react-native-paper';
import { useEntries } from '../../hooks';
import { DiaryEntry } from '../../models';
import { formatDateTime, getSentimentColor, getSentimentEmoji } from '../../utils';

const HistoryScreen = () => {
  const { entries, loading, deleteEntry } = useEntries();

  const handleDelete = async (id: string) => {
    try {
      await deleteEntry(id);
    } catch (err) {
      console.error('Error deleting entry:', err);
    }
  };

  const renderEntry = ({ item }: { item: DiaryEntry }) => {
    const sentimentColor = getSentimentColor(item.analysis.sentiment.type);

    return (
      <Card style={[styles.card, { borderLeftColor: sentimentColor }]}>
        <Card.Content>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text variant="headlineSmall">
                {getSentimentEmoji(item.analysis.sentiment.type)}
              </Text>
              <View style={styles.headerInfo}>
                <Text variant="titleMedium" style={{ color: sentimentColor }}>
                  {item.analysis.sentiment.label}
                </Text>
                <Text variant="bodySmall">
                  {formatDateTime(item.createdAt)}
                </Text>
              </View>
            </View>
            <IconButton
              icon="delete"
              size={20}
              onPress={() => handleDelete(item.id)}
            />
          </View>

          <Text style={styles.text}>{item.text}</Text>

          <View style={styles.footer}>
            <Chip icon="chart-line" compact>
              Motivasyon: {Math.round(item.analysis.motivationScore)}
            </Chip>
            <Chip icon="lightbulb-on" compact style={styles.suggestionChip}>
              {item.analysis.emotions[0]?.type}
            </Chip>
          </View>
        </Card.Content>
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (entries.length === 0) {
    return (
      <View style={styles.empty}>
        <Text variant="headlineMedium">📝</Text>
        <Text variant="titleLarge" style={styles.emptyText}>
          Henüz kayıt yok
        </Text>
        <Text variant="bodyMedium" style={styles.emptySubtext}>
          İlk günlük kaydını oluşturmak için Ana Sayfa'ya git
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={entries}
        renderItem={renderEntry}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
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
  list: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerInfo: {
    marginLeft: 12,
  },
  text: {
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  suggestionChip: {
    marginLeft: 8,
  },
});

export default HistoryScreen;
