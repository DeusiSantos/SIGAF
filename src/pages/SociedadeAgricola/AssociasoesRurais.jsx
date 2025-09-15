import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
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
  Mail,
  Activity,
  UserCheck,
  Car,
  Briefcase,
  Settings,
  Globe,
  Factory
} from 'lucide-react';

import CustomInput from '../../components/CustomInput';
import { useAssociacaoRural } from '../../hooks/useAssociacaoRural';
import axios from 'axios';
import provinciasData from '../../components/Provincias.json';

const AssociasoesRurais = () => {
  const { createAssociacaoRural, loading: loadingApi } = useAssociacaoRural();
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  // Estado inicial do formulário
  const initialState = {
    // Dados da Cooperativa
    nomeCooperativa: '',
    sigla: '',
    nif: '',
    dataFundacao: '',
    provincia: '',
    municipio: '',
    comuna: '',
    telefone: '',
    email: '',

    // Atividades da Cooperativa
    atividades: [],
    outrasAtividades: '',

    // Representantes Legais - Presidente
    nomePresidente: '',
    biPresidente: '',
    numeroProdutor: '',
    telefonePresidente: '',
    emailPresidente: '',

    // Representantes Legais - Secretário
    nomeSecretario: '',
    nifSecretario: '',
    telefoneSecretario: '',
    emailSecretario: '',

    // Quadro Social
    numeroCooperados: 0,
    perfilCooperados: [],

    // Estrutura Operacional
    numeroEmpregados: 0,
    possuiEquipamentos: false,
    equipamentosAgricolas: [],
    equipamentosInfraestrutura: [],
    materiaisProducao: [],
    ferramentasManuais: [],
    equipamentosMedicao: [],
    materiaisHigiene: [],
    materiaisEscritorio: [],
    equipamentosTransporte: [],
    equipamentosPecuarios: []
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Dados Básicos', icon: Building },
    { label: 'Actividades', icon: Activity },
    { label: 'Representantes', icon: UserCheck },
    { label: 'Associados', icon: Users },
    { label: 'Estrutura', icon: Settings },
    { label: 'Documentos', icon: FileText }
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  // Adiciona o estado para dados do NIF e carregamento
  const [nifData, setNifData] = useState(null);
  const [consultingNif, setConsultingNif] = useState(false);

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Limpar erro do campo quando alterado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }

    // Lógica para província
    if (field === 'provincia') {
      handleProvinciaChange(value);
      return;
    }
    // Chama a consulta do NIF automaticamente
    if (field === 'nif') {
      setFormData(prev => ({ ...prev, [field]: value }));
      consultarNIF(value);
      return;
    }
    // Atualização normal
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

    // Limpar erro de documento se existir
    if (errors.documentos) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors.documentos;
        return newErrors;
      });
    }
  };

  // Função para validar valores (incluindo objetos de select)
  const hasValidValue = (value) => {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (typeof value === 'object' && value.hasOwnProperty('value')) return value.value !== null && value.value !== undefined && value.value !== '';
    if (Array.isArray(value)) return value.length > 0;
    return true;
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    console.log('🔍 Validando step:', activeIndex);
    console.log('📋 FormData atual:', formData);

    switch (activeIndex) {
      case 0: // Dados Básicos
        if (!hasValidValue(formData.nomeCooperativa)) {
          newErrors.nomeCooperativa = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.nif)) {
          newErrors.nif = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.dataFundacao)) {
          newErrors.dataFundacao = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.provincia)) {
          newErrors.provincia = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.municipio)) {
          newErrors.municipio = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.telefone)) {
          newErrors.telefone = 'Campo obrigatório';
        } else {
          // Validação específica para telefone (deve ter pelo menos 9 dígitos)
          const telefoneValue = formData.telefone.replace(/\D/g, '');
          if (telefoneValue.length < 9) {
            newErrors.telefone = 'Telefone deve ter pelo menos 9 dígitos';
          }
        }
        if (!hasValidValue(formData.email)) {
          newErrors.email = 'Campo obrigatório';
        } else {
          // Validação de formato de email
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Email deve ter um formato válido';
          }
        }
        break;

      case 1: // Atividades
        if (!formData.atividades || formData.atividades.length === 0) {
          newErrors.atividades = 'Selecione pelo menos uma atividade';
        }
        // Se selecionou "OUTROS", deve especificar
        if (formData.atividades.some(ativ => (typeof ativ === 'object' ? ativ.value : ativ) === 'OUTROS')) {
          if (!hasValidValue(formData.outrasAtividades)) {
            newErrors.outrasAtividades = 'Especifique as outras atividades';
          }
        }
        break;

      case 2: // Representantes
        if (!hasValidValue(formData.nomePresidente)) {
          newErrors.nomePresidente = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.biPresidente)) {
          newErrors.biPresidente = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.nomeSecretario)) {
          newErrors.nomeSecretario = 'Campo obrigatório';
        }
        if (!hasValidValue(formData.nifSecretario)) {
          newErrors.nifSecretario = 'Campo obrigatório';
        }

        // Validações opcionais mas com formato correto
        if (formData.emailPresidente && formData.emailPresidente.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.emailPresidente)) {
            newErrors.emailPresidente = 'Email deve ter um formato válido';
          }
        }
        if (formData.emailSecretario && formData.emailSecretario.trim() !== '') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(formData.emailSecretario)) {
            newErrors.emailSecretario = 'Email deve ter um formato válido';
          }
        }
        break;

      case 3: // Cooperados
        if (!formData.numeroCooperados || formData.numeroCooperados < 1) {
          newErrors.numeroCooperados = 'Deve ter pelo menos 1 cooperado';
        }
        if (!formData.perfilCooperados || formData.perfilCooperados.length === 0) {
          newErrors.perfilCooperados = 'Selecione pelo menos um perfil';
        }
        break;

      case 4: // Estrutura Operacional
        // Validações opcionais, mas se preenchidas devem estar corretas
        if (formData.numeroEmpregados < 0) {
          newErrors.numeroEmpregados = 'Número de empregados não pode ser negativo';
        }

        // Se disse que possui equipamentos, deve selecionar pelo menos um
        if (formData.possuiEquipamentos === true) {
          const temAlgumEquipamento = [
            ...formData.equipamentosAgricolas,
            ...formData.equipamentosInfraestrutura,
            ...formData.materiaisProducao,
            ...formData.ferramentasManuais,
            ...formData.equipamentosMedicao,
            ...formData.materiaisHigiene,
            ...formData.materiaisEscritorio,
            ...formData.equipamentosTransporte,
            ...formData.equipamentosPecuarios
          ].length > 0;

          if (!temAlgumEquipamento) {
            newErrors.equipamentos = 'Se possui equipamentos, selecione pelo menos um tipo';
          }
        }
        break;

      case 5: // Documentos - validação final
        const requiredFiles = [
          'estatutoSocial', 'actaFundacao', 'listaPresenca',
          'rgCpfPresidente', 'rgCpfSecretario', 'comprovanteEndereco', 'documentoNif'
        ];
        const missingFiles = requiredFiles.filter(file => !uploadedFiles[file]);
        if (missingFiles.length > 0) {
          const fileLabels = {
            'estatutoSocial': 'Estatuto Social',
            'actaFundacao': 'Acta de Fundação',
            'listaPresenca': 'Lista de Presença',
            'rgCpfPresidente': 'RG/CPF do Presidente',
            'rgCpfSecretario': 'RG/CPF do Secretário',
            'comprovanteEndereco': 'Comprovante de Endereço',
            'documentoNif': 'Documento NIF'
          };
          const missingLabels = missingFiles.map(file => fileLabels[file]).join(', ');
          newErrors.documentos = `Documentos obrigatórios faltando: ${missingLabels}`;
        }
        break;
    }

    console.log('❌ Erros encontrados:', newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Dados Básicos
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 text-center rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex justify-center items-center text-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl  font-bold text-gray-800">Dados da Associação</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados básicos da associação agrícola ou agropecuária. Digite o NIF para consulta automática.
              </p>
            </div>

            {/* Exibir erro geral de validação se existir */}
            {Object.keys(errors).length > 0 && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    Por favor, corrija os erros nos campos destacados abaixo.
                  </p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <CustomInput
                type="text"
                label="Nome do Associado"
                value={formData.nomeCooperativa}
                onChange={(value) => handleInputChange('nomeCooperativa', value)}
                required
                errorMessage={errors.nomeCooperativa}
                placeholder="Digite o nome completo do Associado"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="text"
                label="Sigla"
                value={formData.sigla}
                onChange={(value) => handleInputChange('sigla', value)}
                placeholder="Ex: COOPAGRO"
                iconStart={<FileText size={18} />}
              />

              <CustomInput
                type="text"
                label="NIF"
                value={formData.nif}
                onChange={(value) => handleInputChange('nif', value)}
                required
                errorMessage={errors.nif}
                placeholder="Número de Identificação Fiscal"
                iconStart={<CreditCard size={18} />}
                helperText="Digite o NIF para consulta automática dos dados"
              />
              {consultingNif && (
                <div className="absolute right-3 top-9 flex items-center">
                  <Loader size={16} className="animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-blue-600">Consultando...</span>
                </div>
              )}

              <CustomInput
                type="date"
                label="Data de Fundação"
                value={formData.dataFundacao}
                onChange={(value) => handleInputChange('dataFundacao', value)}
                required
                errorMessage={errors.dataFundacao}
                iconStart={<Calendar size={18} />}
              />

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
                iconStart={<MapPin size={18} />}
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
                iconStart={<Map size={18} />}
                disabled={!formData.provincia}
              />

              <CustomInput
                type="text"
                label="Comuna"
                value={formData.comuna}
                onChange={(value) => handleInputChange('comuna', value)}
                placeholder="Nome da comuna"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="tel"
                label="Telefone"
                value={formData.telefone}
                onChange={(value) => handleInputChange('telefone', value)}
                required
                errorMessage={errors.telefone}
                placeholder="Ex: 923456789"
                iconStart={<Phone size={18} />}
                maxLength={9}
              />

              <CustomInput
                type="email"
                label="E-mail"
                value={formData.email}
                onChange={(value) => handleInputChange('email', value)}
                required
                errorMessage={errors.email}
                placeholder="Associado@exemplo.com"
                iconStart={<Mail size={18} />}
              />
            </div>

            {/* Informações do NIF consultado */}
            {nifData && (
              <div className="mt-8 bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-4 flex items-center">
                  <Info className="w-5 h-5 mr-2" />
                  Informações do NIF Consultado
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-600">Nome:</span>
                    <p className="text-gray-800">{nifData.nome_contribuinte || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estado:</span>
                    <p className="text-gray-800">
                      {nifData.estado_contribuinte === 'A' ? 'Ativo' : 'Outro'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Telefone:</span>
                    <p className="text-gray-800">{nifData.numero_contacto || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Email:</span>
                    <p className="text-gray-800">{nifData.email || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Morada:</span>
                    <p className="text-gray-800">{nifData.morada || 'N/A'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        );

      case 1: // Atividades
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Activity className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Actividades do Associado</h3>
              </div>
              <p className="text-gray-600">
                Selecione todas as actividades praticadas pela Associado.
              </p>
            </div>

            {/* Mostrar erros de validação */}
            {(errors.atividades || errors.outrasAtividades) && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    {errors.atividades && (
                      <p className="text-red-700 text-sm font-medium">{errors.atividades}</p>
                    )}
                    {errors.outrasAtividades && (
                      <p className="text-red-700 text-sm font-medium">{errors.outrasAtividades}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Wheat className="w-5 h-5 mr-2 text-blue-600" />
                Principais Actividades
              </h4>

              <CustomInput
                type="multiselect"
                value={formData.atividades}
                options={[
                  { label: 'Produção Agrícola', value: 'PRODUCAO_AGRICOLA' },
                  { label: 'Produção Pecuária', value: 'PRODUCAO_PECUARIA' },
                  { label: 'Agroindústria', value: 'AGROINDUSTRIA' },
                  { label: 'Comercialização', value: 'COMERCIALIZACAO' },
                  { label: 'Assistência Técnica', value: 'ASSISTENCIA_TECNICA' },
                  { label: 'Outros', value: 'OUTROS' }
                ]}
                onChange={(value) => handleInputChange('atividades', value)}
                errorMessage={errors.atividades}
              />

              {formData.atividades.some(ativ => (typeof ativ === 'object' ? ativ.value : ativ) === 'OUTROS') && (
                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Especificar Outras Actividades"
                    value={formData.outrasAtividades}
                    onChange={(value) => handleInputChange('outrasAtividades', value)}
                    placeholder="Descreva outras atividades praticadas pelo Associado..."
                    rows={3}
                    required
                    errorMessage={errors.outrasAtividades}
                  />
                </div>
              )}
            </div>
          </div>
        );

      case 2: // Representantes
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <UserCheck className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Representantes Legais</h3>
              </div>
              <p className="text-gray-600">
                Informações dos principais representantes do Associado.
              </p>
            </div>

            {/* Mostrar erros de validação */}
            {Object.keys(errors).some(key => key.includes('Presidente') || key.includes('Secretario')) && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">
                    Por favor, corrija os erros nos dados dos representantes.
                  </p>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Presidente */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Presidente
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.nomePresidente}
                      onChange={(value) => handleInputChange('nomePresidente', value)}
                      required
                      errorMessage={errors.nomePresidente}
                      placeholder="Nome completo do presidente"
                      iconStart={<User size={18} />}
                    />
                  </div>

                  <CustomInput
                    type="text"
                    label="Número do BI"
                    value={formData.biPresidente}
                    onChange={(value) => handleInputChange('biPresidente', value)}
                    required
                    errorMessage={errors.biPresidente}
                    placeholder="Número do bilhete de identidade"
                    iconStart={<CreditCard size={18} />}
                  />

                  <CustomInput
                    type="text"
                    label="Número de Produtor"
                    value={formData.numeroProdutor}
                    onChange={(value) => handleInputChange('numeroProdutor', value)}
                    placeholder="Número do produtor no RNPA"
                    iconStart={<CreditCard size={18} />}
                  />
                  <CustomInput
                    type="tel"
                    label="Telefone"
                    value={formData.telefonePresidente}
                    onChange={(value) => {
                      // Permite apenas números e limita a 9 dígitos
                      const onlyNumbers = value.replace(/\D/g, '').slice(0, 9);
                      handleInputChange('telefonePresidente', onlyNumbers);
                    }}
                    placeholder="Ex: 923456789"
                    iconStart={<Phone size={18} />}
                    maxLength={9}
                  />

                  <CustomInput
                    type="email"
                    label="E-mail"
                    value={formData.emailPresidente}
                    onChange={(value) => handleInputChange('emailPresidente', value)}
                    placeholder="presidente@associação.com"
                    iconStart={<Mail size={18} />}
                    errorMessage={errors.emailPresidente}
                  />
                </div>
              </div>

              {/* Secretário */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Secretário(a)
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.nomeSecretario}
                      onChange={(value) => handleInputChange('nomeSecretario', value)}
                      required
                      errorMessage={errors.nomeSecretario}
                      placeholder="Nome completo do secretário"
                      iconStart={<User size={18} />}
                    />
                  </div>

                  <CustomInput
                    type="text"
                    label="NÚmero do BI"
                    value={formData.nifSecretario}
                    onChange={(value) => handleInputChange('nifSecretario', value)}
                    required
                    errorMessage={errors.nifSecretario}
                    placeholder="Número do bilhete de identidade"
                    iconStart={<CreditCard size={18} />}
                  />

                  <CustomInput
                    type="tel"
                    label="Telefone"
                    value={formData.telefoneSecretario}
                    onChange={(value) => {
                      // Permite apenas números e limita a 9 dígitos
                      const onlyNumbers = value.replace(/\D/g, '').slice(0, 9);
                      handleInputChange('telefoneSecretario', onlyNumbers);
                    }}
                    placeholder="Ex: 923456789"
                    iconStart={<Phone size={18} />}
                    maxLength={9}
                  />

                  <CustomInput
                    type="email"
                    label="E-mail"
                    value={formData.emailSecretario}
                    onChange={(value) => handleInputChange('emailSecretario', value)}
                    placeholder="secretaria@assoviacao.com"
                    iconStart={<Mail size={18} />}
                    errorMessage={errors.emailSecretario}
                  />
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Cooperados
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Quadro Social</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre os cooperados da entidade associativa.
              </p>
            </div>

            {/* Mostrar erros de validação */}
            {(errors.numeroCooperados || errors.perfilCooperados) && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    {errors.numeroCooperados && (
                      <p className="text-red-700 text-sm font-medium">{errors.numeroCooperados}</p>
                    )}
                    {errors.perfilCooperados && (
                      <p className="text-red-700 text-sm font-medium">{errors.perfilCooperados}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                Composição da Associação
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="number"
                  label="Número de Cooperados"
                  value={formData.numeroCooperados}
                  onChange={(value) => handleInputChange('numeroCooperados', parseInt(value) || 0)}
                  required
                  errorMessage={errors.numeroCooperados}
                  placeholder="Quantidade total de cooperados"
                  iconStart={<Users size={18} />}
                  min="1"
                />

                <CustomInput
                  type="multiselect"
                  label="Perfil dos Cooperados"
                  value={formData.perfilCooperados || []}
                  options={[
                    { label: 'Agricultores Familiares', value: 'AGRICULTORES_FAMILIARES' },
                    { label: 'Produtores Rurais', value: 'PRODUTORES_RURAIS' },
                    { label: 'Outros', value: 'OUTROS' }
                  ]}
                  onChange={(value) => handleInputChange('perfilCooperados', value)}
                  required
                  errorMessage={errors.perfilCooperados}
                  placeholder="Selecione o perfil dos cooperados"
                />

                {Array.isArray(formData.perfilCooperados) && formData.perfilCooperados.some(perfil => (typeof perfil === 'object' ? perfil.value : perfil) === 'OUTROS') && (
                  <CustomInput
                    type="textarea"
                    label="Descreva o perfil dos cooperados (Outros)"
                    value={formData.perfilCooperadosDescricao || ''}
                    onChange={(value) => handleInputChange('perfilCooperadosDescricao', value)}
                    placeholder="Descreva o perfil personalizado dos cooperados..."
                    rows={3}
                  />
                )}
              </div>
            </div>
          </div>
        );

      case 4: // Estrutura
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-teal-50 to-cyan-50 rounded-2xl p-6 mb-8 border border-teal-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-teal-100 rounded-lg">
                  <Settings className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Estrutura Operacional</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre funcionários, equipamentos e infraestrutura do Associado.
              </p>
            </div>

            {/* Mostrar erros de validação */}
            {(errors.numeroEmpregados || errors.equipamentos) && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <div>
                    {errors.numeroEmpregados && (
                      <p className="text-red-700 text-sm font-medium">{errors.numeroEmpregados}</p>
                    )}
                    {errors.equipamentos && (
                      <p className="text-red-700 text-sm font-medium">{errors.equipamentos}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-8">
              {/* Recursos Humanos */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-teal-600" />
                  Recursos Humanos
                </h4>
                <CustomInput
                  type="number"
                  label="Número de Empregados"
                  value={formData.numeroEmpregados}
                  onChange={(value) => handleInputChange('numeroEmpregados', parseInt(value) || 0)}
                  placeholder="Quantidade de funcionários"
                  iconStart={<Users size={18} />}
                  min="0"
                  helperText="Inclui funcionários permanentes e temporários"
                  errorMessage={errors.numeroEmpregados}
                />
              </div>

              {/* Equipamentos */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Tractor className="w-5 h-5 mr-2 text-teal-600" />
                  Equipamentos e Máquinas
                </h4>

                <div className="mb-6">
                  <CustomInput
                    type="select"
                    label="Possui equipamentos/máquinas principais?"
                    value={formData.possuiEquipamentos}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('possuiEquipamentos', value)}
                    placeholder="Selecione uma opção"
                  />
                </div>

                {formData.possuiEquipamentos && (
                  <div className="space-y-8">
                    {/* Equipamentos Agrícolas */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-4">1. Equipamentos Agrícolas</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.equipamentosAgricolas}
                        options={[
                          { label: 'Tratores', value: 'TRATORES' },
                          { label: 'Enxadas rotativas (grade aradora, grade niveladora)', value: 'ENXADAS_ROTATIVAS' },
                          { label: 'Plantadeiras/semeadoras', value: 'PLANTADEIRAS' },
                          { label: 'Pulverizadores', value: 'PULVERIZADORES' },
                          { label: 'Colheitadeiras', value: 'COLHEITADEIRAS' },
                          { label: 'Roçadeiras', value: 'ROCADEIRAS' },
                          { label: 'Arados', value: 'ARADOS' },
                          { label: 'Carretas agrícolas', value: 'CARRETAS_AGRICOLAS' },
                          { label: 'Ensiladeiras', value: 'ENSILADEIRAS' }
                        ]}
                        onChange={(value) => handleInputChange('equipamentosAgricolas', value)}
                      />
                    </div>

                    {/* Equipamentos de Infraestrutura */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-4">2. Equipamentos de Infraestrutura</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.equipamentosInfraestrutura}
                        options={[
                          { label: 'Sistemas de irrigação (aspersores, gotejamento)', value: 'SISTEMAS_IRRIGACAO' },
                          { label: 'Bombas d\'água', value: 'BOMBAS_AGUA' },
                          { label: 'Caixa d\'água/reservatórios', value: 'RESERVATORIOS' },
                          { label: 'Estufas/túneis plásticos', value: 'ESTUFAS' },
                          { label: 'Galpões de armazenamento', value: 'GALPOES' },
                          { label: 'Silos para grãos', value: 'SILOS' },
                          { label: 'Tanques de leite', value: 'TANQUES_LEITE' }
                        ]}
                        onChange={(value) => handleInputChange('equipamentosInfraestrutura', value)}
                      />
                    </div>

                    {/* Materiais de Produção */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h5 className="font-semibold text-yellow-800 mb-4">3. Materiais de Produção</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.materiaisProducao}
                        options={[
                          { label: 'Sementes certificadas', value: 'SEMENTES' },
                          { label: 'Mudas', value: 'MUDAS' },
                          { label: 'Fertilizantes', value: 'FERTILIZANTES' },
                          { label: 'Corretivos (calcário, gesso agrícola)', value: 'CORRETIVOS' },
                          { label: 'Adubos orgânicos', value: 'ADUBOS_ORGANICOS' },
                          { label: 'Defensivos agrícolas', value: 'DEFENSIVOS' },
                          { label: 'Ração animal', value: 'RACAO_ANIMAL' }
                        ]}
                        onChange={(value) => handleInputChange('materiaisProducao', value)}
                      />
                    </div>

                    {/* Ferramentas Manuais */}
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <h5 className="font-semibold text-purple-800 mb-4">4. Ferramentas Manuais</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.ferramentasManuais}
                        options={[
                          { label: 'Enxadas', value: 'ENXADAS' },
                          { label: 'Foices', value: 'FOICES' },
                          { label: 'Facões', value: 'FACOES' },
                          { label: 'Picaretas', value: 'PICARETAS' },
                          { label: 'Cavadeiras', value: 'CAVADEIRAS' },
                          { label: 'Pá e enxadão', value: 'PA_ENXADAO' },
                          { label: 'Regadores', value: 'REGADORES' }
                        ]}
                        onChange={(value) => handleInputChange('ferramentasManuais', value)}
                      />
                    </div>

                    {/* Equipamentos de Medição */}
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                      <h5 className="font-semibold text-indigo-800 mb-4">5. Equipamentos de Medição e Controle</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.equipamentosMedicao}
                        options={[
                          { label: 'Balanças (analógicas e digitais)', value: 'BALANCAS' },
                          { label: 'Medidores de humidade do solo e de grãos', value: 'MEDIDORES_UMIDADE' },
                          { label: 'Medidores de pH', value: 'MEDIDORES_PH' },
                          { label: 'Estações meteorológicas simples', value: 'ESTACOES_METEOROLOGICAS' },
                          { label: 'GPS agrícola', value: 'GPS_AGRICOLA' }
                        ]}
                        onChange={(value) => handleInputChange('equipamentosMedicao', value)}
                      />
                    </div>

                    {/* Materiais de Higiene */}
                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                      <h5 className="font-semibold text-pink-800 mb-4">6. Materiais para Higiene e Segurança</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.materiaisHigiene}
                        options={[
                          { label: 'EPIs (luvas, botas, óculos, máscaras)', value: 'EPIS' },
                          { label: 'Produtos de limpeza e higienização', value: 'PRODUTOS_LIMPEZA' },
                          { label: 'Kit de primeiros socorros', value: 'KIT_PRIMEIROS_SOCORROS' }
                        ]}
                        onChange={(value) => handleInputChange('materiaisHigiene', value)}
                      />
                    </div>

                    {/* Materiais de Escritório */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-4">7. Materiais de Escritório/Administração</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.materiaisEscritorio}
                        options={[
                          { label: 'Computadores', value: 'COMPUTADORES' },
                          { label: 'Impressoras', value: 'IMPRESSORAS' },
                          { label: 'Materiais de papelaria', value: 'PAPELARIA' },
                          { label: 'Softwares de gestão agrícola', value: 'SOFTWARES' },
                          { label: 'Quadros de controle', value: 'QUADROS_CONTROLE' }
                        ]}
                        onChange={(value) => handleInputChange('materiaisEscritorio', value)}
                      />
                    </div>

                    {/* Equipamentos de Transporte */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-4">8. Equipamentos de Transporte e Logística</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.equipamentosTransporte}
                        options={[
                          { label: 'Caminhões ou tratores com carroceria', value: 'CAMINHOES' },
                          { label: 'Carros utilitários', value: 'CARROS_UTILITARIOS' },
                          { label: 'Carretas agrícolas', value: 'CARRETAS' },
                          { label: 'Cargas paletizadas, caixas e bombonas', value: 'CARGAS_PALETIZADAS' }
                        ]}
                        onChange={(value) => handleInputChange('equipamentosTransporte', value)}
                      />
                    </div>

                    {/* Equipamentos Pecuários */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-4">9. Equipamentos Pecuários</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.equipamentosPecuarios}
                        options={[
                          { label: 'Ordenhadeiras', value: 'ORDENHADEIRAS' },
                          { label: 'Bebedouros automáticos', value: 'BEBEDOUROS' },
                          { label: 'Comedouros', value: 'COMEDOUROS' },
                          { label: 'Cercas elétricas', value: 'CERCAS_ELETRICAS' },
                          { label: 'Aparelhos de inseminação artificial', value: 'APARELHOS_INSEMINACAO' },
                          { label: 'Cochos', value: 'COCHOS' }
                        ]}
                        onChange={(value) => handleInputChange('equipamentosPecuarios', value)}
                      />
                    </div>
                  </div>
                )}

                {/* Mostrar erro se disse que possui equipamentos mas não selecionou nenhum */}
                {errors.equipamentos && (
                  <div className="mt-4 p-3 bg-red-50 rounded-lg border border-red-200">
                    <p className="text-red-700 text-sm">{errors.equipamentos}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 5: // Documentos
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <FileText className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Documentos Obrigatórios</h3>
              </div>
              <p className="text-gray-600">
                Faça o upload dos documentos necessários para completar o registro do Associado.
              </p>
            </div>

            <div className="mb-8 p-4 bg-amber-50 border-l-4 border-amber-400 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5" />
                <div className="ml-3">
                  <p className="text-sm text-amber-700 font-medium">
                    <strong>Documentos obrigatórios:</strong> Estatuto Social, Acta de Fundação, Lista de Presença, RG e CPF dos Representantes, Comprovante de Endereço e NIF
                  </p>
                </div>
              </div>
            </div>

            {/* Mostrar erro de documentos */}
            {errors.documentos && (
              <div className="mb-6 p-4 bg-red-50 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
                  <p className="text-red-700 text-sm font-medium">{errors.documentos}</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Estatuto Social */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Estatuto Social *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('estatutoSocial', e.target.files[0])}
                    id="estatuto-upload"
                  />
                  <label
                    htmlFor="estatuto-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.estatutoSocial
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <FileText className={`w-8 h-8 mb-3 ${uploadedFiles.estatutoSocial ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.estatutoSocial ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.estatutoSocial ? 'Arquivo carregado' : 'Carregar Estatuto'}
                    </p>
                    {uploadedFiles.estatutoSocial && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.estatutoSocial.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Acta de Fundação */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Acta de Fundação *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={(e) => handleFileUpload('actaFundacao', e.target.files[0])}
                    id="acta-upload"
                  />
                  <label
                    htmlFor="acta-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.actaFundacao
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <FileText className={`w-8 h-8 mb-3 ${uploadedFiles.actaFundacao ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.actaFundacao ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.actaFundacao ? 'Arquivo carregado' : 'Carregar Acta'}
                    </p>
                    {uploadedFiles.actaFundacao && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.actaFundacao.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Lista de Presença */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Lista de Presença da Assembleia *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('listaPresenca', e.target.files[0])}
                    id="lista-upload"
                  />
                  <label
                    htmlFor="lista-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.listaPresenca
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Users className={`w-8 h-8 mb-3 ${uploadedFiles.listaPresenca ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.listaPresenca ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.listaPresenca ? 'Arquivo carregado' : 'Carregar Lista'}
                    </p>
                    {uploadedFiles.listaPresenca && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.listaPresenca.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* RG e CPF Presidente */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  RG e CPF do Presidente *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('rgCpfPresidente', e.target.files[0])}
                    id="rg-presidente-upload"
                  />
                  <label
                    htmlFor="rg-presidente-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.rgCpfPresidente
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${uploadedFiles.rgCpfPresidente ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.rgCpfPresidente ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.rgCpfPresidente ? 'Documento carregado' : 'Carregar RG/CPF'}
                    </p>
                    {uploadedFiles.rgCpfPresidente && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.rgCpfPresidente.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* RG e CPF Secretário */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  RG e CPF do Secretário *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('rgCpfSecretario', e.target.files[0])}
                    id="rg-secretario-upload"
                  />
                  <label
                    htmlFor="rg-secretario-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.rgCpfSecretario
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${uploadedFiles.rgCpfSecretario ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.rgCpfSecretario ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.rgCpfSecretario ? 'Documento carregado' : 'Carregar RG/CPF'}
                    </p>
                    {uploadedFiles.rgCpfSecretario && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.rgCpfSecretario.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Comprovante de Endereço */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Comprovante de Endereço da Sede *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('comprovanteEndereco', e.target.files[0])}
                    id="endereco-upload"
                  />
                  <label
                    htmlFor="endereco-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.comprovanteEndereco
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <Home className={`w-8 h-8 mb-3 ${uploadedFiles.comprovanteEndereco ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.comprovanteEndereco ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.comprovanteEndereco ? 'Documento carregado' : 'Carregar Comprovante'}
                    </p>
                    {uploadedFiles.comprovanteEndereco && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.comprovanteEndereco.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* NIF */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Documento NIF *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('documentoNif', e.target.files[0])}
                    id="nif-upload"
                  />
                  <label
                    htmlFor="nif-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.documentoNif
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${uploadedFiles.documentoNif ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.documentoNif ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.documentoNif ? 'Documento carregado' : 'Carregar NIF'}
                    </p>
                    {uploadedFiles.documentoNif && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.documentoNif.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* Outros Documentos */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  Outros Documentos
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                    multiple
                    onChange={(e) => handleFileUpload('outrosDocumentos', e.target.files[0])}
                    id="outros-upload"
                  />
                  <label
                    htmlFor="outros-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.outrosDocumentos
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <FileText className={`w-8 h-8 mb-3 ${uploadedFiles.outrosDocumentos ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.outrosDocumentos ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.outrosDocumentos ? 'Arquivos carregados' : 'Carregar outros docs'}
                    </p>
                    {uploadedFiles.outrosDocumentos && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.outrosDocumentos.name}</p>
                    )}
                  </label>
                </div>
              </div>
            </div>

            {/* Status dos documentos obrigatórios */}
            <div className="mt-8 bg-white rounded-2xl border border-gray-200 p-6">
              <h5 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <CheckCircle className="w-5 h-5 mr-2 text-blue-600" />
                Verificação de Documentos
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { key: 'estatutoSocial', label: 'Estatuto Social' },
                  { key: 'actaFundacao', label: 'Acta de Fundação' },
                  { key: 'listaPresenca', label: 'Lista de Presença' },
                  { key: 'rgCpfPresidente', label: 'RG/CPF Presidente' },
                  { key: 'rgCpfSecretario', label: 'RG/CPF Secretário' },
                  { key: 'comprovanteEndereco', label: 'Comprovante Endereço' },
                  { key: 'documentoNif', label: 'Documento NIF' }
                ].map(doc => (
                  <div key={doc.key} className="flex items-center space-x-3">
                    {uploadedFiles[doc.key] ? (
                      <CheckCircle className="w-5 h-5 text-blue-500" />
                    ) : (
                      <AlertCircle className="w-5 h-5 text-red-500" />
                    )}
                    <span className={`text-sm font-medium ${uploadedFiles[doc.key] ? 'text-blue-700' : 'text-red-700'}`}>
                      {doc.label} {uploadedFiles[doc.key] ? '(Carregado)' : '(Obrigatório)'}
                    </span>
                  </div>
                ))}
              </div>

              {isAllRequiredFilesUploaded() && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-blue-600 mr-2" />
                    <p className="text-blue-700 text-sm font-medium">
                      Todos os documentos obrigatórios foram carregados. Você pode prosseguir com o registro.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      default:
        return <div className="text-center text-gray-500">Etapa não encontrada</div>;
    }
  };

  const isLastStep = activeIndex === steps.length - 1;
  const isAllRequiredFilesUploaded = () => {
    const requiredFiles = [
      'estatutoSocial', 'actaFundacao', 'listaPresenca',
      'rgCpfPresidente', 'rgCpfSecretario', 'comprovanteEndereco', 'documentoNif'
    ];
    return requiredFiles.every(file => uploadedFiles[file]);
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
          nomeCooperativa: nifInfo.nome_contribuinte || '',
          email: nifInfo.email || '',
          telefone: nifInfo.numero_contacto || '',
          dataFundacao: nifInfo.data_constituicao ? new Date(nifInfo.data_constituicao).toISOString().split('T')[0] : '',
          provincia: nifInfo.provincia_morada ? {
            label: nifInfo.provincia_morada,
            value: nifInfo.provincia_morada.toUpperCase()
          } : '',
          municipio: nifInfo.municipio_morada ? {
            label: nifInfo.municipio_morada,
            value: nifInfo.municipio_morada
          } : '',
          comuna: nifInfo.comuna_morada || '',
        }));
        showToast('success', 'NIF Consultado', 'Dados da Associaçao preenchidos automaticamente!');
      } else {
        setNifData(null);
        if (data.code === 404) {
          showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF. Preencha manualmente.');
        } else {
          showToast('warn', 'NIF inválido', 'Este NIF não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      setNifData(null);
      if (error.response) {
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
      } else if (error.request) {
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
      }
    } finally {
      setConsultingNif(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Montar objeto no formato esperado pela API
      const dataToSend = {
        command: "createAssociacaoRural",
        nomeCooperativa: formData.nomeCooperativa,
        sigla: formData.sigla,
        nif: formData.nif,
        dataFundacao: formData.dataFundacao
          ? new Date(formData.dataFundacao).toISOString().split('T')[0]
          : '',
        provincia: typeof formData.provincia === 'object' ? formData.provincia.value : formData.provincia,
        municipio: typeof formData.municipio === 'object' ? formData.municipio.value : formData.municipio,
        comuna: formData.comuna,
        telefone: formData.telefone,
        email: formData.email,
        atividades: formData.atividades.map(a => typeof a === 'string' ? a : a.value),
        outrasAtividades: formData.outrasAtividades || null,
        nomePresidente: formData.nomePresidente,
        biPresidente: formData.biPresidente,
        numeroProdutor: String(formData.numeroProdutor),
        telefonePresidente: formData.telefonePresidente,
        emailPresidente: formData.emailPresidente,
        nomeSecretario: formData.nomeSecretario,
        nifSecretario: formData.nifSecretario,
        telefoneSecretario: formData.telefoneSecretario,
        emailSecretario: formData.emailSecretario,
        numeroCooperados: String(formData.numeroCooperados),

        // 🔧 Aqui está a correção:
        perfilCooperados: Array.isArray(formData.perfilCooperados)
          ? formData.perfilCooperados.map(p => typeof p === 'string' ? p : p.value).join(', ')
          : (typeof formData.perfilCooperados === 'object' ? formData.perfilCooperados.value : formData.perfilCooperados),

        numeroEmpregados: String(formData.numeroEmpregados),
        possuiEquipamentos: formData.possuiEquipamentos ? "true" : "false",
        equipamentosAgricolas: formData.equipamentosAgricolas.map(a => typeof a === 'string' ? a : a.value),
        equipamentosInfraestrutura: formData.equipamentosInfraestrutura.map(a => typeof a === 'string' ? a : a.value),
        materiaisProducao: formData.materiaisProducao.map(a => typeof a === 'string' ? a : a.value),
        ferramentasManuais: formData.ferramentasManuais.map(a => typeof a === 'string' ? a : a.value),
        equipamentosMedicao: formData.equipamentosMedicao.map(a => typeof a === 'string' ? a : a.value),
        materiaisHigiene: formData.materiaisHigiene.map(a => typeof a === 'string' ? a : a.value),
        materiaisEscritorio: formData.materiaisEscritorio.map(a => typeof a === 'string' ? a : a.value),
        equipamentosTransporte: formData.equipamentosTransporte.map(a => typeof a === 'string' ? a : a.value),
        equipamentosPecuarios: formData.equipamentosPecuarios.map(a => typeof a === 'string' ? a : a.value),

        // Se a API exige o campo 'estado', inclua:
        estado: "Ativo"
      };

      console.log('Enviando para API:', dataToSend);
      const response = await createAssociacaoRural(dataToSend);
      console.log('Resposta da API:', response);

      setLoading(false);
      showToast('success', 'Sucesso', 'Associado registrada com sucesso!');

      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});
      setNifData(null);
    } catch (error) {
      setLoading(false);
      console.error('Erro ao registrar associado:', error);
      if (error?.response?.data) {
        console.log('Detalhe do erro da API:', error.response.data);
      }
      let msg = 'Erro ao registrar associado. Tente novamente.';
      if (error?.response?.data?.message) {
        msg = error.response.data.message;
      } else if (error?.message) {
        msg = error.message;
      }
      showToast('error', 'Erro', msg);
    }
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

      <div className="">
        <div className="">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-blue-50 to-emerald-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Registro de Associado</h1>
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
                ? isAllRequiredFilesUploaded()
                  ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                  : 'bg-gray-300 cursor-not-allowed text-gray-600'
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                }`}
              disabled={(isLastStep && !isAllRequiredFilesUploaded()) || loading}
              onClick={(e) => {
                e.preventDefault();
                if (!isLastStep) {
                  // Validar etapa atual antes de avançar
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
                  // Validação final antes do envio
                  const isFormValid = validateCurrentStep();
                  const hasAllFiles = isAllRequiredFilesUploaded();

                  if (isFormValid && hasAllFiles) {
                    handleSubmit(e);
                  } else {
                    let errorMsg = 'Por favor, complete todos os campos obrigatórios';
                    if (!hasAllFiles) {
                      errorMsg += ' e anexe todos os documentos necessários';
                    }
                    errorMsg += '.';
                    showToast('error', 'Erro', errorMsg);
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
                  Registrar Associado
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

export default AssociasoesRurais;