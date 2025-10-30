import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileText,
    MoreVertical,
    PlusCircle,
    Search,
    TestTube,
    Trash2,
    User,
    X,
    Edit,
    Beaker,
    TrendingUp,
    TrendingDown
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';

// Dados fictícios dos resultados de análises
const resultadosData = [
    {
        id: 1,
        codigoAmostra: "SL-2025-0001",
        dataAnalise: "2025-01-15",
        parametro: "pH",
        valorObtido: 6.8,
        unidade: "—",
        metodoUtilizado: "Potenciométrico",
        limiteInferior: 6.0,
        limiteSuperior: 7.5,
        status: "DENTRO_PADRAO",
        tecnicoResponsavel: "José Pedro Santos",
        supervisor: "Dr. António Silva",
        dataAprovacao: "2025-01-16",
        observacoes: "Resultado dentro dos parâmetros normais"
    },
    {
        id: 2,
        codigoAmostra: "SL-2025-0001",
        dataAnalise: "2025-01-15",
        parametro: "Fósforo (P)",
        valorObtido: 12.5,
        unidade: "mg/dm³",
        metodoUtilizado: "Fotocolorimetria",
        limiteInferior: 15.0,
        limiteSuperior: 40.0,
        status: "FORA_PADRAO",
        tecnicoResponsavel: "José Pedro Santos",
        supervisor: "Dr. António Silva",
        dataAprovacao: "2025-01-16",
        observacoes: "Valor abaixo do limite inferior recomendado"
    },
    {
        id: 3,
        codigoAmostra: "SL-2025-0002",
        dataAnalise: "2025-01-14",
        parametro: "Potássio (K)",
        valorObtido: 0.25,
        unidade: "cmolc/dm³",
        metodoUtilizado: "Fotometria de Chama",
        limiteInferior: 0.15,
        limiteSuperior: 0.40,
        status: "DENTRO_PADRAO",
        tecnicoResponsavel: "Maria Fernandes",
        supervisor: "Dr. Carlos Mendes",
        dataAprovacao: "2025-01-15",
        observacoes: "Resultado satisfatório"
    },
    {
        id: 4,
        codigoAmostra: "SL-2025-0003",
        dataAnalise: "2025-01-13",
        parametro: "Matéria Orgânica",
        valorObtido: 1.8,
        unidade: "%",
        metodoUtilizado: "Walkley-Black",
        limiteInferior: 2.0,
        limiteSuperior: 5.0,
        status: "FORA_PADRAO",
        tecnicoResponsavel: "Ana Paula Costa",
        supervisor: "Dr. Manuel João",
        dataAprovacao: null,
        observacoes: "Necessita correção orgânica"
    },
    {
        id: 5,
        codigoAmostra: "SL-2025-0004",
        dataAnalise: "2025-01-12",
        parametro: "Cálcio (Ca)",
        valorObtido: 2.8,
        unidade: "cmolc/dm³",
        metodoUtilizado: "Espectrofotometria",
        limiteInferior: 1.0,
        limiteSuperior: 4.0,
        status: "DENTRO_PADRAO",
        tecnicoResponsavel: "Pedro Miguel",
        supervisor: "Dr. Isabel Rodrigues",
        dataAprovacao: "2025-01-13",
        observacoes: "Nível adequado de cálcio"
    }
];

const GestaoResultadosAnalises = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParametro, setSelectedParametro] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedTecnico, setSelectedTecnico] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 6;
    const containerRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [resultadoDelete, setResultadoDelete] = useState(null);

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

    // Função para obter status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'DENTRO_PADRAO':
                return 'bg-green-100 text-green-800';
            case 'FORA_PADRAO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Função para obter texto do status
    const getStatusText = (status) => {
        switch (status) {
            case 'DENTRO_PADRAO':
                return 'Dentro do Padrão';
            case 'FORA_PADRAO':
                return 'Fora do Padrão';
            default:
                return status;
        }
    };

    // Função para obter ícone do status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'DENTRO_PADRAO':
                return <CheckCircle className="w-4 h-4 text-green-600" />;
            case 'FORA_PADRAO':
                return <AlertCircle className="w-4 h-4 text-red-600" />;
            default:
                return null;
        }
    };

    // Filtragem dos resultados
    const filteredResultados = resultadosData.filter(resultado => {
        const matchesSearch = !searchTerm ||
            resultado.codigoAmostra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resultado.parametro?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            resultado.tecnicoResponsavel?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesParametro = !selectedParametro || resultado.parametro === selectedParametro;
        const matchesStatus = !selectedStatus || resultado.status === selectedStatus;
        const matchesTecnico = !selectedTecnico || resultado.tecnicoResponsavel === selectedTecnico;

        return matchesSearch && matchesParametro && matchesStatus && matchesTecnico;
    });

    // Paginação
    const totalPages = Math.ceil(filteredResultados.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredResultados.slice(startIndex, endIndex);
    };

    // Navegação para visualizar resultado
    const handleViewResultado = (resultadoId) => {
        navigate(`/GerenciaSIGAF/laboratorio-solo/resultados-analises/visualizar/${resultadoId}`);
    };

    // Navegação para editar resultado
    const handleEditResultado = (resultadoId) => {
        navigate(`/GerenciaSIGAF/laboratorio-solo/resultados-analises/editar/${resultadoId}`);
    };

    // Navegação para novo resultado
    const handleNovoResultado = () => {
        navigate('/GerenciaSIGAF/laboratorio-solo/resultados-analises/lancamento');
    };

    // Extrair valores únicos para filtros
    const uniqueParametros = [...new Set(resultadosData.map(r => r.parametro))].filter(Boolean);
    const uniqueStatus = [...new Set(resultadosData.map(r => r.status))].filter(Boolean);
    const uniqueTecnicos = [...new Set(resultadosData.map(r => r.tecnicoResponsavel))].filter(Boolean);

    // Função para abrir modal de confirmação
    const openDeleteModal = (resultadoId) => {
        setResultadoDelete(resultadoId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setResultadoDelete(null);
    };

    // Função para deletar resultado após confirmação
    const handleConfirmDelete = async () => {
        if (!resultadoDelete) return;
        try {
            // Simular exclusão - substituir pela API real
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast('success', 'Excluído', 'Resultado de análise excluído com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir resultado de análise.');
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
    const ActionMenu = ({ resultado }) => {
        const [isOpen, setIsOpen] = useState(false);

        const actionItems = [
            { label: 'Visualizar', icon: <Eye size={16} />, action: () => handleViewResultado(resultado.id) },
            { label: 'Editar', icon: <Edit size={16} />, action: () => handleEditResultado(resultado.id) },
            { label: 'Excluir', icon: <Trash2 size={16} />, action: () => openDeleteModal(resultado.id) }
        ];

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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[999] ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {actionItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                        item.action();
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

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const resultado = resultadosData.find(r => r.id === resultadoDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o resultado <span className="font-semibold text-red-600">{resultado?.parametro || 'Selecionado'}</span>?<br />
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 mt-2 w-full">
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 p-2 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200"
                        >
                            Sim, excluir
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200"
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

            {/* Estatísticas dos resultados */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <TestTube className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Resultados</p>
                            <p className="text-2xl font-bold text-gray-900">{resultadosData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Dentro do Padrão</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {resultadosData.filter(r => r.status === 'DENTRO_PADRAO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full">
                            <TrendingDown className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Fora do Padrão</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {resultadosData.filter(r => r.status === 'FORA_PADRAO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Activity className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Parâmetros Únicos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {uniqueParametros.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Resultados de Análises</h1>
                            <p className="text-blue-100 mt-1">Visualize e gerencie os resultados laboratoriais das amostras de solo</p>
                        </div>
                        <div className="flex gap-4">
                          
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados dos resultados')}
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
                        <div className="lg:col-span-1">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por amostra, parâmetro ou técnico..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Parâmetro */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Parâmetro"
                                value={selectedParametro ? { label: selectedParametro, value: selectedParametro } : null}
                                options={[
                                    { label: 'Todos os Parâmetros', value: '' },
                                    ...uniqueParametros.map(parametro => ({
                                        label: parametro,
                                        value: parametro
                                    }))
                                ]}
                                onChange={(option) => setSelectedParametro(option?.value || '')}
                                iconStart={<TestTube size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status"
                                value={selectedStatus ? { label: getStatusText(selectedStatus), value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos os Status', value: '' },
                                    ...uniqueStatus.map(status => ({
                                        label: getStatusText(status),
                                        value: status
                                    }))
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Activity size={18} />}
                            />
                        </div>

                        {/* Filtro Técnico */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Técnico"
                                value={selectedTecnico ? { label: selectedTecnico, value: selectedTecnico } : null}
                                options={[
                                    { label: 'Todos os Técnicos', value: '' },
                                    ...uniqueTecnicos.map(tecnico => ({
                                        label: tecnico,
                                        value: tecnico
                                    }))
                                ]}
                                onChange={(option) => setSelectedTecnico(option?.value || '')}
                                iconStart={<User size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Tabela - Desktop */}
                <div className="hidden md:block overflow-visible" style={{ maxHeight: contentHeight }}>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Amostra & Parâmetro
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Resultado & Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Método & Limites
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Responsáveis
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Datas
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-start">
                            {getCurrentItems().map((resultado) => (
                                <tr key={resultado.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 flex items-center justify-center font-semibold text-sm">
                                                 <TestTube className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{resultado.codigoAmostra}</div>
                                                <div className="text-xs text-gray-500 mt-1">{resultado.parametro}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="text-sm font-semibold text-gray-900">
                                                {resultado.valorObtido} {resultado.unidade}
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(resultado.status)}`}>
                                                {getStatusIcon(resultado.status)}
                                                <span className="ml-1">{getStatusText(resultado.status)}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{resultado.metodoUtilizado}</div>
                                            <div className="text-xs text-gray-500">
                                                Limites: {resultado.limiteInferior} - {resultado.limiteSuperior}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{resultado.tecnicoResponsavel}</div>
                                            <div className="text-xs text-gray-500">{resultado.supervisor}</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">
                                                {new Date(resultado.dataAnalise).toLocaleDateString('pt-BR')}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {resultado.dataAprovacao ? new Date(resultado.dataAprovacao).toLocaleDateString('pt-BR') : 'Pendente'}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewResultado(resultado.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                           
                                            <button
                                                onClick={() => openDeleteModal(resultado.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu resultado={resultado} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan={6}>
                                    {/* Paginação */}
                                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                            <div className="text-sm text-gray-700">
                                                Mostrando{' '}
                                                <span className="font-medium">{filteredResultados.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredResultados.length)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{filteredResultados.length}</span>
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
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-visible" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((resultado) => (
                        <div key={resultado.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Beaker className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{resultado.codigoAmostra}</h3>
                                            <div className="text-xs text-gray-500 mt-1">{resultado.parametro}</div>
                                            <div className="text-xs text-gray-500">{resultado.tecnicoResponsavel}</div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {resultado.valorObtido} {resultado.unidade}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Método:</span> {resultado.metodoUtilizado}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Data:</span> {new Date(resultado.dataAnalise).toLocaleDateString('pt-BR')}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Limites:</span> {resultado.limiteInferior} - {resultado.limiteSuperior}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Supervisor:</span> {resultado.supervisor}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewResultado(resultado.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditResultado(resultado.id)}
                                                className="p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(resultado.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(resultado.status)}`}>
                                            {getStatusIcon(resultado.status)}
                                            <span className="ml-1">{getStatusText(resultado.status)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GestaoResultadosAnalises;