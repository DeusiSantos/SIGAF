import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    AlertCircle,
    ArrowLeft,
    BarChart3,
    Beef,
    Calendar,
    CheckCircle,
    Download,
    FileText,
    Filter,
    Plus,
    Search,
    Target,
    Trees,
    TrendingUp,
    Wheat,
    X
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';
import api from '../../../../../core/services/api';
import { gerarFichaCompletaPDF } from '../../../../../pages/public/ProdutorCompletoFlorestal';



const HistoricoProducaoFlorestal = () => {
    const { id: produtorId } = useParams();
    const navigate = useNavigate();

    const [filtroAno, setFiltroAno] = useState({ value: 'todos', label: 'Todos os anos' });
    const [filtroTipo, setFiltroTipo] = useState({ value: 'todos', label: 'Todos os tipos' });
    const [searchTerm, setSearchTerm] = useState('');
    const [toastMessage, setToastMessage] = useState(null);
    const [showAddForm, setShowAddForm] = useState(false);
    const [activeStepInModal, setActiveStepInModal] = useState(0);
    const [loading, setLoading] = useState(false);

    const [historicoProducao, setHistoricoProducao] = useState([]);
    const [loadingHistorico, setLoadingHistorico] = useState(true);
    const [errorHistorico, setErrorHistorico] = useState(null);
    const [gerandoPDF, setGerandoPDF] = useState(false);

    const [produtor] = useState({
        id: produtorId,
        nome: `Produtor ${produtorId}`,
        codigoRNPA: `RNPA-${produtorId}`
    });

    const modalSteps = [
        { label: 'Dados Básicos', icon: FileText },
        { label: 'Produção Agrícola', icon: Wheat },
        { label: 'Criação de Animais', icon: Beef },
        { label: 'Produtos Florestais', icon: Trees },
        { label: 'Finalização', icon: CheckCircle }
    ];

    const isLastStep = activeStepInModal === modalSteps.length - 1;

    // Estados do formulário no modal
    const [formData, setFormData] = useState({
        ano: '',
        safra: '',
        nomePropriedade: '',
        areaTotalUtilizada: '',
        coordenadasGPS: '',
        atividadePrincipal: '',
        culturasAgricolas: [],
        criacaoAnimais: [],
        produtosFlorestais: [],
        vendaMercadoLocal: '',
        vendaMercadoRegional: '',
        autoconsumo: '',
        perdas: '',
        recebiuAssistencia: '',
        tipoAssistencia: [],
        tecnicoResponsavel: '',
        observacoesTecnicas: '',
        desafiosEnfrentados: '',
        melhorias: ''
    });

    // Estados para tabelas dinâmicas
    const [culturasAgricolas, setCulturasAgricolas] = useState([]);
    const [criacaoAnimais, setCriacaoAnimais] = useState([]);
    const [produtosFlorestais, setProdutosFlorestais] = useState([]);

    // Opções para os selects
    const opcoesAno = [
        { value: 'todos', label: 'Todos os anos' },
        { value: '2024', label: '2024' },
        { value: '2023', label: '2023' },
        { value: '2022', label: '2022' },
        { value: '2021', label: '2021' }
    ];

    const opcoesTipo = [
        { value: 'todos', label: 'Todos os tipos' },
        { value: 'agricultura', label: 'Agricultura' },
        { value: 'pecuaria', label: 'Pecuária' },
        { value: 'florestal', label: 'Produtos Florestais' },
        { value: 'aquicultura', label: 'Aquicultura' }
    ];

    const opcoesAtividades = [
        { value: 'agricultura', label: 'Agricultura' },
        { value: 'pecuaria', label: 'Pecuária' },
        { value: 'agropecuaria', label: 'Agropecuária' },
        { value: 'aquicultura', label: 'Aquicultura' },
        { value: 'produtos_florestais', label: 'Produtos Florestais' },
        { value: 'silvicultura', label: 'Silvicultura' },
        { value: 'extrativismo', label: 'Extrativismo Florestal' }
    ];

    const opcoesCulturas = [
        { value: 'milho', label: 'Milho' },
        { value: 'mandioca', label: 'Mandioca' },
        { value: 'amendoim', label: 'Amendoim/Ginguba' },
        { value: 'feijao', label: 'Feijões' },
        { value: 'batata_doce', label: 'Batata-doce' },
        { value: 'banana', label: 'Banana' },
        { value: 'massambla', label: 'Massambla' },
        { value: 'massango', label: 'Massango' },
        { value: 'cafe', label: 'Café' },
        { value: 'cebola', label: 'Cebola' },
        { value: 'tomate', label: 'Tomate' },
        { value: 'couve', label: 'Couve' },
        { value: 'batata_rena', label: 'Batata Rena' },
        { value: 'trigo', label: 'Trigo' },
        { value: 'arroz', label: 'Arroz' },
        { value: 'soja', label: 'Soja' },
        { value: 'outros', label: 'Outros' }
    ];

    const opcoesAnimais = [
        { value: 'avicultura', label: 'Avicultura' },
        { value: 'ovinocultura', label: 'Ovinocultura' },
        { value: 'piscicultura', label: 'Piscicultura' },
        { value: 'aquicultura', label: 'Aquicultura' },
        { value: 'caprinocultura', label: 'Caprinocultura' },
        { value: 'suinocultura', label: 'Suinocultura' },
        { value: 'bovinocultura', label: 'Bovinocultura' },
        { value: 'outros', label: 'Outros' }
    ];

    const opcoesProdutosFlorestais = [
        { value: 'madeira_construcao', label: 'Madeira para Construção' },
        { value: 'madeira_serraria', label: 'Madeira para Serraria' },
        { value: 'lenha', label: 'Lenha' },
        { value: 'carvao', label: 'Carvão Vegetal' },
        { value: 'bambú', label: 'Bambú' },
        { value: 'rattan', label: 'Rattan/Vime' },
        { value: 'resinas', label: 'Resinas' },
        { value: 'gomas', label: 'Gomas' },
        { value: 'mel_silvestre', label: 'Mel Silvestre' },
        { value: 'frutas_silvestres', label: 'Frutas Silvestres' },
        { value: 'plantas_medicinais', label: 'Plantas Medicinais' },
        { value: 'fibras', label: 'Fibras Vegetais' },
        { value: 'cortica', label: 'Cortiça' },
        { value: 'outros', label: 'Outros' }
    ];

    const opcoesEspeciesFlorestal = [
        { value: 'eucalipto', label: 'Eucalipto' },
        { value: 'pinheiro', label: 'Pinheiro' },
        { value: 'acacia', label: 'Acácia' },
        { value: 'teca', label: 'Teca' },
        { value: 'mogno', label: 'Mogno Africano' },
        { value: 'embondeiro', label: 'Embondeiro' },
        { value: 'mululo', label: 'Mululo' },
        { value: 'pau_ferro', label: 'Pau-ferro' },
        { value: 'mussangue', label: 'Mussangue' },
        { value: 'especies_nativas', label: 'Espécies Nativas Mistas' },
        { value: 'outros', label: 'Outros' }
    ];

    const opcoesAssistencia = [
        { value: 'insumos_agricolas', label: 'Fornecimento de insumos agrícolas' },
        { value: 'sementes_melhoradas', label: 'Sementes melhoradas' },
        { value: 'mudas_florestais', label: 'Mudas florestais' },
        { value: 'treinamento_tecnico', label: 'Treinamento técnico' },
        { value: 'credito_agricola', label: 'Crédito agrícola' },
        { value: 'equipamentos', label: 'Equipamentos agrícolas' },
        { value: 'equipamentos_florestais', label: 'Equipamentos florestais (motosserras, etc.)' },
        { value: 'irrigacao', label: 'Sistemas de irrigação' },
        { value: 'comercializacao', label: 'Apoio à comercialização' },
        { value: 'manejo_florestal', label: 'Capacitação em manejo florestal' }
    ];

    useEffect(() => {
        const fetchHistoricoProducao = async () => {
            try {
                setLoadingHistorico(true);
                const response = await api.get(`/historicoDeProducaoFlorestal/produtoreFlorestais/${produtorId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                const dadosTransformados = response.data.map(registro => {
                    const ano = registro.anoDeProducao ? new Date(registro.anoDeProducao).getFullYear().toString() : new Date().getFullYear().toString();

                    const temCulturas = registro.culturasProduzidas && registro.culturasProduzidas.length > 0;
                    const temAnimais = registro.animaisCriados && registro.animaisCriados.length > 0;
                    const temFlorestais = registro.produtosFlorestais && registro.produtosFlorestais.length > 0;

                    let tipo = 'agricultura';
                    if (temFlorestais) tipo = 'florestal';
                    else if (temCulturas && temAnimais) tipo = 'agropecuaria';
                    else if (temAnimais) tipo = 'pecuaria';

                    let cultura = 'Não especificado';
                    if (temFlorestais) {
                        cultura = registro.produtosFlorestais[0]?.tipoProduto || 'Produtos Florestais';
                    } else if (temCulturas && temAnimais) {
                        cultura = 'Agropecuária';
                    } else if (temCulturas) {
                        cultura = registro.culturasProduzidas[0]?.cultura || 'Agricultura';
                    } else if (temAnimais) {
                        cultura = registro.animaisCriados[0]?.tipoDeAnimal || 'Pecuária';
                    }

                    const areaCulturas = registro.culturasProduzidas?.reduce((total, c) =>
                        total + (parseFloat(c.areaCultivada) || 0), 0) || 0;
                    const areaFlorestais = registro.produtosFlorestais?.reduce((total, f) =>
                        total + (parseFloat(f.areaExploracao) || 0), 0) || 0;

                    const producaoCulturas = registro.culturasProduzidas?.reduce((total, c) =>
                        total + (parseFloat(c.producao) || 0), 0) || 0;
                    const numeroAnimais = registro.animaisCriados?.reduce((total, a) =>
                        total + (parseFloat(a.numeroDeAnimais) || 0), 0) || 0;
                    const producaoFlorestais = registro.produtosFlorestais?.reduce((total, f) =>
                        total + (parseFloat(f.volumeProducao) || 0), 0) || 0;

                    const producaoTotal = Math.max(producaoCulturas, numeroAnimais, producaoFlorestais);

                    const areaTotal = Math.max(
                        parseFloat(registro.areaTotalUtilizada) || 0,
                        areaCulturas,
                        areaFlorestais
                    );
                    const rendimento = areaTotal > 0 ? producaoTotal / areaTotal : 0;

                    let unidade = 'unidades';
                    if (temFlorestais) {
                        const primeiraUnidade = registro.produtosFlorestais[0]?.unidadeMedida;
                        unidade = primeiraUnidade === 'm3' ? 'm³' :
                            primeiraUnidade === 'toneladas' ? 'ton' :
                                primeiraUnidade === 'kg' ? 'kg' : 'unidades';
                    } else if (temCulturas && !temAnimais) {
                        const primeiraUnidade = registro.culturasProduzidas[0]?.unidadeDeMedida;
                        unidade = primeiraUnidade === 'sacos_50kg' ? 'sacos 50kg' :
                            primeiraUnidade === 'sacos_25kg' ? 'sacos 25kg' :
                                primeiraUnidade === 'toneladas' ? 'toneladas' :
                                    primeiraUnidade === 'quilos' ? 'kg' :
                                        primeiraUnidade === 'litros' ? 'litros' : 'unidades';
                    } else if (temAnimais && !temCulturas) {
                        unidade = 'cabeças';
                    } else if (temCulturas && temAnimais) {
                        unidade = 'misto';
                    }

                    return {
                        id: registro.id,
                        ano: ano,
                        safra: registro.safraOuEpocaAgricola || `${ano}/${parseInt(ano) + 1}`,
                        cultura: cultura,
                        tipo: tipo,
                        area: areaTotal,
                        producao: producaoTotal,
                        unidade: unidade,
                        rendimento: rendimento,
                        vendido: Math.floor(producaoTotal * 0.6),
                        consumido: Math.floor(producaoTotal * 0.3),
                        status: 'Concluída',
                        vendaLocal: registro.vendaNoMercadoLocal,
                        vendaRegional: registro.vendaNoMercadoRegional,
                        autoConsumo: registro.autoConsumo,
                        perdas: registro.perdas,
                        assistenciaTecnica: registro.recebeuAssistenciaTecnica
                    };
                });

                setHistoricoProducao(dadosTransformados);
                setErrorHistorico(null);
            } catch (err) {
                console.error('Erro ao buscar histórico de produção:', err);
                const errorMessage = err.response?.data?.message || err.response?.statusText || err.message || 'Erro ao carregar dados';
                setErrorHistorico(errorMessage);
            } finally {
                setLoadingHistorico(false);
            }
        };

        if (produtorId) {
            fetchHistoricoProducao();
        }
    }, [produtorId]);

    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleGerarPDFCompleto = async () => {
        setGerandoPDF(true);
        try {
            await gerarFichaCompletaPDF(produtorId); // ✅ Chamada correta
            showToast('success', 'Ficha completa com histórico de produção gerada com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF completo:', error);
            showToast('error', `Erro ao gerar PDF: ${error.message}`);
        } finally {
            setGerandoPDF(false);
        }
    };

    const handleAddHistorico = (produtorId) => {
        navigate(`/GerenciaRNPA/gestao-florestal/produtores/historico-producao/${produtorId}/novo`)
    }

    const dadosFiltrados = historicoProducao
        .filter(item => {
            const matchAno = filtroAno.value === 'todos' || item.ano === filtroAno.value;
            const matchTipo = filtroTipo.value === 'todos' || item.tipo === filtroTipo.value;
            const matchSearch = item.cultura.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.safra.toLowerCase().includes(searchTerm.toLowerCase());
            return matchAno && matchTipo && matchSearch;
        })
        .sort((a, b) => {
            if (a.ano !== b.ano) {
                return b.ano.localeCompare(a.ano);
            }
            return b.id - a.id;
        });

    const estatisticas = {
        totalProducoes: dadosFiltrados.length,
        areaTotal: dadosFiltrados.reduce((acc, item) => acc + item.area, 0),
        producaoTotal: dadosFiltrados.reduce((acc, item) => acc + item.producao, 0),
        rendimentoMedio: dadosFiltrados.length > 0 ?
            dadosFiltrados.reduce((acc, item) => acc + item.rendimento, 0) / dadosFiltrados.length : 0
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    toastMessage.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
                        <p>{toastMessage.message}</p>
                        <button
                            onClick={() => setToastMessage(null)}
                            className="ml-4 text-gray-500 hover:text-gray-700"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex flex-1 items-center gap-4 col-span-6">
                                <button
                                    onClick={() => navigate('/GerenciaRNPA/gestao-agricultores')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <TrendingUp className="w-6 h-6 mr-2 text-green-600" />
                                        Histórico de Produção
                                    </h1>
                                    <p className="text-gray-600">
                                        Produtor: {produtor.nome} | Código: {produtor.codigoRNPA}
                                    </p>
                                </div>
                            </div>

                            <div className="flex-1 flex items-start gap-2 col-span-6 justify-end">
                                <div className="relative group">
                                    <button
                                        onClick={() => handleAddHistorico(produtor.id)}
                                        className="flex items-center text-sm px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        style={{ minWidth: 0 }}
                                        aria-label="Adicionar Registro"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        Adicionar Registro
                                    </button>
                                </div>

                                <div className="relative group">
                                    <button
                                        onClick={handleGerarPDFCompleto}
                                        disabled={gerandoPDF}
                                        className={`flex items-center px-4 py-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${gerandoPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{ minWidth: 0 }}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        Imprimir Ficha Completa
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.totalProducoes}</p>
                            </div>
                            <div className="p-3 bg-blue-100 rounded-full">
                                <BarChart3 className="w-6 h-6 text-blue-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Área (ha)</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.areaTotal.toFixed(1)}</p>
                            </div>
                            <div className="p-3 bg-green-100 rounded-full">
                                <Target className="w-6 h-6 text-green-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Produção Total</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.producaoTotal}</p>
                            </div>
                            <div className="p-3 bg-yellow-100 rounded-full">
                                <Wheat className="w-6 h-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Rendimento Médio</p>
                                <p className="text-2xl font-bold text-gray-900">{estatisticas.rendimentoMedio.toFixed(1)}</p>
                            </div>
                            <div className="p-3 bg-purple-100 rounded-full">
                                <TrendingUp className="w-6 h-6 text-purple-600" />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Filter className="w-4 h-4 mr-2 text-green-600" />
                            Filtros e Pesquisa
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                                <CustomInput
                                    type="text"
                                    label={
                                        <span>
                                            <Search className="w-4 h-4 inline mr-1" />
                                            Pesquisar
                                        </span>
                                    }
                                    value={searchTerm}
                                    onChange={setSearchTerm}
                                    placeholder="Pesquisar por cultura ou safra..."
                                    iconStart={<Search className="w-4 h-4 text-gray-400" />}
                                />
                            </div>

                            <div className="md:col-span-1">
                                <CustomInput
                                    type="select"
                                    label={
                                        <span>
                                            <Calendar className="w-4 h-4 inline mr-1" />
                                            Filtrar por Ano
                                        </span>
                                    }
                                    value={filtroAno}
                                    options={opcoesAno}
                                    onChange={setFiltroAno}
                                    placeholder="Selecione o ano"
                                    iconStart={<Calendar className="w-4 h-4 text-gray-400" />}
                                />
                            </div>

                            <div className="md:col-span-1">
                                <CustomInput
                                    type="select"
                                    label={
                                        <span>
                                            <Filter className="w-4 h-4 inline mr-1" />
                                            Filtrar por Tipo
                                        </span>
                                    }
                                    value={filtroTipo}
                                    options={opcoesTipo}
                                    onChange={setFiltroTipo}
                                    placeholder="Selecione o tipo"
                                    iconStart={<Filter className="w-4 h-4 text-gray-400" />}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    <div className="p-6">
                        <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-green-600" />
                            Registos de Produção ({dadosFiltrados.length})
                        </h2>

                        {loadingHistorico ? (
                            <div className="text-center py-12">
                                <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                <p className="text-gray-600">A carregar registos de produção...</p>
                            </div>
                        ) : errorHistorico ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-red-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Erro ao carregar dados</h3>
                                <p className="text-red-600 mb-4">{errorHistorico}</p>
                                <button
                                    onClick={() => window.location.reload()}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        ) : dadosFiltrados.length === 0 ? (
                            <div className="text-center py-12">
                                <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                <h3 className="text-lg font-medium text-gray-900 mb-2">Nenhum registo encontrado</h3>
                                <p className="text-gray-600">
                                    {historicoProducao.length === 0
                                        ? "Não há registos de produção para este produtor."
                                        : "Não há registos que correspondam aos filtros aplicados."
                                    }
                                </p>
                            </div>
                        ) : (
                            <div className='overflow-x-auto'>
                                <table className="table-auto w-full divide-y divide-gray-200 text-xs sm:text-sm">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Ano/Safra
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Cultura/Criação/Produto
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Tipo
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Área (ha)
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Produção
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Rendimento
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Mercado
                                            </th>
                                            <th className="px-2 md:px-4 py-2 md:py-3 text-left font-medium text-gray-500 uppercase tracking-wider whitespace-normal break-words">
                                                Assistência Técnica
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {dadosFiltrados.map((item) => (
                                            <tr key={item.id} className="hover:bg-gray-50 text-[11px] sm:text-xs md:text-sm">
                                                <td className="px-2 md:px-4 py-2 whitespace-normal break-words">
                                                    <div className="flex flex-wrap items-center text-gray-900">
                                                        <Calendar className="w-4 h-4 mr-1 text-gray-400" />
                                                        <span className="text-sm">{item.ano}</span>
                                                    </div>
                                                    <div className="text-gray-500">{item.safra}</div>
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal break-words">
                                                    <div className="text-gray-900">{item.cultura}</div>
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal break-words">
                                                    <span className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${item.tipo === 'agricultura'
                                                        ? 'bg-green-100 text-green-800'
                                                        : item.tipo === 'pecuaria'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : item.tipo === 'florestal'
                                                                ? 'bg-emerald-100 text-emerald-800'
                                                                : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {item.tipo === 'agricultura'
                                                            ? 'Agricultura'
                                                            : item.tipo === 'pecuaria'
                                                                ? 'Pecuária'
                                                                : item.tipo === 'florestal'
                                                                    ? 'Florestal'
                                                                    : 'Agropecuária'}
                                                    </span>
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal text-gray-900">
                                                    {item.area.toFixed(1)} ha
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal break-words">
                                                    <div className="text-gray-900">{item.producao.toFixed(0)}</div>
                                                    <div className="text-gray-500">{item.unidade}</div>
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal text-gray-900">
                                                    {item.rendimento.toFixed(1)}
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal break-words">
                                                    <div>Local: {item.vendaLocal ? `${item.vendaLocal}%` : '-'}</div>
                                                    <div>Regional: {item.vendaRegional ? `${item.vendaRegional}%` : '-'}</div>
                                                </td>
                                                <td className="px-2 md:px-4 py-2 whitespace-normal break-words">
                                                    <span className={`inline-flex px-2 py-1 text-[10px] sm:text-xs font-semibold rounded-full ${item.assistenciaTecnica === 'sim'
                                                        ? 'bg-green-100 text-green-800'
                                                        : item.assistenciaTecnica === 'nao'
                                                            ? 'bg-red-100 text-red-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                        {item.assistenciaTecnica === 'sim'
                                                            ? 'Sim'
                                                            : item.assistenciaTecnica === 'nao'
                                                                ? 'Não'
                                                                : 'Não informado'}
                                                    </span>
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

export default HistoricoProducaoFlorestal;