import {
    AlertCircle,
    AlertTriangle,
    Calendar,
    CheckCircle,
    Download,
    Eye,
    FileText,
    Filter,
    Plus,
    Search,
    Trash2,
    User,
    X
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { useNavigate } from 'react-router-dom';
import CustomInput from '../../core/components/CustomInput';

const GestaoLicencas = () => {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 20;
    const containerRef = useRef(null);

    const [licencas] = useState([
        {
            id: 1,
            numero: 'LIC-2024-001',
            tipo: 'Corte',
            produtor: 'João Silva Santos',
            area: 'Área Florestal Principal',
            dataEmissao: '2024-01-15',
            dataValidade: '2024-12-31',
            status: 'Aprovado'
        },
        {
            id: 2,
            numero: 'LIC-2024-002',
            tipo: 'Transporte',
            produtor: 'Maria Costa',
            area: 'Área Secundária',
            dataEmissao: '2024-02-10',
            dataValidade: '2024-11-30',
            status: 'Negado'
        },
        {
            id: 3,
            numero: 'LIC-2024-003',
            tipo: 'PFNM',
            produtor: 'Pedro Santos',
            area: 'Área Norte',
            dataEmissao: '2024-03-01',
            dataValidade: '2025-02-28',
            status: 'Aprovado'
        }
    ]);

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

    // Filtragem das licenças
    const filteredLicencas = licencas.filter(licenca => {
        const matchesSearch = licenca.numero.toLowerCase().includes(searchTerm.toLowerCase()) ||
            licenca.produtor.toLowerCase().includes(searchTerm.toLowerCase()) ||
            licenca.tipo.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = !selectedStatus || licenca.status === selectedStatus;

        return matchesSearch && matchesStatus;
    });

    // Paginação
    const totalPages = Math.ceil(filteredLicencas.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredLicencas.slice(startIndex, endIndex);
    };

    // Cores para diferentes status
    const getStatusColor = (status) => {
        const statusColors = {
            'Aprovado': 'bg-green-100 text-green-800 border-green-300',
            'Negado': 'bg-red-100 text-red-800 border-red-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

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

    // Indicadores de totais
    const totalLicencas = licencas.length;
    const totalAprovadas = licencas.filter(l => l.status === 'Aprovado').length;
    const totalNegadas = licencas.filter(l => l.status === 'Negado').length;

    return (
        <div>
            {/* Indicadores do topo */}
            <div className="w-full flex justify-center bg-transparent pb-[30px] pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <FileText className="w-6 h-6 text-blue-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{totalLicencas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Aprovadas</p>
                                <p className="text-2xl font-bold text-gray-900">{totalAprovadas}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-md p-6">
                        <div className="flex items-center">
                            <div className="p-3 bg-red-100 rounded-full">
                                <AlertTriangle className="w-6 h-6 text-red-600" />
                            </div>
                            <div className="flex flex-col items-center ml-4">
                                <p className="text-sm font-medium text-gray-500">Negadas</p>
                                <p className="text-2xl font-bold text-gray-900">{totalNegadas}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-xl overflow-hidden" ref={containerRef}>
                <Toast />

                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white shadow-md mb-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Licenças Florestais</h1>
                        </div>
                        <div className="flex gap-4">
                            <button
                                onClick={() => showToast('info', 'Função', 'Nova licença')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Plus className="w-5 h-5 mr-2" />
                                Nova Licença
                            </button>
                            <button
                                onClick={() => showToast('info', 'Função', 'Exportar dados das licenças')}
                                className="inline-flex items-center px-4 py-2 bg-white text-blue-700 rounded-lg hover:bg-blue-50 transition-colors shadow-sm font-medium"
                            >
                                <Download className="w-5 h-5 mr-2" />
                                Exportar
                            </button>
                        </div>
                    </div>
                </div>

                <div className="w-full bg-white rounded-xl shadow-md overflow-auto" style={{ maxHeight: contentHeight }}>
                    {/* Barra de ferramentas */}
                    <div className="p-6 border-b border-gray-200 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Busca */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="text"
                                    placeholder="Pesquisar por número, produtor ou tipo..."
                                    value={searchTerm}
                                    onChange={(value) => setSearchTerm(value)}
                                    iconStart={<Search size={18} />}
                                />
                            </div>

                            {/* Filtro Status */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Status da Licença"
                                    value={selectedStatus ? { label: selectedStatus, value: selectedStatus } : null}
                                    options={[
                                        { label: 'Todos os Status', value: '' },
                                        { label: 'Aprovado', value: 'Aprovado' },
                                        { label: 'Negado', value: 'Negado' }
                                    ]}
                                    onChange={(option) => setSelectedStatus(option?.value || '')}
                                    iconStart={<Filter size={18} />}
                                />
                            </div>

                            {/* Filtro Tipo */}
                            <div>
                                <CustomInput
                                    type="select"
                                    placeholder="Tipo de Licença"
                                    value=""
                                    options={[
                                        { label: 'Todos os Tipos', value: '' },
                                        { label: 'Corte', value: 'Corte' },
                                        { label: 'Transporte', value: 'Transporte' },
                                        { label: 'Carvão', value: 'Carvão' },
                                        { label: 'PFNM', value: 'PFNM' }
                                    ]}
                                    onChange={() => { }}
                                    iconStart={<FileText size={18} />}
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
                                        Licença
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Produtor
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                        Área/Validade
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
                                {getCurrentItems().map((licenca) => (
                                    <tr key={licenca.id} className="hover:bg-blue-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-start text-start">
                                                <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                                    <FileText className="w-6 h-6" />
                                                </div>
                                                <div className="ml-4">
                                                    <div className="text-sm font-semibold text-gray-900">{licenca.numero}</div>
                                                    <div className="text-xs text-gray-500 mt-1">Tipo: {licenca.tipo}</div>
                                                    <div className="text-xs text-gray-500">Emissão: {formatDate(licenca.dataEmissao)}</div>
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-start space-y-1">
                                                <div className="text-sm font-medium text-gray-900">{licenca.produtor}</div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <User className="w-3 h-3 mr-1" />
                                                    Produtor Florestal
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col items-start space-y-1">
                                                <div className="text-sm text-gray-700">{licenca.area}</div>
                                                <div className="flex items-center text-xs text-gray-500">
                                                    <Calendar className="w-3 h-3 mr-1" />
                                                    Válida até: {formatDate(licenca.dataValidade)}
                                                </div>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center">
                                                <span className={`px-3 py-1.5 rounded-full text-xs font-medium border ${getStatusColor(licenca.status)}`}>
                                                    {licenca.status}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex items-center justify-center space-x-1">
                                                <button
                                                    onClick={() => showToast('info', 'Visualizar', `Visualizar licença ${licenca.numero}`)}
                                                    className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                    title="Visualizar"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </button>
                                                <button
                                                    onClick={() => showToast('info', 'Remover', `Remover licença ${licenca.numero}`)}
                                                    className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                    title="Remover"
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

                    {/* Visualização em cards para mobile */}
                    <div className="md:hidden overflow-auto" style={{ maxHeight: contentHeight }}>
                        {getCurrentItems().map((licenca) => (
                            <div key={licenca.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                                <div className="flex items-start">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold text-sm">
                                        <FileText className="w-6 h-6" />
                                    </div>
                                    <div className="flex-1 ml-4">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-sm font-semibold text-gray-900">{licenca.numero}</h3>
                                                <div className="text-xs text-gray-500 mt-1">Tipo: {licenca.tipo}</div>
                                                <div className="text-xs text-gray-500">Produtor: {licenca.produtor}</div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(licenca.status)}`}>
                                                {licenca.status}
                                            </span>
                                        </div>

                                        <div className="mt-3 space-y-1">
                                            <div className="text-xs text-gray-700">Área: {licenca.area}</div>
                                            <div className="text-xs text-gray-500">Válida até: {formatDate(licenca.dataValidade)}</div>
                                        </div>

                                        <div className="mt-3 flex justify-end space-x-1">
                                            <button
                                                onClick={() => showToast('info', 'Visualizar', `Visualizar licença ${licenca.numero}`)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => showToast('info', 'Remover', `Remover licença ${licenca.numero}`)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Nenhum resultado encontrado */}
                    {filteredLicencas.length === 0 && (
                        <div className="py-12 flex flex-col items-center justify-center text-center px-4">
                            <Search className="w-16 h-16 text-gray-300 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-1">
                                {licencas.length === 0 ? 'Nenhuma licença registrada' : 'Nenhuma licença encontrada'}
                            </h3>
                            <p className="text-gray-500 max-w-md mb-6">
                                {licencas.length === 0
                                    ? 'Ainda não há licenças registradas no sistema. Comece a adicionar uma nova licença.'
                                    : 'Não encontramos resultados para a sua busca. Tente outros termos ou remova os filtros aplicados.'
                                }
                            </p>
                            {searchTerm || selectedStatus ? (
                                <button
                                    onClick={() => {
                                        setSearchTerm('');
                                        setSelectedStatus('');
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Limpar filtros
                                </button>
                            ) : null}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GestaoLicencas;