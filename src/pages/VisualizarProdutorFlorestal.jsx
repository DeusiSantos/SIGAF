import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
//import { TreePine } from "react-icons/gi";
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    RefreshCw,
    Download,
    CreditCard,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    FileText,
    AlertCircle,
    CheckCircle,
    Info,
    Trees,
    Home,
    Award,
    Clock,
    Map,
    Navigation,
    Users,
    Building,
    Shield,
    Truck,
    DollarSign,
    Camera,
    ChevronRight,
    ChevronLeft,
    Package,
    AlertTriangle
} from 'lucide-react';

// Importações do React Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import provinciasData from '../components/Provincias.json';
import CustomInput from '../components/CustomInput';
//import { gerarFichaProdutorPDF } from './public/GerarCartaoRNPA';
//import axios from 'axios';
import api from '../services/api';

// Corrigir ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hook para buscar produtor florestal por ID
const useProdutorFlorestalById = (id) => {
    const [produtor, setProdutor] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProdutor = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const token = "91c163addd72730d6bfe7a2d80eac5129767a044";
                const response = await api.get(`/formulario/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Token ${token}`
                    }
                });
                setProdutor(response.data);
            } catch (err) {
                console.error('Erro ao buscar produtor florestal:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProdutor();
    }, [id]);

    return { produtor, loading, error };
};

// Função para mapear dados da API para produtor florestal
const mapApiDataToProdutorFlorestal = (apiData) => {
    if (!apiData) return null;

    const getStatus = (item) => {
        if (item.estado) {
            const estado = item.estado.toLowerCase();
            switch (estado) {
                case 'aprovado': return 'LICENÇA_APROVADA';
                case 'rejeitado': return 'REJEITADO';
                case 'pendente': return 'PENDENTE';
                case 'recebido': return 'PROCESSO_RECEBIDO';
                case 'cancelado': return 'CANCELADO';
                default: return 'PENDENTE';
            }
        }
        if (item.permissao === 'nao') return 'REJEITADO';
        if (item._status === 'submitted_via_web') return 'PROCESSO_RECEBIDO';
        return 'PENDENTE';
    };

    const getCoordinates = (gpsString) => {
        if (!gpsString) return { lat: 0, lng: 0 };
        const coords = gpsString.split(' ');
        return {
            lat: parseFloat(coords[0]) || 0,
            lng: parseFloat(coords[1]) || 0
        };
    };

    return {
        id: apiData._uuid || apiData._id?.toString(),
        codigoRNPA: `RNPF${new Date(apiData.registration_date || '2025-01-01').getFullYear()}${apiData._id?.toString().slice(-3)}`,
        estado: apiData.estado,
        statusProcesso: getStatus(apiData),
        dataRegistro: apiData.registration_date,
        dataSubmissao: apiData._submission_time,
        statusSubmissao: apiData._status,

        // Inquiridor
        codigoInquiridor: apiData.codigo_inquiridor,
        nomeInquiridor: apiData.nome_inquiridor,
        nomeMeioInquiridor: apiData.nome_meio,
        sobrenomeInquiridor: apiData.sobrenome_inquiridor,

        // Localização
        provincia: apiData.Provincia?.toUpperCase() || 'N/A',
        municipio: apiData.Municipio || 'N/A',
        comuna: apiData.comuna || '',
        geoLevel4: apiData.geo_level_4 || 'N/A',
        geoLevel5: apiData.geo_level_5 || 'N/A',
        geoLevel6: apiData.geo_level_6 || 'N/A',
        coordenadasGPS: getCoordinates(apiData.gps_coordinates),
        permissao: apiData.permissao === 'sim',

        // Dados pessoais
        nomeProdutor: apiData.nome_produtor || '',
        nomeMeioProdutor: apiData.nome_meio_produtor || '',
        sobrenomeProdutor: apiData.sobrenome_produtor || '',
        nome: apiData.beneficiary_name || `${apiData.nome_produtor || ''} ${apiData.nome_meio_produtor || ''} ${apiData.sobrenome_produtor || ''}`.trim(),
        genero: apiData.beneficiary_gender === 'm' ? 'MASCULINO' : 'FEMININO',
        numeroBI: apiData.beneficiary_id_number || 'N/A',
        telefone: apiData.beneficiary_phone_number || 'N/A',
        dataNascimento: apiData.beneficiary_date_of_birth || '1990-01-01',
        lugarNascimento: apiData.lugar_nascimento || '',
        estadoCivil: apiData.estado_civil || 'solteiro',
        nivelEscolaridade: apiData.nivel_escolaridade || 'primario',

        // Dados florestais específicos
        propriedade: {
            tipo: apiData.propriedade_tipo || 'Privada',
            nome: apiData.propriedade_nome || 'Área Florestal Principal',
            areaTotal: parseFloat(apiData.area_total) || 0,
            areaExplorada: parseFloat(apiData.area_explorada) || 0,
            areaFlorestal: parseFloat(apiData.area_florestal) || 0
        },
        
        especiesFlorestais: apiData.especies_florestais ? 
            apiData.especies_florestais.split(',').map(e => e.trim()) : 
            ['Eucalipto', 'Pinus'],
        
        volumeEstimado: parseFloat(apiData.volume_estimado) || Math.floor(Math.random() * 500) + 100,
        
        licenciamento: {
            tipo: apiData.licenca_tipo || 'Corte',
            status: apiData.licenca_estado || 'Pendente',
            dataEmissao: apiData.licenca_data_emissao || '',
            dataValidade: apiData.licenca_data_validade || '',
            numeroLicenca: apiData.licenca_numero || ''
        },
        
        fiscalizacao: {
            resultado: apiData.fiscalizacao_resultado || 'Conforme',
            auto: apiData.fiscalizacao_auto || 'N/A',
            dataInspecao: apiData.fiscalizacao_data || '',
            fiscal: apiData.fiscal_responsavel || ''
        },
        
        penalidades: {
            infracao: apiData.penalidades_infracao || 'Nenhuma',
            valor: parseFloat(apiData.penalidades_valor) || 0,
            status: apiData.penalidades_status || 'Sem penalidades',
            dataAuto: apiData.penalidades_data || ''
        },
        
        transporte: {
            destino: apiData.transporte_destino || 'N/A',
            placa: apiData.transporte_placa || 'N/A',
            volume: parseFloat(apiData.transporte_volume) || 0,
            status: apiData.transporte_status || 'N/A'
        },

        // Dados originais
        dadosOriginais: apiData
    };
};

const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return '';
    return nomeCompleto.trim().split(' ')[0];
};

// Componente do Mapa
const ProducerMap = ({ coordinates, producerName }) => {
    if (!coordinates || !coordinates.lat || !coordinates.lng) {
        return (
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                    <MapPin className="w-8 h-8 mx-auto mb-2" />
                    <p>Coordenadas não disponíveis</p>
                </div>
            </div>
        );
    }

    const position = [coordinates.lat, coordinates.lng];

    return (
        <div className="h-64 rounded-lg overflow-hidden border border-gray-300">
            <MapContainer
                center={position}
                zoom={15}
                style={{ height: '100%', width: '100%' }}
                scrollWheelZoom={false}
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={position}>
                    <Popup>
                        <div className="text-center">
                            <strong>{producerName}</strong><br />
                            Lat: {coordinates.lat}°<br />
                            Lng: {coordinates.lng}°
                        </div>
                    </Popup>
                </Marker>
            </MapContainer>
        </div>
    );
};

const VisualizarProdutorFlorestal = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados para municípios
    //const [municipiosOptions, setMunicipiosOptions] = useState([]);

    // Estados principais
    const [produtor, setProdutor] = useState(null);
    //const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    //const [gerando, setGerando] = useState(false);
   // const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Estados para uploads de imagem
   // const [imagemUrlPerfil, setImagemUrlPerfil] = useState('');
    //const [imagemUrlDigitais, setImagemUrlDigitais] = useState('');
   // const [uploadingPerfil, setUploadingPerfil] = useState(false);
   // const [uploadingDigitais, setUploadingDigitais] = useState(false);
   // const [novaFotoPerfil, setNovaFotoPerfil] = useState(null);
   // const [novaFotoDigitais, setNovaFotoDigitais] = useState(null);
   // const [previewPerfil, setPreviewPerfil] = useState('');
    //const [previewDigitais, setPreviewDigitais] = useState('');

    // Estados para modais
   // const [showCancelModal, setShowCancelModal] = useState(false);
   // const [showStatusModal, setShowStatusModal] = useState(false);
   // const [pendingStatusValue, setPendingStatusValue] = useState(null);

    // Steps do formulário florestal
    const steps = [
        { label: 'Inquiridor', icon: User },
        { label: 'Localização', icon: MapPin },
        { label: 'Produtor', icon: User },
        { label: 'Propriedade', icon: Trees },
        { label: 'Espécies', icon: Trees },
        { label: 'Licenciamento', icon: FileText },
        { label: 'Fiscalização', icon: Shield },
        { label: 'Transporte', icon: Truck },
        { label: 'Penalidades', icon: AlertTriangle }
    ];

    // Hook para buscar dados
    const { produtor: produtorAPI, loading: loadingAPI, error: errorAPI } = useProdutorFlorestalById(id);

    // Mapear dados da API
    const produtorMapeado = useMemo(() => {
        if (!produtorAPI) return null;
        return mapApiDataToProdutorFlorestal(produtorAPI);
    }, [produtorAPI]);

    // Opções para selects
    const statusOptions = [
        { label: 'Processo Recebido', value: 'PROCESSO_RECEBIDO' },
        { label: 'Pendente', value: 'PENDENTE' },
        { label: 'Licença Aprovada', value: 'LICENÇA_APROVADA' },
        { label: 'Rejeitado', value: 'REJEITADO' }
    ];

    const generoOptions = [
        { label: 'Masculino', value: 'MASCULINO' },
        { label: 'Feminino', value: 'FEMININO' }
    ];

    const estadoCivilOptions = [
        { label: 'Solteiro(a)', value: 'solteiro' },
        { label: 'União de facto', value: 'uniao_facto' },
        { label: 'Casado(a)', value: 'casado' },
        { label: 'Divorciado(a)', value: 'divorciado' },
        { label: 'Separado(a)', value: 'separado' },
        { label: 'Viúvo(a)', value: 'viuvo' }
    ];

    const nivelEscolaridadeOptions = [
        { label: 'Pré-escolar (3-5 anos)', value: 'pre_escolar' },
        { label: 'Ensino Primário', value: 'primario' },
        { label: 'Ensino Secundário', value: 'secundario' },
        { label: 'Ensino Superior', value: 'superior' },
        { label: 'Outro', value: 'outro' },
        { label: 'Nenhum', value: 'nenhum' },
        { label: 'Não sei', value: 'nao_sei' }
    ];

    // Carregar dados quando disponíveis
    useEffect(() => {
        const loadProdutor = async () => {
            setLoading(loadingAPI);

            if (errorAPI) {
                setToastMessage({ type: 'error', message: `Erro ao carregar produtor florestal: ${errorAPI}` });
                setLoading(false);
                return;
            }

            if (!loadingAPI && produtorMapeado) {
                try {
                    setProdutor(produtorMapeado);

                    const formattedData = {
                        ...produtorMapeado,
                        genero: getSelectValue(produtorMapeado.genero, generoOptions),
                        provincia: getSelectValue(produtorMapeado.provincia, provinciasData.map(p => ({ label: p.nome, value: p.nome }))),
                        statusProcesso: getSelectValue(produtorMapeado.statusProcesso, statusOptions),
                        estadoCivil: getSelectValue(produtorMapeado.estadoCivil, estadoCivilOptions),
                        nivelEscolaridade: getSelectValue(produtorMapeado.nivelEscolaridade, nivelEscolaridadeOptions),
                    };

                    setFormData(formattedData);
                    setLoading(false);
                } catch (error) {
                    console.error('Erro ao processar dados:', error);
                    setToastMessage({ type: 'error', message: 'Erro ao processar dados do produtor florestal' });
                    setLoading(false);
                }
            } else if (!loadingAPI && !produtorMapeado) {
                setToastMessage({ type: 'error', message: 'Produtor florestal não encontrado' });
                setLoading(false);
            }
        };

        loadProdutor();
    }, [produtorMapeado, loadingAPI, errorAPI]);

    // Funções utilitárias
    const getSelectValue = (value, options) => {
        if (!value || !options) return null;
        return options.find(option => option.value === value) || null;
    };

    const getSelectStringValue = (selectObject) => {
        if (typeof selectObject === 'string') return selectObject;
        if (selectObject && typeof selectObject === 'object' && selectObject.value !== undefined) {
            return selectObject.value;
        }
        return selectObject || '';
    };

    const isProdutorAprovado = (produtor) => {
        if (produtor?.estado) {
            return produtor.estado.toLowerCase() === 'aprovado';
        }
        const status = getSelectStringValue(formData?.statusProcesso);
        return status === 'LICENÇA_APROVADA';
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

    // Função para calcular idade
    const calculateAge = (dateString) => {
        if (!dateString) return { age: 0, text: 'N/A', isValid: false };

        try {
            const today = new Date();
            const birthDate = new Date(dateString);

            if (isNaN(birthDate.getTime())) return { age: 0, text: 'N/A', isValid: false };

            let age = today.getFullYear() - birthDate.getFullYear();
            const monthDiff = today.getMonth() - birthDate.getMonth();

            if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }

            return {
                age,
                text: `${age} anos`,
                isValid: age >= 18
            };
        } catch {
            return { age: 0, text: 'N/A', isValid: false };
        }
    };

    // Função para obter cor do status
    const getStatusColor = (status) => {
        const colors = {
            'PROCESSO_RECEBIDO': 'bg-blue-100 text-blue-800 border-blue-300',
            'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'LICENÇA_APROVADA': 'bg-green-100 text-green-800 border-green-300',
            'REJEITADO': 'bg-red-100 text-red-800 border-red-300',
            'CANCELADO': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Renderizar conteúdo dos steps
    const renderStepContent = (index) => {
        if (!produtor) return null;

        switch (index) {
            case 0: // Inquiridor
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            Dados do Inquiridor
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Código do Inquiridor</label>
                                <p className="text-gray-900">{produtor.codigoInquiridor || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <p className="text-gray-900">{`${produtor.nomeInquiridor || ''} ${produtor.nomeMeioInquiridor || ''} ${produtor.sobrenomeInquiridor || ''}`.trim() || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Registro</label>
                                <p className="text-gray-900">{produtor.dataRegistro ? new Date(produtor.dataRegistro).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                );

            case 1: // Localização
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                            Localização da Propriedade
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Província</label>
                                <p className="text-gray-900">{produtor.provincia}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Município</label>
                                <p className="text-gray-900">{produtor.municipio}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Comuna</label>
                                <p className="text-gray-900">{produtor.comuna || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Bairro/Aldeia</label>
                                <p className="text-gray-900">{produtor.geoLevel4}</p>
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Localização GPS</label>
                            <ProducerMap coordinates={produtor.coordenadasGPS} producerName={produtor.nome} />
                        </div>
                    </div>
                );

            case 2: // Produtor
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <User className="w-5 h-5 mr-2 text-blue-600" />
                            Dados do Produtor Florestal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                                <p className="text-gray-900 font-medium">{produtor.nome}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número do BI</label>
                                <p className="text-gray-900">{produtor.numeroBI}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Gênero</label>
                                <p className="text-gray-900">{produtor.genero}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
                                <p className="text-gray-900">{produtor.telefone}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Nascimento</label>
                                <p className="text-gray-900">{produtor.dataNascimento ? new Date(produtor.dataNascimento).toLocaleDateString('pt-BR') : 'N/A'} ({calculateAge(produtor.dataNascimento).text})</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Estado Civil</label>
                                <p className="text-gray-900 capitalize">{produtor.estadoCivil?.replace('_', ' ')}</p>
                            </div>
                        </div>
                    </div>
                );

            case 3: // Propriedade
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Trees className="w-5 h-5 mr-2 text-green-600" />
                            Propriedade Florestal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Nome da Propriedade</label>
                                <p className="text-gray-900 font-medium">{produtor.propriedade?.nome}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Propriedade</label>
                                <p className="text-gray-900">{produtor.propriedade?.tipo}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área Total (ha)</label>
                                <p className="text-gray-900">{produtor.propriedade?.areaTotal || 0} hectares</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área Explorada (ha)</label>
                                <p className="text-gray-900">{produtor.propriedade?.areaExplorada || 0} hectares</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Área Florestal (ha)</label>
                                <p className="text-gray-900">{produtor.propriedade?.areaFlorestal || 0} hectares</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Volume Estimado</label>
                                <p className="text-gray-900">{produtor.volumeEstimado} m³</p>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Espécies
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Trees className="w-5 h-5 mr-2 text-green-600" />
                            Espécies Florestais
                        </h3>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Espécies Predominantes</label>
                            <div className="flex flex-wrap gap-2">
                                {produtor.especiesFlorestais?.map((especie, index) => (
                                    <span key={index} className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                                        <Trees className="w-4 h-4 mr-1" />
                                        {especie}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                );

            case 5: // Licenciamento
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <FileText className="w-5 h-5 mr-2 text-blue-600" />
                            Licenciamento Florestal
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Licença</label>
                                <p className="text-gray-900">{produtor.licenciamento?.tipo}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status da Licença</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                    produtor.licenciamento?.status === 'Aprovada' ? 'bg-green-100 text-green-800' :
                                    produtor.licenciamento?.status === 'Pendente' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {produtor.licenciamento?.status}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Número da Licença</label>
                                <p className="text-gray-900">{produtor.licenciamento?.numeroLicenca || 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Emissão</label>
                                <p className="text-gray-900">{produtor.licenciamento?.dataEmissao ? new Date(produtor.licenciamento.dataEmissao).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data de Validade</label>
                                <p className="text-gray-900">{produtor.licenciamento?.dataValidade ? new Date(produtor.licenciamento.dataValidade).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Fiscalização
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Shield className="w-5 h-5 mr-2 text-indigo-600" />
                            Fiscalização e Inspeções
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Resultado da Inspeção</label>
                                <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                    produtor.fiscalizacao?.resultado === 'Conforme' ? 'bg-green-100 text-green-800' :
                                    'bg-red-100 text-red-800'
                                }`}>
                                    {produtor.fiscalizacao?.resultado}
                                </span>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Auto de Fiscalização</label>
                                <p className="text-gray-900">{produtor.fiscalizacao?.auto}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Data da Inspeção</label>
                                <p className="text-gray-900">{produtor.fiscalizacao?.dataInspecao ? new Date(produtor.fiscalizacao.dataInspecao).toLocaleDateString('pt-BR') : 'N/A'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Responsável</label>
                                <p className="text-gray-900">{produtor.fiscalizacao?.fiscal || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                );

            case 7: // Transporte
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <Truck className="w-5 h-5 mr-2 text-purple-600" />
                            Transporte de Produtos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Destino</label>
                                <p className="text-gray-900">{produtor.transporte?.destino}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Placa do Veículo</label>
                                <p className="text-gray-900">{produtor.transporte?.placa}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Volume Transportado</label>
                                <p className="text-gray-900">{produtor.transporte?.volume || 0} m³</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Status do Transporte</label>
                                <p className="text-gray-900">{produtor.transporte?.status}</p>
                            </div>
                        </div>
                    </div>
                );

            case 8: // Penalidades
                return (
                    <div className="space-y-6">
                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                            <AlertTriangle className="w-5 h-5 mr-2 text-red-600" />
                            Penalidades e Sanções
                        </h3>
                        {produtor.penalidades?.infracao === 'Nenhuma' ? (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                    <p className="text-green-800 font-medium">Nenhuma penalidade registrada</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tipo de Infração</label>
                                    <p className="text-gray-900">{produtor.penalidades?.infracao}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Valor da Multa</label>
                                    <p className="text-gray-900">{produtor.penalidades?.valor > 0 ? `${produtor.penalidades.valor.toLocaleString()} Kz` : 'N/A'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Status da Penalidade</label>
                                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                                        produtor.penalidades?.status === 'Paga' ? 'bg-green-100 text-green-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {produtor.penalidades?.status}
                                    </span>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Data do Auto</label>
                                    <p className="text-gray-900">{produtor.penalidades?.dataAuto ? new Date(produtor.penalidades.dataAuto).toLocaleDateString('pt-BR') : 'N/A'}</p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            default:
                return null;
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <span className="ml-3 text-gray-600">Carregando produtor florestal...</span>
            </div>
        );
    }

    if (!produtor) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Produtor Florestal não encontrado</h2>
                    <p className="text-gray-600 mb-4">O produtor florestal solicitado não foi encontrado.</p>
                    <button
                        onClick={() => navigate('/GerenciaRNPA/gestao-florestal/produtoresFlorestais')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Voltar à Lista
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Toast */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 ${
                    toastMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' :
                    toastMessage.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' :
                    'bg-blue-50 border-l-4 border-blue-500 text-blue-700'
                } animate-fadeIn`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {toastMessage.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                        </div>
                        <div>
                            <p className="text-sm">{toastMessage.message}</p>
                        </div>
                        <button
                            className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
                            onClick={() => setToastMessage(null)}
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            )}

            {/* Header */}
            <div className="bg-white shadow-sm border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <button
                                onClick={() => navigate('/GerenciaRNPA/gestao-florestal/produtoresFlorestais')}
                                className="mr-4 p-2 hover:bg-gray-100 rounded-full transition-colors"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">
                                    {getPrimeiroNome(produtor.nome)} - Produtor Florestal
                                </h1>
                                <p className="text-sm text-gray-600">Código RNPF: {produtor.codigoRNPA}</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(produtor.statusProcesso)}`}>
                                {produtor.statusProcesso?.replace('_', ' ')}
                            </span>
                            {isProdutorAprovado(produtor) && (
                                <button
                                    onClick={() => showToast('info', 'Função de gerar cartão RNPF em desenvolvimento')}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center"
                                >
                                    <Download className="w-4 h-4 mr-2" />
                                    Gerar Cartão RNPF
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Steps */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex overflow-x-auto py-4 space-x-8">
                        {steps.map((step, index) => (
                            <button
                                key={index}
                                onClick={() => setActiveIndex(index)}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-lg whitespace-nowrap transition-colors ${
                                    activeIndex === index
                                        ? 'bg-blue-100 text-blue-700'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                                }`}
                            >
                                <step.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{step.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm border p-6">
                    {renderStepContent(activeIndex)}
                </div>

                {/* Navigation */}
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
                        disabled={activeIndex === 0}
                        className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                            activeIndex === 0
                                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
                        }`}
                    >
                        <ChevronLeft className="w-4 h-4 mr-2" />
                        Anterior
                    </button>

                    <span className="text-sm text-gray-500">
                        {activeIndex + 1} de {steps.length}
                    </span>

                    <button
                        onClick={() => setActiveIndex(Math.min(steps.length - 1, activeIndex + 1))}
                        disabled={activeIndex === steps.length - 1}
                        className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
                            activeIndex === steps.length - 1
                                ? 'opacity-50 cursor-not-allowed bg-gray-100'
                                : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                    >
                        Próximo
                        <ChevronRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default VisualizarProdutorFlorestal;