import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Building,
    Calendar,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    FileText,
    Globe,
    Info,
    MapPin,
    Phone,
    Save,
    Settings,
    SquarePen,
    User,
    Users,
    X
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';
import { useEmpresasDeApoio } from '../../../hooks/useEmpresasDeApoio';

const VisualizarEmpresaDeApoio = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(0);
    const [empresa, setEmpresa] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [originalData, setOriginalData] = useState(null);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);
    const [toastMessage, setToastMessage] = useState(null);
    const [loading, setLoading] = useState(false);

    const { empresasDeApoio, updateEmpresasDeApoio, fetchEmpresasDeApoio } = useEmpresasDeApoio();

    const steps = [
        { label: 'Identificação', icon: Building },
        { label: 'Localização', icon: MapPin },
        { label: 'Contatos', icon: Phone },
        { label: 'Áreas de Atuação', icon: Activity },
        { label: 'Público-Alvo', icon: Users },
        { label: 'Capacidade', icon: Settings },
        { label: 'Situação Legal', icon: FileText },
        { label: 'Observações', icon: Info }
    ];

    useEffect(() => {
        const loadEmpresa = async () => {
            if (id && empresasDeApoio.length === 0) {
                try {
                    await fetchEmpresasDeApoio();
                } catch (error) {
                    console.error('Erro ao carregar empresas:', error);
                }
            }
        };

        loadEmpresa();
    }, [id, fetchEmpresasDeApoio, empresasDeApoio.length]);

    useEffect(() => {
        if (id && empresasDeApoio.length > 0) {
            const empresaEncontrada = empresasDeApoio.find(e => e.id === parseInt(id));
            if (empresaEncontrada) {
                setEmpresa(empresaEncontrada);
            }
        }
    }, [id, empresasDeApoio]);

    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    const handleEdit = () => {
        setOriginalData({ ...empresa });

        if (empresa.província) {
            const provinciaSelected = provinciasData.find(
                p => p.nome.toUpperCase() === empresa.província.toUpperCase()
            );
            if (provinciaSelected) {
                try {
                    const municipiosArray = JSON.parse(provinciaSelected.municipios);
                    const municipios = municipiosArray.map(mun => ({
                        label: mun,
                        value: mun
                    }));
                    setMunicipiosOptions(municipios);
                } catch (error) {
                    console.error("Erro ao processar municípios:", error);
                    setMunicipiosOptions([]);
                }
            }
        }

        setIsEditing(true);
    };

    const handleCancel = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setEmpresa(originalData);
        setIsEditing(false);
        setShowCancelModal(false);
        setOriginalData(null);
    };

    const handleSave = async () => {
        try {
            setLoading(true);

            const dataToSend = {
                id: parseInt(empresa.id) || 0,
                nomeDaEmpresa: empresa.nomeDaEmpresa || "",
                tipoDeEntidade: typeof empresa.tipoDeEntidade === 'object' ? empresa.tipoDeEntidade.value : empresa.tipoDeEntidade || "",
                nifOuIdFiscal: empresa.nifOuIdFiscal || "",
                anoDeFundacao: parseInt(empresa.anoDeFundacao) || 0,
                enderecoSede: empresa.enderecoSede || "",
                província: typeof empresa.província === 'object' ? empresa.província.value : empresa.província || "",
                município: typeof empresa.município === 'object' ? empresa.município.value : empresa.município || "",
                latitude: empresa.latitude || "",
                longitude: empresa.longitude || "",
                nomeDaPessoaDeContacto: empresa.nomeDaPessoaDeContacto || "",
                cargo: empresa.cargo || "",
                telefone: empresa.telefone || "",
                email: empresa.email || "",
                website: empresa.website || "",
                servicosPrestados: Array.isArray(empresa.servicosPrestados) 
                    ? empresa.servicosPrestados.map(s => typeof s === 'object' ? s.value : s)
                    : [],
                principaisBeneficiarios: Array.isArray(empresa.principaisBeneficiarios)
                    ? empresa.principaisBeneficiarios.map(b => typeof b === 'object' ? b.value : b)
                    : [],
                numeroDeFuncionarios: parseInt(empresa.numeroDeFuncionarios) || 0,
                areaDeCobertura: typeof empresa.areaDeCobertura === 'object' ? empresa.areaDeCobertura.value : empresa.areaDeCobertura || "",
                volumeMedioDeClientesOuBeneficiariosPorAno: parseInt(empresa.volumeMedioDeClientesOuBeneficiariosPorAno) || 0,
                licencaDeOperacao: typeof empresa.licencaDeOperacao === 'object' ? empresa.licencaDeOperacao.value : empresa.licencaDeOperacao || "",
                registoComercial: typeof empresa.registoComercial === 'object' ? empresa.registoComercial.value : empresa.registoComercial || "",
                certificacoesEspecificas: empresa.certificacoesEspecificas || "",
                observacoesGerais: empresa.observacoesGerais || ""
            };

            await updateEmpresasDeApoio(id, dataToSend);
            setIsEditing(false);
            setOriginalData(null);
            showToast('success', 'Empresa atualizada com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar empresa.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (field, value) => {
        setEmpresa(prev => ({ ...prev, [field]: value }));
    };

    const handleProvinciaChange = (value) => {
        const provinciaValue = value?.value || value;
        const provinciaSelected = provinciasData.find(
            p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
        );

        if (provinciaSelected) {
            try {
                const municipiosArray = JSON.parse(provinciaSelected.municipios);
                const municipios = municipiosArray.map(mun => ({
                    label: mun,
                    value: mun
                }));
                setMunicipiosOptions(municipios);
            } catch (error) {
                console.error("Erro ao processar municípios:", error);
                setMunicipiosOptions([]);
            }
        } else {
            setMunicipiosOptions([]);
        }

        handleInputChange('província', provinciaValue);
        handleInputChange('município', '');
    };

    const renderStepContent = (index) => {
        if (!empresa) return null;

        switch (index) {
            case 0: // Identificação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação</h3>
                            </div>
                            <p className="text-gray-600">Dados de identificação da empresa.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome da Empresa"
                                    value={empresa.nomeDaEmpresa || ''}
                                    onChange={(value) => handleInputChange('nomeDaEmpresa', value)}
                                    disabled={!isEditing}
                                    iconStart={<Building size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Tipo de Entidade"
                                    value={isEditing ? (empresa.tipoDeEntidade ? { label: empresa.tipoDeEntidade?.replace(/_/g, ' '), value: empresa.tipoDeEntidade } : null) : (empresa.tipoDeEntidade?.replace(/_/g, ' ') || '')}
                                    options={isEditing ? [
                                        { label: 'Empresa Privada', value: 'EMPRESA_PRIVADA' },
                                        { label: 'Cooperativa', value: 'COOPERATIVA' },
                                        { label: 'ONG', value: 'ONG' },
                                        { label: 'Associação', value: 'ASSOCIACAO' }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('tipoDeEntidade', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="NIF/ID Fiscal"
                                    value={empresa.nifOuIdFiscal}
                                    onChange={(value) => handleInputChange('nifOuIdFiscal', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="number"
                                    label="Ano de Fundação"
                                    value={empresa.anoDeFundacao}
                                    onChange={(value) => handleInputChange('anoDeFundacao', value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 1: // Localização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <MapPin className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Localização</h3>
                            </div>
                            <p className="text-gray-600">Localização da sede da empresa.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="text"
                                        label="Endereço Sede"
                                        value={empresa.enderecoSede}
                                        onChange={(value) => handleInputChange('enderecoSede', value)}
                                        disabled={!isEditing}
                                        iconStart={<MapPin size={18} />}
                                    />
                                </div>
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Província"
                                    value={isEditing ? { label: empresa.província, value: empresa.província } : empresa.província}
                                    options={isEditing ? provinciasData.map(p => ({ label: p.nome, value: p.nome })) : undefined}
                                    onChange={isEditing ? handleProvinciaChange : (value) => handleInputChange('província', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Município"
                                    value={isEditing ? { label: empresa.município, value: empresa.município } : empresa.município}
                                    options={isEditing ? municipiosOptions : undefined}
                                    onChange={(value) => handleInputChange('município', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="Latitude"
                                    value={empresa.latitude}
                                    onChange={(value) => handleInputChange('latitude', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="text"
                                    label="Longitude"
                                    value={empresa.longitude}
                                    onChange={(value) => handleInputChange('longitude', value)}
                                    disabled={!isEditing}
                                />
                            </div>
                        </div>
                    </div>
                );

            case 2: // Contatos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Phone className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Contatos</h3>
                            </div>
                            <p className="text-gray-600">Informações de contato da empresa.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Pessoa de Contato"
                                    value={empresa.nomeDaPessoaDeContacto}
                                    onChange={(value) => handleInputChange('nomeDaPessoaDeContacto', value)}
                                    disabled={!isEditing}
                                    iconStart={<User size={18} />}
                                />
                                <CustomInput
                                    type="text"
                                    label="Cargo"
                                    value={empresa.cargo}
                                    onChange={(value) => handleInputChange('cargo', value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type="tel"
                                    label="Telefone"
                                    value={empresa.telefone}
                                    onChange={(value) => handleInputChange('telefone', value)}
                                    disabled={!isEditing}
                                    iconStart={<Phone size={18} />}
                                />
                                <CustomInput
                                    type="email"
                                    label="Email"
                                    value={empresa.email}
                                    onChange={(value) => handleInputChange('email', value)}
                                    disabled={!isEditing}
                                />
                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="text"
                                        label="Website"
                                        value={empresa.website}
                                        onChange={(value) => handleInputChange('website', value)}
                                        disabled={!isEditing}
                                        iconStart={<Globe size={18} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Áreas de Atuação
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Áreas de Atuação</h3>
                            </div>
                            <p className="text-gray-600">Serviços prestados pela empresa.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <CustomInput
                                type={isEditing ? "multiselect" : "text"}
                                label="Serviços Prestados"
                                value={isEditing ? empresa.servicosPrestados : empresa.servicosPrestados?.join(', ')}
                                options={isEditing ? [
                                    { label: 'Fornecimento de Insumos Agrícolas', value: 'INSUMOS_AGRICOLAS' },
                                    { label: 'Mecanização Agrícola', value: 'MECANIZACAO_AGRICOLA' },
                                    { label: 'Assistência Técnica', value: 'ASSISTENCIA_TECNICA' },
                                    { label: 'Formação e Capacitação', value: 'FORMACAO_CAPACITACAO' },
                                    { label: 'Crédito Rural', value: 'CREDITO_RURAL' },
                                    { label: 'Comercialização e Logística', value: 'COMERCIALIZACAO_LOGISTICA' }
                                ] : undefined}
                                onChange={(value) => handleInputChange('servicosPrestados', value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                );

            case 4: // Público-Alvo
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Users className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Público-Alvo</h3>
                            </div>
                            <p className="text-gray-600">Principais beneficiários dos serviços.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <CustomInput
                                type={isEditing ? "multiselect" : "text"}
                                label="Principais Beneficiários"
                                value={isEditing ? empresa.principaisBeneficiarios : empresa.principaisBeneficiarios?.join(', ')}
                                options={isEditing ? [
                                    { label: 'Pequenos Produtores', value: 'PEQUENOS_PRODUTORES' },
                                    { label: 'Médios Produtores', value: 'MEDIOS_PRODUTORES' },
                                    { label: 'Grandes Produtores', value: 'GRANDES_PRODUTORES' },
                                    { label: 'Associações/Cooperativas', value: 'ASSOCIACOES_COOPERATIVAS' }
                                ] : undefined}
                                onChange={(value) => handleInputChange('principaisBeneficiarios', value)}
                                disabled={!isEditing}
                            />
                        </div>
                    </div>
                );

            case 5: // Capacidade
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Settings className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Capacidade e Operação</h3>
                            </div>
                            <p className="text-gray-600">Informações sobre capacidade operacional.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="number"
                                    label="Número de Funcionários"
                                    value={empresa.numeroDeFuncionarios}
                                    onChange={(value) => handleInputChange('numeroDeFuncionarios', value)}
                                    disabled={!isEditing}
                                    iconStart={<Users size={18} />}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Área de Cobertura"
                                    value={isEditing ? { label: empresa.areaDeCobertura, value: empresa.areaDeCobertura } : empresa.areaDeCobertura}
                                    options={isEditing ? [
                                        { label: 'Local/Distrital', value: 'LOCAL_DISTRITAL' },
                                        { label: 'Provincial', value: 'PROVINCIAL' },
                                        { label: 'Nacional', value: 'NACIONAL' },
                                        { label: 'Regional/Internacional', value: 'REGIONAL_INTERNACIONAL' }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('areaDeCobertura', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                />
                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="number"
                                        label="Volume Médio de Clientes/Ano"
                                        value={empresa.volumeMedioDeClientesOuBeneficiariosPorAno}
                                        onChange={(value) => handleInputChange('volumeMedioDeClientesOuBeneficiariosPorAno', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Situação Legal
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8 border border-red-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Situação Legal</h3>
                            </div>
                            <p className="text-gray-600">Informações sobre licenças e certificações.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Licença de Operação"
                                    value={isEditing ? { label: empresa.licencaDeOperacao, value: empresa.licencaDeOperacao } : empresa.licencaDeOperacao}
                                    options={isEditing ? [
                                        { label: 'Sim', value: 'SIM' },
                                        { label: 'Não', value: 'NAO' }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('licencaDeOperacao', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                />
                                <CustomInput
                                    type={isEditing ? "select" : "text"}
                                    label="Registo Comercial"
                                    value={isEditing ? { label: empresa.registoComercial, value: empresa.registoComercial } : empresa.registoComercial}
                                    options={isEditing ? [
                                        { label: 'Sim', value: 'SIM' },
                                        { label: 'Não', value: 'NAO' }
                                    ] : undefined}
                                    onChange={(value) => handleInputChange('registoComercial', typeof value === 'object' ? value.value : value)}
                                    disabled={!isEditing}
                                />
                                <div className="md:col-span-2">
                                    <CustomInput
                                        type="text"
                                        label="Certificações Específicas"
                                        value={empresa.certificacoesEspecificas}
                                        onChange={(value) => handleInputChange('certificacoesEspecificas', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 7: // Observações
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-6 mb-8 border border-gray-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-gray-100 rounded-lg">
                                    <Info className="w-6 h-6 text-gray-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Observações Gerais</h3>
                            </div>
                            <p className="text-gray-600">Informações adicionais sobre a empresa.</p>
                        </div>

                        <div className="bg-white rounded-2xl p-6">
                            <CustomInput
                                type="textarea"
                                label="Observações"
                                value={empresa.observacoesGerais}
                                onChange={(value) => handleInputChange('observacoesGerais', value)}
                                disabled={!isEditing}
                                rows={6}
                            />
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    const nextStep = () => {
        setActiveIndex(prev => Math.min(prev + 1, steps.length - 1));
    };

    const prevStep = () => {
        setActiveIndex(prev => Math.max(prev - 1, 0));
    };

    if (!empresa) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Carregando dados da empresa...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-gray-50 min-h-screen">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                        'bg-red-100 border-l-4 border-red-500 text-red-700'
                    }`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {toastMessage.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                        </div>
                        <p className="font-medium">{toastMessage.message}</p>
                    </div>
                </div>
            )}

            {/* Cancel Confirmation Modal */}
            {showCancelModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center mb-3">
                            <AlertCircle className="w-6 h-6 text-yellow-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Cancelamento</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">
                            Tem certeza que deseja cancelar as alterações? Todas as mudanças não salvas serão perdidas.
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
                                Continuar editando
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white rounded-lg shadow p-6 mb-3 border">
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2 mb-2">
                            <div className="flex flex-col">
                                <div className="flex items-center gap-3">
                                    <div className="flex rounded-full top-0">
                                        <button
                                            onClick={() => navigate(-1)}
                                            className="p-2 rounded hover:bg-gray-100 text-gray-600"
                                        >
                                            <ArrowLeft className="w-5 h-5" />
                                        </button>
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-900">Detalhes da Empresa de Apoio</h2>
                                        <div className="text-gray-600">Nome: {empresa.nomeDaEmpresa}</div>
                                        <div className="flex gap-2 flex-wrap items-center mt-2">
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border bg-blue-50 text-blue-700 border-blue-200">
                                                <Building className="w-4 h-4 mr-1 text-blue-600" />
                                                {empresa.tipoDeEntidade?.replace(/_/g, ' ') || 'EMPRESA'}
                                            </span>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border border-green-200 bg-white text-green-700">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                {empresa.município}, {empresa.província}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-3 md:gap-4 mt-4 md:mt-0">
                        <div className="flex gap-3 w-full">
                            {!isEditing && (
                                <button
                                    onClick={handleEdit}
                                    className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors text-base"
                                >
                                    <SquarePen className="w-5 h-5" />
                                    Editar
                                </button>
                            )}
                            {isEditing && (
                                <>
                                    <button
                                        onClick={handleSave}
                                        disabled={loading}
                                        className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base disabled:opacity-60"
                                    >
                                        <Save className="w-5 h-5" />
                                        {loading ? 'Salvando...' : 'Salvar'}
                                    </button>
                                    <button
                                        onClick={handleCancel}
                                        className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 font-semibold hover:bg-gray-100 transition-colors text-base"
                                    >
                                        <X className="w-5 h-5" /> Cancelar
                                    </button>
                                </>
                            )}
                            <button className="flex h-[45px] items-center gap-2 px-6 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-colors text-base">
                                <FileText className="w-5 h-5" />
                                Relatório
                            </button>
                        </div>
                    </div>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    
                    {/* Step Navigation */}
                    <div className="flex justify-between items-center px-8 mb-8 mt-6 overflow-x-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeIndex ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index === activeIndex ? 'bg-gradient-to-r from-blue-700 to-blue-500 text-white shadow-lg' :
                                            'bg-gray-200 text-slate-500'
                                        }`}>
                                        <StepIcon size={24} />
                                    </div>
                                    <span className={`text-sm text-center font-medium ${index === activeIndex ? 'text-blue-700' : 'text-white-500'
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
                            className="bg-gradient-to-r from-blue-700 to-blue-500 h-2 transition-all duration-300 rounded-full"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Content */}
                    <div className="step-content p-8 bg-white min-h-[600px]">
                        {renderStepContent(activeIndex)}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
                        <button
                            className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                                    'bg-white hover:bg-gray-50 text-white-700 hover:border-gray-400'
                                }`}
                            onClick={prevStep}
                            disabled={activeIndex === 0}
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            Anterior
                        </button>

                        <div className="text-sm text-white-500 font-medium">
                            Etapa {activeIndex + 1} de {steps.length}
                        </div>

                        <button
                            className="px-8 py-3 rounded-xl flex items-center transition-all font-medium bg-gradient-to-r from-blue-700 to-blue-500 hover:bg-blue-700 text-white shadow-lg"
                            onClick={nextStep}
                            disabled={activeIndex === steps.length - 1}
                        >
                            <span className="mr-2">Próximo</span>
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VisualizarEmpresaDeApoio;