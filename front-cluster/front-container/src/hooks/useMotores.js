import { useState, useEffect, useCallback } from 'react';
import useUser from './useUser'
import api from '../api';

const useMotores = () => {
  const [motores, setMotores] = useState([]);
  const user = useUser()

  const fetchMotores = useCallback(async () => {
    const response = await api.get(`/api/motores/${user.sub}`);
    setMotores(response.data);
  }, [user])

  useEffect(() => {
    if (user) {
      fetchMotores();
    }
  }, [user]);

  return { motores, fetchMotores, setMotores };
};

export default useMotores;
