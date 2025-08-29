import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar, Clock, BookOpen, GraduationCap, FileText, Save, 
  RotateCcw, Plus, Trash2, AlertCircle, CheckSquare, X,
  Target, Award, Settings, School, Users, MapPin,
  Edit3, Eye, Copy, Archive, Hash, TrendingUp
} from 'lucide-react';
import CustomInput from '../components/CustomInput';

const CadastroAvaliacoes = () => {
  // Estados principais
  const [formData, setFormData] = useState({
    // Informações básicas
    nome: '',
    codigo: '',
    tipoAvaliacao: '',
    trimestre: '',
    anoLetivo: new Date().getFullYear(),
    subsistema: '',
    nivel: '',
    classe: '',
    disciplina: '',
    
    // Datas e períodos
    dataInicio: '',
    dataFim: '',
    duracao: 90,
    horaInicio: '08:00',
    horaFim: '09:30',
    
    // Detalhes da avaliação
    pontuacaoMaxima: 100,
    notaMinima: 10,
    peso: 100,
    modalidade: 'PRESENCIAL',
    tipoProva: 'ESCRITA',
    
    // Configurações
    temPermiteConsulta: false,
    materialPermitido: [],
    observacoes: '',
    instrucoes: '',
    criteriosAvaliacao: '',
    
    // Escola e responsáveis
    escola: '',
    elaboradoPor: '',
    revisadoPor: '',
    aprovadoPor: '',
    
    // Status e controle
    status: 'RASCUNHO',
    dataElaboracao: new Date().toISOString().split('T')[0],
    versao: '1.0'
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [toastTimeout, setToastTimeout] = useState(null);

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

  // Tipos de avaliação
  const tipoAvaliacaoOptions = [
    { label: 'Prova do Professor', value: 'PROVA_PROFESSOR' },
    { label: 'Prova Trimestral', value: 'PROVA_TRIMESTRAL' },
    { label: 'Avaliação Nacional de Aferição', value: 'AVALIACAO_NACIONAL' },
    { label: 'Exame Final', value: 'EXAME_FINAL' },
    { label: 'Prova de Recuperação', value: 'PROVA_RECUPERACAO' },
    { label: 'Teste Diagnóstico', value: 'TESTE_DIAGNOSTICO' }
  ];

  // Trimestres
  const trimestreOptions = [
    { label: 'I Trimestre', value: 'I' },
    { label: 'II Trimestre', value: 'II' },
    { label: 'III Trimestre', value: 'III' }
  ];

  // Disciplinas por nível
  const disciplinasPorNivel = {
    PRIMARIO: [
      { label: 'Língua Portuguesa', value: 'LINGUA_PORTUGUESA' },
      { label: 'Matemática', value: 'MATEMATICA' },
      { label: 'Estudo do Meio', value: 'ESTUDO_MEIO' },
      { label: 'Ciências da Natureza', value: 'CIENCIAS_NATUREZA' },
      { label: 'História', value: 'HISTORIA' },
      { label: 'Geografia', value: 'GEOGRAFIA' },
      { label: 'Educação Moral e Cívica', value: 'EDUCACAO_MORAL' },
      { label: 'Educação Manual e Plástica', value: 'EDUCACAO_PLASTICA' },
      { label: 'Educação Musical', value: 'EDUCACAO_MUSICAL' },
      { label: 'Educação Física', value: 'EDUCACAO_FISICA' }
    ],
    SECUNDARIO_1_CICLO: [
      { label: 'Língua Portuguesa', value: 'LINGUA_PORTUGUESA' },
      { label: 'Matemática', value: 'MATEMATICA' },
      { label: 'História', value: 'HISTORIA' },
      { label: 'Geografia', value: 'GEOGRAFIA' },
      { label: 'Biologia', value: 'BIOLOGIA' },
      { label: 'Química', value: 'QUIMICA' },
      { label: 'Física', value: 'FISICA' },
      { label: 'Educação Moral e Cívica', value: 'EDUCACAO_MORAL' },
      { label: 'Educação Física', value: 'EDUCACAO_FISICA' },
      { label: 'Educação Visual', value: 'EDUCACAO_VISUAL' },
      { label: 'Educação Musical', value: 'EDUCACAO_MUSICAL' },
      { label: 'Língua Estrangeira', value: 'LINGUA_ESTRANGEIRA' }
    ],
    SECUNDARIO_2_CICLO: [
      { label: 'Língua Portuguesa', value: 'LINGUA_PORTUGUESA' },
      { label: 'Matemática', value: 'MATEMATICA' },
      { label: 'História', value: 'HISTORIA' },
      { label: 'Geografia', value: 'GEOGRAFIA' },
      { label: 'Biologia', value: 'BIOLOGIA' },
      { label: 'Química', value: 'QUIMICA' },
      { label: 'Física', value: 'FISICA' },
      { label: 'Filosofia', value: 'FILOSOFIA' },
      { label: 'Educação Física', value: 'EDUCACAO_FISICA' },
      { label: 'Educação Visual', value: 'EDUCACAO_VISUAL' },
      { label: 'Língua Estrangeira', value: 'LINGUA_ESTRANGEIRA' }
    ]
  };

  // Modalidades
  const modalidadeOptions = [
    { label: 'Presencial', value: 'PRESENCIAL' },
    { label: 'Digital', value: 'DIGITAL' },
    { label: 'Híbrida (Digital + Papel)', value: 'HIBRIDA' }
  ];

  // Tipos de prova
  const tipoProvaOptions = [
    { label: 'Escrita', value: 'ESCRITA' },
    { label: 'Oral', value: 'ORAL' },
    { label: 'Prática', value: 'PRATICA' },
    { label: 'Mista', value: 'MISTA' }
  ];

  // Material permitido
  const materialPermitidoOptions = [
    { label: 'Calculadora', value: 'CALCULADORA' },
    { label: 'Régua', value: 'REGUA' },
    { label: 'Compasso', value: 'COMPASSO' },
    { label: 'Esquadros', value: 'ESQUADROS' },
    { label: 'Transferidor', value: 'TRANSFERIDOR' },
    { label: 'Dicionário', value: 'DICIONARIO' },
    { label: 'Tabela Periódica', value: 'TABELA_PERIODICA' },
    { label: 'Atlas Geográfico', value: 'ATLAS_GEOGRAFICO' }
  ];

  // Status das avaliações
  const statusOptions = [
    { label: 'Rascunho', value: 'RASCUNHO' },
    { label: 'Em Revisão', value: 'EM_REVISAO' },
    { label: 'Aprovada', value: 'APROVADA' },
    { label: 'Agendada', value: 'AGENDADA' },
    { label: 'Em Andamento', value: 'EM_ANDAMENTO' },
    { label: 'Concluída', value: 'CONCLUIDA' },
    { label: 'Cancelada', value: 'CANCELADA' }
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
      'nome', 'codigo', 'tipoAvaliacao', 'trimestre', 'anoLetivo',
      'subsistema', 'nivel', 'classe', 'disciplina', 'dataInicio',
      'dataFim', 'horaInicio', 'horaFim', 'elaboradoPor'
    ];

    requiredFields.forEach(field => {
      if (!formData[field]?.toString().trim()) {
        newErrors[field] = `O campo ${field.replace(/([A-Z])/g, ' $1').toLowerCase().trim()} é obrigatório.`;
      }
    });

    // Validação de datas
    if (formData.dataInicio && formData.dataFim) {
      const inicio = new Date(formData.dataInicio);
      const fim = new Date(formData.dataFim);
      
      if (inicio > fim) {
        newErrors.dataFim = 'A data de fim deve ser posterior à data de início.';
      }
    }

    // Validação de horas
    if (formData.horaInicio && formData.horaFim) {
      const [horaIni, minIni] = formData.horaInicio.split(':').map(Number);
      const [horaFim, minFim] = formData.horaFim.split(':').map(Number);
      
      const inicioMinutos = horaIni * 60 + minIni;
      const fimMinutos = horaFim * 60 + minFim;
      
      if (inicioMinutos >= fimMinutos) {
        newErrors.horaFim = 'A hora de fim deve ser posterior à hora de início.';
      }
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
        newData.disciplina = '';
      } else if (field === 'nivel') {
        newData.classe = '';
        newData.disciplina = '';
      } else if (field === 'tipoAvaliacao') {
        // Definir peso padrão baseado no tipo
        switch (value) {
          case 'PROVA_PROFESSOR':
            newData.peso = 40;
            break;
          case 'PROVA_TRIMESTRAL':
            newData.peso = 60;
            break;
          case 'AVALIACAO_NACIONAL':
          case 'EXAME_FINAL':
            newData.peso = 100;
            break;
          default:
            newData.peso = 100;
        }
      }

      // Auto-gerar código se não existe
      if (field === 'trimestre' || field === 'disciplina' || field === 'classe') {
        if (newData.trimestre && newData.disciplina && newData.classe) {
          newData.codigo = `AV-${newData.trimestre}T-${newData.disciplina.substring(0, 3).toUpperCase()}-${newData.classe}C-${newData.anoLetivo}`;
        }
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

  // Resetar formulário
  const resetForm = () => {
    setFormData({
      nome: '',
      codigo: '',
      tipoAvaliacao: '',
      trimestre: '',
      anoLetivo: new Date().getFullYear(),
      subsistema: '',
      nivel: '',
      classe: '',
      disciplina: '',
      dataInicio: '',
      dataFim: '',
      duracao: 90,
      horaInicio: '08:00',
      horaFim: '09:30',
      pontuacaoMaxima: 100,
      notaMinima: 10,
      peso: 100,
      modalidade: 'PRESENCIAL',
      tipoProva: 'ESCRITA',
      temPermiteConsulta: false,
      materialPermitido: [],
      observacoes: '',
      instrucoes: '',
      criteriosAvaliacao: '',
      escola: '',
      elaboradoPor: '',
      revisadoPor: '',
      aprovadoPor: '',
      status: 'RASCUNHO',
      dataElaboracao: new Date().toISOString().split('T')[0],
      versao: '1.0'
    });
    setErrors({});
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

      console.log('Avaliação:', formData);
      showToast('success', 'Sucesso', 'Avaliação cadastrada com sucesso!');
      resetForm();
    } catch (error) {
      console.error('Erro ao cadastrar avaliação:', error);
      showToast('error', 'Erro', 'Erro ao cadastrar avaliação. Tente novamente.');
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
          <h1 className="text-3xl font-bold mb-2 text-blue-800">Sistema de Cadastro de Avaliações</h1>
          <p className="text-gray-600">Sistema Trimestral de Avaliações - Angola</p>
          <p className="text-sm text-gray-500 mt-1">Preencha todos os campos obrigatórios (*)</p>
        </div>

        <div onSubmit={handleSubmit} className="space-y-8">
          {/* Seção 1: Informações Básicas */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <FileText className="w-5 h-5 mr-2" />
              Informações Básicas
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <CustomInput
                  type="text"
                  label="Nome da Avaliação"
                  value={formData.nome}
                  onChange={(value) => handleInputChange('nome', value)}
                  required
                  iconStart={<FileText size={18} />}
                  errorMessage={errors.nome}
                  disabled={loading}
                  placeholder="Ex: Prova Trimestral de Matemática - I Trimestre"
                />
              </div>

              <CustomInput
                type="text"
                label="Código"
                value={formData.codigo}
                onChange={(value) => handleInputChange('codigo', value)}
                required
                iconStart={<Hash size={18} />}
                errorMessage={errors.codigo}
                disabled={loading}
                placeholder="Ex: AV-IT-MAT-10C-2024"
              />

              <CustomInput
                type="select"
                label="Tipo de Avaliação"
                options={tipoAvaliacaoOptions}
                value={formData.tipoAvaliacao ? { 
                  label: tipoAvaliacaoOptions.find(t => t.value === formData.tipoAvaliacao)?.label, 
                  value: formData.tipoAvaliacao 
                } : null}
                onChange={(option) => handleInputChange('tipoAvaliacao', option?.value)}
                required
                errorMessage={errors.tipoAvaliacao}
                disabled={loading}
                placeholder="Selecione o tipo"
              />

              <CustomInput
                type="select"
                label="Trimestre"
                options={trimestreOptions}
                value={formData.trimestre ? { 
                  label: trimestreOptions.find(t => t.value === formData.trimestre)?.label, 
                  value: formData.trimestre 
                } : null}
                onChange={(option) => handleInputChange('trimestre', option?.value)}
                required
                errorMessage={errors.trimestre}
                disabled={loading}
                placeholder="Selecione o trimestre"
              />

              <CustomInput
                type="number"
                label="Ano Letivo"
                value={formData.anoLetivo}
                onChange={(value) => handleInputChange('anoLetivo', value)}
                required
                iconStart={<Calendar size={18} />}
                errorMessage={errors.anoLetivo}
                disabled={loading}
                min="2020"
                max="2030"
              />
            </div>
          </section>

          {/* Seção 2: Nível e Disciplina */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <GraduationCap className="w-5 h-5 mr-2" />
              Nível e Disciplina
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CustomInput
                type="select"
                label="Subsistema"
                options={subsistemaOptions}
                value={formData.subsistema ? { 
                  label: subsistemaOptions.find(s => s.value === formData.subsistema)?.label, 
                  value: formData.subsistema 
                } : null}
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
                value={formData.nivel ? { 
                  label: nivelOptions[formData.subsistema]?.find(n => n.value === formData.nivel)?.label, 
                  value: formData.nivel 
                } : null}
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
                value={formData.classe ? { 
                  label: classeOptions[formData.nivel]?.find(c => c.value === formData.classe)?.label, 
                  value: formData.classe 
                } : null}
                onChange={(option) => handleInputChange('classe', option?.value)}
                required
                errorMessage={errors.classe}
                disabled={loading || !formData.nivel}
                placeholder="Selecione a classe"
              />

              <CustomInput
                type="select"
                label="Disciplina"
                options={formData.nivel ? disciplinasPorNivel[formData.nivel] : []}
                value={formData.disciplina ? { 
                  label: disciplinasPorNivel[formData.nivel]?.find(d => d.value === formData.disciplina)?.label, 
                  value: formData.disciplina 
                } : null}
                onChange={(option) => handleInputChange('disciplina', option?.value)}
                required
                errorMessage={errors.disciplina}
                disabled={loading || !formData.nivel}
                placeholder="Selecione a disciplina"
              />
            </div>
          </section>

          {/* Seção 3: Datas e Horários */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Calendar className="w-5 h-5 mr-2" />
              Datas e Horários
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <CustomInput
                type="date"
                label="Data de Início"
                value={formData.dataInicio}
                onChange={(value) => handleInputChange('dataInicio', value)}
                required
                errorMessage={errors.dataInicio}
                disabled={loading}
              />

              <CustomInput
                type="date"
                label="Data de Fim"
                value={formData.dataFim}
                onChange={(value) => handleInputChange('dataFim', value)}
                required
                errorMessage={errors.dataFim}
                disabled={loading}
                minDate={formData.dataInicio}
              />

              <CustomInput
                type="time"
                label="Hora de Início"
                value={formData.horaInicio}
                onChange={(value) => handleInputChange('horaInicio', value)}
                required
                iconStart={<Clock size={18} />}
                errorMessage={errors.horaInicio}
                disabled={loading}
              />

              <CustomInput
                type="time"
                label="Hora de Fim"
                value={formData.horaFim}
                onChange={(value) => handleInputChange('horaFim', value)}
                required
                iconStart={<Clock size={18} />}
                errorMessage={errors.horaFim}
                disabled={loading}
              />

              <CustomInput
                type="number"
                label="Duração (minutos)"
                value={formData.duracao}
                onChange={(value) => handleInputChange('duracao', value)}
                iconStart={<Clock size={18} />}
                disabled={loading}
                min="30"
                max="300"
                helperText="Duração em minutos"
              />
            </div>
          </section>

          {/* Seção 4: Configurações da Avaliação */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Configurações da Avaliação
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CustomInput
                type="number"
                label="Pontuação Máxima"
                value={formData.pontuacaoMaxima}
                onChange={(value) => handleInputChange('pontuacaoMaxima', value)}
                iconStart={<Target size={18} />}
                disabled={loading}
                min="1"
                max="200"
                helperText="Pontos totais"
              />

              <CustomInput
                type="number"
                label="Nota Mínima"
                value={formData.notaMinima}
                onChange={(value) => handleInputChange('notaMinima', value)}
                iconStart={<Award size={18} />}
                disabled={loading}
                min="0"
                max="20"
                helperText="Nota para aprovação"
              />

              <CustomInput
                type="number"
                label="Peso (%)"
                value={formData.peso}
                onChange={(value) => handleInputChange('peso', value)}
                iconStart={<TrendingUp size={18} />}
                disabled={loading}
                min="1"
                max="100"
                helperText="Peso na nota final"
              />

              <CustomInput
                type="select"
                label="Modalidade"
                options={modalidadeOptions}
                value={formData.modalidade ? { 
                  label: modalidadeOptions.find(m => m.value === formData.modalidade)?.label, 
                  value: formData.modalidade 
                } : null}
                onChange={(option) => handleInputChange('modalidade', option?.value)}
                disabled={loading}
              />

              <CustomInput
                type="select"
                label="Tipo de Prova"
                options={tipoProvaOptions}
                value={formData.tipoProva ? { 
                  label: tipoProvaOptions.find(t => t.value === formData.tipoProva)?.label, 
                  value: formData.tipoProva 
                } : null}
                onChange={(option) => handleInputChange('tipoProva', option?.value)}
                disabled={loading}
              />

              <CustomInput
                type="select"
                label="Status"
                options={statusOptions}
                value={formData.status ? { 
                  label: statusOptions.find(s => s.value === formData.status)?.label, 
                  value: formData.status 
                } : null}
                onChange={(option) => handleInputChange('status', option?.value)}
                disabled={loading}
              />

              <div className="lg:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Permite Consulta de Material
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    checked={formData.temPermiteConsulta}
                    onChange={(e) => handleInputChange('temPermiteConsulta', e.target.checked)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    disabled={loading}
                  />
                  <span className="text-sm text-gray-600">
                    Marque se a avaliação permite consulta de material
                  </span>
                </div>
              </div>
            </div>

            {/* Material Permitido */}
            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Material Permitido
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 border border-gray-300 rounded-lg p-4">
                {materialPermitidoOptions.map((material) => (
                  <label key={material.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.materialPermitido.includes(material.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          handleInputChange('materialPermitido', [...formData.materialPermitido, material.value]);
                        } else {
                          handleInputChange('materialPermitido', formData.materialPermitido.filter(m => m !== material.value));
                        }
                      }}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      disabled={loading}
                    />
                    <span className="text-sm text-gray-700">{material.label}</span>
                  </label>
                ))}
              </div>
            </div>
          </section>

          {/* Seção 5: Instruções e Critérios */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <BookOpen className="w-5 h-5 mr-2" />
              Instruções e Critérios
            </h2>

            <div className="space-y-4">
              <CustomInput
                type="textarea"
                label="Instruções para os Alunos"
                value={formData.instrucoes}
                onChange={(value) => handleInputChange('instrucoes', value)}
                disabled={loading}
                placeholder="Instruções detalhadas sobre como realizar a avaliação..."
                rows={4}
                maxLength={1000}
              />

              <CustomInput
                type="textarea"
                label="Critérios de Avaliação"
                value={formData.criteriosAvaliacao}
                onChange={(value) => handleInputChange('criteriosAvaliacao', value)}
                disabled={loading}
                placeholder="Critérios que serão utilizados para avaliar as respostas..."
                rows={4}
                maxLength={1000}
              />

              <CustomInput
                type="textarea"
                label="Observações"
                value={formData.observacoes}
                onChange={(value) => handleInputChange('observacoes', value)}
                disabled={loading}
                placeholder="Observações adicionais sobre a avaliação..."
                rows={3}
                maxLength={500}
              />
            </div>
          </section>

          {/* Seção 6: Responsáveis */}
          <section className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
              <Users className="w-5 h-5 mr-2" />
              Responsáveis
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <CustomInput
                type="text"
                label="Escola"
                value={formData.escola}
                onChange={(value) => handleInputChange('escola', value)}
                iconStart={<School size={18} />}
                disabled={loading}
                placeholder="Nome da escola"
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
                placeholder="Nome do elaborador"
              />

              <CustomInput
                type="text"
                label="Revisado Por"
                value={formData.revisadoPor}
                onChange={(value) => handleInputChange('revisadoPor', value)}
                iconStart={<Users size={18} />}
                disabled={loading}
                placeholder="Nome do revisor"
              />

              <CustomInput
                type="text"
                label="Aprovado Por"
                value={formData.aprovadoPor}
                onChange={(value) => handleInputChange('aprovadoPor', value)}
                iconStart={<Users size={18} />}
                disabled={loading}
                placeholder="Nome do aprovador"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Data de Elaboração
                </label>
                <input
                  type="date"
                  value={formData.dataElaboracao}
                  onChange={(e) => handleInputChange('dataElaboracao', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              <CustomInput
                type="text"
                label="Versão"
                value={formData.versao}
                onChange={(value) => handleInputChange('versao', value)}
                iconStart={<Hash size={18} />}
                disabled={loading}
                placeholder="1.0"
              />
            </div>
          </section>

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
                onClick={handleSubmit}
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
                    Cadastrar Avaliação
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Card informativo sobre avaliações trimestrais */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-center text-blue-700 mb-4">
            <Calendar className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Sistema de Avaliação Trimestral em Angola</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-blue-800 mb-2">I Trimestre:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Setembro a Dezembro</li>
                <li>• Prova do Professor (40%)</li>
                <li>• Prova Trimestral (60%)</li>
                <li>• Pausa pedagógica de 2 semanas</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">II Trimestre:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Janeiro a Abril</li>
                <li>• Prova do Professor (40%)</li>
                <li>• Prova Trimestral (60%)</li>
                <li>• Jogos Zonais Escolares</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-blue-800 mb-2">III Trimestre:</h4>
              <ul className="space-y-1 text-blue-700">
                <li>• Abril a Julho</li>
                <li>• Avaliações finais</li>
                <li>• Exames nacionais (6ª, 9ª e 12ª classes)</li>
                <li>• Olimpíadas de Matemática</li>
              </ul>
            </div>
          </div>

          <div className="mt-4 p-3 bg-white rounded border border-blue-200">
            <p className="text-blue-700 text-sm">
              <strong>Calendário Nacional:</strong> O ano letivo compreende 48 semanas escolares, sendo 41 semanas letivas. 
              São reservados 8 dias úteis para avaliação do rendimento escolar no I e II trimestres, permitindo 
              1-2 provas por dia conforme o coeficiente de fadiga das disciplinas.
            </p>
          </div>
        </div>

        {/* Card sobre tipos de avaliação */}
        <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-6">
          <div className="flex items-center text-green-700 mb-4">
            <Target className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Tipos de Avaliação</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Prova do Professor</h4>
              <p className="text-green-700">Elaborada pelo professor da disciplina. Peso: 40% da nota trimestral.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Prova Trimestral</h4>
              <p className="text-green-700">Prova oficial do trimestre. Peso: 60% da nota trimestral.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Avaliação Nacional</h4>
              <p className="text-green-700">Aplicada nas 2ª, 5ª e 8ª classes para aferição da aprendizagem.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Exame Final</h4>
              <p className="text-green-700">Classes terminais (6ª, 9ª e 12ª). Necessário para conclusão do ciclo.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Prova de Recuperação</h4>
              <p className="text-green-700">Para alunos que não atingiram a média mínima no trimestre.</p>
            </div>

            <div className="bg-white p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold text-green-800 mb-2">Teste Diagnóstico</h4>
              <p className="text-green-700">Aplicado no início do ano letivo para diagnóstico de conhecimentos.</p>
            </div>
          </div>
        </div>

        {/* Card sobre modalidades de avaliação */}
        <div className="mt-6 bg-purple-50 border border-purple-200 rounded-lg p-6">
          <div className="flex items-center text-purple-700 mb-4">
            <Settings className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Modalidades e Formatos</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Modalidades de Aplicação:</h4>
              <ul className="space-y-1 text-purple-700">
                <li>• <strong>Presencial:</strong> Tradicional em papel na escola</li>
                <li>• <strong>Digital:</strong> Realizada em computadores/tablets</li>
                <li>• <strong>Híbrida:</strong> Combinação digital + papel</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-purple-800 mb-2">Tipos de Prova:</h4>
              <ul className="space-y-1 text-purple-700">
                <li>• <strong>Escrita:</strong> Questões dissertativas e objetivas</li>
                <li>• <strong>Oral:</strong> Apresentações e arguições</li>
                <li>• <strong>Prática:</strong> Atividades laboratoriais/técnicas</li>
                <li>• <strong>Mista:</strong> Combinação dos formatos acima</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Card com estatísticas */}
        <div className="mt-6 bg-orange-50 border border-orange-200 rounded-lg p-6">
          <div className="flex items-center text-orange-700 mb-4">
            <TrendingUp className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Estatísticas do Sistema</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">195</div>
              <div className="text-sm text-orange-600">Dias Letivos/Ano</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">41</div>
              <div className="text-sm text-orange-600">Semanas Letivas</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">8</div>
              <div className="text-sm text-orange-600">Dias de Avaliação</div>
            </div>

            <div className="text-center p-4 bg-white rounded-lg border border-orange-200">
              <div className="text-2xl font-bold text-orange-800">3</div>
              <div className="text-sm text-orange-600">Trimestres</div>
            </div>
          </div>
        </div>

        {/* Card com cronograma típico */}
        <div className="mt-6 bg-gray-50 border border-gray-200 rounded-lg p-6">
          <div className="flex items-center text-gray-700 mb-4">
            <Clock className="w-5 h-5 mr-2" />
            <h3 className="text-lg font-semibold">Cronograma Típico de Avaliações</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Período</th>
                  <th className="px-4 py-2 text-left">Tipo de Avaliação</th>
                  <th className="px-4 py-2 text-left">Classes</th>
                  <th className="px-4 py-2 text-left">Observações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-4 py-2 font-medium">Início do Ano</td>
                  <td className="px-4 py-2">Teste Diagnóstico</td>
                  <td className="px-4 py-2">Todas</td>
                  <td className="px-4 py-2">Avaliação inicial dos conhecimentos</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Nov/Dez</td>
                  <td className="px-4 py-2">Provas do I Trimestre</td>
                  <td className="px-4 py-2">Todas</td>
                  <td className="px-4 py-2">Prova do Professor + Trimestral</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Mar/Abr</td>
                  <td className="px-4 py-2">Provas do II Trimestre</td>
                  <td className="px-4 py-2">Todas</td>
                  <td className="px-4 py-2">Prova do Professor + Trimestral</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Jun/Jul</td>
                  <td className="px-4 py-2">Exames Finais</td>
                  <td className="px-4 py-2">6ª, 9ª, 12ª</td>
                  <td className="px-4 py-2">Classes de exame nacional</td>
                </tr>
                <tr>
                  <td className="px-4 py-2 font-medium">Durante o Ano</td>
                  <td className="px-4 py-2">Avaliação Nacional</td>
                  <td className="px-4 py-2">2ª, 5ª, 8ª</td>
                  <td className="px-4 py-2">Aferição da aprendizagem</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CadastroAvaliacoes;