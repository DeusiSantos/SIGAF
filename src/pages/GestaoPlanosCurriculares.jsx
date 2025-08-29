import React, { useRef, useState, useEffect } from 'react';
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
    BookOpen,
    Clock,
    Target,
    Settings,
    Copy,
    Archive,
    Upload,
    Hash,
    Star,
    TrendingUp
} from 'lucide-react';

import CustomInput from '../components/CustomInput';

// Dados estáticos dos planos curriculares
const planosCurricularesEstaticos = [
    {
        id: 1,
        nome: "Plano Curricular de Matemática - 10ª Classe",
        codigo: "PC-MAT-10-2024",
        subsistema: "GERAL",
        nivel: "SECUNDARIO_2_CICLO",
        classe: 10,
        area: null,
        versao: "2.1",
        anoLetivo: 2024,
        status: "ATIVO",
        dataAprovacao: "2024-01-15",
        dataVigencia: "2024-02-01",
        aprovadoPor: "Dr. António Silva",
        elaboradoPor: "Comissão de Matemática",
        cargaHorariaTotal: 180,
        cargaHorariaSemanal: 6,
        numeroSemanas: 30,
        modalidade: "PRESENCIAL",
        metodologia: "TRADICIONAL",
        disciplinas: 1,
        objetivos: 5,
        competencias: 8,
        sistemaAvaliacao: "Contínua e Sumativa",
        dataUltimaAtualizacao: "2024-03-20"
    },
    {
        id: 2,
        nome: "Plano Curricular de Informática - Técnico Médio",
        codigo: "PC-INF-TM-2024",
        subsistema: "TECNICO_PROFISSIONAL",
        nivel: "TECNICO_MEDIO",
        classe: 11,
        area: "INFORMATICA",
        versao: "1.0",
        anoLetivo: 2024,
        status: "EM_ANALISE",
        dataAprovacao: null,
        dataVigencia: null,
        aprovadoPor: null,
        elaboradoPor: "Instituto Técnico de Luanda",
        cargaHorariaTotal: 1200,
        cargaHorariaSemanal: 40,
        numeroSemanas: 30,
        modalidade: "PRESENCIAL",
        metodologia: "PROJETO",
        disciplinas: 12,
        objetivos: 15,
        competencias: 25,
        sistemaAvaliacao: "Por Competências",
        dataUltimaAtualizacao: "2024-05-10"
    },
    {
        id: 3,
        nome: "Plano Curricular de Língua Portuguesa - 7ª Classe",
        codigo: "PC-LP-07-2024",
        subsistema: "GERAL",
        nivel: "SECUNDARIO_1_CICLO",
        classe: 7,
        area: null,
        versao: "1.5",
        anoLetivo: 2024,
        status: "APROVADO",
        dataAprovacao: "2023-12-10",
        dataVigencia: "2024-01-08",
        aprovadoPor: "Dra. Maria Fernandes",
        elaboradoPor: "Departamento de Línguas",
        cargaHorariaTotal: 150,
        cargaHorariaSemanal: 5,
        numeroSemanas: 30,
        modalidade: "PRESENCIAL",
        metodologia: "CONSTRUTIVISTA",
        disciplinas: 1,
        objetivos: 8,
        competencias: 12,
        sistemaAvaliacao: "Contínua",
        dataUltimaAtualizacao: "2024-01-05"
    },
    {
        id: 4,
        nome: "Plano Curricular de Construção Civil - Formação Profissional",
        codigo: "PC-CC-FP-2024",
        subsistema: "TECNICO_PROFISSIONAL",
        nivel: "FORMACAO_PROFISSIONAL",
        classe: "INTERMEDIO",
        area: "CONSTRUCAO_CIVIL",
        versao: "3.0",
        anoLetivo: 2024,
        status: "ATIVO",
        dataAprovacao: "2024-02-28",
        dataVigencia: "2024-03-15",
        aprovadoPor: "Eng. Carlos Santos",
        elaboradoPor: "Instituto de Construção",
        cargaHorariaTotal: 2400,
        cargaHorariaSemanal: 40,
        numeroSemanas: 60,
        modalidade: "PRESENCIAL",
        metodologia: "HIBRIDA",
        disciplinas: 18,
        objetivos: 20,
        competencias: 35,
        sistemaAvaliacao: "Prática e Teórica",
        dataUltimaAtualizacao: "2024-04-22"
    },
    {
        id: 5,
        nome: "Plano Curricular de Ciências - 5ª Classe",
        codigo: "PC-CIE-05-2024",
        subsistema: "GERAL",
        nivel: "PRIMARIO",
        classe: 5,
        area: null,
        versao: "1.2",
        anoLetivo: 2024,
        status: "RASCUNHO",
        dataAprovacao: null,
        dataVigencia: null,
        aprovadoPor: null,
        elaboradoPor: "Coordenação Primária",
        cargaHorariaTotal: 120,
        cargaHorariaSemanal: 4,
        numeroSemanas: 30,
        modalidade: "PRESENCIAL",
        metodologia: "PROBLEMATIZACAO",
        disciplinas: 1,
        objetivos: 6,
        competencias: 10,
        sistemaAvaliacao: "Contínua",
        dataUltimaAtualizacao: "2024-06-01"
    },
    {
        id: 6,
        nome: "Plano Curricular de Mecânica - Técnico Médio",
        codigo: "PC-MEC-TM-2024",
        subsistema: "TECNICO_PROFISSIONAL",
        nivel: "TECNICO_MEDIO",
        classe: 12,
        area: "MECANICA",
        versao: "2.0",
        anoLetivo: 2024,
        status: "INATIVO",
        dataAprovacao: "2023-11-20",
        dataVigencia: "2024-01-10",
        aprovadoPor: "Prof. João Almeida",
        elaboradoPor: "Centro de Formação Técnica",
        cargaHorariaTotal: 1800,
        cargaHorariaSemanal: 36,
        numeroSemanas: 50,
        modalidade: "PRESENCIAL",
        metodologia: "PROJETO",
        disciplinas: 15,
        objetivos: 18,
        competencias: 30,
        sistemaAvaliacao: "Modular",
        dataUltimaAtualizacao: "2024-01-30"
    }
];

const GestaoPlanosCurriculares = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubsistema, setSelectedSubsistema] = useState('');
    const [selectedNivel, setSelectedNivel] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedArea, setSelectedArea] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [planos, setPlanos] = useState(planosCurricularesEstaticos);
    const itemsPerPage = 6;
    const containerRef = useRef(null);

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

    // Alternar status do plano
    const toggleStatus = (planoId, currentStatus) => {
        let newStatus;
        switch (currentStatus) {
            case 'RASCUNHO':
                newStatus = 'EM_ANALISE';
                break;
            case 'EM_ANALISE':
                newStatus = 'APROVADO';
                break;
            case 'APROVADO':
                newStatus = 'ATIVO';
                break;
            case 'ATIVO':
                newStatus = 'INATIVO';
                break;
            case 'INATIVO':
                newStatus = 'ATIVO';
                break;
            default:
                newStatus = 'RASCUNHO';
        }
        
        setPlanos(prevPlanos => 
            prevPlanos.map(plano => 
                plano.id === planoId ? { ...plano, status: newStatus } : plano
            )
        );

        showToast(
            'success',
            'Status Atualizado',
            `Plano curricular movido para ${newStatus.replace('_', ' ')}`
        );
    };

    // Filtragem dos planos
    const filteredPlanos = planos.filter(plano => {
        const matchesSearch = plano.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plano.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            plano.elaboradoPor.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubsistema = !selectedSubsistema || plano.subsistema === selectedSubsistema;
        const matchesNivel = !selectedNivel || plano.nivel === selectedNivel;
        const matchesStatus = !selectedStatus || plano.status === selectedStatus;
        const matchesArea = !selectedArea || plano.area === selectedArea;
        
        return matchesSearch && matchesSubsistema && matchesNivel && matchesStatus && matchesArea;
    });

    // Paginação
    const totalPages = Math.ceil(filteredPlanos.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredPlanos.slice(startIndex, endIndex);
    };

    // Navegação (simulada)
    const handleViewPlano = (planoId) => {
        showToast('info', 'Navegação', `Visualizar plano curricular ID: ${planoId}`);
    };

    const handleEditPlano = (planoId) => {
        showToast('info', 'Navegação', `Editar plano curricular ID: ${planoId}`);
    };

    const handleDuplicatePlano = (planoId) => {
        const planoOriginal = planos.find(p => p.id === planoId);
        if (planoOriginal) {
            const novoPlano = {
                ...planoOriginal,
                id: Date.now(),
                nome: `${planoOriginal.nome} (Cópia)`,
                codigo: `${planoOriginal.codigo}-COPY`,
                status: 'RASCUNHO',
                versao: '1.0',
                dataAprovacao: null,
                dataVigencia: null,
                aprovadoPor: null,
                dataUltimaAtualizacao: new Date().toISOString().split('T')[0]
            };

            setPlanos(prevPlanos => [novoPlano, ...prevPlanos]);
            showToast('success', 'Sucesso', 'Plano curricular duplicado com sucesso');
        }
    };

    const handleExportPlano = (planoId) => {
        showToast('info', 'Função', `Exportar plano curricular ID: ${planoId}`);
    };

    const handleHistoricoVersoes = (planoId) => {
        showToast('info', 'Função', `Visualizar histórico de versões do plano ID: ${planoId}`);
    };

    const handleImplementacao = (planoId) => {
        showToast('info', 'Função', `Gerenciar implementação do plano ID: ${planoId}`);
    };

    const handleDeletePlano = (planoId) => {
        if (window.confirm("Tem certeza que deseja excluir este plano curricular? Esta ação não pode ser desfeita.")) {
            setPlanos(prevPlanos => prevPlanos.filter(plano => plano.id !== planoId));
            showToast('success', 'Sucesso', 'Plano curricular removido com sucesso');
        }
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Duplicar Plano', icon: <Copy size={16} />, action: handleDuplicatePlano },
        { label: 'Exportar PDF', icon: <Download size={16} />, action: handleExportPlano },
        { label: 'Histórico de Versões', icon: <Archive size={16} />, action: handleHistoricoVersoes },
        { label: 'Implementação', icon: <TrendingUp size={16} />, action: handleImplementacao }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Obter label do subsistema
    const getSubsistemaLabel = (subsistema) => {
        const tipos = {
            'GERAL': 'Ensino Geral',
            'TECNICO_PROFISSIONAL': 'Técnico-Profissional'
        };
        return tipos[subsistema] || subsistema;
    };

    // Obter label do nível
    const getNivelLabel = (nivel) => {
        const niveis = {
            'PRIMARIO': 'Ensino Primário',
            'SECUNDARIO_1_CICLO': '1º Ciclo Secundário',
            'SECUNDARIO_2_CICLO': '2º Ciclo Secundário',
            'TECNICO_MEDIO': 'Técnico Médio',
            'FORMACAO_PROFISSIONAL': 'Formação Profissional'
        };
        return niveis[nivel] || nivel;
    };

    // Obter label da área técnica
    const getAreaLabel = (area) => {
        const areas = {
            'AGRICULTURA': 'Agricultura',
            'CONSTRUCAO_CIVIL': 'Construção Civil',
            'CONTABILIDADE': 'Contabilidade',
            'ELETROTECNICA': 'Eletrotécnica',
            'INFORMATICA': 'Informática',
            'MECANICA': 'Mecânica',
            'HOTELARIA': 'Hotelaria e Turismo',
            'SAUDE': 'Saúde',
            'QUIMICA': 'Química Industrial',
            'TELECOMUNICACOES': 'Telecomunicações'
        };
        return areas[area] || area;
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
    const ActionMenu = ({ plano }) => {
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
                                        item.action(plano.id);
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

    // Cores para diferentes status
    const statusColors = {
        'RASCUNHO': 'bg-gray-100 text-gray-800 border-gray-300',
        'EM_ANALISE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'APROVADO': 'bg-blue-100 text-blue-800 border-blue-300',
        'ATIVO': 'bg-green-100 text-green-800 border-green-300',
        'INATIVO': 'bg-red-100 text-red-800 border-red-300'
    };

    // Cores para subsistemas
    const subsistemaColors = {
        'GERAL': 'bg-blue-100 text-blue-800 border-blue-300',
        'TECNICO_PROFISSIONAL': 'bg-purple-100 text-purple-800 border-purple-300'
    };

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Planos Curriculares</h1>
                            <p className="text-purple-100 mt-1">Sistema de Ensino Geral e Técnico-Profissional - Angola</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de plano curricular')}
                                className="inline-flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Novo Plano
                            </button>
                            <button 
                                onClick={() => showToast('info', 'Função', 'Importar planos curriculares')}
                                className="inline-flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors shadow-sm font-medium"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                Importar
                            </button>
                            <button 
                                onClick={() => showToast('info', 'Função', 'Exportar relatório de planos')}
                                className="inline-flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                {/* Barra de ferramentas */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
                        {/* Busca */}
                        <div className="lg:col-span-2">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por nome, código ou elaborador..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Subsistema */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Subsistema"
                                value={selectedSubsistema ? { 
                                    label: getSubsistemaLabel(selectedSubsistema), 
                                    value: selectedSubsistema 
                                } : null}
                                options={[
                                    { label: 'Todos os Subsistemas', value: '' },
                                    { label: 'Ensino Geral', value: 'GERAL' },
                                    { label: 'Técnico-Profissional', value: 'TECNICO_PROFISSIONAL' }
                                ]}
                                onChange={(option) => setSelectedSubsistema(option?.value || '')}
                                iconStart={<BookOpen size={18} />}
                            />
                        </div>

                        {/* Filtro Nível */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Nível"
                                value={selectedNivel ? { label: getNivelLabel(selectedNivel), value: selectedNivel } : null}
                                options={[
                                    { label: 'Todos os Níveis', value: '' },
                                    { label: 'Ensino Primário', value: 'PRIMARIO' },
                                    { label: '1º Ciclo Secundário', value: 'SECUNDARIO_1_CICLO' },
                                    { label: '2º Ciclo Secundário', value: 'SECUNDARIO_2_CICLO' },
                                    { label: 'Técnico Médio', value: 'TECNICO_MEDIO' },
                                    { label: 'Formação Profissional', value: 'FORMACAO_PROFISSIONAL' }
                                ]}
                                onChange={(option) => setSelectedNivel(option?.value || '')}
                                iconStart={<GraduationCap size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status"
                                value={selectedStatus ? { label: selectedStatus.replace('_', ' '), value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos', value: '' },
                                    { label: 'Rascunho', value: 'RASCUNHO' },
                                    { label: 'Em Análise', value: 'EM_ANALISE' },
                                    { label: 'Aprovado', value: 'APROVADO' },
                                    { label: 'Ativo', value: 'ATIVO' },
                                    { label: 'Inativo', value: 'INATIVO' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Filter size={18} />}
                            />
                        </div>

                        {/* Filtro Área (apenas para técnico-profissional) */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Área Técnica"
                                value={selectedArea ? { label: getAreaLabel(selectedArea), value: selectedArea } : null}
                                options={[
                                    { label: 'Todas as Áreas', value: '' },
                                    { label: 'Agricultura', value: 'AGRICULTURA' },
                                    { label: 'Construção Civil', value: 'CONSTRUCAO_CIVIL' },
                                    { label: 'Contabilidade', value: 'CONTABILIDADE' },
                                    { label: 'Eletrotécnica', value: 'ELETROTECNICA' },
                                    { label: 'Informática', value: 'INFORMATICA' },
                                    { label: 'Mecânica', value: 'MECANICA' },
                                    { label: 'Hotelaria', value: 'HOTELARIA' },
                                    { label: 'Saúde', value: 'SAUDE' }
                                ]}
                                onChange={(option) => setSelectedArea(option?.value || '')}
                                iconStart={<Settings size={18} />}
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
                                    Plano Curricular
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Subsistema & Nível
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Carga Horária
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Detalhes
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Aprovação
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Status
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {getCurrentItems().map((plano) => (
                                <tr key={plano.id} className="hover:bg-purple-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                                                <BookOpen className="h-6 w-6 text-purple-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{plano.nome}</div>
                                                <div className="text-xs text-gray-500 mt-1">Código: {plano.codigo}</div>
                                                <div className="text-xs text-gray-500">Versão: {plano.versao}</div>
                                                <div className="text-xs text-gray-500">Elaborado por: {plano.elaboradoPor}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                subsistemaColors[plano.subsistema] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                                {getSubsistemaLabel(plano.subsistema)}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {getNivelLabel(plano.nivel)} - {plano.classe}ª Classe
                                            </div>
                                            {plano.area && (
                                                <div className="text-xs text-purple-600 font-medium">
                                                    {getAreaLabel(plano.area)}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Clock className="w-4 h-4 mr-2 text-purple-500" />
                                                {plano.cargaHorariaTotal}h total
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Calendar className="w-4 h-4 mr-2 text-purple-500" />
                                                {plano.cargaHorariaSemanal}h/semana
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {plano.numeroSemanas} semanas
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <BookOpen className="w-4 h-4 mr-2 text-purple-500" />
                                                {plano.disciplinas} disciplina(s)
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Target className="w-4 h-4 mr-2 text-purple-500" />
                                                {plano.objetivos} objetivo(s)
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Award className="w-4 h-4 mr-2 text-purple-500" />
                                                {plano.competencias} competência(s)
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="text-xs text-gray-700">
                                                <span className="font-medium">Aprovado por:</span><br/>
                                                {plano.aprovadoPor || 'Pendente'}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Data: {formatDate(plano.dataAprovacao)}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Vigência: {formatDate(plano.dataVigencia)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => toggleStatus(plano.id, plano.status)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                                    statusColors[plano.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                                                }`}
                                            >
                                                {plano.status.replace('_', ' ')}
                                            </button>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewPlano(plano.id)}
                                                className="p-2 hover:bg-purple-100 text-purple-600 hover:text-purple-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditPlano(plano.id)}
                                                className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlano(plano.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu plano={plano} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((plano) => (
                        <div key={plano.id} className="p-4 border-b border-gray-200 hover:bg-purple-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-purple-100 rounded-full flex items-center justify-center">
                                    <BookOpen className="h-8 w-8 text-purple-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{plano.nome}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Código: {plano.codigo}</div>
                                            <div className="text-xs text-gray-500">Versão: {plano.versao}</div>
                                            <div className="text-xs text-gray-500">Por: {plano.elaboradoPor}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                            statusColors[plano.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}>
                                            {plano.status.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <BookOpen className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            <span className="truncate">{getSubsistemaLabel(plano.subsistema)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <GraduationCap className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            {plano.classe}ª Classe
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Clock className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            {plano.cargaHorariaTotal}h total
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Target className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            {plano.disciplinas} disciplina(s)
                                        </div>
                                    </div>

                                    {plano.area && (
                                        <div className="mt-2">
                                            <div className="inline-flex items-center px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                                                {getAreaLabel(plano.area)}
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewPlano(plano.id)}
                                                className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditPlano(plano.id)}
                                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeletePlano(plano.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="text-xs text-gray-500">
                                                Atualizado: {formatDate(plano.dataUltimaAtualizacao)}
                                            </div>
                                            <ActionMenu plano={plano} />
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
                            <span className="font-medium">{filteredPlanos.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredPlanos.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredPlanos.length}</span>
                            {' '}resultados
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
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
                                        : 'bg-white text-purple-700 hover:bg-purple-50 border border-purple-200'
                                    }`}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nenhum resultado encontrado */}
                {filteredPlanos.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum plano curricular encontrado</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedSubsistema || selectedNivel || selectedStatus || selectedArea ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSubsistema('');
                                    setSelectedNivel('');
                                    setSelectedStatus('');
                                    setSelectedArea('');
                                }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de plano curricular')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Criar novo plano
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Estatísticas dos planos curriculares */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <BookOpen className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Planos</p>
                            <p className="text-2xl font-bold text-gray-900">{planos.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Planos Ativos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {planos.filter(p => p.status === 'ATIVO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <GraduationCap className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Ensino Geral</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {planos.filter(p => p.subsistema === 'GERAL').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Settings className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Técnico-Profissional</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {planos.filter(p => p.subsistema === 'TECNICO_PROFISSIONAL').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações sobre planos curriculares */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-purple-700 mb-4">
                    <Info className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Planos Curriculares em Angola</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Ensino Geral:</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Primário: 1ª à 6ª classe (720-900h anuais)</li>
                            <li>• 1º Ciclo Secundário: 7ª à 9ª classe (900h anuais)</li>
                            <li>• 2º Ciclo Secundário: 10ª à 12ª classe (900h anuais)</li>
                            <li>• Mínimo 24 aulas semanais (primário) e 30 (secundário)</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Ensino Técnico-Profissional:</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Técnico Médio: 10ª à 13ª classe</li>
                            <li>• Formação Profissional: Níveis básico a avançado</li>
                            <li>• Carga horária variável por área técnica</li>
                            <li>• Inclui componente prática obrigatória</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Processo de Aprovação:</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Rascunho → Em Análise → Aprovado → Ativo</li>
                            <li>• Aprovação pelo Ministério da Educação</li>
                            <li>• Implementação controlada por fases</li>
                            <li>• Revisão periódica obrigatória</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-purple-700 text-sm">
                        <strong>Gestão Curricular:</strong> Este sistema permite o controle completo dos planos curriculares, 
                        desde a elaboração até a implementação e monitoramento, garantindo alinhamento com a Lei de Bases 
                        do Sistema de Educação e Ensino de Angola.
                    </p>
                </div>
            </div>

            {/* Card com distribuição por status */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-blue-700 mb-4">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Distribuição por Status</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    {Object.entries(statusColors).map(([status, colorClass]) => {
                        const count = planos.filter(p => p.status === status).length;
                        const percentage = planos.length > 0 ? Math.round((count / planos.length) * 100) : 0;
                        
                        return (
                            <div key={status} className={`text-center p-4 rounded-lg border ${colorClass}`}>
                                <div className="text-2xl font-bold">
                                    {count}
                                </div>
                                <div className="text-sm">
                                    {status.replace('_', ' ')}
                                </div>
                                <div className="text-xs mt-1">
                                    {percentage}% do total
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Card com carga horária total */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-green-700 mb-4">
                    <Clock className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Carga Horária Total</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-800">
                            {planos.reduce((total, plano) => total + plano.cargaHorariaTotal, 0).toLocaleString()}h
                        </div>
                        <div className="text-sm text-green-600">Total de Horas</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-800">
                            {planos.reduce((total, plano) => total + plano.disciplinas, 0)}
                        </div>
                        <div className="text-sm text-blue-600">Total de Disciplinas</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-800">
                            {Math.round(planos.reduce((total, plano) => total + plano.cargaHorariaTotal, 0) / planos.length) || 0}h
                        </div>
                        <div className="text-sm text-purple-600">Média por Plano</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-800">
                            {planos.filter(p => p.modalidade === 'PRESENCIAL').length}
                        </div>
                        <div className="text-sm text-orange-600">Modalidade Presencial</div>
                    </div>
                </div>
            </div>

            {/* Card com ações curriculares */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-indigo-700 mb-4">
                    <Activity className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Ações Curriculares</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-blue-800 flex items-center">
                            <Copy className="w-4 h-4 mr-2 text-blue-600" />
                            Duplicação
                        </h3>
                        <p className="text-xs text-blue-700 mt-1">Criar versões adaptadas de planos existentes</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-sm font-medium text-green-800 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                            Implementação
                        </h3>
                        <p className="text-xs text-green-700 mt-1">Controlar rollout e adoção nas escolas</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-sm font-medium text-purple-800 flex items-center">
                            <Archive className="w-4 h-4 mr-2 text-purple-600" />
                            Versionamento
                        </h3>
                        <p className="text-xs text-purple-700 mt-1">Histórico completo de mudanças e revisões</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="text-sm font-medium text-orange-800 flex items-center">
                            <Star className="w-4 h-4 mr-2 text-orange-600" />
                            Avaliação
                        </h3>
                        <p className="text-xs text-orange-700 mt-1">Monitoramento de eficácia e resultados</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestaoPlanosCurriculares;