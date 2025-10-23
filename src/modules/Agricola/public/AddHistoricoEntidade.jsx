import {
    AlertCircle,
    Beef,
    Calendar,
    Check,
    CheckCircle,
    ChevronLeft, ChevronRight,
    ClipboardCheck,
    FileText,
    Home,
    MapPin,
    MoveLeft,
    Plus,
    Save,
    Target,
    Tractor,
    User,
    Users,
    Wheat,
    X
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import CustomInput from '../../../core/components/CustomInput';
import api from '../../../core/services/api';


const AddHistoricoEntidade = () => {
    const { id: produtorId } = useParams();
    const navigate = useNavigate();
    const [activeStepInModal, setActiveStepInModal] = useState(0);
    const [loading, setLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState(null);
    const [formData, setFormData] = useState({
        vendaNoMercadoLocal: '', periodoInicio: '', periodoFim: '', safra: '', nomePropriedade: '', areaTotalUtilizada: '', coordenadasGPS: '', atividadePrincipal: '', culturasAgricolas: [], criacaoAnimais: [], vendaMercadoLocal: '', vendaMercadoRegional: '', autoconsumo: '', perdas: '', recebiuAssistencia: '', tipoAssistencia: [], tecnicoResponsavel: '', observacoesTecnicas: '', desafiosEnfrentados: '', melhorias: ''
    });
    const [culturasAgricolas, setCulturasAgricolas] = useState([]);
    const [criacaoAnimais, setCriacaoAnimais] = useState([]);

    // Opções (copiar do HistoricoProducao.jsx)
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
    // Sugestões de raças por tipo de animal
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
        { value: 'insumos_agricolas', label: 'Fornecimento de insumos agrícolas' },
        { value: 'sementes_melhoradas', label: 'Sementes melhoradas' },
        { value: 'treinamento_tecnico', label: 'Treinamento técnico' },
        { value: 'credito_agricola', label: 'Crédito agrícola' },
        { value: 'equipamentos', label: 'Equipamentos agrícolas' },
        { value: 'irrigacao', label: 'Sistemas de irrigação' },
        { value: 'comercializacao', label: 'Apoio à comercialização' }
    ];

    // Steps do modal
    const modalSteps = [
        { label: 'Dados Básicos', icon: FileText },
        { label: 'Produção Agrícola', icon: Wheat },
        { label: 'Criação de Animais', icon: Beef },
        { label: 'Finalização', icon: CheckCircle }
    ];
    const isLastStep = activeStepInModal === modalSteps.length - 1;

    // Funções auxiliares (copiar do HistoricoProducao.jsx)
    const adicionarCultura = () => {
        const novaCultura = {
            id: Date.now(),
            ano: new Date().toISOString().split('T')[0],
            cultura: '',
            variedade: '',
            areaCultivada: '',
            producao: '',
            unidadesDeMedida: [],
            quantidades: [],
            modoProducao: '',
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
    const adicionarAnimal = () => {
        const novoAnimal = {
            id: Date.now(),
            ano: new Date().toISOString().split('T')[0],
            tipoAnimal: '',
            raca: [],
            racaCustom: '', // Campo para armazenar raças digitadas manualmente
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

        // Limitar campos percentuais a 100%
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
        navigate(`/GerenciaRNPA/gestao-agricultores/produtores/historico-producao/${produtorId}`);
    };
    // Função de envio (copiar e adaptar handleAddRecord do HistoricoProducao.jsx)
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
                if (!dateValue) return new Date().toISOString();
                if (typeof dateValue === 'string' && dateValue.includes('T')) {
                    return dateValue;
                }
                if (typeof dateValue === 'string' && dateValue.length === 10) {
                    return `${dateValue}T00:00:00.000Z`;
                }
                try {
                    return new Date(dateValue).toISOString();
                } catch {
                    return new Date().toISOString();
                }
            };
            const dadosAPI = {
                command: 'create',
                periodoInicio: formData.periodoInicio ? formData.periodoInicio + '-01T00:00:00.000Z' : '',
                periodoFim: formData.periodoFim ? formData.periodoFim + '-01T00:00:00.000Z' : '',
                safraOuEpocaAgricola: formData.safra || '',
                nomeDaPropriedadeOuCampo: formData.nomePropriedade || '',
                areaTotalUtilizada: formData.areaTotalUtilizada || '',
                coordenadasGPS: formData.coordenadasGPS || '',
                safraPorEpocaAgricola: formData.safra || '',
                atividadePrincipal: extractValue(formData.atividadePrincipal),
                culturasProduzidas: culturasAgricolas.map(cultura => ({
                    ano: formatDate(cultura.ano),
                    cultura: extractValue(cultura.cultura),
                    variedade: cultura.variedade || '',
                    areaCultivada: cultura.areaCultivada || '',
                    producao: cultura.producao || '',
                    unidadesDeMedida: Array.isArray(cultura.unidadesDeMedida) ? cultura.unidadesDeMedida.map(extractValue) : [],
                    quantidades: Array.isArray(cultura.quantidades) ? cultura.quantidades.map(extractValue) : [],
                    modoDeProducao: extractValue(cultura.modoProducao),
                    usoDeFertilizante: Boolean(cultura.usoFertilizantes),
                    sistemaDeIrrigacao: Boolean(cultura.sistemaIrrigacao)
                })),
                animaisCriados: criacaoAnimais.map(animal => ({
                    ano: formatDate(animal.ano),
                    tipoDeAnimal: extractValue(animal.tipoAnimal),
                    racaOuVariedade: Array.isArray(animal.raca)
                        ? animal.raca
                            .filter(r => r.value !== 'outra_raca') // Remove a opção 'outra_raca' do envio
                            .map(r => r.value)
                            .join(', ')
                        : '',
                    numeroDeAnimais: animal.numeroAnimais || '',
                    finalidade: extractValue(animal.finalidade),
                    sistemaDeProducao: extractValue(animal.sistemaProducao),
                    produtividade: animal.produtividade || ''
                })),
                vendaNoMercadoLocal: formData.vendaMercadoLocal ? formData.vendaMercadoLocal.toString() : '0',
                vendaNoMercadoRegional: formData.vendaMercadoRegional ? formData.vendaMercadoRegional.toString() : '0',
                autoConsumo: formData.autoconsumo ? formData.autoconsumo.toString() : '0',
                perdas: formData.perdas ? formData.perdas.toString() : '0',
                recebeuAssistenciaTecnica: extractValue(formData.recebiuAssistencia),
                observacoesTecnicas: formData.observacoesTecnicas || '',
                principaisDesafiosEnfrentados: formData.desafiosEnfrentados || '',
                melhoriasERecomendacoes: formData.melhorias || '',
                produtorId: produtorIdNum
            };
            await api.post('/historicoDeProducao', dadosAPI, {
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
    // Conteúdo dos steps (copiar renderModalStepContent do HistoricoProducao.jsx, adaptando para uso local)
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
                                type="month"
                                label="Início "
                                value={formData.periodoInicio}
                                onChange={(value) => updateFormData('periodoInicio', value)}
                                placeholder="Selecione o mês/ano de início"
                                iconStart={<Calendar className="w-4 h-4 text-gray-400" />}
                                helperText="Selecione o mês e ano de início da produção"
                            />
                            <CustomInput
                                type="month"
                                label="Fim "
                                value={formData.periodoFim}
                                onChange={(value) => updateFormData('periodoFim', value)}
                                placeholder="Selecione o mês/ano de fim"
                                iconStart={<Calendar className="w-4 h-4 text-gray-400" />}
                                helperText="Selecione o mês e ano de fim da produção"
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
                                Registe as culturas agrícolas produzidas no período.
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
                                                type="multiselect"
                                                label="Unidade de Medida"
                                                value={cultura.unidadesDeMedida}
                                                options={[
                                                    // Unidades de Quantidade
                                                    { value: 'unidade', label: 'Unidade' },
                                                    { value: 'duzia', label: 'Dúzia (12 unidades)' },
                                                    { value: 'centena', label: 'Centena (100 unidades)' },
                                                    { value: 'milheiro', label: 'Milheiro (1.000 unidades)' },
                                                    // Unidades de Peso (massa)
                                                    { value: 'kg', label: 'Quilograma (kg)' },
                                                    { value: 'g', label: 'Grama (g)' },
                                                    { value: 'mg', label: 'Miligrama (mg)' },
                                                    { value: 't', label: 'Tonelada (t)' },
                                                    { value: 'arroba', label: 'Arroba (≈ 15 kg)' },
                                                    { value: 'saco 60kg', label: 'Saco 60kg' },
                                                    { value: 'saco 50kg', label: 'Saco 50kg' },
                                                    { value: 'saco 25kg', label: 'Saco 25kg' },
                                                ]}
                                                onChange={(value) => atualizarCultura(cultura.id, 'unidadesDeMedida', value)}
                                                placeholder="Selecione as unidade"
                                                helperText="Escolha uma ou mais unidades de medida"
                                            />
                                            <CustomInput
                                                type="multiselect"
                                                label="Quantidade"
                                                value={cultura.quantidades}
                                                options={[
                                                    { value: '0.5', label: '0,5' },
                                                    { value: '1', label: '1' },
                                                    { value: '2', label: '2' },
                                                    { value: '5', label: '5' },
                                                    { value: '10', label: '10' },
                                                    { value: '15', label: '15' },
                                                    { value: '20', label: '20' },
                                                    { value: '25', label: '25' },
                                                    { value: '30', label: '30' },
                                                    { value: '50', label: '50' },
                                                    { value: '75', label: '75' },
                                                    { value: '100', label: '100' },
                                                    { value: '150', label: '150' },
                                                    { value: '200', label: '200' },
                                                    { value: '250', label: '250' },
                                                    { value: '500', label: '500' },
                                                    { value: '750', label: '750' },
                                                    { value: '1000', label: '1.000' },
                                                    { value: '2000', label: '2.000' },
                                                    { value: '5000', label: '5.000' },
                                                    { value: 'outro', label: 'Outro valor' }
                                                ]}
                                                onChange={(value) => atualizarCultura(cultura.id, 'quantidades', value)}
                                                placeholder="Selecione as quantidades"
                                                helperText="Escolha uma ou mais quantidades"
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
                                Registe os animais criados e a sua produtividade no período.
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
                                                type="multiselect"
                                                label="Raça/Variedade"
                                                value={animal.raca}
                                                options={racasPorTipo[animal.tipoAnimal?.value || animal.tipoAnimal] || []}
                                                onChange={(value) => {
                                                    if (value && value.some(v => v.value === 'outra_raca')) {
                                                        // Mantém 'outra_raca' selecionada para mostrar o campo adicional
                                                        atualizarAnimal(animal.id, 'raca', value);
                                                    } else {
                                                        // Se 'outra_raca' foi removida, limpa o campo de texto adicional
                                                        atualizarAnimal(animal.id, 'racaCustom', '');
                                                        atualizarAnimal(animal.id, 'raca', value);
                                                    }
                                                }}
                                                placeholder="Selecione ou digite"
                                                helperText="Escolha uma ou mais raças sugeridas ou digite para adicionar novas"
                                                allowCustomValues={true}
                                            />
                                            {/* Campo adicional para digitar nova raça */}
                                            {animal.raca && animal.raca.some(r => r.value === 'outra_raca') && (
                                                <div className="mt-2 flex gap-2 items-end">
                                                    <CustomInput
                                                        type="text"
                                                        label="Digite a nova raça"
                                                        value={animal.racaCustom || ''}
                                                        onChange={(value) => atualizarAnimal(animal.id, 'racaCustom', value)}
                                                        placeholder="Digite o nome da nova raça"
                                                        helperText="Clique em Adicionar para incluir a nova raça"
                                                    />
                                                    <button
                                                        type="button"
                                                        className={`px-1 py-1 rounded-lg mb-6 text-white font-medium transition-colors ${animal.racaCustom?.trim() ? 'bg-orange-600 hover:bg-orange-600' : 'bg-gray-300 cursor-not-allowed'}`}
                                                        disabled={!animal.racaCustom?.trim()}
                                                        onClick={() => {
                                                            if (!animal.racaCustom?.trim()) return;
                                                            const novaRaca = {
                                                                value: animal.racaCustom.trim(),
                                                                label: animal.racaCustom.trim()
                                                            };
                                                            setCriacaoAnimais(prevAnimais => {
                                                                return prevAnimais.map(a => {
                                                                    if (a.id === animal.id) {
                                                                        const racasAtuais = Array.isArray(a.raca) ? [...a.raca] : [];
                                                                        const racasSemDuplicatas = racasAtuais.filter(r => r.value !== novaRaca.value && r.value !== 'outra_raca');
                                                                        const racasAtualizadas = [...racasSemDuplicatas, novaRaca];
                                                                        if (racasAtuais.some(r => r.value === 'outra_raca')) {
                                                                            racasAtualizadas.push({ value: 'outra_raca', label: 'Outra raça (digite)' });
                                                                        }
                                                                        return { ...a, raca: racasAtualizadas, racaCustom: '' };
                                                                    }
                                                                    return a;
                                                                });
                                                            });
                                                        }}
                                                    >
                                                        <Check />
                                                    </button>
                                                </div>
                                            )}
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
            <div className="container mx-auto ">
                <div className="bg-white rounded-lg rounded-4  w-full mx-auto flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r rounded-t-2xl from-green-50 to-blue-50 p-6 border-b border-gray-200 flex-shrink-0">
                        <div className="flex justify-between items-center mb-4 w-full">
                            <button onClick={handleCancelForm} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                                <MoveLeft className="w-6 h-6 text-gray-600" />
                            </button>
                            <h2 className="text-4xl font-bold mb-3 text-gray-800 flex items-center justify-center w-full">
                                Novo Registo de Produção
                            </h2>
                        </div>


                    </div>
                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6  px-8 mb-8">
                        {/* Step Navigation */}
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
                        {/* Progress Bar */}
                        <div className="w-full bg-gray-200 h-2 mb-10 rounded-full">
                            <div className="bg-green-600 h-2 transition-all duration-300 rounded-full" style={{ width: `${((activeStepInModal + 1) / modalSteps.length) * 100}%` }}></div>
                        </div>
                        {renderModalStepContent(activeStepInModal)}
                    </div>
                    {/* Footer */}
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

export default AddHistoricoEntidade; 