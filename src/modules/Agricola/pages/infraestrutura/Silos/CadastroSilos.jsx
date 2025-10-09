import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  AlertCircle,
  Building,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Factory,
  FileText,
  Globe,
  Home,
  Info,
  Loader,
  Mail,
  Map,
  MapPin,
  Package,
  Phone,
  Scale,
  Settings,
  Shield,
  Thermometer,
  Truck,
  User,
  UserCheck,
  Warehouse,
  Wheat,
  Zap
} from 'lucide-react';
import React, { useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';


import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';
import { useSilo } from '../../../hooks/useSilo';

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



const CadastroSilos = () => {
  const { createSilo, loading: siloLoading } = useSilo();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [consultingNif, setConsultingNif] = useState(false);
  const [nifData, setNifData] = useState(null);

  // Estado inicial do formulário
  const initialState = {
    // Dados Básicos
    nomeSilo: '',
    tipoUnidade: '',
    codigoRegistro: '',
    endereco: '',
    municipio: '',
    provincia: '',
    latitude: '',
    longitude: '',

    // Proprietário/Responsável
    nomeProprietario: '',
    entidade: '',
    nifProprietario: '',
    telefoneProprietario: '',
    emailProprietario: '',

    // Capacidade de Armazenamento
    capacidadeTotal: 0,
    capacidadeUtilizada: 0,
    numeroUnidades: 0,
    produtosArmazenados: [],
    outrosProdutos: '',

    // Infraestrutura
    sistemaSeccagem: false,
    sistemaVentilacao: false,
    sistemaProtecaoPragas: false,
    tipoEnergia: '',
    estadoVias: '',
    equipamentosDisponiveis: [],

    // Situação Legal
    licencaOperacao: false,
    certificacaoSanitaria: false,
    outrasAutorizacoes: '',
    dataLicenca: '',
    validadeLicenca: '',

    // Observações
    observacoes: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Identificação ', icon: Building },
    { label: 'Localização', icon: MapPin },
    { label: 'Proprietário', icon: UserCheck },
    { label: 'Capacidade', icon: Package },
    { label: 'Infraestrutura', icon: Settings },
    { label: 'Situação Legal', icon: Shield },
    { label: 'Documentos', icon: FileText }
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
        setNifData(nifInfo);

        setFormData(prev => ({
          ...prev,
          nomeProprietario: nifInfo.nome_contribuinte || '',
          emailProprietario: nifInfo.email || '',
          telefoneProprietario: nifInfo.numero_contacto || ''
        }));

        showToast('success', 'NIF Consultado', 'Dados preenchidos automaticamente!');
      } else {
        setNifData(null);
        showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF.');
      }
    } catch (error) {
      setNifData(null);
      showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
      console.error('Erro ao consultar NIF:', error);
    } finally {
      setConsultingNif(false);
    }
  };

  const debounceTimer = React.useRef(null);
  const handleNifChange = (value) => {
    setFormData(prev => ({ ...prev, nifProprietario: value }));
    setTouched(prev => ({ ...prev, nifProprietario: true }));

    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 9) {
        consultarNIF(value);
      }
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'provincia') {
      handleProvinciaChange(value);
      return;
    }

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
      case 0: // Dados Básicos
        if (!formData.nomeSilo) newErrors.nomeSilo = 'Campo obrigatório';
        if (!formData.tipoUnidade) newErrors.tipoUnidade = 'Campo obrigatório';
        break;
      case 1: // Localização
        if (!formData.endereco) newErrors.endereco = 'Campo obrigatório';
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        break;
      case 2: // Proprietário
        if (!formData.nomeProprietario) newErrors.nomeProprietario = 'Campo obrigatório';
        if (!formData.telefoneProprietario) newErrors.telefoneProprietario = 'Campo obrigatório';
        break;
      case 3: // Capacidade
        if (!formData.capacidadeTotal || formData.capacidadeTotal <= 0) {
          newErrors.capacidadeTotal = 'Capacidade deve ser maior que zero';
        }
        if (!formData.numeroUnidades || formData.numeroUnidades <= 0) {
          newErrors.numeroUnidades = 'Número de unidades deve ser maior que zero';
        }
        if (!formData.produtosArmazenados || formData.produtosArmazenados.length === 0) {
          newErrors.produtosArmazenados = 'Selecione pelo menos um produto';
        }
        break;
      case 4: // Infraestrutura
        if (!formData.tipoEnergia) newErrors.tipoEnergia = 'Campo obrigatório';
        if (!formData.estadoVias) newErrors.estadoVias = 'Campo obrigatório';
        break;
      case 5: // Situação Legal
        if (!formData.dataLicenca) newErrors.dataLicenca = 'Campo obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Montar os dados conforme a estrutura da API
      const siloData = {
        NomeDoSilo: formData.nomeSilo?.trim() || "",
        TipoDeUnidade: formData.tipoUnidade?.value || formData.tipoUnidade || "",
        CodigoDeRegistro: String(formData.codigoRegistro || ""),
        Endereço: formData.endereco?.trim() || "",
        Provincia: formData.provincia?.value || formData.provincia || "",
        Municipio: formData.municipio?.value || formData.municipio || "",
        Latitude: String(formData.latitude || ""),
        Longitude: String(formData.longitude || ""),
        NomeDoProprietario: formData.nomeProprietario?.trim() || "",
        EmpresaDoProprietario: formData.entidade?.trim() || "",
        NifDoProprietario: String(formData.nifProprietario || ""),
        TelefoneDoProprietario: String(formData.telefoneProprietario || ""),
        EmailDoProprietario: formData.emailProprietario?.trim() || "",
        CapacidadeMaxima: parseFloat(formData.capacidadeTotal) || 0,
        CapacidadeUtilizada: parseFloat(formData.capacidadeUtilizada) || 0,
        NumeroDeUnidade: parseFloat(formData.numeroUnidades) || 0,

        // Arrays (listas)
        ProdutosArmazenados: formData.produtosArmazenados?.map(item => item.value) || [],
        EquipamentosDisponiveis: formData.equipamentosDisponiveis?.map(item => item.value) || [],

        // Booleanos (sempre strings)
        SistemaDeSecagem: formData.sistemaSeccagem ? "true" : "false",
        SistemaDeVentilacao: formData.sistemaVentilacao ? "true" : "false",
        ProtecaoContraPragas: formData.sistemaProtecaoPragas ? "true" : "false",
        LicencaDeOperacao: formData.licencaOperacao ? "true" : "false",
        CertificacaoSanitaria: formData.certificacaoSanitaria ? "true" : "false",

        TipoDeEnergia: formData.tipoEnergia?.value || formData.tipoEnergia || "",
        EstadoDasViasDeAcesso: formData.estadoVias?.value || formData.estadoVias || "",

        // Datas no formato YYYY-MM-DD
        DataDeLicenca: formData.dataLicenca
          ? new Date(formData.dataLicenca).toISOString().split("T")[0]
          : "",
        ValidadeDaLicenca: formData.validadeLicenca
          ? new Date(formData.validadeLicenca).toISOString().split("T")[0]
          : "",

        OutrasAutorizacoes: formData.outrasAutorizacoes?.trim() || "",
        ObservacoesGerais: formData.observacoes?.trim() || "",

        // Arquivos (enviar File, não FileList)
        LicencaDeOperacaoFile: uploadedFiles.LicencaDeOperacaoFile || null,
        CertificacaoSanitariaFile: uploadedFiles.CertificacaoSanitariaFile || null,
        DocumentoDoProprietarioFile: uploadedFiles.DocumentoDoProprietarioFile || null,
        ComprovanteDeEnderecoFile: uploadedFiles.ComprovanteDeEnderecoFile || null,
        FotoDoSiloFile: uploadedFiles.FotoDoSiloFile?.[0] || null, // <- garante que é File
      };

      console.log("✅ Dados enviados para API:", siloData);

      // Chama o método de criação
      await createSilo(siloData);

      // Feedback e reset
      showToast("success", "Sucesso", "Silo registrado com sucesso!");
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});

    } catch (error) {
      console.error(" Erro ao registrar silo:", error.response?.data || error);
      showToast("error", "Erro", "Erro ao registrar silo. Tente novamente.");
    } finally {
      setLoading(false);
    }
  };


  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Identificação
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-start rounded-2xl  p-6 mb-8 border border-blue-100">
              <div className="flex justify-start items-center text-start space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Warehouse className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação  do Silo</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados  da unidade de armazenamento.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Nome do Silo/Centro"
                  value={formData.nomeSilo}
                  onChange={(value) => handleInputChange('nomeSilo', value)}
                  required
                  errorMessage={errors.nomeSilo}
                  placeholder="Digite o nome da unidade de armazenamento"
                  iconStart={<Warehouse size={18} />}
                />
              </div>

              <CustomInput
                type="select"
                label="Tipo de Unidade"
                value={formData.tipoUnidade}
                options={[
                  { label: 'Silo Metálico', value: 'SILO_METALICO' },
                  { label: 'Silo de Concreto', value: 'SILO_CONCRETO' },
                  { label: 'Armazém Convencional', value: 'ARMAZEM_CONVENCIONAL' },
                  { label: 'Armazém Graneleiro', value: 'ARMAZEM_GRANELEIRO' },
                  { label: 'Centro de Distribuição', value: 'CENTRO_DISTRIBUICAO' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('tipoUnidade', value)}
                required
                errorMessage={errors.tipoUnidade}
                placeholder="Selecione o tipo"
                iconStart={<Factory size={18} />}
              />

              <CustomInput
                type="text"
                label="Código de Registro"
                value={formData.codigoRegistro}
                onChange={(value) => handleInputChange('codigoRegistro', value)}
                placeholder="Código oficial (se houver)"
                iconStart={<CreditCard size={18} />}
              />


            </div>
          </div>
        );

      case 1: // Localização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 text-start mb-8 border border-green-100">
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

      case 2: // Proprietário
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 text-start to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Proprietário/Responsável</h3>
              </div>
              <p className="text-gray-600">
                Informações do proprietário ou responsável pela unidade de armazenamento.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <CustomInput
                    type="text"
                    label="Nome Completo"
                    value={formData.nomeProprietario}
                    onChange={(value) => handleInputChange('nomeProprietario', value)}
                    required
                    errorMessage={errors.nomeProprietario}
                    placeholder="Nome completo do proprietário"
                    iconStart={<User size={18} />}
                  />
                </div>

                <CustomInput
                  type="text"
                  label="Entidade"
                  value={formData.entidade}
                  onChange={(value) => handleInputChange('entidade', value)}
                  placeholder="Empresa/Associação/Cooperativa"
                  iconStart={<Building size={18} />}
                />

                <CustomInput
                  type="text"
                  label="NIF/ID Fiscal"
                  value={formData.nifProprietario}
                  onChange={handleNifChange}
                  placeholder="Número de identificação fiscal"
                  iconStart={<CreditCard size={18} />}
                  helperText={consultingNif ? 'Consultando NIF...' : 'Digite o NIF para consulta automática'}
                />

                <CustomInput
                  type="tel"
                  label="Telefone"
                  value={formData.telefoneProprietario}
                  onChange={(value) => handleInputChange('telefoneProprietario', value)}
                  required
                  errorMessage={errors.telefoneProprietario}
                  placeholder="Ex: 923456789"
                  iconStart={<Phone size={18} />}
                />

                <CustomInput
                  type="email"
                  label="E-mail"
                  value={formData.emailProprietario}
                  onChange={(value) => handleInputChange('emailProprietario', value)}
                  placeholder="email@exemplo.com"
                  iconStart={<Mail size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Capacidade
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 text-start to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Package className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Capacidade de Armazenamento</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a capacidade e produtos armazenados.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Scale className="w-5 h-5 mr-2 text-orange-600" />
                  Capacidade Física
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomInput
                    type="number"
                    label="Capacidade Total (toneladas)"
                    value={formData.capacidadeTotal}
                    onChange={(value) => handleInputChange('capacidadeTotal', value)}
                    required
                    errorMessage={errors.capacidadeTotal}
                    placeholder="Capacidade máxima"
                    iconStart={<Scale size={18} />}
                    min="1"
                  />

                  <CustomInput
                    type="number"
                    label="Capacidade Utilizada (toneladas)"
                    value={formData.capacidadeUtilizada}
                    onChange={(value) => handleInputChange('capacidadeUtilizada', value)}
                    placeholder="Capacidade atualmente ocupada"
                    iconStart={<Package size={18} />}
                    min="0"
                  />

                  <CustomInput
                    type="number"
                    label="Número de Unidades"
                    value={formData.numeroUnidades}
                    onChange={(value) => handleInputChange('numeroUnidades', value)}
                    required
                    errorMessage={errors.numeroUnidades}
                    placeholder="Quantidade de silos/galpões"
                    iconStart={<Warehouse size={18} />}
                    min="1"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Wheat className="w-5 h-5 mr-2 text-orange-600" />
                  Produtos Armazenados
                </h4>
                <CustomInput
                  type="multiselect"
                  value={formData.produtosArmazenados}
                  options={[
                    { label: 'Milho', value: 'MILHO' },
                    { label: 'Arroz', value: 'ARROZ' },
                    { label: 'Feijão', value: 'FEIJAO' },
                    { label: 'Trigo', value: 'TRIGO' },
                    { label: 'Soja', value: 'SOJA' },
                    { label: 'Sorgo', value: 'SORGO' },
                    { label: 'Amendoim', value: 'AMENDOIM' },
                    { label: 'Outros', value: 'OUTROS' }
                  ]}
                  onChange={(value) => handleInputChange('produtosArmazenados', value)}
                  errorMessage={errors.produtosArmazenados}
                />

                {formData.produtosArmazenados.includes('OUTROS') && (
                  <div className="mt-6">
                    <CustomInput
                      type="textarea"
                      label="Especificar Outros Produtos"
                      value={formData.outrosProdutos}
                      onChange={(value) => handleInputChange('outrosProdutos', value)}
                      placeholder="Descreva outros produtos armazenados..."
                      rows={3}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 4: // Infraestrutura
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 text-start rounded-2xl p-6 mb-8 border border-teal-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Settings className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Infraestrutura e Equipamentos</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a infraestrutura e equipamentos disponíveis.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Settings className="w-5 h-5 mr-2 text-teal-600" />
                  Sistemas Técnicos
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CustomInput
                    type="select"
                    label="Sistema de Secagem"
                    value={formData.sistemaSeccagem}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('sistemaSeccagem', value)}
                    iconStart={<Thermometer size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Sistema de Ventilação"
                    value={formData.sistemaVentilacao}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('sistemaVentilacao', value)}
                    iconStart={<Activity size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Proteção contra Pragas"
                    value={formData.sistemaProtecaoPragas}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('sistemaProtecaoPragas', value)}
                    iconStart={<Shield size={18} />}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Zap className="w-5 h-5 mr-2 text-teal-600" />
                  Energia e Acesso
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="select"
                    label="Tipo de Energia"
                    value={formData.tipoEnergia}
                    options={[
                      { label: 'Rede Pública', value: 'REDE_PUBLICA' },
                      { label: 'Gerador', value: 'GERADOR' },
                      { label: 'Solar', value: 'SOLAR' },
                      { label: 'Híbrido', value: 'HIBRIDO' }
                    ]}
                    onChange={(value) => handleInputChange('tipoEnergia', value)}
                    required
                    errorMessage={errors.tipoEnergia}
                    iconStart={<Zap size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Estado das Vias de Acesso"
                    value={formData.estadoVias}
                    options={[
                      { label: 'Boa', value: 'BOA' },
                      { label: 'Regular', value: 'REGULAR' },
                      { label: 'Má', value: 'MA' }
                    ]}
                    onChange={(value) => handleInputChange('estadoVias', value)}
                    required
                    errorMessage={errors.estadoVias}
                    iconStart={<Truck size={18} />}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Package className="w-5 h-5 mr-2 text-teal-600" />
                  Equipamentos Disponíveis
                </h4>
                <CustomInput
                  type="multiselect"
                  value={formData.equipamentosDisponiveis}
                  options={[
                    { label: 'Balanças', value: 'BALANCAS' },
                    { label: 'Esteiras Transportadoras', value: 'ESTEIRAS' },
                    { label: 'Elevadores de Grãos', value: 'ELEVADORES' },
                    { label: 'Sistemas de Limpeza', value: 'LIMPEZA' },
                    { label: 'Termometria', value: 'TERMOMETRIA' },
                    { label: 'Equipamentos de Carga/Descarga', value: 'CARGA_DESCARGA' }
                  ]}
                  onChange={(value) => handleInputChange('equipamentosDisponiveis', value)}
                />
              </div>
            </div>
          </div>
        );

      case 5: // Situação Legal
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 text-start rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Shield className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Situação Legal</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre licenças e certificações da unidade.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <CustomInput
                  type="select"
                  label="Licença de Operação"
                  value={formData.licencaOperacao}
                  options={[
                    { label: 'Sim', value: true },
                    { label: 'Não', value: false }
                  ]}
                  onChange={(value) => handleInputChange('licencaOperacao', value)}
                  iconStart={<Shield size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Certificação Sanitária"
                  value={formData.certificacaoSanitaria}
                  options={[
                    { label: 'Sim', value: true },
                    { label: 'Não', value: false }
                  ]}
                  onChange={(value) => handleInputChange('certificacaoSanitaria', value)}
                  iconStart={<CheckCircle size={18} />}
                />

                <CustomInput
                  type="date"
                  label="Data da Licença"
                  value={formData.dataLicenca}
                  onChange={(value) => handleInputChange('dataLicenca', value)}
                  required
                  errorMessage={errors.dataLicenca}
                  iconStart={<Calendar size={18} />}
                />

                <CustomInput
                  type="date"
                  label="Validade da Licença"
                  value={formData.validadeLicenca}
                  onChange={(value) => handleInputChange('validadeLicenca', value)}
                  iconStart={<Calendar size={18} />}
                />

                <div className=" md:col-span-2 lg:col-span-4">
                  <CustomInput
                    type="textarea"
                    label="Outras Autorizações"
                    value={formData.outrasAutorizacoes}
                    onChange={(value) => handleInputChange('outrasAutorizacoes', value)}
                    placeholder="Descreva outras licenças ou autorizações..."
                    rows={3}
                  />

                  <CustomInput
                    type="textarea"
                    label="Observações Gerais"
                    value={formData.observacoes}
                    onChange={(value) => handleInputChange('observacoes', value)}
                    placeholder="Informações adicionais sobre o silo..."
                    rows={4}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Documentos
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 text-start rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Documentos Obrigatórios</h3>
              </div>
              <p className="text-gray-600">
                Faça o upload dos documentos necessários para completar o registro.
              </p>
            </div>

            <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium">
                    <strong>Documentos obrigatórios:</strong> Licença de Operação, Certificação Sanitária, Documento de Identificação do Proprietário, Comprovante de Endereço
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Licença de Operação */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Licença de Operação *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('LicencaDeOperacaoFile', e.target.files[0])}
                    id="licenca-upload"
                  />
                  <label
                    htmlFor="licenca-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.LicencaDeOperacaoFile
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Shield className={`w-8 h-8 mb-3 ${uploadedFiles.LicencaDeOperacaoFile ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.LicencaDeOperacaoFile ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.LicencaDeOperacaoFile ? 'Documento carregado' : 'Carregar Licença'}
                    </p>
                    {uploadedFiles.LicencaDeOperacaoFile && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.LicencaDeOperacaoFile.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Certificação Sanitária */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Certificação Sanitária *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('CertificacaoSanitariaFile', e.target.files[0])}
                    id="certificacao-upload"
                  />
                  <label
                    htmlFor="certificacao-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.CertificacaoSanitariaFile
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CheckCircle className={`w-8 h-8 mb-3 ${uploadedFiles.CertificacaoSanitariaFile ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.CertificacaoSanitariaFile ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.CertificacaoSanitariaFile ? 'Documento carregado' : 'Carregar Certificação'}
                    </p>
                    {uploadedFiles.CertificacaoSanitariaFile && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.CertificacaoSanitariaFile.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Documento do Proprietário */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Documento do Proprietário *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('DocumentoDoProprietarioFile', e.target.files[0])}
                    id="proprietario-upload"
                  />
                  <label
                    htmlFor="proprietario-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.DocumentoDoProprietarioFile
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${uploadedFiles.DocumentoDoProprietarioFile ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.DocumentoDoProprietarioFile ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.DocumentoDoProprietarioFile ? 'Documento carregado' : 'Carregar Documento'}
                    </p>
                    {uploadedFiles.DocumentoDoProprietarioFile && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.DocumentoDoProprietarioFile.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Comprovante de Endereço */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Comprovante de Endereço *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('ComprovanteDeEnderecoFile', e.target.files[0])}
                    id="endereco-upload"
                  />
                  <label
                    htmlFor="endereco-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.ComprovanteDeEnderecoFile
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Home className={`w-8 h-8 mb-3 ${uploadedFiles.ComprovanteDeEnderecoFile ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.ComprovanteDeEnderecoFile ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.ComprovanteDeEnderecoFile ? 'Documento carregado' : 'Carregar Comprovante'}
                    </p>
                    {uploadedFiles.ComprovanteDeEnderecoFile && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.ComprovanteDeEnderecoFile.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Fotos do Silo */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Fotos do Silo
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileUpload('FotoDoSiloFile', e.target.files)}
                    id="fotos-upload"
                  />
                  <label
                    htmlFor="fotos-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.FotoDoSiloFile
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.FotoDoSiloFile ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.FotoDoSiloFile ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.FotoDoSiloFile ? 'Fotos carregadas' : 'Carregar Fotos'}
                    </p>
                    {uploadedFiles.FotoDoSiloFile && (
                      <p className="text-xs text-blue-500 mt-1">
                        {uploadedFiles.FotoDoSiloFile.length} arquivo(s)
                      </p>
                    )}
                  </label>
                </div>
              </div>
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
          <div className="text-center mb-8 p-8 border-b border-gray-100   bg-gradient-to-r from-yellow-700 to-yellow-500 rounded-t-2xl ">
            <h1 className="text-4xl font-bold mb-3 text-white">Cadastro de Silos e Centros de Armazenamento</h1>
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
                    ? ' text-white shadow-lg bg-gradient-to-r from-yellow-700 to-yellow-500'
                    : isCompleted
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? (
                      <Check size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${isActive ? 'text-yellow-700' : isCompleted ? 'text-yellow-600' : 'text-gray-500'
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
              className="bg-yellow-600 h-2 transition-all duration-300 rounded-full"
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
                  disabled={loading || siloLoading}
                  className={`flex items-center px-8 py-3 rounded-lg font-medium transition-all ${(loading || siloLoading)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                  {(loading || siloLoading) ? (
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
                  className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg font-medium hover:bg-yellow-700 transition-all"
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

export default CadastroSilos;
