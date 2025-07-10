
import axios from 'axios';

const API_BASE_URL = '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

export class ApiService {
  static async healthCheck(): Promise<{ healthy: boolean; data?: any }> {
    try {
      const response = await api.get('/health');
      return { 
        healthy: response.status === 200,
        data: response.data
      };
    } catch (error) {
      console.error('Health check failed:', error);
      return { healthy: false };
    }
  }

  static async configureAI(config: {
    provider: string;
    model: string;
    api_key: string;
    endpoint?: string;
  }): Promise<any> {
    try {
      const response = await api.post('/ai/configure', config);
      return response.data;
    } catch (error) {
      console.error('AI configuration failed:', error);
      throw error;
    }
  }

  static async getAIStatus(): Promise<any> {
    try {
      const response = await api.get('/ai/status');
      return response.data;
    } catch (error) {
      console.error('AI status check failed:', error);
      throw error;
    }
  }

  static async testAIConnection(): Promise<any> {
    try {
      const response = await api.post('/ai/test-connection');
      return response.data;
    } catch (error) {
      console.error('AI connection test failed:', error);
      throw error;
    }
  }

  static async generateSchemaFromDescription(data: {
    description: string;
    domain: string;
    data_type: string;
  }): Promise<any> {
    try {
      const response = await api.post('/generation/schema-from-description', data);
      return response.data;
    } catch (error) {
      console.error('Schema generation failed:', error);
      throw error;
    }
  }

  static async generateSyntheticData(data: {
    schema: any;
    config: any;
    description?: string;
    sourceData?: any[];
  }): Promise<any> {
    try {
      // First check if AI is configured, if not use local generation
      const aiStatus = await this.getAIStatus().catch(() => ({ is_configured: false }));
      
      const endpoint = aiStatus.is_configured ? '/generation/start' : '/generation/generate-local';
      const response = await api.post(endpoint, data);
      return response.data;
    } catch (error) {
      console.error('Data generation failed:', error);
      throw error;
    }
  }

  static async analyzeData(data: {
    sample_data: any[];
    config: any;
  }): Promise<any> {
    try {
      const response = await api.post('/generation/analyze', data);
      return response.data;
    } catch (error) {
      console.error('Data analysis failed:', error);
      throw error;
    }
  }

  static async getAgentsStatus(): Promise<any> {
    try {
      const response = await api.get('/agents/status');
      return response.data;
    } catch (error) {
      console.error('Agent status check failed:', error);
      throw error;
    }
  }

  static async getSystemStatus(): Promise<any> {
    try {
      const response = await api.get('/system/status');
      return response.data;
    } catch (error) {
      console.error('System status check failed:', error);
      throw error;
    }
  }
}
