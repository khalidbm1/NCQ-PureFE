import { API_ENDPOINTS } from '../config'
import { UploadedFile } from '../types'
import { apiClient } from './client'

export const filesApi = {
  async upload(file: File, onProgress?: (progress: number) => void): Promise<UploadedFile> {
    const formData = new FormData()
    formData.append('file', file)
    
    return apiClient.upload<UploadedFile>(
      API_ENDPOINTS.files.upload,
      formData,
      onProgress
    )
  },
  
  async list(): Promise<UploadedFile[]> {
    return apiClient.get<UploadedFile[]>(API_ENDPOINTS.files.list)
  },
  
  async delete(id: string): Promise<void> {
    await apiClient.delete(API_ENDPOINTS.files.delete(id))
  },
}