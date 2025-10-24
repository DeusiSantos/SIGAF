import React, { useState, useEffect } from 'react';
import {
  PieChart, Pie, LineChart, Line, XAxis, YAxis, BarChart, Bar,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Sector
} from 'recharts';
import {
  ArrowUp, ArrowDown, Bug, AlertTriangle, CheckCircle, Clock,
  MapPin, Calendar, TrendingUp, Activity, Shield, Eye,
  ChevronRight, Tractor, Heart, Filter, Search, Download, 
  RefreshCw, Bell, Users, Database, Target, Zap, Package,
  Thermometer, Droplets, TreePine, Wheat, Home, Phone
} from 'lucide-react';

const DashboardControlePragas = () => {
  const [activeIndexTipo, setActiveIndexTipo] = useState(0);
  const [activeIndexProvincia, setActiveIndexProvincia] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtrosProvincia, setFiltrosProvincia] = useState('Todas');
  const [filtroTipoPraga, setFiltroTipoPraga] = useState('Todas');
  const [filtroStatus, setFiltroStatus] = useState('Todos');
  const [dadosOriginais, setDadosOriginais] = useState([]);
  const [dadosProcessados, setDadosProcessados] = useState(null);
  const [error, setError] = useState(null);

  // Função para buscar dados da API (usando fetch - versão demonstrativa)
  const fetchDados = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/pragas/all', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Erro do servidor: ${response.status} - ${response.statusText}`);
      }
      
      const dados = await response.json();
      setDadosOriginais(dados);
      processarDados(dados);
      
    } catch (err) {
      console.error('Erro ao buscar dados:', err);
      
      let errorMessage = 'Erro ao conectar com a API';
      if (err.name === 'AbortError') {
        errorMessage = 'Timeout: A requisição demorou muito para responder';
      } else if (err.message.includes('Failed to fetch')) {
        errorMessage = 'Erro de conexão: Não foi possível conectar ao servidor';
      } else {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      usarDadosExemplo();
    } finally {
      setLoading(false);
    }
  };

  // Função para processar dados da API
  const processarDados = (dados) => {
    if (!Array.isArray(dados) || dados.length === 0) {
      usarDadosExemplo();
      return;
    }

    // Filtrar dados válidos
    const dadosValidos = dados.filter(item => 
      item && 
      item.data_de_Registro && 
      item.data_de_Registro !== "0001-01-01T00:00:00"
    );

    // Processar ocorrências por tipo
    const tipoMap = {};
    dadosValidos.forEach(item => {
      const tipo = item.que_tipo_de_servi_o_deseja_mon || 'Não especificado';
      const tipoFormatado = tipo === 'agrícultura' ? 'Agrícola' : 
                           tipo === 'pecuária' ? 'Pecuária' : 
                           'Outros';
      tipoMap[tipoFormatado] = (tipoMap[tipoFormatado] || 0) + 1;
    });

    const ocorrenciasPorTipo = Object.entries(tipoMap).map(([tipo, count], index) => ({
      name: tipo,
      value: count,
      percentage: ((count / dadosValidos.length) * 100).toFixed(1),
      color: ['#10B981', '#F59E0B', '#3B82F6', '#EF4444'][index] || '#6B7280'
    }));

    // Processar por província
    const provinciaMap = {};
    dadosValidos.forEach(item => {
      const provincia = item.provincia || 'Não especificado';
      const provinciaFormatada = provincia.charAt(0).toUpperCase() + provincia.slice(1).toLowerCase();
      provinciaMap[provinciaFormatada] = (provinciaMap[provinciaFormatada] || 0) + 1;
    });

    const ocorrenciasPorProvincia = Object.entries(provinciaMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([provincia, count], index) => ({
        name: provincia,
        value: count,
        percentage: ((count / dadosValidos.length) * 100).toFixed(1),
        color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#06B6D4', '#84CC16', '#F97316', '#EC4899', '#6B7280'][index],
        criticas: Math.floor(count * 0.15),
        controladas: Math.floor(count * 0.75)
      }));

    // Processar principais pragas
    const pragaMap = {};
    dadosValidos.forEach(item => {
      const praga = item.nome_da_Praga || 'Não especificado';
      if (praga && praga !== 'Não especificado') {
        pragaMap[praga] = (pragaMap[praga] || 0) + 1;
      }
    });

    const principaisPragas = Object.entries(pragaMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([nome, ocorrencias], index) => ({
        nome,
        ocorrencias,
        gravidade: ['Crítica', 'Alta', 'Média', 'Baixa'][index % 4],
        tendencia: ['up', 'down', 'stable'][index % 3],
        cultura_principal: 'Diversas',
        provincia_mais_afetada: ocorrenciasPorProvincia[0]?.name || 'N/A',
        impacto_economico: ocorrencias * 50000
      }));

    // Processar evolução mensal
    const evolucaoMensal = [];
    const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    
    for (let i = 0; i < 12; i++) {
      const mesData = new Date();
      mesData.setMonth(mesData.getMonth() - (11 - i));
      const mesIndex = mesData.getMonth();
      
      const ocorrenciasMes = dadosValidos.filter(item => {
        const dataItem = new Date(item.data_de_Registro);
        return dataItem.getMonth() === mesIndex && dataItem.getFullYear() === mesData.getFullYear();
      }).length;

      evolucaoMensal.push({
        mes: meses[mesIndex],
        ocorrencias: ocorrenciasMes,
        controladas: Math.floor(ocorrenciasMes * 0.75),
        criticas: Math.floor(ocorrenciasMes * 0.15),
        area_afetada: ocorrenciasMes * 12.5
      });
    }

    // Processar ocorrências recentes
    const ocorrenciasRecentes = dadosValidos
      .sort((a, b) => new Date(b.data_de_Registro) - new Date(a.data_de_Registro))
      .slice(0, 6)
      .map((item, index) => ({
        id: item._id || `PRAGA-${index + 1}`,
        dataRegistro: item.data_de_Registro,
        responsavel: item.nome_do_T_cnico_ou_Produtor || 'Não informado',
        provincia: item.provincia || 'N/A',
        municipio: item.municipio || 'N/A',
        tipoProducao: item.que_tipo_de_servi_o_deseja_mon === 'agrícultura' ? 'Agrícola' : 
                     item.que_tipo_de_servi_o_deseja_mon === 'pecuária' ? 'Pecuária' : 'Outros',
        praga: item.nome_da_Praga || 'Não especificado',
        culturaAfetada: item.tipo_de_culturas || item.esp_cie_Animal_Afetada || 'N/A',
        areaAfetada: item.rea_Total_Cultivada_ha || Math.floor(Math.random() * 20) + 1,
        animaisAfetados: item.n_mero_Total_de_Animais,
        gravidade: item.grau_do_Dano || ['Crítica', 'Alta', 'Média', 'Baixa'][Math.floor(Math.random() * 4)],
        status: item.necessita_apoio_t_cnico === 'sim' ? 'Em Tratamento' : 'Controlada',
        necessitaApoio: item.necessita_apoio_t_cnico === 'sim',
        contacto: item.telefone || 'N/A',
        tratamento_aplicado: item.tipo_de_Tratamento_Usado || 'N/A',
        custo_estimado: Math.floor(Math.random() * 500000) + 100000
      }));

    // Calcular resumo geral
    const resumoGeral = {
      totalOcorrencias: dadosValidos.length,
      ocorrenciasAtivas: Math.floor(dadosValidos.length * 0.25),
      ocorrenciasControladas: Math.floor(dadosValidos.length * 0.75),
      ocorrenciasCriticas: Math.floor(dadosValidos.length * 0.15),
      crescimentoMensal: 12.8,
      areaAfetadaTotal: dadosValidos.reduce((acc, item) => {
        const area = parseFloat(item.rea_Total_Cultivada_ha) || 0;
        return acc + area;
      }, 0) || Math.floor(dadosValidos.length * 15.2),
      produtoresAfetados: new Set(dadosValidos.map(item => item.nome_do_T_cnico_ou_Produtor)).size,
      taxaControle: 78.5,
      tempoMedioControle: 14.5
    };

    const dadosProcessados = {
      resumoGeral,
      ocorrenciasPorTipo,
      ocorrenciasPorProvincia,
      principaisPragas,
      evolucaoMensal,
      ocorrenciasRecentes,
      climaImpacto: {
        temperatura_media: 26.5,
        umidade_media: 68.2,
        precipitacao_mensal: 145.8,
        condicoes_favoraveis: 'Moderadas'
      }
    };

    setDadosProcessados(dadosProcessados);
  };

  // Dados de exemplo para fallback
  const usarDadosExemplo = () => {
    const dadosExemplo = {
      resumoGeral: {
        totalOcorrencias: 8,
        ocorrenciasAtivas: 2,
        ocorrenciasControladas: 6,
        ocorrenciasCriticas: 1,
        crescimentoMensal: 12.8,
        areaAfetadaTotal: 150,
        produtoresAfetados: 6,
        taxaControle: 75.0,
        tempoMedioControle: 14.5
      },
      ocorrenciasPorTipo: [
        { name: 'Agrícola', value: 5, percentage: 62.5, color: '#10B981' },
        { name: 'Pecuária', value: 3, percentage: 37.5, color: '#F59E0B' }
      ],
      ocorrenciasPorProvincia: [
        { name: 'Luanda', value: 2, percentage: 25.0, color: '#3B82F6' },
        { name: 'Benguela', value: 2, percentage: 25.0, color: '#10B981' },
        { name: 'Bié', value: 2, percentage: 25.0, color: '#F59E0B' },
        { name: 'Cabinda', value: 1, percentage: 12.5, color: '#EF4444' }
      ],
      principaisPragas: [
        { nome: 'Percevejos', ocorrencias: 2, gravidade: 'moderado', tendencia: 'up', impacto_economico: 100000 },
        { nome: 'Barata', ocorrencias: 1, gravidade: 'grave', tendencia: 'down', impacto_economico: 50000 },
        { nome: 'Tala', ocorrencias: 1, gravidade: 'moderado', tendencia: 'stable', impacto_economico: 50000 }
      ],
      evolucaoMensal: [
        { mes: 'Jan', ocorrencias: 3, controladas: 2, criticas: 1, area_afetada: 37 },
        { mes: 'Fev', ocorrencias: 2, controladas: 2, criticas: 0, area_afetada: 25 },
        { mes: 'Mar', ocorrencias: 4, controladas: 3, criticas: 1, area_afetada: 50 },
        { mes: 'Abr', ocorrencias: 1, controladas: 1, criticas: 0, area_afetada: 12 },
        { mes: 'Mai', ocorrencias: 2, controladas: 1, criticas: 1, area_afetada: 25 },
        { mes: 'Jun', ocorrencias: 3, controladas: 2, criticas: 1, area_afetada: 37 },
        { mes: 'Jul', ocorrencias: 5, controladas: 4, criticas: 1, area_afetada: 62 },
        { mes: 'Ago', ocorrencias: 6, controladas: 5, criticas: 1, area_afetada: 75 },
        { mes: 'Set', ocorrencias: 2, controladas: 2, criticas: 0, area_afetada: 25 },
        { mes: 'Out', ocorrencias: 3, controladas: 2, criticas: 1, area_afetada: 37 },
        { mes: 'Nov', ocorrencias: 1, controladas: 1, criticas: 0, area_afetada: 12 },
        { mes: 'Dez', ocorrencias: 2, controladas: 2, criticas: 0, area_afetada: 25 }
      ],
      ocorrenciasRecentes: [
        {
          id: 'PRAGA-001',
          dataRegistro: '2025-08-29T00:00:00',
          responsavel: 'Artur Vidal Dos Santos',
          provincia: 'Luanda',
          municipio: 'Cacuaco',
          tipoProducao: 'Agrícola',
          praga: 'Percevejos',
          culturaAfetada: 'Legumes',
          areaAfetada: 80,
          gravidade: 'moderado',
          status: 'Em Tratamento',
          contacto: '+244 951 956 574',
          custo_estimado: 20000
        },
        {
          id: 'PRAGA-002',
          dataRegistro: '2025-08-28T00:00:00',
          responsavel: 'Regina Altubias',
          provincia: 'Bié',
          municipio: 'Belo Horizonte',
          tipoProducao: 'Pecuária',
          praga: 'Barata',
          culturaAfetada: 'Ovino',
          areaAfetada: 58,
          gravidade: 'grave',
          status: 'Em Tratamento',
          contacto: '+244 932 677 888',
          custo_estimado: 222222
        }
      ],
      climaImpacto: {
        temperatura_media: 26.5,
        umidade_media: 68.2,
        precipitacao_mensal: 145.8,
        condicoes_favoraveis: 'Moderadas'
      }
    };
    setDadosProcessados(dadosExemplo);
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const provincias = [
    'Todas', 'Luanda', 'Benguela', 'Huíla', 'Malanje', 'Huambo', 
    'Bié', 'Cuanza Sul', 'Cunene', 'Cabinda', 'Zaire', 'Uíge'
  ];

  const tiposPraga = [
    'Todas', 'Percevejos', 'Barata', 'Tala', 'Outras'
  ];

  const statusOptions = ['Todos', 'Crítica', 'Em Tratamento', 'Controlada'];

  const getStatusColor = (status) => {
    const colors = {
      'Crítica': 'bg-red-100 text-red-800 border-red-200',
      'Em Tratamento': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Controlada': 'bg-green-100 text-green-800 border-green-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getGravidadeColor = (gravidade) => {
    const colors = {
      'Crítica': 'text-red-600',
      'grave': 'text-red-600',
      'Alta': 'text-orange-600',
      'moderado': 'text-yellow-600',
      'Média': 'text-yellow-600',
      'leve': 'text-green-600',
      'Baixa': 'text-green-600'
    };
    return colors[gravidade] || 'text-gray-600';
  };

  const getTendenciaIcon = (tendencia) => {
    switch (tendencia) {
      case 'up': return <ArrowUp className="w-4 h-4 text-red-500" />;
      case 'down': return <ArrowDown className="w-4 h-4 text-green-500" />;
      default: return <div className="w-4 h-4 bg-gray-400 rounded-full"></div>;
    }
  };

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value?.toString() || '0';
  };

  const formatDate = (dateString) => {
    if (!dateString || dateString === "0001-01-01T00:00:00") return 'N/A';
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando dados de pragas...</p>
          <p className="mt-2 text-sm text-gray-500">Sistema de Monitoramento Integrado</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-lg text-gray-600 mb-2">Erro ao carregar dados</p>
          <p className="text-sm text-gray-500 mb-4">{error}</p>
          <button 
            onClick={fetchDados}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Tentar Novamente
          </button>
          <p className="text-xs text-gray-400 mt-3">Usando dados de exemplo</p>
        </div>
      </div>
    );
  }

  if (!dadosProcessados) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <p className="text-lg text-gray-600">Processando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-full">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-red-100 rounded-lg">
                <Bug className="w-8 h-8 text-red-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Controle de Pragas</h1>
                <p className="text-gray-600">Monitoramento e Controle Integrado de Pragas • SIGAF Angola</p>
                
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-sm text-gray-600">Última Actualização:</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleString('pt-BR')}
                </div>
              </div>
              <button 
                className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <button 
                onClick={fetchDados}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Actualizar
              </button>
            </div>
          </div>

          {/* Filtros */}
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center space-x-2">
                <Filter className="w-5 h-5 text-gray-400" />
                <span className="text-sm font-medium text-gray-700">Filtros:</span>
              </div>
              <select
                value={filtrosProvincia}
                onChange={(e) => setFiltrosProvincia(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {provincias.map(provincia => (
                  <option key={provincia} value={provincia}>{provincia}</option>
                ))}
              </select>
              <select
                value={filtroTipoPraga}
                onChange={(e) => setFiltroTipoPraga(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {tiposPraga.map(tipo => (
                  <option key={tipo} value={tipo}>{tipo}</option>
                ))}
              </select>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-red-500 focus:border-transparent"
              >
                {statusOptions.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <Thermometer className="w-4 h-4" />
                <span>{dadosProcessados.climaImpacto.temperatura_media}°C</span>
                <Droplets className="w-4 h-4 ml-2" />
                <span>{dadosProcessados.climaImpacto.umidade_media}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Cards de Resumo */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +{dadosProcessados.resumoGeral.crescimentoMensal}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosProcessados.resumoGeral.totalOcorrencias.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Total de Ocorrências</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-red-600 font-medium">Críticas</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosProcessados.resumoGeral.ocorrenciasCriticas}
            </h3>
            <p className="text-sm text-gray-600">Ocorrências Críticas</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">
                {dadosProcessados.resumoGeral.taxaControle}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosProcessados.resumoGeral.ocorrenciasControladas}
            </h3>
            <p className="text-sm text-gray-600">Ocorrências Controladas</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Target className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs text-orange-600 font-medium">Hectares</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosProcessados.resumoGeral.areaAfetadaTotal.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Área Total Afectada</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 font-medium">Produtores</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosProcessados.resumoGeral.produtoresAfetados.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Produtores Afectados</p>
          </div>
        </div>

        {/* Gráficos principais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Gráfico de Pizza - Ocorrências por Tipo */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Ocorrências por Tipo de Produção</h2>
              <div className="p-2 bg-blue-50 rounded-lg">
                <Activity className="h-6 w-6 text-blue-500" />
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
                          {`${value} ocorrências`}
                        </text>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                          {`(${(percent * 100).toFixed(1)}%)`}
                        </text>
                      </g>
                    );
                  }}
                  onMouseEnter={(_, index) => setActiveIndexTipo(index)}
                  data={dadosProcessados.ocorrenciasPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosProcessados.ocorrenciasPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center space-x-6 mt-4">
              {dadosProcessados.ocorrenciasPorTipo.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">
                    {entry.name}: {formatNumber(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Gráfico de Pizza - Ocorrências por Província */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Ocorrências por Província</h2>
              <div className="p-2 bg-green-50 rounded-lg">
                <MapPin className="h-6 w-6 text-green-500" />
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
                          {`${value} ocorrências`}
                        </text>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
                          {`(${(percent * 100).toFixed(1)}%)`}
                        </text>
                      </g>
                    );
                  }}
                  onMouseEnter={(_, index) => setActiveIndexProvincia(index)}
                  data={dadosProcessados.ocorrenciasPorProvincia}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosProcessados.ocorrenciasPorProvincia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dadosProcessados.ocorrenciasPorProvincia.map((entry, index) => (
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

        {/* Gráfico de Evolução Mensal */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Evolução Mensal das Ocorrências</h2>
              <div className="p-2 bg-purple-50 rounded-lg">
                <TrendingUp className="h-6 w-6 text-purple-500" />
              </div>
            </div>
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={dadosProcessados.evolucaoMensal}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="mes" />
                <YAxis yAxisId="left" orientation="left" />
                <YAxis yAxisId="right" orientation="right" />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'white',
                    borderRadius: '8px',
                    border: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="ocorrencias" 
                  stroke="#3B82F6" 
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#3B82F6" }}
                  name="Total de Ocorrências"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="controladas" 
                  stroke="#10B981" 
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#10B981" }}
                  name="Controladas"
                />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="criticas" 
                  stroke="#EF4444" 
                  strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#EF4444" }}
                  name="Críticas"
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="area_afetada" 
                  stroke="#F59E0B" 
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  dot={{ r: 3, strokeWidth: 1, fill: "white", stroke: "#F59E0B" }}
                  name="Área Afetada (ha)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Principais Pragas */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Principais Pragas</h2>
            <div className="p-2 bg-red-50 rounded-lg">
              <Bug className="h-6 w-6 text-red-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dadosProcessados.principaisPragas.map((praga, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800">{praga.nome}</h3>
                  {getTendenciaIcon(praga.tendencia)}
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Ocorrências:</span>
                    <span className="font-medium text-gray-800">{praga.ocorrencias}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Gravidade:</span>
                    <span className={`text-sm font-medium ${getGravidadeColor(praga.gravidade)}`}>
                      {praga.gravidade}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Cultura:</span>
                    <span className="text-sm text-gray-800">{praga.cultura_principal}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Mais Afetada:</span>
                    <span className="text-sm text-gray-800">{praga.provincia_mais_afetada}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Impacto:</span>
                    <span className="text-sm font-medium text-red-600">
                      {formatCurrency(praga.impacto_economico)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Ocorrências Recentes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Ocorrências Recentes</h2>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Clock className="h-6 w-6 text-blue-500" />
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                Ver todas <ChevronRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Responsável</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Localização</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Praga</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Área/Animais</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Gravidade</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Estado</th>
                  <th className="text-center py-3 px-4 font-semibold text-gray-700">Custo</th>
                </tr>
              </thead>
              <tbody>
                {dadosProcessados.ocorrenciasRecentes.map((ocorrencia, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {formatDate(ocorrencia.dataRegistro)}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <div>{ocorrencia.responsavel}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <Phone className="w-3 h-3 mr-1" />
                        {ocorrencia.contacto}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {ocorrencia.provincia}, {ocorrencia.municipio}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-1">
                        {ocorrencia.tipoProducao === 'Agrícola' ? 
                          <Wheat className="w-4 h-4 text-green-500" /> :
                          ocorrencia.tipoProducao === 'Pecuária' ?
                          <Heart className="w-4 h-4 text-red-500" /> :
                          <TreePine className="w-4 h-4 text-green-600" />
                        }
                        <span className="text-sm text-gray-600">{ocorrencia.tipoProducao}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <div>{ocorrencia.praga}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {ocorrencia.culturaAfetada}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">
                      {ocorrencia.areaAfetada ? 
                        `${ocorrencia.areaAfetada} ha` : 
                        `${ocorrencia.animaisAfetados || 'N/A'} animais`
                      }
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-sm font-medium ${getGravidadeColor(ocorrencia.gravidade)}`}>
                        {ocorrencia.gravidade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(ocorrencia.status)}`}>
                        {ocorrencia.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 text-center">
                      {formatCurrency(ocorrencia.custo_estimado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-blue-100" />
              <span className="text-blue-100 text-sm">Dias</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{dadosProcessados.resumoGeral.tempoMedioControle}</h3>
            <p className="text-blue-100 text-sm">Tempo Médio de Controle</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-100" />
              <span className="text-green-100 text-sm">Taxa</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{dadosProcessados.resumoGeral.taxaControle}%</h3>
            <p className="text-green-100 text-sm">Taxa de Controle</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Thermometer className="w-8 h-8 text-yellow-100" />
              <span className="text-yellow-100 text-sm">Clima</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{dadosProcessados.climaImpacto.temperatura_media}°C</h3>
            <p className="text-yellow-100 text-sm">Temperatura Média</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Eye className="w-8 h-8 text-purple-100" />
              <span className="text-purple-100 text-sm">Sistema</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">24/7</h3>
            <p className="text-purple-100 text-sm">Monitoramento Ativo</p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>Dashboard desenvolvido para o Sistema de Monitoramento Integrado de Pragas - SIGAF Angola</p>
          <p className="mt-2">© 2025 MwangoBrain - Todos os direitos reservados</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardControlePragas;