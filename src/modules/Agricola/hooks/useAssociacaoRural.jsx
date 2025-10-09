import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useAssociacaoRural = () => {
  const [associacoesRurais, setAssociacoesRurais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todas as associações rurais
  const fetchAssociacoesRurais = async () => {
    setLoading(true);
    try {
      const response = await api.get('/organizacao/all');
      setAssociacoesRurais(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Criar uma nova associação rural
  const createAssociacaoRural = async (associacaoRuralData) => {
    setLoading(true);
    try {
      const response = await api.post('/organizacao', associacaoRuralData);
      await fetchAssociacoesRurais(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar uma associação rural
  const updateAssociacaoRural = async (id, associacaoRuralData) => {
    setLoading(true);
    try {
      const response = await api.put(`/organizacao/${id}`, associacaoRuralData);
      await fetchAssociacoesRurais(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma associação rural
  const deleteAssociacaoRural = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/organizacao/${id}`);
      await fetchAssociacoesRurais(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar associações rurais quando o componente é montado
  useEffect(() => {
    fetchAssociacoesRurais();
  }, []);

  return {
    associacoesRurais,
    loading,
    error,
    fetchAssociacoesRurais,
    createAssociacaoRural,
    updateAssociacaoRural,
    deleteAssociacaoRural,
  };
};