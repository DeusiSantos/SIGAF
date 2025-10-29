import axios from 'axios';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  AlertCircle,
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Home,
  Info,
  Loader,
  Mail,
  MapPin,
  Phone,
  Settings,
  User,
  Users
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';
import { useEmpresasDeApoio } from '../../../hooks/useEmpresasDeApoio';

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
                <strong>Localização da Empresa</strong><br />
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

const RegistroApoioAgricola = () => {
  const { createEmpresasDeApoio, loading } = useEmpresasDeApoio();
  const [activeIndex, setActiveIndex] = useState(0);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [consultingNif, setConsultingNif] = useState(false);
  const [nifData, setNifData] = useState(null);
  const [consultingBI, setConsultingBI] = useState(false);
  const [consultingBIGerente, setConsultingBIGerente] = useState(false);
  const [biData, setBiData] = useState(null);
  const [biGerenteData, setBiGerenteData] = useState(null);

  // Estado inicial do formulário
  const initialState = {
    // Identificação da Empresa
    nomeEmpresa: '',
    tipoEntidade: '',
    outroTipoEntidade: '',
    nif: '',
    anoFundacao: '',

    // Localização
    enderecoSede: '',
    municipio: '',
    provincia: '',
    latitude: '',
    longitude: '',

    // Contatos
    pessoaContacto: '',
    cargo: '',
    telefone: '',
    email: '',
    website: '',

    // Áreas de Atuação
    servicosPrestados: [],
    outrosServicos: '',

    // Público-Alvo
    principaisBeneficiarios: '',
    outrosBeneficiarios: '',

    // Capacidade e Operação
    numeroFuncionarios: 0,
    areaCobertura: '',
    volumeClientes: 0,

    // Situação Legal
    licencaOperacao: '',
    registoComercial: '',
    certificacoesEspecificas: '',

    // Observações Gerais
    observacoes: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Identificação', icon: Building },
    { label: 'Localização', icon: MapPin },
    { label: 'Contactos', icon: Phone },
    { label: 'Áreas de Actuação', icon: Activity },
    { label: 'Público-Alvo', icon: Users },
    { label: 'Capacidade', icon: Settings },
    { label: 'Situação Legal', icon: FileText },
    { label: 'Observações', icon: Info }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  // Função para consultar NIF na API
  const consultarNIF = async (nifValue) => {
    if (!nifValue || nifValue.length < 9) return;

    setConsultingNif(true);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';

      // Codificar credenciais em base64 para Basic Auth
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

      console.log('📊 Resposta completa da API:', response);
      console.log('📋 Dados retornados da API:', response.data);
      console.log('🔍 Status da resposta:', response.status);
      console.log('📄 Headers da resposta:', response.headers);

      const data = response.data;

      if (response.status === 200 && data.code === 200 && data.data) {
        const nifInfo = data.data;

        console.log('✅ Dados do NIF processados:', nifInfo);

        // Salvar dados do NIF para exibição
        setNifData(nifInfo);

        // Preencher automaticamente os campos do formulário
        setFormData(prev => ({
          ...prev,
          nomeEmpresa: nifInfo.nome_contribuinte || '',
          email: nifInfo.email || '',
          telefone: nifInfo.numero_contacto || '',
          dataFundacao: nifInfo.data_constituicao ? new Date(nifInfo.data_constituicao).toISOString().split('T')[0] : '',
          provincia: nifInfo.provincia_morada ? {
            label: nifInfo.provincia_morada,
            value: nifInfo.provincia_morada.toUpperCase()
          } : '',
          municipio: nifInfo.municipio_morada ? {
            label: nifInfo.municipio_morada,
            value: nifInfo.municipio_morada
          } : '',
          comuna: nifInfo.comuna_morada || '',
        }));

        // Atualizar municípios se província foi preenchida
        if (nifInfo.provincia_morada) {
          handleProvinciaChange({
            label: nifInfo.provincia_morada,
            value: nifInfo.provincia_morada.toUpperCase()
          });
        }

        showToast('success', 'NIF Consultado', 'Dados da empresa preenchidos automaticamente!');

      } else {
        console.log('⚠️ NIF não encontrado ou resposta inválida:', data);
        setNifData(null);
        if (data.code === 404) {
          showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF. Preencha manualmente.');
        } else {
          showToast('warn', 'NIF inválido', 'Este NIF não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao consultar NIF:', error);
      console.error('📄 Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      setNifData(null);

      if (error.response) {
        // O servidor respondeu com um status de erro
        console.error('🚫 Erro de resposta do servidor:', error.response.status, error.response.data);
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('🌐 Erro de rede - sem resposta:', error.request);
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Algo aconteceu na configuração da requisição
        console.error('⚙️ Erro na configuração:', error.message);
        showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
      }
    } finally {
      setConsultingNif(false);
    }
  };

  // Função para consultar BI na API
  {/*const consultarBI = async (biValue) => {
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
        setBiData(biInfo);

        // Preencher campos automaticamente
        setFormData(prev => ({
          ...prev,
          nomeDiretor: `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim(),
          telefoneDiretor: biInfo.phone || biInfo.telefone || biInfo.contacto || '',
          emailDiretor: biInfo.email || biInfo.email_address || ''
        }));

        showToast('success', 'BI Consultado', 'Dados preenchidos automaticamente!');
      } else {
        setBiData(null);
        showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI.');
      }
    } catch (error) {
      console.error('Erro ao consultar BI:', error);
      setBiData(null);
      showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Tente novamente.');
    } finally {
      setConsultingBI(false);
    }
 */ };

  // Função para consultar BI do Gerente na API
  {/*const consultarBIGerente = async (biValue) => {
    if (!biValue || biValue.length < 9) return;

    setConsultingBIGerente(true);

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
        setBiGerenteData(biInfo);

        // Preencher campos automaticamente
        setFormData(prev => ({
          ...prev,
          nomeGerente: `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim(),
          telefoneGerente: biInfo.phone || biInfo.telefone || biInfo.contacto || '',
          emailGerente: biInfo.email || biInfo.email_address || ''
        }));

        showToast('success', 'BI Consultado', 'Dados do gerente preenchidos automaticamente!');
      } else {
        setBiGerenteData(null);
        showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI.');
      }
    } catch (error) {
      console.error('Erro ao consultar BI:', error);
      setBiGerenteData(null);
      showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Tente novamente.');
    } finally {
      setConsultingBIGerente(false);
    }
  */};

  // Debounce para consulta do NIF
  const debounceTimer = React.useRef(null);
  const biDebounceTimer = React.useRef(null);
  const biGerenteDebounceTimer = React.useRef(null);
  const handleNifChange = (value) => {
    setFormData(prev => ({ ...prev, nif: value }));
    setTouched(prev => ({ ...prev, nif: true }));

    // Limpar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Configurar novo timer para consulta após 1.5 segundos
    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 9) {
        consultarNIF(value);
      }
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Lógica para província
    if (field === 'provincia') {
      handleProvinciaChange(value);
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

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (activeIndex) {
      case 0: // Identificação
        if (!formData.nomeEmpresa) newErrors.nomeEmpresa = 'Campo obrigatório';
        if (!formData.tipoEntidade) newErrors.tipoEntidade = 'Campo obrigatório';
        if (!formData.nif) newErrors.nif = 'Campo obrigatório';
        if (!formData.anoFundacao) newErrors.anoFundacao = 'Campo obrigatório';
        break;
      case 1: // Localização
        if (!formData.enderecoSede) newErrors.enderecoSede = 'Campo obrigatório';
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        break;
      case 2: // Contatos
        if (!formData.pessoaContacto) newErrors.pessoaContacto = 'Campo obrigatório';
        if (!formData.cargo) newErrors.cargo = 'Campo obrigatório';
        if (!formData.telefone) newErrors.telefone = 'Campo obrigatório';
        if (!formData.email) newErrors.email = 'Campo obrigatório';
        break;
      case 3: // Áreas de Atuação
        if (!formData.servicosPrestados || formData.servicosPrestados.length === 0) {
          newErrors.servicosPrestados = 'Selecione pelo menos um serviço';
        }
        break;
      case 4: // Público-Alvo
        if (!formData.principaisBeneficiarios) newErrors.principaisBeneficiarios = 'Campo obrigatório';
        break;
      case 5: // Capacidade
        if (!formData.numeroFuncionarios || formData.numeroFuncionarios < 1) {
          newErrors.numeroFuncionarios = 'Deve ter pelo menos 1 funcionário';
        }
        if (!formData.areaCobertura) newErrors.areaCobertura = 'Campo obrigatório';
        break;
      case 6: // Situação Legal
        if (!formData.licencaOperacao) newErrors.licencaOperacao = 'Campo obrigatório';
        if (!formData.registoComercial) newErrors.registoComercial = 'Campo obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isAllRequiredFilesUploaded = () => {
    const requiredFiles = ['estatutoSocial', 'rgCpfDiretor', 'rgCpfGerente', 'comprovanteEndereco', 'documentoNif'];
    return requiredFiles.every(file => uploadedFiles[file]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const dataToSend = {
        nomeDaEmpresa: formData.nomeEmpresa,
        tipoDeEntidade: typeof formData.tipoEntidade === 'object' ? formData.tipoEntidade.value : formData.tipoEntidade,
        nifOuIdFiscal: formData.nif,
        anoDeFundacao: parseInt(formData.anoFundacao) || 0,
        enderecoSede: formData.enderecoSede,
        província: typeof formData.provincia === 'object' ? formData.provincia.value : formData.provincia,
        município: typeof formData.municipio === 'object' ? formData.municipio.value : formData.municipio,
        latitude: formData.latitude || "",
        longitude: formData.longitude || "",
        nomeDaPessoaDeContacto: formData.pessoaContacto,
        cargo: formData.cargo,
        telefone: formData.telefone,
        email: formData.email,
        website: formData.website || "",
        servicosPrestados: formData.servicosPrestados ? formData.servicosPrestados.map(s => typeof s === 'string' ? s : s.value) : [],
        principaisBeneficiarios: formData.principaisBeneficiarios ? [typeof formData.principaisBeneficiarios === 'string' ? formData.principaisBeneficiarios : formData.principaisBeneficiarios.value] : [],
        numeroDeFuncionarios: parseInt(formData.numeroFuncionarios) || 0,
        areaDeCobertura: typeof formData.areaCobertura === 'object' ? formData.areaCobertura.value : formData.areaCobertura,
        volumeMedioDeClientesOuBeneficiariosPorAno: parseInt(formData.volumeClientes) || 0,
        licencaDeOperacao: typeof formData.licencaOperacao === 'object' ? formData.licencaOperacao.value : formData.licencaOperacao,
        registoComercial: typeof formData.registoComercial === 'object' ? formData.registoComercial.value : formData.registoComercial,
        certificacoesEspecificas: formData.certificacoesEspecificas || "",
        observacoesGerais: formData.observacoes || ""
      };

      console.log("📤 Dados preparados para envio:", dataToSend);

      showToast('info', 'Enviando', 'Processando dados da empresa...');

      await createEmpresasDeApoio(dataToSend);

      showToast('success', 'Sucesso', 'Empresa registrada com sucesso!');

      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});
      setNifData(null);

    } catch (error) {
      console.error('❌ Erro ao registrar empresa:', error);
      showToast('error', 'Erro', error.message || 'Erro ao registrar empresa. Tente novamente.');
    }
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Identificação
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-center rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex justify-center items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação da Empresa</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados de identificação da empresa de apoio à agricultura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="text"
                label="Nome da Empresa"
                value={formData.nomeEmpresa}
                onChange={(value) => handleInputChange('nomeEmpresa', value)}
                required
                errorMessage={errors.nomeEmpresa}
                placeholder="Digite o nome completo da empresa"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="select"
                label="Tipo de Entidade"
                value={formData.tipoEntidade}
                options={[
                  { label: 'Empresa Privada', value: 'EMPRESA_PRIVADA' },
                  { label: 'Cooperativa', value: 'COOPERATIVA' },
                  { label: 'ONG', value: 'ONG' },
                  { label: 'Associação', value: 'ASSOCIACAO' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('tipoEntidade', value)}
                required
                errorMessage={errors.tipoEntidade}
                placeholder="Selecione o tipo de entidade"
                iconStart={<Building size={18} />}
              />

              {formData.tipoEntidade === 'OUTRO' && (
                <CustomInput
                  type="text"
                  label="Especificar Outro Tipo"
                  value={formData.outroTipoEntidade}
                  onChange={(value) => handleInputChange('outroTipoEntidade', value)}
                  placeholder="Especifique o tipo de entidade"
                  iconStart={<FileText size={18} />}
                />
              )}

              <div className="relative">
                <CustomInput
                  type="text"
                  label="NIF/ID Fiscal"
                  value={formData.nif}
                  onChange={handleNifChange}
                  required
                  errorMessage={errors.nif}
                  placeholder="Número de Identificação Fiscal"
                  iconStart={<CreditCard size={18} />}
                  helperText="Digite o NIF para consulta automática dos dados"
                />
                {consultingNif && (
                  <div className="absolute right-3 top-9 flex items-center">
                    <Loader size={16} className="animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-blue-600">Consultando...</span>
                  </div>
                )}
              </div>

              <CustomInput
                type="number"
                label="Ano de Fundação"
                value={formData.anoFundacao}
                onChange={(value) => handleInputChange('anoFundacao', value)}
                required
                errorMessage={errors.anoFundacao}
                placeholder="Ex: 2020"
                iconStart={<Calendar size={18} />}
              />
            </div>

            {/* Informações do NIF consultado */}
            {nifData && (
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Informações do NIF Consultado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Tipo de Contribuinte:</span>
                    <p className="text-gray-800">{nifData.tipo_contribuinte || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estado:</span>
                    <p className="text-gray-800">
                      {nifData.estado_contribuinte === 'A' ? 'Ativo' :
                        nifData.estado_contribuinte === 'C' ? 'Cessado' :
                          nifData.estado_contribuinte === 'D' ? 'Falecido' :
                            nifData.estado_contribuinte === 'E' ? 'Herança' :
                              nifData.estado_contribuinte === 'F' ? 'Anulado' :
                                nifData.estado_contribuinte === 'G' ? 'Suspenso' :
                                  'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Capital Social:</span>
                    <p className="text-gray-800">
                      {nifData.valor_capital_social ?
                        new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(nifData.valor_capital_social) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Data Constituição:</span>
                    <p className="text-gray-800">
                      {nifData.data_constituicao ?
                        new Date(nifData.data_constituicao).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Morada Completa:</span>
                    <p className="text-gray-800">{nifData.morada || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Atividades:</span>
                    <p className="text-gray-800">
                      {nifData.lista_cae && nifData.lista_cae.length > 0 ?
                        `${nifData.lista_cae.length} atividade(s) registrada(s)` : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
            )}
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
                Informe a localização da sede da empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Endereço Sede"
                  value={formData.enderecoSede}
                  onChange={(value) => handleInputChange('enderecoSede', value)}
                  required
                  errorMessage={errors.enderecoSede}
                  placeholder="Endereço completo da sede"
                  iconStart={<Home size={18} />}
                />
              </div>

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
                iconStart={<Globe size={18} />}
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
                iconStart={<MapPin size={18} />}
                disabled={!formData.provincia}
              />


              <CustomInput
                type="text"
                label="Latitude"
                value={formData.latitude}
                onChange={(value) => handleInputChange('latitude', value)}
                placeholder="Ex: -8.838333"
                iconStart={<MapPin size={18} />}
              />

              <CustomInput
                type="text"
                label="Longitude"
                value={formData.longitude}
                onChange={(value) => handleInputChange('longitude', value)}
                placeholder="Ex: 13.234444"
                iconStart={<MapPin size={18} />}
              />
            </div>

            <div className="mt-6">

              <MapaGPS
                latitude={formData.latitude}
                longitude={formData.longitude}
                onLocationSelect={(lat, lng) => {
                  setFormData(prev => ({
                    ...prev,
                    latitude: lat,
                    longitude: lng
                  }));
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
              <p className="text-gray-600">
                Informações de contato da empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="text"
                label="Pessoa de Contacto"
                value={formData.pessoaContacto}
                onChange={(value) => handleInputChange('pessoaContacto', value)}
                required
                errorMessage={errors.pessoaContacto}
                placeholder="Nome da pessoa de contacto"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="text"
                label="Cargo"
                value={formData.cargo}
                onChange={(value) => handleInputChange('cargo', value)}
                required
                errorMessage={errors.cargo}
                placeholder="Cargo na empresa"
                iconStart={<Briefcase size={18} />}
              />

              <CustomInput
                type="tel"
                label="Telefone"
                value={formData.telefone}
                onChange={(value) => {
                  // Permite apenas números e limita a 9 dígitos
                  const onlyNumbers = value.replace(/\D/g, '').slice(0, 9);
                  handleInputChange('telefone', onlyNumbers);
                }}
                required
                errorMessage={errors.telefone}
                placeholder="Ex: 923456789"
                iconStart={<Phone size={18} />}
                maxLength={9}
              />

              <CustomInput
                type="email"
                label="E-mail"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                required
                errorMessage={errors.email}
                placeholder="empresa@exemplo.com"
                iconStart={<Mail size={18} />}
              />

              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Website"
                  value={formData.website}
                  onChange={(value) => handleInputChange('website', value)}
                  placeholder="https://www.empresa.com"
                  iconStart={<Globe size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Representantes
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Áreas de Atuação</h3>
              </div>
              <p className="text-gray-600">
                Selecione os serviços prestados pela empresa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Settings className="w-5 h-5 mr-2 text-blue-600" />
                Serviços Prestados
              </h4>

              <CustomInput
                type="multiselect"
                value={formData.servicosPrestados}
                options={[
                  { label: 'Fornecimento de Insumos Agrícolas', value: 'INSUMOS_AGRICOLAS' },
                  { label: 'Mecanização Agrícola', value: 'MECANIZACAO_AGRICOLA' },
                  { label: 'Assistência Técnica/Extensão Rural', value: 'ASSISTENCIA_TECNICA' },
                  { label: 'Formação e Capacitação', value: 'FORMACAO_CAPACITACAO' },
                  { label: 'Crédito Rural/Microfinanças', value: 'CREDITO_RURAL' },
                  { label: 'Comercialização e Logística', value: 'COMERCIALIZACAO_LOGISTICA' },
                  { label: 'Transformação/Agroindústria', value: 'TRANSFORMACAO_AGROINDUSTRIA' },
                  { label: 'Pesquisa e Inovação', value: 'PESQUISA_INOVACAO' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('servicosPrestados', value)}
                errorMessage={errors.servicosPrestados}
              />

              {formData.servicosPrestados && formData.servicosPrestados.some(s => (typeof s === 'string' ? s : s.value) === 'OUTRO') && (
                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Especificar Outros Serviços"
                    value={formData.outrosServicos}
                    onChange={(value) => handleInputChange('outrosServicos', value)}
                    placeholder="Descreva outros serviços prestados..."
                    rows={3}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Público-Alvo
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Público-Alvo</h3>
              </div>
              <p className="text-gray-600">
                Identifique os principais beneficiários dos serviços.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CustomInput
                type="select"
                label="Principais Beneficiários"
                value={formData.principaisBeneficiarios}
                options={[
                  { label: 'Pequenos Produtores', value: 'PEQUENOS_PRODUTORES' },
                  { label: 'Médios Produtores', value: 'MEDIOS_PRODUTORES' },
                  { label: 'Grandes Produtores', value: 'GRANDES_PRODUTORES' },
                  { label: 'Associações/Cooperativas', value: 'ASSOCIACOES_COOPERATIVAS' },
                  { label: 'Projetos Governamentais', value: 'PROJETOS_GOVERNAMENTAIS' },
                  { label: 'Outros', value: 'OUTROS' }
                ]}
                onChange={(value) => handleInputChange('principaisBeneficiarios', value)}
                required
                errorMessage={errors.principaisBeneficiarios}
                placeholder="Selecione o público-alvo principal"
                iconStart={<Users size={18} />}
              />

              {formData.principaisBeneficiarios === 'OUTROS' && (
                <CustomInput
                  type="text"
                  label="Especificar Outros Beneficiários"
                  value={formData.outrosBeneficiarios}
                  onChange={(value) => handleInputChange('outrosBeneficiarios', value)}
                  placeholder="Especifique outros beneficiários"
                  iconStart={<Users size={18} />}
                />
              )}
            </div>
          </div>
        );

      case 5: // Capacidade
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Settings className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Capacidade e Operação</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a capacidade operacional da empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="number"
                label="Número de Funcionários"
                value={formData.numeroFuncionarios}
                onChange={(value) => handleInputChange('numeroFuncionarios', parseInt(value) || 0)}
                required
                errorMessage={errors.numeroFuncionarios}
                placeholder="Número total de funcionários"
                iconStart={<Users size={18} />}
              />

              <CustomInput
                type="select"
                label="Área de Cobertura"
                value={formData.areaCobertura}
                options={[
                  { label: 'Local/Distrital', value: 'LOCAL_DISTRITAL' },
                  { label: 'Provincial', value: 'PROVINCIAL' },
                  { label: 'Nacional', value: 'NACIONAL' },
                  { label: 'Regional/Internacional', value: 'REGIONAL_INTERNACIONAL' }
                ]}
                onChange={(value) => handleInputChange('areaCobertura', value)}
                required
                errorMessage={errors.areaCobertura}
                placeholder="Selecione a área de cobertura"
                iconStart={<Globe size={18} />}
              />

              <div className="md:col-span-2">
                <CustomInput
                  type="number"
                  label="Volume Médio de Clientes/Beneficiários por ano"
                  value={formData.volumeClientes}
                  onChange={(value) => handleInputChange('volumeClientes', parseInt(value) || 0)}
                  placeholder="Número estimado de clientes atendidos por ano"
                  iconStart={<Activity size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 6: // Situação Legal
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-teal-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Situação Legal</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre licenças e certificações.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="select"
                label="Licença de Operação"
                value={formData.licencaOperacao}
                options={[
                  { label: 'Sim', value: 'SIM' },
                  { label: 'Não', value: 'NAO' }
                ]}
                onChange={(value) => handleInputChange('licencaOperacao', value)}
                required
                errorMessage={errors.licencaOperacao}
                placeholder="Possui licença de operação?"
                iconStart={<FileText size={18} />}
              />

              <CustomInput
                type="select"
                label="Registo Comercial"
                value={formData.registoComercial}
                options={[
                  { label: 'Sim', value: 'SIM' },
                  { label: 'Não', value: 'NAO' }
                ]}
                onChange={(value) => handleInputChange('registoComercial', value)}
                required
                errorMessage={errors.registoComercial}
                placeholder="Possui registo comercial?"
                iconStart={<FileText size={18} />}
              />

              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Certificações Específicas"
                  value={formData.certificacoesEspecificas}
                  onChange={(value) => handleInputChange('certificacoesEspecificas', value)}
                  placeholder="ISO, HACCP, outras certificações..."
                  iconStart={<CheckCircle size={18} />}
                />
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
              <p className="text-gray-600">
                Informações adicionais sobre a empresa.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CustomInput
                type="textarea"
                label="Observações"
                value={formData.observacoes}
                onChange={(value) => handleInputChange('observacoes', value)}
                placeholder="Informações adicionais, comentários ou observações relevantes sobre a empresa..."
                rows={6}
                iconStart={<Info size={18} />}
              />
            </div>
          </div>
        );


      default:
        return null;
    }
  };

  const nextStep = () => {
    if (validateCurrentStep()) {
      setActiveIndex(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setActiveIndex(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
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

      <div className="mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-blue-400 rounded-t-lg">
            <h1 className="text-4xl font-bold mb-3 text-white">Cadastro de Empresas de Apoio à Agricultura
            </h1>
          </div>

          {/* Stepper */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === activeIndex;
              const isCompleted = index < activeIndex;

              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${!isActive && !isCompleted ? 'opacity-50' : ''
                    }`}
                  onClick={() => setActiveIndex(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${isActive
                    ? 'bg-gradient-to-r from-blue-700 to-blue-400 text-white'
                    : isCompleted
                      ? 'bg-gradient-to-r from-blue-700 to-blue-400 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? (
                      <Check size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-blue-600' : 'text-gray-500'
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
              className="bg-gradient-to-r from-blue-700 to-blue-400 h-2 transition-all duration-300 rounded-full"
              style={{ width: `${((activeIndex + 1) / steps.length) * 100}%` }}
            ></div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {renderStepContent(activeIndex)}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-8">
              <button
                type="button"
                onClick={prevStep}
                disabled={activeIndex === 0}
                className={`flex items-center px-6 py-3 rounded-lg font-medium transition-all ${activeIndex === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                <ChevronLeft size={20} className="mr-2" />
                Anterior
              </button>

              {activeIndex === steps.length - 1 ? (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {loading ? (
                    <>
                      <Loader size={20} className="animate-spin mr-2" />
                      Registrando...
                    </>
                  ) : (
                    <>
                      <Check size={20} className="mr-2" />
                      Finalizar Cadastro
                    </>
                  )}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all"
                >
                  Próximo
                  <ChevronRight size={20} className="ml-2" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistroApoioAgricola;