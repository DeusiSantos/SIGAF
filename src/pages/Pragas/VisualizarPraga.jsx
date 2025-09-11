import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GiCow, GiPig } from "react-icons/gi";
import {
    ArrowLeft,
    Edit,
    Save,
    X,
    Globe,
    RefreshCw,
    Download,
    CreditCard,
    User,
    Phone,
    Mail,
    MapPin,
    Calendar,
    Tractor,
    FileText,
    AlertCircle,
    CheckCircle,
    Info,
    Bug,
    Wheat,
    Trees,
    Leaf,
    Truck,
    Home,
    Award,
    Clock,
    Map,
    Navigation,
    Users,
    Building,
    Baby,
    UserCheck,
    Bird,
    Fish,
    Rabbit,
    DollarSign,
    Camera,
    ChevronRight,
    ChevronLeft,
    Package,
    Filter,
    ChevronDown,
    Activity,
    Heart
} from 'lucide-react';

// Importações do React Leaflet
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import provinciasData from '../../components/Provincias.json';
import CustomInput from '../../components/CustomInput';
import { gerarFichaProdutorPDF } from '../../pages/public/GerarCartaoRNPA';
import axios from 'axios';
import api from '../../services/api';

// Corrigir ícones do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Hook para buscar praga por ID
const usePragaById = (id) => {   
    const [praga, setPraga] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPraga = async () => {
            if (!id) return;

            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/pragas/${id}`);
                setPraga(response.data);
            } catch (err) {
                console.error('Erro ao buscar praga:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPraga();
    }, [id]);

    return { praga, loading, error };
};

// Hook para buscar incentivos do produtor
const useIncentivosByProdutor = (idProdutor) => {
    const [incentivos, setIncentivos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchIncentivos = async () => {
            if (!idProdutor) return;

            setLoading(true);
            setError(null);

            try {
                const response = await api.get(`/pragas/${idProdutor}`);
                setIncentivos(response.data);
            } catch (err) {
                console.error('Erro ao buscar incentivos:', err);
                setError(err.response?.data?.message || err.message);
                setIncentivos([]);
            } finally {
                setLoading(false);
            }
        };

        fetchIncentivos();
    }, [idProdutor]);

    return { incentivos, loading, error };
};

// Função para mapear dados da API
const mapApiDataToPraga = (apiData) => {
    if (!apiData) return null;

    const getCoordinates = (coordString) => {
        if (!coordString) return { lat: 0, lng: 0 };
        const coords = coordString.split(',');
        return {
            lat: parseFloat(coords[0]) || 0,
            lng: parseFloat(coords[1]) || 0
        };
    };

    return {
        id: apiData._id || apiData.id,

        // Responsável
        nomeResponsavel: apiData.nome_do_T_cnico_ou_Produtor || apiData.Nome_do_T_cnico || 'N/A',
        telefone: apiData.telefone || apiData.Telefone || 'N/A',
        instituicao: apiData.nome_da_Institui_o || apiData.Nome_da_Institui_o || 'N/A',
        dataRegistro: apiData.data_de_Registro || apiData.Data_de_Registro,

        // Localização
        provincia: apiData.provincia?.toUpperCase() || apiData.Provincia?.toUpperCase() || 'N/A',
        municipio: apiData.municipio || apiData.Municipio || 'N/A',
        comuna: apiData.comuna || apiData.Comuna || 'N/A',
        coordenadasGPS: getCoordinates(apiData.coordenadas_GPS || apiData.Coordenadas_GPS),

        // Tipo de Produção
        tipoProducao: apiData.qual_o_tipo_de_produ_o_afetada || apiData.Qual_o_tipo_de_produ_o_afetada || 'N/A',


        // Info Agrícolas
        nomePropriedade: apiData.nome_da_Propriedade || apiData.Nome_da_Propriedade || 'N/A',
        tipoCultura: apiData.tipo_de_culturas || apiData.Tipo_de_culturas || 'N/A',
        culturaAfetada: apiData.frutas || apiData.Frutas || 'N/A',
        faseCultura: apiData.fase_da_Cultura || apiData.Fase_da_Cultura || 'N/A',
        areaTotalCultivada: parseFloat(apiData.rea_Total_Cultivada_ha) || 0,
        dataPrimeiraObservacao: apiData.data_da_Primeira_Observa_o_001 || apiData.Data_da_Primeira_Observa_o_001,
        nomePraga: apiData.nome_da_Praga || apiData.Nome_da_Praga || 'N/A',
        nomeLocalPraga: apiData.nome_Local_da_Praga || apiData.Nome_Local_da_Praga || 'N/A',
        sintomasObservados: apiData.sintomas_Observados_001 || apiData.Sintomas_Observados_001 || 'N/A',
        percentagemAreaAfetada: parseFloat(apiData.percentagem_da_rea_Afetada_) || 0,
        grauDano: apiData.grau_do_Dano_001 || apiData.Grau_do_Dano_001 || 'N/A',
        aplicouMedidaControle: apiData.aplicou_alguma_medida_de_contr === 'Sim',
        tipoMedidaAplicada: apiData.tipo_de_Medida_Aplicada || apiData.Tipo_de_Medida_Aplicada || 'N/A',
        resultadoMedida: apiData.resultado_da_Medida || apiData.Resultado_da_Medida || 'N/A',

        // Info Pecuárias
        nomeFazenda: apiData.nome_da_Fazenda || apiData.Nome_da_Fazenda || 'N/A',
        especieAnimalAfetada: apiData.esp_cie_Animal_Afetada || apiData.Esp_cie_Animal_Afetada || 'N/A',
        numeroTotalAnimais: parseInt(apiData.n_mero_Total_de_Animais) || 0,
        dataPrimeiraObservacaoPecuaria: apiData.data_da_Primeira_Observa_o || apiData.Data_da_Primeira_Observa_o,
        nomePragaDoenca: apiData.nome_da_Praga_Doen_a || apiData.Nome_da_Praga_Doen_a || 'N/A',
        sintomasObservadosPecuaria: apiData.sintomas_Observados || apiData.Sintomas_Observados || 'N/A',
        numeroAnimaisAfetados: parseInt(apiData.n_mero_de_Animais_Afetados) || 0,
        grauDanoPecuaria: apiData.grau_do_Dano || apiData.Grau_do_Dano || 'N/A',
        aplicouTratamento: apiData.aplicou_algum_tratamento === 'Sim',
        tipoTratamento: apiData.tipo_de_Tratamento_Usado || apiData.Tipo_de_Tratamento_Usado || 'N/A',
        resultadoTratamento: apiData.resultado_do_Tratamento || apiData.Resultado_do_Tratamento || 'N/A',
        necessitaApoioVeterinario: apiData.necessita_apoio_veterin_rio === 'Sim',

        // Finalização
        necessitaApoioTecnico: apiData.necessita_apoio_t_cnico === 'Sim',
        observacoesAdicionais: apiData.observa_es_adicionais_001 || apiData.observa_es_adicionais || 'N/A',
        nomeValidador: apiData.nome_do_Validador || apiData.Nome_do_Validador || 'N/A',

        // Dados originais
        dadosOriginais: apiData
    };
};

// Função para alterar estado do produtor
const alterarEstadoProdutor = async (id, novoEstado, token) => {
    try {
        // Verificar se o ID é válido
        const idNumerico = Number(id);
        if (isNaN(idNumerico) || idNumerico <= 0) {
            throw new Error('ID do formulário inválido');
        }

        const estadoMapping = {
            'CONFORME': 'Conforme',
            'IRREGULAR': 'Irregularidade',
        };

        const estadoAPI = estadoMapping[novoEstado];
        if (!estadoAPI) {
            throw new Error('Estado inválido');
        }

        // Formato de dados que o endpoint espera
        const formData = new FormData();
        formData.append('Id', idNumerico);
        formData.append('Estado', estadoAPI);

        const response = await axios.patch(
            'https://mwangobrainsa-001-site2.mtempurl.com/api/formulario/estado',
            formData,
            {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        if (response.status === 200 || response.status === 204) {
            return {
                sucesso: true,
                dados: response.data,
                mensagem: `Estado alterado para ${estadoAPI} com sucesso`
            };
        }

        throw new Error(`Resposta inesperada: ${response.status}`);

    } catch (error) {
        console.error('Erro detalhado:', {
            message: error.message,
            response: error.response?.data,
            config: error.config
        });

        let mensagemErro = 'Falha ao alterar estado';
        if (error.response) {
            // Extrair mensagem de erro do servidor se disponível
            const serverMessage = error.response.data?.message ||
                error.response.data?.Message ||
                JSON.stringify(error.response.data);

            switch (error.response.status) {
                case 400:
                    mensagemErro = `Dados inválidos: ${serverMessage}`;
                    break;
                case 401:
                    mensagemErro = 'Não autorizado - Token inválido ou expirado';
                    break;
                case 403:
                    mensagemErro = 'Acesso negado - Permissões insuficientes';
                    break;
                case 404:
                    mensagemErro = 'Endpoint não encontrado';
                    break;
                case 500:
                    mensagemErro = `Erro interno do servidor: ${serverMessage}`;
                    break;
                default:
                    mensagemErro = `Erro ${error.response.status}: ${serverMessage}`;
            }
        }

        return {
            sucesso: false,
            erro: error,
            mensagem: mensagemErro
        };
    }
};
const getPrimeiroNome = (nomeCompleto) => {
    if (!nomeCompleto) return '';
    return nomeCompleto.trim().split(' ')[0];
};

// Função para obter opções de cultura
const getCulturaOptions = (tipoCultura) => {
    const culturaMap = {
        cereais: ['Arroz', 'Trigo', 'Milho', 'Cevada', 'Aveia', 'Sorgo'],
        frutas: ['Banana', 'Manga', 'Laranja', 'Maçã', 'Abacaxi', 'Mamão', 'Uva'],
        horticolas: ['Tomate', 'Alface', 'Cenoura', 'Pepino', 'Pimentão', 'Cebola'],
        legumes: ['Feijão', 'Ervilha', 'Lentilha', 'Grão-de-bico', 'Soja'],
        tuberculos: ['Batata', 'Batata-doce', 'Mandioca', 'Inhame', 'Cará']
    };

    return (culturaMap[tipoCultura] || []).map(cultura => ({
        label: cultura,
        value: cultura
    }));
};

// Componente para capturar cliques no mapa
const MapClickHandler = ({ onLocationSelect }) => {
    useMapEvents({
        click: (e) => {
            const { lat, lng } = e.latlng;
            onLocationSelect(lat.toFixed(6), lng.toFixed(6));
        }
    });
    return null;
};

// Componente de Mapa
const MapaGPS = ({ latitude, longitude, onLocationSelect }) => {
    const hasCoordinates = latitude && longitude && !isNaN(latitude) && !isNaN(longitude);
    const center = hasCoordinates ? [parseFloat(latitude), parseFloat(longitude)] : [-8.838333, 13.234444];

    useEffect(() => {
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
            iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
            iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
            shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
        });
    }, []);

    return (
        <div className="w-full h-80 border border-gray-200 rounded-xl overflow-hidden shadow-sm">
            <MapContainer
                center={center}
                zoom={hasCoordinates ? 16 : 6}
                className="w-full h-full"
                key={`${latitude}-${longitude}`}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                <MapClickHandler onLocationSelect={onLocationSelect} />
                {hasCoordinates && (
                    <Marker position={center}>
                        <Popup>
                            <div className="text-center">
                                <strong>Localização da Praga</strong><br />
                                Latitude: {latitude}°<br />
                                Longitude: {longitude}°
                            </div>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </div>
    );
};

// Tabela de Incentivos
const TabelaIncentivos = ({ incentivos, loading }) => {
    if (loading) {
        return (
            <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!incentivos || incentivos.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum incentivo encontrado para este produtor</p>
            </div>
        );
    }

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full bg-white border border-gray-300 rounded-lg">
                <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome do Incentivo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Forma de Entrega</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                    </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                    {incentivos.map((incentivo, index) => (
                        <tr key={incentivo.id || index} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">{incentivo.nomeDoIncentivo}</div>
                                <div className="text-sm text-gray-500">{incentivo.descricaoDoIncentivo}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${incentivo.tipoDoIncentivo === 'DINHEIRO'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-blue-100 text-blue-800'
                                    }`}>
                                    {incentivo.tipoDoIncentivo}
                                </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {incentivo.valorDoReembolso ? `${incentivo.valorDoReembolso} AOA` : 'N/A'}
                                {incentivo.porcentagemDeReembolso && (
                                    <div className="text-xs text-gray-500">{incentivo.porcentagemDeReembolso}%</div>
                                )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {incentivo.formaDeEntrega}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                {incentivo.dataDeVencimentoDoReembolso ?
                                    new Date(incentivo.dataDeVencimentoDoReembolso).toLocaleDateString('pt-BR') :
                                    'N/A'
                                }
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${incentivo.estadoDoReembolso === 'Ativo'
                                    ? 'bg-green-100 text-green-800'
                                    : 'bg-red-100 text-red-800'
                                    }`}>
                                    {incentivo.estadoDoReembolso}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

const VisualizarPraga = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    // Estados para municípios
    const [municipiosOptions, setMunicipiosOptions] = useState([]);

    // Estados principais
    const [praga, setPraga] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    const [gerando, setGerando] = useState(false);
    const [alterandoStatus, setAlterandoStatus] = useState(false);
    const [currentStatus, setCurrentStatus] = useState(null);
    //const [consultingBI, setConsultingBI] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Estados para uploads de imagem
    //const [imagemUrlPerfil, setImagemUrlPerfil] = useState('');
    const [imagemUrlDigitais, setImagemUrlDigitais] = useState('');
    const [uploadingPerfil, setUploadingPerfil] = useState(false);
    const [uploadingDigitais, setUploadingDigitais] = useState(false);
    const [novaFotoPerfil, setNovaFotoPerfil] = useState(null);
    const [novaFotoDigitais, setNovaFotoDigitais] = useState(null);
    const [previewPerfil, setPreviewPerfil] = useState('');
    const [previewDigitais, setPreviewDigitais] = useState('');

    // Estados para modais
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [showBIValidation, setShowBIValidation] = useState(false);
    const [biValidation, setBiValidation] = useState('');
    const [biError, setBiError] = useState('');
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [pendingStatusValue, setPendingStatusValue] = useState(null);

    // Estados para filtros
    const [selectedProvince, setSelectedProvince] = useState('todas');
    const [showFilters, setShowFilters] = useState(false);
    const [selectedPeriodo, setSelectedPeriodo] = useState('todos');
    const [selectedEstado, setSelectedEstado] = useState('todos');
    const [selectedAtividade, setSelectedAtividade] = useState('todos');

    // Estados para dados florestais
    const [areas, setAreas] = useState([
        {
            nome: 'Área Florestal Principal',
            tipo: { label: 'Privada', value: 'PRIVADA' },
            estadoConservacao: { label: 'Nativa', value: 'Nativa' },
            lat: '-8.956',
            lng: '13.234',
            provincia: { label: 'LUANDA', value: 'LUANDA' },
            municipio: { label: 'Belas', value: 'Belas' },
            comuna: 'Ramiros',
            bairroAldeia: 'Benfica'
        }
    ]);
    const [especies, setEspecies] = useState([
        {
            id: 'esp001',
            especie: [{ label: 'Eucalipto (Eucalyptus spp.)', value: 'eucalipto' }],
            status: { label: 'Exótica', value: 'exotica' }
        }
    ]);
    const [transportes, setTransportes] = useState([
        {
            licenseIndex: 0,
            origem_areaIndex: 0,
            destino: 'Luanda',
            placa: 'LD-45-67-AB',
            volume: '25',
            qr_hash: '',
            status: 'Autorizado'
        }
    ]);
    const [produtos, setProdutos] = useState([
        {
            especiesIds: [{ label: 'Eucalipto (Eucalyptus spp.)', value: 'eucalipto' }],
            volumeAnual: '100',
            origem_areaIndex: 0,
            destino: 'Mercado interno',
            rastreabilidade: '',
            documentosTransporte: null
        }
    ]);
    const [consultingBI, setConsultingBI] = useState(false);
    //const [biData, setBiData] = useState(null);


    // Steps do formulário
    const steps = [
        { label: 'Responsável', icon: User },
        { label: 'Localização', icon: MapPin },
        { label: 'Tipo Produção', icon: Activity },
        { label: 'Info Agrícolas', icon: Tractor },
        { label: 'Info Pecuárias', icon: Heart },
        { label: 'Finalização', icon: FileText }
    ];

    // Hooks para buscar dados
    const { praga: pragaAPI, loading: loadingAPI, error: errorAPI } = usePragaById(id);
    // const { incentivos, loading: loadingIncentivos } = useIncentivosByProdutor(id);

    // Mapear dados da API
    const pragaMapeada = useMemo(() => {
        if (!pragaAPI) return null;
        return mapApiDataToPraga(pragaAPI);
    }, [pragaAPI]);

    // Lista predefinida de espécies florestais
    const especiesPredefinidas = [
        { label: "Baobá (Adansonia digitata)", value: "baoba" },
        { label: "Imbondeiro (Adansonia sp.)", value: "imbondeiro" },
        { label: "Mussivi (Brachystegia spiciformis)", value: "mussivi" },
        { label: "Mupanda (Julbernardia paniculata)", value: "mupanda" },
        { label: "Muvulungo (Afzelia quanzensis)", value: "muvulungo" },
        { label: "Kiaat / Mukwa (Pterocarpus angolensis)", value: "kiaat" },
        { label: "Eucalipto (Eucalyptus spp.)", value: "eucalipto" },
        { label: "Mongongo (Schinziophyton rautanenii)", value: "mongongo" },
        { label: "Palmeira-de-óleo (Elaeis guineensis)", value: "palmeira_oleo" },
        { label: "Palmeira-dendém (Elaeis spp.)", value: "palmeira_dendem" },
        { label: "Umbila (Khaya anthotheca)", value: "umbila" },
        { label: "Mutondo (Isoberlinia angolensis)", value: "mutondo" },
        { label: "Cacaueiro-do-mato (Cola edulis)", value: "cacaueiro" },
        { label: "Oliveira africana (Olea africana)", value: "oliveira" },
        { label: "Tamboti (Spirostachys africana)", value: "tamboti" },
        { label: "Marula (Sclerocarya birrea)", value: "marula" }
    ];

    // Opções para selects
    const statusOptions = [
        { label: 'Controlado', value: 'CONTROLADO' },
        { label: 'Detectado', value: 'DETECTADO' },
        { label: 'Em Tratamento', value: 'EM_TRATAMENTO' },
    ];

    const generoOptions = [
        { label: 'Masculino', value: 'MASCULINO' },
        { label: 'Feminino', value: 'FEMININO' }
    ];

    {    /*
    const tipoDocumentoOptions = [
        { label: 'Bilhete de Identidade', value: 'BI' },
        { label: 'Cartão de Eleitor', value: 'CARTAO_ELEITOR' },
        { label: 'Passaporte', value: 'PASSAPORTE' },
        { label: 'Certidão de Nascimento', value: 'CERTIDAO_NASCIMENTO' },
        { label: 'Outro', value: 'OUTRO' },
        { label: 'Não possui documento', value: 'NAO_POSSUI' }
    ];

    const tipoAreaOptions = [
        { label: "Pública", value: "PUBLICA" },
        { label: "Privada", value: "PRIVADA" }
    ];

    const estadoConservacaoOptions = [
        { label: "Nativa", value: "Nativa" },
        { label: "Reflorestamento", value: "Reflorestamento" },
        { label: "Degradada", value: "Degradada" }
    ];

    const statusEspecieOptions = [
        { label: "Nativa", value: "nativa" },
        { label: "Exótica", value: "exotica" }
    ];

    const estadoCivilOptions = [
        { label: 'Solteiro(a)', value: 'solteiro' },
        { label: 'Casado(a)', value: 'casado' },
        { label: 'Divorciado(a)', value: 'divorciado' },
        { label: 'Viúvo(a)', value: 'viuvo' },
        { label: 'União de facto', value: 'uniao_facto' }
    ];

    const nivelEscolaridadeOptions = [
        { label: 'Sem escolaridade', value: 'sem_escolaridade' },
        { label: 'Primário', value: 'primario' },
        { label: 'Secundário', value: 'secundario' },
        { label: 'Médio', value: 'medio' },
        { label: 'Superior', value: 'superior' }
    ];

    // Opções para filtros
    const provincias = [
        { value: 'todas', label: 'Todas as Províncias' },
        { value: 'luanda', label: 'Luanda' },
        { value: 'benguela', label: 'Benguela' },
        { value: 'huila', label: 'Huíla' },
        { value: 'bie', label: 'Bié' },
        { value: 'malanje', label: 'Malanje' },
        { value: 'huambo', label: 'Huambo' }
    ];

      */}

    const periodoOptions = [
        { label: 'Todos', value: 'todos' },
        { label: 'Último mês', value: 'ultimomes' },
        { label: 'Últimos 3 meses', value: 'ultimos3meses' },
        { label: 'Último ano', value: 'ultimosano' }
    ];

    const estadoOptions = [
        { label: 'Todos', value: 'todos' },
        { label: 'Aprovados', value: 'aprovados' },
        { label: 'Pendentes', value: 'pendentes' }
    ];

    const actividadesOptions = [
        { label: 'Todos', value: 'todos' },
        { label: 'Florestal', value: 'florestal' }
    ];
    // Altere a função para abrir o modal
    const handleStatusChange = (value) => {
        setPendingStatusValue(value);
        setShowStatusModal(true);
    };
    // Funções utilitárias
    const getSelectValue = (value, options) => {
        if (!value || !options) return null;
        return options.find(option => option.value === value) || null;
    };

    const getSelectStringValue = (selectObject) => {
        if (typeof selectObject === 'string') return selectObject;
        if (selectObject && typeof selectObject === 'object' && selectObject.value) {
            return selectObject.value;
        }
        return selectObject || '';
    };

    const isPragaAprovada = (praga) => {
        if (praga?.estado) {
            return praga.estado.toLowerCase() === 'aprovado';
        }
        const status = getSelectStringValue(formData?.statusProcesso);
        return status === 'APROVADO';
    };

    // Função para atualizar província e municípios
    const handleProvinciaChange = (value) => {
        updateFormData('provincia', value);
        const provinciaValue = value?.value || value;
        const provinciaSelected = provinciasData.find(
            p => p.nome.toUpperCase() === provinciaValue?.toUpperCase()
        );
        if (provinciaSelected && provinciaSelected.municipios) {
            let municipiosArr = [];
            try {
                municipiosArr = JSON.parse(provinciaSelected.municipios);
            } catch {
                municipiosArr = [];
            }
            setMunicipiosOptions(municipiosArr.map(m => ({ label: m, value: m })));
        } else {
            setMunicipiosOptions([]);
        }
        updateFormData('municipio', '');
    };

    // Função para buscar status atual da API
    const fetchCurrentStatus = async () => {
        try {
            const response = await api.get(`/pragas/${id}`);
            if (response.data && response.data.estado) {
                setCurrentStatus(response.data.estado);
            }
        } catch (error) {
            console.error('Erro ao buscar status atual:', error);
        }
    };

    // Carregar dados quando disponíveis
    useEffect(() => {
        const loadPraga = async () => {
            setLoading(loadingAPI);

            if (errorAPI) {
                setToastMessage({ type: 'error', message: `Erro ao carregar praga: ${errorAPI}` });
                setLoading(false);
                return;
            }

            if (!loadingAPI && pragaMapeada) {
                try {
                    setPraga(pragaMapeada);
                    setFormData(pragaMapeada);
                    setLoading(false);
                    // Buscar status atual da API
                    fetchCurrentStatus();
                } catch (error) {
                    console.error('Erro ao processar dados:', error);
                    setToastMessage({ type: 'error', message: 'Erro ao processar dados da praga' });
                    setLoading(false);
                }
            } else if (!loadingAPI && !pragaMapeada) {
                setToastMessage({ type: 'error', message: 'Praga não encontrada' });
                setLoading(false);
            }
        };

        loadPraga();
    }, [pragaMapeada, loadingAPI, errorAPI]);

    // Remover carregamento de imagens para pragas
    // useEffect(() => {
    //     // Pragas não possuem imagens associadas
    // }, [id]);

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
    { /*const calculateAge = (dateString) => {
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
    */};

    // Função para obter cor do status
    const getStatusColor = (status) => {
        const colors = {
            'CONTROLADO': 'bg-green-100 text-green-800 border-green-300',
            'DETECTADO': 'bg-red-100 text-red-800 border-red-300',
            'EM_TRATAMENTO': 'bg-yellow-100 text-yellow-800 border-yellow-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Funções para gerenciar áreas
    { /* const addArea = () => {
        const newArea = {
            nome: `Área Florestal ${areas.length + 1}`,
            tipo: { label: 'Privada', value: 'PRIVADA' },
            estadoConservacao: { label: 'Reflorestamento', value: 'Reflorestamento' },
            lat: '',
            lng: '',
            provincia: '',
            municipio: '',
            comuna: '',
            bairroAldeia: ''
        };
        setAreas(prev => [...prev, newArea]);
    */};
    { /*
    const removeArea = (index) => {
        setAreas(prev => prev.filter((_, i) => i !== index));
    };

    const updateArea = (index, field, value) => {
        setAreas(prev => {
            const newAreas = [...prev];
            newAreas[index] = { ...newAreas[index], [field]: value };
            return newAreas;
        });
    };

    

    const removeEspecie = (index) => {
        setEspecies(prev => prev.filter((_, i) => i !== index));
    };

    const updateEspecie = (index, field, value) => {
        setEspecies(prev => {
            const newEspecies = [...prev];
            newEspecies[index] = { ...newEspecies[index], [field]: value };
            return newEspecies;
        });
    };

        */}



    const removeTransporte = (index) => {
        setTransportes(prev => prev.filter((_, i) => i !== index));
    };

    const updateTransporte = (index, field, value) => {
        setTransportes(prev => {
            const newTransportes = [...prev];
            newTransportes[index] = { ...newTransportes[index], [field]: value };
            return newTransportes;
        });
    };



    const removeProduto = (index) => {
        setProdutos(prev => prev.filter((_, i) => i !== index));
    };

    const updateProduto = (index, field, value) => {
        setProdutos(prev => {
            const newProdutos = [...prev];
            newProdutos[index] = { ...newProdutos[index], [field]: value };
            return newProdutos;
        });
    };

    // Função para consultar BI
    const consultarBI = async (biValue) => {
        if (!biValue || biValue.length < 9) return;

        setConsultingBI(true);

        try {
            const username = 'minagrif';
            const password = 'Nz#$20!23Mg';
            const credentials = btoa(`${username}:${password}`);

            const response = await axios.get(`https://api.gov.ao/bi/v1/getBI`, {
                params: { bi: biValue },
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = response.data;

            if (response.status === 200 && data.code === 200 && data.data) {
                const biInfo = data.data;

                setFormData(prev => ({
                    ...prev,
                    nomeResponsavel: `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim(),
                    telefone: biInfo.phone_number || prev.telefone,
                }));

                showToast('success', 'Dados do BI preenchidos automaticamente!');
                setShowBIValidation(false);
            } else {
                if (data.code === 404) {
                    showToast('warn', 'BI não encontrado. Preencha manualmente.');
                } else {
                    showToast('warn', 'BI inválido. Verifique o número.');
                }
            }
        } catch (error) {
            console.error('Erro ao consultar BI:', error);
            if (error.response) {
                showToast('error', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do BI'}`);
            } else if (error.request) {
                showToast('error', 'Erro de conexão. Verifique sua conexão.');
            } else {
                showToast('error', 'Erro ao consultar BI. Tente novamente.');
            }
        } finally {
            setConsultingBI(false);
        }
    };

    // Função para consultar NIF
    const consultarNIF = async (nifValue) => {
        if (!nifValue || nifValue.length < 9) return;

        setConsultingBI(true);

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

                setFormData(prev => ({
                    ...prev,
                    nomeResponsavel: nifInfo.nome_contribuinte || prev.nomeResponsavel,
                    telefone: nifInfo.numero_contacto || prev.telefone,
                }));

                showToast('success', 'Dados do NIF preenchidos automaticamente!');
                setShowBIValidation(false);
            } else {
                if (data.code === 404) {
                    showToast('warn', 'NIF não encontrado. Preencha manualmente.');
                } else {
                    showToast('warn', 'NIF inválido. Verifique o número.');
                }
            }
        } catch (error) {
            console.error('Erro ao consultar NIF:', error);
            if (error.response) {
                showToast('error', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
            } else if (error.request) {
                showToast('error', 'Erro de conexão. Verifique sua conexão.');
            } else {
                showToast('error', 'Erro ao consultar NIF. Tente novamente.');
            }
        } finally {
            setConsultingBI(false);
        }
    };

    // Função para detectar tipo de documento e consultar
    const consultarDocumento = (docValue) => {
        if (!docValue) return;
        
        // Detectar se é BI ou NIF baseado no formato
        if (docValue.length >= 9) {
            // Se contém apenas números, provavelmente é BI
            if (/^\d+$/.test(docValue)) {
                consultarBI(docValue);
            } else {
                // Se contém letras ou outros caracteres, provavelmente é NIF
                consultarNIF(docValue);
            }
        }
    };

    // Funções para upload de imagens
    const uploadFotoPerfil = async (file) => {
        if (!file) {
            showToast('error', 'Selecione uma foto primeiro');
            return;
        }

        setUploadingPerfil(true);
        try {
            const token = "91c163addd72730d6bfe7a2d80eac5129767a044";
            const formData = new FormData();
            formData.append('novaImagem', file);

            const response = await api.patch(`/formulario/${id}/foto-beneficiary`, formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                showToast('success', 'Foto atualizada com sucesso!');
                const url = URL.createObjectURL(file);
                setImagemUrlPerfil(url);
                setNovaFotoPerfil(null);
                setPreviewPerfil('');
            }
        } catch (error) {
            console.error('Erro ao fazer upload da foto:', error);
            showToast('error', 'Erro ao atualizar foto');
        } finally {
            setUploadingPerfil(false);
        }
    };

    const uploadFotoDigitais = async (file) => {
        if (!file) {
            showToast('error', 'Selecione uma foto primeiro');
            return;
        }

        setUploadingDigitais(true);
        try {
            const token = "91c163addd72730d6bfe7a2d80eac5129767a044";
            const formData = new FormData();
            formData.append('novaImagem', file);

            const response = await api.patch(`/formulario/${id}/foto-biometrics`, formData, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200) {
                showToast('success', 'Impressões digitais atualizadas com sucesso!');
                const url = URL.createObjectURL(file);
                setImagemUrlDigitais(url);
                setNovaFotoDigitais(null);
                setPreviewDigitais('');
            }
        } catch (error) {
            console.error('Erro ao fazer upload das impressões digitais:', error);
            showToast('error', 'Erro ao atualizar impressões digitais');
        } finally {
            setUploadingDigitais(false);
        }
    };

    // Handlers para mudança de arquivo
    const handleFotoPerfilChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNovaFotoPerfil(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewPerfil(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    const handleFotoDigitaisChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setNovaFotoDigitais(file);
            const reader = new FileReader();
            reader.onload = (e) => setPreviewDigitais(e.target.result);
            reader.readAsDataURL(file);
        }
    };

    // Funções para cancelar uploads
    const cancelarFotoPerfil = () => {
        setNovaFotoPerfil(null);
        setPreviewPerfil('');
    };

    const cancelarFotoDigitais = () => {
        setNovaFotoDigitais(null);
        setPreviewDigitais('');
    };

    // Função para salvar dados
    const prepareDataForAPI = (formData) => {
        const convertValue = (value) => {
            if (value === null || value === undefined) return '';
            if (typeof value === 'object' && value !== null && value.value !== undefined) {
                return value.value;
            }
            if (typeof value === 'boolean') {
                return value ? 'sim' : 'nao';
            }
            if (Array.isArray(value)) {
                return value.join(' ');
            }
            return value.toString();
        };

        return {
            id: parseInt(id),
            provincia: convertValue(formData.provincia),
            municipio: convertValue(formData.municipio) || '',
            comuna: convertValue(formData.comuna) || '',
            geoLevel4: convertValue(formData.geoLevel4) || '',
            geoLevel5: convertValue(formData.geoLevel5) || '',
            geoLevel6: convertValue(formData.geoLevel6) || '',
            gpsCoordinates: formData.coordenadasGPS ? `${formData.coordenadasGPS.lat} ${formData.coordenadasGPS.lng}` : '',
            permissao: 'sim',
            membroRegistrado: 'nao',
            codigoFamiliar: '',
            nomeProdutor: convertValue(formData.nome) || '',
            nomeMeioProdutor: convertValue(formData.nomeMeioProdutor) || '',
            sobrenomeProdutor: convertValue(formData.sobrenomeProdutor) || '',
            beneficiaryName: `${formData.nome || ''} ${formData.nomeMeioProdutor || ''} ${formData.sobrenomeProdutor || ''}`.trim(),
            beneficiaryIdNumber: convertValue(formData.numeroBI) || '',
            tipoDocumento: 'bilhete_identidade',
            confirmarDocumento: convertValue(formData.numeroBI) || '',
            beneficiaryGender: convertValue(formData.genero) === 'MASCULINO' ? 'm' : 'f',
            beneficiaryPhoneNumber: convertValue(formData.telefone) || '',
            confirmarTelefone: convertValue(formData.telefone) || '',
            telefoneProprio: 'sim',
            donoNumero: '',
            beneficiaryDateOfBirth: convertValue(formData.dataNascimento) || '1990-01-01',
            lugarNascimento: convertValue(formData.lugarNascimento) || '',
            estadoCivil: convertValue(formData.estadoCivil) || 'solteiro',
            nivelEscolaridade: convertValue(formData.nivelEscolaridade) || 'primario',
            outro: '',
            gravida: formData.gravida ? 'sim' : 'nao',
            possuiDeficiencia: formData.possuiDeficiencia ? 'sim' : 'nao',
            tipoDeficiencia: convertValue(formData.tipoDeficiencia) || '',
            chefeFamiliar: formData.chefeAgregado ? 'sim' : 'nao',
            nomeChefe: convertValue(formData.nomeChefe) || '',
            nomeMeioChefe: convertValue(formData.nomeMeioChefe) || '',
            sobreNomeChefe: convertValue(formData.sobrenomeChefe) || '',
            sexoChefe: convertValue(formData.sexoChefe) === 'MASCULINO' ? 'm' : 'f',
            tipoDocChefe: '',
            numDocChefe: '',
            confirmarDocChefe: '',
            numTelChefe: '',
            confirmarTelChefe: '',
            relacaoChefe: '',
            totalAgregado: (formData.totalAgregado || 1).toString(),
            feminino_0_6: (formData.feminino0a6 || 0).toString(),
            masculino_0_6: (formData.masculino0a6 || 0).toString(),
            feminino_7_18: (formData.feminino7a18 || 0).toString(),
            masculino_7_18: (formData.masculino7a18 || 0).toString(),
            feminino_19_60: (formData.feminino19a60 || 0).toString(),
            masculino_19_60: (formData.masculino19a60 || 0).toString(),
            feminino_61_mais: (formData.feminino61mais || 0).toString(),
            masculino_61_mais: (formData.masculino61mais || 0).toString(),
            atividadesProdutor: convertValue(formData.atividadesProdutor) || '',
            outraAtividade: '',
            acessoTerra: formData.acessoTerra ? 'sim' : 'nao',
            eProprietario: formData.proprietarioTerra ? 'sim' : 'nao',
            tituloTerra: formData.tituloTerra ? 'sim' : 'nao',
            tipoDocTerra: '',
            areaTotal: (formData.areaTotalCampos || 0).toString(),
            areaExplorada: (formData.areaExplorada || 0).toString(),
            areaAgricola: (formData.areaAgricola || 0).toString(),
            areaPecuaria: (formData.areaPecuaria || 0).toString(),
            areaFlorestal: (formData.areaFlorestal || 0).toString(),
            tecnologiaAgricola: convertValue(formData.tecnologiaAgricola) || '',
            culturasImportantes: convertValue(formData.culturasImportantes) || '',
            outraCultura: convertValue(formData.outraCultura) || '',
            producaoSacos: (formData.producaoSacos || 0).toString(),
            tipoSemanteira: convertValue(formData.tipoSementeira) || '',
            usoFertilizante: formData.usoFertilizantes ? 'sim' : 'nao',
            preparacaoTerra: convertValue(formData.preparacaoTerra) || '',
            acessoIrrigacao: formData.acessoIrrigacao ? 'sim' : 'nao',
            sistemaIrrigacao: convertValue(formData.sistemaIrrigacao) || '',
            especificarIrrigacao: '',
            distanciaAgua: '0',
            amanhosCulturais: '',
            tiposAmanhos: '',
            especificarAmanhos: '',
            acessoInsumoaAgricolas: '',
            fonteInsumos: '',
            especificarFonte: '',
            tiposCriacao: convertValue(formData.tiposCriacao) || '',
            outraCriacao: '',
            sistemaAvicultura: '',
            objetivoAvicultura: '',
            outroObjAvicultura: '',
            numeroAves: (formData.numeroAves || 0).toString(),
            tipoPecuaria: '',
            manejoPecuaria: '',
            numeroCabras: (formData.numeroCabras || 0).toString(),
            numeroVacas: (formData.numeroVacas || 0).toString(),
            numeroOvelhas: (formData.numeroOvelhas || 0).toString(),
            objetivoProducao: '',
            especificarObjetivoProducao: '',
            numeroPorcos: (formData.numeroPorcos || 0).toString(),
            objetivoSuinocultura: '',
            especificarObjetivoSuino: '',
            tipoAquicultura: '',
            objetivoAquicultura: '',
            especificarObjetivoAquic: '',
            numeroPeixes: (formData.numeroPeixes || 0).toString(),
            numeroCoelhos: (formData.numeroCoelhos || 0).toString(),
            objetivoCoelho: '',
            especificarObjetivoCoelhos: '',
            acessoRacao: formData.acessoRacao ? 'sim' : 'nao',
            conhecimentoDoencas: formData.conhecimentoDoencas ? 'sim' : 'nao',
            creditoBeneficio: formData.creditoBeneficio ? 'sim' : 'nao',
            fonteCredito: '',
            especificarCredito: '',
            bensFamiliares: convertValue(formData.bensFamiliares) || '',
            especificarBem: '',
            tipoApoio: convertValue(formData.tipoApoio) || '',
            observacoesGerais: convertValue(formData.observacoesGerais) || '',
            tipoPatec: '',
            especificarPatec: '',
            h3OProdutorJBeneficiouD: '',
            h31TiposDeCrditos: '',
            especificaOutroTipItoQueOBeneficiou: ''
        };
    };

    const handleSave = async () => {
        try {
            if (!formData.nomeResponsavel) {
                showToast('error', 'Nome do responsável é obrigatório');
                return;
            }

            setLoading(true);

            // Mapear dados para formato da API
            const apiData = {
                _id: parseInt(id),
                data_de_Registro: formData.dataRegistro ? new Date(formData.dataRegistro).toISOString() : new Date().toISOString(),
                nome_do_T_cnico: formData.nomeResponsavel || 'string',
                nome_da_Institui_o: formData.instituicao || 'string',
                que_tipo_de_servi_o_deseja_mon: 'Monitoramento de Pragas',
                nome_do_T_cnico_ou_Produtor: formData.nomeResponsavel || 'string',
                telefone: formData.telefone || 'string',
                provincia: typeof formData.provincia === 'object' ? formData.provincia?.value || formData.provincia?.label || 'string' : formData.provincia || 'string',
                municipio: typeof formData.municipio === 'object' ? formData.municipio?.value || formData.municipio?.label || 'string' : formData.municipio || 'string',
                comuna: formData.comuna || 'string',
                coordenadas_GPS: formData.coordenadasGPS ? `${formData.coordenadasGPS.lat},${formData.coordenadasGPS.lng}` : 'string',
                nome_da_Propriedade: formData.nomePropriedade || 'string',
                tipo_de_culturas: formData.tipoCultura || 'string',
                frutas: Array.isArray(formData.culturaAfetada) ? formData.culturaAfetada.join(', ') : formData.culturaAfetada || 'string',
                fase_da_Cultura: formData.faseCultura || 'string',
                rea_Total_Cultivada_ha: formData.areaTotalCultivada?.toString() || 'string',
                data_da_Primeira_Observa_o_001: formData.dataPrimeiraObservacao ? new Date(formData.dataPrimeiraObservacao).toISOString() : new Date().toISOString(),
                nome_da_Praga: formData.nomePraga || 'string',
                nome_Local_da_Praga: formData.nomeLocalPraga || 'string',
                sintomas_Observados_001: formData.sintomasObservados || 'string',
                percentagem_da_rea_Afetada_: formData.percentagemAreaAfetada?.toString() || 'string',
                grau_do_Dano_001: formData.grauDano || 'string',
                aplicou_alguma_medida_de_contr: formData.aplicouMedidaControle ? 'Sim' : 'Não',
                tipo_de_Medida_Aplicada: formData.tipoMedidaAplicada || 'string',
                resultado_da_Medida: formData.resultadoMedida || 'string',
                nome_da_Fazenda: formData.nomeFazenda || 'string',
                esp_cie_Animal_Afetada: Array.isArray(formData.especieAnimalAfetada) ? formData.especieAnimalAfetada.join(', ') : formData.especieAnimalAfetada || 'string',
                os_animais_afectados_tenhem_al: 'string',
                quais_s_o_as_vacinas_os_animais_afectados: 'string',
                n_mero_Total_de_Animais: formData.numeroTotalAnimais?.toString() || 'string',
                data_da_Primeira_Observa_o: formData.dataPrimeiraObservacaoPecuaria ? new Date(formData.dataPrimeiraObservacaoPecuaria).toISOString() : new Date().toISOString(),
                nome_da_Praga_Doen_a: formData.nomePragaDoenca || 'string',
                sintomas_Observados: formData.sintomasObservadosPecuaria || 'string',
                n_mero_de_Animais_Afetados: formData.numeroAnimaisAfetados?.toString() || 'string',
                grau_do_Dano: formData.grauDanoPecuaria || 'string',
                aplicou_algum_tratamento: formData.aplicouTratamento ? 'Sim' : 'Não',
                tipo_de_Tratamento_Usado: formData.tipoTratamento || 'string',
                resultado_do_Tratamento: formData.resultadoTratamento || 'string',
                necessita_apoio_veterin_rio: formData.necessitaApoioVeterinario ? 'Sim' : 'Não',
                observa_es_adicionais: formData.observacoesAdicionais || formData.observacoesAdicionaisPecuaria || 'string',
                qual_o_tipo_de_produ_o_afetada: formData.tipoProducao || 'string',
                necessita_apoio_t_cnico: formData.necessitaApoioTecnico ? 'Sim' : 'Não',
                observa_es_adicionais_001: formData.observacoesAdicionais || 'string',
                nome_do_Validador: formData.nomeValidador || 'string',
                valor_Estimado_da_Pecu_ria: 0,
                valor_Estimado_Agr_colas: 0,
                institui_o: formData.instituicao || 'string',
                _attachments: []
            };

            console.log('=== DADOS ENVIADOS PARA ATUALIZAÇÃO ===');
            console.log('FormData original:', formData);
            console.log('Dados mapeados para API:', apiData);
            console.log('URL da requisição:', `/pragas/${id}`);
            console.log('Método:', 'PUT');
            console.log('==========================================');

            const response = await api.put(`/pragas/${id}`, apiData);

            console.log('Resposta completa da API:', {
                status: response.status,
                statusText: response.statusText,
                data: response.data
            });
            
            showToast('success', 'Dados da praga atualizados com sucesso!');
            setIsEditing(false);
            
            // Recarregar dados após salvar
            window.location.reload();

        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar dados da praga. Tente novamente.');
        } finally {
            setLoading(false);
        }
    };



    // Função para calcular o valor máximo permitido para um campo
    const calculateMaxValue = (field) => {
        const currentValue = parseInt(formData[field]) || 0;
        const otherFieldsTotal = getDistribuicaoTotal(formData) - currentValue;
        return Math.max(0, (parseInt(formData.totalAgregado) || 0) - otherFieldsTotal);
    };

    // Função para atualizar distribuição com validação
    const updateDistribuicao = (field, value) => {
        const novoValor = parseInt(value) || 0;
        const tempData = { ...formData, [field]: novoValor };
        const totalDistribuido = getDistribuicaoTotal(tempData);
        const totalMembros = parseInt(formData.totalAgregado) || 0;

        if (totalDistribuido > totalMembros) {
            showToast('error', `A distribuição não pode ultrapassar o Total de Membros (${totalMembros})`);

            // Calcula o valor máximo permitido para este campo
            const outrosCamposTotal = getDistribuicaoTotal(formData) - (parseInt(formData[field]) || 0);
            const valorMaximoPermitido = Math.max(0, totalMembros - outrosCamposTotal);

            // Atualiza o campo com o valor máximo permitido
            setFormData(prev => ({
                ...prev,
                [field]: valorMaximoPermitido
            }));
            return;
        }

        setFormData(tempData);
    };

    // Função para calcular o total distribuído
    const getDistribuicaoTotal = (data) => {
        return (
            (parseInt(data.feminino0a6) || 0) +
            (parseInt(data.masculino0a6) || 0) +
            (parseInt(data.feminino7a18) || 0) +
            (parseInt(data.masculino7a18) || 0) +
            (parseInt(data.feminino19a60) || 0) +
            (parseInt(data.masculino19a60) || 0) +
            (parseInt(data.feminino61mais) || 0) +
            (parseInt(data.masculino61mais) || 0)
        );
    };

    // Handler para campos duais (atualiza o campo e valida a distribuição)
    const handleChangeDual = (field) => (value) => {
        const parsed = parseInt(value) || 0;
        updateFormData(field, parsed);
        updateDistribuicao(field, parsed);
    };


    // Nova função para confirmar alteração
    const confirmStatusChange = async () => {
        const value = pendingStatusValue;
        const novoStatus = getSelectStringValue(value);
        const pragaId = praga?.id || formData?.id || parseInt(id);

        // Mapear status para valores aceitos pela API
        const statusMapping = {
            'CONTROLADO': 'Controlado',
            'DETECTADO': 'Detectado',
            'EM_TRATAMENTO': 'EmTratamento',
            'CRITICO': 'Critico'
        };
        
        const estadoAPI = statusMapping[novoStatus] || novoStatus;

        console.log('=== ALTERANDO ESTADO DA PRAGA ===');
        console.log('ID da URL:', id);
        console.log('ID da praga:', praga?.id);
        console.log('ID do formData:', formData?.id);
        console.log('ID final usado:', pragaId);
        console.log('Novo status original:', novoStatus);
        console.log('Estado mapeado para API:', estadoAPI);
        console.log('=====================================');

        setAlterandoStatus(true);
        setShowStatusModal(false);

        try {
            const requestFormData = new FormData();
            requestFormData.append('Id', pragaId);
            requestFormData.append('Estado', estadoAPI);

            console.log('Dados enviados para API:', {
                Id: pragaId,
                Estado: estadoAPI
            });

            const response = await api.patch('/pragas/estado', requestFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.status === 200 || response.status === 204) {
                const updatedPraga = { ...praga, statusProcesso: novoStatus };
                const updatedFormData = { ...formData, statusProcesso: value };
                setPraga(updatedPraga);
                setFormData(updatedFormData);
                setCurrentStatus(estadoAPI); // Atualizar status atual
                showToast('success', 'Estado da praga alterado com sucesso!');
            }
        } catch (error) {
            console.error('Erro ao alterar estado:', error);
            showToast('error', 'Erro ao alterar estado da praga');
        } finally {
            setAlterandoStatus(false);
            setPendingStatusValue(null);
        }
    };





    // Funções para modais e ações
    const handleEditClick = () => {
        setIsEditing(true);
        showToast('info', 'Modo de edição ativado');
    };

    const handleConsultarBI = () => {
        setShowBIValidation(true);
        setBiValidation('');
        setBiError('');
    };



    const validateBI = () => {
        if (!biValidation) {
            setBiError('Por favor, digite o número do BI/NIF');
            return;
        }
        consultarDocumento(biValidation);
        setShowBIValidation(false);
        setBiError('');
    };

    const handleCancelEdit = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        const formattedData = {
            ...pragaMapeada
        };
        setFormData(formattedData);
        showToast('info', 'Edição cancelada');
        setShowCancelModal(false);
    };

    const handleDownloadReport = async () => {
        if (!praga) {
            showToast('error', 'Dados da praga não encontrados');
            return;
        }

        setGerando(true);
        showToast('info', 'Gerando relatório da praga...');

        try {
            await gerarFichaProdutorPDF(id);
            showToast('success', 'Ficha gerada com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar ficha:', error);
            showToast('error', error.message || 'Erro ao gerar a ficha');
        } finally {
            setGerando(false);
        }
    };

    const handleGenerateCard = () => {
        navigate(`/GerenciaRNPA/gestao-escolar/produtores/gerar-cartao/${id}`);
    };

    // Função para renderizar botões de ação
    const renderActionButtons = () => {
        const isAprovado = isPragaAprovada(praga);

        if (isAprovado) {
            return (
                <div className="flex gap-3">
                    <button
                        onClick={handleDownloadReport}
                        disabled={gerando}
                        className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                    >
                        {gerando ? (
                            <>
                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                Gerando...
                            </>
                        ) : (
                            <>
                                <Download className="w-4 h-4 mr-2" />
                                Ficha
                            </>
                        )}
                    </button>
                    <button
                        onClick={handleGenerateCard}
                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <CreditCard className="w-4 h-4 mr-2" />
                        Gerar Cartão
                    </button>
                </div>
            );
        }
        return null;
    };

    // Função para renderizar conteúdo dos steps
    const renderStepContent = (index) => {
        switch (index) {
            case 0: // Responsável
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Responsável</h3>
                            </div>
                            <p className="text-gray-600">
                                Informe os dados do técnico ou produtor responsável pelo registro.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CustomInput
                                type="text"
                                label="Nome do Técnico ou Produtor"
                                value={formData.nomeResponsavel || ''}
                                onChange={(value) => updateFormData('nomeResponsavel', value)}
                                disabled={!isEditing}
                                placeholder="Nome completo do responsável"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Telefone"
                                value={formData.telefone || ''}
                                onChange={(value) => updateFormData('telefone', value)}
                                disabled={!isEditing}
                                placeholder="Ex: 923456789"
                                iconStart={<Phone size={18} />}
                            />

                            <CustomInput
                                type="date"
                                label="Data de Registro"
                                value={formData.dataRegistro || ''}
                                onChange={(value) => updateFormData('dataRegistro', value)}
                                disabled={!isEditing}
                                iconStart={<Calendar size={18} />}
                            />
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
                            <p className="text-gray-600">
                                Informe a localização onde foi observada a praga.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="select"
                                label="Província/Estado"
                                value={formData.provincia}
                                options={provinciasData.map(provincia => ({
                                    label: provincia.nome,
                                    value: provincia.nome.toUpperCase()
                                }))}
                                onChange={(value) => handleProvinciaChange(value)}
                                disabled={!isEditing}
                                placeholder="Selecione a província"
                                iconStart={<Map size={18} />}
                                required
                            />

                            <CustomInput
                                type="select"
                                label="Distrito/Município"
                                value={formData.municipio}
                                options={municipiosOptions}
                                onChange={(value) => updateFormData('municipio', value)}
                                disabled={!isEditing || !formData.provincia}
                                placeholder="Selecione o município"
                                iconStart={<MapPin size={18} />}
                                required
                            />

                            <CustomInput
                                type="text"
                                label="Comuna"
                                value={formData.comuna || ''}
                                onChange={(value) => updateFormData('comuna', value)}
                                disabled={!isEditing}
                                placeholder="Comuna"
                                iconStart={<MapPin size={18} />}
                                required
                            />

                            <CustomInput
                                type="text"
                                label="Latitude"
                                value={formData.coordenadasGPS?.lat || ''}
                                onChange={(value) => updateFormData('coordenadasGPS', {
                                    ...formData.coordenadasGPS,
                                    lat: value
                                })}
                                disabled={!isEditing}
                                placeholder="Ex: -8.8383"
                                iconStart={<Globe size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Longitude"
                                value={formData.coordenadasGPS?.lng || ''}
                                onChange={(value) => updateFormData('coordenadasGPS', {
                                    ...formData.coordenadasGPS,
                                    lng: value
                                })}
                                disabled={!isEditing}
                                placeholder="Ex: 13.2344"
                                iconStart={<Globe size={18} />}
                            />
                        </div>

                        {isEditing && (
                            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                    Coordenadas GPS
                                </h4>

                                <MapaGPS
                                    latitude={formData.coordenadasGPS?.lat || ''}
                                    longitude={formData.coordenadasGPS?.lng || ''}
                                    onLocationSelect={(lat, lng) => {
                                        updateFormData('coordenadasGPS', { lat, lng });
                                    }}
                                />

                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                    <p className="text-sm text-blue-600 flex items-center">
                                        <Info size={16} className="mr-2" />
                                        Clique no mapa para selecionar uma localização automaticamente
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2: // Tipo de Produção
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Activity className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Tipo de Produção Afetada</h3>
                            </div>
                            <p className="text-gray-600">
                                Selecione o tipo de produção afetada pela praga ou doença.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div 
                                className={`p-6 border-2 rounded-2xl transition-all ${isEditing ? 'cursor-pointer hover:shadow-md' : ''} ${
                                    formData.tipoProducao === 'agricola' || formData.tipoProducao === 'agrícola' 
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200'
                                }`}
                                onClick={() => isEditing && updateFormData('tipoProducao', 'agrícola')}
                            >
                                <div className="text-center">
                                    <Tractor className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Agrícola</h4>
                                    <p className="text-sm text-gray-600">Culturas agrícolas afetadas por pragas</p>
                                    {(formData.tipoProducao === 'agricola' || formData.tipoProducao === 'agrícola') && (
                                        <p className="text-sm font-medium text-blue-600 mt-2">✓ Selecionado</p>
                                    )}
                                </div>
                            </div>

                            <div 
                                className={`p-6 border-2 rounded-2xl transition-all ${isEditing ? 'cursor-pointer hover:shadow-md' : ''} ${
                                    formData.tipoProducao === 'pecuaria' || formData.tipoProducao === 'pecuária'
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200'
                                }`}
                                onClick={() => isEditing && updateFormData('tipoProducao', 'pecuária')}
                            >
                                <div className="text-center">
                                    <Heart className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Pecuária</h4>
                                    <p className="text-sm text-gray-600">Animais afetados por pragas ou doenças</p>
                                    {(formData.tipoProducao === 'pecuaria' || formData.tipoProducao === 'pecuária') && (
                                        <p className="text-sm font-medium text-blue-600 mt-2">✓ Selecionado</p>
                                    )}
                                </div>
                            </div>

                            <div 
                                className={`p-6 border-2 rounded-2xl transition-all ${isEditing ? 'cursor-pointer hover:shadow-md' : ''} ${
                                    formData.tipoProducao === 'ambas'
                                        ? 'border-blue-500 bg-blue-50' 
                                        : 'border-gray-200'
                                }`}
                                onClick={() => isEditing && updateFormData('tipoProducao', 'ambas')}
                            >
                                <div className="text-center">
                                    <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                                    <h4 className="text-lg font-semibold text-gray-800 mb-2">Ambas</h4>
                                    <p className="text-sm text-gray-600">Produção agrícola e pecuária afetadas</p>
                                    {formData.tipoProducao === 'ambas' && (
                                        <p className="text-sm font-medium text-blue-600 mt-2">✓ Selecionado</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-600">
                                <strong>Tipo selecionado :</strong> {formData.tipoProducao || 'N/A'}
                            </p>
                        </div>

                    </div>
                );

            case 3: // Info Agrícolas
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Tractor className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Informações Agrícolas</h3>
                            </div>
                            <p className="text-gray-600">
                                Detalhes sobre as culturas agrícolas afetadas pela praga.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Dados da Propriedade</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Nome da Propriedade"
                                        value={formData.nomePropriedade || ''}
                                        onChange={(value) => updateFormData('nomePropriedade', value)}
                                        disabled={!isEditing}
                                        placeholder="Nome da propriedade ou fazenda"
                                        iconStart={<Building size={18} />}
                                        required
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Área Total Cultivada (ha)"
                                        value={formData.areaTotalCultivada || ''}
                                        onChange={(value) => updateFormData('areaTotalCultivada', value)}
                                        disabled={!isEditing}
                                        placeholder="Ex: 10.5"
                                        iconStart={<Tractor size={18} />}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Tipo de Cultura *</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Tipo de Cultura"
                                        value={isEditing ?
                                            formData.tipoCultura ? { label: formData.tipoCultura, value: formData.tipoCultura } : null :
                                            formData.tipoCultura || ''
                                        }
                                        options={[
                                            { label: 'Cereais', value: 'cereais' },
                                            { label: 'Frutas', value: 'frutas' },
                                            { label: 'Hortícolas', value: 'horticolas' },
                                            { label: 'Legumes', value: 'legumes' },
                                            { label: 'Tubérculos', value: 'tuberculos' }
                                        ]}
                                        onChange={(value) => {
                                            updateFormData('tipoCultura', isEditing ? value?.value : value);
                                            if (isEditing) {
                                                updateFormData('culturaAfetada', []);
                                            }
                                        }}
                                        disabled={!isEditing}
                                        placeholder="Selecione o tipo de cultura"
                                        iconStart={<Tractor size={18} />}
                                        required
                                    />

                                    {formData.tipoCultura && (
                                        <CustomInput
                                            type={isEditing ? "multiselect" : "text"}
                                            label={`${formData.tipoCultura?.charAt(0).toUpperCase() + formData.tipoCultura?.slice(1)} Afetadas`}
                                            value={isEditing ? 
                                                formData.culturaAfetada || [] :
                                                Array.isArray(formData.culturaAfetada) ? formData.culturaAfetada.join(', ') : formData.culturaAfetada || ''
                                            }
                                            options={getCulturaOptions(formData.tipoCultura)}
                                            onChange={(value) => updateFormData('culturaAfetada', value)}
                                            disabled={!isEditing}
                                            iconStart={<Wheat size={18} />}
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Fase da Cultura</h4>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {['Germinação', 'Crescimento', 'Floração', 'Maturação'].map(fase => (
                                        <label key={fase} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="radio"
                                                name="faseCultura"
                                                value={fase}
                                                checked={formData.faseCultura === fase}
                                                onChange={(e) => updateFormData('faseCultura', e.target.value)}
                                                disabled={!isEditing}
                                                className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{fase}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Informações da Praga</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Nome da Praga"
                                        value={formData.nomePraga || ''}
                                        onChange={(value) => updateFormData('nomePraga', value)}
                                        disabled={!isEditing}
                                        placeholder="Nome científico ou comum da praga"
                                        iconStart={<Bug size={18} />}
                                        required
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Nome Local da Praga"
                                        value={formData.nomeLocalPraga || ''}
                                        onChange={(value) => updateFormData('nomeLocalPraga', value)}
                                        disabled={!isEditing}
                                        placeholder="Nome local/popular da praga"
                                        iconStart={<Bug size={18} />}
                                    />

                                    <CustomInput
                                        type="date"
                                        label="Data da Primeira Observação"
                                        value={formData.dataPrimeiraObservacao || ''}
                                        onChange={(value) => updateFormData('dataPrimeiraObservacao', value)}
                                        disabled={!isEditing}
                                        iconStart={<Calendar size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Percentagem da Área Afetada (%)"
                                        value={formData.percentagemAreaAfetada || ''}
                                        onChange={(value) => {
                                            const numValue = parseFloat(value);
                                            if (numValue > 100) {
                                                showToast('warn', 'Valor máximo', 'Valor máximo 100%');
                                                updateFormData('percentagemAreaAfetada', 100);
                                            } else {
                                                updateFormData('percentagemAreaAfetada', value);
                                            }
                                        }}
                                        disabled={!isEditing}
                                        placeholder="Ex: 25.5"
                                        min="0"
                                        max="100"
                                        iconStart={<Activity size={18} />}
                                    />

                                    <div className="md:col-span-2">
                                        <CustomInput
                                            type="textarea"
                                            label="Sintomas Observados"
                                            value={formData.sintomasObservados || ''}
                                            onChange={(value) => updateFormData('sintomasObservados', value)}
                                            disabled={!isEditing}
                                            placeholder="Descreva os sintomas observados nas plantas..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Avaliação e Medidas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Grau do Dano"
                                        value={isEditing ? 
                                            formData.grauDano ? { label: formData.grauDano, value: formData.grauDano } : null :
                                            formData.grauDano || ''
                                        }
                                        options={[
                                            { label: 'Leve', value: 'Leve' },
                                            { label: 'Moderado', value: 'Moderado' },
                                            { label: 'Grave', value: 'Grave' }
                                        ]}
                                        onChange={(value) => updateFormData('grauDano', isEditing ? value?.value : value)}
                                        disabled={!isEditing}
                                        placeholder="Selecione"
                                        iconStart={<AlertCircle size={18} />}
                                    />

                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Necessita apoio técnico?"
                                        value={isEditing ?
                                            formData.necessitaApoioTecnico !== undefined ? 
                                                { label: formData.necessitaApoioTecnico ? 'Sim' : 'Não', value: formData.necessitaApoioTecnico } : null :
                                            formData.necessitaApoioTecnico ? 'Sim' : 'Não'
                                        }
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('necessitaApoioTecnico', isEditing ? value?.value : value)}
                                        disabled={!isEditing}
                                        placeholder="Selecione"
                                        iconStart={<CheckCircle size={18} />}
                                    />

                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Aplicou medida de controle?"
                                        value={isEditing ?
                                            formData.aplicouMedidaControle !== undefined ?
                                                { label: formData.aplicouMedidaControle ? 'Sim' : 'Não', value: formData.aplicouMedidaControle } : null :
                                            formData.aplicouMedidaControle ? 'Sim' : 'Não'
                                        }
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('aplicouMedidaControle', isEditing ? value?.value : value)}
                                        disabled={!isEditing}
                                        placeholder="Selecione"
                                        iconStart={<Activity size={18} />}
                                    />
                                </div>

                                {formData.aplicouMedidaControle && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <CustomInput
                                            type="text"
                                            label="Tipo de Medida Aplicada"
                                            value={formData.tipoMedidaAplicada || ''}
                                            onChange={(value) => updateFormData('tipoMedidaAplicada', value)}
                                            disabled={!isEditing}
                                            placeholder="Ex: Pulverização com inseticida"
                                            iconStart={<Activity size={18} />}
                                        />

                                        <CustomInput
                                            type={isEditing ? "select" : "text"}
                                            label="Resultado da Medida"
                                            value={isEditing ?
                                                formData.resultadoMedida ? { label: formData.resultadoMedida, value: formData.resultadoMedida } : null :
                                                formData.resultadoMedida || ''
                                            }
                                            options={[
                                                { label: 'Eficaz', value: 'Eficaz' },
                                                { label: 'Parcial', value: 'Parcial' },
                                                { label: 'Sem efeito', value: 'Sem efeito' }
                                            ]}
                                            onChange={(value) => updateFormData('resultadoMedida', isEditing ? value?.value : value)}
                                            disabled={!isEditing}
                                            placeholder="Selecione"
                                            iconStart={<CheckCircle size={18} />}
                                        />
                                    </div>
                                )}

                                <div className="mt-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Observações Adicionais"
                                        value={formData.observacoesAdicionais || ''}
                                        onChange={(value) => updateFormData('observacoesAdicionais', value)}
                                        disabled={!isEditing}
                                        placeholder="Informações adicionais relevantes..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {(isEditing || formData.fotoPraga || previewPerfil) && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-6">Foto da Praga ou Sintomas</h4>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            id="foto-praga-agricola"
                                            onChange={handleFotoPerfilChange}
                                            disabled={!isEditing}
                                        />
                                        <label
                                            htmlFor="foto-praga-agricola"
                                            className={`flex flex-col items-center justify-center h-40 sm:h-48 md:h-56 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                                previewPerfil || formData.fotoPraga ? 
                                                'bg-green-50 border-green-300 hover:bg-green-100' : 
                                                'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                        >
                                            {previewPerfil ? (
                                                <img src={previewPerfil} alt="Preview" className="w-full h-full object-cover rounded-lg max-w-full max-h-full" />
                                            ) : formData.fotoPraga ? (
                                                <>
                                                    <CheckCircle className="w-8 h-8 mb-3 text-green-600" />
                                                    <p className="text-sm font-medium text-green-600">Foto carregada com sucesso</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="w-8 h-8 mb-3 text-gray-400" />
                                                    <p className="text-sm font-medium text-gray-500">{novaFotoPerfil ? novaFotoPerfil.name : 'Carregar foto da praga'}</p>
                                                </>
                                            )}
                                        </label>
                                        {previewPerfil && isEditing && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => uploadFotoPerfil(novaFotoPerfil)}
                                                    disabled={uploadingPerfil}
                                                    className=" px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm "
                                                >
                                                    {uploadingPerfil ? 'Enviando...' : 'Salvar Foto'}
                                                </button>
                                                <button
                                                    onClick={cancelarFotoPerfil}
                                                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                    </div>
                );

            case 4: // Info Pecuárias
                if (formData.tipoProducao !== 'pecuaria' && formData.tipoProducao !== 'pecuária' && formData.tipoProducao !== 'ambas') {
                    return (
                        <div className="text-center py-20">
                            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                            <h3 className="text-xl font-semibold text-gray-600 mb-2">Informações Pecuárias</h3>
                            <p className="text-gray-500">Esta seção será preenchida apenas se a produção pecuária for afetada.</p>
                        </div>
                    );
                }

                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8 border border-red-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-red-100 rounded-lg">
                                    <Heart className="w-6 h-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Informações Pecuárias</h3>
                            </div>
                            <p className="text-gray-600">
                                Detalhes sobre os animais afetados pela praga ou doença.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Dados da Fazenda</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Nome da Fazenda"
                                        value={formData.nomeFazenda || ''}
                                        onChange={(value) => updateFormData('nomeFazenda', value)}
                                        disabled={!isEditing}
                                        placeholder="Nome da fazenda ou propriedade"
                                        iconStart={<Building size={18} />}
                                        required
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número Total de Animais"
                                        value={formData.numeroTotalAnimais || ''}
                                        onChange={(value) => updateFormData('numeroTotalAnimais', value)}
                                        disabled={!isEditing}
                                        placeholder="Ex: 150"
                                        iconStart={<Heart size={18} />}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Espécie Animal Afetada *</h4>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                    {['Bovino', 'Caprino', 'Ovino', 'Suíno', 'Aves', 'Outros'].map(especie => (
                                        <label key={especie} className="flex items-center space-x-3 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={Array.isArray(formData.especieAnimalAfetada) ? 
                                                    formData.especieAnimalAfetada.includes(especie) : 
                                                    formData.especieAnimalAfetada === especie
                                                }
                                                onChange={(e) => {
                                                    if (!isEditing) return;
                                                    const currentEspecies = Array.isArray(formData.especieAnimalAfetada) ? 
                                                        formData.especieAnimalAfetada : 
                                                        formData.especieAnimalAfetada ? [formData.especieAnimalAfetada] : [];
                                                    const newEspecies = e.target.checked
                                                        ? [...currentEspecies, especie]
                                                        : currentEspecies.filter(e => e !== especie);
                                                    updateFormData('especieAnimalAfetada', newEspecies);
                                                }}
                                                disabled={!isEditing}
                                                className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                                            />
                                            <span className="text-sm font-medium text-gray-700">{especie}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Informações da Praga/Doença</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="text"
                                        label="Nome da Praga/Doença"
                                        value={formData.nomePragaDoenca || ''}
                                        onChange={(value) => updateFormData('nomePragaDoenca', value)}
                                        disabled={!isEditing}
                                        placeholder="Nome da praga ou doença"
                                        iconStart={<Bug size={18} />}
                                        required
                                    />

                                    <CustomInput
                                        type="date"
                                        label="Data da Primeira Observação"
                                        value={formData.dataPrimeiraObservacaoPecuaria || ''}
                                        onChange={(value) => updateFormData('dataPrimeiraObservacaoPecuaria', value)}
                                        disabled={!isEditing}
                                        iconStart={<Calendar size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Animais Afetados"
                                        value={formData.numeroAnimaisAfetados || ''}
                                        onChange={(value) => updateFormData('numeroAnimaisAfetados', value)}
                                        disabled={!isEditing}
                                        placeholder="Ex: 25"
                                        iconStart={<Heart size={18} />}
                                    />

                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Grau do Dano"
                                        value={isEditing ?
                                            formData.grauDanoPecuaria ? { label: formData.grauDanoPecuaria, value: formData.grauDanoPecuaria } : null :
                                            formData.grauDanoPecuaria || ''
                                        }
                                        options={[
                                            { label: 'Leve', value: 'Leve' },
                                            { label: 'Moderado', value: 'Moderado' },
                                            { label: 'Grave', value: 'Grave' }
                                        ]}
                                        onChange={(value) => updateFormData('grauDanoPecuaria', isEditing ? value?.value : value)}
                                        disabled={!isEditing}
                                        placeholder="Selecione"
                                        iconStart={<AlertCircle size={18} />}
                                    />

                                    <div className="md:col-span-2">
                                        <CustomInput
                                            type="textarea"
                                            label="Sintomas Observados"
                                            value={formData.sintomasObservadosPecuaria || ''}
                                            onChange={(value) => updateFormData('sintomasObservadosPecuaria', value)}
                                            disabled={!isEditing}
                                            placeholder="Descreva os sintomas observados nos animais..."
                                            rows={3}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6">Tratamento e Medidas</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Aplicou algum tratamento?"
                                        value={isEditing ?
                                            formData.aplicouTratamento !== undefined ?
                                                { label: formData.aplicouTratamento ? 'Sim' : 'Não', value: formData.aplicouTratamento } : null :
                                            formData.aplicouTratamento ? 'Sim' : 'Não'
                                        }
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('aplicouTratamento', isEditing ? value?.value : value)}
                                        disabled={!isEditing}
                                        placeholder="Selecione"
                                        iconStart={<Activity size={18} />}
                                    />

                                    <CustomInput
                                        type={isEditing ? "select" : "text"}
                                        label="Necessita apoio veterinário?"
                                        value={isEditing ?
                                            formData.necessitaApoioVeterinario !== undefined ?
                                                { label: formData.necessitaApoioVeterinario ? 'Sim' : 'Não', value: formData.necessitaApoioVeterinario } : null :
                                            formData.necessitaApoioVeterinario ? 'Sim' : 'Não'
                                        }
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('necessitaApoioVeterinario', isEditing ? value?.value : value)}
                                        disabled={!isEditing}
                                        placeholder="Selecione"
                                        iconStart={<CheckCircle size={18} />}
                                    />
                                </div>

                                {(formData.aplicouTratamento === true || formData.aplicouTratamento?.value === true) && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                                        <CustomInput
                                            type="text"
                                            label="Tipo de Tratamento Usado"
                                            value={formData.tipoTratamento || ''}
                                            onChange={(value) => updateFormData('tipoTratamento', value)}
                                            disabled={!isEditing}
                                            placeholder="Ex: Medicamento, vacina, etc."
                                            iconStart={<Activity size={18} />}
                                        />

                                        <CustomInput
                                            type={isEditing ? "select" : "text"}
                                            label="Resultado do Tratamento"
                                            value={isEditing ?
                                                formData.resultadoTratamento ? { label: formData.resultadoTratamento, value: formData.resultadoTratamento } : null :
                                                formData.resultadoTratamento || ''
                                            }
                                            options={[
                                                { label: 'Eficaz', value: 'Eficaz' },
                                                { label: 'Parcial', value: 'Parcial' },
                                                { label: 'Sem efeito', value: 'Sem efeito' }
                                            ]}
                                            onChange={(value) => updateFormData('resultadoTratamento', isEditing ? value?.value : value)}
                                            disabled={!isEditing}
                                            placeholder="Selecione"
                                            iconStart={<CheckCircle size={18} />}
                                        />
                                    </div>
                                )}

                                <div className="mt-6">
                                    <CustomInput
                                        type="textarea"
                                        label="Observações Adicionais"
                                        value={formData.observacoesAdicionaisPecuaria || ''}
                                        onChange={(value) => updateFormData('observacoesAdicionaisPecuaria', value)}
                                        disabled={!isEditing}
                                        placeholder="Informações adicionais relevantes..."
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {(isEditing || formData.fotoPragaPecuaria || previewDigitais) && (
                                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                    <h4 className="text-lg font-semibold text-gray-800 mb-6">Foto dos Sinais Clínicos</h4>
                                    <div className="relative">
                                        <input
                                            type="file"
                                            className="hidden"
                                            accept="image/*"
                                            id="foto-praga-pecuaria"
                                            onChange={handleFotoDigitaisChange}
                                            disabled={!isEditing}
                                        />
                                        <label
                                            htmlFor="foto-praga-pecuaria"
                                            className={`flex flex-col items-center justify-center h-40 sm:h-48 md:h-56 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                                previewDigitais || formData.fotoPragaPecuaria ? 
                                                'bg-green-50 border-green-300 hover:bg-green-100' : 
                                                'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                            }`}
                                        >
                                            {previewDigitais ? (
                                                <img src={previewDigitais} alt="Preview" className="w-full h-full object-cover rounded-lg max-w-full max-h-full" />
                                            ) : formData.fotoPragaPecuaria ? (
                                                <>
                                                    <CheckCircle className="w-8 h-8 mb-3 text-green-600" />
                                                    <p className="text-sm font-medium text-green-600">Foto carregada com sucesso</p>
                                                </>
                                            ) : (
                                                <>
                                                    <Camera className="w-8 h-8 mb-3 text-gray-400" />
                                                    <p className="text-sm font-medium text-gray-500">{novaFotoDigitais ? novaFotoDigitais.name : 'Carregar foto dos sinais clínicos'}</p>
                                                </>
                                            )}
                                        </label>
                                        {previewDigitais && isEditing && (
                                            <div className="flex gap-2 mt-3">
                                                <button
                                                    onClick={() => uploadFotoDigitais(novaFotoDigitais)}
                                                    disabled={uploadingDigitais}
                                                    className="flex-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 text-sm"
                                                >
                                                    {uploadingDigitais ? 'Enviando...' : 'Salvar Foto'}
                                                </button>
                                                <button
                                                    onClick={cancelarFotoDigitais}
                                                    className="px-3 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
                                                >
                                                    Cancelar
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 5: // Finalização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Finalização</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações do validador responsável pela confirmação dos dados.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-6">Dados do Validador</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <CustomInput
                                    type="text"
                                    label="Nome do Validador"
                                    value={formData.nomeValidador || ''}
                                    onChange={(value) => updateFormData('nomeValidador', value)}
                                    disabled={!isEditing}
                                    placeholder="Nome completo do validador"
                                    iconStart={<User size={18} />}
                                    required
                                />

                                <CustomInput
                                    type="text"
                                    label="Instituição"
                                    value={formData.instituicao || ''}
                                    onChange={(value) => updateFormData('instituicao', value)}
                                    disabled={!isEditing}
                                    placeholder="Nome da instituição"
                                    iconStart={<Building size={18} />}
                                    required
                                />
                            </div>
                        </div>

                        <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                            <h4 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                                <Info className="w-5 h-5 mr-2" />
                                Resumo do Registro
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                <div>
                                    <span className="font-medium text-gray-600">Responsável:</span>
                                    <p className="text-gray-800">{formData.nomeResponsavel || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Localização:</span>
                                    <p className="text-gray-800">{formData.provincia || 'N/A'}, {formData.municipio || 'N/A'}</p>
                                </div>
                                <div>
                                    <span className="font-medium text-gray-600">Tipo de Produção:</span>
                                    <p className="text-gray-800 capitalize">{formData.tipoProducao || 'N/A'}</p>
                                </div>
                                {(formData.tipoProducao === 'agricola' || formData.tipoProducao === 'agrícola' || formData.tipoProducao === 'ambas') && (
                                    <>
                                        <div>
                                            <span className="font-medium text-gray-600">Propriedade:</span>
                                            <p className="text-gray-800">{formData.nomePropriedade || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Praga Agrícola:</span>
                                            <p className="text-gray-800">{formData.nomePraga || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                                {(formData.tipoProducao === 'pecuaria' || formData.tipoProducao === 'pecuária' || formData.tipoProducao === 'ambas') && (
                                    <>
                                        <div>
                                            <span className="font-medium text-gray-600">Fazenda:</span>
                                            <p className="text-gray-800">{formData.nomeFazenda || 'N/A'}</p>
                                        </div>
                                        <div>
                                            <span className="font-medium text-gray-600">Praga/Doença:</span>
                                            <p className="text-gray-800">{formData.nomePragaDoenca || 'N/A'}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                );



            default:
                return <div className="text-center text-gray-500">Etapa não encontrada</div>;
        }
    };

    // Loading state
    if (loading || loadingAPI) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
                    <p className="mt-4 text-gray-600">Carregando dados da praga...</p>
                </div>
            </div>
        );
    }

    // Praga não encontrada
    if (!praga) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Praga não encontrada</h1>
                    <p className="text-gray-600 mb-6">A ocorrência de praga solicitada não foi encontrada no sistema.</p>
                    <button
                        onClick={() => navigate('/GerenciaRNPA/pragas')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                        Voltar à lista
                    </button>
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

            {/* Modal de Validação do BI */}
            {showBIValidation && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[100000]">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Validação de Identidade</h3>
                        <p className="text-gray-600 mb-4">
                            Para editar os dados da praga, digite o número do BI ou NIF. Os dados do responsável serão preenchidos automaticamente.
                        </p>
                        <CustomInput
                            type="text"
                            label="BI/NIF*"
                            value={biValidation}
                            onChange={setBiValidation}
                            placeholder="Digite o número do BI ou NIF"
                            errorMessage={biError}
                            iconStart={<FileText size={18} />}
                        />
                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={() => setShowBIValidation(false)}
                                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={validateBI}
                                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                                Validar BI
                            </button>
                        </div>
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

            {/* Header Principal */}
            <div className="container mx-auto px-4 py-6">
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
                    <div className="p-6">
                        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
                            {/* Título e navegação */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={() => navigate('/GerenciaRNPA/pragas')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isEditing ? 'Editando Ocorrência de Praga' : 'Detalhes da Ocorrência de Praga'}
                                    </h1>
                                    <p className="text-gray-600">ID: {praga?.id || 'N/A'}</p>
                                </div>


                            </div>

                            {/* Botões de ação do cabeçalho */}
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleCancelEdit}
                                            className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                                        >
                                            <X className="w-4 h-4 mr-2" />
                                            Cancelar
                                        </button>
                                        <button
                                            onClick={handleConsultarBI}
                                            disabled={consultingBI}
                                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                        >
                                            {consultingBI ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                                    Consultando...
                                                </>
                                            ) : (
                                                <>
                                                    <FileText className="w-4 h-4 mr-2" />
                                                    Preencher pelo BI
                                                </>
                                            )}
                                        </button>
                                        <button
                                            onClick={handleSave}
                                            disabled={loading}
                                            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-300"
                                        >
                                            {loading ? (
                                                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                            ) : (
                                                <Save className="w-4 h-4 mr-2" />
                                            )}
                                            {loading ? 'Salvando...' : 'Salvar'}
                                        </button>
                                    </>
                                ) : (
                                    <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                                        <div className="flex gap-3 mb-4">
                                            <button
                                                onClick={handleEditClick}
                                                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Edit className="w-4 h-4 mr-2" />
                                                Editar
                                            </button>
                                            {renderActionButtons()}
                                        </div>
                                        {/* Select de status */}
                                        <div className="min-w-[180px]">
                                            <CustomInput
                                                type="select"
                                                label=""
                                                value={formData.statusProcesso}
                                                options={statusOptions}
                                                onChange={handleStatusChange}
                                                disabled={alterandoStatus}
                                                placeholder={alterandoStatus ? "Alterando..." : "Status"}
                                                iconStart={alterandoStatus ?
                                                    <div className="animate-spin rounded-full h-2 w-4 border-2 border-blue-600 border-t-transparent"></div> :
                                                    <RefreshCw size={18} />
                                                }
                                            />
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Filtros Expandidos */}
                        {showFilters && (
                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Período */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Período
                                        </label>
                                        <CustomInput
                                            type="select"
                                            value={selectedPeriodo}
                                            onChange={setSelectedPeriodo}
                                            options={periodoOptions}
                                        />
                                    </div>

                                    {/* Estado */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Estado
                                        </label>
                                        <CustomInput
                                            type="select"
                                            value={selectedEstado}
                                            onChange={setSelectedEstado}
                                            options={estadoOptions}
                                        />
                                    </div>

                                    {/* Atividade */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Atividade
                                        </label>
                                        <CustomInput
                                            type="select"
                                            value={selectedAtividade}
                                            onChange={setSelectedAtividade}
                                            options={actividadesOptions}
                                        />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Status Badge */}
                        <div className="mt-4 flex items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${
                                currentStatus === 'Controlado' ? 'bg-green-100 text-green-800 border-green-300' :
                                currentStatus === 'Detectado' ? 'bg-red-100 text-red-800 border-red-300' :
                                currentStatus === 'EmTratamento' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
                                'bg-gray-100 text-gray-800 border-gray-300'
                            }`}>
                                {currentStatus === 'Controlado' && <CheckCircle className="w-4 h-4 mr-1" />}
                                {currentStatus === 'Detectado' && <AlertCircle className="w-4 h-4 mr-1" />}
                                {currentStatus === 'EmTratamento' && <Clock className="w-4 h-4 mr-1" />}
                                {currentStatus === 'Controlado' ? 'Controlado' :
                                    currentStatus === 'Detectado' ? 'Detectado' :
                                        currentStatus === 'EmTratamento' ? 'Em Tratamento' : currentStatus || 'N/A'}
                            </span>
                            {isPragaAprovada(praga) && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                    <Award className="w-4 h-4 mr-1" />
                                    Praga Validada
                                </span>
                            )}
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
                    <div className="w-full bg-gray-200 h-2 mb-0" style={{ width: '100%' }}>
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
                            className={`px-6 py-2 rounded-lg border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
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
                            className={`px-6 py-2 rounded-lg flex items-center transition-all font-medium ${activeIndex === steps.length - 1 ? 'opacity-50 cursor-not-allowed bg-gray-300 text-gray-600' : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
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

export default VisualizarPraga;