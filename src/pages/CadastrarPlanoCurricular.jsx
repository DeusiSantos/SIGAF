import React, { useState, useEffect, useCallback } from 'react';
import {
  BookOpen, Clock, Users, GraduationCap, FileText, Save, 
  RotateCcw, Plus, Trash2, AlertCircle, CheckSquare, X,
  Calendar, Target, Award, Settings, Upload, Download,
  Edit3, Eye, Copy, Archive
} from 'lucide-react';
import CustomInput from '../components/CustomInput';

const CadastroPlanoCurricular = () => {
  // Estados principais
  const [formData, setFormData] = useState({
    // Informações básicas
    nome: '',
    codigo: '',
    subsistema: '',
    nivel: '',
    classe: '',
    curso: '',
    area: '',
    versao: '1.0',
    anoLetivo: new Date().getFullYear(),
    
    // Detalhes administrativos
    dataAprovacao: '',
    dataVigencia: '',
    aprovadoPor: '',
    elaboradoPor: '',
    status: 'RASCUNHO',
    
    // Configurações curriculares
    cargaHorariaTotal: '',
    cargaHorariaSemanal: '',
    numeroSemanas: 30,
    modalidade: 'PRESENCIAL',
    metodologia: 'TRADICIONAL',
    
    // Disciplinas
    disciplinas: [],
    
    // Objetivos e competências
    objetivoGeral: '',
    objetivosEspecificos: [],
    competenciasGerais: [],
    competenciasEspecificas: [],
    
    // Sistema de avaliação
    sistemasAvaliacao: [],
    criteriosAprovacao: '',
    
    // Recursos necessários
    recursosHumanos: [],
    recursosMateriaisTecnicos: [],
    infraestruturaEspacos: [],
    
    // Observações
    observacoes: '',
    requisitosPrerrequisitos: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);
  const [activeTab, setActiveTab] = useState('basicas');

  // Opções para subsistemas
  const subsistemaOptions = [
    { label: 'Ensino Geral', value: 'GERAL' },
    { label: 'Ensino Técnico-Profissional', value: 'TECNICO_PROFISSIONAL' }
  ];

  // Opções para níveis de ensino
  const nivelOptions = {
    GERAL: [
      { label: 'Ensino Primário', value: 'PRIMARIO' },
      { label: '1º Ciclo do Secundário', value: 'SECUNDARIO_1_CICLO' },
      { label: '2º Ciclo do Secundário', value: 'SECUNDARIO_2_CICLO' }
    ],
    TECNICO_PROFISSIONAL: [
      { label: 'Ensino Técnico Médio', value: 'TECNICO_MEDIO' },
      { label: 'Formação Profissional', value: 'FORMACAO_PROFISSIONAL' }
    ]
  };

  // Opções para classes
  const classeOptions = {
    PRIMARIO: Array.from({length: 6}, (_, i) => ({ label: `${i + 1}ª Classe`, value: i + 1 })),
    SECUNDARIO_1_CICLO: [
      { label: '7ª Classe', value: 7 },
      { label: '8ª Classe', value: 8 },
      { label: '9ª Classe', value: 9 }
    ],
    SECUNDARIO_2_CICLO: [
      { label: '10ª Classe', value: 10 },
      { label: '11ª Classe', value: 11 },
      { label: '12ª Classe', value: 12 }
    ],
    TECNICO_MEDIO: [
      { label: '10ª Classe', value: 10 },
      { label: '11ª Classe', value: 11 },
      { label: '12ª Classe', value: 12 },
      { label: '13ª Classe', value: 13 }
    ],
    FORMACAO_PROFISSIONAL: [
      { label: 'Nível Básico', value: 'BASICO' },
      { label: 'Nível Intermédio', value: 'INTERMEDIO' },
      { label: 'Nível Avançado', value: 'AVANCADO' }
    ]
  };

  // Áreas do ensino técnico-profissional
  const areasTecnicasOptions = [
    { label: 'Agricultura e Veterinária', value: 'AGRICULTURA' },
    { label: 'Construção Civil', value: 'CONSTRUCAO_CIVIL' },
    { label: 'Contabilidade e Gestão', value: 'CONTABILIDADE' },
    { label: 'Eletrotécnica e Eletrônica', value: 'ELETROTECNICA' },
    { label: 'Informática', value: 'INFORMATICA' },
    { label: 'Mecânica', value: 'MECANICA' },
    { label: 'Hotelaria e Turismo', value: 'HOTELARIA' },
    { label: 'Saúde (Enfermagem)', value: 'SAUDE' },
    { label: 'Química Industrial', value: 'QUIMICA' },
    { label: 'Telecomunicações', value: 'TELECOMUNICACOES' },
    { label: 'Artes e Design', value: 'ARTES' },
    { label: 'Logística', value: 'LOGISTICA' },
    { label: 'Energia e Ambiente', value: 'ENERGIA' },
    { label: 'Segurança no Trabalho', value: 'SEGURANCA' }
  ];

  // Disciplinas por subsistema e nível
  const disciplinasPorNivel = {
    PRIMARIO: [
      'Língua Portuguesa', 'Matemática', 'Estudo do Meio', 'Ciências da Natureza',
      'História', 'Geografia', 'Educação Moral e Cívica', 'Educação Manual e Plástica',
      'Educação Musical', 'Educação Física'
    ],
    SECUNDARIO_1_CICLO: [
      'Língua Portuguesa', 'Matemática', 'História', 'Geografia', 'Biologia',
      'Química', 'Física', 'Educação Moral e Cívica', 'Educação Física',
      'Educação Visual', 'Educação Musical', 'Língua Estrangeira (Inglês/Francês)'
    ],
    SECUNDARIO_2_CICLO: [
      'Língua Portuguesa', 'Matemática', 'História', 'Geografia', 'Biologia',
      'Química', 'Física', 'Filosofia', 'Educação Física', 'Educação Visual',
      'Língua Estrangeira', 'Disciplinas de Especialização'
    ]
  };

  // Modalidades de ensino
  const modalidadeOptions = [
    { label: 'Presencial', value: 'PRESENCIAL' },
    { label: 'Semi-presencial', value: 'SEMI_PRESENCIAL' },
    { label: 'À distância', value: 'DISTANCIA' }
  ];

  // Status do plano curricular
  const statusOptions = [
    { label: 'Rascunho', value: 'RASCUNHO' },
    { label: 'Em Análise', value: 'EM_ANALISE' },
    { label: 'Aprovado', value: 'APROVADO' },
    { label: 'Ativo', value: 'ATIVO' },
    { label: 'Inativo', value: 'INATIVO' }
  ];

  // Metodologias de ensino
  const metodologiaOptions = [
    { label: 'Tradicional', value: 'TRADICIONAL' },
    { label: 'Construtivista', value: 'CONSTRUTIVISTA' },
    { label: 'Projeto', value: 'PROJETO' },
    { label: 'Problematização', value: 'PROBLEMATIZACAO' },
    { label: 'Híbrida', value: 'HIBRIDA' }
  ];

  // Tabs do formulário
  const tabs = [
    { id: 'basicas', label: 'Informações Básicas', icon: BookOpen },
    { id: 'carga', label: 'Carga Horária', icon: Clock },
    { id: 'disciplinas', label: 'Disciplinas', icon: GraduationCap },
    { id: 'objetivos', label: 'Objetivos', icon: Target },
    { id: 'competencias', label: 'Competências', icon: Award },
    { id: 'avaliacao', label: 'Avaliação', icon: CheckSquare },
    { id: 'recursos', label: 'Recursos', icon: Settings },
    { id: 'observacoes', label: 'Observações', icon: FileText }
  ];

  // Toast para notificações
  const showToast = useCallback((type, title, message, duration = 5000) => {
    if (toastTimeout) {
      clearTimeout(toastTimeout);
    }

    setToastMessage({ type, title, message });

    const timeout = setTimeout(() => {
      setToastMessage(null);
    }, duration);

    setToastTimeout(timeout);
  }, [toastTimeout]);

  // Função para validar o formulário
  const validateForm = useCallback(() => {
    const newErrors = {};
    const requiredFields = [
      'nome', 'codigo', 'subsistema', 'nivel', 'classe', 'anoLetivo',
      'cargaHorariaTotal', 'cargaHorariaSemanal', 'objetivoGeral', 'elaboradoPor'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = `O campo ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} é obrigatório.`;
      }
    });

    // Validação específica para disciplinas
    if (formData.disciplinas.length === 0) {
      newErrors.disciplinas = 'Adicione pelo menos uma disciplina ao plano curricular.';
    }

    // Validação para área técnica
    if (formData.subsistema === 'TECNICO_PROFISSIONAL' && !formData.area) {
      newErrors.area = 'Área técnica é obrigatória para o ensino técnico-profissional.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  // Manipular mudanças nos campos
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };

      // Limpar campos dependentes quando necessário
      if (field === 'subsistema') {
        newData.nivel = '';
        newData.classe = '';
        newData.curso = '';
        newData.area = '';
        newData.disciplinas = [];
      } else if (field === 'nivel') {
        newData.classe = '';
        newData.disciplinas = [];
      }

      return newData;
    });

    // Limpar erro do campo
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: null
      }));
    }
  }, [errors]);

  // Adicionar disciplina
  const addDisciplina = () => {
    const novaDisciplina = {
      id: Date.now(),
      nome: '',
      codigo: '',
      cargaHoraria: '',
      cargaHorariaSemanal: '',
      tipo: 'OBRIGATORIA',
      ementa: '',
      objetivos: '',
      conteudoProgramatico: '',
      metodologiaEnsino: '',
      recursosDidaticos: '',
      avaliacao: '',
      bibliografia: ''
    };

    setFormData(prev => ({
      ...prev,
      disciplinas: [...prev.disciplinas, novaDisciplina]
    }));
  };

  // Remover disciplina
  const removeDisciplina = (id) => {
    setFormData(prev => ({
      ...prev,
      disciplinas: prev.disciplinas.filter(d => d.id !== id)
    }));
  };

  // Atualizar disciplina
  const updateDisciplina = (id, field, value) => {
    setFormData(prev => ({
      ...prev,
      disciplinas: prev.disciplinas.map(d => 
        d.id === id ? { ...d, [field]: value } : d
      )
    }));
  };

  // Adicionar item a arrays
  const addArrayItem = (field, item = '') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], item || '']
    }));
  };

  // Remover item de arrays
  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  // Atualizar item de arrays
  const updateArrayItem = (field, index, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  // Preencher disciplinas automaticamente baseado no nível
  const preencherDisciplinasAutomaticamente = () => {
    if (formData.nivel && disciplinasPorNivel[formData.nivel]) {
      const disciplinasBase = disciplinasPorNivel[formData.nivel].map((nome, index) => ({
        id: Date.now() + index,
        nome,
        codigo: `${formData.codigo || 'DISC'}-${String(index + 1).padStart(2, '0')}`,
        cargaHoraria: formData.nivel === 'PRIMARIO' ? '120' : '180',
        cargaHorariaSemanal: formData.nivel === 'PRIMARIO' ? '4' : '6',
        tipo: 'OBRIGATORIA',
        ementa: '',
        objetivos: '',
        conteudoProgramatico: '',
        metodologiaEnsino: 'Aula expositiva, exercícios práticos',
        recursosDidaticos: 'Quadro, material didático',
        avaliacao: 'Contínua e sumativa',
        bibliografia: ''
      }));

      setFormData(prev => ({
        ...prev,
        disciplinas: disciplinasBase
      }));

      showToast('success', 'Sucesso', `${disciplinasBase.length} disciplinas adicionadas automaticamente.`);
    }
  };

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      subsistema: '',
      nivel: '',
      classe: '',
      curso: '',
      area: '',
      versao: '1.0',
      anoLetivo: new Date().getFullYear(),
      dataAprovacao: '',
      dataVigencia: '',
      aprovadoPor: '',
      elaboradoPor: '',
      status: 'RASCUNHO',
      cargaHorariaTotal: '',
      cargaHorariaSemanal: '',
      numeroSemanas: 30,
      modalidade: 'PRESENCIAL',
      metodologia: 'TRADICIONAL',
      disciplinas: [],
      objetivoGeral: '',
      objetivosEspecificos: [],
      competenciasGerais: [],
      competenciasEspecificas: [],
      sistemasAvaliacao: [],
      criteriosAprovacao: '',
      recursosHumanos: [],
      recursosMateriaisTecnicos: [],
      infraestruturaEspacos: [],
      observacoes: '',
      requisitosPrerrequisitos: ''
    });
    setErrors({});
    setActiveTab('basicas');
    showToast('info', 'Formulário', 'Formulário resetado com sucesso.');
  };

  // Submeter formulário
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      showToast('error', 'Formulário Incompleto', 'Verifique os campos destacados em vermelho.');
      return;
    }

    setLoading(true);
    try {
      // Simular envio
      await new Promise(resolve => setTimeout(resolve, 2000));

      console.log('Plano Curricular:', formData);
      showToast('success', 'Sucesso', 'Plano curricular cadastrado com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar plano curricular:', error);
      showToast('error', 'Erro', 'Erro ao cadastrar plano curricular. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Limpar timeout ao desmontar
  useEffect(() => {
    return () => {
      if (toastTimeout) {
        clearTimeout(toastTimeout);
      }
    };
  }, [toastTimeout]);

  // Renderizar cada tab do formulário
  const renderTabContent = () => {
    switch (activeTab) {
      case 'basicas':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <CustomInput
                type="text"
                label="Nome do Plano Curricular"
                value={formData.nome}
                onChange={(value) => handleInputChange('nome', value)}
                required
                iconStart={<BookOpen size={18} />}
                errorMessage={errors.nome}
                disabled={loading}
                placeholder="Ex: Plano Curricular de Matemática - 10ª Classe"
              />
            </div>

            <CustomInput
              type="text"
              label="Código"
              value={formData.codigo}
              onChange={(value) => handleInputChange('codigo', value)}
              required
              iconStart={<FileText size={18} />}
              errorMessage={errors.codigo}
              disabled={loading}
              placeholder="Ex: PC-MAT-10-2024"
            />

            <CustomInput
              type="select"
              label="Subsistema"
              options={subsistemaOptions}
              value={formData.subsistema ? { label: subsistemaOptions.find(s => s.value === formData.subsistema)?.label, value: formData.subsistema } : null}
              onChange={(option) => handleInputChange('subsistema', option?.value)}
              required
              errorMessage={errors.subsistema}
              disabled={loading}
              placeholder="Selecione o subsistema"
            />

            <CustomInput
              type="select"
              label="Nível"
              options={formData.subsistema ? nivelOptions[formData.subsistema] : []}
              value={formData.nivel ? { label: nivelOptions[formData.subsistema]?.find(n => n.value === formData.nivel)?.label, value: formData.nivel } : null}
              onChange={(option) => handleInputChange('nivel', option?.value)}
              required
              errorMessage={errors.nivel}
              disabled={loading || !formData.subsistema}
              placeholder="Selecione o nível"
            />

            <CustomInput
              type="select"
              label="Classe"
              options={formData.nivel ? classeOptions[formData.nivel] : []}
              value={formData.classe ? { label: classeOptions[formData.nivel]?.find(c => c.value === formData.classe)?.label, value: formData.classe } : null}
              onChange={(option) => handleInputChange('classe', option?.value)}
              required
              errorMessage={errors.classe}
              disabled={loading || !formData.nivel}
              placeholder="Selecione a classe"
            />

            {formData.subsistema === 'TECNICO_PROFISSIONAL' && (
              <CustomInput
                type="select"
                label="Área Técnica"
                options={areasTecnicasOptions}
                value={formData.area ? { label: areasTecnicasOptions.find(a => a.value === formData.area)?.label, value: formData.area } : null}
                onChange={(option) => handleInputChange('area', option?.value)}
                required
                errorMessage={errors.area}
                disabled={loading}
                placeholder="Selecione a área técnica"
              />
            )}

            <CustomInput
              type="number"
              label="Ano Letivo"
              value={formData.anoLetivo}
              onChange={(value) => handleInputChange('anoLetivo', value)}
              required
              iconStart={<Calendar size={18} />}
              errorMessage={errors.anoLetivo}
              disabled={loading}
            />

            <CustomInput
              type="text"
              label="Versão"
              value={formData.versao}
              onChange={(value) => handleInputChange('versao', value)}
              iconStart={<FileText size={18} />}
              disabled={loading}
              placeholder="1.0"
            />

            <CustomInput
              type="select"
              label="Status"
              options={statusOptions}
              value={formData.status ? { label: statusOptions.find(s => s.value === formData.status)?.label, value: formData.status } : null}
              onChange={(option) => handleInputChange('status', option?.value)}
              disabled={loading}
            />

            <CustomInput
              type="text"
              label="Elaborado Por"
              value={formData.elaboradoPor}
              onChange={(value) => handleInputChange('elaboradoPor', value)}
              required
              iconStart={<Users size={18} />}
              errorMessage={errors.elaboradoPor}
              disabled={loading}
              placeholder="Nome do responsável"
            />

            <CustomInput
              type="text"
              label="Aprovado Por"
              value={formData.aprovadoPor}
              onChange={(value) => handleInputChange('aprovadoPor', value)}
              iconStart={<CheckSquare size={18} />}
              disabled={loading}
              placeholder="Nome do aprovador"
            />

            <CustomInput
              type="date"
              label="Data de Aprovação"
              value={formData.dataAprovacao}
              onChange={(value) => handleInputChange('dataAprovacao', value)}
              disabled={loading}
            />

            <CustomInput
              type="date"
              label="Data de Vigência"
              value={formData.dataVigencia}
              onChange={(value) => handleInputChange('dataVigencia', value)}
              disabled={loading}
            />
          </div>
        );

      case 'carga':
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <CustomInput
              type="number"
              label="Carga Horária Total"
              value={formData.cargaHorariaTotal}
              onChange={(value) => handleInputChange('cargaHorariaTotal', value)}
              required
              iconStart={<Clock size={18} />}
              errorMessage={errors.cargaHorariaTotal}
              disabled={loading}
              placeholder="Ex: 900"
              helperText="Total de horas no ano letivo"
            />

            <CustomInput
              type="number"
              label="Carga Horária Semanal"
              value={formData.cargaHorariaSemanal}
              onChange={(value) => handleInputChange('cargaHorariaSemanal', value)}
              required
              iconStart={<Clock size={18} />}
              errorMessage={errors.cargaHorariaSemanal}
              disabled={loading}
              placeholder="Ex: 30"
              helperText="Horas de aula por semana"
            />

            <CustomInput
              type="number"
              label="Número de Semanas"
              value={formData.numeroSemanas}
              onChange={(value) => handleInputChange('numeroSemanas', value)}
              iconStart={<Calendar size={18} />}
              disabled={loading}
              helperText="Semanas letivas no ano"
            />

            <CustomInput
              type="select"
              label="Modalidade"
              options={modalidadeOptions}
              value={formData.modalidade ? { label: modalidadeOptions.find(m => m.value === formData.modalidade)?.label, value: formData.modalidade } : null}
              onChange={(option) => handleInputChange('modalidade', option?.value)}
              disabled={loading}
            />

            <CustomInput
              type="select"
              label="Metodologia de Ensino"
              options={metodologiaOptions}
              value={formData.metodologia ? { label: metodologiaOptions.find(m => m.value === formData.metodologia)?.label, value: formData.metodologia } : null}
              onChange={(option) => handleInputChange('metodologia', option?.value)}
              disabled={loading}
            />
          </div>
        );

      case 'disciplinas':
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-800">Disciplinas do Plano Curricular</h3>
              <div className="flex gap-3">
                {formData.nivel && disciplinasPorNivel[formData.nivel] && (
                  <button
                    type="button"
                    onClick={preencherDisciplinasAutomaticamente}
                    className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Auto-preencher
                  </button>
                )}
                <button
                  type="button"
                  onClick={addDisciplina}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Adicionar Disciplina
                </button>
              </div>
            </div>

            {errors.disciplinas && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm">{errors.disciplinas}</p>
              </div>
            )}

            <div className="space-y-6">
              {formData.disciplinas.map((disciplina, index) => (
                <div key={disciplina.id} className="border border-gray-300 rounded-lg p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="text-lg font-medium text-gray-800">
                      Disciplina {index + 1}
                    </h4>
                    <button
                      type="button"
                      onClick={() => removeDisciplina(disciplina.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <CustomInput
                      type="text"
                      label="Nome da Disciplina"
                      value={disciplina.nome}
                      onChange={(value) => updateDisciplina(disciplina.id, 'nome', value)}
                      placeholder="Ex: Matemática"
                    />

                    <CustomInput
                      type="text"
                      label="Código"
                      value={disciplina.codigo}
                      onChange={(value) => updateDisciplina(disciplina.id, 'codigo', value)}
                      placeholder="Ex: MAT-10"
                    />

                    <CustomInput
                      type="select"
                      label="Tipo"
                      options={[
                        { label: 'Obrigatória', value: 'OBRIGATORIA' },
                        { label: 'Optativa', value: 'OPTATIVA' },
                        { label: 'Complementar', value: 'COMPLEMENTAR' }
                      ]}
                      value={disciplina.tipo ? { label: disciplina.tipo === 'OBRIGATORIA' ? 'Obrigatória' : disciplina.tipo === 'OPTATIVA' ? 'Optativa' : 'Complementar', value: disciplina.tipo } : null}
                      onChange={(option) => updateDisciplina(disciplina.id, 'tipo', option?.value)}
                    />

                    <CustomInput
                      type="number"
                      label="Carga Horária Total"
                      value={disciplina.cargaHoraria}
                      onChange={(value) => updateDisciplina(disciplina.id, 'cargaHoraria', value)}
                      placeholder="Ex: 120"
                    />

                    <CustomInput
                      type="number"
                      label="Carga Horária Semanal"
                      value={disciplina.cargaHorariaSemanal}
                      onChange={(value) => updateDisciplina(disciplina.id, 'cargaHorariaSemanal', value)}
                      placeholder="Ex: 4"
                    />

                    <div className="lg:col-span-3">
                      <CustomInput
                        type="textarea"
                        label="Ementa"
                        value={disciplina.ementa}
                        onChange={(value) => updateDisciplina(disciplina.id, 'ementa', value)}
                        placeholder="Descrição resumida do conteúdo da disciplina..."
                        rows={3}
                      />
                    </div>

                    <div className="lg:col-span-3">
                      <CustomInput
                        type="textarea"
                        label="Objetivos"
                        value={disciplina.objetivos}
                        onChange={(value) => updateDisciplina(disciplina.id, 'objetivos', value)}
                        placeholder="Objetivos de aprendizagem da disciplina..."
                        rows={3}
                      />
                      </div>

                    <div className="lg:col-span-3">
                      <CustomInput
                        type="textarea"
                        label="Conteúdo Programático"
                        value={disciplina.conteudoProgramatico}
                        onChange={(value) => updateDisciplina(disciplina.id, 'conteudoProgramatico', value)}
                        placeholder="Conteúdo detalhado a ser ministrado..."
                        rows={4}
                      />
                    </div>

                    <CustomInput
                      type="text"
                      label="Metodologia de Ensino"
                      value={disciplina.metodologiaEnsino}
                      onChange={(value) => updateDisciplina(disciplina.id, 'metodologiaEnsino', value)}
                      placeholder="Ex: Aula expositiva, exercícios práticos"
                    />

                    <CustomInput
                      type="text"
                      label="Recursos Didáticos"
                      value={disciplina.recursosDidaticos}
                      onChange={(value) => updateDisciplina(disciplina.id, 'recursosDidaticos', value)}
                      placeholder="Ex: Quadro, projetor, laboratório"
                    />

                    <CustomInput
                      type="text"
                      label="Sistema de Avaliação"
                      value={disciplina.avaliacao}
                      onChange={(value) => updateDisciplina(disciplina.id, 'avaliacao', value)}
                      placeholder="Ex: Contínua e sumativa"
                    />

                    <div className="lg:col-span-3">
                      <CustomInput
                        type="textarea"
                        label="Bibliografia"
                        value={disciplina.bibliografia}
                        onChange={(value) => updateDisciplina(disciplina.id, 'bibliografia', value)}
                        placeholder="Livros e materiais de referência..."
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              ))}

              {formData.disciplinas.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <GraduationCap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">Nenhuma disciplina adicionada</p>
                  <button
                    type="button"
                    onClick={addDisciplina}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Adicionar Primeira Disciplina
                  </button>
                </div>
              )}
            </div>
          </div>
        );

      case 'objetivos':
        return (
          <div className="space-y-6">
            <CustomInput
              type="textarea"
              label="Objetivo Geral"
              value={formData.objetivoGeral}
              onChange={(value) => handleInputChange('objetivoGeral', value)}
              required
              iconStart={<Target size={18} />}
              errorMessage={errors.objetivoGeral}
              disabled={loading}
              placeholder="Descreva o objetivo principal do plano curricular..."
              rows={4}
            />

            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Objetivos Específicos
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('objetivosEspecificos')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.objetivosEspecificos.map((objetivo, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="textarea"
                      label={`Objetivo ${index + 1}`}
                      value={objetivo}
                      onChange={(value) => updateArrayItem('objetivosEspecificos', index, value)}
                      placeholder="Descreva um objetivo específico..."
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('objetivosEspecificos', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.objetivosEspecificos.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhum objetivo específico adicionado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'competencias':
        return (
          <div className="space-y-8">
            {/* Competências Gerais */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Competências Gerais
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('competenciasGerais')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.competenciasGerais.map((competencia, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="textarea"
                      label={`Competência Geral ${index + 1}`}
                      value={competencia}
                      onChange={(value) => updateArrayItem('competenciasGerais', index, value)}
                      placeholder="Descreva uma competência geral..."
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('competenciasGerais', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.competenciasGerais.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhuma competência geral adicionada</p>
                  </div>
                )}
              </div>
            </div>

            {/* Competências Específicas */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Competências Específicas
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('competenciasEspecificas')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.competenciasEspecificas.map((competencia, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="textarea"
                      label={`Competência Específica ${index + 1}`}
                      value={competencia}
                      onChange={(value) => updateArrayItem('competenciasEspecificas', index, value)}
                      placeholder="Descreva uma competência específica..."
                      rows={2}
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('competenciasEspecificas', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.competenciasEspecificas.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhuma competência específica adicionada</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'avaliacao':
        return (
          <div className="space-y-6">
            {/* Sistemas de Avaliação */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Sistemas de Avaliação
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('sistemasAvaliacao')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar Sistema
                </button>
              </div>

              <div className="space-y-3">
                {formData.sistemasAvaliacao.map((sistema, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="text"
                      label={`Sistema de Avaliação ${index + 1}`}
                      value={sistema}
                      onChange={(value) => updateArrayItem('sistemasAvaliacao', index, value)}
                      placeholder="Ex: Avaliação Contínua, Prova Final, Trabalhos Práticos..."
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sistemasAvaliacao', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.sistemasAvaliacao.length === 0 && (
                  <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhum sistema de avaliação adicionado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Critérios de Aprovação */}
            <CustomInput
              type="textarea"
              label="Critérios de Aprovação"
              value={formData.criteriosAprovacao}
              onChange={(value) => handleInputChange('criteriosAprovacao', value)}
              iconStart={<CheckSquare size={18} />}
              disabled={loading}
              placeholder="Descreva os critérios para aprovação dos alunos..."
              rows={4}
            />
          </div>
        );

      case 'recursos':
        return (
          <div className="space-y-8">
            {/* Recursos Humanos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Recursos Humanos Necessários
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('recursosHumanos')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.recursosHumanos.map((recurso, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="text"
                      label={`Recurso Humano ${index + 1}`}
                      value={recurso}
                      onChange={(value) => updateArrayItem('recursosHumanos', index, value)}
                      placeholder="Ex: Professor de Matemática, Técnico de Laboratório..."
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('recursosHumanos', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.recursosHumanos.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhum recurso humano especificado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Recursos Materiais e Técnicos */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Recursos Materiais e Técnicos
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('recursosMateriaisTecnicos')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.recursosMateriaisTecnicos.map((recurso, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="text"
                      label={`Recurso Material/Técnico ${index + 1}`}
                      value={recurso}
                      onChange={(value) => updateArrayItem('recursosMateriaisTecnicos', index, value)}
                      placeholder="Ex: Computadores, Projetores, Material Didático..."
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('recursosMateriaisTecnicos', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.recursosMateriaisTecnicos.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhum recurso material/técnico especificado</p>
                  </div>
                )}
              </div>
            </div>

            {/* Infraestrutura e Espaços */}
            <div>
              <div className="flex justify-between items-center mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  Infraestrutura e Espaços Necessários
                </label>
                <button
                  type="button"
                  onClick={() => addArrayItem('infraestruturaEspacos')}
                  className="flex items-center px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  Adicionar
                </button>
              </div>

              <div className="space-y-3">
                {formData.infraestruturaEspacos.map((infraestrutura, index) => (
                  <div key={index} className="flex gap-2">
                    <CustomInput
                      type="text"
                      label={`Infraestrutura/Espaço ${index + 1}`}
                      value={infraestrutura}
                      onChange={(value) => updateArrayItem('infraestruturaEspacos', index, value)}
                      placeholder="Ex: Laboratório de Informática, Biblioteca, Quadra Esportiva..."
                    />
                    <button
                      type="button"
                      onClick={() => removeArrayItem('infraestruturaEspacos', index)}
                      className="mt-8 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}

                {formData.infraestruturaEspacos.length === 0 && (
                  <div className="text-center py-6 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                    <p className="text-gray-500">Nenhuma infraestrutura/espaço especificado</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 'observacoes':
        return (
          <div className="space-y-6">
            <CustomInput
              type="textarea"
              label="Observações Gerais"
              value={formData.observacoes}
              onChange={(value) => handleInputChange('observacoes', value)}
              iconStart={<FileText size={18} />}
              disabled={loading}
              placeholder="Informações adicionais sobre o plano curricular..."
              rows={6}
              maxLength={1000}
            />

            <CustomInput
              type="textarea"
              label="Requisitos e Pré-requisitos"
              value={formData.requisitosPrerrequisitos}
              onChange={(value) => handleInputChange('requisitosPrerrequisitos', value)}
              iconStart={<CheckSquare size={18} />}
              disabled={loading}
              placeholder="Descreva os requisitos necessários para implementação do plano..."
              rows={4}
              maxLength={500}
            />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="bg-white rounded-xl w-full min-h-screen">
      {/* Toast para notificações */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg max-w-md z-50 animate-fade-in
          ${toastMessage.type === 'success' ? 'bg-green-50 border-l-4 border-green-500 text-green-700' :
            toastMessage.type === 'error' ? 'bg-red-50 border-l-4 border-red-500 text-red-700' :
              'bg-blue-50 border-l-4 border-blue-500 text-blue-700'}`}
        >
          <div className="flex items-center">
            {toastMessage.type === 'success' ? (
              <CheckSquare className="w-5 h-5 mr-3" />
            ) : (
              <AlertCircle className="w-5 h-5 mr-3" />
            )}
            <div>
              <h3 className="font-medium">{toastMessage.title}</h3>
              <p className="text-sm mt-1">{toastMessage.message}</p>
            </div>
            <button
              className="ml-auto p-1 hover:bg-gray-200 rounded-full transition-colors"
              onClick={() => setToastMessage(null)}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Header */}
        <div className="text-center mb-8 p-6 border-b border-gray-100">
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Sistema de Cadastro de Planos Curriculares</h1>
          <p className="text-gray-600">Subsistemas de Ensino Geral e Técnico-Profissional - Angola</p>
          <p className="text-sm text-gray-500 mt-1">Preencha todos os campos obrigatórios (*)</p>
        </div>

        <div onSubmit={handleSubmit}>
          {/* Navegação por Tabs */}
          <div className="mb-8 border-b border-gray-200">
            <nav className="flex space-x-8 overflow-x-auto">
              {tabs.map((tab) => {
                const IconComponent = tab.icon;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <IconComponent className="w-5 h-5 mr-2" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Conteúdo da Tab Ativa */}
          <div className="mb-8">
            {renderTabContent()}
          </div>

          {/* Botões de Ação */}
          <div className="flex justify-between items-center pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={resetForm}
              className="flex items-center px-6 py-2.5 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors text-gray-800"
              disabled={loading}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Limpar Tudo
            </button>

            <div className="flex space-x-4">
              <button
                type="button"
                onClick={() => console.log('Salvar como rascunho:', formData)}
                className="flex items-center px-6 py-2.5 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                disabled={loading}
              >
                <Archive className="w-4 h-4 mr-2" />
                Salvar Rascunho
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                    Processando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Cadastrar Plano
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card informativo sobre planos curriculares */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center text-blue-700 mb-4">
            <BookOpen className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Sobre os Planos Curriculares em Angola</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Ensino Geral:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Primário: 1ª à 6ª classe (720-900h anuais)</li>
                <li>• 1º Ciclo Secundário: 7ª à 9ª classe (900h anuais)</li>
                <li>• 2º Ciclo Secundário: 10ª à 12ª classe (900h anuais)</li>
                <li>• Mínimo 24 aulas semanais (primário) e 30 (secundário)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">Ensino Técnico-Profissional:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Técnico Médio: 10ª à 13ª classe</li>
                <li>• Formação Profissional: Níveis básico a avançado</li>
                <li>• Carga horária variável por área técnica</li>
                <li>• Inclui componente prática obrigatória</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-blue-700 text-sm">
              <strong>Importante:</strong> Os planos curriculares devem estar alinhados com a Lei de Bases do Sistema de Educação e Ensino (Lei nº 32/20) e seguir as diretrizes do Ministério da Educação de Angola.
            </p>
          </div>
        </div>

        {/* Estatísticas do Sistema */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center text-green-700 mb-4">
            <Award className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Estatísticas do Sistema Curricular</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">156</div>
              <div className="text-sm text-green-600">Planos Ativos</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">24</div>
              <div className="text-sm text-green-600">Áreas Técnicas</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">1,847</div>
              <div className="text-sm text-green-600">Disciplinas</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-green-200">
              <div className="text-2xl font-bold text-green-800">18</div>
              <div className="text-sm text-green-600">Províncias</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroPlanoCurricular;
                      
