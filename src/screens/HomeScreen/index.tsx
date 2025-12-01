import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {
  TextInput,
  Button,
  Card,
  Text,
  ActivityIndicator,
  Chip,
  Divider,
} from 'react-native-paper';
import { useAnalysis, useEntries } from '../../hooks';
import { AnalysisResult } from '../../models';
import { getSentimentColor, getSentimentEmoji, getEmotionEmoji, getMotivationLevel } from '../../utils';
import { APP_CONFIG } from '../../config/app.config';

const HomeScreen = () => {
  const [text, setText] = useState('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);

  const { analyze, loading, error } = useAnalysis();
  const { saveEntry } = useEntries();

  const handleAnalyze = async () => {
    if (text.trim().length < APP_CONFIG.MIN_ENTRY_LENGTH) {
      return;
    }

    const result = await analyze(text);
    if (result) {
      setAnalysisResult(result);
    }
  };

  const handleSave = async () => {
    if (!analysisResult) return;

    const entry = {
      id: Date.now().toString(),
      text,
      analysis: analysisResult,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    try {
      await saveEntry(entry);
      setText('');
      setAnalysisResult(null);
    } catch (err) {
      console.error('Error saving entry:', err);
    }
  };

  const sentimentColor = analysisResult
    ? getSentimentColor(analysisResult.sentiment.type)
    : '#E0E0E0';

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.content}>
        <Card style={styles.inputCard}>
          <Card.Content>
            <Text variant="titleMedium" style={styles.title}>
              Bugün nasıl hissediyorsun?
            </Text>
            <TextInput
              mode="outlined"
              placeholder="Düşüncelerini buraya yaz..."
              value={text}
              onChangeText={setText}
              multiline
              numberOfLines={6}
              maxLength={APP_CONFIG.MAX_ENTRY_LENGTH}
              style={styles.input}
            />
            <Text variant="bodySmall" style={styles.charCount}>
              {text.length} / {APP_CONFIG.MAX_ENTRY_LENGTH}
            </Text>
            <Button
              mode="contained"
              onPress={handleAnalyze}
              disabled={loading || text.trim().length < APP_CONFIG.MIN_ENTRY_LENGTH}
              style={styles.button}
            >
              {loading ? 'Analiz Ediliyor...' : 'Analiz Et'}
            </Button>
          </Card.Content>
        </Card>

        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
            <Text style={styles.loadingText}>Yapay zeka analiz yapıyor...</Text>
          </View>
        )}

        {error && (
          <Card style={[styles.resultCard, styles.errorCard]}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.errorText}>
                ❌ Hata
              </Text>
              <Text>{error}</Text>
            </Card.Content>
          </Card>
        )}

        {analysisResult && !loading && (
          <Card style={[styles.resultCard, { borderLeftColor: sentimentColor }]}>
            <Card.Content>
              <View style={styles.sentimentHeader}>
                <Text variant="headlineMedium">
                  {getSentimentEmoji(analysisResult.sentiment.type)}
                </Text>
                <View style={styles.sentimentInfo}>
                  <Text variant="titleLarge" style={{ color: sentimentColor }}>
                    {analysisResult.sentiment.label}
                  </Text>
                  <Text variant="bodySmall">
                    Güven: %{Math.round(analysisResult.sentiment.score * 100)}
                  </Text>
                </View>
              </View>

              <Divider style={styles.divider} />

              <Text variant="titleSmall" style={styles.sectionTitle}>
                Duygular
              </Text>
              <View style={styles.emotionsContainer}>
                {analysisResult.emotions.map((emotion, index) => (
                  <Chip key={index} icon="emoticon" style={styles.emotionChip}>
                    {getEmotionEmoji(emotion.type)} {emotion.type}
                  </Chip>
                ))}
              </View>

              <Divider style={styles.divider} />

              <Text variant="titleSmall" style={styles.sectionTitle}>
                Motivasyon Skoru
              </Text>
              <View style={styles.motivationContainer}>
                <Text variant="headlineLarge" style={styles.motivationScore}>
                  {Math.round(analysisResult.motivationScore)}
                </Text>
                <Text variant="bodyMedium">
                  {getMotivationLevel(analysisResult.motivationScore)}
                </Text>
              </View>

              <Divider style={styles.divider} />

              <Text variant="titleSmall" style={styles.sectionTitle}>
                Özet
              </Text>
              <Text>{analysisResult.summary}</Text>

              <Divider style={styles.divider} />

              <Text variant="titleSmall" style={styles.sectionTitle}>
                Öneri
              </Text>
              <Text>💡 {analysisResult.suggestion}</Text>

              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                icon="content-save"
              >
                Kaydet
              </Button>
            </Card.Content>
          </Card>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  inputCard: {
    marginBottom: 16,
  },
  title: {
    marginBottom: 12,
    fontWeight: 'bold',
  },
  input: {
    marginBottom: 8,
  },
  charCount: {
    textAlign: 'right',
    marginBottom: 12,
    opacity: 0.6,
  },
  button: {
    marginTop: 8,
  },
  loadingContainer: {
    alignItems: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 16,
  },
  resultCard: {
    marginBottom: 16,
    borderLeftWidth: 4,
  },
  errorCard: {
    borderLeftColor: '#F44336',
  },
  errorText: {
    color: '#F44336',
    marginBottom: 8,
  },
  sentimentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  sentimentInfo: {
    marginLeft: 12,
  },
  divider: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  emotionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  emotionChip: {
    marginRight: 8,
    marginBottom: 8,
  },
  motivationContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  motivationScore: {
    fontWeight: 'bold',
    color: '#4CAF50',
  },
  saveButton: {
    marginTop: 16,
  },
});

export default HomeScreen;
