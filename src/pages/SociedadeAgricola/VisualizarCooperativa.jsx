import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    ArrowLeft,
    Calendar,
    MapPin,
    User,
    Phone,
    Download,
    CheckCircle,
    AlertTriangle,
    X,
    AlertCircle,
    FileText,
    Tractor,
    Activity,
    Info,
    Users,
    SquarePen,
    Building,
    CreditCard,
    Briefcase,
    Mail,
    UserCheck,
    Map,
    Navigation,
    BarChart2,
    Save
} from 'lucide-react';
import api from '../../services/api';
import CustomInput from '../../components/CustomInput';
import { useCooperativa } from '../../hooks/useCooperativa';
import axios from 'axios';
import provinciasData from '../../components/Provincias.json';

// Toast deve ser definido fora do componente principal
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

const VisualizarCooperativa = () => {
    // TODOS os hooks devem estar aqui, ANTES de qualquer return condicional
    const { id } = useParams();
    const navigate = useNavigate();
    const [cooperativa, setCooperativa] = useState(null);
    const [loadingCooperativa, setLoadingCooperativa] = useState(true);
    const [erroCooperativa, setErroCooperativa] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [estado, setEstado] = useState('Ativo');
    const estadoOptions = [
        { value: 'Ativo', label: 'Ativo' },
        { value: 'Inativo', label: 'Inativo' },
    ];
    const { updateCooperativa } = useCooperativa();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [consultingNif, setConsultingNif] = useState(false);
    const [nifData, setNifData] = useState(null);
    const atividadesOptions = [
        { value: 'PRODUCAO_AGRICOLA', label: 'Produção Agrícola' },
        { value: 'PRODUCAO_PECUARIA', label: 'Produção Pecuária' },
        { value: 'AGROINDUSTRIA', label: 'Agroindústria' },
        { value: 'COMERCIALIZACAO', label: 'Comercialização' },
        { value: 'ASSISTENCIA_TECNICA', label: 'Assistência Técnica' },
        { value: 'OUTROS', label: 'Outros' },
    ];
    const [provinciaOptions, setProvinciaOptions] = useState([]);
    const [municipioOptions, setMunicipioOptions] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (cooperativa && cooperativa.estado) {
            setEstado(cooperativa.estado);
        }
    }, [cooperativa]);

    useEffect(() => {
        const fetchCooperativa = async () => {
            if (!id) {
                setLoadingCooperativa(false);
                setErroCooperativa('ID da cooperativa não informado.');
                return;
            }
            setLoadingCooperativa(true);
            setErroCooperativa(null);
            try {
                const response = await api.get(`/cooperativa/${id}`);
                setCooperativa(response.data);
            } catch (error) {
                setErroCooperativa('Erro ao buscar dados da cooperativa.');
                console.error('Erro ao buscar cooperativa:', error);
            } finally {
                setLoadingCooperativa(false);
            }
        };
        fetchCooperativa();
    }, [id]);

    useEffect(() => {
        if (cooperativa) setFormData(cooperativa);
    }, [cooperativa]);

    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    useEffect(() => {
        const provs = provinciasData.map(p => ({ value: p.nome, label: p.nome }));
        setProvinciaOptions(provs);
    }, []);

    useEffect(() => {
        let municipios = [];
        if (formData && formData.provincia) {
            const provs = Array.isArray(formData.provincia)
                ? formData.provincia
                : [formData.provincia];
            provs.forEach(provObj => {
                const provNome = provObj.value || provObj;
                const prov = provinciasData.find(p => p.nome === provNome);
                if (prov && prov.municipios) {
                    try {
                        const munArr = Array.isArray(prov.municipios)
                            ? prov.municipios
                            : JSON.parse(prov.municipios);
                        municipios = municipios.concat(
                            munArr.map(m => ({ value: m, label: m }))
                        );
                    } catch (e) {
                        console.error('Erro ao processar municípios da província', provNome, e);
                    }
                }
            });
        }
        setMunicipioOptions(municipios);
    }, [formData?.provincia, provinciasData]);

    // Função para mostrar toast
    const showToast = (type, title, message, duration = 5000) => {
        console.log(`💬 Toast ${type}:`, title, '-', message);

        if (toastTimeout) {
            clearTimeout(toastTimeout);
        }

        setToastMessage({ type, title, message });

        const timeout = setTimeout(() => {
            setToastMessage(null);
        }, duration);

        setToastTimeout(timeout);
    };

    // Cleanup do timeout quando component desmonta
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Voltar
    const handleBack = () => {
        navigate(-1);
    };

    // Função para consultar NIF na API
    const consultarNIF = async (nifValue) => {
        if (!nifValue || nifValue.length < 9) return;
        setConsultingNif(true);
        try {
            const username = 'minagrif';
            const password = 'Nz#$20!23Mg';
            const credentials = btoa(`${username}:${password}`);
            const response = await axios.get(`https://api.gov.ao/nif/v1/consultarNIF`, {
                params: {
                    tipoDocumento: 'NIF',
                    numeroDocumento: nifValue
                },
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = response.data;
            if (response.status === 200 && data.code === 200 && data.data) {
                const nifInfo = data.data;
                setNifData(nifInfo);
                setFormData(prev => ({
                    ...prev,
                    nomeCooperativa: nifInfo.nome_contribuinte || '',
                    email: nifInfo.email || '',
                    telefone: nifInfo.numero_contacto || '',
                    dataFundacao: nifInfo.data_constituicao ? new Date(nifInfo.data_constituicao).toISOString().split('T')[0] : '',
                    provincia: nifInfo.provincia_morada || '',
                    municipio: nifInfo.municipio_morada || '',
                    comuna: nifInfo.comuna_morada || '',
                }));
                showToast('success', 'NIF Consultado', 'Dados da cooperativa preenchidos automaticamente!');
            } else {
                setNifData(null);
                if (data.code === 404) {
                    showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF. Preencha manualmente.');
                } else {
                    showToast('warn', 'NIF inválido', 'Este NIF não retornou dados válidos. Verifique o número.');
                }
            }
        } catch (error) {
            setNifData(null);
            if (error.response) {
                showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
            } else if (error.request) {
                showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
            }
        } finally {
            setConsultingNif(false);
        }
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        setFormData(cooperativa); // Reverte para os dados originais
        setShowCancelModal(false);
        showToast('info', 'Edição cancelada', 'Alterações descartadas');
    };

    // Se não tem id, mostrar erro (após hooks)
    if (!id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Toast toastMessage={toastMessage} onClose={() => setToastMessage(null)} />
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6">ID da cooperativa não informado</p>
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

    // Renderização condicional para carregamento e erro (após hooks)
    if (loadingCooperativa) {
        return <div className="min-h-screen flex items-center justify-center text-xl">Carregando cooperativa...</div>;
    }
    if (erroCooperativa) {
        return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{erroCooperativa}</div>;
    }
    if (!cooperativa) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">Cooperativa não encontrada.</div>;
    }

    const handleEdit = () => setIsEditing(true);
    const handleCancel = () => {
        setShowCancelModal(true);
    };
    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };
    const handleSave = async () => {
        try {
            await updateCooperativa(cooperativa.id, formData);
            showToast('success', 'Cooperativa atualizada', 'Os dados foram salvos com sucesso!');
            // Recarregar dados da cooperativa após salvar
            const response = await api.get(`/cooperativa/${cooperativa.id}`);
            setCooperativa(response.data);
            setIsEditing(false);
        } catch (e) {
            showToast('error', 'Erro ao salvar', 'Não foi possível atualizar a cooperativa.');
            console.error('Erro ao salvar cooperativa:', e);
        }
    };

    // Função para atualizar estado via PATCH
    const handleUpdateEstado = async (novoEstado) => {
        try {
            await api.patch(`/cooperativa/estado`, {
                id: cooperativa.id,
                estado: novoEstado
            });
            setEstado(novoEstado);
            setCooperativa(prev => ({ ...prev, estado: novoEstado }));
            showToast('success', 'Estado atualizado', `Estado da cooperativa alterado para ${novoEstado}`);
        } catch (error) {
            showToast('error', 'Erro ao atualizar estado', 'Não foi possível atualizar o estado da cooperativa.');
            console.error('Erro ao atualizar estado:', error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 md:p-8">
            <Toast toastMessage={toastMessage} onClose={() => setToastMessage(null)} />
            <div className="w-full max-w-6xl">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-gray-100 text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
                            <div className='flex flex-col'>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Editando Cooperativa' : 'Detalhes da Cooperativa'}
                                </h2>
                                <div className="text-gray-600">ID: {cooperativa.id || '--'} &bull; NIF: {cooperativa.nif || '--'}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center mt-2">
                            <span
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border 
                                    ${estado === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                    ${estado === 'Inativo' ? 'bg-gray-100 text-gray-500 border-gray-300' : ''}
                                                    `}
                            >
                                {estado === 'Ativo' && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                                {estado === 'Inativo' && <X className="w-4 h-4 mr-1 text-gray-400" />}
                                {estado}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700"><BarChart2 className="w-4 h-4 mr-1" />  Cooperativa Registrada</span>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                        {isEditing ? (
                            <div className="flex gap-3 w-full" key="editando">
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                >
                                    <X className="w-5 h-5" /> Cancelar
                                </button>
                                <button
                                    onClick={() => consultarNIF(formData?.nif)}
                                    disabled={consultingNif || !formData?.nif || formData.nif.length < 9}
                                    className={`flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base ${consultingNif ? 'opacity-60 cursor-not-allowed' : ''}`}
                                >
                                    <CreditCard className="w-5 h-5" /> {consultingNif ? 'Consultando...' : 'Consultar NIF'}
                                </button>
                                <button
                                    onClick={handleSave}
                                    className="flex items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                >
                                    <Save className="w-5 h-5" /> Salvar
                                </button>
                            </div>
                        ) : (
                            <div className="flex gap-3 w-full" key="visualizando">
                                <button
                                    onClick={handleEdit}
                                    className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                >
                                    <SquarePen className="w-5 h-5" /> Editar
                                </button>
                                <button
                                    className="flex h-[45px]  items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base"
                                >
                                    <Download className="w-5 h-5" /> Relatório
                                </button>
                                <div className="min-w-[160px]">
                                    <CustomInput
                                        type="select"
                                        label=""
                                        value={estadoOptions.find(opt => opt.value === estado)}
                                        options={estadoOptions}
                                        onChange={opt => handleUpdateEstado(opt.value)}
                                        iconStart={<Activity size={18} />}
                                        className="!mb-0"
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Grid principal */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="space-y-6">
                        {/* Informações Básicas */}
                        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Building className="w-4 h-4 text-blue-600" /> Informações Básicas</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput
                                    label="Nome da Cooperativa"
                                    value={isEditing ? formData?.nomeCooperativa : cooperativa.nomeCooperativa || ''}
                                    onChange={v => handleChange('nomeCooperativa', v)}
                                    disabled={!isEditing}
                                    iconStart={<Building size={18} />}
                                />
                                <CustomInput
                                    label="Sigla"
                                    value={isEditing ? formData?.sigla : cooperativa.sigla || ''}
                                    onChange={v => handleChange('sigla', v)}
                                    disabled={!isEditing}
                                    iconStart={<FileText size={18} />}
                                />
                                <CustomInput
                                    label="NIF"
                                    value={isEditing ? formData?.nif : cooperativa.nif || ''}
                                    onChange={v => handleChange('nif', v)}
                                    disabled={!isEditing}
                                    iconStart={<CreditCard size={18} />}
                                />
                                <div>
                                    <CustomInput
                                        label="Data da Fundação"
                                        value={isEditing ? formData?.dataFundacao : cooperativa.dataFundacao ? new Date(cooperativa.dataFundacao).toISOString().split('T')[0] : ''}
                                        onChange={v => handleChange('dataFundacao', v)}
                                        disabled={!isEditing}
                                        type="date"
                                        iconStart={<Calendar size={18} />}
                                    />
                                    {cooperativa.dataFundacao && (
                                        <div className="text-xs text-gray-500 mt-1 pl-2">Fundada em: {new Date(cooperativa.dataFundacao).toLocaleDateString('pt-BR')}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Informações de Contato */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Informações de Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput label="Telefone" value={isEditing ? formData?.telefone : cooperativa.telefone || ''} onChange={v => handleChange('telefone', v)} disabled={!isEditing} iconStart={<Phone size={18} />} />
                                <CustomInput label="E-mail" value={isEditing ? formData?.email : cooperativa.email || ''} onChange={v => handleChange('email', v)} disabled={!isEditing} iconStart={<Mail size={18} />} />
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
                                    value={isEditing ? formData?.provincia : cooperativa.provincia || ''}
                                    onChange={v => handleChange('provincia', v)}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />}
                                />
                                <CustomInput
                                    label="Município"
                                    value={isEditing ? formData?.municipio : cooperativa.municipio || ''}
                                    onChange={v => handleChange('municipio', v)}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />}
                                />
                            </div>
                            <div className="mt-4">
                                <CustomInput label="Comuna" value={isEditing ? formData?.comuna : cooperativa.comuna || ''} onChange={v => handleChange('comuna', v)} disabled={!isEditing} iconStart={<Building size={18} />} />
                            </div>
                        </div>
                        {/* Representantes Legais */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <UserCheck className="w-4 h-4 text-purple-500" /> Representantes Legais
                            </h3>
                            {/* Presidente */}
                            <div className="mb-6 p-4 rounded-xl bg-blue-50 border border-blue-200">
                                <div className="text-lg font-semibold text-blue-700 mb-4">Presidente</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomInput label="Nome" value={isEditing ? formData?.nomePresidente : cooperativa.nomePresidente || ''} onChange={v => handleChange('nomePresidente', v)} disabled={!isEditing} iconStart={<User size={18} />} />
                                    <CustomInput label="BI" value={isEditing ? formData?.biPresidente : cooperativa.biPresidente || ''} onChange={v => handleChange('biPresidente', v)} disabled={!isEditing} iconStart={<CreditCard size={18} />} />
                                    <CustomInput label="Número Produtor" value={isEditing ? formData?.numeroProdutor : cooperativa.numeroProdutor || ''} onChange={v => handleChange('numeroProdutor', v)} disabled={!isEditing} iconStart={<FileText size={18} />} />
                                    <CustomInput label="Telefone" value={isEditing ? formData?.telefonePresidente : cooperativa.telefonePresidente || ''} onChange={v => handleChange('telefonePresidente', v)} disabled={!isEditing} iconStart={<Phone size={18} />} />
                                    <div className="md:col-span-2">
                                        <CustomInput label="E-mail" value={isEditing ? formData?.emailPresidente : cooperativa.emailPresidente || ''} onChange={v => handleChange('emailPresidente', v)} disabled={!isEditing} iconStart={<Mail size={18} />} />
                                    </div>
                                </div>
                            </div>
                            {/* Secretário(a) */}
                            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                <div className="text-lg font-semibold text-green-700 mb-4">Secretário(a)</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomInput label="Nome" value={isEditing ? formData?.nomeSecretario : cooperativa.nomeSecretario || ''} onChange={v => handleChange('nomeSecretario', v)} disabled={!isEditing} iconStart={<User size={18} />} />
                                    <CustomInput label="Número do BI" value={isEditing ? formData?.nifSecretario : cooperativa.nifSecretario || ''} onChange={v => handleChange('nifSecretario', v)} disabled={!isEditing} iconStart={<CreditCard size={18} />} />
                                    <CustomInput label="Telefone" value={isEditing ? formData?.telefoneSecretario : cooperativa.telefoneSecretario || ''} onChange={v => handleChange('telefoneSecretario', v)} disabled={!isEditing} iconStart={<Phone size={18} />} />
                                    <CustomInput label="E-mail" value={isEditing ? formData?.emailSecretario : cooperativa.emailSecretario || ''} onChange={v => handleChange('emailSecretario', v)} disabled={!isEditing} iconStart={<Mail size={18} />} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">

                        {/* Quadro Social */}
                        <div className="bg-white rounded-lg shadow p-4 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-orange-500" /> Quadro Social</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput label="Número de Cooperados" value={isEditing ? formData?.numeroCooperados : cooperativa.numeroCooperados || ''} onChange={v => handleChange('numeroCooperados', v)} disabled={!isEditing} iconStart={<Users size={18} />} />
                                <CustomInput label="Número de Empregados" value={isEditing ? formData?.numeroEmpregados : cooperativa.numeroEmpregados || ''} onChange={v => handleChange('numeroEmpregados', v)} disabled={!isEditing} iconStart={<Briefcase size={18} />} />
                            </div>
                            <div className="mt-4">
                                <CustomInput
                                    label="Perfil dos Cooperados"
                                    value={isEditing ? formData?.perfilCooperados : cooperativa.perfilCooperados || ''}
                                    onChange={v => handleChange('perfilCooperados', v)}
                                    disabled={!isEditing}
                                    iconStart={<FileText size={18} />}
                                    type="textarea"
                                    placeholder="Descreva o perfil dos cooperados..."
                                />
                            </div>
                        </div>
                        {/* Atividades da Cooperativa */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Activity className="w-4 h-4 text-green-600" /> Atividades da Cooperativa
                            </h3>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Principais Atividades</label>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.atividades || []).map(a => atividadesOptions.find(opt => opt.value === a) || { value: a, label: a })}
                                        options={atividadesOptions}
                                        onChange={opts => handleChange('atividades', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(cooperativa.atividades || []).length > 0 ? (
                                            cooperativa.atividades.map((atividade, idx) => {
                                                const atividadeLabel = atividadesOptions.find(opt => opt.value === atividade)?.label || atividade;
                                                return (
                                                    <span key={idx} className="bg-green-50 border border-green-200 text-green-800 rounded px-3 py-1 text-sm font-medium">
                                                        {atividadeLabel}
                                                    </span>
                                                );
                                            })
                                        ) : (
                                            <span className="text-gray-400">Nenhuma atividade cadastrada</span>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Outras Atividades</label>
                                <CustomInput
                                    label=""
                                    value={isEditing ? formData?.outrasAtividades : cooperativa.outrasAtividades || ''}
                                    onChange={v => handleChange('outrasAtividades', v)}
                                    disabled={!isEditing}
                                    placeholder="Descreva outras atividades..."
                                    iconStart={<FileText size={18} />}
                                    type="textarea"
                                />
                            </div>
                        </div>

                        {/* Equipamentos e Infraestrutura */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Tractor className="w-4 h-4 text-yellow-600" /> Equipamentos e Infraestrutura</h3>
                            <div className="mb-4">
                                <CustomInput
                                    label="Possui Equipamentos"
                                    type="select"
                                    value={isEditing ? { value: formData?.possuiEquipamentos, label: formData?.possuiEquipamentos } : { value: cooperativa.possuiEquipamentos, label: cooperativa.possuiEquipamentos }}
                                    options={[
                                        { value: 'true', label: 'Sim' },
                                        { value: 'false', label: 'Não' }
                                    ]}
                                    onChange={opt => handleChange('possuiEquipamentos', opt.value)}
                                    disabled={!isEditing}
                                />
                            </div>

                            {/* Equipamentos Agrícolas */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Equipamentos Agrícolas</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.equipamentosAgricolas || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'TRATORES', label: 'Tratores' },
                                            { value: 'ENXADAS_ROTATIVAS', label: 'Enxadas Rotativas' },
                                            { value: 'PLANTADEIRAS', label: 'Plantadeiras' },
                                            { value: 'PULVERIZADORES', label: 'Pulverizadores' },
                                            { value: 'COLHEITADEIRAS', label: 'Colheitadeiras' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosAgricolas', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(cooperativa.equipamentosAgricolas || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item === 'TRATORES' ? 'Tratores' :
                                                    item === 'ENXADAS_ROTATIVAS' ? 'Enxadas Rotativas' :
                                                        item === 'PLANTADEIRAS' ? 'Plantadeiras' :
                                                            item === 'PULVERIZADORES' ? 'Pulverizadores' :
                                                                item === 'COLHEITADEIRAS' ? 'Colheitadeiras' : item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Equipamentos de Infraestrutura */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Equipamentos de Infraestrutura</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.equipamentosInfraestrutura || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'SISTEMAS_IRRIGACAO', label: 'Sistemas de Irrigação' },
                                            { value: 'BOMBAS_AGUA', label: 'Bombas de Água' },
                                            { value: 'RESERVATORIOS', label: 'Reservatórios' },
                                            { value: 'ESTUFAS', label: 'Estufas' },
                                            { value: 'GALPOES', label: 'Galpões' },
                                            { value: 'SILOS', label: 'Silos' },
                                            { value: 'TANQUES_LEITE', label: 'Tanques de Leite' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosInfraestrutura', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(cooperativa.equipamentosInfraestrutura || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item === 'SISTEMAS_IRRIGACAO' ? 'Sistemas de Irrigação' :
                                                    item === 'BOMBAS_AGUA' ? 'Bombas de Água' :
                                                        item === 'RESERVATORIOS' ? 'Reservatórios' :
                                                            item === 'ESTUFAS' ? 'Estufas' :
                                                                item === 'GALPOES' ? 'Galpões' :
                                                                    item === 'SILOS' ? 'Silos' :
                                                                        item === 'TANQUES_LEITE' ? 'Tanques de Leite' : item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Outros equipamentos seguindo o mesmo padrão... */}
                            {/* Materiais de Produção */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Materiais de Produção</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.materiaisProducao || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Ferramentas Manuais */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Ferramentas Manuais</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.ferramentasManuais || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Equipamentos de Medição */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Equipamentos de Medição</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.equipamentosMedicao || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Materiais de Higiene */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Materiais de Higiene</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.materiaisHigiene || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Materiais de Escritório */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Materiais de Escritório</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.materiaisEscritorio || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Equipamentos de Transporte */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Equipamentos de Transporte</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.equipamentosTransporte || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>

                            {/* Equipamentos Pecuários */}
                            <div className="mb-4">
                                <div className="text-sm font-medium text-gray-700 mb-2">Equipamentos Pecuários</div>
                                <div className="flex flex-wrap gap-2">
                                    {(cooperativa.equipamentosPecuarios || []).map((item, idx) => (
                                        <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">{item}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Localização GPS */}
                        <div className="bg-white rounded-lg shadow p-6 border flex flex-col">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Map className="w-5 h-5 text-blue-600" /> <span className="font-bold">Localização GPS</span>
                            </h3>
                            <div className="flex flex-col items-center">
                                <div className="w-full mb-4 flex flex-col items-center justify-center">
                                    <div className="w-full min-h-[180px] flex flex-col items-center justify-center border-2 border-dashed border-blue-300 bg-blue-50 rounded-lg p-6 text-center">
                                        <Map className="w-12 h-12 text-blue-500 mx-auto mb-2" />
                                        <div className="text-blue-800 font-semibold text-lg">{cooperativa.nomeCooperativa || 'COOPERATIVA DE EXEMPLO'}</div>
                                        <div className="text-blue-700 text-sm">Lat: {cooperativa.latitude || '--'}°, Lng: {cooperativa.longitude || '--'}°</div>
                                        <div className="text-blue-400 text-xs mt-2">O mapa será carregado aqui</div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-2 text-sm text-gray-700 mb-1 mt-2">
                                    <div className=" flex justify-between">
                                        <span>Latitude:</span>
                                        <span className="font-medium">{cooperativa.latitude || '--'}°</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Longitude:</span>
                                        <span className="font-medium">{cooperativa.longitude || '--'}°</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${cooperativa.latitude || ''},${cooperativa.longitude || ''}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full mt-2 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm flex items-center justify-center border border-blue-100"
                                >
                                    <span className="mr-2"><Navigation className="w-4 h-4" /></span> Ver no Google Maps
                                </a>
                            </div>
                        </div>

                    </div>
                </div>
                {/* Card Informações do Sistema */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-8 ">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-gray-500" /> Informações do Sistema
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                        <div>
                            <div className="text-gray-900">Sistema de identificação:</div>
                            <div className="font-medium text-gray-900">{cooperativa.id || '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-900">Data de Fundação:</div>
                            <div className="font-medium text-gray-900">{cooperativa.dataFundacao ? new Date(cooperativa.dataFundacao).toLocaleDateString('pt-BR') : '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-900">Estado atual:</div>
                            <div className="font-medium text-gray-900">{estado || '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-900">Última atualização:</div>
                            <div className="font-medium text-gray-900">{cooperativa.ultimaAtualizacao ? new Date(cooperativa.ultimaAtualizacao).toLocaleDateString('pt-BR') : '--'}</div>
                        </div>
                    </div>
                </div>

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
                                    className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 text-white rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
                                >
                                    Sim, cancelar
                                </button>
                                <button
                                    onClick={() => setShowCancelModal(false)}
                                    className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 focus:ring-2 focus:ring-gray-400 focus:ring-offset-2 text-gray-700 rounded-lg transition-all duration-200 transform hover:-translate-y-0.5"
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

export default VisualizarCooperativa;