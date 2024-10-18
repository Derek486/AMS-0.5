import { useState, useEffect, useCallback } from 'react';
import api from '../api';

const useMotores = () => {
  const [motores, setMotores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMotores = useCallback(async () => {
    try {
      const response = await api.get('/api/motores');
      setMotores(response.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [])

  useEffect(() => {
    fetchMotores();
  }, []);

  return { motores, loading, error, fetchMotores, setMotores };
};

export default useMotores;
