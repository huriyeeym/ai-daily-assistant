export type SentimentType = 'positive' | 'neutral' | 'negative';

export type EmotionType =
  | 'happy'
  | 'sad'
  | 'anxious'
  | 'calm'
  | 'motivated'
  | 'tired'
  | 'excited'
  | 'stressed';

export interface Sentiment {
  type: SentimentType;
  score: number; // 0-1
  label: string;
}

export interface Emotion {
  type: EmotionType;
  intensity: number; // 0-1
}
