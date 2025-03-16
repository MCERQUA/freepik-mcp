import axios, { AxiosInstance } from 'axios';
import { 
  FreepikConfig, 
  GenerateImageParams, 
  GenerateImageResponse, 
  CheckStatusResponse,
  SearchResourcesParams,
  SearchResourcesResponse,
  ResourceResponse
} from '../types.js';

export class FreepikClient {
  private client: AxiosInstance;
  private baseUrl = 'https://api.freepik.com';

  constructor(config: FreepikConfig) {
    this.client = axios.create({
      baseURL: this.baseUrl,
      headers: {
        'x-freepik-api-key': config.apiKey,
        'Content-Type': 'application/json'
      }
    });

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      response => response,
      error => {
        if (error.response) {
          const { status, data } = error.response;
          console.error(`[Freepik API Error] Status: ${status}, Message:`, data);
        }
        throw error;
      }
    );
  }

  // Stock Photo API methods
  async searchResources(params: SearchResourcesParams): Promise<SearchResourcesResponse> {
    console.error('[Freepik] Searching resources with params:', params);
    const response = await this.client.get<SearchResourcesResponse>('/v1/resources', { params });
    return response.data;
  }

  async getResourceDetails(id: number): Promise<ResourceResponse> {
    console.error(`[Freepik] Getting resource details for id: ${id}`);
    const response = await this.client.get<ResourceResponse>(`/v1/resources/${id}`);
    return response.data;
  }

  async downloadResource(id: number): Promise<{ url: string }> {
    console.error(`[Freepik] Downloading resource id: ${id}`);
    const response = await this.client.get<{ url: string }>(`/v1/resources/${id}/download`);
    return response.data;
  }

  // Mystic API methods
  async generateImage(params: GenerateImageParams): Promise<GenerateImageResponse> {
    console.error('[Freepik] Generating image with params:', params);
    const response = await this.client.post<GenerateImageResponse>('/v1/ai/mystic', params);
    return response.data;
  }

  async checkStatus(taskId: string): Promise<CheckStatusResponse> {
    console.error(`[Freepik] Checking status for task: ${taskId}`);
    const response = await this.client.get<CheckStatusResponse>(`/v1/ai/mystic/${taskId}`);
    return response.data;
  }
}