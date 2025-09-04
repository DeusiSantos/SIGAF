import React, { useRef, useState, useEffect, useMemo } from 'react';
import {
  User,
  Building,
  Beaker,
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
  Users,
  TestTube,
  Microscope,
  Leaf,
  TrendingUp,
  TrendingDown,
  Minus
} from 'lucide-react';

const CustomInput = ({ type, label, value, onChange, options, required, errorMessage, disabled, placeholder, iconStart, helperText, rows, ...props }) => {
  const baseInputClasses = `w-full p-3 border rounded-xl transition-all ${
    errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-emerald-500'
  } ${disabled ? 'bg-gray-100 cursor-not-allowed' : 'bg-white'} focus:outline-none focus:ring-2 focus:ring-emerald-200`;

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

const GestaoTestesSolo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLaboratorio, setSelectedLaboratorio] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const itemsPerPage = 8;
  const containerRef = useRef(null);

  // Dados mock para testes de amostras de solo
  const [testesSolo, setTestesSolo] = useState([
    {
      id: 1,
      codigoAmostra: 'TS-2024-001',
      numeroAmostra: 'SOLO-CAC-001',
      localizacao: {
        provincia: 'LUANDA',
        municipio: 'CACUACO',
        aldeia: 'Funda',
        coordenadas: '-8.7832, 13.3432'
      },
      dataColeta: '2024-08-15',
      dataAnalise: '2024-08-20',
      tecnicoResponsavel: {
        nome: 'Eng. Maria Santos',
        telefone: '923456789',
        instituicao: 'IDA'
      },
      laboratorio: 'LAB_CENTRAL',
      culturaAtual: 'Milho',
      culturaAnterior: 'Feijão',
      profundidadeColeta: '0-20 cm',
      tipoSolo: 'Franco-arenoso',
      statusAnalise: 'CONCLUIDA',
      resultados: {
        ph: 6.2,
        materiaOrganica: 2.8,
        nitrogenio: 45,
        fosforo: 12,
        potassio: 85,
        calcio: 180,
        magnesio: 55,
        condutividadeEletrica: 0.8,
        cationesTotais: 8.5
      },
      interpretacao: {
        ph: 'BOM',
        materiaOrganica: 'MEDIO',
        nitrogenio: 'BAIXO',
        fosforo: 'BAIXO',
        potassio: 'MEDIO'
      },
      recomendacoes: [
        'Aplicar 200kg/ha de ureia para correção do nitrogênio',
        'Adicionar 150kg/ha de superfosfato simples',
        'Incorporar matéria orgânica (esterco bovino 3t/ha)'
      ],
      culturasRecomendadas: ['Milho', 'Feijão', 'Hortaliças folhosas'],
      observacoes: 'Solo com boa estrutura, necessita correção nutricional para otimização da produção.',
      custoAnalise: 15000,
      documentosAnexados: ['resultado_laboratorio.pdf', 'fotos_coleta.jpg', 'mapa_localizacao.pdf']
    },
    {
      id: 2,
      codigoAmostra: 'TS-2024-002',
      numeroAmostra: 'SOLO-BEN-002',
      localizacao: {
        provincia: 'BENGUELA',
        municipio: 'BENGUELA',
        aldeia: 'Cavaco',
        coordenadas: '-12.3532, 13.5356'
      },
      dataColeta: '2024-08-10',
      dataAnalise: '2024-08-18',
      tecnicoResponsavel: {
        nome: 'Técn. Pedro Andrade',
        telefone: '924567890',
        instituicao: 'MINAGRIF'
      },
      laboratorio: 'LAB_BENGUELA',
      culturaAtual: 'Tomate',
      culturaAnterior: 'Cebola',
      profundidadeColeta: '0-30 cm',
      tipoSolo: 'Argiloso',
      statusAnalise: 'EM_ANALISE',
      resultados: {
        ph: 7.8,
        materiaOrganica: 3.5,
        nitrogenio: 65,
        fosforo: 25,
        potassio: 120,
        calcio: 220,
        magnesio: 75,
        condutividadeEletrica: 1.2,
        cationesTotais: 12.8
      },
      interpretacao: {
        ph: 'ALTO',
        materiaOrganica: 'BOM',
        nitrogenio: 'MEDIO',
        fosforo: 'MEDIO',
        potassio: 'BOM'
      },
      recomendacoes: [
        'pH elevado - aplicar enxofre elementar 200kg/ha',
        'Manter programa de adubação orgânica',
        'Complementar com micronutrientes (Zn, B, Mn)'
      ],
      culturasRecomendadas: ['Hortaliças', 'Leguminosas', 'Culturas perenes'],
      observacoes: 'Solo com pH elevado, boa fertilidade natural mas necessita correção da acidez.',
      custoAnalise: 18000,
      documentosAnexados: ['coleta_amostra.jpg', 'ficha_campo.pdf']
    },
    {
      id: 3,
      codigoAmostra: 'TS-2024-003',
      numeroAmostra: 'SOLO-HUI-003',
      localizacao: {
        provincia: 'HUILA',
        municipio: 'LUBANGO',
        aldeia: 'Hoque',
        coordenadas: '-14.9167, 13.4833'
      },
      dataColeta: '2024-07-28',
      dataAnalise: '2024-08-05',
      tecnicoResponsavel: {
        nome: 'Eng. Ana Joaquina',
        telefone: '925678901',
        instituicao: 'UNIVERSIDADE'
      },
      laboratorio: 'LAB_UNIVERSITARIO',
      culturaAtual: 'Batata-doce',
      culturaAnterior: 'Pousio',
      profundidadeColeta: '0-25 cm',
      tipoSolo: 'Franco',
      statusAnalise: 'PENDENTE',
      resultados: null,
      interpretacao: null,
      recomendacoes: [],
      culturasRecomendadas: [],
      observacoes: 'Aguardando processamento no laboratório. Prioridade alta devido ao período de plantio.',
      custoAnalise: 20000,
      documentosAnexados: ['protocolo_coleta.pdf']
    },
    {
      id: 4,
      codigoAmostra: 'TS-2024-004',
      numeroAmostra: 'SOLO-MAL-004',
      localizacao: {
        provincia: 'MALANJE',
        municipio: 'MALANJE',
        aldeia: 'Kiwaba',
        coordenadas: '-9.5402, 16.3425'
      },
      dataColeta: '2024-08-25',
      dataAnalise: '2024-09-01',
      tecnicoResponsavel: {
        nome: 'Técn. Francisco João',
        telefone: '926789012',
        instituicao: 'EDA_MALANJE'
      },
      laboratorio: 'LAB_CENTRAL',
      culturaAtual: 'Algodão',
      culturaAnterior: 'Milho',
      profundidadeColeta: '0-15 cm',
      tipoSolo: 'Arenoso',
      statusAnalise: 'CONCLUIDA',
      resultados: {
        ph: 5.8,
        materiaOrganica: 1.2,
        nitrogenio: 25,
        fosforo: 8,
        potassio: 45,
        calcio: 95,
        magnesio: 30,
        condutividadeEletrica: 0.4,
        cationesTotais: 4.2
      },
      interpretacao: {
        ph: 'MEDIO',
        materiaOrganica: 'BAIXO',
        nitrogenio: 'MUITO_BAIXO',
        fosforo: 'MUITO_BAIXO',
        potassio: 'BAIXO'
      },
      recomendacoes: [
        'Calagem com 2t/ha de calcário dolomítico',
        'Adubação pesada: NPK 20-10-20 (300kg/ha)',
        'Incorporação urgente de matéria orgânica (5t/ha)',
        'Plantio de leguminosas na entressafra'
      ],
      culturasRecomendadas: ['Feijão-caupi', 'Amendoim', 'Culturas de cobertura'],
      observacoes: 'Solo severamente degradado. Necessita programa intensivo de recuperação antes do cultivo comercial.',
      custoAnalise: 16000,
      documentosAnexados: ['resultado_completo.pdf', 'recomendacoes_tecnicas.pdf', 'plano_recuperacao.pdf']
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
    return testesSolo.filter(record => {
      const matchesSearch =
        record.numeroAmostra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.codigoAmostra.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.culturaAtual.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tecnicoResponsavel.nome.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesLaboratorio = !selectedLaboratorio || record.laboratorio === selectedLaboratorio;
      const matchesStatus = !selectedStatus || record.statusAnalise === selectedStatus;

      return matchesSearch && matchesLaboratorio && matchesStatus;
    });
  }, [testesSolo, searchTerm, selectedLaboratorio, selectedStatus]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedLaboratorio, selectedStatus]);

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

  // Labels para laboratórios
  const getLaboratorioLabel = (lab) => {
    const labels = {
      'LAB_CENTRAL': 'Laboratório Central',
      'LAB_BENGUELA': 'Laboratório de Benguela',
      'LAB_UNIVERSITARIO': 'Laboratório Universitário',
      'LAB_PRIVADO': 'Laboratório Privado'
    };
    return labels[lab] || lab;
  };

  // Labels para status
  const getStatusLabel = (status) => {
    const labels = {
      'PENDENTE': 'Pendente',
      'EM_ANALISE': 'Em Análise',
      'CONCLUIDA': 'Concluída',
      'CANCELADA': 'Cancelada'
    };
    return labels[status] || status;
  };

  // Cores para status
  const getStatusColor = (status) => {
    const colors = {
      'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
      'EM_ANALISE': 'bg-blue-100 text-blue-800 border-blue-300',
      'CONCLUIDA': 'bg-green-100 text-green-800 border-green-300',
      'CANCELADA': 'bg-red-100 text-red-800 border-red-300'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
  };

  // Labels e cores para interpretação
  const getInterpretacaoLabel = (valor) => {
    const labels = {
      'MUITO_BAIXO': 'Muito Baixo',
      'BAIXO': 'Baixo',
      'MEDIO': 'Médio',
      'BOM': 'Bom',
      'ALTO': 'Alto',
      'MUITO_ALTO': 'Muito Alto'
    };
    return labels[valor] || valor;
  };

  const getInterpretacaoColor = (valor) => {
    const colors = {
      'MUITO_BAIXO': 'text-red-600',
      'BAIXO': 'text-orange-600',
      'MEDIO': 'text-yellow-600',
      'BOM': 'text-green-600',
      'ALTO': 'text-blue-600',
      'MUITO_ALTO': 'text-purple-600'
    };
    return colors[valor] || 'text-gray-600';
  };

  const getInterpretacaoIcon = (valor) => {
    const icons = {
      'MUITO_BAIXO': <TrendingDown className="w-3.5 h-3.5" />,
      'BAIXO': <TrendingDown className="w-3.5 h-3.5" />,
      'MEDIO': <Minus className="w-3.5 h-3.5" />,
      'BOM': <TrendingUp className="w-3.5 h-3.5" />,
      'ALTO': <TrendingUp className="w-3.5 h-3.5" />,
      'MUITO_ALTO': <TrendingUp className="w-3.5 h-3.5" />
    };
    return icons[valor] || <Minus className="w-3.5 h-3.5" />;
  };

  // Exportar dados
  const handleExportData = () => {
    try {
      const dataToExport = filteredRecords.map(record => ({
        'Código Amostra': record.codigoAmostra,
        'Número Amostra': record.numeroAmostra,
        'Localização': `${record.localizacao.municipio}, ${record.localizacao.provincia}`,
        'Data Coleta': formatDate(record.dataColeta),
        'Cultura Atual': record.culturaAtual,
        'Tipo Solo': record.tipoSolo,
        'Laboratório': getLaboratorioLabel(record.laboratorio),
        'Status': getStatusLabel(record.statusAnalise),
        'pH': record.resultados?.ph || 'N/A',
        'Matéria Orgânica (%)': record.resultados?.materiaOrganica || 'N/A',
        'Nitrogênio (mg/kg)': record.resultados?.nitrogenio || 'N/A',
        'Fósforo (mg/kg)': record.resultados?.fosforo || 'N/A',
        'Potássio (mg/kg)': record.resultados?.potassio || 'N/A',
        'Técnico Responsável': record.tecnicoResponsavel.nome,
        'Custo Análise': formatCurrency(record.custoAnalise)
      }));

      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).join(','))
      ].join('\n');

      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `testes_solo_${new Date().toISOString().split('T')[0]}.csv`);
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
              Detalhes da Amostra {selectedRecord.numeroAmostra}
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
            <div className="bg-emerald-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <TestTube className="w-5 h-5 mr-2 text-emerald-600" />
                Informações da Amostra
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Código:</strong> {selectedRecord.codigoAmostra}</div>
                <div><strong>Número:</strong> {selectedRecord.numeroAmostra}</div>
                <div><strong>Data Coleta:</strong> {formatDate(selectedRecord.dataColeta)}</div>
                <div><strong>Data Análise:</strong> {formatDate(selectedRecord.dataAnalise)}</div>
                <div><strong>Laboratório:</strong> {getLaboratorioLabel(selectedRecord.laboratorio)}</div>
                <div><strong>Status:</strong> 
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedRecord.statusAnalise)}`}>
                    {getStatusLabel(selectedRecord.statusAnalise)}
                  </span>
                </div>
              </div>
            </div>

            {/* Localização */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-green-600" />
                Localização da Coleta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Província:</strong> {selectedRecord.localizacao.provincia}</div>
                <div><strong>Município:</strong> {selectedRecord.localizacao.municipio}</div>
                <div><strong>Aldeia:</strong> {selectedRecord.localizacao.aldeia}</div>
                <div><strong>Coordenadas:</strong> {selectedRecord.localizacao.coordenadas}</div>
              </div>
            </div>

            {/* Dados da Coleta */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-blue-600" />
                Dados da Coleta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Cultura Atual:</strong> {selectedRecord.culturaAtual}</div>
                <div><strong>Cultura Anterior:</strong> {selectedRecord.culturaAnterior}</div>
                <div><strong>Profundidade:</strong> {selectedRecord.profundidadeColeta}</div>
                <div><strong>Tipo de Solo:</strong> {selectedRecord.tipoSolo}</div>
              </div>
            </div>

            {/* Resultados das Análises */}
            {selectedRecord.resultados && (
              <div className="bg-purple-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Beaker className="w-5 h-5 mr-2 text-purple-600" />
                  Resultados das Análises
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div><strong>pH:</strong> {selectedRecord.resultados.ph}</div>
                  <div><strong>Matéria Orgânica:</strong> {selectedRecord.resultados.materiaOrganica}%</div>
                  <div><strong>Condutividade Elétrica:</strong> {selectedRecord.resultados.condutividadeEletrica} dS/m</div>
                  <div><strong>Nitrogênio (N):</strong> {selectedRecord.resultados.nitrogenio} mg/kg</div>
                  <div><strong>Fósforo (P):</strong> {selectedRecord.resultados.fosforo} mg/kg</div>
                  <div><strong>Potássio (K):</strong> {selectedRecord.resultados.potassio} mg/kg</div>
                  <div><strong>Cálcio (Ca):</strong> {selectedRecord.resultados.calcio} mg/kg</div>
                  <div><strong>Magnésio (Mg):</strong> {selectedRecord.resultados.magnesio} mg/kg</div>
                  <div><strong>CTC:</strong> {selectedRecord.resultados.cationesTotais} cmolc/dm³</div>
                </div>
              </div>
            )}

            {/* Interpretação */}
            {selectedRecord.interpretacao && (
              <div className="bg-yellow-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Target className="w-5 h-5 mr-2 text-yellow-600" />
                  Interpretação dos Resultados
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  {Object.entries(selectedRecord.interpretacao).map(([param, valor]) => (
                    <div key={param} className="flex items-center">
                      <strong className="capitalize mr-2">{param.replace(/([A-Z])/g, ' $1').trim()}:</strong>
                      <span className={`flex items-center ${getInterpretacaoColor(valor)}`}>
                        {getInterpretacaoIcon(valor)}
                        <span className="ml-1">{getInterpretacaoLabel(valor)}</span>
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recomendações */}
            {selectedRecord.recomendacoes?.length > 0 && (
              <div className="bg-orange-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-orange-600" />
                  Recomendações Técnicas
                </h3>
                <ul className="text-sm text-gray-700 list-disc list-inside space-y-1">
                  {selectedRecord.recomendacoes.map((recomendacao, index) => (
                    <li key={index}>{recomendacao}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Culturas Recomendadas */}
            {selectedRecord.culturasRecomendadas?.length > 0 && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Culturas Recomendadas
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.culturasRecomendadas.map((cultura, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-xs border border-green-200">
                      {cultura}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Responsável Técnico */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <UserCheck className="w-5 h-5 mr-2 text-indigo-600" />
                Responsável Técnico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Nome:</strong> {selectedRecord.tecnicoResponsavel.nome}</div>
                <div><strong>Telefone:</strong> {selectedRecord.tecnicoResponsavel.telefone}</div>
                <div><strong>Instituição:</strong> {selectedRecord.tecnicoResponsavel.instituicao}</div>
                <div><strong>Custo da Análise:</strong> {formatCurrency(selectedRecord.custoAnalise)}</div>
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
              <div className="bg-cyan-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-cyan-600" />
                  Documentos Anexados
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedRecord.documentosAnexados.map((doc, index) => (
                    <span key={index} className="bg-white px-3 py-1 rounded-full text-xs border border-cyan-200">
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
            <div className="p-3 bg-emerald-100 rounded-full">
              <TestTube className="w-6 h-6 text-emerald-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total de Testes</p>
              <p className="text-2xl font-bold text-gray-900">{testesSolo.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Concluídas</p>
              <p className="text-2xl font-bold text-gray-900">
                {testesSolo.filter(s => s.statusAnalise === 'CONCLUIDA').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Beaker className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Em Análise</p>
              <p className="text-2xl font-bold text-gray-900">
                {testesSolo.filter(s => s.statusAnalise === 'EM_ANALISE').length}
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
                {testesSolo.filter(s => s.statusAnalise === 'PENDENTE').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-emerald-700 to-emerald-500 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Gestão de Testes de Amostras de Solo</h1>
              <p className="text-emerald-100 mt-1">Monitoramento e controle das análises de solo realizadas</p>
            </div>

            <div className="flex gap-4">
              <button
                onClick={() => showToast('info', 'Novo Teste', 'Funcionalidade de cadastro será implementada em breve')}
                className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm font-medium"
              >
                <Plus className="w-5 h-5 mr-2" />
                Novo Teste
              </button>
              
              <button
                onClick={handleExportData}
                disabled={testesSolo.length === 0}
                className="inline-flex items-center px-4 py-2 bg-white text-emerald-700 rounded-lg hover:bg-emerald-50 transition-colors shadow-sm font-medium disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed"
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
                placeholder="Pesquisar por amostra, localização, cultura..."
                value={searchTerm}
                onChange={(value) => setSearchTerm(value)}
                iconStart={<Search size={18} />}
              />
            </div>

            {/* Filtro Laboratório */}
            <div>
              <CustomInput
                type="select"
                placeholder="Laboratório"
                value={selectedLaboratorio}
                options={[
                  { label: 'Todos os Laboratórios', value: '' },
                  { label: 'Laboratório Central', value: 'LAB_CENTRAL' },
                  { label: 'Laboratório de Benguela', value: 'LAB_BENGUELA' },
                  { label: 'Laboratório Universitário', value: 'LAB_UNIVERSITARIO' },
                  { label: 'Laboratório Privado', value: 'LAB_PRIVADO' }
                ]}
                onChange={(value) => setSelectedLaboratorio(value)}
                iconStart={<Microscope size={18} />}
              />
            </div>

            {/* Filtro Status */}
            <div>
              <CustomInput
                type="select"
                placeholder="Estado da Análise"
                value={selectedStatus}
                options={[
                  { label: 'Todos os Status', value: '' },
                  { label: 'Pendente', value: 'PENDENTE' },
                  { label: 'Em Análise', value: 'EM_ANALISE' },
                  { label: 'Concluída', value: 'CONCLUIDA' },
                  { label: 'Cancelada', value: 'CANCELADA' }
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600">Carregando testes...</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Amostra/Localização
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Coleta
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Análise
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
                  <tr key={record.id} className="hover:bg-emerald-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                          <TestTube className="w-6 h-6 text-emerald-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900">{record.numeroAmostra}</div>
                          <div className="flex items-center text-xs text-gray-600 mt-1">
                            <MapPin className="w-3.5 h-3.5 mr-1" />
                            {record.localizacao.municipio}, {record.localizacao.provincia}
                          </div>
                          <div className="flex items-center text-xs text-gray-600">
                            <FileText className="w-3.5 h-3.5 mr-1" />
                            {record.codigoAmostra}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="space-y-1">
                        <div className="text-sm font-medium text-gray-900">
                          {formatDate(record.dataColeta)}
                        </div>
                        <div className="text-sm text-blue-600">
                          {record.culturaAtual}
                        </div>
                        <div className="text-xs text-gray-600">
                          {record.profundidadeColeta}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="space-y-1">
                        <div className="flex items-center text-xs text-gray-700">
                          <Microscope className="w-3.5 h-3.5 mr-1" />
                          {getLaboratorioLabel(record.laboratorio)}
                        </div>
                        <div className="flex items-center text-xs text-gray-700">
                          <User className="w-3.5 h-3.5 mr-1" />
                          {record.tecnicoResponsavel.nome}
                        </div>
                        <div className="text-xs text-start text-gray-600">    
                          {formatCurrency(record.custoAnalise)}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center">
                        <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(record.statusAnalise)}`}>
                          {getStatusLabel(record.statusAnalise)}
                        </span>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="p-2 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 rounded-full transition-colors"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
              <span className="ml-3 text-gray-600">Carregando testes...</span>
            </div>
          ) : (
            getCurrentItems().map((record) => (
              <div key={record.id} className="p-4 border-b border-gray-200 hover:bg-emerald-50 transition-colors">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <TestTube className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div className="flex-1 ml-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{record.numeroAmostra}</h3>
                        <div className="text-xs text-gray-500 mt-1">Código: {record.codigoAmostra}</div>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(record.statusAnalise)}`}>
                        {getStatusLabel(record.statusAnalise)}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="text-xs text-gray-700">
                        <strong>Local:</strong> {record.localizacao.municipio}, {record.localizacao.provincia}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Cultura:</strong> {record.culturaAtual} | <strong>Data:</strong> {formatDate(record.dataColeta)}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Laboratório:</strong> {getLaboratorioLabel(record.laboratorio)}
                      </div>
                      <div className="text-xs text-gray-700">
                        <strong>Técnico:</strong> {record.tecnicoResponsavel.nome}
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleViewDetails(record)}
                        className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full transition-colors"
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
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
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
                      : 'bg-white text-emerald-700 hover:bg-emerald-50 border border-emerald-200'
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
            <TestTube className="w-16 h-16 text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              {testesSolo.length === 0 ? 'Nenhum teste encontrado' : 'Nenhum resultado encontrado'}
            </h3>
            <p className="text-gray-500 max-w-md mb-6">
              {testesSolo.length === 0
                ? 'Ainda não existem testes de solo cadastrados no sistema.'
                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos ou remova os filtros aplicados.'
              }
            </p>
            {(searchTerm || selectedLaboratorio || selectedStatus) && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedLaboratorio('');
                  setSelectedStatus('');
                }}
                className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
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

export default GestaoTestesSolo;