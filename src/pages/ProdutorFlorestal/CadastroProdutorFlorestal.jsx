import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  User,
  Trees,
  Leaf,
  FileText,
  AlertTriangle,
  Truck,
  Package,
  Paperclip,
  MapPin,
  Building,
  Home,
  Map,
  ChevronRight,
  ChevronLeft,
  Info,
  X,
  Shield,
  Upload,
  Camera,
  Video,
  CheckCircle,
  AlertCircle,
  Gavel,
  CreditCard
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
import provinciasData from '../../components/Provincias.json';
import ScrollToTop from '../../components/ScrollToTop';

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
}

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
                <strong>Localização da Área</strong><br />
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

const CadastroProdutorFlorestal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  //const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
//  const [errors, setErrors] = useState({});

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

  // Estado inicial
  const initialState = {
    // Inquiridor
    codigoInquiridor: '',
    nomeInquiridor: '',
    sobrenomeInquiridor: '',
    dataRegistro: '',

    // Produtor
    tipoProdutor: '',
    pessoaTipo: 'PF',
    nomeCompleto: '',
    razaoSocial: '',
    tipoDocumento: '',
    nomeOutroDocumento: '',
    numeroDocumento: '',
    nomeProdutor: '',
    sobrenomeProdutor: '',
    sexoProdutor: '',

    email: '',
    telefone: '',
    endereco: '',
    lugarNascimento: '',
    dataNascimento: '',
    telefoneProdutor: '',

    // Áreas
    areas: [{
      nome: 'Área Florestal Principal',
      tipo: { label: 'Privada', value: 'PRIVADA' },
      estadoConservacao: { label: 'Nativa', value: 'Nativa' },
      lat: '-8.956',
      lng: '13.234',
      provincia: { label: 'LUANDA', value: 'LUANDA' },
      municipio: { label: 'Belas', value: 'Belas' },
      comuna: 'Ramiros',
      bairroAldeia: 'Benfica'
    }],

    // Espécies
    especiesCatalogo: [{
      id: 'esp001',
      especie: [{ label: 'Eucalipto (Eucalyptus spp.)', value: 'eucalipto' }],
      status: { label: 'Exótica', value: 'exotica' }
    }],
    especiesPorArea: {},

    // Licenças
    licencas: [{
      tipo: 'Corte',
      estado: 'Aprovada',
      areaIndex: 0,
      validade_ini: '2025-01-01',
      validade_fim: '2025-12-31',
      qr_hash: '',
      nfc_uid: '',
      pdf_url: '',
      documentoUpload: null
    }],

    // Fiscalizações
    fiscalizacoes: [{
      licencaId: '0',
      dataInspecao: '2025-01-15',
      evidencias: [{ label: 'Foto', value: 'foto' }],
      resultado: 'conforme',
      descricaoInfracao: '',
      autoEmitido: 'nao',
      fotoUpload: null,
      videoUpload: null,
      lat: '-8.956',
      lng: '13.234'
    }],

    // Ocorrências
    ocorrencias: [{
      tipo: 'Queimada',
      fonte: 'App',
      status: 'Novo',
      descricao: 'Queimada controlada para limpeza da área',
      evidencias: [{ label: 'Foto', value: 'foto' }],
      fotoUpload: null,
      videoUpload: null,
      lat: '-8.956',
      lng: '13.234',
      areaIndex: 0,
    }],

    // Transportes
    transportes: [{
      licenseIndex: 0,
      origem_areaIndex: 0,
      destino: 'Luanda',
      placa: 'LD-45-67-AB',
      volume: '25',
      qr_hash: '',
      status: 'Autorizado'
    }],

    // Produtos
    produtos: [{
      especiesIds: [{ label: 'Eucalipto (Eucalyptus spp.)', value: 'eucalipto' }],
      volumeAnual: '100',
      origem_areaIndex: 0,
      destino: 'Mercado interno',
      rastreabilidade: '',
      documentosTransporte: null
    }],

    // Sanções
    sancoes: [{
      numeroAuto: 'AUTO-001234',
      data: '2025-01-10',
      tipoInfracao: 'Multa',
      valor: '50000',
      evidencias: [{ label: 'Foto', value: 'foto' }],
      fotoUpload: null,
      videoUpload: null,
      statusSancao: 'Pendente',
      areaIndex: 0,
    }]
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Inquiridor', icon: User },
    { label: 'Produtor', icon: User },
    { label: 'Áreas', icon: Trees },
    { label: 'Espécies', icon: Leaf },
    //{ label: 'Licenças', icon: FileText },
    //{ label: 'Fiscalização', icon: Shield },
    //{ label: 'Ocorrências', icon: AlertTriangle },
    { label: 'Transportes', icon: Truck },
    { label: 'Produtos', icon: Package },
   // { label: 'Sanções', icon: Gavel }
  ];

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

  const [consultingBI, setConsultingBI] = useState(false);
  const [biData, setBiData] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const consultarBI = async (biValue) => {
    if (!biValue || biValue.length < 9) return;

    setConsultingBI(true);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      const response = await fetch(`https://api.gov.ao/bi/v1/getBI?bi=${biValue}`, {
        method: 'GET',
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('Resposta da API BI:', data);

      if (response.ok && data.code === 200 && data.data) {
        const biInfo = data.data;
        setBiData(biInfo);

        let sexoMapeado = '';
        if (biInfo.gender_name) {
          const sexo = biInfo.gender_name.toLowerCase();
          if (sexo.includes('masculino') || sexo.includes('male')) {
            sexoMapeado = { label: 'MASCULINO', value: 'MASCULINO' };
          } else if (sexo.includes('feminino') || sexo.includes('female')) {
            sexoMapeado = { label: 'FEMININO', value: 'FEMININO' };
          }
        }

        let lugarNascimentoMapeado = '';
        if (biInfo.birth_province_name) {
          const provinciaEncontrada = provinciasData.find(provincia => 
            provincia.nome.toLowerCase().includes(biInfo.birth_province_name.toLowerCase())
          );
          
          if (provinciaEncontrada) {
            lugarNascimentoMapeado = { label: provinciaEncontrada.nome, value: provinciaEncontrada.nome };
          }
        }

        setFormData(prev => ({
          ...prev,
          nomeProdutor: biInfo.first_name || '',
          sobrenomeProdutor: biInfo.last_name || '',
          dataNascimento: biInfo.birth_date ? new Date(biInfo.birth_date).toISOString().split('T')[0] : '',
          lugarNascimento: lugarNascimentoMapeado,
          sexoProdutor: sexoMapeado,
        }));

        // Toast de sucesso
        showToast('success', 'BI Consultado', 'Dados do produtor preenchidos automaticamente!');
      } else {
        setBiData(null);
        if (data.code === 404) {
          showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI. Preencha manualmente.');
        } else {
          showToast('warn', 'BI inválido', 'Este BI não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      console.error('Erro ao consultar BI:', error);
      setBiData(null);
      showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Verifique sua conexão e tente novamente.');
    } finally {
      setConsultingBI(false);
    }
  };

  const handleInputChange = (field, value) => {
    // Lógica para número do documento (com consulta BI)
    if (field === 'numeroDocumento') {
      handleBIChange(value);
      return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinciaChange = (areaIndex, value) => {
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

    // Atualizar área específica
    const newAreas = [...formData.areas];
    newAreas[areaIndex] = { ...newAreas[areaIndex], provincia: value, municipio: '' };
    setFormData(prev => ({ ...prev, areas: newAreas }));
  };

  const addArea = () => {
    const newArea = {
      nome: `Área Florestal ${formData.areas.length + 1}`,
      tipo: { label: 'Privada', value: 'PRIVADA' },
      estadoConservacao: { label: 'Reflorestamento', value: 'Reflorestamento' },
      lat: '',
      lng: '',
      provincia: '',
      municipio: '',
      comuna: '',
      bairroAldeia: ''
    };
    setFormData(prev => ({ ...prev, areas: [...prev.areas, newArea] }));
  };

  const removeArea = (index) => {
    setFormData(prev => ({
      ...prev,
      areas: prev.areas.filter((_, i) => i !== index)
    }));
  };

  const updateArea = (index, field, value) => {
    const newAreas = [...formData.areas];
    newAreas[index] = { ...newAreas[index], [field]: value };
    setFormData(prev => ({ ...prev, areas: newAreas }));
  };

  const addEspecie = () => {
    const newEspecie = {
      id: Math.random().toString(36).slice(2, 10),
      especie: [{ label: 'Baobá (Adansonia digitata)', value: 'baoba' }],
      status: { label: 'Nativa', value: 'nativa' }
    };
    setFormData(prev => ({
      ...prev,
      especiesCatalogo: [...prev.especiesCatalogo, newEspecie]
    }));
  };

  const removeEspecie = (index) => {
    setFormData(prev => ({
      ...prev,
      especiesCatalogo: prev.especiesCatalogo.filter((_, i) => i !== index)
    }));
  };

  const updateEspecie = (index, field, value) => {
    const newEspecies = [...formData.especiesCatalogo];
    newEspecies[index] = { ...newEspecies[index], [field]: value };
    setFormData(prev => ({ ...prev, especiesCatalogo: newEspecies }));
  };

  const addLicenca = () => {
    const newLicenca = {
      tipo: 'Transporte',
      estado: 'Pendente',
      areaIndex: 0,
      validade_ini: '2025-01-01',
      validade_fim: '2025-12-31',
      qr_hash: '',
      nfc_uid: '',
      pdf_url: '',
      documentoUpload: null
    };
    setFormData(prev => ({ ...prev, licencas: [...prev.licencas, newLicenca] }));
  };

  const removeLicenca = (index) => {
    setFormData(prev => ({
      ...prev,
      licencas: prev.licencas.filter((_, i) => i !== index)
    }));
  };

  const updateLicenca = (index, field, value) => {
    const newLicencas = [...formData.licencas];
    newLicencas[index] = { ...newLicencas[index], [field]: value };
    setFormData(prev => ({ ...prev, licencas: newLicencas }));
  };

  const addFiscalizacao = () => {
    const newFiscalizacao = {
      licencaId: '0',
      dataInspecao: new Date().toISOString().split('T')[0],
      evidencias: [{ label: 'Localização GPS', value: 'gps' }],
      resultado: 'conforme',
      descricaoInfracao: '',
      autoEmitido: 'nao',
      fotoUpload: null,
      videoUpload: null,
      lat: '',
      lng: ''
    };
    setFormData(prev => ({ ...prev, fiscalizacoes: [...prev.fiscalizacoes, newFiscalizacao] }));
  };

  const removeFiscalizacao = (index) => {
    setFormData(prev => ({
      ...prev,
      fiscalizacoes: prev.fiscalizacoes.filter((_, i) => i !== index)
    }));
  };

  const updateFiscalizacao = (index, field, value) => {
    const newFiscalizacoes = [...formData.fiscalizacoes];
    newFiscalizacoes[index] = { ...newFiscalizacoes[index], [field]: value };
    setFormData(prev => ({ ...prev, fiscalizacoes: newFiscalizacoes }));
  };

  const addOcorrencia = () => {
    const newOcorrencia = {
      tipo: 'Queimada',
      fonte: 'App',
      status: 'Novo',
      descricao: 'Queimada controlada para limpeza da área',
      evidencias: [{ label: 'Foto', value: 'foto' }],
      fotoUpload: null,
      videoUpload: null,
      lat: '',
      lng: '',
      areaIndex: 0
    };
    setFormData(prev => ({ ...prev, ocorrencias: [...prev.ocorrencias, newOcorrencia] }));
  };

  const removeOcorrencia = (index) => {
    setFormData(prev => ({
      ...prev,
      ocorrencias: prev.ocorrencias.filter((_, i) => i !== index)
    }));
  };

  const updateOcorrencia = (index, field, value) => {
    const newOcorrencias = [...formData.ocorrencias];
    newOcorrencias[index] = { ...newOcorrencias[index], [field]: value };
    setFormData(prev => ({ ...prev, ocorrencias: newOcorrencias }));
  };

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
    setFormData(prev => ({ ...prev, transportes: [...prev.transportes, newTransporte] }));
  };

  const removeTransporte = (index) => {
    setFormData(prev => ({
      ...prev,
      transportes: prev.transportes.filter((_, i) => i !== index)
    }));
  };

  const updateTransporte = (index, field, value) => {
    const newTransportes = [...formData.transportes];
    newTransportes[index] = { ...newTransportes[index], [field]: value };
    setFormData(prev => ({ ...prev, transportes: newTransportes }));
  };

  const addProduto = () => {
    const newProduto = {
      especiesIds: [{ label: 'Baobá (Adansonia digitata)', value: 'baoba' }],
      volumeAnual: '75',
      origem_areaIndex: 0,
      destino: 'Exportação',
      rastreabilidade: '',
      documentosTransporte: null
    };
    setFormData(prev => ({ ...prev, produtos: [...prev.produtos, newProduto] }));
  };

  const removeProduto = (index) => {
    setFormData(prev => ({
      ...prev,
      produtos: prev.produtos.filter((_, i) => i !== index)
    }));
  };

  const updateProduto = (index, field, value) => {
    const newProdutos = [...formData.produtos];
    newProdutos[index] = { ...newProdutos[index], [field]: value };
    setFormData(prev => ({ ...prev, produtos: newProdutos }));
  };

  const addSancao = () => {
    const newSancao = {
      numeroAuto: `AUTO-${Date.now().toString().slice(-6)}`,
      data: new Date().toISOString().split('T')[0],
      tipoInfracao: 'Multa',
      valor: '50000',
      evidencias: [{ label: 'Foto', value: 'foto' }],
      fotoUpload: null,
      videoUpload: null,
      statusSancao: 'Pendente',
      areaIndex: 0
    };
    setFormData(prev => ({ ...prev, sancoes: [...prev.sancoes, newSancao] }));
  };

  const removeSancao = (index) => {
    setFormData(prev => ({
      ...prev,
      sancoes: prev.sancoes.filter((_, i) => i !== index)
    }));
  };

  const updateSancao = (index, field, value) => {
    const newSancoes = [...formData.sancoes];
    newSancoes[index] = { ...newSancoes[index], [field]: value };
    setFormData(prev => ({ ...prev, sancoes: newSancoes }));
  };

  // Função para preparar FormData para envio à API
  const prepareFormData = () => {
    const formDataToSend = new FormData();
    
    // Dados do Inquiridor
    formDataToSend.append('inquiridor.codigo', formData.codigoInquiridor?.value || '');
    formDataToSend.append('inquiridor.nome', formData.nomeInquiridor || '');
    formDataToSend.append('inquiridor.sobrenome', formData.sobrenomeInquiridor || '');
    formDataToSend.append('inquiridor.dataRegistro', formData.dataRegistro || '');
    
    // Dados do Produtor
    formDataToSend.append('produtor.tipoProdutor', formData.tipoProdutor?.value || '');
    formDataToSend.append('produtor.pessoaTipo', formData.pessoaTipo?.value || formData.pessoaTipo || '');
    formDataToSend.append('produtor.nomeCompleto', formData.nomeCompleto || '');
    formDataToSend.append('produtor.razaoSocial', formData.razaoSocial || '');
    formDataToSend.append('produtor.documentoTipo', formData.documentoTipo?.value || formData.documentoTipo || '');
    formDataToSend.append('produtor.documentoNumero', formData.documentoNumero || '');
    
    // Áreas
    formDataToSend.append('areas', JSON.stringify(formData.areas.map(area => ({
      nome: area.nome,
      tipo: area.tipo?.value || area.tipo,
      estadoConservacao: area.estadoConservacao?.value || area.estadoConservacao,
      provincia: area.provincia?.value || area.provincia,
      municipio: area.municipio?.value || area.municipio,
      comuna: area.comuna,
      bairroAldeia: area.bairroAldeia,
      latitude: area.lat,
      longitude: area.lng
    }))));
    
    // Espécies
    formDataToSend.append('especies', JSON.stringify(formData.especiesCatalogo.map(especie => ({
      especie: especie.especie?.value || especie.especie,
      status: especie.status?.value || especie.status
    }))));
    
    // Licenças
    formDataToSend.append('licencas', JSON.stringify(formData.licencas.map(licenca => ({
      tipo: licenca.tipo,
      estado: licenca.estado,
      areaIndex: licenca.areaIndex,
      validadeInicio: licenca.validade_ini,
      validadeFim: licenca.validade_fim,
      qrHash: licenca.qr_hash
    }))));
    
    // Fiscalizações
    formData.fiscalizacoes.forEach((fiscalizacao, index) => {
      formDataToSend.append(`fiscalizacoes[${index}].licencaId`, fiscalizacao.licencaId || '');
      formDataToSend.append(`fiscalizacoes[${index}].dataInspecao`, fiscalizacao.dataInspecao || '');
      formDataToSend.append(`fiscalizacoes[${index}].evidencias`, JSON.stringify(fiscalizacao.evidencias || []));
      formDataToSend.append(`fiscalizacoes[${index}].resultado`, fiscalizacao.resultado || '');
      formDataToSend.append(`fiscalizacoes[${index}].descricaoInfracao`, fiscalizacao.descricaoInfracao || '');
      formDataToSend.append(`fiscalizacoes[${index}].autoEmitido`, fiscalizacao.autoEmitido || '');
      
      if (fiscalizacao.fotoUpload) {
        formDataToSend.append(`fiscalizacoes[${index}].fotoUpload`, fiscalizacao.fotoUpload);
      }
      if (fiscalizacao.videoUpload) {
        formDataToSend.append(`fiscalizacoes[${index}].videoUpload`, fiscalizacao.videoUpload);
      }
    });
    
    // Ocorrências
    formData.ocorrencias.forEach((ocorrencia, index) => {
      formDataToSend.append(`ocorrencias[${index}].tipo`, ocorrencia.tipo || '');
      formDataToSend.append(`ocorrencias[${index}].fonte`, ocorrencia.fonte || '');
      formDataToSend.append(`ocorrencias[${index}].status`, ocorrencia.status || '');
      formDataToSend.append(`ocorrencias[${index}].descricao`, ocorrencia.descricao || '');
      
      if (ocorrencia.fotoUpload) {
        formDataToSend.append(`ocorrencias[${index}].fotoUpload`, ocorrencia.fotoUpload);
      }
      if (ocorrencia.videoUpload) {
        formDataToSend.append(`ocorrencias[${index}].videoUpload`, ocorrencia.videoUpload);
      }
    });
    
    // Transportes
    formDataToSend.append('transportes', JSON.stringify(formData.transportes.map(transporte => ({
      licenseIndex: transporte.licenseIndex,
      origemAreaIndex: transporte.origem_areaIndex,
      destino: transporte.destino,
      placa: transporte.placa,
      volume: transporte.volume,
      status: transporte.status
    }))));
    
    // Produtos
    formData.produtos.forEach((produto, index) => {
      formDataToSend.append(`produtos[${index}].especiesIds`, JSON.stringify(produto.especiesIds || []));
      formDataToSend.append(`produtos[${index}].volumeAnual`, produto.volumeAnual || '');
      formDataToSend.append(`produtos[${index}].origemAreaIndex`, produto.origem_areaIndex || 0);
      formDataToSend.append(`produtos[${index}].destino`, produto.destino || '');
      formDataToSend.append(`produtos[${index}].rastreabilidade`, produto.rastreabilidade || '');
      
      if (produto.documentosTransporte) {
        formDataToSend.append(`produtos[${index}].documentosTransporte`, produto.documentosTransporte);
      }
    });
    
    // Sanções
    formData.sancoes.forEach((sancao, index) => {
      formDataToSend.append(`sancoes[${index}].numeroAuto`, sancao.numeroAuto || '');
      formDataToSend.append(`sancoes[${index}].data`, sancao.data || '');
      formDataToSend.append(`sancoes[${index}].tipoInfracao`, sancao.tipoInfracao || '');
      formDataToSend.append(`sancoes[${index}].valor`, sancao.valor || '');
      formDataToSend.append(`sancoes[${index}].statusSancao`, sancao.statusSancao || '');
      
      if (sancao.fotoUpload) {
        formDataToSend.append(`sancoes[${index}].fotoUpload`, sancao.fotoUpload);
      }
      if (sancao.videoUpload) {
        formDataToSend.append(`sancoes[${index}].videoUpload`, sancao.videoUpload);
      }
    });
    
    return formDataToSend;
  };
  
  // Função para enviar dados para a API
  const handleSave = async () => {
    setSaving(true);
    
    try {
      const formDataToSend = prepareFormData();
      
      // Endpoint da API - substitua pela URL real
     // const API_ENDPOINT = process.env.REACT_APP_API_URL || 'https://api.exemplo.com/produtor-florestal';
      
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        body: formDataToSend,
        headers: {
          // Não definir Content-Type para FormData - o browser define automaticamente
          'Authorization': `Bearer ${localStorage.getItem('token') || ''}` // Se houver autenticação
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        alert('Cadastro salvo com sucesso!');
        console.log('Resposta da API:', result);
        
        // Opcional: resetar formulário ou redirecionar
        // setFormData(initialState);
        // setActiveIndex(0);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao salvar cadastro');
      }
    } catch (error) {
      console.error('Erro ao salvar:', error);
      alert(`Erro ao salvar cadastro: ${error.message}`);
    } finally {
      setSaving(false);
    }
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
                <h3 className="text-xl font-bold text-gray-800">Dados do Inquiridor</h3>
              </div>
              <p className="text-gray-600">
                Identificação do responsável pelo inquérito e registro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="select"
                label="Código do Inquiridor"
                value={formData.codigoInquiridor}
                options={[
                  { label: "INQ001 - João Silva", value: "INQ001" },
                  { label: "INQ002 - Maria Santos", value: "INQ002" },
                  { label: "INQ003 - Pedro Costa", value: "INQ003" }
                ]}
                onChange={(value) => {
                  handleInputChange('codigoInquiridor', value);
                  // Auto-preencher nome e sobrenome baseado na seleção
                  if (value?.value === 'INQ001') {
                    handleInputChange('nomeInquiridor', 'João');
                    handleInputChange('sobrenomeInquiridor', 'Silva');
                  } else if (value?.value === 'INQ002') {
                    handleInputChange('nomeInquiridor', 'Maria');
                    handleInputChange('sobrenomeInquiridor', 'Santos');
                  } else if (value?.value === 'INQ003') {
                    handleInputChange('nomeInquiridor', 'Pedro');
                    handleInputChange('sobrenomeInquiridor', 'Costa');
                  }
                }}
                required
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="text"
                label="Nome do Inquiridor"
                value={formData.nomeInquiridor}
                onChange={(value) => handleInputChange('nomeInquiridor', value)}
                disabled
                helperText="Preenchido automaticamente"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="text"
                label="Sobrenome"
                value={formData.sobrenomeInquiridor}
                onChange={(value) => handleInputChange('sobrenomeInquiridor', value)}
                disabled
                helperText="Preenchido automaticamente"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="date"
                label="Data de Registro"
                value={formData.dataRegistro}
                onChange={(value) => handleInputChange('dataRegistro', value)}
                required
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
             {/* <CustomInput
                type="select"
                label="Tipo do Produtor"
                value={formData.tipoProdutor}
                options={[
                  { label: "Agricultor", value: "agricultor" },
                  { label: "Entidade", value: "entidade" },
                  { label: "Estado", value: "estado" }
                ]}
                onChange={(value) => handleInputChange('tipoProdutor', value)}
                required
                iconStart={<User size={18} />}
              />

               <CustomInput
                type="select"
                label="Pessoa"
                value={formData.pessoaTipo}
                options={[
                  { label: "Pessoa Física", value: "PF" },
                  { label: "Pessoa Jurídica", value: "PJ" }
                ]}
                onChange={(value) => handleInputChange('pessoaTipo', value)}
                required
                iconStart={<User size={18} />}
              />*/ }

              {/* Campos para Pessoa Física */}
              {(formData.pessoaTipo?.value === "PF" || formData.pessoaTipo === "PF") && (
                <>
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
                    placeholder="Selecione o tipo"
                    iconStart={<CreditCard size={18} />}
                  />

                  {formData.tipoDocumento?.value === 'OUTRO' && (
                    <CustomInput
                      type="text"
                      label="Nome do Documento"
                      value={formData.nomeOutroDocumento}
                      onChange={(value) => handleInputChange('nomeOutroDocumento', value)}
                      required
                      placeholder="Digite o nome do documento"
                      iconStart={<FileText size={18} />}
                    />
                  )}

                  {formData.tipoDocumento?.value && formData.tipoDocumento?.value !== 'NAO_POSSUI' && (
                    <div className="relative">
                      <CustomInput
                        type="text"
                        label="Número do Documento"
                        value={formData.numeroDocumento}
                        onChange={(value) => handleInputChange('numeroDocumento', value)}
                        helperText={formData.tipoDocumento?.value === 'BI' ? 'Digite o BI para consulta automática dos dados' : ''}
                        required
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
                    value={formData.nomeProdutor}
                    onChange={(value) => handleInputChange('nomeProdutor', value)}
                    required
                    placeholder="Digite o nome"
                    iconStart={<User size={18} />}
                  />

                  <CustomInput
                    type="text"
                    label="Sobrenome"
                    value={formData.sobrenomeProdutor}
                    onChange={(value) => handleInputChange('sobrenomeProdutor', value)}
                    placeholder="Sobrenome"
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
                    placeholder="Selecione o gênero"
                    iconStart={<User size={18} />}
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
                  />

                  <CustomInput
                    type="date"
                    label="Data de Nascimento"
                    value={formData.dataNascimento}
                    onChange={(value) => handleInputChange('dataNascimento', value)}
                    required
                    iconStart={<User size={18} />}
                  />

                  <CustomInput
                    type="tel"
                    label="Telefone do Produtor"
                    value={formData.telefoneProdutor}
                    onChange={(value) => handleInputChange('telefoneProdutor', value)}
                    required
                    placeholder="Ex: 923456789"
                    iconStart={<User size={18} />}
                    maxLength={9}
                  />
                </>
              )}

              {/* Campos para Pessoa Jurídica */}
              {formData.pessoaTipo?.value === "PJ" && (
                <>
                  <CustomInput
                    type="text"
                    label="Razão Social"
                    value={formData.razaoSocial}
                    onChange={(value) => handleInputChange('razaoSocial', value)}
                    required
                    iconStart={<Building size={18} />}
                  />

                  {/*<CustomInput
                    type="text"
                    label="Número do CNPJ"
                    value={formData.numeroDocumento}
                    onChange={(value) => handleInputChange('numeroDocumento', value)}
                    required
                    iconStart={<FileText size={18} />}
                  />*/ }
                </>
              )}
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
              {formData.areas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma área cadastrada. Clique em "Adicionar Área" para começar.
                </div>
              )}

              {formData.areas.map((area, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeArea(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4 mb-6 ">
                    <CustomInput
                      type="text"
                      label="Nome da Área"
                      value={area.nome}
                      onChange={(value) => updateArea(index, 'nome', value)}
                      required
                      iconStart={<Trees size={18} />}
                    />

                    <CustomInput
                      type="select"
                      label="Tipo"
                      value={area.tipo}
                      options={[
                        { label: "Pública", value: "PUBLICA" },
                        { label: "Privada", value: "PRIVADA" }
                      ]}
                      onChange={(value) => updateArea(index, 'tipo', value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Estado de Conservação"
                      value={area.estadoConservacao}
                      options={[
                        { label: "Nativa", value: "Nativa" },
                        { label: "Reflorestamento", value: "Reflorestamento" },
                        { label: "Degradada", value: "Degradada" }
                      ]}
                      onChange={(value) => updateArea(index, 'estadoConservacao', value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Província"
                      value={area.provincia}
                      options={provinciasData.map(provincia => ({
                        label: provincia.nome,
                        value: provincia.nome.toUpperCase()
                      }))}
                      onChange={(value) => handleProvinciaChange(index, value)}
                      required
                      iconStart={<MapPin size={18} />}
                    /> 

                    <CustomInput
                      type="select"
                      label="Município"
                      value={area.municipio}
                      options={municipiosOptions}
                      onChange={(value) => updateArea(index, 'municipio', value)}
                      required
                      iconStart={<Map size={18} />}
                      disabled={!area.provincia}
                    />

                    <CustomInput
                      type="text"
                      label="Comuna/Distrito"
                      value={area.comuna}
                      onChange={(value) => updateArea(index, 'comuna', value)}
                      iconStart={<Building size={18} />}
                    />

                    <CustomInput
                      type="text"
                      label="Bairro/Aldeia"
                      value={area.bairroAldeia}
                      onChange={(value) => updateArea(index, 'bairroAldeia', value)}
                      required
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
                        step="any"
                      />
                      <CustomInput
                        type="number"
                        label="Longitude"
                        value={area.lng}
                        onChange={(value) => updateArea(index, 'lng', value)}
                        step="any"
                      />
                    </div>
                    <MapaGPS
                      latitude={area.lat}
                      longitude={area.lng}
                      onLocationSelect={(lat, lng) => {
                        updateArea(index, 'lat', lat);
                        updateArea(index, 'lng', lng);
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
              ))}

              <button
                onClick={addArea}
                className="w-full py-3 border-2 border-dashed border-green-300 rounded-xl text-green-600 hover:bg-green-50 transition-colors flex items-center justify-center"
              >
                <Trees className="w-5 h-5 mr-2" />
                Adicionar Área
              </button>
            </div>
          </div>
        );

      case 3: // Espécies
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Leaf className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Catálogo de Espécies</h3>
              </div>
              <p className="text-gray-600">
                Cadastre as espécies florestais presentes nas áreas.
              </p>
            </div>

            <div className="space-y-6">
              {formData.especiesCatalogo.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma espécie cadastrada. Clique em "Adicionar Espécie" para começar.
                </div>
              )}

              {formData.especiesCatalogo.map((especie, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeEspecie(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
                    <CustomInput
                      type="multiselect"
                      label="Espécie"
                      value={especie.especie || []}
                      options={especiesPredefinidas}
                      onChange={(value) => updateEspecie(index, 'especie', value)}
                      required
                      iconStart={<Leaf size={18} />}
                    />

                    <CustomInput
                      type="select"
                      label="Estado"
                      value={especie.status}
                      options={[
                        { label: "Nativa", value: "nativa" },
                        { label: "Exótica", value: "exotica" }
                      ]}
                      onChange={(value) => updateEspecie(index, 'status', value)}
                      required
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addEspecie}
                className="w-full py-3 border-2 border-dashed border-orange-300 rounded-xl text-orange-600 hover:bg-orange-50 transition-colors flex items-center justify-center"
              >
                <Leaf className="w-5 h-5 mr-2" />
                Adicionar Espécie
              </button>
            </div>
          </div>
        );

      case 4: // Licenças
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Licenças</h3>
              </div>
              <p className="text-gray-600">
                Gerencie as licenças relacionadas às atividades florestais.
              </p>
            </div>

            <div className="space-y-6">
              {formData.licencas.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma licença cadastrada. Clique em "Adicionar Licença" para começar.
                </div>
              )}

              {formData.licencas.map((licenca, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeLicenca(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                 

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <CustomInput
                      type="select"
                      label="Tipo"
                      value={licenca.tipo ? { label: licenca.tipo, value: licenca.tipo } : ''}
                      options={[
                        { label: "Corte", value: "Corte" },
                        { label: "Transporte", value: "Transporte" },
                        { label: "Carvão", value: "Carvão" },
                        { label: "PFNM- Produtos Florestais Não Madeiros", value: "PFNM" }
                      ]}
                      onChange={(value) => updateLicenca(index, 'tipo', value?.value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Estado"
                      value={licenca.estado ? { label: licenca.estado, value: licenca.estado } : ''}
                      options={[
                        { label: "Pendente", value: "Pendente" },
                        { label: "Aprovada", value: "Aprovada" },
                        { label: "Negada", value: "Negada" },
                        { label: "Suspensa", value: "Suspensa" },
                        { label: "Expirada", value: "Expirada" }
                      ]}
                      onChange={(value) => updateLicenca(index, 'estado', value?.value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Área Vinculada"
                      value={formData.areas[licenca.areaIndex] ? {
                        label: formData.areas[licenca.areaIndex]?.nome || `Área #${licenca.areaIndex + 1}`,
                        value: String(licenca.areaIndex)
                      } : ''}
                      options={formData.areas.map((area, i) => ({
                        label: area.nome || `Área #${i + 1}`,
                        value: String(i)
                      }))}
                      onChange={(value) => updateLicenca(index, 'areaIndex', Number(value?.value))}
                    />

                    <CustomInput
                      type="date"
                      label="Validade Início"
                      value={licenca.validade_ini}
                      onChange={(value) => updateLicenca(index, 'validade_ini', value)}
                    />

                    <CustomInput
                      type="date"
                      label="Validade Fim"
                      value={licenca.validade_fim}
                      onChange={(value) => updateLicenca(index, 'validade_fim', value)}
                    />

                   
                    <div className="space-y-4 w-full md:col-span-3">
                      <label className="block text-sm font-normal text-gray-700 text-left">
                        Carregar documento da licença
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => updateLicenca(index, 'documentoUpload', e.target.files[0])}
                          id={`licenca-docs-upload-${index}`}
                        />
                        <label
                          htmlFor={`licenca-docs-upload-${index}`}
                          className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                            licenca.documentoUpload
                              ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                              : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                          }`}
                        >
                          <FileText className={`w-8 h-8 mb-3 ${licenca.documentoUpload ? 'text-blue-500' : 'text-gray-400'}`} />
                          <p className={`text-sm font-medium ${licenca.documentoUpload ? 'text-blue-600' : 'text-gray-500'}`}>
                            {licenca.documentoUpload ? 'Documento carregado' : 'Carregar documento da licença'}
                          </p>
                          {licenca.documentoUpload && (
                            <p className="text-xs text-blue-500 mt-1">{licenca.documentoUpload.name}</p>
                          )}
                        </label>
                      </div>
                      <div className="text-xs text-gray-500">
                        Formatos aceitos: PDF, DOC, DOCX, JPG, PNG
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addLicenca}
                className="w-full py-3 border-2 border-dashed border-blue-300 rounded-xl text-blue-600 hover:bg-blue-50 transition-colors flex items-center justify-center"
              >
                <FileText className="w-5 h-5 mr-2" />
                Adicionar Licença
              </button>
            </div>
          </div>
        );

      case 5: // Fiscalização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Shield className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Fiscalização e Inspeções</h3>
              </div>
              <p className="text-gray-600">
                Registre as fiscalizações e inspeções realizadas nas licenças.
              </p>
            </div>

            <div className="space-y-6">
              {formData.fiscalizacoes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma fiscalização registrada. Clique em "Adicionar Fiscalização" para começar.
                </div>
              )}

              {formData.fiscalizacoes.map((fiscalizacao, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeFiscalizacao(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                 

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <CustomInput
                      type="select"
                      label="ID da Licença Fiscalizada"
                      value={fiscalizacao.licencaId && formData.licencas && formData.licencas.find((_, i) => String(i) === fiscalizacao.licencaId) ? {
                        label: `${formData.licencas[Number(fiscalizacao.licencaId)]?.tipo} (${formData.licencas[Number(fiscalizacao.licencaId)]?.estado})`,
                        value: fiscalizacao.licencaId
                      } : ''}
                      options={(formData.licencas || []).map((l, i) => ({
                        label: `${l.tipo} (${l.estado})`,
                        value: String(i)
                      }))}
                      onChange={(value) => updateFiscalizacao(index, 'licencaId', value?.value)}
                      required
                    />

                    <CustomInput
                      type="date"
                      label="Data da Inspeção"
                      value={fiscalizacao.dataInspecao}
                      onChange={(value) => updateFiscalizacao(index, 'dataInspecao', value)}
                      required
                    />

                    <CustomInput
                      type="multiselect"
                      label="Evidências"
                      value={fiscalizacao.evidencias}
                      options={[
                        { label: "Foto", value: "foto" },
                        { label: "Vídeo", value: "video" },
                        { label: "Localização GPS", value: "gps" }
                      ]}
                      onChange={(value) => updateFiscalizacao(index, 'evidencias', value)}
                    />

                    <CustomInput
                      type="select"
                      label="Resultado da Inspeção"
                      value={fiscalizacao.resultado ? { label: fiscalizacao.resultado, value: fiscalizacao.resultado } : ''}
                      options={[
                        { label: "Conforme", value: "conforme" },
                        { label: "Irregularidade", value: "irregularidade" }
                      ]}
                      onChange={(value) => updateFiscalizacao(index, 'resultado', value?.value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Auto Emitido?"
                      value={fiscalizacao.autoEmitido ? { label: fiscalizacao.autoEmitido, value: fiscalizacao.autoEmitido } : ''}
                      options={[
                        { label: "Sim", value: "Sim" },
                        { label: "Não", value: "Não" }
                      ]}
                      onChange={(value) => updateFiscalizacao(index, 'autoEmitido', value?.value)}
                      required
                    />

                    <div className="md:col-span-3">
                      <CustomInput
                        type="textarea"
                        label="Descrição da Infração"
                        value={fiscalizacao.descricaoInfracao}
                        onChange={(value) => updateFiscalizacao(index, 'descricaoInfracao', value)}
                        rows={3}
                      />
                    </div>

                    {/* Campos condicionais baseados nas evidências selecionadas */}
                    {Array.isArray(fiscalizacao.evidencias) && fiscalizacao.evidencias.length > 0 && (
                      <div className="md:col-span-3 space-y-4">
                        
                       <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                             {/* Campo de upload de foto */}
                        {fiscalizacao.evidencias.some(e => e.value === 'foto') && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 text-left">
                              Foto de Evidência
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => updateFiscalizacao(index, 'fotoUpload', e.target.files[0])}
                                id={`foto-upload-${index}`}
                              />
                              <label
                                htmlFor={`foto-upload-${index}`}
                                className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                  fiscalizacao.fotoUpload
                                    ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                              >
                                <Camera className={`w-8 h-8 mb-3 ${fiscalizacao.fotoUpload ? 'text-blue-500' : 'text-gray-400'}`} />
                                <p className={`text-sm font-medium ${fiscalizacao.fotoUpload ? 'text-blue-600' : 'text-gray-500'}`}>
                                  {fiscalizacao.fotoUpload ? 'Foto carregada' : 'Carregar foto'}
                                </p>
                                {fiscalizacao.fotoUpload && (
                                  <p className="text-xs text-blue-500 mt-1">{fiscalizacao.fotoUpload.name}</p>
                                )}
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Campo de upload de vídeo */}
                        {fiscalizacao.evidencias.some(e => e.value === 'video') && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 text-left">
                              Vídeo de Evidência
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                className="hidden"
                                accept="video/*"
                                onChange={(e) => updateFiscalizacao(index, 'videoUpload', e.target.files[0])}
                                id={`video-upload-${index}`}
                              />
                              <label
                                htmlFor={`video-upload-${index}`}
                                className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                  fiscalizacao.videoUpload
                                    ? 'bg-purple-50 border-purple-300 hover:bg-purple-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                }`}
                              >
                                <Video className={`w-8 h-8 mb-3 ${fiscalizacao.videoUpload ? 'text-purple-500' : 'text-gray-400'}`} />
                                <p className={`text-sm font-medium ${fiscalizacao.videoUpload ? 'text-purple-600' : 'text-gray-500'}`}>
                                  {fiscalizacao.videoUpload ? 'Vídeo carregado' : 'Carregar vídeo'}
                                </p>
                                {fiscalizacao.videoUpload && (
                                  <p className="text-xs text-purple-500 mt-1">{fiscalizacao.videoUpload.name}</p>
                                )}
                              </label>
                            </div>
                          </div>
                        )}
                       </div>

                        {/* Campos de localização GPS */}
                        {fiscalizacao.evidencias.some(e => e.value === 'gps') && (
                          <div className="bg-gray-50 rounded-xl p-4">
                            <h6 className="text-sm font-semibold mb-4 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                              Coordenadas GPS
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <CustomInput
                                type="number"
                                label="Latitude"
                                value={fiscalizacao.lat}
                                onChange={(value) => updateFiscalizacao(index, 'lat', value)}
                                step="any"
                              />
                              <CustomInput
                                type="number"
                                label="Longitude"
                                value={fiscalizacao.lng}
                                onChange={(value) => updateFiscalizacao(index, 'lng', value)}
                                step="any"
                              />
                            </div>
                            <MapaGPS
                              latitude={fiscalizacao.lat}
                              longitude={fiscalizacao.lng}
                              onLocationSelect={(lat, lng) => {
                                updateFiscalizacao(index, 'lat', lat);
                                updateFiscalizacao(index, 'lng', lng);
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
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={addFiscalizacao}
                className="w-full py-3 border-2 border-dashed border-indigo-300 rounded-xl text-indigo-600 hover:bg-indigo-50 transition-colors flex items-center justify-center"
              >
                <Shield className="w-5 h-5 mr-2" />
                Adicionar Fiscalização
              </button>
            </div>
          </div>
        );

      case 6: // Ocorrências
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8 border border-red-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ocorrências</h3>
              </div>
              <p className="text-gray-600">
                Registre ocorrências relacionadas às áreas florestais.
              </p>
            </div>

            <div className="space-y-6">
              {formData.ocorrencias.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma ocorrência registrada. Clique em "Adicionar Ocorrência" para começar.
                </div>
              )}

              {formData.ocorrencias.map((ocorrencia, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeOcorrencia(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <CustomInput
                      type="select"
                      label="Tipo"
                      value={ocorrencia.tipo ? { label: ocorrencia.tipo, value: ocorrencia.tipo } : ''}
                      options={[
                        { label: "Queimada", value: "Queimada" },
                        { label: "Desmatamento ilegal", value: "Desmatamento ilegal" },
                        { label: "Praga", value: "Praga" },
                        { label: "Enchente", value: "Enchente" },
                        { label: "Outros", value: "Outros" }
                      ]}
                      onChange={(value) => updateOcorrencia(index, 'tipo', value?.value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Modo de Submissão"
                      value={ocorrencia.fonte ? { label: ocorrencia.fonte, value: ocorrencia.fonte } : ''}
                      options={[
                        { label: "App", value: "App" },
                        { label: "SMS", value: "SMS" },
                        { label: "IVR", value: "IVR" }
                      ]}
                      onChange={(value) => updateOcorrencia(index, 'fonte', value?.value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Estado"
                      value={ocorrencia.status ? { label: ocorrencia.status, value: ocorrencia.status } : ''}
                      options={[
                        { label: "Novo", value: "Novo" },
                        { label: "Em Análise", value: "Em análise" },
                        { label: "Resolvido", value: "Resolvido" }
                      ]}
                      onChange={(value) => updateOcorrencia(index, 'status', value?.value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Área Afetada"
                      value={formData.areas[ocorrencia.areaIndex] ? {
                        label: formData.areas[ocorrencia.areaIndex]?.nome || `Área #${ocorrencia.areaIndex + 1}`,
                        value: String(ocorrencia.areaIndex)
                      } : ''}
                      options={formData.areas.map((area, i) => ({
                        label: area.nome || `Área #${i + 1}`,
                        value: String(i)
                      }))}
                      onChange={(value) => updateOcorrencia(index, 'areaIndex', Number(value?.value))}
                      required
                    />

                    <CustomInput
                      type="multiselect"
                      label="Evidências"
                      value={ocorrencia.evidencias}
                      options={[
                        { label: "Foto", value: "foto" },
                        { label: "Vídeo", value: "video" }
                      ]}
                      onChange={(value) => updateOcorrencia(index, 'evidencias', value)}
                    />

                    <div className="md:col-span-3">
                      <CustomInput
                        type="textarea"
                        label="Descrição"
                        value={ocorrencia.descricao}
                        onChange={(value) => updateOcorrencia(index, 'descricao', value)}
                        rows={3}
                      />
                    </div>

                    {/* Campos condicionais baseados nas evidências selecionadas */}
                    {Array.isArray(ocorrencia.evidencias) && ocorrencia.evidencias.length > 0 && (
                      <div className="md:col-span-3 space-y-4">
                        
                       <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                             {/* Campo de upload de foto */}
                        {ocorrencia.evidencias.some(e => e.value === 'foto') && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 text-left">
                              Foto de Evidência
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                className="hidden"
                                accept="image/*"
                                onChange={(e) => updateOcorrencia(index, 'fotoUpload', e.target.files[0])}
                                id={`ocorrencia-foto-upload-${index}`}
                              />
                              <label
                                htmlFor={`ocorrencia-foto-upload-${index}`}
                                className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                  ocorrencia.fotoUpload
                                    ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                }`}
                              >
                                <Camera className={`w-8 h-8 mb-3 ${ocorrencia.fotoUpload ? 'text-blue-500' : 'text-gray-400'}`} />
                                <p className={`text-sm font-medium ${ocorrencia.fotoUpload ? 'text-blue-600' : 'text-gray-500'}`}>
                                  {ocorrencia.fotoUpload ? 'Foto carregada' : 'Carregar foto'}
                                </p>
                                {ocorrencia.fotoUpload && (
                                  <p className="text-xs text-blue-500 mt-1">{ocorrencia.fotoUpload.name}</p>
                                )}
                              </label>
                            </div>
                          </div>
                        )}

                        {/* Campo de upload de vídeo */}
                        {ocorrencia.evidencias.some(e => e.value === 'video') && (
                          <div className="space-y-4">
                            <label className="block text-sm font-semibold text-gray-700 text-left">
                              Vídeo de Evidência
                            </label>
                            <div className="relative">
                              <input
                                type="file"
                                className="hidden"
                                accept="video/*"
                                onChange={(e) => updateOcorrencia(index, 'videoUpload', e.target.files[0])}
                                id={`ocorrencia-video-upload-${index}`}
                              />
                              <label
                                htmlFor={`ocorrencia-video-upload-${index}`}
                                className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                  ocorrencia.videoUpload
                                    ? 'bg-purple-50 border-purple-300 hover:bg-purple-100'
                                    : 'bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                }`}
                              >
                                <Video className={`w-8 h-8 mb-3 ${ocorrencia.videoUpload ? 'text-purple-500' : 'text-gray-400'}`} />
                                <p className={`text-sm font-medium ${ocorrencia.videoUpload ? 'text-purple-600' : 'text-gray-500'}`}>
                                  {ocorrencia.videoUpload ? 'Vídeo carregado' : 'Carregar vídeo'}
                                </p>
                                {ocorrencia.videoUpload && (
                                  <p className="text-xs text-purple-500 mt-1">{ocorrencia.videoUpload.name}</p>
                                )}
                              </label>
                            </div>
                          </div>
                        )}
                       </div>
                      </div>
                    )}

                   <div className="bg-gray-50 rounded-xl p-4 w-full md:col-span-3">
                            <h6 className="text-sm font-semibold mb-4 flex items-center">
                              <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                              Coordenadas GPS
                            </h6>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <CustomInput
                                type="number"
                                label="Latitude"
                                value={ocorrencia.lat}
                                onChange={(value) => updateOcorrencia(index, 'lat', value)}
                                step="any"
                              />
                              <CustomInput
                                type="number"
                                label="Longitude"
                                value={ocorrencia.lng}
                                onChange={(value) => updateOcorrencia(index, 'lng', value)}
                                step="any"
                              />
                            </div>
                            <MapaGPS
                              latitude={ocorrencia.lat}
                              longitude={ocorrencia.lng}
                              onLocationSelect={(lat, lng) => {
                                updateOcorrencia(index, 'lat', lat);
                                updateOcorrencia(index, 'lng', lng);
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
                </div>
              ))}

              <button
                onClick={addOcorrencia}
                className="w-full py-3 border-2 border-dashed border-red-300 rounded-xl text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
              >
                <AlertTriangle className="w-5 h-5 mr-2" />
                Adicionar Ocorrência
              </button>
            </div>
          </div>
        );

      case 7: // Transportes
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Truck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Permissões de Transporte</h3>
              </div>
              <p className="text-gray-600">
                Gerencie as permissões de transporte de produtos florestais.
              </p>
            </div>

            <div className="space-y-6">
              {formData.transportes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum transporte cadastrado. Clique em "Adicionar Transporte" para começar.
                </div>
              )}

              {formData.transportes.map((transporte, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeTransporte(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <CustomInput
                      type="select"
                      label="Licença (opcional)"
                      value={transporte.licenseIndex !== null && formData.licencas[transporte.licenseIndex] ? {
                        label: `${formData.licencas[transporte.licenseIndex]?.tipo} (${formData.licencas[transporte.licenseIndex]?.estado})`,
                        value: String(transporte.licenseIndex)
                      } : { label: "—", value: "" }}
                      options={[
                        { label: "—", value: "" },
                        ...formData.licencas.map((l, i) => ({
                          label: `${l.tipo} (${l.estado})`,
                          value: String(i)
                        }))
                      ]}
                      onChange={(value) => updateTransporte(index, 'licenseIndex', value?.value === "" ? null : Number(value?.value))}
                    />

                    <CustomInput
                      type="select"
                      label="Área de Origem"
                      value={formData.areas[transporte.origem_areaIndex] ? {
                        label: formData.areas[transporte.origem_areaIndex]?.nome || `Área #${transporte.origem_areaIndex + 1}`,
                        value: String(transporte.origem_areaIndex)
                      } : ''}
                      options={formData.areas.map((a, i) => ({
                        label: a.nome || `Área #${i + 1}`,
                        value: String(i)
                      }))}
                      onChange={(value) => updateTransporte(index, 'origem_areaIndex', Number(value?.value))}
                    />

                    <CustomInput
                      type="text"
                      label="Destino"
                      value={transporte.destino}
                      onChange={(value) => updateTransporte(index, 'destino', value)}
                      iconStart={<MapPin size={18} />}
                    />

                    <CustomInput
                      type="text"
                      label="Placa"
                      value={transporte.placa}
                      onChange={(value) => updateTransporte(index, 'placa', value)}
                      iconStart={<Truck size={18} />}
                    />

                    <CustomInput
                      type="number"
                      label="Volume (m³)"
                      value={transporte.volume}
                      onChange={(value) => updateTransporte(index, 'volume', value)}
                    />

                    <CustomInput
                      type="select"
                      label="Estado da Permissão"
                      value={transporte.status ? { label: transporte.status, value: transporte.status } : ''}
                      options={[
                        { label: "Autorizado", value: "Autorizado" },
                        { label: "Recusado", value: "Recusado" },
                        { label: "Em Análise", value: "Em Análise" }
                      ]}
                      onChange={(value) => updateTransporte(index, 'status', value?.value)}
                    />
                  </div>
                </div>
              ))}

              <button
                onClick={addTransporte}
                className="w-full py-3 border-2 border-dashed border-purple-300 rounded-xl text-purple-600 hover:bg-purple-50 transition-colors flex items-center justify-center"
              >
                <Truck className="w-5 h-5 mr-2" />
                Adicionar Transporte
              </button>
            </div>
          </div>
        );

      case 8: // Produtos
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl p-6 mb-8 border border-yellow-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Package className="w-6 h-6 text-yellow-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Lotes de Produtos</h3>
              </div>
              <p className="text-gray-600">
                Gerencie os lotes de produtos florestais.
              </p>
            </div>

            <div className="space-y-6">
              {formData.produtos.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhum produto cadastrado. Clique em "Adicionar Produto" para começar.
                </div>
              )}

              {formData.produtos.map((produto, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeProduto(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <CustomInput
                      type="multiselect"
                      label="Espécie Produzida"
                      value={produto.especiesIds}
                      options={especiesPredefinidas}
                      onChange={(value) => updateProduto(index, 'especiesIds', value)}
                      required
                    />

                    <CustomInput
                      type="number"
                      label="Volume Anual (m³)"
                      value={produto.volumeAnual}
                      onChange={(value) => updateProduto(index, 'volumeAnual', value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Origem (Área)"
                      value={formData.areas[produto.origem_areaIndex] ? {
                        label: formData.areas[produto.origem_areaIndex]?.nome || `Área #${produto.origem_areaIndex + 1}`,
                        value: String(produto.origem_areaIndex)
                      } : ''}
                      options={formData.areas.map((a, i) => ({
                        label: a.nome || `Área #${i + 1}`,
                        value: String(i)
                      }))}
                      onChange={(value) => updateProduto(index, 'origem_areaIndex', Number(value?.value))}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Destino"
                      value={produto.destino ? { label: produto.destino, value: produto.destino } : ''}
                      options={[
                        { label: "Mercado interno", value: "Mercado interno" },
                        { label: "Exportação", value: "Exportação" }
                      ]}
                      onChange={(value) => updateProduto(index, 'destino', value?.value)}
                      required
                    />

                   

                    <div className="space-y-4 w-full md:col-span-3">
                      <label className="block text-sm font-semibold text-gray-700 text-left">
                        Documentos de Transporte
                      </label>
                      <div className="relative">
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx"
                          onChange={(e) => updateProduto(index, 'documentosTransporte', e.target.files[0])}
                          id={`produto-docs-upload-${index}`}
                        />
                        <label
                          htmlFor={`produto-docs-upload-${index}`}
                          className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                            produto.documentosTransporte
                              ? 'bg-green-50 border-green-300 hover:bg-green-100'
                              : 'bg-gray-50 border-gray-300 hover:border-green-400 hover:bg-green-50'
                          }`}
                        >
                          <FileText className={`w-8 h-8 mb-3 ${produto.documentosTransporte ? 'text-green-500' : 'text-gray-400'}`} />
                          <p className={`text-sm font-medium ${produto.documentosTransporte ? 'text-green-600' : 'text-gray-500'}`}>
                            {produto.documentosTransporte ? 'Documento carregado' : 'Carregar documento'}
                          </p>
                          {produto.documentosTransporte && (
                            <p className="text-xs text-green-500 mt-1">{produto.documentosTransporte.name}</p>
                          )}
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              <button
                onClick={addProduto}
                className="w-full py-3 border-2 border-dashed border-yellow-300 rounded-xl text-yellow-600 hover:bg-yellow-50 transition-colors flex items-center justify-center"
              >
                <Package className="w-5 h-5 mr-2" />
                Adicionar Produto
              </button>
            </div>
          </div>
        );

      case 9: // Sanções
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
                Registre as sanções e autos de infração aplicados ao produtor florestal.
              </p>
            </div>

            <div className="space-y-6">
              {formData.sancoes.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Nenhuma sanção registrada. Clique em "Adicionar Sanção" para começar.
                </div>
              )}

              {formData.sancoes.map((sancao, index) => (
                <div key={index} className="bg-white rounded-2xl border border-gray-200 p-6 relative">
                  <button
                    onClick={() => removeSancao(index)}
                    className="absolute -top-3 -right-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <X size={16} />
                  </button>

                  

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
                    <CustomInput
                      type="text"
                      label="Número do Auto"
                      value={sancao.numeroAuto}
                      onChange={(value) => updateSancao(index, 'numeroAuto', value)}
                      required
                      iconStart={<FileText size={18} />}
                    />

                    <CustomInput
                      type="date"
                      label="Data"
                      value={sancao.data}
                      onChange={(value) => updateSancao(index, 'data', value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Tipo de Infração"
                      value={sancao.tipoInfracao ? { label: sancao.tipoInfracao, value: sancao.tipoInfracao } : ''}
                      options={[
                        { label: "Multa", value: "Multa" },
                        { label: "Apreensão", value: "Apreensão" },
                        { label: "Embargo", value: "Embargo" }
                      ]}
                      onChange={(value) => updateSancao(index, 'tipoInfracao', value?.value)}
                      required
                    />

                    <CustomInput
                      type="number"
                      label="Valor (AKZ)"
                      value={sancao.valor}
                      onChange={(value) => updateSancao(index, 'valor', value)}
                      required
                    />

                    <CustomInput
                      type="select"
                      label="Área Relacionada"
                      value={formData.areas[sancao.areaIndex] ? {
                        label: formData.areas[sancao.areaIndex]?.nome || `Área #${sancao.areaIndex + 1}`,
                        value: String(sancao.areaIndex)
                      } : ''}
                      options={formData.areas.map((area, i) => ({
                        label: area.nome || `Área #${i + 1}`,
                        value: String(i)
                      }))}
                      onChange={(value) => updateSancao(index, 'areaIndex', Number(value?.value))}
                      required
                    />

                    <CustomInput
                      type="multiselect"
                      label="Evidências"
                      value={sancao.evidencias}
                      options={[
                        { label: "Foto", value: "foto" },
                        { label: "Vídeo", value: "video" }
                      ]}
                      onChange={(value) => updateSancao(index, 'evidencias', value)}
                    />

                    <CustomInput
                      type="select"
                      label="Estado da Sanção"
                      value={sancao.statusSancao ? { label: sancao.statusSancao, value: sancao.statusSancao } : ''}
                      options={[
                        { label: "Paga", value: "Paga" },
                        { label: "Pendente", value: "Pendente" },
                        { label: "Recurso", value: "Recurso" }
                      ]}
                      onChange={(value) => updateSancao(index, 'statusSancao', value?.value)}
                      required
                    />

                    {/* Campos condicionais baseados nas evidências selecionadas */}
                    {Array.isArray(sancao.evidencias) && sancao.evidencias.length > 0 && (
                      <div className="md:col-span-3 space-y-4">
                        
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                          {/* Campo de upload de foto */}
                          {sancao.evidencias.some(e => e.value === 'foto') && (
                            <div className="space-y-4">
                              <label className="block text-sm font-semibold text-gray-700 text-left">
                                Foto de Evidência
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => updateSancao(index, 'fotoUpload', e.target.files[0])}
                                  id={`sancao-foto-upload-${index}`}
                                />
                                <label
                                  htmlFor={`sancao-foto-upload-${index}`}
                                  className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                    sancao.fotoUpload
                                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                                  }`}
                                >
                                  <Camera className={`w-8 h-8 mb-3 ${sancao.fotoUpload ? 'text-blue-500' : 'text-gray-400'}`} />
                                  <p className={`text-sm font-medium ${sancao.fotoUpload ? 'text-blue-600' : 'text-gray-500'}`}>
                                    {sancao.fotoUpload ? 'Foto carregada' : 'Carregar foto'}
                                  </p>
                                  {sancao.fotoUpload && (
                                    <p className="text-xs text-blue-500 mt-1">{sancao.fotoUpload.name}</p>
                                  )}
                                </label>
                              </div>
                            </div>
                          )}

                          {/* Campo de upload de vídeo */}
                          {sancao.evidencias.some(e => e.value === 'video') && (
                            <div className="space-y-4">
                              <label className="block text-sm font-semibold text-gray-700 text-left">
                                Vídeo de Evidência
                              </label>
                              <div className="relative">
                                <input
                                  type="file"
                                  className="hidden"
                                  accept="video/*"
                                  onChange={(e) => updateSancao(index, 'videoUpload', e.target.files[0])}
                                  id={`sancao-video-upload-${index}`}
                                />
                                <label
                                  htmlFor={`sancao-video-upload-${index}`}
                                  className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                                    sancao.videoUpload
                                      ? 'bg-purple-50 border-purple-300 hover:bg-purple-100'
                                      : 'bg-gray-50 border-gray-300 hover:border-purple-400 hover:bg-purple-50'
                                  }`}
                                >
                                  <Video className={`w-8 h-8 mb-3 ${sancao.videoUpload ? 'text-purple-500' : 'text-gray-400'}`} />
                                  <p className={`text-sm font-medium ${sancao.videoUpload ? 'text-purple-600' : 'text-gray-500'}`}>
                                    {sancao.videoUpload ? 'Vídeo carregado' : 'Carregar vídeo'}
                                  </p>
                                  {sancao.videoUpload && (
                                    <p className="text-xs text-purple-500 mt-1">{sancao.videoUpload.name}</p>
                                  )}
                                </label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}

              <button
                onClick={addSancao}
                className="w-full py-3 border-2 border-dashed border-red-300 rounded-xl text-red-600 hover:bg-red-50 transition-colors flex items-center justify-center"
              >
                <Gavel className="w-5 h-5 mr-2" />
                Adicionar Sanção
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <ScrollToTop />
      
      {/* Header */}
      <div className="text-center mb-6 p-10 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
        <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro do Produtor Florestal</h1>
      </div>

      {/* Stepper */}
      <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
        {steps.map((stepObj, idx) => (
          <div
            key={idx}
            className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
              idx > activeIndex ? 'opacity-50' : ''
            }`}
            onClick={() => idx <= activeIndex && setActiveIndex(idx)}
          >
            <div
              className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                idx < activeIndex
                  ? 'bg-green-500 text-white'
                  : idx === activeIndex
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}
            >
              {React.createElement(stepObj.icon, { size: 28, className: "mx-auto" })}
            </div>
            <span
              className={`text-sm text-center font-medium ${
                idx === activeIndex ? 'text-green-700' : 'text-gray-500'
              }`}
            >
              {stepObj.label}
            </span>
          </div>
        ))}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 mb-8 mx-8" style={{ width: 'calc(100% - 4rem)' }}>
        <div
          className="bg-green-600 h-2 transition-all duration-300 rounded-full"
          style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
        ></div>
      </div>

      {/* Content */}
      <div className="step-content p-8 bg-white min-h-[600px]">
        {renderStepContent(activeIndex)}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center p-8 pt-6 border-t border-gray-100 bg-gray-50">
        <button
          className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
            activeIndex === 0
              ? 'opacity-50 cursor-not-allowed bg-gray-100'
              : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
          }`}
          onClick={() => setActiveIndex(Math.max(0, activeIndex - 1))}
          disabled={activeIndex === 0}
        >
          <ChevronLeft className="mr-2" size={16} />
          Anterior
        </button>
        
        <div className="text-sm text-gray-500 font-medium">
          Etapa {activeIndex + 1} de {steps.length}
        </div>
        
        <div className="flex space-x-3">
          <button
            className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${
              activeIndex === steps.length - 1
                ? (saving
                  ? 'bg-green-400 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white shadow-lg')
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
            }`}
            onClick={() => {
              if (activeIndex === steps.length - 1) {
                handleSave();
              } else {
                setActiveIndex(Math.min(steps.length - 1, activeIndex + 1));
              }
            }}
            disabled={activeIndex === steps.length - 1 && saving}
          >
            {activeIndex === steps.length - 1 ? (
              saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                'Finalizar'
              )
            ) : (
              'Próximo'
            )}
            <ChevronRight className="ml-2" size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CadastroProdutorFlorestal;