import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useLaboratorio = () => {
  const [laboratorios, setLaboratorios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os laboratórios
  const fetchLaboratorios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/gestaoDeLaboratorio/all');
      setLaboratorios(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Buscar laboratório por ID
  const fetchLaboratorioById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/gestaoDeLaboratorio/${id}`);
      setLoading(false);
      return response.data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Criar um novo laboratório
  const createLaboratorio = async (laboratorioData) => {
    setLoading(true);
    try {
      console.log('Enviando dados para API:', laboratorioData);
      const response = await api.post('/gestaoDeLaboratorio', laboratorioData);
      await fetchLaboratorios();
      return response.data;
    } catch (err) {
      console.error('Erro na API:', err.response?.data);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar um laboratório
  const updateLaboratorio = async (id, laboratorioData) => {
    setLoading(true);
    try {
      const response = await api.put(`/gestaoDeLaboratorio/${id}`, laboratorioData);
      await fetchLaboratorios();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir um laboratório
  const deleteLaboratorio = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/gestaoDeLaboratorio/${id}`);
      await fetchLaboratorios();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar laboratórios quando o componente é montado
  useEffect(() => {
    fetchLaboratorios();
  }, []);

  return {
    laboratorios,
    loading,
    error,
    fetchLaboratorios,
    fetchLaboratorioById,
    createLaboratorio,
    updateLaboratorio,
    deleteLaboratorio,
  };
};