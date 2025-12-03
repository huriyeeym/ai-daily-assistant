export const API_CONFIG = {
  // Use the inference API directly (works without token for limited requests)
  HUGGING_FACE_URL: 'https://api-inference.huggingface.co/models',
  // English model (specified in PDF requirements)
  ENGLISH_SENTIMENT_MODEL: 'distilbert-base-uncased-finetuned-sst-2-english',
  // Turkish model (for better Turkish text analysis)
  TURKISH_SENTIMENT_MODEL: 'ba2hann/bert-base-turkish-sentiment-analysis',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
};
