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

// Dados fictícios dos entrepostos e mercados - estrutura baseada no formulário de cadastro
const entrepostosMercados = [
    {
        id: 1,
        // Identificação
        nomeEntreposto: "Mercado Central de Luanda",
        tipoUnidade: "MERCADO_MUNICIPAL",
        outroTipoUnidade: null,
        codigoRegistro: "MCL001",
        
        // Localização
        endereco: "Rua Direita de Luanda, Ingombota",
        municipio: "Luanda",
        provincia: "LUANDA",
        latitude: "-8.838333",
        longitude: "13.234444",
        
        // Responsável/Entidade Gestora
        nomeCompleto: "António Silva Santos",
        entidadeGestora: "Administração Municipal de Luanda",
        nifFiscal: "5417189144",
        telefone: "222345678",
        email: "mercado.central@luanda.gov.ao",
        
        // Estrutura do Mercado/Entreposto
        numeroBancas: 150,
        numeroArmazens: 12,
        numeroLojas: 45,
        areaTotal: 5000,
        infraestruturas: ["AGUA_POTAVEL", "ENERGIA", "SANEAMENTO"],
        outraInfraestrutura: null,
        
        // Produtos Comercializados
        produtosComercializados: ["PRODUTOS_AGRICOLAS", "HORTICOLAS_FRUTAS", "PRODUTOS_PECUARIOS"],
        
        // Capacidade e Funcionamento
        capacidadeMedia: "2000 pessoas/dia",
        todosDias: true,
        diasEspecificos: null,
        horarioInicio: "06:00",
        horarioFim: "18:00",
        
        // Situação Legal
        licencaFuncionamento: "SIM",
        certificacaoSanitaria: "SIM",
        outrasAutorizacoes: "Licença ambiental municipal",
        
        // Observações Gerais
        observacoes: "Mercado principal da cidade com grande movimento diário",
        
        status: "ATIVO"
    },
    {
        id: 2,
        // Identificação
        nomeEntreposto: "Entreposto Frigorífico Benguela",
        tipoUnidade: "ENTREPOSTO",
        outroTipoUnidade: null,
        codigoRegistro: "EFB002",
        
        // Localização
        endereco: "Zona Industrial, Benguela",
        municipio: "Benguela",
        provincia: "BENGUELA",
        latitude: "-12.576111",
        longitude: "13.405556",
        
        // Responsável/Entidade Gestora
        nomeCompleto: "Maria João Fernandes",
        entidadeGestora: "Frigorífico Benguela Lda",
        nifFiscal: "5417189145",
        telefone: "272123456",
        email: "entreposto@frigobenguela.ao",
        
        // Estrutura do Mercado/Entreposto
        numeroBancas: 0,
        numeroArmazens: 8,
        numeroLojas: 0,
        areaTotal: 3000,
        infraestruturas: ["FRIO", "CAMARA_CONGELACAO", "ENERGIA"],
        outraInfraestrutura: null,
        
        // Produtos Comercializados
        produtosComercializados: ["PEIXE_FRUTOS_MAR", "PRODUTOS_PECUARIOS"],
        
        // Capacidade e Funcionamento
        capacidadeMedia: "500 toneladas/mês",
        todosDias: false,
        diasEspecificos: "Segunda a Sexta",
        horarioInicio: "07:00",
        horarioFim: "17:00",
        
        // Situação Legal
        licencaFuncionamento: "SIM",
        certificacaoSanitaria: "SIM",
        outrasAutorizacoes: "Licença sanitária para produtos cárneos",
        
        // Observações Gerais
        observacoes: "Entreposto especializado em conservação de produtos pereciveis",
        
        status: "ATIVO"
    },
    {
        id: 3,
        // Identificação
        nomeEntreposto: "Feira Popular do Huambo",
        tipoUnidade: "MERCADO_INFORMAL",
        outroTipoUnidade: null,
        codigoRegistro: "FPH003",
        
        // Localização
        endereco: "Bairro Comercial, Huambo",
        municipio: "Huambo",
        provincia: "HUAMBO",
        latitude: "-12.776111",
        longitude: "15.738889",
        
        // Responsável/Entidade Gestora
        nomeCompleto: "José Carlos Mateus",
        entidadeGestora: "Associação de Comerciantes do Huambo",
        nifFiscal: "5417189146",
        telefone: "241987654",
        email: "feira.huambo@gmail.com",
        
        // Estrutura do Mercado/Entreposto
        numeroBancas: 80,
        numeroArmazens: 3,
        numeroLojas: 15,
        areaTotal: 2500,
        infraestruturas: ["AGUA_POTAVEL", "ENERGIA"],
        outraInfraestrutura: "Sistema de som ambiente",
        
        // Produtos Comercializados
        produtosComercializados: ["PRODUTOS_AGRICOLAS", "HORTICOLAS_FRUTAS", "ARTESANATO_OUTRO"],
        
        // Capacidade e Funcionamento
        capacidadeMedia: "800 pessoas/dia",
        todosDias: false,
        diasEspecificos: "Terça, Quinta e Sábado",
        horarioInicio: "05:00",
        horarioFim: "16:00",
        
        // Situação Legal
        licencaFuncionamento: "NAO",
        certificacaoSanitaria: "NAO",
        outrasAutorizacoes: null,
        
        // Observações Gerais
        observacoes: "Feira tradicional com foco em produtos locais e artesanato",
        
        status: "ATIVO"
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

const GestaoEntrepostosMercado = () => {
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

    

    // Filtragem dos entrepostos e mercados
    const filteredEntrepostos = entrepostosMercados.filter(entreposto => {
        const matchesSearch = entreposto.nomeEntreposto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entreposto.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
            entreposto.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = !selectedRegion || entreposto.provincia === selectedRegion;
        const matchesTipo = !selectedTipo || entreposto.tipoUnidade === selectedTipo;
        const matchesStatus = !selectedStatus || entreposto.status === selectedStatus;

        return matchesSearch && matchesRegion && matchesTipo && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredEntrepostos.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredEntrepostos.slice(startIndex, endIndex);
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
    const uniqueRegions = [...new Set(entrepostosMercados.map(entreposto => entreposto.provincia))].filter(Boolean);

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
            showToast('success', 'Excluído', 'Entreposto excluído com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir entreposto.');
            console.error(err);
        } finally {
            closeDeleteModal();
        }
    };

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const entreposto = entrepostosMercados.find(c => c.id === associacaoToDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o entreposto <span className="font-semibold text-red-600">{entreposto?.nomeEntreposto || 'Selecionado'}</span>?<br/>
                        Esta ação não pode ser desfeita. Todos os dados do entreposto serão removidos permanentemente.
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

             {/* Estatísticas das cooperativas */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Entrepostos</p>
                            <p className="text-2xl font-bold text-gray-900">{entrepostosMercados.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Entrepostos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {entrepostosMercados.filter(c => c.status === 'ATIVO').length}
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
                            <p className="text-sm font-medium text-gray-500">Total de Bancas</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {entrepostosMercados.reduce((total, e) => total + e.numeroBancas, 0)}
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
                            <p className="text-sm font-medium text-gray-500">Área Total (m²)</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {entrepostosMercados.reduce((total, e) => total + e.areaTotal, 0).toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Entrepostos e Mercados</h1>
                            {/* <p className="text-blue-100 mt-1">SistGestão Geral e Técnico-Profissional - Angola</p> */}
                        </div>
                        <div className="flex gap-4">
                            
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
                                placeholder="Buscar por nome, responsável ou email..."
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
                                    { label: 'Entreposto', value: 'ENTREPOSTO' },
                                    { label: 'Mercado Municipal', value: 'MERCADO_MUNICIPAL' },
                                    { label: 'Mercado Informal/Feira', value: 'MERCADO_INFORMAL' },
                                    { label: 'Outro', value: 'OUTRO' }
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
                                    Entreposto/Mercado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipo & Produtos
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Estrutura & Licenças
                                </th>
                                
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acção
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-start">
                            {getCurrentItems().map((entreposto) => (
                                <tr key={entreposto.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900 break-words whitespace-pre-line max-w-[290px]">{entreposto.nomeEntreposto}</div>
                                                <div className="text-xs text-gray-500 mt-1">Código: {entreposto.codigoRegistro}</div>
                                                <div className="text-xs text-gray-500">Resp.: {entreposto.nomeCompleto}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                               {entreposto.tipoUnidade.replace(/[-_]/g, ' ')}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {entreposto.produtosComercializados.length} produtos
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                                                {entreposto.municipio}, {entreposto.provincia}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Building className="w-4 h-4 mr-2 text-blue-500" />
                                                {entreposto.numeroBancas} bancas, {entreposto.areaTotal}m²
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <CheckCircle className={`w-4 h-4 mr-2 ${entreposto.licencaFuncionamento === 'SIM' ? 'text-green-500' : 'text-red-500'}`} />
                                                Licença: {entreposto.licencaFuncionamento}
                                            </div>
                                        </div>
                                    </td>

                                  

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(entreposto.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(entreposto.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu escola={entreposto} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                

                {/* Visualização em cards para mobile */}
                <div className="md:hidden overflow-visible" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((entreposto) => (
                        <div key={entreposto.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <Building className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{entreposto.nomeEntreposto}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Código: {entreposto.codigoRegistro}</div>
                                            <div className="text-xs text-gray-500">Resp.: {entreposto.nomeCompleto}</div>
                                        </div>
                                        <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {entreposto.tipoUnidade.replace(/[-_]/g, ' ')}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{entreposto.municipio}</span>
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Building className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {entreposto.numeroBancas} bancas
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {entreposto.telefone}
                                        </div>
                                        <div className="flex items-center text-xs text-gray-700">
                                            <Activity className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            {entreposto.areaTotal}m²
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewEscola(entreposto.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(entreposto.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className="flex items-center space-x-3">
                                            <div className="flex items-center">
                                                <span className={`w-2.5 h-2.5 rounded-full mr-1.5 ${entreposto.status === 'ATIVO' ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                                <span className={`text-xs font-medium ${entreposto.status === 'ATIVO' ? 'text-green-600' : 'text-gray-500'}`}>
                                                    {entreposto.status}
                                                </span>
                                            </div>
                                            <ActionMenu escola={entreposto} />
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
                            <span className="font-medium">{filteredEntrepostos.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredEntrepostos.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredEntrepostos.length}</span>
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
                {filteredEntrepostos.length === 0 && (
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
                            <p />
                                
                            
                        )}
                    </div>
                )}
            </div>           
        </div>
    );
};

export default GestaoEntrepostosMercado;