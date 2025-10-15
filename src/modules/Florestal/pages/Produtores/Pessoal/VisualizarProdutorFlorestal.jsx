import {
    Activity,
    AlertCircle,
    ArrowLeft,
    Building,
    Camera,
    CheckCircle,
    ChevronLeft,
    ChevronRight,
    CreditCard,
    Edit,
    Eye,
    FileText,
    Gavel,
    Info,
    Loader,
    MapPin,
    Phone,
    Play,
    RefreshCw,
    Save,
    Shield,
    TreePine,
    Trees,
    User,
    X
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

// Importações do React Leaflet
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import CustomInput from '../../../../../core/components/CustomInput';
import api from '../../../../../core/services/api';



// Corrigir ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const VisualizarProdutorFlorestal = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados principais
    const [produtor, setProdutor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [alterandoStatus, setAlterandoStatus] = useState(false);

    // Estados para modais
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatusValue, setPendingStatusValue] = useState(null);
    const [showMediaModal, setShowMediaModal] = useState(false);
    const [currentMedia, setCurrentMedia] = useState({ type: '', url: '', title: '' });

    // Função para conversão segura de datas
    const formatDateForInput = (dateValue) => {
        if (!dateValue) return '';

        try {
            const date = new Date(dateValue);
            // Verifica se a data é válida
            if (isNaN(date.getTime())) return '';

            return date.toISOString().split('T')[0];
        } catch (error) {
            console.warn('Erro ao converter data:', dateValue, error);
            return '';
        }
    };

    // Steps do formulário
    const steps = [
        { label: 'Inventário', icon: TreePine },
        { label: 'Licenciamento', icon: Shield },
        { label: 'Fiscalização', icon: Activity },
        { label: 'Ocorrências', icon: AlertCircle },
        { label: 'Produção', icon: Trees },
        { label: 'Sanções', icon: Gavel }
    ];

    // Opções para selects
    const statusOptions = [
        { label: 'Pendente', value: 'Pendente' },
        { label: 'Aprovado', value: 'Aprovado' },
        { label: 'Rejeitado', value: 'Rejeitado' },
        { label: 'Cancelado', value: 'Cancelado' },
        { label: 'Recebido', value: 'Recebido' }
    ];

    const propriedadeOptions = [
        { label: 'Pública', value: 'PUBLICA' },
        { label: 'Privada', value: 'PRIVADA' }
    ];

    const estadoConservacaoOptions = [
        { label: 'Nativa', value: 'NATIVA' },
        { label: 'Reflorestamento', value: 'REFLORESTAMENTO' },
        { label: 'Degradada', value: 'DEGRADADA' }
    ];

    const tipoLicencaOptions = [
        { label: 'Corte', value: 'CORTE' },
        { label: 'Transporte', value: 'TRANSPORTE' },
        { label: 'Carvão', value: 'CARVAO' },
        { label: 'PFNM', value: 'PFNM' }
    ];

    const autorizacaoOptions = [
        { label: 'Aprovada', value: 'APROVADA' },
        { label: 'Negada', value: 'NEGADA' },
        { label: 'Pendente', value: 'PENDENTE' }
    ];

    const resultadoInspecaoOptions = [
        { label: 'Conforme', value: 'CONFORME' },
        { label: 'Irregularidade', value: 'IRREGULARIDADE' }
    ];

    const autoEmitidoOptions = [
        { label: 'Sim', value: 'SIM' },
        { label: 'Não', value: 'NAO' }
    ];

    const tipoOcorrenciaOptions = [
        { label: 'Queimada', value: 'QUEIMADA' },
        { label: 'Praga', value: 'PRAGA' },
        { label: 'Desmatamento ilegal', value: 'DESMATAMENTO_ILEGAL' },
        { label: 'Enchente', value: 'ENCHENTE' },
        { label: 'Outra', value: 'OUTRA' }
    ];

    const modoSubmissaoOptions = [
        { label: 'App', value: 'APP' },
        { label: 'SMS', value: 'SMS' },
        { label: 'IVR', value: 'IVR' }
    ];

    const tipoInfracaoOptions = [
        { label: 'Multa', value: 'MULTA' },
        { label: 'Apreensão', value: 'APREENSAO' },
        { label: 'Embargo', value: 'EMBARGO' }
    ];

    const statusSancaoOptions = [
        { label: 'Paga', value: 'PAGA' },
        { label: 'Pendente', value: 'PENDENTE' },
        { label: 'Recurso', value: 'RECURSO' }
    ];

    const especiesOptions = [
        { label: 'Baobá (Adansonia digitata)', value: 'BAOBA' },
        { label: 'Imbondeiro (Adansonia sp.)', value: 'IMBONDEIRO' },
        { label: 'Mussivi (Brachystegia spiciformis)', value: 'MUSSIVI' },
        { label: 'Mupanda (Julbernardia paniculata)', value: 'MUPANDA' },
        { label: 'Muvulungo (Afzelia quanzensis)', value: 'MUVULUNGO' },
        { label: 'Kiaat / Mukwa (Pterocarpus angolensis)', value: 'KIAAT' },
        { label: 'Eucalipto (Eucalyptus spp.)', value: 'EUCALIPTO' },
        { label: 'Mongongo (Schinziophyton rautanenii)', value: 'MONGONGO' },
        { label: 'Palmeira-de-óleo (Elaeis guineensis)', value: 'PALMEIRA_OLEO' },
        { label: 'Palmeira-dendém (Elaeis spp.)', value: 'PALMEIRA_DENDEM' },
        { label: 'Umbila (Khaya anthotheca)', value: 'UMBILA' },
        { label: 'Mutondo (Isoberlinia angolensis)', value: 'MUTONDO' },
        { label: 'Cacaueiro-do-mato (Cola edulis)', value: 'CACAUEIRO' },
        { label: 'Oliveira africana (Olea africana)', value: 'OLIVEIRA' },
        { label: 'Tamboti (Spirostachys africana)', value: 'TAMBOTI' },
        { label: 'Marula (Sclerocarya birrea)', value: 'MARULA' }
    ];

    // Função para buscar dados do produtor
    const fetchProdutor = async () => {
        if (!id) return;

        setLoading(true);
        try {
            const response = await api.get(`/produtorFlorestal/${id}`);
            const data = response.data;

            // Validar e limpar datas inválidas
            const cleanedData = {
                ...data,
                validade_pretendida: data.validade_pretendida && !isNaN(new Date(data.validade_pretendida).getTime())
                    ? data.validade_pretendida : null,
                data_da_inspe_o: data.data_da_inspe_o && !isNaN(new Date(data.data_da_inspe_o).getTime())
                    ? data.data_da_inspe_o : null,
                data: data.data && !isNaN(new Date(data.data).getTime())
                    ? data.data : null
            };

            setProdutor(cleanedData);
            setFormData({
                ...cleanedData,
                // Converter arrays de strings em arrays de objetos para multiselect
                esp_cies_predominantes: cleanedData.esp_cies_predominantes ?
                    cleanedData.esp_cies_predominantes.split(',').map(item => ({
                        label: getSpeciesLabel(item.trim()),
                        value: item.trim()
                    })) : [],
                tipo_de_licen_a_solicitada: cleanedData.tipo_de_licen_a_solicitada ?
                    cleanedData.tipo_de_licen_a_solicitada.split(',').map(item => ({
                        label: getLicenseLabel(item.trim()),
                        value: item.trim()
                    })) : [],
                // Converter valores simples em objetos para select
                propriedade: getSelectValue(cleanedData.propriedade, propriedadeOptions),
                estado_de_conserva_o: getSelectValue(cleanedData.estado_de_conserva_o, estadoConservacaoOptions),
                autoriza_o_final: getSelectValue(cleanedData.autoriza_o_final, autorizacaoOptions),
                resultado_da_inspe_o: getSelectValue(cleanedData.resultado_da_inspe_o, resultadoInspecaoOptions),
                auto_emitido: getSelectValue(cleanedData.auto_emitido, autoEmitidoOptions),
                tipo_de_ocorr_ncia: getSelectValue(cleanedData.tipo_de_ocorr_ncia, tipoOcorrenciaOptions),
                modo_de_submiss_o: getSelectValue(cleanedData.modo_de_submiss_o, modoSubmissaoOptions),
                tipo_de_infra_o: getSelectValue(cleanedData.tipo_de_infra_o, tipoInfracaoOptions),
                status_da_san_o: getSelectValue(cleanedData.status_da_san_o, statusSancaoOptions),
                estado: getSelectValue(cleanedData.estado, statusOptions)
            });
        } catch (error) {
            console.error('Erro ao buscar produtor:', error);
            showToast('error', 'Erro ao carregar dados do produtor');
        } finally {
            setLoading(false);
        }
    };

    // Função auxiliar para obter label da espécie
    const getSpeciesLabel = (value) => {
        const speciesMap = {
            'BAOBA': 'Baobá (Adansonia digitata)',
            'IMBONDEIRO': 'Imbondeiro (Adansonia sp.)',
            'MUSSIVI': 'Mussivi (Brachystegia spiciformis)',
            'MUVULUNGO': 'Muvulungo (Afzelia quanzensis)',
            'MUPANDA': 'Mupanda (Julbernardia paniculata)',
            'KIAAT': 'Kiaat / Mukwa (Pterocarpus angolensis)',
            'EUCALIPTO': 'Eucalipto (Eucalyptus spp.)',
            'MONGONGO': 'Mongongo (Schinziophyton rautanenii)',
            'PALMEIRA_OLEO': 'Palmeira-de-óleo (Elaeis guineensis)',
            'PALMEIRA_DENDEM': 'Palmeira-dendém (Elaeis spp.)',
            'UMBILA': 'Umbila (Khaya anthotheca)',
            'MUTONDO': 'Mutondo (Isoberlinia angolensis)',
            'CACAUEIRO': 'Cacaueiro-do-mato (Cola edulis)',
            'TAMBOTI': 'Tamboti (Spirostachys africana)',
            'OLIVEIRA': 'Oliveira africana (Olea africana)',
            'MARULA': 'Marula (Sclerocarya birrea)'
        };
        return speciesMap[value] || value;
    };

    // Função auxiliar para obter label da licença
    const getLicenseLabel = (value) => {
        const licenseMap = {
            'CORTE': 'Corte',
            'TRANSPORTE': 'Transporte',
            'CARVAO': 'Carvão',
            'PFNM': 'PFNM (Produtos Florestais Não Madeireiros)'
        };
        return licenseMap[value] || value;
    };

    // Função auxiliar para obter valor de select
    const getSelectValue = (value, options) => {
        if (!value || !options) return null;
        return options.find(option => option.value === value) || null;
    };

    // Função para obter string de valor de select
    const getSelectStringValue = (selectObject) => {
        if (typeof selectObject === 'string') return selectObject;
        if (selectObject && typeof selectObject === 'object' && selectObject.value) {
            return selectObject.value;
        }
        return selectObject || '';
    };

    // Função para obter coordenadas GPS
    const getCoordinates = (gpsString) => {
        if (!gpsString) return { lat: 0, lng: 0 };
        const coords = gpsString.split(',');
        return {
            lat: parseFloat(coords[0]) || 0,
            lng: parseFloat(coords[1]) || 0
        };
    };

    // Função para mostrar toast
    const showToast = (type, message) => {
        setToastMessage({ type, message });
        setTimeout(() => setToastMessage(null), 5000);
    };

    // Função para atualizar dados do formulário
    const updateFormData = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Função para obter cor do status
    const getStatusColor = (status) => {
        const colors = {
            'Pendente': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'Aprovado': 'bg-green-100 text-green-800 border-green-300',
            'Rejeitado': 'bg-red-100 text-red-800 border-red-300',
            'Cancelado': 'bg-gray-100 text-gray-800 border-gray-300',
            'Recebido': 'bg-blue-100 text-blue-800 border-blue-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Função para converter multiselect em string
    const convertMultiselectToString = (multiselectValue) => {
        if (Array.isArray(multiselectValue)) {
            return multiselectValue.map(item => item.value || item).join(',');
        }
        return multiselectValue || '';
    };

    // Função para salvar dados
    const handleSave = async () => {
        try {
            setLoading(true);

            const dataToSend = {
                id: parseInt(id),
                nome_do_Produtor: formData.nome_do_Produtor || '',
                bI_NIF: formData.bI_NIF || '',
                contacto: formData.contacto || '',
                localiza_o_GPS: formData.localiza_o_GPS || '',
                propriedade: getSelectStringValue(formData.propriedade),
                esp_cies_predominantes: convertMultiselectToString(formData.esp_cies_predominantes),
                volume_estimado_m: formData.volume_estimado_m || '',
                estado_de_conserva_o: getSelectStringValue(formData.estado_de_conserva_o),
                tipo_de_licen_a_solicitada: convertMultiselectToString(formData.tipo_de_licen_a_solicitada),
                _rea_associada: formData._rea_associada || '',
                validade_pretendida: formData.validade_pretendida || '',
                autoriza_o_final: getSelectStringValue(formData.autoriza_o_final),
                iD_da_licen_a_fiscalizada: formData.iD_da_licen_a_fiscalizada || '',
                data_da_inspe_o: formData.data_da_inspe_o || '',
                localiza_o_GPS_001: formData.localiza_o_GPS_001 || '',
                resultado_da_inspe_o: getSelectStringValue(formData.resultado_da_inspe_o),
                descri_o_da_infra_o: formData.descri_o_da_infra_o || '',
                auto_emitido: getSelectStringValue(formData.auto_emitido),
                tipo_de_ocorr_ncia: getSelectStringValue(formData.tipo_de_ocorr_ncia),
                modo_de_submiss_o: getSelectStringValue(formData.modo_de_submiss_o),
                localiza_o_GPS_002: formData.localiza_o_GPS_002 || '',
                descri_o_adicional: formData.descri_o_adicional || '',
                esp_cie_produzida: formData.esp_cie_produzida || '',
                volume_anual_m: formData.volume_anual_m || '',
                origem_rea_cadastrada: formData.origem_rea_cadastrada || '',
                documentos_de_transporte: formData.documentos_de_transporte || '',
                n_mero_do_auto: formData.n_mero_do_auto || '',
                data: formData.data || '',
                tipo_de_infra_o: getSelectStringValue(formData.tipo_de_infra_o),
                valor_AKZ: formData.valor_AKZ || '',
                status_da_san_o: getSelectStringValue(formData.status_da_san_o)
            };

            const response = await api.put(`/produtorFlorestal/${id}`, dataToSend);
            showToast('success', 'Dados atualizados com sucesso!');
            setIsEditing(false);
            setProdutor(response.data);

        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar dados. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };

    // Função para alterar estado
    const handleStatusChange = (value) => {
        setPendingStatusValue(value);
        setShowStatusModal(true);
    };

    const confirmStatusChange = async () => {
        const novoStatus = getSelectStringValue(pendingStatusValue);
        setAlterandoStatus(true);
        setShowStatusModal(false);

        try {
            const formData = new FormData();
            formData.append('Id', parseInt(id));
            formData.append('Estado', novoStatus);

            await api.patch('/produtorFlorestal/estado', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showToast('success', `Estado alterado para ${novoStatus} com sucesso`);
            setFormData(prev => ({ ...prev, estado: pendingStatusValue }));
            setProdutor(prev => ({ ...prev, estado: novoStatus }));

        } catch (error) {
            console.error('Erro ao alterar estado:', error);
            showToast('error', 'Erro ao alterar estado do produtor');
        } finally {
            setAlterandoStatus(false);
            setPendingStatusValue(null);
        }
    };

    // Função para abrir modal de mídia usando endpoints específicos
    const openMediaModal = (endpoint, type, title) => {
        const baseUrl = 'https://mwangobrainsa-001-site2.mtempurl.com';
        const fullUrl = `${baseUrl}${endpoint}`;

        setCurrentMedia({ type, url: fullUrl, title });
        setShowMediaModal(true);
    };

    // Função para renderizar botão de mídia
    const renderMediaButton = (fieldValue, endpoint, type, title, icon) => {
        if (!fieldValue) return null;

        const Icon = icon;
        return (
            <button
                onClick={() => openMediaModal(endpoint, type, title)}
                className="flex items-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
            >
                <Icon size={16} className="mr-2" />
                {title}
            </button>
        );
    };

    // Função para renderizar conteúdo dos steps
    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Inventário
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <TreePine className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Inventário e Mapeamento Florestal</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações básicas do produtor florestal e localização da propriedade.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <User className="w-5 h-5 mr-2 text-green-600" />
                                    Dados do Produtor
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Nome do Produtor"
                                        value={formData.nome_do_Produtor || ''}
                                        onChange={(value) => updateFormData('nome_do_Produtor', value)}
                                        disabled={!isEditing}
                                        iconStart={<User size={18} />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="BI/NIF"
                                        value={formData.bI_NIF || ''}
                                        onChange={(value) => updateFormData('bI_NIF', value)}
                                        disabled={!isEditing}
                                        iconStart={<CreditCard size={18} />}
                                    />

                                    <CustomInput
                                        type="tel"
                                        label="Contacto"
                                        value={formData.contacto || ''}
                                        disabled={!isEditing}
                                        iconStart={<Phone size={18} />}
                                        onChange={(value) => {
                                            // Permite apenas números e limita a 9 dígitos
                                            const onlyNumbers = value.replace(/\D/g, '').slice(0, 9);
                                            updateFormData('contacto', value, onlyNumbers);
                                        }}
                                        placeholder="Ex: 923456789"
                                        maxLength={9}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Propriedade"
                                        value={formData.propriedade}
                                        options={propriedadeOptions}
                                        onChange={(value) => updateFormData('propriedade', value)}
                                        disabled={!isEditing}
                                        iconStart={<Building size={18} />}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                                    Localização GPS
                                </h4>
                                <div className="mb-6">
                                    <CustomInput
                                        type="text"
                                        label="Coordenadas GPS"
                                        value={formData.localiza_o_GPS || ''}
                                        onChange={(value) => updateFormData('localiza_o_GPS', value)}
                                        disabled={!isEditing}
                                        placeholder="Ex: -9.579084,13.491211"
                                    />
                                </div>

                                {formData.localiza_o_GPS && (
                                    <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
                                        <MapContainer
                                            center={[getCoordinates(formData.localiza_o_GPS).lat, getCoordinates(formData.localiza_o_GPS).lng]}
                                            zoom={15}
                                            style={{ height: '100%', width: '100%' }}
                                        >
                                            <TileLayer
                                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                                attribution='&copy; OpenStreetMap contributors'
                                            />
                                            <Marker position={[getCoordinates(formData.localiza_o_GPS).lat, getCoordinates(formData.localiza_o_GPS).lng]}>
                                                <Popup>
                                                    <div className="text-center">
                                                        <strong>{formData.nome_do_Produtor}</strong><br />
                                                        Lat: {getCoordinates(formData.localiza_o_GPS).lat}°<br />
                                                        Lng: {getCoordinates(formData.localiza_o_GPS).lng}°
                                                    </div>
                                                </Popup>
                                            </Marker>
                                        </MapContainer>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Trees className="w-5 h-5 mr-2 text-green-600" />
                                    Características Florestais
                                </h4>
                                <div className="space-y-6">
                                    <CustomInput
                                        type="multiselect"
                                        label="Espécies Predominantes"
                                        value={formData.esp_cies_predominantes || []}
                                        options={especiesOptions}
                                        onChange={(value) => updateFormData('esp_cies_predominantes', value)}
                                        disabled={!isEditing}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomInput
                                            type="number"
                                            label="Volume Estimado (m³)"
                                            value={formData.volume_estimado_m || ''}
                                            onChange={(value) => updateFormData('volume_estimado_m', value)}
                                            disabled={!isEditing}
                                            min="0"
                                            step="0.1"
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Estado de Conservação"
                                            value={formData.estado_de_conserva_o}
                                            options={estadoConservacaoOptions}
                                            onChange={(value) => updateFormData('estado_de_conserva_o', value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 1: // Licenciamento
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Shield className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Licenciamento e Autorizações</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre licenças solicitadas e autorizações florestais.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Shield className="w-5 h-5 mr-2 text-blue-600" />
                                    Licenças e Autorizações
                                </h4>
                                <div className="space-y-6">
                                    <CustomInput
                                        type="multiselect"
                                        label="Tipo de Licença Solicitada"
                                        value={formData.tipo_de_licen_a_solicitada || []}
                                        options={tipoLicencaOptions}
                                        onChange={(value) => updateFormData('tipo_de_licen_a_solicitada', value)}
                                        disabled={!isEditing}
                                    />

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomInput
                                            type="text"
                                            label="Área Associada"
                                            value={formData._rea_associada || ''}
                                            onChange={(value) => updateFormData('_rea_associada', value)}
                                            disabled={!isEditing}
                                        />

                                        <CustomInput
                                            type="date"
                                            label="Validade Pretendida"
                                            value={formatDateForInput(formData.validade_pretendida)}
                                            onChange={(value) => updateFormData('validade_pretendida', value)}
                                            disabled={!isEditing}
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Autorização Final"
                                            value={formData.autoriza_o_final}
                                            options={autorizacaoOptions}
                                            onChange={(value) => updateFormData('autoriza_o_final', value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <FileText className="w-5 h-5 mr-2 text-blue-600" />
                                    Documentos
                                </h4>
                                <div className="flex gap-3">
                                    {renderMediaButton(
                                        formData.upload_de_documentos,
                                        `/api/produtorFlorestal/${id}/documento`,
                                        'document',
                                        'Ver Documento',
                                        Eye
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 2: // Fiscalização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Fiscalização e Inspeções</h3>
                            </div>
                            <p className="text-gray-600">
                                Registos de fiscalizações e inspeções realizadas na propriedade florestal.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Activity className="w-5 h-5 mr-2 text-orange-600" />
                                    Dados da Fiscalização
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="ID da Licença Fiscalizada"
                                        value={formData.iD_da_licen_a_fiscalizada || ''}
                                        onChange={(value) => updateFormData('iD_da_licen_a_fiscalizada', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="date"
                                        label="Data da Inspeção"
                                        value={formatDateForInput(formData.data_da_inspe_o)}
                                        onChange={(value) => updateFormData('data_da_inspe_o', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Resultado da Inspeção"
                                        value={formData.resultado_da_inspe_o}
                                        options={resultadoInspecaoOptions}
                                        onChange={(value) => updateFormData('resultado_da_inspe_o', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Auto Emitido?"
                                        value={formData.auto_emitido}
                                        options={autoEmitidoOptions}
                                        onChange={(value) => updateFormData('auto_emitido', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Localização GPS"
                                        value={formData.localiza_o_GPS_001 || ''}
                                        onChange={(value) => updateFormData('localiza_o_GPS_001', value)}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="mt-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Descrição da Infração"
                                        value={formData.descri_o_da_infra_o || ''}
                                        onChange={(value) => updateFormData('descri_o_da_infra_o', value)}
                                        disabled={!isEditing}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Camera className="w-5 h-5 mr-2 text-orange-600" />
                                    Evidências da Fiscalização
                                </h4>
                                <div className="flex gap-3">
                                    {renderMediaButton(
                                        formData.foto,
                                        `/api/produtorFlorestal/${id}/fotoDefiscalizacaoEInspecoes`,
                                        'image',
                                        'Ver Foto',
                                        Camera
                                    )}
                                    {renderMediaButton(
                                        formData.v_deo,
                                        `/api/produtorFlorestal/${id}/videoDefiscalizacaoEInspecoes`,
                                        'video',
                                        'Ver Vídeo',
                                        Play
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Ocorrências
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <AlertCircle className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Ocorrências Florestais</h3>
                            </div>
                            <p className="text-gray-600">
                                Registo de ocorrências como queimadas, pragas, desmatamento ilegal e outras situações.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <AlertCircle className="w-5 h-5 mr-2 text-purple-600" />
                                    Tipo de Ocorrência
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Tipo de Ocorrência"
                                        value={formData.tipo_de_ocorr_ncia}
                                        options={tipoOcorrenciaOptions}
                                        onChange={(value) => updateFormData('tipo_de_ocorr_ncia', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Modo de Submissão"
                                        value={formData.modo_de_submiss_o}
                                        options={modoSubmissaoOptions}
                                        onChange={(value) => updateFormData('modo_de_submiss_o', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Localização GPS"
                                        value={formData.localiza_o_GPS_002 || ''}
                                        onChange={(value) => updateFormData('localiza_o_GPS_002', value)}
                                        disabled={!isEditing}
                                    />
                                </div>

                                <div className="mt-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Descrição Adicional"
                                        value={formData.descri_o_adicional || ''}
                                        onChange={(value) => updateFormData('descri_o_adicional', value)}
                                        disabled={!isEditing}
                                        rows={4}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Camera className="w-5 h-5 mr-2 text-purple-600" />
                                    Evidências da Ocorrência
                                </h4>
                                <div className="flex gap-3">
                                    {renderMediaButton(
                                        formData.foto_001,
                                        `/api/produtorFlorestal/${id}/fotoDeOcorrenciasFlorestais`,
                                        'image',
                                        'Ver Foto',
                                        Camera
                                    )}
                                    {renderMediaButton(
                                        formData.v_deo_001,
                                        `/api/produtorFlorestal/${id}/videoDeOcorrenciasFlorestais`,
                                        'video',
                                        'Ver Vídeo',
                                        Play
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Produção
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Trees className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Produção e Comércio Florestal</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre produção florestal, volumes e destinos comerciais.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Trees className="w-5 h-5 mr-2 text-green-600" />
                                    Dados de Produção
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Espécie Produzida"
                                        value={formData.esp_cie_produzida || ''}
                                        onChange={(value) => updateFormData('esp_cie_produzida', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Volume Anual (m³)"
                                        value={formData.volume_anual_m || ''}
                                        onChange={(value) => updateFormData('volume_anual_m', value)}
                                        disabled={!isEditing}
                                        min="0"
                                        step="0.1"
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Origem (Área Cadastrada)"
                                        value={formData.origem_rea_cadastrada || ''}
                                        onChange={(value) => updateFormData('origem_rea_cadastrada', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Documentos de Transporte"
                                        value={formData.documentos_de_transporte || ''}
                                        onChange={(value) => updateFormData('documentos_de_transporte', value)}
                                        disabled={!isEditing}
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Sanções
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-2xl p-6 mb-8 border border-red-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Gavel className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Sanções e Autos de Infração</h3>
                            </div>
                            <p className="text-gray-600">
                                Registo de sanções aplicadas e autos de infração emitidos.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Gavel className="w-5 h-5 mr-2 text-red-600" />
                                    Dados da Sanção
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Número do Auto"
                                        value={formData.n_mero_do_auto || ''}
                                        onChange={(value) => updateFormData('n_mero_do_auto', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="date"
                                        label="Data"
                                        value={formatDateForInput(formData.data)}
                                        onChange={(value) => updateFormData('data', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Tipo de Infração"
                                        value={formData.tipo_de_infra_o}
                                        options={tipoInfracaoOptions}
                                        onChange={(value) => updateFormData('tipo_de_infra_o', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Valor (AKZ)"
                                        value={formData.valor_AKZ || ''}
                                        onChange={(value) => updateFormData('valor_AKZ', value)}
                                        disabled={!isEditing}
                                        min="0"
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Status da Sanção"
                                        value={formData.status_da_san_o}
                                        options={statusSancaoOptions}
                                        onChange={(value) => updateFormData('status_da_san_o', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Camera className="w-5 h-5 mr-2 text-red-600" />
                                    Evidências da Sanção
                                </h4>
                                <div className="flex gap-3">
                                    {renderMediaButton(
                                        formData.foto_002,
                                        `/api/produtorFlorestal/${id}/fotoDeSancoesEAutosDeInfracao`,
                                        'image',
                                        'Ver Foto',
                                        Camera
                                    )}
                                    {renderMediaButton(
                                        formData.v_deo_002,
                                        `/api/produtorFlorestal/${id}/videoDeSancoesEAutosDeInfracao`,
                                        'video',
                                        'Ver Vídeo',
                                        Play
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return <div className="text-center text-gray-500">Etapa não encontrada</div>;
        }
    };

    // Carregar dados quando o componente monta
    useEffect(() => {
        fetchProdutor();
    }, [id]);

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Carregando dados do produtor...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${toastMessage.type === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
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

            {/* Modal de Cancelamento */}
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
                                onClick={() => {
                                    setIsEditing(false);
                                    fetchProdutor();
                                    setShowCancelModal(false);
                                    showToast('info', 'Edição cancelada');
                                }}
                                className="flex-1 p-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-all"
                            >
                                Sim, cancelar
                            </button>
                            <button
                                onClick={() => setShowCancelModal(false)}
                                className="flex-1 p-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                            >
                                Não
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Modal de Status */}
            {showStatusModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-sm flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                            <RefreshCw className="w-6 h-6 text-blue-600" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Confirmar Alteração de Estado</h3>
                        <p className="text-gray-600 text-center text-sm mb-4">
                            Deseja alterar o estado para: <br />
                            <span className="font-bold text-blue-600">{pendingStatusValue?.label || pendingStatusValue}</span>?
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

            {/* Modal de Mídia */}
            {showMediaModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-4xl mx-4 max-h-[90vh] overflow-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-semibold text-gray-900">{currentMedia.title}</h3>
                            <button
                                onClick={() => setShowMediaModal(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>
                        <div className="flex justify-center">
                            {currentMedia.type === 'image' && (
                                <img
                                    src={currentMedia.url}
                                    alt={currentMedia.title}
                                    className="max-w-full max-h-[70vh] object-contain"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                />
                            )}
                            {currentMedia.type === 'video' && (
                                <video
                                    controls
                                    className="max-w-full max-h-[70vh]"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                    }}
                                >
                                    <source src={currentMedia.url} type="video/mp4" />
                                    Seu navegador não suporta a tag de vídeo.
                                </video>
                            )}
                            {currentMedia.type === 'document' && (
                                <iframe
                                    src={currentMedia.url}
                                    className="w-full h-[70vh]"
                                    title={currentMedia.title}
                                />
                            )}
                            <div style={{ display: 'none' }} className="text-center py-8">
                                <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600">Não foi possível carregar o arquivo</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Header Principal */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            {/* Título e navegação */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/GerenciaRNPA/gestao-florestal/produtores/pessoal')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isEditing ? 'Editando Produtor Florestal' : 'Detalhes do Produtor Florestal'}
                                    </h1>
                                    <p className="text-gray-600">
                                        ID: {produtor._id} | {formData.nome_do_Produtor}
                                    </p>
                                </div>
                            </div>

                            {/* Botões de ação do cabeçalho */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setShowCancelModal(true)}
                                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                                        >
                                            {loading ? (
                                                <Loader className="w-4 h-4 mr-2 animate-spin" />
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col sm:flex-row  gap-3 w-full sm:w-auto">
                                        <button
                                            onClick={() => setIsEditing(true)}
                                            className="flex items-center px-4 py-2 h-[44px] bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                        >
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </button>
                                        {/* Select de status */}
                                        <div className="min-w-[180px]">
                                            <CustomInput
                                                type="select"
                                                label=""
                                                value={formData.estado}
                                                options={statusOptions}
                                                onChange={handleStatusChange}
                                                disabled={alterandoStatus}
                                                placeholder={alterandoStatus ? "Alterando..." : "Status"}
                                                iconStart={alterandoStatus ?
                                                    <Loader className="w-4 h-4 animate-spin" /> :
                                                    <RefreshCw size={18} />
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className="mt-4 flex items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(getSelectStringValue(formData.estado))}`}>
                                {getSelectStringValue(formData.estado)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Steps do Formulário */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                    {/* Step Navigation */}
                    <div className="flex justify-between items-center px-8 py-6 border-b border-gray-100 overflow-x-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeIndex ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-2 transition-colors ${index < activeIndex ? 'bg-blue-500 text-white' :
                                        index === activeIndex ? 'bg-blue-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index < activeIndex ? (
                                            <CheckCircle size={20} />
                                        ) : (
                                            <StepIcon size={20} />
                                        )}
                                    </div>
                                    <span className={`text-sm text-center font-medium ${index === activeIndex ? 'text-blue-700' : 'text-gray-500'
                                        }`}>
                                        {step.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 h-2">
                        <div
                            className="bg-blue-600 h-2 transition-all duration-300"
                            style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
                        ></div>
                    </div>

                    {/* Step Content */}
                    <div className="step-content p-8 bg-white min-h-[600px]">
                        {renderStepContent(activeIndex)}
                    </div>

                    {/* Navigation Buttons */}
                    <div className="flex justify-between items-center p-6 border-t border-gray-100 bg-gray-50">
                        <button
                            className={`px-6 py-2 rounded-lg border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
                                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                                }`}
                            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
                            disabled={activeIndex === 0}
                        >
                            <ChevronLeft size={20} className="mr-2" />
                            Anterior
                        </button>

                        <div className="text-sm text-gray-500 font-medium">
                            Etapa {activeIndex + 1} de {steps.length}
                        </div>

                        <button
                            className={`px-6 py-2 rounded-lg flex items-center transition-all font-medium ${activeIndex === steps.length - 1 ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600' :
                                'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                }`}
                            onClick={() => setActiveIndex((prev) => Math.min(prev + 1, steps.length - 1))}
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

export default VisualizarProdutorFlorestal;