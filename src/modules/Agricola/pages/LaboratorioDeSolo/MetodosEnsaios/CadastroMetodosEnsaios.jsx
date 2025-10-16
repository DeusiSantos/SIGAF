import { useState } from 'react';
import { Save, AlertCircle, CheckCircle, FlaskConical, TestTube, BarChart3, DollarSign, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';

const CadastroMetodosEnsaios = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    const [formData, setFormData] = useState({
        tipoAnalise: '',
        tipoAmostra: 'Solo',
        parametroAnalise: '',
        formulaQuimica: '',
        metodoAnalise: '',
        laboratorioExecutor: '',
        limiteInferior: '',
        limiteSuperior: '',
        unidadeMedida: '',
        precoEnsaio: '',
        observacoes: ''
    });

    const steps = [
        { label: 'Identificação', icon: FlaskConical },
        { label: 'Parâmetros', icon: TestTube },
        { label: 'Intervalos', icon: BarChart3 },
        { label: 'Preço', icon: DollarSign }
    ];

    const showToast = (severity, summary, detail, duration = 3000) => {
        setToastMessage({ severity, summary, detail, visible: true });
        setTimeout(() => setToastMessage(null), duration);
    };

    const tiposAnalise = [
        { value: 'fisico-quimica', label: 'Físico-química' },
        { value: 'quimica', label: 'Química' },
        { value: 'mineralogica', label: 'Mineralógica' },
        { value: 'ambiental', label: 'Ambiental' }
    ];

    const tiposAmostra = [
        { value: 'Solo', label: 'Solo' },
        { value: 'Agua', label: 'Água' },
        { value: 'Folha', label: 'Folha' }
    ];

    const parametrosAnalise = [
        { value: 'ph', label: 'pH' },
        { value: 'fosforo', label: 'Fósforo (P)' },
        { value: 'potassio', label: 'Potássio (K)' },
        { value: 'calcio-magnesio', label: 'Cálcio e Magnésio' },
        { value: 'materia-organica', label: 'Matéria orgânica' },
        { value: 'nitrogenio-total', label: 'Nitrogênio total' },
        { value: 'condutividade-eletrica', label: 'Condutividade elétrica' },
        { value: 'textura', label: 'Textura (areia, silte, argila)' },
        { value: 'metais-pesados', label: 'Metais pesados (Pb, Cd, Zn, Cu)' },
        { value: 'sais-soluveis', label: 'Sais solúveis' }
    ];

    const parametroConfig = {
        'ph': { metodo: 'potenciometrico', formula: 'pH' },
        'fosforo': { metodo: 'fotocolorimetria', formula: 'P' },
        'potassio': { metodo: 'fotometria-chama', formula: 'K' },
        'calcio-magnesio': { metodo: 'absorcao-atomica', formula: 'Ca, Mg' },
        'materia-organica': { metodo: 'gravimetrico', formula: 'MO' },
        'nitrogenio-total': { metodo: 'volumetrico', formula: 'N' },
        'condutividade-eletrica': { metodo: 'potenciometrico', formula: 'CE' },
        'textura': { metodo: 'gravimetrico', formula: 'Textura' },
        'metais-pesados': { metodo: 'absorcao-atomica', formula: 'Pb, Cd, Zn, Cu' },
        'sais-soluveis': { metodo: 'cromatografia-ionica', formula: 'Sais' }
    };

    const metodosAnalise = [
        { value: 'potenciometrico', label: 'Potenciométrico' },
        { value: 'volumetrico', label: 'Volumétrico' },
        { value: 'gravimetrico', label: 'Gravimétrico' },
        { value: 'fotometria-chama', label: 'Fotometria de Chama' },
        { value: 'fotocolorimetria', label: 'Fotocolorimetria' },
        { value: 'absorcao-atomica', label: 'Absorção Atômica' },
        { value: 'xrf', label: 'XRF (Fluorescência de Raios X)' },
        { value: 'cromatografia-ionica', label: 'Cromatografia Iônica' },
        { value: 'cromatografia-gasosa', label: 'Cromatografia Gasosa' }
    ];

    const laboratorios = [
        { value: 'lab-central', label: 'Lab Central' },
        { value: 'siglab-central', label: 'SIGLAB Central' }
    ];

    const unidadesMedida = [
        { value: 'cmolc/dm3', label: 'cmolc/dm³' },
        { value: 'percent', label: '%' },
        { value: 'mg/dm3', label: 'mg/dm³' },
        { value: 'ds/m', label: 'dS/m' },
        { value: 'g/kg', label: 'g/kg' },
        { value: 'ppm', label: 'ppm' }
    ];

    const handleInputChange = (field, value) => {
        setFormData(prev => {
            const newData = { ...prev, [field]: value };

            // Auto-select method and formula when parameter changes
            if (field === 'parametroAnalise' && value && parametroConfig[value]) {
                const config = parametroConfig[value];
                newData.metodoAnalise = config.metodo;
                newData.formulaQuimica = config.formula;
            }

            return newData;
        });
    };



    const validateCurrentStep = () => {
        const newErrors = {};

        switch (activeIndex) {
            case 0: // Identificação
                if (!formData.tipoAnalise) newErrors.tipoAnalise = 'Campo obrigatório';
                break;
            case 1: // Parâmetros
                if (!formData.parametroAnalise) newErrors.parametroAnalise = 'Campo obrigatório';
                if (!formData.metodoAnalise) newErrors.metodoAnalise = 'Campo obrigatório';
                if (!formData.laboratorioExecutor) newErrors.laboratorioExecutor = 'Campo obrigatório';
                break;
            case 3: // Preço
                if (!formData.precoEnsaio) newErrors.precoEnsaio = 'Campo obrigatório';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Dados do método:', formData);
            showToast('success', 'Sucesso', 'Método de ensaio cadastrado com sucesso!');

            // Reset form
            setFormData({
                tipoAnalise: '',
                tipoAmostra: 'Solo',
                parametroAnalise: '',
                formulaQuimica: '',
                metodoAnalise: '',
                laboratorioExecutor: '',
                limiteInferior: '',
                limiteSuperior: '',
                unidadeMedida: '',
                precoEnsaio: '',
                observacoes: ''
            });
            setActiveIndex(0);
            setErrors({});
        } catch (error) {
            showToast('error', 'Erro', 'Erro ao cadastrar método de ensaio.');
            console.error('Erro ao cadastrar método de ensaio:', error);
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

    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Identificação Geral
                return (
                    <div >
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-200">
                            <div className="flex gap-3 items-center  ">
                                <div class="p-2 bg-blue-100 rounded-lg">
                                    <FlaskConical className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 ">Identificação Geral</h3>
                            </div>

                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="select"
                                label="Tipo de Análise"
                                value={formData.tipoAnalise}
                                options={tiposAnalise}
                                onChange={(value) => handleInputChange('tipoAnalise', value)}
                                required
                                errorMessage={errors.tipoAnalise}
                                placeholder="Selecione o tipo de análise"
                                iconStart={<FlaskConical size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Tipo de Amostra"
                                value={formData.tipoAmostra}
                                options={tiposAmostra}
                                onChange={(value) => handleInputChange('tipoAmostra', value)}
                                placeholder="Selecione o tipo de amostra"
                                iconStart={<TestTube size={18} />}
                            />
                        </div>
                    </div>
                );

            case 1: // Parâmetro de Análise
                return (
                    <div className="">
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 mb-8 border border-green-200">
                            <div className="flex gap-3 items-center  ">
                                <div class="p-2 bg-green-100 rounded-lg">
                                    <TestTube className="text-green-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Parâmetro de Análise</h3>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="select"
                                label="Parâmetro de Análise"
                                value={formData.parametroAnalise}
                                options={parametrosAnalise}
                                onChange={(value) => handleInputChange('parametroAnalise', value)}
                                required
                                errorMessage={errors.parametroAnalise}
                                placeholder="Selecione o parâmetro"
                                iconStart={<TestTube size={18} />}
                            />


                            <CustomInput
                                type="text"
                                label="Fórmula Química"
                                value={formData.formulaQuimica}
                                onChange={(value) => handleInputChange('formulaQuimica', value)}
                                placeholder="Ex: P, K, Ca, Mg"
                                iconStart={<FlaskConical size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Método de Análise"
                                value={formData.metodoAnalise}
                                options={metodosAnalise}
                                onChange={(value) => handleInputChange('metodoAnalise', value)}
                                required
                                errorMessage={errors.metodoAnalise}
                                placeholder="Selecione o método de análise"
                                iconStart={<FlaskConical size={18} />}
                            />


                            <CustomInput
                                type="select"
                                label="Laboratório Executor"
                                value={formData.laboratorioExecutor}
                                options={laboratorios}
                                onChange={(value) => handleInputChange('laboratorioExecutor', value)}
                                required
                                errorMessage={errors.laboratorioExecutor}
                                placeholder="Selecione o laboratório"
                                iconStart={<TestTube size={18} />}
                            />
                        </div>
                    </div>
                );

            case 2: // Intervalos e Unidade
                return (
                    <div className="">
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-200">
                            <div className="flex gap-3 items-center  ">
                                <div class="p-2 bg-yellow-100 rounded-lg">
                                    <BarChart3 className="text-yellow-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Intervalos e Unidade</h3>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CustomInput
                                type="number"
                                label="Limite Inferior (LI)"
                                value={formData.limiteInferior}
                                onChange={(value) => handleInputChange('limiteInferior', value)}
                                placeholder="Ex: 4.5"
                                iconStart={<BarChart3 size={18} />}
                            />

                            <CustomInput
                                type="number"
                                label="Limite Superior (LS)"
                                value={formData.limiteSuperior}
                                onChange={(value) => handleInputChange('limiteSuperior', value)}
                                placeholder="Ex: 7.5"
                                iconStart={<BarChart3 size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Unidade de Medida"
                                value={formData.unidadeMedida}
                                options={unidadesMedida}
                                onChange={(value) => handleInputChange('unidadeMedida', value)}
                                placeholder="Selecione a unidade"
                                iconStart={<BarChart3 size={18} />}
                            />
                        </div>
                    </div>
                );

            case 3: // Preço e Observações
                return (
                    <div className="">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-2xl p-6 mb-8 border border-purple-200">
                            <div className="flex gap-3 items-center  ">
                                <div class="p-2 bg-purple-100 rounded-lg">
                                    <DollarSign className="text-purple-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Preço e Observações</h3>
                            </div>

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
                            <CustomInput
                                type="number"
                                label="Preço do Ensaio (Kz)"
                                value={formData.precoEnsaio}
                                onChange={(value) => handleInputChange('precoEnsaio', value)}
                                required
                                errorMessage={errors.precoEnsaio}
                                placeholder="Ex: 1500"
                                iconStart={<DollarSign size={18} />}
                            />

                            <CustomInput
                                type="textarea"
                                label="Observações"
                                value={formData.observacoes}
                                onChange={(value) => handleInputChange('observacoes', value)}
                                placeholder="Valores de referência baseados na EMBRAPA 2023"
                                rows={3}
                                iconStart={<FlaskConical size={18} />}
                            />
                        </div>
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
                        toastMessage.severity === 'warn' ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' :
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
                    <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-blue-50">
                        <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Métodos e Ensaios</h1>
                        <p className="text-gray-600">Registre e vincule métodos analíticos com parâmetros de solo</p>
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
                                            <Save size={20} className="animate-spin mr-2" />
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

export default CadastroMetodosEnsaios;