import { useState, useEffect } from 'react';
import { User, TestTube, MapPin, FlaskConical, Camera, ChevronLeft, ChevronRight, Check, CheckCircle, AlertCircle, Copy, Trash2, Loader } from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';
import { useFaturas } from '../../../hooks/useFaturas';
import axios from 'axios';

const CadastroDeSolo = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const { gerarFaturaAutomatica } = useFaturas();

    // Carregar produtores
    useEffect(() => {
        const fetchProdutores = async () => {
            setLoadingProdutores(true);
            try {
                const response = await axios.get('https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/all');
                setProdutores(response.data);
            } catch (error) {
                console.error('Erro ao carregar produtores:', error);
            } finally {
                setLoadingProdutores(false);
            }
        };
        fetchProdutores();
    }, []);

    const [formData, setFormData] = useState({
        // Identificação do Produtor
        pertenceProdutor: null,
        produtorSelecionado: null,
        codigoProdutor: '',
        nomeProdutor: '',
        provincia: '',
        municipio: '',
        codigoTecnicoResponsavel: '',
        codigoSupervisor: '',

        // Identificação da Amostra
        codigoAmostra: (() => {
            const year = new Date().getFullYear();
            const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            return `SL-${year}-${random}`;
        })(),
        dataColeta: '',
        responsavelColeta: '',
        areaLavoura: '',
        profundidadeAmostra: '',

        // Informações da Área
        culturaAtual: [],
        culturasAnteriores: [],
        historicoAdubacao: [],
        outroHistorico: '',

        // Ensaios Solicitados
        ensaiosSelecionados: [],
        outrosEnsaios: '',

        // Dados da Coleta
        metodoColeta: '',
        profundidadeColeta: '',
        tipoSolo: '',
        corSolo: '',
        textura: '',
        drenagem: '',
        fotoAmostra: null
    });

    const [duplicatedSections, setDuplicatedSections] = useState({});
    const [produtores, setProdutores] = useState([]);
    const [loadingProdutores, setLoadingProdutores] = useState(false);

    const steps = [
        { label: 'Produtor', icon: User },
        { label: 'Amostra', icon: TestTube },
        { label: 'Área', icon: MapPin },
        { label: 'Ensaios', icon: FlaskConical },
        { label: 'Coleta', icon: Camera }
    ];

    const provincias = [
        { value: 'bengo', label: 'Bengo' },
        { value: 'benguela', label: 'Benguela' },
        { value: 'bie', label: 'Bié' },
        { value: 'cabinda', label: 'Cabinda' },
        { value: 'cuando-cubango', label: 'Cuando Cubango' },
        { value: 'cuanza-norte', label: 'Cuanza Norte' },
        { value: 'cuanza-sul', label: 'Cuanza Sul' },
        { value: 'cunene', label: 'Cunene' },
        { value: 'huambo', label: 'Huambo' },
        { value: 'huila', label: 'Huíla' },
        { value: 'icolo-bengo', label: 'Icolo e Bengo' },
        { value: 'luanda', label: 'Luanda' },
        { value: 'lunda-norte', label: 'Lunda Norte' },
        { value: 'lunda-sul', label: 'Lunda Sul' },
        { value: 'malanje', label: 'Malanje' },
        { value: 'moxico', label: 'Moxico' },
        { value: 'namibe', label: 'Namibe' },
        { value: 'uige', label: 'Uíge' },
        { value: 'zaire', label: 'Zaire' }
    ];

    const entidades = [
        { value: 'mosap3', label: 'MOSAP3' },
        { value: 'adra', label: 'ADRA' },
        { value: 'fas', label: 'FAS' },
        { value: 'outro', label: 'Outro' }
    ];

    const culturas = [
        { value: 'milho', label: 'Milho' },
        { value: 'feijao', label: 'Feijão' },
        { value: 'mandioca', label: 'Mandioca' },
        { value: 'batata', label: 'Batata' },
        { value: 'soja', label: 'Soja' },
        { value: 'arroz', label: 'Arroz' },
        { value: 'sorgo', label: 'Sorgo' }
    ];

    const historicoOptions = [
        { value: 'calcario', label: 'Calcário' },
        { value: 'npk', label: 'NPK' },
        { value: 'organico', label: 'Orgânico' },
        { value: 'outro', label: 'Outro' }
    ];

    const ensaiosOptions = [
        { value: 'ph-agua', label: 'pH em Água' },
        { value: 'ph-cacl2', label: 'pH em CaCl₂' },
        { value: 'aluminio', label: 'Alumínio Trocável (Al³⁺)' },
        { value: 'acidez-potencial', label: 'Acidez Potencial (H+Al)' },
        { value: 'fosforo', label: 'Fósforo (P disponível)' },
        { value: 'potassio', label: 'Potássio (K⁺)' },
        { value: 'calcio', label: 'Cálcio (Ca²⁺)' },
        { value: 'magnesio', label: 'Magnésio (Mg²⁺)' },
        { value: 'enxofre', label: 'Enxofre (S)' },
        { value: 'materia-organica', label: 'Matéria Orgânica' },
        { value: 'ctc', label: 'CTC (Capacidade de Troca Catiônica)' },
        { value: 'saturacao-bases', label: 'V% (Saturação por Bases)' },
        { value: 'micronutrientes', label: 'Micronutrientes (B, Cu, Zn, Fe, Mn)' },
        { value: 'outros', label: 'Outros' }
    ];

    const metodosColeta = [
        { value: 'potenciometrico', label: 'Potenciométrico' },
        { value: 'gravimetrico', label: 'Gravimétrico' },
        { value: 'volumetrico', label: 'Volumétrico' }
    ];

    const tiposSolo = [
        { value: 'arenoso', label: 'Arenoso' },
        { value: 'argiloso', label: 'Argiloso' },
        { value: 'siltoso', label: 'Siltoso' },
        { value: 'misto', label: 'Misto' }
    ];

    const coresSolo = [
        { value: 'escuro', label: 'Escuro' },
        { value: 'avermelhado', label: 'Avermelhado' },
        { value: 'claro', label: 'Claro' }
    ];

    const texturas = [
        { value: 'fina', label: 'Fina' },
        { value: 'media', label: 'Média' },
        { value: 'grossa', label: 'Grossa' }
    ];

    const drenagens = [
        { value: 'boa', label: 'Boa' },
        { value: 'media', label: 'Média' },
        { value: 'ruim', label: 'Ruim' }
    ];

    const showToast = (severity, summary, detail, duration = 3000) => {
        setToastMessage({ severity, summary, detail, visible: true });
        setTimeout(() => setToastMessage(null), duration);
    };

    const duplicateSection = (stepIndex) => {
        const sectionKey = `step_${stepIndex}_${Date.now()}`;
        const currentData = { ...formData };
        
        // Clear fields that should be unique for each duplicate
        if (stepIndex === 1) { // Amostra
            const year = new Date().getFullYear();
            const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
            currentData.codigoAmostra = `SL-${year}-${random}`;
            currentData.dataColeta = '';
            currentData.profundidadeAmostra = '';
        } else if (stepIndex === 0) { // Produtor
            currentData.codigoProdutor = '';
        }
        
        setDuplicatedSections(prev => ({
            ...prev,
            [stepIndex]: {
                ...prev[stepIndex],
                [sectionKey]: currentData
            }
        }));
    };

    const removeDuplicatedSection = (stepIndex, sectionKey) => {
        setDuplicatedSections(prev => {
            const newSections = { ...prev };
            if (newSections[stepIndex]) {
                delete newSections[stepIndex][sectionKey];
                if (Object.keys(newSections[stepIndex]).length === 0) {
                    delete newSections[stepIndex];
                }
            }
            return newSections;
        });
    };

    const handleDuplicatedInputChange = (stepIndex, sectionKey, field, value) => {
        setDuplicatedSections(prev => ({
            ...prev,
            [stepIndex]: {
                ...prev[stepIndex],
                [sectionKey]: {
                    ...prev[stepIndex][sectionKey],
                    [field]: value
                }
            }
        }));
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateCurrentStep = () => {
        const newErrors = {};

        switch (activeIndex) {
            case 0: // Produtor
                if (!formData.pertenceProdutor) newErrors.pertenceProdutor = 'Campo obrigatório';
                if (formData.pertenceProdutor?.value === 'sim') {
                    if (!formData.produtorSelecionado) newErrors.produtorSelecionado = 'Selecione um produtor';
                }
                if (!formData.dataColeta) newErrors.dataColeta = 'Campo obrigatório';
                if (!formData.codigoTecnicoResponsavel) newErrors.codigoTecnicoResponsavel = 'Campo obrigatório';
                break;
            case 1: // Amostra
                if (!formData.dataColeta) newErrors.dataColeta = 'Campo obrigatório';
                if (!formData.responsavelColeta) newErrors.responsavelColeta = 'Campo obrigatório';
                if (!formData.areaLavoura) newErrors.areaLavoura = 'Campo obrigatório';
                break;
            case 2: // Área
                if (!formData.culturaAtual || formData.culturaAtual.length === 0) {
                    newErrors.culturaAtual = 'Selecione pelo menos uma cultura';
                }
                break;
            case 3: // Ensaios
                if (!formData.ensaiosSelecionados || formData.ensaiosSelecionados.length === 0) {
                    newErrors.ensaiosSelecionados = 'Selecione pelo menos um ensaio';
                }
                break;
            case 4: // Coleta
                if (!formData.metodoColeta) newErrors.metodoColeta = 'Campo obrigatório';
                if (!formData.tipoSolo) newErrors.tipoSolo = 'Campo obrigatório';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Dados da amostra:', formData);
            
            // Gerar fatura automática se houver ensaios selecionados
            if (formData.ensaiosSelecionados.length > 0) {
                try {
                    await gerarFaturaAutomatica(formData);
                    showToast('success', 'Sucesso', 'Amostra cadastrada e Fatura Pro-Forma gerada automaticamente!');
                } catch (faturaError) {
                    console.error('Erro ao gerar fatura:', faturaError);
                    showToast('success', 'Sucesso', 'Amostra cadastrada com sucesso! (Erro na geração da fatura)');
                }
            } else {
                showToast('success', 'Sucesso', 'Amostra de solo cadastrada com sucesso!');
            }

            // Reset form
            setFormData({
                pertenceProdutor: null,
                produtorSelecionado: null,
                codigoProdutor: '',
                nomeProdutor: '',
                provincia: '',
                municipio: '',
                codigoTecnicoResponsavel: '',
                codigoSupervisor: '',
                codigoAmostra: (() => {
                    const year = new Date().getFullYear();
                    const random = Math.floor(Math.random() * 9999).toString().padStart(4, '0');
                    return `SL-${year}-${random}`;
                })(),
                dataColeta: '',
                responsavelColeta: '',
                areaLavoura: '',
                profundidadeAmostra: '',
                culturaAtual: [],
                culturasAnteriores: [],
                historicoAdubacao: [],
                outroHistorico: '',
                ensaiosSelecionados: [],
                outrosEnsaios: '',
                metodoColeta: '',
                profundidadeColeta: '',
                tipoSolo: '',
                corSolo: '',
                textura: '',
                drenagem: '',
                fotoAmostra: null
            });
            setDuplicatedSections({});
            setActiveIndex(0);
            setErrors({});
        } catch (error) {
            showToast('error', 'Erro', 'Erro ao cadastrar amostra de solo.');
            console.error('Erro ao cadastrar amostra:', error);
        } finally {
            setLoading(false);
        }
    };

    const nextStep = () => {
        if (validateCurrentStep()) {
            setActiveIndex(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const prevStep = () => {
        setActiveIndex(prev => Math.max(prev - 1, 0));
    };

    const renderDuplicatedSection = (stepIndex, sectionKey, sectionData, sectionNumber) => {
        const stepConfig = {
            0: { title: 'Produtor', icon: User, color: 'blue' },
            1: { title: 'Amostra', icon: TestTube, color: 'green' },
            2: { title: 'Área', icon: MapPin, color: 'yellow' },
            3: { title: 'Ensaios', icon: FlaskConical, color: 'purple' },
            4: { title: 'Coleta', icon: Camera, color: 'pink' }
        };
        
        const config = stepConfig[stepIndex];
        const Icon = config.icon;
        
        return (
            <div key={sectionKey} className="mt-8 border-t-2 border-gray-200 pt-6">
                <div className={`bg-gradient-to-r from-${config.color}-50 to-${config.color}-50 rounded-2xl p-4 mb-6 border border-${config.color}-200`}>
                    <div className="flex justify-between items-center">
                        <div className="flex gap-3 items-center">
                            <div className={`p-2 bg-${config.color}-100 rounded-lg`}>
                                <Icon className={`text-${config.color}-600`} size={20} />
                            </div>
                            <h4 className="text-md font-semibold text-gray-900">{config.title} {sectionNumber}</h4>
                        </div>
                        <button
                            onClick={() => removeDuplicatedSection(stepIndex, sectionKey)}
                            className="flex items-center gap-2 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                            <Trash2 size={16} />
                            Remover
                        </button>
                    </div>
                </div>
                {renderSectionFields(stepIndex, sectionData, (field, value) => handleDuplicatedInputChange(stepIndex, sectionKey, field, value))}
            </div>
        );
    };

    const renderSectionFields = (stepIndex, data, onChange) => {
        switch (stepIndex) {
            case 0: // Produtor
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="text"
                            label="Código do Produtor"
                            value={data.codigoProdutor}
                            onChange={(value) => onChange('codigoProdutor', value)}
                            placeholder="ID único do produtor"
                            iconStart={<User size={18} />}
                        />
                        <CustomInput
                            type="text"
                            label="Nome do Produtor"
                            value={data.nomeProdutor}
                            onChange={(value) => onChange('nomeProdutor', value)}
                            placeholder="Nome completo"
                            iconStart={<User size={18} />}
                        />
                        <CustomInput
                            type="select"
                            label="Província"
                            value={data.provincia}
                            options={provincias}
                            onChange={(value) => onChange('provincia', value)}
                            placeholder="Selecione a província"
                            iconStart={<MapPin size={18} />}
                        />
                        <CustomInput
                            type="text"
                            label="Município"
                            value={data.municipio}
                            onChange={(value) => onChange('municipio', value)}
                            placeholder="Nome do município"
                            iconStart={<MapPin size={18} />}
                        />
                        <CustomInput
                            type="text"
                            label="Comuna"
                            value={data.comuna}
                            onChange={(value) => onChange('comuna', value)}
                            placeholder="Nome da comuna"
                            iconStart={<MapPin size={18} />}
                        />
                        <CustomInput
                            type="text"
                            label="Aldeia"
                            value={data.aldeia}
                            onChange={(value) => onChange('aldeia', value)}
                            placeholder="Nome da aldeia"
                            iconStart={<MapPin size={18} />}
                        />
                        <CustomInput
                            type="select"
                            label="Entidade a que pertence"
                            value={data.entidadePertence}
                            options={entidades}
                            onChange={(value) => onChange('entidadePertence', value)}
                            placeholder="Selecione a entidade"
                            iconStart={<User size={18} />}
                        />
                        {data.entidadePertence === 'outro' && (
                            <CustomInput
                                type="text"
                                label="Especificar Outra Entidade"
                                value={data.outroEntidade}
                                onChange={(value) => onChange('outroEntidade', value)}
                                placeholder="Nome da entidade"
                                iconStart={<User size={18} />}
                            />
                        )}
                        <CustomInput
                            type="text"
                            label="Nome da ECA"
                            value={data.nomeECA}
                            onChange={(value) => onChange('nomeECA', value)}
                            placeholder="Se aplicável"
                            iconStart={<User size={18} />}
                        />
                    </div>
                );
            case 1: // Amostra
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="text"
                            label="Código da Amostra"
                            value={data.codigoAmostra}
                            onChange={(value) => onChange('codigoAmostra', value)}
                            placeholder="Gerado automaticamente"
                            iconStart={<TestTube size={18} />}
                            disabled
                        />
                        <CustomInput
                            type="date"
                            label="Data da Coleta"
                            value={data.dataColeta}
                            onChange={(value) => onChange('dataColeta', value)}
                            iconStart={<TestTube size={18} />}
                        />
                        <CustomInput
                            type="text"
                            label="Responsável pela Coleta"
                            value={data.responsavelColeta}
                            onChange={(value) => onChange('responsavelColeta', value)}
                            placeholder="Nome do técnico ou produtor"
                            iconStart={<User size={18} />}
                        />
                        <CustomInput
                            type="text"
                            label="Área / Lavoura"
                            value={data.areaLavoura}
                            onChange={(value) => onChange('areaLavoura', value)}
                            placeholder="Nome da área ou lavoura"
                            iconStart={<MapPin size={18} />}
                        />
                        <CustomInput
                            type="number"
                            label="Profundidade da Amostra (cm)"
                            value={data.profundidadeAmostra}
                            onChange={(value) => onChange('profundidadeAmostra', value)}
                            placeholder="Em centímetros"
                            iconStart={<TestTube size={18} />}
                        />
                    </div>
                );
            case 2: // Área
                return (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CustomInput
                            type="multiselect"
                            label="Cultura Atual"
                            value={data.culturaAtual}
                            options={culturas}
                            onChange={(value) => onChange('culturaAtual', value)}
                            placeholder="Selecione as culturas"
                            iconStart={<MapPin size={18} />}
                        />
                        <CustomInput
                            type="multiselect"
                            label="Culturas Anteriores"
                            value={data.culturasAnteriores}
                            options={culturas}
                            onChange={(value) => onChange('culturasAnteriores', value)}
                            placeholder="Cultivos dos últimos 3 anos"
                            iconStart={<MapPin size={18} />}
                        />
                        <div className="md:col-span-2">
                            <CustomInput
                                type="multiselect"
                                label="Histórico de Adubação / Corretivos"
                                value={data.historicoAdubacao}
                                options={historicoOptions}
                                onChange={(value) => onChange('historicoAdubacao', value)}
                                placeholder="Selecione os tipos utilizados"
                                iconStart={<FlaskConical size={18} />}
                            />
                        </div>
                        {data.historicoAdubacao?.some(item => item === 'outro' || (item && item.value === 'outro')) && (
                            <div className="md:col-span-2">
                                <CustomInput
                                    type="text"
                                    label="Especificar Outro Histórico"
                                    value={data.outroHistorico}
                                    onChange={(value) => onChange('outroHistorico', value)}
                                    placeholder="Descreva outros corretivos utilizados"
                                    iconStart={<FlaskConical size={18} />}
                                />
                            </div>
                        )}
                    </div>
                );
            case 3: // Ensaios
                return (
                    <div>
                        <CustomInput
                            type="multiselect"
                            label="Selecione os Ensaios"
                            value={data.ensaiosSelecionados}
                            options={ensaiosOptions}
                            onChange={(value) => onChange('ensaiosSelecionados', value)}
                            placeholder="Selecione os ensaios desejados"
                            iconStart={<FlaskConical size={18} />}
                        />
                        {data.ensaiosSelecionados?.some(item => item === 'outros' || (item && item.value === 'outros')) && (
                            <div className="mt-6">
                                <CustomInput
                                    type="text"
                                    label="Especificar Outros Ensaios"
                                    value={data.outrosEnsaios}
                                    onChange={(value) => onChange('outrosEnsaios', value)}
                                    placeholder="Descreva outros ensaios desejados"
                                    iconStart={<FlaskConical size={18} />}
                                />
                            </div>
                        )}
                    </div>
                );
            case 4: // Coleta
                return (
                    <div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="select"
                                label="Método de Coleta"
                                value={data.metodoColeta}
                                options={metodosColeta}
                                onChange={(value) => onChange('metodoColeta', value)}
                                placeholder="Selecione o método"
                                iconStart={<Camera size={18} />}
                            />
                            <CustomInput
                                type="number"
                                label="Profundidade da Coleta (cm)"
                                value={data.profundidadeColeta}
                                onChange={(value) => onChange('profundidadeColeta', value)}
                                placeholder="Em centímetros"
                                iconStart={<Camera size={18} />}
                            />
                            <CustomInput
                                type="select"
                                label="Tipo de Solo"
                                value={data.tipoSolo}
                                options={tiposSolo}
                                onChange={(value) => onChange('tipoSolo', value)}
                                placeholder="Selecione o tipo"
                                iconStart={<TestTube size={18} />}
                            />
                            <CustomInput
                                type="select"
                                label="Cor do Solo"
                                value={data.corSolo}
                                options={coresSolo}
                                onChange={(value) => onChange('corSolo', value)}
                                placeholder="Selecione a cor"
                                iconStart={<TestTube size={18} />}
                            />
                            <CustomInput
                                type="select"
                                label="Textura"
                                value={data.textura}
                                options={texturas}
                                onChange={(value) => onChange('textura', value)}
                                placeholder="Selecione a textura"
                                iconStart={<TestTube size={18} />}
                            />
                            <CustomInput
                                type="select"
                                label="Drenagem"
                                value={data.drenagem}
                                options={drenagens}
                                onChange={(value) => onChange('drenagem', value)}
                                placeholder="Selecione a drenagem"
                                iconStart={<TestTube size={18} />}
                            />
                        </div>
                        <div className="mt-6">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Foto da Amostra
                            </label>
                            <div className="relative">
                                <input
                                    type="file"
                                    className="hidden"
                                    accept=".jpg,.jpeg,.png"
                                    onChange={(e) => onChange('fotoAmostra', e.target.files[0])}
                                    id={`foto-upload-${Date.now()}`}
                                />
                                <label
                                    htmlFor={`foto-upload-${Date.now()}`}
                                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                        data.fotoAmostra
                                            ? 'bg-pink-50 border-pink-300 hover:bg-pink-100'
                                            : 'bg-gray-50 border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                                    }`}
                                >
                                    <Camera className={`w-8 h-8 mb-3 ${data.fotoAmostra ? 'text-pink-500' : 'text-gray-400'}`} />
                                    <p className={`text-sm font-medium ${data.fotoAmostra ? 'text-pink-600' : 'text-gray-500'}`}>
                                        {data.fotoAmostra ? `Foto: ${data.fotoAmostra.name}` : 'Carregar foto da amostra'}
                                    </p>
                                    <p className="text-xs text-gray-400 mt-1">Aceita .jpg e .png</p>
                                </label>
                            </div>
                        </div>
                    </div>
                );
            default:
                return null;
        }
    };

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Identificação do Produtor
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Produtor</h3>
                            </div>
                            <p className="text-gray-600">Dados do produtor associado à amostra de solo.</p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6 space-y-6">
                            <CustomInput
                                type="select"
                                label="Este solo pertence a um produtor?"
                                value={formData.pertenceProdutor}
                                options={[
                                    { label: "Sim", value: "sim" },
                                    { label: "Não", value: "nao" }
                                ]}
                                onChange={(value) => handleInputChange('pertenceProdutor', value)}
                                required
                                errorMessage={errors.pertenceProdutor}
                            />

                            {formData.pertenceProdutor?.value === 'sim' && (
                                <div className="space-y-6">
                                    {loadingProdutores ? (
                                        <div className="flex items-center justify-center py-8">
                                            <Loader className="w-6 h-6 animate-spin text-emerald-600 mr-2" />
                                            <span className="text-gray-600">Carregando produtores...</span>
                                        </div>
                                    ) : (
                                        <CustomInput
                                            type="select"
                                            label="Selecione o Produtor"
                                            value={formData.produtorSelecionado}
                                            options={produtores.map(p => ({
                                                label: `${p.beneficiary_name} - ${p.beneficiary_id_number || 'Sem BI'} (${p.provincia || 'N/A'})`,
                                                value: p._id.toString()
                                            }))}
                                            onChange={(value) => {
                                                handleInputChange('produtorSelecionado', value);
                                                const produtor = produtores.find(p => p._id.toString() === value.value);
                                                if (produtor) {
                                                    handleInputChange('codigoProdutor', produtor._id);
                                                    handleInputChange('nomeProdutor', produtor.beneficiary_name);
                                                    handleInputChange('provincia', produtor.provincia);
                                                    handleInputChange('municipio', produtor.municipio);
                                                }
                                            }}
                                            required
                                            errorMessage={errors.produtorSelecionado}
                                        />
                                    )}

                                    {formData.produtorSelecionado && (
                                        <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                            <div className="flex items-center mb-2">
                                                <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                                <h4 className="font-semibold text-green-900">Dados do Produtor</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
                                                <div>
                                                    <span className="font-medium text-gray-700">Nome:</span>
                                                    <p className="text-gray-600">{formData.nomeProdutor}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Código:</span>
                                                    <p className="text-gray-600">{formData.codigoProdutor}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Província:</span>
                                                    <p className="text-gray-600">{formData.provincia}</p>
                                                </div>
                                                <div>
                                                    <span className="font-medium text-gray-700">Município:</span>
                                                    <p className="text-gray-600">{formData.municipio}</p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            <CustomInput
                                type="text"
                                label="Identificação da Amostra"
                                value={formData.codigoAmostra}
                                onChange={(value) => handleInputChange('codigoAmostra', value)}
                                placeholder="Gerado automaticamente"
                                iconStart={<TestTube size={18} />}
                                disabled
                            />

                            <CustomInput
                                type="date"
                                label="Data da Coleta"
                                value={formData.dataColeta}
                                onChange={(value) => handleInputChange('dataColeta', value)}
                                required
                                errorMessage={errors.dataColeta}
                                iconStart={<TestTube size={18} />}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Código Técnico Responsável"
                                    value={formData.codigoTecnicoResponsavel}
                                    onChange={(value) => handleInputChange('codigoTecnicoResponsavel', value)}
                                    placeholder="Código do técnico"
                                    required
                                    errorMessage={errors.codigoTecnicoResponsavel}
                                />

                                <CustomInput
                                    type="text"
                                    label="Código Supervisor"
                                    value={formData.codigoSupervisor}
                                    onChange={(value) => handleInputChange('codigoSupervisor', value)}
                                    placeholder="Código do supervisor"
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1: // Identificação da Amostra
                return (
                    <div className="space-y-6 min-h-[600px]">
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 mb-8 border border-green-200">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <TestTube className="text-green-600" size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Identificação da Amostra</h3>
                                </div>
                                <button
                                    onClick={() => duplicateSection(1)}
                                    className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors"
                                >
                                    <Copy size={16} />
                                    Adicionar Amostra
                                </button>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="text"
                                label="Código da Amostra"
                                value={formData.codigoAmostra || generateCodigoAmostra()}
                                onChange={(value) => handleInputChange('codigoAmostra', value)}
                                placeholder="Gerado automaticamente"
                                iconStart={<TestTube size={18} />}
                                disabled
                            />
                            <CustomInput
                                type="date"
                                label="Data da Coleta"
                                value={formData.dataColeta}
                                onChange={(value) => handleInputChange('dataColeta', value)}
                                required
                                errorMessage={errors.dataColeta}
                                iconStart={<TestTube size={18} />}
                            />
                            <CustomInput
                                type="text"
                                label="Responsável pela Coleta"
                                value={formData.responsavelColeta}
                                onChange={(value) => handleInputChange('responsavelColeta', value)}
                                required
                                errorMessage={errors.responsavelColeta}
                                placeholder="Nome do técnico ou produtor"
                                iconStart={<User size={18} />}
                            />
                            <CustomInput
                                type="text"
                                label="Área / Lavoura"
                                value={formData.areaLavoura}
                                onChange={(value) => handleInputChange('areaLavoura', value)}
                                required
                                errorMessage={errors.areaLavoura}
                                placeholder="Nome da área ou lavoura"
                                iconStart={<MapPin size={18} />}
                            />
                            <CustomInput
                                type="number"
                                label="Profundidade da Amostra (cm)"
                                value={formData.profundidadeAmostra}
                                onChange={(value) => handleInputChange('profundidadeAmostra', value)}
                                placeholder="Em centímetros"
                                iconStart={<TestTube size={18} />}
                            />
                        </div>
                        {duplicatedSections[1] && Object.entries(duplicatedSections[1]).map(([sectionKey, sectionData], idx) => 
                            renderDuplicatedSection(1, sectionKey, sectionData, idx + 2)
                        )}
                    </div>
                );

            case 2: // Informações da Área
                return (
                    <div className="space-y-6  min-h-[600px]">
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-200">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="p-2 bg-yellow-100 rounded-lg">
                                        <MapPin className="text-yellow-600" size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Informações da Área</h3>
                                </div>
                                <button
                                    onClick={() => duplicateSection(2)}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors"
                                >
                                    <Copy size={16} />
                                    Duplicar
                                </button>
                            </div>
                        </div>
                        <div className="">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="multiselect"
                                    label="Cultura Atual"
                                    value={formData.culturaAtual}
                                    options={culturas}
                                    onChange={(value) => handleInputChange('culturaAtual', value)}
                                    required
                                    errorMessage={errors.culturaAtual}
                                    placeholder="Selecione as culturas"
                                    iconStart={<MapPin size={18} />}
                                />

                                <CustomInput
                                    type="multiselect"
                                    label="Culturas Anteriores"
                                    value={formData.culturasAnteriores}
                                    options={culturas}
                                    onChange={(value) => handleInputChange('culturasAnteriores', value)}
                                    placeholder="Cultivos dos últimos 3 anos"
                                    iconStart={<MapPin size={18} />}
                                />

                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="multiselect"
                                        label="Histórico de Adubação / Corretivos"
                                        value={formData.historicoAdubacao}
                                        options={historicoOptions}
                                        onChange={(value) => handleInputChange('historicoAdubacao', value)}
                                        placeholder="Selecione os tipos utilizados"
                                        iconStart={<FlaskConical size={18} />}
                                    />
                                </div>

                                {formData.historicoAdubacao.some(item => item === 'outro' || (item && item.value === 'outro')) && (
                                    <div className="md:col-span-2">
                                        <CustomInput
                                            type="text"
                                            label="Especificar Outro Histórico"
                                            value={formData.outroHistorico}
                                            onChange={(value) => handleInputChange('outroHistorico', value)}
                                            placeholder="Descreva outros corretivos utilizados"
                                            iconStart={<FlaskConical size={18} />}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                        {duplicatedSections[2] && Object.entries(duplicatedSections[2]).map(([sectionKey, sectionData], idx) => 
                            renderDuplicatedSection(2, sectionKey, sectionData, idx + 2)
                        )}
                    </div>
                );

            case 3: // Ensaios Solicitados
                return (
                    <div className="space-y-6 min-h-[600px]">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-2xl p-6 mb-8 border border-purple-200">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="p-2 bg-purple-100 rounded-lg">
                                        <FlaskConical className="text-purple-600" size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Ensaios Solicitados</h3>
                                </div>
                                <button
                                    onClick={() => duplicateSection(3)}
                                    className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                >
                                    <Copy size={16} />
                                    Duplicar
                                </button>
                            </div>
                        </div>
                        <div className="">
                            <CustomInput
                                type="multiselect"
                                label="Selecione os Ensaios"
                                value={formData.ensaiosSelecionados}
                                options={ensaiosOptions}
                                onChange={(value) => handleInputChange('ensaiosSelecionados', value)}
                                required
                                errorMessage={errors.ensaiosSelecionados}
                                placeholder="Selecione os ensaios desejados"
                                iconStart={<FlaskConical size={18} />}
                            />

                            {formData.ensaiosSelecionados.some(item => item === 'outros' || (item && item.value === 'outros')) && (
                                <div className="mt-6">
                                    <CustomInput
                                        type="text"
                                        label="Especificar Outros Ensaios"
                                        value={formData.outrosEnsaios}
                                        onChange={(value) => handleInputChange('outrosEnsaios', value)}
                                        placeholder="Descreva outros ensaios desejados"
                                        iconStart={<FlaskConical size={18} />}
                                    />
                                </div>
                            )}
                        </div>
                        {duplicatedSections[3] && Object.entries(duplicatedSections[3]).map(([sectionKey, sectionData], idx) => 
                            renderDuplicatedSection(3, sectionKey, sectionData, idx + 2)
                        )}
                    </div>
                );

            case 4: // Dados da Coleta
                return (
                    <div className="space-y-6  min-h-[600px]">
                        <div className="bg-gradient-to-r from-pink-50 to-pink-50 rounded-2xl p-6 mb-8 border border-pink-200">
                            <div className="flex justify-between items-center">
                                <div className="flex gap-3 items-center">
                                    <div className="p-2 bg-pink-100 rounded-lg">
                                        <Camera className="text-pink-600" size={24} />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-900">Dados da Coleta</h3>
                                </div>
                                <button
                                    onClick={() => duplicateSection(4)}
                                    className="flex items-center gap-2 px-4 py-2 bg-pink-100 text-pink-700 rounded-lg hover:bg-pink-200 transition-colors"
                                >
                                    <Copy size={16} />
                                    Duplicar
                                </button>
                            </div>
                        </div>
                        <div className="">
                          
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="select"
                                    label="Método de Coleta"
                                    value={formData.metodoColeta}
                                    options={metodosColeta}
                                    onChange={(value) => handleInputChange('metodoColeta', value)}
                                    required
                                    errorMessage={errors.metodoColeta}
                                    placeholder="Selecione o método"
                                    iconStart={<Camera size={18} />}
                                />

                                <CustomInput
                                    type="number"
                                    label="Profundidade da Coleta (cm)"
                                    value={formData.profundidadeColeta}
                                    onChange={(value) => handleInputChange('profundidadeColeta', value)}
                                    placeholder="Em centímetros"
                                    iconStart={<Camera size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Tipo de Solo"
                                    value={formData.tipoSolo}
                                    options={tiposSolo}
                                    onChange={(value) => handleInputChange('tipoSolo', value)}
                                    required
                                    errorMessage={errors.tipoSolo}
                                    placeholder="Selecione o tipo"
                                    iconStart={<TestTube size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Cor do Solo"
                                    value={formData.corSolo}
                                    options={coresSolo}
                                    onChange={(value) => handleInputChange('corSolo', value)}
                                    placeholder="Selecione a cor"
                                    iconStart={<TestTube size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Textura"
                                    value={formData.textura}
                                    options={texturas}
                                    onChange={(value) => handleInputChange('textura', value)}
                                    placeholder="Selecione a textura"
                                    iconStart={<TestTube size={18} />}
                                />

                                <CustomInput
                                    type="select"
                                    label="Drenagem"
                                    value={formData.drenagem}
                                    options={drenagens}
                                    onChange={(value) => handleInputChange('drenagem', value)}
                                    placeholder="Selecione a drenagem"
                                    iconStart={<TestTube size={18} />}
                                />
                            </div>

                            <div className="mt-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Foto da Amostra
                                </label>
                                <div className="relative">
                                    <input
                                        type="file"
                                        className="hidden"
                                        accept=".jpg,.jpeg,.png"
                                        onChange={(e) => handleInputChange('fotoAmostra', e.target.files[0])}
                                        id="foto-upload"
                                    />
                                    <label
                                        htmlFor="foto-upload"
                                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${formData.fotoAmostra
                                            ? 'bg-pink-50 border-pink-300 hover:bg-pink-100'
                                            : 'bg-gray-50 border-gray-300 hover:border-pink-400 hover:bg-pink-50'
                                            }`}
                                    >
                                        <Camera className={`w-8 h-8 mb-3 ${formData.fotoAmostra ? 'text-pink-500' : 'text-gray-400'}`} />
                                        <p className={`text-sm font-medium ${formData.fotoAmostra ? 'text-pink-600' : 'text-gray-500'}`}>
                                            {formData.fotoAmostra ? `Foto: ${formData.fotoAmostra.name}` : 'Carregar foto da amostra'}
                                        </p>
                                        <p className="text-xs text-gray-400 mt-1">Aceita .jpg e .png</p>
                                    </label>
                                </div>
                            </div>
                        </div>
                        {duplicatedSections[4] && Object.entries(duplicatedSections[4]).map(([sectionKey, sectionData], idx) => 
                            renderDuplicatedSection(4, sectionKey, sectionData, idx + 2)
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
                    toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {toastMessage.severity === 'success' && <CheckCircle size={20} />}
                            {toastMessage.severity === 'error' && <AlertCircle size={20} />}
                        </div>
                        <div>
                            <p className="font-bold">{toastMessage.summary}</p>
                            <p className="text-sm">{toastMessage.detail}</p>
                        </div>
                    </div>
                </div>
            )}

            <div className="mx-auto px-4 py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-green-50">
                        <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Amostras de Solo</h1>
                        <p className="text-gray-600">Registre todos os dados relacionados à coleta e análise de amostras de solo</p>
                    </div>

                    {/* Stepper */}
                    <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                        {steps.map((step, index) => {
                            const Icon = step.icon;
                            const isActive = index === activeIndex;
                            const isCompleted = index < activeIndex;

                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${!isActive && !isCompleted ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${isActive
                                        ? 'bg-blue-600 text-white'
                                        : isCompleted
                                            ? 'bg-green-500 text-white'
                                            : 'bg-gray-200 text-gray-500'
                                        }`}>
                                        {isCompleted ? (
                                            <Check size={24} />
                                        ) : (
                                            <Icon size={24} />
                                        )}
                                    </div>
                                    <span className={`text-sm text-center font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                        <div
                            className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Content */}
                    <div className="px-8 pb-8">
                        {renderStepContent(activeIndex)}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                type="button"
                                onClick={prevStep}
                                disabled={activeIndex === 0}
                                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${activeIndex === 0
                                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                    }`}
                            >
                                <ChevronLeft size={20} className="mr-2" />
                                Anterior
                            </button>

                            {activeIndex === steps.length - 1 ? (
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    disabled={loading}
                                    className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${loading
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {loading ? (
                                        <>
                                            <TestTube size={20} className="animate-spin mr-2" />
                                            Salvando...
                                        </>
                                    ) : (
                                        <>
                                            <Check size={20} className="mr-2" />
                                            Finalizar Cadastro
                                        </>
                                    )}
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                                >
                                    Próximo
                                    <ChevronRight size={20} className="ml-2" />
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CadastroDeSolo;