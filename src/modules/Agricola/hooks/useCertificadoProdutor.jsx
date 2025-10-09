import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useCertificadoProdutor = () => {
  const [certificadoProdutores, setCertificadoProdutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todas as Certificado Produtor 
  const fetchCertificadoProdutores = async () => {
    setLoading(true);
    try {
      const response = await api.get('/certificaoDoProdutor/all');
      setCertificadoProdutores(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Criar uma nova Certificado Produtor 
  const createCertificadoProdutor = async (CertificadoProdutorData) => {
    setLoading(true);
    try {
      const response = await api.post('/certificaoDoProdutor/all', CertificadoProdutorData);
      await fetchCertificadoProdutores(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Atualizar uma Certificado Produtor 
  const updateCertificadoProdutor = async (id, CertificadoProdutorData) => {
    setLoading(true);
    try {
      const response = await api.put(`/certificaoDoProdutor/${id}`, CertificadoProdutorData);
      await fetchCertificadoProdutores(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir uma Certificado Produtor 
  const deleteCertificadoProdutor = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/certificaoDoProdutor/${id}`);
      await fetchCertificadoProdutores(); // Atualizar a lista
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar Certificado Produtor  quando o componente é montado
  useEffect(() => {
    fetchCertificadoProdutores();
  }, []);

  return {
    certificadoProdutores,
    loading,
    error,
    fetchCertificadoProdutores,
    createCertificadoProdutor,
    updateCertificadoProdutor,
    deleteCertificadoProdutor,
  };
};