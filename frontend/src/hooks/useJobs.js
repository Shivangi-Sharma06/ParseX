import { useCallback, useEffect, useRef, useState } from 'react';
import { jobsApi } from '../api/jobs';
import { getDemoJobs } from '../utils/demoData';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (mountedRef.current) setLoading(true);
    try {
      const response = await jobsApi.list();
      if (mountedRef.current) {
        const fetchedJobs = response.data.jobs || [];
        setJobs(fetchedJobs.length ? fetchedJobs : getDemoJobs());
      }
    } catch {
      if (mountedRef.current) {
        setJobs(getDemoJobs());
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refetch().catch(() => {});
    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { jobs, loading, refetch };
}
