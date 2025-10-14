import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import {
  Activity,
  AlertCircle,
  Briefcase,
  Building,
  Calendar,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Home,
  Info,
  Loader,
  Mail,
  Map,
  MapPin,
  Phone,
  Settings,
  Tractor,
  User,
  UserCheck,
  Users,
  Wheat
} from 'lucide-react';
import React, { useState } from 'react';


import CustomInput from '../../../../../core/components/CustomInput';
import provinciasData from '../../../../../core/components/Provincias.json';

const CadastroEmpresas = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [consultingNif, setConsultingNif] = useState(false);
  const [nifData, setNifData] = useState(null);
  const [consultingBI, setConsultingBI] = useState(false);
  const [consultingBIGerente, setConsultingBIGerente] = useState(false);
  const [biData, setBiData] = useState(null);
  const [biGerenteData, setBiGerenteData] = useState(null);

  // Estado inicial do formulário
  const initialState = {
    TipoDeEntidade: "EmpresaAgricola",
    // Dados da Empresa
    NomeEntidade: '',
    Sigla: '',
    NIF: '',
    DataFundacao: '',
    Provincia: '',
    Municipio: '',
    Comuna: '',
    Telefone: '',
    Email: '',

    // Atividades da Empresa
    Atividades: [],
    OutrasAtividades: '',

    // Representantes Legais - Diretor Geral
    NomePresidente: '',
    BIPresidente: '',
    NumeroProdutor: '',
    TelefonePresidente: '',
    EmailPresidente: '',

    // Representantes Legais - Gerente
    NomeSecretarioOuGerente: '',
    BISecretarioOuGerente: '',
    TelefoneSecretarioOuGerente: '',
    EmailSecretarioOuGerente: '',

    // Quadro Social
    NumeroCooperados: 0,
    PerfilCooperados: '',

    // Estrutura Operacional
    NumeroEmpregados: 0,
    PossuiEquipamentos: false,
    EquipamentosAgricolas: [],
    EquipamentosInfraestrutura: [],
    MateriaisProducao: [],
    FerramentasManuais: [],
    EquipamentosMedicao: [],
    MateriaisHigiene: [],
    MateriaisEscritorio: [],
    EquipamentosTransporte: [],
    EquipamentosPecuarios: []
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Dados Básicos', icon: Building },
    { label: 'Actividades', icon: Activity },
    { label: 'Representantes', icon: UserCheck },
    { label: 'Funcionários', icon: Users },
    { label: 'Estrutura', icon: Settings },
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

      // Codificar credenciais em base64 para Basic Auth
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

      console.log('📊 Resposta completa da API:', response);
      console.log('📋 Dados retornados da API:', response.data);
      console.log('🔍 Status da resposta:', response.status);
      console.log('📄 Headers da resposta:', response.headers);

      const data = response.data;

      if (response.status === 200 && data.code === 200 && data.data) {
        const nifInfo = data.data;

        console.log('✅ Dados do NIF processados:', nifInfo);

        // Salvar dados do NIF para exibição
        setNifData(nifInfo);

        // Preencher automaticamente os campos do formulário
        setFormData(prev => ({
          ...prev,
          NomeEntidade: nifInfo.nome_contribuinte || '',
          Email: nifInfo.email || '',
          Telefone: nifInfo.numero_contacto || '',
          DataFundacao: nifInfo.data_constituicao ? new Date(nifInfo.data_constituicao).getFullYear().toString() : '',
          Provincia: nifInfo.provincia_morada ? {
            label: nifInfo.provincia_morada,
            value: nifInfo.provincia_morada.toUpperCase()
          } : '',
          Municipio: nifInfo.municipio_morada ? {
            label: nifInfo.municipio_morada,
            value: nifInfo.municipio_morada
          } : '',
          Comuna: nifInfo.comuna_morada || '',
        }));

        // Atualizar municípios se província foi preenchida
        if (nifInfo.provincia_morada) {
          handleProvinciaChange({
            label: nifInfo.provincia_morada,
            value: nifInfo.provincia_morada.toUpperCase()
          });
        }

        showToast('success', 'NIF Consultado', 'Dados da empresa preenchidos automaticamente!');

      } else {
        console.log('⚠️ NIF não encontrado ou resposta inválida:', data);
        setNifData(null);
        if (data.code === 404) {
          showToast('warn', 'NIF não encontrado', 'Não foi possível encontrar dados para este NIF. Preencha manualmente.');
        } else {
          showToast('warn', 'NIF inválido', 'Este NIF não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao consultar NIF:', error);
      console.error('📄 Detalhes do erro:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });

      setNifData(null);

      if (error.response) {
        // O servidor respondeu com um status de erro
        console.error('🚫 Erro de resposta do servidor:', error.response.status, error.response.data);
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do NIF'}`);
      } else if (error.request) {
        // A requisição foi feita mas não houve resposta
        console.error('🌐 Erro de rede - sem resposta:', error.request);
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        // Algo aconteceu na configuração da requisição
        console.error('⚙️ Erro na configuração:', error.message);
        showToast('error', 'Erro na consulta', 'Erro ao consultar NIF. Tente novamente.');
      }
    } finally {
      setConsultingNif(false);
    }
  };

  // Função para consultar BI na API - Diretor
  const consultarBI = async (biValue) => {
    if (!biValue || biValue.length < 9) return;

    setConsultingBI(true);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      const response = await axios.get(`https://api.gov.ao/bi/v1/getBI`, {
        params: { bi: biValue },
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Resposta BI Diretor:', response.data);

      const data = response.data;
      if (response.status === 200 && data.code === 200 && data.data) {
        const biInfo = data.data;
        setBiData(biInfo);

        // Construir nome completo
        const nomeCompleto = `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim();

        // Buscar contacto em diferentes campos possíveis
        const contacto = biInfo.phone || biInfo.telefone || biInfo.contacto || biInfo.mobile || biInfo.celular || '';

        // Buscar email em diferentes campos possíveis
        const email = biInfo.email || biInfo.email_address || biInfo.correio_eletronico || '';

        // Preencher campos automaticamente
        setFormData(prev => ({
          ...prev,
          NomePresidente: nomeCompleto,
          TelefonePresidente: contacto,
          EmailPresidente: email
        }));

        showToast('success', 'BI Consultado', 'Dados do diretor preenchidos automaticamente!');
      } else {
        setBiData(null);
        if (data.code === 404) {
          showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI.');
        } else {
          showToast('warn', 'BI inválido', 'Este BI não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao consultar BI do Diretor:', error);
      setBiData(null);

      if (error.response) {
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do BI'}`);
      } else if (error.request) {
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Tente novamente.');
      }
    } finally {
      setConsultingBI(false);
    }
  };

  // Função para consultar BI do Gerente na API
  const consultarBIGerente = async (biValue) => {
    if (!biValue || biValue.length < 9) return;

    setConsultingBIGerente(true);

    try {
      const username = 'minagrif';
      const password = 'Nz#$20!23Mg';
      const credentials = btoa(`${username}:${password}`);

      const response = await axios.get(`https://api.gov.ao/bi/v1/getBI`, {
        params: { bi: biValue },
        headers: {
          'Authorization': `Basic ${credentials}`,
          'Content-Type': 'application/json',
        },
      });

      console.log('📊 Resposta BI Gerente:', response.data);

      const data = response.data;
      if (response.status === 200 && data.code === 200 && data.data) {
        const biInfo = data.data;
        setBiGerenteData(biInfo);

        // Construir nome completo
        const nomeCompleto = `${biInfo.first_name || ''} ${biInfo.last_name || ''}`.trim();

        // Buscar contacto em diferentes campos possíveis
        const contacto = biInfo.phone || biInfo.telefone || biInfo.contacto || biInfo.mobile || biInfo.celular || '';

        // Buscar email em diferentes campos possíveis
        const email = biInfo.email || biInfo.email_address || biInfo.correio_eletronico || '';

        // Preencher campos automaticamente
        setFormData(prev => ({
          ...prev,
          NomeSecretarioOuGerente: nomeCompleto,
          TelefoneSecretarioOuGerente: contacto,
          EmailSecretarioOuGerente: email
        }));

        showToast('success', 'BI Consultado', 'Dados do gerente preenchidos automaticamente!');
      } else {
        setBiGerenteData(null);
        if (data.code === 404) {
          showToast('warn', 'BI não encontrado', 'Não foi possível encontrar dados para este BI.');
        } else {
          showToast('warn', 'BI inválido', 'Este BI não retornou dados válidos. Verifique o número.');
        }
      }
    } catch (error) {
      console.error('❌ Erro ao consultar BI do Gerente:', error);
      setBiGerenteData(null);

      if (error.response) {
        showToast('error', 'Erro do servidor', `Erro ${error.response.status}: ${error.response.data?.message || 'Erro na consulta do BI'}`);
      } else if (error.request) {
        showToast('error', 'Erro de conexão', 'Não foi possível conectar ao servidor. Verifique sua conexão.');
      } else {
        showToast('error', 'Erro na consulta', 'Erro ao consultar BI. Tente novamente.');
      }
    } finally {
      setConsultingBIGerente(false);
    }
  };

  // Debounce para consulta do NIF
  const debounceTimer = React.useRef(null);
  const biDebounceTimer = React.useRef(null);
  const biGerenteDebounceTimer = React.useRef(null);

  const handleNifChange = (value) => {
    setFormData(prev => ({ ...prev, NIF: value }));
    setTouched(prev => ({ ...prev, NIF: true }));

    // Limpar timer anterior
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Configurar novo timer para consulta após 1.5 segundos
    debounceTimer.current = setTimeout(() => {
      if (value && value.length >= 9) {
        consultarNIF(value);
      }
    }, 1500);
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));

    // Lógica para província
    if (field === 'Provincia') {
      handleProvinciaChange(value);
      return;
    }

    // Atualização normal
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleProvinciaChange = (value) => {
    setFormData(prev => ({ ...prev, Provincia: value, Municipio: '' }));

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
        if (!formData.NomeEntidade) newErrors.NomeEntidade = 'Campo obrigatório';
        if (!formData.NIF) newErrors.NIF = 'Campo obrigatório';
        if (!formData.DataFundacao) newErrors.DataFundacao = 'Campo obrigatório';
        if (!formData.Provincia) newErrors.Provincia = 'Campo obrigatório';
        if (!formData.Municipio) newErrors.Municipio = 'Campo obrigatório';
        if (!formData.Telefone) newErrors.Telefone = 'Campo obrigatório';
        if (!formData.Email) newErrors.Email = 'Campo obrigatório';
        break;
      case 1: { // Atividades
        if (!formData.Atividades || formData.Atividades.length === 0) {
          newErrors.Atividades = 'Selecione pelo menos uma atividade';
        }
        break;
      }
      case 2: { // Representantes
        if (!formData.NomePresidente) newErrors.NomePresidente = 'Campo obrigatório';
        if (!formData.BIPresidente) newErrors.BIPresidente = 'Campo obrigatório';
        if (!formData.NomeSecretarioOuGerente) newErrors.NomeSecretarioOuGerente = 'Campo obrigatório';
        if (!formData.BISecretarioOuGerente) newErrors.BISecretarioOuGerente = 'Campo obrigatório';
        break;
      }
      case 3: // Empregados
        if (!formData.NumeroCooperados || formData.NumeroCooperados < 0) {
          newErrors.NumeroCooperados = 'Campo obrigatório';
        }
        if (!formData.PerfilCooperados) newErrors.PerfilCooperados = 'Campo obrigatório';
        break;
      case 5: { // Documentos - validação final
        const requiredFiles = [
          'estatutoSocial', 'actaFundacao', 'listaPresenca',
          'rgCpfDiretor', 'rgCpfGerente', 'comprovanteEndereco', 'documentoNif'
        ];
        const missingFiles = requiredFiles.filter(file => !uploadedFiles[file]);
        if (missingFiles.length > 0) {
          newErrors.documentos = `Documentos obrigatórios faltando: ${missingFiles.join(', ')}`;
        }
        break;
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Criar FormData para multipart/form-data
      const submitFormData = new FormData();

      // Função auxiliar para adicionar campos ao FormData
      const appendField = (key, value) => {
        if (value !== null && value !== undefined && value !== '') {
          submitFormData.append(key, String(value));
        }
      };

      // Função para processar arrays - corrigida para o formato esperado
      const appendArrayField = (key, array) => {
        if (Array.isArray(array) && array.length > 0) {
          array.forEach((item, index) => {
            const value = typeof item === 'object' ? item.value || item.label || item : item;
            submitFormData.append(`${key}[${index}]`, String(value));
          });
        } else {
          // Se array vazio, enviar um array vazio
          submitFormData.append(`${key}[0]`, '');
        }
      };

      // Mapear dados do estado para os campos esperados pela API
      appendField('TipoDeEntidade', formData.TipoDeEntidade || 'EmpresaAgricola');

      // Dados da Empresa
      appendField('NomeEntidade', formData.NomeEntidade);
      appendField('Sigla', formData.Sigla || '');
      appendField('NIF', formData.NIF);

      // Tratar data de fundação - formato YYYY-MM-DD
      if (formData.DataFundacao) {
        // Se for apenas o ano, criar uma data válida
        const year = formData.DataFundacao;
        if (year && year.length === 4) {
          appendField('DataFundacao', `${year}-01-01`);
        } else {
          appendField('DataFundacao', formData.DataFundacao);
        }
      }

      // Localização
      appendField('Provincia', typeof formData.Provincia === 'object' ? formData.Provincia.value : formData.Provincia);
      appendField('Municipio', typeof formData.Municipio === 'object' ? formData.Municipio.value : formData.Municipio);
      appendField('Comuna', formData.Comuna || '');

      // Contactos
      appendField('Telefone', formData.Telefone);
      appendField('Email', formData.Email);

      // Atividades - tratar array corretamente
      appendArrayField('Atividades', formData.Atividades);
      appendField('OutrasAtividades', formData.OutrasAtividades || '');

      // Representantes Legais - Presidente/Diretor
      appendField('NomePresidente', formData.NomePresidente);
      appendField('BIPresidente', formData.BIPresidente);
      appendField('NumeroProdutor', formData.NumeroProdutor || '');
      appendField('TelefonePresidente', formData.TelefonePresidente || '');
      appendField('EmailPresidente', formData.EmailPresidente || '');

      // Representantes Legais - Secretário/Gerente
      appendField('NomeSecretarioOuGerente', formData.NomeSecretarioOuGerente);
      appendField('BISecretarioOuGerente', formData.BISecretarioOuGerente);
      appendField('TelefoneSecretarioOuGerente', formData.TelefoneSecretarioOuGerente || '');
      appendField('EmailSecretarioOuGerente', formData.EmailSecretarioOuGerente || '');

      // Quadro Social - todos como string conforme esperado pela API
      appendField('NumeroCooperados', String(formData.NumeroCooperados || 0));

      // Tratar perfil de cooperados como string
      let perfilString = '';
      if (Array.isArray(formData.PerfilCooperados)) {
        perfilString = formData.PerfilCooperados
          .map(p => typeof p === 'string' ? p : p.value)
          .join(', ');
      } else if (typeof formData.PerfilCooperados === 'object') {
        perfilString = formData.PerfilCooperados.value || '';
      } else {
        perfilString = formData.PerfilCooperados || '';
      }
      appendField('PerfilCooperados', perfilString);

      // Estrutura Operacional
      appendField('NumeroEmpregados', String(formData.NumeroEmpregados || 0));
      appendField('PossuiEquipamentos', formData.PossuiEquipamentos ? "true" : "false");

      // Equipamentos e Materiais - Arrays
      appendArrayField('EquipamentosAgricolas', formData.EquipamentosAgricolas || []);
      appendArrayField('EquipamentosInfraestrutura', formData.EquipamentosInfraestrutura || []);
      appendArrayField('MateriaisProducao', formData.MateriaisProducao || []);
      appendArrayField('FerramentasManuais', formData.FerramentasManuais || []);
      appendArrayField('EquipamentosMedicao', formData.EquipamentosMedicao || []);
      appendArrayField('MateriaisHigiene', formData.MateriaisHigiene || []);
      appendArrayField('MateriaisEscritorio', formData.MateriaisEscritorio || []);
      appendArrayField('EquipamentosTransporte', formData.EquipamentosTransporte || []);
      appendArrayField('EquipamentosPecuarios', formData.EquipamentosPecuarios || []);

      // Debug: Ver o que está sendo enviado
      console.log("📤 Dados preparados para envio (FormData):");
      for (let pair of submitFormData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      // Mostrar toast de processamento
      showToast('info', 'Enviando', 'Processando dados da organização...');

      // Fazer requisição POST para a API com FormData - ROTA CORRIGIDA
      const response = await axios.post('https://mwangobrainsa-001-site2.mtempurl.com/api/organizacao', submitFormData, {
        headers: {
          'Content-Type': undefined
        },
        timeout: 60000,
        responseType: 'json',
        transformRequest: [(data) => data]
      });

      console.log("✅ Resposta da API:", response.data);
      console.log("✅ Status da resposta:", response.status);

      setLoading(false);
      showToast('success', 'Sucesso', 'Organização registrada com sucesso!');

      // Reset do formulário
      setFormData(initialState);
      setActiveIndex(0);
      setErrors({});
      setTouched({});
      setUploadedFiles({});
      setNifData(null);
      setBiData(null);
      setBiGerenteData(null);

    } catch (error) {
      setLoading(false);
      console.error('❌ Erro ao registrar organização:', error);
      console.error('❌ Resposta completa do erro:', error.response);

      let errorMessage = 'Erro ao registrar organização. Tente novamente.';

      if (error.response) {
        // Erro de resposta do servidor
        const status = error.response.status;
        let errorData = error.response.data;

        console.error('📄 Status do erro:', status);
        console.error('📄 Dados do erro:', errorData);
        console.error('📄 Headers de resposta:', error.response.headers);

        // Tratar resposta que não é JSON (possivelmente XML ou HTML)
        if (typeof errorData === 'string') {
          console.log('📄 Resposta é string:', errorData);
          // Se a resposta contém HTML ou XML, extrair informação útil
          if (errorData.includes('<') && errorData.includes('>')) {
            errorMessage = `Erro ${status}: O servidor retornou uma resposta não esperada. Verifique se a API está funcionando corretamente.`;
          } else {
            errorMessage = `Erro ${status}: ${errorData}`;
          }
        } else if (errorData && typeof errorData === 'object') {
          // Tratar resposta JSON estruturada
          switch (status) {
            case 400:
              if (errorData.errors && typeof errorData.errors === 'object') {
                const errorMessages = Object.entries(errorData.errors)
                  .map(([field, messages]) => {
                    const messageArray = Array.isArray(messages) ? messages : [messages];
                    return `${field}: ${messageArray.join(', ')}`;
                  })
                  .join('\n');
                errorMessage = `Erros de validação:\n${errorMessages}`;
              } else if (errorData.message) {
                errorMessage = `Erro de validação: ${errorData.message}`;
              } else if (errorData.title) {
                errorMessage = `Erro de validação: ${errorData.title}`;
              } else {
                errorMessage = `Dados inválidos. Verifique os campos e tente novamente.`;
              }
              break;

            case 401:
              errorMessage = 'Não autorizado. Verifique suas credenciais.';
              break;

            case 403:
              errorMessage = 'Acesso negado. Você não tem permissão para esta operação.';
              break;

            case 404:
              errorMessage = 'Rota da API não encontrada. Verifique se o endpoint está correto.';
              break;

            case 409:
              errorMessage = 'Conflito: Este registro já existe no sistema.';
              break;

            case 413:
              errorMessage = 'Arquivo muito grande. Reduza o tamanho dos arquivos enviados.';
              break;

            case 422:
              errorMessage = 'Dados não processáveis. Verifique o formato dos dados.';
              break;

            case 500:
              errorMessage = 'Erro interno do servidor. Tente novamente mais tarde.';
              break;

            case 503:
              errorMessage = 'Serviço temporariamente indisponível. Tente novamente em alguns minutos.';
              break;

            default:
              errorMessage = `Erro ${status}: ${errorData?.message || errorData?.title || error.response.statusText}`;
          }
        } else {
          errorMessage = `Erro ${status}: Resposta inesperada do servidor`;
        }
      } else if (error.request) {
        // Erro de rede
        console.error('🌐 Erro de rede:', error.request);
        if (error.code === 'ECONNABORTED') {
          errorMessage = 'Tempo limite excedido. O servidor pode estar ocupado, tente novamente.';
        } else if (error.code === 'NETWORK_ERROR') {
          errorMessage = 'Erro de rede. Verifique sua conexão com a internet.';
        } else {
          errorMessage = 'Erro de conexão. Verifique sua internet e tente novamente.';
        }
      } else {
        // Erro na configuração
        console.error('⚙️ Erro na configuração:', error.message);
        errorMessage = `Erro na configuração: ${error.message}`;
      }

      showToast('error', 'Erro', errorMessage);

      // Se houver erros de validação específicos, atualizar o estado de erros
      if (error.response?.status === 400 && error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      }
    }
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
                <h3 className="text-xl  font-bold text-gray-800">Dados da Empresa</h3>
              </div>
              <p className="text-gray-600">
                Informe os dados básicos da empresa agrícola ou agropecuária. Digite o NIF para consulta automática.
              </p>
            </div>

            {formData.NIF && formData.NomeEntidade && (
              <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                    <p className="text-green-700 text-sm font-medium">
                      Dados preenchidos automaticamente através da consulta do NIF. Verifique e ajuste se necessário.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({
                        ...prev,
                        NomeEntidade: '',
                        Email: '',
                        Telefone: '',
                        DataFundacao: '',
                        Provincia: '',
                        Municipio: '',
                        Comuna: '',
                      }));
                      setMunicipiosOptions([]);
                      setNifData(null);
                      showToast('info', 'Dados limpos', 'Campos limpos. Preencha manualmente.');
                    }}
                    className="text-sm text-green-600 hover:text-green-800 underline"
                  >
                    Limpar e preencher manualmente
                  </button>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              <div className="relative">
                <CustomInput
                  type="text"
                  label="NIF"
                  value={formData.NIF}
                  onChange={handleNifChange}
                  required
                  errorMessage={errors.NIF}
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
              </div>

              <CustomInput
                type="text"
                label="Nome da Empresa"
                value={formData.NomeEntidade}
                onChange={(value) => handleInputChange('NomeEntidade', value)}
                required
                errorMessage={errors.NomeEntidade}
                placeholder="Digite o nome completo da empresa"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="text"
                label="Sigla"
                value={formData.Sigla}
                onChange={(value) => handleInputChange('Sigla', value)}
                placeholder="Ex: EMPRESA"
                iconStart={<FileText size={18} />}
              />

              <CustomInput
                type="number"
                label="Ano de Fundação"
                value={formData.DataFundacao}
                onChange={(value) => handleInputChange('DataFundacao', value)}
                required
                errorMessage={errors.DataFundacao}
                placeholder="Ex: 2020"
                iconStart={<Calendar size={18} />}
                min="1900"
                max={new Date().getFullYear()}
              />

              <CustomInput
                type="select"
                label="Província"
                value={formData.Provincia}
                options={provinciasData.map(provincia => ({
                  label: provincia.nome,
                  value: provincia.nome.toUpperCase()
                }))}
                onChange={(value) => handleInputChange('Provincia', value)}
                required
                errorMessage={errors.Provincia}
                placeholder="Selecione a província"
                iconStart={<MapPin size={18} />}
              />

              <CustomInput
                type="select"
                label="Município"
                value={formData.Municipio}
                options={municipiosOptions}
                onChange={(value) => handleInputChange('Municipio', value)}
                required
                errorMessage={errors.Municipio}
                placeholder="Selecione o município"
                iconStart={<Map size={18} />}
                disabled={!formData.Provincia}
              />

              <CustomInput
                type="text"
                label="Comuna"
                value={formData.Comuna}
                onChange={(value) => handleInputChange('Comuna', value)}
                placeholder="Nome da comuna"
                iconStart={<Building size={18} />}
              />

              <CustomInput
                type="tel"
                label="Telefone"
                value={formData.Telefone}
                onChange={(value) => handleInputChange('Telefone', value)}
                required
                errorMessage={errors.Telefone}
                placeholder="Ex: 923456789"
                iconStart={<Phone size={18} />}
                maxLength={9}
              />

              <CustomInput
                type="email"
                label="E-mail"
                value={formData.Email}
                onChange={(value) => handleInputChange('Email', value)}
                required
                errorMessage={errors.Email}
                placeholder="empresa@exemplo.com"
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
                    <span className="font-medium text-gray-600">Tipo de Contribuinte:</span>
                    <p className="text-gray-800">{nifData.tipo_contribuinte || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Estado:</span>
                    <p className="text-gray-800">
                      {nifData.estado_contribuinte === 'A' ? 'Ativo' :
                        nifData.estado_contribuinte === 'C' ? 'Cessado' :
                          nifData.estado_contribuinte === 'D' ? 'Falecido' :
                            nifData.estado_contribuinte === 'E' ? 'Herança' :
                              nifData.estado_contribuinte === 'F' ? 'Anulado' :
                                nifData.estado_contribuinte === 'G' ? 'Suspenso' :
                                  'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Capital Social:</span>
                    <p className="text-gray-800">
                      {nifData.valor_capital_social ?
                        new Intl.NumberFormat('pt-AO', {
                          style: 'currency',
                          currency: 'AOA'
                        }).format(nifData.valor_capital_social) : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Data Constituição:</span>
                    <p className="text-gray-800">
                      {nifData.data_constituicao ?
                        new Date(nifData.data_constituicao).toLocaleDateString('pt-BR') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Morada Completa:</span>
                    <p className="text-gray-800">{nifData.morada || 'N/A'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-600">Atividades:</span>
                    <p className="text-gray-800">
                      {nifData.lista_cae && nifData.lista_cae.length > 0 ?
                        `${nifData.lista_cae.length} atividade(s) registrada(s)` : 'N/A'}
                    </p>
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
                <h3 className="text-xl font-bold text-gray-800">Actividades da Empresa</h3>
              </div>
              <p className="text-gray-600">
                Selecione todas as actividades praticadas pela empresa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Wheat className="w-5 h-5 mr-2 text-blue-600" />
                Principais Actividades
              </h4>

              <CustomInput
                type="multiselect"
                value={formData.Atividades}
                options={[
                  { label: 'Produção Agrícola', value: 'PRODUCAO_AGRICOLA' },
                  { label: 'Produção Pecuária', value: 'PRODUCAO_PECUARIA' },
                  { label: 'Agroindústria', value: 'AGROINDUSTRIA' },
                  { label: 'Comercialização', value: 'COMERCIALIZACAO' },
                  { label: 'Assistência Técnica', value: 'ASSISTENCIA_TECNICA' },
                  { label: 'Outros', value: 'OUTROS' }
                ]}
                onChange={(value) => handleInputChange('Atividades', value)}
                errorMessage={errors.Atividades}
              />

              {formData.Atividades.some(ativ => ativ === 'OUTROS' || (ativ && ativ.value === 'OUTROS')) && (
                <div className="mt-6">
                  <CustomInput
                    type="textarea"
                    label="Especificar Outras Atividades"
                    value={formData.OutrasAtividades}
                    onChange={(value) => handleInputChange('OutrasAtividades', value)}
                    placeholder="Descreva outras atividades praticadas pela empresa..."
                    rows={3}
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
                Informações dos principais representantes da empresa. Digite o BI para consulta automática.
              </p>
            </div>

            <div className="space-y-8">
              {/* Diretor Geral */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Diretor Geral / Presidente
                </h4>

                {/* Alert se dados foram preenchidos automaticamente */}
                {biData && formData.NomePresidente && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-green-700 text-sm font-medium">
                          Dados preenchidos automaticamente através da consulta do BI. Verifique e ajuste se necessário.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.NomePresidente}
                      onChange={(value) => handleInputChange('NomePresidente', value)}
                      required
                      errorMessage={errors.NomePresidente}
                      placeholder="Nome completo do diretor geral"
                      iconStart={<User size={18} />}
                    />
                  </div>

                  <div className="relative">
                    <CustomInput
                      type="text"
                      label="Número do BI"
                      value={formData.BIPresidente}
                      onChange={(value) => {
                        handleInputChange('BIPresidente', value);
                        // Limpar timer anterior
                        if (biDebounceTimer.current) {
                          clearTimeout(biDebounceTimer.current);
                        }
                        // Configurar novo timer para consulta após 1.5 segundos
                        biDebounceTimer.current = setTimeout(() => {
                          if (value && value.length >= 9) {
                            consultarBI(value);
                          }
                        }, 1500);
                      }}
                      required
                      errorMessage={errors.BIPresidente}
                      placeholder="Número do bilhete de identidade"
                      iconStart={<CreditCard size={18} />}
                      helperText="Digite o BI para consulta automática"
                    />
                    {consultingBI && (
                      <div className="absolute right-3 top-9 flex items-center">
                        <Loader size={16} className="animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-blue-600">Consultando...</span>
                      </div>
                    )}
                  </div>

                  <CustomInput
                    type="text"
                    label="Número de Produtor"
                    value={formData.NumeroProdutor}
                    onChange={(value) => handleInputChange('NumeroProdutor', value)}
                    placeholder="Número do produtor no RNPA"
                    iconStart={<CreditCard size={18} />}
                  />

                  <CustomInput
                    type="tel"
                    label="Telefone"
                    value={formData.TelefonePresidente}
                    onChange={(value) => handleInputChange('TelefonePresidente', value)}
                    placeholder="Ex: 923456789"
                    iconStart={<Phone size={18} />}
                  />

                  <CustomInput
                    type="email"
                    label="E-mail"
                    value={formData.EmailPresidente}
                    onChange={(value) => handleInputChange('EmailPresidente', value)}
                    placeholder="diretor@empresa.com"
                    iconStart={<Mail size={18} />}
                  />
                </div>

                {/* Informações do BI consultado - Diretor */}
                {biData && (
                  <div className="mt-6 bg-white rounded-xl p-4 border border-blue-200">
                    <h5 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Informações do BI Consultado
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Nome:</span>
                        <p className="text-gray-800">{`${biData.first_name || ''} ${biData.last_name || ''}`.trim() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Gênero:</span>
                        <p className="text-gray-800">{biData.gender_name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Data Nascimento:</span>
                        <p className="text-gray-800">
                          {biData.birth_date ? new Date(biData.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Gerente */}
              <div className="bg-blue-50 rounded-2xl p-6 border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-800 mb-6 flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Gerente / Secretário
                </h4>

                {/* Alert se dados foram preenchidos automaticamente */}
                {biGerenteData && formData.NomeSecretarioOuGerente && (
                  <div className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <p className="text-green-700 text-sm font-medium">
                          Dados preenchidos automaticamente através da consulta do BI. Verifique e ajuste se necessário.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  <div className="md:col-span-2">
                    <CustomInput
                      type="text"
                      label="Nome Completo"
                      value={formData.NomeSecretarioOuGerente}
                      onChange={(value) => handleInputChange('NomeSecretarioOuGerente', value)}
                      required
                      errorMessage={errors.NomeSecretarioOuGerente}
                      placeholder="Nome completo do gerente"
                      iconStart={<User size={18} />}
                    />
                  </div>

                  <div className="relative">
                    <CustomInput
                      type="text"
                      label="Número do BI"
                      value={formData.BISecretarioOuGerente}
                      onChange={(value) => {
                        handleInputChange('BISecretarioOuGerente', value);
                        // Limpar timer anterior
                        if (biGerenteDebounceTimer.current) {
                          clearTimeout(biGerenteDebounceTimer.current);
                        }
                        // Configurar novo timer para consulta após 1.5 segundos
                        biGerenteDebounceTimer.current = setTimeout(() => {
                          if (value && value.length >= 9) {
                            consultarBIGerente(value);
                          }
                        }, 1500);
                      }}
                      required
                      errorMessage={errors.BISecretarioOuGerente}
                      placeholder="Número do bilhete de identidade"
                      iconStart={<CreditCard size={18} />}
                      helperText="Digite o BI para consulta automática"
                    />
                    {consultingBIGerente && (
                      <div className="absolute right-3 top-9 flex items-center">
                        <Loader size={16} className="animate-spin text-blue-600" />
                        <span className="ml-2 text-sm text-blue-600">Consultando...</span>
                      </div>
                    )}
                  </div>

                  <CustomInput
                    type="tel"
                    label="Telefone"
                    value={formData.TelefoneSecretarioOuGerente}
                    onChange={(value) => handleInputChange('TelefoneSecretarioOuGerente', value)}
                    placeholder="Ex: 923456789"
                    iconStart={<Phone size={18} />}
                    mazLength={9}
                  />

                  <CustomInput
                    type="email"
                    label="E-mail"
                    value={formData.EmailSecretarioOuGerente}
                    onChange={(value) => handleInputChange('EmailSecretarioOuGerente', value)}
                    placeholder="gerente@empresa.com"
                    iconStart={<Mail size={18} />}
                  />
                </div>

                {/* Informações do BI consultado - Gerente */}
                {biGerenteData && (
                  <div className="mt-6 bg-white rounded-xl p-4 border border-blue-200">
                    <h5 className="text-md font-semibold text-blue-700 mb-3 flex items-center">
                      <Info className="w-4 h-4 mr-2" />
                      Informações do BI Consultado
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                      <div>
                        <span className="font-medium text-gray-600">Nome:</span>
                        <p className="text-gray-800">{`${biGerenteData.first_name || ''} ${biGerenteData.last_name || ''}`.trim() || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Gênero:</span>
                        <p className="text-gray-800">{biGerenteData.gender_name || 'N/A'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-600">Data Nascimento:</span>
                        <p className="text-gray-800">
                          {biGerenteData.birth_date ? new Date(biGerenteData.birth_date).toLocaleDateString('pt-BR') : 'N/A'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      case 3: // Empregados
        return (
          <div className="max-w-full mx-auto">
            <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-2xl p-6 mb-8 border border-orange-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Users className="w-6 h-6 text-orange-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Quadro de Funcionários</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre os funcionários da empresa.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-orange-600" />
                Composição dos Funcionários
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <CustomInput
                  type="number"
                  label="Número de Funcionários"
                  value={formData.NumeroCooperados}
                  onChange={(value) => handleInputChange('NumeroCooperados', parseInt(value) || 0)}
                  required
                  errorMessage={errors.NumeroCooperados}
                  placeholder="Quantidade total de funcionários"
                  iconStart={<Users size={18} />}
                  min="0"
                />

                <CustomInput
                  type="multiselect"
                  label="Perfil dos Funcionários"
                  value={formData.PerfilCooperados || []}
                  options={[
                    { label: 'Técnicos Agrícolas', value: 'TECNICOS_AGRICOLAS' },
                    { label: 'Operários Rurais', value: 'OPERARIOS_RURAIS' },
                    { label: 'Administrativos', value: 'ADMINISTRATIVOS' },
                    { label: 'Outros', value: 'OUTROS' }
                  ]}
                  onChange={(value) => handleInputChange('PerfilCooperados', value)}
                  required
                  errorMessage={errors.PerfilCooperados}
                  placeholder="Selecione o perfil dos funcionários"
                />

                {Array.isArray(formData.PerfilCooperados) && formData.PerfilCooperados.some(p => p === 'OUTROS' || (p && p.value === 'OUTROS')) && (
                  <div className="md:col-span-2">
                    <CustomInput
                      type="textarea"
                      label="Descreva o perfil dos funcionários (Outros)"
                      value={formData.OutrosPerfilCooperados || ''}
                      onChange={(value) => handleInputChange('OutrosPerfilCooperados', value)}
                      placeholder="Descreva o perfil personalizado dos funcionários..."
                      rows={3}
                    />
                  </div>
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
                Informações sobre funcionários, equipamentos e infraestrutura da empresa.
              </p>
            </div>

            <div className="space-y-8">
              {/* Recursos Humanos */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-6 flex items-center">
                  <Briefcase className="w-5 h-5 mr-2 text-teal-600" />
                  Recursos Humanos
                </h4>
                <CustomInput
                  type="number"
                  label="Número de Funcionários"
                  value={formData.NumeroEmpregados}
                  onChange={(value) => handleInputChange('NumeroEmpregados', parseInt(value) || 0)}
                  placeholder="Quantidade de funcionários"
                  iconStart={<Users size={18} />}
                  min="0"
                  helperText="Inclui funcionários permanentes e temporários"
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
                    value={formData.PossuiEquipamentos}
                    options={[
                      { label: 'Sim', value: true },
                      { label: 'Não', value: false }
                    ]}
                    onChange={(value) => handleInputChange('PossuiEquipamentos', value)}
                    placeholder="Selecione uma opção"
                  />
                </div>

                {formData.PossuiEquipamentos && (
                  <div className="space-y-8">
                    {/* Equipamentos Agrícolas */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-4">1. Equipamentos Agrícolas</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.EquipamentosAgricolas}
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
                        onChange={(value) => handleInputChange('EquipamentosAgricolas', value)}
                      />
                    </div>

                    {/* Equipamentos de Infraestrutura */}
                    <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                      <h5 className="font-semibold text-blue-800 mb-4">2. Equipamentos de Infraestrutura</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.EquipamentosInfraestrutura}
                        options={[
                          { label: 'Sistemas de irrigação (aspersores, gotejamento)', value: 'SISTEMAS_IRRIGACAO' },
                          { label: 'Bombas d\'água', value: 'BOMBAS_AGUA' },
                          { label: 'Caixa d\'água/reservatórios', value: 'RESERVATORIOS' },
                          { label: 'Estufas/túneis plásticos', value: 'ESTUFAS' },
                          { label: 'Galpões de armazenamento', value: 'GALPOES' },
                          { label: 'Silos para grãos', value: 'SILOS' },
                          { label: 'Tanques de leite', value: 'TANQUES_LEITE' }
                        ]}
                        onChange={(value) => handleInputChange('EquipamentosInfraestrutura', value)}
                      />
                    </div>

                    {/* Materiais de Produção */}
                    <div className="bg-yellow-50 rounded-xl p-6 border border-yellow-200">
                      <h5 className="font-semibold text-yellow-800 mb-4">3. Materiais de Produção</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.MateriaisProducao}
                        options={[
                          { label: 'Sementes certificadas', value: 'SEMENTES' },
                          { label: 'Mudas', value: 'MUDAS' },
                          { label: 'Fertilizantes', value: 'FERTILIZANTES' },
                          { label: 'Corretivos (calcário, gesso agrícola)', value: 'CORRETIVOS' },
                          { label: 'Adubos orgânicos', value: 'ADUBOS_ORGANICOS' },
                          { label: 'Defensivos agrícolas', value: 'DEFENSIVOS' },
                          { label: 'Ração animal', value: 'RACAO_ANIMAL' }
                        ]}
                        onChange={(value) => handleInputChange('MateriaisProducao', value)}
                      />
                    </div>

                    {/* Ferramentas Manuais */}
                    <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                      <h5 className="font-semibold text-purple-800 mb-4">4. Ferramentas Manuais</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.FerramentasManuais}
                        options={[
                          { label: 'Enxadas', value: 'ENXADAS' },
                          { label: 'Foices', value: 'FOICES' },
                          { label: 'Facões', value: 'FACOES' },
                          { label: 'Picaretas', value: 'PICARETAS' },
                          { label: 'Cavadeiras', value: 'CAVADEIRAS' },
                          { label: 'Pá e enxadão', value: 'PA_ENXADAO' },
                          { label: 'Regadores', value: 'REGADORES' }
                        ]}
                        onChange={(value) => handleInputChange('FerramentasManuais', value)}
                      />
                    </div>

                    {/* Equipamentos de Medição */}
                    <div className="bg-indigo-50 rounded-xl p-6 border border-indigo-200">
                      <h5 className="font-semibold text-indigo-800 mb-4">5. Equipamentos de Medição e Controle</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.EquipamentosMedicao}
                        options={[
                          { label: 'Balanças (analógicas e digitais)', value: 'BALANCAS' },
                          { label: 'Medidores de umidade do solo e de grãos', value: 'MEDIDORES_UMIDADE' },
                          { label: 'Medidores de pH', value: 'MEDIDORES_PH' },
                          { label: 'Estações meteorológicas simples', value: 'ESTACOES_METEOROLOGICAS' },
                          { label: 'GPS agrícola', value: 'GPS_AGRICOLA' }
                        ]}
                        onChange={(value) => handleInputChange('EquipamentosMedicao', value)}
                      />
                    </div>

                    {/* Materiais de Higiene */}
                    <div className="bg-pink-50 rounded-xl p-6 border border-pink-200">
                      <h5 className="font-semibold text-pink-800 mb-4">6. Materiais para Higiene e Segurança</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.MateriaisHigiene}
                        options={[
                          { label: 'EPIs (luvas, botas, óculos, máscaras)', value: 'EPIS' },
                          { label: 'Produtos de limpeza e higienização', value: 'PRODUTOS_LIMPEZA' },
                          { label: 'Kit de primeiros socorros', value: 'KIT_PRIMEIROS_SOCORROS' }
                        ]}
                        onChange={(value) => handleInputChange('MateriaisHigiene', value)}
                      />
                    </div>

                    {/* Materiais de Escritório */}
                    <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                      <h5 className="font-semibold text-gray-800 mb-4">7. Materiais de Escritório/Administração</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.MateriaisEscritorio}
                        options={[
                          { label: 'Computadores', value: 'COMPUTADORES' },
                          { label: 'Impressoras', value: 'IMPRESSORAS' },
                          { label: 'Materiais de papelaria', value: 'PAPELARIA' },
                          { label: 'Softwares de gestão agrícola', value: 'SOFTWARES' },
                          { label: 'Quadros de controle', value: 'QUADROS_CONTROLE' }
                        ]}
                        onChange={(value) => handleInputChange('MateriaisEscritorio', value)}
                      />
                    </div>

                    {/* Equipamentos de Transporte */}
                    <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
                      <h5 className="font-semibold text-orange-800 mb-4">8. Equipamentos de Transporte e Logística</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.EquipamentosTransporte}
                        options={[
                          { label: 'Caminhões ou tratores com carroceria', value: 'CAMINHOES' },
                          { label: 'Carros utilitários', value: 'CARROS_UTILITARIOS' },
                          { label: 'Carretas agrícolas', value: 'CARRETAS' },
                          { label: 'Cargas paletizadas, caixas e bombonas', value: 'CARGAS_PALETIZADAS' }
                        ]}
                        onChange={(value) => handleInputChange('EquipamentosTransporte', value)}
                      />
                    </div>

                    {/* Equipamentos Pecuários */}
                    <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                      <h5 className="font-semibold text-red-800 mb-4">9. Equipamentos Pecuários</h5>
                      <CustomInput
                        type="multiselect"
                        value={formData.EquipamentosPecuarios}
                        options={[
                          { label: 'Ordenhadeiras', value: 'ORDENHADEIRAS' },
                          { label: 'Bebedouros automáticos', value: 'BEBEDOUROS' },
                          { label: 'Comedouros', value: 'COMEDOUROS' },
                          { label: 'Cercas elétricas', value: 'CERCAS_ELETRICAS' },
                          { label: 'Aparelhos de inseminação artificial', value: 'APARELHOS_INSEMINACAO' },
                          { label: 'Cochos', value: 'COCHOS' }
                        ]}
                        onChange={(value) => handleInputChange('EquipamentosPecuarios', value)}
                      />
                    </div>
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
                Faça o upload dos documentos necessários para completar o registro da empresa.
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

              {/* RG e CPF Diretor */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  RG e CPF do Diretor Geral *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('rgCpfDiretor', e.target.files[0])}
                    id="rg-diretor-upload"
                  />
                  <label
                    htmlFor="rg-diretor-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.rgCpfDiretor
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${uploadedFiles.rgCpfDiretor ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.rgCpfDiretor ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.rgCpfDiretor ? 'Documento carregado' : 'Carregar RG/CPF'}
                    </p>
                    {uploadedFiles.rgCpfDiretor && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.rgCpfDiretor.name}</p>
                    )}
                  </label>
                </div>
              </div>

              {/* RG e CPF Gerente */}
              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">
                  RG e CPF do Gerente *
                </label>
                <div className="relative">
                  <input
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={(e) => handleFileUpload('rgCpfGerente', e.target.files[0])}
                    id="rg-gerente-upload"
                  />
                  <label
                    htmlFor="rg-gerente-upload"
                    className={`flex flex-col items-center justify-center h-40 px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ${uploadedFiles.rgCpfGerente
                      ? 'bg-blue-50 border-blue-300 hover:bg-blue-100'
                      : 'bg-gray-50 border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                      }`}
                  >
                    <CreditCard className={`w-8 h-8 mb-3 ${uploadedFiles.rgCpfGerente ? 'text-blue-500' : 'text-gray-400'}`} />
                    <p className={`text-sm font-medium ${uploadedFiles.rgCpfGerente ? 'text-blue-600' : 'text-gray-500'}`}>
                      {uploadedFiles.rgCpfGerente ? 'Documento carregado' : 'Carregar RG/CPF'}
                    </p>
                    {uploadedFiles.rgCpfGerente && (
                      <p className="text-xs text-blue-500 mt-1">{uploadedFiles.rgCpfGerente.name}</p>
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
          <div className="text-center mb-8 p-8 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-emerald-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Cadastro de Empresas Agricolas</h1>
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
                    ? 'bg-blue-600 text-white'
                    : isCompleted
                      ? 'bg-green-500 text-white'
                      : 'bg-gray-200 text-gray-500'
                    }`}>
                    {isCompleted ? (
                      <Check size={24} />
                    ) : (
                      <Icon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${isActive ? 'text-blue-700' : isCompleted ? 'text-green-600' : 'text-gray-500'
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

export default CadastroEmpresas;