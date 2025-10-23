import {
    AlertCircle,
    Calendar,
    Check,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    ClipboardCheck,
    FileText,
    Home,
    MapPin,
    MoveLeft,
    Plus,
    Save,
    Target,
    Tractor,
    Trees,
    User,
    Users,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../../../core/components/CustomInput';
import api from '../../../../../core/services/api';


const AddHistoricoProducaoFlorestal = () => {
    const { id: produtorId } = useParams();
    const navigate = useNavigate();
    const [activeStepInModal, setActiveStepInModal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [formData, setFormData] = useState({
        vendaNoMercadoLocal: '',
        periodoInicio: '',
        periodoFim: '',
        safra: '',
        nomePropriedade: '',
        areaTotalUtilizada: '',
        coordenadasGPS: '',
        atividadePrincipal: '',
        produtosFlorestais: [],
        criacaoAnimais: [],
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
    const [produtosFlorestais, setProdutosFlorestais] = useState([]);
    const [criacaoAnimais, setCriacaoAnimais] = useState([]);

    // Opções
    const opcoesAtividades = [
        { value: 'produtos_florestais', label: 'Produtos Florestais' },
        { value: 'silvicultura', label: 'Silvicultura' },
        { value: 'extrativismo', label: 'Extrativismo Florestal' },
        { value: 'pecuaria', label: 'Pecuária' },
        { value: 'aquicultura', label: 'Aquicultura' }
    ];

    const opcoesProdutosFlorestais = [
        { value: 'madeira_construcao', label: 'Madeira para Construção' },
        { value: 'madeira_serraria', label: 'Madeira para Serraria' },
        { value: 'lenha', label: 'Lenha' },
        { value: 'carvao', label: 'Carvão Vegetal' },
        { value: 'bambu', label: 'Bambú' },
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

    const racasPorTipo = {
        bovinocultura: [
            { value: 'Nelore', label: 'Nelore' },
            { value: 'Angus', label: 'Angus' },
            { value: 'Gir', label: 'Gir' },
            { value: 'Girolando', label: 'Girolando' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ],
        caprinocultura: [
            { value: 'Anglo-Nubiana', label: 'Anglo-Nubiana' },
            { value: 'Saanen', label: 'Saanen' },
            { value: 'Boer', label: 'Boer' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ],
        ovinocultura: [
            { value: 'Dorper', label: 'Dorper' },
            { value: 'Suffolk', label: 'Suffolk' },
            { value: 'Santa Ines', label: 'Santa Inês' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ],
        suinocultura: [
            { value: 'Landrace', label: 'Landrace' },
            { value: 'Large White', label: 'Large White' },
            { value: 'Duroc', label: 'Duroc' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ],
        avicultura: [
            { value: 'Caipira', label: 'Caipira' },
            { value: 'Cobb', label: 'Cobb' },
            { value: 'Ross', label: 'Ross' },
            { value: 'Indio Gigante', label: 'Índio Gigante' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ],
        piscicultura: [
            { value: 'Tilapia', label: 'Tilápia' },
            { value: 'Tambaqui', label: 'Tambaqui' },
            { value: 'Pintado', label: 'Pintado' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ],
        aquicultura: [
            { value: 'Camarao Vannamei', label: 'Camarão Vannamei' },
            { value: 'Carpa', label: 'Carpa' },
            { value: 'Lambari', label: 'Lambari' },
            { value: 'outra_raca', label: 'Outra raça (digite)' }
        ]
    };

    const opcoesAssistencia = [
        { value: 'mudas_florestais', label: 'Mudas florestais' },
        { value: 'equipamentos_florestais', label: 'Equipamentos florestais (motosserras, etc.)' },
        { value: 'manejo_florestal', label: 'Capacitação em manejo florestal' },
        { value: 'treinamento_tecnico', label: 'Treinamento técnico' },
        { value: 'credito_agricola', label: 'Crédito agrícola' },
        { value: 'comercializacao', label: 'Apoio à comercialização' }
    ];

    // Steps do modal
    const modalSteps = [
        { label: 'Dados Básicos', icon: FileText },
        { label: 'Produtos Florestais', icon: Trees },

        { label: 'Finalização', icon: CheckCircle }
    ];
    const isLastStep = activeStepInModal === modalSteps.length - 1;

    // Funções auxiliares
    const adicionarProdutoFlorestal = () => {
        const novoProduto = {
            id: Date.now(),
            data: new Date().toISOString().split('T')[0],
            tipoProduto: '',
            especieFlorestal: '',
            areaExploracao: '',
            volumeProducao: '',
            unidadeMedida: 'm3',
            tipoManejo: '',
            idadePlantacao: '',
            numeroArvores: '',
            certificacaoFlorestal: false,
            licencaAmbiental: false
        };
        setProdutosFlorestais([novoProduto, ...produtosFlorestais]);
    };

    const removerProdutoFlorestal = (id) => {
        setProdutosFlorestais(produtosFlorestais.filter(item => item.id !== id));
    };

    const atualizarProdutoFlorestal = (id, campo, valor) => {
        setProdutosFlorestais(produtosFlorestais.map(item =>
            item.id === id ? { ...item, [campo]: valor } : item
        ));
    };

    const adicionarAnimal = () => {
        const novoAnimal = {
            id: Date.now(),
            ano: new Date().toISOString().split('T')[0],
            tipoAnimal: '',
            raca: [],
            racaCustom: '',
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

    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const updateFormData = (field, value) => {
        const camposPercentuais = ['vendaMercadoLocal', 'vendaMercadoRegional', 'autoconsumo', 'perdas'];
        if (camposPercentuais.includes(field)) {
            let numValue = parseFloat(value);
            if (isNaN(numValue)) numValue = '';
            if (numValue > 100) {
                numValue = 100;
                showToast('info', 'O valor máximo permitido é 100%. O campo foi ajustado automaticamente.');
            }
            setFormData(prev => ({ ...prev, [field]: numValue }));
            return;
        }
        setFormData(prev => ({ ...prev, [field]: value }));
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

    const handleCancelForm = () => {
        navigate(`/GerenciaRNPA/gestao-florestal/produtores/historico-producao/${produtorId}`);
    };

    const handleAddRecord = async () => {
        setLoading(true);
        try {
            const produtorIdNum = parseInt(produtorId, 10);

            const extractValue = (field) => {
                if (!field) return '';
                if (typeof field === 'object' && field.value) return field.value;
                if (typeof field === 'string') return field;
                return '';
            };

            const formatDate = (dateValue) => {
                if (!dateValue) return new Date().toISOString().split('T')[0];
                if (typeof dateValue === 'string' && dateValue.includes('T')) {
                    return dateValue.split('T')[0];
                }
                if (typeof dateValue === 'string' && dateValue.length === 10) {
                    return dateValue;
                }
                try {
                    return new Date(dateValue).toISOString().split('T')[0];
                } catch {
                    return new Date().toISOString().split('T')[0];
                }
            };

            const dadosAPI = {
                anoDeInicioDeProducao: formData.periodoInicio || new Date().toISOString().split('T')[0],
                anoDeFimDeProducao: formData.periodoFim || new Date().toISOString().split('T')[0],
                safraOuEpocaAgricola: formData.safra || '',
                nomeDaPropriedadeOuCampo: formData.nomePropriedade || '',
                areaTotalUtilizada: formData.areaTotalUtilizada || '',
                coordenadasGPS: formData.coordenadasGPS || '',
                safraPorEpocaAgricola: formData.safra || '',
                atividadePrincipal: extractValue(formData.atividadePrincipal),
                produtosFlorestaisProduzidos: produtosFlorestais.map(produto => ({
                    dataDeExtracao: formatDate(produto.data),
                    tipoDeProduto: extractValue(produto.tipoProduto),
                    especieFlorestal: extractValue(produto.especieFlorestal),
                    areaDeExploracao: parseFloat(produto.areaExploracao) || 0,
                    volumePorQuantidadeDeProducao: parseFloat(produto.volumeProducao) || 0,
                    unidadeDeMedida: extractValue(produto.unidadeMedida) || 'm3',
                    tipoDeManejo: extractValue(produto.tipoManejo),
                    idadeDaPlantacao: parseInt(produto.idadePlantacao) || 0,
                    numeroDeArvores: parseInt(produto.numeroArvores) || 0,
                    possuiCertificacaoFlorestal: Boolean(produto.certificacaoFlorestal),
                    possuiLicencaAmbiental: Boolean(produto.licencaAmbiental)
                })),
                vendaNoMercadoLocal: parseFloat(formData.vendaMercadoLocal) || 0,
                vendaNoMercadoRegional: parseFloat(formData.vendaMercadoRegional) || 0,
                autoConsumo: parseFloat(formData.autoconsumo) || 0,
                perdas: parseFloat(formData.perdas) || 0,
                recebeuAssistenciaTecnica: extractValue(formData.recebiuAssistencia) || '',
                observacoesTecnicas: formData.observacoesTecnicas || '',
                principaisDesafiosEnfrentados: formData.desafiosEnfrentados || '',
                melhoriasERecomendacoes: formData.melhorias || '',
                produtorFlorestalId: produtorIdNum
            };

            await api.post('/historicoDeProducaoFlorestal', dadosAPI, {
                headers: { 'Content-Type': 'application/json' }
            });

            showToast('success', 'Histórico de produção salvo com sucesso!');
        } catch (error) {
            let errorMessage = 'Erro ao salvar histórico de produção';
            if (error.response?.status === 400) {
                const errorData = error.response?.data;
                if (errorData?.errors) {
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
                                Preencha as informações básicas sobre a produção florestal/pecuária.
                            </p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <CustomInput
                                type="date"
                                label="Início"
                                value={formData.periodoInicio}
                                onChange={(value) => updateFormData('periodoInicio', value)}
                                placeholder="Selecione o mês/ano de início"
                                iconStart={<Calendar className="w-4 h-4 text-gray-400" />}
                                helperText="Selecione o mês e ano de início da produção"
                            />
                            <CustomInput
                                type="date"
                                label="Fim"
                                value={formData.periodoFim}
                                onChange={(value) => updateFormData('periodoFim', value)}
                                placeholder="Selecione o mês/ano de fim"
                                iconStart={<Calendar className="w-4 h-4 text-gray-400" />}
                                helperText="Selecione o mês e ano de fim da produção"
                            />
                            <CustomInput
                                type="text"
                                label="Safra/Época"
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
                                label="Actividade Principal"
                                value={formData.atividadePrincipal}
                                options={opcoesAtividades}
                                onChange={(value) => updateFormData('atividadePrincipal', value)}
                                placeholder="Selecione a actividade"
                                iconStart={<Tractor className="w-4 h-4 text-gray-400" />}
                            />
                        </div>
                    </div>
                );
            case 1: // Produtos Florestais
                return (
                    <div className="space-y-6">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 border border-emerald-100">
                            <div className="flex items-center space-x-3 mb-2">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Trees className="w-5 h-5 text-emerald-600" />
                                </div>
                                <h4 className="text-lg font-bold text-gray-800">Produtos Florestais</h4>
                            </div>
                            <p className="text-gray-600 text-sm">
                                Registe os produtos florestais extraídos ou produzidos no período.
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h5 className="text-md font-semibold text-gray-800">Produtos Florestais Extraídos/Produzidos</h5>
                            <button
                                onClick={adicionarProdutoFlorestal}
                                className="bg-emerald-600 text-white px-3 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center text-sm"
                            >
                                <Plus size={16} className="mr-1" />
                                Adicionar Produto
                            </button>
                        </div>
                        {produtosFlorestais.length > 0 ? (
                            <div className="space-y-4">
                                {produtosFlorestais.map((produto, index) => (
                                    <div key={produto.id} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <div className="flex justify-between items-center mb-3">
                                            <h6 className="font-medium text-gray-800">Produto Florestal {index + 1}</h6>
                                            <button
                                                onClick={() => removerProdutoFlorestal(produto.id)}
                                                className="text-red-600 hover:text-red-800 transition-colors"
                                            >
                                                <X size={18} />
                                            </button>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                            <CustomInput
                                                type="date"
                                                label="Data de Extração/Colheita"
                                                value={produto.data}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'data', value)}
                                                placeholder="Selecione a data"
                                                helperText="Data da extração/colheita (AAAA-MM-DD)"
                                            />
                                            <CustomInput
                                                type="select"
                                                label="Tipo de Produto"
                                                value={produto.tipoProduto}
                                                options={opcoesProdutosFlorestais}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'tipoProduto', value)}
                                                placeholder="Selecione o produto"
                                            />
                                            <CustomInput
                                                type="select"
                                                label="Espécie Florestal"
                                                value={produto.especieFlorestal}
                                                options={opcoesEspeciesFlorestal}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'especieFlorestal', value)}
                                                placeholder="Selecione a espécie"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Área de Exploração (ha)"
                                                value={produto.areaExploracao}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'areaExploracao', value)}
                                                placeholder="0,0"
                                                min="0"
                                                step="0.1"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Volume/Quantidade de Produção"
                                                value={produto.volumeProducao}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'volumeProducao', value)}
                                                placeholder="0"
                                                min="0"
                                                step="0.1"
                                            />
                                            <CustomInput
                                                type="select"
                                                label="Unidade de Medida"
                                                value={produto.unidadeMedida}
                                                options={[
                                                    { value: 'm3', label: 'Metros Cúbicos (m³)' },
                                                    { value: 'toneladas', label: 'Toneladas' },
                                                    { value: 'kg', label: 'Quilogramas (kg)' },
                                                    { value: 'litros', label: 'Litros' },
                                                    { value: 'unidades', label: 'Unidades' },
                                                    { value: 'sacos', label: 'Sacos' }
                                                ]}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'unidadeMedida', value)}
                                                placeholder="Selecione a unidade"
                                            />
                                            <CustomInput
                                                type="select"
                                                label="Tipo de Manejo"
                                                value={produto.tipoManejo}
                                                options={[
                                                    { value: 'plantacao', label: 'Plantação/Reflorestamento' },
                                                    { value: 'extrativismo', label: 'Extrativismo Sustentável' },
                                                    { value: 'agroflorestal', label: 'Sistema Agroflorestal' },
                                                    { value: 'nativo', label: 'Floresta Nativa' }
                                                ]}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'tipoManejo', value)}
                                                placeholder="Selecione o manejo"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Idade da Plantação (anos)"
                                                value={produto.idadePlantacao}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'idadePlantacao', value)}
                                                placeholder="0"
                                                min="0"
                                                helperText="Apenas para plantações"
                                            />
                                            <CustomInput
                                                type="text"
                                                label="Número de Árvores"
                                                value={produto.numeroArvores}
                                                onChange={(value) => atualizarProdutoFlorestal(produto.id, 'numeroArvores', value)}
                                                placeholder="Quantidade estimada"
                                            />
                                        </div>
                                        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={produto.certificacaoFlorestal}
                                                    onChange={(e) => atualizarProdutoFlorestal(produto.id, 'certificacaoFlorestal', e.target.checked)}
                                                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Possui Certificação Florestal</span>
                                            </label>
                                            <label className="flex items-center space-x-3">
                                                <input
                                                    type="checkbox"
                                                    checked={produto.licencaAmbiental}
                                                    onChange={(e) => atualizarProdutoFlorestal(produto.id, 'licencaAmbiental', e.target.checked)}
                                                    className="w-4 h-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500"
                                                />
                                                <span className="text-sm font-medium text-gray-700">Possui Licença Ambiental</span>
                                            </label>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-gray-500 border-2 border-dashed border-gray-300 rounded-lg">
                                <Trees size={32} className="mx-auto mb-2 text-gray-300" />
                                <p className="font-medium">Nenhum produto florestal adicionado</p>
                                <p className="text-sm">Clique em "Adicionar Produto" para começar</p>
                            </div>
                        )}
                    </div>
                );

            case 2: // Finalização
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
                            <div>
                                <h5 className="text-md font-semibold text-gray-800 mb-3">Comercialização e Destino da Produção</h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomInput
                                        type="number"
                                        label="Venda no Mercado Local (%)"
                                        value={formData.vendaMercadoLocal}
                                        onChange={(value) => updateFormData('vendaMercadoLocal', value)}
                                        placeholder="Ex: 40"
                                        iconStart={<Users className="w-4 h-4 text-gray-400" />}
                                    />
                                    <CustomInput
                                        type="number"
                                        label="Venda no Mercado Regional (%)"
                                        value={formData.vendaMercadoRegional}
                                        onChange={(value) => updateFormData('vendaMercadoRegional', value)}
                                        placeholder="Ex: 30"
                                        max="100"
                                        min="0"
                                        step="0.1"
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
                                        placeholder="Seleccione uma opção"
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

    return (
        <div className="min-h-screen bg-gray-50">
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' : toastMessage.type === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' : 'bg-blue-100 border-l-4 border-blue-500 text-blue-700'}`}>
                    <div className="flex items-center">
                        {toastMessage.type === 'success' && <CheckCircle className="w-5 h-5 mr-2" />}
                        {toastMessage.type === 'error' && <AlertCircle className="w-5 h-5 mr-2" />}
                        <p>{toastMessage.message}</p>
                        <button onClick={() => setToastMessage(null)} className="ml-4 text-gray-500 hover:text-gray-700"><X className="w-4 h-4" /></button>
                    </div>
                </div>
            )}
            <div className="container mx-auto">
                <div className="bg-white rounded-lg rounded-4 w-full mx-auto flex flex-col">
                    <div className="bg-gradient-to-r rounded-t-2xl from-green-50 to-blue-50 p-6 border-b border-gray-200 flex-shrink-0">
                        <div className="flex justify-between items-center mb-4 w-full">
                            <button onClick={handleCancelForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <MoveLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <h2 className="text-4xl font-bold mb-3 text-gray-800 flex items-center justify-center w-full">
                                Novo Registo de Produção Florestal
                            </h2>
                        </div>
                    </div>
                    <div className="flex-1 overflow-y-auto p-6 px-8 mb-8">
                        <div className="flex justify-between items-center overflow-x-auto">
                            {modalSteps.map((step, index) => {
                                const StepIcon = step.icon;
                                return (
                                    <div key={index} className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeStepInModal ? 'opacity-50' : ''}`} onClick={() => index <= activeStepInModal && setActiveStepInModal(index)}>
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${index < activeStepInModal ? 'bg-green-500 text-white' : index === activeStepInModal ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                            {index < activeStepInModal ? (<Check size={20} />) : (<StepIcon size={20} />)}
                                        </div>
                                        <span className={`text-sm text-center font-medium ${index === activeStepInModal ? 'text-green-700' : 'text-gray-500'}`}>{step.label}</span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full bg-gray-200 h-2 mb-10 rounded-full">
                            <div className="bg-green-600 h-2 transition-all duration-300 rounded-full" style={{ width: `${((activeStepInModal + 1) / modalSteps.length) * 100}%` }}></div>
                        </div>
                        {renderModalStepContent(activeStepInModal)}
                    </div>
                    <div className="flex justify-between items-center p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
                        <button className={`px-6 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeStepInModal === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'}`} onClick={() => setActiveStepInModal(prev => Math.max(prev - 1, 0))} disabled={activeStepInModal === 0}>
                            <ChevronLeft size={20} className="mr-2" />
                            Anterior
                        </button>
                        <div className="text-sm text-gray-500 font-medium">Etapa {activeStepInModal + 1} de {modalSteps.length}</div>
                        <button className={`px-6 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'}`} disabled={loading} onClick={() => { if (!isLastStep) { setActiveStepInModal(prev => prev + 1); } else { handleAddRecord(); } }}>
                            {loading ? (<><div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>Salvando...</>) : isLastStep ? (<><Save size={20} className="mr-2" />Guardar Registo</>) : (<><span className="mr-2">Próximo</span><ChevronRight size={20} /></>)}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddHistoricoProducaoFlorestal;