import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useIrrigacao = () => {
  const [irrigacoes, setIrrigacoes] = useState([]);
  const [irrigacao, setIrrigacao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todas as irrigações
  const fetchIrrigacoes = async () => {
    setLoading(true);
    try {
      const response = await api.get('/irrigacao/all');
      setIrrigacoes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar irrigação por ID
  const fetchIrrigacaoById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/irrigacao/${id}`);
      setIrrigacao(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Criar nova irrigação
  const createIrrigacao = async (irrigacaoData) => {
    setLoading(true);
    try {
      // Se for FormData, envie direto
      if (irrigacaoData instanceof FormData) {
        const response = await api.post('/irrigacao', irrigacaoData);
        await fetchIrrigacoes();
        return response.data;
      } else {
        // Para JSON puro (não é o caso aqui)
        const response = await api.post('/irrigacao', irrigacaoData, {
          headers: { 'Content-Type': 'application/json' }
        });
        await fetchIrrigacoes();
        return response.data;
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar irrigação
  const updateIrrigacao = async (id, irrigacaoData) => {
    setLoading(true);
    try {
      const response = await api.put(`/irrigacao/${id}`, irrigacaoData);
      await fetchIrrigacoes(); // Atualiza lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir irrigação
  const deleteIrrigacao = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/irrigacao/${id}`);
      await fetchIrrigacoes();
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar fotografia de fonte de água por ID de irrigação
  const fetchFotografiaDeFonteDeAgua = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/irrigacao/${id}/fotografiaDeFonteDeAgua`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar fotografia de fonte de água (patch)
  const updateFotografiaDeFonteDeAgua = async (id, formData) => {
    setLoading(true);
    try {
      const response = await api.patch(`/irrigacao/${id}/fotografiaDeFonteDeAgua`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar automaticamente todas as irrigações ao montar o componente
  useEffect(() => {
    fetchIrrigacoes();
  }, []);

  return {
    irrigacoes,
    irrigacao,
    loading,
    error,
    fetchIrrigacoes,
    fetchIrrigacaoById,
    createIrrigacao,
    updateIrrigacao,
    deleteIrrigacao,
    fetchFotografiaDeFonteDeAgua,
    updateFotografiaDeFonteDeAgua,
  };
};
