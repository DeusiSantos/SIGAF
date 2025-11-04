import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Activity,
    AlertCircle,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    Eye,
    FileText,
    Filter,
    MoreVertical,
    PlusCircle,
    Search,
    TestTube,
    Trash2,
    X,
    Edit
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';
import { useMetodosEnsaios } from '../../../hooks/useMetodosEnsaios';
import { useLaboratorio } from '../../../hooks/useLaboratorio';
import { exportToExcel } from '@/core/components/exportToExcel';

const GestaoMetodosEnsaios = () => {
    const navigate = useNavigate();
    const { metodosEnsaios, loading, error, deleteMetodoEnsaio } = useMetodosEnsaios();
    const { laboratorios } = useLaboratorio();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedTipoAnalise, setSelectedTipoAnalise] = useState('');
    const [selectedTipoAmostra, setSelectedTipoAmostra] = useState('');
    const [selectedLaboratorio, setSelectedLaboratorio] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [contentHeight, setContentHeight] = useState('calc(100vh - 12rem)');
    const itemsPerPage = 6;
    const containerRef = useRef(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [metodoDelete, setMetodoDelete] = useState(null);

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

    // Filtragem dos métodos
    const filteredMetodos = metodosEnsaios.filter(metodo => {
        const matchesSearch = !searchTerm ||
            metodo.parametroDeAnalise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            metodo.metodoDeAnalise?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            metodo.laboratorioExecutor?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesTipoAnalise = !selectedTipoAnalise || metodo.tipoDeAnalise === selectedTipoAnalise;
        const matchesTipoAmostra = !selectedTipoAmostra || metodo.tipoDeAmostra === selectedTipoAmostra;
        const matchesLaboratorio = !selectedLaboratorio || metodo.laboratorioExecutor === selectedLaboratorio;

        return matchesSearch && matchesTipoAnalise && matchesTipoAmostra && matchesLaboratorio;
    });

    // Paginação
    const totalPages = Math.ceil(filteredMetodos.length / itemsPerPage);
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        return filteredMetodos.slice(startIndex, endIndex);
    };


    const handleExport = () => {
        //  transformar os dados antes de exportar
        const dataToExport = filteredMetodos.map(metodo => ({
            'Parâmetro de Análise': metodo.parametroDeAnalise,
            'Método de Análise': metodo.metodoDeAnalise.replace(/_/g, ' '),
            'Tipo de Análise': metodo.tipoDeAnalise.replace(/[-_]/g, ' '),
            'Amostra': metodo.tipoDeAmostra,
            'Laboratório Executor': metodo.laboratorioExecutor,
            'Limite Inferior': metodo.limiteInferior,
            'Limite Superior': metodo.limiteSuperior,
            'Unidade de Medida': metodo.unidadeDeMedida,
            'Preço do Ensaio': metodo.precoDoEnsaio,
        }));

        exportToExcel(dataToExport, 'gestão_de_métodos_e_ensaios', 'Gestão de Métodos e Ensaios', showToast);
    };

    // Navegação para visualizar método
    const handleViewMetodo = (metodoId) => {

        navigate(`/GerenciaSIGAF/LaboratorioDeSolo/visualizar-ensaio/${metodoId}`);
    };

    // Navegação para editar método
    const handleEditMetodo = (metodoId) => {
        navigate(`/GerenciaSIGAF/laboratorio-solo/metodos-ensaios/editar/${metodoId}`);
    };

    // Navegação para novo método
    const handleNovoMetodo = () => {
        navigate('/GerenciaSIGAF/laboratorio-solo/metodos-ensaios/cadastro');
    };

    // Função para obter status do laboratório
    const getLaboratorioStatus = (laboratorioNome) => {
        const lab = laboratorios.find(l => l.nomeDoLaboratorio === laboratorioNome);
        return lab?.estado || 'Inativo';
    };

    // Extrair valores únicos para filtros
    const uniqueTiposAnalise = [...new Set(metodosEnsaios.map(m => m.tipoDeAnalise))].filter(Boolean);
    const uniqueTiposAmostra = [...new Set(metodosEnsaios.map(m => m.tipoDeAmostra))].filter(Boolean);
    const uniqueLaboratorios = [...new Set(metodosEnsaios.map(m => m.laboratorioExecutor))].filter(Boolean);

    // Função para abrir modal de confirmação
    const openDeleteModal = (metodoId) => {
        setMetodoDelete(metodoId);
        setShowDeleteModal(true);
    };

    // Função para fechar modal
    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setMetodoDelete(null);
    };

    // Função para deletar método após confirmação
    const handleConfirmDelete = async () => {
        if (!metodoDelete) return;
        try {
            await deleteMetodoEnsaio(metodoDelete);
            showToast('success', 'Excluído', 'Método de ensaio excluído com sucesso!');
        } catch (err) {
            showToast('error', 'Erro', 'Erro ao excluir método de ensaio.');
            console.error(err);
        } finally {
            closeDeleteModal();
        }
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
    const ActionMenu = ({ metodo }) => {
        const [isOpen, setIsOpen] = useState(false);

        const actionItems = [
            { label: 'Visualizar', icon: <Eye size={16} />, action: () => handleViewMetodo(metodo.id) },
            { label: 'Editar', icon: <Edit size={16} />, action: () => handleEditMetodo(metodo.id) },
            { label: 'Excluir', icon: <Trash2 size={16} />, action: () => openDeleteModal(metodo.id) }
        ];

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
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-[999] ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            {actionItems.map((item, index) => (
                                <button
                                    key={index}
                                    className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                                    onClick={() => {
                                        item.action();
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

    // Modal de confirmação visual
    const DeleteConfirmModal = () => {
        if (!showDeleteModal) return null;
        const metodo = metodosEnsaios.find(m => m.id === metodoDelete);
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                    <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-3">
                        <AlertCircle className="w-6 h-6 text-red-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Exclusão</h3>
                    <p className="text-gray-600 text-center text-sm mb-4">
                        Tem certeza que deseja excluir o método <span className="font-semibold text-red-600">{metodo?.parametroDeAnalise || 'Selecionado'}</span>?<br />
                        Esta ação não pode ser desfeita.
                    </p>
                    <div className="flex gap-3 mt-2 w-full">
                        <button
                            onClick={handleConfirmDelete}
                            className="flex-1 p-2 bg-red-600 hover:bg-red-700 focus:ring-2 focus:ring-red-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200"
                        >
                            Sim, excluir
                        </button>
                        <button
                            onClick={closeDeleteModal}
                            className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200"
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

            {/* Estatísticas dos métodos */}
            <div className="mt-6 mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <TestTube className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Total de Métodos</p>
                            <p className="text-2xl font-bold text-gray-900">{metodosEnsaios.length}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-100 rounded-full">
                            <CheckCircle className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Métodos Activos</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {metodosEnsaios.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-purple-100 rounded-full">
                            <Activity className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Laboratórios</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {uniqueLaboratorios.length}
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6">
                    <div className="flex items-center">
                        <div className="p-3 bg-yellow-100 rounded-full">
                            <FileText className="w-6 h-6 text-yellow-600" />
                        </div>
                        <div className="ml-4">
                            <p className="text-sm font-medium text-gray-500">Preço Médio</p>
                            <p className="text-2xl font-bold text-gray-900">
                                {metodosEnsaios.length > 0 ? Math.round(metodosEnsaios.reduce((sum, m) => sum + m.precoDoEnsaio, 0) / metodosEnsaios.length).toLocaleString() : 0} Kz
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-full bg-white rounded-2xl shadow-md overflow-visible z-10">
                {/* Cabeçalho */}
                <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 text-white rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center space-y-4 md:space-y-0">
                        <div>
                            <h1 className="text-2xl font-bold">Gestão de Métodos e Ensaios</h1>
                            <p className="text-blue-100 mt-1">Administre métodos analíticos e parâmetros de solo</p>
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
                        <div className="lg:col-span-1">
                            <CustomInput
                                type="text"
                                placeholder="Buscar por parâmetro, método ou laboratório..."
                                value={searchTerm}
                                onChange={(value) => setSearchTerm(value)}
                                iconStart={<Search size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo de Análise */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Análise"
                                value={selectedTipoAnalise ? { label: selectedTipoAnalise, value: selectedTipoAnalise } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    ...uniqueTiposAnalise.map(tipo => ({
                                        label: tipo,
                                        value: tipo
                                    }))
                                ]}
                                onChange={(option) => setSelectedTipoAnalise(option?.value || '')}
                                iconStart={<Filter size={18} />}
                            />
                        </div>

                        {/* Filtro Tipo de Amostra */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Tipo de Amostra"
                                value={selectedTipoAmostra ? { label: selectedTipoAmostra, value: selectedTipoAmostra } : null}
                                options={[
                                    { label: 'Todos os Tipos', value: '' },
                                    ...uniqueTiposAmostra.map(tipo => ({
                                        label: tipo,
                                        value: tipo
                                    }))
                                ]}
                                onChange={(option) => setSelectedTipoAmostra(option?.value || '')}
                                iconStart={<TestTube size={18} />}
                            />
                        </div>

                        {/* Filtro Laboratório */}
                        <div>
                            <CustomInput
                                type="select"
                                placeholder="Laboratório"
                                value={selectedLaboratorio ? { label: selectedLaboratorio, value: selectedLaboratorio } : null}
                                options={[
                                    { label: 'Todos os Laboratórios', value: '' },
                                    ...uniqueLaboratorios.map(lab => ({
                                        label: lab,
                                        value: lab
                                    }))
                                ]}
                                onChange={(option) => setSelectedLaboratorio(option?.value || '')}
                                iconStart={<Activity size={18} />}
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
                                    Parâmetro & Método
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Tipo & Amostra
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Laboratório
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Limites & Unidade
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Preço
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                                    Acções
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 bg-white text-start">
                            {getCurrentItems().map((metodo) => (
                                <tr key={metodo.id} className="hover:bg-blue-50 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-start">
                                            <div className="w-10 h-10 rounded-full bg-gradient-to-r first-letter:uppercase from-blue-600 to-blue-500 flex items-center justify-center font-semibold text-sm">
                                                <span className='text-white'>{metodo.formulaQuimica || metodo.parametroDeAnalise?.substring(0, 2).toUpperCase()}</span>
                                            </div>
                                            <div className="ml-4">
                                                <div className="first-letter:uppercase  text-sm font-semibold text-gray-900">{metodo.parametroDeAnalise}</div>
                                                <div className="first-letter:uppercase  text-xs text-gray-500 mt-1">{metodo.metodoDeAnalise}</div>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="space-y-2">
                                            <div className="first-letter:uppercase inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                                                {metodo.tipoDeAnalise}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                Amostra: {metodo.tipoDeAmostra}
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-normal">
                                        <div className="text-sm text-gray-900">{metodo.laboratorioExecutor}</div>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium mt-1 ${getLaboratorioStatus(metodo.laboratorioExecutor) === 'Activo'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {getLaboratorioStatus(metodo.laboratorioExecutor)}
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-900">
                                            {metodo.limiteInferior} - {metodo.limiteSuperior}
                                        </div>
                                        <div className="text-xs text-gray-500">{metodo.unidadeDeMedida}</div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-semibold text-gray-900">
                                            {metodo.precoDoEnsaio?.toLocaleString()} Kz
                                        </div>
                                    </td>

                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center justify-center space-x-1">
                                            <button
                                                onClick={() => handleViewMetodo(metodo.id)}
                                                className="p-2 hover:bg-blue-100 text-blue-600 hover:text-blue-800 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(metodo.id)}
                                                className="p-2 hover:bg-red-100 text-red-600 hover:text-red-800 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            <ActionMenu metodo={metodo} />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td colSpan={6}>
                                    {/* Paginação */}
                                    <div className="px-6 py-4 border-t border-gray-200 bg-white">
                                        <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
                                            <div className="text-sm text-gray-700">
                                                Mostrando{' '}
                                                <span className="font-medium">{filteredMetodos.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0}</span>
                                                {' '}a{' '}
                                                <span className="font-medium">
                                                    {Math.min(currentPage * itemsPerPage, filteredMetodos.length)}
                                                </span>
                                                {' '}de{' '}
                                                <span className="font-medium">{filteredMetodos.length}</span>
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
                    {getCurrentItems().map((metodo) => (
                        <div key={metodo.id} className="p-4 border-b border-gray-200 hover:bg-blue-50 transition-colors">
                            <div className="flex items-start">
                                <div className="flex-shrink-0 h-16 w-16 bg-blue-100 rounded-full flex items-center justify-center">
                                    <TestTube className="h-8 w-8 text-blue-600" />
                                </div>
                                <div className="flex-1 ml-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-sm font-semibold text-gray-900">{metodo.parametroDeAnalise}</h3>
                                            <div className="text-xs text-gray-500 mt-1">{metodo.metodoDeAnalise}</div>
                                            <div className="text-xs text-gray-500">{metodo.laboratorioExecutor}</div>
                                        </div>
                                        <div className="text-sm font-semibold text-gray-900">
                                            {metodo.precoDoEnsaio?.toLocaleString()} Kz
                                        </div>
                                    </div>

                                    <div className="mt-3 grid grid-cols-2 gap-2">
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Tipo:</span> {metodo.tipoDeAnalise}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Amostra:</span> {metodo.tipoDeAmostra}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Limites:</span> {metodo.limiteInferior} - {metodo.limiteSuperior}
                                        </div>
                                        <div className="text-xs text-gray-700">
                                            <span className="font-medium">Unidade:</span> {metodo.unidadeDeMedida}
                                        </div>
                                    </div>

                                    <div className="mt-3 flex justify-between items-center">
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleViewMetodo(metodo.id)}
                                                className="p-1.5 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-full transition-colors"
                                                title="Visualizar"
                                            >
                                                <Eye className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => handleEditMetodo(metodo.id)}
                                                className="p-1.5 bg-yellow-50 hover:bg-yellow-100 text-yellow-600 rounded-full transition-colors"
                                                title="Editar"
                                            >
                                                <Edit className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={() => openDeleteModal(metodo.id)}
                                                className="p-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-full transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getLaboratorioStatus(metodo.laboratorioExecutor) === 'Activo'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-red-100 text-red-800'
                                            }`}>
                                            {getLaboratorioStatus(metodo.laboratorioExecutor)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default GestaoMetodosEnsaios;