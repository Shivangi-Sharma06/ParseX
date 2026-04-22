import { apiClient } from './client';

export const jobsApi = {
  list: () => apiClient.get('/jobs'),
  create: (payload) => apiClient.post('/jobs', payload),
  remove: (jobId) => apiClient.delete(`/jobs/${jobId}`),
  runMatch: (jobId) => apiClient.post(`/matches/${jobId}/run`),
  getMatch: (jobId) => apiClient.get(`/matches/${jobId}`),
  shortlist: (matchId) => apiClient.patch(`/matches/shortlist/${matchId}`),
  emailMatch: (matchId) => apiClient.post(`/matches/email/${matchId}`),
  emailAllShortlisted: (jobId) => apiClient.post(`/matches/${jobId}/email-shortlisted`),
};
