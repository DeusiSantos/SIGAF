import { useState, useEffect, useCallback } from 'react';
import api from '../../../core/services/api';

// Hook principal para dados do dashboard
export const useRNPADashboard = () => {
  const [data, setData] = useState({
    totalProdutores: 0,
    totalAprovados: 0,
    totalPecuaria: 0,
    totalAgricultura: 0,
    totalFlorestal: 0,
    totalAquicultura: 0,
    totalMasculino: 0,
    totalFeminino: 0,
    certificados: 0,
    projetos: 0
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Função para buscar todos os dados necessários
  const fetchAllData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados em paralelo
      const requests = [
        api.get('/dashboard/totalDeProdutores'),
        api.get('/dashboard/totalDeProdutorAprovado'),
        api.get('/dashboard/totalPecuaria'),
        api.get('/dashboard/totalAgricultura'),
        api.get('/dashboard/totalProdutorFlorestal'),
        api.get('/dashboard/totalAquicultura'),
        api.get('/formulario/all'), // Para calcular gênero
        api.get('/certificaoDoProdutor/produtoresComCertificados'),
        api.get('/projetoBeneficiario/all')
      ];

      const responses = await Promise.allSettled(requests);

      // Processar resultados
      const newData = {
        totalProdutores: responses[0].status === 'fulfilled' ? responses[0].value.data : 0,
        totalAprovados: responses[1].status === 'fulfilled' ? responses[1].value.data : 0,
        totalPecuaria: responses[2].status === 'fulfilled' ? responses[2].value.data : 0,
        totalAgricultura: responses[3].status === 'fulfilled' ? responses[3].value.data : 0,
        totalFlorestal: responses[4].status === 'fulfilled' ? responses[4].value.data : 0,
        totalAquicultura: responses[5].status === 'fulfilled' ? responses[5].value.data : 0,
        certificados: responses[7].status === 'fulfilled' ? responses[7].value.data.length : 0,
        projetos: responses[8].status === 'fulfilled' ? responses[8].value.data.length : 0
      };

      // Calcular dados de gênero a partir dos formulários
      if (responses[6].status === 'fulfilled') {
        const formularios = responses[6].value.data;
        newData.totalMasculino = formularios.filter(f => f.sexo === 'Masculino').length;
        newData.totalFeminino = formularios.filter(f => f.sexo === 'Feminino').length;
      }

      setData(newData);
    } catch (err) {
      console.error('Erro ao buscar dados do dashboard:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, [fetchAllData]);

  return {
    data,
    loading,
    error,
    refetch: fetchAllData
  };
};

// Hook para dados por província
export const useProvinciaData = (provincia = 'todas') => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProvinciaData = useCallback(async () => {
    if (provincia === 'todas') return;

    try {
      setLoading(true);
      setError(null);

      // Buscar dados específicos da província
      const response = await api.get(`/dashboard/provincia/${provincia}`);
      setData(response.data);
    } catch (err) {
      console.error(`Erro ao buscar dados da província ${provincia}:`, err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [provincia]);

  useEffect(() => {
    fetchProvinciaData();
  }, [fetchProvinciaData]);

  return {
    data,
    loading,
    error,
    refetch: fetchProvinciaData
  };
};

// Hook para produtores não aprovados
export const useProdutoresNaoAprovados = () => {
  const [produtores, setProdutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/dashboard/exceptoAprovados');
        setProdutores(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtores, loading, error };
};

// Hook para produtores aprovados
export const useProdutoresAprovados = () => {
  const [produtores, setProdutores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await api.get('/dashboard/aprovados');
        setProdutores(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtores, loading, error };
};

// Hook para certificados
export const useCertificados = () => {
  const [certificados, setCertificados] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const response = await api.get('/certificaoDoProdutor/produtoresComCertificados');
        setCertificados(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchCertificados();
  }, []);

  return { certificados, loading, error };
};

// Hook para projetos
export const useProjetos = () => {
  const [projetos, setProjetos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const response = await api.get('/projetoBeneficiario/all');
        setProjetos(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchProjetos();
  }, []);

  return { projetos, loading, error };
};

// Hook para estatísticas específicas
export const useEstatisticas = () => {
  const [stats, setStats] = useState({
    totalFormularios: 0,
    percentualMasculino: 0,
    percentualFeminino: 0,
    taxaAprovacao: 0,
    crescimentoMensal: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const calcularEstatisticas = async () => {
      try {
        // Buscar dados necessários para calcular estatísticas
        const [formularios, aprovados, total] = await Promise.all([
          api.get('/formulario/all'),
          api.get('/dashboard/totalDeProdutorAprovado'),
          api.get('/dashboard/totalDeProdutores')
        ]);

        const totalFormularios = formularios.data.length;
        const totalAprovados = aprovados.data;
        const totalProdutores = total.data;

        // Calcular percentuais de gênero
        const masculinos = formularios.data.filter(f => f.sexo === 'Masculino').length;
        const femininos = formularios.data.filter(f => f.sexo === 'Feminino').length;

        const newStats = {
          totalFormularios,
          percentualMasculino: totalFormularios > 0 ? (masculinos / totalFormularios * 100).toFixed(1) : 0,
          percentualFeminino: totalFormularios > 0 ? (femininos / totalFormularios * 100).toFixed(1) : 0,
          taxaAprovacao: totalProdutores > 0 ? (totalAprovados / totalProdutores * 100).toFixed(1) : 0,
          crescimentoMensal: 12.5 // Valor simulado - implementar lógica real
        };

        setStats(newStats);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    calcularEstatisticas();
  }, []);

  return { stats, loading, error };
};

// Hook para dados de atividades
export const useAtividades = () => {
  const [atividades, setAtividades] = useState({
    agricultura: 0,
    pecuaria: 0,
    : 0,
  aquicultura: 0,
    agropecuaria: 0
  });
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

useEffect(() => {
  const fetchAtividades = async () => {
    try {
      const requests = [
        api.get('/dashboard/totalAgricultura'),
        api.get('/dashboard/totalPecuaria'),
        api.get('/dashboard/totalProdutor'),
        api.get('/dashboard/totalAquicultura')
      ];

      const responses = await Promise.allSettled(requests);

      setAtividades({
        agricultura: responses[0].status === 'fulfilled' ? responses[0].value.data : 0,
        pecuaria: responses[1].status === 'fulfilled' ? responses[1].value.data : 0,
        florestal: responses[2].status === 'fulfilled' ? responses[2].value.data : 0,
        aquicultura: responses[3].status === 'fulfilled' ? responses[3].value.data : 0,
        agropecuaria: 0 // Calcular se necessário
      });

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  fetchAtividades();
}, []);

return { atividades, loading, error };
};

// Hook para buscar dados de formulários com filtros
export const useFormularios = (filtros = {}) => {
  const [formularios, setFormularios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0
  });

  const fetchFormularios = useCallback(async (page = 1, filters = {}) => {
    try {
      setLoading(true);

      // Construir query string com filtros
      const queryParams = new URLSearchParams({
        page: page.toString(),
        ...filters
      });

      const response = await api.get(`/formulario/all?${queryParams}`);

      // Assumindo que a API retorna dados paginados
      if (Array.isArray(response.data)) {
        setFormularios(response.data);
        setPagination({
          currentPage: page,
          totalPages: Math.ceil(response.data.length / 10), // Ajustar conforme sua API
          totalItems: response.data.length
        });
      } else {
        setFormularios(response.data.data || []);
        setPagination(response.data.pagination || {
          currentPage: page,
          totalPages: 1,
          totalItems: 0
        });
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFormularios(1, filtros);
  }, [fetchFormularios, filtros]);

  return {
    formularios,
    loading,
    error,
    pagination,
    refetch: fetchFormularios
  };
};

// Hook utilitário para formatação de números
export const useFormatNumber = () => {
  const formatNumber = useCallback((value) => {
    if (!value && value !== 0) return '0';

    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toLocaleString();
  }, []);

  const formatCurrency = useCallback((value, currency = 'AOA') => {
    if (!value && value !== 0) return `0 ${currency}`;

    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0
    }).format(value);
  }, []);

  const formatPercentage = useCallback((value, decimals = 1) => {
    if (!value && value !== 0) return '0%';
    return `${Number(value).toFixed(decimals)}%`;
  }, []);

  return {
    formatNumber,
    formatCurrency,
    formatPercentage
  };
};