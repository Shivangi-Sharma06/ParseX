import { useEffect, useState } from 'react';
import { jobsApi } from '../api/jobs';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await jobsApi.list();
      setJobs(response.data.jobs || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch().catch(() => setLoading(false));
  }, []);

  return { jobs, loading, refetch };
}
