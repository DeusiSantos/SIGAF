import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  User,
  Building,
  Trees,
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
  Clock
} from 'lucide-react';

const CustomInput = ({ type, label, value, onChange, options, required, errorMessage, disabled, placeholder, iconStart, helperText, rows, ...props }) => {
  const baseInputClasses = `w-full p-3 border rounded-xl transition-all ${
    errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-red-500'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-red-200`;

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

const GestaoMultasApreensoes = () => {
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

  // Dados mock para demonstração
  const [multasApreensoes, setMultasApreensoes] = useState([
    {
      id: 1,
      numeroProcesso: 'MF-2024-001',
      nomeInfrator: 'João Silva Santos',
      documentoInfrator: '123456789LA041',
      telefoneInfrator: '923456789',
      provinciaInfrator: 'LUANDA',
      municipioInfrator: 'LUANDA',
      propriedadeAfetada: 'Floresta do Norte',
      coordenadasPropriedade: '-8.7832, 13.3432',
      tipoSancao: 'MULTA',
      valorMulta: 50000,
      motivoSancao: 'DESMATAMENTO_ILEGAL',
      dataOcorrencia: '2024-01-15',
      dataAplicacao: '2024-01-20',
      localOcorrencia: 'Área florestal protegida',
      descricaoDetalhada: 'Desmatamento de aproximadamente 2 hectares de floresta nativa sem autorização.',
      responsavelNome: 'Maria Costa',
      responsavelCargo: 'Fiscal Florestal',
      responsavelInstituicao: 'DNF',
      statusProcesso: 'ATIVO',
      observacoes: 'Processo em andamento, aguardando pagamento da multa.',
      documentosAnexados: ['auto_infracao.pdf', 'fotos_area.zip']
    },
    {
      id: 2,
      numeroProcesso: 'AF-2024-002',
      nomeInfrator: 'Empresa Florestal Lda',
      documentoInfrator: '987654321LA042',
      telefoneInfrator: '924567890',
      provinciaInfrator: 'BENGUELA',
      municipioInfrator: 'BENGUELA',
      propriedadeAfetada: 'Concessão Benguela',
      coordenadasPropriedade: '-12.3532, 13.5356',
      tipoSancao: 'APREENSAO_EQUIPAMENTOS',
      valorMulta: 0,
      motivoSancao: 'EXPLORACAO_SEM_LICENCA',
      dataOcorrencia: '2024-02-10',
      dataAplicacao: '2024-02-12',
      localOcorrencia: 'Área de concessão florestal',
      descricaoDetalhada: 'Exploração de madeira sem licença válida. Apreendidos 3 tratores e equipamentos de corte.',
      responsavelNome: 'António Ferreira',
      responsavelCargo: 'Técnico Superior Florestal',
      responsavelInstituicao: 'MINAGRIF',
      statusProcesso: 'RESOLVIDO',
      observacoes: 'Equipamentos devolvidos após regularização da documentação.',
      documentosAnexados: ['auto_apreensao.pdf', 'inventario_equipamentos.xlsx']
    },
    {
      id: 3,
      numeroProcesso: 'QF-2024-003',
      nomeInfrator: 'Pedro Manuel',
      documentoInfrator: '456789123LA043',
      telefoneInfrator: '925678901',
      provinciaInfrator: 'HUILA',
      municipioInfrator: 'LUBANGO',
      propriedadeAfetada: 'Área Rural Sul',
      coordenadasPropriedade: '-14.9167, 13.4833',
      tipoSancao: 'MULTA',
      valorMulta: 25000,
      motivoSancao: 'QUEIMADAS_NAO_AUTORIZADAS',
      dataOcorrencia: '2024-03-05',
      dataAplicacao: '2024-03-08',
      localOcorrencia: 'Zona rural do Lubango',
      descricaoDetalhada: 'Queimada não autorizada em área de 5 hectares para limpeza de terreno.',
      responsavelNome: 'Ana Joaquina',
      responsavelCargo: 'Inspectora Florestal',
      responsavelInstituicao: 'ADMIN_MUNICIPAL',
      statusProcesso: 'PENDENTE',
      observacoes: 'Aguardando pagamento da multa e plano de recuperação da área.',
      documentosAnexados: ['relatorio_queimada.pdf']
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
    return multasApreensoes.filter(record => {
      const matchesSearch =
        record.nomeInfrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.numeroProcesso.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.documentoInfrator.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.telefoneInfrator.includes(searchTerm) ||
        record.propriedadeAfetada.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesTipo = !selectedTipo || record.tipoSancao === selectedTipo;
      const matchesStatus = !selectedStatus || record.statusProcesso === selectedStatus;

      return matchesSearch && matchesTipo && matchesStatus;
    });
  }, [multasApreensoes, searchTerm, selectedTipo, selectedStatus]);

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

  // Labels para tipos de sanção
  const getTipoSancaoLabel = (tipo) => {
    const labels = {
      'MULTA': 'Multa',
      'APREENSAO_EQUIPAMENTOS': 'Apreensão de Equipamentos',
      'APREENSAO_MADEIRA': 'Apreensão de Madeira',
      'SUSPENSAO_ATIVIDADE': 'Suspensão de Atividade',
      'EMBARGAMENTO_OBRA': 'Embargamento de Obra'
    };
    return labels[tipo] || tipo;
  };

  // Labels para motivos
  const getMotivoLabel = (motivo) => {
    const labels = {
      'DESMATAMENTO_ILEGAL': 'Desmatamento Ilegal',
      'EXPLORACAO_SEM_LICENCA': 'Exploração sem Licença',
      'QUEIMADAS_NAO_AUTORIZADAS': 'Queimadas não Autorizadas',
      'TRANSPORTE_ILEGAL_MADEIRA': 'Transporte Ilegal de Madeira',
      'VIOLACAO_AREA_PROTEGIDA': 'Violação de Área Protegida',
      'OUTROS': 'Outros'
    };
    return labels[motivo] || motivo;
  };

  // Labels para status
  const getStatusLabel = (status) => {
    const labels = {
      'ATIVO': 'Ativo',
      'PENDENTE': 'Pendente',
      'RESOLVIDO': 'Resolvido',
      'CANCELADO': 'Cancelado'
    };
    return labels[status] || status;
  };

  // Cores para status
  const getStatusColor = (status) => {
    const colors = {
      'ATIVO': 'bg-blue-100 text-blue-800 border-blue-300',
      'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'RESOLVIDO': 'bg-green-100 text-green-800 border-green-300',
      'CANCELADO': 'bg-gray-100 text-gray-800 border-gray-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Exportar dados
  const handleExportData = () => {
    try {
      const dataToExport = filteredRecords.map(record => ({
        'Nº Processo': record.numeroProcesso,
        'Nome/Empresa': record.nomeInfrator,
        'Documento': record.documentoInfrator,
        'Telefone': record.telefoneInfrator,
        'Província': record.provinciaInfrator,
        'Município': record.municipioInfrator,
        'Propriedade': record.propriedadeAfetada,
        'Tipo de Sanção': getTipoSancaoLabel(record.tipoSancao),
        'Valor da Multa': record.valorMulta > 0 ? formatCurrency(record.valorMulta) : 'N/A',
        'Motivo': getMotivoLabel(record.motivoSancao),
        'Data Ocorrência': formatDate(record.dataOcorrencia),
        'Data Aplicação': formatDate(record.dataAplicacao),
        'Responsável': record.responsavelNome,
        'Instituição': record.responsavelInstituicao,
        'Status': getStatusLabel(record.statusProcesso)
      }));

      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `historico_multas_apreensoes_${new Date().toISOString().split('T')[0]}.csv`);
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
              Detalhes do Processo {selectedRecord.numeroProcesso}
            </h2>
            <button
              onClick={() => setShowModal(false)}
              className="p-2 hover:bg-gray-100 rounded-full"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* Informações do Infrator */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-red-600" />
                Dados do Infrator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nome/Empresa:</strong> {selectedRecord.nomeInfrator}</div>
                <div><strong>Documento:</strong> {selectedRecord.documentoInfrator}</div>
                <div><strong>Telefone:</strong> {selectedRecord.telefoneInfrator}</div>
                <div><strong>Localização:</strong> {selectedRecord.municipioInfrator}, {selectedRecord.provinciaInfrator}</div>
              </div>
            </div>

            {/* Informações da Sanção */}
            <div className="bg-red-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Scale className="w-5 h-5 mr-2 text-red-600" />
                Sanção Aplicada
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Tipo:</strong> {getTipoSancaoLabel(selectedRecord.tipoSancao)}</div>
                <div><strong>Valor:</strong> {selectedRecord.valorMulta > 0 ? formatCurrency(selectedRecord.valorMulta) : 'N/A'}</div>
                <div><strong>Motivo:</strong> {getMotivoLabel(selectedRecord.motivoSancao)}</div>
                <div><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRecord.statusProcesso)}`}>
                    {getStatusLabel(selectedRecord.statusProcesso)}
                  </span>
                </div>
              </div>
            </div>

            {/* Informações da Ocorrência */}
            <div className="bg-yellow-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-yellow-600" />
                Local e Data da Ocorrência
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Propriedade:</strong> {selectedRecord.propriedadeAfetada}</div>
                <div><strong>Coordenadas:</strong> {selectedRecord.coordenadasPropriedade}</div>
                <div><strong>Local:</strong> {selectedRecord.localOcorrencia}</div>
                <div><strong>Data:</strong> {formatDate(selectedRecord.dataOcorrencia)}</div>
              </div>
              <div className="mt-3">
                <strong>Descrição:</strong>
                <p className="mt-1 text-gray-700">{selectedRecord.descricaoDetalhada}</p>
              </div>
            </div>

            {/* Informações do Responsável */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-blue-600" />
                Responsável pela Aplicação
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nome:</strong> {selectedRecord.responsavelNome}</div>
                <div><strong>Cargo:</strong> {selectedRecord.responsavelCargo}</div>
                <div><strong>Instituição:</strong> {selectedRecord.responsavelInstituicao}</div>
                <div><strong>Data Aplicação:</strong> {formatDate(selectedRecord.dataAplicacao)}</div>
              </div>
            </div>

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
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-green-600" />
                  Documentos Anexados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.documentosAnexados.map((doc, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-xs border border-green-200">
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
            <div className="p-3 bg-red-100 rounded-full">
              <Scale className="w-6 h-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Processos</p>
              <p className="text-2xl font-bold text-gray-900">{multasApreensoes.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Activity className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Ativos</p>
              <p className="text-2xl font-bold text-gray-900">
                {multasApreensoes.filter(m => m.statusProcesso === 'ATIVO').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {multasApreensoes.filter(m => m.statusProcesso === 'PENDENTE').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Resolvidos</p>
              <p className="text-2xl font-bold text-gray-900">
                {multasApreensoes.filter(m => m.statusProcesso === 'RESOLVIDO').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-red-700 to-red-500 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Histórico de Multas e Apreensões</h1>
              <p className="text-red-100 mt-1">Gestão de sanções e infrações florestais</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => showToast('info', 'Nova Multa', 'Funcionalidade de registro será implementada em breve')}
                className="inline-flex items-center px-4 py-2 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors shadow-sm font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Registro
              </button>
              
              <button
                onClick={handleExportData}
                disabled={multasApreensoes.length === 0}
                className="inline-flex items-center px-4 py-2 bg-white text-red-700 rounded-lg hover:bg-red-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                placeholder="Pesquisar por nome, documento, processo..."
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                iconStart={<Search size={18} />}
              />
            </div>

            {/* Filtro Tipo */}
            <div>
              <CustomInput
                type="select"
                placeholder="Tipo de Sanção"
                value={selectedTipo}
                options={[
                  { label: 'Todos os Tipos', value: '' },
                  { label: 'Multa', value: 'MULTA' },
                  { label: 'Apreensão de Equipamentos', value: 'APREENSAO_EQUIPAMENTOS' },
                  { label: 'Apreensão de Madeira', value: 'APREENSAO_MADEIRA' },
                  { label: 'Suspensão de Atividade', value: 'SUSPENSAO_ATIVIDADE' },
                  { label: 'Embargamento de Obra', value: 'EMBARGAMENTO_OBRA' }
                ]}
                onChange={(value) => setSelectedTipo(value)}
                iconStart={<Filter size={18} />}
              />
            </div>

            {/* Filtro Status */}
            <div>
              <CustomInput
                type="select"
                placeholder="Status do Processo"
                value={selectedStatus}
                options={[
                  { label: 'Todos os Status', value: '' },
                  { label: 'Ativo', value: 'ATIVO' },
                  { label: 'Pendente', value: 'PENDENTE' },
                  { label: 'Resolvido', value: 'RESOLVIDO' },
                  { label: 'Cancelado', value: 'CANCELADO' }
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Carregando registros...</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Processo/Infrator
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Sanção
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Data/Responsável
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Status
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {getCurrentItems().map((record) => (
                  <tr key={record.id} className="hover:bg-red-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{record.nomeInfrator}</div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <CreditCard className="w-3.5 h-3.5 mr-1" />
                            {record.documentoInfrator}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            {record.numeroProcesso}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {getTipoSancaoLabel(record.tipoSancao)}
                        </div>
                        {record.valorMulta > 0 && (
                          <div className="text-sm text-green-600 font-semibold">
                            {formatCurrency(record.valorMulta)}
                          </div>
                        )}
                        <div className="text-xs text-gray-600">
                          {getMotivoLabel(record.motivoSancao)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-700">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          Ocorrência: {formatDate(record.dataOcorrencia)}
                        </div>
                        <div className="flex items-center text-xs text-gray-700">
                          <Calendar className="w-3.5 h-3.5 mr-1" />
                          Aplicação: {formatDate(record.dataAplicacao)}
                        </div>
                        <div className="text-xs text-gray-600">
                          Por: {record.responsavelNome}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(record.statusProcesso)}`}>
                          {getStatusLabel(record.statusProcesso)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Visualização em cards para mobile */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div>
              <span className="ml-3 text-gray-600">Carregando registros...</span>
            </div>
          ) : (
            getCurrentItems().map((record) => (
              <div key={record.id} className="p-4 border-b border-gray-200 hover:bg-red-50 transition-colors">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-6 h-6 text-red-600" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{record.nomeInfrator}</h3>
                        <div className="text-xs text-gray-500 mt-1">Processo: {record.numeroProcesso}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.statusProcesso)}`}>
                        {getStatusLabel(record.statusProcesso)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-gray-700">
                        <strong>Sanção:</strong> {getTipoSancaoLabel(record.tipoSancao)}
                        {record.valorMulta > 0 && (
                          <span className="ml-2 text-green-600 font-semibold">
                            {formatCurrency(record.valorMulta)}
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Motivo:</strong> {getMotivoLabel(record.motivoSancao)}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Data:</strong> {formatDate(record.dataOcorrencia)}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Responsável:</strong> {record.responsavelNome}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
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
                      : 'bg-white text-red-700 hover:bg-red-50 border border-red-200'
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
                      : 'bg-white text-red-700 hover:bg-red-50 border border-red-200'
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

        {/* Nenhum resultado encontrado */}
        {!loading && filteredRecords.length === 0 && (
          <div className="py-12 flex flex-col items-center justify-center text-center px-4">
            <AlertTriangle className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {multasApreensoes.length === 0 ? 'Nenhum registro encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {multasApreensoes.length === 0
                ? 'Ainda não existem registros de multas e apreensões no sistema.'
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default GestaoMultasApreensoes;