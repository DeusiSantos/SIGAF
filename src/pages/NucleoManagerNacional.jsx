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
    Eye,
    AlertCircle,
    CheckCircle,
    X,
    Share2,
    FileText,
    Globe,
    MapPin,
    Info,
    Home,
    Building,
    Layers
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdministracoes, useNucleo } from '../hooks/useScoutData';
import CustomInput from '../components/CustomInput';

const NucleoManagerNacional = () => {
    const API_URL = 'https://d3gwhrg5-7133.uks1.devtunnels.ms/api';
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRegion, setSelectedRegion] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 5;
    const containerRef = useRef(null);
    
    // Hooks para carregar os dados
    const { nucleo: nucleos, loading: loadingNucleos } = useNucleo();
    const { administracoes, loading: loadingAdministracoes } = useAdministracoes();

    // Ajustar altura do conteúdo com base no tamanho da janela
    useEffect(() => {
        const updateHeight = () => {
            if (containerRef.current) {
                const headerHeight = 180; // Altura aproximada do cabeçalho + filtros
                const windowHeight = window.innerHeight;
                const availableHeight = windowHeight - headerHeight;
                setContentHeight(`${availableHeight}px`);
            }
        };

        updateHeight();
        window.addEventListener('resize', updateHeight);
        return () => window.removeEventListener('resize', updateHeight);
    }, []);

    // Limpar timeout ao desmontar o componente
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Mapeia as administrações para facilitar a busca
    const administracoesMap = administracoes.reduce((acc, admin) => {
        acc[admin.id] = admin;
        return acc;
    }, {});

    // Função para obter o nome da administração regional com base no ID
    const getAdminRegionalName = (adminRegionalId) => {
        const admin = administracoes.find(a => a.id === adminRegionalId);
        return admin ? admin.nome : `Região ${adminRegionalId}`;
    };

    // Exibir mensagem toast
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

    // Filtragem dos núcleos
    const filteredData = nucleos?.filter(item => {
        const matchesSearch = item.nome?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRegion = !selectedRegion || item.adminRegionalId === parseInt(selectedRegion);
        return matchesSearch && matchesRegion;
    }) || [];

    // Paginação
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredData.slice(startIndex, endIndex);
    };

    // Navegação
    const handleViewNucleo = (nucleoId) => {
        navigate(`/nucleo/gestao/nucleo/visualizar/${nucleoId}`);
    };

    const handleEditNucleo = (nucleoId) => {
        navigate(`/nucleo/editar/${nucleoId}`);
    };

    const handleDeleteNucleo = (nucleoId) => {
        // Placeholder para função de exclusão
        if (window.confirm("Tem certeza que deseja excluir este núcleo? Esta ação não pode ser desfeita.")) {
            // Lógica de exclusão aqui
            showToast('info', 'Em desenvolvimento', 'A funcionalidade de exclusão está em desenvolvimento');
        }
    };

    // Componente de carregamento
    if (loadingNucleos || loadingAdministracoes || !nucleos || !administracoes) {
        return (
            <div className="p-6">
                <div className="w-full bg-white rounded-lg p-6 shadow-md space-y-6">
                    <div className="animate-pulse flex justify-between items-center">
                        <div className="h-8 bg-gray-200 rounded w-1/4"></div>
                        <div className="h-10 bg-gray-200 rounded w-36"></div>
                    </div>
                    <div className="h-16 bg-gray-200 rounded w-full"></div>
                    <div className="space-y-3">
                        {[...Array(5)].map((_, index) => (
                            <div key={index} className="h-24 bg-gray-200 rounded w-full"></div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    // Componente de Toast customizado
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
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-red-700';
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
                        aria-label="Fechar notificação"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>
            </div>
        );
    };

    // Extrai regiões únicas para o filtro
    const uniqueRegions = [...new Set(nucleos.map(item => item.adminRegionalId))].filter(Boolean);

    return (
        <div className="min-h-screen" ref={containerRef}>
            {/* Toast de notificações */}
            <Toast />

            <div className="w-full bg-white rounded-xl shadow-md overflow-hidden">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-teal-700 to-teal-500 p-6 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Núcleos</h1>
                            <p className="text-teal-100 mt-1">Visualize, edite e gerencie todos os núcleos</p>
                        </div>
                        <div className='flex gap-4'>
                            <div>
                                <a href="/nucleo/adicionar">
                                    <button className="inline-flex items-center px-4 py-2 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-colors shadow-sm font-medium">
                                        <Plus className="w-5 h-5 mr-2" />
                                        Novo Núcleo
                                    </button>
                                </a>
                            </div>

                            <div>
                                <button className="inline-flex items-center px-4 py-2 bg-white text-teal-700 rounded-lg hover:bg-teal-50 transition-colors shadow-sm font-medium">
                                    <Download className="w-5 h-5 mr-2" />
                                    Exportar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Barra de ferramentas */}
                <div className="p-6 border-b border-gray-200 bg-white">
                    <div className="flex flex-wrap gap-4 items-center">
                        {/* Busca com CustomInput */}
                        <div className="flex-1 min-w-[280px]">
                            <CustomInput
                                type="text"
                                placeholder="Buscar núcleo por nome..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro de região com CustomInput */}
                        <div className="md:w-[30%] w-[30%]">
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
                                iconStart={<Filter size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Lista de núcleos - Modo de tabela para telas grandes */}
                <div className="hidden md:block overflow-auto" style={{ maxHeight: contentHeight }}>
                    <table className="w-full border-collapse">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Núcleo
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Região
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Identificação
                                </th>
                                <th className="px-6 py-4 text-center text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {getCurrentItems().map((item) => (
                                <tr key={item.id} className="hover:bg-teal-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 h-12 w-12 bg-teal-100 rounded-full flex items-center justify-center">
                                                <Layers className="h-6 w-6 text-teal-600" />
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900">{item.nome}</div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    <span className="flex items-center">
                                                        <MapPin className="w-3.5 h-3.5 mr-1 text-teal-500" />
                                                        {getAdminRegionalName(item.adminRegionalId)?.split('-')[1]?.trim() || 'Não definido'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                            {getAdminRegionalName(item.adminRegionalId)}
                                        </span>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex flex-col space-y-2">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <span className="font-medium text-gray-600 mr-2">Número:</span>
                                                {item.numero}
                                            </div>
                                            <div className="flex items-center text-xs text-gray-700">
                                                <span className="font-medium text-gray-600 mr-2">Código:</span>
                                                {item.codigo}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewNucleo(item.id)}
                                                className="p-2 hover:bg-teal-100 text-teal-600 hover:text-teal-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleEditNucleo(item.id)}
                                                className="p-2 hover:bg-green-100 text-green-600 hover:text-green-800 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNucleo(item.id)}
                                                className="p-2 hover:bg-red-100 text-blue-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <div className="relative">
                                                <button
                                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                                    title="Mais ações"
                                                >
                                                    <MoreVertical className="w-5 h-5 text-gray-600" />
                                                </button>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Visualização em cards para telas pequenas */}
                <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((item) => (
                        <div key={item.id} className="p-4 border-b border-gray-200 hover:bg-teal-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-teal-100 rounded-full flex items-center justify-center">
                                    <Layers className="h-8 w-8 text-teal-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{item.nome}</h3>
                                            <div className="text-xs text-gray-500 mt-1">Número: {item.numero}</div>
                                            <div className="text-xs text-gray-500">Código: {item.codigo}</div>
                                        </div>
                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                            {getAdminRegionalName(item.adminRegionalId).split('-')[1]?.trim() || getAdminRegionalName(item.adminRegionalId)}
                                        </span>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewNucleo(item.id)}
                                                className="p-1.5 bg-teal-50 hover:bg-teal-100 text-teal-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditNucleo(item.id)}
                                                className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Pencil className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleDeleteNucleo(item.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-red-100 text-blue-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <button
                                            className="p-1.5 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded-full transition-colors"
                                            title="Mais ações"
                                        >
                                            <MoreVertical className="w-4 h-4" />
                                        </button>
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
                            <span className="font-medium">{filteredData.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredData.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredData.length}</span>
                            {' '}resultados
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md
                                    ${currentPage === 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-200'
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
                                        : 'bg-white text-teal-700 hover:bg-teal-50 border border-teal-200'
                                    }`}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-1" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Nenhum resultado encontrado */}
                {filteredData.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Search className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhum núcleo encontrado</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedRegion ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedRegion('');
                                }}
                                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <a href="/nucleo/adicionar">
                                <button className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                                    Adicionar núcleo
                                </button>
                            </a>
                        )}
                    </div>
                )}
            </div>

            {/* Informações adicionais */}
            <div className="mt-6 bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center text-teal-700 mb-4">
                    <Info className="w-5 h-5 mr-2" />
                    <h2 className="text-lg font-semibold">Informações sobre núcleos</h2>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                    Os núcleos são unidades organizacionais intermediárias entre as regiões administrativas e os agrupamentos.
                    Cada núcleo pertence a uma região administrativa específica.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-teal-50 p-4 rounded-lg border border-teal-200">
                        <h3 className="text-sm font-medium text-teal-800 flex items-center">
                            <Layers className="w-4 h-4 mr-2 text-teal-600" />
                            Gestão de Núcleos
                        </h3>
                        <p className="text-xs text-teal-700 mt-1">Visualize, edite e atualize informações dos núcleos</p>
                    </div>
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <h3 className="text-sm font-medium text-blue-800 flex items-center">
                            <Building className="w-4 h-4 mr-2 text-blue-600" />
                            Regiões Administrativas
                        </h3>
                        <p className="text-xs text-blue-700 mt-1">Os núcleos estão organizados por regiões administrativas</p>
                    </div>
                    <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                        <h3 className="text-sm font-medium text-green-800 flex items-center">
                            <Globe className="w-4 h-4 mr-2 text-green-600" />
                            Organização Territorial
                        </h3>
                        <p className="text-xs text-green-700 mt-1">Os núcleos ajudam na gestão territorial dos agrupamentos</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default NucleoManagerNacional;