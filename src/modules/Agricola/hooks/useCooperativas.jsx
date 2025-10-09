import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useCooperativas = () => {
  const [cooperativas, setCooperativas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todas as cooperativas
  const fetchCooperativas = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cooperativa/all');
      setCooperativas(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };



  // Criar uma nova cooperativa
  const createCooperativa = async (cooperativaData) => {
    setLoading(true);
    try {
      const response = await api.post('/cooperativa', cooperativaData);
      await fetchCooperativas(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar uma cooperativa
  const updateCooperativa = async (id, cooperativaData) => {
    setLoading(true);
    try {
      const response = await api.put(`/cooperativa/${id}`, cooperativaData);
      await fetchCooperativas(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma cooperativa
  const deleteCooperativa = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/cooperativa/${id}`);
      await fetchCooperativas(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar cooperativas quando o componente é montado
  useEffect(() => {
    fetchCooperativas();
  }, []);

  return {
    cooperativas,
    loading,
    error,
    fetchCooperativas,
    createCooperativa,
    updateCooperativa,
    deleteCooperativa,
  };
};