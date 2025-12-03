import { useState } from 'react';
import aiService from '../services/aiService';
import { AnalysisResult } from '../models';

export const useAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async (text: string): Promise<AnalysisResult | null> => {
    setLoading(true);
    setError(null);

    try {
      // Auto-detect language and analyze (no manual language selection)
      const result = await aiService.analyzeSentiment({ text });
      setLoading(false);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred during analysis';
      setError(errorMessage);
      setLoading(false);
      return null;
    }
  };

  return { analyze, loading, error };
};
