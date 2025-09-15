import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  User,
  Building,
  Droplets,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
  Search,
  Plus,
  Trash2,
  Award,
  Eye,
  Upload,
  DollarSign,
  Scale,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
  CreditCard,
  Phone,
  Filter,
  Download,
  X,
  AlertTriangle,
  Activity,
  Clock,
  Settings,
  Target,
  Wrench,
  Thermometer,
  Zap,
  Users
} from 'lucide-react';

const CustomInput = ({ type, label, value, onChange, options, required, errorMessage, disabled, placeholder, iconStart, helperText, rows, ...props }) => {
  const baseInputClasses = `w-full p-3 border rounded-xl transition-all ${errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-cyan-500'
    } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-cyan-200`;

  const renderInput = () => {
    switch (type) {
      case 'select':
        return (
          <select
            className={baseInputClasses}
            value={typeof value === 'object' ? value?.value || '' : value || ''}
            onChange={(e) => onChange(e.target.value)}
            disabled={disabled}
            {...props}
          >
            <option value="">{placeholder || 'Selecione...'}</option>
            {options?.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );
      case 'textarea':
        return (
          <textarea
            className={baseInputClasses}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows || 3}
            {...props}
          />
        );
      case 'file':
        return (
          <input
            type="file"
            className={baseInputClasses}
            onChange={(e) => onChange(e.target.files[0])}
            disabled={disabled}
            accept="image/*,.pdf,.doc,.docx"
            {...props}
          />
        );
      default:
        return (
          <input
            type={type}
            className={baseInputClasses}
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
            {...props}
          />
        );
    }
  };

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {iconStart && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {iconStart}
          </div>
        )}
        <div className={iconStart ? 'pl-10' : ''}>
          {renderInput()}
        </div>
      </div>
      {helperText && <p className="mt-1 text-sm text-gray-500">{helperText}</p>}
      {errorMessage && (
        <p className="mt-1 text-sm text-red-600 flex items-center">
          <AlertCircle size={16} className="mr-1" />
          {errorMessage}
        </p>
      )}
    </div>
  );
};

const GestaoSistemasIrrigacao = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
  const containerRef = useRef(null);

  // Dados mock para sistemas de irrigação
  const [sistemasIrrigacao, setSistemasIrrigacao] = useState([
    {
      id: 1,
      codigoSistema: 'SIR-2024-001',
      nomeProjeto: 'Sistema de Irrigação Cacuaco Norte',
      localizacao: {
        provincia: 'LUANDA',
        municipio: 'CACUACO',
        aldeia: 'Funda',
        coordenadas: '-8.7832, 13.3432'
      },
      fonteAgua: 'Rio Bengo',
      areaIrrigada: 25.5,
      numeroFamiliasAtendidas: 45,
      culturasPrincipais: ['Milho', 'Feijão', 'Hortaliças'],
      tipoIrrigacao: 'GOTEJAMENTO',
      statusSistema: 'ACTIVO',
      dataInstalacao: '2024-01-15',
      dataUltimaManutencao: '2024-08-20',
      proximaManutencao: '2024-11-20',
      custoInstalacao: 850000,
      custoManutencaoMensal: 35000,
      responsavelTecnico: {
        nome: 'Eng. Carlos Mendes',
        telefone: '923456789',
        instituicao: 'MINAGRIF'
      },
      cooperativaVinculada: 'Cooperativa Agrícola do Cacuaco',
      eficienciaHidrica: 85,
      producaoAnual: 12.8,
      observacoes: 'Sistema funcionando adequadamente. Produtores satisfeitos com os resultados.',
      problemasRecentes: [],
      documentosAnexados: ['projeto_tecnico.pdf', 'licenca_agua.pdf', 'manual_operacao.pdf']
    },
    {
      id: 2,
      codigoSistema: 'SIR-2024-002',
      nomeProjeto: 'Irrigação Comunitária Benguela Sul',
      localizacao: {
        provincia: 'BENGUELA',
        municipio: 'BENGUELA',
        aldeia: 'Cavaco',
        coordenadas: '-12.3532, 13.5356'
      },
      fonteAgua: 'Poço Artesiano',
      areaIrrigada: 18.2,
      numeroFamiliasAtendidas: 32,
      culturasPrincipais: ['Tomate', 'Cebola', 'Pimentão'],
      tipoIrrigacao: 'ASPERSAO',
      statusSistema: 'MANUTENCAO',
      dataInstalacao: '2023-11-08',
      dataUltimaManutencao: '2024-08-15',
      proximaManutencao: '2024-09-10',
      custoInstalacao: 620000,
      custoManutencaoMensal: 28000,
      responsavelTecnico: {
        nome: 'Eng. Ana Cristina',
        telefone: '924567890',
        instituicao: 'ADMIN_MUNICIPAL'
      },
      cooperativaVinculada: 'Associação de Produtores de Benguela',
      eficienciaHidrica: 78,
      producaoAnual: 9.5,
      observacoes: 'Sistema em manutenção preventiva. Substituição de equipamentos de bombeamento.',
      problemasRecentes: ['Falha no sistema de bombeamento', 'Entupimento em alguns aspersores'],
      documentosAnexados: ['relatorio_manutencao.pdf', 'orcamento_pecas.xlsx']
    },
    {
      id: 3,
      codigoSistema: 'SIR-2024-003',
      nomeProjeto: 'Sistema Irrigação Huíla Centro',
      localizacao: {
        provincia: 'HUILA',
        municipio: 'LUBANGO',
        aldeia: 'Hoque',
        coordenadas: '-14.9167, 13.4833'
      },
      fonteAgua: 'Barragem Matala',
      areaIrrigada: 42.8,
      numeroFamiliasAtendidas: 78,
      culturasPrincipais: ['Milho', 'Feijão', 'Batata-doce'],
      tipoIrrigacao: 'SUPERFICIE',
      statusSistema: 'INATIVO',
      dataInstalacao: '2023-08-22',
      dataUltimaManutencao: '2024-07-10',
      proximaManutencao: '2024-10-05',
      custoInstalacao: 1200000,
      custoManutencaoMensal: 45000,
      responsavelTecnico: {
        nome: 'Técn. João Baptista',
        telefone: '925678901',
        instituicao: 'DNF'
      },
      cooperativaVinculada: 'Cooperativa do Planalto Central',
      eficienciaHidrica: 65,
      producaoAnual: 18.3,
      observacoes: 'Sistema temporariamente inativo devido a problemas no canal principal de distribuição.',
      problemasRecentes: ['Erosão no canal principal', 'Necessidade de limpeza geral', 'Reparação de comportas'],
      documentosAnexados: ['diagnostico_problemas.pdf', 'plano_recuperacao.pdf']
    }
  ]);

  // Função para mostrar toast
  const showToast = (type, title, message, duration = 5000) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    setToastMessage({ type, title, message });

    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, duration);

    setToastTimeout(timeout);
  };

  // Limpar timeout
  useEffect(() => {
    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [toastTimeout]);

  // Filtragem dos registros
  const filteredRecords = useMemo(() => {
    return sistemasIrrigacao.filter(record => {
      const matchesSearch =
        record.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.codigoSistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.cooperativaVinculada.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.responsavelTecnico.nome.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = !selectedTipo || record.tipoIrrigacao === selectedTipo;
      const matchesStatus = !selectedStatus || record.statusSistema === selectedStatus;

      return matchesSearch && matchesTipo && matchesStatus;
    });
  }, [sistemasIrrigacao, searchTerm, selectedTipo, selectedStatus]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedTipo, selectedStatus]);

  // Paginação
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecords.slice(startIndex, endIndex);
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'N/A';
    }
  };

  // Formatar valor monetário
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-AO', {
      style: 'currency',
      currency: 'AOA',
      minimumFractionDigits: 0
    }).format(value);
  };

  // Labels para tipos de irrigação
  const getTipoIrrigacaoLabel = (tipo) => {
    const labels = {
      'GOTEJAMENTO': 'Gotejamento',
      'ASPERSAO': 'Aspersão',
      'SUPERFICIE': 'Superfície',
      'MICROASPERSAO': 'Micro Aspersão',
      'SULCOS': 'Sulcos'
    };
    return labels[tipo] || tipo;
  };

  // Labels para status
  const getStatusLabel = (status) => {
    const labels = {
      'ACTIVO': 'Activo',
      'MANUTENCAO': 'Manutenção',
      'INATIVO': 'Inativo',
      'PLANEJAMENTO': 'Planejamento'
    };
    return labels[status] || status;
  };

  // Cores para status
  const getStatusColor = (status) => {
    const colors = {
      'ACTIVO': 'bg-green-100 text-green-800 border-green-300',
      'MANUTENCAO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'INATIVO': 'bg-red-100 text-red-800 border-red-300',
      'PLANEJAMENTO': 'bg-blue-100 text-blue-800 border-blue-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Exportar dados
  const handleExportData = () => {
    try {
      const dataToExport = filteredRecords.map(record => ({
        'Código Sistema': record.codigoSistema,
        'Nome Projeto': record.nomeProjeto,
        'Localização': `${record.localizacao.municipio}, ${record.localizacao.provincia}`,
        'Fonte Água': record.fonteAgua,
        'Área Irrigada (ha)': record.areaIrrigada,
        'Famílias Atendidas': record.numeroFamiliasAtendidas,
        'Tipo Irrigação': getTipoIrrigacaoLabel(record.tipoIrrigacao),
        'Status': getStatusLabel(record.statusSistema),
        'Data Instalação': formatDate(record.dataInstalacao),
        'Custo Instalação': formatCurrency(record.custoInstalacao),
        'Responsável': record.responsavelTecnico.nome,
        'Cooperativa': record.cooperativaVinculada,
        'Eficiência (%)': record.eficienciaHidrica,
        'Produção Anual (t)': record.producaoAnual
      }));

      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `sistemas_irrigacao_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      showToast('success', 'Sucesso', 'Dados exportados com sucesso!');
    } catch (error) {
      console.error('Erro ao exportar:', error);
      showToast('error', 'Erro', 'Erro ao exportar dados');
    }
  };

  // Ver detalhes do registro
  const handleViewDetails = (record) => {
    setSelectedRecord(record);
    setShowModal(true);
  };

  // Componente Toast
  const Toast = () => {
    if (!toastMessage) return null;

    const { type, title, message } = toastMessage;

    let bgColor, icon;
    switch (type) {
      case 'success':
        bgColor = 'bg-green-50 border-l-4 border-green-500 text-green-700';
        icon = <CheckCircle className="w-5 h-5" />;
        break;
      case 'error':
        bgColor = 'bg-red-50 border-l-4 border-red-500 text-red-700';
        icon = <AlertCircle className="w-5 h-5" />;
        break;
      case 'info':
        bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
        icon = <Info className="w-5 h-5" />;
        break;
      default:
        bgColor = 'bg-gray-50 border-l-4 border-gray-500 text-gray-700';
        icon = <AlertCircle className="w-5 h-5" />;
    }

    return (
      <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor} animate-fadeIn`}>
        <div className="flex items-center">
          <div className="mr-3">{icon}</div>
          <div>
            <h3 className="font-medium">{title}</h3>
            <p className="text-sm mt-1">{message}</p>
          </div>
          <button
            className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
            onClick={() => setToastMessage(null)}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  };

  // Modal de detalhes
  const DetailsModal = () => {
    if (!showModal || !selectedRecord) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">
              Detalhes do Sistema {selectedRecord.codigoSistema}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Informações Gerais */}
            <div className="bg-cyan-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Droplets className="w-5 h-5 mr-2 text-cyan-600" />
                Informações Gerais
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nome do Projeto:</strong> {selectedRecord.nomeProjeto}</div>
                <div><strong>Código:</strong> {selectedRecord.codigoSistema}</div>
                <div><strong>Fonte de Água:</strong> {selectedRecord.fonteAgua}</div>
                <div><strong>Tipo de Irrigação:</strong> {getTipoIrrigacaoLabel(selectedRecord.tipoIrrigacao)}</div>
                <div><strong>Status:</strong>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRecord.statusSistema)}`}>
                    {getStatusLabel(selectedRecord.statusSistema)}
                  </span>
                </div>
                <div><strong>Data de Instalação:</strong> {formatDate(selectedRecord.dataInstalacao)}</div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Localização
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Província:</strong> {selectedRecord.localizacao.provincia}</div>
                <div><strong>Município:</strong> {selectedRecord.localizacao.municipio}</div>
                <div><strong>Aldeia:</strong> {selectedRecord.localizacao.aldeia}</div>
                <div><strong>Coordenadas:</strong> {selectedRecord.localizacao.coordenadas}</div>
              </div>
            </div>

            {/* Dados Técnicos */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Dados Técnicos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Área Irrigada:</strong> {selectedRecord.areaIrrigada} hectares</div>
                <div><strong>Famílias Atendidas:</strong> {selectedRecord.numeroFamiliasAtendidas}</div>
                <div><strong>Eficiência Hídrica:</strong> {selectedRecord.eficienciaHidrica}%</div>
                <div><strong>Produção Anual:</strong> {selectedRecord.producaoAnual} toneladas</div>
                <div className="md:col-span-2">
                  <strong>Culturas Principais:</strong> {selectedRecord.culturasPrincipais.join(', ')}
                </div>
              </div>
            </div>

            {/* Custos */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-yellow-600" />
                Informações Financeiras
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Custo de Instalação:</strong> {formatCurrency(selectedRecord.custoInstalacao)}</div>
                <div><strong>Custo Mensal Manutenção:</strong> {formatCurrency(selectedRecord.custoManutencaoMensal)}</div>
              </div>
            </div>

            {/* Responsável Técnico */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-purple-600" />
                Responsável Técnico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nome:</strong> {selectedRecord.responsavelTecnico.nome}</div>
                <div><strong>Telefone:</strong> {selectedRecord.responsavelTecnico.telefone}</div>
                <div><strong>Instituição:</strong> {selectedRecord.responsavelTecnico.instituicao}</div>
                <div><strong>Cooperativa:</strong> {selectedRecord.cooperativaVinculada}</div>
              </div>
            </div>

            {/* Manutenção */}
            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Wrench className="w-5 h-5 mr-2 text-orange-600" />
                Manutenção
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Última Manutenção:</strong> {formatDate(selectedRecord.dataUltimaManutencao)}</div>
                <div><strong>Próxima Manutenção:</strong> {formatDate(selectedRecord.proximaManutencao)}</div>
              </div>
            </div>

            {/* Problemas Recentes */}
            {selectedRecord.problemasRecentes?.length > 0 && (
              <div className="bg-red-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                  Problemas Recentes
                </h3>
                <ul className="text-sm text-gray-700 list-disc list-inside">
                  {selectedRecord.problemasRecentes.map((problema, index) => (
                    <li key={index}>{problema}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Observações */}
            {selectedRecord.observacoes && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Observações
                </h3>
                <p className="text-sm text-gray-700">{selectedRecord.observacoes}</p>
              </div>
            )}

            {/* Documentos Anexados */}
            {selectedRecord.documentosAnexados?.length > 0 && (
              <div className="bg-indigo-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-indigo-600" />
                  Documentos Anexados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.documentosAnexados.map((doc, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-xs border border-indigo-200">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <DetailsModal />

      {/* Estatísticas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-cyan-100 rounded-full">
              <Droplets className="w-6 h-6 text-cyan-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Sistemas</p>
              <p className="text-2xl font-bold text-gray-900">{sistemasIrrigacao.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <Activity className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Activos</p>
              <p className="text-2xl font-bold text-gray-900">
                {sistemasIrrigacao.filter(s => s.statusSistema === 'ACTIVO').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Wrench className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Em Manutenção</p>
              <p className="text-2xl font-bold text-gray-900">
                {sistemasIrrigacao.filter(s => s.statusSistema === 'MANUTENCAO').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Users className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Famílias Atendidas</p>
              <p className="text-2xl font-bold text-gray-900">
                {sistemasIrrigacao.reduce((total, s) => total + s.numeroFamiliasAtendidas, 0)}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-cyan-700 to-cyan-500 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Gestão de Sistemas de Irrigação</h1>
              <p className="text-cyan-100 mt-1">Monitoramento e controle dos sistemas de irrigação implantados</p>
            </div>

            <div className="flex gap-4">
              

              <button
                onClick={handleExportData}
                disabled={sistemasIrrigacao.length === 0}
                className="inline-flex items-center px-4 py-2 bg-white text-cyan-700 rounded-lg hover:bg-cyan-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
              >
                <Download className="w-5 h-5 mr-2" />
                Exportar
              </button>
            </div>
          </div>
        </div>

        {/* Barra de ferramentas */}
        <div className="p-6 border-b border-gray-200 bg-white">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* Busca */}
            <div className="lg:col-span-1">
              <CustomInput
                type="text"
                placeholder="Pesquisar por projeto, código, localização..."
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                iconStart={<Search size={18} />}
              />
            </div>

            {/* Filtro Tipo */}
            <div>
              <CustomInput
                type="select"
                placeholder="Tipo de Irrigação"
                value={selectedTipo}
                options={[
                  { label: 'Todos os Tipos', value: '' },
                  { label: 'Gotejamento', value: 'GOTEJAMENTO' },
                  { label: 'Aspersão', value: 'ASPERSAO' },
                  { label: 'Superfície', value: 'SUPERFICIE' },
                  { label: 'Micro Aspersão', value: 'MICROASPERSAO' },
                  { label: 'Sulcos', value: 'SULCOS' }
                ]}
                onChange={(value) => setSelectedTipo(value)}
                iconStart={<Filter size={18} />}
              />
            </div>

            {/* Filtro Status */}
            <div>
              <CustomInput
                type="select"
                placeholder="Estado do Sistema"
                value={selectedStatus}
                options={[
                  { label: 'Todos os Status', value: '' },
                  { label: 'Activo', value: 'ACTIVO' },
                  { label: 'Manutenção', value: 'MANUTENCAO' },
                  { label: 'Inativo', value: 'INATIVO' },
                  { label: 'Planejamento', value: 'PLANEJAMENTO' }
                ]}
                onChange={(value) => setSelectedStatus(value)}
                iconStart={<Filter size={18} />}
              />
            </div>
          </div>
        </div>

        {/* Tabela - Desktop */}
        <div className="hidden md:block">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600">Carregando sistemas...</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Sistema/Localização
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Especificações
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Performance
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Acções
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {getCurrentItems().map((record) => (
                  <tr key={record.id} className="hover:bg-cyan-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{record.nomeProjeto}</div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {record.localizacao.municipio}, {record.localizacao.provincia}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            {record.codigoSistema}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getTipoIrrigacaoLabel(record.tipoIrrigacao)}
                        </div>
                        <div className="text-sm text-green-600">
                          {record.areaIrrigada} hectares
                        </div>
                        <div className="text-xs text-gray-600">
                          Fonte: {record.fonteAgua}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-700">
                          <Users className="w-3.5 h-3.5 mr-1" />
                          {record.numeroFamiliasAtendidas} famílias
                        </div>
                        <div className="flex items-center text-xs text-gray-700">
                          <Thermometer className="w-3.5 h-3.5 mr-1" />
                          Eficiência: {record.eficienciaHidrica}%
                        </div>
                        <div className="text-xs text-start text-gray-600">
                          Produção: {record.producaoAnual}t/ano
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(record.statusSistema)}`}>
                          {getStatusLabel(record.statusSistema)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="p-2 hover:bg-cyan-100 text-cyan-600 hover:text-cyan-800 rounded-full transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <td colSpan={5}>
                    {/* Paginação */}
                    {!loading && filteredRecords.length > 0 && (
                      <div className="px-6 py-4 border-t border-gray-200 bg-white">
                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                          <div className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                              {Math.min(currentPage * itemsPerPage, filteredRecords.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredRecords.length}</span>
                            {' '}resultados
                          </div>

                          <div className="flex space-x-2">
                            <button
                              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                              disabled={currentPage === 1}
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${currentPage === 1
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200'
                                }
                  `}
                            >
                              <ChevronLeft className="w-4 h-4 mr-1" />
                              Anterior
                            </button>

                            <button
                              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                              disabled={currentPage === totalPages || totalPages === 0}
                              className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                    ${currentPage === totalPages || totalPages === 0
                                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                  : 'bg-white text-cyan-700 hover:bg-cyan-50 border border-cyan-200'
                                }
                  `}
                            >
                              Próximo
                              <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}

                  </td>
                </tr>
              </tfoot>
            </table>
          )}
        </div>

        {/* Visualização em cards para mobile */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
              <span className="ml-3 text-gray-600">Carregando sistemas...</span>
            </div>
          ) : (
            getCurrentItems().map((record) => (
              <div key={record.id} className="p-4 border-b border-gray-200 hover:bg-cyan-50 transition-colors">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Droplets className="w-6 h-6 text-cyan-600" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{record.nomeProjeto}</h3>
                        <div className="text-xs text-gray-500 mt-1">Código: {record.codigoSistema}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.statusSistema)}`}>
                        {getStatusLabel(record.statusSistema)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-gray-700">
                        <strong>Local:</strong> {record.localizacao.municipio}, {record.localizacao.provincia}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Tipo:</strong> {getTipoIrrigacaoLabel(record.tipoIrrigacao)}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Área:</strong> {record.areaIrrigada} ha | <strong>Famílias:</strong> {record.numeroFamiliasAtendidas}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Eficiência:</strong> {record.eficienciaHidrica}% | <strong>Responsável:</strong> {record.responsavelTecnico.nome}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="p-1.5 bg-cyan-50 hover:bg-cyan-100 text-cyan-600 rounded-full transition-colors"
                        title="Ver detalhes"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>


        {/* Nenhum resultado encontrado */}
        {!loading && filteredRecords.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <Droplets className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {sistemasIrrigacao.length === 0 ? 'Nenhum sistema encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {sistemasIrrigacao.length === 0
                ? 'Ainda não existem sistemas de irrigação cadastrados no sistema.'
                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros aplicados.'
              }
            </p>
            {(searchTerm || selectedTipo || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedTipo('');
                  setSelectedStatus('');
                }}
                className="px-4 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors"
              >
                Limpar filtros
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GestaoSistemasIrrigacao;