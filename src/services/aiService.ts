import apiClient from '../api/client';
import { AnalysisResult, AnalysisRequest, SentimentType, EmotionType } from '../models';
import { API_CONFIG } from '../constants';

class AIService {
  async analyzeSentiment(request: AnalysisRequest): Promise<AnalysisResult> {
    try {
      const sentimentResponse = await this.callHuggingFace(request.text);

      const sentiment = this.parseSentiment(sentimentResponse);
      const emotions = this.detectEmotions(request.text);
      const summary = this.generateSummary(sentiment.type);
      const suggestion = this.generateSuggestion(sentiment.type);
      const motivationScore = this.calculateMotivationScore(sentiment);

      return {
        sentiment,
        emotions,
        summary,
        suggestion,
        motivationScore,
        timestamp: Date.now(),
      };
    } catch (error) {
      console.error('AI Analysis Error:', error);
      return this.getFallbackAnalysis();
    }
  }

  private async callHuggingFace(text: string): Promise<any> {
    const endpoint = `/${API_CONFIG.SENTIMENT_MODEL}`;

    try {
      const response = await apiClient.post(endpoint, {
        inputs: text,
      });
      return response;
    } catch (error: any) {
      if (error.response?.status === 503) {
        console.log('Model loading, retrying...');
        await new Promise(resolve => setTimeout(resolve, 2000));
        return await apiClient.post(endpoint, { inputs: text });
      }
      throw error;
    }
  }

  private parseSentiment(response: any): { type: SentimentType; score: number; label: string } {
    if (!response || !Array.isArray(response) || response.length === 0) {
      return { type: 'neutral', score: 0.5, label: 'Nötr' };
    }

    const results = response[0];
    const positive = results.find((r: any) => r.label === 'POSITIVE');
    const negative = results.find((r: any) => r.label === 'NEGATIVE');

    if (!positive || !negative) {
      return { type: 'neutral', score: 0.5, label: 'Nötr' };
    }

    if (positive.score > negative.score) {
      return {
        type: 'positive',
        score: positive.score,
        label: 'Pozitif',
      };
    } else if (negative.score > positive.score) {
      return {
        type: 'negative',
        score: negative.score,
        label: 'Negatif',
      };
    } else {
      return { type: 'neutral', score: 0.5, label: 'Nötr' };
    }
  }

  private detectEmotions(text: string): Array<{ type: EmotionType; intensity: number }> {
    const lowerText = text.toLowerCase();
    const emotions: Array<{ type: EmotionType; intensity: number }> = [];

    const emotionKeywords: Record<EmotionType, string[]> = {
      happy: ['mutlu', 'harika', 'güzel', 'sevindim', 'keyifli', 'neşeli'],
      sad: ['üzgün', 'kötü', 'mutsuz', 'hüzünlü', 'kederli'],
      anxious: ['endişeli', 'kaygılı', 'gergin', 'tedirgin'],
      calm: ['sakin', 'huzurlu', 'dingin', 'rahat'],
      motivated: ['motive', 'hevesli', 'enerjik', 'istekli'],
      tired: ['yorgun', 'bitkin', 'tükenmiş', 'yıpranmış'],
      excited: ['heyecanlı', 'coşkulu', 'ateşli'],
      stressed: ['stresli', 'bunalmış', 'baskı altında'],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matchCount = keywords.filter(keyword => lowerText.includes(keyword)).length;
      if (matchCount > 0) {
        emotions.push({
          type: emotion as EmotionType,
          intensity: Math.min(matchCount * 0.3, 1),
        });
      }
    }

    if (emotions.length === 0) {
      emotions.push({ type: 'calm', intensity: 0.5 });
    }

    return emotions.slice(0, 3);
  }

  private generateSummary(sentiment: SentimentType): string {
    const summaries = {
      positive: 'Bugün genel olarak olumlu bir gün geçirmişsin. Harika!',
      neutral: 'Bugün dengeli bir gün geçirmişsin.',
      negative: 'Bugün zorlu bir gün geçirmişsin gibi görünüyor.',
    };
    return summaries[sentiment];
  }

  private generateSuggestion(sentiment: SentimentType): string {
    const suggestions = {
      positive:
        'Harika! Bu pozitif enerjiyi korumak için sevdiğin bir aktivite yapabilirsin.',
      neutral:
        'Kendine 10-15 dakikalık bir mola vererek gününü zenginleştirebilirsin.',
      negative:
        'Derin nefes al ve sevdiğin birisiyle sohbet etmeyi dene. Yürüyüş de iyi gelebilir.',
    };
    return suggestions[sentiment];
  }

  private calculateMotivationScore(sentiment: { type: SentimentType; score: number }): number {
    const baseScore = sentiment.score * 100;

    if (sentiment.type === 'positive') {
      return Math.min(baseScore, 100);
    } else if (sentiment.type === 'negative') {
      return Math.max(100 - baseScore, 0);
    } else {
      return 50;
    }
  }

  private getFallbackAnalysis(): AnalysisResult {
    return {
      sentiment: {
        type: 'neutral',
        score: 0.5,
        label: 'Nötr',
      },
      emotions: [{ type: 'calm', intensity: 0.5 }],
      summary: 'Analiz şu anda yapılamıyor. Lütfen daha sonra tekrar dene.',
      suggestion: 'İnternet bağlantını kontrol et ve tekrar dene.',
      motivationScore: 50,
      timestamp: Date.now(),
    };
  }
}

export default new AIService();
