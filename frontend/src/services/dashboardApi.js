import api from './api';

export const dashboardApi = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  me: () => api.get('/auth/me'),
  uploadResume: (formData) =>
    api.post('/candidates/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  listCandidates: () => api.get('/candidates'),
  getCandidate: (candidateId) => api.get(`/candidates/${candidateId}`),
  downloadResume: (candidateId) => api.get(`/candidates/${candidateId}/resume`, { responseType: 'blob' }),
  analyzeCandidate: (candidateId, payload) => api.post(`/candidates/${candidateId}/analyze`, payload),
  listJobs: () => api.get('/jobs'),
  createJob: (payload) => api.post('/jobs', payload),
  runMatch: (jobId) => api.post(`/matches/${jobId}/run`),
  getMatches: (jobId) => api.get(`/matches/${jobId}`),
  shortlistCandidate: (matchId) => api.patch(`/matches/shortlist/${matchId}`),
};
