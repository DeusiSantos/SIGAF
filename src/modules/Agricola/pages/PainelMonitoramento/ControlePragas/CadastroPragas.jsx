import {
  Activity,
  AlertCircle,
  Bug,
  Building,
  Calendar,
  Camera,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  FileText,
  Globe,
  Heart,
  Info,
  Loader,
  Map,
  MapPin,
  Phone,
  Tractor,
  User
} from 'lucide-react';
import { useState } from 'react';
import provinciasData from '../../../../../core/components/Provincias.json';


import { MapContainer, Marker, Popup, TileLayer, useMapEvents } from 'react-leaflet';
import CustomInput from '../../../../../core/components/CustomInput';
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

const CadastroPragas = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [Touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);

  // Estado inicial do formulário
  const initialState = {
    // Data de Registro
    dataRegistro: new Date().toISOString().split('T')[0],

    // Identificação do Responsável
    nomeResponsavel: '',
    telefone: '',
    provincia: '',
    municipio: '',
    comuna: '',

    // Coordenadas GPS
    latitude: '',
    longitude: '',
    altitude: '',
    precisao: '',

    // Tipo de Produção
    tipoProducao: '', // 'agricola' ou 'pecuaria' ou 'ambas'

    // Informações Agrícolas
    nomePropriedade: '',
    tipoCultura: '',
    culturaAfetada: [],
    faseCultura: '',
    areaTotalCultivada: '',
    dataPrimeiraObservacao: '',
    nomePraga: '',
    nomeLocalPraga: '',
    sintomasObservados: '',
    percentagemAreaAfetada: '',
    grauDano: '',
    necessitaApoioTecnico: false,
    aplicouMedidaControle: false,
    tipoMedidaAplicada: '',
    resultadoMedida: '',
    observacoesAdicionais: '',

    // Informações Pecuárias
    nomeFazenda: '',
    especieAnimalAfetada: [],
    numeroTotalAnimais: '',
    dataPrimeiraObservacaoPecuaria: '',
    nomePragaDoenca: '',
    sintomasObservadosPecuaria: '',
    numeroAnimaisAfetados: '',
    grauDanoPecuaria: '',
    aplicouTratamento: false,
    tipoTratamento: '',
    resultadoTratamento: '',
    necessitaApoioVeterinario: false,
    observacoesAdicionaisPecuaria: '',

    // Finalização
    nomeValidador: '',
    instituicao: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Responsável', icon: User },
    { label: 'Localização', icon: MapPin },
    { label: 'Tipo Produção', icon: Activity },
    { label: 'Info Agrícolas', icon: Tractor },
    { label: 'Info Pecuárias', icon: Heart },
    { label: 'Finalização', icon: FileText }
  ];



  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  const getCulturaOptions = (tipoCultura) => {
    const culturaMap = {
      cereais: ['Arroz', 'Trigo', 'Milho', 'Cevada', 'Aveia', 'Sorgo'],
      frutas: ['Banana', 'Manga', 'Laranja', 'Maçã', 'Abacaxi', 'Mamão', 'Uva'],
      horticolas: ['Tomate', 'Alface', 'Cenoura', 'Pepino', 'Pimentão', 'Cebola'],
      legumes: ['Feijão', 'Ervilha', 'Lentilha', 'Grão-de-bico', 'Soja'],
      tuberculos: ['Batata', 'Batata-doce', 'Mandioca', 'Inhame', 'Cará']
    };

    return (culturaMap[tipoCultura] || []).map(cultura => ({
      label: cultura,
      value: cultura
    }));
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    if (field === 'provincia') {
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
      return;
    }

    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (fieldName, file) => {
    setUploadedFiles(prev => ({ ...prev, [fieldName]: file }));
    setFormData(prev => ({ ...prev, [fieldName]: file }));
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    switch (activeIndex) {
      case 0: // Responsável
        if (!formData.nomeResponsavel) newErrors.nomeResponsavel = 'Campo obrigatório';
        if (!formData.telefone) newErrors.telefone = 'Campo obrigatório';
        break;
      case 1: // Localização
        //if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        break;
      case 2: // Tipo de Produção
        if (!formData.tipoProducao) newErrors.tipoProducao = 'Campo obrigatório';
        break;
      case 3: // Informações Agrícolas
        if ((formData.tipoProducao === 'agricola' || formData.tipoProducao === 'ambas')) {
          if (!formData.nomePropriedade) newErrors.nomePropriedade = 'Campo obrigatório';
          if (!formData.culturaAfetada.length) newErrors.culturaAfetada = 'Selecione pelo menos uma cultura';
          if (!formData.nomePraga) newErrors.nomePraga = 'Campo obrigatório';
          if (!formData.dataPrimeiraObservacao) newErrors.dataPrimeiraObservacao = 'Campo obrigatório';
        }
        break;
      case 4: // Informações Pecuárias
        if ((formData.tipoProducao === 'pecuaria' || formData.tipoProducao === 'ambas')) {
          if (!formData.nomeFazenda) newErrors.nomeFazenda = 'Campo obrigatório';
          if (!formData.especieAnimalAfetada.length) newErrors.especieAnimalAfetada = 'Selecione pelo menos uma espécie';
          if (!formData.nomePragaDoenca) newErrors.nomePragaDoenca = 'Campo obrigatório';
        }
        break;
      case 5: // Finalização
        if (!formData.nomeValidador) newErrors.nomeValidador = 'Campo obrigatório';
        if (!formData.instituicao) newErrors.instituicao = 'Campo obrigatório';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      const formDataToSend = new FormData();

      // Função auxiliar para formatar datas
      const formatDate = (dateString) => {
        if (!dateString) return '';

        // Se já está no formato YYYY-MM-DD, retorna como está
        if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
          return dateString;
        }

        // Se é um objeto Date, converte para YYYY-MM-DD
        const date = new Date(dateString);
        if (isNaN(date.getTime())) {
          return ''; // Data inválida
        }

        return date.toISOString().split('T')[0];
      };

      // Mapeamento dos campos do formulário para os nomes da API
      formDataToSend.append('Data_de_Registro', formatDate(formData.dataRegistro));
      formDataToSend.append('Nome_do_T_cnico', formData.nomeResponsavel || '');
      formDataToSend.append('Nome_da_Institui_o', formData.instituicao || '');
      formDataToSend.append('Que_tipo_de_servi_o_deseja_mon', 'Monitoramento de Pragas');
      formDataToSend.append('Nome_do_T_cnico_ou_Produtor', formData.nomeResponsavel || '');
      formDataToSend.append('Telefone', formData.telefone || '');
      formDataToSend.append('Provincia', formData.provincia?.value || formData.provincia || '');
      formDataToSend.append('Municipio', formData.municipio?.value || formData.municipio || '');
      formDataToSend.append('Comuna', formData.comuna || '');
      formDataToSend.append('Coordenadas_GPS', `${formData.latitude || ''},${formData.longitude || ''}`);

      // Dados Agrícolas
      formDataToSend.append('Nome_da_Propriedade', formData.nomePropriedade || '');
      formDataToSend.append('Tipo_de_culturas', formData.tipoCultura?.value || formData.tipoCultura || '');
      formDataToSend.append('Frutas', Array.isArray(formData.culturaAfetada) ? formData.culturaAfetada.join(', ') : (formData.culturaAfetada || ''));
      formDataToSend.append('Fase_da_Cultura', formData.faseCultura || '');
      formDataToSend.append('rea_Total_Cultivada_ha', formData.areaTotalCultivada || '');

      // CORREÇÃO: Formatação correta da data de primeira observação agrícola
      const dataObservacaoAgricola = formatDate(formData.dataPrimeiraObservacao);
      if (dataObservacaoAgricola) {
        formDataToSend.append('Data_da_Primeira_Observa_o_001', dataObservacaoAgricola);
      }

      formDataToSend.append('Nome_da_Praga', formData.nomePraga || '');
      formDataToSend.append('Nome_Local_da_Praga', formData.nomeLocalPraga || '');

      // Upload de arquivo - apenas se existir
      if (uploadedFiles.fotoPragaAgricola) {
        formDataToSend.append('Foto_da_Praga_ou_Sintomas', uploadedFiles.fotoPragaAgricola);
      }

      formDataToSend.append('Sintomas_Observados_001', formData.sintomasObservados || '');
      formDataToSend.append('Percentagem_da_rea_Afetada_', formData.percentagemAreaAfetada || '');
      formDataToSend.append('Grau_do_Dano_001', formData.grauDano?.value || formData.grauDano || '');
      formDataToSend.append('Aplicou_alguma_medida_de_contr', formData.aplicouMedidaControle === true ? 'Sim' : 'Não');
      formDataToSend.append('Tipo_de_Medida_Aplicada', formData.tipoMedidaAplicada || '');
      formDataToSend.append('Resultado_da_Medida', formData.resultadoMedida?.value || formData.resultadoMedida || '');

      // Dados Pecuários
      formDataToSend.append('Nome_da_Fazenda', formData.nomeFazenda || '');
      formDataToSend.append('Esp_cie_Animal_Afetada', Array.isArray(formData.especieAnimalAfetada) ? formData.especieAnimalAfetada.join(', ') : (formData.especieAnimalAfetada || ''));
      formDataToSend.append('Os_animais_afectados_tenhem_al', ''); // Campo não implementado no formulário
      formDataToSend.append('Quais_s_o_as_vacinas_os_animais_afectados', ''); // Campo não implementado no formulário
      formDataToSend.append('N_mero_Total_de_Animais', formData.numeroTotalAnimais || '');

      // CORREÇÃO: Formatação correta da data de primeira observação pecuária
      const dataObservacaoPecuaria = formatDate(formData.dataPrimeiraObservacaoPecuaria || formData.dataRegistro);
      if (dataObservacaoPecuaria) {
        formDataToSend.append('Data_da_Primeira_Observa_o', dataObservacaoPecuaria);
      }

      formDataToSend.append('Nome_da_Praga_Doen_a', formData.nomePragaDoenca || '');

      // Upload de arquivo - apenas se existir
      if (uploadedFiles.fotoPragaPecuaria) {
        formDataToSend.append('Foto_dos_Sinais_Cl_nicos', uploadedFiles.fotoPragaPecuaria);
      }

      formDataToSend.append('Sintomas_Observados', formData.sintomasObservadosPecuaria || '');
      formDataToSend.append('N_mero_de_Animais_Afetados', formData.numeroAnimaisAfetados || '');
      formDataToSend.append('Grau_do_Dano', formData.grauDanoPecuaria?.value || formData.grauDanoPecuaria || '');
      formDataToSend.append('Aplicou_algum_tratamento', formData.aplicouTratamento === true ? 'Sim' : 'Não');
      formDataToSend.append('Tipo_de_Tratamento_Usado', formData.tipoTratamento || '');
      formDataToSend.append('Resultado_do_Tratamento', formData.resultadoTratamento?.value || formData.resultadoTratamento || '');
      formDataToSend.append('Necessita_apoio_veterin_rio', formData.necessitaApoioVeterinario === true ? 'Sim' : 'Não');
      formDataToSend.append('Observa_es_adicionais', formData.observacoesAdicionaisPecuaria || '');

      // Dados Gerais
      formDataToSend.append('Qual_o_tipo_de_produ_o_afetada', formData.tipoProducao || '');
      formDataToSend.append('Necessita_apoio_t_cnico', formData.necessitaApoioTecnico === true ? 'Sim' : 'Não');
      formDataToSend.append('Observa_es_adicionais_001', formData.observacoesAdicionais || '');
      formDataToSend.append('Nome_do_Validador', formData.nomeValidador || '');
      formDataToSend.append('Institui_o', formData.instituicao || '');

      // Log para debug - remover em produção
      console.log('Dados de data sendo enviados:');
      console.log('Data_de_Registro:', formatDate(formData.dataRegistro));
      console.log('Data_da_Primeira_Observa_o_001:', dataObservacaoAgricola);
      console.log('Data_da_Primeira_Observa_o:', dataObservacaoPecuaria);

      // Log de todos os dados do FormData para debug
      console.log('FormData completo:');
      for (let pair of formDataToSend.entries()) {
        console.log(pair[0] + ': ' + pair[1]);
      }

      await api.post('/pragas', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      showToast('success', 'Sucesso', 'Registro de praga cadastrado com sucesso!');

      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});

    } catch (error) {
      console.error('Erro ao registrar praga:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);
      console.error('Response headers:', error.response?.headers);

      let errorMessage = 'Erro ao registrar praga. Tente novamente.';

      // Melhor tratamento de erros de validação
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
          // Se há erros de validação específicos
          const errors = Object.entries(error.response.data.errors)
            .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
            .join('; ');
          errorMessage = `Erros de validação: ${errors}`;
        } else {
          errorMessage = JSON.stringify(error.response.data);
        }
      }

      showToast('error', 'Erro', errorMessage);
    } finally {
      setLoading(false);
    }
  };


  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Identificação do Responsável
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <User className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Identificação do Responsável</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados do técnico ou produtor responsável pelo registro.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="">
                <CustomInput
                  type="text"
                  label="Nome do Técnico ou Produtor"
                  value={formData.nomeResponsavel}
                  onChange={(value) => handleInputChange('nomeResponsavel', value)}
                  required
                  errorMessage={errors.nomeResponsavel}
                  placeholder="Nome completo do responsável"
                  iconStart={<User size={18} />}
                />
              </div>

              <div>
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
                />
              </div>
              <div>
                <CustomInput
                  type="date"
                  label="Data de Registro"
                  value={formData.dataRegistro}
                  onChange={(value) => handleInputChange('dataRegistro', value)}
                  iconStart={<Calendar size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 1: // Localização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex justify-center items-center text-center space-x-3 mb-3">
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

              <div className="">
                <CustomInput
                  type="text"
                  label="Comuna"
                  value={formData.comuna}
                  onChange={(value) => handleInputChange('comuna', value)}
                  required
                  errorMessage={errors.comuna}
                  placeholder="Comuna"
                  iconStart={<MapPin size={18} />}
                />
              </div>

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

      case 2: // Tipo de Produção
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Tipo de Produção Afetada</h3>
              </div>
              <p className="text-gray-600">
                Selecione o tipo de produção afetada pela praga ou doença.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.tipoProducao === 'agricola'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
                  }`}
                onClick={() => handleInputChange('tipoProducao', 'agricola')}
              >
                <div className="text-center">
                  <Tractor className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Agrícola</h4>
                  <p className="text-sm text-gray-600">Culturas agrícolas afetadas por pragas</p>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.tipoProducao === 'pecuaria'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
                  }`}
                onClick={() => handleInputChange('tipoProducao', 'pecuaria')}
              >
                <div className="text-center">
                  <Heart className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Pecuária</h4>
                  <p className="text-sm text-gray-600">Animais afetados por pragas ou doenças</p>
                </div>
              </div>

              <div
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${formData.tipoProducao === 'ambas'
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-blue-300'
                  }`}
                onClick={() => handleInputChange('tipoProducao', 'ambas')}
              >
                <div className="text-center">
                  <Activity className="w-12 h-12 mx-auto mb-4 text-blue-600" />
                  <h4 className="text-lg font-semibold text-gray-800 mb-2">Ambas</h4>
                  <p className="text-sm text-gray-600">Produção agrícola e pecuária afetadas</p>
                </div>
              </div>
            </div>

            {errors.tipoProducao && (
              <p className="mt-4 text-sm text-red-600 text-center">{errors.tipoProducao}</p>
            )}
          </div>
        );

      case 3: // Informações Agrícolas
        if (formData.tipoProducao !== 'agricola' && formData.tipoProducao !== 'ambas') {
          return (
            <div className="text-center py-20">
              <Tractor className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Informações Agrícolas</h3>
              <p className="text-gray-500">Esta seção será preenchida apenas se a produção agrícola for afetada.</p>
            </div>
          );
        }

        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Tractor className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Informações Agrícolas</h3>
              </div>
              <p className="text-gray-600">
                Detalhes sobre as culturas agrícolas afetadas pela praga.
              </p>
            </div>

            <div className="space-y-8">
              {/* Dados Básicos */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Dados da Propriedade</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomInput
                      type="text"
                      label="Nome da Propriedade"
                      value={formData.nomePropriedade}
                      onChange={(value) => handleInputChange('nomePropriedade', value)}
                      required
                      errorMessage={errors.nomePropriedade}
                      placeholder="Nome da propriedade ou fazenda"
                      iconStart={<Building size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="number"
                      label="Área Total Cultivada (ha)"
                      value={formData.areaTotalCultivada}
                      onChange={(value) => handleInputChange('areaTotalCultivada', value)}
                      placeholder="Ex: 10.5"
                      iconStart={<Tractor size={18} />}
                    />
                  </div>
                </div>
              </div>

              {/* Tipo de Cultura */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Tipo de Cultura *</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="select"
                    label="Tipo de Cultura"
                    value={formData.tipoCultura}
                    options={[
                      { label: 'Cereais', value: 'cereais' },
                      { label: 'Frutas', value: 'frutas' },
                      { label: 'Hortícolas', value: 'horticolas' },
                      { label: 'Legumes', value: 'legumes' },
                      { label: 'Tubérculos', value: 'tuberculos' }
                    ]}
                    onChange={(value) => {
                      handleInputChange('tipoCultura', value);
                      handleInputChange('culturaAfetada', []); // Reset culturas when type changes
                    }}
                    required
                    errorMessage={errors.tipoCultura}
                    placeholder="Selecione o tipo de cultura"
                    iconStart={<Tractor size={18} />}
                  />

                  {formData.tipoCultura && (
                    <CustomInput
                      type="multiselect"
                      label={`${(formData.tipoCultura?.value || formData.tipoCultura)?.charAt(0).toUpperCase() + (formData.tipoCultura?.value || formData.tipoCultura)?.slice(1)} Afetadas`}
                      value={formData.culturaAfetada}
                      options={getCulturaOptions(formData.tipoCultura?.value || formData.tipoCultura)}
                      onChange={(value) => handleInputChange('culturaAfetada', value)}
                      errorMessage={errors.culturaAfetada}
                    />
                  )}
                </div>
              </div>

              {/* Fase da Cultura */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Fase da Cultura</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Germinação', 'Crescimento', 'Floração', 'Maturação'].map(fase => (
                    <label key={fase} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="faseCultura"
                        value={fase}
                        checked={formData.faseCultura === fase}
                        onChange={(e) => handleInputChange('faseCultura', e.target.value)}
                        className="w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{fase}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Informações da Praga */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Informações da Praga</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomInput
                      type="text"
                      label="Nome da Praga"
                      value={formData.nomePraga}
                      onChange={(value) => handleInputChange('nomePraga', value)}
                      required
                      errorMessage={errors.nomePraga}
                      placeholder="Nome científico ou comum da praga"
                      iconStart={<Bug size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="text"
                      label="Nome Local da Praga"
                      value={formData.nomeLocalPraga}
                      onChange={(value) => handleInputChange('nomeLocalPraga', value)}
                      placeholder="Nome local/popular da praga"
                      iconStart={<Bug size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="date"
                      label="Data da Primeira Observação"
                      value={formData.dataPrimeiraObservacao}
                      onChange={(value) => handleInputChange('dataPrimeiraObservacao', value)}
                      iconStart={<Calendar size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="number"
                      label="Percentagem da Área Afetada (%)"
                      value={formData.percentagemAreaAfetada}
                      onChange={(value) => {
                        const numValue = parseFloat(value);
                        if (numValue > 100) {
                          showToast('warn', 'Valor máximo', 'Valor máximo 100%');
                          handleInputChange('percentagemAreaAfetada', 100);
                        } else {
                          handleInputChange('percentagemAreaAfetada', value);
                        }
                      }}
                      placeholder="Ex: 25.5"
                      min="0"
                      max="100"
                      iconStart={<Activity size={18} />}
                      errorMessage={parseFloat(formData.percentagemAreaAfetada) > 100 ? 'Valor máximo 100%' : ''}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <CustomInput
                      type="textarea"
                      label="Sintomas Observados"
                      value={formData.sintomasObservados}
                      onChange={(value) => handleInputChange('sintomasObservados', value)}
                      placeholder="Descreva os sintomas observados nas plantas..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Grau do Dano e Medidas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Avaliação e Medidas</h4>
                <div className=" grid-cols-1 md:grid-cols-2 gap-6">
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    <CustomInput
                      type="select"
                      label="Grau do Dano"
                      value={formData.grauDano}
                      options={[
                        { label: 'Leve', value: 'Leve' },
                        { label: 'Moderado', value: 'Moderado' },
                        { label: 'Grave', value: 'Grave' }
                      ]}
                      onChange={(value) => handleInputChange('grauDano', value)}
                      placeholder="Selecione"
                      iconStart={<AlertCircle size={18} />}
                    />
                    <CustomInput
                      type="select"
                      label="Necessita apoio técnico?"
                      value={formData.necessitaApoioTecnico}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('necessitaApoioTecnico', value)}
                      placeholder="Selecione"
                      iconStart={<CheckCircle size={18} />}
                    />

                    <CustomInput
                      type="select"
                      label="Aplicou alguma medida de controle?"
                      value={formData.aplicouMedidaControle}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('aplicouMedidaControle', value)}
                      placeholder="Selecione"
                      iconStart={<Activity size={18} />}
                    />
                  </div>

                  {(formData.aplicouMedidaControle === true || formData.aplicouMedidaControle?.value === true) && (
                    <>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2'>
                        <div>
                          <CustomInput
                            type="text"
                            label="Tipo de Medida Aplicada"
                            value={formData.tipoMedidaAplicada}
                            onChange={(value) => handleInputChange('tipoMedidaAplicada', value)}
                            placeholder="Ex: Pulverização com inseticida"
                            iconStart={<Activity size={18} />}
                          />
                        </div>

                        <div>
                          <CustomInput
                            type="select"
                            label="Resultado da Medida"
                            value={formData.resultadoMedida}
                            options={[
                              { label: 'Eficaz', value: 'Eficaz' },
                              { label: 'Parcial', value: 'Parcial' },
                              { label: 'Sem efeito', value: 'Sem efeito' }
                            ]}
                            onChange={(value) => handleInputChange('resultadoMedida', value)}
                            placeholder="Selecione"
                            iconStart={<CheckCircle size={18} />}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <CustomInput
                      type="textarea"
                      label="Observações Adicionais"
                      value={formData.observacoesAdicionais}
                      onChange={(value) => handleInputChange('observacoesAdicionais', value)}
                      placeholder="Informações adicionais relevantes..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Upload de Foto */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Foto da Praga ou Sintomas</h4>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('fotoPragaAgricola', e.target.files[0])}
                    id="foto-praga-agricola"
                  />
                  <label
                    htmlFor="foto-praga-agricola"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.fotoPragaAgricola
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoPragaAgricola ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.fotoPragaAgricola ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.fotoPragaAgricola ? 'Foto carregada' : 'Carregar foto da praga'}
                    </p>
                    {uploadedFiles.fotoPragaAgricola && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoPragaAgricola.name}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Informações Pecuárias
        if (formData.tipoProducao !== 'pecuaria' && formData.tipoProducao !== 'ambas') {
          return (
            <div className="text-center py-20">
              <Heart className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Informações Pecuárias</h3>
              <p className="text-gray-500">Esta seção será preenchida apenas se a produção pecuária for afetada.</p>
            </div>
          );
        }

        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-2xl p-6 mb-8 border border-red-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-red-100 rounded-lg">
                  <Heart className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Informações Pecuárias</h3>
              </div>
              <p className="text-gray-600">
                Detalhes sobre os animais afetados por pragas ou doenças.
              </p>
            </div>

            <div className="space-y-8">
              {/* Dados Básicos */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Dados da Fazenda</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomInput
                      type="text"
                      label="Nome da Fazenda"
                      value={formData.nomeFazenda}
                      onChange={(value) => handleInputChange('nomeFazenda', value)}
                      required
                      errorMessage={errors.nomeFazenda}
                      placeholder="Nome da fazenda ou propriedade"
                      iconStart={<Building size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="number"
                      label="Número Total de Animais"
                      value={formData.numeroTotalAnimais}
                      onChange={(value) => handleInputChange('numeroTotalAnimais', value)}
                      placeholder="Ex: 150"
                      iconStart={<Heart size={18} />}
                    />
                  </div>
                </div>
              </div>

              {/* Espécie Animal Afetada */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Espécie Animal Afetada *</h4>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {['Bovino', 'Caprino', 'Ovino', 'Suíno', 'Aves', 'Outros'].map(especie => (
                    <label key={especie} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.especieAnimalAfetada.includes(especie)}
                        onChange={(e) => {
                          const newEspecies = e.target.checked
                            ? [...formData.especieAnimalAfetada, especie]
                            : formData.especieAnimalAfetada.filter(e => e !== especie);
                          handleInputChange('especieAnimalAfetada', newEspecies);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{especie}</span>
                    </label>
                  ))}
                </div>
                {errors.especieAnimalAfetada && (
                  <p className="mt-2 text-sm text-red-600">{errors.especieAnimalAfetada}</p>
                )}
              </div>

              {/* Informações da Praga/Doença */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Informações da Praga/Doença</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <CustomInput
                      type="text"
                      label="Nome da Praga/Doença"
                      value={formData.nomePragaDoenca}
                      onChange={(value) => handleInputChange('nomePragaDoenca', value)}
                      required
                      errorMessage={errors.nomePragaDoenca}
                      placeholder="Nome da praga ou doença"
                      iconStart={<Bug size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="date"
                      label="Data da Primeira Observação"
                      value={formData.dataPrimeiraObservacaoPecuaria}
                      onChange={(value) => handleInputChange('dataPrimeiraObservacaoPecuaria', value)}
                      iconStart={<Calendar size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="number"
                      label="Número de Animais Afetados"
                      value={formData.numeroAnimaisAfetados}
                      onChange={(value) => handleInputChange('numeroAnimaisAfetados', value)}
                      placeholder="Ex: 25"
                      iconStart={<Heart size={18} />}
                    />
                  </div>

                  <div>
                    <CustomInput
                      type="select"
                      label="Grau do Dano"
                      value={formData.grauDanoPecuaria}
                      options={[
                        { label: 'Leve', value: 'Leve' },
                        { label: 'Moderado', value: 'Moderado' },
                        { label: 'Grave', value: 'Grave' }
                      ]}
                      onChange={(value) => handleInputChange('grauDanoPecuaria', value)}
                      placeholder="Selecione"
                      iconStart={<AlertCircle size={18} />}
                    />
                  </div>

                  <div className="md:col-span-2">
                    <CustomInput
                      type="textarea"
                      label="Sintomas Observados"
                      value={formData.sintomasObservadosPecuaria}
                      onChange={(value) => handleInputChange('sintomasObservadosPecuaria', value)}
                      placeholder="Descreva os sintomas observados nos animais..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Tratamento */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Tratamento e Medidas</h4>
                <div className=" grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <CustomInput
                      type="select"
                      label="Aplicou algum tratamento?"
                      value={formData.aplicouTratamento}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('aplicouTratamento', value)}
                      placeholder="Selecione"
                      iconStart={<Activity size={18} />}
                    />

                    <CustomInput
                      type="select"
                      label="Necessita apoio veterinário?"
                      value={formData.necessitaApoioVeterinario}
                      options={[
                        { label: 'Sim', value: true },
                        { label: 'Não', value: false }
                      ]}
                      onChange={(value) => handleInputChange('necessitaApoioVeterinario', value)}
                      placeholder="Selecione"
                      iconStart={<CheckCircle size={18} />}
                    />
                  </div>

                  {(formData.aplicouTratamento === true || formData.aplicouTratamento?.value === true) && (
                    <>
                      <div className='grid grid-cols-1 md:grid-cols-2 gap-6 md:col-span-2'>
                        <div>
                          <CustomInput
                            type="text"
                            label="Tipo de Tratamento Usado"
                            value={formData.tipoTratamento}
                            onChange={(value) => handleInputChange('tipoTratamento', value)}
                            placeholder="Ex: Medicamento, vacina, etc."
                            iconStart={<Activity size={18} />}
                          />
                        </div>

                        <div>
                          <CustomInput
                            type="select"
                            label="Resultado do Tratamento"
                            value={formData.resultadoTratamento}
                            options={[
                              { label: 'Eficaz', value: 'Eficaz' },
                              { label: 'Parcial', value: 'Parcial' },
                              { label: 'Sem efeito', value: 'Sem efeito' }
                            ]}
                            onChange={(value) => handleInputChange('resultadoTratamento', value)}
                            placeholder="Selecione"
                            iconStart={<CheckCircle size={18} />}
                          />
                        </div>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <CustomInput
                      type="textarea"
                      label="Observações Adicionais"
                      value={formData.observacoesAdicionaisPecuaria}
                      onChange={(value) => handleInputChange('observacoesAdicionaisPecuaria', value)}
                      placeholder="Informações adicionais relevantes..."
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Upload de Foto */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Foto dos Sinais Clínicos</h4>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => handleFileUpload('fotoPragaPecuaria', e.target.files[0])}
                    id="foto-praga-pecuaria"
                  />
                  <label
                    htmlFor="foto-praga-pecuaria"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.fotoPragaPecuaria
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoPragaPecuaria ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.fotoPragaPecuaria ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.fotoPragaPecuaria ? 'Foto carregada' : 'Carregar foto dos sinais clínicos'}
                    </p>
                    {uploadedFiles.fotoPragaPecuaria && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoPragaPecuaria.name}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>
          </div>
        );

      case 5: // Finalização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Finalização</h3>
              </div>
              <p className="text-gray-600">
                Informações do validador responsável pela confirmação dos dados.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">Dados do Validador</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <CustomInput
                    type="text"
                    label="Nome do Validador"
                    value={formData.nomeValidador}
                    onChange={(value) => handleInputChange('nomeValidador', value)}
                    required
                    errorMessage={errors.nomeValidador}
                    placeholder="Nome completo do validador"
                    iconStart={<User size={18} />}
                  />
                </div>

                <div>
                  <CustomInput
                    type="text"
                    label="Instituição"
                    value={formData.instituicao}
                    onChange={(value) => handleInputChange('instituicao', value)}
                    required
                    errorMessage={errors.instituicao}
                    placeholder="Nome da instituição"
                    iconStart={<Building size={18} />}
                  />
                </div>
              </div>
            </div>

            {/* Resumo dos dados */}
            <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
              <h4 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                <Info className="w-5 h-5 mr-2" />
                Resumo do Registro
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-600">Responsável:</span>
                  <p className="text-gray-800">{formData.nomeResponsavel || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Localização:</span>
                  <p className="text-gray-800">{formData.provincia?.label || formData.provincia || 'N/A'}, {formData.municipio?.label || formData.municipio || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Tipo de Produção:</span>
                  <p className="text-gray-800 capitalize">{formData.tipoProducao || 'N/A'}</p>
                </div>
                {(formData.tipoProducao === 'agricola' || formData.tipoProducao === 'ambas') && (
                  <>
                    <div>
                      <span className="font-medium text-gray-600">Propriedade:</span>
                      <p className="text-gray-800">{formData.nomePropriedade || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Praga Agrícola:</span>
                      <p className="text-gray-800">{formData.nomePraga || 'N/A'}</p>
                    </div>
                  </>
                )}
                {(formData.tipoProducao === 'pecuaria' || formData.tipoProducao === 'ambas') && (
                  <>
                    <div>
                      <span className="font-medium text-gray-600">Fazenda:</span>
                      <p className="text-gray-800">{formData.nomeFazenda || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Praga/Doença:</span>
                      <p className="text-gray-800">{formData.nomePragaDoenca || 'N/A'}</p>
                    </div>
                  </>
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

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="bg-white rounded-2xl">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-blue-50">
            <div className="flex items-center justify-center mb-4">
              <div>
                <h1 className="text-4xl font-bold mb-2 text-gray-800">Monitoramento de Pragas</h1>
              </div>
            </div>
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
                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
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
                  } else {
                    showToast('error', 'Erro', 'Por favor, preencha todos os campos obrigatórios.');
                  }
                } else {
                  if (validateCurrentStep()) {
                    handleSubmit(e);
                  } else {
                    showToast('error', 'Erro', 'Por favor, complete todos os campos obrigatórios.');
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
                  Registrar Ocorrência
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

        {/* Information Card */}
        {/*<div className="mt-8 bg-white p-8 shadow-sm rounded-2xl border border-gray-200">
          <div className="flex items-center text-blue-700 mb-4">
            <Info size={20} className="mr-3" />
            <h3 className="text-xl font-semibold">Sobre o Monitoramento de Pragas</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm text-gray-600">
            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Objetivo:</h4>
              <p className="leading-relaxed">
                O sistema de monitoramento de pragas visa identificar, registrar e acompanhar a ocorrência de pragas e doenças
                que afetam as produções agrícolas e pecuárias, permitindo ações rápidas de controle e prevenção.
              </p>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-3">Benefícios:</h4>
              <ul className="space-y-2 leading-relaxed">
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Detecção precoce de surtos de pragas
                </li>
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Orientação técnica especializada
                </li>
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Prevenção de perdas na produção
                </li>
                <li className="flex items-start">
                  <Check size={16} className="text-blue-600 mr-2 mt-0.5 flex-shrink-0" />
                  Apoio na tomada de decisões
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-200">
            <p className="text-blue-700 text-sm leading-relaxed">
              <strong>Importante:</strong> O registro preciso e detalhado das ocorrências é fundamental para o
              sucesso do programa de controle integrado de pragas e para a sustentabilidade da produção agropecuária nacional.
            </p>
          </div>
        </div>*/}
      </div>
    </div>
  );
};

export default CadastroPragas;