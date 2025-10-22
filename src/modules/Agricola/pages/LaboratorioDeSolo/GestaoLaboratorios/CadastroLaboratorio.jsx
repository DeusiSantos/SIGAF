import { useState } from 'react';
import { FlaskConical, TestTube, User, ChevronLeft, ChevronRight, Check, CheckCircle, AlertCircle, MapPin, Building2, Settings } from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';

const CadastroLaboratorio = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [toastMessage, setToastMessage] = useState(null);

    const [formData, setFormData] = useState({
        nomeLaboratorio: '',
        sigla: '',
        tipoLaboratorio: '',
        provincia: '',
        municipio: '',
        enderecoCompleto: '',
        responsavelTecnico: '',
        telefone: '',
        email: '',
        tiposAnalise: [],
        capacidadeProcessamento: '',
        status: 'ATIVO',
        observacoes: '',
        dataCadastro: new Date().toISOString().split('T')[0]
    });

    const steps = [
        { label: 'Identificação', icon: Building2 },
        { label: 'Localização', icon: MapPin },
        { label: 'Responsável', icon: User },
        { label: 'Configurações', icon: Settings }
    ];

    const tipoLaboratorioOptions = [
        { value: 'INTERNO', label: 'Interno' },
        { value: 'EXTERNO', label: 'Externo' },
        { value: 'PARCEIRO', label: 'Parceiro' }
    ];

    const provinciaOptions = [
        { value: 'LUANDA', label: 'Luanda' },
        { value: 'BENGUELA', label: 'Benguela' },
        { value: 'HUAMBO', label: 'Huambo' },
        { value: 'HUILA', label: 'Huíla' },
        { value: 'CABINDA', label: 'Cabinda' },
        { value: 'CUNENE', label: 'Cunene' },
        { value: 'NAMIBE', label: 'Namibe' },
        { value: 'MOXICO', label: 'Moxico' },
        { value: 'CUANDO_CUBANGO', label: 'Cuando Cubango' },
        { value: 'LUNDA_NORTE', label: 'Lunda Norte' },
        { value: 'LUNDA_SUL', label: 'Lunda Sul' },
        { value: 'MALANJE', label: 'Malanje' },
        { value: 'UIGE', label: 'Uíge' },
        { value: 'ZAIRE', label: 'Zaire' },
        { value: 'CUANZA_NORTE', label: 'Cuanza Norte' },
        { value: 'CUANZA_SUL', label: 'Cuanza Sul' },
        { value: 'BIE', label: 'Bié' },
        { value: 'BENGO', label: 'Bengo' }
    ];

    const tiposAnaliseOptions = [
        { value: 'QUIMICA', label: 'Química' },
        { value: 'FISICA', label: 'Física' },
        { value: 'MINERALOGICA', label: 'Mineralógica' },
        { value: 'AMBIENTAL', label: 'Ambiental' }
    ];

    const statusOptions = [
        { value: 'ATIVO', label: 'Ativo' },
        { value: 'INATIVO', label: 'Inativo' }
    ];

    const showToast = (severity, summary, detail, duration = 3000) => {
        setToastMessage({ severity, summary, detail, visible: true });
        setTimeout(() => setToastMessage(null), duration);
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
            case 0: // Identificação
                if (!formData.nomeLaboratorio) newErrors.nomeLaboratorio = 'Campo obrigatório';
                if (!formData.sigla) newErrors.sigla = 'Campo obrigatório';
                if (!formData.tipoLaboratorio) newErrors.tipoLaboratorio = 'Campo obrigatório';
                break;
            case 1: // Localização
                if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
                if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
                break;
            case 2: // Responsável
                if (!formData.responsavelTecnico) newErrors.responsavelTecnico = 'Campo obrigatório';
                if (!formData.telefone) newErrors.telefone = 'Campo obrigatório';
                if (!formData.email) newErrors.email = 'Campo obrigatório';
                break;
            case 3: // Configurações
                if (!formData.tiposAnalise || formData.tiposAnalise.length === 0) {
                    newErrors.tiposAnalise = 'Selecione pelo menos um tipo de análise';
                }
                if (!formData.capacidadeProcessamento) newErrors.capacidadeProcessamento = 'Campo obrigatório';
                if (!formData.status) newErrors.status = 'Campo obrigatório';
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            console.log('Dados do laboratório:', formData);
            showToast('success', 'Sucesso', 'Laboratório cadastrado com sucesso!');

            // Reset form
            setFormData({
                nomeLaboratorio: '',
                sigla: '',
                tipoLaboratorio: '',
                provincia: '',
                municipio: '',
                enderecoCompleto: '',
                responsavelTecnico: '',
                telefone: '',
                email: '',
                tiposAnalise: [],
                capacidadeProcessamento: '',
                status: 'ATIVO',
                observacoes: '',
                dataCadastro: new Date().toISOString().split('T')[0]
            });
            setActiveIndex(0);
            setErrors({});
        } catch (error) {
            showToast('error', 'Erro', 'Erro ao cadastrar laboratório.');
            console.error('Erro ao cadastrar laboratório:', error);
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
            case 0: // Identificação
                return (
                    <div className="space-y-6 min-h-[600px]">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-6 mb-8 border border-blue-200">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="text-blue-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Identificação do Laboratório</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="text"
                                label="Nome do Laboratório"
                                value={formData.nomeLaboratorio}
                                onChange={(value) => handleInputChange('nomeLaboratorio', value)}
                                required
                                errorMessage={errors.nomeLaboratorio}
                                placeholder="Nome completo do laboratório"
                                iconStart={<Building2 size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Sigla"
                                value={formData.sigla}
                                onChange={(value) => handleInputChange('sigla', value)}
                                required
                                errorMessage={errors.sigla}
                                placeholder="Ex: LABCENT, SIGLAB"
                                iconStart={<Building2 size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Tipo de Laboratório"
                                value={formData.tipoLaboratorio}
                                options={tipoLaboratorioOptions}
                                onChange={(value) => handleInputChange('tipoLaboratorio', value)}
                                required
                                errorMessage={errors.tipoLaboratorio}
                                placeholder="Selecione o tipo"
                                iconStart={<Building2 size={18} />}
                            />
                        </div>
                    </div>
                );

            case 1: // Localização
                return (
                    <div className="space-y-6 min-h-[600px]">
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 mb-8 border border-green-200">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="text-green-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Localização do Laboratório</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="select"
                                label="Província"
                                value={formData.provincia}
                                options={provinciaOptions}
                                onChange={(value) => handleInputChange('provincia', value)}
                                required
                                errorMessage={errors.provincia}
                                placeholder="Selecione a província"
                                iconStart={<MapPin size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Município"
                                value={formData.municipio}
                                onChange={(value) => handleInputChange('municipio', value)}
                                required
                                errorMessage={errors.municipio}
                                placeholder="Nome do município"
                                iconStart={<MapPin size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Endereço Completo"
                                value={formData.enderecoCompleto}
                                onChange={(value) => handleInputChange('enderecoCompleto', value)}
                                placeholder="Rua, nº, bairro"
                                iconStart={<MapPin size={18} />}
                            />
                        </div>
                    </div>
                );

            case 2: // Responsável
                return (
                    <div className="space-y-6 min-h-[600px]">
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-200">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <User className="text-yellow-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Responsável Técnico</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="text"
                                label="Responsável Técnico"
                                value={formData.responsavelTecnico}
                                onChange={(value) => handleInputChange('responsavelTecnico', value)}
                                required
                                errorMessage={errors.responsavelTecnico}
                                placeholder="Nome completo do responsável técnico"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Contacto (Telefone)"
                                value={formData.telefone}
                                onChange={(value) => handleInputChange('telefone', value)}
                                required
                                errorMessage={errors.telefone}
                                placeholder="+244 XXX XXX XXX"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="email"
                                label="E-mail"
                                value={formData.email}
                                onChange={(value) => handleInputChange('email', value)}
                                required
                                errorMessage={errors.email}
                                placeholder="contato@laboratorio.com"
                                iconStart={<User size={18} />}
                            />
                        </div>
                    </div>
                );

            case 3: // Configurações
                return (
                    <div className="space-y-6 min-h-[600px]">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-2xl p-6 mb-8 border border-purple-200">
                            <div className="flex gap-3 items-center">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Settings className="text-purple-600" size={24} />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Configurações e Capacidades</h3>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="multiselect"
                                label="Tipos de Análise"
                                value={formData.tiposAnalise}
                                options={tiposAnaliseOptions}
                                onChange={(value) => handleInputChange('tiposAnalise', value)}
                                required
                                errorMessage={errors.tiposAnalise}
                                placeholder="Selecione os tipos de análise"
                                iconStart={<TestTube size={18} />}
                            />

                            <CustomInput
                                type="number"
                                label="Capacidade de Processamento"
                                value={formData.capacidadeProcessamento}
                                onChange={(value) => handleInputChange('capacidadeProcessamento', value)}
                                required
                                errorMessage={errors.capacidadeProcessamento}
                                placeholder="Nº máximo de amostras/dia"
                                iconStart={<Settings size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Status"
                                value={formData.status}
                                options={statusOptions}
                                onChange={(value) => handleInputChange('status', value)}
                                required
                                errorMessage={errors.status}
                                placeholder="Selecione o status"
                                iconStart={<Settings size={18} />}
                            />

                            <CustomInput
                                type="textarea"
                                label="Observações"
                                value={formData.observacoes}
                                onChange={(value) => handleInputChange('observacoes', value)}
                                placeholder="Informações adicionais sobre o laboratório"
                                rows={3}
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
                        <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Laboratórios</h1>
                        <p className="text-gray-600">Registre informações dos laboratórios e métodos que realizam</p>
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
                                            <FlaskConical size={20} className="animate-spin mr-2" />
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

export default CadastroLaboratorio;