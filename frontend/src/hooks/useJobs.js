import { useCallback, useEffect, useRef, useState } from 'react';
import { jobsApi } from '../api/jobs';

export function useJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (mountedRef.current) setLoading(true);
    try {
      const response = await jobsApi.list();
      if (mountedRef.current) {
        setJobs(response.data.jobs || []);
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    refetch().catch(() => {
      if (mountedRef.current) setLoading(false);
    });
    return () => {
      mountedRef.current = false;
    };
  }, [refetch]);

  return { jobs, loading, refetch };
}
