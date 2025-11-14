import {
    Activity,
    AlertCircle,
    Award,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    DollarSign,
    Download,
    Eye,
    FileText,
    Info,
    Loader,
    MoreVertical,
    Package,
    RefreshCw,
    Search,
    Share2,
    Trash2,
    Users,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../core/components/CustomInput';
import api from '../../../../core/services/api';



const GestaoIncentivos = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedFormaPagamento, setSelectedFormaPagamento] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [incentivos, setIncentivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const itemsPerPage = 8;
    const containerRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [incentivoToDelete, setIncentivoToDelete] = useState(null);

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

    // Buscar incentivos da API
    useEffect(() => {
        fetchIncentivos();
    }, []);

    const fetchIncentivos = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://mwangobrainsa-001-site2.mtempurl.com/api/incentivo/all');

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setIncentivos(data);
        } catch (error) {
            console.error('Erro ao buscar incentivos:', error);
            setError(error.message);
            showToast('error', 'Erro', 'Erro ao carregar incentivos da API');
        } finally {
            setLoading(false);
        }
    };

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

    // Filtragem dos incentivos
    const filteredIncentivos = incentivos.filter(incentivo => {
        const matchesSearch = incentivo.nomeDoIncentivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incentivo.descricaoDoIncentivo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            incentivo.nomeDoProduto?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = !selectedTipo || incentivo.tipoDoIncentivo === selectedTipo;
        const matchesFormaPagamento = !selectedFormaPagamento || incentivo.formaDePagamento === selectedFormaPagamento;

        return matchesSearch && matchesTipo && matchesFormaPagamento;
    });

    // Paginação
    const totalPages = Math.ceil(filteredIncentivos.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredIncentivos.slice(startIndex, endIndex);
    };

    // Navegação - ATUALIZADA
    const handleViewIncentivo = (incentivoId) => {
        navigate(`/GerenciaSIGAF/gestao-agricultores/incentivos/visualizar/${incentivoId}`);
    };

    const handleEditIncentivo = (incentivoId) => {
        navigate(`/incentivos/editar/${incentivoId}`);
    };

    const handleRelatorios = (incentivoId) => {
        navigate(`/incentivos/relatorios/${incentivoId}`);
    };

    const handleDistribuicao = (incentivoId) => {
        navigate(`/incentivos/distribuicao/${incentivoId}`);
    };

    const handleBeneficiarios = (incentivoId) => {
        navigate(`/incentivos/beneficiarios/${incentivoId}`);
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorios },
        { label: 'Distribuição', icon: <Share2 size={16} />, action: handleDistribuicao },
        { label: 'Beneficiários', icon: <Users size={16} />, action: handleBeneficiarios }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Formatar valor
    const formatCurrency = (value, currency = 'AOA') => {
        if (!value) return '0';

        // Se vier como string tipo "1 200 000 000 000"
        const numericValue = typeof value === 'string' ? Number(value.replace(/\s+/g, '')) : value;

        const absValue = Math.abs(numericValue);
        let formattedValue = '';
        let suffix = '';

        if (absValue >= 1_000_000_000_000) {
            formattedValue = (numericValue / 1_000_000_000_000).toFixed(1);
            suffix = 'T';
        } else if (absValue >= 1_000_000_000) {
            formattedValue = (numericValue / 1_000_000_000).toFixed(1);
            suffix = 'B';
        } else if (absValue >= 1_000_000) {
            formattedValue = (numericValue / 1_000_000).toFixed(1);
            suffix = 'M';
        } else if (absValue >= 1_000) {
            formattedValue = (numericValue / 1_000).toFixed(1);
            suffix = 'K';
        } else {
            formattedValue = numericValue.toString();
        }

        return `${formattedValue}${suffix} ${currency}`;
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

    // Função para abrir modal de confirmação
    const openDeleteModal = (incentivo) => {
        setIncentivoToDelete(incentivo);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setIncentivoToDelete(null);
    };

    const handleDeleteProjeto = async (incentivoId) => {
        try {
            await api.delete(`/incentivo/${incentivoId}`);
            setIncentivos(prevIncentivos => prevIncentivos.filter(incentivo => incentivo.id !== incentivoId));
            showToast('success', 'Sucesso', 'Incentivo removido com sucesso');
        } catch (error) {
            showToast('error', 'Erro', 'Não foi possível remover o incentivo. Tente novamente.');
            if (error?.response) {
                console.error('Erro ao deletar incentivo:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data
                });
            } else {
                console.error('Erro ao deletar incentivo:', error.message || error);
            }
        }
    };

    // Função para deletar projecto após confirmação
    const handleConfirmDelete = async () => {
        if (!incentivoToDelete) return;
        await handleDeleteProjeto(incentivoToDelete.id); // Nome da função corrigido
        closeDeleteModal();
    };

    // Menu dropdown de ações
    const ActionMenu = ({ incentivo }) => {
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
                                        item.action(incentivo.id);
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

    // Cores para diferentes tipos de incentivo
    const tipoColors = {
        'DINHEIRO': 'bg-green-100 text-green-800 border-green-300',
        'PRODUTO': 'bg-blue-100 text-blue-800 border-blue-300',
        'SERVICO': 'bg-purple-100 text-purple-800 border-purple-300'
    };

    // Ícone por tipo de incentivo
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
    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o incentivo <span className="font-semibold text-red-600">{incentivoToDelete?.nomeDoIncentivo || 'Selecionado'}</span>?<br />
                        Esta ação não pode ser desfeita. Todos os dados do projecto serão removidos permanentemente.
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
        <div className="min-h-screen" ref={containerRef}>
            <Toast />
            <DeleteConfirmModal />
            {/* Estatísticas dos incentivos */}
            <div>
                {!loading && !error && (
                    <div className="mt-8 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-blue-100 rounded-full">
                                    <Award className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Total</p>
                                    <p className="text-2xl font-bold text-gray-900">{incentivos.length}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-green-100 rounded-full">
                                    <DollarSign className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Dinheiro</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {incentivos.filter(i => i.tipoDoIncentivo === 'DINHEIRO').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-purple-100 rounded-full">
                                    <Package className="w-6 h-6 text-purple-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Produto</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {incentivos.filter(i => i.tipoDoIncentivo === 'PRODUTO').length}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow-md p-6">
                            <div className="flex items-center">
                                <div className="p-3 bg-yellow-100 rounded-full">
                                    <Activity className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm font-medium text-gray-500">Valor Total</p>
                                    <p className="text-2xl font-bold text-gray-900">
                                        {formatCurrency(incentivos.reduce((total, i) => total + (i.valorPorProduto || 0), 0))}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}



            </div>
            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Incentivos</h1>
                        </div>
                        <div className="flex gap-4">

                            <button
                                onClick={fetchIncentivos}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <RefreshCw className="w-5 h-5 mr-2" />
                                Actualizar
                            </button>
                            <button
                                onClick={() => showToast('info', 'Exportar', 'Exportando dados dos incentivos')}
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
                        <div className="lg:col-span-2">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por nome, descrição ou produto..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Incentivo"
                                value={selectedTipo ? { label: selectedTipo, value: selectedTipo } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    { label: 'Dinheiro', value: 'DINHEIRO' },
                                    { label: 'Produto', value: 'PRODUTO' },
                                    { label: 'Serviço', value: 'SERVICO' }
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<Award size={18} />}
                            />
                        </div>

                        {/* Filtro Forma de Pagamento */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Forma de Pagamento"
                                value={selectedFormaPagamento ? { label: selectedFormaPagamento, value: selectedFormaPagamento } : null}
                                options={[
                                    { label: 'Todas as Formas', value: '' },
                                    { label: 'Numerário', value: 'NUMERARIO' },
                                    { label: 'Transferência', value: 'TRANSFERENCIA' },
                                    { label: 'Entrega Física', value: 'ENTREGA_FISICA' }
                                ]}
                                onChange={(option) => setSelectedFormaPagamento(option?.value || '')}
                                iconStart={<CreditCard size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <Loader className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
                            <p className="text-gray-600">Carregando incentivos...</p>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                            <AlertCircle className="w-8 h-8 text-red-600 mx-auto mb-4" />
                            <p className="text-red-600 mb-4">Erro ao carregar incentivos: {error}</p>
                            <button
                                onClick={fetchIncentivos}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                        </div>
                    </div>
                )}

                {/* Tabela - Desktop */}
                {!loading && !error && (
                    <div className="hidden md:block overflow-auto" style={{ maxHeight: contentHeight }}>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Incentivo
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Tipo & Valores
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Produto/Serviço
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Pagamento
                                    </th>

                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Acções
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {getCurrentItems().map((incentivo) => (
                                    <tr key={incentivo.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-start">

                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {incentivo.nomeDoIncentivo}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        ID: {incentivo.id}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        {incentivo.descricaoDoIncentivo}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${tipoColors[incentivo.tipoDoIncentivo] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                    {incentivo.tipoDoIncentivo}
                                                </div>
                                                <div className="text-sm font-semibold text-gray-900">
                                                    {formatCurrency(incentivo.valorPorProduto)}
                                                </div>
                                                {incentivo.valorDoReembolso && (
                                                    <div className="text-xs text-red-600">
                                                        Reembolso: {formatCurrency(incentivo.valorDoReembolso)}
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                {incentivo.nomeDoProduto && (
                                                    <div className="text-sm text-gray-900">
                                                        {incentivo.nomeDoProduto}
                                                    </div>
                                                )}
                                                {incentivo.quantidadePorProduto > 0 && (
                                                    <div className="text-xs text-gray-600">
                                                        {incentivo.quantidadePorProduto} {incentivo.unidade}
                                                    </div>
                                                )}
                                                {incentivo.valorPorKg > 0 && (
                                                    <div className="text-xs text-gray-600">
                                                        {formatCurrency(incentivo.valorPorKg)}/kg
                                                    </div>
                                                )}
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2">
                                                <div className="text-sm text-gray-900">
                                                    {incentivo.formaDePagamento}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {incentivo.formaDeEntrega}
                                                </div>
                                            </div>
                                        </td>



                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => handleViewIncentivo(incentivo.id)}
                                                    className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>

                                                <button
                                                    onClick={() => openDeleteModal(incentivo)}
                                                    className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <ActionMenu incentivo={incentivo} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={5}>
                                        {/* Paginação */}
                                        {!loading && !error && (
                                            <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                                <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                                    <div className="text-sm text-gray-700">
                                                        Mostrando{' '}
                                                        <span className="font-medium">
                                                            {filteredIncentivos.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}
                                                        </span>
                                                        {' '}a{' '}
                                                        <span className="font-medium">
                                                            {Math.min(currentPage * itemsPerPage, filteredIncentivos.length)}
                                                        </span>
                                                        {' '}de{' '}
                                                        <span className="font-medium">{filteredIncentivos.length}</span>
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
                                        )}

                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                )}

                {/* Visualização em cards para mobile */}
                {!loading && !error && (
                    <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                        {getCurrentItems().map((incentivo) => (
                            <div key={incentivo.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        {getTipoIcon(incentivo.tipoDoIncentivo)}
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">
                                                    {incentivo.nomeDoIncentivo}
                                                </h3>
                                                <div className="text-xs text-gray-500 mt-1">ID: {incentivo.id}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {incentivo.descricaoDoIncentivo}
                                                </div>
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${tipoColors[incentivo.tipoDoIncentivo] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {incentivo.tipoDoIncentivo}
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <div className="text-xs text-gray-700">
                                                <span className="font-medium">Valor:</span> {formatCurrency(incentivo.valorPorProduto)}
                                            </div>
                                            <div className="text-xs text-gray-700">
                                                <span className="font-medium">Pagamento:</span> {incentivo.formaDePagamento}
                                            </div>
                                            {incentivo.nomeDoProduto && (
                                                <div className="text-xs text-gray-700">
                                                    <span className="font-medium">Produto:</span> {incentivo.nomeDoProduto}
                                                </div>
                                            )}
                                            <div className="text-xs text-gray-700">
                                                <span className="font-medium">Vencimento:</span> {formatDate(incentivo.dataDeVencimentoDoIncentivo)}
                                            </div>
                                        </div>

                                        <div className="mt-3 flex justify-between items-center">
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => handleViewIncentivo(incentivo.id)}
                                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(incentivo)} // ADICIONE o parâmetro incentivo
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                            <ActionMenu incentivo={incentivo} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* Nenhum resultado encontrado */}
                {!loading && !error && filteredIncentivos.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum incentivo encontrado</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedTipo || selectedFormaPagamento ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTipo('');
                                    setSelectedFormaPagamento('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/incentivos/cadastro')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Adicionar incentivo
                            </button>
                        )}
                    </div>
                )}
            </div>


        </div>
    );
};

export default GestaoIncentivos;