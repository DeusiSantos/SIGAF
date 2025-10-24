import {
    Activity,
    AlertCircle,
    AlertTriangle,
    ArrowLeft,
    BarChart2,
    Briefcase,
    Building,
    Calendar,
    CheckCircle,
    CreditCard,
    Download,
    FileText,
    Info,
    Mail,
    Map,
    MapPin,
    Navigation,
    Phone,
    Save,
    SquarePen,
    Tractor,
    User,
    UserCheck,
    Users,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';



import axios from 'axios';
import { RefreshCw } from 'lucide-react';
import CustomInput from '../core/components/CustomInput';
import provinciasData from '../core/components/Provincias.json';
import api from '../core/services/api';
import { useOrganizacao } from '../hooks/useOrganizacao';

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

const VisualizarOrganizacao = () => {
    // TODOS os hooks devem estar aqui, ANTES de qualquer return condicional
    const { id } = useParams();
    const navigate = useNavigate();
    const [associacao, setAssociacao] = useState(null);
    const [loadingAssociacao, setLoadingAssociacao] = useState(true);
    const [erroAssociacao, setErroAssociacao] = useState(null);
    const [toastMessage, setToastMessage] = useState(null);
    const [toastTimeout, setToastTimeout] = useState(null);
    const [status, setStatus] = useState('ATIVO');
    const statusOptions = [
        { value: 'Ativo', label: 'Activo' },
        { value: 'Inativo', label: 'Inativo' },
    ];
    const { updateAssociacaoRural } = useOrganizacao();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [consultingNif, setConsultingNif] = useState(false);
    const [nifData, setNifData] = useState(null);
    const atividadesOptions = [
        { value: 'Produção Agrícola', label: 'Produção Agrícola' },
        { value: 'Produção Pecuária', label: 'Produção Pecuária' },
        { value: 'Agroindústria', label: 'Agroindústria' },
        { value: 'Comercialização', label: 'Comercialização' },
        { value: 'Assistência Técnica', label: 'Assistência Técnica' },
        { value: 'Outras', label: 'Outras' },
    ];
    const [provinciaOptions, setProvinciaOptions] = useState([]);
    const [municipioOptions, setMunicipioOptions] = useState([]);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [estado, setEstado] = useState('ATIVO');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatusValue, setPendingStatusValue] = useState(null);

    useEffect(() => {
        if (associacao && associacao.status) {
            setStatus(associacao.status);
            setEstado(associacao.status); // Sincroniza estado local
        }
    }, [associacao]);

    useEffect(() => {
        const fetchAssociacao = async () => {
            if (!id) {
                setLoadingAssociacao(false);
                setErroAssociacao('ID da associação não informado.');
                return;
            }
            setLoadingAssociacao(true);
            setErroAssociacao(null);
            try {
                const response = await api.get(`/organizacao/${id}`);
                setAssociacao(response.data);
            } catch (error) {
                setErroAssociacao('Erro ao buscar dados da associação.');
            } finally {
                setLoadingAssociacao(false);
            }
        };
        fetchAssociacao();
    }, [id]);

    useEffect(() => {
        if (associacao) setFormData(associacao);
    }, [associacao]);

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

    const handleStatusSelect = (opt) => {
        setPendingStatusValue(opt);
        setShowStatusModal(true);
    };

    const confirmStatusChange = async () => {
        if (!pendingStatusValue) return;
        await handleUpdateEstado(pendingStatusValue.value);
        setShowStatusModal(false);
        setPendingStatusValue(null);
    };
    // Timeout de segurança para evitar loading infinito
    // Remover completamente o useEffect do timeout

    // Cleanup do timeout quando component desmonta
    useEffect(() => {
        return () => {
            if (toastTimeout) {
                clearTimeout(toastTimeout);
            }
        };
    }, [toastTimeout]);

    // Voltar para gestão de certificados
    const handleBack = () => {
        // Remover navegação para cooperativas
        // Removido: navigate('/GerenciaSIGAF/entidades-associativas/cooperativas');
    };

    // Selecionar/deselecionar certificado para impressão
    // Remover: const handleSelectCertificado = (certificadoId) => { ... };
    // Remover: const handleSelectAll = () => { ... };
    // Remover: const handlePrint = () => { ... };

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


    const handleUpdateEstado = async (novoEstado) => {
        try {
            const formData = new FormData();
            formData.append('id', id);
            formData.append('estado', novoEstado);

            await api.patch(`/organizacao/estado`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            setEstado(novoEstado); // Corrigido: agora existe
            setAssociacao(prev => ({ ...prev, status: novoEstado }));
            showToast('success', 'Estado atualizado', `Estado da associação alterado para ${novoEstado}`);
        } catch (error) {
            showToast('error', 'Erro ao atualizar estado', 'Não foi possível atualizar o estado da associação.');
            console.error('Erro ao atualizar estado:', error);
        }
    };

    // Formatar data
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const date = new Date(dateString);
        return date.toLocaleDateString('pt-BR');
    };

    // Calcular dias restantes para vencimento
    const getDaysToExpiry = (validoAte) => {
        if (!validoAte) return null;
        const hoje = new Date();
        const dataFim = new Date(validoAte);
        const diffTime = dataFim - hoje;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        setFormData(associacao); // Reverte para os dados originais
        setShowCancelModal(false);
        showToast('info', 'Edição cancelada - Alterações descartadas');
    };

    // Cores para diferentes status
    const getStatusColor = (status) => {
        const statusColors = {
            'ATIVO': 'bg-blue-100 text-blue-800 border-blue-300',
            'EXPIRADO': 'bg-red-100 text-red-800 border-red-300',
            'PROXIMO_VENCIMENTO': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'AGUARDANDO_VIGENCIA': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return statusColors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Labels para status
    const getStatusLabel = (status) => {
        const statusLabels = {
            'ATIVO': 'Ativo',
            'EXPIRADO': 'Expirado',
            'PROXIMO_VENCIMENTO': 'Próximo ao Vencimento',
            'AGUARDANDO_VIGENCIA': 'Aguardando Vigência'
        };
        return statusLabels[status] || status;
    };

    // Componente Toast
    // Remover variáveis e estados não usados
    // Remover: const isLoading = loadingProdutor || (loadingAllCertificados && !certificadosInitialized);
    // Remover: const isLoadingCertificados = loadingCertificados || (loadingAllCertificados && !certificadosInitialized);
    // Remover: useEffect de timeout de certificados
    // Remover: funções handleSelectCertificado, handleSelectAll, handlePrint
    // Remover: qualquer referência a selectedCertificados, certificadosProdutor, certificadosInitialized, loadingAllCertificados, loadingCertificados

    // Se não tem produtorId, mostrar erro (após hooks)
    if (!id) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Toast toastMessage={toastMessage} onClose={() => setToastMessage(null)} />
                <div className="text-center max-w-md mx-auto p-8">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <p className="text-gray-500 mb-6"></p>
                    <button
                        onClick={handleBack}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar para Certificados
                    </button>
                </div>
            </div>
        );
    }

    // Renderização condicional para carregamento e erro (após hooks)
    if (loadingAssociacao) {
        return <div className="min-h-screen flex items-center justify-center text-xl">Carregando associação...</div>;
    }
    if (erroAssociacao) {
        return <div className="min-h-screen flex items-center justify-center text-red-600 text-xl">{erroAssociacao}</div>;
    }
    if (!associacao) {
        return <div className="min-h-screen flex items-center justify-center text-gray-600 text-xl">Associação não encontrada.</div>;
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
            await updateAssociacaoRural(associacao.id, formData);
            showToast('success', 'Entidade atualizada', 'Os dados foram salvos com sucesso!');
            // Recarregar dados da associação após salvar
            const response = await api.get(`/organizacao/${associacao.id}`);
            setAssociacao(response.data);
            setIsEditing(false);
        } catch (e) {
            showToast('error', 'Erro ao salvar', 'Não foi possível atualizar a Entidade.');
            console.error('Erro ao salvar associação:', e);
        }
    };

    // Provincias e municípios (deve ficar antes de qualquer condicional ou função)
    // const [provinciaOptions, setProvinciaOptions] = useState([]);
    // const [municipioOptions, setMunicipioOptions] = useState([]);

    // useEffect(() => {
    //     // Carregar provincias ao iniciar
    //     const provs = provinciasData.map(p => ({ value: p.nome, label: p.nome }));
    //     setProvinciaOptions(provs);
    // }, []);

    // useEffect(() => {
    //     // Atualizar municípios ao mudar a província
    //     let municipios = [];
    //     if (formData && formData.provincia) {
    //         // Suporta seleção única ou múltipla de províncias
    //         const provs = Array.isArray(formData.provincia)
    //             ? formData.provincia
    //             : [formData.provincia];
    //         provs.forEach(provObj => {
    //             // Suporte tanto para objeto {value, label} quanto string
    //             const provNome = provObj.value || provObj;
    //             const prov = provinciasData.find(p => p.nome === provNome);
    //             if (prov && prov.municipios) {
    //                 try {
    //                     const munArr = Array.isArray(prov.municipios)
    //                         ? prov.municipios
    //                         : JSON.parse(prov.municipios);
    //                     municipios = municipios.concat(
    //                         munArr.map(m => ({ value: m, label: m }))
    //                     );
    //                 } catch (e) {
    //                     console.error('Erro ao processar municípios da província', provNome, e);
    //                 }
    //             }
    //         });
    //     }
    //     setMunicipioOptions(municipios);
    // }, [formData?.provincia, provinciasData]);


    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8">
            <Toast toastMessage={toastMessage} onClose={() => setToastMessage(null)} />
            <div className="w-full">
                {/* Cabeçalho */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-6 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                            <button onClick={() => navigate(-1)} className="p-2 rounded hover:bg-gray-100 text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
                            <div className='flex flex-col'>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {isEditing ? 'Editando Entidade' : 'Detalhes da Entidade'}
                                </h2>
                                <div className="text-gray-600">ID: {associacao.id || '--'} &bull; NIF: {associacao.nif || '--'}</div>
                            </div>
                        </div>
                        <div className="flex gap-2 flex-wrap items-center mt-2">
                            <span
                                key={status}
                                className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border 
                                ${associacao.estado === 'ATIVO' ? 'bg-green-50 text-green-700 border-green-200' : ''}
                                ${associacao.estado === 'INATIVO' ? 'bg-gray-100 text-gray-500 border-gray-300' : ''}
                                ${associacao.estado === 'SUSPENSO' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : ''}
                              `}
                            >
                                {associacao.estado === 'ATIVO' && <CheckCircle className="w-4 h-4 mr-1 text-green-600" />}
                                {associacao.estado === 'INATIVO' && <X className="w-4 h-4 mr-1 text-gray-400" />}
                                {associacao.estado === 'SUSPENSO' && <AlertTriangle className="w-4 h-4 mr-1 text-yellow-500" />}
                                {associacao.estado}
                            </span>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-blue-200 bg-white text-blue-700"><BarChart2 className="w-4 h-4 mr-1" />{associacao.tipoDeEntidade}</span>
                        </div>
                    </div>
                    {/*  */}
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
                                        value={statusOptions.find(opt => opt.value === status)}
                                        options={statusOptions}
                                        onChange={handleStatusSelect}
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
                                    label="Nome da Entidade"
                                    value={isEditing ? formData?.nomeEntidade : associacao.nomeEntidade || ''}
                                    onChange={v => handleChange('nomeEntidade', v)}
                                    disabled={!isEditing}
                                    iconStart={<Building size={18} />}
                                />
                                <CustomInput
                                    label="Sigla"
                                    value={isEditing ? formData?.sigla : associacao.sigla || ''}
                                    onChange={v => handleChange('sigla', v)}
                                    disabled={!isEditing}
                                    iconStart={<FileText size={18} />}
                                />
                                <CustomInput
                                    label="NIF"
                                    value={isEditing ? formData?.nif : associacao.nif || ''}
                                    onChange={v => handleChange('nif', v)}
                                    disabled={!isEditing}
                                    iconStart={<CreditCard size={18} />}
                                />
                                <div>
                                    <CustomInput
                                        label="Dados da Fundação"
                                        value={isEditing ? formData?.dataFundacao : associacao.dataFundacao ? new Date(associacao.dataFundacao) : ''}
                                        onChange={v => handleChange('dataFundacao', v)}
                                        disabled={!isEditing}
                                        type="date"
                                        iconStart={<Calendar size={18} />}
                                    />
                                    {associacao.dataFundacao && (
                                        <div className="text-xs text-gray-500 mt-1 pl-2">Fundada em: {new Date(associacao.dataFundacao).toLocaleDateString('pt-BR')}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                        {/* Informações de Contato */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Phone className="w-4 h-4 text-green-600" /> Informações de Contato</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput label="Telefone" value={isEditing ? formData?.telefone : associacao.telefone || ''} onChange={v => handleChange('telefone', v)} disabled={!isEditing} iconStart={<Phone size={18} />} />
                                <CustomInput label="E-mail" value={isEditing ? formData?.email : associacao.email || ''} onChange={v => handleChange('email', v)} disabled={!isEditing} iconStart={<Mail size={18} />} />
                            </div>
                        </div>
                        {/* Localização */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-red-500" /> Localização
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput label="Província"
                                    type={isEditing ? 'multiselect' : 'text'}
                                    value={isEditing
                                        ? (Array.isArray(formData?.provincia) ? formData.provincia.map(p => ({ value: p, label: p })) : (formData?.provincia ? [{ value: formData.provincia, label: formData.provincia }] : []))
                                        : associacao.provincia || ''}
                                    options={provinciaOptions}
                                    onChange={opts => handleChange('provincia', Array.isArray(opts) ? opts.map(o => o.value) : [])}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />} />
                                <CustomInput label="Município"
                                    type={isEditing ? 'multiselect' : 'text'}
                                    value={isEditing
                                        ? (Array.isArray(formData?.municipio) ? formData.municipio.map(m => ({ value: m, label: m })) : (formData?.municipio ? [{ value: formData.municipio, label: formData.municipio }] : []))
                                        : associacao.municipio || ''}
                                    options={municipioOptions}
                                    onChange={opts => handleChange('municipio', Array.isArray(opts) ? opts.map(o => o.value) : [])}
                                    disabled={!isEditing}
                                    iconStart={<MapPin size={18} />} />
                            </div>
                            <div className="mt-4">
                                <CustomInput label="Comuna" value={isEditing ? formData?.comuna : associacao.comuna || ''} onChange={v => handleChange('comuna', v)} disabled={!isEditing} iconStart={<Building size={18} />} />
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
                                    <CustomInput label="Nome" value={isEditing ? formData?.nomePresidente : associacao.nomePresidente || ''} onChange={v => handleChange('nomePresidente', v)} disabled={!isEditing} iconStart={<User size={18} />} />
                                    <CustomInput label="BI" value={isEditing ? formData?.biPresidente : associacao.biPresidente || ''} onChange={v => handleChange('biPresidente', v)} disabled={!isEditing} iconStart={<CreditCard size={18} />} />
                                    <CustomInput label="Telefone" value={isEditing ? formData?.telefonePresidente : associacao.telefonePresidente || ''} onChange={v => handleChange('telefonePresidente', v)} disabled={!isEditing} iconStart={<Phone size={18} />} />
                                    <CustomInput label="E-mail" value={isEditing ? formData?.emailPresidente : associacao.emailPresidente || ''} onChange={v => handleChange('emailPresidente', v)} disabled={!isEditing} iconStart={<Mail size={18} />} />
                                </div>
                            </div>
                            {/* Secretário(a) */}
                            <div className="p-4 rounded-xl bg-green-50 border border-green-200">
                                <div className="text-lg font-semibold text-green-700 mb-4">Secretário(a)</div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <CustomInput label="Nome" value={isEditing ? formData?.nomeSecretarioOuGerente : associacao.nomeSecretarioOuGerente || ''} onChange={v => handleChange('nomeSecretarioOuGerente', v)} disabled={!isEditing} iconStart={<User size={18} />} />
                                    <CustomInput label="Número do BI" value={isEditing ? formData?.biSecretarioOuGerente : associacao.biSecretarioOuGerente || ''} onChange={v => handleChange('biSecretarioOuGerente', v)} disabled={!isEditing} iconStart={<CreditCard size={18} />} />
                                    <CustomInput label="Telefone" value={isEditing ? formData?.telefoneSecretarioOuGerente : associacao.telefoneSecretarioOuGerente || ''} onChange={v => handleChange('telefoneSecretarioOuGerente', v)} disabled={!isEditing} iconStart={<Phone size={18} />} />
                                    <CustomInput label="E-mail" value={isEditing ? formData?.emailSecretarioOuGerente : associacao.emailSecretarioOuGerente || ''} onChange={v => handleChange('emailSecretarioOuGerente', v)} disabled={!isEditing} iconStart={<Mail size={18} />} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="space-y-6">

                        {/* Quadro Social */}
                        <div className="bg-white rounded-lg shadow p-4 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Users className="w-4 h-4 text-orange-500" /> Quadro Social</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <CustomInput label="Número de Cooperados" value={isEditing ? formData?.numeroCooperados : associacao.numeroCooperados || ''} onChange={v => handleChange('numeroCooperados', v)} disabled={!isEditing} iconStart={<Users size={18} />} />
                                <CustomInput label="Número de Empregados" value={isEditing ? formData?.numeroEmpregados : associacao.numeroEmpregados || ''} onChange={v => handleChange('numeroEmpregados', v)} disabled={!isEditing} iconStart={<Briefcase size={18} />} />
                            </div>
                            <div className="mt-4">
                                {isEditing ? (
                                    <>
                                        <CustomInput
                                            label="Perfil dos Cooperados"
                                            type="multiselect"
                                            value={Array.isArray(formData?.perfilCooperados) ? formData.perfilCooperados.map(v => {
                                                if (v === 'AGRICULTORES_FAMILIARES') return { value: v, label: 'Agricultores Familiares' };
                                                if (v === 'PRODUTORES_RURAIS') return { value: v, label: 'Produtores Rurais' };
                                                if (v === 'OUTROS') return { value: v, label: 'Outros' };
                                                return { value: v, label: v };
                                            }) : []}
                                            options={[
                                                { label: 'Agricultores Familiares', value: 'AGRICULTORES_FAMILIARES' },
                                                { label: 'Produtores Rurais', value: 'PRODUTORES_RURAIS' },
                                                { label: 'Outros', value: 'OUTROS' }
                                            ]}
                                            onChange={opts => handleChange('perfilCooperados', opts.map(o => o.value))}
                                            disabled={!isEditing}
                                            iconStart={<FileText size={18} />}
                                        />
                                        {Array.isArray(formData?.perfilCooperados) && formData.perfilCooperados.includes('OUTROS') && (
                                            <CustomInput
                                                label="Descreva o perfil dos cooperados (Outros)"
                                                type="textarea"
                                                value={formData.perfilCooperadosDescricao || ''}
                                                onChange={v => handleChange('perfilCooperadosDescricao', v)}
                                                disabled={!isEditing}
                                                iconStart={<FileText size={18} />}
                                                placeholder="Descreva o perfil personalizado dos cooperados..."
                                                rows={3}
                                            />
                                        )}
                                    </>
                                ) : (
                                    <>
                                        <div className="mb-2">
                                            <span className="font-medium text-gray-700">Perfil dos Cooperados:</span>
                                            <div className="flex flex-wrap gap-2 mt-2">
                                                {Array.isArray(associacao.perfilCooperados) ? (
                                                    associacao.perfilCooperados.map((perfil, idx) => {
                                                        let label = perfil;
                                                        if (perfil === 'AGRICULTORES_FAMILIARES') label = 'Agricultores Familiares';
                                                        if (perfil === 'PRODUTORES_RURAIS') label = 'Produtores Rurais';
                                                        if (perfil === 'OUTROS') label = 'Outros';
                                                        return <span key={idx} className="bg-orange-50 border border-orange-200 text-orange-800 rounded px-3 py-1 text-sm font-medium">{label}</span>;
                                                    })
                                                ) : (
                                                    <span className="text-gray-400">Nenhum perfil cadastrado</span>
                                                )}
                                            </div>
                                            {Array.isArray(associacao.perfilCooperados) && associacao.perfilCooperados.includes('OUTROS') && associacao.perfilCooperadosDescricao && (
                                                <div className="mt-2 text-sm text-gray-700"><span className="font-semibold">Outros:</span> {associacao.perfilCooperadosDescricao}</div>
                                            )}
                                        </div>
                                    </>
                                )}
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
                                        value={(formData?.atividades || []).map(a => atividadesOptions.find(opt => opt.value === a) || { value: a, label: a.replace(/[_-]/g, ' ') })}
                                        options={atividadesOptions}
                                        onChange={opts => handleChange('atividades', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {(associacao.atividades || []).length > 0 ? (
                                            associacao.atividades.map((atividade, idx) => {
                                                // Se não encontrar label, faz o replace para exibir com espaços
                                                const atividadeLabel = atividadesOptions.find(opt => opt.value === atividade)?.label || atividade.replace(/[-_]/g, ' ');
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
                                    value={isEditing ? formData?.outrasAtividades : associacao.outrasAtividades || ''}
                                    onChange={v => handleChange('outrasAtividades', v)}
                                    disabled={!isEditing}
                                    placeholder="Descreva outras atividades..."
                                    iconStart={<FileText size={18} />}
                                    type="textarea"
                                />
                            </div>
                            {/* Caixa azul clara com resumo */}
                            {(associacao.atividades && associacao.atividades.length > 0) && (
                                <div className="mt-4 p-3 rounded-lg bg-blue-50 text-blue-900 text-sm border border-blue-200">
                                    <span className="font-bold">Actividades atuais: </span>
                                    {associacao.atividades
                                        .map(a => a.replace(/[-_]/g, ' '))
                                        .join(', ')
                                    }
                                </div>
                            )}
                        </div>
                        {/* Equipamentos e Infraestrutura */}
                        <div className="bg-white rounded-lg shadow p-6 border">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2"><Tractor className="w-4 h-4 text-yellow-600" /> Equipamentos e Infraestrutura</h3>
                            <CustomInput
                                label="Possui Equipamentos"
                                type="select"
                                value={
                                    formData?.possuiEquipamentos === 'true' || formData?.possuiEquipamentos === true
                                        ? { value: 'true', label: 'Sim' }
                                        : { value: 'false', label: 'Não' }
                                }
                                options={[
                                    { value: 'true', label: 'Sim' },
                                    { value: 'false', label: 'Não' }
                                ]}
                                onChange={opt => handleChange('possuiEquipamentos', opt.value)}
                                disabled={!isEditing}
                            />
                            {/* Multiselects para cada categoria */}
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Equipamentos Agrícolas</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={Array.isArray(formData?.equipamentosAgricolas) ? formData.equipamentosAgricolas.map(e => ({ value: e, label: e })) : []}
                                        options={[
                                            { value: 'Trator', label: 'Trator' },
                                            { value: 'Plantadeira', label: 'Plantadeira' },
                                            { value: 'Colheitadeira', label: 'Colheitadeira' },
                                            { value: 'Pulverizador', label: 'Pulverizador' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosAgricolas', Array.isArray(opts) ? opts.map(o => o.value) : [])}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.equipamentosAgricolas || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Equipamentos de Infraestrutura</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.equipamentosInfraestrutura || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Armazém', label: 'Armazém' },
                                            { value: 'Silo', label: 'Silo' },
                                            { value: 'Galpão', label: 'Galpão' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosInfraestrutura', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.equipamentosInfraestrutura || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Materiais de Produção</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.materiaisProducao || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Sementes', label: 'Sementes' },
                                            { value: 'Adubo', label: 'Adubo' },
                                            { value: 'Defensivo', label: 'Defensivo' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('materiaisProducao', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.materiaisProducao || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Ferramentas Manuais</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.ferramentasManuais || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Enxada', label: 'Enxada' },
                                            { value: 'Pá', label: 'Pá' },
                                            { value: 'Foice', label: 'Foice' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('ferramentasManuais', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.ferramentasManuais || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Equipamentos de Medição</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.equipamentosMedicao || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Balança', label: 'Balança' },
                                            { value: 'Trena', label: 'Trena' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosMedicao', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.equipamentosMedicao || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Materiais de Higiene</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.materiaisHigiene || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Álcool', label: 'Álcool' },
                                            { value: 'Sabão', label: 'Sabão' },
                                            { value: 'Detergente', label: 'Detergente' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('materiaisHigiene', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.materiaisHigiene || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Materiais de Escritório</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.materiaisEscritorio || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Papel', label: 'Papel' },
                                            { value: 'Caneta', label: 'Caneta' },
                                            { value: 'Computador', label: 'Computador' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('materiaisEscritorio', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.materiaisEscritorio || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Equipamentos de Transporte</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.equipamentosTransporte || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Caminhão', label: 'Caminhão' },
                                            { value: 'Carro', label: 'Carro' },
                                            { value: 'Moto', label: 'Moto' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosTransporte', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.equipamentosTransporte || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="mb-2">
                                <div className="block text-sm font-medium  transition-colors duration-300 text-gray-700 mb-2">Equipamentos Pecuários</div>
                                {isEditing ? (
                                    <CustomInput
                                        type="multiselect"
                                        value={(formData?.equipamentosPecuarios || []).map(e => ({ value: e, label: e }))}
                                        options={[
                                            { value: 'Ordenhadeira', label: 'Ordenhadeira' },
                                            { value: 'Cercas', label: 'Cercas' },
                                            { value: 'Balança', label: 'Balança' },
                                            { value: 'Outro', label: 'Outro' },
                                        ]}
                                        onChange={opts => handleChange('equipamentosPecuarios', opts.map(o => o.value))}
                                        disabled={!isEditing}
                                    />
                                ) : (
                                    <div className="flex flex-wrap gap-2">
                                        {(associacao.equipamentosPecuarios || []).map((item, idx) => (
                                            <span key={idx} className="bg-yellow-50 border border-yellow-200 text-yellow-600 px-2 py-1 rounded text-xs">
                                                {item}
                                            </span>
                                        ))}
                                    </div>
                                )}
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
                                        <div className="text-blue-800 font-semibold text-lg">{associacao.nomeCooperativa || 'ASSOCIAÇÃO DE EXEMPLO'}</div>
                                        <div className="text-blue-700 text-sm">Lat: {associacao.latitude || '--'}°, Lng: {associacao.longitude || '--'}°</div>
                                        <div className="text-blue-400 text-xs mt-2">O mapa será carregado aqui</div>
                                    </div>
                                </div>
                                <div className="w-full flex flex-col gap-2 text-sm text-gray-700 mb-1 mt-2">
                                    <div className=" flex justify-between">
                                        <span>Latitude:</span>
                                        <span className="font-medium">{associacao.latitude || '--'}°</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span>Longitude:</span>
                                        <span className="font-medium">{associacao.longitude || '--'}°</span>
                                    </div>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${associacao.latitude || ''},${associacao.longitude || ''}`}
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
                            <div className="font-medium text-gray-900">{associacao.id || '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-900">Dados do Cadastro:</div>
                            <div className="font-medium text-gray-900">{associacao.dataFundacao ? new Date(associacao.dataFundacao).toLocaleDateString('pt-BR') : '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-900">Estado actual:</div>
                            <div className="font-medium text-gray-900">{status || '--'}</div>
                        </div>
                        <div>
                            <div className="text-gray-900">Última actualização:</div>
                            <div className="font-medium text-gray-900">{associacao.ultimaAtualizacao ? new Date(associacao.ultimaAtualizacao).toLocaleDateString('pt-BR') : '--'}</div>
                        </div>
                    </div>
                </div>
                {showStatusModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                        <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                                <RefreshCw className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Alteração de Estado</h3>
                            <p className="text-gray-600 text-center text-sm mb-4">
                                Deseja alterar o status para: <br />
                                <span className="font-bold text-blue-600">{pendingStatusValue?.label || pendingStatusValue?.value}</span>?
                            </p>
                            <div className="flex gap-3 mt-2 w-full">
                                <button
                                    onClick={confirmStatusChange}
                                    className="flex-1 p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all"
                                >
                                    Sim, alterar
                                </button>
                                <button
                                    onClick={() => { setShowStatusModal(false); setPendingStatusValue(null); }}
                                    className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                                >
                                    Não
                                </button>
                            </div>
                        </div>
                    </div>
                )}
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

export default VisualizarOrganizacao;