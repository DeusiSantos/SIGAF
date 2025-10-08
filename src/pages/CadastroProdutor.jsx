import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import axios from 'axios';
import {
  User,
  Home,
  Users,
  Tractor,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  MapPin,
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

import CustomInput from '../components/CustomInput';
import provinciasData from '../components/Provincias.json'; // Supondo que você tenha um arquivo JSON com os dados das províncias
import ScrollToTop from '../components/ScrollToTop';
import { GiCow } from 'react-icons/gi';
import api from '../services/api';

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

const CadastroProdutor = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [consultingBI, setConsultingBI] = useState(false);
  const [biData, setBiData] = useState(null);

  // Estado inicial simplificado
  const initialState = {
    // Seção A: Identificação do Inquiridor
    codigo_inquiridor: '',
    nome_inquiridor: '',
    nomeDoMeioInquiridor: '',
    sobrenome_inquiridor: '',
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

    // Seção C: Identificação do Produtor
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
    { label: 'Inquiridor', icon: User },
    { label: 'Localização', icon: MapPin },
    { label: 'Produtor', icon: User },
    { label: 'Agregado', icon: Users },
    { label: 'Actividades', icon: Tractor },
    { label: 'Pecuária', icon: GiCow },
    { label: 'Crédito & Bens', icon: DollarSign },
    { label: 'Documentos', icon: FileText }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };
  // Função auxiliar para obter o label do estado civil
  const getEstadoCivilLabel = (value) => {
    const estadosCivis = {
      'SOLTEIRO': 'Solteiro(a)',
      'UNIAO_FACTO': 'União de facto',
      'CASADO': 'Casado(a)',
      'DIVORCIADO': 'Divorciado(a)',
      'SEPARADO': 'Separado(a)',
      'VIUVO': 'Viúvo(a)'
    };
    return estadosCivis[value] || value;
  };

  // Função para consultar BI na API
  const consultarBI = async (biValue) => {
    if (!biValue || biValue.length < 9) return;

    // Evitar múltiplas consultas simultâneas
    if (consultingBI) {
      console.log('⏸️ Consulta já em andamento, ignorando nova solicitação');
      return;
    }

    setConsultingBI(true);

    // LIMPAR dados anteriores ANTES de fazer nova consulta
    console.log('🧹 Limpando dados anteriores antes da nova consulta');
    setBiData(null);
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

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      console.log(`🔍 Consultando BI: ${biValue}`);

      const response = await axios.get(`https://api.gov.ao/bi/v1/getBI`, {
        params: { bi: biValue },
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Status da resposta:', response.status);
      console.log('📋 Code da resposta:', response.data?.code);

      const data = response.data;

      if (response.status === 200 && data.code === 200 && data.data) {
        const biInfo = data.data;

        // LOG detalhado dos dados recebidos para debug
        console.log('📋 Dados recebidos da API:', {
          first_name: biInfo.first_name,
          last_name: biInfo.last_name,
          gender_name: biInfo.gender_name,
          marital_status_name: biInfo.marital_status_name,
          birth_province_name: biInfo.birth_province_name,
          birth_date: biInfo.birth_date
        });

        // Validar e limpar dados antes de processar
        const nomeProdutor = (biInfo.first_name || '').trim();
        const sobrenomeProdutor = (biInfo.last_name || '').trim();

        if (!nomeProdutor && !sobrenomeProdutor) {
          showToast('warn', 'Dados incompletos', 'Os dados do BI não contêm nome válido.');
          return;
        }

        setBiData(biInfo);

        // Mapear sexo para os valores do formulário
        let sexoMapeado = '';
        if (biInfo.gender_name) {
          const sexo = biInfo.gender_name.toLowerCase().trim();
          if (sexo.includes('masculino') || sexo.includes('male') || sexo === 'm') {
            sexoMapeado = 'MASCULINO';
          } else if (sexo.includes('feminino') || sexo.includes('female') || sexo === 'f') {
            sexoMapeado = 'FEMININO';
          }
        }

        // Mapear estado civil
        let estadoCivilMapeado = '';
        if (biInfo.marital_status_name) {
          const estadoCivil = biInfo.marital_status_name.toLowerCase().trim();
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

        // Mapear lugar de nascimento
        let lugarNascimentoMapeado = '';
        if (biInfo.birth_province_name) {
          const nomeProvinciaAPI = biInfo.birth_province_name.toLowerCase().trim();

          const provinciaEncontrada = provinciasData.find(provincia => {
            const nomeProvinciaJSON = provincia.nome.toLowerCase().trim();
            return nomeProvinciaJSON === nomeProvinciaAPI ||
              nomeProvinciaJSON.includes(nomeProvinciaAPI) ||
              nomeProvinciaAPI.includes(nomeProvinciaJSON);
          });

          lugarNascimentoMapeado = provinciaEncontrada
            ? { label: provinciaEncontrada.nome, value: provinciaEncontrada.nome }
            : { label: biInfo.birth_province_name, value: biInfo.birth_province_name };
        }

        // Formatar data de nascimento
        let dataNascimentoFormatada = '';
        if (biInfo.birth_date) {
          try {
            dataNascimentoFormatada = new Date(biInfo.birth_date).toISOString().split('T')[0];
          } catch (error) {
            console.warn('⚠️ Erro ao formatar data de nascimento:', error);
          }
        }

        // LOG dos dados que serão inseridos no formulário
        console.log('✅ Dados processados para inserção:', {
          nomeProdutor,
          sobrenomeProdutor,
          sexoMapeado,
          estadoCivilMapeado,
          dataNascimentoFormatada,
          lugarNascimento: lugarNascimentoMapeado
        });

        // ATUALIZAR formulário com dados limpos e validados
        setFormData(prev => ({
          ...prev,
          nomeProdutor,
          nomeDoMeioProdutor: '', // Sempre vazio - não vem da API
          sobrenomeProdutor,
          dataNascimento: dataNascimentoFormatada,
          lugarNascimento: lugarNascimentoMapeado,
          estadoCivil: estadoCivilMapeado
            ? { label: getEstadoCivilLabel(estadoCivilMapeado), value: estadoCivilMapeado }
            : '',
          sexoProdutor: sexoMapeado
            ? { label: sexoMapeado, value: sexoMapeado }
            : '',
        }));

        showToast('success', 'BI Consultado', 'Dados do produtor preenchidos automaticamente!');

      } else {
        console.log('⚠️ BI não encontrado ou resposta inválida:', {
          status: response.status,
          code: data.code,
          message: data.message
        });

        setBiData(null);

        if (data.code === 404) {
          showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI. Preencha manualmente.');
        } else {
          showToast('warn', 'BI inválido', `Este BI não retornou dados válidos. Código: ${data.code}`);
        }
      }

    } catch (error) {
      console.error('❌ Erro ao consultar BI:', error);
      setBiData(null);

      // Tratamento de erros mais específico
      if (error.response) {
        const { status, data } = error.response;
        console.error(`🚫 Erro HTTP ${status}:`, data);

        if (status === 401) {
          showToast('error', 'Erro de Autenticação', 'Credenciais inválidas para consulta do BI.');
        } else if (status === 403) {
          showToast('error', 'Acesso Negado', 'Sem permissão para consultar este BI.');
        } else if (status === 404) {
          showToast('warn', 'BI não encontrado', 'Este número de BI não foi encontrado na base de dados.');
        } else if (status >= 500) {
          showToast('error', 'Erro do Servidor', 'Servidor da consulta de BI indisponível. Tente novamente mais tarde.');
        } else {
          showToast('error', 'Erro na Consulta', `Erro ${status}: ${data?.message || 'Erro desconhecido'}`);
        }
      } else if (error.request) {
        console.error('🌐 Erro de rede:', error.request);
        showToast('error', 'Erro de Conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        console.error('⚙️ Erro na configuração:', error.message);
        showToast('error', 'Erro Interno', 'Erro interno na consulta do BI. Tente novamente.');
      }
    } finally {
      setConsultingBI(false);
    }
  };

  // Debounce para consulta do BI
  const debounceTimer = React.useRef(null);
  const handleBIChange = (value) => {
    setFormData(prev => ({ ...prev, numeroDocumento: value }));

    // Limpar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Só consultar se o tipo de documento for BI
    if (formData.tipoDocumento?.value === 'BI' && value && value.length >= 9) {
      debounceTimer.current = setTimeout(() => {
        consultarBI(value);
      }, 1500);
    }
  };

  // Verificar se deve mostrar o campo número do documento
  const shouldShowDocumentNumber = () => {
    const tipoDoc = formData.tipoDocumento?.value || formData.tipoDocumento;
    return tipoDoc && tipoDoc !== 'NAO_POSSUI';
  };

  // Verificar se deve mostrar o campo nome do documento
  const shouldShowDocumentName = () => {
    const tipoDoc = formData.tipoDocumento?.value || formData.tipoDocumento;
    return tipoDoc === 'OUTRO';
  };

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
    if (field === 'codigo_inquiridor') {
      const inquiridor = inquiridoresData.find(inq => inq.codigo === (value?.value || value));
      if (inquiridor) {
        setFormData(prev => ({
          ...prev,
          codigo_inquiridor: value,
          nome_inquiridor: inquiridor.nomeCompleto,
          nomeDoMeioInquiridor: inquiridor.nomeDoMeio,
          sobrenome_inquiridor: inquiridor.sobrenome
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
        numeroDocumento: '',
        confirmarNumeroDocumento: '',
        nomeOutroDocumento: '',
        outroTipoDocumento: ''
      }));
      setBiData(null); // Limpar dados do BI quando mudar tipo de documento
      return;
    }

    // Lógica para número do documento (com consulta BI)
    if (field === 'numeroDocumento') {
      handleBIChange(value);
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
        if (!formData.codigo_inquiridor) newErrors.codigo_inquiridor = 'Campo obrigatório';

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 1: // Localização
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        if (!formData.bairroAldeia) newErrors.bairroAldeia = 'Campo obrigatório';
        if (!formData.localResidencia) newErrors.localResidencia = 'Campo obrigatório';
        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 2: // Produtor
        if (!formData.nomeProdutor) newErrors.nomeProdutor = 'Campo obrigatório';
        if (!formData.sobrenomeProdutor) newErrors.sobrenomeProdutor = 'Campo obrigatório';
        if (!formData.sexoProdutor) newErrors.sexoProdutor = 'Campo obrigatório';
        if (!formData.tipoDocumento) newErrors.tipoDocumento = 'Campo obrigatório';
        if (!formData.lugarNascimento || (typeof formData.lugarNascimento === 'object' && !formData.lugarNascimento.value)) {
          newErrors.lugarNascimento = 'Campo obrigatório';
        }
        if (!formData.estadoCivil || (typeof formData.estadoCivil === 'object' && !formData.estadoCivil.value)) {
          newErrors.estadoCivil = 'Campo obrigatório';
        }



        // Validação de idiomas falados
        if (!formData.idiomasFalados || formData.idiomasFalados.length === 0) {
          newErrors.idiomasFalados = 'Selecione pelo menos um idioma';
        }

        // Validação condicional do número do documento
        if (shouldShowDocumentNumber() && !formData.numeroDocumento) {
          newErrors.numeroDocumento = 'Campo obrigatório';
        }


        // Validação do nome do documento "Outro"
        if (shouldShowDocumentName() && !formData.nomeOutroDocumento) {
          newErrors.nomeOutroDocumento = 'Campo obrigatório';
        }

        if (!formData.telefoneProdutor) newErrors.telefoneProdutor = 'Campo obrigatório';

        if (!formData.dataNascimento) newErrors.dataNascimento = 'Campo obrigatório';
        if (formData.dataNascimento && calculateAge(formData.dataNascimento) < 18) {
          newErrors.dataNascimento = 'Produtor deve ter pelo menos 18 anos';
        }

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 3: // Agregado
        // Validação obrigatória do campo chefeAgregado
        if (formData.chefeAgregado === null || formData.chefeAgregado === undefined) {
          newErrors.chefeAgregado = 'Campo obrigatório';
        }

        if (!formData.totalMembros || formData.totalMembros < 1) {
          newErrors.totalMembros = 'Deve ter pelo menos 1 membro';
        }

        // Validação da distribuição de membros
        {
          const totalDistribuido = getTotalMembrosDistribuidos();
          if (totalDistribuido > formData.totalMembros) {
            newErrors.distribuicaoMembros = `Total de membros distribuídos (${totalDistribuido}) não pode exceder o total definido (${formData.totalMembros})`;
          }
        }

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 4: // Atividades
        if (!formData.tiposAtividades || formData.tiposAtividades.length === 0) {
          newErrors.tiposAtividades = 'Selecione pelo menos uma atividade';
        }

        console.log('❌ Erros encontrados:', newErrors);
        break;

      case 6: // Crédito & Bens  
        // Validação obrigatória do beneficiadoCredito
        if (formData.beneficiadoCredito === null || formData.beneficiadoCredito === undefined) {
          newErrors.beneficiadoCredito = 'Campo obrigatório';
        }

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
                value={formData.codigo_inquiridor}
                options={inquiridoresData.map(inq => ({
                  label: `${inq.codigo} - ${inq.nomeCompleto}`,
                  value: inq.codigo
                }))}
                onChange={(value) => handleInputChange('codigo_inquiridor', value)}
                required
                errorMessage={errors.codigo_inquiridor}
                placeholder="Selecione o inquiridor"
                iconStart={<CreditCard size={18} />}
              />

              <CustomInput
                type="text"
                label="Nome do Inquiridor"
                value={formData.nome_inquiridor}
                disabled={true}
                placeholder="Preenchido automaticamente"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="text"
                label="Sobrenome"
                value={formData.sobrenome_inquiridor}
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
                Informações pessoais do produtor agrícola. <span className="font-semibold">Idade mínima: 18 anos</span>
                {formData.tipoDocumento?.value === 'BI' && <span className="ml-2 text-blue-600 font-semibold">Digite o BI para consulta automática dos dados!</span>}
              </p>
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



            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <CustomInput
                type="select"
                label="Tipo de Documento"
                value={formData.tipoDocumento}
                options={[
                  { label: 'Bilhete de Identidade', value: 'BI' },
                  { label: 'Cartão de Eleitor', value: 'CARTAO_ELEITOR' },
                  { label: 'Passaporte', value: 'PASSAPORTE' },
                  { label: 'Certidão de Nascimento', value: 'CERTIDAO_NASCIMENTO' },
                  { label: 'Outro', value: 'OUTRO' },
                  { label: 'Não possui documento', value: 'NAO_POSSUI' }
                ]}
                onChange={(value) => handleInputChange('tipoDocumento', value)}
                required
                errorMessage={errors.tipoDocumento}
                placeholder="Selecione o tipo"
                iconStart={<CreditCard size={18} />}
              />

              {shouldShowDocumentName() && (
                <CustomInput
                  type="text"
                  label="Nome do Documento"
                  value={formData.nomeOutroDocumento}
                  onChange={(value) => handleInputChange('nomeOutroDocumento', value)}
                  required
                  errorMessage={errors.nomeOutroDocumento}
                  placeholder="Digite o nome do documento"
                  iconStart={<FileText size={18} />}
                />
              )}

              {shouldShowDocumentNumber() && (
                <>
                  <div className="relative">
                    <CustomInput
                      type="text"
                      label="Número do Documento"
                      value={formData.numeroDocumento}
                      onChange={(value) => handleInputChange('numeroDocumento', value)}
                      required
                      errorMessage={errors.numeroDocumento}
                      placeholder="Digite o número"
                      iconStart={<CreditCard size={18} />}
                      helperText={formData.tipoDocumento?.value === 'BI' ? 'Digite o BI para consulta automática dos dados' : ''}
                    />
                    {consultingBI && (
                      <div className="absolute right-3 top-9 flex items-center">
                        <Loader size={16} className="animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-blue-600">Consultando...</span>
                      </div>
                    )}
                  </div>
                </>
              )}
              <CustomInput
                type="text"
                label="Nome do Produtor"
                value={formData.nomeProdutor}
                onChange={(value) => handleInputChange('nomeProdutor', value)}
                required
                errorMessage={errors.nomeProdutor}
                placeholder="Digite o nome"
                iconStart={<User size={18} />}
              />



              {/* <CustomInput
                type="text"
                label="Nome do Meio"
                value={formData.nomeDoMeioProdutor}
                onChange={(value) => handleInputChange('nomeDoMeioProdutor', value)}
                placeholder="Nome do meio (opcional)"
                iconStart={<User size={18} />}
              /> */}

              <CustomInput
                type="text"
                label="Sobrenome"
                value={formData.sobrenomeProdutor}
                onChange={(value) => handleInputChange('sobrenomeProdutor', value)}
                placeholder="Sobrenome"
                errorMessage={errors.sobrenomeProdutor}

                iconStart={<User size={18} />}
              />

              <CustomInput
                type="select"
                label="Gênero"
                value={formData.sexoProdutor}
                options={[
                  { label: 'MASCULINO', value: 'MASCULINO' },
                  { label: 'FEMININO', value: 'FEMININO' }
                ]}
                onChange={(value) => handleInputChange('sexoProdutor', value)}
                required
                errorMessage={errors.sexoProdutor}
                placeholder="Selecione o gênero"
                iconStart={<User size={18} />}
              />
              {formData.sexoProdutor?.value === 'FEMININO' && (
                <CustomInput
                  type="select"
                  label="Atualmente está grávida?"
                  value={formData.gravidez}
                  options={[
                    { label: 'Sim', value: true },
                    { label: 'Não', value: false }
                  ]}
                  onChange={(value) => handleInputChange('gravidez', value)}
                  placeholder="Selecione uma opção"
                  iconStart={<User size={18} />}
                />
              )}

              {/* Exemplo de campo multiselect pré-preenchido */}
              <CustomInput
                type="multiselect"
                label="Idiomas Falados"
                value={formData.idiomasFalados || [
                  { label: 'Português', value: 'PORTUGUES' },
                  { label: 'Umbundu', value: 'UMBUNDU' }
                ]}
                options={[
                  { label: 'Português', value: 'PORTUGUES' },
                  { label: 'Umbundu', value: 'UMBUNDU' },
                  { label: 'Kimbundu', value: 'KIMBUNDU' },
                  { label: 'Tchokwe', value: 'TCHOKWE' },
                  { label: 'Fiote', value: 'FIOTE' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('idiomasFalados', value)}
                placeholder="Selecione os idiomas"
                errorMessage={errors.idiomasFalados}
              />
              <CustomInput
                type="select"
                label="Estado Civil"
                value={formData.estadoCivil}
                options={[
                  { label: 'Solteiro(a)', value: 'SOLTEIRO' },
                  { label: 'União de facto', value: 'UNIAO_FACTO' },
                  { label: 'Casado(a)', value: 'CASADO' },
                  { label: 'Divorciado(a)', value: 'DIVORCIADO' },
                  { label: 'Separado(a)', value: 'SEPARADO' },
                  { label: 'Viúvo(a)', value: 'VIUVO' }
                ]}
                onChange={(value) => handleInputChange('estadoCivil', value)}
                placeholder="Selecione o estado civil"
                iconStart={<User size={18} />}
                errorMessage={errors.estadoCivil}
              />

              <CustomInput
                type="select"
                label="Lugar de Nascimento"
                value={formData.lugarNascimento}
                options={provinciasData.map(provincia => ({
                  label: provincia.nome,
                  value: provincia.nome
                }))}
                onChange={(value) => handleInputChange('lugarNascimento', value)}
                placeholder="Província de nascimento"
                iconStart={<MapPin size={18} />}
                errorMessage={errors.lugarNascimento}
              />

              <CustomInput
                type="date"
                label="Data de Nascimento"
                value={formData.dataNascimento}
                onChange={(value) => handleInputChange('dataNascimento', value)}
                required
                errorMessage={errors.dataNascimento}
                iconStart={<Calendar size={18} />}
                helperText={formData.dataNascimento ?
                  `Idade: ${calculateAge(formData.dataNascimento)} anos` :
                  'Idade mínima: 18 anos'
                }
              />

              <CustomInput
                type="tel"
                label="Telefone do Produtor"
                value={formData.telefoneProdutor}
                onChange={(value) => handleInputChange('telefoneProdutor', value)}
                required
                errorMessage={errors.telefoneProdutor}
                placeholder="Ex: 923456789"
                iconStart={<Phone size={18} />}
                maxLength={9}
              />

              <CustomInput
                type="select"
                label="Tipo de Organização"
                value={formData.tipoOrganizacao}
                options={[
                  { label: 'ECA', value: 'ECA' },
                  { label: 'Associação', value: 'ASSOCIACAO' },
                  { label: 'Cooperativa', value: 'COOPERATIVA' },
                  { label: 'Nenhuma', value: 'NENHUMA' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('tipoOrganizacao', value)}
                placeholder="Selecione o tipo"
                iconStart={<Building size={18} />}
              />

              {formData.tipoOrganizacao?.value === 'ECA' && (
                <>
                  <CustomInput
                    type="text"
                    label="Nome da ECA"
                    value={formData.nomeECA}
                    onChange={(value) => handleInputChange('nomeECA', value)}
                    placeholder="Nome da Escola de Campo"
                    iconStart={<Building size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Tipo de ECA"
                    value={formData.tipoECA}
                    options={[
                      { label: 'ECA de Agricultura', value: 'AGRICULTURA' },
                      { label: 'ECA de Pecuária', value: 'PECUARIA' },
                      { label: 'ECA de Piscicultura', value: 'PISCICULTURA' },
                      { label: 'ECA Mista', value: 'MISTA' }
                    ]}
                    onChange={(value) => handleInputChange('tipoECA', value)}
                    placeholder="Selecione o tipo de ECA"
                    iconStart={<Building size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Posição na ECA"
                    value={formData.posicaoECA}
                    options={[
                      { label: 'Chefe de Produção', value: 'CHEFE_PRODUCAO' },
                      { label: 'Presidente(a)', value: 'PRESIDENTE' },
                      { label: 'Secretário(a)', value: 'SECRETARIO' },
                      { label: 'Tesoureiro(a)', value: 'TESOUREIRO' },
                      { label: 'Vice-Presidente(a)', value: 'VICE_PRESIDENTE' },
                      { label: 'Não ocupa posição', value: 'NAO_OCUPA' }
                    ]}
                    onChange={(value) => handleInputChange('posicaoECA', value)}
                    placeholder="Selecione a posição"
                    iconStart={<Users size={18} />}
                  />
                </>
              )}

              {formData.tipoOrganizacao?.value === 'OUTRO' && (
                <CustomInput
                  type="text"
                  label="Especificar Outro Tipo"
                  value={formData.outroTipoOrganizacao}
                  onChange={(value) => handleInputChange('outroTipoOrganizacao', value)}
                  placeholder="Digite o tipo de organização"
                  iconStart={<FileText size={18} />}
                />
              )}







              {/* <CustomInput
                type="select"
                label="O número é de sua propriedade?"
                value={formData.telefonePropriedade}
                options={[
                  { label: 'Sim', value: true },
                  { label: 'Não', value: false }
                ]}
                onChange={(value) => handleInputChange('telefonePropriedade', value)}
                placeholder="Selecione uma opção"
                iconStart={<Phone size={18} />}
              /> */}

              {!formData.telefonePropriedade && (
                <CustomInput
                  type="text"
                  label="Quem possui este número?"
                  value={formData.proprietarioTelefone}
                  onChange={(value) => handleInputChange('proprietarioTelefone', value)}
                  placeholder="Nome do proprietário do telefone"
                  iconStart={<User size={18} />}
                />
              )}







              <CustomInput
                type="select"
                label="Nível de Escolaridade"
                value={formData.nivelEscolaridade}
                options={[
                  { label: 'Pré-escolar (3-5 anos)', value: 'PRE_ESCOLAR' },
                  { label: 'Ensino Primário', value: 'PRIMARIO' },
                  { label: 'Ensino Secundário', value: 'SECUNDARIO' },
                  { label: 'Ensino Superior', value: 'SUPERIOR' },
                  { label: 'Outro', value: 'OUTRO' },
                  { label: 'Nenhum', value: 'NENHUM' },
                  { label: 'Não sei', value: 'NAO_SEI' }
                ]}
                onChange={(value) => handleInputChange('nivelEscolaridade', value)}
                placeholder="Selecione o nível"
                iconStart={<User size={18} />}
              />

              {formData.nivelEscolaridade?.value === 'OUTRO' && (
                <CustomInput
                  type="text"
                  label="Especificar Outro Nível"
                  value={formData.outroNivelEscolaridade}
                  onChange={(value) => handleInputChange('outroNivelEscolaridade', value)}
                  placeholder="Digite o nível de escolaridade"
                  iconStart={<FileText size={18} />}
                />
              )}



              <CustomInput
                type="select"
                label="Tem alguma deficiência?"
                value={formData.deficiencia}
                options={[
                  { label: 'Sim', value: true },
                  { label: 'Não', value: false }
                ]}
                onChange={(value) => handleInputChange('deficiencia', value)}
                placeholder="Selecione uma opção"
                iconStart={<User size={18} />}
              />

              {(formData.deficiencia === true || formData.deficiencia?.value === true) && (
                <>
                  <CustomInput
                    type="select"
                    label="Tipo de Deficiência"
                    value={formData.tipoDeficiencia}
                    options={[
                      { label: 'Motora', value: 'MOTORA' },
                      { label: 'Visual', value: 'VISUAL' },
                      { label: 'Auditiva', value: 'AUDITIVA' },
                      { label: 'Mental', value: 'MENTAL' },
                      { label: 'Doença crónica', value: 'DOENCA_CRONICA' },
                      { label: 'Múltiplas deficiências', value: 'MULTIPLAS' },
                      { label: 'Outro', value: 'OUTRO' }
                    ]}
                    onChange={(value) => handleInputChange('tipoDeficiencia', value)}
                    placeholder="Selecione o tipo"
                    iconStart={<AlertCircle size={18} />}
                  />

                  {formData.tipoDeficiencia?.value === 'OUTRO' && (
                    <CustomInput
                      type="text"
                      label="Especificar Outra Deficiência"
                      value={formData.outraDeficiencia}
                      onChange={(value) => handleInputChange('outraDeficiencia', value)}
                      placeholder="Digite o tipo de deficiência"
                      iconStart={<FileText size={18} />}
                    />
                  )}
                </>
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
            </div>

            {errors.distribuicaoMembros && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    {errors.distribuicaoMembros}
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Home className="w-5 h-5 mr-2 text-orange-600" />
                  Informações Básicas
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="select"
                    label="O respondente é chefe do agregado familiar?"
                    value={formData.chefeAgregado}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('chefeAgregado', value)}
                    placeholder="Selecione uma opção"
                    iconStart={<Users size={18} />}
                  />

                  <CustomInput
                    type="number"
                    label="Total de Membros"
                    value={formData.totalMembros}
                    onChange={(value) => handleInputChange('totalMembros', parseInt(value) || 1)}
                    required
                    errorMessage={errors.totalMembros}
                    placeholder="Número total de pessoas"
                    iconStart={<Users size={18} />}
                    min="1"
                    helperText="Incluindo você mesmo"
                  />
                </div>

                {(formData.chefeAgregado === false || formData.chefeAgregado?.value === false) && (
                  <div className="mt-6 p-6 bg-yellow-50 rounded-xl border border-yellow-200">
                    <h5 className="text-md font-semibold text-yellow-800 mb-4">Informações do Chefe do Agregado</h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <CustomInput
                        type="text"
                        label="Nome do Chefe"
                        value={formData.nomeChefeAgregado}
                        onChange={(value) => handleInputChange('nomeChefeAgregado', value)}
                        placeholder="Nome completo"
                        errorMessage={errors.chefeAgregado}
                        iconStart={<User size={18} />}
                      />

                      <CustomInput
                        type="text"
                        label="Nome do Meio"
                        value={formData.nomeDoMeioChefe}
                        onChange={(value) => handleInputChange('nomeDoMeioChefe', value)}
                        placeholder="Nome do meio (opcional)"
                        iconStart={<User size={18} />}
                      />

                      <CustomInput
                        type="text"
                        label="Sobrenome"
                        value={formData.sobrenomeChefe}
                        onChange={(value) => handleInputChange('sobrenomeChefe', value)}
                        placeholder="Sobrenome"
                        iconStart={<User size={18} />}
                      />

                      <CustomInput
                        type="select"
                        label="Sexo do Chefe"
                        value={formData.sexoChefe}
                        options={[
                          { label: 'Masculino', value: 'MASCULINO' },
                          { label: 'Feminino', value: 'FEMININO' }
                        ]}
                        onChange={(value) => handleInputChange('sexoChefe', value)}
                        placeholder="Selecione o sexo"
                        iconStart={<User size={18} />}
                      />

                      <CustomInput
                        type="select"
                        label="Relação com o Chefe"
                        value={formData.relacaoChefe}
                        options={[
                          { label: 'Mulher ou marido', value: 'CONJUGE' },
                          { label: 'Filho(a)', value: 'FILHO' },
                          { label: 'Genro/nora', value: 'GENRO_NORA' },
                          { label: 'Neto(a)', value: 'NETO' },
                          { label: 'Pai/mãe', value: 'PAI_MAE' },
                          { label: 'Sogros', value: 'SOGROS' },
                          { label: 'Irmão/irmã', value: 'IRMAO' },
                          { label: 'Sobrinho(a)', value: 'SOBRINHO' },
                          { label: 'Outro parente', value: 'OUTRO_PARENTE' },
                          { label: 'Enteado(a)', value: 'ENTEADO' },
                          { label: 'Sem relação de parentesco', value: 'SEM_RELACAO' },
                          { label: 'Não sabe', value: 'NAO_SABE' }
                        ]}
                        onChange={(value) => handleInputChange('relacaoChefe', value)}
                        placeholder="Selecione a relação"
                        iconStart={<Users size={18} />}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-orange-600" />
                  Distribuição por Idade e Sexo
                </h4>

                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-blue-700 text-sm font-medium flex items-center">
                    <Info className="w-4 h-4 mr-2" />
                    Total definido: {formData.totalMembros || 1} membros |
                    Total distribuído: {getTotalMembrosDistribuidos()} membros |
                    Restante: {(formData.totalMembros || 1) - getTotalMembrosDistribuidos()} membros
                  </p>
                </div>

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
                        value={formData.femininoIdade0a6}
                        onChange={(value) => handleInputChange('femininoIdade0a6', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
                      />
                      <CustomInput
                        type="number"
                        label="Masculino"
                        value={formData.masculinoIdade0a6}
                        onChange={(value) => handleInputChange('masculinoIdade0a6', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
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
                        value={formData.femininoIdade7a18}
                        onChange={(value) => handleInputChange('femininoIdade7a18', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
                      />
                      <CustomInput
                        type="number"
                        label="Masculino"
                        value={formData.masculinoIdade7a18}
                        onChange={(value) => handleInputChange('masculinoIdade7a18', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
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
                        value={formData.femininoIdade19a60}
                        onChange={(value) => handleInputChange('femininoIdade19a60', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
                      />
                      <CustomInput
                        type="number"
                        label="Masculino"
                        value={formData.masculinoIdade19a60}
                        onChange={(value) => handleInputChange('masculinoIdade19a60', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
                      />
                    </div>
                  </div>

                  {/* 61+ anos */}
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                    <h5 className="font-semibold text-gray-700 mb-4 text-center flex items-center justify-center">
                      <Calendar1 className="w-5 h-5 mr-2 text-gray-600" />
                      61+ anos
                    </h5>
                    <div className="space-y-3">
                      <CustomInput
                        type="number"
                        label="Feminino"
                        value={formData.femininoIdade61mais}
                        onChange={(value) => handleInputChange('femininoIdade61mais', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
                      />
                      <CustomInput
                        type="number"
                        label="Masculino"
                        value={formData.masculinoIdade61mais}
                        onChange={(value) => handleInputChange('masculinoIdade61mais', parseInt(value) || 0)}
                        placeholder="0"
                        min="0"
                        max={formData.totalMembros}
                      />
                    </div>
                  </div>
                </div>

                {/* Resumo */}
                <div className="mt-6 p-4 bg-gray-50 rounded-xl">
                  <h5 className="font-semibold text-gray-700 mb-2 flex items-center">
                    <Users className="w-5 h-5 mr-2" />
                    Resumo do Agregado
                  </h5>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="text-center">
                      <span className="block font-semibold text-pink-600 text-lg">
                        {(formData.femininoIdade0a6 || 0) + (formData.femininoIdade7a18 || 0) +
                          (formData.femininoIdade19a60 || 0) + (formData.femininoIdade61mais || 0)}
                      </span>
                      <span className="text-gray-600">Total Feminino</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-semibold text-blue-600 text-lg">
                        {(formData.masculinoIdade0a6 || 0) + (formData.masculinoIdade7a18 || 0) +
                          (formData.masculinoIdade19a60 || 0) + (formData.masculinoIdade61mais || 0)}
                      </span>
                      <span className="text-gray-600">Total Masculino</span>
                    </div>
                    <div className="text-center">
                      <span className="block font-semibold text-purple-600 text-lg">
                        {(formData.femininoIdade0a6 || 0) + (formData.femininoIdade7a18 || 0) +
                          (formData.masculinoIdade0a6 || 0) + (formData.masculinoIdade7a18 || 0)}
                      </span>
                      <span className="text-gray-600">Menores (0-18)</span>
                    </div>
                    <div className="text-center">
                      <span className={`block font-semibold text-lg ${getTotalMembrosDistribuidos() > formData.totalMembros ? 'text-red-600' : 'text-green-600'
                        }`}>
                        {getTotalMembrosDistribuidos()}
                      </span>
                      <span className="text-gray-600">Total Distribuído</span>
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
                Informações sobre as actividades praticadas, terras cultiváveis e recursos agrícolas.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Wheat className="w-5 h-5 mr-2 text-green-600" />
                  Tipos de Actividades Praticadas
                </h4>
                <CustomInput
                  type="multiselect"
                  value={formData.tiposAtividades}
                  options={[
                    { label: 'Agricultura', value: 'AGRICULTURA' },
                    { label: 'Pecuária', value: 'PECUARIA' },
                    { label: 'Agropecuária', value: 'AGROPECUARIA' },
                    { label: 'Aquicultura', value: 'AQUICULTURA' },
                    { label: 'Produtos Florestais', value: 'FLORESTAIS' },
                    { label: 'Outro', value: 'OUTRO' }
                  ]}
                  onChange={(value) => handleInputChange('tiposAtividades', value)}
                  errorMessage={errors.tiposAtividades}
                />

                {formData.tiposAtividades && formData.tiposAtividades.includes('OUTRO') && (
                  <div className="mt-4">
                    <CustomInput
                      type="text"
                      label="Especificar Outro Tipo de Actividade"
                      value={formData.outroTipoAtividade}
                      onChange={(value) => handleInputChange('outroTipoAtividade', value)}
                      placeholder="Digite o tipo de catividade"
                      iconStart={<FileText size={18} />}
                    />
                  </div>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Map className="w-5 h-5 mr-2 text-green-600" />
                  Informações sobre Terras
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CustomInput
                    type="select"
                    label="Tem acesso a terras cultiváveis?"
                    value={formData.acessoTerras}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('acessoTerras', value)}
                    placeholder="Selecione uma opção"
                  />

                  {(formData.acessoTerras === true || formData.acessoTerras?.value === true) && (
                    <>
                      <CustomInput
                        type="select"
                        label="É proprietário da terra?"
                        value={formData.proprietarioTerra}
                        options={[
                          { label: 'Sim', value: true },
                          { label: 'Não', value: false }
                        ]}
                        onChange={(value) => handleInputChange('proprietarioTerra', value)}
                        placeholder="Selecione uma opção"
                      />

                      {(formData.proprietarioTerra === true || formData.proprietarioTerra?.value === true) && (
                        <>
                          <CustomInput
                            type="select"
                            label="Possui título de concessão?"
                            value={formData.tituloConcessao}
                            options={[
                              { label: 'Sim', value: true },
                              { label: 'Não', value: false }
                            ]}
                            onChange={(value) => handleInputChange('tituloConcessao', value)}
                            placeholder="Selecione uma opção"
                          />

                          {(formData.tituloConcessao === true || formData.tituloConcessao?.value === true) && (
                            <CustomInput
                              type="select"
                              label="Tipo de Documento"
                              value={formData.tipoTitulo}
                              options={[
                                { label: 'Direito consuetudinário', value: 'CONSUETUDINARIO' },
                                { label: 'Formalizado', value: 'FORMALIZADO' }
                              ]}
                              onChange={(value) => handleInputChange('tipoTitulo', value)}
                              placeholder="Selecione o tipo"
                            />
                          )}
                        </>
                      )}
                    </>
                  )}

                  <CustomInput
                    type="number"
                    label="Área Total dos Campos (ha)"
                    value={formData.areaTotalCampos}
                    onChange={(value) => handleInputChange('areaTotalCampos', parseFloat(value) || 0)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />

                  <CustomInput
                    type="number"
                    label="Área Explorada (ha)"
                    value={formData.areaExplorada}
                    onChange={(value) => handleInputChange('areaExplorada', parseFloat(value) || 0)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />

                  <CustomInput
                    type="number"
                    label="Área Agrícola (ha)"
                    value={formData.areaAgricola}
                    onChange={(value) => handleInputChange('areaAgricola', parseFloat(value) || 0)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />

                  <CustomInput
                    type="number"
                    label="Área Pecuária (ha)"
                    value={formData.areaPecuaria}
                    onChange={(value) => handleInputChange('areaPecuaria', parseFloat(value) || 0)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
                  />

                  <CustomInput
                    type="number"
                    label="Área Florestal (ha)"
                    value={formData.areaFlorestal}
                    onChange={(value) => handleInputChange('areaFlorestal', parseFloat(value) || 0)}
                    placeholder="0.0"
                    step="0.1"
                    min="0"
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
                    onChange={(value) => handleInputChange('tecnologiaAgricola', value)}
                    placeholder="Selecione o tipo"
                  />
                </div>
              </div>

              {/* Seção de Agricultura - só aparece se tiver agricultura */}
              {shouldShowAgriculture() && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Wheat className="w-5 h-5 mr-2 text-green-600" />
                    Culturas e Produção Agrícola
                  </h4>
                  <div className="mb-6">
                    <CustomInput
                      type="multiselect"
                      label="Culturas Principais"
                      value={formData.culturasPrincipais}
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
                      onChange={(value) => handleInputChange('culturasPrincipais', value)}
                    />

                    {formData.culturasPrincipais && formData.culturasPrincipais.includes('OUTRO') && (
                      <div className="mt-4">
                        <CustomInput
                          type="text"
                          label="Especificar Outra Cultura"
                          value={formData.outraCultura}
                          onChange={(value) => handleInputChange('outraCultura', value)}
                          placeholder="Digite o nome da cultura"
                          iconStart={<Wheat size={18} />}
                        />
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CustomInput
                      type="number"
                      label="Produção (sacos 50kg)"
                      value={formData.producaoSacos50kg}
                      onChange={(value) => handleInputChange('producaoSacos50kg', parseInt(value) || 0)}
                      placeholder="0"
                      min="0"
                    />

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
                      onChange={(value) => handleInputChange('tipoSementeira', value)}
                      placeholder="Selecione o tipo"
                    />

                    <CustomInput
                      type="select"
                      label="Uso de Fertilizantes"
                      value={formData.usoFertilizantes}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('usoFertilizantes', value)}
                      placeholder="Selecione uma opção"
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
                      onChange={(value) => handleInputChange('preparacaoTerra', value)}
                      placeholder="Selecione o tipo"
                    />
                  </div>
                </div>
              )}

              {/* Seção de Irrigação - só aparece se tiver agricultura */}
              {shouldShowAgriculture() && (
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Trees className="w-5 h-5 mr-2 text-blue-600" />
                    Sistema de Irrigação
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <CustomInput
                      type="select"
                      label="Acesso à Irrigação"
                      value={formData.acessoIrrigacao}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('acessoIrrigacao', value)}
                      placeholder="Selecione uma opção"
                    />

                    {(formData.acessoIrrigacao === true || formData.acessoIrrigacao?.value === true) && (
                      <>
                        <CustomInput
                          type="select"
                          label="Sistema de Irrigação"
                          value={formData.sistemaIrrigacao}
                          options={[
                            { label: 'Tipo 1', value: 'TIPO1' },
                            { label: 'Tipo 2', value: 'TIPO2' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('sistemaIrrigacao', value)}
                          placeholder="Selecione o sistema"
                        />

                        {formData.sistemaIrrigacao?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Sistema"
                            value={formData.outroSistemaIrrigacao}
                            onChange={(value) => handleInputChange('outroSistemaIrrigacao', value)}
                            placeholder="Digite o tipo de sistema"
                            iconStart={<FileText size={18} />}
                          />
                        )}

                        <CustomInput
                          type="number"
                          label="Distância da Fonte de Água (m)"
                          value={formData.distanciaFonteAgua}
                          onChange={(value) => handleInputChange('distanciaFonteAgua', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                      </>
                    )}
                  </div>
                </div>
              )}

              {/* Amanhos Culturais - só aparece se tiver agricultura */}
              {shouldShowAgriculture() && (
                <div className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                  <h5 className="text-lg font-semibold text-orange-800 mb-6 flex items-center">
                    <Wheat className="w-5 h-5 mr-2" />
                    Amanhos Culturais
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      type="select"
                      label="Realiza amanhos culturais?"
                      value={formData.amanhosCulturais}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('amanhosCulturais', value)}
                      placeholder="Selecione uma opção"
                    />

                    {(formData.amanhosCulturais === true || formData.amanhosCulturais?.value === true) && (
                      <div className="space-y-4">
                        <CustomInput
                          type="multiselect"
                          label="Tipos de Amanhos Culturais"
                          value={formData.tipoAmanhos}
                          options={[
                            { label: 'Adubação', value: 'ADUBACAO' },
                            { label: 'Amontoa', value: 'AMONTOA' },
                            { label: 'Sacha', value: 'SACHA' },
                            { label: 'Outros', value: 'OUTROS' }
                          ]}
                          onChange={(value) => handleInputChange('tipoAmanhos', value)}
                        />

                        {formData.tipoAmanhos && formData.tipoAmanhos.includes('OUTROS') && (
                          <CustomInput
                            type="text"
                            label="Especificar Outros Amanhos"
                            value={formData.outroTipoAmanho}
                            onChange={(value) => handleInputChange('outroTipoAmanho', value)}
                            placeholder="Digite outros tipos de amanhos"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Instrumentos e Insumos Agrícolas - só aparece se tiver agricultura */}
              {shouldShowAgriculture() && (
                <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                  <h5 className="text-lg font-semibold text-green-800 mb-6 flex items-center">
                    <Tractor className="w-5 h-5 mr-2" />
                    Instrumentos e Insumos Agrícolas
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      type="select"
                      label="Acesso a instrumentos e insumos agrícolas"
                      value={formData.acessoInstrumentos}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('acessoInstrumentos', value)}
                      placeholder="Selecione uma opção"
                    />

                    {(formData.acessoInstrumentos === true || formData.acessoInstrumentos?.value === true) && (
                      <div className="space-y-4">
                        <CustomInput
                          type="multiselect"
                          label="Fontes de Instrumentos e Insumos"
                          value={formData.fonteInstrumentos}
                          options={[
                            { label: 'Administração Pública', value: 'ADMINISTRACAO_PUBLICA' },
                            { label: 'Caixas comunitárias', value: 'CAIXAS_COMUNITARIAS' },
                            { label: 'Crédito agrícola', value: 'CREDITO_AGRICOLA' },
                            { label: 'Fundo próprio', value: 'FUNDO_PROPRIO' },
                            { label: 'Mercado aberto', value: 'MERCADO_ABERTO' },
                            { label: 'Outra', value: 'OUTRA' }
                          ]}
                          onChange={(value) => handleInputChange('fonteInstrumentos', value)}
                        />

                        {formData.fonteInstrumentos && formData.fonteInstrumentos.includes('OUTRA') && (
                          <CustomInput
                            type="text"
                            label="Especificar Outra Fonte"
                            value={formData.outraFonteInstrumento}
                            onChange={(value) => handleInputChange('outraFonteInstrumento', value)}
                            placeholder="Digite a fonte de instrumentos"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 5: // Pecuária
        if (!shouldShowLivestock()) {
          return (
            <div className="max-w-full mx-auto">
              <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 mb-8 border border-gray-200">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-gray-200 rounded-lg">
                    <Fish className="w-6 h-6 text-gray-500" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-600">Actividades Pecuárias</h3>
                </div>
                <p className="text-gray-500">
                  Esta seção só é exibida se você selecionou Pecuária ou Agropecuária nas atividades.
                </p>
              </div>
            </div>
          );
        }

        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-emerald-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Fish className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Actividades Pecuárias</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre criação de animais e actividades de pecuária do produtor.
              </p>
            </div>

            <div className="space-y-8">
              {/* Seleção de Tipos de Criação */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Fish className="w-5 h-5 mr-2 text-emerald-600" />
                  Tipos de Criação Praticados
                </h4>

                <CustomInput
                  type="multiselect"
                  value={formData.tiposCriacao}
                  options={[
                    { label: 'Avicultura', value: 'AVICULTURA' },
                    { label: 'Ovinocultura', value: 'OVINOCULTURA' },
                    { label: 'Piscicultura', value: 'PISCICULTURA' },
                    { label: 'Aquicultura', value: 'AQUICULTURA' },
                    { label: 'Caprinocultura', value: 'CAPRINOCULTURA' },
                    { label: 'Suinocultura', value: 'SUINOCULTURA' },
                    { label: 'Bovinocultura', value: 'BOVINOCULTURA' },
                    { label: 'Cunicultura', value: 'CUNICULTURA' },
                    { label: 'Outro', value: 'OUTRO' }
                  ]}
                  onChange={(value) => handleInputChange('tiposCriacao', value)}
                />

                {formData.tiposCriacao && formData.tiposCriacao.some(tipo =>
                  (typeof tipo === 'object' ? tipo.value : tipo) === 'OUTRO'
                ) && (
                    <div className="mt-4">
                      <CustomInput
                        type="text"
                        label="Especificar Outro Tipo de Criação"
                        value={formData.outroTipoCriacao}
                        onChange={(value) => handleInputChange('outroTipoCriacao', value)}
                        placeholder="Digite o tipo de criação"
                        iconStart={<FileText size={18} />}
                      />
                    </div>
                  )}
              </div>

              {/* Formulários Dinâmicos baseados na seleção */}
              {formData.tiposCriacao && formData.tiposCriacao.map((tipo, index) => {
                const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;

                if (tipoValue === 'AVICULTURA') {
                  return (
                    <div key={`avicultura-${index}`} className="bg-yellow-50 rounded-2xl p-6 border border-yellow-200">
                      <h5 className="text-lg font-semibold text-yellow-800 mb-6 flex items-center">
                        <Egg className="w-5 h-5 mr-2" />
                        Criação de Aves (Avicultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomInput
                          type="number"
                          label="Número de Aves"
                          value={formData.numeroAves}
                          onChange={(value) => handleInputChange('numeroAves', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Sistema de Avicultura"
                          value={formData.sistemaAvicultura}
                          options={[
                            { label: 'Em baterias', value: 'BATERIAS' },
                            { label: 'Em cama', value: 'CAMA' },
                            { label: 'Tradicional', value: 'TRADICIONAL' }
                          ]}
                          onChange={(value) => handleInputChange('sistemaAvicultura', value)}
                          placeholder="Selecione o sistema"
                        />
                        <CustomInput
                          type="select"
                          label="Objetivo da Produção"
                          value={formData.objetivoAvicultura}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Ovos', value: 'OVOS' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoAvicultura', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoAvicultura?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoAvicultura}
                            onChange={(value) => handleInputChange('outroObjetivoAvicultura', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                if (tipoValue === 'BOVINOCULTURA') {
                  return (
                    <div key={`bovinocultura-${index}`} className="bg-green-50 rounded-2xl p-6 border border-green-200">
                      <h5 className="text-lg font-semibold text-green-800 mb-6 flex items-center">
                        <Beef className="w-5 h-5 mr-2" />
                        Criação de Bovinos (Bovinocultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomInput
                          type="number"
                          label="Número de animais"
                          value={formData.numeroVacas}
                          onChange={(value) => handleInputChange('numeroVacas', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Sistema de Criação"
                          value={formData.sistemaBovinocultura}
                          options={[
                            { label: 'Estabulados', value: 'ESTABULADOS' },
                            { label: 'Em pastagem', value: 'PASTAGEM' },
                            { label: 'Em livre acesso', value: 'LIVRE_ACESSO' }
                          ]}
                          onChange={(value) => handleInputChange('sistemaBovinocultura', value)}
                          placeholder="Selecione o sistema"
                        />
                        <CustomInput
                          type="select"
                          label="Tipo de Criação"
                          value={formData.tipoBovinocultura}
                          options={[
                            { label: 'Intensivo', value: 'INTENSIVO' },
                            { label: 'Semi-intensivo', value: 'SEMI_INTENSIVO' },
                            { label: 'Extensivo', value: 'EXTENSIVO' }
                          ]}
                          onChange={(value) => handleInputChange('tipoBovinocultura', value)}
                          placeholder="Selecione o tipo"
                        />
                        <CustomInput
                          type="select"
                          label="Objetivo da Produção"
                          value={formData.objetivoBovinos}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Leite', value: 'LEITE' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoBovinos', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoBovinos?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoBovinos}
                            onChange={(value) => handleInputChange('outroObjetivoBovinos', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                if (tipoValue === 'OVINOCULTURA') {
                  return (
                    <div key={`ovinocultura-${index}`} className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                      <h5 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                        <Beef className="w-5 h-5 mr-2" />
                        Criação de Ovelhas (Ovinocultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomInput
                          type="number"
                          label="Número de Animais"
                          value={formData.numeroOvelhas}
                          onChange={(value) => handleInputChange('numeroOvelhas', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Sistema de Criação"
                          value={formData.sistemaOvinocultura}
                          options={[
                            { label: 'Estabulados', value: 'ESTABULADOS' },
                            { label: 'Em pastagem', value: 'PASTAGEM' },
                            { label: 'Em livre acesso', value: 'LIVRE_ACESSO' }
                          ]}
                          onChange={(value) => handleInputChange('sistemaOvinocultura', value)}
                          placeholder="Selecione o sistema"
                        />
                        <CustomInput
                          type="select"
                          label="Tipo de Criação"
                          value={formData.tipoOvinocultura}
                          options={[
                            { label: 'Intensivo', value: 'INTENSIVO' },
                            { label: 'Semi-intensivo', value: 'SEMI_INTENSIVO' },
                            { label: 'Extensivo', value: 'EXTENSIVO' }
                          ]}
                          onChange={(value) => handleInputChange('tipoOvinocultura', value)}
                          placeholder="Selecione o tipo"
                        />
                        <CustomInput
                          type="select"
                          label="Objectivo da Produção"
                          value={formData.objetivoOvinos}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Leite', value: 'LEITE' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoOvinos', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoOvinos?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoOvinos}
                            onChange={(value) => handleInputChange('outroObjetivoOvinos', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                if (tipoValue === 'CAPRINOCULTURA') {
                  return (
                    <div key={`caprinocultura-${index}`} className="bg-orange-50 rounded-2xl p-6 border border-orange-200">
                      <h5 className="text-lg font-semibold text-orange-800 mb-6 flex items-center">
                        <Beef className="w-5 h-5 mr-2" />
                        Criação de Animais (Caprinocultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomInput
                          type="number"
                          label="Número de Cabras"
                          value={formData.numeroCabras}
                          onChange={(value) => handleInputChange('numeroCabras', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Sistema de Criação"
                          value={formData.sistemaCaprinocultura}
                          options={[
                            { label: 'Estabulados', value: 'ESTABULADOS' },
                            { label: 'Em pastagem', value: 'PASTAGEM' },
                            { label: 'Em livre acesso', value: 'LIVRE_ACESSO' }
                          ]}
                          onChange={(value) => handleInputChange('sistemaCaprinocultura', value)}
                          placeholder="Selecione o sistema"
                        />
                        <CustomInput
                          type="select"
                          label="Tipo de Criação"
                          value={formData.tipoCaprinocultura}
                          options={[
                            { label: 'Intensivo', value: 'INTENSIVO' },
                            { label: 'Semi-intensivo', value: 'SEMI_INTENSIVO' },
                            { label: 'Extensivo', value: 'EXTENSIVO' }
                          ]}
                          onChange={(value) => handleInputChange('tipoCaprinocultura', value)}
                          placeholder="Selecione o tipo"
                        />
                        <CustomInput
                          type="select"
                          label="Objetivo da Produção"
                          value={formData.objetivoCaprinos}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Leite', value: 'LEITE' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoCaprinos', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoCaprinos?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoCaprinos}
                            onChange={(value) => handleInputChange('outroObjetivoCaprinos', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                if (tipoValue === 'SUINOCULTURA') {
                  return (
                    <div key={`suinocultura-${index}`} className="bg-pink-50 rounded-2xl p-6 border border-pink-200">
                      <h5 className="text-lg font-semibold text-pink-800 mb-6 flex items-center">
                        <Beef className="w-5 h-5 mr-2" />
                        Criação de Animais (Suinocultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomInput
                          type="number"
                          label="Número de Animais"
                          value={formData.numeroPorcos}
                          onChange={(value) => handleInputChange('numeroPorcos', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Objetivo da Produção"
                          value={formData.objetivoSuinos}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoSuinos', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoSuinos?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoSuinos}
                            onChange={(value) => handleInputChange('outroObjetivoSuinos', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                if (tipoValue === 'PISCICULTURA' || tipoValue === 'AQUICULTURA') {
                  const jaRenderizado = formData.tiposCriacao.some((t, i) =>
                    i < index && (
                      (typeof t === 'object' ? t.value : t) === 'PISCICULTURA' ||
                      (typeof t === 'object' ? t.value : t) === 'AQUICULTURA'
                    )
                  );

                  if (jaRenderizado) return null;
                  return (
                    <div key={`piscicultura-${index}`} className="bg-cyan-50 rounded-2xl p-6 border border-cyan-200">
                      <h5 className="text-lg font-semibold text-cyan-800 mb-6 flex items-center">
                        <Fish className="w-5 h-5 mr-2" />
                        Criação de Peixes (Piscicultura/Aquicultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 text-left">
                        <CustomInput
                          type="number"
                          label="Número de Peixes"
                          value={formData.numeroPeixes}
                          onChange={(value) => handleInputChange('numeroPeixes', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Tipo de Produção"
                          value={formData.tipoPiscicultura}
                          options={[
                            { label: 'Piscicultura industrial', value: 'INDUSTRIAL' },
                            { label: 'Pequena piscicultura informal integrada à agricultura familiar', value: 'INFORMAL_FAMILIAR' },
                            { label: 'Piscicultura de subsistência', value: 'SUBSISTENCIA' }
                          ]}
                          onChange={(value) => handleInputChange('tipoPiscicultura', value)}
                          placeholder="Selecione o tipo"
                        />
                        <CustomInput
                          type="select"
                          label="Objectivo da Produção"
                          value={formData.objetivoPiscicultura}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoPiscicultura', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoPiscicultura?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoPiscicultura}
                            onChange={(value) => handleInputChange('outroObjetivoPiscicultura', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                if (tipoValue === 'CUNICULTURA') {
                  return (
                    <div key={`cunicultura-${index}`} className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                      <h5 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                        <User className="w-5 h-5 mr-2" />
                        Criação de Animais (Cunicultura)
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <CustomInput
                          type="number"
                          label="Número de Coelhos"
                          value={formData.numeroCoelhos}
                          onChange={(value) => handleInputChange('numeroCoelhos', parseInt(value) || 0)}
                          placeholder="0"
                          min="0"
                        />
                        <CustomInput
                          type="select"
                          label="Objetivo da Produção"
                          value={formData.objetivoCoelhos}
                          options={[
                            { label: 'Carne', value: 'CARNE' },
                            { label: 'Outro', value: 'OUTRO' }
                          ]}
                          onChange={(value) => handleInputChange('objetivoCoelhos', value)}
                          placeholder="Selecione o objetivo"
                        />
                        {formData.objetivoCoelhos?.value === 'OUTRO' && (
                          <CustomInput
                            type="text"
                            label="Especificar Outro Objetivo"
                            value={formData.outroObjetivoCoelhos}
                            onChange={(value) => handleInputChange('outroObjetivoCoelhos', value)}
                            placeholder="Digite o objetivo"
                            iconStart={<FileText size={18} />}
                          />
                        )}
                      </div>
                    </div>
                  );
                }

                return null; // Para tipos não reconhecidos
              })}

              {/* Aspectos Gerais da Pecuária */}
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
                    onChange={(value) => handleInputChange('acessoRacao', value)}
                    placeholder="Selecione uma opção"
                  />

                  <CustomInput
                    type="select"
                    label="Conhecimento sobre Doenças Animais"
                    value={formData.conhecimentoDoencas}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('conhecimentoDoencas', value)}
                    placeholder="Selecione uma opção"
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
                Informações sobre acesso a crédito, instrumentos agrícolas e bens do agregado familiar.
              </p>
            </div>

            <div className="space-y-8">
              {/* Crédito */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h5 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Acesso a Crédito
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="select"
                    label="Já foi beneficiado com algum crédito?"
                    value={formData.beneficiadoCredito}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('beneficiadoCredito', value)}
                    placeholder="Selecione uma opção"
                    iconStart={<DollarSign size={18} />}
                    errorMessage={errors.beneficiadoCredito}
                  />

                  {(formData.beneficiadoCredito === true || formData.beneficiadoCredito?.value === true) && (
                    <div className="space-y-4">
                      <CustomInput
                        type="multiselect"
                        label="Fontes de Crédito"
                        value={formData.fontesCredito}
                        options={[
                          { label: 'FADA', value: 'FADA' },
                          { label: 'PDAC', value: 'PDAC' },
                          { label: 'MOSAP3', value: 'MOSAP3' },
                          { label: 'FRESAN', value: 'FRESAN' },
                          { label: 'SAMAP', value: 'SAMAP' },
                          { label: 'KWENDA', value: 'KWENDA' },
                          { label: 'Outros', value: 'OUTROS' }
                        ]}
                        onChange={(value) => handleInputChange('fontesCredito', value)}
                      />

                      {formData.fontesCredito && formData.fontesCredito.includes('OUTROS') && (
                        <CustomInput
                          type="text"
                          label="Especificar Outras Fontes de Crédito"
                          value={formData.outraFonteCredito}
                          onChange={(value) => handleInputChange('outraFonteCredito', value)}
                          placeholder="Digite outras fontes de crédito"
                          iconStart={<FileText size={18} />}
                        />
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Bens Patrimoniais */}
              <div className="bg-purple-50 rounded-2xl p-6 border border-purple-200">
                <h5 className="text-lg font-semibold text-purple-800 mb-6 flex items-center">
                  <Home className="w-5 h-5 mr-2" />
                  Bens do Agregado Familiar
                </h5>
                <p className="text-purple-700 mb-6">Selecione todos os bens que a família possui:</p>

                <CustomInput
                  type="multiselect"
                  value={formData.bensPatrimonio}
                  options={[
                    { label: 'Carro', value: 'CARRO' },
                    { label: 'Bicicleta', value: 'BICICLETA' },
                    { label: 'Motorizada 2 rodas', value: 'MOTORIZADA_2_RODAS' },
                    { label: 'Motorizada 3 rodas', value: 'MOTORIZADA_3_RODAS' },
                    { label: 'Carroça', value: 'CARROCA' },
                    { label: 'Colchão', value: 'COLCHAO' },
                    { label: 'Rádio', value: 'RADIO' },
                    { label: 'TV', value: 'TV' },
                    { label: 'Telefone portátil', value: 'TELEFONE_PORTATIL' },
                    { label: 'Placa solar', value: 'PLACA_SOLAR' },
                    { label: 'Sofá', value: 'SOFA' },
                    { label: 'Motobomba', value: 'MOTOBOMBA' },
                    { label: 'Gerador', value: 'GERADOR' },
                    { label: 'Teto de capim', value: 'TETO_CAPIM' },
                    { label: 'Teto de chapa de zinco', value: 'TETO_CHAPA_ZINCO' },
                    { label: 'Outro', value: 'OUTRO' }
                  ]}
                  onChange={(value) => handleInputChange('bensPatrimonio', value)}
                />

                {formData.bensPatrimonio && formData.bensPatrimonio.includes('OUTRO') && (
                  <div className="mt-4">
                    <CustomInput
                      type="text"
                      label="Especificar Outro Bem"
                      value={formData.outroBemPatrimonio}
                      onChange={(value) => handleInputChange('outroBemPatrimonio', value)}
                      placeholder="Digite o bem patrimonial"
                      iconStart={<FileText size={18} />}
                    />
                  </div>
                )}
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
                <h3 className="text-xl font-bold text-gray-800">Upload de Documentos</h3>
              </div>
              <p className="text-gray-600">
                Faça o upload dos documentos necessários para completar o cadastro no RNPA.
              </p>
            </div>

            <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium">
                    <strong>Documentos obrigatórios:</strong> Foto biométrica e documento de identificação (frente e verso)
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-indigo-600" />
                  Documentos do Produtor
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Foto Biométrica */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Foto Biométrica *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('fotoBiometrica', e.target.files[0])}
                        id="foto-biometrica-upload"
                      />
                      <label
                        htmlFor="foto-biometrica-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.fotoBiometrica
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoBiometrica ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.fotoBiometrica ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.fotoBiometrica ? 'Foto carregada' : 'Carregar foto biométrica'}
                        </p>
                        {uploadedFiles.fotoBiometrica && (
                          <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoBiometrica.name}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Foto Não Biométrica */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Foto Não Biométrica
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('fotoNaoBiometrica', e.target.files[0])}
                        id="foto-nao-biometrica-upload"
                      />
                      <label
                        htmlFor="foto-nao-biometrica-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.fotoNaoBiometrica
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoNaoBiometrica ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.fotoNaoBiometrica ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.fotoNaoBiometrica ? 'Foto carregada' : 'Carregar foto opcional'}
                        </p>
                        {uploadedFiles.fotoNaoBiometrica && (
                          <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoNaoBiometrica.name}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Documento Frente */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Documento - Frente *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('documentoFrente', e.target.files[0])}
                        id="documento-frente-upload"
                      />
                      <label
                        htmlFor="documento-frente-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.documentoFrente
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <IdCard className={`w-8 h-8 mb-3 ${uploadedFiles.documentoFrente ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.documentoFrente ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.documentoFrente ? 'Documento carregado' : 'Carregar documento frente'}
                        </p>
                        {uploadedFiles.documentoFrente && (
                          <p className="text-xs text-blue-500 mt-1">{uploadedFiles.documentoFrente.name}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Documento Verso */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Documento - Verso *
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.jpg,.jpeg,.png"
                        onChange={(e) => handleFileUpload('documentoVerso', e.target.files[0])}
                        id="documento-verso-upload"
                      />
                      <label
                        htmlFor="documento-verso-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.documentoVerso
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <IdCard className={`w-8 h-8 mb-3 ${uploadedFiles.documentoVerso ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.documentoVerso ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.documentoVerso ? 'Documento carregado' : 'Carregar documento verso'}
                        </p>
                        {uploadedFiles.documentoVerso && (
                          <p className="text-xs text-blue-500 mt-1">{uploadedFiles.documentoVerso.name}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Superfície Cultivada */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Foto da Superfície Cultivada
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('superficieCultivada', e.target.files[0])}
                        id="superficie-upload"
                      />
                      <label
                        htmlFor="superficie-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.superficieCultivada
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <Trees className={`w-8 h-8 mb-3 ${uploadedFiles.superficieCultivada ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.superficieCultivada ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.superficieCultivada ? 'Foto carregada' : 'Carregar foto da cultura'}
                        </p>
                        {uploadedFiles.superficieCultivada && (
                          <p className="text-xs text-blue-500 mt-1">{uploadedFiles.superficieCultivada.name}</p>
                        )}
                      </label>
                    </div>
                  </div>

                  {/* Fotos dos Animais */}
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Fotos dos Animais
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        multiple
                        onChange={(e) => handleFileUpload('fotosAnimais', e.target.files[0])}
                        id="animais-upload"
                      />
                      <label
                        htmlFor="animais-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.fotosAnimais
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                      >
                        <Fish className={`w-8 h-8 mb-3 ${uploadedFiles.fotosAnimais ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.fotosAnimais ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.fotosAnimais ? 'Fotos carregadas' : 'Carregar fotos dos animais'}
                        </p>
                        {uploadedFiles.fotosAnimais && (
                          <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotosAnimais.name}</p>
                        )}
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pacotes de Assistência */}
              <div className="bg-green-50 rounded-2xl p-6 border border-green-200">
                <h5 className="text-lg font-semibold text-green-800 mb-6 flex items-center">
                  <Tractor className="w-5 h-5 mr-2" />
                  Pacotes de Assistência
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="textarea"
                    label="Tipo de apoio que gostaria de receber"
                    value={formData.tipoApoio}
                    onChange={(value) => handleInputChange('tipoApoio', value)}
                    placeholder="Descreva o tipo de apoio desejado..."
                    rows={3}
                  />

                  <CustomInput
                    type="select"
                    label="Tipo de Pacote Escolhido"
                    value={formData.tipoPacote}
                    options={[
                      { label: 'Milho+Feijão+Galinha+Cabra+Vaca+Boi', value: 'PACOTE_1' },
                      { label: 'Massango+Feijão+Galinha+Cabrito+Ovelha+Boi', value: 'PACOTE_2' },
                      { label: 'Massambala+Feijão+Galinha+Cabrito+Ovelha+Boi', value: 'PACOTE_3' },
                      { label: 'Outro', value: 'OUTRO' }
                    ]}
                    onChange={(value) => handleInputChange('tipoPacote', value)}
                    placeholder="Selecione o pacote"
                  />

                  {formData.tipoPacote?.value === 'OUTRO' && (
                    <CustomInput
                      type="text"
                      label="Especificar Outro Pacote"
                      value={formData.outroTipoPacote}
                      onChange={(value) => handleInputChange('outroTipoPacote', value)}
                      placeholder="Digite o tipo de pacote"
                      iconStart={<FileText size={18} />}
                    />
                  )}
                </div>

                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Observações Gerais"
                    value={formData.observacoesGerais}
                    onChange={(value) => handleInputChange('observacoesGerais', value)}
                    placeholder="Informações adicionais sobre o produtor..."
                    rows={4}
                    maxLength={500}
                  />
                </div>
              </div>

              {/* Status dos arquivos obrigatórios */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h5 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                  Verificação de Documentos
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    {uploadedFiles.fotoBiometrica ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${uploadedFiles.fotoBiometrica ? 'text-green-700' : 'text-red-700'}`}>
                      Foto Biométrica {uploadedFiles.fotoBiometrica ? '(Carregada)' : '(Obrigatória)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {uploadedFiles.documentoFrente ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${uploadedFiles.documentoFrente ? 'text-green-700' : 'text-red-700'}`}>
                      Documento Frente {uploadedFiles.documentoFrente ? '(Carregado)' : '(Obrigatório)'}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    {uploadedFiles.documentoVerso ? (
                      <CheckCircle className="w-5 h-5 text-green-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${uploadedFiles.documentoVerso ? 'text-green-700' : 'text-red-700'}`}>
                      Documento Verso {uploadedFiles.documentoVerso ? '(Carregado)' : '(Obrigatório)'}
                    </span>
                  </div>
                </div>

                {(uploadedFiles.fotoBiometrica && uploadedFiles.documentoFrente && uploadedFiles.documentoVerso) && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                      <p className="text-green-700 text-sm font-medium">
                        Todos os documentos obrigatórios foram carregados. Você pode prosseguir com o cadastro.
                      </p>
                    </div>
                  </div>
                )}
              </div>
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
      // Substitua o objeto apiData no handleSubmit por este:
      const apiData = {
        // Seção A: Identificação do Inquiridor
        codigo_inquiridor: formData.codigo_inquiridor?.value || formData.codigo_inquiridor || '',
        nome_inquiridor: formData.nome_inquiridor || '',
        nome_meio: formData.nomeDoMeioInquiridor || '',
        sobrenome_inquiridor: formData.sobrenome_inquiridor || '',
        registration_date: formatDateForAPI(formData.dataRegisto),

        // Seção B: Identificação Geográfica
        Provincia: formData.provincia?.value || formData.provincia || '',
        Municipio: formData.municipio?.value || formData.municipio || '',
        comuna: formData.comuna || '',
        geo_level_4: formData.bairroAldeia || '',
        geo_level_5: formData.nomeSecao || '',
        geo_level_6: formData.localResidencia?.value || formData.localResidencia || '',
        gps_coordinates: `${formData.latitudeGPS || 0},${formData.longitudeGPS || 0}`,

        // Seção C: Consentimento e Biometria
        permissao: 'Sim',
        beneficiary_biometrics: '', // Arquivo
        beneficiary_photo: '', // Arquivo

        // Seção D: Membro já registrado
        membro_registrado: 'Não',
        codigo_familiar: 'N/A', // OBRIGATÓRIO - valor padrão

        // Seção E: Identificação do Produtor
        nome_produtor: formData.nomeProdutor || '',
        nome_meio_produtor: formData.nomeDoMeioProdutor || 'N/A', // OBRIGATÓRIO - valor padrão se vazio
        sobrenome_produtor: formData.sobrenomeProdutor || '',
        beneficiary_name: `${formData.nomeProdutor || ''} ${formData.nomeDoMeioProdutor || ''} ${formData.sobrenomeProdutor || ''}`.trim().replace(/\s+/g, ' '),

        // ECA/Organização
        E_4_Fazes_parte_de_uma_cooper: formData.tipoOrganizacao?.value === 'COOPERATIVA' ? 'Sim' : 'Não',
        posicao_eca: formData.posicaoECA?.value || formData.posicaoECA || 'N/A', // OBRIGATÓRIO - valor padrão
        tipo_organizacao: formData.tipoOrganizacao?.value || formData.tipoOrganizacao || 'NENHUMA',
        especificar_organizacao: formData.outroTipoOrganizacao || 'N/A', // OBRIGATÓRIO - valor padrão

        // Dados pessoais
        beneficiary_gender: formData.sexoProdutor?.value || formData.sexoProdutor || '',
        tipo_documento: formData.tipoDocumento?.value || formData.tipoDocumento || '',
        confirmar_documento: formData.numeroDocumento || '',
        foto_documento: '', // Arquivo
        beneficiary_phone_number: formData.telefoneProdutor || '',
        confirmar_telefone: formData.confirmarTelefoneProdutor || formData.telefoneProdutor || '',
        telefone_proprio: formData.telefonePropriedade ? 'Sim' : 'Não',
        dono_numero: formData.proprietarioTelefone || 'N/A', // OBRIGATÓRIO - valor padrão
        beneficiary_date_of_birth: formatDateForAPI(formData.dataNascimento),
        lugar_nascimento: formData.lugarNascimento?.value || formData.lugarNascimento || '',
        estado_civil: formData.estadoCivil?.value || formData.estadoCivil || '',
        nivel_escolaridade: formData.nivelEscolaridade?.value || formData.nivelEscolaridade || '',
        outro: formData.outroNivelEscolaridade || 'N/A', // OBRIGATÓRIO - valor padrão
        gravida: formData.gravidez ? 'Sim' : 'Não',
        possui_deficiencia: formData.deficiencia ? 'Sim' : 'Não',
        tipo_deficiencia: formData.tipoDeficiencia?.value || formData.tipoDeficiencia || '',

        // Seção F: Composição do Agregado Familiar
        chefe_familiar: formData.chefeAgregado ? 'Sim' : 'Não',
        nome_chefe: formData.nomeChefeAgregado || '',
        nome_meio_chefe: formData.nomeDoMeioChefe || '',
        sobrenome_chefe: formData.sobrenomeChefe || '',
        sexo_chefe: formData.sexoChefe?.value || formData.sexoChefe || '',
        tipo_doc_chefe: 'N/A', // OBRIGATÓRIO - valor padrão
        num_doc_chefe: 'N/A', // OBRIGATÓRIO - valor padrão
        confirmar_doc_chefe: 'N/A', // OBRIGATÓRIO - valor padrão
        num_tel_chefe: 'N/A', // OBRIGATÓRIO - valor padrão
        confirmar_tel_chefe: 'N/A', // OBRIGATÓRIO - valor padrão
        relacao_chefe: formData.relacaoChefe?.value || formData.relacaoChefe || '',
        total_agregado: formData.totalMembros?.toString() || '1',
        feminino_0_6: formData.femininoIdade0a6?.toString() || '0',
        masculino_0_6: formData.masculinoIdade0a6?.toString() || '0',
        feminino_7_18: formData.femininoIdade7a18?.toString() || '0',
        masculino_7_18: formData.masculinoIdade7a18?.toString() || '0',
        feminino_19_60: formData.femininoIdade19a60?.toString() || '0',
        masculino_19_60: formData.masculinoIdade19a60?.toString() || '0',
        feminino_61_mais: formData.femininoIdade61mais?.toString() || '0',
        masculino_61_mais: formData.masculinoIdade61mais?.toString() || '0',

        // Seção G: Ativos e Atividades
        atividades_produtor: Array.isArray(formData.tiposAtividades)
          ? formData.tiposAtividades.map(item => item.value || item).join(',')
          : formData.tiposAtividades || 'AGRICULTURA',
        outra_atividade: formData.outroTipoAtividade || 'N/A', // OBRIGATÓRIO - valor padrão

        // Informações sobre terras
        acesso_terra: formData.acessoTerras ? 'Sim' : 'Não',
        e_proprietario: formData.proprietarioTerra ? 'Sim' : 'Não',
        titulo_terra: formData.tituloConcessao ? 'Sim' : 'Não',
        tipo_doc_terra: formData.tipoTitulo?.value || formData.tipoTitulo || '',
        area_total: formData.areaTotalCampos?.toString() || '0',
        area_explorada: formData.areaExplorada?.toString() || '0',
        area_agricola: formData.areaAgricola?.toString() || '0',
        area_pecuaria: formData.areaPecuaria?.toString() || '0',
        area_florestal: formData.areaFlorestal?.toString() || '0',
        tecnologia_agricola: formData.tecnologiaAgricola?.value || formData.tecnologiaAgricola || '',

        // Culturas
        culturas_importantes: Array.isArray(formData.culturasPrincipais)
          ? formData.culturasPrincipais.map(item => item.value || item).join(',')
          : formData.culturasPrincipais || '',
        outra_cultura: formData.outraCultura || 'N/A', // OBRIGATÓRIO - valor padrão
        producao_sacos: formData.producaoSacos50kg?.toString() || '0',
        tipo_semanteira: formData.tipoSementeira?.value || formData.tipoSementeira || '',
        uso_fertilizante: formData.usoFertilizantes ? 'Sim' : 'Não',
        preparacao_terra: formData.preparacaoTerra?.value || formData.preparacaoTerra || '',

        // Irrigação
        acesso_irrigacao: formData.acessoIrrigacao ? 'Sim' : 'Não',
        sistema_irrigacao: formData.sistemaIrrigacao?.value || formData.sistemaIrrigacao || '',
        especificar_irrigacao: formData.outroSistemaIrrigacao || 'N/A', // OBRIGATÓRIO - valor padrão
        distancia_agua: formData.distanciaFonteAgua?.toString() || '0',

        // Amanhos culturais
        amanhos_culturais: formData.amanhosCulturais ? 'Sim' : 'Não',
        tipos_amanhos: Array.isArray(formData.tipoAmanhos)
          ? formData.tipoAmanhos.map(item => item.value || item).join(',')
          : formData.tipoAmanhos || '',
        especificar_amanhos: formData.outroTipoAmanho || 'N/A', // OBRIGATÓRIO - valor padrão

        // Instrumentos agrícolas
        acesso_insumoa_agricolas: formData.acessoInstrumentos ? 'Sim' : 'Não',
        fonte_insumos: Array.isArray(formData.fonteInstrumentos)
          ? formData.fonteInstrumentos.map(item => item.value || item).join(',')
          : formData.fonteInstrumentos || '',
        especificar_fonte: formData.outraFonteInstrumento || 'N/A', // OBRIGATÓRIO - valor padrão
        foto_superficie: '', // Arquivo

        // Seção H: Pecuária
        tipos_criacao: Array.isArray(formData.tiposCriacao)
          ? formData.tiposCriacao.map(item => item.value || item).join(',')
          : formData.tiposCriacao || '',
        outra_criacao: formData.outroTipoCriacao || '',

        // Avicultura
        sistema_avicultura: formData.sistemaAvicultura?.value || formData.sistemaAvicultura || '',
        objetivo_avicultura: formData.objetivoAvicultura?.value || formData.objetivoAvicultura || '',
        outro_obj_avicultura: formData.outroObjetivoAvicultura || 'N/A', // OBRIGATÓRIO - valor padrão
        numero_aves: formData.numeroAves?.toString() || '0',

        // Pecuária geral
        tipo_pecuaria: formData.sistemaBovinocultura?.value || formData.sistemaBovinocultura || '',
        manejo_pecuaria: formData.tipoBovinocultura?.value || formData.tipoBovinocultura || '',
        numero_cabras: formData.numeroCabras?.toString() || '0',
        numero_vacas: formData.numeroVacas?.toString() || '0',
        numero_ovelhas: formData.numeroOvelhas?.toString() || '0',
        objetivo_producao: formData.objetivoBovinos?.value || formData.objetivoBovinos || '',
        especificar_objetivo_producao: formData.outroObjetivoBovinos || 'N/A', // OBRIGATÓRIO - valor padrão

        // Suinocultura
        numero_porcos: formData.numeroPorcos?.toString() || '0',
        objetivo_suinocultura: formData.objetivoSuinos?.value || formData.objetivoSuinos || '',
        especificar_objetivo_suino: formData.outroObjetivoSuinos || 'N/A', // OBRIGATÓRIO - valor padrão

        // Aquicultura
        tipo_aquicultura: formData.tipoPiscicultura?.value || formData.tipoPiscicultura || '',
        objetivo_aquicultura: formData.objetivoPiscicultura?.value || formData.objetivoPiscicultura || '',
        especificar_objetivo_aquic: formData.outroObjetivoPiscicultura || 'N/A', // OBRIGATÓRIO - valor padrão
        numero_peixes: formData.numeroPeixes?.toString() || '0',

        // Cunicultura
        numero_coelhos: formData.numeroCoelhos?.toString() || '0',
        objetivo_coelho: formData.objetivoCoelhos?.value || formData.objetivoCoelhos || '',
        especificar_objetivo_coelhos: formData.outroObjetivoCoelhos || 'N/A', // OBRIGATÓRIO - valor padrão

        // Aspectos gerais pecuária
        acesso_racao: formData.acessoRacao ? 'Sim' : 'Não',
        conhecimento_doencas: formData.conhecimentoDoencas ? 'Sim' : 'Não',

        // Seção I: Crédito & Bens
        credito_beneficio: formData.beneficiadoCredito ? 'Sim' : 'Não',
        fonte_credito: Array.isArray(formData.fontesCredito)
          ? formData.fontesCredito.map(item => item.value || item).join(',')
          : formData.fontesCredito || '',
        especificar_credito: formData.outraFonteCredito || 'N/A', // OBRIGATÓRIO - valor padrão

        bens_familiares: Array.isArray(formData.bensPatrimonio)
          ? formData.bensPatrimonio.map(item => item.value || item).join(',')
          : formData.bensPatrimonio || '',
        especificar_bem: formData.outroBemPatrimonio || 'N/A', // OBRIGATÓRIO - valor padrão

        // Seção J: Pacotes de Assistência
        tipo_apoio: formData.tipoApoio || 'N/A', // OBRIGATÓRIO - valor padrão
        observacoes_gerais: formData.observacoesGerais || 'N/A', // OBRIGATÓRIO - valor padrão
        foto_observacao: '', // Arquivo
        tipo_patec: formData.tipoPacote?.value || formData.tipoPacote || 'N/A', // OBRIGATÓRIO - valor padrão
        especificar_patec: formData.outroTipoPacote || 'N/A', // OBRIGATÓRIO - valor padrão

        // Campos adicionais da especificação
        H_3_O_produtor_j_beneficiou_d: formData.beneficiadoCredito ? 'Sim' : 'Não',
        H3_1_Tipos_de_cr_ditos: Array.isArray(formData.fontesCredito)
          ? formData.fontesCredito.map(item => item.value || item).join(',')
          : formData.fontesCredito || '',
        Especifica_outro_tip_ito_que_o_beneficiou: formData.outraFonteCredito || 'N/A', // OBRIGATÓRIO - valor padrão

        // Arquivos (serão preenchidos no FormData)
        fotos_animais: '' // Arquivo
      };

      console.log('📋 Dados mapeados para enviar:', apiData);
      console.log('📅 Datas formatadas:', {
        registration_date: apiData.registration_date,
        beneficiary_date_of_birth: apiData.beneficiary_date_of_birth
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
        formDataToSend.append('beneficiary_biometrics', uploadedFiles.fotoBiometrica);
      }

      if (uploadedFiles.fotoNaoBiometrica) {
        formDataToSend.append('beneficiary_photo', uploadedFiles.fotoNaoBiometrica);
      }

      if (uploadedFiles.documentoFrente) {
        formDataToSend.append('foto_documento', uploadedFiles.documentoFrente);
      }

      if (uploadedFiles.documentoVerso) {
        formDataToSend.append('DocumentoVerso', uploadedFiles.documentoVerso);
      }

      if (uploadedFiles.superficieCultivada) {
        formDataToSend.append('foto_superficie', uploadedFiles.superficieCultivada);
      }

      if (uploadedFiles.fotosAnimais) {
        formDataToSend.append('fotos_animais', uploadedFiles.fotosAnimais);
      }

      if (uploadedFiles.fotoObservacao) {
        formDataToSend.append('foto_observacao', uploadedFiles.fotoObservacao);
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
        timeout: 120000,
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
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-lg">
            <h1 className="text-4xl font-bold mb-3 text-white">Registro de Produtor </h1>
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
                    index === activeIndex ? 'bg-blue-600 text-white shadow-lg' :
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

export default CadastroProdutor;