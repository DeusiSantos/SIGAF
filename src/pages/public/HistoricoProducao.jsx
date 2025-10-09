import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import {
    AlertCircle,
    ArrowLeft,
    BarChart3,
    Beef,
    Calendar,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    Download,
    FileText,
    Filter,
    Home,
    MapPin,
    Plus,
    Save,
    Search,
    Target,
    Tractor,
    TrendingUp,
    User,
    Users,
    Wheat,
    X
} from 'lucide-react';

import CustomInput from '../../core/components/CustomInput';
import api from '../../services/api';
import { gerarFichaCompletaPDF } from './ProdutorCompletoRNPAPDF';

const HistoricoProducao = () => {

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
        { label: 'Finalização', icon: CheckCircle }
    ];

    const isLastStep = activeStepInModal === modalSteps.length - 1;

    // Estados do formulário no modal
    const [formData, setFormData] = useState({
        // Dados Básicos
        ano: '',
        safra: '',
        nomePropriedade: '',
        areaTotalUtilizada: '',
        coordenadasGPS: '',
        atividadePrincipal: '',

        // Culturas Agrícolas
        culturasAgricolas: [],

        // Criação de Animais
        criacaoAnimais: [],

        // Dados de Comercialização
        vendaMercadoLocal: '',
        vendaMercadoRegional: '',
        autoconsumo: '',
        perdas: '',

        // Assistência Técnica
        recebiuAssistencia: '',
        tipoAssistencia: [],
        tecnicoResponsavel: '',

        // Observações
        observacoesTecnicas: '',
        desafiosEnfrentados: '',
        melhorias: ''
    });

    // Estados para tabelas dinâmicas
    const [culturasAgricolas, setCulturasAgricolas] = useState([]);
    const [criacaoAnimais, setCriacaoAnimais] = useState([]);

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
        { value: 'aquicultura', label: 'Aquicultura' }
    ];

    const opcoesAtividades = [
        { value: 'agricultura', label: 'Agricultura' },
        { value: 'pecuaria', label: 'Pecuária' },
        { value: 'agropecuaria', label: 'Agropecuária' },
        { value: 'aquicultura', label: 'Aquicultura' },
        { value: 'produtos_florestais', label: 'Produtos Florestais' }
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

    const opcoesAssistencia = [
        { value: 'insumos_agricolas', label: 'Fornecimento de insumos agrícolas' },
        { value: 'sementes_melhoradas', label: 'Sementes melhoradas' },
        { value: 'treinamento_tecnico', label: 'Treinamento técnico' },
        { value: 'credito_agricola', label: 'Crédito agrícola' },
        { value: 'equipamentos', label: 'Equipamentos agrícolas' },
        { value: 'irrigacao', label: 'Sistemas de irrigação' },
        { value: 'comercializacao', label: 'Apoio à comercialização' }
    ];

    // Dados simulados de histórico de produção
    // const [historicoProducao, setHistoricoProducao] = useState([
    //     {
    //         id: 1, ano: '2024', safra: '2024/2025', cultura: 'Milho', tipo: 'agricultura',
    //         area: 2.5, producao: 45, unidade: 'sacos 50kg', rendimento: 18, vendido: 30, consumido: 15, status: 'Concluída'
    //     },
    //     {
    //         id: 2, ano: '2024', safra: '2024/2025', cultura: 'Feijão', tipo: 'agricultura',
    //         area: 1.0, producao: 12, unidade: 'sacos 50kg', rendimento: 12, vendido: 8, consumido: 4, status: 'Concluída'
    //     },
    //     {
    //         id: 3, ano: '2024', safra: '2024/2025', cultura: 'Galinhas', tipo: 'pecuaria',
    //         area: 0.2, producao: 150, unidade: 'cabeças', rendimento: 750, vendido: 100, consumido: 50, status: 'Em andamento'
    //     },
    //     {
    //         id: 4, ano: '2023', safra: '2023/2024', cultura: 'Mandioca', tipo: 'agricultura',
    //         area: 1.8, producao: 95, unidade: 'sacos 50kg', rendimento: 52.8, vendido: 70, consumido: 25, status: 'Concluída'
    //     },
    //     {
    //         id: 5, ano: '2023', safra: '2023/2024', cultura: 'Cabras', tipo: 'pecuaria',
    //         area: 0.5, producao: 35, unidade: 'cabeças', rendimento: 70, vendido: 25, consumido: 10, status: 'Concluída'
    //     },
    //     {
    //         id: 6, ano: '2022', safra: '2022/2023', cultura: 'Amendoim', tipo: 'agricultura',
    //         area: 0.8, producao: 18, unidade: 'sacos 50kg', rendimento: 22.5, vendido: 15, consumido: 3, status: 'Concluída'
    //     }
    // ]);

    useEffect(() => {
        const fetchHistoricoProducao = async () => {
            try {
                setLoadingHistorico(true);
                const response = await api.get(`/historicoDeProducao/produtores/${produtorId}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                // Transformar dados da API para o formato esperado pela tabela
                const dadosTransformados = response.data.map(registro => {
                    // Extrair ano da data
                    const ano = registro.anoDeProducao ? new Date(registro.anoDeProducao).getFullYear().toString() : new Date().getFullYear().toString();

                    // Determinar tipo de produção
                    const temCulturas = registro.culturasProduzidas && registro.culturasProduzidas.length > 0;
                    const temAnimais = registro.animaisCriados && registro.animaisCriados.length > 0;
                    let tipo = 'agricultura';
                    if (temCulturas && temAnimais) tipo = 'agropecuaria';
                    else if (temAnimais) tipo = 'pecuaria';

                    // Obter principal cultura/animal
                    let cultura = 'Não especificado';
                    if (temCulturas && temAnimais) {
                        cultura = 'Agropecuária';
                    } else if (temCulturas) {
                        cultura = registro.culturasProduzidas[0]?.cultura || 'Agricultura';
                    } else if (temAnimais) {
                        cultura = registro.animaisCriados[0]?.tipoDeAnimal || 'Pecuária';
                    }

                    // Calcular área total de culturas
                    const areaCulturas = registro.culturasProduzidas?.reduce((total, c) =>
                        total + (parseFloat(c.areaCultivada) || 0), 0) || 0;

                    // Calcular produção total
                    const producaoCulturas = registro.culturasProduzidas?.reduce((total, c) =>
                        total + (parseFloat(c.producao) || 0), 0) || 0;
                    const numeroAnimais = registro.animaisCriados?.reduce((total, a) =>
                        total + (parseFloat(a.numeroDeAnimais) || 0), 0) || 0;
                    const producaoTotal = Math.max(producaoCulturas, numeroAnimais);

                    // Calcular rendimento
                    const areaTotal = Math.max(parseFloat(registro.areaTotalUtilizada) || 0, areaCulturas);
                    const rendimento = areaTotal > 0 ? producaoTotal / areaTotal : 0;

                    // Determinar unidade
                    let unidade = 'unidades';
                    if (temCulturas && !temAnimais) {
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
                        vendido: Math.floor(producaoTotal * 0.6), // Estimativa baseada nos dados
                        consumido: Math.floor(producaoTotal * 0.3), // Estimativa baseada nos dados
                        status: 'Concluída', // Todos os registros são considerados concluídos
                        // Dados adicionais para exibição detalhada
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

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Função para atualizar campo do formulário
    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));

        // Calcular rendimento automaticamente se área e produção estiverem preenchidos
        if (field === 'area' || field === 'producao') {
            const newFormData = { ...formData, [field]: value };
            const area = parseFloat(newFormData.area) || 0;
            const producao = parseFloat(newFormData.producao) || 0;

            if (area > 0 && producao > 0) {
                const rendimento = producao / area;
                setFormData(prev => ({ ...prev, [field]: value, rendimento: rendimento.toFixed(2) }));
            }
        }
    };

    // Função para renderizar conteúdo do step
    const renderModalStepContent = (index) => {
        switch (index) {
            case 0: // Dados Básicos
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <FileText className="w-5 h-5 text-green-600" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">Informações Básicas do Registo</h4>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Preencha as informações básicas sobre a produção agrícola/pecuária.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput
                                type="date"
                                label="Data de Produção"
                                value={formData.ano}
                                onChange={(value) => updateFormData('ano', value)}
                                placeholder="Selecione a data"
                                iconStart={<Calendar className="w-4 h-4 text-gray-400" />}

                                helperText="Data de início da produção (formato: YYYY-MM-DD)"
                            />

                            <CustomInput
                                type="text"
                                label="Safra/Época Agrícola"
                                value={formData.safra}
                                onChange={(value) => updateFormData('safra', value)}
                                placeholder="Ex: 2024/2025"
                                iconStart={<Calendar className="w-4 h-4 text-gray-400" />}
                                helperText="Formato: Ano/Ano ou descrição da época"
                            />

                            <CustomInput
                                type="text"
                                label="Nome da Propriedade/Campo"
                                value={formData.nomePropriedade}
                                onChange={(value) => updateFormData('nomePropriedade', value)}
                                placeholder="Nome do local de produção"
                                iconStart={<Home className="w-4 h-4 text-gray-400" />}
                            />

                            <CustomInput
                                type="number"
                                label="Área Total Utilizada (hectares)"
                                value={formData.areaTotalUtilizada}
                                onChange={(value) => updateFormData('areaTotalUtilizada', value)}
                                placeholder="0.0"
                                min="0"
                                step="0.1"
                                iconStart={<Target className="w-4 h-4 text-gray-400" />}

                            />

                            <CustomInput
                                type="text"
                                label="Coordenadas GPS"
                                value={formData.coordenadasGPS}
                                onChange={(value) => updateFormData('coordenadasGPS', value)}
                                placeholder="Ex: -8.838333, 13.234444"
                                iconStart={<MapPin className="w-4 h-4 text-gray-400" />}
                                helperText="Opcional: latitude, longitude (ex: -8.838333, 13.234444)"
                            />

                            <CustomInput
                                type="select"
                                label="Atividade Principal"
                                value={formData.atividadePrincipal}
                                options={opcoesAtividades}
                                onChange={(value) => updateFormData('atividadePrincipal', value)}
                                placeholder="Selecione a atividade"
                                iconStart={<Tractor className="w-4 h-4 text-gray-400" />}

                            />
                        </div>
                    </div>
                );

            case 1: // Produção Agrícola
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Wheat className="w-5 h-5 text-green-600" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">Produção Agrícola</h4>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Registre as culturas agrícolas produzidas no período.
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <h5 className="text-md font-semibold text-gray-800">Culturas Produzidas</h5>
                            <button
                                onClick={adicionarCultura}
                                className="bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center text-sm"
                            >
                                <Plus size={16} className="mr-1" />
                                Adicionar Cultura
                            </button>
                        </div>

                        {culturasAgricolas.length > 0 ? (
                            <div className="space-y-4">
                                {culturasAgricolas.map((cultura, index) => (
                                    <div key={cultura.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h6 className="font-medium text-gray-800">Cultura {index + 1}</h6>
                                            <button
                                                onClick={() => removerCultura(cultura.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <CustomInput
                                                type="date"
                                                label="Data"
                                                value={cultura.ano}
                                                onChange={(value) => atualizarCultura(cultura.id, 'ano', value)}
                                                placeholder="Selecione a data"

                                                helperText="Data do plantio/início (AAAA-MM-DD)"
                                            />

                                            <CustomInput
                                                type="select"
                                                label="Cultura"
                                                value={cultura.cultura}
                                                options={opcoesCulturas}
                                                onChange={(value) => atualizarCultura(cultura.id, 'cultura', value)}
                                                placeholder="Selecione a cultura"

                                            />

                                            <CustomInput
                                                type="text"
                                                label="Variedade"
                                                value={cultura.variedade}
                                                onChange={(value) => atualizarCultura(cultura.id, 'variedade', value)}
                                                placeholder="Nome da variedade"
                                            />

                                            <CustomInput
                                                type="number"
                                                label="Área Cultivada (ha)"
                                                value={cultura.areaCultivada}
                                                onChange={(value) => atualizarCultura(cultura.id, 'areaCultivada', value)}
                                                placeholder="0,0"
                                                min="0"
                                                step="0.1"

                                            />

                                            <CustomInput
                                                type="number"
                                                label="Produção"
                                                value={cultura.producao}
                                                onChange={(value) => atualizarCultura(cultura.id, 'producao', value)}
                                                placeholder="0"
                                                min="0"

                                            />

                                            <CustomInput
                                                type="select"
                                                label="Unidade de Medida"
                                                value={cultura.unidadeMedida}
                                                options={[
                                                    { value: 'sacos_50kg', label: 'Sacos 50kg' },
                                                    { value: 'sacos_25kg', label: 'Sacos 25kg' },
                                                    { value: 'toneladas', label: 'Toneladas' },
                                                    { value: 'quilos', label: 'Quilos' },
                                                    { value: 'litros', label: 'Litros' }
                                                ]}
                                                onChange={(value) => atualizarCultura(cultura.id, 'unidadeMedida', value)}
                                                placeholder="Selecione a unidade"
                                            />

                                            <CustomInput
                                                type="select"
                                                label="Modo de Produção"
                                                value={cultura.modoProducao}
                                                options={[
                                                    { value: 'manual', label: 'Manual' },
                                                    { value: 'mecanizada', label: 'Mecanizada' },
                                                    { value: 'tracao_animal', label: 'Tração Animal' },
                                                    { value: 'mista', label: 'Mista' }
                                                ]}
                                                onChange={(value) => atualizarCultura(cultura.id, 'modoProducao', value)}
                                                placeholder="Selecione o modo"
                                            />
                                        </div>

                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={cultura.usoFertilizantes}
                                                    onChange={(e) => atualizarCultura(cultura.id, 'usoFertilizantes', e.target.checked)}
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Uso de Fertilizantes</span>
                                            </label>

                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={cultura.sistemaIrrigacao}
                                                    onChange={(e) => atualizarCultura(cultura.id, 'sistemaIrrigacao', e.target.checked)}
                                                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Sistema de Irrigação</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Wheat size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="font-medium">Nenhuma cultura adicionada</p>
                                <p className="text-sm">Clique em "Adicionar Cultura" para começar</p>
                            </div>
                        )}
                    </div>
                );

            case 2: // Criação de Animais
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-xl p-4 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Beef className="w-5 h-5 text-orange-600" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">Criação de Animais</h4>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Registre os animais criados e a sua produtividade no período.
                            </p>
                        </div>

                        <div className="flex justify-between items-center">
                            <h5 className="text-md font-semibold text-gray-800">Animais Criados</h5>
                            <button
                                onClick={adicionarAnimal}
                                className="bg-orange-600 text-white px-3 py-2 rounded-lg hover:bg-orange-700 transition-colors flex items-center text-sm"
                            >
                                <Plus size={16} className="mr-1" />
                                Adicionar Animal
                            </button>
                        </div>

                        {criacaoAnimais.length > 0 ? (
                            <div className="space-y-4">
                                {criacaoAnimais.map((animal, index) => (
                                    <div key={animal.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h6 className="font-medium text-gray-800">Animal {index + 1}</h6>
                                            <button
                                                onClick={() => removerAnimal(animal.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                            <CustomInput
                                                type="date"
                                                label="Data"
                                                value={animal.ano}
                                                onChange={(value) => atualizarAnimal(animal.id, 'ano', value)}
                                                placeholder="Selecione a data"

                                                helperText="Data de início da criação (AAAA-MM-DD)"
                                            />

                                            <CustomInput
                                                type="select"
                                                label="Tipo de Animal"
                                                value={animal.tipoAnimal}
                                                options={opcoesAnimais}
                                                onChange={(value) => atualizarAnimal(animal.id, 'tipoAnimal', value)}
                                                placeholder="Selecione o tipo"

                                            />

                                            <CustomInput
                                                type="text"
                                                label="Raça/Variedade"
                                                value={animal.raca}
                                                onChange={(value) => atualizarAnimal(animal.id, 'raca', value)}
                                                placeholder="Nome da raça"
                                            />

                                            <CustomInput
                                                type="number"
                                                label="Número de Animais"
                                                value={animal.numeroAnimais}
                                                onChange={(value) => atualizarAnimal(animal.id, 'numeroAnimais', value)}
                                                placeholder="0"
                                                min="0"

                                            />

                                            <CustomInput
                                                type="select"
                                                label="Finalidade"
                                                value={animal.finalidade}
                                                options={[
                                                    { value: 'carne', label: 'Carne' },
                                                    { value: 'leite', label: 'Leite' },
                                                    { value: 'ovos', label: 'Ovos' },
                                                    { value: 'reproducao', label: 'Reprodução' },
                                                    { value: 'mista', label: 'Mista' }
                                                ]}
                                                onChange={(value) => atualizarAnimal(animal.id, 'finalidade', value)}
                                                placeholder="Selecione a finalidade"
                                            />

                                            <CustomInput
                                                type="select"
                                                label="Sistema de Produção"
                                                value={animal.sistemaProducao}
                                                options={[
                                                    { value: 'extensivo', label: 'Extensivo' },
                                                    { value: 'semi_intensivo', label: 'Semi-intensivo' },
                                                    { value: 'intensivo', label: 'Intensivo' },
                                                    { value: 'tradicional', label: 'Tradicional' }
                                                ]}
                                                onChange={(value) => atualizarAnimal(animal.id, 'sistemaProducao', value)}
                                                placeholder="Selecione o sistema"
                                            />

                                            <CustomInput
                                                type="text"
                                                label="Produtividade"
                                                value={animal.produtividade}
                                                onChange={(value) => atualizarAnimal(animal.id, 'produtividade', value)}
                                                placeholder="Ex: 500kg carne, 200L leite"
                                                helperText="Descreva a produção obtida"
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Beef size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="font-medium">Nenhum animal adicionado</p>
                                <p className="text-sm">Clique em "Adicionar Animal" para começar</p>
                            </div>
                        )}
                    </div>
                );

            case 3: // Finalização
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <CheckCircle className="w-5 h-5 text-blue-600" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">Informações Complementares</h4>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Complete com informações sobre comercialização e assistência técnica.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {/* Dados de Comercialização */}
                            <div>
                                <h5 className="text-md font-semibold text-gray-800 mb-3">Comercialização e Destino da Produção</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomInput
                                        type="text"
                                        label="Venda no Mercado Local (%)"
                                        value={formData.vendaMercadoLocal}
                                        onChange={(value) => updateFormData('vendaMercadoLocal', value)}
                                        placeholder="Ex: 40"
                                        iconStart={<Users className="w-4 h-4 text-gray-400" />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Venda no Mercado Regional (%)"
                                        value={formData.vendaMercadoRegional}
                                        onChange={(value) => updateFormData('vendaMercadoRegional', value)}
                                        placeholder="Ex: 30"
                                        iconStart={<Users className="w-4 h-4 text-gray-400" />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Autoconsumo (%)"
                                        value={formData.autoconsumo}
                                        onChange={(value) => updateFormData('autoconsumo', value)}
                                        placeholder="Ex: 25"
                                        iconStart={<Home className="w-4 h-4 text-gray-400" />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Perdas (%)"
                                        value={formData.perdas}
                                        onChange={(value) => updateFormData('perdas', value)}
                                        placeholder="Ex: 5"
                                        iconStart={<AlertCircle className="w-4 h-4 text-gray-400" />}
                                    />
                                </div>
                            </div>

                            {/* Assistência Técnica */}
                            <div>
                                <h5 className="text-md font-semibold text-gray-800 mb-3">Assistência Técnica Recebida</h5>
                                <div className="space-y-4">
                                    <CustomInput
                                        type="select"
                                        label="Recebeu Assistência Técnica?"
                                        value={formData.recebiuAssistencia}
                                        options={[
                                            { value: 'sim', label: 'Sim' },
                                            { value: 'nao', label: 'Não' }
                                        ]}
                                        onChange={(value) => updateFormData('recebiuAssistencia', value)}
                                        placeholder="Selecione uma opção"
                                        iconStart={<ClipboardCheck className="w-4 h-4 text-gray-400" />}
                                    />

                                    {formData.recebiuAssistencia === 'sim' && (
                                        <>
                                            <CustomInput
                                                type="multiselect"
                                                label="Tipos de Assistência Recebida"
                                                value={formData.tipoAssistencia}
                                                options={opcoesAssistencia}
                                                onChange={(value) => updateFormData('tipoAssistencia', value)}
                                            />

                                            <CustomInput
                                                type="text"
                                                label="Técnico Responsável"
                                                value={formData.tecnicoResponsavel}
                                                onChange={(value) => updateFormData('tecnicoResponsavel', value)}
                                                placeholder="Nome do técnico ou instituição"
                                                iconStart={<User className="w-4 h-4 text-gray-400" />}
                                            />
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Observações */}
                            <div>
                                <h5 className="text-md font-semibold text-gray-800 mb-3">Observações e Avaliação</h5>
                                <div className="space-y-4">
                                    <CustomInput
                                        type="textarea"
                                        label="Observações Técnicas"
                                        value={formData.observacoesTecnicas}
                                        onChange={(value) => updateFormData('observacoesTecnicas', value)}
                                        placeholder="Observações sobre o processo produtivo, condições climáticas, etc."
                                        rows={3}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Principais Desafios Enfrentados"
                                        value={formData.desafiosEnfrentados}
                                        onChange={(value) => updateFormData('desafiosEnfrentados', value)}
                                        placeholder="Descreva os principais desafios durante o período produtivo"
                                        rows={3}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Melhorias e Recomendações"
                                        value={formData.melhorias}
                                        onChange={(value) => updateFormData('melhorias', value)}
                                        placeholder="Sugestões de melhorias para os próximos ciclos produtivos"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="text-center text-gray-500">Etapa não encontrada</div>;
        }
    };

    // Função para adicionar novo registro - VERSÃO CORRIGIDA PARA A API
    // Função para adicionar novo registro - VERSÃO CORRIGIDA E SIMPLIFICADA
    const handleAddRecord = async () => {
        setLoading(true);
        try {
            // Converter para número e validar produtorId
            const produtorIdNum = parseInt(produtorId, 10);

            // Função helper para extrair valor de objeto select ou retornar string
            const extractValue = (field) => {
                if (!field) return '';
                if (typeof field === 'object' && field.value) return field.value;
                if (typeof field === 'string') return field;
                return '';
            };

            // Função helper para converter data
            const formatDate = (dateValue) => {
                if (!dateValue) return new Date().toISOString();

                // Se já é uma string de data ISO, retorna como está
                if (typeof dateValue === 'string' && dateValue.includes('T')) {
                    return dateValue;
                }

                // Se é uma data no formato YYYY-MM-DD
                if (typeof dateValue === 'string' && dateValue.length === 10) {
                    return `${dateValue}T00:00:00.000Z`;
                }

                // Tentar converter para Date
                try {
                    return new Date(dateValue).toISOString();
                } catch (error) {
                    console.warn('Erro ao converter data:', dateValue, error);
                    return new Date().toISOString();
                }
            };

            // Preparar dados EXATAMENTE como a API espera
            const dadosAPI = {
                command: "create", // CORRIGIDO: era "ommand"
                anoDeProducao: formatDate(formData.ano),
                safraOuEpocaAgricola: formData.safra || '',
                nomeDaPropriedadeOuCampo: formData.nomePropriedade || '',
                areaTotalUtilizada: formData.areaTotalUtilizada || '',
                coordenadasGPS: formData.coordenadasGPS || '',
                safraPorEpocaAgricola: formData.safra || '',
                atividadePrincipal: extractValue(formData.atividadePrincipal), // CORRIGIDO: extrair apenas o valor
                culturasProduzidas: culturasAgricolas.map(cultura => ({
                    ano: formatDate(cultura.ano),
                    cultura: extractValue(cultura.cultura),
                    variedade: cultura.variedade || '',
                    areaCultivada: cultura.areaCultivada || '',
                    producao: cultura.producao || '',
                    unidadeDeMedida: extractValue(cultura.unidadeMedida),
                    modoDeProducao: extractValue(cultura.modoProducao),
                    usoDeFertilizante: Boolean(cultura.usoFertilizantes),
                    sistemaDeIrrigacao: Boolean(cultura.sistemaIrrigacao)
                })),
                animaisCriados: criacaoAnimais.map(animal => ({
                    ano: formatDate(animal.ano),
                    tipoDeAnimal: extractValue(animal.tipoAnimal),
                    racaOuVariedade: animal.raca || '',
                    numeroDeAnimais: animal.numeroAnimais || '',
                    finalidade: extractValue(animal.finalidade),
                    sistemaDeProducao: extractValue(animal.sistemaProducao),
                    produtividade: animal.produtividade || ''
                })),
                vendaNoMercadoLocal: formData.vendaMercadoLocal || '',
                vendaNoMercadoRegional: formData.vendaMercadoRegional || '',
                autoConsumo: formData.autoconsumo || '',
                perdas: formData.perdas || '',
                recebeuAssistenciaTecnica: extractValue(formData.recebiuAssistencia),
                observacoesTecnicas: formData.observacoesTecnicas || '',
                principaisDesafiosEnfrentados: formData.desafiosEnfrentados || '',
                melhoriasERecomendacoes: formData.melhorias || '',
                produtorId: produtorIdNum
            };

            console.log('📤 Enviando dados para /historicoDeProducao:');
            console.log('🔍 Dados completos:', JSON.stringify(dadosAPI, null, 2));

            // Enviar para API
            const response = await api.post('/historicoDeProducao', dadosAPI, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            console.log('✅ Resposta da API:', response.data);

            // Criar novo registro local para exibição
            const areaTotal = culturasAgricolas.reduce((acc, c) => acc + (parseFloat(c.areaCultivada) || 0), 0);
            const producaoTotal = culturasAgricolas.reduce((acc, c) => acc + (parseFloat(c.producao) || 0), 0);
            const rendimentoMedio = areaTotal > 0 ? producaoTotal / areaTotal : 0;
            const animaisTotal = criacaoAnimais.reduce((acc, a) => acc + (parseFloat(a.numeroAnimais) || 0), 0);

            // Função para extrair ano de forma segura
            const extrairAno = (anoValue) => {
                if (!anoValue) return new Date().getFullYear().toString();
                if (typeof anoValue === 'string' && anoValue.includes('-')) {
                    return anoValue.split('-')[0];
                }
                if (typeof anoValue === 'string') return anoValue;
                return new Date().getFullYear().toString();
            };

            const novoRegistro = {
                id: historicoProducao.length > 0 ? Math.max(...historicoProducao.map(h => h.id)) + 1 : 1,
                ano: extrairAno(formData.ano),
                safra: formData.safra || `${new Date().getFullYear()}/${new Date().getFullYear() + 1}`,
                cultura: culturasAgricolas.length > 0 ?
                    (culturasAgricolas.length === 1 ? extractValue(culturasAgricolas[0].cultura) : 'Múltiplas Culturas') :
                    (criacaoAnimais.length > 0 ? extractValue(criacaoAnimais[0].tipoAnimal) : 'Sem especificação'),
                tipo: culturasAgricolas.length > 0 && criacaoAnimais.length > 0 ? 'agropecuaria' :
                    culturasAgricolas.length > 0 ? 'agricultura' : 'pecuaria',
                area: Math.max(parseFloat(formData.areaTotalUtilizada) || 0, areaTotal),
                producao: Math.max(producaoTotal, animaisTotal),
                unidade: culturasAgricolas.length > 0 ? 'misto' : 'cabeças',
                rendimento: rendimentoMedio,
                vendido: Math.floor(Math.max(producaoTotal, animaisTotal) * 0.6),
                consumido: Math.floor(Math.max(producaoTotal, animaisTotal) * 0.3),
                status: 'Concluída'
            };

            setHistoricoProducao(prev => [novoRegistro, ...prev]);

            // Limpar formulário
            setFormData({
                ano: '', safra: '', nomePropriedade: '', areaTotalUtilizada: '',
                coordenadasGPS: '', atividadePrincipal: '', culturasAgricolas: [],
                criacaoAnimais: [], vendaMercadoLocal: '', vendaMercadoRegional: '',
                autoconsumo: '', perdas: '', recebiuAssistencia: '', tipoAssistencia: [],
                tecnicoResponsavel: '', observacoesTecnicas: '', desafiosEnfrentados: '',
                melhorias: ''
            });
            setCulturasAgricolas([]);
            setCriacaoAnimais([]);
            setActiveStepInModal(0);
            setShowAddForm(false);

            showToast('success', 'Histórico de produção salvo com sucesso!');

        } catch (error) {
            console.error('❌ Erro ao salvar histórico:', error);

            let errorMessage = 'Erro ao salvar histórico de produção';

            if (error.response?.status === 400) {
                const errorData = error.response?.data;
                console.error('📋 Dados que causaram erro 400:', errorData);

                if (errorData?.errors) {
                    console.error('🔍 Detalhes dos erros de validação:', JSON.stringify(errorData.errors, null, 2));

                    // Extrair mensagens de erro mais legíveis
                    const errorMessages = [];
                    Object.keys(errorData.errors).forEach(field => {
                        const fieldErrors = errorData.errors[field];
                        if (Array.isArray(fieldErrors)) {
                            fieldErrors.forEach(err => {
                                errorMessages.push(`${field}: ${err}`);
                            });
                        } else {
                            errorMessages.push(`${field}: ${fieldErrors}`);
                        }
                    });

                    errorMessage = `Erro de validação: ${errorMessages.join(', ')}`;
                } else {
                    errorMessage = errorData?.title || errorData?.message || 'Dados inválidos';
                }
            } else if (error.response?.status === 404) {
                errorMessage = 'Endpoint não encontrado. Verifique se a API está funcionando.';
            } else if (error.response?.status === 500) {
                errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
            } else {
                errorMessage = error.response?.data?.message || error.message || 'Erro desconhecido';
            }

            showToast('error', errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleGerarPDFCompleto = async () => {
        setGerandoPDF(true);
        try {
            await gerarFichaCompletaPDF(produtorId);
            showToast('success', 'Ficha completa com histórico de produção gerada com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF completo:', error);
            showToast('error', `Erro ao gerar PDF: ${error.message}`);
        } finally {
            setGerandoPDF(false);
        }
    };

    // Função para cancelar formulário
    const handleCancelForm = () => {
        setFormData({
            ano: '', safra: '', nomePropriedade: '', areaTotalUtilizada: '',
            coordenadasGPS: '', atividadePrincipal: '', culturasAgricolas: [],
            criacaoAnimais: [], vendaMercadoLocal: '', vendaMercadoRegional: '',
            autoconsumo: '', perdas: '', recebiuAssistencia: '', tipoAssistencia: [],
            tecnicoResponsavel: '', observacoesTecnicas: '', desafiosEnfrentados: '',
            melhorias: ''
        });
        setCulturasAgricolas([]);
        setCriacaoAnimais([]);
        setActiveStepInModal(0);
        setShowAddForm(false);
        showToast('info', 'Formulário cancelado');
    };

    // Funções para gerenciar tabelas dinâmicas
    const adicionarCultura = () => {
        const novaCultura = {
            id: Date.now(),
            ano: new Date().toISOString().split('T')[0], // Data atual no formato YYYY-MM-DD
            cultura: '',
            variedade: '',
            areaCultivada: '',
            producao: '',
            unidadeMedida: 'sacos_50kg',
            modoDeProducao: '',
            usoFertilizantes: false,
            sistemaIrrigacao: false
        };
        setCulturasAgricolas([novaCultura, ...culturasAgricolas]);
    };

    const removerCultura = (id) => {
        setCulturasAgricolas(culturasAgricolas.filter(item => item.id !== id));
    };

    const atualizarCultura = (id, campo, valor) => {
        setCulturasAgricolas(culturasAgricolas.map(item =>
            item.id === id ? { ...item, [campo]: valor } : item
        ));
    };

    // Funções para gerenciar tabelas dinâmicas de animais
    const adicionarAnimal = () => {
        const novoAnimal = {
            id: Date.now(),
            ano: new Date().toISOString().split('T')[0],
            tipoAnimal: '',
            raca: '',
            numeroAnimais: '',
            finalidade: '',
            sistemaProducao: '',
            produtividade: ''
        };
        setCriacaoAnimais([novoAnimal, ...criacaoAnimais]);
    };

    const removerAnimal = (id) => {
        setCriacaoAnimais(criacaoAnimais.filter(item => item.id !== id));
    };

    const atualizarAnimal = (id, campo, valor) => {
        setCriacaoAnimais(criacaoAnimais.map(item =>
            item.id === id ? { ...item, [campo]: valor } : item
        ));
    };

    // Filtrar dados e ordenar (mais recente primeiro)
    const dadosFiltrados = historicoProducao
        .filter(item => {
            const matchAno = filtroAno.value === 'todos' || item.ano === filtroAno.value;
            const matchTipo = filtroTipo.value === 'todos' || item.tipo === filtroTipo.value;
            const matchSearch = item.cultura.toLowerCase().includes(searchTerm.toLowerCase()) ||
                item.safra.toLowerCase().includes(searchTerm.toLowerCase());
            return matchAno && matchTipo && matchSearch;
        })
        .sort((a, b) => {
            // Ordenar por ano (mais recente primeiro), depois por ID (mais recente primeiro)
            if (a.ano !== b.ano) {
                return b.ano.localeCompare(a.ano);
            }
            return b.id - a.id;
        });

    // Calcular estatísticas
    const estatisticas = {
        totalProducoes: dadosFiltrados.length,
        areaTotal: dadosFiltrados.reduce((acc, item) => acc + item.area, 0),
        producaoTotal: dadosFiltrados.reduce((acc, item) => acc + item.producao, 0),
        rendimentoMedio: dadosFiltrados.length > 0 ?
            dadosFiltrados.reduce((acc, item) => acc + item.rendimento, 0) / dadosFiltrados.length : 0
    };



    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Message */}
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
                {/* Header */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col md:flex-row justify-between  items-start md:items-center gap-4">
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
                                        Produtor: {produtor.nome} | Código : {produtor.codigoRNPA}
                                    </p>

                                </div>
                            </div>

                            <div className="flex-1 flex items-start gap-2 col-span-6 justify-end">
                                {/* Adicionar Registro */}
                                <div className="relative group">
                                    <button
                                        onClick={() => navigate(`/GerenciaRNPA/produtores/historico-producao/${produtorId}/novo`)}
                                        className="flex items-center text-sm px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        style={{ minWidth: 0 }}
                                        aria-label="Adicionar Registro"
                                    >
                                        <Plus className="w-4 h-4 mr-2" />
                                        <span className="sr-only">Adicionar Registro</span>
                                        Adicionar Registro
                                    </button>
                                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-green-100 text-green-700 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                        Adicionar Registro
                                    </span>

                                </div>

                                {/* Imprimir Ficha Completa */}
                                <div className="relative group">
                                    <button
                                        onClick={handleGerarPDFCompleto}
                                        disabled={gerandoPDF}
                                        className={`flex items-center px-4 py-3 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors ${gerandoPDF ? 'opacity-50 cursor-not-allowed' : ''}`}
                                        style={{ minWidth: 0 }}
                                        aria-label={gerandoPDF ? 'A gerar PDF...' : 'Imprimir Ficha Completa'}
                                    >
                                        <Download className="w-4 h-4 mr-2" />
                                        <span className="sr-only">{gerandoPDF ? 'A gerar PDF...' : 'Imprimir Ficha Completa'}</span>
                                        Imprimir Ficha Completa
                                    </button>
                                    <span className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 px-3 py-1 bg-white text-gray-700 text-xs rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                                        {gerandoPDF ? 'A gerar PDF...' : 'Imprimir Ficha Completa'}
                                    </span>
                                </div>


                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de Adição de Registro */}
                {showAddForm && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full h-[95vh] flex flex-col">
                            {/* Header do Modal - Fixo */}
                            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-6 border-b border-gray-200 flex-shrink-0">
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                                        <Plus className="w-6 h-6 mr-2 text-green-600" />
                                        Novo Registo de Produção
                                    </h2>
                                    <button
                                        onClick={handleCancelForm}
                                        className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    >
                                        <X className="w-6 h-6 text-gray-600" />
                                    </button>
                                </div>

                                {/* Step Navigation */}
                                <div className="flex justify-between items-center overflow-x-auto">
                                    {modalSteps.map((step, index) => {
                                        const StepIcon = step.icon;
                                        return (
                                            <div
                                                key={index}
                                                className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeStepInModal ? 'opacity-50' : ''
                                                    }`}
                                                onClick={() => index <= activeStepInModal && setActiveStepInModal(index)}
                                            >
                                                <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${index < activeStepInModal ? 'bg-green-500 text-white' :
                                                    index === activeStepInModal ? 'bg-green-600 text-white' :
                                                        'bg-gray-200 text-gray-500'
                                                    }`}>
                                                    {index < activeStepInModal ? (
                                                        <Check size={20} />
                                                    ) : (
                                                        <StepIcon size={20} />
                                                    )}
                                                </div>
                                                <span className={`text-sm text-center font-medium ${index === activeStepInModal ? 'text-green-700' : 'text-gray-500'
                                                    }`}>
                                                    {step.label}
                                                </span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Progress Bar */}
                                <div className="w-full bg-gray-200 h-2 mt-4 rounded-full">
                                    <div
                                        className="bg-green-600 h-2 transition-all duration-300 rounded-full"
                                        style={{ width: `${((activeStepInModal + 1) / modalSteps.length) * 100}%` }}
                                    ></div>
                                </div>
                            </div>

                            {/* Content do Modal - Scrollável */}
                            <div className="flex-1 overflow-y-auto p-6">
                                {renderModalStepContent(activeStepInModal)}
                            </div>

                            {/* Footer do Modal - Fixo */}
                            <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                                <button
                                    className={`px-6 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeStepInModal === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                                        'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                                        }`}
                                    onClick={() => setActiveStepInModal(prev => Math.max(prev - 1, 0))}
                                    disabled={activeStepInModal === 0}
                                >
                                    <ChevronLeft size={20} className="mr-2" />
                                    Anterior
                                </button>

                                <div className="text-sm text-gray-500 font-medium">
                                    Etapa {activeStepInModal + 1} de {modalSteps.length}
                                </div>

                                <button
                                    className={`px-6 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                                        ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                        : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                                        }`}
                                    disabled={loading}
                                    onClick={() => {
                                        if (!isLastStep) {
                                            setActiveStepInModal(prev => prev + 1);
                                        } else {
                                            handleAddRecord();
                                        }
                                    }}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                                            Salvando...
                                        </>
                                    ) : isLastStep ? (
                                        <>
                                            <Save size={20} className="mr-2" />
                                            Guardar Registo
                                        </>
                                    ) : (
                                        <>
                                            <span className="mr-2">Próximo</span>
                                            <ChevronRight size={20} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Cartões de Estatísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total </p>
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

                {/* Filtros e Busca */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Filter className="w-4 h-4 mr-2 text-green-600" />
                            Filtros e Pesquisa
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {/* Campo de Busca */}
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

                            {/* Filtro por Ano */}
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

                            {/* Filtro por Tipo */}
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

                {/* Tabela de Histórico */}
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
                                                Cultura/Criação
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
                                                            : 'bg-purple-100 text-purple-800'
                                                        }`}>
                                                        {item.tipo === 'agricultura'
                                                            ? 'Agricultura'
                                                            : item.tipo === 'pecuaria'
                                                                ? 'Pecuária'
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

export default HistoricoProducao;