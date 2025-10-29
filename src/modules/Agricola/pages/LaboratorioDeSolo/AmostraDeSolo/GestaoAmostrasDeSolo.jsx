import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Clock,
    Download,
    Eye,
    FileText,
    MapPin,
    MoreVertical,
    PlusCircle,
    Search,
    Trash2,
    User,
    X,
    Edit,
    Beaker
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';

// Dados fictícios das amostras de solo
const amostrasData = [
    {
        id: 1,
        codigoAmostra: "SL-2025-0001",
        nomeProdutor: "João Manuel Silva",
        provincia: "HUAMBO",
        municipio: "Caála",
        culturaAtual: "Milho, Feijão",
        responsavelColeta: "José Pedro Santos",
        dataColeta: "2025-01-10",
        statusAnalise: "EM_ANDAMENTO",
        telefoneProdutor: "923456789",
        emailProdutor: "joao.silva@email.com",
        areaCultivo: 5.5,
        coordenadas: "-12.8500, 15.5600"
    },
    {
        id: 2,
        codigoAmostra: "SL-2025-0002",
        nomeProdutor: "Maria Fernanda Costa",
        provincia: "BENGUELA",
        municipio: "Benguela",
        culturaAtual: "Soja, Amendoim",
        responsavelColeta: "António Mateus",
        dataColeta: "2025-01-08",
        statusAnalise: "CONCLUIDA",
        telefoneProdutor: "924567890",
        emailProdutor: "maria.costa@email.com",
        areaCultivo: 8.2,
        coordenadas: "-12.5761, 13.4056"
    },
    {
        id: 3,
        codigoAmostra: "SL-2025-0003",
        nomeProdutor: "Carlos Alberto Mendes",
        provincia: "LUANDA",
        municipio: "Viana",
        culturaAtual: "Mandioca, Batata Doce",
        responsavelColeta: "Isabel Rodrigues",
        dataColeta: "2025-01-12",
        statusAnalise: "PENDENTE",
        telefoneProdutor: "925678901",
        emailProdutor: "carlos.mendes@email.com",
        areaCultivo: 3.8,
        coordenadas: "-8.8383, 13.2344"
    },
    {
        id: 4,
        codigoAmostra: "SL-2025-0004",
        nomeProdutor: "Ana Paula Ferreira",
        provincia: "HUILA",
        municipio: "Lubango",
        culturaAtual: "Trigo, Cevada",
        responsavelColeta: "Manuel João",
        dataColeta: "2025-01-05",
        statusAnalise: "EM_ANDAMENTO",
        telefoneProdutor: "926789012",
        emailProdutor: "ana.ferreira@email.com",
        areaCultivo: 12.0,
        coordenadas: "-14.9176, 13.4925"
    },
    {
        id: 5,
        codigoAmostra: "SL-2025-0005",
        nomeProdutor: "Pedro Miguel Santos",
        provincia: "HUAMBO",
        municipio: "Huambo",
        culturaAtual: "Milho",
        responsavelColeta: "Luisa Cardoso",
        dataColeta: "2025-01-15",
        statusAnalise: "CONCLUIDA",
        telefoneProdutor: "927890123",
        emailProdutor: "pedro.santos@email.com",
        areaCultivo: 6.7,
        coordenadas: "-12.7761, 15.7389"
    }
];

const GestaoAmostrasDeSolo = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedCultura, setSelectedCultura] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 6;
    const containerRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [amostraDelete, setAmostraDelete] = useState(null);

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
            case 'PENDENTE':
                return 'bg-yellow-100 text-yellow-800';
            case 'EM_ANDAMENTO':
                return 'bg-blue-100 text-blue-800';
            case 'CONCLUIDA':
                return 'bg-green-100 text-green-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Função para obter texto do status
    const getStatusText = (status) => {
        switch (status) {
            case 'PENDENTE':
                return 'Pendente';
            case 'EM_ANDAMENTO':
                return 'Em Andamento';
            case 'CONCLUIDA':
                return 'Concluída';
            default:
                return status;
        }
    };

    // Filtragem das amostras
    const filteredAmostras = amostrasData.filter(amostra => {
        const matchesSearch = !searchTerm ||
            amostra.codigoAmostra?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            amostra.nomeProdutor?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            amostra.provincia?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProvincia = !selectedProvincia || amostra.provincia === selectedProvincia;
        const matchesStatus = !selectedStatus || amostra.statusAnalise === selectedStatus;
        const matchesCultura = !selectedCultura || amostra.culturaAtual?.toLowerCase().includes(selectedCultura.toLowerCase());

        return matchesSearch && matchesProvincia && matchesStatus && matchesCultura;
    });

    // Paginação
    const totalPages = Math.ceil(filteredAmostras.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAmostras.slice(startIndex, endIndex);
    };

    // Navegação para visualizar amostra
    const handleViewAmostra = (amostraId) => {
        navigate(`/GerenciaSIGAF/laboratorio-solo/amostras-solo/visualizar/${amostraId}`);
    };

    // Navegação para editar amostra
    const handleEditAmostra = (amostraId) => {
        navigate(`/GerenciaSIGAF/laboratorio-solo/amostras-solo/editar/${amostraId}`);
    };

    // Navegação para nova amostra
    const handleNovaAmostra = () => {
        navigate('/GerenciaSIGAF/laboratorio-solo/amostras-solo/cadastro');
    };

    // Extrair valores únicos para filtros
    const uniqueProvincias = [...new Set(amostrasData.map(a => a.provincia))].filter(Boolean);
    const uniqueStatus = [...new Set(amostrasData.map(a => a.statusAnalise))].filter(Boolean);
    const uniqueCulturas = [...new Set(amostrasData.flatMap(a => a.culturaAtual?.split(', ') || []))].filter(Boolean);

    // Função para abrir modal de confirmação
    const openDeleteModal = (amostraId) => {
        setAmostraDelete(amostraId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setAmostraDelete(null);
    };

    // Função para deletar amostra após confirmação
    const handleConfirmDelete = async () => {
        if (!amostraDelete) return;
        try {
            // Simular exclusão - substituir pela API real
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast('success', 'Excluído', 'Amostra de solo excluída com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir amostra de solo.');
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
    const ActionMenu = ({ amostra }) => {
        const [isOpen, setIsOpen] = useState(false);

        const actionItems = [
            { label: 'Visualizar', icon: <Eye size={16} />, action: () => handleViewAmostra(amostra.id) },
            { label: 'Editar', icon: <Edit size={16} />, action: () => handleEditAmostra(amostra.id) },
            { label: 'Excluir', icon: <Trash2 size={16} />, action: () => openDeleteModal(amostra.id) }
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
        const amostra = amostrasData.find(a => a.id === amostraDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir a amostra <span className="font-semibold text-red-600">{amostra?.codigoAmostra || 'Selecionada'}</span>?<br />
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

            {/* Estatísticas das amostras */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <Beaker className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Amostras</p>
                            <p className="text-2xl font-bold text-gray-900">{amostrasData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Clock className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Em Andamento</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {amostrasData.filter(a => a.statusAnalise === 'EM_ANDAMENTO').length}
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
                            <p className="text-sm font-medium text-gray-500">Concluídas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {amostrasData.filter(a => a.statusAnalise === 'CONCLUIDA').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Pendentes</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {amostrasData.filter(a => a.statusAnalise === 'PENDENTE').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-green-700 to-green-500 p-6 text-white rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Amostras de Solo</h1>
                            <p className="text-green-100 mt-1">Acompanhe o status das coletas e análises realizadas</p>
                        </div>
                        <div className="flex gap-4">
                           
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados das amostras')}
                                className="inline-flex items-center px-4 py-2 bg-white text-green-700 rounded-lg hover:bg-green-50 transition-colors shadow-sm font-medium"
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
                                placeholder="Buscar por código, produtor ou província..."
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
                                    ...uniqueProvincias.map(provincia => ({
                                        label: provincia,
                                        value: provincia
                                    }))
                                ]}
                                onChange={(option) => setSelectedProvincia(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status da Análise"
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

                        {/* Filtro Cultura */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Cultura"
                                value={selectedCultura ? { label: selectedCultura, value: selectedCultura } : null}
                                options={[
                                    { label: 'Todas as Culturas', value: '' },
                                    ...uniqueCulturas.map(cultura => ({
                                        label: cultura,
                                        value: cultura
                                    }))
                                ]}
                                onChange={(option) => setSelectedCultura(option?.value || '')}
                                iconStart={<FileText size={18} />}
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
                                    Código & Produtor
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Cultura & Área
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Coleta
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-start">
                            {getCurrentItems().map((amostra) => (
                                <tr key={amostra.id} className="hover:bg-green-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-600 to-green-500 flex items-center justify-center font-semibold text-sm">
                                                <span className='text-white'>{amostra.codigoAmostra?.split('-')[2] || 'SL'}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{amostra.codigoAmostra}</div>
                                                <div className="text-xs text-gray-500 mt-1">{amostra.nomeProdutor}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{amostra.provincia}</div>
                                            <div className="text-xs text-gray-500">{amostra.municipio}</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{amostra.culturaAtual}</div>
                                            <div className="text-xs text-gray-500">{amostra.areaCultivo} ha</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{amostra.responsavelColeta}</div>
                                            <div className="text-xs text-gray-500">
                                                {new Date(amostra.dataColeta).toLocaleDateString('pt-BR')}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(amostra.statusAnalise)}`}>
                                            {getStatusText(amostra.statusAnalise)}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewAmostra(amostra.id)}
                                                className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                           
                                            <button
                                                onClick={() => openDeleteModal(amostra.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu amostra={amostra} />
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
                                                <span className="font-medium">{filteredAmostras.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredAmostras.length)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{filteredAmostras.length}</span>
                                                {' '}resultados
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${currentPage === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
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
                                                            : 'bg-white text-green-700 hover:bg-green-50 border border-green-200'
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
                    {getCurrentItems().map((amostra) => (
                        <div key={amostra.id} className="p-4 border-b border-gray-200 hover:bg-green-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-green-100 rounded-full flex items-center justify-center">
                                    <Beaker className="h-8 w-8 text-green-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{amostra.codigoAmostra}</h3>
                                            <div className="text-xs text-gray-500 mt-1">{amostra.nomeProdutor}</div>
                                            <div className="text-xs text-gray-500">{amostra.provincia}, {amostra.municipio}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(amostra.statusAnalise)}`}>
                                            {getStatusText(amostra.statusAnalise)}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Cultura:</span> {amostra.culturaAtual}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Área:</span> {amostra.areaCultivo} ha
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Responsável:</span> {amostra.responsavelColeta}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Data:</span> {new Date(amostra.dataColeta).toLocaleDateString('pt-BR')}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewAmostra(amostra.id)}
                                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditAmostra(amostra.id)}
                                                className="p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(amostra.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <ActionMenu amostra={amostra} />
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

export default GestaoAmostrasDeSolo;