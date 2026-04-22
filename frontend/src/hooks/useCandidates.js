import { useEffect, useState } from 'react';
import { candidatesApi } from '../api/candidates';

export function useCandidates() {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);

  const refetch = async () => {
    setLoading(true);
    try {
      const response = await candidatesApi.list();
      setCandidates(response.data.candidates || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetch().catch(() => setLoading(false));
  }, []);

  return { candidates, loading, refetch };
}
