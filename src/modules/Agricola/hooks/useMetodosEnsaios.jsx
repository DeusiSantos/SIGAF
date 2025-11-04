import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useMetodosEnsaios = () => {
  const [metodosEnsaios, setMetodosEnsaios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os métodos de ensaios
  const fetchMetodosEnsaios = async () => {
    setLoading(true);
    try {
      const response = await api.get('/metodoDeEnsaios/all');
      setMetodosEnsaios(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Buscar método por ID
  const getMetodoById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/metodoDeEnsaios/${id}`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Criar um novo método de ensaio
  const createMetodoEnsaio = async (metodoData) => {
    setLoading(true);
    try {
      const response = await api.post('/metodoDeEnsaios', metodoData);
      await fetchMetodosEnsaios(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar um método de ensaio
  const updateMetodoEnsaio = async (id, metodoData) => {
    setLoading(true);
    try {
      const response = await api.put(`/metodoDeEnsaios/${id}`, metodoData);
      await fetchMetodosEnsaios(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir um método de ensaio
  const deleteMetodoEnsaio = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/metodoDeEnsaios/${id}`);
      await fetchMetodosEnsaios(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar métodos quando o componente é montado
  useEffect(() => {
    fetchMetodosEnsaios();
  }, []);

  return {
    metodosEnsaios,
    loading,
    error,
    fetchMetodosEnsaios,
    getMetodoById,
    createMetodoEnsaio,
    updateMetodoEnsaio,
    deleteMetodoEnsaio,
  };
};