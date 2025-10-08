import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Plus,
  Download,
  X,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
  ChevronRight,
  ChevronLeft,
  Eye,
  Upload,
  TestTube,
  Clock,
  MapPin,
  Leaf,
  Calendar,
  User,
  FileText,
  Filter
} from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../components/CustomInput';
{/*const CustomInput = ({ type, label, value, onChange, options, required, errorMessage, disabled, placeholder, iconStart, helperText, rows, ...props }) => {
  const baseInputClasses = `w-full p-3 border rounded-xl transition-all ${errorMessage ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-emerald-500'
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
*/};

const GestaoTestesSolo = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [testesSolo, setTestesSolo] = useState([]);
  const [filterEstado, setFilterEstado] = useState('todos');
  const itemsPerPage = 8;

  // Dados mockados baseados na API
useEffect(() => {
  const fetchTestesSolo = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://mwangobrainsa-001-site2.mtempurl.com/api/testeDeAmostraDeSolo/all');
      setTestesSolo(response.data);
    } catch (error) {
      console.error('Erro ao buscar testes:', error);
      showToast('error', 'Erro', 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };
  fetchTestesSolo();
}, []);

  // Funções auxiliares para parsing de dados
  const parseCulturas = (culturasArray) => {
    if (!culturasArray || !Array.isArray(culturasArray) || culturasArray.length === 0) {
      return [];
    }
    
    try {
      // Se o primeiro elemento é uma string JSON, fazer parse
      if (typeof culturasArray[0] === 'string' && culturasArray[0].startsWith('[')) {
        const parsed = JSON.parse(culturasArray[0]);
        // Se é array de strings, retornar direto
        if (typeof parsed[0] === 'string') {
          return parsed;
        }
        // Se é array de objetos com label/value, extrair labels
        if (parsed[0]?.label) {
          return parsed.map(item => item.label || item.value);
        }
        return parsed;
      }
      // Se já é array de strings, retornar direto
      return culturasArray;
    } catch (e) {
      console.error('Erro ao fazer parse de culturas:', e);
      return culturasArray;
    }
  };

  // Validar se a data é válida
  const isValidDate = (dateString) => {
    if (!dateString) return false;
    const date = new Date(dateString);
    return date.getFullYear() > 2000;
  };

  // Formatar data
  const formatDate = (dateString) => {
    if (!dateString || !isValidDate(dateString)) return 'Não informada';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch {
      return 'Não informada';
    }
  };

  // Obter valor ou N/A
  const getValueOrNA = (value) => {
    if (value === null || value === undefined || value === '' || value === 0) {
      return 'N/A';
    }
    return value;
  };

  // Filtragem dos registros
  const filteredRecords = useMemo(() => {
    return testesSolo.filter(record => {
      // Filtro por estado
      const matchesEstado = filterEstado === 'todos' || 
        (record.estado || 'Pendente').toLowerCase() === filterEstado.toLowerCase();

      // Filtro por busca
      const searchLower = searchTerm.toLowerCase();
      const culturasAtuais = parseCulturas(record.cultura_Actual);
      const culturasAnteriores = parseCulturas(record.cultura_Anterior);
      
      const matchesSearch = !searchTerm ||
        record._id?.toString().includes(searchLower) ||
        record.tecnico_Responsavel?.toLowerCase().includes(searchLower) ||
        culturasAtuais?.some(c => c?.toLowerCase().includes(searchLower)) ||
        culturasAnteriores?.some(c => c?.toLowerCase().includes(searchLower)) ||
        record.tipo_de_Solo?.toLowerCase().includes(searchLower) ||
        record.profundidade_da_Coleta?.toLowerCase().includes(searchLower) ||
        record.c_digo_Supervisor?.toLowerCase().includes(searchLower);

      return matchesEstado && matchesSearch;
    });
  }, [testesSolo, searchTerm, filterEstado]);

  // Reset página quando filtros mudarem
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, filterEstado]);

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

  const handleViewAmostra = (id) => {
    showToast('info', 'Visualizar', `Abrindo detalhes da amostra #${id}`);
  };

  // Paginação
  const totalPages = Math.ceil(filteredRecords.length / itemsPerPage);
  const getCurrentItems = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredRecords.slice(startIndex, endIndex);
  };

  // Labels para métodos de coleta
  const getMetodoColetaLabel = (metodo) => {
    const labels = {
      'tradagem': 'Tradagem',
      'perfil_solo': 'Perfil de Solo',
      'amostragem_simples': 'Amostragem Simples',
      'amostragem_composta': 'Amostragem Composta'
    };
    return labels[metodo] || getValueOrNA(metodo);
  };

  // Labels para tipo de solo
  const getTipoSoloLabel = (tipo) => {
    const labels = {
      'arenoso': 'Arenoso',
      'argiloso': 'Argiloso',
      'franco': 'Franco',
      'franco_arenoso': 'Franco-Arenoso',
      'franco_argiloso': 'Franco-Argiloso'
    };
    return labels[tipo] || getValueOrNA(tipo);
  };

  // Labels para cor do solo
  const getCorSoloLabel = (cor) => {
    const labels = {
      'escuro_preto': 'Escuro/Preto',
      'marrom': 'Marrom',
      'vermelho': 'Vermelho',
      'amarelo': 'Amarelo',
      'cinza': 'Cinza'
    };
    return labels[cor] || getValueOrNA(cor);
  };

  // Badge de estado
  const getEstadoBadge = (estado) => {
    const estados = {
      'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-200',
      'Em Análise': 'bg-blue-100 text-blue-800 border-blue-200',
      'Concluído': 'bg-green-100 text-green-800 border-green-200',
      'Cancelado': 'bg-red-100 text-red-800 border-red-200'
    };
    
    const estadoAtual = estado || 'Pendente';
    const colorClass = estados[estadoAtual] || 'bg-gray-100 text-gray-800 border-gray-200';
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${colorClass}`}>
        {estadoAtual}
      </span>
    );
  };

  // Exportar dados
  const handleExportData = () => {
    try {
      const dataToExport = filteredRecords.map(record => ({
        'ID': record._id,
        'Técnico Responsável': getValueOrNA(record.tecnico_Responsavel),
        'Supervisor': getValueOrNA(record.c_digo_Supervisor),
        'Data da Coleta': formatDate(record.data_da_Coleta),
        'Estado': record.estado || 'Pendente',
        'Pertence a Produtor': getValueOrNA(record.este_solo_pertence_a_um_produt),
        'Código Produtor': record.c_digo_do_ > 0 ? record.c_digo_do_ : 'N/A',
        'Profundidade': getValueOrNA(record.profundidade_da_Coleta),
        'Método de Coleta': getMetodoColetaLabel(record.m_todo_de_Coleta),
        'Culturas Atuais': parseCulturas(record.cultura_Actual).join(', ') || 'N/A',
        'Cultura Anterior': parseCulturas(record.cultura_Anterior).join(', ') || 'N/A',
        'Tipo de Solo': getTipoSoloLabel(record.tipo_de_Solo),
        'Cor do Solo': getCorSoloLabel(record.cor_do_Solo),
        'Textura': getValueOrNA(record.textura),
        'Drenagem': getValueOrNA(record.drenagem),
        'Observações': getValueOrNA(record.observa_es_Gerais)
      }));

      const csv = [
        Object.keys(dataToExport[0]).join(','),
        ...dataToExport.map(row => Object.values(row).map(v => `"${v}"`).join(','))
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
      navigate(`/GerenciaRNPA/gestao-agricultores/AmostraDeSolo/visualizar/${record}`);

  };

  const handleNovoTeste = () => {
    showToast('info', 'Novo Teste', 'Redirecionando para formulário de nova coleta...');
  };

  const handleLancarResultados = (amostraId) => {
      navigate(`/GerenciaRNPA/lancamento-resultados/${amostraId}`);
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

    const culturasAtuais = parseCulturas(selectedRecord.cultura_Actual);
    const culturasAnteriores = parseCulturas(selectedRecord.cultura_Anterior);

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-6 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                Amostra #{selectedRecord._id}
              </h2>
              {getEstadoBadge(selectedRecord.estado)}
            </div>
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
                <div><strong>ID:</strong> {selectedRecord._id}</div>
                <div><strong>Estado:</strong> {selectedRecord.estado || 'Pendente'}</div>
                <div><strong>Data da Coleta:</strong> {formatDate(selectedRecord.data_da_Coleta)}</div>
                <div><strong>Pertence a Produtor:</strong> {getValueOrNA(selectedRecord.este_solo_pertence_a_um_produt)}</div>
                {selectedRecord.c_digo_do_ > 0 && (
                  <div><strong>Código do Produtor:</strong> {selectedRecord.c_digo_do_}</div>
                )}
              </div>
            </div>

            {/* Dados da Coleta */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <Leaf className="w-5 h-5 mr-2 text-blue-600" />
                Dados da Coleta
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Profundidade:</strong> {getValueOrNA(selectedRecord.profundidade_da_Coleta)}</div>
                <div><strong>Método de Coleta:</strong> {getMetodoColetaLabel(selectedRecord.m_todo_de_Coleta)}</div>
                <div><strong>Tipo de Solo:</strong> {getTipoSoloLabel(selectedRecord.tipo_de_Solo)}</div>
                <div><strong>Cor do Solo:</strong> {getCorSoloLabel(selectedRecord.cor_do_Solo)}</div>
                <div><strong>Textura:</strong> {getValueOrNA(selectedRecord.textura)}</div>
                <div><strong>Drenagem:</strong> {getValueOrNA(selectedRecord.drenagem)}</div>
              </div>
            </div>

            {/* Culturas */}
            {(culturasAtuais.length > 0 || culturasAnteriores.length > 0) && (
              <div className="bg-green-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                  <Leaf className="w-5 h-5 mr-2 text-green-600" />
                  Culturas
                </h3>
                <div className="space-y-3 text-sm">
                  {culturasAtuais.length > 0 && (
                    <div>
                      <strong>Culturas Atuais:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {culturasAtuais.map((cultura, index) => (
                          <span key={index} className="bg-white px-3 py-1 rounded-full text-xs border border-green-200">
                            {cultura}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {culturasAnteriores.length > 0 && (
                    <div>
                      <strong>Culturas Anteriores:</strong>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {culturasAnteriores.map((cultura, index) => (
                          <span key={index} className="bg-white px-3 py-1 rounded-full text-xs border border-green-200">
                            {cultura}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Responsável Técnico */}
            <div className="bg-indigo-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <User className="w-5 h-5 mr-2 text-indigo-600" />
                Responsável Técnico
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div><strong>Técnico:</strong> {getValueOrNA(selectedRecord.tecnico_Responsavel)}</div>
                <div><strong>Supervisor:</strong> {getValueOrNA(selectedRecord.c_digo_Supervisor)}</div>
              </div>
            </div>

            {/* Observações */}
            {selectedRecord.observa_es_Gerais && (
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-gray-600" />
                  Observações
                </h3>
                <p className="text-sm text-gray-700">{selectedRecord.observa_es_Gerais}</p>
              </div>
            )}

            {/* Fotografia */}
            {selectedRecord.upload_da_Fotografia_da_Amostra && (
              <div className="bg-cyan-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2 flex items-center">
                  <Upload className="w-5 h-5 mr-2 text-cyan-600" />
                  Arquivo Anexado
                </h3>
                <span className="bg-white px-3 py-1 rounded-full text-xs border border-cyan-200">
                  {selectedRecord.upload_da_Fotografia_da_Amostra}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
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
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pendentes</p>
              <p className="text-2xl font-bold text-gray-900">
                {testesSolo.filter(s => (s.estado || 'Pendente') === 'Pendente').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-full">
              <Loader className="w-6 h-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Em Análise</p>
              <p className="text-2xl font-bold text-gray-900">
                {testesSolo.filter(s => s.estado === 'Em Análise').length}
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
              <p className="text-sm font-medium text-gray-500">Concluídos</p>
              <p className="text-2xl font-bold text-gray-900">
                {testesSolo.filter(s => s.estado === 'Concluído').length}
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
                onClick={handleNovoTeste}
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

        {/* Barra de filtros */}
        <div className="p-6 border-b border-gray-200 bg-white space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <CustomInput
              type="text"
              placeholder="Pesquisar por ID, técnico, cultura, tipo de solo..."
              value={searchTerm}
              onChange={(value) => setSearchTerm(value)}
              iconStart={<Search size={18} />}
            />

            <CustomInput
              type="select"
              placeholder="Filtrar por estado"
              value={filterEstado}
              onChange={(value) => setFilterEstado(value)}
              iconStart={<Filter size={18} />}
              options={[
                { value: 'todos', label: 'Todos os Estados' },
                { value: 'pendente', label: 'Pendente' },
                { value: 'em análise', label: 'Em Análise' },
                { value: 'concluído', label: 'Concluído' },
                { value: 'cancelado', label: 'Cancelado' }
              ]}
            />
          </div>
        </div>

        {/* Tabela - Desktop */}
        <div className="hidden md:block">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
              <span className="ml-3 text-gray-600">Carregando testes...</span>
            </div>
          ) : (
            <table className="w-full border-collapse">
              <thead className="bg-gray-50 sticky top-0 z-10">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    ID / Técnico
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Coleta
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Solo
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Culturas
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Estado
                  </th>
                  <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    Ações
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {getCurrentItems().map((record) => {
                  const culturasAtuais = parseCulturas(record.cultura_Actual);
                  
                  return (
                    <tr key={record._id} className="hover:bg-emerald-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                            <TestTube className="w-6 h-6 text-emerald-600" />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-semibold text-gray-900">#{record._id}</div>
                            <div className="flex items-center text-xs text-gray-600 mt-1">
                              <User className="w-3.5 h-3.5 mr-1" />
                              {getValueOrNA(record.tecnico_Responsavel)}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-start whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="flex items-start text-sm text-gray-900">
                            <Calendar className="w-3.5 h-3.5 mr-1" />
                            {formatDate(record.data_da_Coleta)}
                          </div>
                          <div className="text-xs text-gray-600">
                            {getValueOrNA(record.profundidade_da_Coleta)}
                          </div>
                          <div className="text-xs text-gray-600">
                            {getMetodoColetaLabel(record.m_todo_de_Coleta)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-4 text-start whitespace-nowrap">
                        <div className="space-y-1">
                          <div className="text-sm font-medium text-gray-900">
                            {getTipoSoloLabel(record.tipo_de_Solo)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Cor: {getCorSoloLabel(record.cor_do_Solo)}
                          </div>
                          <div className="text-xs text-gray-600">
                            Drenagem: {getValueOrNA(record.drenagem)}
                          </div>
                        </div>
                      </td>

                      <td className="px-6 text-start py-4">
                        <div className="space-y-1">
                          {culturasAtuais.length > 0 ? (
                            <div className="flex flex-wrap gap-1">
                              {culturasAtuais.slice(0, 2).map((cultura, idx) => (
                                <span key={idx} className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                                  {cultura}
                                </span>
                              ))}
                              {culturasAtuais.length > 2 && (
                                <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full">
                                  +{culturasAtuais.length - 2}
                                </span>
                              )}
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Nenhuma cultura</span>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap text-center">
                        {getEstadoBadge(record.estado)}
                      </td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center justify-center space-x-1">
                          <button
                            onClick={() => handleViewDetails(record._id)}
                            className="p-2 hover:bg-emerald-100 text-emerald-600 hover:text-emerald-800 rounded-full transition-colors"
                            title="Ver detalhes"
                          >
                            <Eye className="w-5 h-5" />
                          </button>

                          <button
                            onClick={() => handleLancarResultados(record._id)}
                            className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                            title="Lançar resultados"
                          >
                            <Upload className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        {/* Visualização em cards para mobile */}
        <div className="md:hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader className="w-12 h-12 text-emerald-600 animate-spin" />
              <span className="ml-3 text-gray-600">Carregando...</span>
            </div>
          ) : (
            getCurrentItems().map((record) => {
              const culturasAtuais = parseCulturas(record.cultura_Actual);
              
              return (
                <div key={record._id} className="p-4 border-b border-gray-200 hover:bg-emerald-50 transition-colors">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <TestTube className="w-6 h-6 text-emerald-600" />
                    </div>
                    <div className="flex-1 ml-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">#{record._id}</h3>
                          <div className="text-xs text-gray-500 mt-1">
                            {getValueOrNA(record.tecnico_Responsavel)}
                          </div>
                        </div>
                        {getEstadoBadge(record.estado)}
                      </div>

                      <div className="mt-3 space-y-2">
                        <div className="text-xs text-gray-700">
                          <strong>Data:</strong> {formatDate(record.data_da_Coleta)}
                        </div>
                        <div className="text-xs text-gray-700">
                          <strong>Solo:</strong> {getTipoSoloLabel(record.tipo_de_Solo)}
                        </div>
                        {culturasAtuais.length > 0 && (
                          <div className="text-xs text-gray-700">
                            <strong>Culturas:</strong> {culturasAtuais.join(', ')}
                          </div>
                        )}
                      </div>

                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => handleViewDetails(record)}
                          className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-full transition-colors"
                          title="Ver detalhes"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          onClick={() => handleLancarResultados(record._id)}
                          className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                          title="Lançar resultados"
                        >
                          <Upload className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
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
                : 'Não foram encontrados resultados para a sua pesquisa. Tente outros termos.'
              }
            </p>
            {(searchTerm || filterEstado !== 'todos') && (
              <button
                onClick={() => {
                  setSearchTerm('');
                  setFilterEstado('todos');
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