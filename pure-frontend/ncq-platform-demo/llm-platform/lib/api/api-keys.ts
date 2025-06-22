import { API_ENDPOINTS } from '../config'
import { ApiKey } from '../types'
import { apiClient } from './client'

export interface CreateApiKeyRequest {
  label: string
}

export interface ApiKeyResponse extends ApiKey {
  full_key?: string // Only returned on creation
}

export const apiKeysApi = {
  async list(): Promise<ApiKey[]> {
    return apiClient.get<ApiKey[]>(API_ENDPOINTS.apiKeys.list)
  },
  
  async create(data: CreateApiKeyRequest): Promise<ApiKeyResponse> {
    return apiClient.post<ApiKeyResponse>(API_ENDPOINTS.apiKeys.create, data)
  },
  
  async revoke(id: string): Promise<ApiKey> {
    return apiClient.post<ApiKey>(API_ENDPOINTS.apiKeys.revoke(id))
  },
  
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.apiKeys.delete(id))
  },
}