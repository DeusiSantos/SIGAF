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
    Package
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
import ProdutorCompletoRNPAPDF, { gerarFichaCompletaPDF } from './ProdutorCompletoRNPAPDF';

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
                const response = await api.get(`/incentivo/produtor/${idProdutor}/incentivos`);
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
                case 'aprovado': return 'APROVADO';
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
        numeroBI: apiData.confirmar_documento || 'N/A',
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
            'PROCESSO_RECEBIDO': 'Recebido',
            'PENDENTE': 'Pendente',
            'APROVADO': 'Aprovado',
            'REJEITADO': 'Rejeitado',
            'CANCELADO': 'Cancelado'
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

const VisualizarProdutor = () => {
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
    const [consultingBI, setConsultingBI] = useState(false);
    const [activeIndex, setActiveIndex] = useState(0);

    // Estados para uploads de imagem
    const [imagemUrlPerfil, setImagemUrlPerfil] = useState('');
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
    const [gerandoPDF, setGerandoPDF] = useState(false);


    // Steps do formulário
    const steps = [
        { label: 'Inquiridor', icon: User },
        { label: 'Localização', icon: MapPin },
        { label: 'Produtor', icon: User },
        { label: 'Agregado', icon: Users },
        { label: 'Actividades', icon: Tractor },
        { label: 'Pecuária', icon: GiCow },
        { label: 'Crédito & Bens', icon: DollarSign },
        { label: 'Documentos', icon: FileText },
        { label: 'Incentivos', icon: Package }
    ];

    // Hooks para buscar dados
    const { produtor: produtorAPI, loading: loadingAPI, error: errorAPI } = useProdutorById(id);
    const { incentivos, loading: loadingIncentivos } = useIncentivosByProdutor(id);

    // Mapear dados da API
    const produtorMapeado = useMemo(() => {
        if (!produtorAPI) return null;
        return mapApiDataToProdutor(produtorAPI);
    }, [produtorAPI]);

    // Opções para selects
    const statusOptions = [
        { label: 'Processo Recebido', value: 'PROCESSO_RECEBIDO' },
        { label: 'Pendente', value: 'PENDENTE' },
        { label: 'Aprovado', value: 'APROVADO' },
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
            'PROCESSO_RECEBIDO': 'bg-blue-100 text-blue-800 border-blue-300',
            'PENDENTE': 'bg-yellow-100 text-yellow-800 border-yellow-300',
            'APROVADO': 'bg-green-100 text-green-800 border-green-300',
            'CANCELADO': 'bg-gray-100 text-gray-800 border-gray-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800 border-gray-300';
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
            provincia: getSelectStringValue(formData.provincia),
            municipio: getSelectStringValue(formData.municipio) || '',
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

    const handleGerarPDFCompleto = async () => {
        setGerandoPDF(true);
        try {
            await gerarFichaCompletaPDF(id);
            showToast('success', 'Ficha completa com histórico de produção gerada com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar PDF completo:', error);
            showToast('error', `Erro ao gerar PDF: ${error.message}`);
        } finally {
            setGerandoPDF(false);
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
                        onClick={handleGerarPDFCompleto}
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
                                Produção
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
                                value={formData.codigoInquiridor}
                                onChange={(value) => updateFormData('codigoInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<CreditCard size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome do Inquiridor"
                                value={getPrimeiroNome(formData.nomeInquiridor)}
                                onChange={(value) => updateFormData('nomeInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome do Meio"
                                value={formData.nomeMeioInquiridor}
                                onChange={(value) => updateFormData('nomeMeioInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Sobrenome"
                                value={formData.sobrenomeInquiridor}
                                onChange={(value) => updateFormData('sobrenomeInquiridor', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="date"
                                label="Data de Registo"
                                value={formData.dataRegistro}
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
                                <h3 className="text-xl font-bold text-gray-800">Identificação Geográfica</h3>
                            </div>
                            <p className="text-gray-600">
                                Localização geográfica do produtor.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            <CustomInput
                                type="select"
                                label="Província"
                                value={formData.provincia}
                                options={provinciasData.map(provincia => ({
                                    label: provincia.nome,
                                    value: provincia.nome.toUpperCase()
                                }))}
                                onChange={handleProvinciaChange}
                                disabled={!isEditing}
                                iconStart={<MapPin size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Município"
                                value={formData.municipio}
                                options={municipiosOptions}
                                onChange={(value) => updateFormData('municipio', value)}
                                disabled={!isEditing || !formData.provincia}
                                iconStart={<Map size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Comuna/Distrito"
                                value={formData.comuna}
                                onChange={(value) => updateFormData('comuna', value)}
                                disabled={!isEditing}
                                iconStart={<Building size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Bairro/Aldeia"
                                value={formData.geoLevel4}
                                onChange={(value) => updateFormData('geoLevel4', value)}
                                disabled={!isEditing}
                                iconStart={<Home size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome da Secção"
                                value={formData.geoLevel5}
                                onChange={(value) => updateFormData('geoLevel5', value)}
                                disabled={!isEditing}
                                iconStart={<Building size={18} />}
                            />
                        </div>

                        {produtor && produtor.coordenadasGPS && (
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                    <MapPin className="w-5 h-5 mr-2 text-green-600" />
                                    Localização no Mapa
                                </h4>
                                <ProducerMap coordinates={produtor.coordenadasGPS} producerName={produtor.nome} />
                                <div className="mt-3 grid grid-cols-2 gap-4">
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-700">Latitude:</span>
                                        <span className="ml-2 text-gray-600">{produtor.coordenadasGPS.lat}°</span>
                                    </div>
                                    <div className="text-sm">
                                        <span className="font-medium text-gray-700">Longitude:</span>
                                        <span className="ml-2 text-gray-600">{produtor.coordenadasGPS.lng}°</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2: // Produtor
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Identificação do Produtor</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações pessoais do produtor agrícola.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CustomInput
                                type="text"
                                label="Nome do Produtor"
                                value={getPrimeiroNome(formData.nome)}
                                onChange={(value) => updateFormData('nome', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            {/* <CustomInput
    type="text"
    label="Nome do Meio"
    value={formData.nomeMeioProdutor}
    onChange={(value) => updateFormData('nomeMeioProdutor', value)}
    disabled={!isEditing}
    iconStart={<User size={18} />}
/> */}

                            <CustomInput
                                type="text"
                                label="Sobrenome"
                                value={
                                    isEditing
                                        ? `${formData.nomeMeioProdutor ? formData.nomeMeioProdutor + ' ' : ''}${formData.sobrenomeProdutor || ''}`.trim()
                                        : `${formData.nomeMeioProdutor ? formData.nomeMeioProdutor + ' ' : ''}${formData.sobrenomeProdutor || ''}`.trim()
                                }
                                onChange={(value) => {
                                    // Ao editar, separa nome do meio e sobrenome
                                    const partes = value.split(' ');
                                    const nomeMeio = partes.length > 1 ? partes.slice(0, -1).join(' ') : '';
                                    const sobrenome = partes.length > 0 ? partes[partes.length - 1] : '';
                                    updateFormData('nomeMeioProdutor', nomeMeio);
                                    updateFormData('sobrenomeProdutor', sobrenome);
                                }}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Gênero"
                                value={formData.genero}
                                options={generoOptions}
                                onChange={(value) => updateFormData('genero', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Número do BI"
                                value={formData.numeroBI}
                                onChange={(value) => updateFormData('numeroBI', value)}
                                disabled={!isEditing}
                                iconStart={<FileText size={18} />}
                            />

                            <CustomInput
                                type="tel"
                                label="Telefone"
                                value={formData.telefone}
                                onChange={(value) => updateFormData('telefone', value)}
                                disabled={!isEditing}
                                iconStart={<Phone size={18} />}
                            />

                            <CustomInput
                                type="date"
                                label="Data de Nascimento"
                                value={formData.dataNascimento}
                                onChange={(value) => updateFormData('dataNascimento', value)}
                                disabled={!isEditing}
                                iconStart={<Calendar size={18} />}
                                helperText={(() => {
                                    const ageObj = calculateAge(formData.dataNascimento);
                                    if (ageObj.age < 18) {
                                        return `Idade: ${ageObj.text} (idade mínima 18)`;
                                    }
                                    return `Idade: ${ageObj.text}`;
                                })()}
                            />

                            <CustomInput
                                type="text"
                                label="Lugar de Nascimento"
                                value={formData.lugarNascimento}
                                onChange={(value) => updateFormData('lugarNascimento', value)}
                                disabled={!isEditing}
                                iconStart={<MapPin size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Estado Civil"
                                value={formData.estadoCivil}
                                options={estadoCivilOptions}
                                onChange={(value) => updateFormData('estadoCivil', value)}
                                disabled={!isEditing}
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Nível de Escolaridade"
                                value={formData.nivelEscolaridade}
                                options={nivelEscolaridadeOptions}
                                onChange={(value) => updateFormData('nivelEscolaridade', value)}
                                disabled={!isEditing}
                                iconStart={<FileText size={18} />}
                            />

                            {getSelectStringValue(formData.genero) === 'FEMININO' && (
                                <CustomInput
                                    type="select"
                                    label="Está grávida?"
                                    value={formData.gravida}
                                    options={[
                                        { label: 'Sim', value: true },
                                        { label: 'Não', value: false }
                                    ]}
                                    onChange={(value) => updateFormData('gravida', value)}
                                    disabled={!isEditing}
                                    iconStart={<Baby size={18} />}
                                />
                            )}

                            <CustomInput
                                type="select"
                                label="Tem alguma deficiência?"
                                value={formData.possuiDeficiencia}
                                options={[
                                    { label: 'Sim', value: true },
                                    { label: 'Não', value: false }
                                ]}
                                onChange={(value) => updateFormData('possuiDeficiencia', value)}
                                disabled={!isEditing}
                                iconStart={<AlertCircle size={18} />}
                            />

                            {(formData.possuiDeficiencia === true || formData.possuiDeficiencia?.value === true) && (
                                <CustomInput
                                    type="text"
                                    label="Tipo de Deficiência"
                                    value={formData.tipoDeficiencia}
                                    onChange={(value) => updateFormData('tipoDeficiencia', value)}
                                    disabled={!isEditing}
                                    iconStart={<AlertCircle size={18} />}
                                />
                            )}

                            <CustomInput
                                type="text"
                                label="Nome da ECA"
                                value={formData.nomeECA}
                                onChange={(value) => updateFormData('nomeECA', value)}
                                disabled={!isEditing}
                                iconStart={<Building size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Tipo de Organização"
                                value={formData.tipoOrganizacao}
                                onChange={(value) => updateFormData('tipoOrganizacao', value)}
                                disabled={!isEditing}
                                iconStart={<Building size={18} />}
                            />
                        </div>
                    </div>
                );

            case 3: // Agregado Familiar
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <Users className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Composição do Agregado Familiar</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre a composição do agregado familiar.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Home className="w-5 h-5 mr-2 text-orange-600" />
                                    Informações Básicas
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="É chefe do agregado familiar?"
                                        value={formData.chefeAgregado}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('chefeAgregado', value)}
                                        disabled={!isEditing}
                                        iconStart={<Users size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Total de Membros"
                                        value={formData.totalAgregado}
                                        onChange={(value) => {
                                            const newTotal = parseInt(value) || 1;
                                            const currentDistribution = getDistribuicaoTotal(formData);

                                            if (newTotal < currentDistribution) {
                                                showToast('error', `Reduza a distribuição atual (${currentDistribution}) antes de diminuir o total de membros`);
                                                return;
                                            }

                                            updateFormData('totalAgregado', newTotal);
                                        }}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<Users size={18} />}
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <UserCheck className="w-5 h-5 mr-2 text-orange-600" />
                                    Distribuição por Idade e Sexo
                                </h4>



                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    {/* 0-6 anos */}
                                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                        <h5 className="font-semibold text-gray-700 mb-4 text-center flex items-center justify-center">
                                            <Baby className="w-5 h-5 mr-2 text-blue-600" />
                                            0-6 anos
                                        </h5>
                                        <div className="space-y-3">
                                            <CustomInput
                                                type="number"
                                                label="Feminino"
                                                value={formData.feminino0a6 || 0}
                                                onChange={handleChangeDual('feminino0a6')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('feminino0a6')}
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Masculino"
                                                value={formData.masculino0a6 || 0}
                                                onChange={handleChangeDual('masculino0a6')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('masculino0a6')}
                                            />
                                        </div>
                                    </div>

                                    {/* 7-18 anos */}
                                    <div className="bg-green-50 rounded-xl p-4 border border-green-200">
                                        <h5 className="font-semibold text-gray-700 mb-4 text-center flex items-center justify-center">
                                            <User className="w-5 h-5 mr-2 text-green-600" />
                                            7-18 anos
                                        </h5>
                                        <div className="space-y-3">
                                            <CustomInput
                                                type="number"
                                                label="Feminino"
                                                value={formData.feminino7a18 || 0}
                                                onChange={handleChangeDual('feminino7a18')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('feminino7a18')}
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Masculino"
                                                value={formData.masculino7a18 || 0}
                                                onChange={handleChangeDual('masculino7a18')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('masculino7a18')}
                                            />
                                        </div>
                                    </div>

                                    {/* 19-60 anos */}
                                    <div className="bg-purple-50 rounded-xl p-4 border border-purple-200">
                                        <h5 className="font-semibold text-gray-700 mb-4 text-center flex items-center justify-center">
                                            <UserCheck className="w-5 h-5 mr-2 text-purple-600" />
                                            19-60 anos
                                        </h5>
                                        <div className="space-y-3">
                                            <CustomInput
                                                type="number"
                                                label="Feminino"
                                                value={formData.feminino19a60 || 0}
                                                onChange={handleChangeDual('feminino19a60')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('feminino19a60')}
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Masculino"
                                                value={formData.masculino19a60 || 0}
                                                onChange={handleChangeDual('masculino19a60')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('masculino19a60')}
                                            />
                                        </div>
                                    </div>

                                    {/* 61+ anos */}
                                    <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                                        <h5 className="font-semibold text-gray-700 mb-4 text-center flex items-center justify-center">
                                            <User className="w-5 h-5 mr-2 text-gray-600" />
                                            61+ anos
                                        </h5>
                                        <div className="space-y-3">
                                            <CustomInput
                                                type="number"
                                                label="Feminino"
                                                value={formData.feminino61mais || 0}
                                                onChange={handleChangeDual('feminino61mais')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('feminino61mais')}
                                            />
                                            <CustomInput
                                                type="number"
                                                label="Masculino"
                                                value={formData.masculino61mais || 0}
                                                onChange={handleChangeDual('masculino61mais')}
                                                disabled={!isEditing}
                                                min="0"
                                                max={calculateMaxValue('masculino61mais')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Atividades
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Tractor className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Actividades e Activos Agrícolas</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre as actividades praticadas e recursos agrícolas.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Map className="w-5 h-5 mr-2 text-green-600" />
                                    Informações sobre Terras
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Tem acesso a terras cultiváveis?"
                                        value={formData.acessoTerra}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('acessoTerra', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="É proprietário da terra?"
                                        value={formData.proprietarioTerra}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('proprietarioTerra', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Possui título de concessão?"
                                        value={formData.tituloTerra}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('tituloTerra', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Área Total dos Campos (ha)"
                                        value={formData.areaTotalCampos}
                                        onChange={(value) => updateFormData('areaTotalCampos', parseFloat(value) || 0)}
                                        disabled={!isEditing}
                                        step="0.1"
                                        min="0"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Área Explorada (ha)"
                                        value={formData.areaExplorada}
                                        onChange={(value) => updateFormData('areaExplorada', parseFloat(value) || 0)}
                                        disabled={!isEditing}
                                        step="0.1"
                                        min="0"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Área Agrícola (ha)"
                                        value={formData.areaAgricola}
                                        onChange={(value) => updateFormData('areaAgricola', parseFloat(value) || 0)}
                                        disabled={!isEditing}
                                        step="0.1"
                                        min="0"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Área Pecuária (ha)"
                                        value={formData.areaPecuaria}
                                        onChange={(value) => updateFormData('areaPecuaria', parseFloat(value) || 0)}
                                        disabled={!isEditing}
                                        step="0.1"
                                        min="0"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Área Florestal (ha)"
                                        value={formData.areaFlorestal}
                                        onChange={(value) => updateFormData('areaFlorestal', parseFloat(value) || 0)}
                                        disabled={!isEditing}
                                        step="0.1"
                                        min="0"
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Produção (sacos 50kg)"
                                        value={formData.producaoSacos}
                                        onChange={(value) => updateFormData('producaoSacos', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                    />
                                </div>
                            </div>

                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Wheat className="w-5 h-5 mr-2 text-green-600" />
                                    Práticas Agrícolas
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Uso de Fertilizantes"
                                        value={formData.usoFertilizantes}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('usoFertilizantes', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Acesso à Irrigação"
                                        value={formData.acessoIrrigacao}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('acessoIrrigacao', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="multiselect"
                                        label="Culturas Principais"
                                        value={formData.culturasPrincipais || []}
                                        options={[
                                            { label: 'Milho', value: 'MILHO' },
                                            { label: 'Mandioca', value: 'MANDIOCA' },
                                            { label: 'Amendoim/ginguba', value: 'AMENDOIM' },
                                            { label: 'Feijões', value: 'FEIJOES' },
                                            { label: 'Batata-doce', value: 'BATATA_DOCE' },
                                            { label: 'Banana', value: 'BANANA' },
                                            { label: 'Massambala', value: 'MASSAMBALA' },
                                            { label: 'Massango', value: 'MASSANGO' },
                                            { label: 'Café', value: 'CAFE' },
                                            { label: 'Cebola', value: 'CEBOLA' },
                                            { label: 'Tomate', value: 'TOMATE' },
                                            { label: 'Couve', value: 'COUVE' },
                                            { label: 'Batata rena', value: 'BATATA_RENA' },
                                            { label: 'Trigo', value: 'TRIGO' },
                                            { label: 'Arroz', value: 'ARROZ' },
                                            { label: 'Soja', value: 'SOJA' },
                                            { label: 'Outro', value: 'OUTRO' }
                                        ]}
                                        onChange={(value) => updateFormData('culturasPrincipais', value)}
                                        disabled={!isEditing}
                                        iconStart={<Wheat size={18} />}
                                    />
                                    {formData.culturasPrincipais && formData.culturasPrincipais.includes('OUTRO') && (
                                        <div className="mt-4">
                                            <CustomInput
                                                type="text"
                                                label="Especificar Outra Cultura"
                                                value={formData.outraCultura}
                                                onChange={(value) => updateFormData('outraCultura', value)}
                                                placeholder="Digite o nome da cultura"
                                                iconStart={<Wheat size={18} />}
                                                disabled={!isEditing}
                                            />
                                        </div>
                                    )}

                                    <CustomInput
                                        type="select"
                                        label="Tipo de Sementeira"
                                        value={formData.tipoSementeira}
                                        options={[
                                            { label: 'Mecanizada', value: 'MECANIZADA' },
                                            { label: 'Manual', value: 'MANUAL' },
                                            { label: 'Tração animal', value: 'TRACAO_ANIMAL' },
                                            { label: 'Nenhuma', value: 'NENHUMA' }
                                        ]}
                                        onChange={(value) => updateFormData('tipoSementeira', value)}
                                        disabled={!isEditing}
                                        iconStart={<Wheat size={18} />}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Preparação da Terra"
                                        value={formData.preparacaoTerra}
                                        options={[
                                            { label: 'Animal', value: 'ANIMAL' },
                                            { label: 'Manual', value: 'MANUAL' },
                                            { label: 'Mecanizada', value: 'MECANIZADA' },
                                            { label: 'Nenhuma', value: 'NENHUMA' }
                                        ]}
                                        onChange={(value) => updateFormData('preparacaoTerra', value)}
                                        disabled={!isEditing}
                                        iconStart={<Tractor size={18} />}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Tecnologia Agrícola"
                                        value={formData.tecnologiaAgricola}
                                        options={[
                                            { label: 'Subsistência', value: 'SUBSISTENCIA' },
                                            { label: 'Comercial', value: 'COMERCIAL' },
                                            { label: 'Misto', value: 'MISTO' }
                                        ]}
                                        onChange={(value) => updateFormData('tecnologiaAgricola', value)}
                                        disabled={!isEditing}
                                        iconStart={<Tractor size={18} />}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 5: // Pecuária
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-emerald-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-emerald-100 rounded-lg">
                                    <GiCow className="w-6 h-6 text-emerald-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Actividades Pecuárias</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre criação de animais e actividades de pecuária.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                                    <Fish className="w-5 h-5 mr-2 text-emerald-600" />
                                    Criação de Animais
                                </h4>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                    <CustomInput
                                        type="number"
                                        label="Número de Aves"
                                        value={formData.numeroAves}
                                        onChange={(value) => updateFormData('numeroAves', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<Bird size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Vacas"
                                        value={formData.numeroVacas}
                                        onChange={(value) => updateFormData('numeroVacas', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<GiCow size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Cabras"
                                        value={formData.numeroCabras}
                                        onChange={(value) => updateFormData('numeroCabras', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<GiCow size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Ovelhas"
                                        value={formData.numeroOvelhas}
                                        onChange={(value) => updateFormData('numeroOvelhas', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<GiCow size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Porcos"
                                        value={formData.numeroPorcos}
                                        onChange={(value) => updateFormData('numeroPorcos', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<GiPig size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Peixes"
                                        value={formData.numeroPeixes}
                                        onChange={(value) => updateFormData('numeroPeixes', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<Fish size={18} />}
                                    />

                                    <CustomInput
                                        type="number"
                                        label="Número de Coelhos"
                                        value={formData.numeroCoelhos}
                                        onChange={(value) => updateFormData('numeroCoelhos', parseInt(value) || 0)}
                                        disabled={!isEditing}
                                        min="0"
                                        iconStart={<Rabbit size={18} />}
                                    />

                                    <CustomInput
                                        type="text"
                                        label="Tipos de Criação"
                                        value={formData.tiposCriacao}
                                        onChange={(value) => updateFormData('tiposCriacao', value)}
                                        disabled={!isEditing}
                                        iconStart={<GiCow size={18} />}
                                    />
                                </div>
                            </div>

                            <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                                <h5 className="text-lg font-semibold text-green-800 mb-6 flex items-center">
                                    <Trees className="w-5 h-5 mr-2" />
                                    Aspectos Gerais da Pecuária
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Acesso à Ração Animal"
                                        value={formData.acessoRacao}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('acessoRacao', value)}
                                        disabled={!isEditing}
                                    />

                                    <CustomInput
                                        type="select"
                                        label="Conhecimento sobre Doenças Animais"
                                        value={formData.conhecimentoDoencas}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('conhecimentoDoencas', value)}
                                        disabled={!isEditing}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 6: // Crédito & Bens
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border border-yellow-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-yellow-100 rounded-lg">
                                    <DollarSign className="w-6 h-6 text-yellow-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Crédito e Bens Patrimoniais</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre acesso a crédito e bens do agregado familiar.
                            </p>
                        </div>

                        <div className="space-y-8">
                            <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                <h5 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                                    <DollarSign className="w-5 h-5 mr-2" />
                                    Acesso a Crédito
                                </h5>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <CustomInput
                                        type="select"
                                        label="Já foi beneficiado com algum crédito?"
                                        value={formData.creditoBeneficio}
                                        options={[
                                            { label: 'Sim', value: true },
                                            { label: 'Não', value: false }
                                        ]}
                                        onChange={(value) => updateFormData('creditoBeneficio', value)}
                                        disabled={!isEditing}
                                        iconStart={<DollarSign size={18} />}
                                    />
                                </div>
                            </div>

                            <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                                <h5 className="text-lg font-semibold text-purple-800 mb-6 flex items-center">
                                    <Home className="w-5 h-5 mr-2" />
                                    Bens do Agregado Familiar
                                </h5>
                                <div className="space-y-4">
                                    <CustomInput
                                        type="text"
                                        label="Bens Familiares"
                                        value={formData.bensFamiliares}
                                        onChange={(value) => updateFormData('bensFamiliares', value)}
                                        disabled={!isEditing}
                                        placeholder="Ex: carro, rádio, TV..."
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Tipo de apoio desejado"
                                        value={formData.tipoApoio}
                                        onChange={(value) => updateFormData('tipoApoio', value)}
                                        disabled={!isEditing}
                                        placeholder="Descreva o tipo de apoio desejado..."
                                        rows={3}
                                    />

                                    <CustomInput
                                        type="textarea"
                                        label="Observações Gerais"
                                        value={formData.observacoesGerais}
                                        onChange={(value) => updateFormData('observacoesGerais', value)}
                                        disabled={!isEditing}
                                        placeholder="Observações adicionais..."
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 7: // Documentos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-indigo-100 rounded-lg">
                                    <FileText className="w-6 h-6 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Documentos</h3>
                            </div>
                            <p className="text-gray-600">
                                Visualização e upload de documentos do produtor.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Foto de Perfil */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Foto de Perfil</h3>
                                {imagemUrlPerfil ? (
                                    <img
                                        src={previewPerfil || imagemUrlPerfil}
                                        alt="Foto de Perfil"
                                        className="w-full h-auto rounded-lg max-h-96 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <Camera className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}

                                {isEditing && (
                                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors mt-2 inline-block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFotoPerfilChange}
                                            className="hidden"
                                        />
                                        Alterar Foto
                                    </label>
                                )}

                                {isEditing && novaFotoPerfil && (
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => uploadFotoPerfil(novaFotoPerfil)}
                                            disabled={uploadingPerfil}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:bg-green-300"
                                        >
                                            {uploadingPerfil ? 'Enviando...' : 'Confirmar Upload'}
                                        </button>
                                        <button
                                            onClick={cancelarFotoPerfil}
                                            disabled={uploadingPerfil}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* Impressões Digitais */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-sm font-medium text-gray-700 mb-2">Impressões Digitais</h3>
                                {imagemUrlDigitais ? (
                                    <img
                                        src={previewDigitais || imagemUrlDigitais}
                                        alt="Impressões Digitais"
                                        className="w-full h-auto rounded-lg max-h-96 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 bg-gray-200 rounded-lg flex items-center justify-center">
                                        <FileText className="w-12 h-12 text-gray-400" />
                                    </div>
                                )}

                                {isEditing && (
                                    <label className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded text-sm transition-colors mt-2 inline-block">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleFotoDigitaisChange}
                                            className="hidden"
                                        />
                                        Alterar Foto
                                    </label>
                                )}

                                {isEditing && novaFotoDigitais && (
                                    <div className="flex gap-2 mt-3">
                                        <button
                                            onClick={() => uploadFotoDigitais(novaFotoDigitais)}
                                            disabled={uploadingDigitais}
                                            className="flex-1 bg-green-500 hover:bg-green-600 text-white px-3 py-2 rounded text-sm transition-colors disabled:bg-green-300"
                                        >
                                            {uploadingDigitais ? 'Enviando...' : 'Confirmar Upload'}
                                        </button>
                                        <button
                                            onClick={cancelarFotoDigitais}
                                            disabled={uploadingDigitais}
                                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white px-3 py-2 rounded text-sm transition-colors"
                                        >
                                            Cancelar
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                );

            case 8: // Incentivos
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-teal-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-teal-100 rounded-lg">
                                    <Package className="w-6 h-6 text-teal-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Incentivos do Produtor</h3>
                            </div>
                            <p className="text-gray-600">
                                Lista de todos os incentivos recebidos ou em processo pelo produtor.
                            </p>
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h4 className="text-lg font-semibold text-gray-800 flex items-center">
                                    <Package className="w-5 h-5 mr-2 text-teal-600" />
                                    Lista de Incentivos
                                </h4>
                                {incentivos && incentivos.length > 0 && (
                                    <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-medium">
                                        {incentivos.length} incentivo{incentivos.length !== 1 ? 's' : ''}
                                    </span>
                                )}
                            </div>

                            <TabelaIncentivos incentivos={incentivos} loading={loadingIncentivos} />
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
                                    onClick={() => navigate('/GerenciaRNPA/gestao-agricultores/produtores')}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                >
                                    <ArrowLeft className="w-5 h-5 text-gray-600" />
                                </button>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        {isEditing ? 'Editando Produtor' : 'Detalhes do Produtor'}
                                    </h1>
                                    <p className="text-gray-600">Código: {produtor.codigoRNPA}</p>
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

                        {/* Status Badge */}
                        <div className="mt-4 flex items-center gap-4">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(getSelectStringValue(formData.statusProcesso))}`}>
                                {getSelectStringValue(formData.statusProcesso) === 'PENDENTE' && <Clock className="w-4 h-4 mr-1" />}
                                {getSelectStringValue(formData.statusProcesso) === 'APROVADO' && <CheckCircle className="w-4 h-4 mr-1" />}
                                {getSelectStringValue(formData.statusProcesso) === 'PROCESSO_RECEBIDO' ? 'Processo Recebido' :
                                    getSelectStringValue(formData.statusProcesso) === 'PENDENTE' ? 'Pendente' :
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

export default VisualizarProdutor;