import { AnalysisResult } from './Analysis';

export interface DiaryEntry {
  id: string;
  text: string;
  analysis: AnalysisResult;
  createdAt: number;
  updatedAt: number;
}

export interface WeeklySummary {
  weekNumber: number;
  year: number;
  startDate: number;
  endDate: number;
  entries: DiaryEntry[];
  averageMotivationScore: number;
  dominantSentiment: 'positive' | 'neutral' | 'negative';
  totalEntries: number;
}
