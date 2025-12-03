import apiClient from '../api/client';
import { AnalysisResult, AnalysisRequest, SentimentType, EmotionType } from '../models';
import { API_CONFIG } from '../constants';

class AIService {
  async analyzeSentiment(request: AnalysisRequest): Promise<AnalysisResult> {
    // Auto-detect language from text
    const detectedLanguage = this.detectLanguage(request.text);
    const useTurkishModel = detectedLanguage === 'turkish';
    
    // PRIMARY: Use Hugging Face API with language-specific model
    try {
      const sentimentResponse = await this.callHuggingFace(request.text, useTurkishModel);
      const apiSentiment = this.parseSentiment(sentimentResponse, useTurkishModel);
      
      // Enhance API result with keyword analysis for the selected language
      const keywordSentiment = useTurkishModel
        ? this.analyzeTurkishSentiment(request.text)
        : this.analyzeEnglishSentiment(request.text);
      
      // If API gives neutral but keyword analysis is confident, enhance the result
      let finalSentiment = apiSentiment;
      if (apiSentiment.type === 'neutral' && keywordSentiment.confidence > 0.7) {
        // Use keyword analysis to improve neutral API results
        finalSentiment = {
          type: keywordSentiment.type,
          score: Math.max(apiSentiment.score, keywordSentiment.score),
          label: keywordSentiment.label,
        };
      } else if (apiSentiment.score < 0.6 && keywordSentiment.confidence > 0.7) {
        // If API is not confident, enhance with keyword analysis
        finalSentiment = {
          type: keywordSentiment.type,
          score: (apiSentiment.score + keywordSentiment.score) / 2,
          label: keywordSentiment.label,
        };
      }
      
      const emotions = this.detectEmotions(request.text, detectedLanguage);
      const summary = this.generateSummary(finalSentiment.type, detectedLanguage);
      const suggestion = this.generateSuggestion(finalSentiment.type, detectedLanguage);
      const motivationScore = this.calculateMotivationScore(finalSentiment);

      return {
        sentiment: finalSentiment,
        emotions,
        summary,
        suggestion,
        motivationScore,
        timestamp: Date.now(),
      };
    } catch (error) {
      // FALLBACK: Use keyword-based analysis if API fails completely
      console.log('Using fallback keyword analysis:', error instanceof Error ? error.message : 'API unavailable');
      const keywordSentiment = useTurkishModel
        ? this.analyzeTurkishSentiment(request.text)
        : this.analyzeEnglishSentiment(request.text);

      const emotions = this.detectEmotions(request.text, detectedLanguage);
      const summary = this.generateSummary(keywordSentiment.type, detectedLanguage);
      const suggestion = this.generateSuggestion(keywordSentiment.type, detectedLanguage);
      const motivationScore = this.calculateMotivationScore(keywordSentiment);

      return {
        sentiment: {
          type: keywordSentiment.type,
          score: keywordSentiment.score,
          label: keywordSentiment.label,
        },
        emotions,
        summary,
        suggestion,
        motivationScore,
        timestamp: Date.now(),
      };
    }
  }

  // Detect if text is Turkish or English
  private detectLanguage(text: string): 'turkish' | 'english' {
    const lowerText = text.toLowerCase();
    const turkishChars = ['ç', 'ğ', 'ı', 'ö', 'ş', 'ü'];
    const turkishWords = ['bugün', 'mutlu', 'hissediyorum', 'çok', 'biraz', 'yorgunum', 'iyiyim'];
    const englishWords = ['today', 'happy', 'feel', 'very', 'little', 'tired', 'fine'];
    
    const hasTurkishChars = turkishChars.some(char => lowerText.includes(char));
    const turkishWordCount = turkishWords.filter(word => lowerText.includes(word)).length;
    const englishWordCount = englishWords.filter(word => lowerText.includes(word)).length;
    
    if (hasTurkishChars || turkishWordCount > englishWordCount) {
      return 'turkish';
    }
    return 'english';
  }

  // English keyword-based sentiment analysis
  private analyzeEnglishSentiment(text: string): { type: SentimentType; score: number; label: string; confidence: number } {
    const lowerText = text.toLowerCase();
    
    // Positive keywords (with weights)
    const positiveKeywords = [
      { word: 'very happy', weight: 1.0 },
      { word: 'happy', weight: 0.9 },
      { word: 'great', weight: 0.95 },
      { word: 'excellent', weight: 0.95 },
      { word: 'wonderful', weight: 0.9 },
      { word: 'amazing', weight: 0.95 },
      { word: 'fantastic', weight: 0.9 },
      { word: 'good', weight: 0.8 },
      { word: 'fine', weight: 0.7 },
      { word: 'motivated', weight: 0.85 },
      { word: 'energetic', weight: 0.8 },
      { word: 'excited', weight: 0.85 },
      { word: 'joyful', weight: 0.9 },
      { word: 'pleased', weight: 0.85 },
    ];

    // Negative keywords (with weights)
    const negativeKeywords = [
      { word: 'very sad', weight: 1.0 },
      { word: 'sad', weight: 0.9 },
      { word: 'unhappy', weight: 0.9 },
      { word: 'bad', weight: 0.85 },
      { word: 'terrible', weight: 0.95 },
      { word: 'awful', weight: 0.9 },
      { word: 'worried', weight: 0.8 },
      { word: 'anxious', weight: 0.8 },
      { word: 'stressed', weight: 0.85 },
      { word: 'tired', weight: 0.7 },
      { word: 'exhausted', weight: 0.8 },
      { word: 'overwhelmed', weight: 0.85 },
      { word: 'afraid', weight: 0.9 },
      { word: 'fear', weight: 0.85 },
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    // Check for positive keywords
    for (const { word, weight } of positiveKeywords) {
      if (lowerText.includes(word)) {
        positiveScore += weight;
      }
    }

    // Check for negative keywords
    for (const { word, weight } of negativeKeywords) {
      if (lowerText.includes(word)) {
        negativeScore += weight;
      }
    }

    // Calculate confidence based on keyword matches
    const totalScore = positiveScore + negativeScore;
    const confidence = Math.min(totalScore / 2, 1);

    // Determine sentiment
    if (positiveScore > negativeScore && positiveScore > 0.5) {
      const score = Math.min(0.5 + (positiveScore / 2), 0.95);
      return {
        type: 'positive',
        score,
        label: 'Pozitif',
        confidence,
      };
    } else if (negativeScore > positiveScore && negativeScore > 0.5) {
      const score = Math.min(0.5 + (negativeScore / 2), 0.95);
      return {
        type: 'negative',
        score,
        label: 'Negatif',
        confidence,
      };
    } else {
      return {
        type: 'neutral',
        score: 0.5,
        label: 'Nötr',
        confidence: Math.max(confidence, 0.3),
      };
    }
  }

  // Turkish keyword-based sentiment analysis (more accurate for Turkish text)
  private analyzeTurkishSentiment(text: string): { type: SentimentType; score: number; label: string; confidence: number } {
    const lowerText = text.toLowerCase();
    
    // Positive keywords (with weights)
    const positiveKeywords = [
      { word: 'çok mutlu', weight: 1.0 },
      { word: 'mutlu', weight: 0.9 },
      { word: 'harika', weight: 0.95 },
      { word: 'mükemmel', weight: 0.95 },
      { word: 'güzel', weight: 0.8 },
      { word: 'sevindim', weight: 0.9 },
      { word: 'keyifli', weight: 0.85 },
      { word: 'neşeli', weight: 0.9 },
      { word: 'iyi', weight: 0.7 },
      { word: 'iyiyim', weight: 0.8 },
      { word: 'harika', weight: 0.95 },
      { word: 'süper', weight: 0.9 },
      { word: 'motive', weight: 0.85 },
      { word: 'enerjik', weight: 0.8 },
      { word: 'heyecanlı', weight: 0.85 },
    ];

    // Negative keywords (with weights)
    const negativeKeywords = [
      { word: 'çok mutsuz', weight: 1.0 },
      { word: 'mutsuz', weight: 0.9 },
      { word: 'üzgün', weight: 0.9 },
      { word: 'kötü', weight: 0.85 },
      { word: 'hüzünlü', weight: 0.85 },
      { word: 'kederli', weight: 0.9 },
      { word: 'endişeli', weight: 0.8 },
      { word: 'kaygılı', weight: 0.8 },
      { word: 'stresli', weight: 0.85 },
      { word: 'yorgun', weight: 0.7 },
      { word: 'bitkin', weight: 0.8 },
      { word: 'bunalmış', weight: 0.85 },
      { word: 'korkuyorum', weight: 0.9 },
      { word: 'korku', weight: 0.85 },
    ];

    let positiveScore = 0;
    let negativeScore = 0;

    // Check for positive keywords
    for (const { word, weight } of positiveKeywords) {
      if (lowerText.includes(word)) {
        positiveScore += weight;
      }
    }

    // Check for negative keywords
    for (const { word, weight } of negativeKeywords) {
      if (lowerText.includes(word)) {
        negativeScore += weight;
      }
    }

    // Calculate confidence based on keyword matches
    const totalScore = positiveScore + negativeScore;
    const confidence = Math.min(totalScore / 2, 1); // Normalize to 0-1

    // Determine sentiment
    if (positiveScore > negativeScore && positiveScore > 0.5) {
      const score = Math.min(0.5 + (positiveScore / 2), 0.95);
      return {
        type: 'positive',
        score,
        label: 'Pozitif',
        confidence,
      };
    } else if (negativeScore > positiveScore && negativeScore > 0.5) {
      const score = Math.min(0.5 + (negativeScore / 2), 0.95);
      return {
        type: 'negative',
        score,
        label: 'Negatif',
        confidence,
      };
    } else {
      return {
        type: 'neutral',
        score: 0.5,
        label: 'Nötr',
        confidence: Math.max(confidence, 0.3),
      };
    }
  }

  private async callHuggingFace(text: string, useTurkishModel: boolean, retryCount = 0): Promise<any> {
    // Use language-specific model
    const model = useTurkishModel 
      ? API_CONFIG.TURKISH_SENTIMENT_MODEL 
      : API_CONFIG.ENGLISH_SENTIMENT_MODEL;
    const endpoint = `/${model}`;

    try {
      const response = await apiClient.post(endpoint, {
        inputs: text,
      });
      
      // Check if model is still loading
      const responseData = response as any;
      if (responseData?.error) {
        if (typeof responseData.error === 'string' && responseData.error.includes('loading') && retryCount < API_CONFIG.MAX_RETRIES) {
          const waitTime = Math.min(2000 * (retryCount + 1), 10000); // Exponential backoff, max 10s
          console.log(`Model loading, retrying in ${waitTime}ms... (attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
          await new Promise<void>(resolve => setTimeout(() => resolve(), waitTime));
          return await this.callHuggingFace(text, useTurkishModel, retryCount + 1);
        }
        throw new Error(typeof responseData.error === 'string' ? responseData.error : 'Model error');
      }
      
      return response;
    } catch (error: any) {
      // Handle 503 - Model loading
      if (error.response?.status === 503 && retryCount < API_CONFIG.MAX_RETRIES) {
        const waitTime = Math.min(2000 * (retryCount + 1), 10000);
        console.log(`Model loading (503), retrying in ${waitTime}ms... (attempt ${retryCount + 1}/${API_CONFIG.MAX_RETRIES})`);
        await new Promise<void>(resolve => setTimeout(() => resolve(), waitTime));
        return await this.callHuggingFace(text, useTurkishModel, retryCount + 1);
      }
      
      // Handle network errors
      if (!error.response && error.request) {
        throw new Error('İnternet bağlantısı yok. Lütfen bağlantınızı kontrol edin.');
      }
      
      // Handle rate limiting
      if (error.response?.status === 429) {
        throw new Error('Çok fazla istek gönderildi. Lütfen birkaç saniye sonra tekrar deneyin.');
      }
      
      // Handle 401 - Unauthorized (API token required or endpoint issue)
      if (error.response?.status === 401) {
        throw new Error('API authentication hatası. Türkçe analiz kullanılıyor.');
      }
      
      // Handle 410 - Gone (deprecated endpoint)
      if (error.response?.status === 410) {
        throw new Error('API endpoint güncellenmiş. Türkçe analiz kullanılıyor.');
      }
      
      throw error;
    }
  }

  private parseSentiment(response: any, useTurkishModel: boolean): { type: SentimentType; score: number; label: string } {
    if (!response || !Array.isArray(response) || response.length === 0) {
      return { type: 'neutral', score: 0.5, label: useTurkishModel ? 'Nötr' : 'Neutral' };
    }

    const results = response[0];
    
    // Turkish model might use different labels (POSITIVE/NEGATIVE or pozitif/negatif)
    // English model uses POSITIVE/NEGATIVE
    let positive = results.find((r: any) => 
      r.label === 'POSITIVE' || r.label === 'pozitif' || r.label === 'POS' || r.label === 'LABEL_1'
    );
    let negative = results.find((r: any) => 
      r.label === 'NEGATIVE' || r.label === 'negatif' || r.label === 'NEG' || r.label === 'LABEL_0'
    );

    // If not found, try to find by score order
    if (!positive || !negative) {
      const sorted = [...results].sort((a: any, b: any) => b.score - a.score);
      positive = sorted[0];
      negative = sorted[1] || sorted[0];
    }

    if (!positive || !negative) {
      return { type: 'neutral', score: 0.5, label: useTurkishModel ? 'Nötr' : 'Neutral' };
    }

    if (positive.score > negative.score) {
      return {
        type: 'positive',
        score: positive.score,
        label: useTurkishModel ? 'Pozitif' : 'Positive',
      };
    } else if (negative.score > positive.score) {
      return {
        type: 'negative',
        score: negative.score,
        label: useTurkishModel ? 'Negatif' : 'Negative',
      };
    } else {
      return { type: 'neutral', score: 0.5, label: useTurkishModel ? 'Nötr' : 'Neutral' };
    }
  }

  private detectEmotions(text: string, language: 'turkish' | 'english' = 'turkish'): Array<{ type: EmotionType; intensity: number }> {
    const lowerText = text.toLowerCase();
    const emotions: Array<{ type: EmotionType; intensity: number }> = [];
    const isTurkish = language === 'turkish';

    const emotionKeywords: Record<EmotionType, string[]> = isTurkish ? {
      // Turkish keywords
      happy: ['mutlu', 'harika', 'güzel', 'sevindim', 'keyifli', 'neşeli', 'iyi', 'süper', 'mükemmel'],
      sad: ['üzgün', 'kötü', 'mutsuz', 'hüzünlü', 'kederli', 'acı', 'kırgın'],
      anxious: ['endişeli', 'kaygılı', 'gergin', 'tedirgin', 'korku', 'korkuyorum'],
      calm: ['sakin', 'huzurlu', 'dingin', 'rahat', 'dengeli'],
      motivated: ['motive', 'hevesli', 'enerjik', 'istekli', 'azimli'],
      tired: ['yorgun', 'bitkin', 'tükenmiş', 'yıpranmış', 'halsiz'],
      excited: ['heyecanlı', 'coşkulu', 'ateşli', 'coşku'],
      stressed: ['stresli', 'bunalmış', 'baskı altında', 'gergin'],
    } : {
      // English keywords
      happy: ['happy', 'great', 'wonderful', 'amazing', 'fantastic', 'joyful', 'pleased', 'good', 'fine'],
      sad: ['sad', 'unhappy', 'terrible', 'awful', 'bad', 'sorrowful'],
      anxious: ['worried', 'anxious', 'nervous', 'tense', 'fear', 'afraid'],
      calm: ['calm', 'peaceful', 'relaxed', 'serene', 'balanced'],
      motivated: ['motivated', 'enthusiastic', 'energetic', 'determined'],
      tired: ['tired', 'exhausted', 'drained', 'weary', 'fatigued'],
      excited: ['excited', 'thrilled', 'enthusiastic', 'eager'],
      stressed: ['stressed', 'overwhelmed', 'under pressure', 'tense'],
    };

    for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
      const matches = keywords.filter(keyword => lowerText.includes(keyword));
      if (matches.length > 0) {
        // Calculate intensity based on number of matches and keyword strength
        const intensity = Math.min(matches.length * 0.25 + 0.3, 1);
        emotions.push({
          type: emotion as EmotionType,
          intensity,
        });
      }
    }

    // Sort by intensity and take top 3
    emotions.sort((a, b) => b.intensity - a.intensity);

    if (emotions.length === 0) {
      emotions.push({ type: 'calm', intensity: 0.5 });
    }

    return emotions.slice(0, 3);
  }

  private generateSummary(sentiment: SentimentType, language: 'turkish' | 'english' = 'turkish'): string {
    const summaries = language === 'turkish' ? {
      positive: 'Bugün genel olarak olumlu bir gün geçirmişsin. Harika!',
      neutral: 'Bugün dengeli bir gün geçirmişsin.',
      negative: 'Bugün zorlu bir gün geçirmişsin gibi görünüyor.',
    } : {
      positive: 'You had a generally positive day today. Great!',
      neutral: 'You had a balanced day today.',
      negative: 'It seems like you had a challenging day today.',
    };
    return summaries[sentiment];
  }

  private generateSuggestion(sentiment: SentimentType, language: 'turkish' | 'english' = 'turkish'): string {
    const suggestions = language === 'turkish' ? {
      positive:
        'Harika! Bu pozitif enerjiyi korumak için sevdiğin bir aktivite yapabilirsin.',
      neutral:
        'Kendine 10-15 dakikalık bir mola vererek gününü zenginleştirebilirsin.',
      negative:
        'Derin nefes al ve sevdiğin birisiyle sohbet etmeyi dene. Yürüyüş de iyi gelebilir.',
    } : {
      positive:
        'Great! You can do an activity you enjoy to maintain this positive energy.',
      neutral:
        'You can enrich your day by taking a 10-15 minute break for yourself.',
      negative:
        'Take a deep breath and try talking to someone you love. A walk might also help.',
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

  private getFallbackAnalysis(error?: any): AnalysisResult {
    let summary = 'Analiz şu anda yapılamıyor. Lütfen daha sonra tekrar dene.';
    let suggestion = 'İnternet bağlantını kontrol et ve tekrar dene.';

    if (error?.message) {
      if (error.message.includes('İnternet bağlantısı')) {
        summary = 'İnternet bağlantısı bulunamadı.';
        suggestion = 'Wi-Fi veya mobil veri bağlantınızı kontrol edin.';
      } else if (error.message.includes('çok fazla istek')) {
        summary = 'Çok fazla istek gönderildi.';
        suggestion = 'Birkaç saniye bekleyip tekrar deneyin veya Hugging Face API token kullanın.';
      } else {
        summary = error.message;
      }
    }

    return {
      sentiment: {
        type: 'neutral',
        score: 0.5,
        label: 'Nötr',
      },
      emotions: [{ type: 'calm', intensity: 0.5 }],
      summary,
      suggestion,
      motivationScore: 50,
      timestamp: Date.now(),
    };
  }
}

export default new AIService();
