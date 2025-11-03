import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Building2,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    Download,
    FileText,
    Info,
    MapPin,
    Save,
    Settings,
    SquarePen,
    TestTube,
    User,
    X
} from 'lucide-react';
import CustomInput from '../../../../../core/components/CustomInput';
import { useLaboratorio } from '../../../hooks/useLaboratorio';
import provinciasData from '../../../../../core/components/Provincias.json';

const VisualizarLaboratorio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { fetchLaboratorioById, updateLaboratorio, loading } = useLaboratorio();
    const [activeIndex, setActiveIndex] = useState(0);
    const [laboratorio, setLaboratorio] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);

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

    // Opções de províncias do arquivo JSON
    const provinciaOptions = useMemo(() => {
        return provinciasData.map(provincia => ({
            value: provincia.nome.toUpperCase().replace(/\s+/g, '_'),
            label: provincia.nome
        }));
    }, []);

    // Opções de municípios baseadas na província selecionada
    const municipioOptions = useMemo(() => {
        if (!laboratorio?.provincia) return [];
        
        const provinciaValue = typeof laboratorio.provincia === 'object' ? laboratorio.provincia.value : laboratorio.provincia;
        const provincia = provinciasData.find(p => 
            p.nome.toUpperCase().replace(/\s+/g, '_') === provinciaValue
        );
        
        if (!provincia) return [];
        
        try {
            const municipios = JSON.parse(provincia.municipios);
            return municipios.map(municipio => ({
                value: municipio.toUpperCase().replace(/\s+/g, '_'),
                label: municipio
            }));
        } catch {
            return [];
        }
    }, [laboratorio?.provincia]);

    const tiposAnaliseOptions = [
        { value: 'QUIMICA', label: 'Química' },
        { value: 'FISICA', label: 'Física' },
        { value: 'MINERALOGICA', label: 'Mineralógica' },
        { value: 'AMBIENTAL', label: 'Ambiental' }
    ];

    const statusOptions = [
        { value: 'Activo', label: 'Activo' },
        { value: 'Inactivo', label: 'Inactivo' }
    ];

    useEffect(() => {
        const loadLaboratorio = async () => {
            if (id) {
                try {
                    const data = await fetchLaboratorioById(id);
                    setLaboratorio(data);
                } catch (error) {
                    console.error('Erro ao carregar laboratório:', error);
                }
            }
        };
        loadLaboratorio();
    }, [id]);

    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleEdit = () => {
        setOriginalData({ ...laboratorio });
        setIsEditing(true);
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setLaboratorio(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
    };

    const handleSave = async () => {
        try {
            const dataToSend = {
                ...laboratorio,
                tiposDeAnalise: Array.isArray(laboratorio.tiposDeAnalise) 
                    ? laboratorio.tiposDeAnalise 
                    : []
            };
            
            await updateLaboratorio(laboratorio.id, dataToSend);
            setIsEditing(false);
            setOriginalData(null);
            showToast('success', 'Laboratório atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar laboratório.');
        }
    };

    const handleInputChange = (field, value) => {
        setLaboratorio(prev => {
            const newData = {
                ...prev,
                [field]: value
            };
            
            // Limpar município quando província mudar
            if (field === 'provincia') {
                newData.municipio = '';
            }
            
            return newData;
        });
    };

    const renderStepContent = (index) => {
        if (!laboratorio) return null;

        switch (index) {
            case 0: // Identificação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-blue-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building2 className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Laboratório</h3>
                            </div>
                            <p className="text-gray-600">Dados básicos de identificação do laboratório.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome do Laboratório"
                                    value={laboratorio.nomeDoLaboratorio}
                                    onChange={(value) => handleInputChange('nomeDoLaboratorio', value)}
                                    disabled={!isEditing}
                                    iconStart={<Building2 size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Sigla"
                                    value={laboratorio.sigla}
                                    onChange={(value) => handleInputChange('sigla', value)}
                                    disabled={!isEditing}
                                    iconStart={<Building2 size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Tipo de Laboratório"
                                    value={isEditing ? { label: laboratorio.tipoDeLaboratorio, value: laboratorio.tipoDeLaboratorio } : laboratorio.tipoDeLaboratorio}
                                    options={isEditing ? tipoLaboratorioOptions : undefined}
                                    onChange={(value) => handleInputChange('tipoDeLaboratorio', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<Building2 size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1: // Localização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-green-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Localização</h3>
                            </div>
                            <p className="text-gray-600">Informações de localização do laboratório.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Província"
                                    value={isEditing ? { label: laboratorio.provincia, value: laboratorio.provincia } : laboratorio.provincia}
                                    options={isEditing ? provinciaOptions : undefined}
                                    onChange={(value) => handleInputChange('provincia', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Município"
                                    value={isEditing ? 
                                        (laboratorio.municipio ? { label: laboratorio.municipio, value: laboratorio.municipio } : '') :
                                        laboratorio.municipio
                                    }
                                    options={isEditing ? municipioOptions : undefined}
                                    onChange={(value) => handleInputChange('municipio', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing || !laboratorio.provincia}
                                    placeholder={isEditing && !laboratorio.provincia ? "Selecione primeiro a província" : undefined}
                                    iconStart={<MapPin size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Endereço Completo"
                                    value={laboratorio.enderecoCompleto}
                                    onChange={(value) => handleInputChange('enderecoCompleto', value)}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Responsável
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-yellow-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-yellow-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <User className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Responsável Técnico</h3>
                            </div>
                            <p className="text-gray-600">Informações do responsável técnico do laboratório.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Responsável Técnico"
                                    value={laboratorio.responsavelTecnico}
                                    onChange={(value) => handleInputChange('responsavelTecnico', value)}
                                    disabled={!isEditing}
                                    iconStart={<User size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Contacto"
                                    value={laboratorio.contacto}
                                    onChange={(value) => handleInputChange('contacto', value)}
                                    disabled={!isEditing}
                                    iconStart={<User size={18} />}
                                />
                                <CustomInput
                                    type="email"
                                    label="E-mail"
                                    value={laboratorio.email}
                                    onChange={(value) => handleInputChange('email', value)}
                                    disabled={!isEditing}
                                    iconStart={<User size={18} />}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 3: // Configurações
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-purple-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Settings className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Configurações e Capacidades</h3>
                            </div>
                            <p className="text-gray-600">Configurações técnicas e capacidades do laboratório.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type={isEditing ? "multiselect" : "text"}
                                    label="Tipos de Análise"
                                    value={isEditing 
                                        ? (laboratorio.tiposDeAnalise || []).map(tipo => ({ label: tipo, value: tipo }))
                                        : (laboratorio.tiposDeAnalise || []).join(', ')
                                    }
                                    options={isEditing ? tiposAnaliseOptions : undefined}
                                    onChange={(value) => handleInputChange('tiposDeAnalise', Array.isArray(value) ? value.map(v => v.value) : value)}
                                    disabled={!isEditing}
                                    iconStart={<TestTube size={18} />}
                                />
                                <CustomInput
                                    type="number"
                                    label="Capacidade de Processamento"
                                    value={laboratorio.capacidadeDeProcessamento}
                                    onChange={(value) => handleInputChange('capacidadeDeProcessamento', parseInt(value) || 0)}
                                    disabled={!isEditing}
                                    iconStart={<Settings size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Estado"
                                    value={isEditing ? { label: laboratorio.estado, value: laboratorio.estado } : laboratorio.estado}
                                    options={isEditing ? statusOptions : undefined}
                                    onChange={(value) => handleInputChange('estado', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                    iconStart={<Settings size={18} />}
                                />
                                <CustomInput
                                    type="textarea"
                                    label="Observações"
                                    value={laboratorio.observacoes}
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

    if (!laboratorio) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <AlertTriangle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">Laboratório não encontrado</h2>
                    <p className="text-gray-500 mb-4">O laboratório solicitado não foi encontrado.</p>
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
                                            Detalhes do Laboratório
                                        </h2>
                                        <div className="text-gray-600">
                                            {laboratorio.sigla} - {laboratorio.nomeDoLaboratorio}
                                        </div>
                                        <div className="flex gap-2 flex-wrap items-center mt-2">
                                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                                laboratorio.estado === 'Activo' ? 'bg-green-50 text-green-700 border-green-200' : 
                                                'bg-red-100 text-red-700 border-red-300'
                                            }`}>
                                                {laboratorio.estado === 'Activo' && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                                                {laboratorio.estado === 'Inactivo' && <X className="w-4 h-4 mr-1 text-red-400" />}
                                                {laboratorio.estado}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700">
                                                <Building2 className="w-4 h-4 mr-1" /> {laboratorio.tipoDeLaboratorio}
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

export default VisualizarLaboratorio;