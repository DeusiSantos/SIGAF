import React, { useState } from 'react';
import {
  User,
  MapPin,
  Map,
  Camera,
  FileText,
  Check,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Phone,
  AlertCircle,
  CheckCircle,
  Info,
  Loader,
  Building,
  Tractor,
  Bug,
  Heart,
  Activity,
  Globe
} from 'lucide-react';
import CustomInput from '../../components/CustomInput';
import provinciasData from '../../components/Provincias.json';
import api from '../../services/api';

import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';


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
  const [touched, setTouched] = useState({});
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

  const provincias = [
    'Bengo', 'Benguela', 'Bié', 'Cabinda', 'Cubango', 'Cuando',
    'Cuanza Norte', 'Cuanza Sul', 'Cunene', 'Huambo', 'Huíla',
    'Icolo e Bengo', 'Luanda', 'Lunda Norte', 'Lunda Sul',
    'Malanje', 'Moxico', 'Moxico Leste', 'Namibe', 'Uíge', 'Zaire'
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
      formDataToSend.append('Data_da_Primeira_Observa_o_001', dataObservacaoAgricola);
      
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
      formDataToSend.append('Data_da_Primeira_Observa_o', dataObservacaoPecuaria);
      
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
      
      let errorMessage = 'Erro ao registrar praga. Tente novamente.';
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data;
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.data.errors) {
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

  const renderStepContent = () => {
    return <div>Component content here</div>;
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Component JSX here */}
    </div>
  );
};

export default CadastroPragas;