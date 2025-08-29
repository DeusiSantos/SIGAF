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

  // Dados aprimorados para a dashboard de pragas
  const dadosPragas = {
    resumoGeral: {
      totalOcorrencias: 2847,
      ocorrenciasAtivas: 612,
      ocorrenciasControladas: 1847,
      ocorrenciasCriticas: 388,
      crescimentoMensal: 12.8,
      areaAfetadaTotal: 28420, // hectares
      produtoresAfetados: 1892,
      taxaControle: 78.5,
      tempoMedioControle: 14.5 // dias
    },

    ocorrenciasPorTipo: [
      { name: 'Agrícola', value: 1756, percentage: 61.7, color: '#10B981' },
      { name: 'Pecuária', value: 712, percentage: 25.0, color: '#F59E0B' },
      { name: 'Florestal', value: 259, percentage: 9.1, color: '#34D399' },
      { name: 'Mista', value: 120, percentage: 4.2, color: '#3B82F6' }
    ],

    ocorrenciasPorStatus: [
      { name: 'Controlada', value: 1847, color: '#10B981' },
      { name: 'Em Tratamento', value: 612, color: '#F59E0B' },
      { name: 'Crítica', value: 388, color: '#EF4444' }
    ],

    // CORRIGIDO: Dados das províncias com cores para o gráfico de pizza
    ocorrenciasPorProvincia: [
      { name: 'Luanda', value: 456, percentage: 16.0, color: '#3B82F6', criticas: 62, controladas: 314 },
      { name: 'Benguela', value: 398, percentage: 14.0, color: '#10B981', criticas: 45, controladas: 296 },
      { name: 'Huíla', value: 367, percentage: 12.9, color: '#F59E0B', criticas: 52, controladas: 267 },
      { name: 'Malanje', value: 334, percentage: 11.7, color: '#EF4444', criticas: 48, controladas: 234 },
      { name: 'Huambo', value: 298, percentage: 10.5, color: '#8B5CF6', criticas: 38, controladas: 198 },
      { name: 'Bié', value: 267, percentage: 9.4, color: '#06B6D4', criticas: 32, controladas: 187 },
      { name: 'Cuanza Sul', value: 234, percentage: 8.2, color: '#84CC16', criticas: 28, controladas: 156 },
      { name: 'Cunene', value: 198, percentage: 7.0, color: '#F97316', criticas: 22, controladas: 134 },
      { name: 'Cabinda', value: 167, percentage: 5.9, color: '#EC4899', criticas: 18, controladas: 112 },
      { name: 'Outras', value: 128, percentage: 4.5, color: '#6B7280', criticas: 15, controladas: 89 }
    ],

    principaisPragas: [
      { 
        nome: 'Lagarta do Cartucho', 
        ocorrencias: 445, 
        gravidade: 'Crítica', 
        tendencia: 'up',
        cultura_principal: 'Milho',
        provincia_mais_afetada: 'Luanda',
        impacto_economico: 2400000 // AOA
      },
      { 
        nome: 'Ferrugem do Café', 
        ocorrencias: 398, 
        gravidade: 'Alta', 
        tendencia: 'up',
        cultura_principal: 'Café',
        provincia_mais_afetada: 'Huíla',
        impacto_economico: 1800000
      },
      { 
        nome: 'Mosca Branca', 
        ocorrencias: 367, 
        gravidade: 'Média', 
        tendencia: 'down',
        cultura_principal: 'Hortícolas',
        provincia_mais_afetada: 'Benguela',
        impacto_economico: 1200000
      },
      { 
        nome: 'Pulgão', 
        ocorrencias: 334, 
        gravidade: 'Baixa', 
        tendencia: 'stable',
        cultura_principal: 'Diversas',
        provincia_mais_afetada: 'Malanje',
        impacto_economico: 890000
      },
      { 
        nome: 'Carrapato Bovino', 
        ocorrencias: 298, 
        gravidade: 'Alta', 
        tendencia: 'up',
        cultura_principal: 'Pecuária',
        provincia_mais_afetada: 'Huambo',
        impacto_economico: 1600000
      },
      { 
        nome: 'Trips', 
        ocorrencias: 267, 
        gravidade: 'Média', 
        tendencia: 'down',
        cultura_principal: 'Flores',
        provincia_mais_afetada: 'Cuanza Sul',
        impacto_economico: 670000
      }
    ],

    evolucaoMensal: [
      { mes: 'Jan', ocorrencias: 189, controladas: 142, criticas: 47, area_afetada: 2340 },
      { mes: 'Fev', ocorrencias: 195, controladas: 148, criticas: 47, area_afetada: 2890 },
      { mes: 'Mar', ocorrencias: 212, controladas: 167, criticas: 45, area_afetada: 3120 },
      { mes: 'Abr', ocorrencias: 234, controladas: 189, criticas: 45, area_afetada: 3450 },
      { mes: 'Mai', ocorrencias: 256, controladas: 201, criticas: 55, area_afetada: 3780 },
      { mes: 'Jun', ocorrencias: 278, controladas: 223, criticas: 55, area_afetada: 4120 },
      { mes: 'Jul', ocorrencias: 298, controladas: 245, criticas: 53, area_afetada: 4560 },
      { mes: 'Ago', ocorrencias: 312, controladas: 267, criticas: 45, area_afetada: 4890 },
      { mes: 'Set', ocorrencias: 289, controladas: 234, criticas: 55, area_afetada: 4560 },
      { mes: 'Out', ocorrencias: 267, controladas: 212, criticas: 55, area_afetada: 4230 },
      { mes: 'Nov', ocorrencias: 245, controladas: 198, criticas: 47, area_afetada: 3890 },
      { mes: 'Dez', ocorrencias: 223, controladas: 189, criticas: 34, area_afetada: 3450 }
    ],

    ocorrenciasRecentes: [
      {
        id: 'PRAGA-2024-001',
        dataRegistro: '2024-07-15',
        responsavel: 'João Manuel Silva Santos',
        provincia: 'Luanda',
        municipio: 'Viana',
        tipoProducao: 'Agrícola',
        praga: 'Lagarta do Cartucho',
        culturaAfetada: 'Milho',
        areaAfetada: 8.5,
        gravidade: 'Crítica',
        status: 'Em Tratamento',
        necessitaApoio: true,
        contacto: '+244 923 456 789',
        tratamento_aplicado: 'Inseticida Biológico',
        custo_estimado: 350000
      },
      {
        id: 'PRAGA-2024-002',
        dataRegistro: '2024-07-14',
        responsavel: 'Maria Fernanda Costa Domingos',
        provincia: 'Benguela',
        municipio: 'Lobito',
        tipoProducao: 'Pecuária',
        praga: 'Carrapato Bovino',
        especieAfetada: 'Bovinos',
        animaisAfetados: 45,
        gravidade: 'Alta',
        status: 'Controlada',
        necessitaApoio: false,
        contacto: '+244 924 567 890',
        tratamento_aplicado: 'Banho Carrapaticida',
        custo_estimado: 280000
      },
      {
        id: 'PRAGA-2024-003',
        dataRegistro: '2024-07-13',
        responsavel: 'António Sebastião Mbemba',
        provincia: 'Huíla',
        municipio: 'Lubango',
        tipoProducao: 'Agrícola',
        praga: 'Ferrugem do Café',
        culturaAfetada: 'Café',
        areaAfetada: 18.7,
        gravidade: 'Crítica',
        status: 'Crítica',
        necessitaApoio: true,
        contacto: '+244 925 678 901',
        tratamento_aplicado: 'Fungicida Sistêmico',
        custo_estimado: 560000
      },
      {
        id: 'PRAGA-2024-004',
        dataRegistro: '2024-07-12',
        responsavel: 'Isabel Domingos Kiala',
        provincia: 'Malanje',
        municipio: 'Malanje',
        tipoProducao: 'Mista',
        praga: 'Mosca Branca',
        culturaAfetada: 'Hortícolas',
        areaAfetada: 5.2,
        gravidade: 'Média',
        status: 'Em Tratamento',
        necessitaApoio: false,
        contacto: '+244 926 789 012',
        tratamento_aplicado: 'Controle Integrado',
        custo_estimado: 180000
      },
      {
        id: 'PRAGA-2024-005',
        dataRegistro: '2024-07-11',
        responsavel: 'Carlos Alberto Tchimboto',
        provincia: 'Huambo',
        municipio: 'Huambo',
        tipoProducao: 'Florestal',
        praga: 'Besouro da Casca',
        culturaAfetada: 'Eucalipto',
        areaAfetada: 12.3,
        gravidade: 'Alta',
        status: 'Em Tratamento',
        necessitaApoio: true,
        contacto: '+244 927 890 123',
        tratamento_aplicado: 'Inseticida Sistêmico',
        custo_estimado: 420000
      },
      {
        id: 'PRAGA-2024-006',
        dataRegistro: '2024-07-10',
        responsavel: 'Esperança Miguel Kiala',
        provincia: 'Cuanza Sul',
        municipio: 'Sumbe',
        tipoProducao: 'Agrícola',
        praga: 'Trips',
        culturaAfetada: 'Flores',
        areaAfetada: 2.8,
        gravidade: 'Baixa',
        status: 'Controlada',
        necessitaApoio: false,
        contacto: '+244 928 901 234',
        tratamento_aplicado: 'Controle Biológico',
        custo_estimado: 95000
      }
    ],

    climaImpacto: {
      temperatura_media: 26.5,
      umidade_media: 68.2,
      precipitacao_mensal: 145.8,
      condicoes_favoraveis: 'Moderadas'
    }
  };

  const provincias = [
    'Todas', 'Luanda', 'Benguela', 'Huíla', 'Malanje', 'Huambo', 
    'Bié', 'Cuanza Sul', 'Cunene', 'Cabinda', 'Zaire', 'Uíge'
  ];

  const tiposPraga = [
    'Todas', 'Lagarta do Cartucho', 'Ferrugem do Café', 'Mosca Branca', 
    'Pulgão', 'Carrapato Bovino', 'Trips', 'Outras'
  ];

  const statusOptions = ['Todos', 'Crítica', 'Em Tratamento', 'Controlada'];

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

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
      'Alta': 'text-orange-600',
      'Média': 'text-yellow-600',
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
    return value.toString();
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

  return (
    <div className="min-h-screen ">
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
                <p className="text-gray-600">Monitoramento e Controle Integrado de Pragas • RNPA Angola</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <div className="bg-white rounded-lg p-3 border border-gray-200">
                <div className="text-sm text-gray-600">Última Actualização:</div>
                <div className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleString('pt-BR')}
                </div>
              </div>
              <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Exportar
              </button>
              <button className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
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
                <span>{dadosPragas.climaImpacto.temperatura_media}°C</span>
                <Droplets className="w-4 h-4 ml-2" />
                <span>{dadosPragas.climaImpacto.umidade_media}%</span>
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
                +{dadosPragas.resumoGeral.crescimentoMensal}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosPragas.resumoGeral.totalOcorrencias.toLocaleString()}
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
              {dadosPragas.resumoGeral.ocorrenciasCriticas}
            </h3>
            <p className="text-sm text-gray-600">Ocorrências de Críticas</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-medium">
                {dadosPragas.resumoGeral.taxaControle}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosPragas.resumoGeral.ocorrenciasControladas}
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
              {dadosPragas.resumoGeral.areaAfetadaTotal.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Total de Área Afetadas </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 font-medium">Produtores</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosPragas.resumoGeral.produtoresAfetados.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Produtores Afetados</p>
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
                  data={dadosPragas.ocorrenciasPorTipo}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPragas.ocorrenciasPorTipo.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="flex justify-center space-x-6 mt-4">
              {dadosPragas.ocorrenciasPorTipo.map((entry, index) => (
                <div key={index} className="flex items-center">
                  <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: entry.color }}></div>
                  <span className="text-sm text-gray-600">
                    {entry.name}: {formatNumber(entry.value)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* CORRIGIDO: Gráfico de Pizza - Ocorrências por Província */}
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
                  data={dadosPragas.ocorrenciasPorProvincia}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  innerRadius={60}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dadosPragas.ocorrenciasPorProvincia.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            
            <div className="grid grid-cols-2 gap-2 mt-4">
              {dadosPragas.ocorrenciasPorProvincia.map((entry, index) => (
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
              <LineChart data={dadosPragas.evolucaoMensal}>
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
            {dadosPragas.principaisPragas.map((praga, index) => (
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
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
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
                <tr className="border-b border-gray-200 ">
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
                {dadosPragas.ocorrenciasRecentes.map((ocorrencia, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600 text-left">
                      {new Date(ocorrencia.dataRegistro).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800 text-left">
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
                    <td className="py-3 px-4 text-sm text-gray-800 text-left">
                      <div>{ocorrencia.praga}</div>
                      <div className="text-xs text-gray-500 mt-1">
                        {ocorrencia.culturaAfetada || ocorrencia.especieAfetada}
                      </div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {ocorrencia.areaAfetada ? 
                        `${ocorrencia.areaAfetada} ha` : 
                        `${ocorrencia.animaisAfetados} animais`
                      }
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-sm font-medium ${getGravidadeColor(ocorrencia.gravidade)}`}>
                        {ocorrencia.gravidade}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(ocorrencia.status)}`}>
                        {ocorrencia.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
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
            <h3 className="text-2xl font-bold mb-1">{dadosPragas.resumoGeral.tempoMedioControle}</h3>
            <p className="text-blue-100 text-sm">Tempo Médio de Controle</p>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-100" />
              <span className="text-green-100 text-sm">Taxa</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{dadosPragas.resumoGeral.taxaControle}%</h3>
            <p className="text-green-100 text-sm">Taxa de Controle</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Thermometer className="w-8 h-8 text-yellow-100" />
              <span className="text-yellow-100 text-sm">Clima</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">{dadosPragas.climaImpacto.temperatura_media}°C</h3>
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
      </div>
    </div>
  );
};

export default DashboardControlePragas;