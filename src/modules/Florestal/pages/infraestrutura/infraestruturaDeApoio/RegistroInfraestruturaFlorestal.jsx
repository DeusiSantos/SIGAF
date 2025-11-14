import L from 'leaflet';
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
  Factory,
  FileText,
  Gauge,
  Globe,
  Home,
  Info,
  Loader,
  Mail,
  MapPin,
  Phone,
  Settings,
  Users,
  Wrench
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';

import axios from "axios";
import CustomInput from '../../../../../core/components/CustomInput';

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
                <strong>Localização da Infraestrutura</strong><br />
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

const RegistroInfraestruturaFlorestal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Dados das províncias angolanas
  const provinciasData = [
    { nome: 'Bengo', municipios: '["Ambriz", "Bula Atumba", "Dande", "Dembos", "Nambuangongo", "Pango Aluquém"]' },
    { nome: 'Benguela', municipios: '["Benguela", "Baía Farta", "Bocoio", "Caimbambo", "Chongoroi", "Cubal", "Ganda", "Lobito"]' },
    { nome: 'Bié', municipios: '["Andulo", "Camacupa", "Catabola", "Chinguar", "Chitembo", "Cuemba", "Cunhinga", "Kuito", "Nharea"]' },
    { nome: 'Cabinda', municipios: '["Belize", "Buco-Zau", "Cabinda", "Cacongo"]' },
    { nome: 'Cuando Cubango', municipios: '["Calai", "Cuangar", "Cuchi", "Cuito Cuanavale", "Dirico", "Mavinga", "Menongue", "Nancova", "Rivungo"]' },
    { nome: 'Cuanza Norte', municipios: '["Ambaca", "Banga", "Bolongongo", "Cambambe", "Cazengo", "Golungo Alto", "Gonguembo", "Lucala", "Quiculungo", "Samba Caju"]' },
    { nome: 'Cuanza Sul', municipios: '["Amboim", "Cassongue", "Cela", "Conda", "Ebo", "Libolo", "Mussende", "Porto Amboim", "Quibala", "Quilenda", "Sumbe", "Waku Kungo"]' },
    { nome: 'Cunene', municipios: '["Cahama", "Cuanhama", "Curoca", "Cuvelai", "Namacunde", "Ombadja", "Ondjiva"]' },
    { nome: 'Huambo', municipios: '["Bailundo", "Caála", "Catchiungo", "Ekunha", "Huambo", "Londuimbali", "Longonjo", "Mungo", "Tchicala-Tcholoanga", "Tchindjenje", "Ukuma"]' },
    { nome: 'Huíla', municipios: '["Caconda", "Cacula", "Caluquembe", "Chiange", "Chibia", "Chicomba", "Chipindo", "Cuvango", "Humpata", "Jamba", "Lubango", "Matala", "Quilengues", "Quipungo"]' },
    { nome: 'Luanda', municipios: '["Belas", "Cacuaco", "Cazenga", "Ícolo e Bengo", "Luanda", "Quiçama", "Talatona", "Viana"]' },
    { nome: 'Lunda Norte', municipios: '["Cambulo", "Capenda-Camulemba", "Caungula", "Chitato", "Cuango", "Cuílo", "Lóvua", "Lubalo", "Lucapa", "Xá-Muteba"]' },
    { nome: 'Lunda Sul', municipios: '["Cacolo", "Dala", "Muconda", "Saurimo"]' },
    { nome: 'Malanje', municipios: '["Cacuso", "Calandula", "Cambundi-Catembo", "Cangandala", "Caombo", "Cuaba Nzoji", "Cunda-Dia-Baze", "Kiwaba Nzogi", "Luquembo", "Malanje", "Marimba", "Massango", "Mucari", "Quela", "Quirima"]' },
    { nome: 'Moxico', municipios: '["Alto Zambeze", "Bundas", "Camanongue", "Léua", "Luacano", "Luau", "Luchazes", "Lungwebungu", "Moxico"]' },
    { nome: 'Namibe', municipios: '["Bibala", "Camucuio", "Moçâmedes", "Tômbwa", "Virei"]' },
    { nome: 'Uíge', municipios: '["Alto Cauale", "Ambuíla", "Bembe", "Buengas", "Bungo", "Damba", "Mucaba", "Negage", "Puri", "Quimbele", "Quitexe", "Sanza Pombo", "Songo", "Tangi", "Uíge", "Zombo"]' },
    { nome: 'Zaire', municipios: '["Cuimba", "Mbanza-Kongo", "Nóqui", "Nzeto", "Soyo", "Tomboco"]' }
  ];

  // Estado inicial do formulário
  const initialState = {
    // Identificação da Infraestrutura
    biNif: '',
    nomeInfraestrutura: '',
    tipoInfraestrutura: '',
    outroTipo: '',

    // Localização
    provincia: '',
    municipio: '',
    comuna: '',
    aldeiaZona: '',
    latitude: '',
    longitude: '',
    altitude: '',
    precisao: '',

    // Características Técnicas
    dimensao: '',
    dimensaoUnidade: '',
    capacidade: '',
    capacidadeUnidade: '',
    estadoConservacao: '',

    // Entidade Responsável
    proprietarioGestor: '',
    contacto: '',
    email: '',

    // Utilização
    beneficiariosDirectos: '',
    principaisCulturas: '',
    frequenciaUtilizacao: '',

    // Observações
    observacoes: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Identificação', icon: Building },
    { label: 'Localização', icon: MapPin },
    { label: 'Características', icon: Settings },
    { label: 'Responsável', icon: Users },
    { label: 'Utilização', icon: Activity },
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
        if (!formData.nomeInfraestrutura) newErrors.nomeInfraestrutura = 'Campo obrigatório';
        if (!formData.tipoInfraestrutura) newErrors.tipoInfraestrutura = 'Campo obrigatório';
        if (formData.tipoInfraestrutura === 'OUTRO' && !formData.outroTipo) {
          newErrors.outroTipo = 'Especifique o tipo de infraestrutura';
        }
        break;
      case 1: // Localização
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        break;
      case 2: // Características
        if (!formData.estadoConservacao) newErrors.estadoConservacao = 'Campo obrigatório';
        break;
      case 3: // Responsável
        if (!formData.proprietarioGestor) newErrors.proprietarioGestor = 'Campo obrigatório';
        if (!formData.contacto) newErrors.contacto = 'Campo obrigatório';
        break;
      case 4: // Utilização
        if (!formData.frequenciaUtilizacao) newErrors.frequenciaUtilizacao = 'Campo obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };



  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Função para extrair valor de objeto ou retornar string
      const extractValue = (field) => {
        if (typeof field === "object" && field !== null) {
          return field.value || "";
        }
        return field || "";
      };

      // Preparar dados para a API
      const coordenadasGPS = `${formData.latitude || "0"}, ${formData.longitude || "0"}${formData.altitude ? `, ${formData.altitude}m` : ""
        }${formData.precisao ? ` (±${formData.precisao}m)` : ""}`;

      const dimensaoUnidade = extractValue(formData.dimensaoUnidade);
      const capacidadeUnidade = extractValue(formData.capacidadeUnidade);

      const dimensaoCompleta = `${formData.dimensao || ""}${dimensaoUnidade ? ` ${dimensaoUnidade}` : ""
        }`.trim();
      const capacidadeCompleta = `${formData.capacidade || ""}${capacidadeUnidade ? ` ${capacidadeUnidade}` : ""
        }`.trim();

      const tipoInfraestrutura = extractValue(formData.tipoInfraestrutura);
      const finalTipoInfraestrutura =
        tipoInfraestrutura === "OUTRO" ? formData.outroTipo : tipoInfraestrutura;

      const dataToSend = {
        data_de_Registo: new Date().toISOString().split("T")[0], // Data atual no formato YYYY-MM-DD
        bI_NIF: formData.biNif || "",
        nome_da_Infraestrutura: formData.nomeInfraestrutura || "",
        tipo_de_Infraestrutura: finalTipoInfraestrutura || "",
        provincia: extractValue(formData.provincia),
        municipio: extractValue(formData.municipio),
        comuna: formData.comuna || "",
        aldeia_Zona: formData.aldeiaZona || "",
        coordenadas_GPS: coordenadasGPS,
        dimens_o_m_ha_km_etc: dimensaoCompleta,
        capacidade_ex_litr_mero_de_utilizadores: capacidadeCompleta,
        estado_de_Conserva_o: extractValue(formData.estadoConservacao),
        propriet_rio_Institui_o_Gestora: formData.proprietarioGestor || "",
        contacto: formData.contacto || "",
        e_mail: formData.email || "",
        benefici_rios_Directos: formData.beneficiariosDirectos || "",
        principais_Culturas_Actividades_Apoiada: formData.principaisCulturas || "",
        frequ_ncia_de_Utiliza_o: extractValue(formData.frequenciaUtilizacao),
        _6_Observa_es_Gerais: formData.observacoes || "",
      };

      console.log("📤 Dados preparados para envio:", dataToSend);

      // 🚀 Enviar com Axios
      const response = await axios.post(
        "http://mwangobrainsa-001-site2.mtempurl.com/api/infraestrutura",
        dataToSend,
        {
          headers: {
            "Content-Type": "application/json",
            Accept: "*/*",
          },
        }
      );

      console.log("✅ Resposta da API:", response.data);

      setLoading(false);
      showToast("success", "Sucesso", "Infraestrutura registrada com sucesso!");

      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
    } catch (error) {
      setLoading(false);
      console.error("❌ Erro ao registrar infraestrutura:", error);

      let errorMessage = "Erro ao registrar infraestrutura. Tente novamente.";

      if (error.message.includes("Network Error")) {
        errorMessage = "Erro de conexão. Verifique sua internet e tente novamente.";
      } else if (error.response) {
        // API respondeu com erro
        errorMessage = `Erro do servidor: ${error.response.status} - ${JSON.stringify(
          error.response.data
        )}`;
      }

      showToast("error", "Erro", errorMessage);
    }
  };


  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Identificação da Infraestrutura
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-center rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex justify-center items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação da Infraestrutura</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados básicos de identificação da infraestrutura agrícola.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CustomInput
                type="text"
                label="BI/NIF"
                value={formData.biNif}
                onChange={(value) => handleInputChange('biNif', value)}
                placeholder="Número do BI ou NIF do responsável"
                iconStart={<FileText size={18} />}
              />

              <CustomInput
                type="text"
                label="Nome da Infraestrutura"
                value={formData.nomeInfraestrutura}
                onChange={(value) => handleInputChange('nomeInfraestrutura', value)}
                required
                errorMessage={errors.nomeInfraestrutura}
                placeholder="Digite o nome da infraestrutura"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="select"
                label="Tipo de Infraestrutura"
                value={formData.tipoInfraestrutura}
                options={[
                  { label: 'Canal de Irrigação', value: 'CANAL_IRRIGACAO' },
                  { label: 'Represa/Barragem', value: 'REPRESA_BARRAGEM' },
                  { label: 'Furo de Água / Poço Artesiano', value: 'FURO_AGUA' },
                  { label: 'Sistema de Rega (aspersão/gota-a-gota)', value: 'SISTEMA_REGA' },
                  { label: 'Armazém de Conservação', value: 'ARMAZEM_CONSERVACAO' },
                  { label: 'Silos de Grãos', value: 'SILOS_GRAOS' },
                  { label: 'Estufa Agrícola', value: 'ESTUFA_AGRICOLA' },
                  { label: 'Estação Meteorológica', value: 'ESTACAO_METEOROLOGICA' },
                  { label: 'Estrada de Acesso Rural', value: 'ESTRADA_ACESSO' },
                  { label: 'Mercado de Produtos Agrícolas', value: 'MERCADO_AGRICOLA' },
                  { label: 'Centro de Formação Agrária', value: 'CENTRO_FORMACAO' },
                  { label: 'Centro de Extensão Rural', value: 'CENTRO_EXTENSAO' },
                  { label: 'Posto de Assistência Veterinária', value: 'POSTO_VETERINARIO' },
                  { label: 'Matadouro Municipal / Abatedouro', value: 'MATADOURO' },
                  { label: 'Cais de Pesca / Infraestrutura Aquícola', value: 'CAIS_PESCA' },
                  { label: 'Centros de Processamento Agroalimentar', value: 'CENTRO_PROCESSAMENTO' },
                  { label: 'Tratores/Equipamentos Agrícolas Comunitários', value: 'EQUIPAMENTOS_COMUNITARIOS' },
                  { label: 'Outro', value: 'OUTRO' }
                ]}
                onChange={(value) => handleInputChange('tipoInfraestrutura', value)}
                required
                errorMessage={errors.tipoInfraestrutura}
                placeholder="Selecione o tipo de infraestrutura"
                iconStart={<Factory size={18} />}
              />

              {formData.tipoInfraestrutura === 'OUTRO' && (
                <CustomInput
                  type="text"
                  label="Especificar Outro Tipo"
                  value={formData.outroTipo}
                  onChange={(value) => handleInputChange('outroTipo', value)}
                  required
                  errorMessage={errors.outroTipo}
                  placeholder="Especifique o tipo de infraestrutura"
                  iconStart={<FileText size={18} />}
                />
              )}
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
                Informe a localização geográfica da infraestrutura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
                label="Comuna"
                value={formData.comuna}
                onChange={(value) => handleInputChange('comuna', value)}
                placeholder="Nome da comuna"
                iconStart={<Home size={18} />}
              />

              <CustomInput
                type="text"
                label="Aldeia/Zona"
                value={formData.aldeiaZona}
                onChange={(value) => handleInputChange('aldeiaZona', value)}
                placeholder="Nome da aldeia ou zona"
                iconStart={<Home size={18} />}
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

              <CustomInput
                type="number"
                label="Altitude (m)"
                value={formData.altitude}
                onChange={(value) => handleInputChange('altitude', value)}
                placeholder="Altitude em metros"
                iconStart={<Activity size={18} />}
              />

              <CustomInput
                type="number"
                label="Precisão (m)"
                value={formData.precisao}
                onChange={(value) => handleInputChange('precisao', value)}
                placeholder="Precisão do GPS em metros"
                iconStart={<Activity size={18} />}
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

      case 2: // Características Técnicas
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Características Técnicas</h3>
              </div>
              <p className="text-gray-600">
                Informações técnicas sobre a infraestrutura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Dimensão"
                  value={formData.dimensao}
                  onChange={(value) => handleInputChange('dimensao', value)}
                  placeholder="Ex: 100, 50, 2"
                  iconStart={<Gauge size={18} />}
                />
              </div>
              <CustomInput
                type="select"
                label="Unidade"
                value={formData.dimensaoUnidade}
                options={[
                  { label: 'm² (metros quadrados)', value: 'm²' },
                  { label: 'ha (hectares)', value: 'ha' },
                  { label: 'km (quilômetros)', value: 'km' },
                  { label: 'm (metros)', value: 'm' },
                  { label: 'cm (centímetros)', value: 'cm' },
                  { label: 'km² (quilômetros quadrados)', value: 'km²' }
                ]}
                onChange={(value) => handleInputChange('dimensaoUnidade', value)}
                placeholder="Selecione a unidade"
                iconStart={<Gauge size={18} />}
              />

              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Capacidade"
                  value={formData.capacidade}
                  onChange={(value) => handleInputChange('capacidade', value)}
                  placeholder="Ex: 1000, 50, 200"
                  iconStart={<Activity size={18} />}
                />
              </div>
              <CustomInput
                type="select"
                label="Unidade"
                value={formData.capacidadeUnidade}
                options={[
                  { label: 'litros', value: 'litros' },
                  { label: 'toneladas', value: 'toneladas' },
                  { label: 'utilizadores', value: 'utilizadores' },
                  { label: 'pessoas', value: 'pessoas' },
                  { label: 'sacos', value: 'sacos' },
                  { label: 'm³ (metros cúbicos)', value: 'm³' },
                  { label: 'kg (quilogramas)', value: 'kg' },
                  { label: 'animais', value: 'animais' },
                  { label: 'cabeças de gado', value: 'cabeças' },
                  { label: 'veículos', value: 'veículos' }
                ]}
                onChange={(value) => handleInputChange('capacidadeUnidade', value)}
                placeholder="Selecione a unidade"
                iconStart={<Activity size={18} />}
              />

              <div className="md:col-span-3">
                <CustomInput
                  type="select"
                  label="Estado de Conservação"
                  value={formData.estadoConservacao}
                  options={[
                    { label: 'Bom', value: 'BOM' },
                    { label: 'Razoável', value: 'RAZOAVEL' },
                    { label: 'Mau', value: 'MAU' }
                  ]}
                  onChange={(value) => handleInputChange('estadoConservacao', value)}
                  required
                  errorMessage={errors.estadoConservacao}
                  placeholder="Selecione o estado de conservação"
                  iconStart={<Wrench size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 3: // Entidade Responsável
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Entidade Responsável</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre o proprietário ou gestor da infraestrutura.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <CustomInput
                  type="text"
                  label="Proprietário/Instituição Gestora"
                  value={formData.proprietarioGestor}
                  onChange={(value) => handleInputChange('proprietarioGestor', value)}
                  required
                  errorMessage={errors.proprietarioGestor}
                  placeholder="Nome do proprietário ou instituição"
                  iconStart={<Building size={18} />}
                />
              </div>

              <CustomInput
                type="tel"
                label="Contacto"
                value={formData.contacto}
                onChange={(value) => {
                  const onlyNumbers = value.replace(/\D/g, '').slice(0, 9);
                  handleInputChange('contacto', onlyNumbers);
                }}
                required
                errorMessage={errors.contacto}
                placeholder="Ex: 923456789"
                iconStart={<Phone size={18} />}
                maxLength={9}
              />

              <CustomInput
                type="email"
                label="E-mail"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                placeholder="contato@exemplo.com"
                iconStart={<Mail size={18} />}
              />
            </div>
          </div>
        );

      case 4: // Utilização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Activity className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Utilização</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre como a infraestrutura é utilizada.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CustomInput
                type="textarea"
                label="Beneficiários Directos"
                value={formData.beneficiariosDirectos}
                onChange={(value) => handleInputChange('beneficiariosDirectos', value)}
                placeholder="Descreva quem são os principais beneficiários desta infraestrutura..."
                rows={3}
                iconStart={<Users size={18} />}
              />

              <CustomInput
                type="textarea"
                label="Principais Culturas/Actividades Apoiadas"
                value={formData.principaisCulturas}
                onChange={(value) => handleInputChange('principaisCulturas', value)}
                placeholder="Ex: Milho, Feijão, Criação de Gado, etc."
                rows={3}
                iconStart={<Activity size={18} />}
              />

              <CustomInput
                type="select"
                label="Frequência de Utilização"
                value={formData.frequenciaUtilizacao}
                options={[
                  { label: 'Diária', value: 'DIARIA' },
                  { label: 'Semanal', value: 'SEMANAL' },
                  { label: 'Sazonal', value: 'SAZONAL' }
                ]}
                onChange={(value) => handleInputChange('frequenciaUtilizacao', value)}
                required
                errorMessage={errors.frequenciaUtilizacao}
                placeholder="Selecione a frequência de uso"
                iconStart={<Calendar size={18} />}
              />
            </div>
          </div>
        );

      case 5: // Observações
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-gray-50 to-slate-50 rounded-2xl p-6 mb-8 border border-gray-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <Info className="w-6 h-6 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Observações Gerais</h3>
              </div>
              <p className="text-gray-600">
                Informações adicionais sobre a infraestrutura.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6">
              <CustomInput
                type="textarea"
                label="Observações"
                value={formData.observacoes}
                onChange={(value) => handleInputChange('observacoes', value)}
                placeholder="Informações adicionais, comentários ou observações relevantes sobre a infraestrutura..."
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
            'bg-blue-100 border-l-4 border-blue-500 text-blue-700'
          }`}>
          <div className="flex items-center">
            <div className="mr-3">
              {toastMessage.severity === 'success' && <CheckCircle size={20} />}
              {toastMessage.severity === 'error' && <AlertCircle size={20} />}
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
          <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-700 to-blue-500 rounded-t-lg">
            <h1 className="text-4xl font-bold mb-3 text-white">
              Registo de Infraestruturas de Apoio à Agricultura
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
                  className={`flex flex-col items-center transition-all min-w-0 flex-shrink-0 mx-1 ${!isActive && !isCompleted ? 'opacity-50' : ''
                    }`}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${isActive
                    ? 'bg-gradient-to-r from-blue-700 to-blue-500 shadow-lg text-white'
                    : isCompleted
                      ? 'bg-gradient-to-r from-blue-700 to-blue-500  text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? <Check size={24} /> : <Icon size={24} />}
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
              className="bg-gradient-to-r from-blue-700 to-blue-500  h-2 transition-all duration-300 rounded-full"
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

export default RegistroInfraestruturaFlorestal;