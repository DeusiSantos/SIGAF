import {
  Activity,
  ArrowUp,
  Award,
  BarChart3,
  Bug,
  CheckCircle,
  ChevronDown,
  Cloud,
  Filter,
  Gift,
  MapPin,
  RefreshCw,
  Tractor,
  Users,
  X
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Sector,
  Tooltip
} from 'recharts';
import CustomInput from '../core/components/CustomInput';
import Separador from '../core/components/Separador';
import WeatherForecastAngola from '../core/components/WeatherForecastAngola';
import api from '../core/services/api';
import DashboardIncentivos from '../modules/Agricola/pages/incentivo/DashboardIncentivos';
import DashboardControlePragas from '../modules/Agricola/pages/PainelMonitoramento/ControlePragas/DashboardControlePragas';


// Dados aprimorados para o sistema RNPA Angola (mantidos como fallback)
const mockAgricultureData = {
  dadosPorProvincia: [
    { nome: 'Luanda', produtores: 45230, registros: 42100, crescimento: 15.2, taxa_aprovacao: 93.1, area_cultivada: 12450 },
    { nome: 'Benguela', produtores: 38400, registros: 35820, crescimento: 12.8, taxa_aprovacao: 93.3, area_cultivada: 28900 },
    { nome: 'Huíla', produtores: 52100, registros: 49200, crescimento: 18.7, taxa_aprovacao: 94.4, area_cultivada: 45600 },
    { nome: 'Bié', produtores: 31200, registros: 28800, crescimento: 9.4, taxa_aprovacao: 92.3, area_cultivada: 35400 },
    { nome: 'Malanje', produtores: 42800, registros: 39600, crescimento: 14.3, taxa_aprovacao: 92.5, area_cultivada: 38700 },
    { nome: 'Huambo', produtores: 48900, registros: 45100, crescimento: 16.1, taxa_aprovacao: 92.2, area_cultivada: 41200 },
    { nome: 'Cabinda', produtores: 15600, registros: 14200, crescimento: 7.8, taxa_aprovacao: 91.0, area_cultivada: 8900 },
    { nome: 'Zaire', produtores: 18700, registros: 17100, crescimento: 8.9, taxa_aprovacao: 91.4, area_cultivada: 12300 },
    { nome: 'Uíge', produtores: 35400, registros: 32800, crescimento: 11.2, taxa_aprovacao: 92.7, area_cultivada: 29800 },
    { nome: 'Cunene', produtores: 28900, registros: 26400, crescimento: 10.1, taxa_aprovacao: 91.3, area_cultivada: 31500 },
    { nome: 'Namibe', produtores: 12300, registros: 11100, crescimento: 6.2, taxa_aprovacao: 90.2, area_cultivada: 8700 },
    { nome: 'Lunda Norte', produtores: 23800, registros: 21600, crescimento: 8.7, taxa_aprovacao: 90.8, area_cultivada: 18900 },
    { nome: 'Lunda Sul', produtores: 19200, registros: 17500, crescimento: 7.3, taxa_aprovacao: 91.1, area_cultivada: 15600 },
    { nome: 'Moxico', produtores: 27600, registros: 25100, crescimento: 9.8, taxa_aprovacao: 90.9, area_cultivada: 24300 },
    { nome: 'Cuando Cubango', produtores: 16800, registros: 15200, crescimento: 6.8, taxa_aprovacao: 90.5, area_cultivada: 19700 },
    { nome: 'Bengo', produtores: 34200, registros: 31600, crescimento: 13.4, taxa_aprovacao: 92.4, area_cultivada: 22800 },
    { nome: 'Cuanza Norte', produtores: 39700, registros: 36800, crescimento: 14.7, taxa_aprovacao: 92.7, area_cultivada: 33100 },
    { nome: 'Cuanza Sul', produtores: 32400, registros: 29800, crescimento: 11.8, taxa_aprovacao: 92.0, area_cultivada: 27400 }
  ],
  estatisticasGerais: {
    totalProdutores: 523450,
    totalRegistrosAprovados: 481200,
    totalAreaCultivada: 486700,
    producaoAnualEstimada: 2400000,
    cooperativasRegistradas: 1247,
    municipiosAbrangidos: 164,
    crescimentoAnual: 13.2,
    taxaAprovacaoMedia: 92.1,
    investimentoTotal: 45600000
  }
};

{/*const dadosPragasResumo = {
  estatisticasGerais: {
    totalOcorrencias: 2847,
    ocorrenciasAtivas: 612,
    ocorrenciasControladas: 1847,
    ocorrenciasCriticas: 388,
    crescimentoMensal: 12.8,
    areaAfetadaTotal: 28420,
    produtoresAfetados: 1892,
    taxaControle: 78.5
  },

  pragasPorGravidade: [
    { name: 'Crítica', value: 388, color: '#EF4444' },
    { name: 'Alta', value: 756, color: '#F59E0B' },
    { name: 'Média', value: 1245, color: '#10B981' },
    { name: 'Baixa', value: 458, color: '#6B7280' }
  ],

  topPragas: [
    {
      nome: 'Lagarta do Cartucho',
      ocorrencias: 445,
      gravidade: 'Crítica',
      tendencia: 'subindo',
      cultura: 'Milho',
      provincia: 'Luanda'
    },
    {
      nome: 'Ferrugem do Café',
      ocorrencias: 398,
      gravidade: 'Alta',
      tendencia: 'subindo',
      cultura: 'Café',
      provincia: 'Huíla'
    },
    {
      nome: 'Mosca Branca',
      ocorrencias: 367,
      gravidade: 'Média',
      tendencia: 'descendo',
      cultura: 'Hortícolas',
      provincia: 'Benguela'
    },
    {
      nome: 'Carrapato Bovino',
      ocorrencias: 298,
      gravidade: 'Alta',
      tendencia: 'subindo',
      cultura: 'Pecuária',
      provincia: 'Huambo'
    }
  ]
};*/}

// Dados de incentivos (mantidos)
const dadosIncentivos = {
  estatisticasGerais: {
    totalIncentivos: 3247,
    incentivosAtivos: 2456,
    incentivosVencidos: 234,
    incentivosProcessando: 557,
    valorTotalDistribuido: 1247500000,
    valorTotalReembolsado: 156780000,
    beneficiariosAtivos: 18943,
    reembolsosProcessados: 1234,
    taxaReembolso: 12.6,
    mediaValorPorBeneficiario: 65800,
    crescimentoMensal: 15.8,
    areaTotalBeneficiada: 45670
  },
  incentivoPorTipo: [
    { name: 'Dinheiro', value: 1947, percentage: 60.0, color: '#10B981' },
    { name: 'Produto', value: 1300, percentage: 40.0, color: '#3B82F6' }
  ],
  incentivoPorStatus: [
    { name: 'Activo', value: 2456, color: '#10B981' },
    { name: 'Processando', value: 557, color: '#F59E0B' },
    { name: 'Vencido', value: 234, color: '#EF4444' }
  ],
  incentivoPorProvincia: [
    { name: 'Luanda', value: 567, percentage: 17.5, color: '#3B82F6', reembolsos: 89, beneficiarios: 3456 },
    { name: 'Benguela', value: 445, percentage: 13.7, color: '#10B981', reembolsos: 67, beneficiarios: 2890 },
    { name: 'Huíla', value: 398, percentage: 12.3, color: '#F59E0B', reembolsos: 78, beneficiarios: 2567 },
    { name: 'Malanje', value: 356, percentage: 11.0, color: '#EF4444', reembolsos: 45, beneficiarios: 2234 },
    { name: 'Huambo', value: 334, percentage: 10.3, color: '#8B5CF6', reembolsos: 56, beneficiarios: 2123 },
    { name: 'Outras', value: 1147, percentage: 35.2, color: '#6B7280', reembolsos: 165, beneficiarios: 7733 }
  ]
};

// Dados de pragas (mantidos)
{/*const dadosPragas = {
  principaisPragas: [
    {
      nome: 'Lagarta do Cartucho',
      ocorrencias: 2847,
      gravidade: 'Alta',
      cultura_principal: 'Milho',
      provincia_mais_afetada: 'Huíla',
      impacto_economico: 45600000,
      tendencia: 'subindo'
    },
    {
      nome: 'Mosca Branca',
      ocorrencias: 1893,
      gravidade: 'Média',
      cultura_principal: 'Feijão',
      provincia_mais_afetada: 'Benguela',
      impacto_economico: 23400000,
      tendencia: 'estavel'
    },
    {
      nome: 'Pulgão',
      ocorrencias: 1654,
      gravidade: 'Média',
      cultura_principal: 'Batata-doce',
      provincia_mais_afetada: 'Luanda',
      impacto_economico: 18900000,
      tendencia: 'descendo'
    },
    {
      nome: 'Broca da Mandioca',
      ocorrencias: 1432,
      gravidade: 'Alta',
      cultura_principal: 'Mandioca',
      provincia_mais_afetada: 'Malanje',
      impacto_economico: 34200000,
      tendencia: 'subindo'
    },
    {
      nome: 'Ferrugem do Café',
      ocorrencias: 987,
      gravidade: 'Alta',
      cultura_principal: 'Café',
      provincia_mais_afetada: 'Huambo',
      impacto_economico: 56700000,
      tendencia: 'estavel'
    },
    {
      nome: 'Trips',
      ocorrencias: 756,
      gravidade: 'Baixa',
      cultura_principal: 'Tomate',
      provincia_mais_afetada: 'Bengo',
      impacto_economico: 12300000,
      tendencia: 'descendo'
    }
  ],
  dadosGrafico: [
    { praga: 'Lagarta Cartucho', ocorrencias: 2847, impacto: 45.6 },
    { praga: 'Mosca Branca', ocorrencias: 1893, impacto: 23.4 },
    { praga: 'Pulgão', ocorrencias: 1654, impacto: 18.9 },
    { praga: 'Broca Mandioca', ocorrencias: 1432, impacto: 34.2 },
    { praga: 'Ferrugem Café', ocorrencias: 987, impacto: 56.7 },
    { praga: 'Trips', ocorrencias: 756, impacto: 12.3 }
  ]
};*/}

const Dashboard = () => {
  // Estados para controle dos gráficos de pizza
  const [activeIndexGenero, setActiveIndexGenero] = useState(0);
  const [activeIndexAtividades, setActiveIndexAtividades] = useState(0);
  // const [activeIndexTipo, setActiveIndexTipo] = useState(0);
  const [activeIndexStatus, setActiveIndexStatus] = useState(0);
  const [activeIndexProvincia, setActiveIndexProvincia] = useState(0);
  const [loading, setLoading] = useState(true);

  // Estados para controlar a visibilidade dos componentes flutuantes
  const [showPragas, setShowPragas] = useState(false);
  const [showIncentivos, setShowIncentivos] = useState(false);
  const [showOutros, setShowOutros] = useState(false);

  // Novo estado para filtro por província
  const [selectedProvince, setSelectedProvince] = useState('todas');
  const [showFilters, setShowFilters] = useState(false);


  // Estados para dados das APIs
  const [totalAprovados, setTotalAprovados] = useState(0);
  const [totalProdutores, setTotalProdutores] = useState(0);
  const [totalPecuaria, setTotalPecuaria] = useState(0);
  const [totalAgricultura, setTotalAgricultura] = useState(0);
  const [totalProdutorFlorestal, setTotalProdutorFlorestal] = useState(0);
  const [totalAquicultura, setTotalAquicultura] = useState(0);
  const [masculino, setMasculino] = useState(0);
  const [feminino, setFeminino] = useState(0);
  const [certificados, setCertificados] = useState(0);
  const [projetos, setProjetos] = useState(0);

  // Estados de loading separados
  const [loadingGenero, setLoadingGenero] = useState(true);
  const [loadingAtividades, setLoadingAtividades] = useState(true);
  // const [consultingBI, setConsultingBI] = useState(false);
  //const [error, setError] = useState(null);

  // Estados para filtros adicionais
  const [selectedPeriodo, setSelectedPeriodo] = useState('todos');
  const [selectedEstado, setSelectedEstado] = useState('todos');
  const [selectedAtividade, setSelectedAtividade] = useState('todos');

  // Lista das províncias
  const provincias = [
    { value: 'todas', label: 'Todas as Províncias' },
    { value: 'luanda', label: 'Luanda' },
    { value: 'benguela', label: 'Benguela' },
    { value: 'huila', label: 'Huíla' },
    { value: 'bie', label: 'Bié' },
    { value: 'malanje', label: 'Malanje' },
    { value: 'huambo', label: 'Huambo' },
    { value: 'cabinda', label: 'Cabinda' },
    { value: 'zaire', label: 'Zaire' },
    { value: 'uige', label: 'Uíge' },
    { value: 'cunene', label: 'Cunene' },
    { value: 'namibe', label: 'Namibe' },
    { value: 'lunda_norte', label: 'Lunda Norte' },
    { value: 'lunda_sul', label: 'Lunda Sul' },
    { value: 'moxico', label: 'Moxico' },
    { value: 'cuando_cubango', label: 'Cuando Cubango' },
    { value: 'bengo', label: 'Bengo' },
    { value: 'cuanza_norte', label: 'Cuanza Norte' },
    { value: 'cuanza_sul', label: 'Cuanza Sul' }
  ];

  // Função utilitária para construir endpoints com filtros
  const buildEndpoint = useCallback((baseEndpoint) => {
    const params = new URLSearchParams();

    const provinciaValue = typeof selectedProvince === 'object' ? selectedProvince?.value : selectedProvince;

    if (provinciaValue && provinciaValue !== 'todas') {
      const provinciaMap = {
        'luanda': 'Luanda',
        'benguela': 'Benguela',
        'huila': 'Huíla',
        'bie': 'Bié',
        'malanje': 'Malanje',
        'huambo': 'Huambo',
        'cabinda': 'Cabinda',
        'zaire': 'Zaire',
        'uige': 'Uíge',
        'cunene': 'Cunene',
        'namibe': 'Namibe',
        'lunda_norte': 'Lunda Norte',
        'lunda_sul': 'Lunda Sul',
        'moxico': 'Moxico',
        'cuando_cubango': 'Cuando Cubango',
        'bengo': 'Bengo',
        'cuanza_norte': 'Cuanza Norte',
        'cuanza_sul': 'Cuanza Sul'
      };
      const nomeProvinciaCompleto = provinciaMap[provinciaValue];
      if (nomeProvinciaCompleto) {
        params.append('provincia', nomeProvinciaCompleto);
      }
    }

    if (selectedPeriodo !== 'todos') {
      params.append('periodo', selectedPeriodo);
    }

    if (selectedEstado !== 'todos') {
      params.append('estado', selectedEstado);
    }

    if (selectedAtividade !== 'todos') {
      params.append('atividade', selectedAtividade);
    }

    return params.toString() ? `${baseEndpoint}?${params.toString()}` : baseEndpoint;
  }, [selectedProvince, selectedPeriodo, selectedEstado, selectedAtividade]);

  // Buscar total de produtores por estado (aprovados/pendentes) somando agrícolas e florestais
  useEffect(() => {
    console.log('🔄 useEffect aprovados executado com:', { selectedProvince, selectedEstado });

    const fetchAprovados = async () => {
      try {
        console.log('📡 Buscando dados de todos os produtores...');
        const [respostaAgricola, respostaFlorestal] = await Promise.all([
          api.get('/formulario/all'),
          api.get('/produtorFlorestal/all')
        ]);

        let dadosAgricola = Array.isArray(respostaAgricola.data) ? respostaAgricola.data : [];
        let dadosFlorestal = Array.isArray(respostaFlorestal.data) ? respostaFlorestal.data : [];

        console.log('📊 Dados recebidos:', {
          agricola: dadosAgricola.length,
          florestal: dadosFlorestal.length
        });

        // Filtrar por província se selecionada
        if (selectedProvince && selectedProvince !== 'todas') {
          const provinciaValue = typeof selectedProvince === 'object' ? selectedProvince.value : selectedProvince;
          const provinciaMap = {
            'luanda': 'Luanda', 'benguela': 'Benguela', 'huila': 'Huíla', 'bie': 'Bié',
            'malanje': 'Malanje', 'huambo': 'Huambo', 'cabinda': 'Cabinda', 'zaire': 'Zaire',
            'uige': 'Uíge', 'cunene': 'Cunene', 'namibe': 'Namibe', 'lunda_norte': 'Lunda Norte',
            'lunda_sul': 'Lunda Sul', 'moxico': 'Moxico', 'cuando_cubango': 'Cuando Cubango',
            'bengo': 'Bengo', 'cuanza_norte': 'Cuanza Norte', 'cuanza_sul': 'Cuanza Sul'
          };
          const nomeProvinciaCompleto = provinciaMap[provinciaValue] || provinciaValue;

          dadosAgricola = dadosAgricola.filter(p => p.provincia === nomeProvinciaCompleto);
          dadosFlorestal = dadosFlorestal.filter(p => p.provincia === nomeProvinciaCompleto);
        }

        // Filtrar por estado se selecionado
        const estadoValue = typeof selectedEstado === 'object' ? selectedEstado.value : selectedEstado;
        if (estadoValue && estadoValue !== 'todos') {
          const estadoFiltro = estadoValue === 'aprovados' ? 'Aprovado' : 'Pendente';
          dadosAgricola = dadosAgricola.filter(p => p.estado === estadoFiltro);
          dadosFlorestal = dadosFlorestal.filter(p => p.estado === estadoFiltro);
        } else {
          // Se não há filtro de estado, pegar apenas aprovados por padrão
          dadosAgricola = dadosAgricola.filter(p => p.estado === 'Aprovado');
          dadosFlorestal = dadosFlorestal.filter(p => p.estado === 'Aprovado');
        }

        const totalAgricola = dadosAgricola.length;
        const totalFlorestal = dadosFlorestal.length;
        const totalGeral = totalAgricola + totalFlorestal;

        setTotalAprovados(totalGeral);
        console.log('📈 Total por estado:', { agricola: totalAgricola, florestal: totalFlorestal, total: totalGeral, estado: estadoValue });
      } catch (error) {
        console.error('Erro ao buscar aprovados:', error);
        setTotalAprovados(0); // Fallback
      }
    };

    fetchAprovados();
  }, [selectedProvince, selectedEstado]);

  // Buscar total de produtores somando agrícolas e florestais com filtro por província
  useEffect(() => {
    const fetchTotal = async () => {
      try {
        const [respostaAgricola, respostaFlorestal] = await Promise.all([
          api.get('/formulario/all'),
          api.get('/produtorFlorestal/all')
        ]);

        let dadosAgricola = Array.isArray(respostaAgricola.data) ? respostaAgricola.data : [];
        let dadosFlorestal = Array.isArray(respostaFlorestal.data) ? respostaFlorestal.data : [];

        // Debug: verificar estrutura dos dados
        console.log('Dados brutos:', {
          agricola: dadosAgricola.slice(0, 2),
          florestal: dadosFlorestal.slice(0, 2)
        });

        // Filtrar por província se selecionada
        if (selectedProvince && selectedProvince !== 'todas') {
          const provinciaValue = typeof selectedProvince === 'object' ? selectedProvince.value : selectedProvince;
          const provinciaMap = {
            'luanda': 'Luanda', 'benguela': 'Benguela', 'huila': 'Huíla', 'bie': 'Bié',
            'malanje': 'Malanje', 'huambo': 'Huambo', 'cabinda': 'Cabinda', 'zaire': 'Zaire',
            'uige': 'Uíge', 'cunene': 'Cunene', 'namibe': 'Namibe', 'lunda_norte': 'Lunda Norte',
            'lunda_sul': 'Lunda Sul', 'moxico': 'Moxico', 'cuando_cubango': 'Cuando Cubango',
            'bengo': 'Bengo', 'cuanza_norte': 'Cuanza Norte', 'cuanza_sul': 'Cuanza Sul'
          };
          const nomeProvinciaCompleto = provinciaMap[provinciaValue] || provinciaValue;

          console.log('Filtrando por província:', nomeProvinciaCompleto);

          dadosAgricola = dadosAgricola.filter(p => {
            console.log('Produtor agrícola:', p.provincia, '===', nomeProvinciaCompleto, '?', p.provincia === nomeProvinciaCompleto);
            return p.provincia === nomeProvinciaCompleto;
          });

          dadosFlorestal = dadosFlorestal.filter(p => {
            console.log('Produtor florestal:', p.provincia, '===', nomeProvinciaCompleto, '?', p.provincia === nomeProvinciaCompleto);
            return p.provincia === nomeProvinciaCompleto;
          });
        }

        const totalAgricola = dadosAgricola.length;
        const totalFlorestal = dadosFlorestal.length;
        const totalGeral = totalAgricola + totalFlorestal;

        setTotalProdutores(totalGeral);
        console.log('Total produtores:', { agricola: totalAgricola, florestal: totalFlorestal, total: totalGeral, provincia: selectedProvince });
      } catch (error) {
        console.error('Erro ao buscar total:', error);
        setTotalProdutores(523450); // Fallback
      }
    };

    fetchTotal();
  }, [selectedProvince]);

  // Buscar total de pecuária com todos os filtros
  useEffect(() => {
    const fetchPecuaria = async () => {
      try {
        const endpoint = buildEndpoint('/dashboard/totalPecuaria');
        const resposta = await api.get(endpoint);
        setTotalPecuaria(resposta.data || 0);
        console.log('Total pecuária:', resposta.data, 'filtros aplicados');
      } catch (error) {
        console.error('Erro ao buscar pecuária:', error);
        setTotalPecuaria(89300); // Fallback
      }
    };

    fetchPecuaria();
  }, [buildEndpoint]);

  // Buscar total de produtor florestal com filtro por província
  useEffect(() => {
    const fetchFlorestal = async () => {
      try {
        let endpoint = '/dashboard/totalProdutorFlorestal';

        if (selectedProvince !== 'todas') {
          const provinciaMap = {
            'luanda': 'Luanda',
            'benguela': 'Benguela',
            'huila': 'Huíla',
            'bie': 'Bié',
            'malanje': 'Malanje',
            'huambo': 'Huambo',
            'cabinda': 'Cabinda',
            'zaire': 'Zaire',
            'uige': 'Uíge',
            'cunene': 'Cunene',
            'namibe': 'Namibe',
            'lunda_norte': 'Lunda Norte',
            'lunda_sul': 'Lunda Sul',
            'moxico': 'Moxico',
            'cuando_cubango': 'Cuando Cubango',
            'bengo': 'Bengo',
            'cuanza_norte': 'Cuanza Norte',
            'cuanza_sul': 'Cuanza Sul'
          };
          const nomeProvinciaCompleto = provinciaMap[selectedProvince];
          endpoint += `?provincia=${encodeURIComponent(nomeProvinciaCompleto)}`;
        }

        const resposta = await api.get(endpoint);
        setTotalProdutorFlorestal(resposta.data || 0);
        console.log('Total produtor florestal:', resposta.data, 'provincia:', selectedProvince);
      } catch (error) {
        console.error('Erro ao buscar produtor florestal:', error);
        setTotalProdutorFlorestal(45600); // Fallback
      }
    };

    fetchFlorestal();
  }, [selectedProvince]);

  // Buscar total de aquicultura com filtro por província
  useEffect(() => {
    const fetchAquicultura = async () => {
      try {
        let endpoint = '/dashboard/totalAquicultura';

        if (selectedProvince !== 'todas') {
          const provinciaMap = {
            'luanda': 'Luanda',
            'benguela': 'Benguela',
            'huila': 'Huíla',
            'bie': 'Bié',
            'malanje': 'Malanje',
            'huambo': 'Huambo',
            'cabinda': 'Cabinda',
            'zaire': 'Zaire',
            'uige': 'Uíge',
            'cunene': 'Cunene',
            'namibe': 'Namibe',
            'lunda_norte': 'Lunda Norte',
            'lunda_sul': 'Lunda Sul',
            'moxico': 'Moxico',
            'cuando_cubango': 'Cuando Cubango',
            'bengo': 'Bengo',
            'cuanza_norte': 'Cuanza Norte',
            'cuanza_sul': 'Cuanza Sul'
          };
          const nomeProvinciaCompleto = provinciaMap[selectedProvince];
          endpoint += `?provincia=${encodeURIComponent(nomeProvinciaCompleto)}`;
        }

        const resposta = await api.get(endpoint);
        setTotalAquicultura(resposta.data || 0);
        console.log('Total aquicultura:', resposta.data, 'provincia:', selectedProvince);
      } catch (error) {
        console.error('Erro ao buscar aquicultura:', error);
        setTotalAquicultura(31850); // Fallback
      }
    };

    fetchAquicultura();
  }, [selectedProvince]);

  // Buscar total de agricultura com filtro por província
  useEffect(() => {
    const fetchAgricultura = async () => {
      try {
        let endpoint = '/dashboard/totalAgricultura';

        if (selectedProvince !== 'todas') {
          const provinciaMap = {
            'luanda': 'Luanda',
            'benguela': 'Benguela',
            'huila': 'Huíla',
            'bie': 'Bié',
            'malanje': 'Malanje',
            'huambo': 'Huambo',
            'cabinda': 'Cabinda',
            'zaire': 'Zaire',
            'uige': 'Uíge',
            'cunene': 'Cunene',
            'namibe': 'Namibe',
            'lunda_norte': 'Lunda Norte',
            'lunda_sul': 'Lunda Sul',
            'moxico': 'Moxico',
            'cuando_cubango': 'Cuando Cubango',
            'bengo': 'Bengo',
            'cuanza_norte': 'Cuanza Norte',
            'cuanza_sul': 'Cuanza Sul'
          };
          const nomeProvinciaCompleto = provinciaMap[selectedProvince];
          endpoint += `?provincia=${encodeURIComponent(nomeProvinciaCompleto)}`;
        }

        const resposta = await api.get(endpoint);
        setTotalAgricultura(resposta.data || 0);
        console.log('Total agricultura:', resposta.data, 'provincia:', selectedProvince);
      } catch (error) {
        console.error('Erro ao buscar agricultura:', error);
        setTotalAgricultura(356700); // Fallback
      }
    };

    fetchAgricultura();
  }, [selectedProvince]);

  // Buscar dados de gênero com todos os filtros
  useEffect(() => {
    setLoadingGenero(true);

    const fetchGenero = async () => {
      try {
        const endpoint = buildEndpoint('/dashboard/totalFemenino');
        const resposta = await api.get(endpoint);

        const formularios = resposta.data;
        if (Array.isArray(formularios)) {
          const totalMasculinos = formularios.filter(f => f.sexo === 'Masculino').length;
          const totalFemininos = formularios.filter(f => f.sexo === 'Feminino').length;
          setMasculino(totalMasculinos);
          setFeminino(totalFemininos);
        } else {
          setMasculino(Math.round(totalProdutores * 0.57));
          setFeminino(Math.round(totalProdutores * 0.43));
        }
      } catch (error) {
        console.error('Erro ao buscar dados de gênero:', error);
        setMasculino(Math.round(totalProdutores * 0.57));
        setFeminino(Math.round(totalProdutores * 0.43));
      } finally {
        setLoadingGenero(false);
      }
    };

    fetchGenero();
  }, [buildEndpoint, totalProdutores]);

  // 2. CORRIGIR os useEffect das atividades para usar buildEndpoint
  // Substituir os useEffect existentes das atividades (linhas ~218-280) por estes:

  // Buscar agricultura com todos os filtros
  useEffect(() => {
    const fetchAgricultura = async () => {
      try {
        const endpoint = buildEndpoint('/dashboard/totalAgricultura');
        const resposta = await api.get(endpoint);
        setTotalAgricultura(resposta.data || 0);
        console.log('Total agricultura:', resposta.data, 'com todos os filtros aplicados');
      } catch (error) {
        console.error('Erro ao buscar agricultura:', error);
        setTotalAgricultura(356700); // Fallback
      }
    };

    fetchAgricultura();
  }, [buildEndpoint]);

  // Buscar pecuária com todos os filtros
  useEffect(() => {
    const fetchPecuaria = async () => {
      try {
        const endpoint = buildEndpoint('/dashboard/totalPecuaria');
        const resposta = await api.get(endpoint);
        setTotalPecuaria(resposta.data || 0);
        console.log('Total pecuária:', resposta.data, 'com todos os filtros aplicados');
      } catch (error) {
        console.error('Erro ao buscar pecuária:', error);
        setTotalPecuaria(89300); // Fallback
      }
    };

    fetchPecuaria();
  }, [buildEndpoint]);

  // Buscar produtor florestal com todos os filtros
  useEffect(() => {
    const fetchFlorestal = async () => {
      try {
        const endpoint = buildEndpoint('/dashboard/totalProdutorFlorestal');
        const resposta = await api.get(endpoint);
        setTotalProdutorFlorestal(resposta.data || 0);
        console.log('Total produtor florestal:', resposta.data, 'com todos os filtros aplicados');
      } catch (error) {
        console.error('Erro ao buscar produtor florestal:', error);
        setTotalProdutorFlorestal(45600); // Fallback
      }
    };

    fetchFlorestal();
  }, [buildEndpoint]);

  // Buscar aquicultura com todos os filtros
  useEffect(() => {
    const fetchAquicultura = async () => {
      try {
        const endpoint = buildEndpoint('/dashboard/totalAquicultura');
        const resposta = await api.get(endpoint);
        setTotalAquicultura(resposta.data || 0);
        console.log('Total aquicultura:', resposta.data, 'com todos os filtros aplicados');
      } catch (error) {
        console.error('Erro ao buscar aquicultura:', error);
        setTotalAquicultura(31850); // Fallback
      }
    };

    fetchAquicultura();
  }, [buildEndpoint]);



  // 4. ATUALIZAR o useMemo do gráfico de atividades para considerar o filtro de atividade
  const registrosPorAtividade = useMemo(() => {
    let atividades = [
      { name: 'Agricultura', value: totalAgricultura, color: '#10B981' },
      { name: 'Pecuária', value: totalPecuaria, color: '#F59E0B' },
      { name: 'Produtor Florestal', value: totalProdutorFlorestal, color: '#34D399' },
      { name: 'Aquicultura', value: totalAquicultura, color: '#06B6D4' }
    ];

    // Filtrar por atividade específica se selecionada
    const selectedValue = selectedAtividade?.value || selectedAtividade;
    if (selectedValue && selectedValue !== 'todos') {
      const atividadeMap = {
        'agricultura': 'Agricultura',
        'pecuaria': 'Pecuária',
        'florestal': 'Produtor Florestal',
        'aquicultura': 'Aquicultura'
      };
      const nomeAtividade = atividadeMap[selectedValue];
      if (nomeAtividade) {
        atividades = atividades.filter(a => a.name === nomeAtividade);
      }
    }

    // Remover atividades com valor 0
    return atividades.filter(a => a.value > 0);
  }, [totalAgricultura, totalPecuaria, totalProdutorFlorestal, totalAquicultura, selectedAtividade]);

  // Buscar certificados
  useEffect(() => {
    const fetchCertificados = async () => {
      try {
        const resposta = await api.get('/certificaoDoProdutor/produtoresComCertificados');
        setCertificados(resposta.data.length || 0);
        console.log('Total certificados:', resposta.data.length);
      } catch (error) {
        console.error('Erro ao buscar certificados:', error);
        setCertificados(Math.round(totalAprovados * 0.85)); // Fallback
      }
    };

    if (totalAprovados > 0) {
      fetchCertificados();
    }
  }, [totalAprovados]);

  // Buscar projetos
  useEffect(() => {
    const fetchProjetos = async () => {
      try {
        const resposta = await api.get('/projetoBeneficiario/all');
        setProjetos(resposta.data.length || 0);
        console.log('Total projetos:', resposta.data.length);
      } catch (error) {
        console.error('Erro ao buscar projetos:', error);
        setProjetos(1247); // Fallback
      }
    };

    fetchProjetos();
  }, []);

  // Controlar loading das atividades
  useEffect(() => {
    if (totalPecuaria > 0 || totalAgricultura > 0 || totalProdutorFlorestal > 0 || totalAquicultura > 0) {
      setLoadingAtividades(false);
    }
  }, [totalPecuaria, totalAgricultura, totalProdutorFlorestal, totalAquicultura]);



  // Calcular dados filtrados (agora os dados já vêm filtrados da API)
  const dadosFiltrados = useMemo(() => {
    let base = {
      totalProdutores,
      totalAprovados,
      totalPecuaria,
      totalAgricultura,
      totalProdutorFlorestal,
      totalAquicultura,
      masculino,
      feminino,
      certificados,
      projetos
    };

    return base;
  }, [
    totalProdutores, totalAprovados, totalPecuaria, totalAgricultura,
    totalProdutorFlorestal, totalAquicultura, masculino, feminino,
    certificados, projetos
  ]);
  // Criar dados dinâmicos para o gráfico de gênero
  const produtoresPorGenero = useMemo(() => [
    {
      name: 'Masculino',
      value: masculino,
      color: '#3B82F6'
    },
    {
      name: 'Feminino',
      value: feminino,
      color: '#EC4899'
    }
  ], [masculino, feminino]);



  // Controlar loading geral
  useEffect(() => {
    if (!loadingGenero && !loadingAtividades && totalProdutores > 0) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loadingGenero, loadingAtividades, totalProdutores]);

  // Fechar componentes com tecla ESC
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setShowPragas(false);
        setShowIncentivos(false);
        setShowOutros(false);
      }
    };

    if (showPragas || showIncentivos || showOutros) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showPragas, showIncentivos, showOutros]);

  // Função para fechar todos os componentes
  const closeAllComponents = () => {
    setShowPragas(false);
    setShowIncentivos(false);
    setShowOutros(false);
  };

  // Função para refresh dos dados
  const handleRefresh = () => {
    window.location.reload();
  };

  // Handlers para os gráficos
  const onPieEnterGenero = (_, index) => {
    setActiveIndexGenero(index);
  };

  const onPieEnterAtividades = (_, index) => {
    setActiveIndexAtividades(index);
  };

  const onPieEnterStatus = (_, index) => {
    setActiveIndexStatus(index);
  };
  const periodoOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Último mês', value: 'ultimomes' },
    { label: 'Últimos 3 meses', value: 'ultimos3meses' },
    { label: 'Último ano', value: 'ultimosano' }
  ];

  const estadoOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Aprovados', value: 'aprovados' },
    { label: 'Pendentes', value: 'pendentes' }
  ];

  const actividadesOptions = [
    { label: 'Todos', value: 'todos' },
    { label: 'Agricultura', value: 'agricultura' },
    { label: 'Pecuária', value: 'pecuaria' },
    { label: 'Florestal', value: 'florestal' },
    { label: 'Aquicultura', value: 'aquicultura' }
  ];
  // Adicione este useEffect para monitorar as mudanças nos filtros
  useEffect(() => {
    console.log("Filtros atualizados:", {
      selectedProvince,
      selectedPeriodo,
      selectedEstado,
      selectedAtividade
    });
  }, [selectedProvince, selectedPeriodo, selectedEstado, selectedAtividade]);

  // Função para formatar números
  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value?.toString() || '0';
  };

  // Calcular taxa de aprovação
  const taxaAprovacao = dadosFiltrados.totalProdutores > 0
    ? ((dadosFiltrados.totalAprovados / dadosFiltrados.totalProdutores) * 100).toFixed(1)
    : 0;

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando dados do SIGAF...</p>
          <p className="mt-2 text-sm text-gray-500">Registo Nacional de Produtores Agrícolas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Header Melhorado */}
      <div className="bg-white shadow-sm border-b  top-0 z-30">
        <div className="w-full mx-auto px-6 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">
                  Dashboard SIGAF
                </h1>
                <p className="text-gray-600 text-sm lg:text-base">
                  Visão geral dos produtores agrícolas registados em Angola
                </p>
              </div>

              <button
                onClick={handleRefresh}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                title="Atualizar dados"
              >
                <RefreshCw className="h-5 w-5" />
              </button>
            </div>

            {/* Controles do Header  */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
              {/* Seletor de Província  */}
              <div className="relative">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Filtrar por Província
                </label>
                <div className="relative">
                  <CustomInput
                    type="select"
                    value={selectedProvince}
                    onChange={setSelectedProvince}
                    options={provincias}
                  />
                </div>
              </div>
              {/* Filtros  */}
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center mt-4 space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors border rounded-lg"
              >
                <Filter className="h-4 w-4" />
                <span>Filtro Avançado</span>
                <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>


            </div>
          </div>

          {/* Filtros Expandidos */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Período */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Período
                  </label>
                  <CustomInput
                    type="select"
                    value={selectedPeriodo}
                    onChange={setSelectedPeriodo}
                    options={periodoOptions}
                  />
                </div>

                {/* Estado { */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Estado
                  </label>
                  <CustomInput
                    type="select"
                    value={selectedEstado}
                    onChange={setSelectedEstado}
                    options={estadoOptions}
                  />
                </div>

                {/* Actividade {*/}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Actividade
                  </label>
                  <CustomInput
                    type="select"
                    value={selectedAtividade}
                    onChange={setSelectedAtividade}
                    options={actividadesOptions}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="w-full mx-auto px-6 py-8">
        {/* Cards de Métricas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Produtores</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{formatNumber(dadosFiltrados.totalProdutores)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
                  <span className="text-sm text-green-600">+13.2% este mês</span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  {(selectedEstado?.value || selectedEstado) === 'pendentes' ? 'Pendentes' : 'Aprovados'}
                </p>
                <p className={`text-3xl font-bold mt-1 ${(selectedEstado?.value || selectedEstado) === 'pendentes' ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                  {formatNumber(dadosFiltrados.totalAprovados)}
                </p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {(selectedEstado?.value || selectedEstado) === 'pendentes'
                      ? `Total pendentes`
                      : `Taxa: ${taxaAprovacao}%`}
                  </span>
                </div>
              </div>
              <div className={`p-3 rounded-lg ${(selectedEstado?.value || selectedEstado) === 'pendentes' ? 'bg-yellow-50' : 'bg-green-50'
                }`}>
                <CheckCircle className={`h-8 w-8 ${(selectedEstado?.value || selectedEstado) === 'pendentes' ? 'text-yellow-500' : 'text-green-500'
                  }`} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificados</p>
                <p className="text-3xl font-bold text-blue-600 mt-1">{formatNumber(dadosFiltrados.certificados)}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {((dadosFiltrados.certificados / dadosFiltrados.totalAprovados) * 100).toFixed(1)}% dos aprovados
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-50 rounded-lg">
                <Award className="h-8 w-8 text-blue-500" />
              </div>
            </div>
          </div>

        </div>

        {/* Gráficos de Pizza Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza - Produtores por Gênero */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Produtores por Gênero</h2>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            {loadingGenero ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndexGenero}
                      activeShape={(props) => {
                        const RADIAN = Math.PI / 180;
                        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                        const sin = Math.sin(-RADIAN * midAngle);
                        const cos = Math.cos(-RADIAN * midAngle);
                        const sx = cx + (outerRadius + 10) * cos;
                        const sy = cy + (outerRadius + 10) * sin;
                        const mx = cx + (outerRadius + 30) * cos;
                        const my = cy + (outerRadius + 30) * sin;
                        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                        const ey = my;
                        const textAnchor = cos >= 0 ? 'start' : 'end';

                        return (
                          <g>
                            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-base font-medium">
                              {payload.name}
                            </text>
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={innerRadius}
                              outerRadius={outerRadius}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                            />
                            <Sector
                              cx={cx}
                              cy={cy}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              innerRadius={outerRadius + 6}
                              outerRadius={outerRadius + 10}
                              fill={fill}
                            />
                            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                              {`${formatNumber(value)} produtores`}
                            </text>
                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                              {`(${(percent * 100).toFixed(1)}%)`}
                            </text>
                          </g>
                        );
                      }}
                      onMouseEnter={onPieEnterGenero}
                      data={produtoresPorGenero}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {produtoresPorGenero.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), 'Produtores']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  {produtoresPorGenero.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-sm text-gray-600">
                        {entry.name}: {formatNumber(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Gráfico de Pizza - Atividades dos Produtores */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Actividades dos Produtores</h2>
              <div className="p-2 bg-green-50 rounded-lg">
                <Tractor className="h-6 w-6 text-green-500" />
              </div>
            </div>

            {loadingAtividades ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      activeIndex={activeIndexAtividades}
                      activeShape={(props) => {
                        const RADIAN = Math.PI / 180;
                        const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                        const sin = Math.sin(-RADIAN * midAngle);
                        const cos = Math.cos(-RADIAN * midAngle);
                        const sx = cx + (outerRadius + 10) * cos;
                        const sy = cy + (outerRadius + 10) * sin;
                        const mx = cx + (outerRadius + 30) * cos;
                        const my = cy + (outerRadius + 30) * sin;
                        const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                        const ey = my;
                        const textAnchor = cos >= 0 ? 'start' : 'end';

                        return (
                          <g>
                            <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
                              {payload.name}
                            </text>
                            <Sector
                              cx={cx}
                              cy={cy}
                              innerRadius={innerRadius}
                              outerRadius={outerRadius}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              fill={fill}
                            />
                            <Sector
                              cx={cx}
                              cy={cy}
                              startAngle={startAngle}
                              endAngle={endAngle}
                              innerRadius={outerRadius + 6}
                              outerRadius={outerRadius + 10}
                              fill={fill}
                            />
                            <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                            <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                              {formatNumber(value)}
                            </text>
                            <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                              {`(${(percent * 100).toFixed(1)}%)`}
                            </text>
                          </g>
                        );
                      }}
                      onMouseEnter={onPieEnterAtividades}
                      data={registrosPorAtividade}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {registrosPorAtividade.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [formatNumber(value), 'Produtores']} />
                  </PieChart>
                </ResponsiveContainer>
                <div className="grid grid-cols-2 gap-2 mt-4">
                  {registrosPorAtividade.map((entry, index) => (
                    <div key={index} className="flex items-center">
                      <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                      <span className="text-xs text-gray-600">
                        {entry.name}: {formatNumber(entry.value)}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
        <Separador icone={BarChart3} titulo="Dados Dos Incentivos" />
        {/* Gráficos de Incentivos (mantidos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza - Incentivos por Tipo */}
          {/*<div className="bg-white rounded-xl col-span-5 shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-semibold text-gray-800">Incentivos por Tipo</h2>
              <div className="p-2 bg-green-50 rounded-lg">
                <Award className="h-6 w-6 text-green-500" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndexTipo}
                  activeShape={(props) => {
                    const RADIAN = Math.PI / 180;
                    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                    const sin = Math.sin(-RADIAN * midAngle);
                    const cos = Math.cos(-RADIAN * midAngle);

                    // Responsividade: ajuste de fonte e posição
                    const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 340 : 400;
                    const fontSize = cardWidth < 340 ? 12 : cardWidth < 400 ? 14 : 16;
                    const labelOffset = cardWidth < 340 ? 8 : 12;
                    const percentOffset = cardWidth < 340 ? 14 : 18;

                    const sx = cx + (outerRadius + 10) * cos;
                    const sy = cy + (outerRadius + 10) * sin;
                    const mx = cx + (outerRadius + 30) * cos;
                    const my = cy + (outerRadius + 30) * sin;
                    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                    const ey = my;
                    const textAnchor = cos >= 0 ? 'start' : 'end';

                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy}
                          dy={8}
                          textAnchor="middle"
                          fill={fill}
                          style={{
                            fontSize: `${fontSize}px`,
                            fontWeight: 500,
                            transition: 'font-size 0.2s'
                          }}
                        >
                          {payload.name}
                        </text>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                        />
                        <Sector
                          cx={cx}
                          cy={cy}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          innerRadius={outerRadius + 6}
                          outerRadius={outerRadius + 10}
                          fill={fill}
                        />
                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                        <text
                          x={ex + (cos >= 0 ? 1 : -1) * labelOffset}
                          y={ey}
                          textAnchor={textAnchor}
                          fill="#333"
                          style={{
                            fontSize: `${fontSize}px`,
                            fontWeight: 500,
                            transition: 'font-size 0.2s'
                          }}
                        >
                          {`${value} `}
                        </text>
                        <text
                          x={ex + (cos >= 0 ? 1 : -1) * labelOffset}
                          y={ey}
                          dy={percentOffset}
                          textAnchor={textAnchor}
                          fill="#999"
                          style={{
                            fontSize: `${fontSize - 2}px`,
                            transition: 'font-size 0.2s'
                          }}
                        >
                          {`(${(percent * 100).toFixed(1)}%)`}
                        </text>
                      </g>
                    );
                  }}
                  onMouseEnter={(_, index) => setActiveIndexTipo(index)}
                  data={dadosIncentivos.incentivoPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosIncentivos.incentivoPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), 'Incentivos']} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex justify-center space-x-6 mt-4">
              {dadosIncentivos.incentivoPorTipo.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">
                    {entry.name}: {formatNumber(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>  */}

          {/* Gráfico de Pizza - Status dos Incentivos */}
          <div className="bg-white rounded-xl   shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-semibold text-gray-800">Estado dos Incentivos</h2>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="h-6 w-6 text-blue-500" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndexStatus}
                  activeShape={(props) => {
                    const RADIAN = Math.PI / 180;
                    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                    const sin = Math.sin(-RADIAN * midAngle);
                    const cos = Math.cos(-RADIAN * midAngle);

                    // Responsividade: ajuste de fonte e posição
                    const cardWidth = window.innerWidth < 640 ? 280 : window.innerWidth < 1024 ? 340 : 400;
                    const fontSize = cardWidth < 340 ? 12 : cardWidth < 400 ? 14 : 16;
                    const labelOffset = cardWidth < 340 ? 8 : 12;
                    const percentOffset = cardWidth < 340 ? 14 : 18;

                    const sx = cx + (outerRadius + 10) * cos;
                    const sy = cy + (outerRadius + 10) * sin;
                    const mx = cx + (outerRadius + 30) * cos;
                    const my = cy + (outerRadius + 30) * sin;
                    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                    const ey = my;
                    const textAnchor = cos >= 0 ? 'start' : 'end';
                    return (
                      <g>
                        <text
                          x={cx}
                          y={cy}
                          dy={8}
                          textAnchor="middle"
                          fill={fill}
                          style={{
                            fontSize: `${fontSize}px`,
                            fontWeight: 500,
                            transition: 'font-size 0.2s'
                          }}
                        >
                          {payload.name}
                        </text>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                        />
                        <Sector
                          cx={cx}
                          cy={cy}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          innerRadius={outerRadius + 6}
                          outerRadius={outerRadius + 10}
                          fill={fill}
                        />
                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                        <text
                          x={ex + (cos >= 0 ? 1 : -1) * labelOffset}
                          y={ey}
                          textAnchor={textAnchor}
                          fill="#333"
                          style={{
                            fontSize: `${fontSize}px`,
                            fontWeight: 500,
                            transition: 'font-size 0.2s'
                          }}
                        >
                          {formatNumber(value)}
                        </text>
                        <text
                          x={ex + (cos >= 0 ? 1 : -1) * labelOffset}
                          y={ey}
                          dy={percentOffset}
                          textAnchor={textAnchor}
                          fill="#999"
                          style={{
                            fontSize: `${fontSize - 2}px`,
                            transition: 'font-size 0.2s'
                          }}
                        >
                          {`(${(percent * 100).toFixed(1)}%)`}
                        </text>
                      </g>
                    );
                  }}
                  onMouseEnter={onPieEnterStatus}
                  data={dadosIncentivos.incentivoPorStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosIncentivos.incentivoPorStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), 'Incentivos']} />
              </PieChart>
            </ResponsiveContainer>

            <div className="flex flex-col space-y-2 mt-4">
              {dadosIncentivos.incentivoPorStatus.map((entry, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                    <span className="text-sm text-gray-600">{entry.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Pizza - Distribuição por Província */}
          <div className="bg-white  rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-1">
              <h2 className="text-xl font-semibold text-gray-800">Distribuição por Província</h2>
              <div className="p-2 bg-purple-50 rounded-lg">
                <MapPin className="h-6 w-6 text-purple-500" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  activeIndex={activeIndexProvincia}
                  activeShape={(props) => {
                    const RADIAN = Math.PI / 180;
                    const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill, payload, percent, value } = props;
                    const sin = Math.sin(-RADIAN * midAngle);
                    const cos = Math.cos(-RADIAN * midAngle);
                    const sx = cx + (outerRadius + 10) * cos;
                    const sy = cy + (outerRadius + 10) * sin;
                    const mx = cx + (outerRadius + 30) * cos;
                    const my = cy + (outerRadius + 30) * sin;
                    const ex = mx + (cos >= 0 ? 1 : -1) * 22;
                    const ey = my;
                    const textAnchor = cos >= 0 ? 'start' : 'end';

                    return (
                      <g>
                        <text x={cx} y={cy} dy={8} textAnchor="middle" fill={fill} className="text-sm font-medium">
                          {payload.name}
                        </text>
                        <Sector
                          cx={cx}
                          cy={cy}
                          innerRadius={innerRadius}
                          outerRadius={outerRadius}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          fill={fill}
                        />
                        <Sector
                          cx={cx}
                          cy={cy}
                          startAngle={startAngle}
                          endAngle={endAngle}
                          innerRadius={outerRadius + 6}
                          outerRadius={outerRadius + 10}
                          fill={fill}
                        />
                        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none" />
                        <circle cx={ex} cy={ey} r={2} fill={fill} stroke="none" />
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} textAnchor={textAnchor} fill="#333">
                          {`${value} `}
                        </text>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                          {`(${(percent * 100).toFixed(1)}%)`}
                        </text>
                      </g>
                    );
                  }}
                  onMouseEnter={(_, index) => setActiveIndexProvincia(index)}
                  data={dadosIncentivos.incentivoPorProvincia}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosIncentivos.incentivoPorProvincia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), 'Incentivos']} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-1 mt-4">
              {dadosIncentivos.incentivoPorProvincia.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-xs text-gray-600">
                    {entry.name}: {formatNumber(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/*<Separador icone={Bug} titulo="Dados de Controle de Pragas" />*/}

        {/* Cards de Métricas de Pragas */}
        {/*<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total de Pragas</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{formatNumber(dadosPragasResumo.estatisticasGerais.totalOcorrencias)}</p>
                <div className="flex items-center mt-2">
                  <ArrowUp className="h-4 w-4 text-red-500 mr-1" />
                  <span className="text-sm text-red-600">+{dadosPragasResumo.estatisticasGerais.crescimentoMensal}% este mês</span>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <Bug className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Ocorrências de Críticas</p>
                <p className="text-3xl font-bold text-red-600 mt-1">{formatNumber(dadosPragasResumo.estatisticasGerais.ocorrenciasCriticas)}</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {((dadosPragasResumo.estatisticasGerais.ocorrenciasCriticas / dadosPragasResumo.estatisticasGerais.totalOcorrencias) * 100).toFixed(1)}% do total
                  </span>
                </div>
              </div>
              <div className="p-3 bg-red-50 rounded-lg">
                <AlertTriangle className="h-8 w-8 text-red-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taxa de Controle</p>
                <p className="text-3xl font-bold text-green-600 mt-1">{dadosPragasResumo.estatisticasGerais.taxaControle}%</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {formatNumber(dadosPragasResumo.estatisticasGerais.ocorrenciasControladas)} controladas
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-50 rounded-lg">
                <Shield className="h-8 w-8 text-green-500" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Área Afetada</p>
                <p className="text-3xl font-bold text-orange-600 mt-1">{formatNumber(dadosPragasResumo.estatisticasGerais.areaAfetadaTotal)} ha</p>
                <div className="flex items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {formatNumber(dadosPragasResumo.estatisticasGerais.produtoresAfetados)} produtores
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-50 rounded-lg">
                <Target className="h-8 w-8 text-orange-500" />
              </div>
            </div>
          </div>
        </div>*/}

        {/* Gráficos de Pragas - Bloco comentado para desativar
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza - Pragas por Gravidade * /}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Pragas por Gravidade</h2>
              <div className="p-2 bg-red-50 rounded-lg">
                <Bug className="h-6 w-6 text-red-500" />
              </div>
            </div>

            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dadosPragasResumo.pragasPorGravidade}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPragasResumo.pragasPorGravidade.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => [formatNumber(value), 'Ocorrências']} />
              </PieChart>
            </ResponsiveContainer>

            <div className="grid grid-cols-2 gap-2 mt-4">
              {dadosPragasResumo.pragasPorGravidade.map((entry, index) => (
               
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">
                    {entry.name}: {formatNumber(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Top Pragas * /}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-200">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Principais Pragas</h2>
              <div className="p-2 bg-orange-50 rounded-lg">
                <AlertTriangle className="h-6 w-6 text-orange-500" />
                           </div>
            </div>

            <div className="space-y-4">
              {dadosPragasResumo.topPragas.slice(0, 4).map((praga, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">

                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${praga.gravidade === 'Crítica' ? 'bg-red-100 text-red-600' :
                        praga.gravidade === 'Alta' ? 'bg-orange-100 text-orange-600' :
                          'bg-yellow-100 text-yellow-600'
                      }`}>
                      <Bug className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">{praga.nome}</p>
                      <p className="text-sm text-gray-600">{praga.cultura} • {praga.provincia}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{praga.ocorrencias}</p>
                    <div className="flex items-center">
                      {praga.tendencia === 'subindo' ?
                        <ArrowUp className="w-3 h-3 text-red-500 mr-1" /> :
                        <ArrowDown className="w-3 h-3 text-green-500 mr-1" />
                      }
                      <span className={`text-xs ${praga.tendencia === 'subindo' ? 'text-red-600' : 'text-green-600'}`}>
                        {praga.gravidade}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
        */}
      </div>

      {/* Botão de fechar geral (mantido) */}
      {(showPragas || showIncentivos || showOutros) && (
        <button
          onClick={closeAllComponents}
          className="fixed top-6 right-6 z-[100] bg-white text-gray-600 hover:text-gray-800 p-2 rounded-full shadow-lg transition-colors"
          title="Fechar"
        >
          <X className="h-6 w-6" />
        </button>
      )}

      {/* Overlay para fechar componentes (mantido) */}
      {(showPragas || showIncentivos || showOutros) && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={closeAllComponents}
        />
      )}

      {/* Botões Flutuantes (mantidos) */}
      <div className="fixed bottom-6 right-6 flex flex-col space-y-4 z-30">
        {/* Botão Pragas */}
        <button
          onClick={() => setShowPragas(true)}
          className="group relative bg-red-500 hover:bg-red-600 text-white p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
          title="Pragas"
        >
          <Bug className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Pragas
          </span>
        </button>

        {/* Botão Incentivos */}
        <button
          onClick={() => setShowIncentivos(true)}
          className="group relative bg-green-500 hover:bg-green-600 text-white p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
          title="Incentivos"
        >
          <Gift className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Incentivos
          </span>
        </button>

        {/* Botão Outros */}
        <button
          onClick={() => setShowOutros(true)}
          className="group relative bg-blue-500 hover:bg-blue-600 text-white p-4 rounded-full shadow-lg transform transition-all duration-300 hover:scale-110 hover:shadow-xl"
          title="Outros"
        >
          <Cloud className="h-6 w-6" />
          <span className="absolute right-full mr-3 top-1/2 transform -translate-y-1/2 bg-gray-800 text-white px-2 py-1 rounded text-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Previsão do Tempo
          </span>
        </button>
      </div>

      {/* Componentes Flutuantes (mantidos) */}
      {showPragas && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-full">
            <div className="bg-white rounded-t-3xl p-6 max-h-[100vh] overflow-y-auto transform transition-all duration-500 animate-slide-up">
              <DashboardControlePragas />
            </div>
          </div>
        </div>
      )}

      {showIncentivos && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-full">
            <div className="bg-white rounded-t-3xl p-6 max-h-[100vh] overflow-y-auto transform transition-all duration-500 animate-slide-up">
              <DashboardIncentivos />
            </div>
          </div>
        </div>
      )}

      {showOutros && (
        <div className="fixed inset-0 z-50 flex items-end justify-center pointer-events-none">
          <div className="pointer-events-auto w-full max-w-full">
            <div className="bg-blue-50 rounded-t-3xl p-6 max-h-[100vh] overflow-y-auto transform transition-all duration-500 animate-slide-up">
              <WeatherForecastAngola />
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.5s ease-out;
        }
        }/style>
      `}</style>
    </div>
  );
};
export default Dashboard;