import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { GiCow, GiPig } from "react-icons/gi";
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
    Tractor,
    FileText,
    AlertCircle,
    CheckCircle,
    Info,
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
    ChevronDown
} from 'lucide-react';

// Importações do React Leaflet
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
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

// Hook para buscar produtor por ID
const useProdutorById = (id) => {
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
                console.error('Erro ao buscar produtor:', err);
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProdutor();
    }, [id]);

    return { produtor, loading, error };
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
const mapApiDataToProdutor = (apiData) => {
    if (!apiData) return null;

    const getStatus = (item) => {
        if (item.estado) {
            const estado = item.estado.toLowerCase();
            switch (estado) {
                case 'conforme': return 'CONFORME';
                case 'irregularidade': return 'IRREGULARIDADE';
                default: return 'CONFORME';
            }
        }
        if (item.permissao === 'nao') return 'CONFORME';
        if (item._status === 'submitted_via_web') return 'CONFORME';
        return 'CONFORME';
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
        codigoRNPA: `RNPA${new Date(apiData.registration_date || '2025-01-01').getFullYear()}${apiData._id?.toString().slice(-3)}`,
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
        gravida: apiData.gravida === 'sim',
        possuiDeficiencia: apiData.possui_deficiencia === 'sim',
        tipoDeficiencia: apiData.tipo_deficiencia || '',

        // ECA/Organização
        e4FazesParteDeUmaCooper: apiData.e_4_Fazes_parte_de_uma_cooper || '',
        tipoOrganizacao: apiData.tipo_organizacao || '',
        especificarOrganizacao: apiData.especificar_organizacao || '',
        nomeECA: apiData.nome_eca || '',
        posicaoECA: apiData.posicao_eca || '',
        tipoECA: apiData.tipo_eca || '',

        // Agregado familiar
        chefeAgregado: apiData.chefe_familiar === 'sim' || true,
        nomeChefe: apiData.nome_chefe || '',
        nomeMeioChefe: apiData.nome_meio_chefe || '',
        sobrenomeChefe: apiData.sobrenome_chefe || '',
        sexoChefe: apiData.sexo_chefe === 'm' ? 'MASCULINO' : 'FEMININO',
        totalAgregado: parseInt(apiData.total_agregado) || 1,
        feminino0a6: parseInt(apiData.feminino_0_6) || 0,
        masculino0a6: parseInt(apiData.masculino_0_6) || 0,   
        feminino7a18: parseInt(apiData.feminino_7_18) || 0,
        masculino7a18: parseInt(apiData.masculino_7_18) || 0,
        feminino19a60: parseInt(apiData.feminino_19_60) || 0,
        masculino19a60: parseInt(apiData.masculino_19_60) || 0,
        feminino61mais: parseInt(apiData.feminino_61_mais) || 0,
        masculino61mais: parseInt(apiData.masculino_61_mais) || 0,

        // Atividades
        atividadesProdutor: apiData.atividades_produtor || '',
        acessoTerra: apiData.acesso_terra === 'sim',
        proprietarioTerra: apiData.e_proprietario === 'sim',
        tituloTerra: apiData.titulo_terra === 'sim',
        areaTotalCampos: parseFloat(apiData.area_total) || 0,
        areaExplorada: parseFloat(apiData.area_explorada) || 0,
        areaAgricola: parseFloat(apiData.area_agricola) || 0,
        areaPecuaria: parseFloat(apiData.area_pecuaria) || 0,
        areaFlorestal: parseFloat(apiData.area_florestal) || 0,
        producaoSacos: parseInt(apiData.producao_sacos) || 0,
        usoFertilizantes: apiData.uso_fertilizante === 'sim',
        acessoIrrigacao: apiData.acesso_irrigacao === 'sim',
        acessoRacao: apiData.acesso_racao === 'sim',
        conhecimentoDoencas: apiData.conhecimento_doencas === 'sim',
        creditoBeneficio: apiData.credito_beneficio === 'sim',

        // Culturas e produção
        culturasImportantes: apiData.culturas_importantes || '',
        outraCultura: apiData.outra_cultura || '',
        tipoSementeira: apiData.tipo_semanteira || '',
        preparacaoTerra: apiData.preparacao_terra || '',
        sistemaIrrigacao: apiData.sistema_irrigacao || '',
        tecnologiaAgricola: apiData.tecnologia_agricola || '',

        // Pecuária
        tiposCriacao: apiData.tipos_criacao || '',
        numeroAves: parseInt(apiData.numero_aves) || 0,
        numeroVacas: parseInt(apiData.numero_vacas) || 0,
        numeroCabras: parseInt(apiData.numero_cabras) || 0,
        numeroOvelhas: parseInt(apiData.numero_ovelhas) || 0,
        numeroPorcos: parseInt(apiData.numero_porcos) || 0,
        numeroPeixes: parseInt(apiData.numero_peixes) || 0,
        numeroCoelhos: parseInt(apiData.numero_coelhos) || 0,

        // Bens e apoio
        bensFamiliares: apiData.bens_familiares || '',
        tipoApoio: apiData.tipo_apoio || '',
        observacoesGerais: apiData.observacoes_gerais || '',

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
    const [produtor, setProdutor] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(true);
    const [toastMessage, setToastMessage] = useState(null);
    const [gerando, setGerando] = useState(false);
    const [alterandoStatus, setAlterandoStatus] = useState(false);
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
        { label: 'Inquiridor', icon: User },
        { label: 'Produtor', icon: User },
        { label: 'Áreas', icon: Trees },
        { label: 'Espécies', icon: Leaf },
        { label: 'Transportes', icon: Truck },
        { label: 'Produtos', icon: Package }
    ];

    // Hooks para buscar dados
    const { produtor: produtorAPI, loading: loadingAPI, error: errorAPI } = useProdutorById(id);
   // const { incentivos, loading: loadingIncentivos } = useIncentivosByProdutor(id);

    // Mapear dados da API
    const produtorMapeado = useMemo(() => {
        if (!produtorAPI) return null;
        return mapApiDataToProdutor(produtorAPI);
    }, [produtorAPI]);

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
        { label: 'Conforme', value: 'CONFORME' },
        { label: 'Irregular', value: 'Irregular' },
    ];

    const generoOptions = [
        { label: 'Masculino', value: 'MASCULINO' },
        { label: 'Feminino', value: 'FEMININO' }
    ];

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

    const isProdutorAprovado = (produtor) => {
        if (produtor?.estado) {
            return produtor.estado.toLowerCase() === 'aprovado';
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

    // Carregar dados quando disponíveis
    useEffect(() => {
        const loadProdutor = async () => {
            setLoading(loadingAPI);

            if (errorAPI) {
                setToastMessage({ type: 'error', message: `Erro ao carregar produtor: ${errorAPI}` });
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
                    setToastMessage({ type: 'error', message: 'Erro ao processar dados do produtor' });
                    setLoading(false);
                }
            } else if (!loadingAPI && !produtorMapeado) {
                setToastMessage({ type: 'error', message: 'Produtor não encontrado' });
                setLoading(false);
            }
        };

        loadProdutor();
    }, [produtorMapeado, loadingAPI, errorAPI]);

    // Carregar imagens
    useEffect(() => {
        const carregarImagens = async () => {
            try {
                // Carregar foto de perfil
                const respostaPerfil = await api.get(`/formulario/${parseInt(id)}/foto-beneficiary`, {
                    responseType: 'blob'
                });
                const urlPerfil = URL.createObjectURL(respostaPerfil.data);
                setImagemUrlPerfil(urlPerfil);

                // Carregar impressões digitais
                const respostaDigitais = await api.get(`/formulario/${parseInt(id)}/foto-biometrics`, {
                    responseType: 'blob'
                });
                const urlDigitais = URL.createObjectURL(respostaDigitais.data);
                setImagemUrlDigitais(urlDigitais);
            } catch (error) {
                console.error('Erro ao carregar imagens:', error);
            }
        };

        if (id) {
            carregarImagens();
        }
    }, [id]);

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
            'CONFORME': 'bg-blue-100 text-blue-800 border-blue-300',
            'IRREGULAR': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
    };

    // Funções para gerenciar áreas
    const addArea = () => {
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
    };

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

    // Funções para gerenciar espécies
    const addEspecie = () => {
        const newEspecie = {
            id: Math.random().toString(36).slice(2, 10),
            especie: [{ label: 'Baobá (Adansonia digitata)', value: 'baoba' }],
            status: { label: 'Nativa', value: 'nativa' }
        };
        setEspecies(prev => [...prev, newEspecie]);
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

    // Funções para gerenciar transportes
    const addTransporte = () => {
        const newTransporte = {
            licenseIndex: 0,
            origem_areaIndex: 0,
            destino: 'Benguela',
            placa: 'BG-12-34-CD',
            volume: '15',
            qr_hash: '',
            status: 'Em trânsito'
        };
        setTransportes(prev => [...prev, newTransporte]);
    };

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

    // Funções para gerenciar produtos
    const addProduto = () => {
        const newProduto = {
            especiesIds: [{ label: 'Baobá (Adansonia digitata)', value: 'baoba' }],
            volumeAnual: '75',
            origem_areaIndex: 0,
            destino: 'Exportação',
            rastreabilidade: '',
            documentosTransporte: null
        };
        setProdutos(prev => [...prev, newProduto]);
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
        if (!biValue || biValue.length < 9) {
            showToast('error', 'Digite um número de BI válido (mínimo 9 caracteres)');
            return;
        }

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

            if (response.status === 200 && response.data.code === 200 && response.data.data) {
                const biInfo = response.data.data;

                const dadosAtualizados = {
                    ...formData,
                    nome: biInfo.first_name || formData.nome,
                    sobrenomeProdutor: biInfo.last_name || formData.sobrenomeProdutor,
                    numeroBI: biValue,
                    dataNascimento: biInfo.birth_date ?
                        new Date(biInfo.birth_date).toISOString().split('T')[0] :
                        formData.dataNascimento,
                    genero: biInfo.gender_name?.toLowerCase().includes('masculino') ?
                        getSelectValue('MASCULINO', generoOptions) :
                        getSelectValue('FEMININO', generoOptions),
                };

                setFormData(dadosAtualizados);
                showToast('success', 'Dados do BI preenchidos automaticamente!');
                setShowBIValidation(false);
            } else {
                showToast('warn', response.data.message || 'BI não encontrado ou dados inválidos');
            }
        } catch (error) {
            console.error('Erro ao consultar BI:', error);
            showToast('error', 'Erro ao consultar BI. Tente novamente.');
        } finally {
            setConsultingBI(false);
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
                showToast('success', 'Foto de perfil atualizada com sucesso!');
                const url = URL.createObjectURL(file);
                setImagemUrlPerfil(url);
                setNovaFotoPerfil(null);
                setPreviewPerfil('');
            }
        } catch (error) {
            console.error('Erro ao fazer upload da foto de perfil:', error);
            showToast('error', 'Erro ao atualizar foto de perfil');
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
            if (!formData.nome) {
                showToast('error', 'Nome é obrigatório');
                return;
            }

            setLoading(true);
            const token = "91c163addd72730d6bfe7a2d80eac5129767a044";

            const dataToSend = prepareDataForAPI(formData);
            console.log('Enviando dados:', dataToSend);

            const response = await api.put(`/formulario/${id}`, dataToSend, {
                headers: {
                    'Authorization': `Token ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            console.log('Resposta da API:', response.data);
            showToast('success', 'Dados atualizados com sucesso!');
            setIsEditing(false);

        } catch (error) {
            console.error('Erro ao salvar:', error);
            showToast('error', 'Erro ao salvar dados. Tente novamente.');
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


        setAlterandoStatus(true);
        setShowStatusModal(false);

        try {
            const token = "91c163addd72730d6bfe7a2d80eac5129767a044";
            const resultado = await alterarEstadoProdutor(id, novoStatus, token);

            if (resultado.sucesso) {
                const updatedProdutor = { ...produtor, statusProcesso: novoStatus };
                const updatedFormData = { ...formData, statusProcesso: value };
                setProdutor(updatedProdutor);
                setFormData(updatedFormData);
                showToast('success', resultado.mensagem);
            } else {
                showToast('error', resultado.mensagem);
            }
        } catch (error) {
            console.error('Erro inesperado:', error);
            showToast('error', 'Erro inesperado ao alterar estado do produtor');
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
            setBiError('Por favor, digite o número do BI');
            return;
        }
        consultarBI(biValidation);
        setShowBIValidation(false);
        setBiError('');
    };

    const handleCancelEdit = () => {
        setShowCancelModal(true);
    };

    const confirmCancelEdit = () => {
        setIsEditing(false);
        const formattedData = {
            ...produtorMapeado,
            genero: getSelectValue(produtorMapeado.genero, generoOptions),
            provincia: getSelectValue(produtorMapeado.provincia, provinciasData.map(p => ({ label: p.nome, value: p.nome }))),
            statusProcesso: getSelectValue(produtorMapeado.statusProcesso, statusOptions),
            estadoCivil: getSelectValue(produtorMapeado.estadoCivil, estadoCivilOptions),
            nivelEscolaridade: getSelectValue(produtorMapeado.nivelEscolaridade, nivelEscolaridadeOptions)
        };
        setFormData(formattedData);
        showToast('info', 'Edição cancelada');
        setShowCancelModal(false);
    };

    const handleDownloadReport = async () => {
        if (!produtor) {
            showToast('error', 'Dados do produtor não encontrados');
            return;
        }

        setGerando(true);
        showToast('info', 'Gerando relatório do produtor...');

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
        const isAprovado = isProdutorAprovado(produtor);

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
            case 0: // Inquiridor
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <User className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Inquiridor</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre o inquiridor responsável pelo cadastro.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="text"
                                label="Código do Inquiridor"
                                value={formData.codigoInquiridor || 'INQ001'}
                                onChange={(value) => updateFormData('codigoInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<CreditCard size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome do Inquiridor"
                                value={formData.nomeInquiridor || 'João Silva'}
                                onChange={(value) => updateFormData('nomeInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome do Meio"
                                value={formData.nomeMeioInquiridor || 'Carlos'}
                                onChange={(value) => updateFormData('nomeMeioInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Sobrenome"
                                value={formData.sobrenomeInquiridor || 'Santos'}
                                onChange={(value) => updateFormData('sobrenomeInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="date"
                                label="Data de Registo"
                                value={formData.dataRegistro || '2025-01-15'}
                                onChange={(value) => updateFormData('dataRegistro', value)}
                                disabled={!isEditing}
                                iconStart={<Calendar size={18} />}
                            />
                        </div>
                    </div>
                );

            case 1: // Produtor
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <User className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Dados do Produtor Florestal</h3>
                            </div>
                            <p className="text-gray-600">
                                Identificação do responsável pela atividade florestal.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <CustomInput
                                type="select"
                                label="Tipo de Documento"
                                value={formData.tipoDocumento || { label: 'Bilhete de Identidade', value: 'BI' }}
                                options={tipoDocumentoOptions}
                                onChange={(value) => updateFormData('tipoDocumento', value)}
                                disabled={!isEditing}
                                placeholder="Selecione o tipo"
                                iconStart={<CreditCard size={18} />}
                            />

                            {formData.tipoDocumento?.value === 'OUTRO' && (
                                <CustomInput
                                    type="text"
                                    label="Nome do Documento"
                                    value={formData.nomeOutroDocumento}
                                    onChange={(value) => updateFormData('nomeOutroDocumento', value)}
                                    disabled={!isEditing}
                                    placeholder="Digite o nome do documento"
                                    iconStart={<FileText size={18} />}
                                />
                            )}

                            {formData.tipoDocumento?.value && formData.tipoDocumento?.value !== 'NAO_POSSUI' && (
                                <div className="relative">
                                    <CustomInput
                                        type="text"
                                        label="Número do Documento"
                                        value={formData.numeroBI || '004567890LA041'}
                                        onChange={(value) => updateFormData('numeroBI', value)}
                                        disabled={!isEditing}
                                        helperText={formData.tipoDocumento?.value === 'BI' ? 'Digite o BI para consulta automática dos dados' : ''}
                                        placeholder="Digite o número"
                                        iconStart={<CreditCard size={18} />}
                                    />
                                    {consultingBI && (
                                        <div className="absolute right-3 top-9 flex items-center">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                                            <span className="text-sm text-blue-600">Consultando...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <CustomInput
                                type="text"
                                label="Nome do Produtor"
                                value={formData.nomeProdutor || 'Maria'}
                                onChange={(value) => updateFormData('nomeProdutor', value)}
                                disabled={!isEditing}
                                placeholder="Digite o nome"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Sobrenome"
                                value={formData.sobrenomeProdutor || 'Fernandes'}
                                onChange={(value) => updateFormData('sobrenomeProdutor', value)}
                                disabled={!isEditing}
                                placeholder="Sobrenome"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Gênero"
                                value={formData.genero || { label: 'Feminino', value: 'FEMININO' }}
                                options={generoOptions}
                                onChange={(value) => updateFormData('genero', value)}
                                disabled={!isEditing}
                                placeholder="Selecione o gênero"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Lugar de Nascimento"
                                value={formData.lugarNascimento || { label: 'LUANDA', value: 'LUANDA' }}
                                options={provinciasData.map(provincia => ({
                                    label: provincia.nome,
                                    value: provincia.nome
                                }))}
                                onChange={(value) => updateFormData('lugarNascimento', value)}
                                disabled={!isEditing}
                                placeholder="Província de nascimento"
                                iconStart={<MapPin size={18} />}
                            />

                            <CustomInput
                                type="date"
                                label="Data de Nascimento"
                                value={formData.dataNascimento || '1985-03-15'}
                                onChange={(value) => updateFormData('dataNascimento', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="tel"
                                label="Telefone do Produtor"
                                value={formData.telefone || '923456789'}
                                onChange={(value) => updateFormData('telefone', value)}
                                disabled={!isEditing}
                                placeholder="Ex: 923456789"
                                iconStart={<User size={18} />}
                                maxLength={9}
                            />
                        </div>
                    </div>
                );

            case 2: // Áreas
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Trees className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Áreas Florestais</h3>
                            </div>
                            <p className="text-gray-600">
                                Cadastre as áreas florestais vinculadas ao produtor.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {areas.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhuma área cadastrada. Clique em "Adicionar Área" para começar.
                                </div>
                            )}

                            {areas.map((area, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                                    {isEditing && (
                                        <button
                                            onClick={() => removeArea(index)}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <CustomInput
                                            type="text"
                                            label="Nome da Área"
                                            value={area.nome}
                                            onChange={(value) => updateArea(index, 'nome', value)}
                                            disabled={!isEditing}
                                            iconStart={<Trees size={18} />}
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Tipo"
                                            value={area.tipo}
                                            options={tipoAreaOptions}
                                            onChange={(value) => updateArea(index, 'tipo', value)}
                                            disabled={!isEditing}
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Estado de Conservação"
                                            value={area.estadoConservacao}
                                            options={estadoConservacaoOptions}
                                            onChange={(value) => updateArea(index, 'estadoConservacao', value)}
                                            disabled={!isEditing}
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Província"
                                            value={area.provincia}
                                            options={provinciasData.map(provincia => ({
                                                label: provincia.nome,
                                                value: provincia.nome.toUpperCase()
                                            }))}
                                            onChange={(value) => updateArea(index, 'provincia', value)}
                                            disabled={!isEditing}
                                            iconStart={<MapPin size={18} />}
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Município"
                                            value={area.municipio}
                                            options={municipiosOptions}
                                            onChange={(value) => updateArea(index, 'municipio', value)}
                                            disabled={!isEditing || !area.provincia}
                                            iconStart={<Map size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Comuna/Distrito"
                                            value={area.comuna}
                                            onChange={(value) => updateArea(index, 'comuna', value)}
                                            disabled={!isEditing}
                                            iconStart={<Building size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Bairro/Aldeia"
                                            value={area.bairroAldeia}
                                            onChange={(value) => updateArea(index, 'bairroAldeia', value)}
                                            disabled={!isEditing}
                                            iconStart={<Home size={18} />}
                                        />
                                    </div>

                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h5 className="text-md font-semibold mb-4 flex items-center">
                                            <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                            Coordenadas GPS
                                        </h5>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                            <CustomInput
                                                type="number"
                                                label="Latitude"
                                                value={area.lat}
                                                onChange={(value) => updateArea(index, 'lat', value)}
                                                disabled={!isEditing}
                                                step="any"
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Longitude"
                                                value={area.lng}
                                                onChange={(value) => updateArea(index, 'lng', value)}
                                                disabled={!isEditing}
                                                step="any"
                                            />
                                        </div>
                                        {isEditing && (
                                            <>
                                                <ProducerMap
                                                    coordinates={{ lat: parseFloat(area.lat), lng: parseFloat(area.lng) }}
                                                    producerName={area.nome}
                                                />
                                                <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                                    <p className="text-sm text-blue-600 flex items-center">
                                                        <Info size={16} className="mr-2" />
                                                        Clique no mapa para selecionar uma localização automaticamente
                                                    </p>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}


                        </div>
                    </div>
                );

            case 3: // Espécies
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <Leaf className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Espécies Florestais</h3>
                            </div>
                            <p className="text-gray-600">
                                Catálogo de espécies florestais presentes nas áreas.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {especies.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhuma espécie cadastrada. Clique em "Adicionar Espécie" para começar.
                                </div>
                            )}

                            {especies.map((especie, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                                    {isEditing && (
                                        <button
                                            onClick={() => removeEspecie(index)}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <CustomInput
                                            type="multiselect"
                                            label="Espécie"
                                            value={especie.especie || []}
                                            options={especiesPredefinidas}
                                            onChange={(value) => updateEspecie(index, 'especie', value)}
                                            disabled={!isEditing}
                                            iconStart={<Leaf size={18} />}
                                        />

                                        <CustomInput
                                            type="select"
                                            label="Estado"
                                            value={especie.status}
                                            options={statusEspecieOptions}
                                            onChange={(value) => updateEspecie(index, 'status', value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            ))}


                        </div>


                    </div>
                );

            case 4: // Transportes
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Truck className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Transportes</h3>
                            </div>
                            <p className="text-gray-600">
                                Gestão de transportes de produtos florestais.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {transportes.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhum transporte cadastrado. Clique em "Adicionar Transporte" para começar.
                                </div>
                            )}

                            {transportes.map((transporte, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                                    {isEditing && (
                                        <button
                                            onClick={() => removeTransporte(index)}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <CustomInput
                                            type="text"
                                            label="Destino"
                                            value={transporte.destino}
                                            onChange={(value) => updateTransporte(index, 'destino', value)}
                                            disabled={!isEditing}
                                            iconStart={<MapPin size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Placa do Veículo"
                                            value={transporte.placa}
                                            onChange={(value) => updateTransporte(index, 'placa', value)}
                                            disabled={!isEditing}
                                            iconStart={<Truck size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Volume (m³)"
                                            value={transporte.volume}
                                            onChange={(value) => updateTransporte(index, 'volume', value)}
                                            disabled={!isEditing}
                                            iconStart={<Package size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Status"
                                            value={transporte.status}
                                            onChange={(value) => updateTransporte(index, 'status', value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            ))}


                        </div>

                    </div>
                );

            case 5: // Produtos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <Package className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Produtos Florestais</h3>
                            </div>
                            <p className="text-gray-600">
                                Gestão de produtos e produção florestal.
                            </p>
                        </div>

                        <div className="space-y-6">
                            {produtos.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
                                </div>
                            )}

                            {produtos.map((produto, index) => (
                                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                                    {isEditing && (
                                        <button
                                            onClick={() => removeProduto(index)}
                                            className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                                        >
                                            <X size={16} />
                                        </button>
                                    )}

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <CustomInput
                                            type="select"
                                            label="Espécies"
                                            value={produto.especiesIds}
                                            options={especiesPredefinidas}
                                            onChange={(value) => updateProduto(index, 'especiesIds', value)}
                                            disabled={!isEditing}
                                            iconStart={<Leaf size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Volume Anual (m³)"
                                            value={produto.volumeAnual}
                                            onChange={(value) => updateProduto(index, 'volumeAnual', value)}
                                            disabled={!isEditing}
                                            iconStart={<Package size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Destino"
                                            value={produto.destino}
                                            onChange={(value) => updateProduto(index, 'destino', value)}
                                            disabled={!isEditing}
                                            iconStart={<MapPin size={18} />}
                                        />

                                        <CustomInput
                                            type="text"
                                            label="Rastreabilidade"
                                            value={produto.rastreabilidade}
                                            onChange={(value) => updateProduto(index, 'rastreabilidade', value)}
                                            disabled={!isEditing}
                                        />
                                    </div>
                                </div>
                            ))}


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
                    <p className="mt-4 text-gray-600">Carregando dados do produtor...</p>
                </div>
            </div>
        );
    }

    // Produtor não encontrado
    if (!produtor) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">Produtor não encontrado</h1>
                    <p className="text-gray-600 mb-6">O produtor solicitado não foi encontrado no sistema.</p>
                    <button
                        onClick={() => navigate('/GerenciaRNPA/gestao-agricultores/produtores')}
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
                            Para editar os dados do produtor, digite o número do BI. Os dados pessoais serão preenchidos automaticamente.
                        </p>
                        <CustomInput
                            type="text"
                            label="Número do BI"
                            value={biValidation}
                            onChange={setBiValidation}
                            placeholder="Digite o número do BI"
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
                                    onClick={() => navigate('/GerenciaRNPA/gestao-florestal/produtoresFlorestais')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isEditing ? 'Editando Produtor Florestal' : 'Detalhes do Produtor Florestal'}
                                    </h1>
                                    <p className="text-gray-600">Código: {produtor.codigoRNPA}</p>
                                </div>

                                {/* Controles do Header */}
                                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                                    {/* Seletor de Província */}
                                    <div className="relative">
                                        <label className="block text-xs font-medium text-gray-700 mb-1">
                                            Filtrar por Província
                                        </label>
                                        <div className="relative">
                                            <CustomInput
                                                type="select"
                                                value={selectedProvince}
                                                onChange={setSelectedProvince}
                                                options={provincias}
                                                className="min-w-48"
                                            />
                                        </div>
                                    </div>
                                    {/* Filtros */}
                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="flex items-center mt-4 space-x-2 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors border rounded-lg"
                                    >
                                        <Filter className="h-4 w-4" />
                                        <span>Filtro Avançado</span>
                                        <ChevronDown className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`} />
                                    </button>
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
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(getSelectStringValue(formData.statusProcesso))}`}>
                                {getSelectStringValue(formData.statusProcesso) === 'CONFORME' && <Clock className="w-4 h-4 mr-1" />}
                                {getSelectStringValue(formData.statusProcesso) === 'IRREGULAR' && <CheckCircle className="w-4 h-4 mr-1" />}
                                {getSelectStringValue(formData.statusProcesso) === 'CONFORME' ? 'Conforme' :
                                    getSelectStringValue(formData.statusProcesso) === 'IRREGULAR' ? ' Irregular' :
                                        getSelectStringValue(formData.statusProcesso) === 'APROVADO' ? 'Aprovado' : 'Rejeitado'}
                            </span>
                            {isProdutorAprovado(produtor) && (
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-50 text-green-700 border border-green-200">
                                    <Award className="w-4 h-4 mr-1" />
                                    Produtor Validado
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