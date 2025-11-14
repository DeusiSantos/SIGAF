import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    Construction,
    CreditCard,
    Download,
    Factory,
    FileText,
    Gauge,
    Globe,
    Home,
    Info,
    Mail,
    Map,
    MapPin,
    Navigation,
    Phone,
    Save,
    SquarePen,
    User,
    Users,
    Wrench,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

// Componente de Input customizado
const CustomInput = ({
    type = 'text',
    label,
    value,
    onChange,
    options = [],
    disabled = false,
    iconStart,
    placeholder,
    className = "",
    required = false
}) => {
    const renderInput = () => {
        switch (type) {
            case 'select':
                return (
                    <div className="relative">
                        <select
                            value={typeof value === 'object' ? value?.value || '' : value || ''}
                            onChange={(e) => {
                                const selectedOption = options.find(opt => opt.value === e.target.value);
                                onChange(selectedOption || { value: e.target.value, label: e.target.value });
                            }}
                            disabled={disabled}
                            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                        >
                            <option value="">{placeholder || `Selecione ${label}`}</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        {iconStart && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                {iconStart}
                            </div>
                        )}
                    </div>
                );

            case 'textarea':
                return (
                    <div className="relative">
                        <textarea
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                            rows={3}
                            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {iconStart && (
                            <div className="absolute left-3 top-3 text-gray-400">
                                {iconStart}
                            </div>
                        )}
                    </div>
                );

            case 'date':
                return (
                    <div className="relative">
                        <input
                            type="date"
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            disabled={disabled}
                            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {iconStart && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                {iconStart}
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <div className="relative">
                        <input
                            type={type}
                            value={value || ''}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={placeholder}
                            disabled={disabled}
                            className={`w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent ${disabled ? 'bg-gray-100' : 'bg-white'}`}
                        />
                        {iconStart && (
                            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                {iconStart}
                            </div>
                        )}
                    </div>
                );
        }
    };

    return (
        <div className={`space-y-1 ${className}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}
            {renderInput()}
        </div>
    );
};

// Componente Toast
const Toast = ({ toastMessage, onClose }) => {
    if (!toastMessage) return null;

    const { type, title, message } = toastMessage;
    let bgColor, icon;

    switch (type) {
        case 'success':
            bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
            icon = <CheckCircle className="w-5 h-5" />;
            break;
        case 'error':
            bgColor = 'bg-red-50 border-l-4 border-red-500 text-red-700';
            icon = <AlertCircle className="w-5 h-5" />;
            break;
        case 'warning':
            bgColor = 'bg-yellow-50 border-l-4 border-yellow-500 text-yellow-700';
            icon = <AlertTriangle className="w-5 h-5" />;
            break;
        case 'info':
            bgColor = 'bg-blue-50 border-l-4 border-blue-500 text-blue-700';
            icon = <AlertCircle className="w-5 h-5" />;
            break;
        default:
            bgColor = 'bg-gray-50 border-l-4 border-gray-500 text-gray-700';
            icon = <AlertCircle className="w-5 h-5" />;
    }

    return (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${bgColor} animate-fadeIn`}>
            <div className="flex items-center">
                <div className="mr-3">{icon}</div>
                <div>
                    <h3 className="font-medium">{title}</h3>
                    <p className="text-sm mt-1">{message}</p>
                </div>
                <button
                    className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                    onClick={onClose}
                    aria-label="Fechar"
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};

const VisualizarInfraestrutura = () => {
    // Simular useParams e useNavigate
    const { id } = useParams();
    const navigate = (path) => {
        console.log(`Navegação simulada para: ${path}`);
    };

    console.log('ID da infraestrutura:', id.id);

    // Estados
    const [infraestrutura, setInfraestrutura] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [showCancelModal, setShowCancelModal] = useState(false);

    // Opções para selects
    const tiposInfraestrutura = [
        { value: 'CANAL_IRRIGACAO', label: 'Canal de Irrigação' },
        { value: 'REPRESA_BARRAGEM', label: 'Represa/Barragem' },
        { value: 'FURO_AGUA', label: 'Furo de Água/Poço Artesiano' },
        { value: 'SISTEMA_REGA', label: 'Sistema de Rega (aspersão/gota-a-gota)' },
        { value: 'ARMAZEM_CONSERVACAO', label: 'Armazém de Conservação' },
        { value: 'SILOS_GRAOS', label: 'Silos de Grãos' },
        { value: 'ESTUFA_AGRICOLA', label: 'Estufa Agrícola' },
        { value: 'ESTACAO_METEOROLOGICA', label: 'Estação Meteorológica' },
        { value: 'ESTRADA_ACESSO', label: 'Estrada de Acesso Rural' },
        { value: 'MERCADO_AGRICOLA', label: 'Mercado de Produtos Agrícolas' },
        { value: 'CENTRO_FORMACAO', label: 'Centro de Formação Agrária' },
        { value: 'CENTRO_EXTENSAO', label: 'Centro de Extensão Rural' },
        { value: 'POSTO_VETERINARIO', label: 'Posto de Assistência Veterinária' },
        { value: 'MATADOURO', label: 'Matadouro Municipal / Abatedouro' },
        { value: 'CAIS_PESCA', label: 'Cais de Pesca / Infraestrutura Aquícola' },
        { value: 'CENTRO_PROCESSAMENTO', label: 'Centros de Processamento Agroalimentar' },
        { value: 'EQUIPAMENTOS_COMUNITARIOS', label: 'Tratores/Equipamentos Agrícolas Comunitários' }
    ];

    const estadosConservacao = [
        { value: 'BOM', label: 'Bom' },
        { value: 'RAZOAVEL', label: 'Razoável' },
        { value: 'MAU', label: 'Mau' }
    ];

    const frequenciasUtilizacao = [
        { value: 'DIARIA', label: 'Diária' },
        { value: 'SEMANAL', label: 'Semanal' },
        { value: 'SAZONAL', label: 'Sazonal' }
    ];

    const provinciasAngolanas = [
        'LUANDA', 'BENGUELA', 'HUAMBO', 'HUILA', 'CABINDA', 'BIE', 'CUANDO_CUBANGO',
        'CUANZA_NORTE', 'CUANZA_SUL', 'CUNENE', 'LUNDA_NORTE', 'LUNDA_SUL',
        'MALANJE', 'MOXICO', 'NAMIBE', 'UIGE', 'ZAIRE', 'BENGO'
    ].map(p => ({ value: p, label: p.replace(/_/g, ' ') }));

    // Função para mostrar toast
    const showToast = (type, title, message, duration = 5000) => {
        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        setToastMessage({ type, title, message });

        const timeout = setTimeout(() => {
            setToastMessage(null);
        }, duration);

        setToastTimeout(timeout);
    };

    // Buscar dados da infraestrutura
    useEffect(() => {
        const fetchInfraestrutura = async () => {
            if (!id) {
                setLoading(false);
                setError('ID da infraestrutura não informado.');
                return;
            }

            setLoading(true);
            setError(null);

            try {
                const response = await fetch(`http://mwangobrainsa-001-site2.mtempurl.com/api/infraestrutura/${id}`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setInfraestrutura(data);
                setFormData(data);

            } catch (err) {
                console.error('Erro ao buscar infraestrutura:', err);
                setError('Erro ao buscar dados da infraestrutura.');
                showToast('error', 'Erro', 'Não foi possível carregar a infraestrutura');
            } finally {
                setLoading(false);
            }
        };

        fetchInfraestrutura();
    }, [id]);

    // Limpar timeout
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Atualizar formData quando infraestrutura muda
    useEffect(() => {
        if (infraestrutura) {
            setFormData(infraestrutura);
        }
    }, [infraestrutura]);

    // Funções de controle
    const handleBack = () => {
        navigate(-1);
    };

    const handleEdit = () => {
        setIsEditing(true);
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        setFormData(infraestrutura); // Reverte para os dados originais
        setShowCancelModal(false);
        showToast('info', 'Edição cancelada', 'Alterações descartadas');
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleSave = async () => {
        try {
            // Preparar dados para envio
            const dataToSend = {
                id: infraestrutura._id,
                data_de_Registo: formData.data_de_Registo ? new Date(formData.data_de_Registo).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
                bI_NIF: formData.bI_NIF || '',
                nome_da_Infraestrutura: formData.nome_da_Infraestrutura || '',
                tipo_de_Infraestrutura: typeof formData.tipo_de_Infraestrutura === 'object' ? formData.tipo_de_Infraestrutura.value : formData.tipo_de_Infraestrutura || '',
                provincia: typeof formData.provincia === 'object' ? formData.provincia.value : formData.provincia || '',
                municipio: typeof formData.municipio === 'object' ? formData.municipio.value : formData.municipio || '',
                comuna: formData.comuna || '',
                aldeia_Zona: formData.aldeia_Zona || '',
                coordenadas_GPS: formData.coordenadas_GPS || '',
                dimens_o_m_ha_km_etc: formData.dimens_o_m_ha_km_etc || '',
                capacidade_ex_litr_mero_de_utilizadores: formData.capacidade_ex_litr_mero_de_utilizadores || '',
                estado_de_Conserva_o: typeof formData.estado_de_Conserva_o === 'object' ? formData.estado_de_Conserva_o.value : formData.estado_de_Conserva_o || '',
                propriet_rio_Institui_o_Gestora: formData.propriet_rio_Institui_o_Gestora || '',
                contacto: formData.contacto || '',
                e_mail: formData.e_mail || '',
                benefici_rios_Directos: formData.benefici_rios_Directos || '',
                principais_Culturas_Actividades_Apoiada: formData.principais_Culturas_Actividades_Apoiada || '',
                frequ_ncia_de_Utiliza_o: typeof formData.frequ_ncia_de_Utiliza_o === 'object' ? formData.frequ_ncia_de_Utiliza_o.value : formData.frequ_ncia_de_Utiliza_o || '',
                _6_Observa_es_Gerais: formData._6_Observa_es_Gerais || ''
            };

            console.log('Enviando dados:', dataToSend);

            const response = await fetch(`http://mwangobrainsa-001-site2.mtempurl.com/api/infraestrutura/${infraestrutura._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dataToSend)
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            showToast('success', 'Infraestrutura atualizada', 'Os dados foram salvos com sucesso!');

            // Recarregar dados da infraestrutura após salvar
            const updatedResponse = await fetch(`http://mwangobrainsa-001-site2.mtempurl.com/api/infraestrutura/${infraestrutura._id}`);
            const updatedData = await updatedResponse.json();
            setInfraestrutura(updatedData);
            setIsEditing(false);

        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar', 'Não foi possível atualizar a infraestrutura.');
        }
    };

    // Função para formatar tipo de infraestrutura
    const formatTipoInfraestrutura = (tipo) => {
        if (!tipo) return 'N/A';
        const tipoObj = tiposInfraestrutura.find(t => t.value === tipo);
        return tipoObj ? tipoObj.label : tipo.replace(/_/g, ' ');
    };

    // Função para formatar estado de conservação  
    const formatEstadoConservacao = (estado) => {
        if (!estado) return 'N/A';
        const estadoObj = estadosConservacao.find(e => e.value === estado.toUpperCase());
        return estadoObj ? estadoObj.label : estado;
    };

    // Função para parsear coordenadas GPS
    const parseCoordinates = (coordenadas) => {
        if (!coordenadas) return { lat: '--', lng: '--', alt: '--', precision: '--' };

        const parts = coordenadas.split(' ');
        return {
            lat: parts[0] || '--',
            lng: parts[1] || '--',
            alt: parts[2] ? `${parts[2]}m` : '--',
            precision: parts[3] ? `±${parts[3]}m` : '--'
        };
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando infraestrutura...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error || !infraestrutura) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Toast toastMessage={toastMessage} onClose={() => setToastMessage(null)} />
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">{error || 'Infraestrutura não encontrada'}</p>
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                    </button>
                </div>
            </div>
        );
    }

    const coords = parseCoordinates(infraestrutura.coordenadas_GPS);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            <Toast toastMessage={toastMessage} onClose={() => setToastMessage(null)} />

            <div className="w-full">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <button
                                onClick={handleBack}
                                className="p-2 rounded hover:bg-gray-100 text-gray-600"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <div className="flex flex-col">
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Editando Infraestrutura' : 'Detalhes da Infraestrutura'}
                                </h2>
                                <div className="text-gray-600">
                                    ID: {infraestrutura._id || '--'} • BI/NIF: {infraestrutura.bI_NIF || '--'}
                                </div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center mt-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${infraestrutura.estado_de_Conserva_o?.toUpperCase() === 'BOM'
                                    ? 'bg-green-50 text-green-700 border-green-200'
                                    : infraestrutura.estado_de_Conserva_o?.toUpperCase() === 'MAU'
                                        ? 'bg-red-50 text-red-700 border-red-200'
                                        : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                }`}>
                                {infraestrutura.estado_de_Conserva_o?.toUpperCase() === 'BOM' && <CheckCircle className="w-4 h-4 mr-1" />}
                                {infraestrutura.estado_de_Conserva_o?.toUpperCase() === 'MAU' && <X className="w-4 h-4 mr-1" />}
                                {infraestrutura.estado_de_Conserva_o?.toUpperCase() === 'RAZOAVEL' && <AlertTriangle className="w-4 h-4 mr-1" />}
                                {formatEstadoConservacao(infraestrutura.estado_de_Conserva_o)}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700">
                                <Construction className="w-4 h-4 mr-1" />
                                Infraestrutura Registrada
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                        {isEditing ? (
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                >
                                    <X className="w-5 h-5" /> Cancelar
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                >
                                    <Save className="w-5 h-5" /> Salvar
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 w-full">
                                <button
                                    onClick={handleEdit}
                                    className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                >
                                    <SquarePen className="w-5 h-5" /> Editar
                                </button>
                                <button
                                    onClick={() => showToast('info', 'Relatório', 'Funcionalidade em desenvolvimento')}
                                    className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                >
                                    <Download className="w-5 h-5" /> Relatório
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Coluna Esquerda */}
                    <div className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Building className="w-4 h-4 text-blue-600" /> Informações Básicas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label="Nome da Infraestrutura"
                                    value={isEditing ? formData?.nome_da_Infraestrutura : infraestrutura.nome_da_Infraestrutura || ''}
                                    onChange={v => handleChange('nome_da_Infraestrutura', v)}
                                    disabled={!isEditing}
                                    iconStart={<Building size={18} />}
                                />
                                <CustomInput
                                    label="BI/NIF do Responsável"
                                    value={isEditing ? formData?.bI_NIF : infraestrutura.bI_NIF || ''}
                                    onChange={v => handleChange('bI_NIF', v)}
                                    disabled={!isEditing}
                                    iconStart={<CreditCard size={18} />}
                                />
                                <CustomInput
                                    label="Tipo de Infraestrutura"
                                    type="select"
                                    value={isEditing ?
                                        (typeof formData?.tipo_de_Infraestrutura === 'object' ?
                                            formData.tipo_de_Infraestrutura :
                                            tiposInfraestrutura.find(t => t.value === formData?.tipo_de_Infraestrutura)
                                        ) : formatTipoInfraestrutura(infraestrutura.tipo_de_Infraestrutura)
                                    }
                                    options={tiposInfraestrutura}
                                    onChange={v => handleChange('tipo_de_Infraestrutura', v)}
                                    disabled={!isEditing}
                                    iconStart={<Factory size={18} />}
                                />
                                <div>
                                    <CustomInput
                                        label="Data de Registro"
                                        type="date"
                                        value={isEditing ?
                                            (formData?.data_de_Registo ? new Date(formData.data_de_Registo).toISOString().split('T')[0] : '') :
                                            (infraestrutura.data_de_Registo ? new Date(infraestrutura.data_de_Registo).toISOString().split('T')[0] : '')
                                        }
                                        onChange={v => handleChange('data_de_Registo', v)}
                                        disabled={!isEditing}
                                        iconStart={<Calendar size={18} />}
                                    />
                                    {infraestrutura.data_de_Registo && (
                                        <div className="text-xs text-gray-500 mt-1 pl-2">
                                            Registrada em: {new Date(infraestrutura.data_de_Registo).toLocaleDateString('pt-BR')}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Localização */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" /> Localização
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label="Província"
                                    type={isEditing ? "select" : "text"}
                                    value={isEditing ?
                                        (typeof formData?.provincia === 'object' ?
                                            formData.provincia :
                                            provinciasAngolanas.find(p => p.value.toLowerCase() === formData?.provincia?.toLowerCase())
                                        ) : (infraestrutura.provincia || '')
                                    }
                                    options={provinciasAngolanas}
                                    onChange={v => handleChange('provincia', v)}
                                    disabled={!isEditing}
                                    iconStart={<Globe size={18} />}
                                />
                                <CustomInput
                                    label="Município"
                                    value={isEditing ? formData?.municipio : infraestrutura.municipio || ''}
                                    onChange={v => handleChange('municipio', v)}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />}
                                />
                                <CustomInput
                                    label="Comuna"
                                    value={isEditing ? formData?.comuna : infraestrutura.comuna || ''}
                                    onChange={v => handleChange('comuna', v)}
                                    disabled={!isEditing}
                                    iconStart={<Home size={18} />}
                                />
                                <CustomInput
                                    label="Aldeia/Zona"
                                    value={isEditing ? formData?.aldeia_Zona : infraestrutura.aldeia_Zona || ''}
                                    onChange={v => handleChange('aldeia_Zona', v)}
                                    disabled={!isEditing}
                                    iconStart={<Home size={18} />}
                                />
                            </div>
                            <div className="mt-4">
                                <CustomInput
                                    label="Coordenadas GPS"
                                    value={isEditing ? formData?.coordenadas_GPS : infraestrutura.coordenadas_GPS || ''}
                                    onChange={v => handleChange('coordenadas_GPS', v)}
                                    disabled={!isEditing}
                                    placeholder="Ex: -8.838333 13.234444 100 5"
                                    iconStart={<Navigation size={18} />}
                                />
                                <div className="text-xs text-gray-500 mt-1 pl-2">
                                    Formato: latitude longitude [altitude] [precisão]
                                </div>
                            </div>
                        </div>

                        {/* Características Técnicas */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Wrench className="w-4 h-4 text-purple-500" /> Características Técnicas
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label="Dimensão"
                                    value={isEditing ? formData?.dimens_o_m_ha_km_etc : infraestrutura.dimens_o_m_ha_km_etc || ''}
                                    onChange={v => handleChange('dimens_o_m_ha_km_etc', v)}
                                    disabled={!isEditing}
                                    placeholder="Ex: 100 m², 50 ha"
                                    iconStart={<Gauge size={18} />}
                                />
                                <CustomInput
                                    label="Capacidade"
                                    value={isEditing ? formData?.capacidade_ex_litr_mero_de_utilizadores : infraestrutura.capacidade_ex_litr_mero_de_utilizadores || ''}
                                    onChange={v => handleChange('capacidade_ex_litr_mero_de_utilizadores', v)}
                                    disabled={!isEditing}
                                    placeholder="Ex: 1000 litros, 200 utilizadores"
                                    iconStart={<Users size={18} />}
                                />
                            </div>
                            <div className="mt-4">
                                <CustomInput
                                    label="Estado de Conservação"
                                    type={isEditing ? "select" : "text"}
                                    value={isEditing ?
                                        (typeof formData?.estado_de_Conserva_o === 'object' ?
                                            formData.estado_de_Conserva_o :
                                            estadosConservacao.find(e => e.value.toLowerCase() === formData?.estado_de_Conserva_o?.toLowerCase())
                                        ) : formatEstadoConservacao(infraestrutura.estado_de_Conserva_o)
                                    }
                                    options={estadosConservacao}
                                    onChange={v => handleChange('estado_de_Conserva_o', v)}
                                    disabled={!isEditing}
                                    iconStart={<Wrench size={18} />}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Coluna Direita */}
                    <div className="space-y-6">
                        {/* Entidade Responsável */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-4 h-4 text-green-600" /> Entidade Responsável
                            </h3>
                            <div className="space-y-4">
                                <CustomInput
                                    label="Proprietário/Instituição Gestora"
                                    value={isEditing ? formData?.propriet_rio_Institui_o_Gestora : infraestrutura.propriet_rio_Institui_o_Gestora || ''}
                                    onChange={v => handleChange('propriet_rio_Institui_o_Gestora', v)}
                                    disabled={!isEditing}
                                    iconStart={<Building size={18} />}
                                />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomInput
                                        label="Contacto"
                                        value={isEditing ? formData?.contacto : infraestrutura.contacto || ''}
                                        onChange={v => handleChange('contacto', v)}
                                        disabled={!isEditing}
                                        iconStart={<Phone size={18} />}
                                    />
                                    <CustomInput
                                        label="E-mail"
                                        type="email"
                                        value={isEditing ? formData?.e_mail : infraestrutura.e_mail || ''}
                                        onChange={v => handleChange('e_mail', v)}
                                        disabled={!isEditing}
                                        iconStart={<Mail size={18} />}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Utilização */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-orange-600" /> Utilização
                            </h3>
                            <div className="space-y-4">
                                <CustomInput
                                    label="Beneficiários Directos"
                                    value={isEditing ? formData?.benefici_rios_Directos : infraestrutura.benefici_rios_Directos || ''}
                                    onChange={v => handleChange('benefici_rios_Directos', v)}
                                    disabled={!isEditing}
                                    placeholder="Número ou descrição dos beneficiários"
                                    iconStart={<Users size={18} />}
                                />
                                <CustomInput
                                    label="Principais Culturas/Actividades Apoiadas"
                                    type="textarea"
                                    value={isEditing ? formData?.principais_Culturas_Actividades_Apoiada : infraestrutura.principais_Culturas_Actividades_Apoiada || ''}
                                    onChange={v => handleChange('principais_Culturas_Actividades_Apoiada', v)}
                                    disabled={!isEditing}
                                    placeholder="Descreva as principais culturas ou atividades..."
                                    iconStart={<Activity size={18} />}
                                />
                                <CustomInput
                                    label="Frequência de Utilização"
                                    type={isEditing ? "select" : "text"}
                                    value={isEditing ?
                                        (typeof formData?.frequ_ncia_de_Utiliza_o === 'object' ?
                                            formData.frequ_ncia_de_Utiliza_o :
                                            frequenciasUtilizacao.find(f => f.value.toLowerCase() === formData?.frequ_ncia_de_Utiliza_o?.toLowerCase())
                                        ) : (infraestrutura.frequ_ncia_de_Utiliza_o || '')
                                    }
                                    options={frequenciasUtilizacao}
                                    onChange={v => handleChange('frequ_ncia_de_Utiliza_o', v)}
                                    disabled={!isEditing}
                                    iconStart={<Calendar size={18} />}
                                />
                            </div>
                        </div>

                        {/* Localização GPS */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-blue-600" /> Localização GPS
                            </h3>
                            <div className="flex flex-col items-center">
                                <div className="w-full mb-4 flex flex-col items-center justify-center">
                                    <div className="w-full min-h-[180px] flex flex-col items-center justify-center border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 text-center">
                                        <Map className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                        <div className="text-blue-800 font-semibold text-lg">
                                            {infraestrutura.nome_da_Infraestrutura || 'INFRAESTRUTURA'}
                                        </div>
                                        <div className="text-blue-700 text-sm">
                                            Lat: {coords.lat}°, Lng: {coords.lng}°
                                        </div>
                                        <div className="text-blue-400 text-xs mt-2">O mapa será carregado aqui</div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-2 text-sm text-gray-700 mb-1 mt-2">
                                    <div className="flex justify-between">
                                        <span>Latitude:</span>
                                        <span className="font-medium">{coords.lat}°</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Longitude:</span>
                                        <span className="font-medium">{coords.lng}°</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Altitude:</span>
                                        <span className="font-medium">{coords.alt}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Precisão:</span>
                                        <span className="font-medium">{coords.precision}</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${coords.lat},${coords.lng}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center border border-blue-100"
                                >
                                    <Navigation className="w-4 h-4 mr-2" />
                                    Ver no Google Maps
                                </a>
                            </div>
                        </div>

                        {/* Observações */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <FileText className="w-4 h-4 text-gray-600" /> Observações
                            </h3>
                            <CustomInput
                                label="Observações Gerais"
                                type="textarea"
                                value={isEditing ? formData?._6_Observa_es_Gerais : infraestrutura._6_Observa_es_Gerais || ''}
                                onChange={v => handleChange('_6_Observa_es_Gerais', v)}
                                disabled={!isEditing}
                                placeholder="Informações adicionais sobre a infraestrutura..."
                                iconStart={<Info size={18} />}
                            />
                        </div>
                    </div>
                </div>

                {/* Informações do Sistema */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-500" /> Informações do Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-gray-500">ID do Sistema:</div>
                            <div className="font-medium text-gray-900">{infraestrutura._id || '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-500">Data de Registro:</div>
                            <div className="font-medium text-gray-900">
                                {infraestrutura.data_de_Registo ?
                                    new Date(infraestrutura.data_de_Registo).toLocaleDateString('pt-BR') :
                                    '--'
                                }
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500">Tipo:</div>
                            <div className="font-medium text-gray-900">
                                {formatTipoInfraestrutura(infraestrutura.tipo_de_Infraestrutura)}
                            </div>
                        </div>
                        <div>
                            <div className="text-gray-500">Estado Conservação:</div>
                            <div className="font-medium text-gray-900">
                                {formatEstadoConservacao(infraestrutura.estado_de_Conserva_o)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Modal de cancelamento */}
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
                                    className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                                >
                                    Sim, cancelar
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default VisualizarInfraestrutura;