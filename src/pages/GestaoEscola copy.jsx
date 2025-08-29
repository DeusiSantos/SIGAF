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
    Activity
} from 'lucide-react';

import CustomInput from '../components/CustomInput';

// Dados estáticos das escolas
const escolasEstaticas = [
    {
        id: 1,
        nome: "Escola Primária Agostinho Neto",
        codigo: "EPA001",
        tipoEnsino: "GERAL",
        niveisEnsino: ["PRIMARIO"],
        diretor: "Maria Santos Silva",
        provincia: "LUANDA",
        municipio: "Luanda",
        endereco: "Rua Comandante Che Guevara, 123",
        bairro: "Maianga",
        telefone: "222345678",
        email: "agostinho.neto@edu.ao",
        dataFundacao: "1975-11-11",
        capacidadeAlunos: 800,
        numeroSalas: 20,
        infraestrutura: ["BIBLIOTECA", "CANTINA", "SECRETARIA"],
        status: "ATIVO",
        adminRegionalId: 1
    },
    {
        id: 2,
        nome: "Instituto Médio Técnico de Luanda",
        codigo: "IMT002",
        tipoEnsino: "TECNICO_PROFISSIONAL",
        niveisEnsino: ["TECNICO_MEDIO", "FORMACAO_PROFISSIONAL"],
        diretor: "João António Fernandes",
        provincia: "LUANDA",
        municipio: "Cacuaco",
        endereco: "Avenida Deolinda Rodrigues, 456",
        bairro: "Kikolo",
        telefone: "222456789",
        email: "imt.luanda@edu.ao",
        dataFundacao: "1985-03-15",
        capacidadeAlunos: 1200,
        numeroSalas: 35,
        infraestrutura: ["LAB_INFORMATICA", "LAB_CIENCIAS", "OFICINAS_TECNICAS", "BIBLIOTECA", "AUDITORIO"],
        status: "ATIVO",
        adminRegionalId: 1
    },
    {
        id: 3,
        nome: "Escola Secundária Mutu Ya Kevela",
        codigo: "ESM003",
        tipoEnsino: "GERAL",
        niveisEnsino: ["SECUNDARIO_1_CICLO", "SECUNDARIO_2_CICLO"],
        diretor: "Ana Paula Costa",
        provincia: "BENGUELA",
        municipio: "Benguela",
        endereco: "Rua Ndunduma, 789",
        bairro: "Benguela Velha",
        telefone: "272567890",
        email: "mutu.ya.kevela@edu.ao",
        dataFundacao: "1980-09-02",
        capacidadeAlunos: 1500,
        numeroSalas: 40,
        infraestrutura: ["BIBLIOTECA", "LAB_CIENCIAS", "QUADRA_DESPORTIVA", "CANTINA"],
        status: "ATIVO",
        adminRegionalId: 2
    },
    {
        id: 4,
        nome: "Escola Primária 4 de Fevereiro",
        codigo: "EP4F004",
        tipoEnsino: "GERAL",
        niveisEnsino: ["PRIMARIO"],
        diretor: "Carlos Manuel Neto",
        provincia: "HUAMBO",
        municipio: "Huambo",
        endereco: "Rua da Independência, 321",
        bairro: "Centro",
        telefone: "241678901",
        email: "4fevereiro@edu.ao",
        dataFundacao: "1976-02-04",
        capacidadeAlunos: 600,
        numeroSalas: 15,
        infraestrutura: ["BIBLIOTECA", "CANTINA", "QUADRA_DESPORTIVA"],
        status: "ATIVO",
        adminRegionalId: 3
    },
    {
        id: 5,
        nome: "Centro de Ensino de Adultos - Lubango",
        codigo: "CEA005",
        tipoEnsino: "GERAL",
        niveisEnsino: ["PRIMARIO", "SECUNDARIO_1_CICLO"],
        diretor: "Isabel Domingos",
        provincia: "HUILA",
        municipio: "Lubango",
        endereco: "Avenida da OUA, 654",
        bairro: "Comercial",
        telefone: "261789012",
        email: "cea.lubango@edu.ao",
        dataFundacao: "1990-06-12",
        capacidadeAlunos: 400,
        numeroSalas: 12,
        infraestrutura: ["BIBLIOTECA", "SALA_PROFESSORES"],
        status: "ATIVO",
        adminRegionalId: 4
    },
    {
        id: 6,
        nome: "Escola de Ensino Especial - Viana",
        codigo: "EEE006",
        tipoEnsino: "GERAL",
        niveisEnsino: ["PRIMARIO", "SECUNDARIO_1_CICLO"],
        diretor: "Rosa Miguel Santos",
        provincia: "LUANDA",
        municipio: "Viana",
        endereco: "Rua das Acácias, 987",
        bairro: "Viana Sede",
        telefone: "222890123",
        email: "especial.viana@edu.ao",
        dataFundacao: "2005-01-20",
        capacidadeAlunos: 200,
        numeroSalas: 8,
        infraestrutura: ["BIBLIOTECA", "SALA_PROFESSORES", "SECRETARIA"],
        status: "INATIVO",
        adminRegionalId: 1
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

const GestaoEscolas = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [escolas, setEscolas] = useState(escolasEstaticas);
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
        const newStatus = currentStatus === 'ATIVO' ? 'INATIVO' : 'ATIVO';
        
        setEscolas(prevEscolas => 
            prevEscolas.map(escola => 
                escola.id === escolaId ? { ...escola, status: newStatus } : escola
            )
        );

        showToast(
            'success',
            'Status Atualizado',
            `Escola ${newStatus === 'ATIVO' ? 'ativada' : 'desativada'} com sucesso`
        );
    };

    // Filtragem das escolas
    const filteredEscolas = escolas.filter(escola => {
        const matchesSearch = escola.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            escola.diretor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            escola.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = !selectedRegion || escola.adminRegionalId === parseInt(selectedRegion);
        const matchesTipo = !selectedTipo || escola.tipoEnsino === selectedTipo;
        const matchesStatus = !selectedStatus || escola.status === selectedStatus;
        
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
    const handleViewEscola = (escolaId) => {
        showToast('info', 'Navegação', `Visualizar escola ID: ${escolaId}`);
    };

    const handleEditEscola = (escolaId) => {
        showToast('info', 'Navegação', `Editar escola ID: ${escolaId}`);
    };

    const handleTransferencia = (escolaId) => {
        showToast('info', 'Função', `Transferir alunos da escola ID: ${escolaId}`);
    };

    const handleRelatorios = (escolaId) => {
        showToast('info', 'Função', `Gerar relatórios da escola ID: ${escolaId}`);
    };

    const handleInfraestrutura = (escolaId) => {
        showToast('info', 'Função', `Gerenciar infraestrutura da escola ID: ${escolaId}`);
    };

    const handlePessoal = (escolaId) => {
        showToast('info', 'Função', `Gerenciar pessoal da escola ID: ${escolaId}`);
    };

    const handleDeleteEscola = (escolaId) => {
        if (window.confirm("Tem certeza que deseja excluir esta escola? Esta ação não pode ser desfeita.")) {
            setEscolas(prevEscolas => prevEscolas.filter(escola => escola.id !== escolaId));
            showToast('success', 'Sucesso', 'Escola removida com sucesso');
        }
    };

    // Ações do menu dropdown
    const actionItems = [
        { label: 'Transferências', icon: <Share2 size={16} />, action: handleTransferencia },
        { label: 'Relatórios', icon: <FileText size={16} />, action: handleRelatorios },
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
    const getTipoEnsinoLabel = (tipo) => {
        const tipos = {
            'GERAL': 'Ensino Geral',
            'TECNICO_PROFISSIONAL': 'Técnico-Profissional',
            'MISTO': 'Misto'
        };
        return tipos[tipo] || tipo;
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
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-md shadow-lg z-10 ring-1 ring-black ring-opacity-5">
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
    const uniqueRegions = [...new Set(escolas.map(escola => escola.adminRegionalId))].filter(Boolean);

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Escolas</h1>
                            <p className="text-blue-100 mt-1">Sistema de Ensino Geral e Técnico-Profissional - Angola</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de escola')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nova Escola
                            </button>
                            <button 
                                onClick={() => showToast('info', 'Função', 'Exportar dados das escolas')}
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
                                    label: getAdminRegionalName(parseInt(selectedRegion)), 
                                    value: selectedRegion 
                                } : null}
                                options={[
                                    { label: 'Todas as Regiões', value: '' },
                                    ...uniqueRegions.map(regionId => ({ 
                                        label: getAdminRegionalName(regionId), 
                                        value: regionId.toString() 
                                    }))
                                ]}
                                onChange={(option) => setSelectedRegion(option?.value || '')}
                                iconStart={<MapPin size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Ensino"
                                value={selectedTipo ? { label: getTipoEnsinoLabel(selectedTipo), value: selectedTipo } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    { label: 'Ensino Geral', value: 'GERAL' },
                                    { label: 'Técnico-Profissional', value: 'TECNICO_PROFISSIONAL' },
                                    { label: 'Misto', value: 'MISTO' }
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<School size={18} />}
                            />
                        </div>

                        {/* Filtro Status */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Status"
                                value={selectedStatus ? { label: selectedStatus, value: selectedStatus } : null}
                                options={[
                                    { label: 'Todos', value: '' },
                                    { label: 'Ativo', value: 'ATIVO' },
                                    { label: 'Inativo', value: 'INATIVO' }
                                ]}
                                onChange={(option) => setSelectedStatus(option?.value || '')}
                                iconStart={<Filter size={18} />}
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
                                    Escola
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipo & Níveis
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Contato
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Capacidade
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
                            {getCurrentItems().map((escola) => (
                                <tr key={escola.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                                                <School className="h-6 w-6 text-blue-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{escola.nome}</div>
                                                <div className="text-xs text-gray-500 mt-1">Código: {escola.codigo}</div>
                                                <div className="text-xs text-gray-500">Dir.: {escola.diretor}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${
                                                tipoColors[escola.tipoEnsino] || 'bg-gray-100 text-gray-800 border-gray-200'
                                            }`}>
                                                {getTipoEnsinoLabel(escola.tipoEnsino)}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {escola.niveisEnsino.length} nível(is)
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Phone className="w-4 h-4 mr-2 text-blue-500" />
                                                {escola.telefone}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Mail className="w-4 h-4 mr-2 text-blue-500" />
                                                {escola.email}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {escola.municipio}, {escola.provincia}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {escola.bairro}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Users className="w-4 h-4 mr-2 text-blue-500" />
                                                {escola.capacidadeAlunos} alunos
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Building className="w-4 h-4 mr-2 text-blue-500" />
                                                {escola.numeroSalas} salas
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center">
                                            <button
                                                onClick={() => toggleStatus(escola.id, escola.status)}
                                                className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    escola.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        escola.status === 'ATIVO' ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                                />
                                            </button>
                                            <span className={`ml-2 text-xs font-medium ${
                                                escola.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'
                                            }`}>
                                                {escola.status}
                                            </span>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(escola.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditEscola(escola.id)}
                                                className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEscola(escola.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu escola={escola} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((escola) => (
                        <div key={escola.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <School className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{escola.nome}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Código: {escola.codigo}</div>
                                            <div className="text-xs text-gray-500">Dir.: {escola.diretor}</div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${
                                            tipoColors[escola.tipoEnsino] || 'bg-gray-100 text-gray-800 border-gray-200'
                                        }`}>
                                            {getTipoEnsinoLabel(escola.tipoEnsino)}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{escola.municipio}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Users className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {escola.capacidadeAlunos} alunos
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {escola.telefone}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Building className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {escola.numeroSalas} salas
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
                                                onClick={() => handleEditEscola(escola.id)}
                                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteEscola(escola.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${
                                                    escola.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-400'
                                                }`}></span>
                                                <span className={`text-xs font-medium ${
                                                    escola.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'
                                                }`}>
                                                    {escola.status}
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => toggleStatus(escola.id, escola.status)}
                                                className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                                                    escola.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-200'
                                                }`}
                                            >
                                                <span
                                                    className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                        escola.status === 'ATIVO' ? 'translate-x-5' : 'translate-x-0'
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
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma escola encontrada</h3>
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
                            <button 
                                onClick={() => showToast('info', 'Navegação', 'Redirecionar para cadastro de escola')}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Adicionar escola
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Estatísticas das escolas */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <School className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Escolas</p>
                            <p className="text-2xl font-bold text-gray-900">{escolas.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Escolas Ativas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {escolas.filter(e => e.status === 'ATIVO').length}
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
                            <p className="text-sm font-medium text-gray-500">Ensino Geral</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {escolas.filter(e => e.tipoEnsino === 'GERAL').length}
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
                            <p className="text-sm font-medium text-gray-500">Técnico-Profissional</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {escolas.filter(e => e.tipoEnsino === 'TECNICO_PROFISSIONAL').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Informações sobre o sistema educativo */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-blue-700 mb-4">
                    <Info className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Sistema Educativo de Angola</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-sm">
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Subsistema de Ensino Geral:</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Ensino Primário: 1ª à 6ª classe</li>
                            <li>• 1º Ciclo Secundário: 7ª à 9ª classe</li>
                            <li>• 2º Ciclo Secundário: 10ª à 12ª classe</li>
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Subsistema Técnico-Profissional:</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Ensino Técnico Médio</li>
                            <li>• Formação Profissional</li>
                            <li>• Especialização Técnica</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-800 mb-2">Modalidades Especiais:</h3>
                        <ul className="space-y-1 text-gray-600">
                            <li>• Ensino Regular</li>
                            <li>• Programa de Recuperação</li>
                            <li>• Ensino Especial</li>
                        </ul>
                    </div>
                </div>
                
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-700 text-sm">
                        <strong>Gestão Educacional:</strong> Este sistema permite o controle completo das instituições 
                        de ensino, desde o cadastro até a gestão de recursos humanos, infraestrutura e transferências 
                        entre escolas.
                    </p>
                </div>
            </div>

            {/* Card com informações sobre capacidades */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-green-700 mb-4">
                    <Users className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Capacidades e Recursos</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200">
                        <div className="text-2xl font-bold text-green-800">
                            {escolas.reduce((total, escola) => total + escola.capacidadeAlunos, 0).toLocaleString()}
                        </div>
                        <div className="text-sm text-green-600">Total de Vagas</div>
                    </div>
                    
                    <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-2xl font-bold text-blue-800">
                            {escolas.reduce((total, escola) => total + escola.numeroSalas, 0)}
                        </div>
                        <div className="text-sm text-blue-600">Total de Salas</div>
                    </div>
                    
                    <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200">
                        <div className="text-2xl font-bold text-purple-800">
                            {Math.round(escolas.reduce((total, escola) => total + escola.capacidadeAlunos, 0) / escolas.length)}
                        </div>
                        <div className="text-sm text-purple-600">Média por Escola</div>
                    </div>
                    
                    <div className="text-center p-4 bg-orange-50 rounded-lg border border-orange-200">
                        <div className="text-2xl font-bold text-orange-800">
                            {escolas.filter(e => e.infraestrutura.includes('LAB_INFORMATICA')).length}
                        </div>
                        <div className="text-sm text-orange-600">Com Lab. Informática</div>
                    </div>
                </div>
            </div>

            {/* Card com ações administrativas */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-purple-700 mb-4">
                    <Activity className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Ações Administrativas</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-blue-800 flex items-center">
                            <Share2 className="w-4 h-4 mr-2 text-blue-600" />
                            Transferências
                        </h3>
                        <p className="text-xs text-blue-700 mt-1">Gerencie transferências de alunos entre escolas</p>
                    </div>
                    
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-sm font-medium text-green-800 flex items-center">
                            <FileText className="w-4 h-4 mr-2 text-green-600" />
                            Relatórios
                        </h3>
                        <p className="text-xs text-green-700 mt-1">Gere relatórios detalhados de desempenho e capacidade</p>
                    </div>
                    
                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                        <h3 className="text-sm font-medium text-purple-800 flex items-center">
                            <Award className="w-4 h-4 mr-2 text-purple-600" />
                            Certificações
                        </h3>
                        <p className="text-xs text-purple-700 mt-1">Controle de certificações e acreditações das escolas</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GestaoEscolas;