import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  AlertCircle,
  Building,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Globe,
  Info,
  Loader,
  Mail,
  Map,
  MapPin,
  Phone,
  Settings,
  User,
  UserCheck
} from 'lucide-react';
import { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';
import api from '../../../../../core/services/api';


const MapClickHandler = ({ onLocationSelect }) => {
  useMapEvents({
    click: (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelect(lat.toFixed(6), lng.toFixed(6));
    },
  });
  return null;
};

const CadastroEntrepostosMercado = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [consultingNif, setConsultingNif] = useState(false);
  const [nifData, setNifData] = useState(null);

  const initialState = {
    // Identificação
    nomeDoEntreposto: '',
    tipoDeUnidade: '',
    outroTipoUnidade: '',
    codigoDoRegistro: '',

    // Localização
    endereco: '',
    municipio: '',
    provincia: '',
    latitude: '',
    longitude: '',

    // Responsável/Entidade Gestora
    nomeCompletoDoResponsavel: '',
    nomeDaEntidadeGestora: '',
    nif: '',
    telefone: '',
    email: '',

    // Estrutura do Mercado/Entreposto
    numeroDeBancas: 0,
    numeroDeArmazens: 0,
    numeroDeLojasFixas: 0,
    areaTotal: 0,
    infraestruturasDeApoio: [],
    outraInfraestrutura: '',

    // Produtos Comercializados
    produtosComercializados: [],

    // Capacidade e Funcionamento
    capacidadeMedia: '',
    todosDias: false,
    diasEspecificos: [],
    horarioDeInicio: '',
    horarioDoFim: '',

    // Situação Legal
    licencaDeFuncionamento: '',
    certificacaoSanitaria: '',
    outrasAutorizacoes: '',

    // Observações Gerais
    observacoes: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Identificação', icon: Building },
    { label: 'Localização', icon: MapPin },
    { label: 'Responsável', icon: UserCheck },
    { label: 'Estrutura', icon: Settings },
    { label: 'Produtos', icon: Activity },
    { label: 'Funcionamento', icon: Calendar },
    { label: 'Situação Legal', icon: FileText },
    { label: 'Observações', icon: Info }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'provincia') {
      handleProvinciaChange(value);
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const consultarNifOuIdFiscal = async (value) => {
    if (!value || value.length < 9) return;

    setConsultingNif(true);
    setNifData(null);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      // Primeiro tenta consultar como NIF
      try {
        const nifResponse = await axios.get('https://api.gov.ao/nif/v1/consultarNIF', {
          params: {
            tipoDocumento: 'NIF',
            numeroDocumento: value
          },
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
        });

        if (nifResponse.status === 200 && nifResponse.data.code === 200 && nifResponse.data.data) {
          const nifInfo = nifResponse.data.data;
          setNifData(nifInfo);

          setFormData(prev => ({
            ...prev,
            nomeCompletoDoResponsavel: nifInfo.nome_contribuinte || '',
           nomeDaEntidadeGestora: nifInfo.nome_contribuinte || '',
            telefone: nifInfo.numero_contacto || prev.telefone,
            email: nifInfo.email || prev.email
          }));

          showToast('success', 'NIF Encontrado', 'Dados preenchidos automaticamente!');
          return;
        }
      } catch (nifError) {
        console.log('NIF não encontrado, tentando ID Fiscal...');
        console.error(nifError)
      }

      // Se NIF não encontrado, tenta como ID Fiscal
      try {
        const idFiscalResponse = await axios.get('https://api.gov.ao/nif/v1/consultarNIF', {
          params: {
            tipoDocumento: 'ID_FISCAL',
            numeroDocumento: value
          },
          headers: {
            'Authorization': `Basic ${credentials}`,
            'Content-Type': 'application/json',
          },
        });

        if (idFiscalResponse.status === 200 && idFiscalResponse.data.code === 200 && idFiscalResponse.data.data) {
          const idFiscalInfo = idFiscalResponse.data.data;
          setNifData(idFiscalInfo);

          setFormData(prev => ({
            ...prev,
            nomeCompletoDoResponsavel: idFiscalInfo.nome_contribuinte || '',
           nomeDaEntidadeGestora: idFiscalInfo.nome_contribuinte || '',
            telefone: idFiscalInfo.numero_contacto || prev.telefone,
            email: idFiscalInfo.email || prev.email
          }));

          showToast('success', 'ID Fiscal Encontrado', 'Dados preenchidos automaticamente!');
          return;
        }
      } catch (idFiscalError) {
        console.log('ID Fiscal também não encontrado');
        console.error(idFiscalError);
      }

      // Se nenhum foi encontrado
      showToast('warn', 'Não Encontrado', 'NIF/ID Fiscal não encontrado. Preencha manualmente.');

    } catch (error) {
      console.error('Erro na consulta:', error);
      showToast('error', 'Erro', 'Erro ao consultar NIF/ID Fiscal. Tente novamente.');
    } finally {
      setConsultingNif(false);
    }
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

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (activeIndex) {
      case 0: // Identificação
        if (!formData.nomeDoEntreposto) newErrors.nomeDoEntreposto = 'Campo obrigatório';
        if (!formData.tipoDeUnidade) {
          newErrors.tipoDeUnidade = 'Selecione um tipo';
        }
        break;
      case 1: // Localização
        if (!formData.endereco) newErrors.endereco = 'Campo obrigatório';
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        break;
      case 2: // Responsável
        if (!formData.nomeCompletoDoResponsavel) newErrors.nomeCompletoDoResponsavel = 'Campo obrigatório';
        if (!formData.nomeDaEntidadeGestora) newErrors.nomeDaEntidadeGestora = 'Campo obrigatório';
        if (!formData.telefone) newErrors.telefone = 'Campo obrigatório';
        break;
      case 3: // Estrutura
        if (!formData.numeroDeBancas && formData.numeroDeBancas !== 0) newErrors.numeroDeBancas = 'Campo obrigatório';
        if (!formData.areaTotal) newErrors.areaTotal = 'Campo obrigatório';
        break;
      case 4: // Produtos
        if (!formData.produtosComercializados || formData.produtosComercializados.length === 0) {
          newErrors.produtosComercializados = 'Selecione pelo menos um produto';
        }
        break;
      case 5: // Funcionamento
        if (!formData.capacidadeMedia) newErrors.capacidadeMedia = 'Campo obrigatório';
        if (!formData.todosDias && (!formData.diasEspecificos || formData.diasEspecificos.length === 0)) {
          newErrors.diasEspecificos = 'Especifique os dias de funcionamento';
        }
        break;
      case 6: // Situação Legal
        if (!formData.licencaDeFuncionamento) newErrors.licencaDeFuncionamento = 'Campo obrigatório';
        if (!formData.certificacaoSanitaria) newErrors.certificacaoSanitaria = 'Campo obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const dataToSend = {
        id: null,
        nomeDoEntreposto: formData.nomeDoEntreposto,
        tipoDeUnidade: typeof formData.tipoDeUnidade === 'object' ? formData.tipoDeUnidade.value : formData.tipoDeUnidade,
        outroTipoUnidade: formData.outroTipoUnidade || null,
        codigoDoRegistro: formData.codigoDoRegistro,
        endereco: formData.endereco,
        municipio: typeof formData.municipio === 'object' ? formData.municipio.value : formData.municipio,
        provincia: typeof formData.provincia === 'object' ? formData.provincia.value : formData.provincia,
        latitude: formData.latitude || null,
        longitude: formData.longitude || null,
        nomeCompletoDoResponsavel: formData.nomeCompletoDoResponsavel,
        nomeDaEntidadeGestora: formData.nomeDaEntidadeGestora,
        nif: formData.nif,
        telefone: formData.telefone,
        email: formData.email,
        numeroDeBancas: formData.numeroDeBancas || 0,
        numeroDeArmazens: formData.numeroDeArmazens || 0,
        numeroDeLojasFixas: formData.numeroDeLojasFixas || 0,
        areaTotal: formData.areaTotal || 0,
        infraestruturasDeApoio: formData.infraestruturasDeApoio?.map(i => typeof i === 'string' ? i : i.value) || [],
        outraInfraestrutura: formData.outraInfraestrutura || null,
        produtosComercializados: formData.produtosComercializados?.map(p => typeof p === 'string' ? p : p.value) || [],
        capacidadeMedia: formData.capacidadeMedia,
        todosDias: formData.todosDias ? "true" : "false",
        diasEspecificos: formData.todosDias ? 
          ['SEGUNDA', 'TERCA', 'QUARTA', 'QUINTA', 'SEXTA', 'SABADO', 'DOMINGO'] : 
          formData.diasEspecificos?.map(d => typeof d === 'string' ? d : d.value) || null,
        horarioDeInicio: formData.horarioDeInicio,
        horarioDoFim: formData.horarioDoFim,
        licencaDeFuncionamento: typeof formData.licencaDeFuncionamento === 'object' ? formData.licencaDeFuncionamento.value : formData.licencaDeFuncionamento,
        certificacaoSanitaria: typeof formData.certificacaoSanitaria === 'object' ? formData.certificacaoSanitaria.value : formData.certificacaoSanitaria,
        outrasAutorizacoes: formData.outrasAutorizacoes || null,
        observacoes: formData.observacoes || null
      };

      showToast('info', 'Enviando', 'Processando dados do entreposto/mercado...');

      const response = await api.post('/entreposto', dataToSend, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 30000
      });

      setLoading(false);
      showToast('success', 'Sucesso', 'Entreposto/Mercado registrado com sucesso!');

      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});

    } catch (error) {
      setLoading(false);
      console.error('Erro ao registrar:', error);

      let errorMessage = 'Erro ao registrar. Tente novamente.';
      if (error.response) {
        errorMessage = `Erro ${error.response.status}: ${error.response.data?.message || error.response.statusText}`;
      } else if (error.request) {
        errorMessage = 'Erro de conexão. Verifique sua internet.';
      }

      showToast('error', 'Erro', errorMessage);
    }
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Identificação
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-start rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex justify-start items-center text-start space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados de identificação do entreposto ou mercado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="text"
                label="Nome do Entreposto/Mercado"
                value={formData.nomeDoEntreposto}
                onChange={(value) => handleInputChange('nomeDoEntreposto', value)}
                required
                errorMessage={errors.nomeDoEntreposto}
                placeholder="Digite o nome do entreposto ou mercado"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="text"
                label="Código/Registro"
                value={formData.codigoDoRegistro}
                onChange={(value) => handleInputChange('codigoDoRegistro', value)}
                placeholder="Código de registro oficial"
                iconStart={<FileText size={18} />}
              />

              <CustomInput
                type="select"
                label="Tipo de Unidade"
                value={formData.tipoDeUnidade}
                options={[
                  { label: 'Entreposto', value: 'ENTREPOSTO' },
                  { label: 'Mercado Municipal', value: 'MERCADO_MUNICIPAL' },
                  { label: 'Mercado Informal/Feira', value: 'MERCADO_INFORMAL' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('tipoDeUnidade', value)}
                required
                errorMessage={errors.tipoDeUnidade}
              />

              {(formData.tipoDeUnidade?.value === 'OUTRO' || formData.tipoDeUnidade === 'OUTRO') && (
                <div className="mt-4">
                  <CustomInput
                    type="text"
                    label="Especificar Outro Tipo"
                    value={formData.outroTipoUnidade}
                    onChange={(value) => handleInputChange('outroTipoUnidade', value)}
                    placeholder="Especifique o tipo de unidade"
                  />
                </div>
              )}
            </div>


          </div>
        );

      case 1: // Localização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-start rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex justify-start items-center text-start space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Localização</h3>
              </div>
              <p className="text-gray-600">
                Informe a localização do entreposto ou mercado.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Endereço"
                  value={formData.endereco}
                  onChange={(value) => handleInputChange('endereco', value)}
                  required
                  errorMessage={errors.endereco}
                  placeholder="Endereço completo"
                  iconStart={<MapPin size={18} />}
                />
              </div>

              <CustomInput
                type="select"
                label="Província/Estado"
                value={formData.provincia}
                options={provinciasData.map(provincia => ({
                  label: provincia.nome,
                  value: provincia.nome.toUpperCase()
                }))}
                onChange={(value) => handleInputChange('provincia', value)}
                required
                errorMessage={errors.provincia}
                placeholder="Selecione a província"
                iconStart={<Map size={18} />}
              />

              <CustomInput
                type="select"
                label="Distrito/Município"
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
                placeholder="Ex: -8.8383"
                iconStart={<Globe size={18} />}
              />

              <CustomInput
                type="text"
                label="Longitude"
                value={formData.longitude}
                onChange={(value) => handleInputChange('longitude', value)}
                placeholder="Ex: 13.2344"
                iconStart={<Globe size={18} />}
              />
            </div>

            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-blue-600" />
                Coordenadas GPS
              </h4>

              <div className="h-96 rounded-lg overflow-hidden border border-gray-300">
                <MapContainer
                  center={[formData.latitude || -8.838333, formData.longitude || 13.234444]}
                  zoom={formData.latitude && formData.longitude ? 16 : 6}
                  className="w-full h-full"
                  key={`${formData.latitude}-${formData.longitude}`}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  />
                  <MapClickHandler onLocationSelect={(lat, lng) => {
                    handleInputChange('latitude', lat);
                    handleInputChange('longitude', lng);
                  }} />
                  {formData.latitude && formData.longitude && (
                    <Marker position={[formData.latitude, formData.longitude]}>
                      <Popup>
                        <div className="text-center">
                          <strong>Localização do Entreposto</strong><br />
                          Latitude: {formData.latitude}°<br />
                          Longitude: {formData.longitude}°
                        </div>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </div>

              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-600 flex items-center">
                  <Info size={16} className="mr-2" />
                  Clique no mapa para selecionar uma localização automaticamente
                </p>
              </div>
            </div>
          </div>
        );

      case 2: // Responsável/Entidade Gestora
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 text-start rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex justify-start items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Responsável/Entidade Gestora</h3>
              </div>
              <p className="text-gray-600">
                Informações do responsável e entidade gestora.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <CustomInput
                type="text"
                label="Nome Completo"
                value={formData.nomeCompletoDoResponsavel}
                onChange={(value) => handleInputChange('nomeCompletoDoResponsavel', value)}
                required
                errorMessage={errors.nomeCompletoDoResponsavel}
                placeholder="Nome completo do responsável"
                iconStart={<User size={18} />}
              />

              <CustomInput
                type="text"
                label="Entidade Gestora"
                value={formData.nomeDaEntidadeGestora}
                onChange={(value) => handleInputChange('nomeDaEntidadeGestora', value)}
                required
                errorMessage={errors.nomeDaEntidadeGestora}
                placeholder="Nome da entidade gestora"
                iconStart={<Building size={18} />}
              />

              <div className="relative text-left">
                <CustomInput
                  type="text"
                  label="NIF/ID Fiscal"
                  value={formData.nif}
                  onChange={(value) => {
                    handleInputChange('nif', value);
                    if (value && value.length >= 9) {
                      setTimeout(() => consultarNifOuIdFiscal(value), 1500);
                    }
                  }}
                  placeholder="Número de identificação fiscal"
                  iconStart={<CreditCard size={18} />}
                  helperText="Digite o NIF ou ID Fiscal para consulta automática"
                />
                {consultingNif && (
                  <div className="absolute right-3 top-9 flex items-center">
                    <Loader size={16} className="animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-blue-600">Consultando...</span>
                  </div>
                )}
              </div>

              <CustomInput
                type="tel"
                label="Telefone"
                value={formData.telefone}
                onChange={(value) => handleInputChange('telefone', value)}
                required
                errorMessage={errors.telefone}
                placeholder="Ex: 923456789"
                iconStart={<Phone size={18} />}
              />

              <CustomInput
                type="email"
                label="Email"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="email@exemplo.com"
                iconStart={<Mail size={18} />}
              />
            </div>
          </div>
        );

      case 3: // Estrutura do Mercado/Entreposto
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl text-start p-6 mb-8 border border-orange-100">
              <div className="flex justify-start items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Settings className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Estrutura do Mercado/Entreposto</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a estrutura física.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <CustomInput
                type="number"
                label="Número de Bancas/Stands"
                value={formData.numeroDeBancas}
                onChange={(value) => handleInputChange('numeroDeBancas', value)}
                required
                errorMessage={errors.numeroDeBancas}
                placeholder="0"
              />

              <CustomInput
                type="number"
                label="Número de Armazéns/Salas"
                value={formData.numeroDeArmazens}
                onChange={(value) => handleInputChange('numeroDeArmazens', value)}
                placeholder="0"
              />

              <CustomInput
                type="number"
                label="Número de Lojas Fixas"
                value={formData.numeroDeLojasFixas}
                onChange={(value) => handleInputChange('numeroDeLojasFixas', value)}
                placeholder="0"
              />

              <CustomInput
                type="number"
                label="Área Total (m²)"
                value={formData.areaTotal}
                onChange={(value) => handleInputChange('areaTotal', value)}
                required
                errorMessage={errors.areaTotal}
                placeholder="0"
              />
            </div>

            <div>
              <CustomInput
                type="multiselect"
                label="Infraestruturas de Apoio"
                value={formData.infraestruturasDeApoio}
                options={[
                  { label: 'Frio', value: 'FRIO' },
                  { label: 'Câmara de Congelação', value: 'CAMARA_CONGELACAO' },
                  { label: 'Água Potável', value: 'AGUA_POTAVEL' },
                  { label: 'Saneamento', value: 'SANEAMENTO' },
                  { label: 'Gestão de Resíduos', value: 'GESTAO_RESIDUOS' },
                  { label: 'Energia', value: 'ENERGIA' },
                  { label: 'Estacionamento', value: 'ESTACIONAMENTO' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('infraestruturasDeApoio', value)}
              />

              {formData.infraestruturasDeApoio.some(infra => infra.value === 'OUTRO') && (
                <div className="mt-4">
                  <CustomInput
                    type="text"
                    label="Especificar Outra Infraestrutura"
                    value={formData.outraInfraestrutura}
                    onChange={(value) => handleInputChange('outraInfraestrutura', value)}
                    placeholder="Especifique a infraestrutura"
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Produtos Comercializados
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 text-start rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex justify-start items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Activity className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Produtos Comercializados</h3>
              </div>
              <p className="text-gray-600">
                Selecione os tipos de produtos comercializados.
              </p>
            </div>

            <CustomInput
              type="multiselect"
              label="Produtos"
              value={formData.produtosComercializados}
              options={[
                { label: 'Produtos Agrícolas', value: 'PRODUTOS_AGRICOLAS' },
                { label: 'Hortícolas e Frutas', value: 'HORTICOLAS_FRUTAS' },
                { label: 'Produtos Pecuários', value: 'PRODUTOS_PECUARIOS' },
                { label: 'Peixe/Frutos do Mar', value: 'PEIXE_FRUTOS_MAR' },
                { label: 'Produtos Processados', value: 'PRODUTOS_PROCESSADOS' },
                { label: 'Artesanato/Outro', value: 'ARTESANATO_OUTRO' }
              ]}
              onChange={(value) => handleInputChange('produtosComercializados', value)}
              required
              errorMessage={errors.produtosComercializados}
            />
          </div>
        );

      case 5: // Capacidade e Funcionamento
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 text-start rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex justify-start items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Capacidade e Funcionamento</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre capacidade e horários de funcionamento.
              </p>
            </div>

            <div className="space-y-6">
              <CustomInput
                type="text"
                label="Capacidade Média"
                value={formData.capacidadeMedia}
                onChange={(value) => handleInputChange('capacidadeMedia', value)}
                required
                errorMessage={errors.capacidadeMedia}
                placeholder="Ex: 500 pessoas/dia"
              />

              <div className="bg-gray-50 rounded-lg p-4">
                <label className="flex items-center space-x-2 mb-4">
                  <input
                    type="checkbox"
                    checked={formData.todosDias}
                    onChange={(e) => handleInputChange('todosDias', e.target.checked)}
                    className="form-checkbox h-4 w-4 text-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-700">Todos os dias</span>
                </label>

                {!formData.todosDias && (
                  <CustomInput
                    type="multiselect"
                    label="Dias Específicos"
                    value={formData.diasEspecificos}
                    options={[
                      { label: 'Segunda-feira', value: 'SEGUNDA' },
                      { label: 'Terça-feira', value: 'TERCA' },
                      { label: 'Quarta-feira', value: 'QUARTA' },
                      { label: 'Quinta-feira', value: 'QUINTA' },
                      { label: 'Sexta-feira', value: 'SEXTA' },
                      { label: 'Sábado', value: 'SABADO' },
                      { label: 'Domingo', value: 'DOMINGO' }
                    ]}
                    onChange={(value) => handleInputChange('diasEspecificos', value)}
                    errorMessage={errors.diasEspecificos}
                    placeholder="Selecione os dias de funcionamento"
                  />
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="time"
                  label="Horário de Início"
                  value={formData.horarioDeInicio}
                  onChange={(value) => handleInputChange('horarioDeInicio', value)}
                  placeholder="08:00"
                />

                <CustomInput
                  type="time"
                  label="Horário de Fim"
                  value={formData.horarioDoFim}
                  onChange={(value) => handleInputChange('horarioDoFim', value)}
                  placeholder="18:00"
                />
              </div>
            </div>
          </div>
        );

      case 6: // Situação Legal
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl text-start p-6 mb-8 border border-red-100">
              <div className="flex justify-start items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FileText className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Situação Legal</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre licenças e autorizações.
              </p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="select"
                  label="Licença de Funcionamento"
                  value={formData.licencaDeFuncionamento}
                  options={[
                    { label: 'Sim', value: 'SIM' },
                    { label: 'Não', value: 'NAO' }
                  ]}
                  onChange={(value) => handleInputChange('licencaDeFuncionamento', value)}
                  required
                  errorMessage={errors.licencaDeFuncionamento}
                  placeholder="Selecione uma opção"
                />

                <CustomInput
                  type="select"
                  label="Certificação Sanitária"
                  value={formData.certificacaoSanitaria}
                  options={[
                    { label: 'Sim', value: 'SIM' },
                    { label: 'Não', value: 'NAO' }
                  ]}
                  onChange={(value) => handleInputChange('certificacaoSanitaria', value)}
                  required
                  errorMessage={errors.certificacaoSanitaria}
                  placeholder="Selecione uma opção"
                />
              </div>

              <CustomInput
                type="textarea"
                label="Outras Autorizações"
                value={formData.outrasAutorizacoes}
                onChange={(value) => handleInputChange('outrasAutorizacoes', value)}
                placeholder="Descreva outras autorizações ou licenças..."
                rows={3}
              />
            </div>
          </div>
        );

      case 7: // Observações Gerais
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl text-start p-6 mb-8 border border-gray-100">
              <div className="flex justify-start items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Info className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Observações Gerais</h3>
              </div>
              <p className="text-gray-600">
                Informações adicionais sobre o entreposto ou mercado.
              </p>
            </div>

            <CustomInput
              type="textarea"
              label="Observações"
              value={formData.observacoes}
              onChange={(value) => handleInputChange('observacoes', value)}
              placeholder="Adicione observações, comentários ou informações adicionais..."
              rows={6}
            />
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
          <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-800 to-blue-500 rounded-t-lg">
            <h1 className="text-4xl font-bold mb-3 text-white">Cadastro de Entrepostos e Mercados</h1>
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
                    ? 'bg-gradient-to-r from-blue-800 to-blue-500  text-white'
                    : isCompleted
                      ? 'bg-blue-500 text-white'
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
              className="bg-blue-600 h-2 transition-all duration-300 rounded-full"
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

export default CadastroEntrepostosMercado;