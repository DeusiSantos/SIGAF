import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useEntreposto = () => {
  const [entrepostos, setEntrepostos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os entrepostos
  const fetchEntrepostos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/entreposto/all');
      setEntrepostos(response.data);
      setLoading(false);
    } catch (err) {
      console.error('fetchEntrepostos error:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao buscar entrepostos');
      setLoading(false);
    }
  };

  // Buscar por id
  const getEntreposto = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/entreposto/${id}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      console.error('getEntreposto error:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao buscar entreposto');
      setLoading(false);
      throw err;
    }
  };

  // Criar novo entreposto
  const createEntreposto = async (entrepostoData) => {
    setLoading(true);
    try {
      const response = await api.post('/entreposto', entrepostoData);
      await fetchEntrepostos();
      return response.data;
    } catch (err) {
      console.error('createEntreposto error:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao criar entreposto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar entreposto
  const updateEntreposto = async (id, entrepostoData) => {
    setLoading(true);
    try {
      const response = await api.put(`/entreposto/${id}`, entrepostoData);
      await fetchEntrepostos();
      return response.data;
    } catch (err) {
      console.error('updateEntreposto error:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao atualizar entreposto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Deletar entreposto
  const deleteEntreposto = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/entreposto/${id}`);
      await fetchEntrepostos();
      return response.data;
    } catch (err) {
      console.error('deleteEntreposto error:', err);
      setError(err.response?.data?.message || err.message || 'Erro ao deletar entreposto');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEntrepostos();
  }, []);

  return {
    entrepostos,
    loading,
    error,
    fetchEntrepostos,
    getEntreposto,
    createEntreposto,
    updateEntreposto,
    deleteEntreposto,
  };
};
