import { useState, useEffect, useCallback } from 'react';
import api_model from '../api.model';

const useAlertas = (idMotor) => {
  const [alertas, setAlertas] = useState([]);

  const fetchalertas = useCallback(async () => {
    const response = await api_model.get(`/alertas/${idMotor || ''}`);
    setAlertas(response.data);
  }, [idMotor])

  useEffect(() => {
    fetchalertas();
  }, []);

  return { alertas, fetchalertas };
};

export default useAlertas;
