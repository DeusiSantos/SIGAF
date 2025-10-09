import { useEffect, useState } from 'react';
import api from '../../../core/services/api';

export const useSilo = () => {
  const [silos, setSilos] = useState([]);
  const [silo, setSilo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar todos os silos
  const fetchSilos = async () => {
    setLoading(true);
    try {
      const response = await api.get('/silo/all');
      setSilos(response.data);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  // Buscar silo por ID
  const fetchSiloById = async (id) => {
    setLoading(true);
    try {
      const response = await api.get(`/silo/${id}`);
      setSilo(response.data);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Criar novo silo
  const createSilo = async (siloData) => {
    setLoading(true);
    try {
      const formData = new FormData();

      Object.keys(siloData).forEach(key => {
        const value = siloData[key];

        if (value === null || value === undefined) return;

        //  Converter booleanos para string
        if (typeof value === "boolean") {
          formData.append(key, String(value));
          return;
        }

        //  Detectar listas (arrays)
        if (Array.isArray(value)) {
          value.forEach(item => formData.append(key, item));
          return;
        }

        //  Detectar arquivos e listas de arquivos
        if (value instanceof File) {
          formData.append(key, value);
          return;
        }
        if (value && typeof value === "object" && value.length !== undefined && value[0] instanceof File) {
          Array.from(value).forEach(file => formData.append(key, file));
          return;
        }

        //  Campos obrigatórios que podem vir vazios
        if (key === "OutrasAutorizacoes" && value === "") {
          formData.append(key, "");
          return;
        }
        if (key === "ObservacoesGerais" && value === "") {
          formData.append(key, "");
          return;
        }

        //  Demais campos
        formData.append(key, value);
      });

      const response = await api.post("/silo", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      await fetchSilos();
      return response.data;

    } catch (err) {
      console.error("Erro ao criar silo:", err.response?.data || err);
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };


  // Atualizar silo
  const updateSilo = async (id, siloData) => {
    setLoading(true);
    try {
      const response = await api.put(`/silo/${id}`, siloData);
      await fetchSilos();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Excluir silo
  const deleteSilo = async (id) => {
    setLoading(true);
    try {
      const response = await api.delete(`/silo/${id}`);
      await fetchSilos();
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Buscar licença de operação
  const fetchLicencaOperacao = async (id) => {
    try {
      const response = await api.get(`/silo/${id}/licencaDeOperacaoFile`, {
        responseType: 'blob'
      });

      const fileUrl = URL.createObjectURL(response.data);
      return { url: fileUrl, type: response.data.type };
    } catch (err) {
      console.error('Erro ao buscar licença de operação:', err);
      return null;
    }
  };

  // Buscar certificação sanitária
  const fetchCertificacaoSanitaria = async (id) => {
    try {
      const response = await api.get(`/silo/${id}/certificacaoSanitariaFile`, {
        responseType: 'blob'
      });

      const fileUrl = URL.createObjectURL(response.data);
      return { url: fileUrl, type: response.data.type };
    } catch (err) {
      console.error('Erro ao buscar certificação sanitária:', err);
      return null;
    }
  };

  // Buscar documento do proprietário
  const fetchDocumentoProprietario = async (id) => {
    try {
      const response = await api.get(`/silo/${id}/documentoDoProprietarioFile`, {
        responseType: 'blob'
      });

      const fileUrl = URL.createObjectURL(response.data);
      return { url: fileUrl, type: response.data.type };
    } catch (err) {
      console.error('Erro ao buscar documento do proprietário:', err);
      return null;
    }
  };

  // Buscar comprovante de endereço
  const fetchComprovanteEndereco = async (id) => {
    try {
      const response = await api.get(`/silo/${id}/comprovanteDeEnderecoFile`, {
        responseType: 'blob'
      });

      const fileUrl = URL.createObjectURL(response.data);
      return { url: fileUrl, type: response.data.type };
    } catch (err) {
      console.error('Erro ao buscar comprovante de endereço:', err);
      return null;
    }
  };

  // Buscar foto do silo
  const fetchFotoSilo = async (id) => {
    try {
      const response = await api.get(`/silo/${id}/fotoDoSiloFile`, {
        responseType: 'blob'
      });
      const imageUrl = URL.createObjectURL(response.data);
      return imageUrl;
    } catch (err) {
      console.error('Erro ao buscar foto do silo:', err);
      return null;
    }
  };

  // Atualizar foto do silo
  const updateFotoSilo = async (id, formData) => {
    try {
      const response = await api.patch(`/silo/${id}/fotoDoSiloFile`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      throw err;
    }
  };

  // Buscar automaticamente todos os silos ao montar o componente
  useEffect(() => {
    fetchSilos();
  }, []);

  return {
    silos,
    silo,
    loading,
    error,
    fetchSilos,
    fetchSiloById,
    createSilo,
    updateSilo,
    deleteSilo,
    fetchLicencaOperacao,
    fetchCertificacaoSanitaria,
    fetchDocumentoProprietario,
    fetchComprovanteEndereco,
    fetchFotoSilo,
    updateFotoSilo,
  };
};