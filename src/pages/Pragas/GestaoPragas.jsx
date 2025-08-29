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
    Bug,
    Building,
    Users,
    User,
    Activity,
    PlusCircle,
    Heart,
    Tractor,
    BarChart3,
    Clock,
    TrendingUp
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
// Dados estáticos das ocorrências de pragas
const ocorrenciasPragas = [
    {
        id: 1,
        nomePraga: "Lagarta-do-cartucho",
        nomeLocalPraga: "Broca do milho",
        tipoProducao: "Agrícola",
        culturaAfetada: ["Milho", "Arroz"],
        nomePropriedade: "Fazenda São José",
        nomeResponsavel: "João Manuel Silva",
        telefone: "923456789",
        email: "joao.silva@email.com",
        provincia: "LUANDA",
        municipio: "Luanda",
        comuna: "Ingombota",
        areaTotalCultivada: 25.5,
        percentagemAreaAfetada: 35.2,
        grauDano: "Moderado",
        dataRegistro: "2024-12-10",
        dataPrimeiraObservacao: "2024-12-08",
        aplicouMedidaControle: true,
        tipoMedidaAplicada: "Pulverização com inseticida",
        resultadoMedida: "Eficaz",
        necessitaApoioTecnico: false,
        status: "EM_TRATAMENTO"
    },
    {
        id: 2,
        nomePraga: "Ferrugem do café",
        nomeLocalPraga: "Doença alaranjada",
        tipoProducao: "Agrícola",
        culturaAfetada: ["Café"],
        nomePropriedade: "Plantation Uíge",
        nomeResponsavel: "Maria dos Santos",
        telefone: "934567890",
        email: "maria.santos@email.com",
        provincia: "UÍGE",
        municipio: "Uíge",
        comuna: "Sede",
        areaTotalCultivada: 150.0,
        percentagemAreaAfetada: 60.8,
        grauDano: "Grave",
        dataRegistro: "2024-12-09",
        dataPrimeiraObservacao: "2024-12-05",
        aplicouMedidaControle: true,
        tipoMedidaAplicada: "Fungicida sistêmico",
        resultadoMedida: "Parcial",
        necessitaApoioTecnico: true,
        status: "CRITICO"
    },
    {
        id: 3,
        nomePraga: "Carrapato bovino",
        nomeLocalPraga: "Carrapato",
        tipoProducao: "Pecuária",
        especieAnimalAfetada: ["Bovino"],
        nomeFazenda: "Rancho Benguela",
        nomeResponsavel: "Carlos Alberto",
        telefone: "945678901",
        email: "carlos.alberto@email.com",
        provincia: "BENGUELA",
        municipio: "Benguela",
        comuna: "Lobito",
        numeroTotalAnimais: 85,
        numeroAnimaisAfetados: 32,
        grauDano: "Leve",
        dataRegistro: "2024-12-11",
        dataPrimeiraObservacao: "2024-12-09",
        aplicouTratamento: true,
        tipoTratamento: "Banho carrapaticida",
        resultadoTratamento: "Eficaz",
        necessitaApoioVeterinario: false,
        status: "CONTROLADO"
    },
    {
        id: 4,
        nomePraga: "Pulgão preto",
        nomeLocalPraga: "Piolho das plantas",
        tipoProducao: "Agrícola",
        culturaAfetada: ["Hortícolas"],
        nomePropriedade: "Horta Familiar Huambo",
        nomeResponsavel: "Ana Paula Ferreira",
        telefone: "956789012",
        email: "ana.ferreira@email.com",
        provincia: "HUAMBO",
        municipio: "Huambo",
        comuna: "Sede",
        areaTotalCultivada: 8.3,
        percentagemAreaAfetada: 25.0,
        grauDano: "Leve",
        dataRegistro: "2024-12-12",
        dataPrimeiraObservacao: "2024-12-11",
        aplicouMedidaControle: false,
        tipoMedidaAplicada: "",
        resultadoMedida: "",
        necessitaApoioTecnico: true,
        status: "NOVO"
    },
    {
        id: 5,
        nomePraga: "Mosca-branca",
        nomeLocalPraga: "Mosquinha branca",
        tipoProducao: "Agrícola",
        culturaAfetada: ["Mandioca", "Feijão"],
        nomePropriedade: "Cooperativa Agro Huíla",
        nomeResponsavel: "Pedro Miguel",
        telefone: "967890123",
        email: "pedro.miguel@email.com",
        provincia: "HUÍLA",
        municipio: "Lubango",
        comuna: "Humpata",
        areaTotalCultivada: 45.8,
        percentagemAreaAfetada: 80.3,
        grauDano: "Grave",
        dataRegistro: "2024-12-08",
        dataPrimeiraObservacao: "2024-12-03",
        aplicouMedidaControle: true,
        tipoMedidaAplicada: "Controle biológico",
        resultadoMedida: "Sem efeito",
        necessitaApoioTecnico: true,
        status: "CRITICO"
    },
    {
        id: 6,
        nomePraga: "Doença de Newcastle",
        nomeLocalPraga: "Peste das galinhas",
        tipoProducao: "Pecuária",
        especieAnimalAfetada: ["Aves"],
        nomeFazenda: "Avícola Kwanza",
        nomeResponsavel: "Luisa Santos",
        telefone: "978901234",
        email: "luisa.santos@email.com",
        provincia: "KWANZA SUL",
        municipio: "Sumbe",
        comuna: "Porto Amboim",
        numeroTotalAnimais: 500,
        numeroAnimaisAfetados: 125,
        grauDano: "Grave",
        dataRegistro: "2024-12-07",
        dataPrimeiraObservacao: "2024-12-05",
        aplicouTratamento: true,
        tipoTratamento: "Vacinação de emergência",
        resultadoTratamento: "Parcial",
        necessitaApoioVeterinario: true,
        status: "EM_TRATAMENTO"
    }
];

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
    const [pragas, setPragas] = useState(ocorrenciasPragas);
    const itemsPerPage = 6;
    const containerRef = useRef(null);

    // Lista de províncias angolanas
    const provincias = [
        'LUANDA', 'BENGUELA', 'HUAMBO', 'HUÍLA', 'CABINDA', 'UÍGE', 'ZAIRE',
        'MALANJE', 'LUNDA NORTE', 'LUNDA SUL', 'MOXICO', 'CUANDO CUBANGO',
        'CUNENE', 'NAMIBE', 'BIÉ', 'CUANZA NORTE', 'CUANZA SUL'
    ];

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
            'CONTROLADO': 'bg-blue-100 text-blue-800 border-blue-300',
            'CRITICO': 'bg-red-100 text-red-800 border-red-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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

    // Navegação (simulada)
    const handleViewPraga = () => {
        showToast('info', 'Visualização', 'Área em desenvolvimento');
    };

    const handleEditPraga = () => {
        showToast('info', 'Edição', 'Área em desenvolvimento');
    };

    const handleDeletePraga = () => {
        showToast('info', 'Remoção', 'Área em desenvolvimento');
    };

    const handleRelatorios = () => {
        showToast('info', 'Relatórios', 'Área em desenvolvimento');
    };

    const handleMedidasControle = () => {
        showToast('info', 'Medidas de Controle', 'Área em desenvolvimento');
    };

    const handleAcompanhamento = () => {
        showToast('info', 'Acompanhamento', 'Área em desenvolvimento');
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Relatório Detalhado', icon: <FileText size={16} />, action: handleRelatorios },
        { label: 'Medidas de Controle', icon: <Activity size={16} />, action: handleMedidasControle },
        { label: 'Acompanhamento', icon: <BarChart3 size={16} />, action: handleAcompanhamento }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
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

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />

            <div className="w-full border border-gray-200 bg-white rounded-xl shadow-md overflow-hidden">
            {/* Estatísticas das ocorrências */}
            <div className="mt-6 mb-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Bug className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Ocorrências</p>
                            <p className="text-2xl font-bold text-gray-900">{pragas.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Casos Críticos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {pragas.filter(p => p.status === 'CRITICO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Clock className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Em Tratamento</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {pragas.filter(p => p.status === 'EM_TRATAMENTO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Controladas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {pragas.filter(p => p.status === 'CONTROLADO').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-gradient-to-r rounded-md from-blue-700 to-blue-500 p-6 text-white">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                    <div>
                        <h1 className="text-2xl font-bold flex items-center">
                            <Bug className="w-8 h-8 mr-3" />
                            Gestão de Monitoramento de Pragas
                        </h1>
                    </div>
                    <div className="flex gap-4">
                        
                        <button
                            onClick={() => showToast('info', 'Função', 'Exportar dados das ocorrências')}
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
                                { label: 'Ambas', value: 'Ambas' }
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
            <div className="hidden md:block overflow-auto" style={{ maxHeight: contentHeight }}></div>
                <table className="w-full border-collapse">
                    <thead className="bg-gray-50 sticky top-0 z-10">
                        <tr>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Praga/Doença
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Produção Afetada
                            </th>
                            <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                Responsável
                            </th>
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
                                                <Tractor className="w-4 h-4 mr-2 text-blue-500" />
                                            ) : (
                                                <Heart className="w-4 h-4 text-start mr-2 text-red-500" />
                                            )}
                                            {praga.tipoProducao}
                                        </div>
                                        <div className="text-xs text-start text-gray-600">
                                            {praga.culturaAfetada ? praga.culturaAfetada.join(', ') :
                                                praga.especieAnimalAfetada ? praga.especieAnimalAfetada.join(', ') : 'N/A'}
                                        </div>
                                        <div className="text-xs text-start text-gray-500">
                                            {praga.nomePropriedade || praga.nomeFazenda}
                                        </div>
                                    </div>
                                </td>

                                <td className="px-6 py-4 whitespace-nowrap">
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
                                </td>

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
                                                    'bg-blue-100 text-blue-800 border-blue-300'
                                            }`}>
                                            {praga.grauDano}
                                        </div>
                                      
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
                                            onClick={() => handleEditPraga(praga.id)}
                                            className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePraga(praga.id)}
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
                                            <Tractor className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                        ) : (
                                            <Heart className="w-3.5 h-3.5 mr-1 text-red-500" />
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
                                            onClick={() => handleEditPraga(praga.id)}
                                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDeletePraga(praga.id)}
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
                            onClick={() => navigate('/cadastro-pragas')}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Registrar ocorrência
                        </button>
                    )}
                </div>
            )}
        </div>
        
    );
};

export default GestaoPragas;