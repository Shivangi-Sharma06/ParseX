import { apiClient } from './client';

export const jobsApi = {
  list: () => apiClient.get('/jobs'),
  create: (payload) => apiClient.post('/jobs', payload),
  update: (jobId, payload) => apiClient.put(`/jobs/${jobId}`, payload),
  remove: (jobId) => apiClient.delete(`/jobs/${jobId}`),
  runMatch: (jobId) => apiClient.post(`/matches/${jobId}/run`),
  getMatch: (jobId) => apiClient.get(`/matches/${jobId}`),
  shortlist: (matchId, payload = { shortlisted: true }) =>
    apiClient.patch(`/matches/shortlist/${matchId}`, payload),
  emailMatch: (matchId) => apiClient.post(`/matches/email/${matchId}`),
  emailAllShortlisted: (jobId) => apiClient.post(`/matches/${jobId}/email-shortlisted`),
};
