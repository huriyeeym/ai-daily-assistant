import { Sentiment, Emotion } from './Sentiment';

export interface AnalysisResult {
  sentiment: Sentiment;
  emotions: Emotion[];
  summary: string;
  suggestion: string;
  motivationScore: number; // 0-100
  timestamp: number;
}

export interface AnalysisRequest {
  text: string;
  language?: 'turkish' | 'english';
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  error?: string;
}
