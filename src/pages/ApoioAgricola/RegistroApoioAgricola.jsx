import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {
    Server,
    UserCog,
    MapPin,
    Home,
    Factory,
    User,
    Users,
    Tractor,
    FileText,
    Check,
    ChevronRight,
    ChevronLeft,
    Calendar,
    Map,
    Building,
    Camera,
    AlertCircle,
    CheckCircle,
    Info,
    Loader,
    CreditCard,
    Phone,
    Trees,
    Wheat,
    Fish,
    IdCard,
    DollarSign,
    Baby,
    UserCheck,
    Car,
    Bike,
    Radio,
    Tv,
    Smartphone,
    Sun,
    Zap,
    Beef,
    Egg,
    Milk,
    Calendar1
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
import provinciasData from '../../components/Provincias.json'; // Supondo que você tenha um arquivo JSON com os dados das províncias
import ScrollToTop from '../../components/ScrollToTop';
import { GiCow } from 'react-icons/gi';
//import api from '../services/api';

// Dados simulados
const inquiridoresData = [
    { codigo: 'INQ001', nomeCompleto: 'João Manuel Santos', nomeDoMeio: 'Manuel', sobrenome: 'Santos' },
    { codigo: 'INQ002', nomeCompleto: 'Maria Teresa Silva', nomeDoMeio: 'Teresa', sobrenome: 'Silva' },
    { codigo: 'INQ003', nomeCompleto: 'António Carlos Ferreira', nomeDoMeio: 'Carlos', sobrenome: 'Ferreira' }
];

// Configuração do ícone do Leaflet
const defaultIcon = L.icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});

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
                    <Marker position={center} icon={defaultIcon}>
                        <Popup>
                            <div className="text-center">
                                <strong>Localização do Produtor</strong><br />
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

const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return 0;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
    }
    return age;
};

const RegistroApoioAgricola = () => {
    const [activeIndex, setActiveIndex] = useState(0);
    const [loading, setLoading] = useState(false);
    const [municipiosOptions, setMunicipiosOptions] = useState([]);
    const [errors, setErrors] = useState({});
    const [uploadedFiles, setUploadedFiles] = useState({});
    const [toastMessage, setToastMessage] = useState(null);
    const [consultingBI, setConsultingBI] = useState(false);
    const [biData, setBiData] = useState(null);
    const [consultingNif, setConsultingNif] = useState(false);
    const [nifData, setNifData] = useState(null);

    // Estado inicial simplificado
    const initialState = {
        // Seção A: Identificação do Inquiridor
        codigoInquiridor: '',
        nomeInquiridor: '',
        nomeDoMeioInquiridor: '',
        sobrenomeInquiridor: '',
        dataRegisto: new Date().toISOString().split('T')[0],

        // Seção B: Identificação Geográfica
        provincia: '',
        municipio: '',
        comuna: '',
        bairroAldeia: '',
        nomeSecao: '',
        localResidencia: '',
        latitudeGPS: '',
        longitudeGPS: '',
        altitudeGPS: '',
        precisaoGPS: '',

        // Seção C: Identificação da Infraestrutura
        nomeInfraestrutura: '',
        tipoInfraestrutura: '',
        numeroBI: '',
        numeroNIF: '',

        // Entidade Responsável
        proprietario_instituicao: '',
        contacto: '',
        email: '',

        // Características Técnicas
        dimensao: '',
        capacidade: '',
        estado_conservacao: '',

        // Utilização
        beneficiarios_directos: '',
        principais_culturas_actividades: [],
        frequencia_utilizacao: '',
        observacoes_gerais: '',

        // Seção D: Identificação do Produtor
        nomeProdutor: '',
        nomeDoMeioProdutor: '',
        sobrenomeProdutor: '',
        nomeECA: '',
        posicaoECA: '',
        tipoOrganizacao: '',
        tipoECA: '',
        outroTipoOrganizacao: '',
        sexoProdutor: '',
        tipoDocumento: '',
        nomeOutroDocumento: '', // Novo campo para especificar nome do documento
        outroTipoDocumento: '',
        numeroDocumento: '',
        confirmarNumeroDocumento: '',
        telefoneProdutor: '',
        confirmarTelefoneProdutor: '',
        telefonePropriedade: true,
        proprietarioTelefone: '',
        dataNascimento: '',
        lugarNascimento: '',
        estadoCivil: '',
        nivelEscolaridade: '',
        outroNivelEscolaridade: '',
        gravidez: false,
        deficiencia: false,
        tipoDeficiencia: '',
        outraDeficiencia: '',

        // Seção D: Composição do Agregado Familiar
        chefeAgregado: true,
        nomeChefeAgregado: '',
        nomeDoMeioChefe: '',
        sobrenomeChefe: '',
        sexoChefe: '',
        relacaoChefe: '',
        totalMembros: 1,
        femininoIdade0a6: 0,
        masculinoIdade0a6: 0,
        femininoIdade7a18: 0,
        masculinoIdade7a18: 0,
        femininoIdade19a60: 0,
        masculinoIdade19a60: 0,
        femininoIdade61mais: 0,
        masculinoIdade61mais: 0,

        // Seção E: Ativos e Atividades
        tiposAtividades: [
            { label: 'Agricultura', value: 'AGRICULTURA' },
        ],
        outroTipoAtividade: '',
        acessoTerras: false,
        proprietarioTerra: false,
        tituloConcessao: false,
        tipoTitulo: '',
        areaTotalCampos: 0,
        areaExplorada: 0,
        areaAgricola: 0,
        areaPecuaria: 0,
        areaFlorestal: 0,
        tecnologiaAgricola: '',
        culturasPrincipais: [
        ],
        outraCultura: '',
        producaoSacos50kg: 0,
        tipoSementeira: '',
        usoFertilizantes: false,
        preparacaoTerra: '',
        acessoIrrigacao: false,
        sistemaIrrigacao: '',
        outroSistemaIrrigacao: '',
        distanciaFonteAgua: 0,
        amanhosCulturais: false,
        tipoAmanhos: [

        ],
        outroTipoAmanho: '',
        acessoInstrumentos: false,
        fonteInstrumentos: [

        ],
        outraFonteInstrumento: '',

        // Seção F: Pecuária
        tiposCriacao: [],
        outroTipoCriacao: '',
        sistemaAvicultura: '',
        objetivoAvicultura: '',
        outroObjetivoAvicultura: '',
        numeroAves: 0,
        sistemaBovinocultura: '',
        tipoBovinocultura: '',
        numeroVacas: 0,
        numeroCabras: 0,
        numeroOvelhas: 0,
        objetivoBovinos: '',
        outroObjetivoBovinos: '',
        numeroPorcos: 0,
        objetivoSuinos: '',
        outroObjetivoSuinos: '',
        tipoPiscicultura: '',
        objetivoPiscicultura: '',
        outroObjetivoPiscicultura: '',
        numeroPeixes: 0,
        numeroCoelhos: 0,
        objetivoCoelhos: '',
        outroObjetivoCoelhos: '',
        acessoRacao: false,
        conhecimentoDoencas: false,

        // Seção G: Crédito & Bens
        beneficiadoCredito: false,
        fontesCredito: [

        ],
        outraFonteCredito: '',
        bensPatrimonio: [

        ],
        outroBemPatrimonio: '',

        // Seção H: Pacotes de Assistência
        tipoApoio: '',
        observacoesGerais: '',
        tipoPacote: '',
        outroTipoPacote: '',

        //Pecuaria
        sistemaOvinocultura: '',
        tipoOvinocultura: '',
        objetivoOvinos: '',
        outroObjetivoOvinos: '',

        sistemaCaprinocultura: '',
        tipoCaprinocultura: '',
        objetivoCaprinos: '',
        outroObjetivoCaprinos: '',

        idiomasFalados: [
            { label: 'Português', value: 'PORTUGUES' },
        ],
    };

    const [formData, setFormData] = useState(initialState);

    const steps = [
        { label: 'Inquiridor', icon: User },        // pessoa que pergunta / solicitante
        { label: 'Infrastrutura', icon: Server },   // parte técnica / infraestrutura
        { label: 'Responsável', icon: UserCog },    // pessoa responsável
        { label: 'Localização', icon: MapPin },     // localização geográfica
        { label: 'Características', icon: Home },   // detalhes do bem / imóvel
        { label: 'Utilização', icon: Factory },     // uso final, atividades produtivas
    ];

    const showToast = (severity, summary, detail, duration = 3000) => {
        setToastMessage({ severity, summary, detail, visible: true });
        setTimeout(() => setToastMessage(null), duration);
    };


    // Função para consultar NIF na API
    const consultarNIF = async (nifValue) => {
        console.log('🚀 FUNÇÃO CONSULTAR NIF CHAMADA!');
        console.log('📝 Valor do NIF recebido:', nifValue);
        console.log('📏 Comprimento do NIF:', nifValue?.length);

        if (!nifValue || nifValue.length < 9) {
            console.log('❌ NIF inválido ou muito curto, saindo da função');
            return;
        }

        console.log('🔍 Consultando NIF:', nifValue);
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

            console.log('📊 Resposta NIF:', response);
            console.log('📋 Dados NIF:', response.data);

            const data = response.data;
            if (response.status === 200 && data.code === 200 && data.data) {
                const nifInfo = data.data;
                console.log('✅ Dados NIF processados:', nifInfo);
                setNifData(nifInfo);

                setFormData(prev => ({
                    ...prev,
                    proprietario_instituicao: nifInfo.nome_contribuinte || '',
                    email: nifInfo.email || '',
                    contacto: nifInfo.numero_contacto || '',
                    numeroNIF: nifValue,
                }));

                showToast('success', 'NIF Consultado', 'Dados da entidade responsável preenchidos automaticamente!');
            } else {
                console.log('⚠️ NIF não encontrado:', data);
                setNifData(null);
                if (data.code === 404) {
                    showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF. Preencha manualmente.');
                } else {
                    showToast('warn', 'NIF inválido', 'Este NIF não retornou dados válidos. Verifique o número.');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao consultar NIF:', error);
            setNifData(null);
            if (error.response) {
                console.error('🚫 Erro de resposta NIF:', error.response.status, error.response.data);
                showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
            } else if (error.request) {
                console.error('🌐 Erro de rede NIF:', error.request);
                showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                console.error('⚙️ Erro na configuração NIF:', error.message);
                showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
            }
        } finally {
            setConsultingNif(false);
        }
    };

    // Função para consultar BI na API
    const consultarBI = async (biValue) => {
        if (!biValue || biValue.length < 9) return;

        setConsultingBI(true);

        try {
            const username = 'minagrif';
            const password = 'Nz#$20!23Mg';

            // Codificar credenciais em base64 para Basic Auth
            const credentials = btoa(`${username}:${password}`);

            const response = await axios.get(`https://api.gov.ao/bi/v1/getBI`, {
                params: {
                    bi: biValue
                },
                headers: {
                    'Authorization': `Basic ${credentials}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log('📊 Resposta completa da API BI:', response);
            console.log('📋 Dados retornados da API BI:', response.data);
            console.log('🔍 Status da resposta:', response.status);

            const data = response.data;

            // Função consultarBI - correção do mapeamento
            // Função consultarBI - correção do mapeamento
            // Função consultarBI - correção do mapeamento incluindo lugar de nascimento
            if (response.status === 200 && data.code === 200 && data.data) {
                const biInfo = data.data;

                console.log('✅ Dados do BI processados:', biInfo);
                setBiData(biInfo);

                // Mapear sexo para os valores do formulário
                let sexoMapeado = '';
                if (biInfo.gender_name) {
                    const sexo = biInfo.gender_name.toLowerCase();
                    if (sexo.includes('masculino') || sexo.includes('male') || sexo.includes('m')) {
                        sexoMapeado = 'MASCULINO';
                    } else if (sexo.includes('feminino') || sexo.includes('female') || sexo.includes('f')) {
                        sexoMapeado = 'FEMININO';
                    }
                }

                // Mapear estado civil para os valores do formulário
                let estadoCivilMapeado = '';
                if (biInfo.marital_status_name) {
                    const estadoCivil = biInfo.marital_status_name.toLowerCase();
                    if (estadoCivil.includes('solteiro')) {
                        estadoCivilMapeado = 'SOLTEIRO';
                    } else if (estadoCivil.includes('casado')) {
                        estadoCivilMapeado = 'CASADO';
                    } else if (estadoCivil.includes('divorciado')) {
                        estadoCivilMapeado = 'DIVORCIADO';
                    } else if (estadoCivil.includes('viúvo')) {
                        estadoCivilMapeado = 'VIUVO';
                    } else if (estadoCivil.includes('união')) {
                        estadoCivilMapeado = 'UNIAO_FACTO';
                    } else if (estadoCivil.includes('separado')) {
                        estadoCivilMapeado = 'SEPARADO';
                    }
                }

                // Mapear lugar de nascimento (província) para o formato correto
                let lugarNascimentoMapeado = '';
                if (biInfo.birth_province_name) {
                    // Buscar a província correspondente no JSON de províncias
                    const provinciaEncontrada = provinciasData.find(provincia => {
                        const nomeProvinciaAPI = biInfo.birth_province_name.toLowerCase().trim();
                        const nomeProvinciaJSON = provincia.nome.toLowerCase().trim();

                        // Verificar correspondência exata ou parcial
                        return nomeProvinciaJSON.includes(nomeProvinciaAPI) ||
                            nomeProvinciaAPI.includes(nomeProvinciaJSON) ||
                            nomeProvinciaJSON === nomeProvinciaAPI;
                    });

                    if (provinciaEncontrada) {
                        lugarNascimentoMapeado = {
                            label: provinciaEncontrada.nome,
                            value: provinciaEncontrada.nome
                        };
                    } else {
                        // Se não encontrou correspondência exata, usar o valor da API mesmo assim
                        lugarNascimentoMapeado = {
                            label: biInfo.birth_province_name,
                            value: biInfo.birth_province_name
                        };
                    }
                }

                // Preencher automaticamente os campos da entidade responsável
                setFormData(prev => ({
                    ...prev,
                    proprietario_instituicao: `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim(),
                    contacto: '', // BI não tem contacto
                    email: '', // BI não tem email
                    numeroBI: biValue,
                }));

                showToast('success', 'BI/NIF Consultado', 'Dados da entidade responsável preenchidos automaticamente!');
            }
            else {
                console.log('⚠️ BI não encontrado ou resposta inválida:', data);
                setBiData(null);
                if (data.code === 404) {
                    showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI. Preencha manualmente.');
                } else {
                    showToast('warn', 'BI inválido', 'Este BI não retornou dados válidos. Verifique o número.');
                }
            }
        } catch (error) {
            console.error('❌ Erro ao consultar BI:', error);
            console.error('📄 Detalhes do erro:', {
                message: error.message,
                status: error.response?.status,
                data: error.response?.data,
                headers: error.response?.headers
            });

            setBiData(null);

            if (error.response) {
                console.error('🚫 Erro de resposta do servidor:', error.response.status, error.response.data);
                showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do BI'}`);
            } else if (error.request) {
                console.error('🌐 Erro de rede - sem resposta:', error.request);
                showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                console.error('⚙️ Erro na configuração:', error.message);
                showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Tente novamente.');
            }
        } finally {
            setConsultingBI(false);
        }
    };

    // Debounce para consulta do BI/NIF
    const debounceTimer = React.useRef(null);



    // Calcular total de membros distribuídos
    const getTotalMembrosDistribuidos = () => {
        return (formData.femininoIdade0a6 || 0) +
            (formData.masculinoIdade0a6 || 0) +
            (formData.femininoIdade7a18 || 0) +
            (formData.masculinoIdade7a18 || 0) +
            (formData.femininoIdade19a60 || 0) +
            (formData.masculinoIdade19a60 || 0) +
            (formData.femininoIdade61mais || 0) +
            (formData.masculinoIdade61mais || 0);
    };

    const handleInputChange = (field, value) => {
        // Lógica especial para código do inquiridor
        if (field === 'codigoInquiridor') {
            const inquiridor = inquiridoresData.find(inq => inq.codigo === (value?.value || value));
            if (inquiridor) {
                setFormData(prev => ({
                    ...prev,
                    codigoInquiridor: value,
                    nomeInquiridor: inquiridor.nomeCompleto,
                    nomeDoMeioInquiridor: inquiridor.nomeDoMeio,
                    sobrenomeInquiridor: inquiridor.sobrenome
                }));
            }
            return;
        }

        // Lógica para província
        if (field === 'provincia') {
            handleProvinciaChange(value);
            return;
        }

        // Lógica para tipo de documento
        if (field === 'tipoDocumento') {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                numeroBI: '',
                numeroNIF: '',
                confirmarNumeroDocumento: '',
                nomeOutroDocumento: '',
                outroTipoDocumento: ''
            }));
            setBiData(null);
            setNifData(null);
            return;
        }

        // Lógica para número do BI
        if (field === 'numeroBI') {
            setFormData(prev => ({ ...prev, numeroBI: value }));
            if (value && value.length >= 9) {
                if (debounceTimer.current) clearTimeout(debounceTimer.current);
                debounceTimer.current = setTimeout(() => consultarBI(value), 1500);
            }
            return;
        }

        // Lógica para número do NIF
        if (field === 'numeroNIF') {
            setFormData(prev => ({ ...prev, numeroNIF: value }));
            if (value && value.length >= 9) {
                if (debounceTimer.current) clearTimeout(debounceTimer.current);
                debounceTimer.current = setTimeout(() => consultarNIF(value), 1500);
            }
            return;
        }

        // Lógica para campos condicionais
        if (field === 'tipoOrganizacao') {
            if (value?.value !== 'OUTRO') {
                setFormData(prev => ({ ...prev, [field]: value, outroTipoOrganizacao: '' }));
            }
            if (value?.value !== 'ECA') {
                setFormData(prev => ({ ...prev, [field]: value, tipoECA: '', nomeECA: '', posicaoECA: '' }));
            }
            return;
        }

        // Validação para distribuição de membros da família
        if (field.includes('Idade') && (field.includes('feminino') || field.includes('masculino'))) {
            const newValue = parseInt(value) || 0;
            const currentTotal = getTotalMembrosDistribuidos();
            const fieldCurrentValue = formData[field] || 0;
            const newTotal = currentTotal - fieldCurrentValue + newValue;

            if (newTotal > (formData.totalMembros || 1)) {
                showToast('warn', 'Limite excedido', `O total de membros distribuídos não pode exceder ${formData.totalMembros} pessoas.`);
                return;
            }
        }

        // Lógica para limpar campos dependentes quando "Não" é selecionado
        if (field === 'chefeAgregado' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                nomeChefeAgregado: '',
                nomeDoMeioChefe: '',
                sobrenomeChefe: '',
                sexoChefe: '',
                relacaoChefe: ''
            }));
            return;
        }

        if (field === 'acessoTerras' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                proprietarioTerra: false,
                tituloConcessao: false,
                tipoTitulo: ''
            }));
            return;
        }

        if (field === 'proprietarioTerra' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                tituloConcessao: false,
                tipoTitulo: ''
            }));
            return;
        }

        if (field === 'tituloConcessao' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                tipoTitulo: ''
            }));
            return;
        }

        if (field === 'acessoIrrigacao' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                sistemaIrrigacao: '',
                outroSistemaIrrigacao: '',
                distanciaFonteAgua: 0
            }));
            return;
        }

        if (field === 'amanhosCulturais' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                tipoAmanhos: [],
                outroTipoAmanho: ''
            }));
            return;
        }

        if (field === 'acessoInstrumentos' && !value) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                fonteInstrumentos: [],
                outraFonteInstrumento: ''
            }));
            return;
        }

        if (field === 'beneficiadoCredito' && (value === false || value?.value === false)) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                fontesCredito: [],
                outraFonteCredito: ''
            }));
            return;
        }

        if (field === 'deficiencia' && (value === false || value?.value === false)) {
            setFormData(prev => ({
                ...prev,
                [field]: value,
                tipoDeficiencia: '',
                outraDeficiencia: ''
            }));
            return;
        }

        // Atualização normal
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleProvinciaChange = (value) => {
        setFormData(prev => ({ ...prev, provincia: value, municipio: '' }));

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
    };

    const handleFileUpload = (fieldName, file) => {
        setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
        setFormData(prev => ({ ...prev, [fieldName]: file }));
    };



    // Função validateCurrentStep - comentar validações
    const validateCurrentStep = () => {
        const newErrors = {};

        console.log('🔍 Validando step:', activeIndex);
        console.log('📋 FormData atual:', formData);

        switch (activeIndex) {
            case 0: // Inquiridor
                if (!formData.codigoInquiridor) newErrors.codigoInquiridor = 'Campo obrigatório';

                console.log('❌ Erros encontrados:', newErrors);
                break;

            case 1: // Infrastrutura
                if (!formData.nomeInfraestrutura) newErrors.nomeInfraestrutura = 'Campo obrigatório';
                if (!formData.tipoInfraestrutura) newErrors.tipoInfraestrutura = 'Campo obrigatório';
                console.log('❌ Erros encontrados:', newErrors);
                break;

            case 2: // Responsável
                if (!formData.proprietario_instituicao) newErrors.proprietario_instituicao = 'Campo obrigatório';
                console.log('❌ Erros encontrados:', newErrors);
                break;

            case 3: // Localização
                if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
                if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
                if (!formData.bairroAldeia) newErrors.bairroAldeia = 'Campo obrigatório';
                if (!formData.localResidencia) newErrors.localResidencia = 'Campo obrigatório';
                console.log('❌ Erros encontrados:', newErrors);
                break;

            case 4: // Características
                // Validation for technical characteristics - optional fields
                console.log('❌ Erros encontrados:', newErrors);
                break;

            case 5: // Utilização
                // Validation for utilization - optional fields
                console.log('❌ Erros encontrados:', newErrors);
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Verificar se deve mostrar seções de agricultura ou pecuária
    const shouldShowAgriculture = () => {
        if (!formData.tiposAtividades || formData.tiposAtividades.length === 0) return false;
        return formData.tiposAtividades.some(atividade => {
            const value = typeof atividade === 'object' ? atividade.value : atividade;
            return value === 'AGRICULTURA' || value === 'AGROPECUARIA';
        });
    };

    const shouldShowLivestock = () => {
        if (!formData.tiposAtividades || formData.tiposAtividades.length === 0) return false;
        return formData.tiposAtividades.some(atividade => {
            const value = typeof atividade === 'object' ? atividade.value : atividade;
            return value === 'PECUARIA' || value === 'AGROPECUARIA';
        });
    };

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
                                Selecione o código do inquiridor responsável por este cadastro. As informações serão preenchidas automaticamente.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="select"
                                label="Código do Inquiridor"
                                value={formData.codigoInquiridor}
                                options={inquiridoresData.map(inq => ({
                                    label: `${inq.codigo} - ${inq.nomeCompleto}`,
                                    value: inq.codigo
                                }))}
                                onChange={(value) => handleInputChange('codigoInquiridor', value)}
                                required
                                errorMessage={errors.codigoInquiridor}
                                placeholder="Selecione o inquiridor"
                                iconStart={<CreditCard size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome do Inquiridor"
                                value={formData.nomeInquiridor}
                                disabled={true}
                                placeholder="Preenchido automaticamente"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Sobrenome"
                                value={formData.sobrenomeInquiridor}
                                disabled={true}
                                placeholder="Preenchido automaticamente"
                                iconStart={<User size={18} />}
                            />

                            <CustomInput
                                type="date"
                                label="Data de Registro"
                                value={formData.dataRegisto}
                                onChange={(value) => handleInputChange('dataRegisto', value)}
                                iconStart={<Calendar size={18} />}
                            />
                        </div>
                    </div>
                );

            case 1: // Infraestrutura
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-purple-100 rounded-lg">
                                    <User className="w-6 h-6 text-purple-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800"> Identificação da Infraestrutura</h3>
                            </div>

                        </div>

                        {formData.numeroDocumento && formData.nomeProdutor && biData && (
                            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <p className="text-green-700 text-sm font-medium">
                                            Dados preenchidos automaticamente através da consulta do BI. Verifique e ajuste se necessário.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                nomeProdutor: '',
                                                nomeDoMeioProdutor: '',
                                                sobrenomeProdutor: '',
                                                dataNascimento: '',
                                                lugarNascimento: '',
                                                estadoCivil: '',
                                                sexoProdutor: '',
                                            }));
                                            setBiData(null);
                                            showToast('info', 'Dados limpos', 'Campos limpos. Preencha manualmente.');
                                        }}
                                        className="text-sm text-green-600 hover:text-green-800 underline"
                                    >
                                        Limpar e preencher manualmente
                                    </button>
                                </div>
                            </div>
                        )}



                        <div className="grid grid-cols-1 text-start md:grid-cols-2 lg:grid-cols-3 gap-6">

                            <CustomInput
                                type="text"
                                label="Nome da Infraestrutura"
                                value={formData.nomeInfraestrutura}
                                onChange={(value) => handleInputChange('nomeInfraestrutura', value)}
                                placeholder="Ex: Sistema de Irrigação"
                            />

                            <CustomInput
                                type="select"
                                label="Tipo de Infraestrutura"
                                value={formData.tipoInfraestrutura}
                                options={[
                                    { label: 'Canal de Irrigação', value: 'Canal de Irrigação' },
                                    { label: 'Represa/Barragem', value: 'Represa/Barragem' },
                                    { label: 'Furo de Água / Poço Artesiano', value: 'Furo de Água / Poço Artesiano' },
                                    { label: 'Sistema de Rega (aspersão/gota-a-gota)', value: 'Sistema de Rega (aspersão/gota-a-gota)' },
                                    { label: 'Armazém de Conservação', value: 'Armazém de Conservação' },
                                    { label: 'Silos de Grãos', value: 'Silos de Grãos' },
                                    { label: 'Estufa Agrícola', value: 'Estufa Agrícola' },
                                    { label: 'Estação Meteorológica', value: 'Estação Meteorológica' },
                                    { label: 'Estrada de Acesso Rural', value: 'Estrada de Acesso Rural' },
                                    { label: 'Mercado de Produtos Agrícolas', value: 'Mercado de Produtos Agrícolas' },
                                    { label: 'Centro de Formação Agrária', value: 'Centro de Formação Agrária' },
                                    { label: 'Centro de Extensão Rural', value: 'Centro de Extensão Rural' },
                                    { label: 'Posto de Assistência Veterinária', value: 'Posto de Assistência Veterinária' },
                                    { label: 'Matadouro Municipal / Abatedouro', value: 'Matadouro Municipal / Abatedouro' },
                                    { label: 'Cais de Pesca / Infraestrutura Aquícola', value: 'Cais de Pesca / Infraestrutura Aquícola' },
                                    { label: 'Centros de Processamento Agroalimentar', value: 'Centros de Processamento Agroalimentar' },
                                    { label: 'Tratores/Equipamentos Agrícolas Comunitários', value: 'Tratores/Equipamentos Agrícolas Comunitários' },
                                    { label: 'Outro', value: 'Outro' }
                                ]}
                                onChange={(value) => handleInputChange('tipoInfraestrutura', value)}
                                required
                                errorMessage={errors.tipoInfraestrutura}
                                placeholder="Selecione o tipo"
                                iconStart={<Tractor size={18} />}
                            />



                            <CustomInput
                                type="select"
                                label="Tipo de Documento"
                                value={formData.tipoDocumento}
                                options={[
                                    { label: 'Bilhete de Identidade', value: 'BI' },
                                    { label: 'NIF', value: 'NIF' },
                                ]}
                                onChange={(value) => handleInputChange('tipoDocumento', value)}
                                required
                                errorMessage={errors.tipoDocumento}
                                placeholder="Selecione o tipo"
                                iconStart={<CreditCard size={18} />}
                            />

                            {/* Campo BI */}
                            {(formData.tipoDocumento?.value === 'BI' || formData.tipoDocumento === 'BI') && (
                                <div className="relative">
                                    <CustomInput
                                        type="text"
                                        label="Número do BI"
                                        value={formData.numeroBI}
                                        onChange={(value) => handleInputChange('numeroBI', value)}
                                        required
                                        errorMessage={errors.numeroBI}
                                        placeholder="Digite o número do BI"
                                        iconStart={<CreditCard size={18} />}
                                        helperText="Digite o BI para consulta automática dos dados"
                                    />
                                    {consultingBI && (
                                        <div className="absolute right-3 top-9 flex items-center">
                                            <Loader size={16} className="animate-spin text-blue-600" />
                                            <span className="ml-2 text-sm text-blue-600">Consultando BI...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Campo NIF */}
                            {(formData.tipoDocumento?.value === 'NIF' || formData.tipoDocumento === 'NIF') && (
                                <div className="relative">
                                    <CustomInput
                                        type="text"
                                        label="Número do NIF"
                                        value={formData.numeroNIF}
                                        onChange={(value) => handleInputChange('numeroNIF', value)}
                                        required
                                        errorMessage={errors.numeroNIF}
                                        placeholder="Digite o número do NIF"
                                        iconStart={<CreditCard size={18} />}
                                        helperText="Digite o NIF para consulta automática dos dados"
                                    />
                                    {consultingNif && (
                                        <div className="absolute right-3 top-9 flex items-center">
                                            <Loader size={16} className="animate-spin text-blue-600" />
                                            <span className="ml-2 text-sm text-blue-600">Consultando NIF...</span>
                                        </div>
                                    )}
                                </div>
                            )}












                        </div>

                        {/* Informações do BI consultado */}
                        {biData && (
                            <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2" />
                                    Informações do BI Consultado
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Nome Completo:</span>
                                        <p className="text-gray-800">{`${biData.first_name || ''} ${biData.last_name || ''}`.trim() || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Sexo:</span>
                                        <p className="text-gray-800">{biData.gender_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Data de Nascimento:</span>
                                        <p className="text-gray-800">
                                            {biData.birth_date ?
                                                new Date(biData.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Idade:</span>
                                        <p className="text-gray-800">
                                            {biData.birth_date ? `${calculateAge(biData.birth_date)} anos` : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Estado Civil:</span>
                                        <p className="text-gray-800">{biData.marital_status_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Lugar de Nascimento:</span>
                                        <p className="text-gray-800">{biData.birth_province_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Data de Emissão:</span>
                                        <p className="text-gray-800">
                                            {biData.issue_date ?
                                                new Date(biData.issue_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Data de Validade:</span>
                                        <p className="text-gray-800">
                                            {biData.expiry_date ?
                                                new Date(biData.expiry_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Local de Emissão:</span>
                                        <p className="text-gray-800">{biData.issue_place || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                        
                        {/* Informações do NIF consultado */}
                        {nifData && (
                            <div className="mt-8 bg-green-50 rounded-2xl p-6 border border-green-200">
                                <h4 className="text-lg font-semibold text-green-800 mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2" />
                                    Informações do NIF Consultado
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Nome/Razão Social:</span>
                                        <p className="text-gray-800">{nifData.nome_contribuinte || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Email:</span>
                                        <p className="text-gray-800">{nifData.email || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Contacto:</span>
                                        <p className="text-gray-800">{nifData.numero_contacto || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 2: // Responsável
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-orange-100 rounded-lg">
                                    <UserCog className="w-6 h-6 text-orange-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Entidade Responsável</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre a entidade responsável pela infraestrutura. Selecione o tipo de documento para consulta automática.
                            </p>
                        </div>

                        {/* Caixa de dados consultados do BI */}
                        {biData && (
                            <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                                        <p className="text-green-700 text-sm font-medium">
                                            Dados preenchidos automaticamente através da consulta do BI.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                proprietario_instituicao: '',
                                                contacto: '',
                                                email: '',
                                                numeroBI: ''
                                            }));
                                            setBiData(null);
                                            showToast('info', 'Dados limpos', 'Campos limpos. Preencha manualmente.');
                                        }}
                                        className="text-sm text-green-600 hover:text-green-800 underline"
                                    >
                                        Limpar e preencher manualmente
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Caixa de dados consultados do NIF */}
                        {nifData && (
                            <div className="mb-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center">
                                        <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                                        <p className="text-blue-700 text-sm font-medium">
                                            Dados preenchidos automaticamente através da consulta do NIF.
                                        </p>
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setFormData(prev => ({
                                                ...prev,
                                                proprietario_instituicao: '',
                                                contacto: '',
                                                email: '',
                                                numeroNIF: ''
                                            }));
                                            setNifData(null);
                                            showToast('info', 'Dados limpos', 'Campos limpos. Preencha manualmente.');
                                        }}
                                        className="text-sm text-blue-600 hover:text-blue-800 underline"
                                    >
                                        Limpar e preencher manualmente
                                    </button>
                                </div>
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CustomInput
                                type="select"
                                label="Tipo de Documento"
                                value={formData.tipoDocumento}
                                options={[
                                    { label: 'Bilhete de Identidade', value: 'BI' },
                                    { label: 'NIF', value: 'NIF' },
                                ]}
                                onChange={(value) => handleInputChange('tipoDocumento', value)}
                                placeholder="Selecione o tipo"
                                iconStart={<CreditCard size={18} />}
                            />

                            {/* Campo BI */}
                            {(formData.tipoDocumento?.value === 'BI' || formData.tipoDocumento === 'BI') && (
                                <div className="relative">
                                    <CustomInput
                                        type="text"
                                        label="Número do BI"
                                        value={formData.numeroBI}
                                        onChange={(value) => handleInputChange('numeroBI', value)}
                                        placeholder="Digite o número do BI"
                                        iconStart={<CreditCard size={18} />}
                                        helperText="Digite o BI para consulta automática dos dados"
                                    />
                                    {consultingBI && (
                                        <div className="absolute right-3 top-9 flex items-center">
                                            <Loader size={16} className="animate-spin text-blue-600" />
                                            <span className="ml-2 text-sm text-blue-600">Consultando BI...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Campo NIF */}
                            {(formData.tipoDocumento?.value === 'NIF' || formData.tipoDocumento === 'NIF') && (
                                <div className="relative">
                                    <CustomInput
                                        type="text"
                                        label="Número do NIF"
                                        value={formData.numeroNIF}
                                        onChange={(value) => handleInputChange('numeroNIF', value)}
                                        placeholder="Digite o número do NIF"
                                        iconStart={<CreditCard size={18} />}
                                        helperText="Digite o NIF para consulta automática dos dados"
                                    />
                                    {consultingNif && (
                                        <div className="absolute right-3 top-9 flex items-center">
                                            <Loader size={16} className="animate-spin text-blue-600" />
                                            <span className="ml-2 text-sm text-blue-600">Consultando NIF...</span>
                                        </div>
                                    )}
                                </div>
                            )}

                            <CustomInput
                                type="text"
                                label="Proprietário/Instituição Gestora"
                                value={formData.proprietario_instituicao}
                                onChange={(value) => handleInputChange('proprietario_instituicao', value)}
                                placeholder="Nome da entidade responsável"
                                iconStart={<Building size={18} />}
                                required
                                errorMessage={errors.proprietario_instituicao}
                            />

                            <CustomInput
                                type="text"
                                label="Contacto"
                                value={formData.contacto}
                                onChange={(value) => handleInputChange('contacto', value)}
                                placeholder="Número de telefone"
                                iconStart={<Phone size={18} />}
                            />

                            <CustomInput
                                type="email"
                                label="Email"
                                value={formData.email}
                                onChange={(value) => handleInputChange('email', value)}
                                placeholder="endereco@email.com"
                                iconStart={<User size={18} />}
                            />
                        </div>
                    </div>
                );

            case 3: // Localização
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
                                Informe a localização geográfica do produtor e use o mapa para confirmar as coordenadas.
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
                                onChange={(value) => handleInputChange('provincia', value)}
                                required
                                errorMessage={errors.provincia}
                                placeholder="Selecione a província"
                                iconStart={<MapPin size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Município"
                                value={formData.municipio}
                                options={municipiosOptions}
                                onChange={(value) => handleInputChange('municipio', value)}
                                required
                                errorMessage={errors.municipio}
                                placeholder="Selecione o município"
                                iconStart={<Map size={18} />}
                                disabled={!formData.provincia}
                            />

                            <CustomInput
                                type="text"
                                label="Comuna/Distrito"
                                value={formData.comuna}
                                onChange={(value) => handleInputChange('comuna', value)}
                                placeholder="Nome da comuna ou distrito"
                                iconStart={<Building size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Bairro/Aldeia"
                                value={formData.bairroAldeia}
                                onChange={(value) => handleInputChange('bairroAldeia', value)}
                                required
                                errorMessage={errors.bairroAldeia}
                                placeholder="Digite o nome do bairro ou aldeia"
                                iconStart={<Home size={18} />}
                            />

                            <CustomInput
                                type="text"
                                label="Nome da Secção"
                                value={formData.nomeSecao}
                                onChange={(value) => handleInputChange('nomeSecao', value)}
                                placeholder="Nome da secção"
                                iconStart={<Building size={18} />}
                            />

                            <CustomInput
                                type="select"
                                label="Local da Residência"
                                value={formData.localResidencia}
                                options={[
                                    { label: 'Urbana', value: 'URBANA' },
                                    { label: 'Rural', value: 'RURAL' }
                                ]}
                                onChange={(value) => handleInputChange('localResidencia', value)}
                                placeholder="Selecione o tipo"
                                required
                                errorMessage={errors.localResidencia}

                                iconStart={<Home size={18} />}
                            />
                        </div>

                        <div className="bg-white rounded-2xl border border-gray-200 p-6">
                            <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                                Coordenadas GPS
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                                <CustomInput
                                    type="number"
                                    label="Latitude (°)"
                                    value={formData.latitudeGPS}
                                    onChange={(value) => handleInputChange('latitudeGPS', value)}
                                    placeholder="Ex: -8.838333"
                                    step="any"
                                />

                                <CustomInput
                                    type="number"
                                    label="Longitude (°)"
                                    value={formData.longitudeGPS}
                                    onChange={(value) => handleInputChange('longitudeGPS', value)}
                                    placeholder="Ex: 13.234444"
                                    step="any"
                                />

                                <CustomInput
                                    type="number"
                                    label="Altitude (m)"
                                    value={formData.altitudeGPS}
                                    onChange={(value) => handleInputChange('altitudeGPS', value)}
                                    placeholder="Ex: 73"
                                />

                                <CustomInput
                                    type="number"
                                    label="Precisão (m)"
                                    value={formData.precisaoGPS}
                                    onChange={(value) => handleInputChange('precisaoGPS', value)}
                                    placeholder="Ex: 5"
                                />
                            </div>

                            <MapaGPS
                                latitude={formData.latitudeGPS}
                                longitude={formData.longitudeGPS}
                                onLocationSelect={(lat, lng) => {
                                    handleInputChange('latitudeGPS', lat);
                                    handleInputChange('longitudeGPS', lng);
                                }}
                            />

                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                                <p className="text-sm text-blue-600 flex items-center">
                                    <Info size={16} className="mr-2" />
                                    Clique no mapa para selecionar uma localização automaticamente
                                </p>
                            </div>
                        </div>
                    </div>
                );

            case 4: // Características
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <Building className="w-6 h-6 text-blue-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Características Técnicas</h3>
                            </div>
                            <p className="text-gray-600">
                                Informe as características técnicas da infraestrutura, incluindo dimensões, capacidade e estado de conservação.
                            </p>
                        </div>



                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <CustomInput
                                type="text"
                                label="Dimensão"
                                value={formData.dimensao}
                                onChange={(value) => handleInputChange('dimensao', value)}
                                placeholder="Ex: 50m x 30m, 100 ha, 5 km"
                                iconStart={<Building size={18} />}
                                helperText="Especifique a unidade (m², ha, km, etc.)"
                            />

                            <CustomInput
                                type="text"
                                label="Capacidade"
                                value={formData.capacidade}
                                onChange={(value) => handleInputChange('capacidade', value)}
                                placeholder="Ex: 1000 litros, 500 toneladas, 200 utilizadores"
                                iconStart={<Building size={18} />}
                                helperText="Inclua a unidade de medida"
                            />

                            <CustomInput
                                type="select"
                                label="Estado de Conservação"
                                value={formData.estado_conservacao}
                                options={[
                                    { label: 'Bom', value: 'Bom' },
                                    { label: 'Razoável', value: 'Razoavel' },
                                    { label: 'Mau', value: 'Mau' }
                                ]}
                                onChange={(value) => handleInputChange('estado_conservacao', value)}
                                placeholder="Selecione o estado"
                                iconStart={<CheckCircle size={18} />}
                            />
                        </div>

                        {/* Informações do BI consultado */}
                        {biData && (
                            <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                                    <Info className="w-5 h-5 mr-2" />
                                    Informações do BI Consultado
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <span className="font-medium text-gray-600">Nome Completo:</span>
                                        <p className="text-gray-800">{`${biData.first_name || ''} ${biData.last_name || ''}`.trim() || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Sexo:</span>
                                        <p className="text-gray-800">{biData.gender_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Data de Nascimento:</span>
                                        <p className="text-gray-800">
                                            {biData.birth_date ?
                                                new Date(biData.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Idade:</span>
                                        <p className="text-gray-800">
                                            {biData.birth_date ? `${calculateAge(biData.birth_date)} anos` : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Estado Civil:</span>
                                        <p className="text-gray-800">{biData.marital_status_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Lugar de Nascimento:</span>
                                        <p className="text-gray-800">{biData.birth_province_name || 'N/A'}</p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Data de Emissão:</span>
                                        <p className="text-gray-800">
                                            {biData.issue_date ?
                                                new Date(biData.issue_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Data de Validade:</span>
                                        <p className="text-gray-800">
                                            {biData.expiry_date ?
                                                new Date(biData.expiry_date).toLocaleDateString('pt-BR') : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <span className="font-medium text-gray-600">Local de Emissão:</span>
                                        <p className="text-gray-800">{biData.issue_place || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                );

            case 5: // Utilização
                return (
                    <div className="max-w-full mx-auto">
                        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
                            <div className="flex items-center space-x-3 mb-3">
                                <div className="p-2 bg-green-100 rounded-lg">
                                    <Factory className="w-6 h-6 text-green-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-800">Utilização da Infraestrutura</h3>
                            </div>
                            <p className="text-gray-600">
                                Informações sobre como a infraestrutura é utilizada, beneficiários e atividades apoiadas.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <CustomInput
                                type="number"
                                label="Beneficiários Directos"
                                value={formData.beneficiarios_directos}
                                onChange={(value) => handleInputChange('beneficiarios_directos', value)}
                                placeholder="Número de beneficiários"
                                iconStart={<Users size={18} />}
                                helperText="Número de pessoas que utilizam diretamente a infraestrutura"
                            />

                            <CustomInput
                                type="select"
                                label="Frequência de Utilização"
                                value={formData.frequencia_utilizacao}
                                options={[
                                    { label: 'Diária', value: 'Diaria' },
                                    { label: 'Semanal', value: 'Semanal' },
                                    { label: 'Sazonal', value: 'Sazonal' }
                                ]}
                                onChange={(value) => handleInputChange('frequencia_utilizacao', value)}
                                placeholder="Selecione a frequência"
                                iconStart={<Calendar size={18} />}
                            />
                        </div>

                        <div className="mt-6">
                            <CustomInput
                                type="multiselect"
                                label="Principais Culturas/Actividades Apoiadas"
                                value={formData.principais_culturas_actividades}
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
                                    { label: 'Pecuária', value: 'PECUARIA' },
                                    { label: 'Aquicultura', value: 'AQUICULTURA' },
                                    { label: 'Produtos Florestais', value: 'FLORESTAIS' },
                                    { label: 'Outro', value: 'OUTRO' }
                                ]}
                                onChange={(value) => handleInputChange('principais_culturas_actividades', value)}
                                placeholder="Selecione as culturas/atividades"
                            />
                        </div>

                        <div className="mt-6">
                            <CustomInput
                                type="textarea"
                                label="Observações Gerais"
                                value={formData.observacoes_gerais}
                                onChange={(value) => handleInputChange('observacoes_gerais', value)}
                                placeholder="Informações adicionais sobre a utilização da infraestrutura..."
                                rows={4}
                                maxLength={500}
                            />
                        </div>
                    </div>
                );

            default:
                return <div className="text-center text-gray-500">Etapa não encontrada</div>;
        }
    };

    const isLastStep = activeIndex === steps.length - 1;
    const isAllRequiredFilesUploaded = () => {
        return uploadedFiles.fotoBiometrica && uploadedFiles.documentoFrente && uploadedFiles.documentoVerso;
    };

    // Função auxiliar para formatar datas corretamente
    const formatDateForAPI = (dateValue) => {
        if (!dateValue) return '';

        // Se já é uma string no formato correto (YYYY-MM-DD), retorna como está
        if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
            return dateValue;
        }

        // Se é um objeto Date
        if (dateValue instanceof Date) {
            return dateValue.toISOString().split('T')[0]; // Converte para YYYY-MM-DD
        }

        // Se é uma string de data, tenta converter
        try {
            const date = new Date(dateValue);
            if (!isNaN(date.getTime())) {
                return date.toISOString().split('T')[0];
            }
        } catch (error) {
            console.warn('Erro ao converter data:', dateValue, error);
        }

        return '';
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            // Validar campos obrigatórios antes de enviar
            if (!formData.nomeProdutor) {
                showToast('error', 'Erro', 'Nome do produtor é obrigatório');
                setLoading(false);
                return;
            }

            // Criar o objeto de dados mapeado CORRETAMENTE para a API
            const apiData = {
                // Seção A: Identificação do Inquiridor
                CodigoInquiridor: formData.codigoInquiridor?.value || formData.codigoInquiridor || '',
                NomeInquiridor: formData.nomeInquiridor || '',
                NomeMeio: formData.nomeDoMeioInquiridor || '',
                SobrenomeInquiridor: formData.sobrenomeInquiridor || '',
                RegistrationDate: formatDateForAPI(formData.dataRegisto), // ✅ Data formatada

                // Seção B: Identificação Geográfica
                Provincia: formData.provincia?.value || formData.provincia || '',
                Municipio: formData.municipio?.value || formData.municipio || '',
                Comuna: formData.comuna || '',
                GeoLevel4: formData.comuna || '',
                GeoLevel5: formData.bairroAldeia || '',
                GeoLevel6: formData.nomeSecao || '',
                GPSCoordinates: `${formData.latitudeGPS || ''},${formData.longitudeGPS || ''}`,

                // Seção C: Consentimento
                Permissao: 'Sim',

                // Seção D: Membro já registrado
                MembroRegistrado: 'Não',
                CodigoFamiliar: '',

                // Seção E: Identificação do Produtor
                NomeProdutor: formData.nomeProdutor || '',
                NomeMeioProdutor: formData.nomeDoMeioProdutor || '',
                SobrenomeProdutor: formData.sobrenomeProdutor || '',
                BeneficiaryName: `${formData.nomeProdutor || ''} ${formData.sobrenomeProdutor || ''}`.trim(),

                // ECA/Organização
                E4FazesParteDeUmaCooper: formData.tipoOrganizacao?.value === 'COOPERATIVA' ? 'Sim' : 'Não',
                TipoOrganizacao: formData.tipoOrganizacao?.value || formData.tipoOrganizacao || '',
                EspecificarOrganizacao: formData.outroTipoOrganizacao || '',

                // Dados pessoais
                BeneficiaryGender: formData.sexoProdutor?.value || formData.sexoProdutor || '',
                TipoDocumento: formData.tipoDocumento?.value || formData.tipoDocumento || '',
                ConfirmarDocumento: formData.numeroDocumento || '',
                BeneficiaryPhoneNumber: formData.telefoneProdutor || '',
                ConfirmarTelefone: formData.confirmarTelefoneProdutor || formData.telefoneProdutor || '',
                TelefoneProprio: formData.telefonePropriedade ? 'Sim' : 'Não',
                DonoNumero: formData.proprietarioTelefone || '',
                BeneficiaryDateOfBirth: formatDateForAPI(formData.dataNascimento), // ✅ Data formatada corretamente
                LugarNascimento: formData.lugarNascimento?.value || formData.lugarNascimento || '',
                EstadoCivil: formData.estadoCivil?.value || formData.estadoCivil || '',
                NivelEscolaridade: formData.nivelEscolaridade?.value || formData.nivelEscolaridade || '',
                Outro: formData.outroNivelEscolaridade || '',
                Gravida: formData.gravidez ? 'Sim' : 'Não',
                PossuiDeficiencia: formData.deficiencia ? 'Sim' : 'Não',
                TipoDeficiencia: formData.tipoDeficiencia?.value || formData.tipoDeficiencia || '',

                // Seção F: Composição do Agregado Familiar
                ChefeFamiliar: formData.chefeAgregado ? 'Sim' : 'Não',
                NomeChefe: formData.nomeChefeAgregado || '',
                NomeMeioChefe: formData.nomeDoMeioChefe || '',
                SobreNomeChefe: formData.sobrenomeChefe || '',
                SexoChefe: formData.sexoChefe?.value || formData.sexoChefe || '',
                TipoDocChefe: '',
                NumDocChefe: '',
                ConfirmarDocChefe: '',
                NumTelChefe: '',
                ConfirmarTelChefe: '',
                RelacaoChefe: formData.relacaoChefe?.value || formData.relacaoChefe || '',
                TotalAgregado: formData.totalMembros?.toString() || '1',
                Feminino_0_6: formData.femininoIdade0a6?.toString() || '0',
                Masculino_0_6: formData.masculinoIdade0a6?.toString() || '0',
                Feminino_7_18: formData.femininoIdade7a18?.toString() || '0',
                Masculino_7_18: formData.masculinoIdade7a18?.toString() || '0',
                Feminino_19_60: formData.femininoIdade19a60?.toString() || '0',
                Masculino_19_60: formData.masculinoIdade19a60?.toString() || '0',
                Feminino_61_mais: formData.femininoIdade61mais?.toString() || '0',
                Masculino_61_mais: formData.masculinoIdade61mais?.toString() || '0',

                // Seção G: Ativos e Atividades
                AtividadesProdutor: Array.isArray(formData.tiposAtividades)
                    ? formData.tiposAtividades.map(item => item.value || item).join(',')
                    : formData.tiposAtividades || '',
                OutraAtividade: formData.outroTipoAtividade || '',

                // Informações sobre terras
                AcessoTerra: formData.acessoTerras ? 'Sim' : 'Não',
                EProprietario: formData.proprietarioTerra ? 'Sim' : 'Não',
                TituloTerra: formData.tituloConcessao ? 'Sim' : 'Não',
                TipoDocTerra: formData.tipoTitulo?.value || formData.tipoTitulo || '',
                AreaTotal: formData.areaTotalCampos?.toString() || '0',
                AreaExplorada: formData.areaExplorada?.toString() || '0',
                AreaAgricola: formData.areaAgricola?.toString() || '0',
                AreaPecuaria: formData.areaPecuaria?.toString() || '0',
                AreaFlorestal: formData.areaFlorestal?.toString() || '0',
                TecnologiaAgricola: formData.tecnologiaAgricola?.value || formData.tecnologiaAgricola || '',

                // Culturas
                CulturasImportantes: Array.isArray(formData.culturasPrincipais)
                    ? formData.culturasPrincipais.map(item => item.value || item).join(',')
                    : formData.culturasPrincipais || '',
                OutraCultura: formData.outraCultura || '',
                ProducaoSacos: formData.producaoSacos50kg?.toString() || '0',
                TipoSemanteira: formData.tipoSementeira?.value || formData.tipoSementeira || '',
                UsoFertilizante: formData.usoFertilizantes ? 'Sim' : 'Não',
                PreparacaoTerra: formData.preparacaoTerra?.value || formData.preparacaoTerra || '',

                // Irrigação
                AcessoIrrigacao: formData.acessoIrrigacao ? 'Sim' : 'Não',
                SistemaIrrigacao: formData.sistemaIrrigacao?.value || formData.sistemaIrrigacao || '',
                EspecificarIrrigacao: formData.outroSistemaIrrigacao || '',
                DistanciaAgua: formData.distanciaFonteAgua?.toString() || '0',

                // Amanhos culturais
                AmanhosCulturais: formData.amanhosCulturais ? 'Sim' : 'Não',
                TiposAmanhos: Array.isArray(formData.tipoAmanhos)
                    ? formData.tipoAmanhos.map(item => item.value || item).join(',')
                    : formData.tipoAmanhos || '',
                EspecificarAmanhos: formData.outroTipoAmanho || '',

                // Instrumentos agrícolas
                AcessoInsumoaAgricolas: formData.acessoInstrumentos ? 'Sim' : 'Não',
                FonteInsumos: Array.isArray(formData.fonteInstrumentos)
                    ? formData.fonteInstrumentos.map(item => item.value || item).join(',')
                    : formData.fonteInstrumentos || '',
                EspecificarFonte: formData.outraFonteInstrumento || '',

                // Seção H: Pecuária
                TiposCriacao: Array.isArray(formData.tiposCriacao)
                    ? formData.tiposCriacao.map(item => item.value || item).join(',')
                    : formData.tiposCriacao || '',
                OutraCriacao: formData.outroTipoCriacao || '',

                // Avicultura
                SistemaAvicultura: formData.sistemaAvicultura?.value || formData.sistemaAvicultura || '',
                ObjetivoAvicultura: formData.objetivoAvicultura?.value || formData.objetivoAvicultura || '',
                OutroObjAvicultura: formData.outroObjetivoAvicultura || '',
                NumeroAves: formData.numeroAves?.toString() || '0',

                // Pecuária geral
                TipoPecuaria: formData.sistemaBovinocultura?.value || formData.sistemaBovinocultura || '',
                ManejoPecuaria: formData.tipoBovinocultura?.value || formData.tipoBovinocultura || '',
                NumeroCabras: formData.numeroCabras?.toString() || '0',
                NumeroVacas: formData.numeroVacas?.toString() || '0',
                NumeroOvelhas: formData.numeroOvelhas?.toString() || '0',
                ObjetivoProducao: formData.objetivoBovinos?.value || formData.objetivoBovinos || '',
                EspecificarObjetivoProducao: formData.outroObjetivoBovinos || '',

                // Suinocultura
                NumeroPorcos: formData.numeroPorcos?.toString() || '0',
                ObjetivoSuinocultura: formData.objetivoSuinos?.value || formData.objetivoSuinos || '',
                EspecificarObjetivoSuino: formData.outroObjetivoSuinos || '',

                // Aquicultura
                TipoAquicultura: formData.tipoPiscicultura?.value || formData.tipoPiscicultura || '',
                ObjetivoAquicultura: formData.objetivoPiscicultura?.value || formData.objetivoPiscicultura || '',
                EspecificarObjetivoAquic: formData.outroObjetivoPiscicultura || '',
                NumeroPeixes: formData.numeroPeixes?.toString() || '0',

                // Cunicultura
                NumeroCoelhos: formData.numeroCoelhos?.toString() || '0',
                ObjetivoCoelho: formData.objetivoCoelhos?.value || formData.objetivoCoelhos || '',
                EspecificarObjetivoCoelhos: formData.outroObjetivoCoelhos || '',

                // Aspectos gerais pecuária
                AcessoRacao: formData.acessoRacao ? 'Sim' : 'Não',
                ConhecimentoDoencas: formData.conhecimentoDoencas ? 'Sim' : 'Não',

                // Seção I: Crédito & Bens
                CreditoBeneficio: formData.beneficiadoCredito ? 'Sim' : 'Não',
                FonteCredito: Array.isArray(formData.fontesCredito)
                    ? formData.fontesCredito.map(item => item.value || item).join(',')
                    : formData.fontesCredito || '',
                EspecificarCredito: formData.outraFonteCredito || '',

                BensFamiliares: Array.isArray(formData.bensPatrimonio)
                    ? formData.bensPatrimonio.map(item => item.value || item).join(',')
                    : formData.bensPatrimonio || '',
                EspecificarBem: formData.outroBemPatrimonio || '',

                // Seção J: Pacotes de Assistência
                TipoApoio: formData.tipoApoio || '',
                ObservacoesGerais: formData.observacoesGerais || '',
                TipoPatec: formData.tipoPacote?.value || formData.tipoPacote || '',
                EspecificarPatec: formData.outroTipoPacote || '',

                // Campos adicionais da especificação
                H3OProdutorJBeneficiouD: 'Não',
                H31TiposDeCrditos: '',
                EspecificaOutroTipItoQueOBeneficiou: '',
                Estado: '1'
            };

            console.log('📋 Dados mapeados para enviar:', apiData);
            console.log('📅 Datas formatadas:', {
                RegistrationDate: apiData.RegistrationDate,
                BeneficiaryDateOfBirth: apiData.BeneficiaryDateOfBirth
            });

            // Criar FormData para enviar arquivos
            const formDataToSend = new FormData();

            // Adicionar todos os campos de texto
            Object.keys(apiData).forEach(key => {
                if (apiData[key] !== null && apiData[key] !== undefined) {
                    formDataToSend.append(key, apiData[key]);
                }
            });

            // Adicionar arquivos se existirem
            if (uploadedFiles.fotoBiometrica) {
                formDataToSend.append('BeneficiaryBiometrics', uploadedFiles.fotoBiometrica);
            }

            if (uploadedFiles.fotoNaoBiometrica) {
                formDataToSend.append('BeneficiaryPhoto', uploadedFiles.fotoNaoBiometrica);
            }

            if (uploadedFiles.documentoFrente) {
                formDataToSend.append('FotoDocumento', uploadedFiles.documentoFrente);
            }

            if (uploadedFiles.documentoVerso) {
                formDataToSend.append('DocumentoVerso', uploadedFiles.documentoVerso);
            }

            if (uploadedFiles.superficieCultivada) {
                formDataToSend.append('FotoSuperficie', uploadedFiles.superficieCultivada);
            }

            if (uploadedFiles.fotosAnimais) {
                formDataToSend.append('FotosAnimais', uploadedFiles.fotosAnimais);
            }

            if (uploadedFiles.fotoObservacao) {
                formDataToSend.append('FotoObservacao', uploadedFiles.fotoObservacao);
            }

            // Log para debug dos dados enviados
            console.log('📤 FormData sendo enviado:');
            for (let [key, value] of formDataToSend.entries()) {
                if (value instanceof File) {
                    console.log(`${key}: [File] ${value.name} (${value.size} bytes)`);
                } else {
                    console.log(`${key}: ${value}`);
                }
            }

            // Fazer a requisição para a API
            const response = await api.post('/formulario', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000,
            });

            console.log('✅ Produtor cadastrado com sucesso:', response.data);

            setLoading(false);
            showToast('success', 'Sucesso', 'Produtor cadastrado no RNPA com sucesso!');

            // Reset do formulário
            setFormData(initialState);
            setActiveIndex(0);
            setErrors({});
            setUploadedFiles({});
            setBiData(null);

        } catch (error) {
            setLoading(false);
            console.error('❌ Erro ao cadastrar produtor:', error);

            // Log detalhado do erro para debug
            if (error.response) {
                console.error('📄 Detalhes do erro de resposta:', {
                    status: error.response.status,
                    statusText: error.response.statusText,
                    data: error.response.data,
                    headers: error.response.headers
                });

                // Exibir detalhes específicos do erro 400
                if (error.response.status === 400) {
                    const errorData = error.response.data;
                    console.error('🔍 Detalhes do erro 400:', errorData);

                    if (errorData && errorData.errors) {
                        // Se houver detalhes dos campos com erro
                        const errorMessages = Object.keys(errorData.errors).map(field =>
                            `${field}: ${errorData.errors[field].join(', ')}`
                        ).join('\n');
                        showToast('error', 'Erro de Validação', `Campos com erro:\n${errorMessages}`);
                    } else {
                        const errorMessage = errorData?.message || errorData?.title || 'Dados inválidos enviados para o servidor';
                        showToast('error', 'Erro de Validação', errorMessage);
                    }
                } else {
                    const errorMessage = error.response.data?.message || 'Erro do servidor';
                    showToast('error', 'Erro do Servidor', `${error.response.status}: ${errorMessage}`);
                }
            } else if (error.request) {
                console.error('🌐 Erro de rede - sem resposta:', error.request);
                showToast('error', 'Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
            } else {
                console.error('⚙️ Erro na configuração:', error.message);
                showToast('error', 'Erro', 'Erro inesperado ao cadastrar produtor. Tente novamente.');
            }
        }
    };



    return (
        <div className="bg-gray-50 min-h-screen">
            <ScrollToTop activeIndex={activeIndex} />
            {/* Toast Message */}
            {toastMessage && (
                <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
                    toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
                        toastMessage.severity === 'warn' ? 'bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700' :
                            'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
                    }`}>
                    <div className="flex items-center">
                        <div className="mr-3">
                            {toastMessage.severity === 'success' && <CheckCircle size={20} />}
                            {toastMessage.severity === 'error' && <AlertCircle size={20} />}
                            {toastMessage.severity === 'warn' && <AlertCircle size={20} />}
                            {toastMessage.severity === 'info' && <Info size={20} />}
                        </div>
                        <div>
                            <p className="font-bold">{toastMessage.summary}</p>
                            <p className="text-sm">{toastMessage.detail}</p>
                        </div>
                    </div>
                </div>
            )}



            <div className="py-8">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
                    {/* Header */}
                    <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
                        <h1 className="text-4xl font-bold mb-3 text-gray-800">Registro de Apoio à Agricultura </h1>
                    </div>

                    {/* Step Navigation */}
                    <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
                        {steps.map((step, index) => {
                            const StepIcon = step.icon;
                            return (
                                <div
                                    key={index}
                                    className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${index > activeIndex ? 'opacity-50' : ''
                                        }`}
                                    onClick={() => index <= activeIndex && setActiveIndex(index)}
                                >
                                    <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index < activeIndex ? 'bg-blue-500 text-white' :
                                        index === activeIndex ? 'bg-blue-600 text-white' :
                                            'bg-gray-200 text-gray-500'
                                        }`}>
                                        {index < activeIndex ? (
                                            <Check size={24} />
                                        ) : (
                                            <StepIcon size={24} />
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
                    <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
                        <div
                            className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
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
                            className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
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
                            className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                                ? isAllRequiredFilesUploaded()
                                    ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                    : 'bg-gray-300 cursor-not-allowed text-gray-600'
                                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                                }`}
                            disabled={(isLastStep && !isAllRequiredFilesUploaded()) || loading}
                            onClick={(e) => {
                                e.preventDefault();
                                if (!isLastStep) {
                                    if (validateCurrentStep()) {
                                        setTimeout(() => {
                                            document.body.scrollTop = 0;
                                            document.documentElement.scrollTop = 0;
                                            window.scrollTo({ top: 0, behavior: 'smooth' });
                                        }, 100);
                                        setActiveIndex(prev => prev + 1);
                                    }
                                } else {
                                    if (isAllRequiredFilesUploaded() && validateCurrentStep()) {
                                        handleSubmit(e);
                                    } else {
                                        showToast('error', 'Erro', 'Por favor, complete todos os campos e anexe os documentos necessários.');
                                    }
                                }
                            }}
                        >
                            {loading ? (
                                <>
                                    <Loader size={20} className="animate-spin mr-2" />
                                    Processando...
                                </>
                            ) : isLastStep ? (
                                <>
                                    <Check size={20} className="mr-2" />
                                    Registar no RNPA
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">Próximo</span>
                                    <ChevronRight size={20} />
                                </>
                            )}
                        </button>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default RegistroApoioAgricola;