import React, { useEffect, useState } from 'react';
import {
  User,
  Home,
  Users,
  Trees,
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
  Search,
  Plus,
  Trash2,
  Edit,
  Award,
  ClipboardCheck,
  Eye,
  Download,
  Activity,
  Mountain,
  Upload,
  Banknote,
  Factory,
  Users as UsersIcon,
  Building2,
} from 'lucide-react';

import CustomInput from '../components/CustomInput';
import provinciasData from '../components/Provincias.json'

// Hook para buscar produtores florestais
const useProdutoresFlorestais = () => {
  const [produtores, setProdutores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProdutores = async () => {
      try {
        const response = await fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/produtorFlorestal/all');
        const data = await response.json();
        setProdutores(data);
      } catch (error) {
        console.error('Erro ao buscar produtores florestais:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProdutores();
  }, []);

  return { produtores, loading };
};

// Hook para buscar entidades (empresas, cooperativas, associações)
const useEntidades = () => {
  const [empresas, setEmpresas] = useState([]);
  const [cooperativas, setCooperativas] = useState([]);
  const [associacoes, setAssociacoes] = useState([]);
  const [loadingEntidades, setLoadingEntidades] = useState(true);

  useEffect(() => {
    const fetchEntidades = async () => {
      try {
        const [empresasRes, cooperativasRes, associacoesRes] = await Promise.all([
          fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/organizacao/empresasFlorestais'),
          fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/organizacao/cooperativasFlorestais'),
          fetch('https://mwangobrainsa-001-site2.mtempurl.com/api/organizacao/AssociacoesFlorestais')
        ]);

        const [empresasData, cooperativasData, associacoesData] = await Promise.all([
          empresasRes.json(),
          cooperativasRes.json(),
          associacoesRes.json()
        ]);

        setEmpresas(empresasData);
        setCooperativas(cooperativasData);
        setAssociacoes(associacoesData);
      } catch (error) {
        console.error('Erro ao buscar entidades:', error);
      } finally {
        setLoadingEntidades(false);
      }
    };

    fetchEntidades();
  }, []);

  return { empresas, cooperativas, associacoes, loadingEntidades };
};

const CertificacaoProdutorFlorestal = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [municipiosOptions, setMunicipiosOptions] = useState([]);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [toastMessage, setToastMessage] = useState(null);
  const [produtorSelecionado, setProdutorSelecionado] = useState(null);
  const [entidadeSelecionada, setEntidadeSelecionada] = useState(null);
  const [tipoSelecionado, setTipoSelecionado] = useState(''); // 'produtor', 'empresa', 'cooperativa', 'associacao'
  const [modoBusca, setModoBusca] = useState(true);
  const [documentosUpload, setDocumentosUpload] = useState([]);

  // Hooks para buscar dados
  const { produtores: produtoresFlorestais, loading: loadingProdutores } = useProdutoresFlorestais();
  const { empresas, cooperativas, associacoes, loadingEntidades } = useEntidades();

  // Estados para as tabelas dinâmicas
  const [areasFlorestais, setAreasFlorestais] = useState([]);
  const [especiesAutorizadas, setEspeciesAutorizadas] = useState([]);
  const [historicoExploracoes, setHistoricoExploracoes] = useState([]);

  // Estado inicial do formulário
  const initialState = {
    nomeCompleto: '',
    nomeEntidade: '',
    bi: '',
    dataNascimento: '',
    sexo: '',
    nacionalidade: 'ANGOLANA',
    telefone: '',
    enderecoResidencial: '',
    provincia: '',
    municipio: '',
    comuna: '',
    numeroLicencaExploracao: '',
    tiposLicenca: [], // Multiselect
    areaFlorestaTotalHa: '',
    coordenadasGPS: '',
    finalidadeLicenca: [],
    validadeInicio: '',
    validadeFim: '',
    condicoesEspeciais: '',
    observacoes: '',
    tecnicoResponsavel: '',
    cargoTecnico: '',
    numeroProcesso: Math.floor(100000 + Math.random() * 900000)
  };

  const [formData, setFormData] = useState(initialState);

  const steps = [
    { label: 'Tipo de Entidade', icon: Search },
    { label: 'Dados Pessoais', icon: User },
    { label: 'Dados da Entidade', icon: Building },
    { label: 'Áreas Florestais', icon: Trees },
    { label: 'Espécies Autorizadas', icon: Mountain },
    { label: 'Histórico de Exploração', icon: Activity },
    { label: 'Documentos', icon: Upload },
    { label: 'Licença Florestal', icon: Award }
  ];

  // Tipos de licença com preços
  const tiposLicencaOptions = [
    { label: 'Licença de Exploração Florestal', value: 'EXPLORACAO_FLORESTAL' , preco: 77000 },
    { label: 'Licença de Plantio Florestal', value: 'PLANTIO_FLORESTAL', preco: 150000 },
    { label: 'Licença de Manejo Florestal', value: 'MANEJO_FLORESTAL' , preco: 12000},
    { label: 'Licença de Reflorestamento', value: 'REFLORESTAMENTO' , preco: 32000 },
    { label: 'Licença de exploração de Madeira em toro', value: 'MADEIRA_TORO', preco: 50000 },
    { label: 'Licença de exploração de lenha', value: 'LENHA', preco: 15000 },
    { label: 'Licença de exploração de carvão vegetal', value: 'CARVAO', preco: 20000 },
    { label: 'Licença de exploração de produtos não lenhosos', value: 'NAO_LENHOSOS', preco: 25000 },
    { label: 'Licença de exploração Comunitária', value: 'COMUNITARIA', preco: 10000 },
    { label: 'Licença de aproveitamento de desperdícios', value: 'DESPERDICIOS', preco: 8000 },
  ];

  // Documentos necessários para upload
  const documentosNecessarios = [
    'Identificação do requerente',
    'Comprovativo de registo da empresa/associação',
    'Declaração das autoridades tradicionais e da administração municipal',
    'Declaração de Não Devedor Fiscal',
    'Contrato de parceria',
    'Declaração de sujeição às leis vigentes e tribunais nacionais',
    'Prova de capacidade financeira',
    'Croquis de localização da área',
    'Memória descritiva da área de exploração',
    'Plano de Exploração Florestal',
    'Licença Ambiental e Estudo de Impacto Ambiental',
    'Relatório de atividade desenvolvida'
  ];

  const showToast = (severity, summary, detail, duration = 3000) => {
    setToastMessage({ severity, summary, detail, visible: true });
    setTimeout(() => setToastMessage(null), duration);
  };

  // Função auxiliar para extrair valores dos objetos select
  const getDisplayValue = (value) => {
    if (value === null || value === undefined) return '';
    if (typeof value === 'string' || typeof value === 'number') return String(value);
    if (typeof value === 'object' && value.hasOwnProperty('value')) return String(value.value || '');
    if (typeof value === 'object' && value.hasOwnProperty('label')) return String(value.label || '');
    return String(value);
  };

  // Função auxiliar para validar se campo tem valor válido
  const hasValidValue = (value) => {
    const displayValue = getDisplayValue(value);
    return displayValue && displayValue.trim() !== '';
  };

  const validateCurrentStep = () => {
    const newErrors = {};
    console.log('Validando step florestal:', activeIndex);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setTouched(prev => ({ ...prev, [field]: true }));
    setFormData(prev => ({ ...prev, [field]: value }));
    
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleProvinciaChange = (value) => {
    const provinciaValue = typeof value === 'object' ? value.value : value;
    handleInputChange('provincia', provinciaValue);
    handleInputChange('municipio', '');

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

  const selecionarEntidade = (tipo, entidade = null) => {
    setTipoSelecionado(tipo);
    setEntidadeSelecionada(entidade);
    setProdutorSelecionado(null);

    if (entidade) {
      setFormData(prev => ({
        ...prev,
        nomeEntidade: entidade.nomeEntidade || '',
        telefone: entidade.telefone || '',
        provincia: entidade.provincia || '',
        municipio: entidade.municipio || '',
        comuna: entidade.comuna || '',
      }));

      if (entidade.provincia) {
        const provinciaSelected = provinciasData.find(
          p => p.nome.toUpperCase() === entidade.provincia?.toUpperCase()
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
        }
      }
    }

    showToast('success', 'Entidade Selecionada', `${tipo} selecionada com sucesso!`);
  };

  const buscarProdutor = (produtorOption) => {
    const produtorId = typeof produtorOption === 'object' ? produtorOption.value : produtorOption;
    const produtor = produtoresFlorestais.find(p => p._id === parseInt(produtorId));

    if (produtor) {
      setProdutorSelecionado(produtor);
      setTipoSelecionado('produtor');

      setFormData(prev => ({
        ...prev,
        nomeCompleto: produtor.nome_do_Produtor || '',
        bi: produtor.bI_NIF || '',
        telefone: produtor.contacto || '',
        provincia: produtor.provincia || '',
        municipio: produtor.municipio || '',
        comuna: produtor.comuna || ''
      }));

      showToast('success', 'Produtor Encontrado', 'Dados preenchidos automaticamente!');
    }
  };

  // Preparar opções para os selects
  const produtoresOptions = produtoresFlorestais.map(p => ({
    label: `${p.nome_do_Produtor} - ${p.bI_NIF}`,
    value: p._id.toString()
  }));

  const empresasOptions = empresas.map(e => ({
    label: `${e.nomeEntidade} - ${e.nif}`,
    value: e.id.toString(),
    entidade: e
  }));

  const cooperativasOptions = cooperativas.map(c => ({
    label: `${c.nomeEntidade} - ${c.nif}`,
    value: c.id.toString(),
    entidade: c
  }));

  const associacoesOptions = associacoes.map(a => ({
    label: `${a.nomeEntidade} - ${a.nif}`,
    value: a.id.toString(),
    entidade: a
  }));

  // Funções para gerenciar áreas florestais
  const adicionarAreaFlorestal = () => {
    const novaArea = {
      id: Date.now(),
      nomeArea: '',
      areaHectares: '',
      localizacao: '',
      coordenadasGPS: '',
      tipoFloresta: '',
      observacoes: ''
    };
    setAreasFlorestais([...areasFlorestais, novaArea]);
  };

  const removerAreaFlorestal = (id) => {
    setAreasFlorestais(areasFlorestais.filter(item => item.id !== id));
  };

  const atualizarAreaFlorestal = (id, campo, valor) => {
    setAreasFlorestais(areasFlorestais.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  // Funções para gerenciar espécies autorizadas
  const adicionarEspecieAutorizada = () => {
    const novaEspecie = {
      id: Date.now(),
      especie: '',
      nomeComum: '',
      nomeCientifico: '',
      volumeAutorizado: '',
      unidade: 'm³',
      observacoes: ''
    };
    setEspeciesAutorizadas([...especiesAutorizadas, novaEspecie]);
  };

  const removerEspecieAutorizada = (id) => {
    setEspeciesAutorizadas(especiesAutorizadas.filter(item => item.id !== id));
  };

  const atualizarEspecieAutorizada = (id, campo, valor) => {
    setEspeciesAutorizadas(especiesAutorizadas.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  // Funções para gerenciar histórico de exploração
  const adicionarHistoricoExploracao = () => {
    const novoHistorico = {
      id: Date.now(),
      ano: new Date().getFullYear(),
      especie: '',
      volumeExplorado: '',
      areaExplorada: '',
      observacoes: ''
    };
    setHistoricoExploracoes([...historicoExploracoes, novoHistorico]);
  };

  const removerHistoricoExploracao = (id) => {
    setHistoricoExploracoes(historicoExploracoes.filter(item => item.id !== id));
  };

  const atualizarHistoricoExploracao = (id, campo, valor) => {
    setHistoricoExploracoes(historicoExploracoes.map(item =>
      item.id === id ? { ...item, [campo]: valor } : item
    ));
  };

  // Função para calcular o total da fatura
  const calcularTotalFatura = () => {
    if (!Array.isArray(formData.tiposLicenca)) return 0;
    
    return formData.tiposLicenca.reduce((total, tipoLicenca) => {
      // Se tipoLicenca é um objeto, pegar o value, senão usar direto
      const tipoValue = typeof tipoLicenca === 'object' ? tipoLicenca.value : tipoLicenca;
      const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
      console.log('Calculando fatura - Tipo:', tipoValue, 'Licença encontrada:', licenca);
      return total + (licenca ? licenca.preco : 0);
    }, 0);
  };

  // Função para gerar fatura
  const gerarFatura = () => {
    const total = calcularTotalFatura();
    const dadosFatura = {
      numeroProcesso: formData.numeroProcesso,
      nomeEntidade: tipoSelecionado === 'produtor' ? formData.nomeCompleto : formData.nomeEntidade,
      tipoEntidade: tipoSelecionado,
      tiposLicenca: formData.tiposLicenca,
      valorTotal: total,
      dataEmissao: new Date().toLocaleDateString('pt-BR')
    };

    console.log('Gerando fatura:', dadosFatura);
    showToast('success', 'Fatura Gerada', `Fatura de ${total.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })} gerada com sucesso!`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  const renderStepContent = (index) => {
    switch (index) {
      case 0: // Tipo de Entidade
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Search className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Selecionar Tipo de Entidade</h3>
              </div>
              <p className="text-gray-600">
                Selecione o tipo de entidade que receberá o certificado florestal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <button
                  className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
                    tipoSelecionado === 'produtor'
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                  onClick={() => setTipoSelecionado('produtor')}
                >
                  <User size={32} className="mx-auto mb-3" />
                  <h4 className="font-semibold">Produtor Florestal</h4>
                </button>

                <button
                  className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
                    tipoSelecionado === 'empresa'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => setTipoSelecionado('empresa')}
                >
                  <Factory size={32} className="mx-auto mb-3" />
                  <h4 className="font-semibold">Empresa</h4>
                </button>

                <button
                  className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
                    tipoSelecionado === 'cooperativa'
                      ? 'border-purple-500 bg-purple-50 text-purple-700'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                  onClick={() => setTipoSelecionado('cooperativa')}
                >
                  <UsersIcon size={32} className="mx-auto mb-3" />
                  <h4 className="font-semibold">Cooperativa</h4>
                </button>

                <button
                  className={`p-6 rounded-xl border-2 transition-all text-center hover:shadow-lg ${
                    tipoSelecionado === 'associacao'
                      ? 'border-amber-500 bg-amber-50 text-amber-700'
                      : 'border-gray-200 hover:border-amber-300'
                  }`}
                  onClick={() => setTipoSelecionado('associacao')}
                >
                  <Building2 size={32} className="mx-auto mb-3" />
                  <h4 className="font-semibold">Associação</h4>
                </button>
              </div>

              {tipoSelecionado && (
                <div className="border-t pt-6">
                  {tipoSelecionado === 'produtor' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Selecionar Produtor Florestal</h4>
                      {loadingProdutores ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader className="animate-spin w-6 h-6 text-green-600 mr-2" />
                          <span>Carregando produtores...</span>
                        </div>
                      ) : (
                        <CustomInput
                          type="select"
                          label="Produtor Florestal"
                          value=""
                          options={produtoresOptions}
                          onChange={buscarProdutor}
                          placeholder="Selecione um produtor"
                          iconStart={<User size={18} />}
                        />
                      )}
                    </div>
                  )}

                  {tipoSelecionado === 'empresa' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Selecionar Empresa</h4>
                      {loadingEntidades ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader className="animate-spin w-6 h-6 text-blue-600 mr-2" />
                          <span>Carregando empresas...</span>
                        </div>
                      ) : (
                        <CustomInput
                          type="select"
                          label="Empresa Florestal"
                          value=""
                          options={empresasOptions}
                          onChange={(value) => {
                            const empresa = empresasOptions.find(opt => opt.value === value.value);
                            selecionarEntidade('empresa', empresa?.entidade);
                          }}
                          placeholder="Selecione uma empresa"
                          iconStart={<Factory size={18} />}
                        />
                      )}
                    </div>
                  )}

                  {tipoSelecionado === 'cooperativa' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Selecionar Cooperativa</h4>
                      {loadingEntidades ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader className="animate-spin w-6 h-6 text-purple-600 mr-2" />
                          <span>Carregando cooperativas...</span>
                        </div>
                      ) : (
                        <CustomInput
                          type="select"
                          label="Cooperativa Florestal"
                          value=""
                          options={cooperativasOptions}
                          onChange={(value) => {
                            const cooperativa = cooperativasOptions.find(opt => opt.value === value.value);
                            selecionarEntidade('cooperativa', cooperativa?.entidade);
                          }}
                          placeholder="Selecione uma cooperativa"
                          iconStart={<UsersIcon size={18} />}
                        />
                      )}
                    </div>
                  )}

                  {tipoSelecionado === 'associacao' && (
                    <div>
                      <h4 className="text-lg font-semibold mb-4">Selecionar Associação</h4>
                      {loadingEntidades ? (
                        <div className="flex items-center justify-center py-8">
                          <Loader className="animate-spin w-6 h-6 text-amber-600 mr-2" />
                          <span>Carregando associações...</span>
                        </div>
                      ) : (
                        <CustomInput
                          type="select"
                          label="Associação Florestal"
                          value=""
                          options={associacoesOptions}
                          onChange={(value) => {
                            const associacao = associacoesOptions.find(opt => opt.value === value.value);
                            selecionarEntidade('associacao', associacao?.entidade);
                          }}
                          placeholder="Selecione uma associação"
                          iconStart={<Building2 size={18} />}
                        />
                      )}
                    </div>
                  )}

                  {(produtorSelecionado || entidadeSelecionada) && (
                    <div className="mt-6 p-6 bg-green-50 rounded-xl border border-green-200">
                      <div className="flex items-center mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                        <h5 className="font-semibold text-green-800">
                          {tipoSelecionado === 'produtor' ? 'Produtor Selecionado' : 'Entidade Selecionada'}
                        </h5>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div><strong>Nome:</strong> {
                          tipoSelecionado === 'produtor' 
                            ? produtorSelecionado?.nome_do_Produtor
                            : entidadeSelecionada?.nomeEntidade
                        }</div>
                        <div><strong>Identificação:</strong> {
                          tipoSelecionado === 'produtor'
                            ? produtorSelecionado?.bI_NIF
                            : entidadeSelecionada?.nif
                        }</div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );

      case 1: // Dados Pessoais (apenas para produtores)
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-6 mb-8 border border-purple-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <User className="w-6 h-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {tipoSelecionado === 'produtor' ? 'Dados Pessoais do Produtor' : 'Representante Legal'}
                </h3>
              </div>
              <p className="text-gray-600">
                {tipoSelecionado === 'produtor' 
                  ? 'Complete ou verifique as informações pessoais do produtor florestal.'
                  : 'Dados do representante legal da entidade.'
                }
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <CustomInput
                  type="text"
                  label="Nome Completo"
                  value={formData.nomeCompleto}
                  onChange={(value) => handleInputChange('nomeCompleto', value)}
                  required
                  errorMessage={errors.nomeCompleto}
                  disabled={produtorSelecionado !== null}
                  placeholder="Digite o nome completo"
                  iconStart={<User size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Nº do Bilhete de Identidade"
                  value={formData.bi}
                  onChange={(value) => handleInputChange('bi', value)}
                  required
                  errorMessage={errors.bi}
                  disabled={produtorSelecionado !== null}
                  placeholder="Digite o número do BI"
                  iconStart={<CreditCard size={18} />}
                />

                <CustomInput
                  type="tel"
                  label="Contacto Telefónico"
                  value={formData.telefone}
                  onChange={(value) => handleInputChange('telefone', value)}
                  required
                  errorMessage={errors.telefone}
                  placeholder="Ex: 923456789"
                  iconStart={<Phone size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Província"
                  value={formData.provincia ? { label: formData.provincia, value: formData.provincia } : null}
                  options={provinciasData.map(provincia => ({
                    label: provincia.nome,
                    value: provincia.nome
                  }))}
                  onChange={(value) => handleProvinciaChange(value)}
                  required
                  errorMessage={errors.provincia}
                  placeholder="Selecione a província"
                  iconStart={<MapPin size={18} />}
                />

                <CustomInput
                  type="select"
                  label="Município"
                  value={formData.municipio ? { label: formData.municipio, value: formData.municipio } : null}
                  options={municipiosOptions}
                  onChange={(value) => handleInputChange('municipio', typeof value === 'object' ? value.value : value)}
                  required
                  errorMessage={errors.municipio}
                  disabled={!formData.provincia}
                  placeholder="Selecione o município"
                  iconStart={<Map size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Comuna"
                  value={formData.comuna}
                  onChange={(value) => handleInputChange('comuna', value)}
                  placeholder="Digite a comuna"
                  iconStart={<Building size={18} />}
                />
              </div>
            </div>
          </div>
        );

      case 2: // Dados da Entidade (apenas se não for produtor individual)
        if (tipoSelecionado === 'produtor') {
          return (
            <div className="w-full mx-auto">
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Info className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Dados da Licença</h3>
                </div>
                <p className="text-gray-600">
                  Configure os tipos de licença florestal para o produtor individual.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <CustomInput
                  type="multiselect"
                  label="Tipos de Licença Florestal"
                  value={formData.tiposLicenca}
                  options={tiposLicencaOptions}
                  onChange={(value) => handleInputChange('tiposLicenca', value)}
                  placeholder="Selecione os tipos de licença"
                  iconStart={<Award size={18} />}
                />

                {formData.tiposLicenca && formData.tiposLicenca.length > 0 && (
                  <div className="mt-6 p-4 bg-green-50 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-4">Resumo dos Custos</h5>
                    <div className="space-y-2">
                      {formData.tiposLicenca.map(tipo => {
                        const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
                        const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
                        return licenca ? (
                          <div key={tipoValue} className="flex justify-between text-sm">
                            <span>{licenca.label}</span>
                            <span className="font-medium">{licenca.preco.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                          </div>
                        ) : null;
                      })}
                      <div className="border-t pt-2 flex justify-between font-bold">
                        <span>Total</span>
                        <span>{calcularTotalFatura().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        }

        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 mb-8 border border-blue-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Building className="w-6 h-6 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Dados da Entidade</h3>
              </div>
              <p className="text-gray-600">
                Informações sobre a entidade e tipos de licença florestal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <CustomInput
                  type="text"
                  label="Nome da Entidade"
                  value={formData.nomeEntidade}
                  onChange={(value) => handleInputChange('nomeEntidade', value)}
                  required
                  errorMessage={errors.nomeEntidade}
                  disabled={entidadeSelecionada !== null}
                  placeholder="Nome da entidade"
                  iconStart={<Building size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Número da Licença de Exploração"
                  value={formData.numeroLicencaExploracao}
                  onChange={(value) => handleInputChange('numeroLicencaExploracao', value)}
                  placeholder="Ex: DNF/2025/001"
                  iconStart={<FileText size={18} />}
                />

                <div className="md:col-span-2">
                  <CustomInput
                    type="multiselect"
                    label="Tipos de Licença Florestal"
                    value={formData.tiposLicenca}
                    options={tiposLicencaOptions}
                    onChange={(value) => handleInputChange('tiposLicenca', value)}
                    placeholder="Selecione os tipos de licença"
                    iconStart={<Award size={18} />}
                  />
                </div>

                <CustomInput
                  type="number"
                  label="Área Total da Floresta (hectares)"
                  value={formData.areaFlorestaTotalHa}
                  onChange={(value) => handleInputChange('areaFlorestaTotalHa', value)}
                  placeholder="0.0"
                  iconStart={<Mountain size={18} />}
                />

                <CustomInput
                  type="text"
                  label="Coordenadas GPS Gerais"
                  value={formData.coordenadasGPS}
                  onChange={(value) => handleInputChange('coordenadasGPS', value)}
                  placeholder="Ex: -8.838333, 13.234444"
                  iconStart={<MapPin size={18} />}
                  helperText="Formato: latitude, longitude"
                />
              </div>

              {formData.tiposLicenca && formData.tiposLicenca.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-4">Resumo dos Custos</h5>
                  <div className="space-y-2">
                    {formData.tiposLicenca.map(tipo => {
                      const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
                      const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
                      return licenca ? (
                        <div key={tipoValue} className="flex justify-between text-sm">
                          <span>{licenca.label}</span>
                          <span className="font-medium">{licenca.preco.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="border-t pt-2 flex justify-between font-bold">
                      <span>Total</span>
                      <span>{calcularTotalFatura().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 3: // Áreas Florestais
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Trees className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Áreas Florestais</h3>
              </div>
              <p className="text-gray-600">
                Registre as áreas florestais sob licença de exploração.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Áreas Florestais Licenciadas</h4>
                <button
                  onClick={adicionarAreaFlorestal}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Área
                </button>
              </div>

              {areasFlorestais.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Nome/ID da Área</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Área (ha)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Localização</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Coordenadas GPS</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Tipo de Floresta</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {areasFlorestais.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.nomeArea}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'nomeArea', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Nome da área..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.areaHectares}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'areaHectares', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.localizacao}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'localizacao', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Prov.-Munic.-Comuna"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.coordenadasGPS}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'coordenadasGPS', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="-8.838, 13.234"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.tipoFloresta}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'tipoFloresta', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="NATIVA">Floresta Nativa</option>
                              <option value="PLANTADA">Floresta Plantada</option>
                              <option value="MISTA">Floresta Mista</option>
                              <option value="REGENERACAO">Em Regeneração</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarAreaFlorestal(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="2"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerAreaFlorestal(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover área"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Trees size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma área florestal registrada</p>
                  <p className="text-sm">Clique em "Adicionar Área" para começar</p>
                </div>
              )}
            </div>
          </div>
        );

      case 4: // Espécies Autorizadas
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-6 mb-8 border border-amber-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Mountain className="w-6 h-6 text-amber-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Espécies Autorizadas para Exploração</h3>
              </div>
              <p className="text-gray-600">
                Registre as espécies florestais autorizadas e seus volumes permitidos.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Espécies Florestais Autorizadas</h4>
                <button
                  onClick={adicionarEspecieAutorizada}
                  className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Espécie
                </button>
              </div>

              {especiesAutorizadas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Nome Comum</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Nome Científico</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Volume Autorizado</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Unidade</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {especiesAutorizadas.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.especie}
                              onChange={(e) => atualizarEspecieAutorizada(item.id, 'especie', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="MAFUMEIRA">Mafumeira</option>
                              <option value="MULEMBA">Mulemba</option>
                              <option value="EUCALIPTO">Eucalipto</option>
                              <option value="ACACIA">Acácia</option>
                              <option value="PINUS">Pinus</option>
                              <option value="EMBONDEIRO">Embondeiro</option>
                              <option value="OUTROS">Outros</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="text"
                              value={item.nomeCientifico}
                              onChange={(e) => atualizarEspecieAutorizada(item.id, 'nomeCientifico', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              placeholder="Nome científico..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.volumeAutorizado}
                              onChange={(e) => atualizarEspecieAutorizada(item.id, 'volumeAutorizado', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.unidade}
                              onChange={(e) => atualizarEspecieAutorizada(item.id, 'unidade', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="m³">m³</option>
                              <option value="ton">Toneladas</option>
                              <option value="kg">Quilogramas</option>
                              <option value="unidades">Unidades</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarEspecieAutorizada(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="2"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerEspecieAutorizada(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover espécie"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Mountain size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhuma espécie autorizada registrada</p>
                  <p className="text-sm">Clique em "Adicionar Espécie" para começar</p>
                </div>
              )}
            </div>
          </div>
        );

      case 5: // Histórico de Exploração
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-cyan-50 to-blue-50 rounded-2xl p-6 mb-8 border border-cyan-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-cyan-100 rounded-lg">
                  <Activity className="w-6 h-6 text-cyan-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Histórico de Exploração Florestal</h3>
              </div>
              <p className="text-gray-600">
                Registre o histórico de exploração florestal dos últimos anos (opcional).
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-lg font-semibold text-gray-800">Histórico de Exploração</h4>
                <button
                  onClick={adicionarHistoricoExploracao}
                  className="bg-cyan-600 text-white px-4 py-2 rounded-lg hover:bg-cyan-700 transition-colors flex items-center"
                >
                  <Plus size={18} className="mr-2" />
                  Adicionar Registro
                </button>
              </div>

              {historicoExploracoes.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="border border-gray-300 p-3 text-left font-semibold">Ano</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Espécie Explorada</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Volume Explorado</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Área Explorada (ha)</th>
                        <th className="border border-gray-300 p-3 text-left font-semibold">Observações</th>
                        <th className="border border-gray-300 p-3 text-center font-semibold">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {historicoExploracoes.map((item, index) => (
                        <tr key={item.id} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.ano}
                              onChange={(e) => atualizarHistoricoExploracao(item.id, 'ano', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              min="2000"
                              max="2030"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <select
                              value={item.especie}
                              onChange={(e) => atualizarHistoricoExploracao(item.id, 'especie', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                            >
                              <option value="">Selecione...</option>
                              <option value="MAFUMEIRA">Mafumeira</option>
                              <option value="MULEMBA">Mulemba</option>
                              <option value="EUCALIPTO">Eucalipto</option>
                              <option value="ACACIA">Acácia</option>
                              <option value="PINUS">Pinus</option>
                              <option value="EMBONDEIRO">Embondeiro</option>
                              <option value="OUTROS">Outros</option>
                            </select>
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.volumeExplorado}
                              onChange={(e) => atualizarHistoricoExploracao(item.id, 'volumeExplorado', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <input
                              type="number"
                              value={item.areaExplorada}
                              onChange={(e) => atualizarHistoricoExploracao(item.id, 'areaExplorada', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm"
                              step="0.1"
                              min="0"
                              placeholder="0.0"
                            />
                          </td>
                          <td className="border border-gray-300 p-2">
                            <textarea
                              value={item.observacoes}
                              onChange={(e) => atualizarHistoricoExploracao(item.id, 'observacoes', e.target.value)}
                              className="w-full p-2 border border-gray-200 rounded text-sm resize-none"
                              rows="2"
                              placeholder="Observações..."
                            />
                          </td>
                          <td className="border border-gray-300 p-2 text-center">
                            <button
                              onClick={() => removerHistoricoExploracao(item.id)}
                              className="text-red-600 hover:text-red-800 transition-colors"
                              title="Remover registro"
                            >
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  <Activity size={48} className="mx-auto mb-4 text-gray-300" />
                  <p className="text-lg font-medium">Nenhum histórico de exploração registrado</p>
                  <p className="text-sm">Clique em "Adicionar Registro" para começar (opcional)</p>
                </div>
              )}
            </div>
          </div>
        );

      case 6: // Upload de Documentos
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl p-6 mb-8 border border-indigo-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Upload className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Upload de Documentos</h3>
              </div>
              <p className="text-gray-600">
                Carregue os documentos necessários para a emissão do certificado florestal.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 p-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-6">Documentos Necessários</h4>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {documentosNecessarios.map((documento, index) => (
                  <div key={index} className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-start mb-3">
                      <FileText size={20} className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
                      <span className="text-sm font-medium leading-tight">{documento}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <input
                        type="file"
                        id={`doc-${index}`}
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            setDocumentosUpload(prev => {
                              const exists = prev.find(d => d.documento === documento);
                              if (exists) {
                                return prev.map(d => d.documento === documento ? { documento, arquivo: file.name } : d);
                              } else {
                                return [...prev, { documento, arquivo: file.name }];
                              }
                            });
                            showToast('success', 'Documento Carregado', `${documento} carregado com sucesso!`);
                          }
                        }}
                      />
                      <label
                        htmlFor={`doc-${index}`}
                        className="cursor-pointer bg-indigo-600 text-white px-3 py-2 rounded text-sm hover:bg-indigo-700 transition-colors flex items-center"
                      >
                        <Upload size={16} className="mr-1" />
                        Upload
                      </label>
                      {documentosUpload.find(d => d.documento === documento) && (
                        <CheckCircle size={20} className="text-green-600 ml-2" />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {documentosUpload.length > 0 && (
                <div className="mt-6 p-4 bg-green-50 rounded-lg">
                  <h5 className="font-semibold text-green-800 mb-2">Documentos Carregados ({documentosUpload.length})</h5>
                  <div className="space-y-1">
                    {documentosUpload.map((doc, index) => (
                      <div key={index} className="flex items-center text-sm text-green-700">
                        <CheckCircle size={16} className="mr-2" />
                        <span>{doc.documento} - {doc.arquivo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );

      case 7: // Licença Florestal
        return (
          <div className="w-full mx-auto">
            <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-2xl p-6 mb-8 border border-green-100">
              <div className="flex items-center space-x-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Award className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">Certificado de Licença Florestal</h3>
              </div>
              <p className="text-gray-600">
                Complete as informações finais e gere a fatura para emissão do certificado.
              </p>
            </div>

            <div className="space-y-6">
              {/* Período de Validade */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Período de Validade da Licença</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="date"
                    label="Válida de"
                    value={formData.validadeInicio}
                    onChange={(value) => handleInputChange('validadeInicio', value)}
                    required
                    iconStart={<Calendar size={18} />}
                  />
                  <CustomInput
                    type="date"
                    label="Válida até"
                    value={formData.validadeFim}
                    onChange={(value) => handleInputChange('validadeFim', value)}
                    required
                    iconStart={<Calendar size={18} />}
                  />
                </div>
              </div>

              {/* Informações Técnicas */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h4 className="text-lg font-semibold text-gray-800 mb-4">Informações do Emissor (DNF)</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <CustomInput
                    type="text"
                    label="Nome do Técnico Responsável"
                    value={formData.tecnicoResponsavel}
                    onChange={(value) => handleInputChange('tecnicoResponsavel', value)}
                    required
                    placeholder="Nome do técnico da DNF"
                    iconStart={<User size={18} />}
                  />

                  <CustomInput
                    type="text"
                    label="Cargo"
                    value={formData.cargoTecnico}
                    onChange={(value) => handleInputChange('cargoTecnico', value)}
                    required
                    placeholder="Ex: Técnico Florestal Superior"
                    iconStart={<Award size={18} />}
                  />
                </div>

                <div className="mt-4">
                  <CustomInput
                    type="textarea"
                    label="Condições Especiais"
                    value={formData.condicoesEspeciais}
                    onChange={(value) => handleInputChange('condicoesEspeciais', value)}
                    placeholder="Condições especiais ou restrições da licença..."
                    rows={3}
                  />
                </div>

                <div className="mt-4">
                  <CustomInput
                    type="textarea"
                    label="Observações"
                    value={formData.observacoes}
                    onChange={(value) => handleInputChange('observacoes', value)}
                    placeholder="Observações adicionais sobre a licença..."
                    rows={3}
                  />
                </div>
              </div>

              {/* Fatura */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg font-semibold text-gray-800">Fatura de Licenciamento</h4>
                  <button
                    onClick={gerarFatura}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center"
                  >
                    <Banknote size={18} className="mr-2" />
                    Gerar Fatura
                  </button>
                </div>

                {formData.tiposLicenca && formData.tiposLicenca.length > 0 && (
                  <div className="border-2 border-gray-300 rounded-lg p-6">
                    <div className="text-center mb-4 border-b pb-4">
                      <h5 className="font-bold text-lg">FATURA DE LICENCIAMENTO FLORESTAL</h5>
                      <p className="text-sm text-gray-600">Processo Nº: {formData.numeroProcesso}</p>
                      <p className="text-sm text-gray-600">
                        {tipoSelecionado === 'produtor' ? formData.nomeCompleto : formData.nomeEntidade}
                      </p>
                    </div>

                    <div className="space-y-2 mb-4">
                      {formData.tiposLicenca.map(tipo => {
                        const tipoValue = typeof tipo === 'object' ? tipo.value : tipo;
                        const licenca = tiposLicencaOptions.find(opt => opt.value === tipoValue);
                        return licenca ? (
                          <div key={tipoValue} className="flex justify-between">
                            <span>{licenca.label}</span>
                            <span className="font-medium">{licenca.preco.toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                          </div>
                        ) : null;
                      })}
                    </div>

                    <div className="border-t pt-4 flex justify-between font-bold text-lg">
                      <span>Total a Pagar</span>
                      <span className="text-green-600">{calcularTotalFatura().toLocaleString('pt-AO', { style: 'currency', currency: 'AOA' })}</span>
                    </div>

                    <div className="mt-4 text-center">
                      <button
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center mx-auto"
                      >
                        <Download size={18} className="mr-2" />
                        Baixar Fatura
                      </button>
                    </div>
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

   const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!validateCurrentStep()) {
        setLoading(false);
        showToast('error', 'Validação', 'Por favor, corrija os erros antes de gerar o certificado.');
        return;
      }

      // Importar a função de geração de certificado florestal
      const { gerarCertificadoFlorestal } = await import('../pages/public/CertificadoFlorestalGenerator');

      const dadosCertificado = {
        dadosProdutor: {
          ...formData,
          provincia: getDisplayValue(formData.provincia),
          municipio: getDisplayValue(formData.municipio),
          tipoLicenca: getDisplayValue(formData.tipoLicenca),
          numeroProcesso: formData.numeroProcesso || `CERT-FLORESTAL-${Date.now()}`,
        },
        areasFlorestais,
        especiesAutorizadas,
        historicoExploracoes,
        produtorOriginal: produtorSelecionado
      };

      console.log("📄 Gerando certificado florestal com dados:", dadosCertificado);

      const resultado = await gerarCertificadoFlorestal(dadosCertificado);

      console.log("✅ Certificado florestal gerado:", resultado);

      setLoading(false);
      showToast('success', 'Sucesso', 'Certificado de Licença Florestal gerado com sucesso!');

    } catch (error) {
      setLoading(false);
      console.error('Erro ao gerar certificado florestal:', error);
      showToast('error', 'Erro', `Erro ao gerar certificado: ${error.message}`);
    }
  };

  const isLastStep = activeIndex === steps.length - 1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Toast Message */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transition-all ${toastMessage.severity === 'success' ? 'bg-green-100 border-l-4 border-green-500 text-green-700' :
          toastMessage.severity === 'error' ? 'bg-red-100 border-l-4 border-red-500 text-red-700' :
            toastMessage.severity === 'warn' ? 'bg-blue-100 border-l-4 border-blue-500 text-blue-700' :
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
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          {/* Header */}
          <div className="text-center mb-6 p-8 border-b border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50">
            <h1 className="text-4xl font-bold mb-3 text-gray-800">Certificação de Licença Florestal</h1>
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
                  <div className={`flex items-center justify-center w-14 h-14 rounded-full mb-3 transition-colors ${index < activeIndex ? 'bg-green-500 text-white' :
                    index === activeIndex ? 'bg-green-600 text-white' :
                      'bg-gray-200 text-gray-500'
                    }`}>
                    {index < activeIndex ? (
                      <Check size={24} />
                    ) : (
                      <StepIcon size={24} />
                    )}
                  </div>
                  <span className={`text-sm text-center font-medium ${index === activeIndex ? 'text-green-700' : 'text-gray-500'
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
              className={`px-8 py-3 rounded-xl border border-gray-300 flex items-center transition-all font-medium ${activeIndex === 0 ? 'opacity-50 cursor-not-allowed bg-gray-100' :
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
              className={`px-8 py-3 rounded-xl flex items-center transition-all font-medium ${isLastStep
                ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                : 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                }`}
              disabled={loading}
              onClick={(e) => {
                e.preventDefault();
                if (!isLastStep) {
                  if (validateCurrentStep()) {
                    setTimeout(() => {
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }, 100);
                    setActiveIndex(prev => prev + 1);
                  } else {
                    showToast('error', 'Validação', 'Por favor, corrija os erros antes de continuar.');
                  }
                } else {
                  if (validateCurrentStep()) {
                    handleSubmit(e);
                  } else {
                    showToast('error', 'Validação', 'Por favor, corrija os erros antes de gerar o certificado.');
                  }
                }
              }}
            >
              {loading ? (
                <>
                  <Loader size={20} className="animate-spin mr-2" />
                  Gerando Certificado...
                </>
              ) : isLastStep ? (
                <>
                  <Award size={20} className="mr-2" />
                  Gerar Certificado Florestal
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

export default CertificacaoProdutorFlorestal;