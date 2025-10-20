import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FlaskConical,
    Mail,
    MapPin,
    MoreVertical,
    Phone,
    PlusCircle,
    Search,
    Trash2,
    User,
    X,
    Edit,
    Settings
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';

// Dados fictícios dos laboratórios
const laboratoriosData = [
    {
        id: 1,
        nomeLaboratorio: "Laboratório Central de Luanda",
        sigla: "LABCENT",
        tipoLaboratorio: "INTERNO",
        provincia: "LUANDA",
        municipio: "Luanda",
        enderecoCompleto: "Rua Comandante Che Guevara, 123, Maianga",
        responsavelTecnico: "Dr. António Silva Santos",
        telefone: "+244 222 345 678",
        email: "labcentral@agricultura.gov.ao",
        tiposAnalise: ["QUIMICA", "FISICA", "MINERALOGICA"],
        capacidadeProcessamento: 50,
        status: "ACTIVO",
        observacoes: "Laboratório principal com equipamentos de última geração",
        dataCadastro: "2024-01-15"
    },
    {
        id: 2,
        nomeLaboratorio: "Instituto de Investigação Agronómica",
        sigla: "IIA",
        tipoLaboratorio: "INTERNO",
        provincia: "HUAMBO",
        municipio: "Huambo",
        enderecoCompleto: "Zona Industrial, Lote 45, Huambo",
        responsavelTecnico: "Eng. Maria João Fernandes",
        telefone: "+244 241 123 456",
        email: "iia.huambo@agricultura.gov.ao",
        tiposAnalise: ["QUIMICA", "FISICA"],
        capacidadeProcessamento: 30,
        status: "ACTIVO",
        observacoes: "Especializado em análises de fertilidade do solo",
        dataCadastro: "2024-02-10"
    },
    {
        id: 3,
        nomeLaboratorio: "SIGLAB - Laboratórios Associados",
        sigla: "SIGLAB",
        tipoLaboratorio: "EXTERNO",
        provincia: "BENGUELA",
        municipio: "Benguela",
        enderecoCompleto: "Av. Norton de Matos, 567, Centro",
        responsavelTecnico: "Dr. Carlos Alberto Mendes",
        telefone: "+244 272 987 654",
        email: "contato@siglab.ao",
        tiposAnalise: ["QUIMICA", "AMBIENTAL"],
        capacidadeProcessamento: 25,
        status: "ACTIVO",
        observacoes: "Laboratório privado certificado ISO 17025",
        dataCadastro: "2024-03-05"
    },
    {
        id: 4,
        nomeLaboratorio: "Centro de Análises do Sul",
        sigla: "CAS",
        tipoLaboratorio: "PARCEIRO",
        provincia: "HUILA",
        municipio: "Lubango",
        enderecoCompleto: "Rua da Samba, 89, Lubango",
        responsavelTecnico: "Eng. Ana Paula Costa",
        telefone: "+244 261 456 789",
        email: "cas.lubango@email.com",
        tiposAnalise: ["FISICA", "MINERALOGICA"],
        capacidadeProcessamento: 20,
        status: "INATIVO",
        observacoes: "Temporariamente suspenso para manutenção de equipamentos",
        dataCadastro: "2024-01-20"
    },
    {
        id: 5,
        nomeLaboratorio: "AGROLAB Norte",
        sigla: "AGRONORTE",
        tipoLaboratorio: "EXTERNO",
        provincia: "UIGE",
        municipio: "Uíge",
        enderecoCompleto: "Bairro Kimbo, Quarteirão 12, Casa 34",
        responsavelTecnico: "Dr. Pedro Miguel Santos",
        telefone: "+244 234 567 890",
        email: "agrolab.norte@gmail.com",
        tiposAnalise: ["QUIMICA"],
        capacidadeProcessamento: 15,
        status: "ACTIVO",
        observacoes: "Laboratório regional especializado em análises químicas",
        dataCadastro: "2024-04-12"
    }
];

const GestaoDeLaboratorios = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 6;
    const containerRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [laboratorioDelete, setLaboratorioDelete] = useState(null);

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
            case 'ACTIVO':
                return 'bg-green-100 text-green-800';
            case 'INATIVO':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    // Função para obter ícone do status
    const getStatusIcon = (status) => {
        switch (status) {
            case 'ACTIVO':
                return '';
            case 'INATIVO':
                return '';
            default:
                return '';
        }
    };

    // Função para obter texto do tipo
    const getTipoText = (tipo) => {
        switch (tipo) {
            case 'INTERNO':
                return 'Interno';
            case 'EXTERNO':
                return 'Externo';
            case 'PARCEIRO':
                return 'Parceiro';
            default:
                return tipo;
        }
    };

    // Função para obter texto dos tipos de análise
    const getTiposAnaliseText = (tipos) => {
        const tiposMap = {
            'QUIMICA': 'Química',
            'FISICA': 'Física',
            'MINERALOGICA': 'Mineralógica',
            'AMBIENTAL': 'Ambiental'
        };
        return tipos.map(tipo => tiposMap[tipo] || tipo).join(', ');
    };

    // Filtragem dos laboratórios
    const filteredLaboratorios = laboratoriosData.filter(laboratorio => {
        const matchesSearch = !searchTerm ||
            laboratorio.nomeLaboratorio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            laboratorio.provincia?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            laboratorio.responsavelTecnico?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesProvincia = !selectedProvincia || laboratorio.provincia === selectedProvincia;
        const matchesTipo = !selectedTipo || laboratorio.tipoLaboratorio === selectedTipo;
        const matchesStatus = !selectedStatus || laboratorio.status === selectedStatus;

        return matchesSearch && matchesProvincia && matchesTipo && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredLaboratorios.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredLaboratorios.slice(startIndex, endIndex);
    };

    // Navegação para visualizar laboratório
    const handleViewLaboratorio = (laboratorioId) => {
        navigate(`/GerenciaRNPA/laboratorio-solo/gestao-laboratorios/visualizar/${laboratorioId}`);
    };

    // Navegação para editar laboratório
    const handleEditLaboratorio = (laboratorioId) => {
        navigate(`/GerenciaRNPA/laboratorio-solo/gestao-laboratorios/editar/${laboratorioId}`);
    };

    // Navegação para novo laboratório
    const handleNovoLaboratorio = () => {
        navigate('/GerenciaRNPA/laboratorio-solo/gestao-laboratorios/cadastro');
    };

    // Extrair valores únicos para filtros
    const uniqueProvincias = [...new Set(laboratoriosData.map(l => l.provincia))].filter(Boolean);
    const uniqueTipos = [...new Set(laboratoriosData.map(l => l.tipoLaboratorio))].filter(Boolean);
    const uniqueStatus = [...new Set(laboratoriosData.map(l => l.status))].filter(Boolean);

    // Função para abrir modal de confirmação
    const openDeleteModal = (laboratorioId) => {
        setLaboratorioDelete(laboratorioId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setLaboratorioDelete(null);
    };

    // Função para deletar laboratório após confirmação
    const handleConfirmDelete = async () => {
        if (!laboratorioDelete) return;
        try {
            // Simular exclusão - substituir pela API real
            await new Promise(resolve => setTimeout(resolve, 1000));
            showToast('success', 'Excluído', 'Laboratório excluído com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir laboratório.');
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
    const ActionMenu = ({ laboratorio }) => {
        const [isOpen, setIsOpen] = useState(false);

        const actionItems = [
            { label: 'Visualizar', icon: <Eye size={16} />, action: () => handleViewLaboratorio(laboratorio.id) },
            { label: 'Editar', icon: <Edit size={16} />, action: () => handleEditLaboratorio(laboratorio.id) },
            { label: 'Excluir', icon: <Trash2 size={16} />, action: () => openDeleteModal(laboratorio.id) }
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
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-700 transition-colors"
                                    onClick={() => {
                                        item.action();
                                        setIsOpen(false);
                                    }}
                                >
                                    <span className="mr-2 text-orange-500">{item.icon}</span>
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
        const laboratorio = laboratoriosData.find(l => l.id === laboratorioDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o laboratório <span className="font-semibold text-red-600">{laboratorio?.nomeLaboratorio || 'Selecionado'}</span>?<br />
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

            {/* Estatísticas dos laboratórios */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <Building2 className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Laboratórios</p>
                            <p className="text-2xl font-bold text-gray-900">{laboratoriosData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Laboratórios Ativos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {laboratoriosData.filter(l => l.status === 'ACTIVO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <FlaskConical className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Capacidade Total</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {laboratoriosData.reduce((total, l) => total + l.capacidadeProcessamento, 0)} /dia
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <MapPin className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Províncias Cobertas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {uniqueProvincias.length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-orange-700 to-orange-500 p-6 text-white rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Laboratórios</h1>
                            <p className="text-orange-100 mt-1">Gerencie laboratórios parceiros e suas capacidades técnicas</p>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={handleNovoLaboratorio}
                                className="inline-flex items-center px-4 py-2 bg-white text-orange-700 rounded-lg hover:bg-orange-50 transition-colors shadow-sm font-medium"
                            >
                                <PlusCircle className="w-5 h-5 mr-2" />
                                Novo Laboratório
                            </button>
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados dos laboratórios')}
                                className="inline-flex items-center px-4 py-2 bg-white text-orange-700 rounded-lg hover:bg-orange-50 transition-colors shadow-sm font-medium"
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
                                placeholder="Buscar por nome, província ou responsável..."
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

                        {/* Filtro Tipo */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Laboratório"
                                value={selectedTipo ? { label: getTipoText(selectedTipo), value: selectedTipo } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    ...uniqueTipos.map(tipo => ({
                                        label: getTipoText(tipo),
                                        value: tipo
                                    }))
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<Building2 size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status"
                                value={selectedStatus ? { label: selectedStatus, value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos os Status', value: '' },
                                    ...uniqueStatus.map(status => ({
                                        label: status,
                                        value: status
                                    }))
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Settings size={18} />}
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
                                    Nome & Tipo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Responsável & Contacto
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipos de Análise
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Estado & Capacidade
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acções
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-start">
                            {getCurrentItems().map((laboratorio) => (
                                <tr key={laboratorio.id} className="hover:bg-orange-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-600 to-orange-500 flex items-center justify-center font-semibold text-sm">
                                                <span className='text-white'>{laboratorio.sigla?.substring(0, 2) || 'LA'}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900 max-w-[200px] truncate">{laboratorio.nomeLaboratorio}</div>
                                                <div className="text-xs text-gray-500 mt-1">{getTipoText(laboratorio.tipoLaboratorio)}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900">{laboratorio.provincia}</div>
                                            <div className="text-xs text-gray-500">{laboratorio.municipio}</div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm text-gray-900 max-w-[180px] truncate">{laboratorio.responsavelTecnico}</div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Phone className="w-3 h-3 mr-1" />
                                                {laboratorio.telefone}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-500">
                                                <Mail className="w-3 h-3 mr-1" />
                                                <span className="truncate max-w-[150px]">{laboratorio.email}</span>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900 max-w-[150px]">
                                            {getTiposAnaliseText(laboratorio.tiposAnalise)}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(laboratorio.status)}`}>
                                                {getStatusIcon(laboratorio.status)} {laboratorio.status}
                                            </div>
                                            <div className="text-xs text-gray-500">
                                                {laboratorio.capacidadeProcessamento} amostras/dia
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewLaboratorio(laboratorio.id)}
                                                className="p-2 hover:bg-orange-100 text-orange-600 hover:text-orange-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(laboratorio.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu laboratorio={laboratorio} />
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
                                                <span className="font-medium">{filteredLaboratorios.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredLaboratorios.length)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{filteredLaboratorios.length}</span>
                                                {' '}resultados
                                            </div>

                                            <div className="flex space-x-2">
                                                <button
                                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                                    disabled={currentPage === 1}
                                                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${currentPage === 1
                                                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                                            : 'bg-white text-orange-700 hover:bg-orange-50 border border-orange-200'
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
                                                            : 'bg-white text-orange-700 hover:bg-orange-50 border border-orange-200'
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
                    {getCurrentItems().map((laboratorio) => (
                        <div key={laboratorio.id} className="p-4 border-b border-gray-200 hover:bg-orange-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-orange-100 rounded-full flex items-center justify-center">
                                    <Building2 className="h-8 w-8 text-orange-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{laboratorio.nomeLaboratorio}</h3>
                                            <div className="text-xs text-gray-500 mt-1">{getTipoText(laboratorio.tipoLaboratorio)}</div>
                                            <div className="text-xs text-gray-500">{laboratorio.provincia}, {laboratorio.municipio}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusBadge(laboratorio.status)}`}>
                                            {getStatusIcon(laboratorio.status)} {laboratorio.status}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-1 gap-2">
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Responsável:</span> {laboratorio.responsavelTecnico}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Telefone:</span> {laboratorio.telefone}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Análises:</span> {getTiposAnaliseText(laboratorio.tiposAnalise)}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Capacidade:</span> {laboratorio.capacidadeProcessamento} amostras/dia
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewLaboratorio(laboratorio.id)}
                                                className="p-1.5 bg-orange-50 hover:bg-orange-100 text-orange-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditLaboratorio(laboratorio.id)}
                                                className="p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(laboratorio.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                        <ActionMenu laboratorio={laboratorio} />
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

export default GestaoDeLaboratorios;