import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Plus,
    Pencil,
    Trash2,
    ChevronLeft,
    ChevronRight,
    Filter,
    Download,
    MoreVertical,
    Phone,
    Mail,
    Eye,
    AlertCircle,
    CheckCircle,
    X,
    Share2,
    FileText,
    Globe,
    MapPin,
    Calendar,
    Info,
    School,
    Building,
    Users,
    GraduationCap,
    User,
    Award,
    Activity,
    PlusCircle
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
import { useCooperativas } from '../../hooks/useCooperativas';

// Dados estáticos das empresas
const empresasAdaptadas = [
    {
        id: 1,
        nomeempresas: "AgroTech Angola Lda",
        sigla: "5417890123",
        nif: "5417890123",
        dataFundacao: "2015-08-20",
        provincia: "LUANDA",
        municipio: "Luanda",
        comuna: "Ingombota",
        telefone: "222567890",
        email: "info@agrotech.ao",
        atividades: ["Agricultura", "Tecnologia"],
        outrasAtividades: "Sistemas de irrigação",
        numeroMembros: 85,
        areaTotal: 250,
        presidente: "Maria Santos Costa",
        status: "ATIVO"
    },
    {
        id: 2,
        nomeempresas: "Pecuária do Sul SA",
        sigla: "5418901234",
        nif: "5418901234",
        dataFundacao: "2012-03-10",
        provincia: "HUÍLA",
        municipio: "Lubango",
        comuna: "Arimba",
        telefone: "261234567",
        email: "geral@pecuariasul.ao",
        atividades: ["Pecuária"],
        outrasAtividades: "Processamento de carne",
        numeroMembros: 120,
        areaTotal: 500,
        presidente: "António Ferreira",
        status: "ATIVO"
    },
    {
        id: 3,
        nomeempresas: "Benguela Agro Empresa",
        sigla: "5419012345",
        nif: "5419012345",
        dataFundacao: "2018-11-05",
        provincia: "BENGUELA",
        municipio: "Benguela",
        comuna: "Benguela",
        telefone: "272345678",
        email: "comercial@benguelaagro.ao",
        atividades: ["Agricultura", "Aquicultura"],
        outrasAtividades: "Exportação de produtos",
        numeroMembros: 65,
        areaTotal: 180,
        presidente: "Carlos Mendes",
        status: "ATIVO"
    },
    {
        id: 4,
        nomeempresas: "Florestal Cabinda Lda",
        sigla: "5420123456",
        nif: "5420123456",
        dataFundacao: "2020-01-15",
        provincia: "CABINDA",
        municipio: "Cabinda",
        comuna: "Cabinda",
        telefone: "231456789",
        email: "florestal@cabinda.ao",
        atividades: ["Produtos florestais"],
        outrasAtividades: "Reflorestamento",
        numeroMembros: 40,
        areaTotal: 300,
        presidente: "Isabel Rodrigues",
        status: "ATIVO"
    },
    {
        id: 5,
        nomeempresas: "Huambo Agropecuária SA",
        sigla: "5421234567",
        nif: "5421234567",
        dataFundacao: "2016-07-22",
        provincia: "HUAMBO",
        municipio: "Huambo",
        comuna: "Huambo",
        telefone: "241567890",
        email: "huambo@agropecuaria.ao",
        atividades: ["Agropecuária"],
        outrasAtividades: "Distribuição de sementes",
        numeroMembros: 95,
        areaTotal: 220,
        presidente: "Pedro Nunes",
        status: "INATIVO"
    }
];

// Dados estáticos das administrações regionais
const administracoesEstaticas = [
    { id: 1, nome: "Administração Regional de Luanda" },
    { id: 2, nome: "Administração Regional de Benguela" },
    { id: 3, nome: "Administração Regional de Huambo" },
    { id: 4, nome: "Administração Regional de Huíla" },
    { id: 5, nome: "Administração Regional de Cabinda" }
];

const GestaoEmpresas = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const containerRef = useRef(null);
    const itemsPerPage = 6;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [empresasToDelete, setempresasToDelete] = useState(null);

    // Usar dados estáticos para empresas
    const empresass = empresasAdaptadas;
    const loading = false;
    const error = null;
    const deleteempresas = async (id) => {
        console.log('Deletar empresa:', id);
    };
    const fetchempresass = () => {
        console.log('Buscar empresas');
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

    // Alternar status da escola
    const toggleStatus = (escolaId, currentStatus) => {
        // Aqui você pode implementar a atualização real se desejar
        showToast(
            'info',
            'Função não implementada',
            'A alteração de status deve ser implementada na API.'
        );
    };

    // Filtragem das escolas
    const filteredEscolas = empresass.filter(empresas => {
        const matchesSearch = empresas.nomeempresas?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresas.presidente?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            empresas.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = !selectedRegion || empresas.provincia === selectedRegion;
        const matchesTipo = !selectedTipo || (empresas.atividades && empresas.atividades.includes(selectedTipo));
        const matchesStatus = !selectedStatus || empresas.status === selectedStatus;

        return matchesSearch && matchesRegion && matchesTipo && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredEscolas.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEscolas.slice(startIndex, endIndex);
    };

    // Navegação (simulada)
    const handleViewEscola = (empresasId) => {
        navigate(`/GerenciaRNPA/gestao-empresas/empresas/visualizar/${empresasId}`);
    };


    const handleTransferencia = (empresasId) => {
        // Navegar para a rota de cadastro de produção passando o ID
        navigate(`/GerenciaRNPA/entidades-associativas/cadastro-producao-empresas/${empresasId}`);
    };

    const handleRelatorios = (escolaId) => {
        showToast('info', 'Area em desenvolvimento');
    };

    const handleInfraestrutura = (escolaId) => {
        showToast('info', 'Area em desenvolvimento');
    };

    const handlePessoal = (escolaId) => {
        showToast('info', 'Area em desenvolvimento');
    };

    // Função para abrir modal de confirmação
    const openDeleteModal = (empresasId) => {
        setempresasToDelete(empresasId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setempresasToDelete(null);
    };

    // Função para deletar empresas após confirmação
    const handleConfirmDelete = async () => {
        if (!empresasToDelete) return;
        try {
            await deleteempresas(empresasToDelete);
            showToast('success', 'Excluído', 'Empresa excluída com sucesso!');
        } catch (erro) {
            showToast('error', 'Erro', 'Erro ao excluir empresa.');
            console(erro)
        } finally {
            closeDeleteModal();
        }
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Cadastro de Produção', icon: <PlusCircle size={16} />, action: handleTransferencia },
        { label: 'Relatóriosn', icon: <FileText size={16} />, action: "" },
        { label: 'Infraestrutura', icon: <Building size={16} />, action: handleInfraestrutura },
        { label: 'Gestão de Pessoal', icon: <User size={16} />, action: handlePessoal }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Obter label do tipo de ensino
   { /* const getTipoEnsinoLabel = (tipo) => {
        const tipos = {
            'GERAL': 'Ensino Geral',
            'TECNICO_PROFISSIONAL': 'Técnico-Profissional',
            'MISTO': 'Misto'
        };
        return tipos[tipo] || tipo;
    };*/}

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

    // Cores para diferentes tipos de ensino
    const tipoColors = {
        'GERAL': 'bg-blue-100 text-blue-800 border-blue-300',
        'TECNICO_PROFISSIONAL': 'bg-purple-100 text-purple-800 border-purple-300',
        'MISTO': 'bg-green-100 text-green-800 border-green-300'
    };

    // Extrair regiões únicas para o filtro
    const uniqueRegions = [...new Set(empresass.map(escola => escola.provincia))].filter(Boolean);

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const empresas = empresass.find(c => c.id === empresasToDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir a empresa <span className="font-semibold text-red-600">{empresas?.nomeempresas || 'Selecionada'}</span>?<br/>
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

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />
            <DeleteConfirmModal />
               {/* Estatísticas das empresass */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{empresass.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {empresass.filter(c => c.status === 'ATIVO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <GraduationCap className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Funcionários</p>
                            <p className="text-2xl font-bold text-gray-900">
                                0
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Building className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Área (ha)</p>
                            <p className="text-2xl font-bold text-gray-900">
                               0
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Empresas Agrícolas</h1>
                            {/* <p className="text-blue-100 mt-1">SistGestão Geral e Técnico-Profissional - Angola</p> */}
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
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {/* Busca */}
                        <div className="lg:col-span-2">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por nome, gestor ou email..."
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
                                    label: getAdminRegionalName(selectedRegion),
                                    value: selectedRegion
                                } : null}
                                options={[
                                    { label: 'Todas as Regiões', value: '' },
                                    ...uniqueRegions.map(region => ({
                                        label: getAdminRegionalName(region),
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
                                    { label: 'Todas as Atividades', value: '' },
                                    { label: 'Agricultura', value: 'Agricultura' },
                                    { label: 'Pecuária', value: 'Pecuária' },
                                    { label: 'Agropecuária', value: 'Agropecuária' },
                                    { label: 'Aquicultura', value: 'Aquicultura' },
                                    { label: 'Produtos florestais', value: 'Produtos florestais' }
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<School size={18} />}
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
                                    Funcionários & Área
                                </th>
                                
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acção
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-left">
                            {getCurrentItems().map((empresas) => (
                                <tr key={empresas.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {empresas.nomeempresas.charAt(0)}{empresas.nomeempresas.split(' ').pop().charAt(0)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line max-w-[290px]">{empresas.nomeempresas}</div>
                                                <div className="text-xs text-gray-500 mt-1">NIF: {empresas.sigla}</div>
                                                <div className="text-xs text-gray-500">Gestor: {empresas.presidente}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {empresas.atividades.slice(0, 1).map(a => a.replace(/[-_]/g, ' ')).join(', ')}
                                            </div>
                                            {empresas.atividades.length > 2 && (
                                                <span className="text-gray-400 text-xs"> +{empresas.atividades.length - 2}</span>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {empresas.municipio}, {empresas.provincia}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {empresas.comuna}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Users className="w-4 h-4 mr-2 text-blue-500" />
                                                {empresas.numeroMembros} funcionários
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Building className="w-4 h-4 mr-2 text-blue-500" />
                                                {empresas.areaTotal} hectares
                                            </div>
                                        </div>
                                    </td>

                                

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-start space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(empresas.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(empresas.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu escola={empresas} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-visible" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((escola) => (
                        <div key={escola.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {escola.nomeempresas.charAt(0)}{escola.nomeempresas.split(' ').pop().charAt(0)}
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{escola.nomeempresas}</h3>
                                            <div className="text-xs text-gray-500 mt-1">NIF: {escola.sigla}</div>
                                            {/* <div className="text-xs text-gray-500">Dir.: {escola.diretor}</div> */}
                                        </div>
                                        {/* <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${tipoColors[escola.tipoEnsino] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                            {getTipoEnsinoLabel(escola.tipoEnsino)}
                                        </div> */}
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{escola.municipio}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Users className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {escola.numeroMembros} Funcionários
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {escola.telefone}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Building className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {escola.areaTotal} Hectares
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(escola.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(escola.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${escola.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-400'
                                                    }`}></span>
                                                <span className={`text-xs font-medium ${escola.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'
                                                    }`}>
                                                    {escola.status}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => toggleStatus(escola.id, escola.status)}
                                                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${escola.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-200'
                                                    }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${escola.status === 'ATIVO' ? 'translate-x-5' : 'translate-x-0'
                                                        }`}
                                                />
                                            </button>
                                            <ActionMenu escola={escola} />
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
                        ) : (
                            <p/>
                               
                        )}
                    </div>
                )}
            </div>

            {/* Estatísticas das escolas */}
         
        </div>
    );
};

export default GestaoEmpresas;