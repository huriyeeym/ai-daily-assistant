export const API_CONFIG = {
  // Hugging Face Inference API endpoint
  HUGGING_FACE_URL: 'https://api-inference.huggingface.co',
  // English model (specified in PDF requirements)
  ENGLISH_SENTIMENT_MODEL: 'distilbert-base-uncased-finetuned-sst-2-english',
  // Turkish model (updated to actively maintained model)
  TURKISH_SENTIMENT_MODEL: 'savasy/bert-base-turkish-sentiment-cased',
  TIMEOUT: 30000,
  MAX_RETRIES: 3,
};
