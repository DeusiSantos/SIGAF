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
    PlusCircle,
    Warehouse,
    Package,
    Boxes
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';

// Dados fictícios dos silos - estrutura baseada no formulário de cadastro
const silosData = [
    {
        id: 1,
        // Identificação (Step 1)
        nomeSilo: "Silo Central de Luanda",
        tipoUnidade: "SILO_METALICO",
        codigoRegistro: "SCL001",

        // Localização (Step 2)
        endereco: "Zona Industrial de Luanda, Viana",
        municipio: "Viana",
        provincia: "LUANDA",
        latitude: "-8.838333",
        longitude: "13.234444",

        // Proprietário/Responsável (Step 3)
        nomeProprietario: "António Silva Santos",
        entidade: "Agro Luanda Lda",
        nifProprietario: "5417189144",
        telefoneProprietario: "222345678",
        emailProprietario: "silo.central@agroluanda.ao",

        // Capacidade de Armazenamento (Step 4)
        capacidadeTotal: 5000,
        capacidadeUtilizada: 3200,
        numeroUnidades: 8,
        produtosArmazenados: ["MILHO", "ARROZ", "FEIJAO"],

        // Infraestrutura e Equipamentos (Step 5)
        sistemaSeccagem: true,
        sistemaVentilacao: true,
        sistemaProtecaoPragas: true,
        tipoEnergia: "REDE_PUBLICA",
        estadoVias: "BOA",
        equipamentosDisponiveis: ["BALANCAS", "ESTEIRAS", "ELEVADORES"],

        // Situação Legal (Step 6)
        licencaOperacao: true,
        certificacaoSanitaria: true,
        dataLicenca: "2023-01-15",
        validadeLicenca: "2025-01-15",
        outrasAutorizacoes: "Licença ambiental municipal",

        // Observações
        observacoes: "Silo principal da região com alta capacidade de armazenamento",

        status: "ATIVO"
    },
    {
        id: 2,
        // Identificação (Step 1)
        nomeSilo: "Centro de Armazenamento Benguela",
        tipoUnidade: "ARMAZEM_GRANELEIRO",
        codigoRegistro: "CAB002",

        // Localização (Step 2)
        endereco: "Zona Industrial, Benguela",
        municipio: "Benguela",
        provincia: "BENGUELA",
        latitude: "-12.576111",
        longitude: "13.405556",

        // Proprietário/Responsável (Step 3)
        nomeProprietario: "Maria João Fernandes",
        entidade: "Cooperativa Agrícola Benguela",
        nifProprietario: "5417189145",
        telefoneProprietario: "272123456",
        emailProprietario: "armazem@coopbenguela.ao",

        // Capacidade de Armazenamento (Step 4)
        capacidadeTotal: 3000,
        capacidadeUtilizada: 1800,
        numeroUnidades: 5,
        produtosArmazenados: ["MILHO", "SOJA", "TRIGO"],

        // Infraestrutura e Equipamentos (Step 5)
        sistemaSeccagem: true,
        sistemaVentilacao: false,
        sistemaProtecaoPragas: true,
        tipoEnergia: "HIBRIDO",
        estadoVias: "REGULAR",
        equipamentosDisponiveis: ["BALANCAS", "LIMPEZA"],

        // Situação Legal (Step 6)
        licencaOperacao: true,
        certificacaoSanitaria: true,
        dataLicenca: "2023-03-20",
        validadeLicenca: "2025-03-20",
        outrasAutorizacoes: "Certificação ISO 9001",

        // Observações
        observacoes: "Centro especializado em grãos com sistema híbrido de energia",

        status: "ATIVO"
    },
    {
        id: 3,
        // Identificação (Step 1)
        nomeSilo: "Armazém Rural Huambo",
        tipoUnidade: "ARMAZEM_CONVENCIONAL",
        codigoRegistro: "ARH003",

        // Localização (Step 2)
        endereco: "Zona Rural, Huambo",
        municipio: "Huambo",
        provincia: "HUAMBO",
        latitude: "-12.776111",
        longitude: "15.738889",

        // Proprietário/Responsável (Step 3)
        nomeProprietario: "José Carlos Mateus",
        entidade: "Associação de Produtores do Huambo",
        nifProprietario: "5417189146",
        telefoneProprietario: "241987654",
        emailProprietario: "armazem.huambo@gmail.com",

        // Capacidade de Armazenamento (Step 4)
        capacidadeTotal: 1500,
        capacidadeUtilizada: 900,
        numeroUnidades: 3,
        produtosArmazenados: ["MILHO", "FEIJAO", "AMENDOIM"],

        // Infraestrutura e Equipamentos (Step 5)
        sistemaSeccagem: false,
        sistemaVentilacao: true,
        sistemaProtecaoPragas: false,
        tipoEnergia: "GERADOR",
        estadoVias: "MA",
        equipamentosDisponiveis: ["BALANCAS"],

        // Situação Legal (Step 6)
        licencaOperacao: false,
        certificacaoSanitaria: false,
        dataLicenca: null,
        validadeLicenca: null,
        outrasAutorizacoes: null,

        // Observações
        observacoes: "Armazém rural em processo de regularização",

        status: "PENDENTE"
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

const GestaoSilos = () => {
    // Função para navegação de gestão de pessoal
    const handlePessoal = (cooperativaId) => {
        navigate(`/GerenciaRNPA/entidades-associativas/pessoal/${cooperativaId}`);
    };
    // Função para navegação de infraestrutura
    const handleInfraestrutura = (cooperativaId) => {
        navigate(`/GerenciaRNPA/entidades-associativas/infraestrutura/${cooperativaId}`);
    };
    // Função para navegação de relatórios
    const handleRelatorios = (cooperativaId) => {
        navigate(`/GerenciaRNPA/entidades-associativas/relatorios/${cooperativaId}`);
    };
    const navigate = useNavigate();
    // const { associacoesRurais, deleteAssociacaoRural } = useAssociacaoRural();
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
    // Estados para o modal de exclusão
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [associacaoToDelete, setAssociacaoToDelete] = useState(null);

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



    // Filtragem dos silos
    const filteredSilos = silosData.filter(silo => {
        const matchesSearch = silo.nomeSilo.toLowerCase().includes(searchTerm.toLowerCase()) ||
            silo.nomeProprietario.toLowerCase().includes(searchTerm.toLowerCase()) ||
            silo.emailProprietario.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = !selectedRegion || silo.provincia === selectedRegion;
        const matchesTipo = !selectedTipo || silo.tipoUnidade === selectedTipo;
        const matchesStatus = !selectedStatus || silo.status === selectedStatus;

        return matchesSearch && matchesRegion && matchesTipo && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredSilos.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredSilos.slice(startIndex, endIndex);
    };

    // Navegação para visualizar associação rural
    const handleViewEscola = (associacaoId) => {
        navigate(`/GerenciaRNPA/entidades-associativas/visualizar-associacao/${associacaoId}`);
    };



    const handleTransferencia = (cooperativaId) => {
        // Navegar para a rota de cadastro de produção passando o ID
        navigate(`/GerenciaRNPA/entidades-associativas/cadastro-producao-associacoes/${cooperativaId}`);
    };



    // Ações do menu dropdown
    const actionItems = [
        { label: 'Cadastro da Produção', icon: <PlusCircle size={16} />, action: handleTransferencia },
        // eslint-disable-next-line no-undef
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorios },
        // eslint-disable-next-line no-undef
        { label: 'Infraestrutura', icon: <Building size={16} />, action: handleInfraestrutura },
        // eslint-disable-next-line no-undef
        { label: 'Gestão de Pessoal', icon: <User size={16} />, action: handlePessoal }
    ];

    // Formatar data
    //const formatDate = (dateString) => {
    //   if (!dateString) return 'N/A';
    //  const date = new Date(dateString);
    //   return date.toLocaleDateString('pt-BR');
    // };

    // Obter label do tipo de ensino
    {/*const getTipoEnsinoLabel = (tipo) => {
        const tipos = {
            'GERAL': 'Ensino Geral',
            'TECNICO_PROFISSIONAL': 'Técnico-Profissional',
            'MISTO': 'Misto'
        };
        return tipos[tipo] || tipo;
    */};

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
    const uniqueRegions = [...new Set(silosData.map(silo => silo.provincia))].filter(Boolean);

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

    // Função para deletar entreposto após confirmação
    const handleConfirmDelete = async () => {
        if (!associacaoToDelete) return;
        try {
            // TODO: Implementar delete do entreposto
            showToast('success', 'Excluído', 'Silo excluído com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir silo.');
            console.error(err);
        } finally {
            closeDeleteModal();
        }
    };

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const silo = silosData.find(c => c.id === associacaoToDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o silo <span className="font-semibold text-red-600">{silo?.nomeSilo || 'Selecionado'}</span>?<br />
                        Esta ação não pode ser desfeita. Todos os dados do silo serão removidos permanentemente.
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

            {/* Estatísticas dos silos */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Boxes className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Silos</p>
                            <p className="text-2xl font-bold text-gray-900">{silosData.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Licenças</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {silosData.filter(c => c.licencaOperacao === true).length}
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
                            <p className="text-sm font-medium text-gray-500">Capacidade Total (t)</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {silosData.reduce((total, s) => total + s.capacidadeTotal, 0).toLocaleString()}
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
                            <p className="text-sm font-medium text-gray-500">Capacidade Utilizada (t)</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {silosData.reduce((total, s) => total + s.capacidadeUtilizada, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-yellow-700 to-yellow-500 p-6 text-white rounded-t-xl

">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Silos e Centros de Armazenamento</h1>
                        </div>
                        <div className="flex gap-4">

                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados dos silos')}
                                className="inline-flex items-center px-4 py-2 bg-white text-yellow-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
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
                                placeholder="Buscar por nome do silo, proprietário ou email..."
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
                                    label: getAdminRegionalName(parseInt(selectedRegion)),
                                    value: selectedRegion
                                } : null}
                                options={[
                                    { label: 'Todas as Regiões', value: '' },
                                    ...uniqueRegions.map(provincia => ({
                                        label: provincia,
                                        value: provincia
                                    }))
                                ]}
                                onChange={(option) => setSelectedRegion(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Unidade"
                                value={selectedTipo ? { label: selectedTipo, value: selectedTipo } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    { label: 'Silo Metálico', value: 'SILO_METALICO' },
                                    { label: 'Silo de Concreto', value: 'SILO_CONCRETO' },
                                    { label: 'Armazém Convencional', value: 'ARMAZEM_CONVENCIONAL' },
                                    { label: 'Armazém Graneleiro', value: 'ARMAZEM_GRANELEIRO' },
                                    { label: 'Centro de Distribuição', value: 'CENTRO_DISTRIBUICAO' },
                                    { label: 'Outro', value: 'OUTRO' }
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<Warehouse size={18} />}
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
                                    Silo/Centro
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipo & Produtos
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Capacidade & Licenças
                                </th>

                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acção
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-start">
                            {getCurrentItems().map((silo) => (
                                <tr key={silo.id} className="hover:bg-yellow-50 transition-colors">

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-600 to-yellow-500 flex items-center justify-center font-semibold text-sm">
                                                <span className='text-white'> {silo.nomeSilo.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase()}</span>
                                            </div>
                                            <div className="ml-4">

                                                <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line max-w-[290px]">{silo.nomeSilo}</div>
                                                <div className="text-xs text-gray-500 mt-1">Código: {silo.codigoRegistro}</div>
                                                <div className="text-xs text-gray-500">Prop.: {silo.nomeProprietario}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">
                                                {silo.tipoUnidade.replace(/[-_]/g, ' ')}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {silo.produtosArmazenados.length} produtos
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {silo.municipio}, {silo.provincia}
                                            </div>

                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Package className="w-4 h-4 mr-2 text-blue-500" />
                                                {silo.capacidadeTotal}t ({silo.numeroUnidades} unidades)
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <CheckCircle className={`w-4 h-4 mr-2 ${silo.licencaOperacao ? 'text-green-500' : 'text-red-500'}`} />
                                                Licença: {silo.licencaOperacao ? 'SIM' : 'NÃO'}
                                            </div>
                                        </div>
                                    </td>



                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(silo.id)}
                                                className="p-2 hover:bg-yellow-100 text-yellow-600 hover:text-yellow-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(silo.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu escola={silo} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={5}>
                                    {/* Paginação */}
                                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                            <div className="text-sm text-gray-700">
                                                Mostrando{' '}
                                                <span className="font-medium">{filteredSilos.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredSilos.length)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{filteredSilos.length}</span>
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
                    {getCurrentItems().map((silo) => (
                        <div key={silo.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Warehouse className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{silo.nomeSilo}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Código: {silo.codigoRegistro}</div>
                                            <div className="text-xs text-gray-500">Prop.: {silo.nomeProprietario}</div>
                                        </div>
                                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {silo.tipoUnidade.replace(/[-_]/g, ' ')}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{silo.municipio}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Package className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {silo.capacidadeTotal}t
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {silo.telefoneProprietario}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Activity className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {silo.numeroUnidades} unidades
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(silo.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(silo.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${silo.status === 'ATIVO' ? 'bg-green-500' : silo.status === 'PENDENTE' ? 'bg-yellow-500' : 'bg-gray-400'}`}></span>
                                                <span className={`text-xs font-medium ${silo.status === 'ATIVO' ? 'text-green-600' : silo.status === 'PENDENTE' ? 'text-yellow-600' : 'text-gray-500'}`}>
                                                    {silo.status}
                                                </span>
                                            </div>
                                            <ActionMenu escola={silo} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>


                {/* Nenhum resultado encontrado */}
                {filteredSilos.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum silo encontrado</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos silos para sua busca. Tente outros termos ou remova os filtros aplicados.
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
                            <p />


                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestaoSilos;