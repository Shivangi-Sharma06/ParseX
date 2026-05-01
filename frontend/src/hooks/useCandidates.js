import { useCallback, useEffect, useRef, useState } from 'react';
import { candidatesApi } from '../api/candidates';
import { getDemoCandidates } from '../utils/demoData';

export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (mountedRef.current) setLoading(true);
    try {
      const response = await candidatesApi.list();
      if (mountedRef.current) {
        const fetchedCandidates = response.data.candidates || [];
        setCandidates(fetchedCandidates.length ? fetchedCandidates : getDemoCandidates());
      }
    } catch {
      if (mountedRef.current) {
        setCandidates(getDemoCandidates());
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

  return { candidates, loading, refetch };
}
