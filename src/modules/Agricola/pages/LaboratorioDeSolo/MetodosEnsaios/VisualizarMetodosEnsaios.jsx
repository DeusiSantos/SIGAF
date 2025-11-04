import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    BarChart3,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    DollarSign,
    Download,
    FlaskConical,
    Info,
    Save,
    SquarePen,
    TestTube,
    X
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';
import { useMetodosEnsaios } from '../../../hooks/useMetodosEnsaios';
import { useLaboratorio } from '../../../hooks/useLaboratorio';

const VisualizarMetodosEnsaios = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getMetodoById, updateMetodoEnsaio, loading } = useMetodosEnsaios();
    const { laboratorios } = useLaboratorio();
    const [activeIndex, setActiveIndex] = useState(0);
    const [metodoEnsaio, setMetodoEnsaio] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

    const steps = [
        { label: 'Identificação', icon: FlaskConical },
        { label: 'Parâmetros', icon: TestTube },
        { label: 'Intervalos', icon: BarChart3 },
        { label: 'Preço', icon: DollarSign }
    ];

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

    const unidadesMedida = [
        { value: 'cmolc/dm3', label: 'cmolc/dm³' },
        { value: 'percent', label: '%' },
        { value: 'mg/dm3', label: 'mg/dm³' },
        { value: 'ds/m', label: 'dS/m' },
        { value: 'g/kg', label: 'g/kg' },
        { value: 'ppm', label: 'ppm' }
    ];

    const laboratoriosOptions = laboratorios?.map(lab => ({
        value: lab.id,
        label: lab.nomeDoLaboratorio || 'Laboratório sem nome'
    })) || [];

    useEffect(() => {
        const loadMetodoEnsaio = async () => {
            if (id) {
                try {
                    const data = await getMetodoById(id);
                    setMetodoEnsaio(data);
                } catch (error) {
                    console.error('Erro ao carregar método de ensaio:', error);
                }
            }
        };
        loadMetodoEnsaio();
    }, [id]);

    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleEdit = () => {
        setOriginalData({ ...metodoEnsaio });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setMetodoEnsaio(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
    };

    const handleSave = async () => {
        try {
            const dataToSend = {
                ...metodoEnsaio,
                limiteInferior: parseFloat(metodoEnsaio.limiteInferior) || 0,
                limiteSuperior: parseFloat(metodoEnsaio.limiteSuperior) || 0,
                precoDoEnsaio: parseFloat(metodoEnsaio.precoDoEnsaio) || 0
            };
            
            await updateMetodoEnsaio(metodoEnsaio.id, dataToSend);
            setIsEditing(false);
            setOriginalData(null);
            showToast('success', 'Método de ensaio atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar método de ensaio.');
        }
    };

    const handleInputChange = (field, value) => {
        setMetodoEnsaio(prev => ({ ...prev, [field]: value }));
    };

    const renderStepContent = (index) => {
        if (!metodoEnsaio) return null;

        switch (index) {
            case 0: // Identificação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <FlaskConical className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Método</h3>
                            </div>
                            <p className="text-gray-600">Informações básicas sobre o tipo de análise e amostra.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Tipo de Análise"
                                    value={isEditing ? { label: tiposAnalise.find(t => t.value === metodoEnsaio.tipoDeAnalise)?.label || metodoEnsaio.tipoDeAnalise, value: metodoEnsaio.tipoDeAnalise } : tiposAnalise.find(t => t.value === metodoEnsaio.tipoDeAnalise)?.label || metodoEnsaio.tipoDeAnalise}
                                    options={isEditing ? tiposAnalise : undefined}
                                    onChange={(value) => handleInputChange('tipoDeAnalise', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<FlaskConical size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Tipo de Amostra"
                                    value={isEditing ? { label: metodoEnsaio.tipoDeAmostra, value: metodoEnsaio.tipoDeAmostra } : metodoEnsaio.tipoDeAmostra}
                                    options={isEditing ? tiposAmostra : undefined}
                                    onChange={(value) => handleInputChange('tipoDeAmostra', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<TestTube size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1: // Parâmetros
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TestTube className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Parâmetros de Análise</h3>
                            </div>
                            <p className="text-gray-600">Definição dos parâmetros e métodos de análise.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Parâmetro de Análise"
                                    value={isEditing ? { label: parametrosAnalise.find(p => p.value === metodoEnsaio.parametroDeAnalise)?.label || metodoEnsaio.parametroDeAnalise, value: metodoEnsaio.parametroDeAnalise } : parametrosAnalise.find(p => p.value === metodoEnsaio.parametroDeAnalise)?.label || metodoEnsaio.parametroDeAnalise}
                                    options={isEditing ? parametrosAnalise : undefined}
                                    onChange={(value) => handleInputChange('parametroDeAnalise', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<TestTube size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Fórmula Química"
                                    value={metodoEnsaio.formulaQuimica}
                                    onChange={(value) => handleInputChange('formulaQuimica', value)}
                                    disabled={!isEditing}
                                    iconStart={<FlaskConical size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Método de Análise"
                                    value={isEditing ? { label: metodosAnalise.find(m => m.value === metodoEnsaio.metodoDeAnalise)?.label || metodoEnsaio.metodoDeAnalise, value: metodoEnsaio.metodoDeAnalise } : metodosAnalise.find(m => m.value === metodoEnsaio.metodoDeAnalise)?.label || metodoEnsaio.metodoDeAnalise}
                                    options={isEditing ? metodosAnalise : undefined}
                                    onChange={(value) => handleInputChange('metodoDeAnalise', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<FlaskConical size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Laboratório Executor"
                                    value={isEditing ? { label: metodoEnsaio.laboratorioExecutor, value: metodoEnsaio.laboratorioExecutor } : metodoEnsaio.laboratorioExecutor}
                                    options={isEditing ? laboratoriosOptions : undefined}
                                    onChange={(value) => handleInputChange('laboratorioExecutor', typeof value === 'object' ? value.label : value)}
                                    disabled={!isEditing}
                                    iconStart={<FlaskConical size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Intervalos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-orange-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <BarChart3 className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Intervalos de Medição</h3>
                            </div>
                            <p className="text-gray-600">Definição dos limites e unidades de medida.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <CustomInput
                                    type="number"
                                    label="Limite Inferior"
                                    value={metodoEnsaio.limiteInferior}
                                    onChange={(value) => handleInputChange('limiteInferior', value)}
                                    disabled={!isEditing}
                                    iconStart={<BarChart3 size={18} />}
                                    step="any"
                                />
                                <CustomInput
                                    type="number"
                                    label="Limite Superior"
                                    value={metodoEnsaio.limiteSuperior}
                                    onChange={(value) => handleInputChange('limiteSuperior', value)}
                                    disabled={!isEditing}
                                    iconStart={<BarChart3 size={18} />}
                                    step="any"
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Unidade de Medida"
                                    value={isEditing ? { label: unidadesMedida.find(u => u.value === metodoEnsaio.unidadeDeMedida)?.label || metodoEnsaio.unidadeDeMedida, value: metodoEnsaio.unidadeDeMedida } : unidadesMedida.find(u => u.value === metodoEnsaio.unidadeDeMedida)?.label || metodoEnsaio.unidadeDeMedida}
                                    options={isEditing ? unidadesMedida : undefined}
                                    onChange={(value) => handleInputChange('unidadeDeMedida', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<BarChart3 size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Preço
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Preço e Observações</h3>
                            </div>
                            <p className="text-gray-600">Definição do preço do ensaio e observações adicionais.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="number"
                                    label="Preço do Ensaio (AOA)"
                                    value={metodoEnsaio.precoDoEnsaio}
                                    onChange={(value) => handleInputChange('precoDoEnsaio', value)}
                                    disabled={!isEditing}
                                    iconStart={<DollarSign size={18} />}
                                    step="any"
                                />
                                <CustomInput
                                    type="textarea"
                                    label="Observações"
                                    value={metodoEnsaio.observacoes}
                                    onChange={(value) => handleInputChange('observacoes', value)}
                                    disabled={!isEditing}
                                    rows={3}
                                />
                            </div>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!metodoEnsaio) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Método de ensaio não encontrado</h2>
                    <p className="text-gray-500 mb-4">O método de ensaio solicitado não foi encontrado.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Voltar à Lista
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
                        {toastMessage.type === 'info' && <Info className="w-5 h-5 mr-2" />}
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

            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className='flex flex-col'>
                                <div className="flex items-center gap-3">
                                    <div className="flex rounded-full top-0">
                                        <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-gray-100 text-gray-600">
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">
                                            Detalhes do Método de Ensaio
                                        </h2>
                                        <div className="text-gray-600">
                                            {metodoEnsaio.parametroDeAnalise} - {metodoEnsaio.tipoDeAmostra}
                                        </div>
                                        <div className="flex gap-2 flex-wrap items-center mt-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700">
                                                <FlaskConical className="w-4 h-4 mr-1" /> {metodoEnsaio.tipoDeAnalise}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-green-200 bg-green-50 text-green-700">
                                                <DollarSign className="w-4 h-4 mr-1" /> {metodoEnsaio.precoDoEnsaio} AOA
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                                <div className="flex gap-3 w-full">
                                    {isEditing ? (
                                        <React.Fragment key="editing-buttons">
                                            <button
                                                key="cancel-btn"
                                                onClick={handleCancel}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                            >
                                                <X className="w-5 h-5" /> Cancelar
                                            </button>
                                            <button
                                                key="save-btn"
                                                onClick={handleSave}
                                                className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                            >
                                                <Save className="w-5 h-5" /> Salvar
                                            </button>
                                        </React.Fragment>
                                    ) : (
                                        <React.Fragment key="view-buttons">
                                            <button
                                                key="edit-btn"
                                                onClick={handleEdit}
                                                className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                            >
                                                <SquarePen className="w-5 h-5" /> Editar
                                            </button>
                                            <button
                                                key="report-btn"
                                                className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                            >
                                                <Download className="w-5 h-5" /> Relatório
                                            </button>
                                        </React.Fragment>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='bg-white max-w-7xl mx-auto rounded-lg shadow-sm border border-gray-200'>
                    {/* Steps Navigation */}
                    <div className="bg-white border-b">
                        <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 overflow-x-auto">
                            {steps.map((step, index) => {
                                const Icon = step.icon;
                                const isActive = index === activeIndex;
                                const isCompleted = index < activeIndex;

                                return (
                                    <div
                                        key={index}
                                        onClick={() => setActiveIndex(index)}
                                        className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                                            !isActive && !isCompleted ? 'opacity-50' : ''
                                        }`}
                                    >
                                        <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${
                                            isActive ? 'bg-blue-600 text-white' :
                                            isCompleted ? 'bg-blue-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className={`text-sm text-center font-medium ${
                                            isActive ? 'text-blue-700' :
                                            isCompleted ? 'text-blue-700' :
                                            'text-gray-500'
                                        }`}>
                                            {step.label}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="w-full bg-gray-200 h-2 mb-0">
                            <div
                                className="bg-blue-600 h-2 transition-all duration-300"
                                style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                            ></div>
                        </div>
                    </div>

                    {/* Content */}
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                        {renderStepContent(activeIndex)}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between mt-8">
                            <button
                                onClick={() => setActiveIndex(prev => Math.max(0, prev - 1))}
                                disabled={activeIndex === 0}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                    activeIndex === 0
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                                }`}
                            >
                                <ChevronLeft className="w-4 h-4 mr-2" />
                                Anterior
                            </button>

                            <button
                                onClick={() => setActiveIndex(prev => Math.min(steps.length - 1, prev + 1))}
                                disabled={activeIndex === steps.length - 1}
                                className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                                    activeIndex === steps.length - 1
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                }`}
                            >
                                Próximo
                                <ChevronRight className="w-4 h-4 ml-2" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Cancelamento</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">
                            Tem certeza que deseja cancelar? <br />Os dados não salvos serão perdidos.
                        </p>
                        <div className="flex gap-3 mt-2 w-full">
                            <button
                                onClick={confirmCancelEdit}
                                className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200"
                            >
                                Sim, cancelar
                            </button>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisualizarMetodosEnsaios;