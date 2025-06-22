import { API_ENDPOINTS } from '../config'
import { Model, InferenceRequest, InferenceResponse } from '../types'
import { apiClient } from './client'

export const modelsApi = {
  async list(): Promise<Model[]> {
    return apiClient.get<Model[]>(API_ENDPOINTS.models.list)
  },
  
  async getStatus(modelId: string): Promise<Model> {
    return apiClient.get<Model>(API_ENDPOINTS.models.status(modelId))
  },
  
  async inference(data: InferenceRequest): Promise<InferenceResponse> {
    return apiClient.post<InferenceResponse>(API_ENDPOINTS.models.inference, data)
  },
}