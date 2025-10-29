import {
    Activity,
    AlertCircle,
    AlertTriangle,
    BarChart3,
    Bug,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileText,
    Heart,
    MapPin,
    MoreVertical,
    RefreshCw,
    Search,
    Tractor,
    Trash2,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../../core/components/CustomInput';


const GestaoPragas = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedTipoProducao, setSelectedTipoProducao] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [pragas, setPragas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [pragaToDelete, setPragaToDelete] = useState(null);
    const itemsPerPage = 5;
    const containerRef = useRef(null);

    // Lista de províncias angolanas
    const provincias = [
        'LUANDA', 'BENGUELA', 'HUAMBO', 'HUÍLA', 'CABINDA', 'UÍGE', 'ZAIRE',
        'MALANJE', 'LUNDA NORTE', 'LUNDA SUL', 'MOXICO', 'CUANDO CUBANGO',
        'CUNENE', 'NAMIBE', 'BIÉ', 'CUANZA NORTE', 'CUANZA SUL'
    ];

    // Buscar dados da API
    const fetchPragas = async () => {
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

            console

            // Filtrar dados válidos e mapear para estrutura compatível
            const dadosValidos = dados.filter(item =>
                item &&
                item.data_de_Registro &&
                item.data_de_Registro !== "0001-01-01T00:00:00"
            );

            const pragasProcessadas = dadosValidos.map((item, index) => {
                const tipoProducao = item.que_tipo_de_servi_o_deseja_mon === 'agrícultura' ? 'Agrícola' :
                    item.que_tipo_de_servi_o_deseja_mon === 'pecuária' ? 'Pecuária' : 'Outros';

                // Determinar status baseado nos dados da API
                let status = 'NOVO';
                if (item.necessita_apoio_t_cnico === 'sim') {
                    status = item.grau_do_Dano_001 === 'grave' ? 'CRITICO' : 'EM_TRATAMENTO';
                } else {
                    status = 'CONTROLADO';
                }

                return {
                    id: item._id || index + 1,
                    nomePraga: item.nome_da_Praga || 'Praga não especificada',
                    nomeLocalPraga: item.nome_Local_da_Praga || item.nome_da_Praga_Doen_a || 'N/A',
                    tipoProducao: tipoProducao,
                    culturaAfetada: item.tipo_de_culturas ? [item.tipo_de_culturas] :
                        item.esp_cie_Animal_Afetada ? [item.esp_cie_Animal_Afetada] : ['N/A'],
                    especieAnimalAfetada: item.esp_cie_Animal_Afetada ? [item.esp_cie_Animal_Afetada] : null,
                    nomePropriedade: item.nome_da_Propriedade,
                    nomeFazenda: item.nome_da_Fazenda,
                    nomeResponsavel: item.nome_do_T_cnico_ou_Produtor || 'Não informado',
                    telefone: item.telefone || 'N/A',
                    email: 'N/A', // API não fornece email
                    provincia: item.provincia?.toUpperCase() || 'N/A',
                    municipio: item.municipio || 'N/A',
                    comuna: item.comuna || 'N/A',
                    areaTotalCultivada: parseFloat(item.rea_Total_Cultivada_ha) || 0,
                    percentagemAreaAfetada: parseFloat(item.percentagem_da_rea_Afetada_) || 0,
                    numeroTotalAnimais: parseInt(item.n_mero_Total_de_Animais) || 0,
                    numeroAnimaisAfetados: parseInt(item.n_mero_de_Animais_Afetados) || 0,
                    grauDano: item.grau_do_Dano_001 === 'grave' ? 'Grave' :
                        item.grau_do_Dano_001 === 'moderado' ? 'Moderado' :
                            item.grau_do_Dano_001 === 'leve' ? 'Leve' : 'Regina',
                    dataRegistro: item.data_de_Registro,
                    dataPrimeiraObservacao: item.data_da_Primeira_Observa_o || item.data_da_Primeira_Observa_o_001,
                    aplicouMedidaControle: item.aplicou_alguma_medida_de_contr === 'sim',
                    tipoMedidaAplicada: item.tipo_de_Medida_Aplicada || 'N/A',
                    resultadoMedida: item.resultado_da_Medida || 'N/A',
                    aplicouTratamento: item.aplicou_algum_tratamento === 'sim',
                    tipoTratamento: item.tipo_de_Tratamento_Usado || 'N/A',
                    resultadoTratamento: item.resultado_do_Tratamento || 'N/A',
                    necessitaApoioTecnico: item.necessita_apoio_t_cnico === 'sim',
                    necessitaApoioVeterinario: item.necessita_apoio_veterin_rio === 'sim',
                    status: status,
                    valorEstimado: parseFloat(item.valor_Estimado_Agr_colas) || parseFloat(item.valor_Estimado_da_Pecu_ria) || 0,
                    observacoes: item.observa_es_adicionais || item.observa_es_adicionais_001 || 'N/A'
                };
            });

            setPragas(pragasProcessadas);
            setLastUpdate(new Date());

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
        } finally {
            setLoading(false);
        }
    };

    // Ajustar altura do conteúdo
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const headerHeight = 240;
                const windowHeight = window.innerHeight;
                const availableHeight = windowHeight - headerHeight;
                setContentHeight(`${availableHeight}px`);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Carregar dados ao montar componente
    useEffect(() => {
        fetchPragas();
    }, []);

    // Limpar timeout
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

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

    // Alternar status da ocorrência
    const toggleStatus = (pragaId, currentStatus) => {
        const statusCycle = {
            'NOVO': 'EM_TRATAMENTO',
            'EM_TRATAMENTO': 'CONTROLADO',
            'CONTROLADO': 'NOVO',
            'CRITICO': 'EM_TRATAMENTO'
        };

        const newStatus = statusCycle[currentStatus] || 'NOVO';

        setPragas(prevPragas =>
            prevPragas.map(praga =>
                praga.id === pragaId ? { ...praga, status: newStatus } : praga
            )
        );

        showToast(
            'success',
            'Status Atualizado',
            `Ocorrência marcada como ${getStatusLabel(newStatus)}`
        );
    };

    // Função para abrir modal de confirmação
    const openDeleteModal = (pragaId) => {
        setPragaToDelete(pragaId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setPragaToDelete(null);
    };

    // Função para deletar praga após confirmação
    const handleConfirmDelete = async () => {
        if (!pragaToDelete) return;
        try {
            const response = await fetch(`https://mwangobrainsa-001-site2.mtempurl.com/api/pragas/${pragaToDelete}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.ok) {
                setPragas(prevPragas => prevPragas.filter(praga => praga.id !== pragaToDelete));
                showToast('success', 'Excluído', 'Ocorrência de praga excluída com sucesso!');
            } else {
                throw new Error('Erro ao excluir');
            }
        } catch (error) {
            console.error('Erro ao excluir praga:', error);
            showToast('error', 'Erro', 'Erro ao excluir ocorrência de praga.');
        } finally {
            closeDeleteModal();
        }
    };

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const praga = pragas.find(p => p.id === pragaToDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir a ocorrência <span className="font-semibold text-red-600">{praga?.nomePraga || 'Selecionada'}</span>?<br />
                        Esta ação não pode ser desfeita. Todos os dados da ocorrência serão removidos permanentemente.
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

    // Obter label do status
    const getStatusLabel = (status) => {
        const statusLabels = {
            'NOVO': 'Novo',
            'EM_TRATAMENTO': 'Em Tratamento',
            'CONTROLADO': 'Controlado',
            'CRITICO': 'Crítico'
        };
        return statusLabels[status] || status;
    };

    // Obter cores do status
    const getStatusColors = (status) => {
        const statusColors = {
            'NOVO': 'bg-blue-100 text-blue-800 border-blue-300',
            'EM_TRATAMENTO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'CONTROLADO': 'bg-green-100 text-green-800 border-green-300',
            'CRITICO': 'bg-red-100 text-red-800 border-red-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Calcular indicadores com base nos dados da API
    const totalOcorrencias = pragas.length;
    const totalLeves = pragas.filter(p => p.grauDano === 'Leve').length;
    const totalModerados = pragas.filter(p => p.grauDano === 'Moderado').length;
    const totalGraves = pragas.filter(p => p.grauDano === 'Grave').length;
    const totalControlados = pragas.filter(p => p.status === 'CONTROLADO').length;

    // Navegação (simulada)
    const handleViewPraga = (produtorId) => {
        navigate(`/GerenciaSIGAF/painel-monitoramento/praga/visualizar/${produtorId}`);
    };

    const handleEditPraga = () => {
        showToast('info', 'Edição', 'Funcionalidade em desenvolvimento');
    };

    const handleDeletePraga = () => {
        showToast('info', 'Remoção', 'Funcionalidade em desenvolvimento');
    };

    const handleRelatorios = () => {
        showToast('info', 'Relatórios', 'Funcionalidade em desenvolvimento');
    };

    const handleMedidasControle = () => {
        showToast('info', 'Medidas de Controle', 'Funcionalidade em desenvolvimento');
    };

    const handleAcompanhamento = () => {
        showToast('info', 'Acompanhamento', 'Funcionalidade em desenvolvimento');
    };

    // Filtragem das ocorrências
    const filteredPragas = pragas.filter(praga => {
        const matchesSearch = praga.nomePraga.toLowerCase().includes(searchTerm.toLowerCase()) ||
            praga.nomeResponsavel.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (praga.nomePropriedade && praga.nomePropriedade.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (praga.nomeFazenda && praga.nomeFazenda.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesProvincia = !selectedProvincia || praga.provincia === selectedProvincia;
        const matchesTipoProducao = !selectedTipoProducao || praga.tipoProducao === selectedTipoProducao;
        const matchesStatus = !selectedStatus || praga.status === selectedStatus;

        return matchesSearch && matchesProvincia && matchesTipoProducao && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredPragas.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredPragas.slice(startIndex, endIndex);
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Relatório Detalhado', icon: <FileText size={16} />, action: handleRelatorios },
        { label: 'Medidas de Controle', icon: <Activity size={16} />, action: handleMedidasControle },
        { label: 'Acompanhamento', icon: <BarChart3 size={16} />, action: handleAcompanhamento }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString || dateString === "0001-01-01T00:00:00") return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Formatar valor
    const formatCurrency = (value) => {
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA',
            minimumFractionDigits: 0
        }).format(value);
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
                icon = <AlertCircle className="w-5 h-5" />;
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

    // Menu dropdown de ações
    const ActionMenu = ({ praga }) => {
        const [isOpen, setIsOpen] = useState(false);

        return (
            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    title="Mais ações"
                >
                    <MoreVertical className="w-5 h-5 text-gray-600" />
                </button>

                {isOpen && (
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {actionItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                        item.action(praga.id);
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="mr-2 text-blue-500">{item.icon}</span>
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-lg text-gray-600">Carregando dados de pragas...</p>
                    <p className="mt-2 text-sm text-gray-500">Sistema de Gestão de Pragas - SIGAF Angola</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-center max-w-md">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-lg text-gray-600 mb-2">Erro ao carregar dados</p>
                    <p className="text-sm text-gray-500 mb-4">{error}</p>
                    <button
                        onClick={fetchPragas}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tentar Novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6" ref={containerRef}>
            <Toast />

            <div className="w-full flex justify-center bg-transparent pb-[30px] pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 w-full">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{totalOcorrencias}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Clock className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Leves</p>
                                <p className="text-2xl font-bold text-gray-900">{totalLeves}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Moderados</p>
                                <p className="text-2xl font-bold text-gray-900">{totalModerados}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Controlados</p>
                                <p className="text-2xl font-bold text-gray-900">{totalControlados}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <X className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Graves</p>
                                <p className="text-2xl font-bold text-gray-900">{totalGraves}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full border border-gray-200 bg-white rounded-xl shadow-md overflow-hidden">
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold flex items-center">
                                <Bug className="w-8 h-8 mr-3" />
                                Gestão de Monitoramento de Pragas
                            </h1>
                            <p className="text-blue-100 mt-2">
                                Última atualização: {lastUpdate.toLocaleString('pt-BR')}
                                • {pragas.length} ocorrências registradas
                            </p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={fetchPragas}
                                className="inline-flex items-center px-4 py-2 bg-white bg-opacity-20 text-white rounded-lg hover:bg-opacity-30 transition-colors shadow-sm font-medium"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Atualizar
                            </button>
                            <button
                                onClick={() => showToast('info', 'Exportar', 'Funcionalidade em desenvolvimento')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de ferramentas */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Busca */}
                        <div>
                            <CustomInput
                                type="text"
                                placeholder="Buscar por praga, responsável ou propriedade..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Província */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Província"
                                value={selectedProvincia ? { label: selectedProvincia, value: selectedProvincia } : null}
                                options={[
                                    { label: 'Todas as Províncias', value: '' },
                                    ...provincias.map(provincia => ({
                                        label: provincia,
                                        value: provincia
                                    }))
                                ]}
                                onChange={(option) => setSelectedProvincia(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo de Produção */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Produção"
                                value={selectedTipoProducao ? { label: selectedTipoProducao, value: selectedTipoProducao } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    { label: 'Agrícola', value: 'Agrícola' },
                                    { label: 'Pecuária', value: 'Pecuária' },
                                    { label: 'Outros', value: 'Outros' }
                                ]}
                                onChange={(option) => setSelectedTipoProducao(option?.value || '')}
                                iconStart={<Activity size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status"
                                value={selectedStatus ? { label: getStatusLabel(selectedStatus), value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos os Status', value: '' },
                                    { label: 'Novo', value: 'NOVO' },
                                    { label: 'Em Tratamento', value: 'EM_TRATAMENTO' },
                                    { label: 'Controlado', value: 'CONTROLADO' },
                                    { label: 'Crítico', value: 'CRITICO' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<AlertCircle size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela - Desktop */}
                <div className="hidden md:block overflow-auto" style={{ maxHeight: contentHeight }}>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Praga/Doença
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Produção Acfetada
                                </th>
                                {/* <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Responsável
                                </th>*/}
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Impacto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acções
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {getCurrentItems().map((praga) => (
                                <tr key={praga.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                <Bug className="h-5 w-5 text-blue-600" />
                                            </div>
                                            <div className="ml-4 text-start">
                                                <div className="text-sm font-semibold text-gray-900">{praga.nomePraga}</div>
                                                <div className="text-xs text-gray-500 mt-1">Local: {praga.nomeLocalPraga}</div>
                                                <div className="text-xs text-gray-500">
                                                    Reg.: {formatDate(praga.dataRegistro)}
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-start text-xs text-gray-700">
                                                {praga.tipoProducao === 'Agrícola' ? (
                                                    <Tractor className="w-4 h-4 mr-2 text-green-500" />
                                                ) : praga.tipoProducao === 'Pecuária' ? (
                                                    <Heart className="w-4 h-4 mr-2 text-red-500" />
                                                ) : (
                                                    <Activity className="w-4 h-4 mr-2 text-blue-500" />
                                                )}
                                                {praga.tipoProducao}
                                            </div>
                                            <div className="text-xs text-start text-gray-600">
                                                {praga.culturaAfetada ? praga.culturaAfetada.join(', ') :
                                                    praga.especieAnimalAfetada ? praga.especieAnimalAfetada.join(', ') : 'N/A'}
                                            </div>
                                            <div className="text-xs text-start text-gray-500">
                                                {praga.nomePropriedade || praga.nomeFazenda || 'N/A'}
                                            </div>
                                        </div>
                                    </td>

                                    {/*<td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-start text-xs text-gray-700">
                                                <User className="w-4 h-4 mr-2 text-blue-500" />
                                                {praga.nomeResponsavel}
                                            </div>
                                            <div className="flex items-start text-xs text-gray-700">
                                                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                                {praga.telefone}
                                            </div>
                                        </div>
                                    </td> */}

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-start text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {praga.municipio}, {praga.provincia}
                                            </div>
                                            <div className="text-xs text-start text-gray-600">
                                                {praga.comuna}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-flex items-start px-2 py-1 rounded-full text-xs font-medium border ${praga.grauDano === 'Grave' ? 'bg-red-100 text-red-800 border-red-300' :
                                                praga.grauDano === 'Moderado' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                                    'bg-green-100 text-green-800 border-green-300'
                                                }`}>
                                                {praga.grauDano}
                                            </div>
                                            {praga.valorEstimado > 0 && (
                                                <div className="text-xs text-gray-500">
                                                    {formatCurrency(praga.valorEstimado)}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col items-start space-y-2">
                                            <div className={`inline-flex items-start px-2 py-1 rounded-full text-xs font-medium border ${getStatusColors(praga.status)}`}>
                                                {getStatusLabel(praga.status)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewPraga(praga.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(praga.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu praga={praga} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((praga) => (
                        <div key={praga.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Bug className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{praga.nomePraga}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Local: {praga.nomeLocalPraga}</div>
                                            <div className="text-xs text-gray-500">Resp.: {praga.nomeResponsavel}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColors(praga.status)}`}>
                                            {getStatusLabel(praga.status)}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{praga.municipio}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            {praga.tipoProducao === 'Agrícola' ? (
                                                <Tractor className="w-3.5 h-3.5 mr-1 text-green-500" />
                                            ) : praga.tipoProducao === 'Pecuária' ? (
                                                <Heart className="w-3.5 h-3.5 mr-1 text-red-500" />
                                            ) : (
                                                <Activity className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            )}
                                            {praga.tipoProducao}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {formatDate(praga.dataRegistro)}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <AlertCircle className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {praga.grauDano}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewPraga(praga.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(praga.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <button
                                                onClick={() => toggleStatus(praga.id, praga.status)}
                                                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                                            >
                                                Alterar Status
                                            </button>
                                            <ActionMenu praga={praga} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Paginação */}
                <div className="px-6 py-4 border-t border-gray-200 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                        <div className="text-sm text-gray-700">
                            Mostrando{' '}
                            <span className="font-medium">{filteredPragas.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredPragas.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredPragas.length}</span>
                            {' '}resultados
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                                    }`}
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
                                        : 'bg-white text-blue-700 hover:bg-blue-50 border border-blue-200'
                                    }`}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nenhum resultado encontrado */}
                {filteredPragas.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Bug className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma ocorrência encontrada</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedProvincia || selectedTipoProducao || selectedStatus ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedProvincia('');
                                    setSelectedTipoProducao('');
                                    setSelectedStatus('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button
                                onClick={() => showToast('info', 'Cadastro', 'Funcionalidade em desenvolvimento')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Registrar ocorrência
                            </button>
                        )}
                    </div>
                )}
            </div>
            <DeleteConfirmModal />
        </div>
    );
};

export default GestaoPragas;