import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import api from '../api';

const useMotores = () => {
  const [motores, setMotores] = useState([]);
  const navigate = useNavigate()

  const fetchMotores = useCallback(async () => {
    const token = localStorage.getItem('token')
    if (token !== null) {
      const user = jwtDecode(token)
      try {
        const response = await api.get(`/api/motores/${user.sub}`);
        setMotores(response.data);
      } catch (err) {
        navigate('auth')
      }
    } else {
      navigate('auth')
    }
  }, [])

  useEffect(() => {
    fetchMotores();
  }, []);

  return { motores, fetchMotores, setMotores };
};

export default useMotores;
