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
    Eye,
    AlertCircle,
    CheckCircle,
    X,
    Share2,
    GraduationCap,
    FileText,
    Activity,
    AlertTriangle,
    Globe,
    MapPin,
    Calendar,
    Info,
    School,
    User,
    BookOpen,
    Mail,
    Award,
    Briefcase,
    Clock,
    DollarSign,
    Users,
    Building
} from 'lucide-react';

import CustomInput from '../components/CustomInput';

// Dados estáticos de professores
const professoresEstaticos = [
    {
        id: 1,
        nome: "Dr. João Carlos Mendes",
        numeroBI: "004500789LA041",
        dataNascimento: "1985-03-15",
        genero: "MASCULINO",
        subsistemaEnsino: "GERAL",
        grauAcademico: "MESTRADO",
        especializacao: "Matemática",
        instituicaoEnsino: "Escola Secundária Agostinho Neto",
        tempoExperiencia: "5-10",
        situacaoContratual: "EFETIVO",
        numeroAgente: "MT2024001",
        salario: "180000",
        dataAdmissao: "2019-02-01",
        provinciaResidencia: "Luanda",
        municipioResidencia: "Luanda",
        bairro: "Maianga",
        telefone: "923456789",
        email: "joao.mendes@edu.ao",
        nomePai: "Carlos Mendes",
        nomeMae: "Ana Mendes",
        status: "ATIVO",
        necessidadeEspecial: false
    },
    {
        id: 2,
        nome: "Prof.ª Maria Fernanda Silva",
        numeroBI: "004600123LA042",
        dataNascimento: "1978-07-22",
        genero: "FEMININO",
        subsistemaEnsino: "TECNICO_PROFISSIONAL",
        grauAcademico: "LICENCIATURA",
        especializacao: "Informática",
        instituicaoEnsino: "Instituto Médio Técnico de Luanda",
        tempoExperiencia: "10+",
        situacaoContratual: "EFETIVO",
        numeroAgente: "IT2024002",
        salario: "220000",
        dataAdmissao: "2010-03-15",
        provinciaResidencia: "Luanda",
        municipioResidencia: "Cacuaco",
        bairro: "Kikolo",
        telefone: "924567890",
        email: "maria.silva@imt.ao",
        nomePai: "Fernando Silva",
        nomeMae: "Teresa Silva",
        status: "ATIVO",
        necessidadeEspecial: false
    },
    {
        id: 3,
        nome: "Prof. Carlos António Santos",
        numeroBI: "004700456LA043",
        dataNascimento: "1982-11-08",
        genero: "MASCULINO",
        subsistemaEnsino: "GERAL",
        grauAcademico: "LICENCIATURA",
        especializacao: "Português e Literatura",
        instituicaoEnsino: "Escola Primária 4 de Fevereiro",
        tempoExperiencia: "5-10",
        situacaoContratual: "CONTRATADO",
        numeroAgente: "PT2024003",
        salario: "150000",
        dataAdmissao: "2020-09-01",
        provinciaResidencia: "Benguela",
        municipioResidencia: "Benguela",
        bairro: "Benguela Velha",
        telefone: "925678901",
        email: "carlos.santos@edu.ao",
        nomePai: "António Santos",
        nomeMae: "Isabel Santos",
        status: "ATIVO",
        necessidadeEspecial: false
    },
    {
        id: 4,
        nome: "Prof.ª Ana Paula Neto",
        numeroBI: "004800789LA044",
        dataNascimento: "1975-04-12",
        genero: "FEMININO",
        subsistemaEnsino: "GERAL",
        grauAcademico: "DOUTORADO",
        especializacao: "Física e Química",
        instituicaoEnsino: "Escola Secundária Mutu Ya Kevela",
        tempoExperiencia: "10+",
        situacaoContratual: "EFETIVO",
        numeroAgente: "FQ2024004",
        salario: "280000",
        dataAdmissao: "2005-08-20",
        provinciaResidencia: "Huambo",
        municipioResidencia: "Huambo",
        bairro: "Centro",
        telefone: "926789012",
        email: "ana.neto@edu.ao",
        nomePai: "Paulo Neto",
        nomeMae: "Filomena Neto",
        status: "ATIVO",
        necessidadeEspecial: false
    },
    {
        id: 5,
        nome: "Prof. Manuel Sebastião Miguel",
        numeroBI: "004900012LA045",
        dataNascimento: "1990-09-20",
        genero: "MASCULINO",
        subsistemaEnsino: "TECNICO_PROFISSIONAL",
        grauAcademico: "BACHARELADO",
        especializacao: "Mecânica Automóvel",
        instituicaoEnsino: "Centro de Formação Profissional",
        tempoExperiencia: "3-5",
        situacaoContratual: "ESTAGIARIO",
        numeroAgente: "MA2024005",
        salario: "120000",
        dataAdmissao: "2023-02-01",
        provinciaResidencia: "Huíla",
        municipioResidencia: "Lubango",
        bairro: "Comercial",
        telefone: "927890123",
        email: "manuel.miguel@cfp.ao",
        nomePai: "Sebastião Miguel",
        nomeMae: "Rosa Miguel",
        status: "ATIVO",
        necessidadeEspecial: false
    },
    {
        id: 6,
        nome: "Prof.ª Esperança Domingos",
        numeroBI: "005000345LA046",
        dataNascimento: "1988-01-30",
        genero: "FEMININO",
        subsistemaEnsino: "GERAL",
        grauAcademico: "LICENCIATURA",
        especializacao: "Educação Especial",
        instituicaoEnsino: "Escola de Ensino Especial",
        tempoExperiencia: "3-5",
        situacaoContratual: "SUBSTITUTO",
        numeroAgente: "EE2024006",
        salario: "140000",
        dataAdmissao: "2021-01-15",
        provinciaResidencia: "Luanda",
        municipioResidencia: "Viana",
        bairro: "Viana Sede",
        telefone: "928901234",
        email: "esperanca.domingos@edu.ao",
        nomePai: "Domingos Ricardo",
        nomeMae: "Lúcia Domingos",
        status: "INATIVO",
        necessidadeEspecial: false
    }
];

const ProfessoresGestao = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSubsistema, setSelectedSubsistema] = useState('');
    const [selectedGrau, setSelectedGrau] = useState('');
    const [selectedSituacao, setSelectedSituacao] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [professores, setProfessores] = useState(professoresEstaticos);
    const itemsPerPage = 6;
    const containerRef = useRef(null);

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

    // Alternar status do professor
    const toggleStatus = (professorId, currentStatus) => {
        const newStatus = currentStatus === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        
        setProfessores(prevProfessores => 
            prevProfessores.map(professor => 
                professor.id === professorId ? { ...professor, status: newStatus } : professor
            )
        );

        showToast(
            'success',
            'Status Atualizado',
            `Professor ${newStatus === 'ATIVO' ? 'ativado' : 'desativado'} com sucesso`
        );
    };

    // Filtragem dos professores
    const filteredProfessores = professores.filter(professor => {
        const matchesSearch = professor.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            professor.numeroBI.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            professor.instituicaoEnsino.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            professor.especializacao.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesSubsistema = !selectedSubsistema || professor.subsistemaEnsino === selectedSubsistema;
        const matchesGrau = !selectedGrau || professor.grauAcademico === selectedGrau;
        const matchesSituacao = !selectedSituacao || professor.situacaoContratual === selectedSituacao;
        
        return matchesSearch && matchesSubsistema && matchesGrau && matchesSituacao;
    });

    // Paginação
    const totalPages = Math.ceil(filteredProfessores.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredProfessores.slice(startIndex, endIndex);
    };

    // Navegação (simulada)
    const handleViewProfessor = (professorId) => {
        showToast('info', 'Navegação', `Visualizar professor ID: ${professorId}`);
    };

    const handleEditProfessor = (professorId) => {
        showToast('info', 'Navegação', `Editar professor ID: ${professorId}`);
    };

    const handleHorarios = (professorId) => {
        showToast('info', 'Função', `Gerenciar horários do professor ID: ${professorId}`);
    };

    const handleDisciplinas = (professorId) => {
        showToast('info', 'Função', `Atribuir disciplinas ao professor ID: ${professorId}`);
    };

    const handleAvaliacao = (professorId) => {
        showToast('info', 'Função', `Avaliar desempenho do professor ID: ${professorId}`);
    };

    const handleFormacao = (professorId) => {
        showToast('info', 'Função', `Formação continuada do professor ID: ${professorId}`);
    };

    const handleRelatorio = (professorId) => {
        showToast('info', 'Função', `Relatório do professor ID: ${professorId}`);
    };

    const handleFerias = (professorId) => {
        showToast('info', 'Função', `Gerir férias do professor ID: ${professorId}`);
    };

    const handleSalario = (professorId) => {
        showToast('info', 'Função', `Gestão salarial do professor ID: ${professorId}`);
    };

    const handleTransferencia = (professorId) => {
        showToast('info', 'Função', `Transferir professor ID: ${professorId}`);
    };

    const handleDeleteProfessor = (professorId) => {
        if (window.confirm("Tem certeza que deseja excluir este professor? Esta ação não pode ser desfeita.")) {
            setProfessores(prevProfessores => prevProfessores.filter(professor => professor.id !== professorId));
            showToast('success', 'Sucesso', 'Professor removido com sucesso');
        }
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Horários', icon: <Clock size={16} />, action: handleHorarios },
        { label: 'Disciplinas', icon: <BookOpen size={16} />, action: handleDisciplinas },
        { label: 'Avaliação', icon: <Activity size={16} />, action: handleAvaliacao },
        { label: 'Formação', icon: <GraduationCap size={16} />, action: handleFormacao },
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorio },
        { label: 'Férias', icon: <Calendar size={16} />, action: handleFerias },
        { label: 'Salário', icon: <DollarSign size={16} />, action: handleSalario },
        { label: 'Transferência', icon: <Share2 size={16} />, action: handleTransferencia }
    ];

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Calcular idade
    const calculateAge = (dateString) => {
        if (!dateString) return 'N/A';
        const today = new Date();
        const birthDate = new Date(dateString);
        let age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--;
        }
        return `${age} anos`;
    };

    // Formatar salário
    const formatSalary = (salary) => {
        if (!salary) return 'N/A';
        return new Intl.NumberFormat('pt-AO', {
            style: 'currency',
            currency: 'AOA'
        }).format(salary);
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
    const ActionMenu = ({ professor }) => {
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
                                        item.action(professor.id);
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

    // Cores para diferentes graus acadêmicos
    const grauColors = {
        'MEDIO_TECNICO': 'bg-orange-100 text-orange-800 border-orange-300',
        'BACHARELADO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
        'LICENCIATURA': 'bg-green-100 text-green-800 border-green-300',
        'MESTRADO': 'bg-blue-100 text-blue-800 border-blue-300',
        'DOUTORADO': 'bg-purple-100 text-purple-800 border-purple-300'
    };

    // Cores para situação contratual
    const situacaoColors = {
        'EFETIVO': 'bg-green-100 text-green-800',
        'CONTRATADO': 'bg-blue-100 text-blue-800',
        'ESTAGIARIO': 'bg-yellow-100 text-yellow-800',
        'SUBSTITUTO': 'bg-orange-100 text-orange-800'
    };

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-purple-700 to-purple-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Professores</h1>
                            <p className="text-purple-100 mt-1">Sistema de Ensino Geral e Técnico-Profissional - Angola</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de professor')}
                                className="inline-flex items-center px-4 py-2 bg-white text-purple-700 rounded-lg hover:bg-purple-50 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Novo Professor
                            </button>
                            <button 
                                onClick={() => showToast('info', 'Função', 'Exportar dados dos professores')}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {/* Busca */}
                        <div className="lg:col-span-1">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por nome, BI, instituição ou especialização..."
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
                                value={selectedSubsistema ? { label: selectedSubsistema, value: selectedSubsistema } : null}
                                options={[
                                    { label: 'Todos os Subsistemas', value: '' },
                                    { label: 'Ensino Geral', value: 'GERAL' },
                                    { label: 'Técnico-Profissional', value: 'TECNICO_PROFISSIONAL' }
                                ]}
                                onChange={(option) => setSelectedSubsistema(option?.value || '')}
                                iconStart={<School size={18} />}
                            />
                        </div>

                        {/* Filtro Grau Acadêmico */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Grau Acadêmico"
                                value={selectedGrau ? { label: selectedGrau, value: selectedGrau } : null}
                                options={[
                                    { label: 'Todos os Graus', value: '' },
                                    { label: 'Ensino Médio Técnico', value: 'MEDIO_TECNICO' },
                                    { label: 'Bacharelado', value: 'BACHARELADO' },
                                    { label: 'Licenciatura', value: 'LICENCIATURA' },
                                    { label: 'Mestrado', value: 'MESTRADO' },
                                    { label: 'Doutorado', value: 'DOUTORADO' }
                                ]}
                                onChange={(option) => setSelectedGrau(option?.value || '')}
                                iconStart={<Award size={18} />}
                            />
                        </div>

                        {/* Filtro Situação Contratual */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Situação Contratual"
                                value={selectedSituacao ? { label: selectedSituacao, value: selectedSituacao } : null}
                                options={[
                                    { label: 'Todas as Situações', value: '' },
                                    { label: 'Efetivo', value: 'EFETIVO' },
                                    { label: 'Contratado', value: 'CONTRATADO' },
                                    { label: 'Estagiário', value: 'ESTAGIARIO' },
                                    { label: 'Substituto', value: 'SUBSTITUTO' }
                                ]}
                                onChange={(option) => setSelectedSituacao(option?.value || '')}
                                iconStart={<Briefcase size={18} />}
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
                                    Professor
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Formação
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Contrato
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Contato
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
                            {getCurrentItems().map((professor) => (
                                <tr key={professor.id} className="hover:bg-purple-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                                {professor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{professor.nome}</div>
                                                <div className="text-xs text-gray-500 mt-1">BI: {professor.numeroBI}</div>
                                                <div className="text-xs text-gray-500">{calculateAge(professor.dataNascimento)}</div>
                                                <div className="text-xs text-purple-600 font-medium">Agente: {professor.numeroAgente}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${grauColors[professor.grauAcademico] || 'bg-gray-100 text-gray-800 border-gray-200'}`}>
                                                {professor.grauAcademico}
                                            </div>
                                            <div className="text-xs text-gray-900 font-medium">
                                                {professor.especializacao}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {professor.instituicaoEnsino}
                                            </div>
                                            <div className="text-xs text-blue-600">
                                                Exp: {professor.tempoExperiencia} anos
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${situacaoColors[professor.situacaoContratual] || 'bg-gray-100 text-gray-800'}`}>
                                                {professor.situacaoContratual}
                                            </div>
                                            <div className="text-xs text-gray-700 font-medium">
                                                {formatSalary(professor.salario)}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-600">
                                                <Calendar className="w-3 h-3 mr-1" />
                                                Admissão: {formatDate(professor.dataAdmissao)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Phone className="w-4 h-4 mr-2 text-purple-500" />
                                                {professor.telefone}
                                            </div>
                                            {professor.email && (
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Mail className="w-4 h-4 mr-2 text-purple-500" />
                                                    {professor.email}
                                                </div>
                                            )}
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-purple-500" />
                                                {professor.municipioResidencia}, {professor.provinciaResidencia}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => toggleStatus(professor.id, professor.status)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    professor.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        professor.status === 'ATIVO' ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <span className={`ml-2 text-xs font-medium ${
                                                professor.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'
                                            }`}>
                                                {professor.status}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewProfessor(professor.id)}
                                                className="p-2 hover:bg-purple-100 text-purple-600 hover:text-purple-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditProfessor(professor.id)}
                                                className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProfessor(professor.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu professor={professor} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((professor) => (
                        <div key={professor.id} className="p-4 border-b border-gray-200 hover:bg-purple-50 transition-colors">
                            <div className="flex items-start">
                                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-400 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-sm flex-shrink-0">
                                    {professor.nome.split(' ').map(n => n[0]).join('').slice(0, 2)}
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{professor.nome}</h3>
                                            <div className="text-xs text-gray-500 mt-1">BI: {professor.numeroBI}</div>
                                            <div className="text-xs text-gray-500">{calculateAge(professor.dataNascimento)}</div>
                                            <div className="text-xs text-purple-600 font-medium">Agente: {professor.numeroAgente}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                            grauColors[professor.grauAcademico] || 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}>
                                            {professor.grauAcademico}
                                        </div>
                                    </div>

                                    <div className="mt-3 space-y-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <BookOpen className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            <span className="font-medium">{professor.especializacao}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Building className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            <span className="truncate">{professor.instituicaoEnsino}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            {professor.telefone}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-purple-500" />
                                            {professor.municipioResidencia}, {professor.provinciaResidencia}
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                                                situacaoColors[professor.situacaoContratual] || 'bg-gray-100 text-gray-800'
                                            }`}>
                                                {professor.situacaoContratual}
                                            </div>
                                            <div className="text-xs text-gray-700 font-medium">
                                                {formatSalary(professor.salario)}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewProfessor(professor.id)}
                                                className="p-1.5 bg-purple-50 hover:bg-purple-100 text-purple-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditProfessor(professor.id)}
                                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProfessor(professor.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${
                                                    professor.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-400'
                                                }`}></span>
                                                <span className={`text-xs font-medium ${
                                                    professor.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                    {professor.status}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => toggleStatus(professor.id, professor.status)}
                                                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    professor.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        professor.status === 'ATIVO' ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <ActionMenu professor={professor} />
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
                            <span className="font-medium">{((currentPage - 1) * itemsPerPage) + 1}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredProfessores.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredProfessores.length}</span>
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
                                    }
                                `}
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
                                    }
                                `}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nenhum resultado encontrado */}
                {filteredProfessores.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum professor encontrado</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedSubsistema || selectedGrau || selectedSituacao ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedSubsistema('');
                                    setSelectedGrau('');
                                    setSelectedSituacao('');
                                }}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de professor')}
                                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                            >
                                Adicionar professor
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Estatísticas dos professores */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Users className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Professores</p>
                            <p className="text-2xl font-bold text-gray-900">{professores.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Professores Ativos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {professores.filter(p => p.status === 'ATIVO').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <School className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Ensino Geral</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {professores.filter(p => p.subsistemaEnsino === 'GERAL').length}
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
                            <p className="text-sm font-medium text-gray-500">Técnico-Profissional</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {professores.filter(p => p.subsistemaEnsino === 'TECNICO_PROFISSIONAL').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Estatísticas adicionais */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Professores Efetivos</p>
                            <p className="text-2xl font-bold text-green-600">
                                {professores.filter(p => p.situacaoContratual === 'EFETIVO').length}
                            </p>
                        </div>
                        <div className="p-3 bg-green-100 rounded-full">
                            <Briefcase className="w-6 h-6 text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Com Pós-Graduação</p>
                            <p className="text-2xl font-bold text-blue-600">
                                {professores.filter(p => p.grauAcademico === 'MESTRADO' || p.grauAcademico === 'DOUTORADO').length}
                            </p>
                        </div>
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Award className="w-6 h-6 text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Salário Médio</p>
                            <p className="text-2xl font-bold text-purple-600">
                                {formatSalary(
                                    professores.reduce((sum, p) => sum + parseInt(p.salario || 0), 0) / professores.length
                                )}
                            </p>
                        </div>
                        <div className="p-3 bg-purple-100 rounded-full">
                            <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações sobre o sistema educativo para professores */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-purple-700 mb-4">
                    <Info className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Sistema Educativo de Angola - Requisitos Docentes</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Ensino Geral - Requisitos:</h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Primário: Licenciatura em Pedagogia ou área específica</li>
                            <li>• Secundário 1º Ciclo: Licenciatura na disciplina</li>
                            <li>• Secundário 2º Ciclo: Licenciatura + especialização</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Técnico-Profissional - Requisitos:</h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Formação técnica específica + experiência prática</li>
                            <li>• Licenciatura na área técnica</li>
                            <li>• Certificação profissional reconhecida</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Situações Contratuais:</h3>
                        <ul className="space-y-1 text-sm text-gray-600">
                            <li>• Efetivo: Concurso público</li>
                            <li>• Contratado: Contrato temporário</li>
                            <li>• Estagiário: Período probatório</li>
                            <li>• Substituto: Substituição temporária</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                    <p className="text-purple-700 text-sm">
                        <strong>Formação Continuada:</strong> Todos os professores devem participar de programas de 
                        formação continuada para atualização pedagógica e científica, conforme regulamentado pelo 
                        Ministério da Educação.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProfessoresGestao;