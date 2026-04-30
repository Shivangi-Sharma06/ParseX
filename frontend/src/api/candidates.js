import { apiClient } from './client';

export const candidatesApi = {
  list: () => apiClient.get('/candidates'),
  getById: (id) => apiClient.get(`/candidates/${id}`),
  remove: (id) => apiClient.delete(`/candidates/${id}`),
  upload: (formData, onUploadProgress) =>
    apiClient.post('/candidates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
    }),
  analyze: (id, payload) => apiClient.post(`/candidates/${id}/analyze`, payload),
  resume: (id) => apiClient.get(`/candidates/${id}/resume`, { responseType: 'blob' }),
};
