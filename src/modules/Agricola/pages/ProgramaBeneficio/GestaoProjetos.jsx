import {
    Activity,
    AlertCircle,
    BarChart3,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Copy,
    DollarSign,
    Download,
    Eye,
    FileText,
    Layers,
    MapPin,
    MoreVertical,
    PlayCircle,
    Search,
    Target,
    Trash2,
    Upload,
    Users,
    X
} from 'lucide-react';
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import { useEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';


import CustomInput from '../../../../core/components/CustomInput';
import api from '../../../../core/services/api';
import { useProjetos } from '../../../hooks/useRnpaData';

// const projetosEstaticos = [ ... ]; // Remover ou comentar

const GestaoProjetos = () => {
    const { projeto: projetosApi } = useProjetos();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFase, setSelectedFase] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedTipoCredito, setSelectedTipoCredito] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [projetos, setProjetos] = useState([]); // Inicializa vazio
    const itemsPerPage = 6;
    const containerRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const isCadastro = location.pathname.includes('/cadastrar');
    const isVisualizacao = location.pathname.includes('/visualizar/');
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [projetoToDelete, setProjetoToDelete] = useState(null);

    useEffect(() => {
        if (projetosApi && Array.isArray(projetosApi)) {
            setProjetos(projetosApi);
        }
    }, [projetosApi]);

    // Dados das províncias
    const provincias = [
        { nome: 'Luanda', value: 'LUANDA' },
        { nome: 'Benguela', value: 'BENGUELA' },
        { nome: 'Huila', value: 'HUILA' },
        { nome: 'Cuando Cubango', value: 'CUANDO_CUBANGO' },
        { nome: 'Namibe', value: 'NAMIBE' },
        { nome: 'Bié', value: 'BIE' },
        { nome: 'Cabinda', value: 'CABINDA' },
        { nome: 'Cunene', value: 'CUNENE' },
        { nome: 'Huambo', value: 'HUAMBO' },
        { nome: 'Lunda Norte', value: 'LUNDA_NORTE' },
        { nome: 'Lunda Sul', value: 'LUNDA_SUL' },
        { nome: 'Malanje', value: 'MALANJE' },
        { nome: 'Moxico', value: 'MOXICO' },
        { nome: 'Uige', value: 'UIGE' },
        { nome: 'Zaire', value: 'ZAIRE' },
        { nome: 'Bengo', value: 'BENGO' },
        { nome: 'Cuanza Norte', value: 'CUANZA_NORTE' },
        { nome: 'Cuanza Sul', value: 'CUANZA_SUL' }
    ];

    // Ajustar altura do conteúdo
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const headerHeight = 280;
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

    // Alternar status do projeto
    /*const toggleStatus = (projetoId, currentStatus) => {
        let newStatus;
        switch (currentStatus) {
            case 'PLANEJAMENTO':
                newStatus = 'APROVADO';
                break;
            case 'APROVADO':
                newStatus = 'EM_ANDAMENTO';
                break;
            case 'EM_ANDAMENTO':
                newStatus = 'SUSPENSO';
                break;
            case 'SUSPENSO':
                newStatus = 'CONCLUIDO';
                break;
            case 'CONCLUIDO':
                newStatus = 'CANCELADO';
                break;
            case 'CANCELADO':
                newStatus = 'PLANEJAMENTO';
                break;
            default:
                newStatus = 'PLANEJAMENTO';
        }
        
        setProjetos(prevProjetos => 
            prevProjetos.map(projeto => 
                projeto.id === projetoId ? { ...projeto, status: newStatus } : projeto
            )
        );

        showToast(
            'success',
            'Status Atualizado',
            `Projeto movido para ${newStatus.replace('_', ' ')}`
        );
    };*/

    // Filtragem dos projetos
    const filteredProjetos = projetos.filter(projeto => {
        const matchesSearch = projeto.nomeProjeto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            projeto.codigo || '' === searchTerm.toLowerCase() ||
            projeto.coordenador || '' === searchTerm.toLowerCase() ||
            projeto.entidadeImplementadora.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFase = !selectedFase || projeto.faseProjeto === selectedFase;
        const matchesStatus = !selectedStatus || projeto.status === selectedStatus;
        const matchesProvincia = !selectedProvincia || projeto.provinciasAbrangidas.includes(selectedProvincia);
        const matchesTipoCredito = !selectedTipoCredito || projeto.tipoCredito.includes(selectedTipoCredito);

        return matchesSearch && matchesFase && matchesStatus && matchesProvincia && matchesTipoCredito;
    });

    // Paginação
    const totalPages = Math.ceil(filteredProjetos.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProjetos.slice(startIndex, endIndex);
    };

    // Navegação (simulada)
    const handleViewProjeto = (projetoId) => {
        navigate(`/GerenciaSIGAF/gestao-agricultores/programas-beneficios/visualizar/${projetoId}`);
    };
    {/*const handleEditProjeto = (projetoId) => {
        const projeto = projetos.find(p => p.id === projetoId);
        navigate('/GerenciaSIGAF/programas-beneficios', { state: { projetoEditando: projeto } });
    */};

    const handleDuplicateProjeto = (projetoId) => {
        const projetoOriginal = projetos.find(p => p.id === projetoId);
        if (projetoOriginal) {
            const novoProjeto = {
                ...projetoOriginal,
                id: Date.now(),
                nomeProjeto: `${projetoOriginal.nomeProjeto} (Cópia)`,
                codigo: `${projetoOriginal.codigo}-COPY`,
                status: 'PLANEJAMENTO',
                progresso: 0,
                ultimaAtualizacao: new Date().toISOString().split('T')[0]
            };

            setProjetos(prevProjetos => [novoProjeto, ...prevProjetos]);
            showToast('success', 'Sucesso', 'Projecto duplicado com sucesso');
        }
    };

    const handleRelatorios = (projetoId) => {
        showToast('info', 'Função', `Gerar relatórios do projecto ID: ${projetoId}`);
    };

    const handleEstatisticas = (projetoId) => {
        showToast('info', 'Função', `Visualizar estatísticas do projecto ID: ${projetoId}`);
    };

    const handleFinanciamento = (projetoId) => {
        showToast('info', 'Função', `Detalhes de financiamento do projecto ID: ${projetoId}`);
    };

    const handleDeleteProjeto = async (projetoId) => {
        try {
            await api.delete(`/projetoBeneficiario/${projetoId}`);
            setProjetos(prevProjetos => prevProjetos.filter(projeto => projeto.id !== projetoId));
            showToast('success', 'Sucesso', 'Projecto removido com sucesso');
        } catch (error) {
            showToast('error', 'Erro', 'Não foi possível remover o projecto. Tente novamente.');
            console.error('Erro ao deletar projecto:', error);
        }
    };

    // Função para abrir modal de confirmação
    const openDeleteModal = (projeto) => {
        setProjetoToDelete(projeto);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setProjetoToDelete(null);
    };

    // Função para deletar projecto após confirmação
    const handleConfirmDelete = async () => {
        if (!projetoToDelete) return;
        await handleDeleteProjeto(projetoToDelete.id);
        closeDeleteModal();
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Duplicar Projecto', icon: <Copy size={16} />, action: handleDuplicateProjeto },
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorios },
        { label: 'Estatísticas', icon: <BarChart3 size={16} />, action: handleEstatisticas },
        { label: 'Financiamento', icon: <DollarSign size={16} />, action: handleFinanciamento }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return '0';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

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



    // Obter label da fase
    const getFaseLabel = (fase) => {
        const fases = {
            '1': 'Fase 1 - Planeamento',
            '2': 'Fase 2 - Aprovação',
            '3': 'Fase 3 - Mobilização',
            '4': 'Fase 4 - Implementação Inicial',
            '5': 'Fase 5 - Desenvolvimento',
            '6': 'Fase 6 - Monitoramento',
            '7': 'Fase 7 - Avaliação Intermediária',
            '8': 'Fase 8 - Ajustes',
            '9': 'Fase 9 - Finalização',
            '10': 'Fase 10 - Encerramento'
        };
        return fases[fase] || ` ${fase}`;
    };

    // Obter nome da província
    const getProvinciaLabel = (codigo) => {
        const provincia = provincias.find(p => p.value === codigo);
        return provincia ? provincia.nome : codigo;
    };

    // Componente Toast
    const Toast = () => {
        if (!toastMessage) return null;

        const { type, title, message } = toastMessage;

        let bgColor, icon;
        switch (type) {
            case 'success':
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
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
    const ActionMenu = ({ projeto }) => {
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
                                        item.action(projeto.id);
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
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o projecto <span className="font-semibold text-red-600">{projetoToDelete?.nomeProjeto || 'Selecionado'}</span>?<br />
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
        <div className="min-h-screen overflow-hidden " ref={containerRef}>
            <DeleteConfirmModal />
            <Toast />
            {/* Dashboard de Estatísticas */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pb-[30px]">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Target className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{projetos.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <PlayCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Em Curso</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {projetos.filter(p => p.status === 'EM_ANDAMENTO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Beneficiários(as)</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {(() => {
                                    const total = filteredProjetos.reduce((acc, p) => {
                                        const n = parseInt(p.numeroBeneficiarios, 10);
                                        return acc + (isNaN(n) ? 0 : n);
                                    }, 0);
                                    return total.toLocaleString();
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Investimento </p>
                            <p className="text-xl font-bold text-gray-900 break-all">
                                {formatCurrency(
                                    filteredProjetos.reduce((total, p) => {
                                        let valor = 0;
                                        if (p.moeda === 'AOA') {
                                            const n = parseFloat(p.valorGlobalProjeto);
                                            valor = (isNaN(n) ? 0 : n) * 800;
                                        } else {
                                            const n = parseFloat(p.valorGlobalProjeto);
                                            valor = isNaN(n) ? 0 : n;
                                        }
                                        return total + valor;
                                    }, 0),

                                )}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full bg-white rounded-xl  overflow-hidden">

                {/* Cabeçalho */}
                <div className="bg-gradient-to-r  from-blue-700  to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Projectos</h1>
                        </div>
                        <div className="flex gap-4">

                            <button
                                onClick={() => showToast('info', 'Função', 'Importar projectos')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                Importar
                            </button>
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar relatório de projectos')}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Busca */}
                        <div className="lg:col-span-2">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por nome, código, coordenador ou entidade..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Fase */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Fase do Projecto"
                                value={selectedFase ? {
                                    label: getFaseLabel(selectedFase),
                                    value: selectedFase
                                } : null}
                                options={[
                                    { label: 'Todas as Fases', value: '' },
                                    { label: 'Fase 1 - Planeamento', value: '1' },
                                    { label: 'Fase 2 - Aprovação', value: '2' },
                                    { label: 'Fase 3 - Mobilização', value: '3' },
                                    { label: 'Fase 4 - Implementação Inicial', value: '4' },
                                    { label: 'Fase 5 - Desenvolvimento', value: '5' },
                                    { label: 'Fase 6 - Monitoramento', value: '6' },
                                    { label: 'Fase 7 - Avaliação Intermediária', value: '7' },
                                    { label: 'Fase 8 - Ajustes', value: '8' },
                                    { label: 'Fase 9 - Finalização', value: '9' },
                                    { label: 'Fase 10 - Encerramento', value: '10' }
                                ]}
                                onChange={(option) => setSelectedFase(option?.value || '')}
                                iconStart={<Layers size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Estado"
                                value={selectedStatus ? { label: selectedStatus.replace('_', ' '), value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos', value: '' },
                                    { label: 'Planeamento', value: 'PLANEJAMENTO' },
                                    { label: 'Aprovado', value: 'APROVADO' },
                                    { label: 'Em Curso', value: 'EM_ANDAMENTO' },
                                    { label: 'Suspenso', value: 'SUSPENSO' },
                                    { label: 'Concluído', value: 'CONCLUIDO' },
                                    { label: 'Cancelado', value: 'CANCELADO' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Activity size={18} />}
                            />
                        </div>

                        {/* Filtro Província */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Província"
                                value={selectedProvincia ? {
                                    label: getProvinciaLabel(selectedProvincia),
                                    value: selectedProvincia
                                } : null}
                                options={[
                                    { label: 'Todas as Províncias', value: '' },
                                    ...provincias.map(p => ({ label: p.nome, value: p.value }))
                                ]}
                                onChange={(option) => setSelectedProvincia(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Outlet para Cadastro/Visualização */}
                <Outlet />

                {/* Tabela - Desktop */}
                {!isCadastro && !isVisualizacao && (
                    <div className="hidden md:block overflow-auto" style={{ maxHeight: contentHeight }}>
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-4 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Projecto
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Fase & Estado
                                    </th>

                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Beneficiários & Montante
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Localização
                                    </th>
                                    <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Acções
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {getCurrentItems().map((projeto) => (
                                    <tr key={projeto.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-4 py-4 whitespace-nowrap ">
                                            <div className="flex items-center">

                                                <div className="ml-4 text-start">
                                                    <div className="text-sm font-semibold text-gray-900 whitespace-normal ">{projeto.nomeProjeto || ''}</div>
                                                    <div className="text-xs text-gray-500 mt-1">Código: {projeto.id || ''}</div>
                                                    <div className="text-xs text-gray-500">Entidade: {projeto.entidadeImplementadora || ''}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2 text-start">
                                                <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border bg-indigo-100 text-indigo-800 border-indigo-300">
                                                    {getFaseLabel(projeto.faseProjeto).replace(/[-_]/g, ' ')}
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    Actualização: {formatDate(projeto.ultimaAtualizacao || '')}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-2 text-start">
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Users className="w-4 h-4 mr-2 text-blue-500" />
                                                    {projeto.numeroBeneficiarios ? parseInt(projeto.numeroBeneficiarios).toLocaleString() : 0} beneficiários(as)
                                                </div>
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <DollarSign className="w-4 h-4 mr-2 text-blue-500" />
                                                    <div className=" text-gray-700 break-all">
                                                        {formatCurrency(projeto.valorGlobalProjeto)}
                                                    </div>
                                                </div>
                                                <div className="text-xs text-gray-600">
                                                    {projeto.tipoCredito ? projeto.tipoCredito.length : 0} tipo(s) de apoio
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="space-y-1 text-start">
                                                {(projeto.provinciasAbrangidas || []).slice(0, 2).map((provincia, index) => (
                                                    <div key={index} className="text-xs text-gray-700 flex items-center">
                                                        <MapPin className="w-3 h-3 mr-1 text-blue-500" />
                                                        {getProvinciaLabel(provincia)}
                                                    </div>
                                                ))}
                                                {projeto.provinciasAbrangidas && projeto.provinciasAbrangidas.length > 2 && (
                                                    <div className="text-xs text-gray-500">
                                                        +{projeto.provinciasAbrangidas.length - 2} mais
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center text-start justify-center space-x-1">
                                                <button
                                                    onClick={() => handleViewProjeto(projeto.id)}
                                                    className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(projeto)}
                                                    className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                                <ActionMenu projeto={projeto} />
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colSpan={5}>

                                        {/* Paginação */}
                                        {!isCadastro && !isVisualizacao && (
                                            <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                                <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                                    <div className="text-sm text-gray-700">
                                                        Mostrando{' '}
                                                        <span className="font-medium">{filteredProjetos.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                        {' '}a{' '}
                                                        <span className="font-medium">
                                                            {Math.min(currentPage * itemsPerPage, filteredProjetos.length)}
                                                        </span>
                                                        {' '}de{' '}
                                                        <span className="font-medium">{filteredProjetos.length}</span>
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
                {!isCadastro && !isVisualizacao && (
                    <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                        {getCurrentItems().map((projeto) => (
                            <div key={projeto.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                        <Target className="h-8 w-8 text-blue-600" />
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">{projeto.nomeProjeto}</h3>
                                                <div className="text-xs text-gray-500 mt-1">Código: {projeto.codigo || ''}</div>
                                                <div className="text-xs text-gray-500">Coordenador: {projeto.coordenador || ''}</div>
                                            </div>
                                        </div>

                                        <div className="mt-3 grid grid-cols-2 gap-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Calendar className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                <span className="truncate">{formatDate(projeto.dataInicio || '')}</span>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Users className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                {projeto.numeroBeneficiarios.toLocaleString()}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <DollarSign className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                <div className="text-2xl font-bold text-gray-900 break-all">
                                                    {formatCurrency(projeto.valorGlobalProjeto)}
                                                </div>
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Layers className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                Fase {projeto.faseProjeto}
                                            </div>
                                        </div>

                                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                                style={{ width: `${projeto.progresso !== undefined ? projeto.progresso : 0}%` }}
                                            ></div>
                                        </div>
                                        <div className="mt-1 text-xs text-blue-600 font-medium">
                                            {(projeto.progresso !== undefined ? projeto.progresso : 0)}% concluído
                                        </div>

                                        <div className="mt-3 flex justify-between items-center">
                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => handleViewProjeto(projeto.id)}
                                                    className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => openDeleteModal(projeto)}
                                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                    title="Remover"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>

                                            <ActionMenu projeto={projeto} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Nenhum resultado encontrado */}
                {!isCadastro && !isVisualizacao && filteredProjetos.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum projecto encontrado</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedFase || selectedStatus || selectedProvincia || selectedTipoCredito ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedFase('');
                                    setSelectedStatus('');
                                    setSelectedProvincia('');
                                    setSelectedTipoCredito('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/GerenciaSIGAF/programas-beneficios', { state: {} })}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Registar novo projecto
                            </button>
                        )}
                    </div>
                )}
            </div>

        </div>
    );
};

export default GestaoProjetos;