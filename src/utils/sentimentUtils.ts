import { SentimentType, EmotionType } from '../models';
import { SENTIMENT_COLORS, EMOTION_COLORS } from '../constants';

export const getSentimentColor = (sentiment: SentimentType): string => {
  return SENTIMENT_COLORS[sentiment];
};

export const getEmotionColor = (emotion: EmotionType): string => {
  return EMOTION_COLORS[emotion];
};

export const getSentimentEmoji = (sentiment: SentimentType): string => {
  switch (sentiment) {
    case 'positive':
      return '😊';
    case 'neutral':
      return '😐';
    case 'negative':
      return '😔';
    default:
      return '😐';
  }
};

export const getEmotionEmoji = (emotion: EmotionType): string => {
  const emojiMap: Record<EmotionType, string> = {
    happy: '😄',
    sad: '😢',
    anxious: '😰',
    calm: '😌',
    motivated: '💪',
    tired: '😴',
    excited: '🤩',
    stressed: '😫',
  };
  return emojiMap[emotion];
};

export const getMotivationLevel = (score: number): string => {
  if (score >= 80) return 'Çok Yüksek';
  if (score >= 60) return 'Yüksek';
  if (score >= 40) return 'Orta';
  if (score >= 20) return 'Düşük';
  return 'Çok Düşük';
};
