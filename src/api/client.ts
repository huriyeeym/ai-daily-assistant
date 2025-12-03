import axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from 'axios';
import { API_CONFIG } from '../constants';

class ApiClient {
  private client: AxiosInstance;
  private apiToken: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.HUGGING_FACE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
    this.loadApiToken();
  }

  private loadApiToken() {
    // Try to load token from environment variables
    // For React Native, you can use react-native-config or store in a config file
    // For now, token is optional - API works without token but with rate limits
    this.apiToken = null;
    
    // TODO: Add token loading from environment or secure storage
    // Example: this.apiToken = process.env.HUGGING_FACE_API_TOKEN || null;
  }

  setApiToken(token: string | null) {
    this.apiToken = token;
  }

  private setupInterceptors() {
    this.client.interceptors.request.use(
      config => {
        // Add API token if available
        if (this.apiToken && config.headers) {
          config.headers.Authorization = `Bearer ${this.apiToken}`;
        }
        return config;
      },
      error => {
        return Promise.reject(error);
      },
    );

    this.client.interceptors.response.use(
      response => response,
      (error: AxiosError) => {
        if (error.response) {
          const status = error.response.status;
          const data = error.response.data as any;
          
          // Handle specific error cases
          if (status === 503) {
            // Model is loading
            console.log('Model is loading, will retry...');
          } else if (status === 429) {
            // Rate limit exceeded
            console.error('Rate limit exceeded. Please wait or use API token.');
          } else if (status === 401) {
            console.error('Invalid API token');
          } else if (status === 410) {
            // Gone - endpoint deprecated
            console.error('API endpoint deprecated. Please update the API URL.');
          } else {
            console.error('API Error:', data);
          }
        } else if (error.request) {
          // Network error
          console.error('Network Error: No response received');
        } else {
          console.error('Error:', error.message);
        }
        return Promise.reject(error);
      },
    );
  }

  async post<T>(url: string, data?: any, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  isOnline(): boolean {
    // This is a simple check - in production, use NetInfo
    return true;
  }
}

export default new ApiClient();
