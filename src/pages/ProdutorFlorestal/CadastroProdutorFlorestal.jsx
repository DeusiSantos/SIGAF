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
  TreePine,
  Shield,
  Gavel,
  Activity
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
import api from '../../services/api';

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
                <strong>Localização do Produtor Florestal</strong><br />
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
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Estado inicial do formulário
  const initialState = {
    // Seção 1: Inventário e Mapeamento Florestal
    nomeProdutor: '',
    biNif: '',
    contacto: '',
    latitudeGPS: '',
    longitudeGPS: '',
    altitudeGPS: '',
    precisaoGPS: '',
    propriedade: '',
    especiesPredominantes: [],
    volumeEstimado: '',
    estadoConservacao: '',

    // Seção 2: Licenciamento e Autorizações
    tipoLicencaSolicitada: [],
    areaAssociada: '',
    validadePretendida: '',
    autorizacaoFinal: '',

    // Seção 3: Fiscalização e Inspeções
    idLicencaFiscalizada: '',
    dataInspecao: '',
    resultadoInspecao: '',
    descricaoInfracao: '',
    autoEmitido: '',

    // Seção 4: Ocorrências Florestais
    tipoOcorrencia: '',
    modoSubmissao: '',
    latitudeGPS2: '',
    longitudeGPS2: '',
    altitudeGPS2: '',
    precisaoGPS2: '',
    descricaoAdicional: '',

    // Seção 5: Produção e Comércio Florestal
    especieProduzida: '',
    volumeAnual: '',
    origemAreaCadastrada: '',
    destino: '',
    rastreabilidade: '',
    documentosTransporte: '',

    // Seção 6: Sanções e Autos de Infração
    numeroAuto: '',
    dataAuto: '',
    tipoInfracao: '',
    valorAkz: '',
    statusSancao: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Inventário', icon: TreePine },
    { label: 'Licenciamento', icon: Shield },
    { label: 'Fiscalização', icon: UserCheck },
    { label: 'Ocorrências', icon: Activity },
    { label: 'Produção', icon: Trees },
    { label: 'Sanções', icon: Gavel },
    { label: 'Documentos', icon: FileText }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (fieldName, file) => {
    setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (activeIndex) {
      case 0: // Inventário
        if (!formData.nomeProdutor) newErrors.nomeProdutor = 'Campo obrigatório';
        if (!formData.biNif) newErrors.biNif = 'Campo obrigatório';
        if (!formData.contacto) newErrors.contacto = 'Campo obrigatório';
        if (!formData.propriedade) newErrors.propriedade = 'Campo obrigatório';
        break;

      case 1: // Licenciamento
        if (!formData.tipoLicencaSolicitada || formData.tipoLicencaSolicitada.length === 0) {
          newErrors.tipoLicencaSolicitada = 'Selecione pelo menos um tipo de licença';
        }
        if (!formData.areaAssociada) {
          newErrors.areaAssociada = 'Campo obrigatório';
        }
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Inventário e Mapeamento Florestal
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TreePine className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Inventário e Mapeamento Florestal</h3>
              </div>
              <p className="text-gray-600">
                Informações básicas do produtor florestal e localização da propriedade.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2 text-green-600" />
                  Dados do Produtor
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CustomInput
                    type="text"
                    label="Nome do Produtor"
                    value={formData.nomeProdutor}
                    onChange={(value) => handleInputChange('nomeProdutor', value)}
                    required
                    errorMessage={errors.nomeProdutor}
                    placeholder="Digite o nome completo"
                    iconStart={<User size={18} />}
                  />

                  <CustomInput
                    type="text"
                    label="BI/NIF"
                    value={formData.biNif}
                    onChange={(value) => handleInputChange('biNif', value)}
                    required
                    errorMessage={errors.biNif}
                    placeholder="Digite o BI ou NIF"
                    iconStart={<CreditCard size={18} />}
                  />

                  <CustomInput
                    type="tel"
                    label="Contacto"
                    value={formData.contacto}
                    onChange={(value) => handleInputChange('contacto', value)}
                    required
                    errorMessage={errors.contacto}
                    placeholder="Ex: 923456789"
                    iconStart={<Phone size={18} />}
                  />

                  <CustomInput
                    type="select"
                    label="Propriedade"
                    value={formData.propriedade}
                    options={[
                      { label: 'Pública', value: 'PUBLICA' },
                      { label: 'Privada', value: 'PRIVADA' }
                    ]}
                    onChange={(value) => handleInputChange('propriedade', value)}
                    required
                    errorMessage={errors.propriedade}
                    placeholder="Selecione o tipo de propriedade"
                    iconStart={<Building size={18} />}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-green-600" />
                  Localização GPS
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

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Trees className="w-5 h-5 mr-2 text-green-600" />
                  Características Florestais
                </h4>
                <div className="space-y-6">
                  <CustomInput
                    type="multiselect"
                    label="Espécies Predominantes"
                    value={formData.especiesPredominantes}
                    options={[
                      { label: 'Baobá (Adansonia digitata)', value: 'BAOBA' },
                      { label: 'Imbondeiro (Adansonia sp.)', value: 'IMBONDEIRO' },
                      { label: 'Mussivi (Brachystegia spiciformis)', value: 'MUSSIVI' },
                      { label: 'Mupanda (Julbernardia paniculata)', value: 'MUPANDA' },
                      { label: 'Muvulungo (Afzelia quanzensis)', value: 'MUVULUNGO' },
                      { label: 'Kiaat / Mukwa (Pterocarpus angolensis)', value: 'KIAAT' },
                      { label: 'Eucalipto (Eucalyptus spp.)', value: 'EUCALIPTO' },
                      { label: 'Mongongo (Schinziophyton rautanenii)', value: 'MONGONGO' },
                      { label: 'Palmeira-de-óleo (Elaeis guineensis)', value: 'PALMEIRA_OLEO' },
                      { label: 'Palmeira-dendém (Elaeis spp.)', value: 'PALMEIRA_DENDEM' },
                      { label: 'Umbila (Khaya anthotheca)', value: 'UMBILA' },
                      { label: 'Mutondo (Isoberlinia angolensis)', value: 'MUTONDO' },
                      { label: 'Cacaueiro-do-mato (Cola edulis)', value: 'CACAUEIRO' },
                      { label: 'Oliveira africana (Olea africana)', value: 'OLIVEIRA' },
                      { label: 'Tamboti (Spirostachys africana)', value: 'TAMBOTI' },
                      { label: 'Marula (Sclerocarya birrea)', value: 'MARULA' }
                    ]}
                    onChange={(value) => handleInputChange('especiesPredominantes', value)}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      type="number"
                      label="Volume Estimado (m³)"
                      value={formData.volumeEstimado}
                      onChange={(value) => handleInputChange('volumeEstimado', value)}
                      placeholder="Volume em metros cúbicos"
                      min="0"
                      step="0.1"
                    />

                    <CustomInput
                      type="select"
                      label="Estado de Conservação"
                      value={formData.estadoConservacao}
                      options={[
                        { label: 'Nativa', value: 'NATIVA' },
                        { label: 'Reflorestamento', value: 'REFLORESTAMENTO' },
                        { label: 'Degradada', value: 'DEGRADADA' }
                      ]}
                      onChange={(value) => handleInputChange('estadoConservacao', value)}
                      placeholder="Selecione o estado"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 1: // Licenciamento e Autorizações
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Licenciamento e Autorizações</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre licenças solicitadas e autorizações florestais.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-blue-600" />
                  Licenças e Autorizações
                </h4>
                <div className="space-y-6">
                  <CustomInput
                    type="multiselect"
                    label="Tipo de Licença Solicitada"
                    value={formData.tipoLicencaSolicitada}
                    options={[
                      { label: 'Corte', value: 'CORTE' },
                      { label: 'Transporte', value: 'TRANSPORTE' },
                      { label: 'Carvão', value: 'CARVAO' },
                      { label: 'PFNM (Produtos Florestais Não Madeireiros)', value: 'PFNM' }
                    ]}
                    onChange={(value) => handleInputChange('tipoLicencaSolicitada', value)}
                    errorMessage={errors.tipoLicencaSolicitada}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <CustomInput
                      type="text"
                      label="Área Associada"
                      value={formData.areaAssociada}
                      onChange={(value) => handleInputChange('areaAssociada', value)}
                      placeholder="Descreva a área associada"
                      required
                      errorMessage={errors.areaAssociada}
                    />

                    <CustomInput
                      type="date"
                      label="Validade Pretendida"
                      value={formData.validadePretendida}
                      onChange={(value) => handleInputChange('validadePretendida', value)}
                    />

                    <CustomInput
                      type="select"
                      label="Autorização Final"
                      value={formData.autorizacaoFinal}
                      options={[
                        { label: 'Aprovada', value: 'APROVADA' },
                        { label: 'Negada', value: 'NEGADA' },
                        { label: 'Pendente', value: 'PENDENTE' }
                      ]}
                      onChange={(value) => handleInputChange('autorizacaoFinal', value)}
                      placeholder="Status da autorização"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <FileText className="w-5 h-5 mr-2 text-blue-600" />
                  Upload de Documentos
                </h4>
                <div className="space-y-4">
                  <label className="block text-sm font-semibold text-gray-700 text-left">
                    Documentos de Licenciamento
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      onChange={(e) => handleFileUpload('uploadDocumentos', e.target.files[0])}
                      id="documentos-upload"
                      multiple
                    />
                    <label
                      htmlFor="documentos-upload"
                      className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        uploadedFiles.uploadDocumentos
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <FileText className={`w-8 h-8 mb-3 ${uploadedFiles.uploadDocumentos ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${uploadedFiles.uploadDocumentos ? 'text-blue-600' : 'text-gray-500'}`}>
                        {uploadedFiles.uploadDocumentos ? 'Documentos carregados' : 'Carregar documentos'}
                      </p>
                      {uploadedFiles.uploadDocumentos && (
                        <p className="text-xs text-blue-500 mt-1">{uploadedFiles.uploadDocumentos.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Fiscalização e Inspeções
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Fiscalização e Inspeções</h3>
              </div>
              <p className="text-gray-600">
                Registos de fiscalizações e inspeções realizadas na propriedade florestal.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <UserCheck className="w-5 h-5 mr-2 text-orange-600" />
                  Dados da Fiscalização
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CustomInput
                    type="text"
                    label="ID da Licença Fiscalizada"
                    value={formData.idLicencaFiscalizada}
                    onChange={(value) => handleInputChange('idLicencaFiscalizada', value)}
                    placeholder="ID da licença"
                  />

                  <CustomInput
                    type="date"
                    label="Data da Inspeção"
                    value={formData.dataInspecao}
                    onChange={(value) => handleInputChange('dataInspecao', value)}
                  />

                  <CustomInput
                    type="select"
                    label="Resultado da Inspeção"
                    value={formData.resultadoInspecao}
                    options={[
                      { label: 'Conforme', value: 'CONFORME' },
                      { label: 'Irregularidade', value: 'IRREGULARIDADE' }
                    ]}
                    onChange={(value) => handleInputChange('resultadoInspecao', value)}
                    placeholder="Resultado"
                  />

                  <CustomInput
                    type="select"
                    label="Auto Emitido?"
                    value={formData.autoEmitido}
                    options={[
                      { label: 'Sim', value: 'SIM' },
                      { label: 'Não', value: 'NAO' }
                    ]}
                    onChange={(value) => handleInputChange('autoEmitido', value)}
                    placeholder="Auto emitido"
                  />
                </div>

                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Descrição da Infração"
                    value={formData.descricaoInfracao}
                    onChange={(value) => handleInputChange('descricaoInfracao', value)}
                    placeholder="Descreva as irregularidades encontradas..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-orange-600" />
                  Evidências da Fiscalização
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Foto da Fiscalização
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('fotoFiscalizacao', e.target.files[0])}
                        id="foto-fiscalizacao-upload"
                      />
                      <label
                        htmlFor="foto-fiscalizacao-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          uploadedFiles.fotoFiscalizacao
                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoFiscalizacao ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.fotoFiscalizacao ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.fotoFiscalizacao ? 'Foto carregada' : 'Carregar foto'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Vídeo da Fiscalização
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => handleFileUpload('videoFiscalizacao', e.target.files[0])}
                        id="video-fiscalizacao-upload"
                      />
                      <label
                        htmlFor="video-fiscalizacao-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          uploadedFiles.videoFiscalizacao
                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.videoFiscalizacao ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.videoFiscalizacao ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.videoFiscalizacao ? 'Vídeo carregado' : 'Carregar vídeo'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Ocorrências Florestais
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Ocorrências Florestais</h3>
              </div>
              <p className="text-gray-600">
                Registo de ocorrências como queimadas, pragas, desmatamento ilegal e outras situações.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-purple-600" />
                  Tipo de Ocorrência
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CustomInput
                    type="select"
                    label="Tipo de Ocorrência"
                    value={formData.tipoOcorrencia}
                    options={[
                      { label: 'Queimada', value: 'QUEIMADA' },
                      { label: 'Praga', value: 'PRAGA' },
                      { label: 'Desmatamento ilegal', value: 'DESMATAMENTO_ILEGAL' },
                      { label: 'Enchente', value: 'ENCHENTE' },
                      { label: 'Outra', value: 'OUTRA' }
                    ]}
                    onChange={(value) => handleInputChange('tipoOcorrencia', value)}
                    placeholder="Selecione o tipo"
                  />

                  <CustomInput
                    type="select"
                    label="Modo de Submissão"
                    value={formData.modoSubmissao}
                    options={[
                      { label: 'App', value: 'APP' },
                      { label: 'SMS', value: 'SMS' },
                      { label: 'IVR', value: 'IVR' }
                    ]}
                    onChange={(value) => handleInputChange('modoSubmissao', value)}
                    placeholder="Como foi reportado"
                  />
                </div>

                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Descrição Adicional"
                    value={formData.descricaoAdicional}
                    onChange={(value) => handleInputChange('descricaoAdicional', value)}
                    placeholder="Descreva detalhes da ocorrência..."
                    rows={4}
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-purple-600" />
                  Localização da Ocorrência
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <CustomInput
                    type="number"
                    label="Latitude (°)"
                    value={formData.latitudeGPS2}
                    onChange={(value) => handleInputChange('latitudeGPS2', value)}
                    placeholder="Ex: -8.838333"
                    step="any"
                  />

                  <CustomInput
                    type="number"
                    label="Longitude (°)"
                    value={formData.longitudeGPS2}
                    onChange={(value) => handleInputChange('longitudeGPS2', value)}
                    placeholder="Ex: 13.234444"
                    step="any"
                  />

                  <CustomInput
                    type="number"
                    label="Altitude (m)"
                    value={formData.altitudeGPS2}
                    onChange={(value) => handleInputChange('altitudeGPS2', value)}
                    placeholder="Ex: 73"
                  />

                  <CustomInput
                    type="number"
                    label="Precisão (m)"
                    value={formData.precisaoGPS2}
                    onChange={(value) => handleInputChange('precisaoGPS2', value)}
                    placeholder="Ex: 5"
                  />
                </div>

                <MapaGPS
                  latitude={formData.latitudeGPS2}
                  longitude={formData.longitudeGPS2}
                  onLocationSelect={(lat, lng) => {
                    handleInputChange('latitudeGPS2', lat);
                    handleInputChange('longitudeGPS2', lng);
                  }}
                />
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-purple-600" />
                  Evidências da Ocorrência
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Foto da Ocorrência
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('fotoOcorrencia', e.target.files[0])}
                        id="foto-ocorrencia-upload"
                      />
                      <label
                        htmlFor="foto-ocorrencia-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          uploadedFiles.fotoOcorrencia
                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoOcorrencia ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.fotoOcorrencia ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.fotoOcorrencia ? 'Foto carregada' : 'Carregar foto'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Vídeo da Ocorrência
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => handleFileUpload('videoOcorrencia', e.target.files[0])}
                        id="video-ocorrencia-upload"
                      />
                      <label
                        htmlFor="video-ocorrencia-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          uploadedFiles.videoOcorrencia
                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.videoOcorrencia ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.videoOcorrencia ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.videoOcorrencia ? 'Vídeo carregado' : 'Carregar vídeo'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Produção e Comércio Florestal
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-teal-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Trees className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Produção e Comércio Florestal</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre produção florestal, volumes e destinos comerciais.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Trees className="w-5 h-5 mr-2 text-green-600" />
                  Dados de Produção
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="text"
                    label="Espécie Produzida"
                    value={formData.especieProduzida}
                    onChange={(value) => handleInputChange('especieProduzida', value)}
                    placeholder="Nome da espécie principal"
                  />

                  <CustomInput
                    type="number"
                    label="Volume Anual (m³)"
                    value={formData.volumeAnual}
                    onChange={(value) => handleInputChange('volumeAnual', value)}
                    placeholder="Volume anual produzido"
                    min="0"
                    step="0.1"
                  />

                  <CustomInput
                    type="text"
                    label="Origem (Área Cadastrada)"
                    value={formData.origemAreaCadastrada}
                    onChange={(value) => handleInputChange('origemAreaCadastrada', value)}
                    placeholder="Área de origem cadastrada"
                  />

                  <CustomInput
                    type="select"
                    label="Destino"
                    value={formData.destino}
                    options={[
                      { label: 'Mercado Interno', value: 'MERCADO_INTERNO' },
                      { label: 'Exportação', value: 'EXPORTACAO' }
                    ]}
                    onChange={(value) => handleInputChange('destino', value)}
                    placeholder="Destino da produção"
                  />
                </div>

                <div className="mt-6 space-y-6">
                  <CustomInput
                    type="textarea"
                    label="Rastreabilidade (Origem → Transporte → Destino)"
                    value={formData.rastreabilidade}
                    onChange={(value) => handleInputChange('rastreabilidade', value)}
                    placeholder="Descreva o caminho de rastreabilidade..."
                    rows={3}
                  />

                  <CustomInput
                    type="textarea"
                    label="Documentos de Transporte"
                    value={formData.documentosTransporte}
                    onChange={(value) => handleInputChange('documentosTransporte', value)}
                    placeholder="Liste os documentos necessários para transporte..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Sanções e Autos de Infração
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
                Registo de sanções aplicadas e autos de infração emitidos.
              </p>
            </div>

            <div className="space-y-8">
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Gavel className="w-5 h-5 mr-2 text-red-600" />
                  Dados da Sanção
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <CustomInput
                    type="text"
                    label="Número do Auto"
                    value={formData.numeroAuto}
                    onChange={(value) => handleInputChange('numeroAuto', value)}
                    placeholder="Número do auto de infração"
                  />

                  <CustomInput
                    type="date"
                    label="Data"
                    value={formData.dataAuto}
                    onChange={(value) => handleInputChange('dataAuto', value)}
                  />

                  <CustomInput
                    type="select"
                    label="Tipo de Infração"
                    value={formData.tipoInfracao}
                    options={[
                      { label: 'Multa', value: 'MULTA' },
                      { label: 'Apreensão', value: 'APREENSAO' },
                      { label: 'Embargo', value: 'EMBARGO' }
                    ]}
                    onChange={(value) => handleInputChange('tipoInfracao', value)}
                    placeholder="Tipo de infração"
                  />

                  <CustomInput
                    type="number"
                    label="Valor (AKZ)"
                    value={formData.valorAkz}
                    onChange={(value) => handleInputChange('valorAkz', value)}
                    placeholder="Valor da multa em Kwanzas"
                    min="0"
                  />

                  <CustomInput
                    type="select"
                    label="Status da Sanção"
                    value={formData.statusSancao}
                    options={[
                      { label: 'Paga', value: 'PAGA' },
                      { label: 'Pendente', value: 'PENDENTE' },
                      { label: 'Recurso', value: 'RECURSO' }
                    ]}
                    onChange={(value) => handleInputChange('statusSancao', value)}
                    placeholder="Status atual"
                  />
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Camera className="w-5 h-5 mr-2 text-red-600" />
                  Evidências da Sanção
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Foto da Sanção
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={(e) => handleFileUpload('fotoSancao', e.target.files[0])}
                        id="foto-sancao-upload"
                      />
                      <label
                        htmlFor="foto-sancao-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          uploadedFiles.fotoSancao
                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoSancao ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.fotoSancao ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.fotoSancao ? 'Foto carregada' : 'Carregar foto'}
                        </p>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <label className="block text-sm font-semibold text-gray-700 text-left">
                      Vídeo da Sanção
                    </label>
                    <div className="relative">
                      <input
                        type="file"
                        className="hidden"
                        accept="video/*"
                        onChange={(e) => handleFileUpload('videoSancao', e.target.files[0])}
                        id="video-sancao-upload"
                      />
                      <label
                        htmlFor="video-sancao-upload"
                        className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                          uploadedFiles.videoSancao
                            ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                            : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                        }`}
                      >
                        <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.videoSancao ? 'text-blue-500' : 'text-gray-400'}`} />
                        <p className={`text-sm font-medium ${uploadedFiles.videoSancao ? 'text-blue-600' : 'text-gray-500'}`}>
                          {uploadedFiles.videoSancao ? 'Vídeo carregado' : 'Carregar vídeo'}
                        </p>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 6: // Documentos
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Resumo e Finalização</h3>
              </div>
              <p className="text-gray-600">
                Revise os dados inseridos e finalize o cadastro do produtor florestal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-green-600" />
                Resumo do Cadastro
              </h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Nome do Produtor:</span>
                    <p className="text-gray-800">{formData.nomeProdutor || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">BI/NIF:</span>
                    <p className="text-gray-800">{formData.biNif || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Contacto:</span>
                    <p className="text-gray-800">{formData.contacto || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Propriedade:</span>
                    <p className="text-gray-800">{formData.propriedade?.label || formData.propriedade || 'Não informado'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-600">Volume Estimado:</span>
                    <p className="text-gray-800">{formData.volumeEstimado ? `${formData.volumeEstimado} m³` : 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estado de Conservação:</span>
                    <p className="text-gray-800">{formData.estadoConservacao?.label || formData.estadoConservacao || 'Não informado'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Localização:</span>
                    <p className="text-gray-800">
                      {formData.latitudeGPS && formData.longitudeGPS ? 
                        `${formData.latitudeGPS}°, ${formData.longitudeGPS}°` : 
                        'Não informado'
                      }
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                  <p className="text-green-700 text-sm font-medium">
                    Todos os dados foram preenchidos. Clique em "Cadastrar" para finalizar o registro.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Etapa não encontrada</div>;
    }
  };

  const formatDateForAPI = (dateValue) => {
    if (!dateValue) return '';
    if (typeof dateValue === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateValue)) {
      return dateValue;
    }
    if (dateValue instanceof Date) {
      return dateValue.toISOString().split('T')[0];
    }
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
      // Criar o objeto de dados mapeado para a API
      const apiData = {
        Nome_do_Produtor: formData.nomeProdutor || '',
        BI_NIF: formData.biNif || '',
        Contacto: formData.contacto || '',
        Localiza_o_GPS: `${formData.latitudeGPS || ''},${formData.longitudeGPS || ''},${formData.altitudeGPS || ''},${formData.precisaoGPS || ''}`,
        Propriedade: formData.propriedade?.value || formData.propriedade || '',
        Esp_cies_predominantes: Array.isArray(formData.especiesPredominantes) ? 
          formData.especiesPredominantes.map(item => item.value || item).join(',') : 
          formData.especiesPredominantes || '',
        Volume_estimado_m: formData.volumeEstimado?.toString() || '0',
        Estado_de_conserva_o: formData.estadoConservacao?.value || formData.estadoConservacao || '',
        Tipo_de_licen_a_solicitada: Array.isArray(formData.tipoLicencaSolicitada) ? 
          formData.tipoLicencaSolicitada.map(item => item.value || item).join(',') : 
          formData.tipoLicencaSolicitada || '',
        _rea_associada: formData.areaAssociada || '',
        Upload_de_documentos: '', // Será preenchido com arquivo
        Validade_pretendida: formData.validadePretendida || '',
        Autoriza_o_final: formData.autorizacaoFinal?.value || formData.autorizacaoFinal || '',
        ID_da_licen_a_fiscalizada: formData.idLicencaFiscalizada || '',
        Data_da_inspe_o: formatDateForAPI(formData.dataInspecao),
        Foto: '', // Será preenchido com arquivo
        V_deo: '', // Será preenchido com arquivo
        Localiza_o_GPS_001: `${formData.latitudeGPS2 || ''},${formData.longitudeGPS2 || ''},${formData.altitudeGPS2 || ''},${formData.precisaoGPS2 || ''}`,
        Resultado_da_inspe_o: formData.resultadoInspecao?.value || formData.resultadoInspecao || '',
        Descri_o_da_infra_o: formData.descricaoInfracao || '',
        Auto_emitido: formData.autoEmitido?.value || formData.autoEmitido || '',
        Tipo_de_ocorr_ncia: formData.tipoOcorrencia?.value || formData.tipoOcorrencia || '',
        Modo_de_submiss_o: formData.modoSubmissao?.value || formData.modoSubmissao || '',
        Localiza_o_GPS_002: `${formData.latitudeGPS2 || ''},${formData.longitudeGPS2 || ''},${formData.altitudeGPS2 || ''},${formData.precisaoGPS2 || ''}`,
        Foto_001: '', // Será preenchido com arquivo
        V_deo_001: '', // Será preenchido com arquivo
        Descri_o_adicional: formData.descricaoAdicional || '',
        Esp_cie_produzida: formData.especieProduzida || '',
        Volume_anual_m: formData.volumeAnual?.toString() || '0',
        Origem_rea_cadastrada: formData.origemAreaCadastrada || '',
        Documentos_de_transporte: formData.documentosTransporte || '',
        N_mero_do_auto: formData.numeroAuto || '',
        Data: formatDateForAPI(formData.dataAuto),
        Tipo_de_infra_o: formData.tipoInfracao?.value || formData.tipoInfracao || '',
        Valor_AKZ: formData.valorAkz?.toString() || '0',
        Foto_002: '', // Será preenchido com arquivo
        V_deo_002: '', // Será preenchido com arquivo
        Status_da_san_o: formData.statusSancao?.value || formData.statusSancao || ''
      };

      console.log('📋 Dados mapeados para enviar:', apiData);

      // Criar FormData para enviar arquivos
      const formDataToSend = new FormData();

      // Adicionar todos os campos de texto
      Object.keys(apiData).forEach(key => {
        if (apiData[key] !== null && apiData[key] !== undefined) {
          formDataToSend.append(key, apiData[key]);
        }
      });

      // Adicionar arquivos se existirem
      if (uploadedFiles.uploadDocumentos) {
        formDataToSend.append('Upload_de_documentos', uploadedFiles.uploadDocumentos);
      }
      if (uploadedFiles.fotoFiscalizacao) {
        formDataToSend.append('Foto', uploadedFiles.fotoFiscalizacao);
      }
      if (uploadedFiles.videoFiscalizacao) {
        formDataToSend.append('V_deo', uploadedFiles.videoFiscalizacao);
      }
      if (uploadedFiles.fotoOcorrencia) {
        formDataToSend.append('Foto_001', uploadedFiles.fotoOcorrencia);
      }
      if (uploadedFiles.videoOcorrencia) {
        formDataToSend.append('V_deo_001', uploadedFiles.videoOcorrencia);
      }
      if (uploadedFiles.fotoSancao) {
        formDataToSend.append('Foto_002', uploadedFiles.fotoSancao);
      }
      if (uploadedFiles.videoSancao) {
        formDataToSend.append('V_deo_002', uploadedFiles.videoSancao);
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
      const response = await api.post('/produtorFlorestal', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 120000,
      });

      console.log('✅ Produtor florestal cadastrado com sucesso:', response.data);

      setLoading(false);
      showToast('success', 'Sucesso', 'Produtor florestal cadastrado com sucesso!');

      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setUploadedFiles({});

    } catch (error) {
      setLoading(false);
      console.error('❌ Erro ao cadastrar produtor florestal:', error);

      if (error.response) {
        console.error('📄 Detalhes do erro de resposta:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          headers: error.response.headers
        });

        if (error.response.status === 400) {
          const errorData = error.response.data;
          console.error('🔍 Detalhes do erro 400:', errorData);

          if (errorData && errorData.errors) {
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
        showToast('error', 'Erro', 'Erro inesperado ao cadastrar produtor florestal. Tente novamente.');
      }
    }
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${
          toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
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
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Produtor Florestal</h1>
            <p className="text-gray-600">Sistema de Registro Nacional de Produtores Florestais</p>
          </div>

          {/* Step Navigation */}
          <div className="flex justify-between items-center px-8 mb-8 overflow-x-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              return (
                <div
                  key={index}
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                    index > activeIndex ? 'opacity-50' : ''
                  }`}
                  onClick={() => index <= activeIndex && setActiveIndex(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                    index < activeIndex ? 'bg-green-500 text-white' :
                    index === activeIndex ? 'bg-green-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${
                    index === activeIndex ? 'text-green-700' : 'text-gray-500'
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
              className="bg-green-600 h-2 transition-all duration-300 rounded-full"
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
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 
                'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
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
              className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${
                'bg-green-600 hover:bg-green-700 text-white shadow-lg'
              }`}
              disabled={loading}
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
                  if (validateCurrentStep()) {
                    handleSubmit(e);
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
                  Cadastrar Produtor Florestal
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

export default CadastroProdutorFlorestal;