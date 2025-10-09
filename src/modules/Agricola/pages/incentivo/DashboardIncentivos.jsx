import React, { useState, useEffect, useMemo } from 'react';
import {
  PieChart, Pie, LineChart, Line, XAxis, YAxis, BarChart, Bar,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, Sector, Area, AreaChart
} from 'recharts';
import {
  ArrowUp, ArrowDown, DollarSign, Package, TrendingUp, Activity, Users,
  MapPin, Calendar, Calculator, Award, FileText, AlertCircle, CheckCircle,
  Clock, Target, Percent, CreditCard, RotateCcw, Eye, Filter, Download,
  RefreshCw, Building, Wheat, Tractor, Home, Phone, Mail, User
} from 'lucide-react';

const DashboardIncentivos = () => {
  const [activeIndexTipo, setActiveIndexTipo] = useState(0);
  const [activeIndexStatus, setActiveIndexStatus] = useState(0);
  const [activeIndexProvincia, setActiveIndexProvincia] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtroTempo, setFiltroTempo] = useState('12m');
  const [filtroTipo, setFiltroTipo] = useState('TODOS');
  const [filtroStatus, setFiltroStatus] = useState('TODOS');

  // Dados completos dos incentivos
  const dadosIncentivos = {
    estatisticasGerais: {
      totalIncentivos: 3247,
      incentivosAtivos: 2456,
      incentivosVencidos: 234,
      incentivosProcessando: 557,
      valorTotalDistribuido: 1247500000, // AOA
      valorTotalReembolsado: 156780000, // AOA
      beneficiariosAtivos: 18943,
      reembolsosProcessados: 1234,
      taxaReembolso: 12.6, // %
      mediaValorPorBeneficiario: 65800,
      crescimentoMensal: 15.8,
      areaTotalBeneficiada: 45670 // hectares
    },

    // Tipos de incentivos
    incentivoPorTipo: [
      { name: 'Dinheiro', value: 1947, percentage: 60.0, color: '#10B981' },
      { name: 'Produto', value: 1300, percentage: 40.0, color: '#3B82F6' }
    ],

    // Status dos incentivos
    incentivoPorStatus: [
      { name: 'Activo', value: 2456, color: '#10B981' },
      { name: 'Processando', value: 557, color: '#F59E0B' },
      { name: 'Vencido', value: 234, color: '#EF4444' }
    ],

    // Distribuição por província
    incentivoPorProvincia: [
      { name: 'Luanda', value: 567, percentage: 17.5, color: '#3B82F6', reembolsos: 89, beneficiarios: 3456 },
      { name: 'Benguela', value: 445, percentage: 13.7, color: '#10B981', reembolsos: 67, beneficiarios: 2890 },
      { name: 'Huíla', value: 398, percentage: 12.3, color: '#F59E0B', reembolsos: 78, beneficiarios: 2567 },
      { name: 'Malanje', value: 356, percentage: 11.0, color: '#EF4444', reembolsos: 45, beneficiarios: 2234 },
      { name: 'Huambo', value: 334, percentage: 10.3, color: '#8B5CF6', reembolsos: 56, beneficiarios: 2123 },
      { name: 'Bié', value: 289, percentage: 8.9, color: '#06B6D4', reembolsos: 34, beneficiarios: 1890 },
      { name: 'Cuanza Sul', value: 267, percentage: 8.2, color: '#84CC16', reembolsos: 41, beneficiarios: 1567 },
      { name: 'Cunene', value: 234, percentage: 7.2, color: '#F97316', reembolsos: 28, beneficiarios: 1345 },
      { name: 'Cabinda', value: 189, percentage: 5.8, color: '#EC4899', reembolsos: 23, beneficiarios: 1123 },
      { name: 'Outras', value: 168, percentage: 5.2, color: '#6B7280', reembolsos: 19, beneficiarios: 998 }
    ],

    // Evolução mensal
    evolucaoMensal: [
      { 
        mes: 'Jan', 
        incentivos: 234, 
        valorDistribuido: 89500000, 
        reembolsos: 89, 
        valorReembolsado: 12300000,
        beneficiarios: 1456
      },
      { 
        mes: 'Fev', 
        incentivos: 267, 
        valorDistribuido: 98700000, 
        reembolsos: 95, 
        valorReembolsado: 13500000,
        beneficiarios: 1678
      },
      { 
        mes: 'Mar', 
        incentivos: 298, 
        valorDistribuido: 112300000, 
        reembolsos: 112, 
        valorReembolsado: 15600000,
        beneficiarios: 1890
      },
      { 
        mes: 'Abr', 
        incentivos: 323, 
        valorDistribuido: 123400000, 
        reembolsos: 98, 
        valorReembolsado: 14200000,
        beneficiarios: 2045
      },
      { 
        mes: 'Mai', 
        incentivos: 345, 
        valorDistribuido: 134500000, 
        reembolsos: 123, 
        valorReembolsado: 16800000,
        beneficiarios: 2234
      },
      { 
        mes: 'Jun', 
        incentivos: 367, 
        valorDistribuido: 145600000, 
        reembolsos: 134, 
        valorReembolsado: 18900000,
        beneficiarios: 2456
      },
      { 
        mes: 'Jul', 
        incentivos: 389, 
        valorDistribuido: 156700000, 
        reembolsos: 145, 
        valorReembolsado: 20100000,
        beneficiarios: 2678
      },
      { 
        mes: 'Ago', 
        incentivos: 412, 
        valorDistribuido: 167800000, 
        reembolsos: 156, 
        valorReembolsado: 21300000,
        beneficiarios: 2890
      },
      { 
        mes: 'Set', 
        incentivos: 445, 
        valorDistribuido: 178900000, 
        reembolsos: 167, 
        valorReembolsado: 22500000,
        beneficiarios: 3123
      },
      { 
        mes: 'Out', 
        incentivos: 478, 
        valorDistribuido: 189000000, 
        reembolsos: 178, 
        valorReembolsado: 23700000,
        beneficiarios: 3345
      },
      { 
        mes: 'Nov', 
        incentivos: 501, 
        valorDistribuido: 198100000, 
        reembolsos: 189, 
        valorReembolsado: 24900000,
        beneficiarios: 3567
      },
      { 
        mes: 'Dez', 
        incentivos: 534, 
        valorDistribuido: 207200000, 
        reembolsos: 201, 
        valorReembolsado: 26100000,
        beneficiarios: 3789
      }
    ],

    // Principais incentivos
    principaisIncentivos: [
      {
        nome: 'Programa de Apoio ao Milho',
        tipo: 'DINHEIRO',
        beneficiarios: 2345,
        valorTotal: 456700000,
        valorMedioPorBeneficiario: 194700,
        provincia: 'Luanda',
        status: 'ATIVO',
        reembolsos: 234,
        taxaReembolso: 10.0,
        dataInicio: '2024-01-15',
        dataVencimento: '2024-12-31'
      },
      {
        nome: 'Kit Sementes Melhoradas',
        tipo: 'PRODUTO',
        beneficiarios: 1890,
        valorTotal: 234500000,
        valorMedioPorBeneficiario: 124100,
        provincia: 'Benguela',
        status: 'ATIVO',
        reembolsos: 189,
        taxaReembolso: 10.0,
        dataInicio: '2024-02-01',
        dataVencimento: '2024-11-30'
      },
      {
        nome: 'Apoio Financeiro Pecuária',
        tipo: 'DINHEIRO',
        beneficiarios: 1567,
        valorTotal: 345600000,
        valorMedioPorBeneficiario: 220500,
        provincia: 'Huíla',
        status: 'ATIVO',
        reembolsos: 156,
        taxaReembolso: 10.0,
        dataInicio: '2024-03-01',
        dataVencimento: '2024-10-31'
      },
      {
        nome: 'Programa Café Premium',
        tipo: 'PRODUTO',
        beneficiarios: 1234,
        valorTotal: 189000000,
        valorMedioPorBeneficiario: 153200,
        provincia: 'Huambo',
        status: 'PROCESSANDO',
        reembolsos: 123,
        taxaReembolso: 10.0,
        dataInicio: '2024-04-01',
        dataVencimento: '2024-12-15'
      },
      {
        nome: 'Fertilizantes NPK',
        tipo: 'PRODUTO',
        beneficiarios: 2123,
        valorTotal: 298700000,
        valorMedioPorBeneficiario: 140700,
        provincia: 'Malanje',
        status: 'ATIVO',
        reembolsos: 212,
        taxaReembolso: 10.0,
        dataInicio: '2024-05-01',
        dataVencimento: '2024-11-15'
      }
    ],

    // Formas de pagamento
    formasPagamento: [
      { name: 'Transferência Bancária', value: 1890, percentage: 58.2, color: '#3B82F6' },
      { name: 'Pagamento Numerário', value: 1123, percentage: 34.6, color: '#10B981' },
      { name: 'Entrega Física', value: 234, percentage: 7.2, color: '#F59E0B' }
    ],

    // Reembolsos recentes
    reembolsosRecentes: [
      {
        id: 'REEMB-2024-001',
        produtor: 'João Manuel Silva Santos',
        incentivo: 'Kit Sementes de Milho',
        tipoIncentivo: 'PRODUTO',
        valorOriginal: 125000,
        valorReembolsado: 100000,
        percentualReembolso: 80,
        motivo: 'Produto com defeito',
        dataReembolso: '2024-12-10',
        provincia: 'Luanda',
        status: 'PROCESSADO'
      },
      {
        id: 'REEMB-2024-002',
        produtor: 'Maria Isabel Fernandes',
        incentivo: 'Apoio Financeiro Agricultura',
        tipoIncentivo: 'DINHEIRO',
        valorOriginal: 75000,
        valorReembolsado: 52500,
        percentualReembolso: 70,
        motivo: 'Não utilização completa',
        dataReembolso: '2024-12-09',
        provincia: 'Benguela',
        status: 'PROCESSADO'
      },
      {
        id: 'REEMB-2024-003',
        produtor: 'António Sebastião Mbemba',
        incentivo: 'Fertilizante NPK',
        tipoIncentivo: 'PRODUTO',
        valorOriginal: 85000,
        valorReembolsado: 76500,
        percentualReembolso: 90,
        motivo: 'Produto vencido',
        dataReembolso: '2024-12-08',
        provincia: 'Huíla',
        status: 'PROCESSADO'
      },
      {
        id: 'REEMB-2024-004',
        produtor: 'Isabel Domingos Kiala',
        incentivo: 'Programa Café Premium',
        tipoIncentivo: 'PRODUTO',
        valorOriginal: 45000,
        valorReembolsado: 36000,
        percentualReembolso: 80,
        motivo: 'Não adequado para região',
        dataReembolso: '2024-12-07',
        provincia: 'Malanje',
        status: 'PROCESSADO'
      },
      {
        id: 'REEMB-2024-005',
        produtor: 'Carlos Alberto Tchimboto',
        incentivo: 'Apoio Pecuária',
        tipoIncentivo: 'DINHEIRO',
        valorOriginal: 120000,
        valorReembolsado: 72000,
        percentualReembolso: 60,
        motivo: 'Mudança de atividade',
        dataReembolso: '2024-12-06',
        provincia: 'Huambo',
        status: 'PROCESSADO'
      }
    ]
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatNumber = (value) => {
    if (value >= 1000000) {
      return `${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
      return `${(value / 1000).toFixed(1)}K`;
    }
    return value.toString();
  };

  const getStatusColor = (status) => {
    const colors = {
      'ATIVO': 'bg-green-100 text-green-800 border-green-200',
      'PROCESSANDO': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'VENCIDO': 'bg-red-100 text-red-800 border-red-200',
      'PROCESSADO': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getTipoIcon = (tipo) => {
    switch (tipo) {
      case 'DINHEIRO':
        return <DollarSign className="w-5 h-5" />;
      case 'PRODUTO':
        return <Package className="w-5 h-5" />;
      default:
        return <Award className="w-5 h-5" />;
    }
  };

  const getTipoColor = (tipo) => {
    const colors = {
      'DINHEIRO': 'bg-green-100 text-green-800 border-green-200',
      'PRODUTO': 'bg-blue-100 text-blue-800 border-blue-200'
    };
    return colors[tipo] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-lg text-gray-600">Carregando dados dos incentivos...</p>
          <p className="mt-2 text-sm text-gray-500">Sistema de Gestão de Incentivos Agrícolas</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-full px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-green-100 rounded-lg">
                <Award className="w-8 h-8 text-green-600" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard de Incentivos</h1>
                <p className="text-gray-600">Sistema Nacional de Incentivos Agrícolas • RNPA Angola</p>
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
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
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
                value={filtroTempo}
                onChange={(e) => setFiltroTempo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="1m">Último mês</option>
                <option value="3m">Últimos 3 meses</option>
                <option value="6m">Últimos 6 meses</option>
                <option value="12m">Último ano</option>
              </select>
              <select
                value={filtroTipo}
                onChange={(e) => setFiltroTipo(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="TODOS">Todos os tipos</option>
                <option value="DINHEIRO">Dinheiro</option>
                <option value="PRODUTO">Produto</option>
              </select>
              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="TODOS">Todos os estados</option>
                <option value="ATIVO">Activo</option>
                <option value="PROCESSANDO">Processando</option>
                <option value="VENCIDO">Vencido</option>
              </select>
            </div>
          </div>
        </div>

        {/* Cards de Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-50 rounded-lg">
                <Award className="w-6 h-6 text-green-600" />
              </div>
              <span className="text-xs text-green-600 font-medium flex items-center">
                <ArrowUp className="w-3 h-3 mr-1" />
                +{dadosIncentivos.estatisticasGerais.crescimentoMensal}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosIncentivos.estatisticasGerais.totalIncentivos.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Total de Incentivos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-50 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <span className="text-xs text-blue-600 font-medium">Distribuído</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(dadosIncentivos.estatisticasGerais.valorTotalDistribuido)}
            </h3>
            <p className="text-sm text-gray-600">Valor Total Distribuído</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <span className="text-xs text-purple-600 font-medium">Activos</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {dadosIncentivos.estatisticasGerais.beneficiariosAtivos.toLocaleString()}
            </h3>
            <p className="text-sm text-gray-600">Beneficiários Activos</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-red-50 rounded-lg">
                <RotateCcw className="w-6 h-6 text-red-600" />
              </div>
              <span className="text-xs text-red-600 font-medium">
                {dadosIncentivos.estatisticasGerais.taxaReembolso}%
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(dadosIncentivos.estatisticasGerais.valorTotalReembolsado)}
            </h3>
            <p className="text-sm text-gray-600">Valor Reembolsado</p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <Calculator className="w-6 h-6 text-yellow-600" />
              </div>
              <span className="text-xs text-yellow-600 font-medium">Média</span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {formatCurrency(dadosIncentivos.estatisticasGerais.mediaValorPorBeneficiario)}
            </h3>
            <p className="text-sm text-gray-600">Valor por Beneficiário</p>
          </div>
        </div>

        {/* Gráficos Principais */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          {/* Gráfico de Pizza - Incentivos por Tipo */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
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
                          {`${value} incentivos`}
                        </text>
                        <text x={ex + (cos >= 0 ? 1 : -1) * 12} y={ey} dy={18} textAnchor={textAnchor} fill="#999">
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
          </div>

          {/* Gráfico de Pizza - Status dos Incentivos */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800">Estados dos Incentivos</h2>
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
                  onMouseEnter={(_, index) => setActiveIndexStatus(index)}
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
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex justify-between items-center mb-6">
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
                          {`${value} incentivos`}
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

        {/* Evolução Temporal */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Evolução Mensal de Incentivos e Reembolsos</h2>
            <div className="p-2 bg-green-50 rounded-lg">
              <TrendingUp className="h-6 w-6 text-green-500" />
            </div>
          </div>
          
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={dadosIncentivos.evolucaoMensal}>
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
                formatter={(value, name) => {
                  if (name.includes('valor')) {
                    return [formatCurrency(value), name];
                  }
                  return [value, name];
                }}
              />
              <Legend />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="incentivos" 
                stroke="#10B981" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#10B981" }}
                name="Incentivos Cadastrados"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="reembolsos" 
                stroke="#EF4444" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#EF4444" }}
                name="Reembolsos Processados"
              />
              <Line 
                yAxisId="left"
                type="monotone" 
                dataKey="beneficiarios" 
                stroke="#3B82F6" 
                strokeWidth={3}
                dot={{ r: 5, strokeWidth: 2, fill: "white", stroke: "#3B82F6" }}
                name="Beneficiários"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Principais Incentivos */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Principais Programas de Incentivos</h2>
            <div className="p-2 bg-blue-50 rounded-lg">
              <FileText className="h-6 w-6 text-blue-500" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {dadosIncentivos.principaisIncentivos.map((incentivo, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${incentivo.tipo === 'DINHEIRO' ? 'bg-green-100' : 'bg-blue-100'}`}>
                      {getTipoIcon(incentivo.tipo)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">{incentivo.nome}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(incentivo.status)}`}>
                        {incentivo.status}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Beneficiários:</span>
                    <span className="font-medium text-gray-800">{incentivo.beneficiarios.toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Total:</span>
                    <span className="font-medium text-gray-800">{formatCurrency(incentivo.valorTotal)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Valor Médio:</span>
                    <span className="font-medium text-gray-800">{formatCurrency(incentivo.valorMedioPorBeneficiario)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Província:</span>
                    <span className="font-medium text-gray-800">{incentivo.provincia}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Reembolsos:</span>
                    <span className="font-medium text-red-600">{incentivo.reembolsos} ({incentivo.taxaReembolso}%)</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Vencimento:</span>
                    <span className="font-medium text-gray-800">
                      {new Date(incentivo.dataVencimento).toLocaleDateString('pt-BR')}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Reembolsos Recentes */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Reembolsos Recentes</h2>
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-red-50 rounded-lg">
                <RotateCcw className="h-6 w-6 text-red-500" />
              </div>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center">
                Ver todos <Eye className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">ID</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Produtor</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Incentivo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Tipo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor Original</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Valor Reembolsado</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">%</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Motivo</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Data</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                {dadosIncentivos.reembolsosRecentes.map((reembolso, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm font-mono text-blue-600">{reembolso.id}</td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      <div>{reembolso.produtor}</div>
                      <div className="text-xs text-gray-500">{reembolso.provincia}</div>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">{reembolso.incentivo}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getTipoColor(reembolso.tipoIncentivo)}`}>
                        {reembolso.tipoIncentivo}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-700">
                      {formatCurrency(reembolso.valorOriginal)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-red-600">
                      {formatCurrency(reembolso.valorReembolsado)}
                    </td>
                    <td className="py-3 px-4 text-sm font-medium text-red-600">
                      {reembolso.percentualReembolso}%
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">{reembolso.motivo}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(reembolso.dataReembolso).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(reembolso.status)}`}>
                        {reembolso.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Estatísticas Adicionais */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Target className="w-8 h-8 text-green-100" />
              <span className="text-green-100 text-sm">Hectares</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {dadosIncentivos.estatisticasGerais.areaTotalBeneficiada.toLocaleString()}
            </h3>
            <p className="text-green-100 text-sm">Área Total Beneficiada</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Percent className="w-8 h-8 text-blue-100" />
              <span className="text-blue-100 text-sm">Taxa</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {dadosIncentivos.estatisticasGerais.taxaReembolso}%
            </h3>
            <p className="text-blue-100 text-sm">Taxa de Reembolso</p>
          </div>

          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Clock className="w-8 h-8 text-purple-100" />
              <span className="text-purple-100 text-sm">Processados</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              {dadosIncentivos.estatisticasGerais.reembolsosProcessados}
            </h3>
            <p className="text-purple-100 text-sm">Reembolsos Processados</p>
          </div>

          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <Activity className="w-8 h-8 text-yellow-100" />
              <span className="text-yellow-100 text-sm">Crescimento</span>
            </div>
            <h3 className="text-2xl font-bold mb-1">
              +{dadosIncentivos.estatisticasGerais.crescimentoMensal}%
            </h3>
            <p className="text-yellow-100 text-sm">Crescimento Mensal</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardIncentivos;