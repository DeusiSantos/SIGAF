import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Download,
    Printer,
    Gift,
    Calendar,
    BarChart3,
    DollarSign,
    Package,
    Users,
    AlertCircle,
    CheckCircle,
    FileText,
    Filter,
    Search,
    Clock,
    Award,
    TrendingUp
} from 'lucide-react';

import produtores from '../../components/produtores.json';
import CustomInput from '../../components/CustomInput';

const HistoricoBeneficios = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados principais
    const [produtor, setProdutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    const [filtroAno, setFiltroAno] = useState({ value: 'todos', label: 'Todos os anos' });
    const [filtroTipo, setFiltroTipo] = useState({ value: 'todos', label: 'Todos os tipos' });
    const [filtroStatus, setFiltroStatus] = useState({ value: 'todos', label: 'Todos os status' });
    const [searchTerm, setSearchTerm] = useState('');

    // Opções para os selects
    const opcoesAno = [
        { value: 'todos', label: 'Todos os anos' },
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' }
    ];

    const opcoesTipo = [
        { value: 'todos', label: 'Todos os tipos' },
        { value: 'credito', label: 'Crédito' },
        { value: 'sementes', label: 'Sementes' },
        { value: 'animais', label: 'Animais' },
        { value: 'insumos', label: 'Insumos' },
        { value: 'equipamentos', label: 'Equipamentos' },
        { value: 'capacitacao', label: 'Capacitação' },
        { value: 'assistencia', label: 'Assistência Técnica' }
    ];

    const opcoesStatus = [
        { value: 'todos', label: 'Todos os status' },
        { value: 'aprovado', label: 'Aprovado' },
        { value: 'em_andamento', label: 'Em Andamento' },
        { value: 'concluido', label: 'Concluído' },
        { value: 'cancelado', label: 'Cancelado' }
    ];

    // Dados simulados de histórico de benefícios
    const [historicoBeneficios] = useState([
        {
            id: 1,
            ano: '2024',
            data: '2024-03-15',
            tipo: 'credito',
            categoria: 'Crédito',
            descricao: 'Crédito Agrícola KWENDA',
            valor: 250000,
            unidade: 'AOA',
            fonte: 'KWENDA',
            status: 'concluido',
            beneficiario: 'Produtor Principal',
            observacoes: 'Crédito para aquisição de sementes e fertilizantes'
        },
        {
            id: 2,
            ano: '2024',
            data: '2024-02-10',
            tipo: 'sementes',
            categoria: 'Pacote de Sementes',
            descricao: 'Milho + Feijão + Sementes',
            valor: 15,
            unidade: 'kg',
            fonte: 'PDAC',
            status: 'concluido',
            beneficiario: 'Produtor Principal',
            observacoes: 'Pacote completo para 2 hectares'
        },
        {
            id: 3,
            ano: '2024',
            data: '2024-01-20',
            tipo: 'animais',
            categoria: 'Animais',
            descricao: 'Galinhas + Cabras',
            valor: 25,
            unidade: 'cabeças',
            fonte: 'PDAC',
            status: 'concluido',
            beneficiario: 'Agregado Familiar',
            observacoes: '20 galinhas + 5 cabras'
        },
        {
            id: 4,
            ano: '2024',
            data: '2024-04-05',
            tipo: 'capacitacao',
            categoria: 'Capacitação',
            descricao: 'Curso de Técnicas Agrícolas Melhoradas',
            valor: 40,
            unidade: 'horas',
            fonte: 'Administração Pública',
            status: 'em_andamento',
            beneficiario: 'Produtor Principal',
            observacoes: 'Capacitação em andamento - 30/40 horas concluídas'
        },
        {
            id: 5,
            ano: '2023',
            data: '2023-08-12',
            tipo: 'insumos',
            categoria: 'Insumos Agrícolas',
            descricao: 'Fertilizantes e Pesticidas',
            valor: 50,
            unidade: 'kg',
            fonte: 'Caixa Comunitária',
            status: 'concluido',
            beneficiario: 'Produtor Principal',
            observacoes: 'Fertilizantes NPK + pesticidas orgânicos'
        },
        {
            id: 6,
            ano: '2023',
            data: '2023-06-30',
            tipo: 'equipamentos',
            categoria: 'Equipamentos',
            descricao: 'Motobomba para Irrigação',
            valor: 1,
            unidade: 'unidade',
            fonte: 'PDAC',
            status: 'concluido',
            beneficiario: 'Cooperativa Local',
            observacoes: 'Equipamento compartilhado com outros produtores'
        },
        {
            id: 7,
            ano: '2023',
            data: '2023-11-15',
            tipo: 'assistencia',
            categoria: 'Assistência Técnica',
            descricao: 'Acompanhamento Técnico Mensal',
            valor: 12,
            unidade: 'visitas',
            fonte: 'Operador Técnico',
            status: 'concluido',
            beneficiario: 'Produtor Principal',
            observacoes: 'Acompanhamento durante todo o ciclo produtivo'
        },
        {
            id: 8,
            ano: '2024',
            data: '2024-05-20',
            tipo: 'credito',
            categoria: 'Microcrédito',
            descricao: 'PDAC - Fundo de Apoio',
            valor: 150000,
            unidade: 'AOA',
            fonte: 'PDAC',
            status: 'aprovado',
            beneficiario: 'Produtor Principal',
            observacoes: 'Aguardando liberação dos recursos'
        }
    ]);

    // Carregar dados do produtor
    useEffect(() => {
        const loadProdutor = async () => {
            setLoading(true);
            try {
                const produtorData = produtores.find(p => p.id === id);
                if (produtorData) {
                    setProdutor(produtorData);
                } else {
                    setToastMessage({ type: 'error', message: 'Produtor não encontrado' });
                }
            } catch (error) {
                setToastMessage({ type: 'error', message: 'Erro ao carregar dados do produtor' });
            } finally {
                setLoading(false);
            }
        };

        loadProdutor();
    }, [id]);

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Filtrar dados
    const dadosFiltrados = historicoBeneficios.filter(item => {
        const matchAno = filtroAno.value === 'todos' || item.ano === filtroAno.value;
        const matchTipo = filtroTipo.value === 'todos' || item.tipo === filtroTipo.value;
        const matchStatus = filtroStatus.value === 'todos' || item.status === filtroStatus.value;
        const matchSearch = item.descricao.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.categoria.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.fonte.toLowerCase().includes(searchTerm.toLowerCase());
        return matchAno && matchTipo && matchStatus && matchSearch;
    });

    // Calcular estatísticas
    const estatisticas = {
        totalBeneficios: dadosFiltrados.length,
        beneficiosConcluidos: dadosFiltrados.filter(item => item.status === 'concluido').length,
        beneficiosAndamento: dadosFiltrados.filter(item => item.status === 'em_andamento').length,
        valorTotalCreditos: dadosFiltrados
            .filter(item => item.tipo === 'credito' && item.unidade === 'AOA')
            .reduce((acc, item) => acc + item.valor, 0)
    };

    // Funções de ação
    const handleExportarRelatorio = () => {
        showToast('info', 'Exportando relatório de benefícios...');
    };

    const handleImprimirHistorico = () => {
        window.print();
    };

    // Função para formatar valor conforme o tipo
    const formatarValor = (item) => {
        if (item.unidade === 'AOA') {
            return `${item.valor.toLocaleString('pt-BR')} AOA`;
        }
        return `${item.valor} ${item.unidade}`;
    };

    // Função para formatar data
    const formatarData = (data) => {
        return new Date(data).toLocaleDateString('pt-BR');
    };

    // Função para obter ícone do tipo de benefício
    const getIconeTipo = (tipo) => {
        const icones = {
            credito: <DollarSign className="w-4 h-4" />,
            sementes: <Package className="w-4 h-4" />,
            animais: <Users className="w-4 h-4" />,
            insumos: <Package className="w-4 h-4" />,
            equipamentos: <BarChart3 className="w-4 h-4" />,
            capacitacao: <Award className="w-4 h-4" />,
            assistencia: <FileText className="w-4 h-4" />
        };
        return icones[tipo] || <Gift className="w-4 h-4" />;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Carregando histórico de benefícios...</p>
                </div>
            </div>
        );
    }

    if (!produtor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Produtor não encontrado</h1>
                    <p className="text-gray-600 mb-6">Não foi possível carregar o histórico de benefícios.</p>
                    <button
                        onClick={() => navigate('/gestao-escolar/produtores')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Voltar à lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
                    toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    toastMessage.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                    'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                }`}>
                    <div className="flex items-center">
                        {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
                        <p>{toastMessage.message}</p>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate(`/gestao-escolar/produtores/visualizar/${id}`)}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Gift className="w-6 h-6 mr-2 text-green-600" />
                                        Histórico de Benefícios
                                    </h1>
                                    <p className="text-gray-600">
                                        Produtor: {produtor.nome} | Código: {produtor.codigoRNPA}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={handleImprimirHistorico}
                                    className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                >
                                    <Printer className="w-4 h-4 mr-2" />
                                    Imprimir
                                </button>
                                <button
                                    onClick={handleExportarRelatorio}
                                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Exportar Relatório
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cartões de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total de Benefícios</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalBeneficios}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Gift className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Concluídos</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.beneficiosConcluidos}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Em Andamento</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.beneficiosAndamento}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Clock className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Valor Créditos (AOA)</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {estatisticas.valorTotalCreditos.toLocaleString('pt-BR')}
                                </p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filtros e Busca */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Filter className="w-5 h-5 mr-2 text-green-600" />
                            Filtros e Busca
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            {/* Campo de Busca */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="text"
                                    label="Buscar"
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Buscar benefício..."
                                    iconStart={<Search size={18} />}
                                    className="w-full"
                                />
                            </div>

                            {/* Filtro por Ano */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="select"
                                    label="Filtrar por Ano"
                                    value={filtroAno}
                                    onChange={setFiltroAno}
                                    options={opcoesAno}
                                    placeholder="Selecione o ano"
                                    iconStart={<Calendar size={18} />}
                                    className="w-full"
                                />
                            </div>

                            {/* Filtro por Tipo */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="select"
                                    label="Filtrar por Tipo"
                                    value={filtroTipo}
                                    onChange={setFiltroTipo}
                                    options={opcoesTipo}
                                    placeholder="Selecione o tipo"
                                    iconStart={<Package size={18} />}
                                    className="w-full"
                                />
                            </div>

                            {/* Filtro por Status */}
                            <div className="lg:col-span-1">
                                <CustomInput
                                    type="select"
                                    label="Filtrar por Status"
                                    value={filtroStatus}
                                    onChange={setFiltroStatus}
                                    options={opcoesStatus}
                                    placeholder="Selecione o status"
                                    iconStart={<TrendingUp size={18} />}
                                    className="w-full"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabela de Benefícios */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-green-600" />
                            Benefícios Recebidos ({dadosFiltrados.length})
                        </h2>

                        {dadosFiltrados.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum benefício encontrado</h3>
                                <p className="text-gray-600">
                                    Não há benefícios que correspondam aos filtros aplicados.
                                </p>
                            </div>
                        ) : (
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Data
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Tipo/Categoria
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Descrição
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Valor/Quantidade
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fonte
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Status
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Beneficiário
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dadosFiltrados.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatarData(item.data)}
                                                    </div>
                                                    <div className="text-sm text-gray-500">{item.ano}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-8 w-8 flex items-center justify-center bg-gray-100 rounded-full mr-3">
                                                            {getIconeTipo(item.tipo)}
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium text-gray-900">{item.categoria}</div>
                                                            <div className="text-sm text-gray-500 capitalize">{item.tipo}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-900">{item.descricao}</div>
                                                    {item.observacoes && (
                                                        <div className="text-sm text-gray-500 mt-1">{item.observacoes}</div>
                                                    )}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {formatarValor(item)}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.fonte}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                                                        item.status === 'concluido' ? 'bg-green-100 text-green-800' :
                                                        item.status === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                                                        item.status === 'aprovado' ? 'bg-blue-100 text-blue-800' :
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {item.status === 'concluido' ? 'Concluído' :
                                                         item.status === 'em_andamento' ? 'Em Andamento' :
                                                         item.status === 'aprovado' ? 'Aprovado' :
                                                         'Cancelado'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-900">{item.beneficiario}</div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoricoBeneficios;