export const APP_NAME = import.meta.env.VITE_APP_NAME || 'ResumeIQ';

export const NAV_LINKS = [
  { label: 'Dashboard', path: '/dashboard' },
  { label: 'Candidates', path: '/candidates' },
  { label: 'Jobs', path: '/jobs' },
  { label: 'Analytics', path: '/analytics' },
];

export const MOCK_ACTIVITY = [
  // TODO: replace with API call
  { id: 1, type: 'upload', label: '12 resumes uploaded', time: '2h ago' },
  { id: 2, type: 'match', label: 'Match run for Frontend Engineer', time: '4h ago' },
  { id: 3, type: 'email', label: '5 shortlist emails sent', time: '6h ago' },
];
