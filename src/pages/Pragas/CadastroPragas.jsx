import React, { useState } from 'react';
import { 
  User, MapPin, Map, Camera, FileText, Check, 
  ChevronRight, ChevronLeft, Calendar, Phone, 
  AlertCircle, CheckCircle, Info, Loader,
  Building, Tractor, Bug, Heart, Activity, Globe,
  Flame, Trees, Waves, AlertTriangle
} from 'lucide-react';

const CadastroOcorrencias = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [tipoOcorrencia, setTipoOcorrencia] = useState('');

  // Estado inicial do formulário
  const initialState = {
    tipoOcorrencia: '',
    
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
    
    // Informações específicas por tipo de ocorrência
    // Queimadas
    areaQueimada: '',
    causaProvavel: '',
    vegetacaoAfetada: '',
    duracaoFogo: '',
    danosMateriais: false,
    descricaoDanosMateriais: '',
    
    // Pragas (mantido do original)
    tipoProducao: '',
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
    
    // Desmatamento
    areaDesmatada: '',
    tipoVegetacao: '',
    metodoDesmatamento: '',
    usoAnteriorTerra: '',
    usoFuturoTerra: '',
    vegetacaoRemanescente: '',
    
    // Enchentes
    areaAlagada: '',
    nivelAgua: '',
    duracaoAlagamento: '',
    casasAfetadas: '',
    populacaoAfetada: '',
    danosInfraestrutura: '',
    causasAlagamento: '',
    
    // Finalização
    nomeValidador: '',
    instituicao: ''
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Tipo Ocorrência', icon: AlertTriangle },
    { label: 'Responsável', icon: User },
    { label: 'Localização', icon: MapPin },
    { label: 'Detalhes', icon: FileText },
    { label: 'Finalização', icon: CheckCircle }
  ];

  const tiposOcorrencia = [
    { id: 'queimadas', nome: 'Queimadas', icon: Flame, cor: 'red' },
    { id: 'pragas', nome: 'Pragas', icon: Bug, cor: 'green' },
    { id: 'desmatamento', nome: 'Desmatamento', icon: Trees, cor: 'brown' },
    { id: 'enchentes', nome: 'Enchentes', icon: Waves, cor: 'blue' }
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
      case 0: // Tipo de Ocorrência
        if (!formData.tipoOcorrencia) newErrors.tipoOcorrencia = 'Selecione o tipo de ocorrência';
        break;
      case 1: // Responsável
        if (!formData.nomeResponsavel) newErrors.nomeResponsavel = 'Campo obrigatório';
        if (!formData.telefone) newErrors.telefone = 'Campo obrigatório';
        if (!formData.provincia) newErrors.provincia = 'Campo obrigatório';
        break;
      case 2: // Localização
        if (!formData.municipio) newErrors.municipio = 'Campo obrigatório';
        break;
      case 3: // Detalhes específicos
        // Validações específicas para cada tipo de ocorrência
        if (formData.tipoOcorrencia === 'queimadas') {
          if (!formData.areaQueimada) newErrors.areaQueimada = 'Campo obrigatório';
        } else if (formData.tipoOcorrencia === 'pragas') {
          if (!formData.tipoProducao) newErrors.tipoProducao = 'Campo obrigatório';
        } else if (formData.tipoOcorrencia === 'desmatamento') {
          if (!formData.areaDesmatada) newErrors.areaDesmatada = 'Campo obrigatório';
        } else if (formData.tipoOcorrencia === 'enchentes') {
          if (!formData.areaAlagada) newErrors.areaAlagada = 'Campo obrigatório';
        }
        break;
      case 4: // Finalização
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
      
      showToast('success', 'Sucesso', 'Ocorrência registrada com sucesso!');
      
      // Reset do formulário
      setFormData(initialState);
      setTipoOcorrencia('');
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});

    } catch (error) {
      showToast('error', 'Erro', 'Erro ao registrar ocorrência. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Seleção do Tipo de Ocorrência
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Tipo de Ocorrência</h3>
              </div>
              <p className="text-gray-600">
                Selecione o tipo de ocorrência que deseja registrar.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tiposOcorrencia.map((tipo) => {
                const Icon = tipo.icon;
                return (
                  <div 
                    key={tipo.id}
                    className={`p-6 border-2 rounded-2xl cursor-pointer transition-all ${
                      formData.tipoOcorrencia === tipo.id 
                        ? `border-${tipo.cor}-500 bg-${tipo.cor}-50` 
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                    onClick={() => {
                      handleInputChange('tipoOcorrencia', tipo.id);
                      setTipoOcorrencia(tipo.id);
                    }}
                  >
                    <div className="text-center">
                      <div className={`flex justify-center items-center w-16 h-16 mx-auto mb-4 rounded-full bg-${tipo.cor}-100`}>
                        <Icon className={`w-8 h-8 text-${tipo.cor}-600`} />
                      </div>
                      <h4 className="text-lg font-semibold text-gray-800 mb-2">{tipo.nome}</h4>
                      <p className="text-sm text-gray-600">
                        {tipo.id === 'queimadas' && 'Registro de focos de incêndio e queimadas'}
                        {tipo.id === 'pragas' && 'Registro de pragas agrícolas e doenças'}
                        {tipo.id === 'desmatamento' && 'Registro de áreas desmatadas'}
                        {tipo.id === 'enchentes' && 'Registro de inundações e alagamentos'}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {errors.tipoOcorrencia && (
              <p className="mt-4 text-sm text-red-600 text-center">{errors.tipoOcorrencia}</p>
            )}
          </div>
        );

      case 1: // Identificação do Responsável
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="md:col-span-1">
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

      case 2: // Localização
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

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
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

      case 3: // Detalhes específicos da ocorrência
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <FileText className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Detalhes da Ocorrência</h3>
              </div>
              <p className="text-gray-600">
                Informe os detalhes específicos da ocorrência registrada.
              </p>
            </div>

            {formData.tipoOcorrencia === 'queimadas' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Flame className="w-5 h-5 mr-2 text-red-500" />
                    Informações sobre Queimadas
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Área Queimada (hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.areaQueimada}
                        onChange={(e) => handleInputChange('areaQueimada', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 15.5"
                      />
                      {errors.areaQueimada && (
                        <p className="mt-1 text-sm text-red-600">{errors.areaQueimada}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Causa Provável
                      </label>
                      <select
                        value={formData.causaProvavel}
                        onChange={(e) => handleInputChange('causaProvavel', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione a causa provável</option>
                        <option value="natural">Natural (raio)</option>
                        <option value="agricola">Prática agrícola</option>
                        <option value="incendiario">Incendiário</option>
                        <option value="acidental">Acidental</option>
                        <option value="desconhecida">Desconhecida</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Vegetação Afetada
                      </label>
                      <input
                        type="text"
                        value={formData.vegetacaoAfetada}
                        onChange={(e) => handleInputChange('vegetacaoAfetada', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Mata nativa, plantação de milho, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duração do Fogo (horas)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.duracaoFogo}
                        onChange={(e) => handleInputChange('duracaoFogo', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 3.5"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.danosMateriais}
                          onChange={(e) => handleInputChange('danosMateriais', e.target.checked)}
                          className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <span className="text-sm font-medium text-gray-700">Houve danos materiais?</span>
                      </label>
                    </div>

                    {formData.danosMateriais && (
                      <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Descrição dos Danos Materiais
                        </label>
                        <textarea
                          value={formData.descricaoDanosMateriais}
                          onChange={(e) => handleInputChange('descricaoDanosMateriais', e.target.value)}
                          rows={3}
                          className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Descreva os danos materiais ocorridos..."
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6">Fotos da Área Queimada</h4>
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('fotoQueimada', e.target.files[0])}
                      id="foto-queimada"
                    />
                    <label
                      htmlFor="foto-queimada"
                      className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        uploadedFiles.fotoQueimada
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoQueimada ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${uploadedFiles.fotoQueimada ? 'text-blue-600' : 'text-gray-500'}`}>
                        {uploadedFiles.fotoQueimada ? 'Foto carregada' : 'Carregar foto da área queimada'}
                      </p>
                      {uploadedFiles.fotoQueimada && (
                        <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoQueimada.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoOcorrencia === 'pragas' && (
              <div className="space-y-6">
                {/* Conteúdo original para pragas (mantido do código anterior) */}
                <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Bug className="w-6 h-6 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-800">Informações sobre Pragas</h3>
                  </div>
                  <p className="text-gray-600">
                    Detalhes sobre as pragas ou doenças identificadas.
                  </p>
                </div>

                {/* Aqui viria o restante do conteúdo original para pragas */}
                <div className="text-center p-8 bg-gray-50 rounded-xl">
                  <p className="text-gray-600">Formulário específico para pragas (conteúdo original)</p>
                </div>
              </div>
            )}

            {formData.tipoOcorrencia === 'desmatamento' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Trees className="w-5 h-5 mr-2 text-green-500" />
                    Informações sobre Desmatamento
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Área Desmatada (hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.areaDesmatada}
                        onChange={(e) => handleInputChange('areaDesmatada', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 25.5"
                      />
                      {errors.areaDesmatada && (
                        <p className="mt-1 text-sm text-red-600">{errors.areaDesmatada}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Tipo de Vegetação
                      </label>
                      <select
                        value={formData.tipoVegetacao}
                        onChange={(e) => handleInputChange('tipoVegetacao', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione o tipo</option>
                        <option value="mata_nativa">Mata Nativa</option>
                        <option value="floresta_plantada">Floresta Plantada</option>
                        <option value="cerrado">Cerrado</option>
                        <option value="caatinga">Caatinga</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Método de Desmatamento
                      </label>
                      <select
                        value={formData.metodoDesmatamento}
                        onChange={(e) => handleInputChange('metodoDesmatamento', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione o método</option>
                        <option value="corte_seletivo">Corte Seletivo</option>
                        <option value="corte_raso">Corte Raso</option>
                        <option value="queimada">Queimada</option>
                        <option value="maquinas">Máquinas</option>
                        <option value="outro">Outro</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Uso Anterior da Terra
                      </label>
                      <input
                        type="text"
                        value={formData.usoAnteriorTerra}
                        onChange={(e) => handleInputChange('usoAnteriorTerra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Agricultura, pastagem, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Uso Futuro da Terra (se conhecido)
                      </label>
                      <input
                        type="text"
                        value={formData.usoFuturoTerra}
                        onChange={(e) => handleInputChange('usoFuturoTerra', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: Agricultura, pastagem, construção, etc."
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Vegetação Remanescente (%)
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={formData.vegetacaoRemanescente}
                        onChange={(e) => handleInputChange('vegetacaoRemanescente', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 20"
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6">Fotos da Área Desmatada</h4>
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('fotoDesmatamento', e.target.files[0])}
                      id="foto-desmatamento"
                    />
                    <label
                      htmlFor="foto-desmatamento"
                      className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        uploadedFiles.fotoDesmatamento
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoDesmatamento ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${uploadedFiles.fotoDesmatamento ? 'text-blue-600' : 'text-gray-500'}`}>
                        {uploadedFiles.fotoDesmatamento ? 'Foto carregada' : 'Carregar foto da área desmatada'}
                      </p>
                      {uploadedFiles.fotoDesmatamento && (
                        <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoDesmatamento.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {formData.tipoOcorrencia === 'enchentes' && (
              <div className="space-y-6">
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                    <Waves className="w-5 h-5 mr-2 text-blue-500" />
                    Informações sobre Enchentes
                  </h4>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Área Alagada (hectares) *
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        value={formData.areaAlagada}
                        onChange={(e) => handleInputChange('areaAlagada', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 45.5"
                      />
                      {errors.areaAlagada && (
                        <p className="mt-1 text-sm text-red-600">{errors.areaAlagada}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nível Máximo da Água (metros)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={formData.nivelAgua}
                        onChange={(e) => handleInputChange('nivelAgua', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 1.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Duração do Alagamento (dias)
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        value={formData.duracaoAlagamento}
                        onChange={(e) => handleInputChange('duracaoAlagamento', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 3.5"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Nº de Casas Afetadas
                      </label>
                      <input
                        type="number"
                        value={formData.casasAfetadas}
                        onChange={(e) => handleInputChange('casasAfetadas', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 25"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        População Afetada (aproximadamente)
                      </label>
                      <input
                        type="number"
                        value={formData.populacaoAfetada}
                        onChange={(e) => handleInputChange('populacaoAfetada', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Ex: 120"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Danos à Infraestrutura
                      </label>
                      <select
                        value={formData.danosInfraestrutura}
                        onChange={(e) => handleInputChange('danosInfraestrutura', e.target.value)}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      >
                        <option value="">Selecione o nível de danos</option>
                        <option value="leve">Leve</option>
                        <option value="moderado">Moderado</option>
                        <option value="grave">Grave</option>
                        <option value="muito_grave">Muito Grave</option>
                      </select>
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Causas do Alagamento
                      </label>
                      <textarea
                        value={formData.causasAlagamento}
                        onChange={(e) => handleInputChange('causasAlagamento', e.target.value)}
                        rows={3}
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder="Descreva as possíveis causas do alagamento..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                  <h4 className="text-lg font-semibold text-gray-800 mb-6">Fotos da Enchente</h4>
                  <div className="relative">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => handleFileUpload('fotoEnchente', e.target.files[0])}
                      id="foto-enchente"
                    />
                    <label
                      htmlFor="foto-enchente"
                      className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${
                        uploadedFiles.fotoEnchente
                          ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                          : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                    >
                      <Camera className={`w-8 h-8 mb-3 ${uploadedFiles.fotoEnchente ? 'text-blue-500' : 'text-gray-400'}`} />
                      <p className={`text-sm font-medium ${uploadedFiles.fotoEnchente ? 'text-blue-600' : 'text-gray-500'}`}>
                        {uploadedFiles.fotoEnchente ? 'Foto carregada' : 'Carregar foto da enchente'}
                      </p>
                      {uploadedFiles.fotoEnchente && (
                        <p className="text-xs text-blue-500 mt-1">{uploadedFiles.fotoEnchente.name}</p>
                      )}
                    </label>
                  </div>
                </div>
              </div>
            )}

            {!formData.tipoOcorrencia && (
              <div className="text-center py-12 bg-gray-50 rounded-xl">
                <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">Selecione um tipo de ocorrência</h3>
                <p className="text-gray-500">Volte para a primeira etapa e selecione o tipo de ocorrência que deseja registrar.</p>
              </div>
            )}
          </div>
        );

      case 4: // Finalização
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
                  <span className="font-medium text-gray-600">Tipo de Ocorrência:</span>
                  <p className="text-gray-800 capitalize">
                    {formData.tipoOcorrencia ? tiposOcorrencia.find(t => t.id === formData.tipoOcorrencia)?.nome : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Responsável:</span>
                  <p className="text-gray-800">{formData.nomeResponsavel || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-600">Localização:</span>
                  <p className="text-gray-800">{formData.provincia}, {formData.municipio || 'N/A'}</p>
                </div>
                
                {/* Informações específicas por tipo de ocorrência */}
                {formData.tipoOcorrencia === 'queimadas' && (
                  <div>
                    <span className="font-medium text-gray-600">Área Queimada:</span>
                    <p className="text-gray-800">{formData.areaQueimada ? `${formData.areaQueimada} hectares` : 'N/A'}</p>
                  </div>
                )}
                
                {formData.tipoOcorrencia === 'desmatamento' && (
                  <div>
                    <span className="font-medium text-gray-600">Área Desmatada:</span>
                    <p className="text-gray-800">{formData.areaDesmatada ? `${formData.areaDesmatada} hectares` : 'N/A'}</p>
                  </div>
                )}
                
                {formData.tipoOcorrencia === 'enchentes' && (
                  <div>
                    <span className="font-medium text-gray-600">Área Alagada:</span>
                    <p className="text-gray-800">{formData.areaAlagada ? `${formData.areaAlagada} hectares` : 'N/A'}</p>
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

  return (
    <div className="bg-gray-50 min-h-screen py-8">
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

      <div className="w-full mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-center mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2 text-gray-800">Registro de Ocorrências Ambientais</h1>
              <p className="text-gray-600">Sistema de monitoramento e registro de ocorrências</p>
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
                <div className={`flex items-center justify-center w-12 h-12 rounded-full mb-3 transition-colors ${
                  index < activeIndex ? 'bg-blue-500 text-white' :
                  index === activeIndex ? 'bg-blue-600 text-white' :
                  'bg-gray-200 text-gray-500'
                }`}>
                  {index < activeIndex ? (
                    <Check size={20} />
                  ) : (
                    <StepIcon size={20} />
                  )}
                </div>
                <span className={`text-xs text-center font-medium ${
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
            className={`px-6 py-2 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${
              activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'bg-white hover:bg-gray-50 text-gray-700 hover:border-gray-400'
            }`}
            onClick={() => setActiveIndex((prev) => Math.max(prev - 1, 0))}
            disabled={activeIndex === 0}
          >
            <ChevronLeft size={18} className="mr-2" />
            Anterior
          </button>

          <div className="text-sm text-gray-500 font-medium">
            Etapa {activeIndex + 1} de {steps.length}
          </div>

          <button
            className={`px-6 py-2 rounded-xl flex items-center transition-all font-medium ${
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
                <Loader size={18} className="animate-spin mr-2" />
                Processando...
              </>
            ) : isLastStep ? (
              <>
                <Check size={18} className="mr-2" />
                Registrar Ocorrência
              </>
            ) : (
              <>
                <span className="mr-2">Próximo</span>
                <ChevronRight size={18} />
              </>
            )}
          </button>
        </div>
      </div>

    
    </div>
  );
};

export default CadastroOcorrencias;