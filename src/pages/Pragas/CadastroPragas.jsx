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

const CadastroPragas = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

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

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
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
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        break;
      case 1: // Localização
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        break;
      case 2: // Tipo de Produção
        if (!formData.tipoProducao) newErrors.tipoProducao = 'Campo obrigatório';
        break;
      case 3: // Informações Agrícolas
        if ((formData.tipoProducao === 'agricola' || formData.tipoProducao === 'ambas')) {
          if (!formData.nomePropriedade) newErrors.nomePropriedade = 'Campo obrigatório';
          if (!formData.culturaAfetada.length) newErrors.culturaAfetada = 'Selecione pelo menos uma cultura';
          if (!formData.nomePraga) newErrors.nomePraga = 'Campo obrigatório';
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
      // Simular envio para API
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      showToast('success', 'Sucesso', 'Registro de praga cadastrado com sucesso!');
      
      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});

    } catch (error) {
      showToast('error', 'Erro', 'Erro ao registrar praga. Tente novamente.');
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Nome do Técnico ou Produtor *
                </label>
                <input
                  type="text"
                  value={formData.nomeResponsavel}
                  onChange={(e) => handleInputChange('nomeResponsavel', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome completo do responsável"
                />
                {errors.nomeResponsavel && (
                  <p className="mt-1 text-sm text-red-600">{errors.nomeResponsavel}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Telefone *
                </label>
                <input
                  type="tel"
                  value={formData.telefone}
                  onChange={(e) => handleInputChange('telefone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Ex: 923456789"
                />
                {errors.telefone && (
                  <p className="mt-1 text-sm text-red-600">{errors.telefone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Província *
                </label>
                <select
                  value={formData.provincia}
                  onChange={(e) => handleInputChange('provincia', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Selecione a província</option>
                  {provincias.map(provincia => (
                    <option key={provincia} value={provincia}>{provincia}</option>
                  ))}
                </select>
                {errors.provincia && (
                  <p className="mt-1 text-sm text-red-600">{errors.provincia}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Data de Registro
                </label>
                <input
                  type="date"
                  value={formData.dataRegistro}
                  onChange={(e) => handleInputChange('dataRegistro', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>
        );

      case 1: // Localização
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-2xl p-6 mb-8 border border-emerald-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <MapPin className="w-6 h-6 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Localização</h3>
              </div>
              <p className="text-gray-600">
                Informe a localização específica da ocorrência e coordenadas GPS se disponível.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Município *
                </label>
                <input
                  type="text"
                  value={formData.municipio}
                  onChange={(e) => handleInputChange('municipio', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome do município"
                />
                {errors.municipio && (
                  <p className="mt-1 text-sm text-red-600">{errors.municipio}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Comuna
                </label>
                <input
                  type="text"
                  value={formData.comuna}
                  onChange={(e) => handleInputChange('comuna', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Nome da comuna"
                />
              </div>

              <div className="md:col-span-3">
                <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Coordenadas GPS
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Latitude (°)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.latitude}
                      onChange={(e) => handleInputChange('latitude', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: -8.8383"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Longitude (°)
                    </label>
                    <input
                      type="number"
                      step="any"
                      value={formData.longitude}
                      onChange={(e) => handleInputChange('longitude', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 13.2344"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Altitude (m)
                    </label>
                    <input
                      type="number"
                      value={formData.altitude}
                      onChange={(e) => handleInputChange('altitude', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 1000"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precisão (m)
                    </label>
                    <input
                      type="number"
                      value={formData.precisao}
                      onChange={(e) => handleInputChange('precisao', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 5"
                    />
                  </div>
                </div>
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
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.tipoProducao === 'agricola' 
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
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.tipoProducao === 'pecuaria' 
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
                className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                  formData.tipoProducao === 'ambas' 
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Propriedade *
                    </label>
                    <input
                      type="text"
                      value={formData.nomePropriedade}
                      onChange={(e) => handleInputChange('nomePropriedade', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da propriedade ou fazenda"
                    />
                    {errors.nomePropriedade && (
                      <p className="mt-1 text-sm text-red-600">{errors.nomePropriedade}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Área Total Cultivada (ha)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.areaTotalCultivada}
                      onChange={(e) => handleInputChange('areaTotalCultivada', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 10.5"
                    />
                  </div>
                </div>
              </div>

              {/* Cultura Afetada */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Cultura Afetada *</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {['Milho', 'Feijão', 'Mandioca', 'Arroz', 'Batata', 'Hortícolas', 'Frutíferas'].map(cultura => (
                    <label key={cultura} className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.culturaAfetada.includes(cultura)}
                        onChange={(e) => {
                          const newCulturas = e.target.checked
                            ? [...formData.culturaAfetada, cultura]
                            : formData.culturaAfetada.filter(c => c !== cultura);
                          handleInputChange('culturaAfetada', newCulturas);
                        }}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">{cultura}</span>
                    </label>
                  ))}
                </div>
                {errors.culturaAfetada && (
                  <p className="mt-2 text-sm text-red-600">{errors.culturaAfetada}</p>
                )}
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Praga *
                    </label>
                    <input
                      type="text"
                      value={formData.nomePraga}
                      onChange={(e) => handleInputChange('nomePraga', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome científico ou comum da praga"
                    />
                    {errors.nomePraga && (
                      <p className="mt-1 text-sm text-red-600">{errors.nomePraga}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome Local da Praga
                    </label>
                    <input
                      type="text"
                      value={formData.nomeLocalPraga}
                      onChange={(e) => handleInputChange('nomeLocalPraga', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome local/popular da praga"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data da Primeira Observação
                    </label>
                    <input
                      type="date"
                      value={formData.dataPrimeiraObservacao}
                      onChange={(e) => handleInputChange('dataPrimeiraObservacao', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Percentagem da Área Afetada (%)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={formData.percentagemAreaAfetada}
                      onChange={(e) => handleInputChange('percentagemAreaAfetada', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 25.5"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sintomas Observados
                    </label>
                    <textarea
                      value={formData.sintomasObservados}
                      onChange={(e) => handleInputChange('sintomasObservados', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva os sintomas observados nas plantas..."
                    />
                  </div>
                </div>
              </div>

              {/* Grau do Dano e Medidas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Avaliação e Medidas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grau do Dano
                    </label>
                    <select
                      value={formData.grauDano}
                      onChange={(e) => handleInputChange('grauDano', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="Leve">Leve</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Grave">Grave</option>
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.necessitaApoioTecnico}
                        onChange={(e) => handleInputChange('necessitaApoioTecnico', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Necessita apoio técnico?</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.aplicouMedidaControle}
                        onChange={(e) => handleInputChange('aplicouMedidaControle', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Aplicou alguma medida de controle?</span>
                    </label>
                  </div>

                  {formData.aplicouMedidaControle && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de Medida Aplicada
                        </label>
                        <input
                          type="text"
                          value={formData.tipoMedidaAplicada}
                          onChange={(e) => handleInputChange('tipoMedidaAplicada', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Pulverização com inseticida"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Resultado da Medida
                        </label>
                        <select
                          value={formData.resultadoMedida}
                          onChange={(e) => handleInputChange('resultadoMedida', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          <option value="Eficaz">Eficaz</option>
                          <option value="Parcial">Parcial</option>
                          <option value="Sem efeito">Sem efeito</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Observações Adicionais
                    </label>
                    <textarea
                      value={formData.observacoesAdicionais}
                      onChange={(e) => handleInputChange('observacoesAdicionais', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Informações adicionais relevantes..."
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
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                      uploadedFiles.fotoPragaAgricola
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Fazenda *
                    </label>
                    <input
                      type="text"
                      value={formData.nomeFazenda}
                      onChange={(e) => handleInputChange('nomeFazenda', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da fazenda ou propriedade"
                    />
                    {errors.nomeFazenda && (
                      <p className="mt-1 text-sm text-red-600">{errors.nomeFazenda}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número Total de Animais
                    </label>
                    <input
                      type="number"
                      value={formData.numeroTotalAnimais}
                      onChange={(e) => handleInputChange('numeroTotalAnimais', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 150"
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
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nome da Praga/Doença *
                    </label>
                    <input
                      type="text"
                      value={formData.nomePragaDoenca}
                      onChange={(e) => handleInputChange('nomePragaDoenca', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nome da praga ou doença"
                    />
                    {errors.nomePragaDoenca && (
                      <p className="mt-1 text-sm text-red-600">{errors.nomePragaDoenca}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Data da Primeira Observação
                    </label>
                    <input
                      type="date"
                      value={formData.dataPrimeiraObservacaoPecuaria}
                      onChange={(e) => handleInputChange('dataPrimeiraObservacaoPecuaria', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Número de Animais Afetados
                    </label>
                    <input
                      type="number"
                      value={formData.numeroAnimaisAfetados}
                      onChange={(e) => handleInputChange('numeroAnimaisAfetados', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Ex: 25"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Grau do Dano
                    </label>
                    <select
                      value={formData.grauDanoPecuaria}
                      onChange={(e) => handleInputChange('grauDanoPecuaria', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="">Selecione</option>
                      <option value="Leve">Leve</option>
                      <option value="Moderado">Moderado</option>
                      <option value="Grave">Grave</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Sintomas Observados
                    </label>
                    <textarea
                      value={formData.sintomasObservadosPecuaria}
                      onChange={(e) => handleInputChange('sintomasObservadosPecuaria', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Descreva os sintomas observados nos animais..."
                    />
                  </div>
                </div>
              </div>

              {/* Tratamento */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6">Tratamento e Medidas</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.aplicouTratamento}
                        onChange={(e) => handleInputChange('aplicouTratamento', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Aplicou algum tratamento?</span>
                    </label>

                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.necessitaApoioVeterinario}
                        onChange={(e) => handleInputChange('necessitaApoioVeterinario', e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <span className="text-sm font-medium text-gray-700">Necessita apoio veterinário?</span>
                    </label>
                  </div>

                  {formData.aplicouTratamento && (
                    <>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Tipo de Tratamento Usado
                        </label>
                        <input
                          type="text"
                          value={formData.tipoTratamento}
                          onChange={(e) => handleInputChange('tipoTratamento', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Ex: Medicamento, vacina, etc."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Resultado do Tratamento
                        </label>
                        <select
                          value={formData.resultadoTratamento}
                          onChange={(e) => handleInputChange('resultadoTratamento', e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="">Selecione</option>
                          <option value="Eficaz">Eficaz</option>
                          <option value="Parcial">Parcial</option>
                          <option value="Sem efeito">Sem efeito</option>
                        </select>
                      </div>
                    </>
                  )}

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Observações Adicionais
                    </label>
                    <textarea
                      value={formData.observacoesAdicionaisPecuaria}
                      onChange={(e) => handleInputChange('observacoesAdicionaisPecuaria', e.target.value)}
                      rows={3}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Informações adicionais relevantes..."
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
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                      uploadedFiles.fotoPragaPecuaria
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
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Nome do Validador *
                  </label>
                  <input
                    type="text"
                    value={formData.nomeValidador}
                    onChange={(e) => handleInputChange('nomeValidador', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome completo do validador"
                  />
                  {errors.nomeValidador && (
                    <p className="mt-1 text-sm text-red-600">{errors.nomeValidador}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Instituição *
                  </label>
                  <input
                    type="text"
                    value={formData.instituicao}
                    onChange={(e) => handleInputChange('instituicao', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Nome da instituição"
                  />
                  {errors.instituicao && (
                    <p className="mt-1 text-sm text-red-600">{errors.instituicao}</p>
                  )}
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
                  <p className="text-gray-800">{formData.provincia}, {formData.municipio || 'N/A'}</p>
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
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${
          toastMessage.severity === 'success' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
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
                  className={`flex flex-col items-center cursor-pointer transition-all min-w-0 flex-shrink-0 mx-1 ${
                    index > activeIndex ? 'opacity-50' : ''
                  }`}
                  onClick={() => index <= activeIndex && setActiveIndex(index)}
                >
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${
                    index < activeIndex ? 'bg-blue-500 text-white' :
                    index === activeIndex ? 'bg-blue-600 text-white' :
                    'bg-gray-200 text-gray-500'
                  }`}>
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${
                    index === activeIndex ? 'text-blue-700' : 'text-gray-500'
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
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
                activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
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
                isLastStep
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
        <div className="mt-8 bg-white p-8 shadow-sm rounded-2xl border border-gray-200">
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
        </div>
      </div>
    </div>
  );
};

export default CadastroPragas;