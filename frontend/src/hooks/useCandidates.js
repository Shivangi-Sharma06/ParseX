import { useCallback, useEffect, useRef, useState } from 'react';
import { candidatesApi } from '../api/candidates';

export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const mountedRef = useRef(true);

  const refetch = useCallback(async () => {
    if (mountedRef.current) setLoading(true);
    try {
      const response = await candidatesApi.list();
      if (mountedRef.current) {
        setCandidates(response.data.candidates || []);
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

  return { candidates, loading, refetch };
}
