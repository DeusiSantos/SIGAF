import {
  Activity,
  AlertCircle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  Droplets,
  Eye,
  FileText,
  Filter,
  Info,
  MapPin,
  Search,
  Trash2,
  Wrench,
  X
} from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../../core/components/CustomInput';
import { useIrrigacao } from '../../../hooks/useIrrigacao ';

import { exportToExcel } from '@/core/components/exportToExcel';


const GestaoSistemasIrrigacao = () => {
  const { irrigacoes, loading, error, deleteIrrigacao } = useIrrigacao();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTipo, setSelectedTipo] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [associacaoToDelete, setAssociacaoToDelete] = useState(null);
  const itemsPerPage = 8;
  const containerRef = useRef(null);
  const navigate = useNavigate();

  // Transform API data to match component structure
  const sistemasIrrigacao = useMemo(() => {
    return irrigacoes.map(item => ({
      id: item._id,
      codigoSistema: `SIR-${new Date(item.data_de_Registo).getFullYear()}-${String(item._id).padStart(3, '0')}`,
      nomeProjeto: item.nome_Local_se_aplic_vel || 'N/A',
      localizacao: {
        provincia: item.provincia || 'N/A',
        municipio: item.municipio || 'N/A',
        aldeia: item.aldeia || 'N/A',
        coordenadas: item.coordenadas_GPS || 'N/A'
      },
      fonteAgua: item.tipo || 'N/A',
      areaIrrigada: parseFloat(item._rea_irrig_vel_estimada_h) || 0,
      numeroFamiliasAtendidas: Math.floor(Math.random() * 50) + 10, // Dados fictícios
      culturasPrincipais: item.culturas_recomendadas ? item.culturas_recomendadas.split(',').map(c => c.trim()) : [],
      tipoIrrigacao: item.tipo_de_irriga_o_vi_vel || 'N/A',
      statusSistema: item.estado_de_conserva_o === 'Bom' ? 'ACTIVO' : item.estado_de_conserva_o === 'Regular' ? 'MANUTENCAO' : 'INATIVO',
      dataInstalacao: item.data_de_Registo,
      dataUltimaManutencao: item.data_de_Registo, // Dados fictícios
      proximaManutencao: new Date(new Date(item.data_de_Registo).setMonth(new Date(item.data_de_Registo).getMonth() + 3)).toISOString(), // Dados fictícios
      custoInstalacao: Math.floor(Math.random() * 1000000) + 500000, // Dados fictícios
      custoManutencaoMensal: Math.floor(Math.random() * 50000) + 20000, // Dados fictícios
      responsavelTecnico: {
        nome: item.equipe_t_cnica || 'N/A',
        telefone: 'N/A', // Dados fictícios
        instituicao: '' // Dados fictícios
      },
      cooperativaVinculada: 'Cooperativa Local', // Dados fictícios
      eficienciaHidrica: Math.floor(Math.random() * 30) + 60, // Dados fictícios
      producaoAnual: parseFloat(item.volume_til_estimado) || 0,
      observacoes: item.observa_es_Finais || 'Sem observações',
      problemasRecentes: item.desafios ? [item.desafios] : [],
      documentosAnexados: item._attachments?.map(att => att.filename) || []
    }));
  }, [irrigacoes]);

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
      const matchesSearch = !searchTerm ||
        record.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.codigoSistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.provincia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.municipio.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.aldeia.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.localizacao.coordenadas.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.fonteAgua.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.tipoIrrigacao.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.statusSistema.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.responsavelTecnico.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.culturasPrincipais.some(cultura => cultura.toLowerCase().includes(searchTerm.toLowerCase())) ||
        record.areaIrrigada.toString().includes(searchTerm) ||
        record.producaoAnual.toString().includes(searchTerm) ||
        (record.observacoes && record.observacoes.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (record.problemasRecentes && record.problemasRecentes.some(problema => problema.toLowerCase().includes(searchTerm.toLowerCase())));

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
  const handleExport = () => {
    const dataToExport = filteredRecords.map(record => ({

      'Nome Projeto': record.nomeProjeto,

      'Província': record.localizacao.provincia,
      'Município': record.localizacao.municipio,
      'Fonte Água': record.fonteAgua,
      'Área Irrigada (ha)': record.areaIrrigada,
      'Famílias Atendidas': record.numeroFamiliasAtendidas,
      'Tipo Irrigação': record.tipoIrrigacao,
      'Estado': record.statusSistema,
      'Data Instalação': record.dataInstalacao.split('T')[0],
      'Custo Instalação': record.custoInstalacao,
      'Responsável': record.responsavelTecnico.nome,
      'Cooperativa': record.cooperativaVinculada,
      'Eficiência (%)': record.eficienciaHidrica,
      'Produção Anual (t)': record.producaoAnual
    }));

    exportToExcel(dataToExport, 'irrigacao_sigaf', 'Sistemas de Irrigação', showToast);
  };

  // Ver detalhes do registro
  const handleViewDetails = (irrigacao) => {
    navigate(`/GerenciaSIGAF/gestao-agricultores/produtores/irrigacao/visualizarirrigacao/${irrigacao.id}`);
  };

  // Função para abrir modal de confirmação
  const openDeleteModal = (associacaoId) => {
    setAssociacaoToDelete(associacaoId);
    setShowDeleteModal(true);
  };

  // Função para fechar modal
  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setAssociacaoToDelete(null);
  };

  // Função para deletar sistema após confirmação
  const handleConfirmDelete = async () => {
    if (!associacaoToDelete) return;
    try {
      await deleteIrrigacao(associacaoToDelete);
      showToast('success', 'Excluído', 'Sistema excluído com sucesso!');
    } catch (err) {
      showToast('error', 'Erro', 'Erro ao excluir sistema.');
      console.error(err);
    } finally {
      closeDeleteModal();
    }
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



  // Modal de confirmação visual
  const DeleteConfirmModal = () => {
    if (!showDeleteModal) return null;
    const sistema = sistemasIrrigacao.find(c => c.id === associacaoToDelete);
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
          <p className="text-gray-600 text-center text-sm mb-4">
            Tem certeza que deseja excluir o sistema <span className="font-semibold text-red-600">{sistema?.nomeProjeto || 'Selecionado'}</span>?<br />
            Esta ação não pode ser desfeita. Todos os dados do sistema serão removidos permanentemente.
          </p>
          <div className="flex gap-3 mt-2 w-full">
            <button
              onClick={handleConfirmDelete}
              className="flex-1 p-2 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Sim, excluir
            </button>
            <button
              onClick={closeDeleteModal}
              className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toast />
      <DeleteConfirmModal />

      {/* Estatísticas */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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

        {/* <div className="bg-white rounded-xl shadow-md p-6">
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
        </div> */}
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        {/* Cabeçalho */}
        <div className="bg-gradient-to-r from-cyan-700 to-cyan-500 p-6 text-white">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
            <div>
              <h1 className="text-2xl font-bold">Gestãooo de Sistemas de Irrigação</h1>
              <p className="text-cyan-100 mt-1">Monitoramento e controle dos sistemas de irrigação implantados</p>
            </div>

            <div className="flex gap-4">


              <button
                onClick={handleExport}
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
                placeholder="Pesquisar em todos os campos..."
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
                onChange={(value) => setSelectedTipo(typeof value === 'object' ? value.value : value)}
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
                onChange={(value) => setSelectedStatus(typeof value === 'object' ? value.value : value)}
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
                    Acções
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {getCurrentItems().map((record) => (
                  <tr key={record.id} className="hover:bg-cyan-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center whitespace-nowrap">
                        <div className="w-12 h-12 bg-cyan-100 rounded-full flex items-center justify-center">
                          <Droplets className="w-6 h-6 text-cyan-600" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-semibold text-gray-900 capitalize">
                            {record.nomeProjeto.replace(/[-_]/g, ' ')}
                          </div>
                          <div className="flex items-center text-xs text-gray-600 mt-1 capitalize">
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
                        <div className="text-sm font-medium text-gray-900 capitalize">
                          {getTipoIrrigacaoLabel(record.tipoIrrigacao)}
                        </div>
                        <div className="text-sm text-green-600">
                          {record.areaIrrigada} hectares
                        </div>
                        <div className="text-xs text-gray-600 capitalize">
                          Fonte: {record.fonteAgua}
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-start">
                      <div className="space-y-1">
                        {/* <div className="flex items-center text-xs text-gray-700">
                          <Users className="w-3.5 h-3.5 mr-1" />
                          {record.numeroFamiliasAtendidas} famílias
                        </div> */}
                        {/* <div className="flex items-center text-xs text-gray-700">
                          <Thermometer className="w-3.5 h-3.5 mr-1" />
                          Eficiência: {record.eficienciaHidrica}%
                        </div> */}
                        <div className="text-xs text-start text-gray-600">
                          Produção: {record.producaoAnual}T/Ano
                        </div>
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
                        <button
                          onClick={() => openDeleteModal(record.id)}
                          className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                          title="Remover"
                        >
                          <Trash2 className="w-5 h-5" />
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
                        <strong>Área:</strong> {record.areaIrrigada} ha {/* | <strong>Famílias:</strong> {record.numeroFamiliasAtendidas} */}
                      </div>
                      <div className="text-xs text-gray-700">
                        {/* <strong>Eficiência:</strong> {record.eficienciaHidrica}% | */}<strong>Responsável:</strong> {record.responsavelTecnico.nome}
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