import {
    AlertCircle,
    Building,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Construction,
    Download,
    Eye,
    Factory,
    Gauge,
    Mail,
    MapPin,
    Pencil,
    Phone,
    Search,
    Trash2,
    Users,
    Wrench,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomInput from '../../../../../core/components/CustomInput';
import { exportToExcel } from '@/core/components/exportToExcel';

;

const GestaoInfraestruturaAgricola = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedProvincia, setSelectedProvincia] = useState('');
    const [selectedTipo, setSelectedTipo] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const [infraestruturas, setInfraestruturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const containerRef = useRef(null);
    const itemsPerPage = 6;
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [infraestruturaToDelete, setInfraestruturaToDelete] = useState(null);

    // Buscar dados da API
    useEffect(() => {
        const fetchInfraestruturas = async () => {
            try {
                setLoading(true);
                const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/infraestrutura/all');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                // Filtrar dados válidos (remover entradas com campos nulos/vazios)
                const validData = data.filter(item =>
                    item.nome_da_Infraestrutura &&
                    item.nome_da_Infraestrutura !== 'string' &&
                    item.nome_da_Infraestrutura.trim() !== ''
                );

                setInfraestruturas(validData);
                console.log('Infraestruturas carregadas:', validData);

            } catch (err) {
                console.error('Erro ao buscar infraestruturas:', err);
                setError(err.message);
                showToast('error', 'Erro', 'Erro ao carregar infraestruturas');
            } finally {
                setLoading(false);
            }
        };

        fetchInfraestruturas();
    }, []);

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

    // Função para formatar tipo de infraestrutura
    const formatTipoInfraestrutura = (tipo) => {
        if (!tipo) return 'N/A';

        const tipos = {
            'CANAL_IRRIGACAO': 'Canal de Irrigação',
            'REPRESA_BARRAGEM': 'Represa/Barragem',
            'FURO_AGUA': 'Furo de Água/Poço',
            'SISTEMA_REGA': 'Sistema de Rega',
            'ARMAZEM_CONSERVACAO': 'Armazém',
            'SILOS_GRAOS': 'Silos de Grãos',
            'ESTUFA_AGRICOLA': 'Estufa Agrícola',
            'ESTACAO_METEOROLOGICA': 'Estação Meteorológica',
            'ESTRADA_ACESSO': 'Estrada Rural',
            'MERCADO_AGRICOLA': 'Mercado Agrícola',
            'CENTRO_FORMACAO': 'Centro de Formação',
            'CENTRO_EXTENSAO': 'Centro de Extensão',
            'POSTO_VETERINARIO': 'Posto Veterinário',
            'MATADOURO': 'Matadouro/Abatedouro',
            'CAIS_PESCA': 'Cais de Pesca',
            'CENTRO_PROCESSAMENTO': 'Centro de Processamento',
            'EQUIPAMENTOS_COMUNITARIOS': 'Equipamentos Comunitários',
            'Matadouro_Municipal_/_Abatedouro': 'Matadouro/Abatedouro'
        };

        return tipos[tipo] || tipo.replace(/_/g, ' ');
    };

    // Função para formatar estado de conservação
    const formatEstadoConservacao = (estado) => {
        if (!estado) return 'N/A';

        const estados = {
            'BOM': 'Bom',
            'RAZOAVEL': 'Razoável',
            'MAU': 'Mau',
            'razoável': 'Razoável',
            'semanal': 'Semanal',
            'SEMANAL': 'Semanal',
            'DIARIA': 'Diária'
        };

        return estados[estado] || estado;
    };

    // Filtragem das infraestruturas
    const filteredInfraestruturas = infraestruturas.filter(infra => {
        const matchesSearch =
            infra.nome_da_Infraestrutura?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            infra.propriet_rio_Institui_o_Gestora?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            infra.e_mail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            infra.contacto?.includes(searchTerm);

        const matchesProvincia = !selectedProvincia ||
            infra.provincia?.toUpperCase() === selectedProvincia.toUpperCase();

        const matchesTipo = !selectedTipo ||
            infra.tipo_de_Infraestrutura?.includes(selectedTipo);

        const matchesStatus = !selectedStatus ||
            (selectedStatus === 'BOM' && infra.estado_de_Conserva_o === 'BOM') ||
            (selectedStatus === 'OUTROS' && infra.estado_de_Conserva_o !== 'BOM');

        return matchesSearch && matchesProvincia && matchesTipo && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredInfraestruturas.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredInfraestruturas.slice(startIndex, endIndex);
    };




    const handleExport = () => {
        const dataToExport = filteredInfraestruturas.map(infra => ({

            'Nome da Infraestrutura ': infra.nome_da_Infraestrutura,
            'Tipo': infra.tipo_de_Infraestrutura.replace(/_/g, ' ' ),
            'Responsável': infra.propriet_rio_Institui_o_Gestora,
            'Contacto': infra.contacto,
            'Email': infra.e_mail,
            'Estado da Conservação': infra.estado_de_Conserva_o,
            'Utilizadores': infra.capacidade_ex_litr_mero_de_utilizadores,
            'Dimensão': infra.dimens_o_m_ha_km_etc,
            'Frequência': infra.frequ_ncia_de_Utiliza_o,
            'Província': infra.provincia,
            'Município': infra.municipio,
        }));

        exportToExcel(dataToExport, 'infraestrutura_sigaf','Infraestruturas Agrícolas', showToast);
    };


    // Navegação
    const handleViewInfraestrutura = (id) => {
        navigate(`/GerenciaSIGAF/gestao-agricultores/produtores/infraestruturas/visualizar/${id}`);
    };

    const handleEditInfraestrutura = (id) => {
        navigate(`/infraestruturas/editar/${id}`);
    };

    // Função para abrir modal de confirmação
    const openDeleteModal = (id) => {
        setInfraestruturaToDelete(id);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setInfraestruturaToDelete(null);
    };

    // Função para deletar infraestrutura após confirmação
    const handleConfirmDelete = async () => {
        if (!infraestruturaToDelete) return;

        try {
            const response = await fetch(`https://mwangobrainsa-001-site2.mtempurl.com/api/infraestrutura/${infraestruturaToDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                setInfraestruturas(prev => prev.filter(infra => infra._id !== infraestruturaToDelete));
                showToast('success', 'Excluído', 'Infraestrutura excluída com sucesso!');
            } else {
                throw new Error('Erro ao excluir');
            }
        } catch (erro) {
            showToast('error', 'Erro', 'Erro ao excluir infraestrutura.');
            console.error(erro);
        } finally {
            closeDeleteModal();
        }
    };

    // Extrair províncias únicas para o filtro
    const uniqueProvincias = [...new Set(infraestruturas
        .map(infra => infra.provincia)
        .filter(Boolean)
        .map(p => p.toUpperCase())
    )];

    // Extrair tipos únicos para o filtro
    const uniqueTipos = [...new Set(infraestruturas
        .map(infra => infra.tipo_de_Infraestrutura)
        .filter(Boolean)
    )];

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
            default:
                bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
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

    // Modal de confirmação de exclusão
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const infraestrutura = infraestruturas.find(c => c._id === infraestruturaToDelete);

        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir a infraestrutura{' '}
                        <span className="font-semibold text-red-600">
                            {infraestrutura?.nome_da_Infraestrutura || 'Selecionada'}
                        </span>?<br />
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 mt-2 w-full">
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
                        >
                            Sim, excluir
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando infraestruturas...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <p className="text-red-600">Erro ao carregar dados: {error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen" ref={containerRef}>
            <Toast />
            <DeleteConfirmModal />

            {/* Estatísticas */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <Building className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total</p>
                            <p className="text-2xl font-bold text-gray-900">{infraestruturas.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Bom Estado</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {infraestruturas.filter(i => i.estado_de_Conserva_o === 'BOM').length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <Wrench className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Razoável</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {infraestruturas.filter(i =>
                                    i.estado_de_Conserva_o === 'RAZOAVEL' ||
                                    i.estado_de_Conserva_o === 'razoável'
                                ).length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-100 rounded-full">
                            <AlertCircle className="w-6 h-6 text-red-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Mau Estado</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {infraestruturas.filter(i => i.estado_de_Conserva_o === 'MAU').length}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Infraestruturas Agrícolas</h1>
                            <p className="text-blue-100 mt-1">Sistema de Registro de Infraestruturas - Angola</p>
                        </div>
                        <div className="flex gap-4">

                            <button
                                onClick={handleExport}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar Excel
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
                                placeholder="Buscar por nome, proprietário ou contato..."
                                value={searchTerm}
                                onChange={setSearchTerm}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Província */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Província"
                                value={selectedProvincia}
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
                                placeholder="Tipo de Infraestrutura"
                                value={selectedTipo}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    ...uniqueTipos.map(tipo => ({
                                        label: formatTipoInfraestrutura(tipo),
                                        value: tipo
                                    }))
                                ]}
                                onChange={(option) => setSelectedTipo(option?.value || '')}
                                iconStart={<Factory size={18} />}
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
                                    Infraestrutura
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipo & Estado
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Localização
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Responsável
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Características
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Ações
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white">
                            {getCurrentItems().map((infraestrutura) => (
                                <tr key={infraestrutura._id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 h-12 w-12 bg-gradient-to-br from-blue-700 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-md">
                                                {infraestrutura.nome_da_Infraestrutura?.charAt(0) || 'I'}
                                            </div>
                                            <div className="ml-4">
                                                <div className="text-sm font-semibold text-gray-900 max-w-[200px]">
                                                    {infraestrutura.nome_da_Infraestrutura || 'N/A'}
                                                </div>
                                                <div className="text-xs text-gray-500 mt-1">
                                                    ID: {infraestrutura._id}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {infraestrutura.data_de_Registo ?
                                                        new Date(infraestrutura.data_de_Registo).toLocaleDateString() :
                                                        'N/A'
                                                    }
                                                </div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                {formatTipoInfraestrutura(infraestrutura.tipo_de_Infraestrutura)}
                                            </div>
                                            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${infraestrutura.estado_de_Conserva_o === 'BOM'
                                                ? 'bg-green-100 text-green-800'
                                                : infraestrutura.estado_de_Conserva_o === 'MAU'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {formatEstadoConservacao(infraestrutura.estado_de_Conserva_o)}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-gray-700">
                                                <MapPin className="w-4 h-4 mr-1 text-blue-500" />
                                                {infraestrutura.municipio}, {infraestrutura.provincia}
                                            </div>
                                            {infraestrutura.comuna && (
                                                <div className="text-xs text-gray-500">
                                                    {infraestrutura.comuna}
                                                </div>
                                            )}
                                            {infraestrutura.aldeia_Zona && (
                                                <div className="text-xs text-gray-500">
                                                    {infraestrutura.aldeia_Zona}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            <div className="text-sm font-medium text-gray-900">
                                                {infraestrutura.propriet_rio_Institui_o_Gestora || 'N/A'}
                                            </div>
                                            {infraestrutura.contacto && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Phone className="w-3 h-3 mr-1" />
                                                    {infraestrutura.contacto}
                                                </div>
                                            )}
                                            {infraestrutura.e_mail && (
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Mail className="w-3 h-3 mr-1" />
                                                    {infraestrutura.e_mail}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-1">
                                            {infraestrutura.dimens_o_m_ha_km_etc && (
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Gauge className="w-3 h-3 mr-1 text-blue-500" />
                                                    {infraestrutura.dimens_o_m_ha_km_etc}
                                                </div>
                                            )}
                                            {infraestrutura.capacidade_ex_litr_mero_de_utilizadores && (
                                                <div className="flex items-center text-xs text-gray-700">
                                                    <Users className="w-3 h-3 mr-1 text-green-500" />
                                                    {infraestrutura.capacidade_ex_litr_mero_de_utilizadores}
                                                </div>
                                            )}
                                            {infraestrutura.frequ_ncia_de_Utiliza_o && (
                                                <div className="text-xs text-gray-500">
                                                    {formatEstadoConservacao(infraestrutura.frequ_ncia_de_Utiliza_o)}
                                                </div>
                                            )}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center space-x-1">
                                            <button
                                                onClick={() => handleViewInfraestrutura(infraestrutura._id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(infraestrutura._id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Excluir"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Cards para mobile */}
                <div className="md:hidden overflow-visible" style={{ maxHeight: contentHeight }}>
                    {getCurrentItems().map((infraestrutura) => (
                        <div key={infraestrutura._id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center text-white font-bold text-xl shadow-md">
                                    {infraestrutura.nome_da_Infraestrutura?.charAt(0) || 'I'}
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">
                                                {infraestrutura.nome_da_Infraestrutura || 'N/A'}
                                            </h3>
                                            <div className="text-xs text-gray-500 mt-1">
                                                {formatTipoInfraestrutura(infraestrutura.tipo_de_Infraestrutura)}
                                            </div>
                                        </div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${infraestrutura.estado_de_Conserva_o === 'BOM'
                                            ? 'bg-green-100 text-green-800'
                                            : infraestrutura.estado_de_Conserva_o === 'MAU'
                                                ? 'bg-red-100 text-red-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                            {formatEstadoConservacao(infraestrutura.estado_de_Conserva_o)}
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="flex items-center text-xs text-gray-700">
                                            <MapPin className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                            <span className="truncate">{infraestrutura.municipio}</span>
                                        </div>
                                        {infraestrutura.contacto && (
                                            <div className="flex items-center text-xs text-gray-700">
                                                <Phone className="w-3.5 h-3.5 mr-1 text-blue-500" />
                                                {infraestrutura.contacto}
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-3 flex justify-end space-x-1">
                                        <button
                                            onClick={() => handleViewInfraestrutura(infraestrutura._id)}
                                            className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                            title="Visualizar"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleEditInfraestrutura(infraestrutura._id)}
                                            className="p-1.5 bg-green-50 hover:bg-green-100 text-green-600 rounded-full transition-colors"
                                            title="Editar"
                                        >
                                            <Pencil className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => openDeleteModal(infraestrutura._id)}
                                            className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                            title="Excluir"
                                        >
                                            <Trash2 className="w-4 h-4" />
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
                            <span className="font-medium">
                                {filteredInfraestruturas.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}
                            </span>
                            {' '}a{' '}
                            <span className="font-medium">
                                {Math.min(currentPage * itemsPerPage, filteredInfraestruturas.length)}
                            </span>
                            {' '}de{' '}
                            <span className="font-medium">{filteredInfraestruturas.length}</span>
                            {' '}resultados
                        </div>

                        <div className="flex space-x-2">
                            <button
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === 1
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
                                className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${currentPage === totalPages || totalPages === 0
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
                {filteredInfraestruturas.length === 0 && (
                    <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                        <Construction className="w-16 h-16 text-gray-300 mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-1">Nenhuma infraestrutura encontrada</h3>
                        <p className="text-gray-500 max-w-md mb-6">
                            Não encontramos resultados para sua busca. Tente outros termos ou remova os filtros aplicados.
                        </p>
                        {searchTerm || selectedProvincia || selectedTipo || selectedStatus ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('');
                                    setSelectedProvincia('');
                                    setSelectedTipo('');
                                    setSelectedStatus('');
                                }}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Limpar filtros
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/infraestruturas/novo')}
                                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Cadastrar Nova Infraestrutura
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default GestaoInfraestruturaAgricola;