import { useState, useEffect } from 'react';
import api from '../../../core/services/api';

export const useEmpresasDeApoio = () => {
  const [empresasDeApoio, setEmpresasDeApoio] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todas as  Empresas de Apoio
  const fetchEmpresasDeApoio = async () => {
    setLoading(true);
    try {
      const response = await api.get('/empresaDeApoio/all');
      setEmpresasDeApoio(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Criar uma nova  Empresas de Apoio
  const createEmpresasDeApoio = async (empresaDeApoioData) => {
    setLoading(true);
    try {
      const response = await api.post('/empresaDeApoio', empresaDeApoioData);
      await fetchEmpresasDeApoio(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar uma  Empresas de Apoio
  const updateEmpresasDeApoio = async (id, empresaDeApoioData) => {
    setLoading(true);
    try {
      const response = await api.put(`/empresaDeApoio/${id}`, empresaDeApoioData);
      await fetchEmpresasDeApoio(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma  Empresas de Apoio
  const deleteEmpresasDeApoio = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/empresaDeApoio/${id}`);
      await fetchEmpresasDeApoio(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar Empresas de Apoio quando o componente é montado
  useEffect(() => {
    fetchEmpresasDeApoio();
  }, []);

  return {
    empresasDeApoio,
    loading,
    error,
    fetchEmpresasDeApoio,
    createEmpresasDeApoio,
    updateEmpresasDeApoio,
    deleteEmpresasDeApoio,
  };
};