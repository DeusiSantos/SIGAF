import {
    AlertCircle,
    Building,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    Factory,
    FileText,
    Loader,
    Mail,
    MapPin,
    MoreVertical,
    Phone,
    PlusCircle,
    School,
    Search,
    Trash2,
    User,
    Users,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../../core/components/CustomInput';
import api from '../../../../../core/services/api';



// Dados estáticos das administrações regionais
const administracoesEstaticas = [
    { id: 1, nome: "Administração Regional de Luanda" },
    { id: 2, nome: "Administração Regional de Benguela" },
    { id: 3, nome: "Administração Regional de Huambo" },
    { id: 4, nome: "Administração Regional de Huíla" },
    { id: 5, nome: "Administração Regional de Cabinda" }
];

const GestaoEmpresasFlorestal = () => {
    // Função para navegação de gestão de pessoal
    const handlePessoal = (empresaId) => {
        navigate(`/GerenciaRNPA/gestao-empresas/pessoal/${empresaId}`);
    };

    // Função para navegação de infraestrutura
    const handleInfraestrutura = (empresaId) => {
        navigate(`/GerenciaRNPA/gestao-empresas/infraestrutura/${empresaId}`);
    };

    // Função para navegação de relatórios
    const handleRelatorios = (empresaId) => {
        navigate(`/GerenciaRNPA/gestao-empresas/relatorios/${empresaId}`);
    };

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 6;
    const containerRef = useRef(null);

    // Estados para dados da API
    const [empresas, setEmpresas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Estados para o modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [empresaToDelete, setEmpresaToDelete] = useState(null);

    // Função para buscar empresas da API
    const fetchEmpresas = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.get('/organizacao/empresasFlorestais');

            console.log('📊 Dados recebidos da API:', response.data);

            const data = Array.isArray(response.data) ? response.data : response.data.data || [];
            setEmpresas(data);
        } catch (err) {
            console.error('❌ Erro ao buscar empresas:', err);
            setError(err.message || 'Erro ao carregar dados');
            showToast('error', 'Erro', 'Não foi possível carregar os dados das empresas');
        } finally {
            setLoading(false);
        }
    };

    // Função para deletar empresa
    const deleteEmpresa = async (empresaId) => {
        try {
            await api.delete(`/organizacao/${empresaId}`);
            await fetchEmpresas();
            return true;
        } catch (error) {
            console.error('Erro ao deletar empresa:', error);
            throw error;
        }
    };

    // Carregar dados ao montar componente
    useEffect(() => {
        fetchEmpresas();
    }, []);

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

    // Função para obter o nome da administração regional
    const getAdminRegionalName = (adminRegionalId) => {
        const admin = administracoesEstaticas.find(a => a.id === adminRegionalId);
        return admin ? admin.nome : `Região ${adminRegionalId}`;
    };

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

    // Filtragem das empresas
    const filteredEscolas = empresas.filter(empresa => {
        const matchesSearch = empresa.nomeEntidade?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresa.nomePresidente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresa.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesRegion = !selectedRegion || empresa.provincia === selectedRegion;

        const matchesTipo = !selectedTipo || (empresa.atividades &&
            empresa.atividades.some(atividade => atividade.includes(selectedTipo)));

        const matchesStatus = !selectedStatus || empresa.estado === selectedStatus;

        return matchesSearch && matchesRegion && matchesTipo && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredEscolas.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEscolas.slice(startIndex, endIndex);
    };

    // Navegação para visualizar empresa
    const handleViewEscola = (empresaId) => {
        navigate(`/GerenciaRNPA/gestao-empresas/visualizar-empresa/${empresaId}`);
    };

    const handleTransferencia = (empresaId) => {
        // Navegar para a rota de cadastro de produção passando o ID
        navigate(`/GerenciaRNPA/gestao-empresas/cadastro-producao-empresa/${empresaId}`);
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Cadastro da Produção', icon: <PlusCircle size={16} />, action: handleTransferencia },
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorios },
        { label: 'Infraestrutura', icon: <Building size={16} />, action: handleInfraestrutura },
        { label: 'Gestão de Pessoal', icon: <User size={16} />, action: handlePessoal }
    ];

    // Formatar atividades para exibição
    const formatAtividades = (atividades) => {
        if (!atividades || !Array.isArray(atividades)) return [];
        return atividades.map(atividade =>
            atividade.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1').trim()
        );
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
    const ActionMenu = ({ escola }) => {
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-[999] ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {actionItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                        item.action(escola.id);
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

    // Extrair regiões únicas para o filtro
    const uniqueRegions = [...new Set(empresas.map(empresa => empresa.provincia))].filter(Boolean);

    // Função para abrir modal de confirmação
    const openDeleteModal = (empresaId) => {
        setEmpresaToDelete(empresaId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setEmpresaToDelete(null);
    };

    // Função para deletar empresa após confirmação
    const handleConfirmDelete = async () => {
        if (!empresaToDelete) return;
        try {
            await deleteEmpresa(empresaToDelete);
            showToast('success', 'Excluído', 'Empresa excluída com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir empresa.');
            console.error(err);
        } finally {
            closeDeleteModal();
        }
    };

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const empresa = empresas.find(c => c.id === empresaToDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir a empresa <span className="font-semibold text-red-600">{empresa?.nomeEntidade || 'Selecionada'}</span>?<br />
                        Esta ação não pode ser desfeita. Todos os dados da empresa serão removidos permanentemente.
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <Loader className="w-8 h-8 animate-spin text-blue-600 mb-4" />
                    <p className="text-gray-600">Carregando empresas...</p>
                </div>
            </div>
        );
    }

    if (error && empresas.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex flex-col items-center">
                    <AlertCircle className="w-16 h-16 text-red-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={fetchEmpresas}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Tentar novamente
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />
            <DeleteConfirmModal />

            {/* Estatísticas das empresas */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Factory className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Empresas</p>
                            <p className="text-2xl font-bold text-gray-900">{empresas.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Empresas Activas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {empresas.filter(c => c.estado === 'Ativo').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Building className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Empresas Agrícolas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {empresas.filter(e => e.tipoDeEntidade === 'EmpresaAgricola').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Users className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Cooperativas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {empresas.filter(e => e.tipoDeEntidade === 'CooperativaAgricola').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r rounded-t-xl from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col  md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div className=''>
                            <h1 className="text-2xl font-bold">Gestão de Empresas Florestais</h1>
                        </div>
                        <div className="flex gap-4">

                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados das empresas')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de ferramentas */}
                <div className="p-6 border-b  border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Busca */}
                        <div className="lg:col-span-2">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por nome, diretor ou email..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Região */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Região"
                                value={selectedRegion ? {
                                    label: selectedRegion,
                                    value: selectedRegion
                                } : null}
                                options={[
                                    { label: 'Todas as Regiões', value: '' },
                                    ...uniqueRegions.map(region => ({
                                        label: region,
                                        value: region
                                    }))
                                ]}
                                onChange={(option) => setSelectedRegion(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Actividade"
                                value={selectedTipo ? { label: selectedTipo, value: selectedTipo } : null}
                                options={[
                                    { label: 'Todas as Actividades', value: '' },
                                    { label: 'Produção Agrícola', value: 'PRODUCAO_AGRICOLA' },
                                    { label: 'Produção Pecuária', value: 'PRODUCAO_PECUARIA' },
                                    { label: 'Agroindústria', value: 'AGROINDUSTRIA' },
                                    { label: 'Comercialização', value: 'COMERCIALIZACAO' },
                                    { label: 'Assistência Técnica', value: 'ASSISTENCIA_TECNICA' }
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<School size={18} />}
                            />
                        </div>

                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status"
                                value={selectedStatus ? { label: selectedStatus, value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos os Status', value: '' },
                                    { label: 'Ativo', value: 'Ativo' },
                                    { label: 'Inativo', value: 'Inativo' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<CheckCircle size={18} />}
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
                                    Empresa
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Actividades
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Gestão
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acção
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-left">
                            {getCurrentItems().map((empresa) => (
                                <tr key={empresa.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line max-w-[290px]">
                                                    {empresa.nomeEntidade || 'Nome não informado'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">NIF: {empresa.nif}</div>
                                                <div className="text-xs text-gray-500">Pres.: {empresa.nomePresidente}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4">
                                        <div className="space-y-1 max-w-[200px]">
                                            {/* mostra apenas a primeira atividade */}
                                            {empresa.atividades?.length > 0 && (
                                                <div className="inline-block">
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 mr-1 mb-1">
                                                        {empresa.atividades[0]}
                                                    </span>
                                                </div>
                                            )}

                                            {/* mostra o "+X mais" se houver mais de 1 atividade */}
                                            {empresa.atividades?.length > 1 && (
                                                <div className="text-gray-400 text-xs">
                                                    +{empresa.atividades.length - 1} mais
                                                </div>
                                            )}
                                        </div>
                                    </td>


                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {empresa.municipio}, {empresa.provincia}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {empresa.comuna}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                                {empresa.telefone || 'N/A'}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                                {empresa.email || 'N/A'}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(empresa.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(empresa.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu escola={empresa} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className=''>
                            <tr>
                                <td colSpan={5}>
                                    {/* Paginação */}
                                    <div className="px-6 rounded-b-xl py-4 border-t border-gray-200 bg-white">
                                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                            <div className="text-sm text-gray-700">
                                                Mostrando{' '}
                                                <span className="font-medium">{filteredEscolas.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredEscolas.length)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{filteredEscolas.length}</span>
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
                    {getCurrentItems().map((empresa) => (
                        <div key={empresa.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Factory className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{empresa.nomeEntidade}</h3>
                                            <div className="text-xs text-gray-500 mt-1">NIF: {empresa.nif}</div>
                                            <div className="text-xs text-gray-500">Pres.: {empresa.nomePresidente}</div>
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{empresa.municipio}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {empresa.telefone}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Mail className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{empresa.email}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <CheckCircle className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {empresa.estado}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(empresa.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(empresa.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <ActionMenu escola={empresa} />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Nenhum resultado encontrado */}
                {filteredEscolas.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma informação encontrada</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedRegion || selectedTipo || selectedStatus ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedRegion('');
                                    setSelectedTipo('');
                                    setSelectedStatus('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestaoEmpresasFlorestal;