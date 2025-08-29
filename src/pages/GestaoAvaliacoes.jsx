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
    Hash,
    TrendingUp,
    Copy,
    Archive,
    Upload,
    Star,
    PlayCircle,
    PauseCircle,
    StopCircle
} from 'lucide-react';

import CustomInput from '../components/CustomInput';

// Dados estáticos das avaliações
const avaliacoesEstaticas = [
    {
        id: 1,
        nome: "Prova Trimestral de Matemática - I Trimestre",
        codigo: "AV-IT-MAT-10C-2024",
        tipoAvaliacao: "PROVA_TRIMESTRAL",
        trimestre: "I",
        anoLetivo: 2024,
        subsistema: "GERAL",
        nivel: "SECUNDARIO_2_CICLO",
        classe: 10,
        disciplina: "MATEMATICA",
        dataInicio: "2024-11-25",
        dataFim: "2024-11-27",
        horaInicio: "08:00",
        horaFim: "09:30",
        duracao: 90,
        pontuacaoMaxima: 100,
        notaMinima: 10,
        peso: 60,
        modalidade: "PRESENCIAL",
        tipoProva: "ESCRITA",
        escola: "Escola Secundária Mutu Ya Kevela",
        elaboradoPor: "Prof. Ana Paula Costa",
        status: "AGENDADA",
        participantes: 45,
        concluidos: 0,
        mediaGeral: null,
        dataUltimaAtualizacao: "2024-11-20"
    },
    {
        id: 2,
        nome: "Prova do Professor - Língua Portuguesa",
        codigo: "AV-IP-LP-07C-2024",
        tipoAvaliacao: "PROVA_PROFESSOR",
        trimestre: "I",
        anoLetivo: 2024,
        subsistema: "GERAL",
        nivel: "SECUNDARIO_1_CICLO",
        classe: 7,
        disciplina: "LINGUA_PORTUGUESA",
        dataInicio: "2024-11-15",
        dataFim: "2024-11-15",
        horaInicio: "09:00",
        horaFim: "10:00",
        duracao: 60,
        pontuacaoMaxima: 100,
        notaMinima: 10,
        peso: 40,
        modalidade: "PRESENCIAL",
        tipoProva: "ESCRITA",
        escola: "Escola Primária Agostinho Neto",
        elaboradoPor: "Prof. Maria Santos Silva",
        status: "CONCLUIDA",
        participantes: 32,
        concluidos: 32,
        mediaGeral: 14.2,
        dataUltimaAtualizacao: "2024-11-16"
    },
    {
        id: 3,
        nome: "Avaliação Nacional de Aferição - 5ª Classe",
        codigo: "AV-ANA-MAT-05C-2024",
        tipoAvaliacao: "AVALIACAO_NACIONAL",
        trimestre: "II",
        anoLetivo: 2024,
        subsistema: "GERAL",
        nivel: "PRIMARIO",
        classe: 5,
        disciplina: "MATEMATICA",
        dataInicio: "2024-03-18",
        dataFim: "2024-03-20",
        horaInicio: "08:30",
        horaFim: "10:00",
        duracao: 90,
        pontuacaoMaxima: 100,
        notaMinima: 10,
        peso: 100,
        modalidade: "PRESENCIAL",
        tipoProva: "ESCRITA",
        escola: "Múltiplas Escolas",
        elaboradoPor: "Ministério da Educação",
        status: "EM_ANDAMENTO",
        participantes: 1250,
        concluidos: 847,
        mediaGeral: 12.8,
        dataUltimaAtualizacao: "2024-03-19"
    },
    {
        id: 4,
        nome: "Exame Final - 12ª Classe Matemática",
        codigo: "AV-EF-MAT-12C-2024",
        tipoAvaliacao: "EXAME_FINAL",
        trimestre: "III",
        anoLetivo: 2024,
        subsistema: "GERAL",
        nivel: "SECUNDARIO_2_CICLO",
        classe: 12,
        disciplina: "MATEMATICA",
        dataInicio: "2024-06-25",
        dataFim: "2024-06-25",
        horaInicio: "08:00",
        horaFim: "11:00",
        duracao: 180,
        pontuacaoMaxima: 200,
        notaMinima: 10,
        peso: 100,
        modalidade: "PRESENCIAL",
        tipoProva: "ESCRITA",
        escola: "Todas as Escolas Secundárias",
        elaboradoPor: "Comissão Nacional de Exames",
        status: "CONCLUIDA",
        participantes: 2890,
        concluidos: 2856,
        mediaGeral: 13.5,
        dataUltimaAtualizacao: "2024-07-10"
    },
    {
        id: 5,
        nome: "Prova de Recuperação - Física",
        codigo: "AV-PR-FIS-11C-2024",
        tipoAvaliacao: "PROVA_RECUPERACAO",
        trimestre: "II",
        anoLetivo: 2024,
        subsistema: "GERAL",
        nivel: "SECUNDARIO_2_CICLO",
        classe: 11,
        disciplina: "FISICA",
        dataInicio: "2024-04-22",
        dataFim: "2024-04-22",
        horaInicio: "14:00",
        horaFim: "15:30",
        duracao: 90,
        pontuacaoMaxima: 100,
        notaMinima: 10,
        peso: 100,
        modalidade: "PRESENCIAL",
        tipoProva: "ESCRITA",
        escola: "Instituto Médio Técnico de Luanda",
        elaboradoPor: "Prof. João António Fernandes",
        status: "APROVADA",
        participantes: 18,
        concluidos: 0,
        mediaGeral: null,
        dataUltimaAtualizacao: "2024-04-20"
    },
    {
        id: 6,
        nome: "Teste Diagnóstico - Informática",
        codigo: "AV-TD-INF-10C-2024",
        tipoAvaliacao: "TESTE_DIAGNOSTICO",
        trimestre: "I",
        anoLetivo: 2024,
        subsistema: "TECNICO_PROFISSIONAL",
        nivel: "TECNICO_MEDIO",
        classe: 10,
        disciplina: "INFORMATICA",
        dataInicio: "2024-09-10",
        dataFim: "2024-09-10",
        horaInicio: "10:00",
        horaFim: "11:00",
        duracao: 60,
        pontuacaoMaxima: 50,
        notaMinima: 5,
        peso: 0,
        modalidade: "DIGITAL",
        tipoProva: "PRATICA",
        escola: "Instituto Médio Técnico de Luanda",
        elaboradoPor: "Departamento de Informática",
        status: "RASCUNHO",
        participantes: 24,
        concluidos: 0,
        mediaGeral: null,
        dataUltimaAtualizacao: "2024-09-05"
    }
];

const GestaoAvaliacoes = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedTrimestre, setSelectedTrimestre] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedSubsistema, setSelectedSubsistema] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [avaliacoes, setAvaliacoes] = useState(avaliacoesEstaticas);
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

    // Alternar status da avaliação
    const toggleStatus = (avaliacaoId, currentStatus) => {
        let newStatus;
        switch (currentStatus) {
            case 'RASCUNHO':
                newStatus = 'EM_REVISAO';
                break;
            case 'EM_REVISAO':
                newStatus = 'APROVADA';
                break;
            case 'APROVADA':
                newStatus = 'AGENDADA';
                break;
            case 'AGENDADA':
                newStatus = 'EM_ANDAMENTO';
                break;
            case 'EM_ANDAMENTO':
                newStatus = 'CONCLUIDA';
                break;
            case 'CONCLUIDA':
                newStatus = 'CANCELADA';
                break;
            case 'CANCELADA':
                newStatus = 'RASCUNHO';
                break;
            default:
                newStatus = 'RASCUNHO';
        }
        
        setAvaliacoes(prevAvaliacoes => 
            prevAvaliacoes.map(avaliacao => 
                avaliacao.id === avaliacaoId ? { ...avaliacao, status: newStatus } : avaliacao
            )
        );

        showToast(
            'success',
            'Status Atualizado',
            `Avaliação movida para ${newStatus.replace('_', ' ')}`
        );
    };

    // Filtragem das avaliações
    const filteredAvaliacoes = avaliacoes.filter(avaliacao => {
        const matchesSearch = avaliacao.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            avaliacao.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            avaliacao.elaboradoPor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            avaliacao.escola.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipo = !selectedTipo || avaliacao.tipoAvaliacao === selectedTipo;
        const matchesTrimestre = !selectedTrimestre || avaliacao.trimestre === selectedTrimestre;
        const matchesStatus = !selectedStatus || avaliacao.status === selectedStatus;
        const matchesSubsistema = !selectedSubsistema || avaliacao.subsistema === selectedSubsistema;
        
        return matchesSearch && matchesTipo && matchesTrimestre && matchesStatus && matchesSubsistema;
    });

    // Paginação
    const totalPages = Math.ceil(filteredAvaliacoes.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredAvaliacoes.slice(startIndex, endIndex);
    };

    // Navegação (simulada)
    const handleViewAvaliacao = (avaliacaoId) => {
        showToast('info', 'Navegação', `Visualizar avaliação ID: ${avaliacaoId}`);
    };

    const handleEditAvaliacao = (avaliacaoId) => {
        showToast('info', 'Navegação', `Editar avaliação ID: ${avaliacaoId}`);
    };

    const handleDuplicateAvaliacao = (avaliacaoId) => {
        const avaliacaoOriginal = avaliacoes.find(a => a.id === avaliacaoId);
        if (avaliacaoOriginal) {
            const novaAvaliacao = {
                ...avaliacaoOriginal,
                id: Date.now(),
                nome: `${avaliacaoOriginal.nome} (Cópia)`,
                codigo: `${avaliacaoOriginal.codigo}-COPY`,
                status: 'RASCUNHO',
                participantes: 0,
                concluidos: 0,
                mediaGeral: null,
                dataUltimaAtualizacao: new Date().toISOString().split('T')[0]
            };

            setAvaliacoes(prevAvaliacoes => [novaAvaliacao, ...prevAvaliacoes]);
            showToast('success', 'Sucesso', 'Avaliação duplicada com sucesso');
        }
    };

    const handleResultados = (avaliacaoId) => {
        showToast('info', 'Função', `Visualizar resultados da avaliação ID: ${avaliacaoId}`);
    };

    const handleRelatorios = (avaliacaoId) => {
        showToast('info', 'Função', `Gerar relatórios da avaliação ID: ${avaliacaoId}`);
    };

    const handleEstatisticas = (avaliacaoId) => {
        showToast('info', 'Função', `Visualizar estatísticas da avaliação ID: ${avaliacaoId}`);
    };

    const handleDeleteAvaliacao = (avaliacaoId) => {
        if (window.confirm("Tem certeza que deseja excluir esta avaliação? Esta ação não pode ser desfeita.")) {
            setAvaliacoes(prevAvaliacoes => prevAvaliacoes.filter(avaliacao => avaliacao.id !== avaliacaoId));
            showToast('success', 'Sucesso', 'Avaliação removida com sucesso');
        }
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Duplicar Avaliação', icon: <Copy size={16} />, action: handleDuplicateAvaliacao },
        { label: 'Ver Resultados', icon: <TrendingUp size={16} />, action: handleResultados },
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorios },
        { label: 'Estatísticas', icon: <Star size={16} />, action: handleEstatisticas }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Formatar hora
    const formatTime = (timeString) => {
        if (!timeString) return 'N/A';
        return timeString;
    };

    // Obter label do tipo de avaliação
    const getTipoAvaliacaoLabel = (tipo) => {
        const tipos = {
            'PROVA_PROFESSOR': 'Prova do Professor',
            'PROVA_TRIMESTRAL': 'Prova Trimestral',
            'AVALIACAO_NACIONAL': 'Avaliação Nacional',
            'EXAME_FINAL': 'Exame Final',
            'PROVA_RECUPERACAO': 'Prova de Recuperação',
            'TESTE_DIAGNOSTICO': 'Teste Diagnóstico'
        };
        return tipos[tipo] || tipo;
    };

    // Obter label do subsistema
    const getSubsistemaLabel = (subsistema) => {
        const tipos = {
            'GERAL': 'Ensino Geral',
            'TECNICO_PROFISSIONAL': 'Técnico-Profissional'
        };
        return tipos[subsistema] || subsistema;
    };

    // Obter label da disciplina
    const getDisciplinaLabel = (disciplina) => {
        const disciplinas = {
            'LINGUA_PORTUGUESA': 'Língua Portuguesa',
            'MATEMATICA': 'Matemática',
            'HISTORIA': 'História',
            'GEOGRAFIA': 'Geografia',
            'BIOLOGIA': 'Biologia',
            'QUIMICA': 'Química',
            'FISICA': 'Física',
            'INFORMATICA': 'Informática'
        };
        return disciplinas[disciplina] || disciplina;
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
    const ActionMenu = ({ avaliacao }) => {
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
                                        item.action(avaliacao.id);
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
        'EM_REVISAO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'APROVADA': 'bg-blue-100 text-blue-800 border-blue-300',
        'AGENDADA': 'bg-purple-100 text-purple-800 border-purple-300',
        'EM_ANDAMENTO': 'bg-orange-100 text-orange-800 border-orange-300',
        'CONCLUIDA': 'bg-green-100 text-green-800 border-green-300',
        'CANCELADA': 'bg-red-100 text-red-800 border-red-300'
    };

    // Cores para tipos de avaliação
    const tipoColors = {
        'PROVA_PROFESSOR': 'bg-blue-100 text-blue-800 border-blue-300',
        'PROVA_TRIMESTRAL': 'bg-purple-100 text-purple-800 border-purple-300',
        'AVALIACAO_NACIONAL': 'bg-green-100 text-green-800 border-green-300',
        'EXAME_FINAL': 'bg-red-100 text-red-800 border-red-300',
        'PROVA_RECUPERACAO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'TESTE_DIAGNOSTICO': 'bg-gray-100 text-gray-800 border-gray-300'
    };

    // Ícones para status
    const statusIcons = {
        'RASCUNHO': <FileText className="w-4 h-4" />,
        'EM_REVISAO': <Eye className="w-4 h-4" />,
        'APROVADA': <CheckCircle className="w-4 h-4" />,
        'AGENDADA': <Calendar className="w-4 h-4" />,
        'EM_ANDAMENTO': <PlayCircle className="w-4 h-4" />,
        'CONCLUIDA': <Award className="w-4 h-4" />,
        'CANCELADA': <StopCircle className="w-4 h-4" />
    };

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-indigo-700 to-indigo-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Avaliações</h1>
                            <p className="text-indigo-100 mt-1">Sistema Trimestral de Avaliações - Angola</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de avaliação')}
                                className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nova Avaliação
                            </button>
                            <button 
                                onClick={() => showToast('info', 'Função', 'Importar avaliações')}
                                className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm font-medium"
                            >
                                <Upload className="w-5 h-5 mr-2" />
                                Importar
                            </button>
                            <button 
                                onClick={() => showToast('info', 'Função', 'Exportar relatório de avaliações')}
                                className="inline-flex items-center px-4 py-2 bg-white text-indigo-700 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm font-medium"
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
                                placeholder="Buscar por nome, código, escola ou elaborador..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Avaliação"
                                value={selectedTipo ? { 
                                    label: getTipoAvaliacaoLabel(selectedTipo), 
                                    value: selectedTipo 
                                } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    { label: 'Prova do Professor', value: 'PROVA_PROFESSOR' },
                                    { label: 'Prova Trimestral', value: 'PROVA_TRIMESTRAL' },
                                    { label: 'Avaliação Nacional', value: 'AVALIACAO_NACIONAL' },
                                    { label: 'Exame Final', value: 'EXAME_FINAL' },
                                    { label: 'Prova de Recuperação', value: 'PROVA_RECUPERACAO' },
                                    { label: 'Teste Diagnóstico', value: 'TESTE_DIAGNOSTICO' }
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<FileText size={18} />}
                            />
                        </div>

                        {/* Filtro Trimestre */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Trimestre"
                                value={selectedTrimestre ? { label: `${selectedTrimestre} Trimestre`, value: selectedTrimestre } : null}
                                options={[
                                    { label: 'Todos os Trimestres', value: '' },
                                    { label: 'I Trimestre', value: 'I' },
                                    { label: 'II Trimestre', value: 'II' },
                                    { label: 'III Trimestre', value: 'III' }
                                ]}
                                onChange={(option) => setSelectedTrimestre(option?.value || '')}
                                iconStart={<Calendar size={18} />}
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
                                    { label: 'Em Revisão', value: 'EM_REVISAO' },
                                    { label: 'Aprovada', value: 'APROVADA' },
                                    { label: 'Agendada', value: 'AGENDADA' },
                                    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
                                    { label: 'Concluída', value: 'CONCLUIDA' },
                                    { label: 'Cancelada', value: 'CANCELADA' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Filter size={18} />}
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
                    </div>
                </div>

                {/* Tabela - Desktop */}
                <div className="hidden md:block overflow-auto" style={{ maxHeight: contentHeight }}>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Avaliação
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipo & Trimestre
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Data & Horário
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Disciplina & Classe
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Participação
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Resultados
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
                            {getCurrentItems().map((avaliacao) => (
                                <tr key={avaliacao.id} className="hover:bg-indigo-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-indigo-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{avaliacao.nome}</div>
                                                <div className="text-xs text-gray-500 mt-1">Código: {avaliacao.codigo}</div>
                                                <div className="text-xs text-gray-500">Por: {avaliacao.elaboradoPor}</div>
                                                <div className="text-xs text-gray-500">Escola: {avaliacao.escola}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                tipoColors[avaliacao.tipoAvaliacao] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                                {getTipoAvaliacaoLabel(avaliacao.tipoAvaliacao)}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {avaliacao.trimestre} Trimestre {avaliacao.anoLetivo}
                                            </div>
                                            <div className="text-xs text-indigo-600 font-medium">
                                                Peso: {avaliacao.peso}%
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                                                {formatDate(avaliacao.dataInicio)}
                                                {avaliacao.dataInicio !== avaliacao.dataFim && ` - ${formatDate(avaliacao.dataFim)}`}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                                                {formatTime(avaliacao.horaInicio)} - {formatTime(avaliacao.horaFim)}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Duração: {avaliacao.duracao} min
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <BookOpen className="w-4 h-4 mr-2 text-indigo-500" />
                                                {getDisciplinaLabel(avaliacao.disciplina)}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <GraduationCap className="w-4 h-4 mr-2 text-indigo-500" />
                                                {avaliacao.classe}ª Classe
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {getSubsistemaLabel(avaliacao.subsistema)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Users className="w-4 h-4 mr-2 text-indigo-500" />
                                                {avaliacao.participantes} inscritos
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                                                {avaliacao.concluidos} concluídos
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {avaliacao.participantes > 0 
                                                    ? `${Math.round((avaliacao.concluidos / avaliacao.participantes) * 100)}% conclusão`
                                                    : 'Não iniciada'
                                                }
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Target className="w-4 h-4 mr-2 text-indigo-500" />
                                                Máx: {avaliacao.pontuacaoMaxima} pts
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Award className="w-4 h-4 mr-2 text-yellow-500" />
                                                Mín: {avaliacao.notaMinima} pts
                                            </div>
                                            {avaliacao.mediaGeral && (
                                                <div className="text-xs font-medium text-green-600">
                                                    Média: {avaliacao.mediaGeral}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => toggleStatus(avaliacao.id, avaliacao.status)}
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border transition-colors ${
                                                    statusColors[avaliacao.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                                                }`}
                                            >
                                                <span className="mr-1">
                                                    {statusIcons[avaliacao.status]}
                                                </span>
                                                {avaliacao.status.replace('_', ' ')}
                                            </button>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewAvaliacao(avaliacao.id)}
                                                className="p-2 hover:bg-indigo-100 text-indigo-600 hover:text-indigo-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditAvaliacao(avaliacao.id)}
                                                className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAvaliacao(avaliacao.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu avaliacao={avaliacao} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((avaliacao) => (
                        <div key={avaliacao.id} className="p-4 border-b border-gray-200 hover:bg-indigo-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-indigo-100 rounded-full flex items-center justify-center">
                                    <FileText className="h-8 w-8 text-indigo-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{avaliacao.nome}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Código: {avaliacao.codigo}</div>
                                            <div className="text-xs text-gray-500">Por: {avaliacao.elaboradoPor}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                            statusColors[avaliacao.status] || 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}>
                                            <span className="mr-1">
                                                {statusIcons[avaliacao.status]}
                                            </span>
                                            {avaliacao.status.replace('_', ' ')}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Calendar className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                                            <span className="truncate">{formatDate(avaliacao.dataInicio)}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Clock className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                                            {formatTime(avaliacao.horaInicio)}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <GraduationCap className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                                            {avaliacao.classe}ª Classe
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Users className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                                            {avaliacao.participantes} alunos
                                        </div>
                                    </div>

                                    <div className="mt-2 flex items-center justify-between">
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                            tipoColors[avaliacao.tipoAvaliacao] || 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}>
                                            {getTipoAvaliacaoLabel(avaliacao.tipoAvaliacao)}
                                        </div>
                                        
                                        <div className="text-xs text-indigo-600 font-medium">
                                            {avaliacao.trimestre} Trimestre - {avaliacao.peso}%
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewAvaliacao(avaliacao.id)}
                                                className="p-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditAvaliacao(avaliacao.id)}
                                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteAvaliacao(avaliacao.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            {avaliacao.mediaGeral && (
                                                <div className="text-xs text-green-600 font-medium">
                                                    Média: {avaliacao.mediaGeral}
                                                </div>
                                            )}
                                            <ActionMenu avaliacao={avaliacao} />
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
                            <span className="font-medium">{filteredAvaliacoes.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredAvaliacoes.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredAvaliacoes.length}</span>
                            {' '}resultados
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
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
                                        : 'bg-white text-indigo-700 hover:bg-indigo-50 border border-indigo-200'
                                    }`}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nenhum resultado encontrado */}
                {filteredAvaliacoes.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma avaliação encontrada</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedTipo || selectedTrimestre || selectedStatus || selectedSubsistema ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedTipo('');
                                    setSelectedTrimestre('');
                                    setSelectedStatus('');
                                    setSelectedSubsistema('');
                                }}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de avaliação')}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                            >
                                Criar nova avaliação
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Estatísticas das avaliações */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-indigo-100 rounded-full">
                            <FileText className="w-6 h-6 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Avaliações</p>
                            <p className="text-2xl font-bold text-gray-900">{avaliacoes.length}</p>
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
                                {avaliacoes.filter(a => a.status === 'CONCLUIDA').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-100 rounded-full">
                            <PlayCircle className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Em Andamento</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {avaliacoes.filter(a => a.status === 'EM_ANDAMENTO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Calendar className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Agendadas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {avaliacoes.filter(a => a.status === 'AGENDADA').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações sobre avaliações trimestrais */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-indigo-700 mb-4">
                    <Calendar className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Sistema de Avaliação Trimestral</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">I Trimestre (Set-Dez):</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Prova do Professor: 40% da nota</li>
                            <li>• Prova Trimestral: 60% da nota</li>
                            <li>• Pausa pedagógica: 2 semanas</li>
                            <li>• Período de classificação</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">II Trimestre (Jan-Abr):</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Prova do Professor: 40% da nota</li>
                            <li>• Prova Trimestral: 60% da nota</li>
                            <li>• Jogos Zonais Escolares</li>
                            <li>• Reuniões com encarregados</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">III Trimestre (Abr-Jul):</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Avaliações finais</li>
                            <li>• Exames nacionais (6ª, 9ª, 12ª)</li>
                            <li>• Olimpíadas de Matemática</li>
                            <li>• Provas de recuperação</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-indigo-50 rounded-lg">
                    <p className="text-indigo-700 text-sm">
                        <strong>Calendário Nacional:</strong> Sistema organizado em 3 trimestres com 41 semanas letivas. 
                        Reservados 8 dias úteis para avaliação em cada um dos primeiros dois trimestres, permitindo 
                        a calendarização eficiente de 1-2 provas por dia.
                    </p>
                </div>
            </div>

            {/* Card com distribuição por status */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-blue-700 mb-4">
                    <TrendingUp className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Distribuição por Status</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                    {Object.entries(statusColors).map(([status, colorClass]) => {
                        const count = avaliacoes.filter(a => a.status === status).length;
                        const percentage = avaliacoes.length > 0 ? Math.round((count / avaliacoes.length) * 100) : 0;
                        
                        return (
                            <div key={status} className={`text-center p-3 rounded-lg border ${colorClass}`}>
                                <div className="flex justify-center mb-1">
                                    {statusIcons[status]}
                                </div>
                                <div className="text-lg font-bold">
                                    {count}
                                </div>
                                <div className="text-xs">
                                    {status.replace('_', ' ')}
                                </div>
                                <div className="text-xs mt-1 opacity-75">
                                    {percentage}%
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Card com tipos de avaliação */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-green-700 mb-4">
                    <Award className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Tipos de Avaliação</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {Object.entries(tipoColors).map(([tipo, colorClass]) => {
                        const count = avaliacoes.filter(a => a.tipoAvaliacao === tipo).length;
                        const totalParticipantes = avaliacoes
                            .filter(a => a.tipoAvaliacao === tipo)
                            .reduce((sum, a) => sum + a.participantes, 0);
                        
                        return (
                            <div key={tipo} className={`p-4 rounded-lg border ${colorClass}`}>
                                <h3 className="font-medium text-sm mb-2">
                                    {getTipoAvaliacaoLabel(tipo)}
                                </h3>
                                <div className="text-2xl font-bold mb-1">{count}</div>
                                <div className="text-xs opacity-75">
                                    {totalParticipantes.toLocaleString()} participantes
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Card com participação geral */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-purple-700 mb-4">
                    <Users className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Participação Geral</h2>
                </div>
                
                 <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-800">
                            {avaliacoes.reduce((total, avaliacao) => total + avaliacao.participantes, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-purple-600">Total de Participantes</div>
                    </div>
                    
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-800">
                            {avaliacoes.reduce((total, avaliacao) => total + avaliacao.concluidos, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">Avaliações Concluídas</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-800">
                            {avaliacoes.length > 0 
                                ? Math.round((avaliacoes.reduce((total, avaliacao) => total + avaliacao.concluidos, 0) / 
                                             avaliacoes.reduce((total, avaliacao) => total + avaliacao.participantes, 0)) * 100)
                                : 0}%
                        </div>
                        <div className="text-sm text-blue-600">Taxa de Conclusão</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-800">
                            {avaliacoes.filter(a => a.mediaGeral !== null).length > 0
                                ? (avaliacoes
                                    .filter(a => a.mediaGeral !== null)
                                    .reduce((sum, a) => sum + a.mediaGeral, 0) / 
                                   avaliacoes.filter(a => a.mediaGeral !== null).length).toFixed(1)
                                : 'N/A'}
                        </div>
                        <div className="text-sm text-orange-600">Média Geral</div>
                    </div>
                </div>
            </div>

            {/* Card com cronograma trimestral */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-indigo-700 mb-4">
                    <Clock className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Cronograma Trimestral 2024</h2>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-gray-100">
                            <tr>
                                <th className="px-4 py-3 text-left font-medium">Trimestre</th>
                                <th className="px-4 py-3 text-left font-medium">Período</th>
                                <th className="px-4 py-3 text-left font-medium">Tipos de Avaliação</th>
                                <th className="px-4 py-3 text-left font-medium">Observações</th>
                                <th className="px-4 py-3 text-center font-medium">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-indigo-600">I Trimestre</td>
                                <td className="px-4 py-3">Set - Dez 2024</td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        <div>• Teste Diagnóstico (início)</div>
                                        <div>• Prova do Professor</div>
                                        <div>• Prova Trimestral</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">Pausa pedagógica de 2 semanas</td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 border border-orange-300">
                                        Em Andamento
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-indigo-600">II Trimestre</td>
                                <td className="px-4 py-3">Jan - Abr 2025</td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        <div>• Prova do Professor</div>
                                        <div>• Prova Trimestral</div>
                                        <div>• Avaliação Nacional (5ª, 8ª)</div>
                                        <div>• Provas de Recuperação</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">Jogos Zonais Escolares</td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                                        Agendado
                                    </span>
                                </td>
                            </tr>
                            <tr className="hover:bg-gray-50">
                                <td className="px-4 py-3 font-medium text-indigo-600">III Trimestre</td>
                                <td className="px-4 py-3">Abr - Jul 2025</td>
                                <td className="px-4 py-3">
                                    <div className="space-y-1">
                                        <div>• Avaliações Finais</div>
                                        <div>• Exames Nacionais (6ª, 9ª, 12ª)</div>
                                        <div>• Olimpíadas de Matemática</div>
                                        <div>• Provas de 2ª Época</div>
                                    </div>
                                </td>
                                <td className="px-4 py-3">Período de exames e certificação</td>
                                <td className="px-4 py-3 text-center">
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-300">
                                        Planejado
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Card com ações administrativas */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-green-700 mb-4">
                    <Activity className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Ações Administrativas</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-blue-800 flex items-center">
                            <Copy className="w-4 h-4 mr-2 text-blue-600" />
                            Duplicação
                        </h3>
                        <p className="text-xs text-blue-700 mt-1">Criar novas avaliações baseadas em modelos existentes</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-sm font-medium text-green-800 flex items-center">
                            <TrendingUp className="w-4 h-4 mr-2 text-green-600" />
                            Resultados
                        </h3>
                        <p className="text-xs text-green-700 mt-1">Visualizar e analisar resultados das avaliações</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-sm font-medium text-purple-800 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-purple-600" />
                            Relatórios
                        </h3>
                        <p className="text-xs text-purple-700 mt-1">Gerar relatórios detalhados por escola, classe ou disciplina</p>
                    </div>
                    
                    <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                        <h3 className="text-sm font-medium text-orange-800 flex items-center">
                            <Star className="w-4 h-4 mr-2 text-orange-600" />
                            Estatísticas
                        </h3>
                        <p className="text-xs text-orange-700 mt-1">Análise estatística e comparativa de desempenho</p>
                    </div>
                </div>
            </div>

            {/* Card com alertas e lembretes */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-yellow-700 mb-4">
                    <AlertCircle className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Alertas e Lembretes</h2>
                </div>
                
                <div className="space-y-3">
                    <div className="flex items-start p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                        <AlertCircle className="w-5 h-5 text-yellow-600 mr-3 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-yellow-800">Avaliações Pendentes</h4>
                            <p className="text-xs text-yellow-700 mt-1">
                                {avaliacoes.filter(a => a.status === 'AGENDADA' && new Date(a.dataInicio) <= new Date()).length} avaliações 
                                agendadas precisam ser iniciadas.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Info className="w-5 h-5 text-blue-600 mr-3 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-blue-800">Próximas Avaliações</h4>
                            <p className="text-xs text-blue-700 mt-1">
                                {avaliacoes.filter(a => a.status === 'APROVADA' && new Date(a.dataInicio) > new Date()).length} avaliações 
                                aprovadas aguardando agendamento.
                            </p>
                        </div>
                    </div>
                    
                    <div className="flex items-start p-3 bg-green-50 border border-green-200 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-3 mt-0.5" />
                        <div>
                            <h4 className="text-sm font-medium text-green-800">Resultados Disponíveis</h4>
                            <p className="text-xs text-green-700 mt-1">
                                {avaliacoes.filter(a => a.status === 'CONCLUIDA' && a.mediaGeral !== null).length} avaliações 
                                com resultados prontos para análise.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card com metas e objetivos */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-red-700 mb-4">
                    <Target className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Metas e Objetivos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">Metas do Ano Letivo 2024:</h3>
                        <div className="space-y-2">
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Taxa de conclusão das avaliações</span>
                                <span className="text-xs font-medium text-green-600">85% ✓</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-gray-600">Média geral mínima</span>
                                <span className="text-xs font-medium text-blue-600">12.0 pontos</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-3">
                                <span className="text-xs text-gray-600">Cobertura nacional</span>
                                <span className="text-xs font-medium text-purple-600">18 províncias</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-3">Indicadores de Qualidade:</h3>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-600">Tempo médio de correção</span>
                                <span className="text-xs font-medium">2.3 dias</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-600">Índice de satisfação docente</span>
                                <span className="text-xs font-medium">4.2/5.0</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-600">Taxa de rejeição de provas</span>
                                <span className="text-xs font-medium">3.1%</span>
                            </div>
                            <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-xs text-gray-600">Disponibilidade do sistema</span>
                                <span className="text-xs font-medium">99.2%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer com informações do sistema */}
            <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between text-sm text-gray-600">
                    <div className="flex items-center space-x-4">
                        <span>Sistema de Gestão de Avaliações</span>
                        <span>•</span>
                        <span>Ministério da Educação - Angola</span>
                        <span>•</span>
                        <span>Versão 2.4.1</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <span>Última actualização:</span>
                        <span className="font-medium">20 Nov 2024</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestaoAvaliacoes;